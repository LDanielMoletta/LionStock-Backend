import { Response } from 'express';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  validationErrors?: ValidationError[];
}

export const success = <T>(res: Response, statusCode: number, message: string, data?: T): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const error = (res: Response, statusCode: number, message: string, errors: string[] | ValidationError[] = []): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

export const validationError = (res: Response, statusCode: number, message: string, validationErrors: ValidationError[]): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    validationErrors,
  });
};