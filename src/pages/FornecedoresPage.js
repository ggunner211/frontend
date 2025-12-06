import React, { useState } from 'react';
import '../styles/pages.css';

export const FornecedoresPage = () => {
  const [fornecedores, setFornecedores] = useState([
    { id: 1, name: 'Fornecedor A', phone: '(11) 3000-0001', email: 'contato@forna.com', status: 'Ativo' },
    { id: 2, name: 'Fornecedor B', phone: '(11) 3000-0002', email: 'vendas@fornb.com', status: 'Ativo' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const handleAddFornecedor = () => {
    if (formData.name && formData.phone && formData.email) {
      setFornecedores([
        ...fornecedores,
        {
          id: Math.max(...fornecedores.map(f => f.id), 0) + 1,
          ...formData,
          status: 'Ativo',
        },
      ]);
      setFormData({ name: '', phone: '', email: '' });
      setShowForm(false);
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Gestão de Fornecedores</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          + Novo Fornecedor
        </button>
      </header>

      {showForm && (
        <div className="form-card">
          <h2>Cadastrar Fornecedor</h2>
          <div className="form-grid">
            <input
              type="text"
              placeholder="Nome da Empresa"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
            />
            <input
              type="tel"
              placeholder="Telefone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input-field"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
            />
          </div>
          <div className="form-actions">
            <button onClick={handleAddFornecedor} className="btn-success">
              Salvar
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
              <th>Nome</th>
              <th>Telefone</th>
              <th>Email</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {fornecedores.map((fornecedor) => (
              <tr key={fornecedor.id}>
                <td>#{fornecedor.id}</td>
                <td>{fornecedor.name}</td>
                <td>{fornecedor.phone}</td>
                <td>{fornecedor.email}</td>
                <td>
                  <span className={`badge badge-${fornecedor.status.toLowerCase()}`}>
                    {fornecedor.status}
                  </span>
                </td>
                <td>
                  <button className="btn-small">Editar</button>
                  <button className="btn-small btn-danger">Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
