import userService from '../services/user.service';
import { success, error } from '../utils/response';
import { HttpStatus } from '../constants/httpStatus';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { Response } from 'express';

export const login = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      error(res, HttpStatus.BAD_REQUEST, 'E-mail e senha são obrigatórios.');
      return;
    }

    const user = await userService.findByEmail(email);
    if (!user || !user.active) {
      error(res, HttpStatus.UNAUTHORIZED, 'Credenciais inválidas.');
      return;
    }

    const valid = await userService.validatePassword(user, password);
    if (!valid) {
      error(res, HttpStatus.UNAUTHORIZED, 'Credenciais inválidas.');
      return;
    }

    const token = userService.generateToken(user);
    const userObj = user.toObject();
    delete userObj.password;

    success(res, HttpStatus.OK, 'Login efetuado com sucesso.', { token, user: userObj });
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    error(res, status, err instanceof Error ? err.message : 'Erro interno do servidor.');
  }
};