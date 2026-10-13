#!/usr/bin/env python3
"""Read-only HTML/sitemap audit. Uses stdlib, never submits forms.
Usage: python3 tools/qa/dual-seo.py http://127.0.0.1:10022
"""
import json
import sys
from html.parser import HTMLParser
from urllib.parse import urljoin, urlsplit, unquote
from urllib.request import urlopen
import xml.etree.ElementTree as ET

ORIGIN = 'https://tenbeltz.com'
PAIRS = [('/', '/en'), ('/services', '/en/services'),
 ('/casos', '/en/case-studies'), ('/quien-esta-detras', '/en/who-is-behind'),
 ('/politicas', '/en/politicas'), ('/aritz', '/en/aritz'),
 ('/diagnostico-ia', '/en/ai-diagnosis'),
 ('/evaluacion-ia-saas', '/en/ai-evaluation-for-saas'),
 ('/agentes-voz-saas', '/en/voice-agents-for-saas'),
 ('/ia-privada-productos', '/en/private-ai-products'),
 ('/ia-para-empresas', '/en/ai-for-business'),
 ('/ia-para-software', '/en/ai-for-software')]

class Page(HTMLParser):
 def __init__(self):
  super().__init__(convert_charrefs=True)
  self.lang=''; self.title=''; self.in_title=False; self.h1=0
  self.ids=set(); self.links=[]; self.canon=[]; self.alternates={}
  self.jsonld=[]; self.in_json=False; self.script=''; self.switch=[]; self.descriptions=[]
 def handle_starttag(self, tag, attrs):
  a=dict(attrs)
  if 'id' in a: self.ids.add(a['id'])
  if tag=='html': self.lang=a.get('lang','')
  if tag=='title': self.in_title=True
  if tag=='h1': self.h1+=1
  if tag=='a' and 'href' in a:
   self.links.append(a['href'])
   if 'language-link' in a.get('class','').split(): self.switch.append(a['href'])
  if tag=='link' and a.get('rel')=='canonical': self.canon.append(a.get('href'))
  if tag=='link' and a.get('rel')=='alternate': self.alternates[a.get('hreflang')]=a.get('href')
  if tag=='meta' and a.get('name')=='description': self.descriptions.append(a.get('content',''))
  if tag=='script' and a.get('type')=='application/ld+json': self.in_json=True; self.script=''
 def handle_endtag(self,tag):
  if tag=='title': self.in_title=False
  if tag=='script' and self.in_json:
   self.jsonld.append(json.loads(self.script)); self.in_json=False
 def handle_data(self,data):
  if self.in_title: self.title+=data
  if self.in_json: self.script+=data

base=sys.argv[1].rstrip('/') if len(sys.argv)>1 else 'http://127.0.0.1:10022'
errors=[]; pages={}; checked_links=0

def fail(where, message): errors.append({'path':where,'error':message})
def fetch(path):
 with urlopen(base+path,timeout=20) as response:
  return response.status, response.read().decode('utf-8')

for es,en in PAIRS:
 for path,lang,other in [(es,'es',en),(en,'en',es)]:
  try:
   status,html=fetch(path); page=Page(); page.feed(html); pages[path]=page
   if status!=200: fail(path,f'status {status}')
   if not page.title.strip(): fail(path,'missing title')
   if len(page.descriptions)!=1 or not page.descriptions[0].strip(): fail(path,'description missing/duplicate')
   if page.h1!=1: fail(path,f'{page.h1} H1 elements')
   if page.lang!=lang: fail(path,f'lang {page.lang}')
   if page.canon!=[ORIGIN+path]: fail(path,f'canonical {page.canon}')
   expected={'es':ORIGIN+es,'en':ORIGIN+en,'x-default':ORIGIN+es}
   if page.alternates!=expected: fail(path,f'hreflang {page.alternates}')
   if len(page.switch)!=1 or urlsplit(page.switch[0]).path.rstrip('/')!=other.rstrip('/'):
    fail(path,f'language switch {page.switch}, expected {other}')
   if not page.jsonld or any('@context' not in graph for graph in page.jsonld): fail(path,'missing JSON-LD context')
  except Exception as exc: fail(path,str(exc))

# sitemap may be an index or direct urlset.
sitemap_urls={}; ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9','x':'http://www.w3.org/1999/xhtml'}
def sitemap(path):
 _,xml=fetch(path); root=ET.fromstring(xml)
 if root.tag.endswith('sitemapindex'):
  for loc in root.findall('s:sitemap/s:loc',ns): sitemap(urlsplit(loc.text).path)
 else:
  for item in root.findall('s:url',ns):
   loc=item.find('s:loc',ns).text
   sitemap_urls[loc.rstrip('/') if loc!=ORIGIN+'/' else ORIGIN]={link.get('hreflang'):link.get('href') for link in item.findall('x:link',ns)}
try:
 sitemap('/sitemap-index.xml')
 expected_urls={ORIGIN+path if path!='/' else ORIGIN for pair in PAIRS for path in pair}
 if set(sitemap_urls)!=expected_urls: fail('sitemap',f'missing {sorted(expected_urls-set(sitemap_urls))}; extra {sorted(set(sitemap_urls)-expected_urls)}')
 for es,en in PAIRS:
  for path in (es,en):
   key=ORIGIN+path if path!='/' else ORIGIN
   expected={'es':ORIGIN+es,'en':ORIGIN+en,'x-default':ORIGIN+es}
   if sitemap_urls.get(key)!=expected: fail(path,'sitemap hreflang differs')
except Exception as exc: fail('sitemap',str(exc))

# Follow only links to this site; assets can exist outside the24 page routes.
extra={}
for source,page in list(pages.items()):
 for href in page.links:
  target=urlsplit(urljoin(ORIGIN+source,href))
  if target.netloc!='tenbeltz.com' or target.scheme not in ('http','https'): continue
  path=unquote(target.path) or '/'
  if path.startswith('/api/'): continue
  checked_links+=1
  destination=pages.get(path)
  if destination is None:
   if path not in extra:
    try:
     with urlopen(base+path,timeout=20) as response:
      if 'text/html' in response.headers.get('Content-Type',''):
       destination=Page(); destination.feed(response.read().decode('utf-8')); extra[path]=destination
      else: extra[path]=True
    except Exception as exc: extra[path]=False; fail(source,f'broken link {href}: {exc}')
   destination=extra[path]
  if target.fragment and isinstance(destination,Page) and unquote(target.fragment) not in destination.ids:
   fail(source,f'missing fragment {href}')
print(json.dumps({'base':base,'expected_routes':24,'pages_checked':len(pages),'internal_links_checked':checked_links,'errors':errors,'passed':not errors},ensure_ascii=False,indent=2))
sys.exit(bool(errors))
