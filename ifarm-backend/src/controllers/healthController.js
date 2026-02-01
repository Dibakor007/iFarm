import { collectHealth } from '../services/healthService.js';
import { formatResponse } from '../utils/responseFormatter.js';

export const getHealth = async (req, res, next) => {
  try {
    const health = await collectHealth();
    res.json(formatResponse({ data: health }));
  } catch (error) {
    next(error);
  }
};
