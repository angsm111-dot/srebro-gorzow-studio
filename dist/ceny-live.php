<?php
// Lokalny mostek dla publicznego cennika. Nie zawiera haseł ani danych panelu.
// Serwer JDM pobiera publiczne ceny, a strona otrzymuje je z własnej domeny.
declare(strict_types=1);

$endpoint = 'https://skup-zlota-gorzow.angsm111.workers.dev/api/prices?site=silver';
$body = false;

if (function_exists('curl_init')) {
    $curl = curl_init($endpoint);
    curl_setopt_array($curl, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_HTTPHEADER => ['Accept: application/json'],
        CURLOPT_USERAGENT => 'SkupSrebraGorzow/1.0',
    ]);
    $body = curl_exec($curl);
    $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
    curl_close($curl);
    if ($status < 200 || $status >= 300) {
        $body = false;
    }
} else {
    $context = stream_context_create(['http' => [
        'timeout' => 10,
        'header' => "Accept: application/json\r\nUser-Agent: SkupSrebraGorzow/1.0\r\n",
    ]]);
    $body = @file_get_contents($endpoint, false, $context);
}

if ($body === false || $body === '') {
    http_response_code(502);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'Cennik jest chwilowo niedostępny.']);
    exit;
}

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');
echo $body;
