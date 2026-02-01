import { getPool } from '../config/database.js';

export const createStockItem = async ({
  storageId = 501,
  farmerId = 103,
  cropType,
  quantityKg,
  entryDate,
  expiryDate = null,
  status = 'stored',
}) => {
  const pool = getPool();
  const [result] = await pool.query(
    'INSERT INTO stockinventory (storage_id, farmer_id, crop_type, quantity_kg, entry_date, expiry_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [storageId, farmerId, cropType, quantityKg, entryDate, expiryDate, status],
  );

  return {
    stock_id: result.insertId,
    storage_id: storageId,
    farmer_id: farmerId,
    crop_type: cropType,
    quantity_kg: quantityKg,
    entry_date: entryDate,
    expiry_date: expiryDate,
    status,
  };
};

export const findStockItems = async (limit = 100) => {
  const pool = getPool();
  const [rows] = await pool.query(
    'SELECT stock_id, storage_id, farmer_id, crop_type, quantity_kg, entry_date, expiry_date, status FROM stockinventory ORDER BY entry_date DESC, stock_id DESC LIMIT ?',
    [limit],
  );
  return rows;
};
