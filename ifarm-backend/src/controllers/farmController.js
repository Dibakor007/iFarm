import { getFarmSummaries } from '../services/farmService.js';
import { formatResponse } from '../utils/responseFormatter.js';

export const listFarms = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit ?? 50);
    const farms = await getFarmSummaries(limit);
    res.json(formatResponse({ data: farms }));
  } catch (error) {
    next(error);
  }
};
