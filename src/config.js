import mongoose from 'mongoose';

// Función para conectar a la base de datos de MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/miBaseDeDatos'); // Ya no es necesario pasar las opciones
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
    }
};

export default connectDB;
