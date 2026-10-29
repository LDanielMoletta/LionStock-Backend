import { Router } from 'express';
import * as sumController from '../controllers/sum.controller';

const router = Router();

router.post('/soma', sumController.calculate);

export default router;
