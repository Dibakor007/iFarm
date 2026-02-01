
import { createHarvest, findAllHarvests } from '../models/harvestModel.js';

export const addHarvest = async (data) => {
  return await createHarvest(data);
};

export const getHarvests = async (limit) => {
  return await findAllHarvests(limit);
};
