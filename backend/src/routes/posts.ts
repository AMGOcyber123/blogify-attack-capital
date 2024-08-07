import express from 'express';
import * as postController from '../controllers/postController';
import auth from '../middleware/auth';

const router = express.Router();

router.post('/', auth, postController.createPost);
router.get('/', postController.getPosts);

export default router;