import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/pages.css';

export const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'support',
  });

  const API_URL = 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  const roles = [
    { value: 'admin', label: 'Administrador' },
    { value: 'support', label: 'Suporte' },
    { value: 'technician', label: 'Técnico' },
    { value: 'supply', label: 'Suprimentos' },
    { value: 'counter', label: 'Contador' },
    { value: 'billing', label: 'Faturamento' },
  ];

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(response.data || []);
      setError('');
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
      setError('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  // Carregar usuários
  useEffect(() => {
    fetchUsuarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddUsuario = async () => {
    if (formData.name && formData.email && formData.role && (editingId || formData.password)) {
      try {
        if (editingId) {
          // Atualizar usuário
          await axios.put(
            `${API_URL}/users/${editingId}`,
            {
              name: formData.name,
              email: formData.email,
              role: formData.role,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else {
          // Criar novo usuário
          await axios.post(
            `${API_URL}/users`,
            formData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
        await fetchUsuarios();
        setFormData({ name: '', email: '', password: '', role: 'support' });
        setEditingId(null);
        setShowForm(false);
      } catch (err) {
        console.error('Erro ao salvar usuário:', err);
        alert('Erro ao salvar usuário: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleEditUsuario = (usuario) => {
    setFormData({
      name: usuario.name,
      email: usuario.email,
      password: '',
      role: usuario.role,
    });
    setEditingId(usuario._id);
    setShowForm(true);
  };

  const handleDeleteUsuario = async (id) => {
    if (window.confirm('Tem certeza que deseja remover este usuário?')) {
      try {
        await axios.delete(`${API_URL}/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await fetchUsuarios();
      } catch (err) {
        console.error('Erro ao remover usuário:', err);
        alert('Erro ao remover usuário');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', email: '', password: '', role: 'support' });
  };

  if (loading) {
    return (
      <div className="page-container">
        <p>Carregando usuários...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Gestão de Usuários</h1>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ name: '', email: '', password: '', role: 'support' });
            setShowForm(!showForm);
          }}
          className="btn-primary"
        >
          + Novo Usuário
        </button>
      </header>

      {error && (
        <div className="alert-error">
          {error}
        </div>
      )}

      {showForm && (
        <div className="form-card">
          <h2>{editingId ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}</h2>
          <div className="form-grid">
            <input
              type="text"
              placeholder="Nome Completo"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
              required
            />
            {!editingId && (
              <input
                type="password"
                placeholder="Senha"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field"
                required
              />
            )}
            {editingId && (
              <input
                type="password"
                placeholder="Deixar em branco para não alterar"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field"
              />
            )}
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="input-field"
              required
            >
              <option value="">Selecionar Função</option>
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button onClick={handleAddUsuario} className="btn-success">
              {editingId ? 'Atualizar' : 'Criar'} Usuário
            </button>
            <button onClick={handleCancel} className="btn-secondary">
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="table-container">
        {usuarios.length === 0 ? (
          <p style={{ padding: '20px', textAlign: 'center' }}>Nenhum usuário cadastrado.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Função</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario._id}>
                  <td>{usuario.name}</td>
                  <td>{usuario.email}</td>
                  <td>
                    <span className="badge">
                      {roles.find(r => r.value === usuario.role)?.label}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-small"
                      onClick={() => handleEditUsuario(usuario)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-small btn-danger"
                      onClick={() => handleDeleteUsuario(usuario._id)}
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
