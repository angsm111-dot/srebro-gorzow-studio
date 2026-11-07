"""Aggregate streamed access logs; never persist raw lines, client IPs or queries."""
from collections import Counter, defaultdict
from datetime import datetime
import ipaddress
import json
from pathlib import Path
import re
import sys
import urllib.request
from urllib.parse import urlsplit

networks=[];verification_error=None
try:
    request=urllib.request.Request('https://developers.google.com/static/search/apis/ipranges/googlebot.json',headers={'User-Agent':'SrebroGorzow-SiteAudit/1.0'})
    with urllib.request.urlopen(request,timeout=20) as response:data=json.load(response)
    networks=[ipaddress.ip_network(p.get('ipv4Prefix') or p.get('ipv6Prefix')) for p in data['prefixes']]
except Exception as error:verification_error=str(error)
counts=Counter();google=defaultdict(Counter);verified=defaultdict(Counter);inspection=defaultdict(Counter)
status=Counter();dates=[];format_counts=Counter()
for line in sys.stdin:
    counts['lines']+=1
    match=re.search(r'"(?:GET|HEAD|POST|OPTIONS) ([^\s"]+) HTTP/[^\"]+"\s+(\d{3})',line)
    if not match:counts['unparsed']+=1;continue
    counts['parsed']+=1;code=match[2];status[code]+=1
    date=re.search(r'\[([^\]]+)\]',line)
    if date:
        try:dates.append(datetime.strptime(date[1],'%d/%b/%Y:%H:%M:%S %z'))
        except ValueError:pass
    quoted=re.findall(r'"([^\"]*)"',line)
    agent=quoted[-1] if quoted else ''
    path=urlsplit(match[1]).path
    # Keep only relevant public endpoints; group other paths, never emit query strings.
    if not (path=='/' or path in ('/robots.txt','/sitemap.xml') or path.endswith('.html')):path='[other resources]'
    if len(path)>160 or not re.fullmatch(r'/[A-Za-z0-9_./-]*|\[other resources\]',path):path='[other paths]'
    if 'Google-InspectionTool' in agent:inspection[path][code]+=1
    if 'Googlebot' not in agent:continue
    google[path][code]+=1;counts['googlebot_claimed']+=1
    client=None
    for token in line.split()[:3]:
        try:client=ipaddress.ip_address(token.strip('[],"'));break
        except ValueError:pass
    if client and any(client.version==network.version and client in network for network in networks):
        verified[path][code]+=1;counts['googlebot_verified_ip']+=1
report={'scope':'Up to 20,000 latest lines from each of access.log and four rotations. Host attribution depends on hosting log format.',
        'counts':dict(counts),'all_statuses':dict(status),'first_event':min(dates).isoformat() if dates else None,'last_event':max(dates).isoformat() if dates else None,
        'google_ip_ranges_loaded':bool(networks),'google_ip_verification_error':verification_error,
        'claimed_googlebot_paths':dict(google),'verified_googlebot_paths':dict(verified),'inspection_tool_paths':dict(inspection),
        'privacy':'No raw lines, client addresses, user data or query strings are retained. Claimed user agents alone do not prove Google identity.'}
Path('/tmp/jdm-crawl-summary.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print('Parsed log entries:',counts['parsed'],'Claimed Googlebot:',counts['googlebot_claimed'],'Verified against published Googlebot ranges:',counts['googlebot_verified_ip'])
