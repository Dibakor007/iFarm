import { findFarms } from '../models/farmModel.js';

export const getFarmSummaries = async (limit) => findFarms(limit);
