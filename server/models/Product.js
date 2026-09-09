import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    overview: { type: String, default: '' },
    poster_path: { type: String, default: '' },
    backdrop_path: { type: String, default: '' },
    seed: [
        {
            id: { type: Number },
            name: { type: String }
        }
    ],
    price: { type: String, required: true },
    dummyprice: { type: String, default: '' },
    tagline: { type: String, default: '' },
    vote_average: { type: Number, default: 0 },
    vote_count: { type: Number, default: 0 },
    category: { type: String, default: 'Seeds' },
    quantity: { type: Number, default: 0 },
    unit: { type: String, default: 'kg' },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
