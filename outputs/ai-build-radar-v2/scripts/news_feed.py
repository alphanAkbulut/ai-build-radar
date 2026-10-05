"""Extract article metadata from a bounded RSS/Atom feed; never infer a Build."""
import json, re, sys, xml.etree.ElementTree as ET
from html import unescape
from datetime import datetime
from email.utils import parsedate_to_datetime
from urllib.parse import urlparse

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
  if title: articles.append({'title':title,'url':link,'publishedAt':published})
 return {'fetched':len(entries),'articles':articles}

if __name__=='__main__': print(json.dumps(parse(sys.stdin.read())))
