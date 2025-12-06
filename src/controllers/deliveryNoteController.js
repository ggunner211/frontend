const DeliveryNote = require('../models/DeliveryNote');
const Supply = require('../models/Supply');
const SupplyOrder = require('../models/SupplyOrder');

exports.createDeliveryNote = async (req, res) => {
  try {
    const { itens, cliente, fornecedor, descricao, supplyOrder, observacoes } = req.body;

    // Validar itens
    if (!itens || itens.length === 0) {
      return res.status(400).json({ message: 'Nota deve conter pelo menos um item' });
    }

    // Validar supplies existem
    for (const item of itens) {
      const supply = await Supply.findById(item.supply);
      if (!supply) {
        return res.status(404).json({ message: `Peça ${item.supply} não encontrada` });
      }
    }

    const deliveryNote = new DeliveryNote({
      itens,
      cliente,
      fornecedor,
      descricao,
      supplyOrder,
      observacoes,
      createdBy: req.user.id,
      status: 'rascunho',
    });

    await deliveryNote.save();
    await deliveryNote.populate(['itens.supply', 'fornecedor', 'createdBy']);

    res.status(201).json({
      message: 'Nota de entrega criada com sucesso',
      data: deliveryNote,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllDeliveryNotes = async (req, res) => {
  try {
    const { status, cliente, dataInicio, dataFim } = req.query;
    let query = {};

    if (status) query.status = status;
    if (cliente) query.cliente = { $regex: cliente, $options: 'i' };
    if (dataInicio || dataFim) {
      query.dataCriacao = {};
      if (dataInicio) query.dataCriacao.$gte = new Date(dataInicio);
      if (dataFim) query.dataCriacao.$lte = new Date(dataFim);
    }

    const deliveryNotes = await DeliveryNote.find(query)
      .populate(['itens.supply', 'fornecedor', 'createdBy', 'updatedBy'])
      .sort({ dataCriacao: -1 });

    res.status(200).json({
      total: deliveryNotes.length,
      data: deliveryNotes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDeliveryNoteById = async (req, res) => {
  try {
    const deliveryNote = await DeliveryNote.findById(req.params.id)
      .populate(['itens.supply', 'fornecedor', 'createdBy', 'updatedBy']);

    if (!deliveryNote) {
      return res.status(404).json({ message: 'Nota de entrega não encontrada' });
    }

    res.status(200).json(deliveryNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDeliveryNoteByNumber = async (req, res) => {
  try {
    const deliveryNote = await DeliveryNote.findOne({ numeroNota: req.params.numeroNota })
      .populate(['itens.supply', 'fornecedor', 'createdBy', 'updatedBy']);

    if (!deliveryNote) {
      return res.status(404).json({ message: 'Nota de entrega não encontrada' });
    }

    res.status(200).json(deliveryNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDeliveryNote = async (req, res) => {
  try {
    const { itens, cliente, fornecedor, descricao, observacoes } = req.body;

    const deliveryNote = await DeliveryNote.findById(req.params.id);
    if (!deliveryNote) {
      return res.status(404).json({ message: 'Nota de entrega não encontrada' });
    }

    // Validar se pode atualizar (apenas em rascunho)
    if (deliveryNote.status !== 'rascunho') {
      return res.status(400).json({ message: 'Só é possível editar notas em rascunho' });
    }

    Object.assign(deliveryNote, {
      itens: itens || deliveryNote.itens,
      cliente: cliente || deliveryNote.cliente,
      fornecedor: fornecedor || deliveryNote.fornecedor,
      descricao: descricao || deliveryNote.descricao,
      observacoes: observacoes || deliveryNote.observacoes,
      updatedBy: req.user.id,
      updatedAt: new Date(),
    });

    await deliveryNote.save();
    await deliveryNote.populate(['itens.supply', 'fornecedor', 'createdBy', 'updatedBy']);

    res.status(200).json({
      message: 'Nota atualizada com sucesso',
      data: deliveryNote,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendDeliveryNote = async (req, res) => {
  try {
    const deliveryNote = await DeliveryNote.findById(req.params.id);
    if (!deliveryNote) {
      return res.status(404).json({ message: 'Nota de entrega não encontrada' });
    }

    if (deliveryNote.status !== 'rascunho') {
      return res.status(400).json({ message: 'Nota já foi enviada' });
    }

    deliveryNote.status = 'enviada';
    deliveryNote.updatedBy = req.user.id;
    deliveryNote.updatedAt = new Date();

    await deliveryNote.save();
    await deliveryNote.populate(['itens.supply', 'fornecedor', 'createdBy', 'updatedBy']);

    res.status(200).json({
      message: 'Nota enviada com sucesso',
      data: deliveryNote,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.confirmDeliveryNote = async (req, res) => {
  try {
    const { dataEntrega, assinadoPor } = req.body;

    const deliveryNote = await DeliveryNote.findById(req.params.id);
    if (!deliveryNote) {
      return res.status(404).json({ message: 'Nota de entrega não encontrada' });
    }

    if (deliveryNote.status === 'cancelada') {
      return res.status(400).json({ message: 'Nota cancelada não pode ser confirmada' });
    }

    deliveryNote.status = 'confirmada';
    deliveryNote.dataEntrega = dataEntrega || new Date();
    deliveryNote.dataConfirmacao = new Date();
    deliveryNote.assinadoPor = assinadoPor;
    deliveryNote.updatedBy = req.user.id;
    deliveryNote.updatedAt = new Date();

    // Atualizar SupplyOrder se vinculada
    if (deliveryNote.supplyOrder) {
      await SupplyOrder.findByIdAndUpdate(
        deliveryNote.supplyOrder,
        {
          status: 'recebido',
          dataRecebimento: new Date(),
        }
      );
    }

    await deliveryNote.save();
    await deliveryNote.populate(['itens.supply', 'fornecedor', 'createdBy', 'updatedBy']);

    res.status(200).json({
      message: 'Entrega confirmada com sucesso',
      data: deliveryNote,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markAsDelivered = async (req, res) => {
  try {
    const deliveryNote = await DeliveryNote.findById(req.params.id);
    if (!deliveryNote) {
      return res.status(404).json({ message: 'Nota de entrega não encontrada' });
    }

    if (deliveryNote.status === 'rascunho') {
      return res.status(400).json({ message: 'Envie a nota antes de marcar como entregue' });
    }

    deliveryNote.status = 'entregue';
    deliveryNote.dataEntrega = new Date();
    deliveryNote.updatedBy = req.user.id;
    deliveryNote.updatedAt = new Date();

    await deliveryNote.save();
    await deliveryNote.populate(['itens.supply', 'fornecedor', 'createdBy', 'updatedBy']);

    res.status(200).json({
      message: 'Nota marcada como entregue',
      data: deliveryNote,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelDeliveryNote = async (req, res) => {
  try {
    const { motivo } = req.body;

    const deliveryNote = await DeliveryNote.findById(req.params.id);
    if (!deliveryNote) {
      return res.status(404).json({ message: 'Nota de entrega não encontrada' });
    }

    if (deliveryNote.status === 'confirmada') {
      return res.status(400).json({ message: 'Nota confirmada não pode ser cancelada' });
    }

    deliveryNote.status = 'cancelada';
    deliveryNote.observacoes = `Cancelada - ${motivo || 'Sem motivo especificado'}`;
    deliveryNote.updatedBy = req.user.id;
    deliveryNote.updatedAt = new Date();

    await deliveryNote.save();
    await deliveryNote.populate(['itens.supply', 'fornecedor', 'createdBy', 'updatedBy']);

    res.status(200).json({
      message: 'Nota cancelada com sucesso',
      data: deliveryNote,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteDeliveryNote = async (req, res) => {
  try {
    const deliveryNote = await DeliveryNote.findById(req.params.id);
    if (!deliveryNote) {
      return res.status(404).json({ message: 'Nota de entrega não encontrada' });
    }

    // Apenas rascunhos podem ser deletados
    if (deliveryNote.status !== 'rascunho') {
      return res.status(400).json({ message: 'Apenas notas em rascunho podem ser deletadas' });
    }

    await DeliveryNote.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: 'Nota deletada com sucesso',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDeliveryNoteStats = async (req, res) => {
  try {
    const { dataInicio, dataFim } = req.query;
    let query = {};

    if (dataInicio || dataFim) {
      query.dataCriacao = {};
      if (dataInicio) query.dataCriacao.$gte = new Date(dataInicio);
      if (dataFim) query.dataCriacao.$lte = new Date(dataFim);
    }

    const stats = await DeliveryNote.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          quantidade: { $sum: 1 },
          valortotal: { $sum: { $sum: '$itens.valorUnitario' } },
        },
      },
    ]);

    const totalNotas = await DeliveryNote.countDocuments(query);

    res.status(200).json({
      totalNotas,
      porStatus: stats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
