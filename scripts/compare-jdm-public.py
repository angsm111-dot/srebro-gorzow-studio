"""Compare public production resources; never request PHP or private configuration."""
import concurrent.futures
import difflib
import hashlib
import json
from pathlib import Path
import urllib.request
import urllib.parse

root = Path('deployment/jdm-public')
base = 'https://www.skupsrebragorzow.pl/'
allowed = {'.html', '.css', '.js', '.xml', '.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico'}
files = sorted(p for p in root.rglob('*') if p.is_file()
               and p.suffix.lower() in allowed
               and not any(part.startswith('.') or part == 'private-config' for part in p.relative_to(root).parts)
               and p.name != 'studio.html')

def compare(path):
    name = path.relative_to(root).as_posix()
    local = path.read_bytes()
    request = urllib.request.Request(base + urllib.parse.quote(name), headers={'Cache-Control': 'no-cache'})
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            remote = response.read()
            if urllib.parse.urlparse(response.url).hostname not in {'www.skupsrebragorzow.pl', 'skupsrebragorzow.pl'}:
                raise ValueError('Unexpected redirect destination')
            if path.suffix.lower() in {'.css', '.js', '.xml'} and 'text/html' in response.headers.get('Content-Type', ''):
                raise ValueError('HTML returned in place of resource')
            modified = response.headers.get('Last-Modified')
    except Exception as error:
        return {'file': name, 'status': 'error', 'error': str(error)}, ''
    same = local == remote
    item = {'file': name, 'status': 'same' if same else 'different',
            'github_bytes': len(local), 'jdm_bytes': len(remote), 'last_modified': modified,
            'github_sha256': hashlib.sha256(local).hexdigest(), 'jdm_sha256': hashlib.sha256(remote).hexdigest()}
    diff = ''
    if not same and path.suffix.lower() in {'.html', '.css', '.js', '.xml', '.svg'}:
        a, b = local.decode('utf-8', errors='replace'), remote.decode('utf-8', errors='replace')
        # Ignore CRLF differences in the readable diff, but preserve exact hashes above.
        item['same_ignoring_line_endings'] = a.replace('\r\n', '\n') == b.replace('\r\n', '\n')
        diff = ''.join(difflib.unified_diff(a.splitlines(keepends=True), b.splitlines(keepends=True),
                      fromfile='GitHub/' + name, tofile='JDM/' + name))
    return item, diff

with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    results = list(pool.map(compare, files))
report = {'baseline_commit': __import__('os').environ.get('GITHUB_SHA'), 'base_url': base,
          'files': [item for item, _ in results]}
Path('/tmp/jdm-comparison.json').write_text(json.dumps(report, ensure_ascii=False, indent=2))
Path('/tmp/jdm-comparison.diff').write_text('\n'.join(diff for _, diff in results if diff))
for status in ['same', 'different', 'error']:
    print(status + ':', sum(item['status'] == status for item, _ in results))
