import React, { useState, useEffect } from 'react';
import { billingService, contractService } from '../services/services';
import { FiPlus, FiDownload } from 'react-icons/fi';

export const BillingPage = () => {
  const [billings, setBillings] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    contratoId: '',
    mes: new Date().toISOString().slice(0, 7),
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [billRes, contRes] = await Promise.all([
        billingService.getAll(),
        contractService.getAll(),
      ]);
      setBillings(billRes.data);
      setContracts(contRes.data);
    } catch (error) {
      console.error('Erro ao carregar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBilling = async (e) => {
    e.preventDefault();
    try {
      await billingService.generateMonthly({
        contratoId: formData.contratoId,
        mes: formData.mes,
      });
      setFormData({
        contratoId: '',
        mes: new Date().toISOString().slice(0, 7),
      });
      setShowForm(false);
      alert('Faturamento gerado com sucesso!');
      loadData();
    } catch (error) {
      console.error('Erro ao gerar faturamento:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      rascunho: 'bg-gray-100 text-gray-800',
      gerado: 'bg-blue-100 text-blue-800',
      enviado: 'bg-yellow-100 text-yellow-800',
      pago: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100';
  };

  if (loading) return <div className="p-6">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Faturamentos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <FiPlus /> Gerar Faturamento
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleGenerateBilling} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <select
                value={formData.contratoId}
                onChange={(e) => setFormData({ ...formData, contratoId: e.target.value })}
                className="px-4 py-2 border rounded-lg"
                required
              >
                <option value="">Selecione um contrato</option>
                {contracts.map(c => (
                  <option key={c._id} value={c._id}>
                    {c.numeroContrato}
                  </option>
                ))}
              </select>
              <input
                type="month"
                value={formData.mes}
                onChange={(e) => setFormData({ ...formData, mes: e.target.value })}
                className="px-4 py-2 border rounded-lg"
                required
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Gerar Faturamento
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-gray-600">Total Faturamentos</p>
          <p className="text-3xl font-bold text-blue-600">{billings.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-gray-600">Total a Receber</p>
          <p className="text-3xl font-bold text-yellow-600">
            R$ {billings
              .filter(b => b.status !== 'pago')
              .reduce((sum, b) => sum + (b.valorTotal || 0), 0)
              .toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-gray-600">Total Recebido</p>
          <p className="text-3xl font-bold text-green-600">
            R$ {billings
              .filter(b => b.status === 'pago')
              .reduce((sum, b) => sum + (b.valorTotal || 0), 0)
              .toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">Mês</th>
              <th className="px-6 py-3 text-left">Cliente</th>
              <th className="px-6 py-3 text-left">Valor Total</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {billings.map(billing => (
              <tr key={billing._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3">{new Date(billing.mes).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</td>
                <td className="px-6 py-3">{billing.cliente?.nome}</td>
                <td className="px-6 py-3 font-semibold">R$ {billing.valorTotal?.toFixed(2)}</td>
                <td className="px-6 py-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(billing.status)}`}>
                    {billing.status}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                    <FiDownload /> Download
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
