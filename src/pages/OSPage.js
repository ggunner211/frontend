import React, { useState, useEffect } from 'react';
import { osService, clientService, machineService, authService } from '../services/services';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

export const OSPage = () => {
  const [os, setOS] = useState([]);
  const [clients, setClients] = useState([]);
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    numeroOS: '',
    cliente: '',
    maquina: '',
    descricaoProblema: '',
    tipo: 'locada',
    prioridade: 'media',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [osRes, clientRes, machineRes] = await Promise.all([
        osService.getAll(),
        clientService.getAll(),
        machineService.getAll(),
      ]);
      setOS(osRes.data);
      setClients(clientRes.data);
      setMachines(machineRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await osService.create({
        ...formData,
        numeroOS: `OS-${Date.now()}`,
      });
      setFormData({
        numeroOS: '',
        cliente: '',
        maquina: '',
        descricaoProblema: '',
        tipo: 'locada',
        prioridade: 'media',
      });
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error('Erro ao criar OS:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza?')) {
      try {
        await osService.delete(id);
        loadData();
      } catch (error) {
        console.error('Erro ao deletar:', error);
      }
    }
  };

  const getClientName = (clienteId) => {
    return clients.find(c => c._id === clienteId)?.nome || '-';
  };

  const getMachineName = (machineId) => {
    return machines.find(m => m._id === machineId)?.patrimonio || '-';
  };

  const getStatusColor = (status) => {
    const colors = {
      aberta: 'bg-red-100 text-red-800',
      aceita: 'bg-yellow-100 text-yellow-800',
      em_atendimento: 'bg-blue-100 text-blue-800',
      finalizada: 'bg-green-100 text-green-800',
      cancelada: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100';
  };

  if (loading) return <div className="p-6">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gerenciamento de OS</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <FiPlus /> Nova OS
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Cliente</label>
                <select
                  value={formData.cliente}
                  onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="">Selecione um cliente</option>
                  {clients.map(c => (
                    <option key={c._id} value={c._id}>{c.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Máquina</label>
                <select
                  value={formData.maquina}
                  onChange={(e) => setFormData({ ...formData, maquina: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="">Selecione uma máquina</option>
                  {machines.map(m => (
                    <option key={m._id} value={m._id}>{m.patrimonio}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Descrição do Problema</label>
              <textarea
                value={formData.descricaoProblema}
                onChange={(e) => setFormData({ ...formData, descricaoProblema: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                rows="4"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Tipo</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="locada">Locada</option>
                  <option value="avulso">Avulso</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Prioridade</label>
                <select
                  value={formData.prioridade}
                  onChange={(e) => setFormData({ ...formData, prioridade: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Criar OS
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
              <th className="px-6 py-3 text-left">Número OS</th>
              <th className="px-6 py-3 text-left">Cliente</th>
              <th className="px-6 py-3 text-left">Máquina</th>
              <th className="px-6 py-3 text-left">Problema</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {os.map(item => (
              <tr key={item._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 font-semibold">{item.numeroOS}</td>
                <td className="px-6 py-3">{getClientName(item.cliente)}</td>
                <td className="px-6 py-3">{getMachineName(item.maquina)}</td>
                <td className="px-6 py-3 text-sm">{item.descricaoProblema.substring(0, 30)}...</td>
                <td className="px-6 py-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-3 flex gap-2">
                  <button className="text-blue-600 hover:text-blue-800" title="Editar">
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Deletar"
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
