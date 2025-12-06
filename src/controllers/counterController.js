const Counter = require('../models/Counter');
const Machine = require('../models/Machine');
const { getContadorEquipamento, getContadoresCliente } = require('../config/docmps-api');

exports.createCounter = async (req, res) => {
  try {
    const counter = await Counter.create(req.body);
    await counter.populate('maquina');
    res.status(201).json(counter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllCounters = async (req, res) => {
  try {
    const counters = await Counter.find().populate('maquina');
    res.status(200).json(counters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCountersByMachine = async (req, res) => {
  try {
    const counters = await Counter.find({ maquina: req.params.machineId })
      .populate('maquina')
      .sort({ data: -1 });
    res.status(200).json(counters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.fetchCountersFromAPI = async (req, res) => {
  try {
    const { machineId } = req.params;
    const machine = await Machine.findById(machineId);

    if (!machine) {
      return res.status(404).json({ message: 'Máquina não encontrada' });
    }

    const apiData = await getContadorEquipamento(
      machine.numeroSerie,
      machine.chaveCliente
    );

    if (apiData.status !== 'sucess') {
      return res.status(400).json({ message: 'Erro ao buscar da API' });
    }

    // Estrutura os dados de contadores
    const contadores = {};
    apiData.dados.forEach(item => {
      contadores[item.descricao] = parseInt(item.contador);
    });

    const counter = await Counter.create({
      maquina: machineId,
      contadores,
      coletadoEmApi: true,
    });

    // Atualiza contador atual da máquina
    await Machine.findByIdAndUpdate(machineId, {
      contadorAtual: contadores.life || 0,
      ultimaVerificacao: new Date(),
    });

    await counter.populate('maquina');
    res.status(201).json(counter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.generateMonthlyReport = async (req, res) => {
  try {
    const { clienteId, mes } = req.params;
    
    // Busca todas as máquinas do cliente
    const machines = await Machine.find({ cliente: clienteId });
    
    // Para cada máquina, busca contadores do mês
    const report = [];
    for (const machine of machines) {
      const counters = await Counter.find({
        maquina: machine._id,
        data: {
          $gte: new Date(mes + '-01'),
          $lt: new Date(mes + '-32'),
        },
      }).sort({ data: 1 });

      if (counters.length > 0) {
        const first = counters[0];
        const last = counters[counters.length - 1];

        report.push({
          maquina: machine.patrimonio,
          numeroSerie: machine.numeroSerie,
          contadorInicial: first.contadores.life || 0,
          contadorFinal: last.contadores.life || 0,
          paginasUsadas: (last.contadores.life || 0) - (first.contadores.life || 0),
        });
      }
    }

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
