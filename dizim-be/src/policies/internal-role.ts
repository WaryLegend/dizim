type PolicyContext = {
  state?: {
    user?: {
      role?: {
        name?: string;
        type?: string;
      };
    };
  };
};

const DENIED_ROLE_TYPES = new Set(['public', 'authenticated']);
const DENIED_ROLE_NAMES = new Set(['public', 'authenticated']);

export default async (policyContext: PolicyContext): Promise<boolean> => {
  const role = policyContext.state?.user?.role;
  if (!role) {
    return false;
  }

  const roleType = role.type?.trim().toLowerCase();
  if (roleType && DENIED_ROLE_TYPES.has(roleType)) {
    return false;
  }

  const roleName = role.name?.trim().toLowerCase();
  if (roleName && DENIED_ROLE_NAMES.has(roleName)) {
    return false;
  }

  return Boolean(roleType || roleName);
};
