"""Extract article metadata from a bounded RSS/Atom feed; never infer a Build."""
import json, re, sys, xml.etree.ElementTree as ET
from html import unescape
from datetime import datetime
from email.utils import parsedate_to_datetime
from urllib.parse import urlparse
from urllib.parse import urljoin
from html.parser import HTMLParser

class Links(HTMLParser):
 def __init__(self): super().__init__(); self.links=[]; self.current=None
 def handle_starttag(self,tag,attrs):
  if tag=='a': self.current=[dict(attrs).get('href',''),'']
 def handle_data(self,data):
  if self.current: self.current[1]+=data
 def handle_endtag(self,tag):
  if tag=='a' and self.current: self.links.append(self.current); self.current=None

class PlainText(HTMLParser):
 def __init__(self): super().__init__(); self.parts=[]
 def handle_data(self,data): self.parts.append(data)

def parse(raw):
 if re.search(r'<!DOCTYPE|<!ENTITY', raw, re.I): raise ValueError('DTD/entity declarations are not accepted')
 root=ET.fromstring(raw)
 local=lambda e:e.tag.rsplit('}',1)[-1]
 if local(root) not in ('rss','feed','RDF'): raise ValueError('Not RSS/Atom')
 entries=[e for e in root.iter() if local(e) in ('item','entry')][:20]
 articles=[]
 for e in entries:
  fields={local(c):c for c in e}
  title=unescape(''.join(fields['title'].itertext())).strip()[:300] if 'title' in fields else ''
  link=next((c.get('href') or c.text or '' for c in e if local(c)=='link' and c.get('rel','alternate')=='alternate'),'').strip()
  parsed=urlparse(link)
  if parsed.scheme!='https' or not parsed.hostname or parsed.username or parsed.password or parsed.port: continue
  raw_date=next((c.text for c in e if local(c) in ('published','pubDate','updated')),None)
  try:
   date=datetime.fromisoformat(raw_date.replace('Z','+00:00')) if re.match(r'^\d{4}-\d\d-\d\d[T ]',raw_date or '') else parsedate_to_datetime(raw_date)
   if date.tzinfo is None: continue
   published=date.isoformat()
  except (ValueError,TypeError,AttributeError): continue
  content=' '.join(''.join(c.itertext()) for c in e if local(c) in ('content','encoded','description','summary'))
  plain=PlainText(); plain.feed(content)
  excerpt=re.sub(r'\s+',' ',unescape(' '.join(plain.parts))).strip()[:240]
  links=Links(); links.feed(content); references=[]; seen=set()
  for href,label in links.links:
   target=urljoin(link,unescape(href)); u=urlparse(target)
   if u.scheme!='https' or not u.hostname or u.username or u.password or u.port or u.hostname==parsed.hostname or target in seen: continue
   parts=[p for p in u.path.split('/') if p]
   if u.hostname in ('github.com','www.github.com') and len(parts)>=2: target='https://github.com/'+ '/'.join(parts[:2])
   elif u.hostname=='huggingface.co' and len(parts)>=3 and parts[0]=='spaces': target='https://huggingface.co/'+ '/'.join(parts[:3])
   if target in seen: continue
   seen.add(target); references.append({'url':target,'label':unescape(label).strip()[:160]})
   if len(references)>=12: break
  if title: articles.append({'title':title,'url':link,'publishedAt':published,'excerpt':excerpt,'references':references})
 return {'fetched':len(entries),'articles':articles}

if __name__=='__main__': print(json.dumps(parse(sys.stdin.read())))
