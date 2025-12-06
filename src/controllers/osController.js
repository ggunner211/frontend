const OS = require('../models/OS');
const Machine = require('../models/Machine');

exports.createOS = async (req, res) => {
  try {
    const { numeroOS, cliente, maquina, descricaoProblema, tipo } = req.body;

    const os = await OS.create({
      numeroOS,
      cliente,
      maquina,
      descricaoProblema,
      tipo,
    });

    await os.populate('cliente').populate('maquina').populate('tecnico');
    res.status(201).json(os);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOS = async (req, res) => {
  try {
    const os = await OS.find()
      .populate('cliente')
      .populate('maquina')
      .populate('tecnico');
    res.status(200).json(os);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOSById = async (req, res) => {
  try {
    const os = await OS.findById(req.params.id)
      .populate('cliente')
      .populate('maquina')
      .populate('tecnico')
      .populate('pedasSolicitadas');
    if (!os) {
      return res.status(404).json({ message: 'OS não encontrada' });
    }
    res.status(200).json(os);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOS = async (req, res) => {
  try {
    const os = await OS.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    ).populate('cliente').populate('maquina').populate('tecnico');

    if (!os) {
      return res.status(404).json({ message: 'OS não encontrada' });
    }

    res.status(200).json(os);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteOS = async (req, res) => {
  try {
    const os = await OS.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelada' }
    );
    if (!os) {
      return res.status(404).json({ message: 'OS não encontrada' });
    }
    res.status(200).json({ message: 'OS cancelada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.assignTechnician = async (req, res) => {
  try {
    const { tecnicoId } = req.body;
    const os = await OS.findByIdAndUpdate(
      req.params.id,
      { tecnico: tecnicoId, status: 'aceita' },
      { new: true }
    ).populate('cliente').populate('maquina').populate('tecnico');

    res.status(200).json(os);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPendingOSByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const os = await OS.find({ 
      status: { $in: ['aberta', 'aceita'] },
      $or: [
        { tecnico: null },
        { status: 'aceita' }
      ]
    }).populate({
      path: 'tecnico',
      match: { city: city }
    }).populate('cliente').populate('maquina');

    const filtered = os.filter(item => item.tecnico !== null || item.status === 'aberta');
    res.status(200).json(filtered);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.finishOS = async (req, res) => {
  try {
    const { assinatura } = req.body;
    const os = await OS.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'finalizada',
        dataFinalizacao: new Date(),
        assinatura
      },
      { new: true }
    ).populate('cliente').populate('maquina').populate('tecnico');

    res.status(200).json(os);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
