const mongoose = require('mongoose');

const osSchema = new mongoose.Schema({
  numeroOS: {
    type: String,
    required: true,
    unique: true,
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  maquina: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine',
    required: true,
  },
  tecnico: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  descricaoProblema: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,
    enum: ['locada', 'avulso'],
    required: true,
  },
  status: {
    type: String,
    enum: ['aberta', 'aceita', 'em_atendimento', 'finalizada', 'cancelada'],
    default: 'aberta',
  },
  prioridade: {
    type: String,
    enum: ['baixa', 'media', 'alta', 'urgente'],
    default: 'media',
  },
  carro: String,
  dataAbertura: {
    type: Date,
    default: Date.now,
  },
  dataAceitacao: Date,
  dataFinalizacao: Date,
  assinatura: String, // URL ou base64 da assinatura do cliente
  anotacoes: String,
  pedasSolicitadas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supply',
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

module.exports = mongoose.model('OS', osSchema);
