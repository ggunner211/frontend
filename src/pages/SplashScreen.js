import React from 'react';
import '../styles/SplashScreen.css';

export const SplashScreen = () => {
  return (
    <div className="splash-container">
      {/* Background animado */}
      <div className="splash-bg"></div>
      
      {/* Orbs flutuantes */}
      <div className="splash-orb splash-orb-1"></div>
      <div className="splash-orb splash-orb-2"></div>
      <div className="splash-orb splash-orb-3"></div>

      {/* Conteúdo principal */}
      <div className="splash-content">
        {/* Logo com gradiente */}
        <div className="splash-logo-wrapper">
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="splash-logo-svg"
          >
            <defs>
              <linearGradient id="splashGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFA500" />
                <stop offset="33%" stopColor="#FF6B9D" />
                <stop offset="66%" stopColor="#C44569" />
                <stop offset="100%" stopColor="#4169E1" />
              </linearGradient>
              <filter id="splashGlow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Círculo externo gradiente com brilho */}
            <circle cx="100" cy="100" r="95" fill="url(#splashGradient)" filter="url(#splashGlow)" />

            {/* Círculo branco interno */}
            <circle cx="100" cy="100" r="70" fill="white" />

            {/* Anéis internos gradiente */}
            <circle cx="100" cy="100" r="60" fill="none" stroke="url(#splashGradient)" strokeWidth="12" opacity="0.9" />
            <circle cx="100" cy="100" r="45" fill="none" stroke="url(#splashGradient)" strokeWidth="8" opacity="0.6" />
            <circle cx="100" cy="100" r="30" fill="none" stroke="url(#splashGradient)" strokeWidth="4" opacity="0.3" />
          </svg>

          {/* Pulso ao redor do logo */}
          <div className="splash-logo-pulse"></div>
        </div>

        {/* Texto */}
        <div className="splash-text">
          <h1 className="splash-title">AURA</h1>
          <p className="splash-subtitle">Sistema Inteligente de Gestão</p>
          <p className="splash-description">
            Gerenciamento completo de impressoras,
            <br />
            suprimentos e serviços em um único lugar
          </p>
        </div>

        {/* Loading indicator */}
        <div className="splash-loading">
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p className="loading-text">Carregando...</p>
        </div>
      </div>

      {/* Decoração inferior */}
      <div className="splash-footer">
        <div className="footer-line"></div>
        <p className="footer-text">Powered by AURA © 2025</p>
      </div>
    </div>
  );
};

export default SplashScreen;
