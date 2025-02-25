import express from 'express';
import Cart from '../models/Cart.js';  // Asegúrate de tener un modelo Cart

const router = express.Router();

// Ruta para obtener todos los productos en el carrito
router.get('/:cartId', async (req, res) => {
    const { cartId } = req.params;
    
    try {
        const cart = await Cart.findById(cartId).populate('products.product');
        res.json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).send('Error al obtener el carrito.');
    }
});

// Ruta para agregar un producto al carrito
router.post('/:cartId/product/:productId', async (req, res) => {
    const { cartId, productId } = req.params;
    
    try {
        let cart = await Cart.findById(cartId);
        if (!cart) {
            cart = new Cart({ _id: cartId, products: [] });
        }

        const existingProduct = cart.products.find(p => p.product.toString() === productId);
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }
        
        await cart.save();
        res.status(201).json(cart);
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).send('Error al agregar el producto al carrito.');
    }
});

export default router;
