import sys,pathlib,unittest
from unittest.mock import patch
sys.path.insert(0,str(pathlib.Path(__file__).resolve().parents[1]/'scripts'))
import people_feed as feed
class FeedTests(unittest.TestCase):
 def test_atom_date_author_and_unsafe_link(self):
  raw=b'''<feed xmlns="http://www.w3.org/2005/Atom"><entry><title>AI &amp; tools</title><link href="https://example.com/article"/><published>2026-10-01T00:00:00Z</published><author><name>A Writer</name><uri>hidden</uri></author></entry><entry><title>Bad</title><link href="javascript:alert(1)"/></entry></feed>'''
  entries=feed.parse_feed(raw,{'id':'test','feed':'https://example.com/feed'});self.assertEqual(len(entries),1);self.assertEqual(entries[0]['author'],'A Writer');self.assertEqual(entries[0]['title'],'AI & tools')
 def test_rss_duplicate_and_unknown_date(self):
  raw=b'<rss><channel><item><title>One</title><link>https://example.com/a</link><pubDate>invalid</pubDate></item><item><title>One</title><link>https://example.com/a</link></item></channel></rss>'
  entries=feed.parse_feed(raw,{'id':'test','feed':'https://example.com/feed'});self.assertEqual(len(entries),1);self.assertIsNone(entries[0]['publishedAt'])
 def test_failure_keeps_previous_success(self):
  previous={'sources':[{'personId':'test','lastSuccess':'old'}],'entries':[{'personId':'test','url':'https://example.com/a'}]}
  with patch('urllib.request.build_opener',side_effect=OSError('offline')):source,entries=feed.collect({'id':'test','feed':'https://example.com/feed'},previous,'now')
  self.assertEqual(source['lastSuccess'],'old');self.assertEqual(source['status'],'failed');self.assertEqual(source['added'],0);self.assertEqual(entries,previous['entries'])
 def test_rejects_html_and_entity_declarations(self):
  for xml in [b'<html/>',b'<!DOCTYPE rss><rss/>']:
   with self.assertRaises(ValueError):feed.parse_feed(xml,{'id':'test','feed':'https://example.com/feed'})
if __name__=='__main__':unittest.main()
