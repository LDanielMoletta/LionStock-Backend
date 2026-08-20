import movementService from '../services/movement.service';
import { success, error } from '../utils/response';
import { HttpStatus } from '../constants/httpStatus';
import { Messages } from '../constants/messages';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { Request, Response } from 'express';

export const create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const payload = {
      ...req.body,
      user: req.user?.id ? req.user.id : req.body.user,
    };
    const movement = await movementService.createMovement(payload);
    success(res, HttpStatus.CREATED, 'Movimentação registrada com sucesso.', movement);
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    error(res, status, err instanceof Error ? err.message : Messages.INTERNAL_ERROR);
  }
};

export const findAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const movements = await movementService.findAll();
    success(res, HttpStatus.OK, 'Movimentações listadas com sucesso.', movements);
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    error(res, status, err instanceof Error ? err.message : Messages.INTERNAL_ERROR);
  }
};

export const findOne = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const movement = await movementService.findById(id);
    success(res, HttpStatus.OK, 'Movimentação obtida com sucesso.', movement);
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    error(res, status, err instanceof Error ? err.message : Messages.INTERNAL_ERROR);
  }
};