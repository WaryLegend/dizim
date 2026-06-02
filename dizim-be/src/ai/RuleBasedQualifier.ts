import { AIProviderInput } from './AIProvider';
import { QualifyLeadOutput, LeadLevel } from '../types';

export function ruleBasedQualify(input: AIProviderInput): QualifyLeadOutput {
  let score = 0;
  const reasons: string[] = [];

  if (input.email && isValidEmail(input.email)) {
    score += 20;
    reasons.push('Valid email provided');
  }

  if (input.phone) {
    score += 20;
    reasons.push('Phone number provided');
  }

  if (input.company) {
    score += 20;
    reasons.push('Company information provided');
  }

  if (input.monthly_orders !== undefined && input.monthly_orders > 100) {
    score += 20;
    reasons.push(`High monthly orders: ${input.monthly_orders}`);
  } else if (input.monthly_orders !== undefined && input.monthly_orders > 0) {
    score += 10;
    reasons.push(`Monthly orders: ${input.monthly_orders}`);
  }

  if (input.message && input.message.length > 100) {
    score += 20;
    reasons.push('Detailed message provided');
  } else if (input.message && input.message.length > 50) {
    score += 10;
    reasons.push('Brief message provided');
  }

  if (input.expected_platform) {
    score += 10;
    reasons.push('Expected platform specified');
  }

  if (input.inquiry_type) {
    score += 10;
    reasons.push('Inquiry type specified');
  }

  score = Math.min(100, Math.max(0, score));

  let level: LeadLevel;
  if (score >= 71) {
    level = 'hot';
  } else if (score >= 41) {
    level = 'warm';
  } else {
    level = 'cold';
  }

  return {
    leadScore: score,
    leadLevel: level.toUpperCase() as any,
    summary: reasons.length > 0
      ? `Rule-based qualification: ${reasons.join('; ')}. Total score: ${score}/100.`
      : 'Insufficient information for scoring.',
    recommendedAction: level === 'hot'
      ? 'Contact immediately via phone'
      : level === 'warm'
      ? 'Send personalized follow-up email'
      : 'Nurture with automated email sequence',
  };
}

function isValidEmail(email: string): boolean {
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return re.test(email);
}
