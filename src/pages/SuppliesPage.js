import React, { useState, useEffect } from 'react';
import { supplyService } from '../services/services';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

export const SuppliesPage = () => {
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'toner',
    descricao: '',
    quantidade: 0,
    quantidadeMinima: 5,
    preco: 0,
    vidaUtil: 0,
  });

  useEffect(() => {
    loadSupplies();
  }, []);

  const loadSupplies = async () => {
    try {
      const res = await supplyService.getAll();
      setSupplies(res.data);
    } catch (error) {
      console.error('Erro ao carregar peças:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await supplyService.create({
        ...formData,
        dataEntrada: new Date(),
      });
      setFormData({
        nome: '',
        tipo: 'toner',
        descricao: '',
        quantidade: 0,
        quantidadeMinima: 5,
        preco: 0,
        vidaUtil: 0,
      });
      setShowForm(false);
      loadSupplies();
    } catch (error) {
      console.error('Erro ao criar peça:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza?')) {
      try {
        await supplyService.delete(id);
        loadSupplies();
      } catch (error) {
        console.error('Erro ao deletar:', error);
      }
    }
  };

  const getStatusColor = (quantidade, minima) => {
    if (quantidade <= minima) return 'bg-red-100 text-red-800';
    return 'bg-green-100 text-green-800';
  };

  if (loading) return <div className="p-6">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Peças e Suprimentos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <FiPlus /> Nova Peça
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="px-4 py-2 border rounded-lg"
                required
              />
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="toner">Toner</option>
                <option value="pecas">Peças</option>
                <option value="outros">Outros</option>
              </select>
              <textarea
                placeholder="Descrição"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                className="px-4 py-2 border rounded-lg col-span-2"
                rows="2"
              />
              <input
                type="number"
                placeholder="Quantidade"
                value={formData.quantidade}
                onChange={(e) => setFormData({ ...formData, quantidade: parseInt(e.target.value) })}
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Quantidade Mínima"
                value={formData.quantidadeMinima}
                onChange={(e) => setFormData({ ...formData, quantidadeMinima: parseInt(e.target.value) })}
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Preço"
                value={formData.preco}
                onChange={(e) => setFormData({ ...formData, preco: parseFloat(e.target.value) })}
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Vida Útil (páginas/dias)"
                value={formData.vidaUtil}
                onChange={(e) => setFormData({ ...formData, vidaUtil: parseInt(e.target.value) })}
                className="px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Criar Peça
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
              <th className="px-6 py-3 text-left">Nome</th>
              <th className="px-6 py-3 text-left">Tipo</th>
              <th className="px-6 py-3 text-left">Quantidade</th>
              <th className="px-6 py-3 text-left">Mínima</th>
              <th className="px-6 py-3 text-left">Preço</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {supplies.map(supply => (
              <tr key={supply._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 font-semibold">{supply.nome}</td>
                <td className="px-6 py-3">{supply.tipo}</td>
                <td className="px-6 py-3">{supply.quantidade}</td>
                <td className="px-6 py-3">{supply.quantidadeMinima}</td>
                <td className="px-6 py-3">R$ {supply.preco?.toFixed(2)}</td>
                <td className="px-6 py-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(supply.quantidade, supply.quantidadeMinima)}`}>
                    {supply.quantidade <= supply.quantidadeMinima ? 'Baixo' : 'OK'}
                  </span>
                </td>
                <td className="px-6 py-3 flex gap-2">
                  <button className="text-blue-600 hover:text-blue-800">
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDelete(supply._id)}
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
