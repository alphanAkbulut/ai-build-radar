import records from '../content/adaptation-checks.json';
import type {Lesson} from './lessons';
export type AdaptationCheck={recipe:string;environment:string;testedAt:string;reportUrl:string;checks:{name:string;passed:boolean}[]};
// Observation of the original demo is not a successful reproduction test.
export function adaptationState(lesson:Lesson,record?:AdaptationCheck){
 const check=record||(records as Record<string,AdaptationCheck>)[lesson.slug];
 const recipe=JSON.stringify([lesson.title,lesson.exercise,lesson.checks,lesson.tools]);
 const passed=!!check&&check.recipe===recipe&&!!check.environment.trim()&&Number.isFinite(Date.parse(check.testedAt))&&Date.parse(check.testedAt)<=Date.now()&&/^(https:\/\/|\/(?!\/))/.test(check.reportUrl)&&lesson.checks.length>0&&lesson.checks.every(name=>check.checks.some(c=>c.name===name&&c.passed))&&check.checks.every(c=>c.passed);
 const observed=lesson.inspection!=='source'&&!!lesson.buildId&&lesson.observations.length>0;
 return {enabled:passed,label:passed?'Uygulaması test edildi':observed?'Demo incelendi':'İnceleme bekliyor',reason:passed?'Bu rehber belirtilen örnek ortamda test edildi. Kendi projenizde ayrıca doğrulanmalıdır.':'Uyarlama rehberi henüz test edilmedi. Canlı örneği ve öğrenme notlarını inceleyebilirsin.',check:passed?check:undefined};
}
