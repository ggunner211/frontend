import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiArrowRight, FiAlertCircle } from 'react-icons/fi';
import '../styles/LoginPage.css';

export const LoginPage = () => {
  const [email, setEmail] = useState('admin@aura.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email.includes('@')) {
      setError('Por favor, digite um email válido');
      setLoading(false);
      return;
    }

    if (password.length < 3) {
      setError('A senha deve ter pelo menos 3 caracteres');
      setLoading(false);
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      let errorMsg = result.error || 'Erro ao fazer login';
      
      if (errorMsg.includes('ECONNREFUSED')) {
        errorMsg = 'Erro de conexão com o servidor. Certifique-se que o backend está rodando.';
      } else if (errorMsg.includes('não encontrado')) {
        errorMsg = 'Usuário ou senha incorretos';
      }
      
      setError(errorMsg);
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      {/* Background com gradiente animado */}
      <div className="login-bg-gradient"></div>
      <div className="login-bg-blur"></div>

      {/* Orbs decorativos */}
      <div className="login-orb login-orb-1"></div>
      <div className="login-orb login-orb-2"></div>
      <div className="login-orb login-orb-3"></div>

      {/* Conteúdo principal */}
      <div className="login-content">
        {/* Lado esquerdo - Branding */}
        <div className="login-branding">
          <div className="branding-logo">
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="logo-svg-login"
            >
              <defs>
                <linearGradient id="auraBrand" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFA500" />
                  <stop offset="50%" stopColor="#FF6B35" />
                  <stop offset="100%" stopColor="#4169E1" />
                </linearGradient>
              </defs>
              <circle cx="60" cy="60" r="55" fill="url(#auraBrand)" />
              <circle cx="60" cy="60" r="40" fill="white" />
              <circle cx="60" cy="60" r="35" fill="none" stroke="url(#auraBrand)" strokeWidth="8" />
            </svg>
          </div>

          <div className="branding-text">
            <h1 className="branding-title">AURA</h1>
            <p className="branding-subtitle">Sistema Inteligente de Gestão</p>
            <p className="branding-description">
              Gerenciamento completo de impressoras, suprimentos e serviços em um único lugar
            </p>
          </div>

          <div className="branding-features">
            <div className="feature">
              <div className="feature-icon">⚙️</div>
              <div className="feature-text">Automação Inteligente</div>
            </div>
            <div className="feature">
              <div className="feature-icon">📊</div>
              <div className="feature-text">Relatórios Detalhados</div>
            </div>
            <div className="feature">
              <div className="feature-icon">🔒</div>
              <div className="feature-text">Segurança em Primeiro Lugar</div>
            </div>
          </div>
        </div>

        {/* Lado direito - Formulário */}
        <div className="login-form-container">
          <div className="login-form-wrapper">
            <div className="form-header">
              <h2>Bem-vindo de volta</h2>
              <p>Acesse sua conta para continuar</p>
            </div>

            {error && (
              <div className="error-alert">
                <FiAlertCircle className="error-icon" />
                <div>
                  <div className="error-title">Erro ao fazer login</div>
                  <div className="error-message">{error}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <div className="input-wrapper">
                  <FiMail className="input-icon" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    placeholder="seu@email.com"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Senha</label>
                <div className="input-wrapper">
                  <FiLock className="input-icon" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    placeholder="••••••••"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`submit-button ${loading ? 'loading' : ''}`}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Entrando...
                  </>
                ) : (
                  <>
                    Entrar
                    <FiArrowRight className="button-icon" />
                  </>
                )}
              </button>
            </form>

            <div className="form-footer">
              <p className="credentials-hint">
                Demo: <span>admin@aura.com</span> / <span>admin123</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
