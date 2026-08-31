import { Router } from 'express';
import * as newsController from '../controllers/news.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { organizationMiddleware } from '../middleware/organization.middleware';
import { paramsIdSchema } from '../validators/common.validator';
import { listNewsQuerySchema, updateNewsMentionSchema } from '../validators/news.validator';

const router = Router();

router.use(authMiddleware, organizationMiddleware);

router.get('/', validate(listNewsQuerySchema, 'query'), newsController.getNews);
router.get('/:id', validate(paramsIdSchema, 'params'), newsController.getNewsMention);
router.patch(
  '/:id',
  validate(paramsIdSchema, 'params'),
  validate(updateNewsMentionSchema),
  newsController.updateNewsMention
);
router.patch('/:id/archive', validate(paramsIdSchema, 'params'), newsController.archiveNewsMention);

export default router;
