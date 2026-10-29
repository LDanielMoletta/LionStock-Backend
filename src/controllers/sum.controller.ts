import { Request, Response } from 'express';
import { HttpStatus } from '../constants/httpStatus';
import { sum } from '../services/sum.service';

const INVALID_INPUT_MESSAGE = 'The fields "a" and "b" must be valid numbers.';

const isValidNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

export const calculate = (req: Request, res: Response): void => {
  const { a, b } = req.body ?? {};

  if (!isValidNumber(a) || !isValidNumber(b)) {
    res.status(HttpStatus.BAD_REQUEST).json({ erro: INVALID_INPUT_MESSAGE });
    return;
  }

  res.status(HttpStatus.OK).json({ resultado: sum(a, b) });
};
