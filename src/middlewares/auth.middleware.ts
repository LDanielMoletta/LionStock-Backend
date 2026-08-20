import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { error } from '../utils/response';
import { HttpStatus } from '../constants/httpStatus';
import { Request, Response, NextFunction } from 'express';

dotenv.config({
  path: path.resolve(__dirname, '../../.env')
});

const JWT_SECRET = process.env.JWT_SECRET;

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    if (!JWT_SECRET) {
      error(res, HttpStatus.INTERNAL_SERVER_ERROR, 'JWT_SECRET não configurado no ambiente.');
      return;
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      error(res, HttpStatus.UNAUTHORIZED, 'Token não fornecido.');
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      error(res, HttpStatus.UNAUTHORIZED, 'Token expirado.');
      return;
    }
    error(res, HttpStatus.UNAUTHORIZED, 'Token inválido.');
  }
};