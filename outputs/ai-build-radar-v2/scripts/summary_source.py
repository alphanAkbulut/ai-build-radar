"""Read only a registered author's feed; never fetch a user-supplied article URL."""
import sys,json,urllib.request,xml.etree.ElementTree as ET
from people_feed import REGISTRY,SafeRedirect,LIMIT,plain

def extract(raw,url):
 if b'<!DOCTYPE' in raw.upper() or b'<!ENTITY' in raw.upper():raise ValueError('Unsupported XML')
 root=ET.fromstring(raw);local=lambda e:e.tag.rsplit('}',1)[-1]
 for e in root.iter():
  if local(e) not in ('entry','item'):continue
  links=[c.get('href') or (c.text or '').strip() for c in e if local(c)=='link' and c.get('rel','alternate')=='alternate']
  if url not in links:continue
  fields={local(c):c for c in e};key=next((k for k in ['encoded','content','description','summary'] if k in fields),None)
  text=plain(''.join(fields[key].itertext())) if key else ''
  if len(text)<600:raise ValueError('Insufficient source text')
  return {'text':text[:24000],'coverage':'excerpt' if key in ['description','summary'] or len(text)>24000 else 'feed-content'}
 raise ValueError('Article is no longer available in feed')
if __name__=='__main__':
 person=next(p for p in REGISTRY if p['id']==sys.argv[1])
 request=urllib.request.Request(person['feed'],headers={'User-Agent':'BuildRadar-summary-reader/1.0'})
 with urllib.request.build_opener(SafeRedirect).open(request,timeout=15) as response:raw=response.read(LIMIT+1)
 if len(raw)>LIMIT:raise ValueError('Feed too large')
 print(json.dumps(extract(raw,sys.argv[2]),ensure_ascii=False))
