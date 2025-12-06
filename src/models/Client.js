const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  cnpj: {
    type: String,
    required: true,
    unique: true,
  },
  email: String,
  telefone: String,
  endereco: String,
  cidade: String,
  estado: String,
  cep: String,
  contato: String,
  ativo: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Client', clientSchema);
