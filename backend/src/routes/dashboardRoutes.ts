import { Router } from 'express';
import {
  getDashboardStats,
  getRecentActivity,
  getTasksOverview,
} from '../controllers/dashboardController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Protect all routes with authentication
router.use(authenticate);

router.get('/stats', getDashboardStats);
router.get('/activity', getRecentActivity);
router.get('/overview', getTasksOverview);

export default router;
