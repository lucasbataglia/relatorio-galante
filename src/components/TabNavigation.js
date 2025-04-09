import React from 'react';

// Função para calcular a pontuação da primeira resposta
const calcularPontuacaoPrimeiraResposta = (tempo) => {
  if (!tempo || tempo === 'N/A') return 0;
  
  // Converter tempo no formato HH:MM:SS para segundos
  const partes = tempo.split(':');
  if (partes.length !== 3) return 0;
  
  const segundos = parseInt(partes[0]) * 3600 + parseInt(partes[1]) * 60 + parseInt(partes[2]);
  
  // Cálculo da pontuação conforme os critérios definidos
  if (segundos <= 300) return 10;       // <= 5 minutos
  if (segundos <= 600) return 8;        // <= 10 minutos
  if (segundos <= 900) return 6;        // <= 15 minutos
  if (segundos <= 1800) return 4;       // <= 30 minutos
  if (segundos <= 3600) return 2;       // <= 1 hora
  return 0;                             // > 1 hora
};

// Função para calcular a pontuação da transferência para o corretor
const calcularPontuacaoTransferenciaCorretor = (tempo) => {
  if (!tempo || tempo === 'N/A') return 0;
  
  // Converter tempo no formato HH:MM:SS para segundos
  const partes = tempo.split(':');
  if (partes.length !== 3) return 0;
  
  const segundos = parseInt(partes[0]) * 3600 + parseInt(partes[1]) * 60 + parseInt(partes[2]);
  
  // Cálculo da pontuação conforme os critérios definidos
  if (segundos <= 600) return 8;        // <= 10 minutos
  if (segundos <= 1800) return 6;       // <= 30 minutos
  if (segundos <= 3600) return 4;       // <= 1 hora
  if (segundos <= 7200) return 2;       // <= 2 horas
  return 0;                             // > 2 horas
};

const TabNavigation = ({ selectedTab, setSelectedTab, imobiliariaData }) => {
  // Calcular a pontuação total de tempo de resposta
  const pontuacaoPrimeiraResposta = calcularPontuacaoPrimeiraResposta(imobiliariaData?.tempoPrimeiraResposta);
  const pontuacaoTransferenciaCorretor = calcularPontuacaoTransferenciaCorretor(imobiliariaData?.tempoContatoCorretor);
  const pontuacaoVelocidadeMedia = imobiliariaData?.velocidadeMedia || 0;
  
  // Soma das pontuações (máximo de 25 pontos)
  const pontuacaoTempoResposta = pontuacaoPrimeiraResposta + pontuacaoTransferenciaCorretor + pontuacaoVelocidadeMedia;
  
  return (
    <div className="flex overflow-x-auto bg-gray-800 bg-opacity-60 backdrop-blur-md rounded-lg mb-6 p-1 border border-gray-700">
      <button 
        onClick={() => setSelectedTab("resumo")}
        className={`px-4 py-2 rounded-md text-sm font-medium transition ${selectedTab === "resumo" ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white" : "text-gray-300 hover:text-white"}`}
      >
        Resumo
      </button>
      <button 
        onClick={() => setSelectedTab("metodologia")}
        className={`px-4 py-2 rounded-md text-sm font-medium transition ${selectedTab === "metodologia" ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white" : "text-gray-300 hover:text-white"}`}
      >
        Metodologia
      </button>
      <button 
        onClick={() => setSelectedTab("tempoResposta")}
        className={`px-4 py-2 rounded-md text-sm font-medium transition ${selectedTab === "tempoResposta" ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white" : "text-gray-300 hover:text-white"}`}
      >
        Tempo de Resposta <span className="ml-1 px-1.5 py-0.5 bg-blue-700/70 rounded text-xs">{pontuacaoTempoResposta}/{25}</span>
      </button>
      <button 
        onClick={() => setSelectedTab("qualidadeAtendimento")}
        className={`px-4 py-2 rounded-md text-sm font-medium transition ${selectedTab === "qualidadeAtendimento" ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white" : "text-gray-300 hover:text-white"}`}
      >
        Qualidade do Atendimento <span className="ml-1 px-1.5 py-0.5 bg-blue-700/70 rounded text-xs">{imobiliariaData.qualidadeAtendimento}/{25}</span>
      </button>
      <button 
        onClick={() => setSelectedTab("apresentacaoImoveis")}
        className={`px-4 py-2 rounded-md text-sm font-medium transition ${selectedTab === "apresentacaoImoveis" ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white" : "text-gray-300 hover:text-white"}`}
      >
        Apresentação de Imóveis <span className="ml-1 px-1.5 py-0.5 bg-blue-700/70 rounded text-xs">{imobiliariaData.apresentacaoImoveis}/{20}</span>
      </button>
      <button 
        onClick={() => setSelectedTab("followUp")}
        className={`px-4 py-2 rounded-md text-sm font-medium transition ${selectedTab === "followUp" ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white" : "text-gray-300 hover:text-white"}`}
      >
        Follow-up <span className="ml-1 px-1.5 py-0.5 bg-blue-700/70 rounded text-xs">{imobiliariaData.followUp}/{15}</span>
      </button>
      <button 
        onClick={() => setSelectedTab("experienciaCliente")}
        className={`px-4 py-2 rounded-md text-sm font-medium transition ${selectedTab === "experienciaCliente" ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white" : "text-gray-300 hover:text-white"}`}
      >
        Experiência do Cliente <span className="ml-1 px-1.5 py-0.5 bg-blue-700/70 rounded text-xs">{imobiliariaData.experienciaCliente}/{15}</span>
      </button>
      <button 
        onClick={() => setSelectedTab("recomendacoes")}
        className={`px-4 py-2 rounded-md text-sm font-medium transition ${selectedTab === "recomendacoes" ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white" : "text-gray-300 hover:text-white"}`}
      >
        Recomendações
      </button>
    </div>
  );
};

export default TabNavigation;