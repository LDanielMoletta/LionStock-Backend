import { Request, Response, NextFunction } from 'express';
import { error } from '../utils/response';
import { Messages } from '../constants/messages';

export const errorHandler = (err: Error & { statusCode?: number }, req: Request, res: Response, next: NextFunction): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || Messages.INTERNAL_ERROR;

  error(res, statusCode, message, [message]);
};