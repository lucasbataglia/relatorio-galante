import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const TabExperienciaCliente = ({ imobiliariaData, mercadoData }) => {
  // Valores seguros para dados do mercado
  const mercadoDataSafe = {
    experienciaCliente: mercadoData?.experienciaCliente || 0,
    top5: {
      experienciaCliente: mercadoData?.top5?.experienciaCliente || 0
    }
  };
  
  // Função para formatar número com toFixed de forma segura
  const formatarNumero = (valor, casasDecimais = 1) => {
    if (valor === undefined || valor === null) return '0.0';
    const num = parseFloat(valor);
    return isNaN(num) ? '0.0' : num.toFixed(casasDecimais);
  };
  
  // Dados reais de comparação do mercado com base no CSV
  const mediaTop5 = mercadoData.top5.experienciaCliente;
  const mediaGeral = mercadoData.experienciaCliente;
  const maximo = mercadoData.top5.maxExperienciaCliente;
  
  // Função para determinar a cor baseada no desempenho
  const obterCorClasse = (valor, maximo) => {
    const percentual = ((valor || 0) / (maximo || 1)) * 100;
    if (percentual >= 80) return "text-pink-500";
    if (percentual >= 60) return "text-pink-400";
    if (percentual >= 40) return "text-red-400";
    return "text-red-500 bad-score";
  };

  // Dados para o gráfico de comparação
  const dadosComparacao = [
    {
      nome: "Pontuação",
      imobiliaria: imobiliariaData.experienciaCliente,
      media: mediaGeral,
      top5: mediaTop5,
      maximo: 15
    }
  ];
  
  // Dados para o gráfico de subcategorias
  const dadosSubcategorias = [
    { 
      nome: "Adaptabilidade", 
      imobiliaria: imobiliariaData.adaptabilidade, 
      media: mercadoData.adaptabilidade,
      top5: 4.7,
      maximo: 5 
    },
    { 
      nome: "Resolução de Objeções", 
      imobiliaria: imobiliariaData.resolucaoObjecoes, 
      media: mercadoData.resolucaoObjecoes,
      top5: 4.4,
      maximo: 5 
    },
    { 
      nome: "Eficiência Geral", 
      imobiliaria: imobiliariaData.eficienciaGeral, 
      media: mercadoData.eficienciaGeral,
      top5: 4.5,
      maximo: 5
    }
  ];
  
  // Dados para o gráfico de radar
  const dadosRadar = [
    { 
      atributo: "Respeito Disponibilidade", 
      valor: Math.min(Math.round((imobiliariaData.adaptabilidade || 0) / 5 * 100), 100), 
      media: 62 
    },
    { 
      atributo: "Foco Necessidades", 
      valor: Math.min(Math.round((imobiliariaData.eficienciaGeral || 0) / 5 * 100), 100), 
      media: 55 
    },
    { 
      atributo: "Clareza Comunicação", 
      valor: Math.min(Math.round((imobiliariaData.profissionalismo || 0) / 6 * 100), 100), 
      media: 70 
    },
    { 
      atributo: "Oferecimento Alternativas", 
      valor: Math.min(Math.round((imobiliariaData.resolucaoObjecoes || 0) / 5 * 100), 100), 
      media: 52 
    },
    { 
      atributo: "Velocidade Respostas", 
      valor: Math.min(Math.round((imobiliariaData.primeiraResposta || 0) / 10 * 100), 100), 
      media: 58 
    }
  ];

  return (
    <div className="space-y-6">
      {/* Cabeçalho com gradiente */}
      <div className="bg-gradient-to-r from-pink-900 to-pink-600 rounded-xl shadow-xl overflow-hidden">
        <div className="relative p-6">
          {/* Overlay pattern */}
          <div className="absolute inset-0 opacity-10 mix-blend-overlay" 
               style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
          
          <div className="flex items-center justify-between relative">
            <div className="flex items-center">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg mr-3 backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div style={{ margin: 0, padding: 0 }}>
                <h2 className="text-2xl font-bold text-white leading-tight m-0 p-0 text-left whitespace-pre">{`Experiência do Cliente`}</h2>
                <p className="text-pink-100 text-opacity-90 mt-1 m-0 text-left whitespace-pre">{`Avalia a experiência geral do cliente durante o atendimento`}</p>
              </div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg px-6 py-4 flex flex-col border border-white border-opacity-20">
              <p className="text-pink-100 text-sm mb-1 font-medium text-left">Pontuação</p>
              <div className="flex items-baseline">
                <span className={`text-4xl font-bold ${obterCorClasse(imobiliariaData.experienciaCliente, 15)}`}>
                  {imobiliariaData.experienciaCliente}
                </span>
                <span className="text-pink-100 text-sm ml-1 opacity-80">/15</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Conteúdo Principal - Layout de 2 colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coluna 1 */}
        <div className="space-y-6">
          {/* Subcategorias */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Desempenho por Subcategoria</h3>
            </div>
            <div className="p-6 space-y-4">
              {dadosSubcategorias.map((item, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-white text-left">{item.nome}</h3>
                    <div className="flex items-center">
                      <span className={`text-xl font-bold ${obterCorClasse(item.imobiliaria, item.maximo)}`}>
                        {item.imobiliaria}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">/{item.maximo}</span>
                    </div>
                  </div>
                  
                  {/* Barra de progresso */}
                  <div className="mt-3 relative">
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                      <div 
                        className="bg-gradient-to-r from-pink-600 to-pink-400 h-2.5 rounded-full" 
                        style={{ width: `${(item.imobiliaria / item.maximo) * 100}%` }}
                      ></div>
                      
                      {/* Linhas de referência */}
                      <div 
                        className="absolute top-0 h-2.5 border-r border-gray-400 dark:border-gray-300" 
                        style={{ left: `${(item.media / item.maximo) * 100}%` }}
                      ></div>
                      <div 
                        className="absolute top-0 h-2.5 border-r border-pink-500" 
                        style={{ left: `${(item.top5 / item.maximo) * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span className="text-left">Média: {formatarNumero(item.media)}</span>
                      <span className="text-pink-500 dark:text-pink-400 text-right">Top 5: {item.top5}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Gráfico de barras comparativo */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg text-left">Comparação com o mercado</h3>
            </div>
            <div className="p-6">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dadosComparacao}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="nome" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" domain={[0, 15]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                                     borderColor: '#e5e7eb', 
                                     color: '#1f2937',
                                     boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                    />
                    <Legend wrapperStyle={{ color: '#4b5563' }} />
                    <Bar name={imobiliariaData.nome} dataKey="imobiliaria" fill="#EC4899" />
                    <Bar name="Média do Mercado" dataKey="media" fill="#0EA5E9" />
                    <Bar name="Média Top 5" dataKey="top5" fill="#F472B6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        
        {/* Coluna 2 */}
        <div className="space-y-6">
          {/* Gráfico de radar */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg text-left">Perfil de Experiência</h3>
            </div>
            <div className="p-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={110} data={dadosRadar}>
                    <PolarGrid stroke="#CBD5E1" />
                    <PolarAngleAxis dataKey="atributo" tick={{ fill: '#64748b', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                    <Radar
                      name={imobiliariaData.nome}
                      dataKey="valor"
                      stroke="#EC4899"
                      fill="#EC4899"
                      fillOpacity={0.5}
                    />
                    <Radar
                      name="Média do Setor"
                      dataKey="media"
                      stroke="#0EA5E9"
                      fill="#0EA5E9"
                      fillOpacity={0.3}
                    />
                    <Legend wrapperStyle={{ color: '#4b5563' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                                     borderColor: '#e5e7eb', 
                                     color: '#1f2937',
                                     boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                      formatter={(value) => [`${value}/100`, '']}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Análise crítica */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg flex items-center text-left">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Análise crítica
              </h3>
            </div>
            <div className="p-6">
              <div className="bg-red-50 dark:bg-red-900 dark:bg-opacity-20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-2 text-left">
                  <li>{imobiliariaData.nome} recebeu {imobiliariaData.adaptabilidade || 0}/5 pontos em adaptabilidade e {imobiliariaData.resolucaoObjecoes || 0}/5 pontos em resolução de objeções</li>
                  <li>A eficiência geral ({imobiliariaData.eficienciaGeral || 0}/5 pontos) {(imobiliariaData.eficienciaGeral || 0) > 2 ? "foi um ponto positivo" : "precisa ser melhorada"} nesta categoria</li>
                  <li>A pontuação total ({imobiliariaData.experienciaCliente || 0}/15) está {(imobiliariaData.experienciaCliente || 0) < (mercadoData?.experienciaCliente || 0) ? "abaixo" : "acima"} da média do mercado ({formatarNumero(mercadoData?.experienciaCliente || 0)}/15)</li>
                  <li>{(imobiliariaData.experienciaCliente || 0) < 10 ? "Esta categoria representa uma oportunidade significativa de melhoria" : "O desempenho nesta categoria é satisfatório, mas sempre há espaço para aprimoramentos"}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Métrica de pontuação - Seção inferior */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg flex items-center text-left">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Como a pontuação é calculada
          </h3>
        </div>
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-left">
            A experiência do cliente avalia a qualidade percebida pelo cliente durante todo o processo de atendimento.
            Esta categoria representa 15% da pontuação total e é determinante para a percepção e reputação da imobiliária.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h5 className="text-pink-600 dark:text-pink-400 font-medium mb-3 text-left">Adaptabilidade (5 pts)</h5>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 text-sm text-left">
                <li>Respeito à disponibilidade do cliente: 3 pontos</li>
                <li>Adaptação às preferências de comunicação: 2 pontos</li>
              </ul>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h5 className="text-pink-600 dark:text-pink-400 font-medium mb-3 text-left">Resolução de objeções (5 pts)</h5>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 text-sm text-left">
                <li>Resposta adequada a dúvidas/objeções: 3 pontos</li>
                <li>Oferecimento de alternativas: 2 pontos</li>
              </ul>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h5 className="text-pink-600 dark:text-pink-400 font-medium mb-3 text-left">Eficiência geral (5 pts)</h5>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 text-sm text-left">
                <li>Atendimento completo sem redundâncias: 2 pontos</li>
                <li>Foco nas necessidades principais: 3 pontos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabExperienciaCliente;