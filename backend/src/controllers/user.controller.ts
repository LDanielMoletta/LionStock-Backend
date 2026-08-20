import userService from '../services/user.service';
import { success, error } from '../utils/response';
import { HttpStatus } from '../constants/httpStatus';
import { Messages } from '../constants/messages';
import { Request, Response } from 'express';

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userService.createUser(req.body);
    success(res, HttpStatus.CREATED, Messages.USER_CREATED, user);
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    error(res, status, err instanceof Error ? err.message : Messages.INTERNAL_ERROR);
  }
};

export const findAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.findAll();
    success(res, HttpStatus.OK, 'Usuários listados com sucesso.', users);
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    error(res, status, err instanceof Error ? err.message : Messages.INTERNAL_ERROR);
  }
};

export const findOne = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const user = await userService.findById(id);
    success(res, HttpStatus.OK, 'Usuário obtido com sucesso.', user);
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    error(res, status, err instanceof Error ? err.message : Messages.INTERNAL_ERROR);
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const user = await userService.updateUser(id, req.body);
    success(res, HttpStatus.OK, Messages.USER_UPDATED, user);
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    error(res, status, err instanceof Error ? err.message : Messages.INTERNAL_ERROR);
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const user = await userService.deleteUser(id);
    success(res, HttpStatus.OK, Messages.USER_DELETED, user);
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    error(res, status, err instanceof Error ? err.message : Messages.INTERNAL_ERROR);
  }
};