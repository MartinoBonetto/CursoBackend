// controllers/cartController.js
import Cart from '../models/Cart.js'; // Asegúrate de importar el modelo de carrito
import Product from '../models/Product.js'; // Asegúrate de importar el modelo de producto

// Eliminar un producto de un carrito
export const removeProductFromCartById = async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
        }

        const productIndex = cart.products.indexOf(pid);
        if (productIndex === -1) {
            return res.status(404).send({ status: 'error', message: 'Producto no encontrado en el carrito' });
        }

        cart.products.splice(productIndex, 1); // Eliminar el producto del carrito
        await cart.save();
        res.status(200).send({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
};

// Actualizar la cantidad de un producto en el carrito
export const updateProductQuantityInCart = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
        }

        const product = cart.products.find(p => p.toString() === pid);
        if (!product) {
            return res.status(404).send({ status: 'error', message: 'Producto no encontrado en el carrito' });
        }

        // Actualizar la cantidad de producto (lógica no mostrada)
        // Debes implementar la lógica según tus necesidades

        await cart.save();
        res.status(200).send({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
};

export const clearAllProductsFromCart = async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
        }

        cart.products = []; // Vaciar todos los productos del carrito
        await cart.save();
        res.status(200).send({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
};


// Actualizar todos los productos de un carrito
export const updateCart = async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;

    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
        }

        cart.products = products; // Actualiza todos los productos
        await cart.save();
        res.status(200).send({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
};
