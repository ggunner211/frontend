import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiTrendingUp, FiUsers, FiZap, FiClock, FiArrowRight, FiCheck } from 'react-icons/fi';
import '../styles/Dashboard.css';

export const Dashboard = () => {
  const { user } = useAuth();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getWelcomeMessage = () => {
    const hour = time.getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const roleTitles = {
    admin: 'Administrador',
    support: 'Suporte',
    supply: 'Suprimentos',
    counter: 'Contadores',
    billing: 'Faturamento',
    technician: 'Técnico',
  };

  const roleEmojis = {
    admin: '👨‍💼',
    support: '🛠️',
    supply: '📦',
    counter: '📊',
    billing: '💰',
    technician: '🔧',
  };

  const stats = [
    {
      title: 'Clientes',
      value: '156',
      change: '+12%',
      icon: FiUsers,
      color: 'blue',
    },
    {
      title: 'Impressoras',
      value: '428',
      change: '+5%',
      icon: FiZap,
      color: 'orange',
    },
    {
      title: 'Ordens Ativas',
      value: '23',
      change: '+3%',
      icon: FiTrendingUp,
      color: 'green',
    },
    {
      title: 'Tempo Médio',
      value: '2.4h',
      change: '-8%',
      icon: FiClock,
      color: 'purple',
    },
  ];

  const quickActions = [
    { label: 'Novo Cliente', icon: '➕', color: 'blue' },
    { label: 'Nova OS', icon: '📝', color: 'orange' },
    { label: 'Coletar Contadores', icon: '📊', color: 'green' },
    { label: 'Gerar Faturamento', icon: '💵', color: 'purple' },
    { label: 'Nota de Entrega', icon: '📦', color: 'red' },
    { label: 'Relatórios', icon: '📈', color: 'indigo' },
  ];

  const recentActivities = [
    { action: 'Cliente cadastrado', time: 'há 2 minutos', icon: '✓' },
    { action: 'OS concluída', time: 'há 1 hora', icon: '✓' },
    { action: 'Faturamento gerado', time: 'há 3 horas', icon: '✓' },
    { action: 'Suprimento recebido', time: 'há 5 horas', icon: '✓' },
  ];

  return (
    <div className="dashboard-container">
      {/* Header Welcome Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1 className="welcome-title">
              {getWelcomeMessage()}, {user?.name?.split(' ')[0]} <span className="emoji">{roleEmojis[user?.role] || '👤'}</span>
            </h1>
            <p className="welcome-subtitle">
              Você está logado como <span className="role-badge">{roleTitles[user?.role]}</span>
            </p>
          </div>
          <div className="header-time">
            <div className="time-display">
              {time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="date-display">
              {time.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`stat-card stat-${stat.color}`}>
              <div className="stat-header">
                <Icon className="stat-icon" />
                <div className={`change-badge ${stat.change.startsWith('-') ? 'negative' : 'positive'}`}>
                  {stat.change}
                </div>
              </div>
              <div className="stat-body">
                <p className="stat-title">{stat.title}</p>
                <p className="stat-value">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Banner */}
      <div className="main-banner">
        <div className="banner-content">
          <div className="banner-text">
            <h2 className="banner-title">Bem-vindo ao AURA</h2>
            <p className="banner-description">
              Sistema inteligente de gestão de impressoras e suprimentos. Gerencie tudo de forma simples, rápida e eficiente.
            </p>
            <div className="banner-features">
              <span className="feature-tag"><FiCheck /> Automação Total</span>
              <span className="feature-tag"><FiCheck /> Relatórios Avançados</span>
              <span className="feature-tag"><FiCheck /> Integração Completa</span>
            </div>
          </div>
          <div className="banner-visual">
            <svg viewBox="0 0 200 200" className="banner-svg">
              <defs>
                <linearGradient id="bannerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFA500" />
                  <stop offset="100%" stopColor="#4169E1" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="80" fill="url(#bannerGrad)" opacity="0.2" />
              <circle cx="100" cy="100" r="60" fill="url(#bannerGrad)" opacity="0.4" />
              <circle cx="100" cy="100" r="40" fill="url(#bannerGrad)" opacity="0.6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Quick Actions & Activities */}
      <div className="dashboard-grid">
        {/* Quick Actions */}
        <div className="section quick-actions-section">
          <div className="section-header">
            <h3 className="section-title">Ações Rápidas</h3>
            <FiArrowRight className="section-icon" />
          </div>
          <div className="quick-actions-grid">
            {quickActions.map((action, idx) => (
              <button key={idx} className={`quick-action-btn action-${action.color}`}>
                <span className="action-emoji">{action.icon}</span>
                <span className="action-label">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="section recent-activities-section">
          <div className="section-header">
            <h3 className="section-title">Atividades Recentes</h3>
            <FiArrowRight className="section-icon" />
          </div>
          <div className="activities-list">
            {recentActivities.map((activity, idx) => (
              <div key={idx} className="activity-item">
                <div className="activity-icon">{activity.icon}</div>
                <div className="activity-content">
                  <p className="activity-action">{activity.action}</p>
                  <p className="activity-time">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Info */}
        <div className="section system-info-section">
          <div className="section-header">
            <h3 className="section-title">Informações do Sistema</h3>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">Versão</div>
              <div className="info-value">1.0.0</div>
            </div>
            <div className="info-item">
              <div className="info-label">Ambiente</div>
              <div className="info-value">Desenvolvimento</div>
            </div>
            <div className="info-item">
              <div className="info-label">Framework</div>
              <div className="info-value">React 18</div>
            </div>
            <div className="info-item">
              <div className="info-label">Backend</div>
              <div className="info-value">Node.js</div>
            </div>
            <div className="info-item">
              <div className="info-label">Banco de Dados</div>
              <div className="info-value">Mock</div>
            </div>
            <div className="info-item">
              <div className="info-label">Status</div>
              <div className="info-value online">🟢 Online</div>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="section user-info-section">
          <div className="section-header">
            <h3 className="section-title">Minha Conta</h3>
          </div>
          <div className="user-card">
            <div className="user-avatar">{user?.name?.charAt(0)?.toUpperCase()}</div>
            <div className="user-details">
              <p className="user-name">{user?.name}</p>
              <p className="user-email">{user?.email}</p>
              <p className="user-role">{roleTitles[user?.role]}</p>
            </div>
            <div className="user-status online">Ativo</div>
          </div>
        </div>
      </div>
    </div>
  );
};
