import React, { useState } from 'react';
import '../styles/pages.css';

export const RelatorioPage = () => {
  const [periodo, setPeriodo] = useState('mes-atual');
  const [filtro, setFiltro] = useState('geral');

  const relatorioData = {
    totalClientes: 45,
    totalMaquinas: 120,
    totalContadores: 320,
    totalFaturamento: 125600,
    mediaExcedentes: 2300,
    maquinasMaisAlugadas: [
      { modelo: 'HP LaserJet Pro', quantidade: 35, percentual: 29 },
      { modelo: 'Brother HL-L8360', quantidade: 28, percentual: 23 },
      { modelo: 'Xerox VersaLink', quantidade: 22, percentual: 18 },
      { modelo: 'Canon imageRUNNER', quantidade: 20, percentual: 17 },
      { modelo: 'Ricoh MP C2504', quantidade: 15, percentual: 13 },
    ],
    clientesPorDepartamento: [
      { departamento: 'TI', quantidade: 12 },
      { departamento: 'Financeiro', quantidade: 8 },
      { departamento: 'RH', quantidade: 7 },
      { departamento: 'Administrativo', quantidade: 10 },
      { departamento: 'Suporte', quantidade: 8 },
    ],
    faturamentoPorMes: [
      { mes: 'Janeiro', valor: 105000 },
      { mes: 'Fevereiro', valor: 112000 },
      { mes: 'Março', valor: 118000 },
      { mes: 'Abril', valor: 125600 },
    ],
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Relatórios e Demonstrativos</h1>
        <p className="subtitle">Análise completa do sistema</p>
      </header>

      <div className="filter-bar">
        <select value={periodo} onChange={(e) => setPeriodo(e.target.value)} className="input-field">
          <option value="mes-atual">Mês Atual</option>
          <option value="ultimo-mes">Último Mês</option>
          <option value="trimestre">Trimestre</option>
          <option value="ano">Ano</option>
        </select>
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="input-field">
          <option value="geral">Geral</option>
          <option value="cliente">Por Cliente</option>
          <option value="maquina">Por Máquina</option>
        </select>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total de Clientes</h3>
          <p className="stat-value">{relatorioData.totalClientes}</p>
        </div>
        <div className="stat-card">
          <h3>Total de Máquinas</h3>
          <p className="stat-value">{relatorioData.totalMaquinas}</p>
        </div>
        <div className="stat-card">
          <h3>Leituras de Contadores</h3>
          <p className="stat-value">{relatorioData.totalContadores}</p>
        </div>
        <div className="stat-card">
          <h3>Faturamento Total</h3>
          <p className="stat-value" style={{ color: '#4caf50' }}>
            R$ {(relatorioData.totalFaturamento / 1000).toFixed(1)}k
          </p>
        </div>
      </div>

      <div className="report-section">
        <h2>Máquinas Mais Alugadas</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Modelo</th>
                <th>Quantidade</th>
                <th>Percentual</th>
                <th>Gráfico</th>
              </tr>
            </thead>
            <tbody>
              {relatorioData.maquinasMaisAlugadas.map((maquina, idx) => (
                <tr key={idx}>
                  <td>{maquina.modelo}</td>
                  <td>{maquina.quantidade}</td>
                  <td>{maquina.percentual}%</td>
                  <td>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${maquina.percentual}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="report-section">
        <h2>Clientes por Departamento</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Departamento</th>
                <th>Quantidade de Clientes</th>
              </tr>
            </thead>
            <tbody>
              {relatorioData.clientesPorDepartamento.map((dept, idx) => (
                <tr key={idx}>
                  <td>{dept.departamento}</td>
                  <td>
                    <span className="badge" style={{ backgroundColor: '#2196f3' }}>
                      {dept.quantidade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="report-section">
        <h2>Faturamento Progressivo</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Período</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {relatorioData.faturamentoPorMes.map((mes, idx) => (
                <tr key={idx}>
                  <td>{mes.mes}</td>
                  <td style={{ fontWeight: 'bold', color: '#4caf50' }}>
                    R$ {mes.valor.toLocaleString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="form-actions" style={{ marginTop: '30px' }}>
        <button className="btn-primary">📥 Exportar PDF</button>
        <button className="btn-success">📊 Gerar Gráficos</button>
        <button className="btn-secondary">🖨️ Imprimir</button>
      </div>
    </div>
  );
};
