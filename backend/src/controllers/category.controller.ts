import categoryService from '../services/category.service';
import { success, error } from '../utils/response';
import { HttpStatus } from '../constants/httpStatus';
import { Messages } from '../constants/messages';
import { Request, Response } from 'express';

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await categoryService.createCategory(req.body);
    success(res, HttpStatus.CREATED, Messages.CATEGORY_CREATED, category);
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    error(res, status, err instanceof Error ? err.message : Messages.INTERNAL_ERROR);
  }
};

export const findAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await categoryService.findAll();
    success(res, HttpStatus.OK, 'Categorias listadas com sucesso.', categories);
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    error(res, status, err instanceof Error ? err.message : Messages.INTERNAL_ERROR);
  }
};

export const findOne = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const category = await categoryService.findById(id);
    success(res, HttpStatus.OK, 'Categoria obtida com sucesso.', category);
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    error(res, status, err instanceof Error ? err.message : Messages.INTERNAL_ERROR);
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const category = await categoryService.updateCategory(id, req.body);
    success(res, HttpStatus.OK, Messages.CATEGORY_UPDATED, category);
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    error(res, status, err instanceof Error ? err.message : Messages.INTERNAL_ERROR);
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const category = await categoryService.deleteCategory(id);
    success(res, HttpStatus.OK, Messages.CATEGORY_DELETED, category);
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    error(res, status, err instanceof Error ? err.message : Messages.INTERNAL_ERROR);
  }
};