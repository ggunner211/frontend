const Contract = require('../models/Contract');

exports.createContract = async (req, res) => {
  try {
    const contract = await Contract.create(req.body);
    const populated = await contract
      .populate('cliente')
      .populate('maquinas')
      .execPopulate();
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllContracts = async (req, res) => {
  try {
    const contracts = await Contract.find({ ativo: true })
      .populate('cliente')
      .populate('maquinas');
    res.status(200).json(contracts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getContractById = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate('cliente')
      .populate('maquinas');
    if (!contract) {
      return res.status(404).json({ message: 'Contrato não encontrado' });
    }
    res.status(200).json(contract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateContract = async (req, res) => {
  try {
    const contract = await Contract.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    ).populate('cliente').populate('maquinas');

    if (!contract) {
      return res.status(404).json({ message: 'Contrato não encontrado' });
    }

    res.status(200).json(contract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteContract = async (req, res) => {
  try {
    await Contract.findByIdAndUpdate(req.params.id, { ativo: false });
    res.status(200).json({ message: 'Contrato desativado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getContractsByClient = async (req, res) => {
  try {
    const contracts = await Contract.find({ 
      cliente: req.params.clienteId,
      ativo: true 
    }).populate('cliente').populate('maquinas');
    res.status(200).json(contracts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
