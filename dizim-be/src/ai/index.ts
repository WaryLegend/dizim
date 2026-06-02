import { AIProvider, AIProviderInput } from './AIProvider';
import { GeminiProvider } from './GeminiProvider';
import { ruleBasedQualify } from './RuleBasedQualifier';
import { QualifyLeadOutput } from '../types';

let provider: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (!provider) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      provider = new GeminiProvider(apiKey);
    } else {
      throw new Error('No AI provider configured. Set GEMINI_API_KEY environment variable.');
    }
  }
  return provider;
}

export function setAIProvider(p: AIProvider): void {
  provider = p;
}

export async function qualifyLead(input: AIProviderInput): Promise<QualifyLeadOutput> {
  try {
    const p = getAIProvider();
    return await p.qualifyLead(input);
  } catch (error) {
    console.warn('[AI] Provider failed, using rule-based fallback:', error);
    return ruleBasedQualify(input);
  }
}

export { AIProvider, AIProviderInput } from './AIProvider';
export { GeminiProvider } from './GeminiProvider';
export { ruleBasedQualify } from './RuleBasedQualifier';
