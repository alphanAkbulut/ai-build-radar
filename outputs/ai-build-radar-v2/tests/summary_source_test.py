import sys,pathlib,unittest
sys.path.insert(0,str(pathlib.Path(__file__).resolve().parents[1]/'scripts'))
from summary_source import extract
class SourceTests(unittest.TestCase):
 def test_reject_short_or_wrong_article(self):
  raw=b'<rss><channel><item><link>https://example.com/a</link><description>Short excerpt</description></item></channel></rss>'
  for url in ['https://example.com/a','https://example.com/b']:
   with self.assertRaises(ValueError):extract(raw,url)
 def test_partial_is_labelled(self):
  raw=('<rss><channel><item><link>https://example.com/a</link><description>'+('hello '*150)+'</description></item></channel></rss>').encode()
  self.assertEqual(extract(raw,'https://example.com/a')['coverage'],'excerpt')
 def test_entities_rejected(self):
  with self.assertRaises(ValueError):extract(b'<!DOCTYPE rss><rss/>','https://example.com')
if __name__=='__main__':unittest.main()
