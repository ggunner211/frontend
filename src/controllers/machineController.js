const Machine = require('../models/Machine');
const { getContadorEquipamento } = require('../config/docmps-api');

exports.createMachine = async (req, res) => {
  try {
    const { patrimonio, numeroSerie, modelo, marca, cliente, chaveCliente } = req.body;

    const machine = await Machine.create({
      patrimonio,
      numeroSerie,
      modelo,
      marca,
      cliente,
      chaveCliente,
    });

    res.status(201).json(machine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllMachines = async (req, res) => {
  try {
    const machines = await Machine.find().populate('cliente').populate('contrato');
    res.status(200).json(machines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMachineById = async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id)
      .populate('cliente')
      .populate('contrato');
    if (!machine) {
      return res.status(404).json({ message: 'Máquina não encontrada' });
    }
    res.status(200).json(machine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMachine = async (req, res) => {
  try {
    const machine = await Machine.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    ).populate('cliente').populate('contrato');

    if (!machine) {
      return res.status(404).json({ message: 'Máquina não encontrada' });
    }

    res.status(200).json(machine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMachine = async (req, res) => {
  try {
    const machine = await Machine.findByIdAndDelete(req.params.id);
    if (!machine) {
      return res.status(404).json({ message: 'Máquina não encontrada' });
    }
    res.status(200).json({ message: 'Máquina deletada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMachinesByClient = async (req, res) => {
  try {
    const machines = await Machine.find({ cliente: req.params.clienteId })
      .populate('cliente')
      .populate('contrato');
    res.status(200).json(machines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
