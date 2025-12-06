const Billing = require('../models/Billing');
const Counter = require('../models/Counter');
const Contract = require('../models/Contract');

exports.createBilling = async (req, res) => {
  try {
    const billing = await Billing.create(req.body);
    await billing.populate('cliente').populate('contrato').populate('maquinas.maquina');
    res.status(201).json(billing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.generateMonthlyBilling = async (req, res) => {
  try {
    const { contratoId, mes } = req.body;
    const contract = await Contract.findById(contratoId)
      .populate('cliente')
      .populate('maquinas');

    if (!contract) {
      return res.status(404).json({ message: 'Contrato não encontrado' });
    }

    const maquinasData = [];
    let valorTotal = contract.valorMensal || 0;

    for (const maquina of contract.maquinas) {
      const counters = await Counter.find({
        maquina: maquina._id,
        data: {
          $gte: new Date(mes + '-01'),
          $lt: new Date(new Date(mes + '-01').getTime() + 31 * 24 * 60 * 60 * 1000),
        },
      }).sort({ data: 1 });

      let valorExcedente = 0;
      if (counters.length >= 2) {
        const first = counters[0];
        const last = counters[counters.length - 1];
        const paginasUsadas = (last.contadores.life || 0) - (first.contadores.life || 0);
        
        if (paginasUsadas > 0) {
          valorExcedente = paginasUsadas * (contract.excedentes || 0);
          valorTotal += valorExcedente;
        }

        maquinasData.push({
          maquina: maquina._id,
          contadorInicial: first.contadores.life || 0,
          contadorFinal: last.contadores.life || 0,
          paginasUsadas,
          valorBase: contract.valorMensal / contract.maquinas.length,
          valorExcedente,
        });
      }
    }

    const billing = await Billing.create({
      mes: new Date(mes),
      cliente: contract.cliente._id,
      contrato: contratoId,
      maquinas: maquinasData,
      valorTotal,
      status: 'gerado',
    });

    await billing.populate('cliente').populate('contrato').populate('maquinas.maquina');
    res.status(201).json(billing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllBillings = async (req, res) => {
  try {
    const billings = await Billing.find()
      .populate('cliente')
      .populate('contrato')
      .populate('maquinas.maquina');
    res.status(200).json(billings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBillingById = async (req, res) => {
  try {
    const billing = await Billing.findById(req.params.id)
      .populate('cliente')
      .populate('contrato')
      .populate('maquinas.maquina');
    if (!billing) {
      return res.status(404).json({ message: 'Faturamento não encontrado' });
    }
    res.status(200).json(billing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBilling = async (req, res) => {
  try {
    const billing = await Billing.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    ).populate('cliente').populate('contrato').populate('maquinas.maquina');

    if (!billing) {
      return res.status(404).json({ message: 'Faturamento não encontrado' });
    }

    res.status(200).json(billing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBillingsByClient = async (req, res) => {
  try {
    const billings = await Billing.find({ cliente: req.params.clienteId })
      .populate('cliente')
      .populate('contrato')
      .populate('maquinas.maquina');
    res.status(200).json(billings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
