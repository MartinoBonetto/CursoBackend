import Cart from '../models/Cart.js';

export const createNewCart = async (req, res) => {
    try {
        const newCart = new Cart({ products: [] });
        await newCart.save();
        res.json({ status: 'success', payload: newCart });
    } catch (error) {
        res.json({ status: 'error', message: error.message });
    }
};

export const addProductToCartById = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await Cart.findById(cid);
        cart.products.push({ product: pid, quantity });
        await cart.save();
        res.json({ status: 'success', message: 'Product added to cart' });
    } catch (error) {
        res.json({ status: 'error', message: error.message });
    }
};

export const removeProductFromCartById = async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const cart = await Cart.findById(cid);
        cart.products = cart.products.filter(product => product.product.toString() !== pid);
        await cart.save();
        res.json({ status: 'success', message: 'Product removed from cart' });
    } catch (error) {
        res.json({ status: 'error', message: error.message });
    }
};

export const clearAllProductsFromCart = async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await Cart.findById(cid);
        cart.products = [];
        await cart.save();
        res.json({ status: 'success', message: 'All products cleared from cart' });
    } catch (error) {
        res.json({ status: 'error', message: error.message });
    }
};
