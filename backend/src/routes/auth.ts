import express from 'express';
import * as authController from '../controllers/authController';
import auth from '../middleware/auth';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', auth, authController.logout);

export default router;