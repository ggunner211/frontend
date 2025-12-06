const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Carregar variáveis de ambiente
dotenv.config();

// Conectar ao MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/machines', require('./routes/machines'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/contracts', require('./routes/contracts'));
app.use('/api/os', require('./routes/os'));
app.use('/api/supplies', require('./routes/supplies'));
app.use('/api/delivery-notes', require('./routes/deliveryNotes'));
app.use('/api/counters', require('./routes/counters'));
app.use('/api/billings', require('./routes/billings'));
app.use('/api/users', require('./routes/users'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AURA API is running' });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({ message: 'AURA - Sistema de Gestão de Aluguel de Impressoras' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`AURA Backend rodando na porta ${PORT}`);
});

module.exports = app;
