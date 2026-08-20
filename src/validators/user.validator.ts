export interface ValidationError {
  field: string;
  message: string;
}

type UserRole = 'admin' | 'operator' | 'viewer';

export interface UserCreateInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface UserUpdateInput {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  active?: boolean;
}

const isEmail = (email: string): boolean => /\S+@\S+\.\S+/.test(email);

export const validateCreate = (body: UserCreateInput): ValidationError[] => {
  const errors: ValidationError[] = [];
  if (!body.name) errors.push({ field: 'name', message: 'Nome é obrigatório.' });
  if (!body.email) errors.push({ field: 'email', message: 'E-mail é obrigatório.' });
  else if (!isEmail(body.email)) errors.push({ field: 'email', message: 'E-mail inválido.' });
  if (!body.password) errors.push({ field: 'password', message: 'Senha é obrigatória.' });
  if (body.role && !['admin', 'operator', 'viewer'].includes(body.role)) {
    errors.push({ field: 'role', message: 'Perfil inválido.' });
  }
  return errors;
};

export const validateUpdate = (body: UserUpdateInput): ValidationError[] => {
  const errors: ValidationError[] = [];
  if (body.email && !isEmail(body.email)) errors.push({ field: 'email', message: 'E-mail inválido.' });
  if (body.role && !['admin', 'operator', 'viewer'].includes(body.role)) errors.push({ field: 'role', message: 'Perfil inválido.' });
  return errors;
};