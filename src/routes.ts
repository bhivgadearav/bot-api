import { Router } from 'express';
import { signup } from './controllers/userController';
import { switchNetwork, getBalance, transfer } from './controllers/txnController';
import { authenticate } from './middleware/auth';
import { access } from './middleware/access';

const router = Router();

router.post('/signup', access, signup);
router.post('/network/switch', access, authenticate, switchNetwork);
router.post('/balance', access, authenticate, getBalance);
router.post('/transfer', access, authenticate, transfer);

export default router;