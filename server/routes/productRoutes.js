import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../controllers/productController.js';

const router = express.Router();

router.get('/',      getAllProducts);
router.get('/:id',   getProductById);
router.post('/',     protect, createProduct);
router.put('/:id',   protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

export default router;
