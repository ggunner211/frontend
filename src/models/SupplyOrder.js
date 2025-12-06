const mongoose = require('mongoose');

const supplyOrderSchema = new mongoose.Schema({
  numeroOrdem: {
    type: String,
    required: true,
    unique: true,
  },
  tecnico: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  supplies: [{
    supply: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supply',
    },
    quantidade: Number,
  }],
  os: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OS',
  },
  dataRequisicao: {
    type: Date,
    default: Date.now,
  },
  dataPrevista: Date,
  dataRecebimento: Date,
  status: {
    type: String,
    enum: ['pendente', 'enviado', 'recebido', 'cancelado'],
    default: 'pendente',
  },
  observacoes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SupplyOrder', supplyOrderSchema);
