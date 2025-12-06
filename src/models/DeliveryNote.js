const mongoose = require('mongoose');

const deliveryNoteSchema = new mongoose.Schema({
  numeroNota: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  descricao: {
    type: String,
    required: true,
  },
  supplyOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SupplyOrder',
  },
  itens: [{
    supply: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supply',
      required: true,
    },
    quantidade: {
      type: Number,
      required: true,
    },
    valorUnitario: Number,
    observacao: String,
  }],
  cliente: {
    type: String,
    required: true,
  },
  fornecedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
  },
  dataCriacao: {
    type: Date,
    default: Date.now,
    index: true,
  },
  dataEntrega: Date,
  dataConfirmacao: Date,
  assinadoPor: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ['rascunho', 'enviada', 'entregue', 'confirmada', 'cancelada'],
    default: 'rascunho',
    index: true,
  },
  observacoes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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

// Gerar número sequencial da nota
deliveryNoteSchema.pre('save', async function(next) {
  if (this.isNew && !this.numeroNota) {
    const lastNote = await mongoose.model('DeliveryNote').findOne().sort({ createdAt: -1 });
    const lastNumber = lastNote ? parseInt(lastNote.numeroNota.split('/')[0]) : 0;
    const newNumber = lastNumber + 1;
    const year = new Date().getFullYear();
    this.numeroNota = `${String(newNumber).padStart(5, '0')}/${year}`;
  }
  next();
});

module.exports = mongoose.model('DeliveryNote', deliveryNoteSchema);
