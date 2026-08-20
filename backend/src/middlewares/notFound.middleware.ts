import { Request, Response, NextFunction } from 'express';
import { error } from '../utils/response';
import { Messages } from '../constants/messages';

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  error(res, 404, Messages.RESOURCE_NOT_FOUND, [Messages.RESOURCE_NOT_FOUND]);
};