export function aiDiscussionTags(tags:unknown):boolean{
 return Array.isArray(tags)&&tags.some(tag=>typeof tag==='string'&&['ai','ml'].includes(tag.toLowerCase()));
}
