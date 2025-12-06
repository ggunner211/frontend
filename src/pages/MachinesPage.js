import React, { useState, useEffect } from 'react';
import { machineService, clientService, counterService } from '../services/services';
import { FiPlus, FiEdit2, FiTrash2, FiRefreshCw } from 'react-icons/fi';

export const MachinesPage = () => {
  const [machines, setMachines] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    patrimonio: '',
    numeroSerie: '',
    modelo: '',
    marca: '',
    cliente: '',
    chaveCliente: '',
    localizacao: '',
    departamento: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [machRes, clientRes] = await Promise.all([
        machineService.getAll(),
        clientService.getAll(),
      ]);
      setMachines(machRes.data);
      setClients(clientRes.data);
    } catch (error) {
      console.error('Erro ao carregar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await machineService.create(formData);
      setFormData({
        patrimonio: '',
        numeroSerie: '',
        modelo: '',
        marca: '',
        cliente: '',
        chaveCliente: '',
        localizacao: '',
        departamento: '',
      });
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error('Erro ao criar máquina:', error);
    }
  };

  const handleFetchCounters = async (machineId) => {
    try {
      await counterService.fetchFromAPI(machineId);
      alert('Contadores atualizados com sucesso!');
      loadData();
    } catch (error) {
      console.error('Erro ao buscar contadores:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza?')) {
      try {
        await machineService.delete(id);
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
        <h1 className="text-3xl font-bold">Máquinas</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <FiPlus /> Nova Máquina
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Patrimônio"
                value={formData.patrimonio}
                onChange={(e) => setFormData({ ...formData, patrimonio: e.target.value })}
                className="px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Número de Série"
                value={formData.numeroSerie}
                onChange={(e) => setFormData({ ...formData, numeroSerie: e.target.value })}
                className="px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Modelo"
                value={formData.modelo}
                onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Marca"
                value={formData.marca}
                onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                className="px-4 py-2 border rounded-lg"
              />
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
                type="text"
                placeholder="Chave Cliente (DOCMPS)"
                value={formData.chaveCliente}
                onChange={(e) => setFormData({ ...formData, chaveCliente: e.target.value })}
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Localização"
                value={formData.localizacao}
                onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Departamento"
                value={formData.departamento}
                onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                className="px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Criar Máquina
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
              <th className="px-6 py-3 text-left">Patrimônio</th>
              <th className="px-6 py-3 text-left">Série</th>
              <th className="px-6 py-3 text-left">Marca</th>
              <th className="px-6 py-3 text-left">Cliente</th>
              <th className="px-6 py-3 text-left">Contador</th>
              <th className="px-6 py-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {machines.map(machine => (
              <tr key={machine._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 font-semibold">{machine.patrimonio}</td>
                <td className="px-6 py-3">{machine.numeroSerie}</td>
                <td className="px-6 py-3">{machine.marca}</td>
                <td className="px-6 py-3">{getClientName(machine.cliente)}</td>
                <td className="px-6 py-3">{machine.contadorAtual}</td>
                <td className="px-6 py-3 flex gap-2">
                  <button
                    onClick={() => handleFetchCounters(machine._id)}
                    className="text-green-600 hover:text-green-800"
                    title="Atualizar contadores"
                  >
                    <FiRefreshCw />
                  </button>
                  <button className="text-blue-600 hover:text-blue-800">
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDelete(machine._id)}
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
