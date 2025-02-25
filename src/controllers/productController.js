import Product from '../models/Product.js';

export const getAllProducts = async (req, res) => {
    const { limit = 10, page = 1, query, sort = '' } = req.query;

    try {
        let filter = {};
        if (query) {
            filter = { category: query };
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
            prevLink: products.hasPrevPage ? `/products?page=${products.prevPage}` : null,
            nextLink: products.hasNextPage ? `/products?page=${products.nextPage}` : null,
        });
    } catch (error) {
        res.json({ status: 'error', message: error.message });
    }
};

export const createProduct = async (req, res) => {
    const { title, description, price, category, stock, status, code } = req.body;

    try {
        const newProduct = new Product({
            title,
            description,
            price,
            category,
            stock,
            status,
            code,
        });

        await newProduct.save();
        res.json({ status: 'success', payload: newProduct });
    } catch (error) {
        res.json({ status: 'error', message: error.message });
    }
};

export const updateProductById = async (req, res) => {
    const { pid } = req.params;
    const updatedProduct = req.body;

    try {
        const product = await Product.findByIdAndUpdate(pid, updatedProduct, { new: true });
        res.json({ status: 'success', payload: product });
    } catch (error) {
        res.json({ status: 'error', message: error.message });
    }
};

export const deleteProductById = async (req, res) => {
    const { pid } = req.params;

    try {
        await Product.findByIdAndDelete(pid);
        res.json({ status: 'success', message: 'Product deleted' });
    } catch (error) {
        res.json({ status: 'error', message: error.message });
    }
};
