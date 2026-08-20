import { Router } from 'express';
import * as movementController from '../controllers/movement.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { error, validationError } from '../utils/response';
import { HttpStatus } from '../constants/httpStatus';

const router = Router();

router.post('/movements', authMiddleware, roleMiddleware(['admin', 'operator']), async (req, res) => {
  if (!req.body || !req.body.type || !req.body.product || !req.body.quantity) {
    return validationError(res, HttpStatus.BAD_REQUEST, 'Validação falhou.', [
      { field: 'type', message: 'Tipo é obrigatório.' },
      { field: 'product', message: 'Produto é obrigatório.' },
      { field: 'quantity', message: 'Quantidade é obrigatória.' },
    ]);
  }
  return movementController.create(req, res);
});

router.get('/movements', authMiddleware, roleMiddleware(['admin', 'operator', 'viewer']), movementController.findAll);
router.get('/movements/:id', authMiddleware, roleMiddleware(['admin', 'operator', 'viewer']), movementController.findOne);

export default router;