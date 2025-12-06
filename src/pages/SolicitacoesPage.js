import React, { useState } from 'react';
import '../styles/pages.css';

export const SolicitacoesPage = () => {
  const [solicitacoes] = useState([
    { id: 1, tecnico: 'João Silva', item: 'Toner HP', quantidade: 2, status: 'Aguardando', data: '2025-12-05' },
    { id: 2, tecnico: 'Maria Santos', item: 'Fusor Brother', quantidade: 1, status: 'Processando', data: '2025-12-04' },
  ]);

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Solicitações de Peças dos Técnicos</h1>
        <p className="subtitle">Solicitações abiertas pelos técnicos em campo</p>
      </header>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Técnico</th>
              <th>Item Solicitado</th>
              <th>Quantidade</th>
              <th>Data</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {solicitacoes.map((solicitacao) => (
              <tr key={solicitacao.id}>
                <td>#{solicitacao.id}</td>
                <td>{solicitacao.tecnico}</td>
                <td>{solicitacao.item}</td>
                <td>{solicitacao.quantidade}</td>
                <td>{solicitacao.data}</td>
                <td>
                  <span className={`badge badge-${solicitacao.status.toLowerCase()}`}>
                    {solicitacao.status}
                  </span>
                </td>
                <td>
                  <button className="btn-small">Visualizar</button>
                  <button className="btn-small btn-success">Processar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
