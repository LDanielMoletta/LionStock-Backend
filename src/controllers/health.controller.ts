import { success, error } from '../utils/response';
import { Messages } from '../constants/messages';
import { Request, Response } from 'express';

export const checkHealth = (req: Request, res: Response): void => {
  try {
    success(res, 200, Messages.API_RUNNING, {
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    error(res, 500, Messages.INTERNAL_ERROR, [err instanceof Error ? err.message : 'Erro desconhecido']);
  }
};