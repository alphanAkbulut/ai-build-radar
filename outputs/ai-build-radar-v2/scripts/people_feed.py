"""Public RSS/Atom snapshots. No article bodies, credentials or social likes collected."""
import concurrent.futures, datetime, email.utils, fcntl, hashlib, html, json, os, pathlib, re, urllib.parse, urllib.request, xml.etree.ElementTree as ET
ROOT=pathlib.Path(__file__).resolve().parents[1]
REGISTRY=[p for p in json.loads((ROOT/'content/people.json').read_text()) if p.get('feed')]
ALLOWED={urllib.parse.urlparse(p['feed']).hostname for p in REGISTRY}|{'feeds.simonwillison.net'}
LIMIT=5_000_000

def safe_url(value):
 try:
  u=urllib.parse.urlparse(value)
  return bool(u.scheme=='https' and u.hostname and not u.username and not u.password)
 except ValueError:return False

def plain(value):
 return re.sub(r'\s+',' ',html.unescape(re.sub('<[^>]+>',' ',value))).strip()

def parse_feed(raw,person):
 if b'<!DOCTYPE' in raw.upper() or b'<!ENTITY' in raw.upper():raise ValueError('Unsupported XML declaration')
 root=ET.fromstring(raw)
 def name(e):return e.tag.rsplit('}',1)[-1]
 if name(root) not in ('rss','feed','RDF'):raise ValueError('Not an RSS/Atom feed')
 entries=[];seen=set()
 for entry in root.iter():
  if name(entry) not in ('item','entry'):continue
  fields={name(child):child for child in entry}
  def txt(key):
   e=fields.get(key)
   return ''.join(e.itertext()).strip() if e is not None else ''
  url=''
  for child in entry:
   if name(child)=='link' and child.get('rel','alternate')=='alternate':url=child.get('href') or (child.text or '').strip();break
  if not safe_url(url) or url in seen:continue
  title=plain(txt('title'))[:220]
  if not title:continue
  date=txt('published') or txt('pubDate') or txt('updated');published=None
  try:
   try:dt=datetime.datetime.fromisoformat(date.replace('Z','+00:00'))
   except ValueError:dt=email.utils.parsedate_to_datetime(date)
   if dt.tzinfo is None:dt=dt.replace(tzinfo=datetime.timezone.utc)
   published=dt.astimezone(datetime.timezone.utc).isoformat()
  except (ValueError,TypeError,OverflowError):pass
  # Topic relevance is a broad lexical filter, never an endorsement classifier.
  body=plain(txt('content') or txt('encoded') or txt('description') or txt('summary'))
  if person['id']=='simon' and not re.search(r'\b(ai|llm|model|agent|claude|gpt|coding|tool|code|webgpu|software|datasette)\b',title+' '+body,re.I):continue
  author_node=fields.get('author')
  author_name=next((c.text for c in author_node if name(c)=='name'),None) if author_node is not None else None
  author=plain(txt('creator') or author_name or txt('author'))[:160]
  seen.add(url);entries.append({'id':hashlib.sha256(url.encode()).hexdigest()[:20],'personId':person['id'],'title':title,'url':url,'publishedAt':published,'author':author or None,'kind':'Yazı / paylaşım','sourceUrl':person['feed'],'excerpt':' '.join(body.split()[:25])})
 entries.sort(key=lambda e:e['publishedAt'] or '',reverse=True)
 return entries[:8]

class SafeRedirect(urllib.request.HTTPRedirectHandler):
 def redirect_request(self,req,fp,code,msg,headers,newurl):
  if not safe_url(newurl) or urllib.parse.urlparse(newurl).hostname not in ALLOWED:raise ValueError('Feed redirect outside registry')
  return super().redirect_request(req,fp,code,msg,headers,newurl)

def collect(person,previous,now):
 old=next((s for s in previous.get('sources',[]) if s['personId']==person['id']),{})
 retained=[e for e in previous.get('entries',[]) if e['personId']==person['id']]
 try:
  req=urllib.request.Request(person['feed'],headers={'User-Agent':'BuildRadar-private-reader/0.2','Accept':'application/atom+xml, application/rss+xml, application/xml'})
  with urllib.request.build_opener(SafeRedirect).open(req,timeout=15) as response:raw=response.read(LIMIT+1)
  if len(raw)>LIMIT:raise ValueError('Feed too large')
  entries=parse_feed(raw,person)
  if not entries and retained:raise ValueError('Empty feed; retaining previous snapshot')
  old_urls={e['url'] for e in retained};new=sum(e['url'] not in old_urls for e in entries)
  return {'personId':person['id'],'lastAttempt':now,'lastSuccess':now,'status':'ok','count':len(entries),'added':new},entries
 except Exception:
  return {'personId':person['id'],'lastAttempt':now,'lastSuccess':old.get('lastSuccess'),'status':'failed','count':len(retained),'added':0,'error':'Akış okunamadı; varsa son başarılı kayıtlar korunuyor.'},retained

def main():
 folder=ROOT/'learning-data';folder.mkdir(exist_ok=True)
 target=folder/'people-feed.json'
 with (folder/'people-feed.lock').open('w') as lock:
  fcntl.flock(lock,fcntl.LOCK_EX)
  previous=json.loads(target.read_text()) if target.exists() else {}
  now=datetime.datetime.now(datetime.timezone.utc)
  last=previous.get('checkedAt')
  if previous.get('formatVersion')==2 and previous.get('registryKey')==hashlib.sha256(json.dumps(REGISTRY,sort_keys=True).encode()).hexdigest() and last and (now-datetime.datetime.fromisoformat(last)).total_seconds()<45*60:return
  with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:results=list(pool.map(lambda p:collect(p,previous,now.isoformat()),REGISTRY))
  sources=[s for s,_ in results];entries=[e for _,es in results for e in es]
  snapshot={'registryKey':hashlib.sha256(json.dumps(REGISTRY,sort_keys=True).encode()).hexdigest(),'formatVersion':2,'checkedAt':now.isoformat(),'sources':sources,'entries':sorted(entries,key=lambda e:e['publishedAt'] or '',reverse=True)}
  temporary=folder/'people-feed.tmp';temporary.write_text(json.dumps(snapshot,ensure_ascii=False,indent=2));os.replace(temporary,target)
  print(json.dumps({'sources':sources,'entries':len(entries)}))
if __name__=='__main__':main()
