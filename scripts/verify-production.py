"""Validate sitemap targets and local dependencies before publishing production."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import xml.etree.ElementTree as ET

root = Path('deployment/jdm-public').resolve()
class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs = []
        self.h1 = 0
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.h1 += tag == 'h1'
        for key in ('href', 'src'):
            if attrs.get(key):
                self.refs.append(attrs[key])

urls = ET.parse(root / 'sitemap.xml').findall('{*}url/{*}loc')
assert urls, 'Sitemap is empty'
seen = set()
for loc in urls:
    url = urlsplit(loc.text)
    assert url.scheme == 'https' and url.netloc == 'www.skupsrebragorzow.pl', loc.text
    name = unquote(url.path).lstrip('/') or 'index.html'
    assert name not in seen, f'Duplicate sitemap target: {name}'
    seen.add(name)
    path = (root / name).resolve()
    assert path.is_relative_to(root) and path.is_file(), f'Missing page: {name}'
    page = Page()
    page.feed(path.read_text())
    assert page.h1 == 1, f'{name}: expected one H1, found {page.h1}'
    for ref in page.refs:
        parsed = urlsplit(ref)
        if parsed.scheme or parsed.netloc or not parsed.path:
            continue
        target = (root / unquote(parsed.path).lstrip('/') if parsed.path.startswith('/')
                  else path.parent / unquote(parsed.path)).resolve()
        assert target.is_relative_to(root), f'{name}: path escapes production root'
        if target.is_dir():
            target = target / 'index.html'
        assert target.is_file(), f'{name}: missing dependency {ref}'
print(f'OK: {len(seen)} production pages, sitemap, H1 and local links/resources.')
