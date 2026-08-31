import { Router } from 'express';
import authRoutes from './auth.routes';
import competitorRoutes from './competitor.routes';
import newsRoutes from './news.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/competitors', competitorRoutes);
router.use('/news', newsRoutes);

export default router;
