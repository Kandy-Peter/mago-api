import { Router } from 'express';
import auth from './authentication/auth.routes';

const router = Router();

router.use('/auth', auth);

export default router;
