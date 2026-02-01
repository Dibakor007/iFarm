import express from 'express';

import farmRoutes from './farmRoutes.js';
import healthRoutes from './healthRoutes.js';
import harvestRoutes from './harvestRoutes.js';
import stockInventoryRoutes from './stockInventoryRoutes.js';

const router = express.Router();

router.use('/farms', farmRoutes);
router.use('/health', healthRoutes);
router.use('/harvests', harvestRoutes);
router.use('/stock', stockInventoryRoutes);

export default router;
