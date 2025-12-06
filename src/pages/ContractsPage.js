import React, { useState, useEffect } from 'react';
import { contractService, clientService, machineService } from '../services/services';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

export const ContractsPage = () => {
  const [contracts, setContracts] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    numeroContrato: '',
    cliente: '',
    maquinas: [],
    dataInicio: '',
    dataFim: '',
    valorMensal: 0,
    excedentes: 0,
    departamentos: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [contRes, clientRes, machRes] = await Promise.all([
        contractService.getAll(),
        clientService.getAll(),
        machineService.getAll(),
      ]);
      setContracts(contRes.data);
      setClients(clientRes.data);
      setMachines(machRes.data);
    } catch (error) {
      console.error('Erro ao carregar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await contractService.create({
        ...formData,
        numeroContrato: `CT-${Date.now()}`,
        maquinas: formData.maquinas.split(',').filter(m => m.trim()),
        departamentos: formData.departamentos.split(',').filter(d => d.trim()),
        dataInicio: new Date(formData.dataInicio),
      });
      setFormData({
        numeroContrato: '',
        cliente: '',
        maquinas: [],
        dataInicio: '',
        dataFim: '',
        valorMensal: 0,
        excedentes: 0,
        departamentos: '',
      });
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error('Erro ao criar contrato:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza?')) {
      try {
        await contractService.delete(id);
        loadData();
      } catch (error) {
        console.error('Erro ao deletar:', error);
      }
    }
  };

  const getClientName = (clienteId) => {
    return clients.find(c => c._id === clienteId)?.nome || '-';
  };

  if (loading) return <div className="p-6">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contratos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <FiPlus /> Novo Contrato
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <select
                value={formData.cliente}
                onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                className="px-4 py-2 border rounded-lg"
                required
              >
                <option value="">Selecione um cliente</option>
                {clients.map(c => (
                  <option key={c._id} value={c._id}>{c.nome}</option>
                ))}
              </select>
              <input
                type="date"
                value={formData.dataInicio}
                onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                className="px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="date"
                value={formData.dataFim}
                onChange={(e) => setFormData({ ...formData, dataFim: e.target.value })}
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Valor Mensal"
                value={formData.valorMensal}
                onChange={(e) => setFormData({ ...formData, valorMensal: parseFloat(e.target.value) })}
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Valor Excedentes"
                value={formData.excedentes}
                onChange={(e) => setFormData({ ...formData, excedentes: parseFloat(e.target.value) })}
                className="px-4 py-2 border rounded-lg"
              />
              <textarea
                placeholder="Departamentos (separados por vírgula)"
                value={formData.departamentos}
                onChange={(e) => setFormData({ ...formData, departamentos: e.target.value })}
                className="px-4 py-2 border rounded-lg col-span-2"
                rows="2"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Criar Contrato
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">Número</th>
              <th className="px-6 py-3 text-left">Cliente</th>
              <th className="px-6 py-3 text-left">Data Início</th>
              <th className="px-6 py-3 text-left">Valor Mensal</th>
              <th className="px-6 py-3 text-left">Excedentes</th>
              <th className="px-6 py-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map(contract => (
              <tr key={contract._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 font-semibold">{contract.numeroContrato}</td>
                <td className="px-6 py-3">{getClientName(contract.cliente)}</td>
                <td className="px-6 py-3">{new Date(contract.dataInicio).toLocaleDateString('pt-BR')}</td>
                <td className="px-6 py-3">R$ {contract.valorMensal?.toFixed(2)}</td>
                <td className="px-6 py-3">R$ {contract.excedentes?.toFixed(2)}/pág</td>
                <td className="px-6 py-3 flex gap-2">
                  <button className="text-blue-600 hover:text-blue-800">
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDelete(contract._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
