const mongoose = require('mongoose');

const supplySchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,
    enum: ['toner', 'pecas', 'outros'],
    required: true,
  },
  descricao: String,
  fornecedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
  },
  quantidade: {
    type: Number,
    default: 0,
  },
  quantidadeMinima: Number,
  preco: Number,
  vidaUtil: Number, // em páginas/dias
  dataEntrada: Date,
  dataSaida: Date,
  status: {
    type: String,
    enum: ['em_estoque', 'solicitado', 'em_uso', 'descartado'],
    default: 'em_estoque',
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

module.exports = mongoose.model('Supply', supplySchema);
