"""Read public HTTP indexing signals; never send credentials or change the site."""
import concurrent.futures
import json
from html.parser import HTMLParser
import re
from pathlib import Path
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET
root = Path('deployment/jdm-public')
urls = [loc.text for loc in ET.parse(root / 'sitemap.xml').findall('{*}url/{*}loc')]
sitemap_urls = set(urls)
urls += ['https://www.skupsrebragorzow.pl/sitemap.xml', 'https://www.skupsrebragorzow.pl/__index-audit-missing-20261107.html', 'https://www.skupsrebragorzow.pl/__index-audit-missing-20261107/', 'https://www.skupsrebragorzow.pl/robots.txt', 'http://skupsrebragorzow.pl/', 'https://skupsrebragorzow.pl/']

class IndexingSignals(HTMLParser):
    def __init__(self):
        super().__init__(); self.canonical=[]; self.directives=[]; self.h1=0; self.title=False; self.title_text=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='link' and 'canonical' in a.get('rel','').lower().split():self.canonical.append(a.get('href'))
        if tag=='meta' and a.get('name','').lower() in ('robots','googlebot'):self.directives.append(a.get('content',''))
        if tag=='h1':self.h1+=1
        if tag=='title':self.title=True
    def handle_endtag(self,tag):
        if tag=='title':self.title=False
    def handle_data(self,data):
        if self.title:self.title_text.append(data)

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
        body=response.read(2_000_000).decode('utf-8',errors='replace')
        if url.endswith('/robots.txt') and response.code == 200:
            result['robots'] = body
        if url.endswith('/sitemap.xml') and response.code == 200:
            try:
                tree=ET.fromstring(body)
                locations=[node.text for node in tree.findall('{*}url/{*}loc')]
                result['sitemap']={'root':tree.tag,'count':len(locations),'duplicates':len(locations)-len(set(locations)), 'missing':sorted(sitemap_urls-set(locations)), 'extra':sorted(set(locations)-sitemap_urls)}
            except ET.ParseError as error: result['sitemap_error']=str(error)
        if url in sitemap_urls:
            parser=IndexingSignals(); parser.feed(body)
            directives=','.join(parser.directives+[response.headers.get('X-Robots-Tag','')]).lower()
            result['html_signals']={'title':''.join(parser.title_text).strip(),'h1_count':parser.h1,'canonical':parser.canonical,'noindex':bool(re.search(r'\b(noindex|none)\b',directives)), 'valid_canonical':parser.canonical==[url]}
            if url=='https://www.skupsrebragorzow.pl/':
                result['homepage_checks']={'over_300_reviews':'Ponad 300 opinii' in body, 'removed_long_block':'home-local-details' not in body}
        if '__index-audit-missing-' in url:result['correct_not_found']=response.code==404
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
