const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  maquina: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine',
    required: true,
  },
  data: {
    type: Date,
    default: Date.now,
  },
  contadores: {
    life: Number,
    total_mono: Number,
    total_color: Number,
    scan: Number,
    copy: Number,
    print: Number,
    a3: Number,
    a3_color: Number,
    a3_mono: Number,
    a4: Number,
    a4_color: Number,
    a4_mono: Number,
  },
  coletadoEmApi: {
    type: Boolean,
    default: false,
  },
  observacoes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Counter', counterSchema);
