import express from 'express';
import { createLink, getLinkInfo } from '../controllers/linkController';

const router = express.Router();

router.post('/create', createLink);
router.get('/:token', getLinkInfo);

export default router;
