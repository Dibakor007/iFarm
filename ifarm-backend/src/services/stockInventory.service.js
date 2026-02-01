import { createStockItem, findStockItems } from '../models/stockInventory.model.js';

export const addStockItem = async (data) => createStockItem(data);

export const getStockItems = async (limit) => findStockItems(limit);
