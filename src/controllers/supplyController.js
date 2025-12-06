const Supply = require('../models/Supply');
const SupplyOrder = require('../models/SupplyOrder');

exports.createSupply = async (req, res) => {
  try {
    const supply = await Supply.create(req.body);
    await supply.populate('fornecedor');
    res.status(201).json(supply);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllSupplies = async (req, res) => {
  try {
    const supplies = await Supply.find().populate('fornecedor');
    res.status(200).json(supplies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSupplyById = async (req, res) => {
  try {
    const supply = await Supply.findById(req.params.id).populate('fornecedor');
    if (!supply) {
      return res.status(404).json({ message: 'Peça não encontrada' });
    }
    res.status(200).json(supply);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSupply = async (req, res) => {
  try {
    const supply = await Supply.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    ).populate('fornecedor');

    if (!supply) {
      return res.status(404).json({ message: 'Peça não encontrada' });
    }

    res.status(200).json(supply);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteSupply = async (req, res) => {
  try {
    await Supply.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Peça deletada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.requestSupply = async (req, res) => {
  try {
    const { tecnicoId, supplies, osId } = req.body;

    const supplyOrder = await SupplyOrder.create({
      numeroOrdem: `SOL-${Date.now()}`,
      tecnico: tecnicoId,
      supplies,
      os: osId,
    });

    await supplyOrder.populate('tecnico').populate('supplies.supply');
    res.status(201).json(supplyOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSupplyOrders = async (req, res) => {
  try {
    const orders = await SupplyOrder.find()
      .populate('tecnico')
      .populate('supplies.supply')
      .populate('os');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSupplyOrder = async (req, res) => {
  try {
    const order = await SupplyOrder.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    ).populate('tecnico').populate('supplies.supply').populate('os');

    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
