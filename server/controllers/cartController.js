import Cart from '../models/Cart.js';

// ─── GET /api/cart  (auth) ─────────────────────────────────────────────────────
export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.auth.userId }).populate('items.product');
        res.json({ success: true, cart: cart || { items: [] } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ─── POST /api/cart/add  (auth) ───────────────────────────────────────────────
export const addToCart = async (req, res) => {
    try {
        const { productId, qty = 1 } = req.body;
        if (!productId)
            return res.status(400).json({ success: false, message: 'productId is required' });

        let cart = await Cart.findOne({ user: req.auth.userId });

        if (!cart) {
            cart = new Cart({ user: req.auth.userId, items: [] });
        }

        const existing = cart.items.find(i => i.product.toString() === productId);
        if (existing) {
            existing.qty += Number(qty);
        } else {
            cart.items.push({ product: productId, qty: Number(qty) });
        }

        await cart.save();
        await cart.populate('items.product');
        res.json({ success: true, cart });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// ─── PATCH /api/cart/update  (auth) ──────────────────────────────────────────
export const updateCartItem = async (req, res) => {
    try {
        const { productId, qty } = req.body;
        if (!productId || qty === undefined)
            return res.status(400).json({ success: false, message: 'productId and qty are required' });

        const cart = await Cart.findOne({ user: req.auth.userId });
        if (!cart)
            return res.status(404).json({ success: false, message: 'Cart not found' });

        const item = cart.items.find(i => i.product.toString() === productId);
        if (!item)
            return res.status(404).json({ success: false, message: 'Item not in cart' });

        if (Number(qty) <= 0) {
            cart.items = cart.items.filter(i => i.product.toString() !== productId);
        } else {
            item.qty = Number(qty);
        }

        await cart.save();
        await cart.populate('items.product');
        res.json({ success: true, cart });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// ─── DELETE /api/cart/remove/:productId  (auth) ───────────────────────────────
export const removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.auth.userId });
        if (!cart)
            return res.status(404).json({ success: false, message: 'Cart not found' });

        cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
        await cart.save();
        await cart.populate('items.product');
        res.json({ success: true, cart });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ─── DELETE /api/cart/clear  (auth) ───────────────────────────────────────────
export const clearCart = async (req, res) => {
    try {
        await Cart.findOneAndUpdate(
            { user: req.auth.userId },
            { items: [] }
        );
        res.json({ success: true, message: 'Cart cleared' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
