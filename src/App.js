import React from 'react';
import './App.css'; // Pode conter estilos globais ou específicos do App
import Dashboard from './components/Dashboard';
import { ImobiliariasProvider } from './context/ImobiliariasContext';

function App() {
  // ID fixo da imobiliária "Galante Imóveis"
  const galanteImobiliariaId = 34; 

  return (
    // O Provider envolve o Dashboard para fornecer os dados
    <ImobiliariasProvider>
      <div className="App">
        {/* Renderiza o Dashboard passando o ID fixo */}
        <Dashboard imobiliariaId={galanteImobiliariaId} />
      </div>
    </ImobiliariasProvider>
  );
}

export default App;
