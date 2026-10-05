import {selectionFor} from '@/lib/selection';
import reviews from '../content/lesson-reviews.json';
import {adaptationState} from '@/lib/adaptation';
import type {Lesson} from '@/lib/lessons';

type Review={level:string;url:string;finding:string;limitation:string;reviewer:string;checkedAt:string};
export function LessonReview({lesson}:{lesson:Lesson}){
 const review=(reviews as Record<string,Review>)[lesson.slug];
 return <section className="lesson-panel" id="review">
  <h2>Bu örnekte neyi kontrol ettik?</h2><h3>Koleksiyona alınma kontrolleri</h3><ul>{selectionFor(lesson).checks.map(c=><li key={c.id}>{c.passed?"✓":"Eksik:"} {c.label}</li>)}</ul>
  <p><strong>{adaptationState(lesson).label}</strong> · {review?.reviewer||'Radar / Codex'} · {new Intl.DateTimeFormat('tr-TR',{dateStyle:'medium',timeZone:'Europe/Istanbul'}).format(new Date(review?.checkedAt||lesson.checkedAt))}</p>
  {review?<><p>{review.finding}</p><p><strong>Kontrolün sınırı:</strong> {review.limitation}</p><a href={review.url} target="_blank" rel="noopener noreferrer">İncelenen kaynağı aç ↗</a></>:<p>{lesson.inspection==='source'?'Geliştiricinin kaynak açıklaması incelendi; canlı uygulama denenmedi.':lesson.observations.join(' ')}</p>}
  <p>Bu inceleme Radar tarafından yapılır; ziyaretçiden onay beklenmez. Orijinal demoyu kontrol etmek, uyarlama talimatımızı ayrı bir projede test etmekle aynı şey değildir.</p>
  <p><strong>Uyarlama rehberi:</strong> {adaptationState(lesson).enabled?'Örnek ortamda test edildi.':'Ayrı bir örnek projede henüz test edilmedi; bu yüzden Projeme uyarla kapalı.'}</p>
 </section>;
}
