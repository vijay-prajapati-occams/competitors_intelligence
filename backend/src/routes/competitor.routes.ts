import { Router } from 'express';
import * as competitorController from '../controllers/competitor.controller';
import * as newsController from '../controllers/news.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { organizationMiddleware } from '../middleware/organization.middleware';
import { newsCollectRateLimiter } from '../middleware/rateLimit.middleware';
import { paramsIdSchema } from '../validators/common.validator';
import { createCompetitorSchema, updateCompetitorSchema } from '../validators/competitor.validator';
import { listCompetitorNewsQuerySchema } from '../validators/news.validator';

const router = Router();

router.use(authMiddleware, organizationMiddleware);

router.get('/', competitorController.getCompetitors);
router.post('/', validate(createCompetitorSchema), competitorController.createCompetitor);
router.get('/:id', validate(paramsIdSchema, 'params'), competitorController.getCompetitor);
router.patch(
  '/:id',
  validate(paramsIdSchema, 'params'),
  validate(updateCompetitorSchema),
  competitorController.updateCompetitor
);
router.delete('/:id', validate(paramsIdSchema, 'params'), competitorController.deleteCompetitor);

router.get(
  '/:id/news',
  validate(paramsIdSchema, 'params'),
  validate(listCompetitorNewsQuerySchema, 'query'),
  newsController.getCompetitorNews
);
router.post(
  '/:id/news/collect',
  validate(paramsIdSchema, 'params'),
  newsCollectRateLimiter,
  newsController.collectCompetitorNews
);

export default router;
