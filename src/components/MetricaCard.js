import React from 'react';

// Componente de métricas em cards
const MetricaCard = ({ titulo, valor, comparativo, tipo, descricao, max, media, mediaTop5 }) => {
  let corClasse = "text-green-400";
  let icone = "↑";
  
  if (tipo === "tempo") {
    // Para métricas de tempo, menor é melhor
    if (valor > comparativo) {
      corClasse = "text-red-400";
      icone = "↓";
    }
  } else {
    // Para pontuações, maior é melhor
    if (valor < comparativo) {
      corClasse = "text-red-400";
      icone = "↓";
    }
  }
  
  const porcentagem = max ? Math.round((valor / max) * 100) : null;
  const mediaPorcentagem = media && max ? Math.round((media / max) * 100) : null;
  const mediaTop5Porcentagem = mediaTop5 && max ? Math.round((mediaTop5 / max) * 100) : null;

  return (
    <div className="bg-gray-800 bg-opacity-40 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-blue-800 overflow-hidden relative">
      <div className="flex justify-between items-start">
        <h3 className="text-sm text-gray-300 font-medium">{titulo}</h3>
        {comparativo && (
          <span className={`text-xs ${corClasse} flex items-center gap-1`}>
            {icone} vs média
          </span>
        )}
      </div>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-white">{valor}</p>
        {max && (
          <span className="ml-2 text-xs text-gray-400">de {max}</span>
        )}
      </div>
      {porcentagem !== null && (
        <>
          <div className="mt-2 w-full bg-gray-700 rounded-full h-1.5 relative">
            <div 
              className="bg-gradient-to-r from-blue-400 to-indigo-500 h-1.5 rounded-full" 
              style={{ width: `${porcentagem}%` }}
            ></div>
            {mediaPorcentagem !== null && (
              <div 
                className="absolute top-0 h-1.5 border-r border-gray-300" 
                style={{ left: `${mediaPorcentagem}%` }}
                title={`Média: ${media}`}
              ></div>
            )}
            {mediaTop5Porcentagem !== null && (
              <div 
                className="absolute top-0 h-1.5 border-r border-green-400" 
                style={{ left: `${mediaTop5Porcentagem}%` }}
                title={`Top 5: ${mediaTop5}`}
              ></div>
            )}
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-400">
            {mediaPorcentagem !== null && (
              <span>Média: {media}</span>
            )}
            {mediaTop5Porcentagem !== null && (
              <span className="text-green-400">Top 5: {mediaTop5}</span>
            )}
          </div>
        </>
      )}
      {descricao && (
        <p className="mt-2 text-xs text-gray-400">{descricao}</p>
      )}
    </div>
  );
};

export default MetricaCard;