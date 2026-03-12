'use client';
import React from 'react';

export default function LaboratorioPage() {
  return (
    <div style={{ padding: '40px', color: '#fff', textAlign: 'center', backgroundColor: '#0a0a1a', minHeight: '90vh' }}>
      <h1 style={{ fontSize: '3rem', color: '#E50914', marginBottom: '20px' }}>🧪 LABORATÓRIO DE IA</h1>
      <p style={{ fontSize: '1.2rem', color: '#ccc', maxWidth: '800px', margin: '0 auto 40px' }}>
        Bem-vindo ao centro de experimentos da MENTE.AI. Aqui você poderá treinar seus próprios agentes e testar redes neurais em tempo real.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '50px' }}>
        <div style={{ background: '#141414', padding: '30px', borderRadius: '10px', border: '1px solid #333' }}>
          <h2 style={{ color: '#00d4ff' }}>Simulador de Redes</h2>
          <p>Em breve: Visualize o pensamento dos agentes.</p>
        </div>
        <div style={{ background: '#141414', padding: '30px', borderRadius: '10px', border: '1px solid #333' }}>
          <h2 style={{ color: '#00ff88' }}>Treinamento Rápido</h2>
          <p>Em breve: Suba seus dados e crie uma IA personalizada.</p>
        </div>
      </div>
      
      <div style={{ marginTop: '60px', padding: '20px', border: '1px dashed #E50914', borderRadius: '8px' }}>
        <span style={{ fontSize: '1.5rem' }}>⚠️ Módulo em fase Alpha de Desenvolvimento</span>
      </div>
    </div>
  );
}

