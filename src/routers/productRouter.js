import { Router } from 'express';
import { getAllProducts, createProduct, updateProductById, deleteProductById } from '../controllers/productController.js';

const productRouter = Router();

productRouter.get('/', getAllProducts);
productRouter.post('/', createProduct);
productRouter.put('/:pid', updateProductById);
productRouter.delete('/:pid', deleteProductById);

export default productRouter;
