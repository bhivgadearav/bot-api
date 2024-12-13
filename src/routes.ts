// routes.ts
import { Router } from 'express';
import { signup, signin } from './controllers/userController';
import { switchNetwork, getBalance, transfer } from './controllers/txnController';
import { authenticate } from './middleware/auth';

const router = Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/network/switch', authenticate, switchNetwork);
router.post('/balance', authenticate, getBalance);
router.post('/transfer', authenticate, transfer);

export default router;