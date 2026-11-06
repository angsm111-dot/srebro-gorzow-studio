"""Compare public on-page SEO signals, without claiming search rankings."""
import concurrent.futures
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import time
import urllib.request
import urllib.error

class Signals(HTMLParser):
    def __init__(self):
        super().__init__(); self.skip=0; self.current=None; self.buffer=[]
        self.result={'title':[],'h1':[],'h2':[],'canonical':[],'robots':[],'description':[],'links':[],'schema':[],'text':[]}
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag in ('style','script'):
            self.skip+=1
        if tag=='script' and a.get('type')=='application/ld+json':
            self.current='schema'; self.buffer=[]
        elif tag in ('title','h1','h2'):
            self.current=tag; self.buffer=[]
        if tag=='link' and a.get('rel')=='canonical':self.result['canonical'].append(a.get('href'))
        if tag=='meta' and a.get('name','').lower() in ('robots','description'):
            self.result[a['name'].lower()].append(a.get('content'))
        if tag=='a' and a.get('href'):self.result['links'].append(a['href'])
    def handle_data(self, value):
        if self.current:self.buffer.append(value)
        if not self.skip:self.result['text'].append(value)
    def handle_endtag(self, tag):
        if self.current==tag or (tag=='script' and self.current=='schema'):
            self.result[self.current].append(' '.join(''.join(self.buffer).split()));self.current=None
        if tag in ('style','script'):self.skip=max(0,self.skip-1)

urls=['https://www.skupsrebragorzow.pl/','https://srebrogorzow.pl/','https://www.srebrogorzow.pl/',
      'https://srebrogorzow.pl/robots.txt','https://srebrogorzow.pl/sitemap.xml',
      'https://www.skupsrebragorzow.pl/robots.txt','https://www.skupsrebragorzow.pl/sitemap.xml']
def fetch(url):
    start=time.monotonic()
    try:
        request=urllib.request.Request(url,headers={'User-Agent':'SrebroGorzow-SiteAudit/1.0'})
        try:response=urllib.request.urlopen(request,timeout=30)
        except urllib.error.HTTPError as error:response=error
        with response:
            raw=response.read(3_000_000); text=raw.decode('utf-8',errors='replace')
            item={'url':url,'final_url':response.url,'status':response.code,'elapsed_seconds':round(time.monotonic()-start,3),'bytes':len(raw),
                  'headers':{k:response.headers[k] for k in ('Content-Type','X-Robots-Tag','Server','CF-Mitigated') if k in response.headers}}
        if 'text/html' in item['headers'].get('Content-Type',''):
            parser=Signals();parser.feed(text);item['signals']=parser.result
            item['signals']['text']=' '.join(' '.join(item['signals']['text']).split())
            item['text_words']=len(item['signals']['text'].split())
            if item['status']==200:
                name='skupsrebra-home.html' if 'skupsrebra' in url else ('srebro-www-home.html' if '//www.' in url else 'srebro-home.html')
                Path('/tmp/'+name).write_text(text)
        else:item['body']=text[:100000]
        return item
    except Exception as error:return {'url':url,'error':str(error)}
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:results=list(pool.map(fetch,urls))
Path('/tmp/site-seo-comparison.json').write_text(json.dumps({'results':results},ensure_ascii=False,indent=2))
for item in results:print(item['url'],item.get('status',item.get('error')))
