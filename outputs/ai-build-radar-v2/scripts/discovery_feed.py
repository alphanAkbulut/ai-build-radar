"""Parse bounded RSS/Atom input; extract explicit repository/demo references, not endorsements."""
import sys,json,re,xml.etree.ElementTree as ET
from html.parser import HTMLParser
from urllib.parse import urljoin,urlparse
from email.utils import parsedate_to_datetime
from datetime import datetime
class Links(HTMLParser):
 def __init__(self): super().__init__();self.links=[];self.current=None
 def handle_starttag(self,tag,attrs):
  if tag=='a': self.current=[dict(attrs).get('href',''),'']
 def handle_data(self,data):
  if self.current:self.current[1]+=data
 def handle_endtag(self,tag):
  if tag=='a' and self.current:self.links.append(self.current);self.current=None
def parse(raw):
 if re.search(r'<!DOCTYPE|<!ENTITY',raw,re.I): raise ValueError('DTD/entity declarations are not accepted')
 root=ET.fromstring(raw);local=lambda e:e.tag.rsplit('}',1)[-1]
 if local(root) not in ('rss','feed','RDF'):raise ValueError('Not RSS/Atom')
 entries=[e for e in root.iter() if local(e) in ('item','entry')][:20];out=[]
 for e in entries:
  fields={local(c):c for c in e};title=''.join(fields['title'].itertext()) if 'title' in fields else ''
  link=next((c.get('href') or c.text or '' for c in e if local(c)=='link' and c.get('rel','alternate')=='alternate'),'')
  date=next((c.text for c in e if local(c) in ('published','pubDate','updated')),None)
  try: date=(datetime.fromisoformat(date.replace('Z','+00:00')) if re.match(r'^\d{4}-\d\d-\d\d[T ]',date) else parsedate_to_datetime(date)).isoformat()
  except (ValueError,TypeError,AttributeError):date=None
  content=' '.join(''.join(c.itertext()) for c in e if local(c) in ('content','encoded','description','summary'))
  parser=Links();parser.feed(content);seen=set()
  for href,label in parser.links:
   u=urlparse(urljoin(link,href));parts=[p for p in u.path.split('/') if p]
   if u.scheme!='https' or u.username or u.password or u.port:continue
   target=None
   if u.hostname=='github.com' and len(parts)>=2 and parts[0] not in ('features','topics','collections','orgs','settings','search','sponsors','marketplace'):
    target='https://github.com/'+ '/'.join(parts[:2])
   elif u.hostname=='huggingface.co' and len(parts)>=3 and parts[0]=='spaces':target='https://huggingface.co/'+ '/'.join(parts[:3])
   if not target or target in seen:continue
   seen.add(target);out.append({'url':target,'label':label.strip()[:200],'article':link,'title':title[:500],'publishedAt':date})
 return {'fetched':len(entries),'references':out}
if __name__=='__main__':print(json.dumps(parse(sys.stdin.read())))
