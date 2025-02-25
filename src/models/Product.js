import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true },
    thumbnails: { type: [String], default: [] }  // Array de URLs de imágenes
});

const Product = mongoose.model('Product', productSchema);

export default Product;
