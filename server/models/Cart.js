import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    qty: { type: Number, default: 1, min: 1 },
});

const cartSchema = new mongoose.Schema({
    user: { type: String, ref: 'User', required: true, unique: true },  // Clerk user ID
    items: [cartItemSchema],
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
