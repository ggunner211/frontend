import React, { useState } from 'react';
import '../styles/pages.css';

export const TecnicosPage = () => {
  const [tecnicos, setTecnicos] = useState([
    { id: 1, name: 'João Silva', phone: '(11) 98765-4321', city: 'São Paulo', status: 'Ativo' },
    { id: 2, name: 'Maria Santos', phone: '(11) 97654-3210', city: 'São Paulo', status: 'Ativo' },
    { id: 3, name: 'Pedro Oliveira', phone: '(11) 96543-2109', city: 'Guarulhos', status: 'Ativo' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
  });

  const handleAddTecnico = () => {
    if (formData.name && formData.phone && formData.city) {
      setTecnicos([
        ...tecnicos,
        {
          id: Math.max(...tecnicos.map(t => t.id), 0) + 1,
          ...formData,
          status: 'Ativo',
        },
      ]);
      setFormData({ name: '', phone: '', city: '' });
      setShowForm(false);
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Gestão de Técnicos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          + Novo Técnico
        </button>
      </header>

      {showForm && (
        <div className="form-card">
          <h2>Cadastrar Técnico</h2>
          <div className="form-grid">
            <input
              type="text"
              placeholder="Nome"
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
              type="text"
              placeholder="Cidade"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="input-field"
            />
          </div>
          <div className="form-actions">
            <button onClick={handleAddTecnico} className="btn-success">
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
              <th>Cidade</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {tecnicos.map((tecnico) => (
              <tr key={tecnico.id}>
                <td>#{tecnico.id}</td>
                <td>{tecnico.name}</td>
                <td>{tecnico.phone}</td>
                <td>{tecnico.city}</td>
                <td>
                  <span className={`badge badge-${tecnico.status.toLowerCase()}`}>
                    {tecnico.status}
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
