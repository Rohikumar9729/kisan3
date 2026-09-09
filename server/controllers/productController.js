import Product from '../models/Product.js';

// ─── GET /api/products  ───────────────────────────────────────────────────────
export const getAllProducts = async (req, res) => {
    try {
        const { category, search, sellerOnly, page = 1, limit = 50 } = req.query;
        const filter = { isActive: true };

        if (category) filter.category = category;
        if (search) filter.title = { $regex: search, $options: 'i' };
        if (sellerOnly === 'true') filter.seller = { $exists: true, $ne: null };

        const skip = (Number(page) - 1) * Number(limit);
        const [products, total] = await Promise.all([
            Product.find(filter)
                .populate('seller', 'name email phone role address')
                .skip(skip)
                .limit(Number(limit))
                .sort({ createdAt: -1 }),
            Product.countDocuments(filter),
        ]);

        res.json({ success: true, products, total, page: Number(page) });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ─── GET /api/products/:id ────────────────────────────────────────────────────
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product)
            return res.status(404).json({ success: false, message: 'Product not found' });
        res.json({ success: true, product });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ─── POST /api/products  (auth: seller) ──────────────────────────────────────
export const createProduct = async (req, res) => {
    try {
        const sellerId = req.auth.userId;
        const product = await Product.create({ ...req.body, seller: sellerId });
        res.status(201).json({ success: true, product });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// ─── PUT /api/products/:id  (auth: seller owns product) ──────────────────────
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product)
            return res.status(404).json({ success: false, message: 'Product not found' });
        if (product.seller !== req.auth.userId)
            return res.status(403).json({ success: false, message: 'Not authorized' });

        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, product: updated });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// ─── DELETE /api/products/:id  (auth: seller owns product) ───────────────────
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product)
            return res.status(404).json({ success: false, message: 'Product not found' });
        if (product.seller !== req.auth.userId)
            return res.status(403).json({ success: false, message: 'Not authorized' });

        await Product.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
