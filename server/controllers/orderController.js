import Order from '../models/Order.js';
import Product from '../models/Product.js';

// GET /api/orders/my  (orders placed by me as a buyer)
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

// GET /api/orders/received  (incoming buy requests for products I published)
export const getReceivedOrders = async (req, res) => {
    try {
        const sellerId = req.auth.userId;

        // Find all products published by this seller
        const myProducts = await Product.find({ seller: sellerId }).select('_id');
        const productIds = myProducts.map(p => p._id);

        const orders = await Order.find({
            $or: [
                { seller: sellerId },
                { product: { $in: productIds } }
            ]
        })
        .populate('product')
        .populate('user', 'name email phone address image')
        .sort({ createdAt: -1 });

        res.json({ success: true, orders });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/orders
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

// POST /api/orders  (buyer places order)
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
            seller: product.seller || null,
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

// PATCH /api/orders/:id/pay  (order owner pays)
export const markAsPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order)
            return res.status(404).json({ success: false, message: 'Order not found' });
        if (order.user.toString() !== req.auth.userId)
            return res.status(403).json({ success: false, message: 'Not authorized' });

        order.isPaid = true;
        order.status = 'confirmed';
        await order.save();
        res.json({ success: true, order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PATCH /api/orders/:id/status  (seller accepts/updates order status)
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id).populate('product');
        if (!order)
            return res.status(404).json({ success: false, message: 'Order not found' });

        const isSeller =
            (order.seller && order.seller.toString() === req.auth.userId) ||
            (order.product && order.product.seller && order.product.seller.toString() === req.auth.userId);
        const isBuyer = order.user && order.user.toString() === req.auth.userId;

        if (!isSeller && !isBuyer) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this order' });
        }

        order.status = status;
        await order.save();
        res.json({ success: true, order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
