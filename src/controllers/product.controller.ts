import productService from '../services/product.service';
import { success, error } from '../utils/response';
import { HttpStatus } from '../constants/httpStatus';
import { Messages } from '../constants/messages';
import { Request, Response } from 'express';

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await productService.createProduct(req.body);
    success(res, HttpStatus.CREATED, Messages.PRODUCT_CREATED, product);
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    error(res, status, err instanceof Error ? err.message : Messages.INTERNAL_ERROR);
  }
};

export const findAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await productService.findAll();
    success(res, HttpStatus.OK, 'Produtos listados com sucesso.', products);
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    error(res, status, err instanceof Error ? err.message : Messages.INTERNAL_ERROR);
  }
};

export const findOne = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const product = await productService.findById(id);
    success(res, HttpStatus.OK, 'Produto obtido com sucesso.', product);
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    error(res, status, err instanceof Error ? err.message : Messages.INTERNAL_ERROR);
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const product = await productService.updateProduct(id, req.body);
    success(res, HttpStatus.OK, Messages.PRODUCT_UPDATED, product);
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    error(res, status, err instanceof Error ? err.message : Messages.INTERNAL_ERROR);
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const product = await productService.deleteProduct(id);
    success(res, HttpStatus.OK, Messages.PRODUCT_DELETED, product);
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    error(res, status, err instanceof Error ? err.message : Messages.INTERNAL_ERROR);
  }
};