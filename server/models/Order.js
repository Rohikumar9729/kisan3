import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    Quantity: { type: Number, required: true, default: 1 },
    amount: { type: Number, required: true },
    DeliveryAddress: { type: String, required: true },
    showDeliveryTime: { type: Date },
    isPaid: { type: Boolean, default: false },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentMethod: { type: String, default: 'COD' },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;
