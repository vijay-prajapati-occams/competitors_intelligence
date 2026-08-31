import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendError } from '../utils/apiResponse';
import * as competitorService from '../services/competitor.service';

function requireUser(req: Request, res: Response): req is Request & { user: NonNullable<Request['user']> } {
  if (!req.user) {
    sendError(res, 'Authentication required', 401);
    return false;
  }
  return true;
}

export const getCompetitors = asyncHandler(async (req: Request, res: Response) => {
  if (!requireUser(req, res)) return;

  const competitorType = typeof req.query.type === 'string' ? req.query.type : undefined;
  const search = typeof req.query.search === 'string' ? req.query.search : undefined;

  const competitors = await competitorService.listCompetitors(req.user.organizationId, {
    competitorType,
    search,
  });

  sendSuccess(res, 'Competitors fetched successfully', competitors);
});

export const createCompetitor = asyncHandler(async (req: Request, res: Response) => {
  if (!requireUser(req, res)) return;

  const competitor = await competitorService.createCompetitor(
    req.user.organizationId,
    req.user.userId,
    req.body
  );

  sendSuccess(res, 'Competitor created successfully', competitor, 201);
});

export const getCompetitor = asyncHandler(async (req: Request, res: Response) => {
  if (!requireUser(req, res)) return;

  const competitor = await competitorService.getCompetitorById(req.user.organizationId, req.params.id);
  sendSuccess(res, 'Competitor fetched successfully', competitor);
});

export const updateCompetitor = asyncHandler(async (req: Request, res: Response) => {
  if (!requireUser(req, res)) return;

  const competitor = await competitorService.updateCompetitor(
    req.user.organizationId,
    req.params.id,
    req.body
  );

  sendSuccess(res, 'Competitor updated successfully', competitor);
});

export const deleteCompetitor = asyncHandler(async (req: Request, res: Response) => {
  if (!requireUser(req, res)) return;

  await competitorService.deleteCompetitor(req.user.organizationId, req.params.id);
  sendSuccess(res, 'Competitor deleted successfully', null);
});
