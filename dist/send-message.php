<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');
// Nie ujawniaj technicznych błędów hostingu osobie wypełniającej formularz.
ini_set('display_errors', '0');
ob_start();
register_shutdown_function(static function (): void {
    $lastError = error_get_last();
    if ($lastError === null || !in_array($lastError['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) return;
    while (ob_get_level() > 0) ob_end_clean();
    if (!headers_sent()) {
        http_response_code(502);
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store, max-age=0');
    }
    echo json_encode(['ok' => false, 'message' => 'Nie udało się wysłać wiadomości. Spróbuj ponownie lub zadzwoń.']);
});

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Niedozwolona metoda.']);
    exit;
}

function clean(string $value, int $limit): string {
    $value = trim(preg_replace('/[\r\n]+/', ' ', $value) ?? '');
    return function_exists('mb_substr') ? mb_substr($value, 0, $limit) : substr($value, 0, $limit);
}

function reply(int $status, string $message): void {
    http_response_code($status);
    echo json_encode(['ok' => false, 'message' => $message]);
    exit;
}

/**
 * Klucz Turnstile pozostaje poza katalogiem public_html. Plik konfiguracyjny
 * ma zwracać wyłącznie łańcuch z tajnym kluczem.
 */
function turnstileSecret(): string {
    $home = dirname(__DIR__);
    // JDM ogranicza PHP do public_html; katalog private-config blokuje .htaccess.
    $textConfig = __DIR__ . DIRECTORY_SEPARATOR . 'private-config' . DIRECTORY_SEPARATOR . 'turnstile-secret.txt';
    if (@is_file($textConfig)) {
        $secret = @file_get_contents($textConfig);
        if (is_string($secret) && trim($secret) !== '' && !str_contains($secret, 'WKLEJ_TUTAJ')) return trim($secret);
    }

    $locations = [
        __DIR__ . DIRECTORY_SEPARATOR . 'private-config' . DIRECTORY_SEPARATOR . 'turnstile.php',
        $home . DIRECTORY_SEPARATOR . '.turnstile.php',
        $home . DIRECTORY_SEPARATOR . 'turnstile.php',
        $home . DIRECTORY_SEPARATOR . 'turnstile.php.template',
    ];
    foreach ($locations as $config) {
        if (!@is_file($config)) continue;
        try {
            $secret = require $config;
        } catch (Throwable) {
            continue;
        }
        if (is_string($secret) && trim($secret) !== '') return trim($secret);
    }
    return '';
}

function verifyTurnstile(string $token): array {
    $secret = turnstileSecret();
    if ($secret === '') return [false, 'Serwer nie odczytuje konfiguracji ochrony antyspamowej.'];
    if ($token === '') return [false, 'Potwierdź ochronę antyspamową i spróbuj ponownie.'];

    $payload = http_build_query([
        'secret' => $secret,
        'response' => $token,
        'remoteip' => (string) ($_SERVER['REMOTE_ADDR'] ?? ''),
    ]);
    $response = false;

    if (function_exists('curl_init')) {
        $curl = curl_init('https://challenges.cloudflare.com/turnstile/v0/siteverify');
        if ($curl !== false) {
            curl_setopt_array($curl, [
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => $payload,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT => 8,
                CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
            ]);
            $response = curl_exec($curl);
            curl_close($curl);
        }
    }

    if ($response === false && filter_var(ini_get('allow_url_fopen'), FILTER_VALIDATE_BOOLEAN)) {
        $context = stream_context_create(['http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => $payload,
            'timeout' => 8,
        ]]);
        $response = @file_get_contents('https://challenges.cloudflare.com/turnstile/v0/siteverify', false, $context);
    }

    if (!is_string($response)) {
        return [false, 'Serwer nie może połączyć się z ochroną antyspamową. Spróbuj ponownie za chwilę.'];
    }

    $result = json_decode($response, true);
    if (!is_array($result)) {
        return [false, 'Serwer otrzymał nieprawidłową odpowiedź ochrony antyspamowej.'];
    }
    if (($result['success'] ?? false) === true) return [true, ''];

    $errors = $result['error-codes'] ?? [];
    if (in_array('invalid-input-secret', $errors, true) || in_array('missing-input-secret', $errors, true)) {
        return [false, 'Klucz ochrony antyspamowej na serwerze jest nieprawidłowy.'];
    }
    if (in_array('timeout-or-duplicate', $errors, true)) {
        return [false, 'Potwierdzenie ochrony wygasło. Odśwież stronę i spróbuj ponownie.'];
    }
    return [false, 'Potwierdzenie ochrony antyspamowej nie zostało zaakceptowane. Odśwież stronę i spróbuj ponownie.'];
}

/** Dane SMTP są poza kodem strony, w chronionym katalogu private-config. */
function smtpCredentials(): array {
    $config = __DIR__ . DIRECTORY_SEPARATOR . 'private-config' . DIRECTORY_SEPARATOR . 'smtp-password.txt';
    if (!@is_file($config)) return ['', ''];
    $password = @file_get_contents($config);
    if (!is_string($password) || trim($password) === '' || str_contains($password, 'WKLEJ_TUTAJ')) return ['', ''];
    return ['kontakt@skupsrebragorzow.pl', trim($password)];
}

function smtpExpect($socket, array $codes): bool {
    $line = '';
    while (!feof($socket)) {
        $part = fgets($socket, 515);
        if ($part === false) break;
        $line = $part;
        if (strlen($part) < 4 || $part[3] !== '-') break;
    }
    $code = (int) substr($line, 0, 3);
    return in_array($code, $codes, true);
}

function smtpCommand($socket, string $command, array $codes): bool {
    if (fwrite($socket, $command . "\r\n") === false) return false;
    return smtpExpect($socket, $codes);
}

function sendViaSmtp(string $from, string $password, string $to, string $replyTo, string $subject, string $body): bool {
    if (!function_exists('stream_socket_client') || !function_exists('stream_socket_enable_crypto')) return false;
    $socket = @stream_socket_client('tcp://smtp.jdm.pl:587', $number, $error, 12);
    if ($socket === false) return false;
    stream_set_timeout($socket, 12);
    $ok = smtpExpect($socket, [220])
        && smtpCommand($socket, 'EHLO skupsrebragorzow.pl', [250])
        && smtpCommand($socket, 'STARTTLS', [220])
        && @stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)
        && smtpCommand($socket, 'EHLO skupsrebragorzow.pl', [250])
        && smtpCommand($socket, 'AUTH LOGIN', [334])
        && smtpCommand($socket, base64_encode($from), [334])
        && smtpCommand($socket, base64_encode($password), [235])
        && smtpCommand($socket, 'MAIL FROM:<' . $from . '>', [250])
        && smtpCommand($socket, 'RCPT TO:<' . $to . '>', [250, 251])
        && smtpCommand($socket, 'DATA', [354]);
    if ($ok) {
        $headers = [
            'From: Skup Srebra Gorzów <' . $from . '>',
            'Reply-To: ' . $replyTo,
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
            'Subject: =?UTF-8?B?' . base64_encode($subject) . '?=',
        ];
        $payload = implode("\r\n", $headers) . "\r\n\r\n" . str_replace("\n.", "\n..", $body) . "\r\n.";
        $ok = smtpCommand($socket, $payload, [250]);
    }
    @smtpCommand($socket, 'QUIT', [221]);
    fclose($socket);
    return $ok;
}

/**
 * Ogranicza masowe wysyłki z jednego adresu bez zapisywania adresu IP.
 * Plik zawiera jedynie nieodwracalny skrót i jest automatycznie nadpisywany
 * po upływie okna czasowego.
 */
function passesRateLimit(): bool {
    $ip = (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
    $path = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR)
        . DIRECTORY_SEPARATOR . 'skup-srebra-contact-' . hash('sha256', $ip) . '.json';
    $handle = @fopen($path, 'c+');
    if ($handle === false) return true; // Nie blokuj prawidłowej wiadomości, gdy hosting nie udostępnia katalogu tymczasowego.

    try {
        if (!flock($handle, LOCK_EX)) return true;
        $raw = stream_get_contents($handle);
        $now = time();
        $timestamps = json_decode($raw ?: '[]', true);
        $timestamps = is_array($timestamps) ? $timestamps : [];
        $timestamps = array_values(array_filter($timestamps, static fn ($item) => is_int($item) && $item > $now - 600));
        if (count($timestamps) >= 3) return false;
        $timestamps[] = $now;
        ftruncate($handle, 0);
        rewind($handle);
        fwrite($handle, json_encode($timestamps));
        return true;
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}

// Ukryte pole: automaty wypełniają je, zwykli użytkownicy go nie widzą.
if (!empty($_POST['company'] ?? '')) {
    reply(400, 'Nie udało się wysłać wiadomości.');
}

// Formularz musi pozostawać otwarty co najmniej 3 sekundy. To zatrzymuje proste automaty.
$formStarted = filter_input(INPUT_POST, 'form_started', FILTER_VALIDATE_INT);
$elapsed = $formStarted === false || $formStarted === null ? 0 : (int) floor(microtime(true) * 1000) - $formStarted;
if ($elapsed < 3000 || $elapsed > 7200000) {
    reply(400, 'Odczekaj chwilę i spróbuj ponownie.');
}

$name = clean((string) ($_POST['name'] ?? ''), 80);
$email = filter_var(trim((string) ($_POST['email'] ?? '')), FILTER_VALIDATE_EMAIL);
$message = trim((string) ($_POST['message'] ?? ''));
$message = function_exists('mb_substr') ? mb_substr($message, 0, 4000) : substr($message, 0, 4000);

if ($name === '' || $email === false || $message === '') {
    reply(422, 'Uzupełnij imię, poprawny e-mail oraz treść wiadomości.');
}

$turnstile = verifyTurnstile((string) ($_POST['cf-turnstile-response'] ?? ''));
if (!$turnstile[0]) {
    reply(400, $turnstile[1]);
}

if (!passesRateLimit()) {
    reply(429, 'Wysłano już kilka wiadomości. Spróbuj ponownie za kilka minut lub zadzwoń.');
}

$recipient = 'kontakt@skupsrebragorzow.pl';
$subject = 'Zapytanie ze strony Skup Srebra Gorzów';
$body = "Nowe zapytanie ze strony www.skupsrebragorzow.pl\n\n"
    . "Imię: {$name}\n"
    . "E-mail: {$email}\n\n"
    . "Wiadomość:\n{$message}\n";
[$smtpUser, $smtpPassword] = smtpCredentials();
if ($smtpUser === '' || $smtpPassword === '') {
    reply(503, 'Poczta formularza jest jeszcze konfigurowana. Zadzwoń lub spróbuj ponownie później.');
}
$sent = false;
try {
    $sent = sendViaSmtp($smtpUser, $smtpPassword, $recipient, (string) $email, $subject, $body);
} catch (Throwable) {
    $sent = false;
}
if (!$sent) {
    reply(502, 'Nie udało się wysłać wiadomości. Spróbuj ponownie lub zadzwoń.');
}

echo json_encode(['ok' => true, 'message' => 'Wiadomość została wysłana. Odpowiemy na podany adres e-mail.']);
