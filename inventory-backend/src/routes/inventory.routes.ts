import { Router } from 'express';
import { addItem, getUserInventory, updateItem, deleteItem, getInventoryStats, getRecentActivity, getAllActivity, getAnalytics } from '../controllers/inventory.controller.js';
import { authenticate } from '../middleware/auth.js';
import type { RequestHandler } from 'express';

const router = Router();

// All inventory routes require authentication
router.use(authenticate as RequestHandler);

router.post('/', addItem as RequestHandler);
router.get('/', getUserInventory as RequestHandler);
router.put('/:id', updateItem as RequestHandler);
router.delete('/:id', deleteItem as RequestHandler);
router.get('/stats', getInventoryStats as RequestHandler);
router.get('/activity', getRecentActivity as RequestHandler);
router.get('/activity/all', authenticate as RequestHandler, getAllActivity as RequestHandler);
router.get('/analytics', authenticate as RequestHandler, getAnalytics as RequestHandler);

export default router; 