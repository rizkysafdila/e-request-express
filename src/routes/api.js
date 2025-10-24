import express from 'express';
import jwtMiddleware from '../middleware/auth.js';
import requestController from '../controllers/requestController.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Protected routes
router.get('/request-status/:id', jwtMiddleware, requestController.getRequestStatus);
router.get('/request-list', jwtMiddleware, requestController.getRequestList);

export default router;
