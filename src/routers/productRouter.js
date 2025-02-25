import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Ruta para obtener productos con paginación
router.get('/', async (req, res) => {
    const { page = 1, limit = 10, sort = 'asc', query = '' } = req.query;

    // Configuración de filtros y paginación
    const filter = query ? { category: query } : {};
    const sortOption = sort === 'desc' ? { price: -1 } : { price: 1 };

    try {
        const products = await Product.find(filter)
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const totalCount = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalCount / limit);
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;
        const prevPage = hasPrevPage ? page - 1 : null;
        const nextPage = hasNextPage ? page + 1 : null;

        res.json({
            payload: products,
            totalPages,
            prevPage,
            nextPage,
            page: Number(page),
            hasPrevPage,
            hasNextPage,
            limit,
            sort,
            query
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Error al obtener los productos.');
    }
});

// Ruta para crear un producto
router.post('/', async (req, res) => {
    try {
        const { name, price, description, category, stock, thumbnails } = req.body;
        
        const newProduct = new Product({
            name,
            price,
            description,
            category,
            stock,
            thumbnails
        });
        
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).send('Error al crear el producto.');
    }
});

// Ruta para eliminar un producto
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).send('Producto no encontrado.');
        }
        res.json({ message: 'Producto eliminado exitosamente.' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send('Error al eliminar el producto.');
    }
});

export default router;
