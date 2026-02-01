import express from 'express';
import { listStock, createStock } from '../controllers/stockInventory.controller.js';

const router = express.Router();

router.get('/', listStock);
router.post('/', createStock);

export default router;
