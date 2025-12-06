const mongoose = require('mongoose');
const mockDatabase = require('./mockDatabase');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aura', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 3000, // Timeout rápido
    });
    console.log(`✓ MongoDB conectado: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`⚠️  Não foi possível conectar ao MongoDB: ${error.message}`);
    console.log('💡 Usando banco de dados em memória (Mock) para testes...');
    console.log('📝 Quando MongoDB estiver disponível, os dados serão persistidos.\n');
    return { mock: true, data: mockDatabase };
  }
};

module.exports = connectDB;

