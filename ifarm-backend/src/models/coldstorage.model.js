import { getPool } from "../config/database.js";

export const getAllColdStorages = async () => {
  const [rows] = await getPool().query(
    "SELECT * FROM coldstorage"
  );
  return rows;
};
