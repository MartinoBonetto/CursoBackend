import { Router } from 'express';
import { createNewCart, addProductToCartById, removeProductFromCartById, clearAllProductsFromCart } from '../controllers/cartController.js';

const cartRouter = Router();

cartRouter.post('/', createNewCart);
cartRouter.post('/:cid/product/:pid', addProductToCartById);
cartRouter.delete('/:cid/products/:pid', removeProductFromCartById);
cartRouter.delete('/:cid', clearAllProductsFromCart);

export default cartRouter;
