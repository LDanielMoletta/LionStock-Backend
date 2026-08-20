import { Router } from 'express';
import { success } from '../utils/response';
import * as healthController from '../controllers/health.controller';
import userRoutes from './user.routes';
import categoryRoutes from './category.routes';
import supplierRoutes from './supplier.routes';
import productRoutes from './product.routes';
import movementRoutes from './movement.routes';

const router = Router();

router.get('/', (req, res) => {
  success(res, 200, 'LionStock API', {
    project: 'LionStock API',
    status: 'running',
  });
});

router.get('/health', healthController.checkHealth);

// mount auth & user routes under /api
router.use('/api', userRoutes);
router.use('/api', categoryRoutes);
router.use('/api', supplierRoutes);
router.use('/api', productRoutes);
router.use('/api', movementRoutes);

export default router;