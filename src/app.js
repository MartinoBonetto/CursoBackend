// Este es tu archivo principal donde se configura el servidor Express

import express from 'express';
import expressHandlebars from 'express-handlebars';
import mongoose from 'mongoose';
import { Server as SocketServer } from 'socket.io';
import productRouter from './routers/productRouter.js';
import cartRouter from './routers/cartRouter.js';
import connectDB from './config.js';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Product from './models/Product.js'; // Asegúrate de importar el modelo Product

// Obtener la ruta del directorio de trabajo en un módulo ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración del servidor Express
const app = express();
const httpServer = createServer(app);
const io = new SocketServer(httpServer); // Esta es la instancia de Socket.IO

// Conectar a MongoDB
connectDB();

// Configuración de Handlebars con Helper
const hbs = expressHandlebars.create({
    helpers: {
        getFirstThumbnail: (thumbnails) => {
            if (Array.isArray(thumbnails) && thumbnails.length > 0) {
                return thumbnails[0];
            }
            return '';
        }
    }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Configuración de rutas y vistas
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para manejar datos JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de productos y carritos
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

// Conexión de WebSocket
io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado');
    
    // Evento para agregar producto
    socket.on('addProduct', (product) => {
        console.log('Producto agregado:', product);
        io.emit('productAdded', product); // Emitir a todos los clientes que se ha agregado un producto
    });

    // Evento para eliminar producto
    socket.on('deleteProduct', (productId) => {
        console.log('Producto eliminado:', productId);
        io.emit('productRemoved', productId); // Emitir a todos los clientes que se ha eliminado un producto
    });

    // Evento para cuando un producto es eliminado del carrito
    socket.on('productRemovedFromCart', (productId) => {
        io.emit('productRemoved', productId); // Emitir a todos los clientes que se eliminó un producto del carrito
    });

    socket.on('disconnect', () => {
        console.log('Un usuario se ha desconectado');
    });
});

// Ruta para obtener productos con paginación
app.get('/products', async (req, res) => {
    const { page = 1, limit = 10, sort = 'asc', query = '' } = req.query;
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

        res.render('index', {
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

// Inicia el servidor en el puerto 8080
const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
