import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    getMyOrders,
    getAllOrders,
    placeOrder,
    markAsPaid,
    updateOrderStatus,
} from '../controllers/orderController.js';

const router = express.Router();

// All order routes require authentication
router.use(protect);

router.get('/my',           getMyOrders);
router.get('/',             getAllOrders);
router.post('/',            placeOrder);
router.patch('/:id/pay',    markAsPaid);
router.patch('/:id/status', updateOrderStatus);

export default router;
