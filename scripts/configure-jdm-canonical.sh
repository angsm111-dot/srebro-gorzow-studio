#!/usr/bin/env bash
# Add canonical redirects only if per-directory Apache rewrite rules work.
set -euo pipefail
: "${SSHPASS:?Missing JDM password}"
ssh_command=(sshpass -e ssh -p 2233 -o StrictHostKeyChecking=accept-new -o ConnectTimeout=20 smxkojwd@web15.jdm.pl)
probe="jdm-rewrite-probe-${GITHUB_RUN_ID:-test}-${GITHUB_RUN_ATTEMPT:-1}"
[[ "$probe" =~ ^jdm-rewrite-probe-[a-zA-Z0-9-]+$ ]] || exit 1
public=/home/smxkojwd/public_html
# Names only: never inspect process arguments, credentials or environment.
"${ssh_command[@]}" 'printf "Web-server tools:\n"; for tool in nginx apache2 httpd unitd caddy; do command -v "$tool" || true; done; printf "Process names:\n"; ps -eo comm | sort -u; if test -f /home/smxkojwd/public_html/.htaccess; then echo "Root .htaccess exists"; else echo "Root .htaccess absent"; fi'

cleanup() { "${ssh_command[@]}" "rm -rf -- '$public/$probe'" || true; }
trap cleanup EXIT
"${ssh_command[@]}" "mkdir -p '$public/$probe'; printf 'probe' > '$public/$probe/probe.txt'; cat > '$public/$probe/.htaccess'" <<'RULES'
RewriteEngine On
RewriteRule ^probe\.txt$ https://www.skupsrebragorzow.pl/?jdm-rewrite-supported=1 [R=302,L]
RULES
probe_status=0
JDM_PROBE="$probe" python3 - <<'PY' || probe_status=$?
import os, urllib.request, urllib.error
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs): return None
try:
    response = urllib.request.build_opener(NoRedirect).open('https://www.skupsrebragorzow.pl/'+os.environ['JDM_PROBE']+'/probe.txt', timeout=25)
except urllib.error.HTTPError as error:
    response = error
print('Rewrite probe:', {'status': response.code, 'location': response.headers.get('Location'), 'server': response.headers.get('Server'), 'content_type': response.headers.get('Content-Type'), 'body': response.read(100).decode('utf-8', errors='replace')})
assert response.code == 302 and response.headers.get('Location') == 'https://www.skupsrebragorzow.pl/?jdm-rewrite-supported=1', 'Per-directory rewrite is not supported or cannot be verified'
PY
if [[ "$probe_status" != 0 ]]; then
  python3 - <<'PY'
import urllib.request, urllib.error, time
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs): return None
opener=urllib.request.build_opener(NoRedirect)
for base in ['http://skupsrebragorzow.pl', 'https://skupsrebragorzow.pl', 'http://www.skupsrebragorzow.pl', 'https://www.skupsrebragorzow.pl']:
    for path in ['/', '/blog.html']:
        url=base+path+'?canonical-diagnostic='+str(time.time_ns())
        try:
            try: response=opener.open(url,timeout=20)
            except urllib.error.HTTPError as error: response=error
            print('Canonical variant:', {'url':base+path,'status':response.code,'location':response.headers.get('Location'),'server':response.headers.get('Server'),'cf_mitigated':response.headers.get('CF-Mitigated')})
        except Exception as error: print('Canonical variant failed:',base+path,str(error))
PY
  echo 'Canonical redirects not installed: hosting did not pass .htaccess capability test. Existing configuration unchanged.'
  exit 0
fi
backup="/home/smxkojwd/.codex-config-backups/htaccess-${GITHUB_RUN_ID:-test}-${GITHUB_RUN_ATTEMPT:-1}"
# Keep backups outside the web root; do not display the existing configuration.
"${ssh_command[@]}" "set -eu; mkdir -p /home/smxkojwd/.codex-config-backups; chmod 700 /home/smxkojwd/.codex-config-backups; if test -f '$public/.htaccess'; then cp -p '$public/.htaccess' '$backup'; else touch '$backup.absent'; fi; if ! grep -q '^# BEGIN JDM CANONICAL CODEX$' '$public/.htaccess' 2>/dev/null; then cat >> '$public/.htaccess'; fi" <<'RULES'

# BEGIN JDM CANONICAL CODEX
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteCond %{HTTP_HOST} ^skupsrebragorzow\.pl$ [NC]
RewriteRule ^ https://www.skupsrebragorzow.pl%{REQUEST_URI} [R=301,L,NE]
RewriteCond %{HTTP_HOST} ^www\.skupsrebragorzow\.pl$ [NC]
RewriteCond %{HTTPS} !=on
RewriteCond %{HTTP:X-Forwarded-Proto} !^https$ [NC]
RewriteCond %{HTTP:CF-Visitor} !https [NC]
RewriteRule ^ https://www.skupsrebragorzow.pl%{REQUEST_URI} [R=301,L,NE]
</IfModule>
# END JDM CANONICAL CODEX
RULES
verify_status=0
python3 - <<'PY' || verify_status=$?
import time, urllib.request, urllib.error
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs): return None
opener=urllib.request.build_opener(NoRedirect)
query='?jdm-canonical-check='+str(time.time_ns())
for base in ['http://skupsrebragorzow.pl','https://skupsrebragorzow.pl','http://www.skupsrebragorzow.pl']:
    url=base+'/blog.html'+query
    try: response=opener.open(url,timeout=25)
    except urllib.error.HTTPError as error: response=error
    assert response.code in (301,308), (url,response.code)
    assert response.headers.get('Location')=='https://www.skupsrebragorzow.pl/blog.html'+query, response.headers.get('Location')
with urllib.request.urlopen('https://www.skupsrebragorzow.pl/blog.html'+query,timeout=25) as response:
    assert response.code==200
print('Canonical redirects verified: all variants, path/query preservation and no HTTPS loop.')
PY
if [[ "$verify_status" != 0 ]]; then
  "${ssh_command[@]}" "if test -f '$backup.absent'; then rm -f '$public/.htaccess'; else cp -p '$backup' '$public/.htaccess'; fi"
  echo 'Canonical redirect verification failed; original .htaccess restored. Redirects require hosting configuration.' >&2
  exit 0
fi
