"""Read public HTTP indexing signals; never send credentials or change the site."""
import concurrent.futures
import json
from pathlib import Path
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET
root = Path('deployment/jdm-public')
urls = [loc.text for loc in ET.parse(root / 'sitemap.xml').findall('{*}url/{*}loc')]
urls += ['https://www.skupsrebragorzow.pl/robots.txt', 'http://skupsrebragorzow.pl/', 'https://skupsrebragorzow.pl/']

def check(url):
    try:
        response = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'SrebroGorzow-SiteAudit/1.0'}), timeout=25)
    except urllib.error.HTTPError as error:
        response = error
    except Exception as error:
        return {'url': url, 'error': str(error)}
    with response:
        result = {'url': url, 'status': response.code, 'final_url': response.url,
                  'headers': {k: response.headers[k] for k in ['Content-Type', 'X-Robots-Tag', 'Server', 'CF-Mitigated'] if k in response.headers}}
        if url.endswith('/robots.txt') and response.code == 200:
            result['robots'] = response.read(65536).decode('utf-8', errors='replace')
        return result

with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
    results = list(pool.map(check, urls))
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None

def check_redirect(item):
    base, path = item
    expected = 'https://www.skupsrebragorzow.pl' + path
    url = base + path
    request = urllib.request.Request(url, headers={'User-Agent': 'SrebroGorzow-SiteAudit/1.0'})
    try:
        try:
            response = urllib.request.build_opener(NoRedirect).open(request, timeout=25)
        except urllib.error.HTTPError as error:
            response = error
        with response:
            status, location = response.code, response.headers.get('Location')
        already_canonical = base == 'https://www.skupsrebragorzow.pl'
        passed = (status == 200 and location is None) if already_canonical else (status in (301, 308) and location == expected)
        # Follow redirects separately to detect a loop or an unavailable destination.
        with urllib.request.urlopen(request, timeout=25) as final:
            final_status, final_url = final.code, final.url
        passed = passed and final_status == 200 and final_url == expected
        return {'url': url, 'first_status': status, 'location': location, 'final_status': final_status, 'final_url': final_url, 'passed': passed}
    except Exception as error:
        return {'url': url, 'passed': False, 'error': str(error)}

bases = ['http://skupsrebragorzow.pl', 'https://skupsrebragorzow.pl', 'http://www.skupsrebragorzow.pl', 'https://www.skupsrebragorzow.pl']
paths = ['/?jdm-audit=canonical', '/blog.html?jdm-audit=canonical&check=1', '/blog-jak-pielegnowac-srebrna-bizuterie.html?jdm-audit=canonical&check=2']
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
    redirects = list(pool.map(check_redirect, [(base, path) for base in bases for path in paths]))
report = {'requests': results, 'canonical_redirect_checks': redirects}
print('Canonical redirect checks:', sum(row['passed'] for row in redirects), '/', len(redirects))
snapshot = Path('/tmp/jdm-snapshot/robots.txt')
report['origin_robots'] = snapshot.read_text() if snapshot.is_file() else None
Path('/tmp/jdm-access-audit.json').write_text(json.dumps(report, ensure_ascii=False, indent=2))
for row in results:
    print(row['url'], row.get('status', 'error'), row.get('headers', {}))
