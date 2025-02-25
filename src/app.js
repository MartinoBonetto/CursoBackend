import express from 'express';
import expressHandlebars from 'express-handlebars';
import { Server as SocketServer } from 'socket.io';
import productRouter from './routers/productRouter.js';
import cartRouter from './routers/cartRouter.js';
import connectDB from './config.js';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Obtener la ruta del directorio de trabajo en un módulo ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración del servidor Express
const app = express();
const httpServer = createServer(app);
const io = new SocketServer(httpServer);

// Conectar a MongoDB
connectDB();

// Configuración de Handlebars
const hbs = expressHandlebars.create(); // Crea una instancia de Handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Configura la carpeta de vistas
app.set('views', path.join(__dirname, 'views'));

// Sirve archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de productos y carritos
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

// Rutas de vistas
app.use('/products', (req, res) => res.render('index'));  // Renderiza la vista 'index'
app.use('/realtimeproducts', (req, res) => res.render('realTimeProducts'));  // Renderiza la vista 'realTimeProducts'

// Conexión de WebSocket
io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Escuchar eventos para agregar productos
    socket.on('addProduct', (product) => {
        console.log('Producto agregado:', product);

        // Emitir el evento para actualizar la lista de productos
        io.emit('updateProducts', product);
    });

    // Escuchar eventos para eliminar productos
    socket.on('deleteProduct', (productId) => {
        console.log('Producto eliminado:', productId);

        // Emitir el evento para eliminar el producto de la lista
        io.emit('productDeleted', productId);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Arrancar servidor en el puerto 8080
const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
