const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  numeroContrato: {
    type: String,
    required: true,
    unique: true,
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  maquinas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine',
  }],
  dataInicio: {
    type: Date,
    required: true,
  },
  dataFim: Date,
  valorMensal: Number,
  excedentes: {
    type: Number,
    default: 0, // Valor cobrado por página excedente
  },
  departamentos: [String],
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

module.exports = mongoose.model('Contract', contractSchema);
