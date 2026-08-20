import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validateCreate, validateUpdate } from '../validators/product.validator';
import { error, validationError } from '../utils/response';
import { HttpStatus } from '../constants/httpStatus';

const router = Router();

router.post('/products', authMiddleware, roleMiddleware(['admin', 'operator']), async (req, res) => {
  const errs = validateCreate(req.body);
  if (errs.length) return validationError(res, HttpStatus.BAD_REQUEST, 'Validação falhou.', errs);
  return productController.create(req, res);
});

router.get('/products', authMiddleware, roleMiddleware(['admin', 'operator', 'viewer']), productController.findAll);
router.get('/products/:id', authMiddleware, roleMiddleware(['admin', 'operator', 'viewer']), productController.findOne);

router.put('/products/:id', authMiddleware, roleMiddleware(['admin', 'operator']), async (req, res) => {
  const errs = validateUpdate(req.body);
  if (errs.length) return validationError(res, HttpStatus.BAD_REQUEST, 'Validação falhou.', errs);
  return productController.update(req, res);
});

router.delete('/products/:id', authMiddleware, roleMiddleware(['admin']), productController.remove);

export default router;