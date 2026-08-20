import { Router } from 'express';
import * as supplierController from '../controllers/supplier.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validateCreate, validateUpdate } from '../validators/supplier.validator';
import { error, validationError } from '../utils/response';
import { HttpStatus } from '../constants/httpStatus';

const router = Router();

router.post('/suppliers', authMiddleware, roleMiddleware(['admin', 'operator']), async (req, res) => {
  const errs = validateCreate(req.body);
  if (errs.length) return validationError(res, HttpStatus.BAD_REQUEST, 'Validação falhou.', errs);
  return supplierController.create(req, res);
});

router.get('/suppliers', authMiddleware, roleMiddleware(['admin', 'operator', 'viewer']), supplierController.findAll);
router.get('/suppliers/:id', authMiddleware, roleMiddleware(['admin', 'operator', 'viewer']), supplierController.findOne);

router.put('/suppliers/:id', authMiddleware, roleMiddleware(['admin', 'operator']), async (req, res) => {
  const errs = validateUpdate(req.body);
  if (errs.length) return validationError(res, HttpStatus.BAD_REQUEST, 'Validação falhou.', errs);
  return supplierController.update(req, res);
});

router.delete('/suppliers/:id', authMiddleware, roleMiddleware(['admin']), supplierController.remove);

export default router;