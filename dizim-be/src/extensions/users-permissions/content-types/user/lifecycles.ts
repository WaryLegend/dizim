import { errors } from '@strapi/utils';

const { ValidationError } = errors;

export default {
  beforeCreate(event) {
    sanitizeUserInput(event.params.data);
  },

  beforeUpdate(event) {
    sanitizeUserInput(event.params.data);
  },
};

function sanitizeUserInput(data: Record<string, unknown>): void {
  if (data.fullName && typeof data.fullName === 'string') {
    data.fullName = data.fullName.trim();
    if (/<[^>]*>/.test(data.fullName as string)) {
      throw new ValidationError('Full name must not contain HTML tags');
    }
  }

  if (data.phone && typeof data.phone === 'string') {
    data.phone = data.phone.trim();
  }
}
