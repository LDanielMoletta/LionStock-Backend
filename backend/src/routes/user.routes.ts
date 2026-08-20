import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { login } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validateCreate, validateUpdate } from '../validators/user.validator';
import { error, validationError } from '../utils/response';
import { HttpStatus } from '../constants/httpStatus';

const router = Router();

// Auth
router.post('/auth/login', login);

// Users
router.post('/users', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  const errs = validateCreate(req.body);
  if (errs.length) return validationError(res, HttpStatus.BAD_REQUEST, 'Validação falhou.', errs);
  return userController.create(req, res);
});

router.get('/users', authMiddleware, roleMiddleware(['admin', 'operator', 'viewer']), userController.findAll);
router.get('/users/:id', authMiddleware, roleMiddleware(['admin', 'operator', 'viewer']), userController.findOne);

router.put('/users/:id', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  const errs = validateUpdate(req.body);
  if (errs.length) return validationError(res, HttpStatus.BAD_REQUEST, 'Validação falhou.', errs);
  return userController.update(req, res);
});

router.delete('/users/:id', authMiddleware, roleMiddleware(['admin']), userController.remove);

export default router;