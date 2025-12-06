import React, { useState } from 'react';
import '../styles/pages.css';

export const PedidosPage = () => {
  const [pedidos, setPedidos] = useState([
    { id: 1, item: 'Toner HP Q2612A', quantity: 10, fornecedor: 'Fornecedor A', status: 'Pendente', date: '2025-12-01' },
    { id: 2, item: 'Fusor Brother', quantity: 2, fornecedor: 'Fornecedor B', status: 'Entregue', date: '2025-11-28' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    item: '',
    quantity: '',
    fornecedor: '',
  });

  const handleAddPedido = () => {
    if (formData.item && formData.quantity && formData.fornecedor) {
      setPedidos([
        ...pedidos,
        {
          id: Math.max(...pedidos.map(p => p.id), 0) + 1,
          ...formData,
          quantity: parseInt(formData.quantity),
          status: 'Pendente',
          date: new Date().toISOString().split('T')[0],
        },
      ]);
      setFormData({ item: '', quantity: '', fornecedor: '' });
      setShowForm(false);
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Gestão de Pedidos de Peças</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          + Novo Pedido
        </button>
      </header>

      {showForm && (
        <div className="form-card">
          <h2>Criar Pedido</h2>
          <div className="form-grid">
            <input
              type="text"
              placeholder="Item/Peça"
              value={formData.item}
              onChange={(e) => setFormData({ ...formData, item: e.target.value })}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Quantidade"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Fornecedor"
              value={formData.fornecedor}
              onChange={(e) => setFormData({ ...formData, fornecedor: e.target.value })}
              className="input-field"
            />
          </div>
          <div className="form-actions">
            <button onClick={handleAddPedido} className="btn-success">
              Confirmar Pedido
            </button>
            <button onClick={() => setShowForm(false)} className="btn-secondary">
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Item</th>
              <th>Quantidade</th>
              <th>Fornecedor</th>
              <th>Data</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>#{pedido.id}</td>
                <td>{pedido.item}</td>
                <td>{pedido.quantity}</td>
                <td>{pedido.fornecedor}</td>
                <td>{pedido.date}</td>
                <td>
                  <span className={`badge badge-${pedido.status.toLowerCase()}`}>
                    {pedido.status}
                  </span>
                </td>
                <td>
                  <button className="btn-small">Visualizar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
