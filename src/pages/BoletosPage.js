import React, { useState } from 'react';
import '../styles/pages.css';

export const BoletosPage = () => {
  const [boletos] = useState([
    { id: 1, cliente: 'Empresa XYZ', valor: 1500.00, vencimento: '2025-12-15', status: 'Aberto' },
    { id: 2, cliente: 'Empresa ABC', valor: 2500.00, vencimento: '2025-12-20', status: 'Pago' },
    { id: 3, cliente: 'Empresa DEF', valor: 3000.00, vencimento: '2025-12-25', status: 'Vencido' },
  ]);

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Controle de Boletos</h1>
        <p className="subtitle">Gestão de boletos e pagamentos</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total de Boletos</h3>
          <p className="stat-value">{boletos.length}</p>
        </div>
        <div className="stat-card">
          <h3>Abertos</h3>
          <p className="stat-value" style={{ color: '#ff9800' }}>
            {boletos.filter(b => b.status === 'Aberto').length}
          </p>
        </div>
        <div className="stat-card">
          <h3>Pagos</h3>
          <p className="stat-value" style={{ color: '#4caf50' }}>
            {boletos.filter(b => b.status === 'Pago').length}
          </p>
        </div>
        <div className="stat-card">
          <h3>Vencidos</h3>
          <p className="stat-value" style={{ color: '#f44336' }}>
            {boletos.filter(b => b.status === 'Vencido').length}
          </p>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Valor</th>
              <th>Vencimento</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {boletos.map((boleto) => (
              <tr key={boleto.id}>
                <td>#{boleto.id}</td>
                <td>{boleto.cliente}</td>
                <td>R$ {boleto.valor.toFixed(2)}</td>
                <td>{boleto.vencimento}</td>
                <td>
                  <span className={`badge badge-${boleto.status.toLowerCase()}`}>
                    {boleto.status}
                  </span>
                </td>
                <td>
                  <button className="btn-small">Gerar Boleto</button>
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
