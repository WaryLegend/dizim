import { GoogleGenerativeAI, FunctionDeclarationSchemaType } from '@google/generative-ai';
import { AIProvider, AIProviderInput } from './AIProvider';
import { QualifyLeadOutput } from '../types';
import { ruleBasedQualify } from './RuleBasedQualifier';

const QUALIFY_FUNCTION_NAME = 'qualifyLead';

const qualifyFunctionDeclaration = {
  name: QUALIFY_FUNCTION_NAME,
  description: 'Qualify a sales lead based on provided information',
  parameters: {
    type: FunctionDeclarationSchemaType.OBJECT,
    properties: {
      leadScore: {
        type: FunctionDeclarationSchemaType.NUMBER,
        description: 'Lead score from 0 to 100',
      },
      leadLevel: {
        type: FunctionDeclarationSchemaType.STRING,
        description: 'Lead level: COLD, WARM, or HOT',
        enum: ['COLD', 'WARM', 'HOT'],
      },
      summary: {
        type: FunctionDeclarationSchemaType.STRING,
        description: 'Brief AI summary of the lead',
      },
      recommendedAction: {
        type: FunctionDeclarationSchemaType.STRING,
        description: 'Recommended next action for the sales team',
      },
    },
    required: ['leadScore', 'leadLevel', 'summary', 'recommendedAction'],
  },
};

export class GeminiProvider implements AIProvider {
  private model: any;
  private retryCount = 3;
  private retryDelay = 1000;

  constructor(apiKey?: string) {
    const key = apiKey || process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY is required for GeminiProvider');
    }
    const genAI = new GoogleGenerativeAI(key);
    this.model = genAI.getGenerativeModel({
      model: 'gemini-2.5-pro',
      generationConfig: {
        temperature: 0.2,
        topP: 0.8,
        topK: 40,
      },
    });
  }

  async qualifyLead(input: AIProviderInput): Promise<QualifyLeadOutput> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.retryCount; attempt++) {
      try {
        return await this.callGemini(input);
      } catch (error: any) {
        lastError = error;
        console.warn(`[GeminiProvider] Attempt ${attempt}/${this.retryCount} failed:`, error.message);
        if (attempt < this.retryCount) {
          await this.delay(this.retryDelay * Math.pow(2, attempt - 1));
        }
      }
    }

    console.warn('[GeminiProvider] All attempts failed, falling back to rule-based scoring');
    return ruleBasedQualify(input);
  }

  private async callGemini(input: AIProviderInput): Promise<QualifyLeadOutput> {
    const prompt = this.buildPrompt(input);

    const result = await this.model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      tools: [{
        functionDeclarations: [qualifyFunctionDeclaration],
      }],
    });

    const response = result.response;
    const functionCalls = response?.functionCalls?.();

    if (functionCalls && functionCalls.length > 0) {
      const fc = functionCalls[0];
      if (fc.name === QUALIFY_FUNCTION_NAME) {
        return this.validateAndNormalize(fc.args);
      }
    }

    const text = response?.text?.() || '';
    if (text) {
      return this.parseFromText(text);
    }

    return ruleBasedQualify(input);
  }

  private buildPrompt(input: AIProviderInput): string {
    return `You are a lead qualification AI for an AI-powered livestream commerce platform called Dizim AI.

Analyze the following lead information and determine their quality and priority.

Lead Information:
- Full Name: ${input.full_name}
- Email: ${input.email}
- Phone: ${input.phone || 'Not provided'}
- Company: ${input.company || 'Not provided'}
- Inquiry Type: ${input.inquiry_type || 'Not provided'}
- Expected Platform: ${input.expected_platform || 'Not provided'}
- Monthly Orders: ${input.monthly_orders !== undefined ? input.monthly_orders : 'Not provided'}
- Message: ${input.message || 'Not provided'}

Use the qualifyLead function to provide your assessment.`;
  }

  private validateAndNormalize(args: any): QualifyLeadOutput {
    const score = Math.max(0, Math.min(100, Number(args.leadScore) || 0));
    let level: string = String(args.leadLevel || 'COLD').toUpperCase();
    if (!['COLD', 'WARM', 'HOT'].includes(level)) {
      level = 'COLD';
    }

    return {
      leadScore: score,
      leadLevel: level as any,
      summary: String(args.summary || '').trim(),
      recommendedAction: String(args.recommendedAction || '').trim(),
    };
  }

  private parseFromText(text: string): QualifyLeadOutput {
    try {
      const parsed = JSON.parse(text);
      return this.validateAndNormalize(parsed);
    } catch {
      return ruleBasedQualify({
        full_name: '',
        email: '',
      });
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
