import type {SummaryLanguage} from './summary-contract';
// Provider selection and credentials must be configured before any paid request.
export function summaryProviderReady(){return false;}
export async function generateSummary(_text:string,_language:SummaryLanguage):Promise<unknown>{throw new Error('SUMMARY_PROVIDER_NOT_CONFIGURED');}
