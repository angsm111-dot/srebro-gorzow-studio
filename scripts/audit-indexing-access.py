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
report = {'requests': results}
snapshot = Path('/tmp/jdm-snapshot/robots.txt')
report['origin_robots'] = snapshot.read_text() if snapshot.is_file() else None
Path('/tmp/jdm-access-audit.json').write_text(json.dumps(report, ensure_ascii=False, indent=2))
for row in results:
    print(row['url'], row.get('status', 'error'), row.get('headers', {}))
