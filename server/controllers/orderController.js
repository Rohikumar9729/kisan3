import Order from '../models/Order.js';
import Product from '../models/Product.js';

// ─── GET /api/orders/my  (auth) ───────────────────────────────────────────────
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.auth.userId })
            .populate('product')
            .sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ─── GET /api/orders  (admin) ─────────────────────────────────────────────────
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('product')
            .populate('user', 'name email phone address')
            .sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ─── POST /api/orders  (auth) ─────────────────────────────────────────────────
export const placeOrder = async (req, res) => {
    try {
        const { productId, Quantity, DeliveryAddress, paymentMethod } = req.body;

        if (!productId || !Quantity || !DeliveryAddress)
            return res.status(400).json({
                success: false,
                message: 'productId, Quantity, and DeliveryAddress are required',
            });

        const product = await Product.findById(productId);
        if (!product)
            return res.status(404).json({ success: false, message: 'Product not found' });

        // Parse price — strips ₹, /kg etc.
        const numericPrice = parseFloat(product.price.replace(/[^0-9.]/g, ''));
        const amount = numericPrice * Number(Quantity);

        const order = await Order.create({
            user: req.auth.userId,
            product: product._id,
            Quantity: Number(Quantity),
            amount,
            DeliveryAddress,
            paymentMethod: paymentMethod || 'COD',
            showDeliveryTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
        });

        await order.populate('product');
        res.status(201).json({ success: true, order });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// ─── PATCH /api/orders/:id/pay  (auth: order owner) ──────────────────────────
export const markAsPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order)
            return res.status(404).json({ success: false, message: 'Order not found' });
        if (order.user !== req.auth.userId)
            return res.status(403).json({ success: false, message: 'Not authorized' });

        order.isPaid = true;
        order.status = 'confirmed';
        await order.save();
        res.json({ success: true, order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ─── PATCH /api/orders/:id/status  (admin) ────────────────────────────────────
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('product');
        if (!order)
            return res.status(404).json({ success: false, message: 'Order not found' });
        res.json({ success: true, order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
