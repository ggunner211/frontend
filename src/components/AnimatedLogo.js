import React from 'react';
import '../styles/AnimatedLogo.css';

export const AnimatedLogo = () => {
  return (
    <div className="animated-logo-container">
      <div className="animated-logo">
        {/* Círculo gradiente - Ícone Real da AURA */}
        <svg
          width="60"
          height="60"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="logo-svg"
        >
          <defs>
            <linearGradient id="auraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFA500" />
              <stop offset="50%" stopColor="#FF6B35" />
              <stop offset="100%" stopColor="#4169E1" />
            </linearGradient>
          </defs>

          {/* Círculo externo gradiente */}
          <circle cx="60" cy="60" r="55" fill="url(#auraGradient)" />

          {/* Círculo branco interno (anel) */}
          <circle cx="60" cy="60" r="40" fill="white" />

          {/* Anel colorido interno (espelho do gradiente externo) */}
          <circle cx="60" cy="60" r="35" fill="none" stroke="url(#auraGradient)" strokeWidth="8" />
        </svg>

        {/* Pulse animado ao redor */}
        <div className="pulse-ring"></div>
      </div>

      {/* Texto "AURA" flutuante */}
      <div className="logo-text">
        <span className="text-gradient">AURA</span>
      </div>
    </div>
  );
};
