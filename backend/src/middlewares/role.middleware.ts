import { Request, Response, NextFunction } from 'express';
import { error } from '../utils/response';
import { HttpStatus } from '../constants/httpStatus';

export const roleMiddleware = (allowedRoles: string[] = []) => {
  return (req: Request & { user?: { role?: string } }, res: Response, next: NextFunction): void => {
    try {
      const userRole = req.user?.role?.toLowerCase() || null;
      if (!userRole) {
        error(res, HttpStatus.FORBIDDEN, 'Acesso negado.');
        return;
      }
      if (!allowedRoles.map((role) => role.toLowerCase()).includes(userRole)) {
        error(res, HttpStatus.FORBIDDEN, 'Acesso negado.');
        return;
      }
      next();
    } catch {
      error(res, HttpStatus.FORBIDDEN, 'Acesso negado.');
    }
  };
};