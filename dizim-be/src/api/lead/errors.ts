export class LeadValidationError extends Error {
  public code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'LeadValidationError';
    this.code = code;
  }
}

export class SpamError extends Error {
  public code: string;

  constructor(message = 'Message flagged as spam') {
    super(message);
    this.name = 'SpamError';
    this.code = 'SPAM_DETECTED';
  }
}

export class LeadNotFoundError extends Error {
  public code: string;

  constructor(message = 'Lead not found') {
    super(message);
    this.name = 'LeadNotFoundError';
    this.code = 'NOT_FOUND';
  }
}
