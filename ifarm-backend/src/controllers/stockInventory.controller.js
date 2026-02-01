import { addStockItem, getStockItems } from '../services/stockInventory.service.js';
import { formatResponse } from '../utils/responseFormatter.js';

export const listStock = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit ?? 100);
    const items = await getStockItems(limit);
    res.json(formatResponse({ data: items }));
  } catch (error) {
    next(error);
  }
};

export const createStock = async (req, res, next) => {
  try {
    const {
      cropType,
      quantityKg,
      entryDate,
      expiryDate = null,
      storageId = 501,
      farmerId = 103,
      status = 'stored',
    } = req.body ?? {};

    if (!cropType || !quantityKg || !entryDate) {
      const error = new Error('cropType, quantityKg and entryDate are required');
      error.statusCode = 400;
      throw error;
    }

    const payload = {
      cropType,
      quantityKg: Number(quantityKg),
      entryDate,
      expiryDate,
      storageId,
      farmerId,
      status,
    };

    const created = await addStockItem(payload);
    res
      .status(201)
      .json(
        formatResponse({
          data: created,
          message: 'Stock item created successfully',
        }),
      );
  } catch (error) {
    next(error);
  }
};
