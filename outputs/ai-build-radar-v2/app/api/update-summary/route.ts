import {authenticated} from '@/lib/auth';
import {dashboardStore} from '@/lib/data';
import {updateSummary} from '@/lib/update-summary';
export const dynamic='force-dynamic';
export async function GET(){if(!await authenticated())return new Response('Unauthorized',{status:401});return Response.json(updateSummary((await dashboardStore()).runs),{headers:{'Cache-Control':'private, no-store'}});}
