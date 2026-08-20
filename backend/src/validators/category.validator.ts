export interface ValidationError {
  field: string;
  message: string;
}

export interface CategoryCreateInput {
  name: string;
  description?: string;
}

export interface CategoryUpdateInput {
  name?: string;
  description?: string;
}

export const validateCreate = (body: CategoryCreateInput): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!body.name || !String(body.name).trim()) {
    errors.push({ field: 'name', message: 'Nome da categoria é obrigatório.' });
  }

  return errors;
};

export const validateUpdate = (body: CategoryUpdateInput): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (body.name !== undefined && !String(body.name).trim()) {
    errors.push({ field: 'name', message: 'Nome da categoria não pode ser vazio.' });
  }

  return errors;
};