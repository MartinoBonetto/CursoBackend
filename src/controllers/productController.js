import Product from '../models/Product.js';

export const getAllProducts = async (req, res) => {
    const { limit = 10, page = 1, query, sort = '' } = req.query;

    try {
        let filter = {};
        if (query) {
            filter = { $or: [{ category: query }, { status: query === 'true' }] }; // Busqueda por categoría o disponibilidad
        }

        const products = await Product.paginate(filter, {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
        });

        res.json({
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/products?page=${products.prevPage}&limit=${limit}&sort=${sort}&query=${query}` : null,
            nextLink: products.hasNextPage ? `/products?page=${products.nextPage}&limit=${limit}&sort=${sort}&query=${query}` : null,
        });
    } catch (error) {
        res.json({ status: 'error', message: error.message });
    }
};
