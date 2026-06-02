import { ruleBasedQualify } from '../../src/ai/RuleBasedQualifier';

describe('RuleBasedQualifier', () => {
  it('should return COLD for minimal input', () => {
    const result = ruleBasedQualify({ full_name: 'Test', email: 'test@example.com' });
    expect(result.leadLevel).toBe('COLD');
    expect(result.leadScore).toBe(20);
  });

  it('should return WARM with email and phone', () => {
    const result = ruleBasedQualify({
      full_name: 'Test',
      email: 'test@example.com',
      phone: '+84123456789',
    });
    expect(result.leadLevel).toBe('WARM');
    expect(result.leadScore).toBe(40);
  });

  it('should return HOT with full data', () => {
    const result = ruleBasedQualify({
      full_name: 'Test User',
      email: 'test@example.com',
      phone: '+84123456789',
      company: 'Acme Corp',
      monthly_orders: 500,
      message: 'A'.repeat(150),
      inquiry_type: 'Partnership',
      expected_platform: 'TikTok Shop',
    });
    expect(result.leadLevel).toBe('HOT');
    expect(result.leadScore).toBeGreaterThanOrEqual(71);
  });

  it('should cap score at 100', () => {
    const result = ruleBasedQualify({
      full_name: 'Test User',
      email: 'test@example.com',
      phone: '+84123456789',
      company: 'Acme Corp',
      monthly_orders: 500,
      message: 'A'.repeat(150),
      inquiry_type: 'Partnership',
      expected_platform: 'TikTok Shop',
    });
    expect(result.leadScore).toBeLessThanOrEqual(100);
  });

  it('should return valid recommendedAction for HOT', () => {
    const result = ruleBasedQualify({
      full_name: 'Test',
      email: 'test@example.com',
      phone: '+84123456789',
      company: 'Acme Corp',
      monthly_orders: 500,
      message: 'A'.repeat(150),
    });
    expect(result.recommendedAction).toBe('Contact immediately via phone');
  });

  it('should return valid recommendedAction for COLD', () => {
    const result = ruleBasedQualify({ full_name: 'Test', email: 'test@example.com' });
    expect(result.recommendedAction).toBe('Nurture with automated email sequence');
  });
});
