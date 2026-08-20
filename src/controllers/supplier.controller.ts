import supplierService from '../services/supplier.service';
import { success, error } from '../utils/response';
import { HttpStatus } from '../constants/httpStatus';
import { Messages } from '../constants/messages';
import { Request, Response } from 'express';

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const supplier = await supplierService.createSupplier(req.body);
    success(res, HttpStatus.CREATED, 'Fornecedor criado com sucesso.', supplier);
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    error(res, status, err instanceof Error ? err.message : Messages.INTERNAL_ERROR);
  }
};

export const findAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const suppliers = await supplierService.findAll();
    success(res, HttpStatus.OK, 'Fornecedores listados com sucesso.', suppliers);
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    error(res, status, err instanceof Error ? err.message : Messages.INTERNAL_ERROR);
  }
};

export const findOne = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const supplier = await supplierService.findById(id);
    success(res, HttpStatus.OK, 'Fornecedor obtido com sucesso.', supplier);
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    error(res, status, err instanceof Error ? err.message : Messages.INTERNAL_ERROR);
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const supplier = await supplierService.updateSupplier(id, req.body);
    success(res, HttpStatus.OK, 'Fornecedor atualizado com sucesso.', supplier);
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    error(res, status, err instanceof Error ? err.message : Messages.INTERNAL_ERROR);
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const supplier = await supplierService.deleteSupplier(id);
    success(res, HttpStatus.OK, 'Fornecedor removido com sucesso.', supplier);
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    error(res, status, err instanceof Error ? err.message : Messages.INTERNAL_ERROR);
  }
};