import React, { useState, useEffect, useCallback } from 'react';
import { deliveryNoteService, supplyService } from '../services/services';
import { FiPlus, FiEdit2, FiTrash2, FiDownload, FiCheck } from 'react-icons/fi';

export const DeliveryNotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  
  const [formData, setFormData] = useState({
    numeroNota: '',
    descricao: '',
    cliente: '',
    fornecedor: '',
    itens: [{ supply: '', quantidade: 1, valorUnitario: 0, observacao: '' }],
    observacoes: '',
  });

  const loadDeliveryNotes = useCallback(async () => {
    try {
      setLoading(true);
      const filters = filterStatus ? { status: filterStatus } : {};
      const res = await deliveryNoteService.getAll(filters);
      setNotes(res.data.data || res.data);
    } catch (error) {
      console.error('Erro ao carregar notas:', error);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  const loadSupplies = useCallback(async () => {
    try {
      const res = await supplyService.getAll();
      setSupplies(res.data);
    } catch (error) {
      console.error('Erro ao carregar peças:', error);
    }
  }, []);

  useEffect(() => {
    loadDeliveryNotes();
    loadSupplies();
  }, [loadDeliveryNotes, loadSupplies]);

  const handleAddItem = () => {
    setFormData({
      ...formData,
      itens: [...formData.itens, { supply: '', quantidade: 1, valorUnitario: 0, observacao: '' }],
    });
  };

  const handleRemoveItem = (index) => {
    setFormData({
      ...formData,
      itens: formData.itens.filter((_, i) => i !== index),
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItens = [...formData.itens];
    newItens[index][field] = value;
    setFormData({ ...formData, itens: newItens });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNote) {
        await deliveryNoteService.update(editingNote._id, formData);
      } else {
        await deliveryNoteService.create(formData);
      }
      resetForm();
      loadDeliveryNotes();
    } catch (error) {
      console.error('Erro ao salvar nota:', error);
      alert('Erro ao salvar nota de entrega');
    }
  };

  const resetForm = () => {
    setFormData({
      numeroNota: '',
      descricao: '',
      cliente: '',
      fornecedor: '',
      itens: [{ supply: '', quantidade: 1, valorUnitario: 0, observacao: '' }],
      observacoes: '',
    });
    setEditingNote(null);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deletar nota de entrega?')) {
      try {
        await deliveryNoteService.delete(id);
        loadDeliveryNotes();
      } catch (error) {
        console.error('Erro ao deletar:', error);
      }
    }
  };

  const handleSend = async (id) => {
    try {
      await deliveryNoteService.send(id);
      loadDeliveryNotes();
      alert('Nota enviada com sucesso');
    } catch (error) {
      console.error('Erro ao enviar:', error);
    }
  };

  const handleConfirm = async (id) => {
    const assinado = prompt('Nome de quem recebeu:');
    if (assinado) {
      try {
        await deliveryNoteService.confirm(id, {
          assinadoPor: assinado,
          dataEntrega: new Date(),
        });
        loadDeliveryNotes();
        alert('Entrega confirmada com sucesso');
      } catch (error) {
        console.error('Erro ao confirmar:', error);
      }
    }
  };

  const handlePrint = (note) => {
    const printWindow = window.open('', '', 'height=600,width=800');
    let itemsHTML = note.itens
      .map(
        (item) => `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${item.supply?.nome || 'N/A'}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.quantidade}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">R$ ${item.valorUnitario?.toFixed(2) || '0.00'}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${item.observacao || ''}</td>
      </tr>
    `
      )
      .join('');

    const totalValor = note.itens.reduce((sum, item) => sum + (item.valorUnitario || 0) * item.quantidade, 0);

    printWindow.document.write(`
      <html>
        <head>
          <title>Nota de Entrega ${note.numeroNota}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h2 { text-align: center; }
            .info { margin-bottom: 20px; }
            .info p { margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #f0f0f0; border: 1px solid #ddd; padding: 8px; text-align: left; }
            .total { text-align: right; font-weight: bold; margin-top: 20px; }
            .signature { margin-top: 40px; }
            .signature-line { border-top: 1px solid #000; width: 200px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <h2>NOTA DE ENTREGA</h2>
          <div class="info">
            <p><strong>Número:</strong> ${note.numeroNota}</p>
            <p><strong>Cliente:</strong> ${note.cliente}</p>
            <p><strong>Data:</strong> ${new Date(note.dataCriacao).toLocaleDateString('pt-BR')}</p>
            <p><strong>Descrição:</strong> ${note.descricao}</p>
            <p><strong>Status:</strong> ${note.status.toUpperCase()}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Peça/Toner</th>
                <th>Quantidade</th>
                <th>Valor Unit.</th>
                <th>Observações</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>

          <div class="total">
            <p>Total: R$ ${totalValor.toFixed(2)}</p>
          </div>

          ${note.observacoes ? `<p><strong>Observações Gerais:</strong> ${note.observacoes}</p>` : ''}

          <div class="signature">
            <p>Assinado por: ${note.assinadoPor || '___________________________'}</p>
            <p>Data: ${note.dataConfirmacao ? new Date(note.dataConfirmacao).toLocaleDateString('pt-BR') : '___________________________'}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      rascunho: 'bg-gray-100 text-gray-800',
      enviada: 'bg-blue-100 text-blue-800',
      entregue: 'bg-yellow-100 text-yellow-800',
      confirmada: 'bg-green-100 text-green-800',
      cancelada: 'bg-red-100 text-red-800',
    };
    return statusStyles[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div className="p-6">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Notas de Entrega</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <FiPlus /> Nova Nota
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <label className="block mb-2">
          <span className="font-semibold">Filtrar por Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          >
            <option value="">Todos</option>
            <option value="rascunho">Rascunho</option>
            <option value="enviada">Enviada</option>
            <option value="entregue">Entregue</option>
            <option value="confirmada">Confirmada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </label>
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Descrição da Entrega"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                className="px-4 py-2 border rounded-lg col-span-2"
                required
              />
              <input
                type="text"
                placeholder="Cliente"
                value={formData.cliente}
                onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                className="px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Fornecedor (opcional)"
                value={formData.fornecedor}
                onChange={(e) => setFormData({ ...formData, fornecedor: e.target.value })}
                className="px-4 py-2 border rounded-lg"
              />
            </div>

            {/* Itens */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Itens da Entrega</h3>
              {formData.itens.map((item, index) => (
                <div key={index} className="grid grid-cols-5 gap-2 mb-2">
                  <select
                    value={item.supply}
                    onChange={(e) => {
                      const selected = supplies.find((s) => s._id === e.target.value);
                      handleItemChange(index, 'supply', e.target.value);
                      if (selected) {
                        handleItemChange(index, 'valorUnitario', selected.preco || 0);
                      }
                    }}
                    className="px-3 py-2 border rounded-lg col-span-2"
                    required
                  >
                    <option value="">Selecionar Peça</option>
                    {supplies.map((supply) => (
                      <option key={supply._id} value={supply._id}>
                        {supply.nome}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Qtd"
                    value={item.quantidade}
                    onChange={(e) => handleItemChange(index, 'quantidade', parseInt(e.target.value) || 1)}
                    className="px-3 py-2 border rounded-lg"
                    min="1"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Valor Unit."
                    value={item.valorUnitario}
                    onChange={(e) => handleItemChange(index, 'valorUnitario', parseFloat(e.target.value) || 0)}
                    className="px-3 py-2 border rounded-lg"
                    step="0.01"
                  />
                  {formData.itens.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddItem}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-semibold"
              >
                + Adicionar Item
              </button>
            </div>

            <textarea
              placeholder="Observações Gerais"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              className="px-4 py-2 border rounded-lg col-span-2 w-full"
              rows="3"
            />

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Salvar Nota
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabela de Notas */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Número</th>
              <th className="px-4 py-3 text-left">Descrição</th>
              <th className="px-4 py-3 text-left">Cliente</th>
              <th className="px-4 py-3 text-center">Itens</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Data</th>
              <th className="px-4 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note) => (
              <tr key={note._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold">{note.numeroNota}</td>
                <td className="px-4 py-3">{note.descricao}</td>
                <td className="px-4 py-3">{note.cliente}</td>
                <td className="px-4 py-3 text-center">{note.itens?.length || 0}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(note.status)}`}>
                    {note.status}
                  </span>
                </td>
                <td className="px-4 py-3">{new Date(note.dataCriacao).toLocaleDateString('pt-BR')}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handlePrint(note)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                      title="Imprimir"
                    >
                      <FiDownload />
                    </button>
                    {note.status === 'rascunho' && (
                      <>
                        <button
                          onClick={() => {
                            setEditingNote(note);
                            setFormData(note);
                            setShowForm(true);
                          }}
                          className="p-2 text-orange-600 hover:bg-orange-100 rounded"
                          title="Editar"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(note._id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded"
                          title="Deletar"
                        >
                          <FiTrash2 />
                        </button>
                      </>
                    )}
                    {note.status === 'enviada' && (
                      <button
                        onClick={() => handleConfirm(note._id)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded"
                        title="Confirmar Entrega"
                      >
                        <FiCheck />
                      </button>
                    )}
                    {note.status === 'rascunho' && (
                      <button
                        onClick={() => handleSend(note._id)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                        title="Enviar"
                      >
                        <FiDownload />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {notes.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>Nenhuma nota de entrega cadastrada</p>
        </div>
      )}
    </div>
  );
};
