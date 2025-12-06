const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  cnpj: String,
  email: String,
  telefone: String,
  endereco: String,
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

module.exports = mongoose.model('Supplier', supplierSchema);
