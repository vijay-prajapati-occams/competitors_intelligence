import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendError } from '../utils/apiResponse';
import * as newsService from '../services/news.service';
import { ListCompetitorNewsQuery, ListNewsQuery } from '../validators/news.validator';

function requireUser(req: Request, res: Response): req is Request & { user: NonNullable<Request['user']> } {
  if (!req.user) {
    sendError(res, 'Authentication required', 401);
    return false;
  }
  return true;
}

export const collectCompetitorNews = asyncHandler(async (req: Request, res: Response) => {
  if (!requireUser(req, res)) return;

  const summary = await newsService.collectCompetitorNews(req.user.organizationId, req.params.id);
  sendSuccess(res, 'News collection completed', summary);
});

export const getCompetitorNews = asyncHandler(async (req: Request, res: Response) => {
  if (!requireUser(req, res)) return;

  const result = await newsService.getCompetitorMentions(
    req.user.organizationId,
    req.params.id,
    req.query as unknown as ListCompetitorNewsQuery
  );
  sendSuccess(res, 'Competitor news fetched successfully', result);
});

export const getNews = asyncHandler(async (req: Request, res: Response) => {
  if (!requireUser(req, res)) return;

  const result = await newsService.getMentions(req.user.organizationId, req.query as unknown as ListNewsQuery);
  sendSuccess(res, 'News feed fetched successfully', result);
});

export const getNewsMention = asyncHandler(async (req: Request, res: Response) => {
  if (!requireUser(req, res)) return;

  const mention = await newsService.getMentionById(req.user.organizationId, req.params.id);
  sendSuccess(res, 'News mention fetched successfully', mention);
});

export const updateNewsMention = asyncHandler(async (req: Request, res: Response) => {
  if (!requireUser(req, res)) return;

  const mention = await newsService.updateMention(req.user.organizationId, req.params.id, req.body);
  sendSuccess(res, 'News mention updated successfully', mention);
});

export const archiveNewsMention = asyncHandler(async (req: Request, res: Response) => {
  if (!requireUser(req, res)) return;

  const mention = await newsService.archiveMention(req.user.organizationId, req.params.id);
  sendSuccess(res, 'News mention archived successfully', mention);
});
