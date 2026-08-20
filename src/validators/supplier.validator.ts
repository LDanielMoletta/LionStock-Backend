export interface ValidationError {
  field: string;
  message: string;
}

export interface SupplierCreateInput {
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  active?: boolean;
}

export interface SupplierUpdateInput {
  name?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  active?: boolean;
}

export const validateCreate = (body: SupplierCreateInput): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!body.name || !String(body.name).trim()) {
    errors.push({ field: 'name', message: 'Nome do fornecedor é obrigatório.' });
  }

  return errors;
};

export const validateUpdate = (body: SupplierUpdateInput): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (body.name !== undefined && !String(body.name).trim()) {
    errors.push({ field: 'name', message: 'Nome do fornecedor não pode ser vazio.' });
  }

  return errors;
};