const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
  mes: {
    type: Date,
    required: true,
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  contrato: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract',
    required: true,
  },
  maquinas: [{
    maquina: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Machine',
    },
    contadorInicial: Number,
    contadorFinal: Number,
    paginasUsadas: Number,
    valorBase: Number,
    valorExcedente: Number,
  }],
  valorTotal: Number,
  status: {
    type: String,
    enum: ['rascunho', 'gerado', 'enviado', 'pago', 'cancelado'],
    default: 'rascunho',
  },
  boleto: {
    numero: String,
    dataVencimento: Date,
    dataPagamento: Date,
    urlBoleto: String,
  },
  despesas: [{
    descricao: String,
    valor: Number,
    categoria: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Billing', billingSchema);
