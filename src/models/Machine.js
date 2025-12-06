const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
  patrimonio: {
    type: String,
    required: true,
    unique: true,
  },
  numeroSerie: {
    type: String,
    required: true,
    unique: true,
  },
  modelo: String,
  marca: String,
  chaveCliente: String, // Para integração com DOCMPS
  contadorAtual: {
    type: Number,
    default: 0,
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  contrato: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract',
  },
  localizacao: String,
  departamento: String,
  statusMaquina: {
    type: String,
    enum: ['ativa', 'manutencao', 'inativa'],
    default: 'ativa',
  },
  ultimaVerificacao: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Machine', machineSchema);
