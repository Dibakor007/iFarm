
import { addHarvest, getHarvests } from '../services/harvestService.js';
import { formatResponse } from '../utils/responseFormatter.js';

export const postHarvest = async (req, res, next) => {
  try {
    const data = req.body;
    // Basic validation
    if (!data.farmerName || !data.cropType || !data.quantity || !data.date) {
        const error = new Error('Missing required fields');
        error.statusCode = 400;
        throw error;
    }
    const result = await addHarvest(data);
    res.status(201).json(formatResponse({ data: result, message: 'Harvest record created successfully' }));
  } catch (error) {
    next(error);
  }
};

export const listHarvests = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit ?? 50);
    const results = await getHarvests(limit);
    res.json(formatResponse({ data: results }));
  } catch (error) {
    next(error);
  }
};
