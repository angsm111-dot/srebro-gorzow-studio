"""Send only public URL allowlist and public Google IPv4 ranges to the host."""
import ipaddress
import json
from pathlib import Path
import re
import urllib.request
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET
paths={'/','/robots.txt','/sitemap.xml','/index.html','/studio.html'}
for loc in ET.parse('deployment/jdm-public/sitemap.xml').findall('{*}url/{*}loc'):
    path=urlsplit(loc.text).path or '/'
    assert re.fullmatch(r'/[A-Za-z0-9_.\-/]*',path)
    paths.add(path)
lines=['BEGIN {']+[f' publicpaths[{json.dumps(path)}]=1' for path in sorted(paths)]
ranges=[]
try:
    req=urllib.request.Request('https://developers.google.com/static/search/apis/ipranges/googlebot.json',headers={'User-Agent':'SrebroGorzow-SiteAudit/1.0'})
    with urllib.request.urlopen(req,timeout=20) as response:data=json.load(response)
    ranges=[ipaddress.ip_network(p['ipv4Prefix']) for p in data['prefixes'] if 'ipv4Prefix' in p]
except Exception:
    print('Public Google IPv4 ranges unavailable; identity will remain unverified.')
for index,network in enumerate(ranges,1):
    lines.append(f' rangefirst[{index}]={int(network.network_address)}; rangelast[{index}]={int(network.broadcast_address)}')
lines+= [f' rangecount={len(ranges)}','}']
Path('/tmp/aggregate-crawlers.awk').write_text('\n'.join(lines)+'\n'+Path('scripts/aggregate-jdm-crawlers.awk').read_text())
print('Public allowed paths:',len(paths),'Google IPv4 ranges:',len(ranges))
