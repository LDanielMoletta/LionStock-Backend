import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validateCreate, validateUpdate } from '../validators/category.validator';
import { error, validationError } from '../utils/response';
import { HttpStatus } from '../constants/httpStatus';

const router = Router();

router.post('/categories', authMiddleware, roleMiddleware(['admin', 'operator']), async (req, res) => {
  const errs = validateCreate(req.body);
  if (errs.length) return validationError(res, HttpStatus.BAD_REQUEST, 'Validação falhou.', errs);
  return categoryController.create(req, res);
});

router.get('/categories', authMiddleware, roleMiddleware(['admin', 'operator', 'viewer']), categoryController.findAll);
router.get('/categories/:id', authMiddleware, roleMiddleware(['admin', 'operator', 'viewer']), categoryController.findOne);

router.put('/categories/:id', authMiddleware, roleMiddleware(['admin', 'operator']), async (req, res) => {
  const errs = validateUpdate(req.body);
  if (errs.length) return validationError(res, HttpStatus.BAD_REQUEST, 'Validação falhou.', errs);
  return categoryController.update(req, res);
});

router.delete('/categories/:id', authMiddleware, roleMiddleware(['admin']), categoryController.remove);

export default router;