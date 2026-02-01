
import express from 'express';
import { postHarvest, listHarvests } from '../controllers/harvestController.js';

const router = express.Router();

router.post('/', postHarvest);
router.get('/', listHarvests);

export default router;
