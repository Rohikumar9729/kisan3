import Product from '../models/Product.js';

const INITIAL_PRODUCTS = [
    {
        title: 'Certified Rice Seeds (Basmati 1121)',
        overview: 'Premium high-yielding certified Basmati rice seeds suitable for Kharif season. Drought resistant with superior grain length and excellent cooking aroma.',
        poster_path: 'https://m.media-amazon.com/images/I/81Voy6TeZtL._AC_UF1000,1000_QL80_.jpg',
        backdrop_path: 'https://m.media-amazon.com/images/I/81Voy6TeZtL._AC_UF1000,1000_QL80_.jpg',
        price: '₹60',
        dummyprice: '₹120',
        category: 'Seeds',
        quantity: 500,
        unit: 'kg',
        tagline: 'High Yielding Certified Basmati',
        vote_average: 4.8,
        vote_count: 142,
    },
    {
        title: 'Hybrid Pumpkin Seeds',
        overview: 'Nutritious and high-germination hybrid pumpkin seeds. Fast growing vines yielding uniform, bright orange pumpkins rich in nutrients.',
        poster_path: 'https://www.mevabite.com/cdn/shop/articles/natural-pumpkin-seeds.jpg?v=1725512969',
        backdrop_path: 'https://www.mevabite.com/cdn/shop/articles/natural-pumpkin-seeds.jpg?v=1725512969',
        price: '₹50',
        dummyprice: '₹100',
        category: 'Seeds',
        quantity: 200,
        unit: 'kg',
        tagline: 'High Germination Hybrid Seeds',
        vote_average: 4.9,
        vote_count: 88,
    },
    {
        title: 'G-4 Green Chilly Seeds',
        overview: 'Spicy, disease-tolerant pungent green chilli seeds. Early fruiting variety with continuous harvest potential across tropical climates.',
        poster_path: 'https://www.pepperhub.in/wp-content/uploads/2023/08/green-chilli-seeds.webp',
        backdrop_path: 'https://www.pepperhub.in/wp-content/uploads/2023/08/green-chilli-seeds.webp',
        price: '₹90',
        dummyprice: '₹180',
        category: 'Seeds',
        quantity: 150,
        unit: 'kg',
        tagline: 'High Heat Early Fruiting Variety',
        vote_average: 4.7,
        vote_count: 95,
    },
    {
        title: 'Sharbati Wheat Seeds (Certified Grade A)',
        overview: 'Globally renowned golden Sharbati wheat grain seeds. Rich in gluten and carbohydrates, ideal for premium golden flour and high crop yield.',
        poster_path: 'https://5.imimg.com/data5/BZ/VF/EL/SELLER-75729806/wheat.jpg',
        backdrop_path: 'https://5.imimg.com/data5/BZ/VF/EL/SELLER-75729806/wheat.jpg',
        price: '₹40',
        dummyprice: '₹80',
        category: 'Grains',
        quantity: 1000,
        unit: 'kg',
        tagline: 'Pure Golden Harvest Seeds',
        vote_average: 4.9,
        vote_count: 230,
    },
    {
        title: 'Nasik Red Onion Seeds',
        overview: 'Finest Nasik red bulb onion seeds with tight skin, long storage shelf life, and robust resistance to purple blotch and pest attacks.',
        poster_path: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKDDyVHxrktD0CP9_QZ1j9LsH9q6ws77SGzA&s',
        backdrop_path: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKDDyVHxrktD0CP9_QZ1j9LsH9q6ws77SGzA&s',
        price: '₹100',
        dummyprice: '₹200',
        category: 'Seeds',
        quantity: 250,
        unit: 'kg',
        tagline: 'Long Shelf Life Nasik Variety',
        vote_average: 4.6,
        vote_count: 67,
    },
    {
        title: 'Snowball Cauliflower Seeds',
        overview: 'Pure white tight curd cauliflower seeds. High tolerance to temperature fluctuations, excellent uniform weight and crisp texture.',
        poster_path: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlZU4S9P54JNI2zcStNlacvUhPT9RVSA61xw&s',
        backdrop_path: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlZU4S9P54JNI2zcStNlacvUhPT9RVSA61xw&s',
        price: '₹40',
        dummyprice: '₹80',
        category: 'Seeds',
        quantity: 180,
        unit: 'kg',
        tagline: 'Compact Snow White Curds',
        vote_average: 4.8,
        vote_count: 54,
    },
    {
        title: 'Desi Chana (Gram) Seeds',
        overview: 'High-protein organic Desi chickpea/gram seeds. Natural drought tolerance, improves nitrogen fixation in soil, and guarantees robust harvests.',
        poster_path: 'https://tiimg.tistatic.com/fp/1/008/020/excellent-source-of-vitamin-b-complex-nutrition-dried-gram-seed--409.jpg',
        backdrop_path: 'https://tiimg.tistatic.com/fp/1/008/020/excellent-source-of-vitamin-b-complex-nutrition-dried-gram-seed--409.jpg',
        price: '₹90',
        dummyprice: '₹180',
        category: 'Grains',
        quantity: 400,
        unit: 'kg',
        tagline: 'Protein Rich Nitrogen-Fixing Crop',
        vote_average: 4.85,
        vote_count: 112,
    },
    {
        title: 'Kufri Jyoti Potato Seed Tubers',
        overview: 'Certified disease-free seed potato tubers. High bulking rate with oval shape, shallow eyes, and excellent cooking attributes.',
        poster_path: 'https://i0.wp.com/www.potatonewstoday.com/wp-content/uploads/2023/06/TPS-Kashmir.jpg?fit=1033%2C550&ssl=1',
        backdrop_path: 'https://i0.wp.com/www.potatonewstoday.com/wp-content/uploads/2023/06/TPS-Kashmir.jpg?fit=1033%2C550&ssl=1',
        price: '₹90',
        dummyprice: '₹180',
        category: 'Organic Produce',
        quantity: 600,
        unit: 'kg',
        tagline: 'Certified Disease-Free Tubers',
        vote_average: 4.75,
        vote_count: 98,
    },
];

export const seedInitialProducts = async () => {
    try {
        for (const item of INITIAL_PRODUCTS) {
            const existing = await Product.findOne({ title: item.title });
            if (!existing) {
                await Product.create(item);
            }
        }
    } catch (err) {
        console.error('Seed products error (non-fatal):', err.message);
    }
};

export default seedInitialProducts;
