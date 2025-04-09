import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const TabFollowUp = ({ imobiliariaData, mercadoData }) => {
  // Função para formatar número com toFixed de forma segura
  const formatarNumero = (valor, casasDecimais = 1) => {
    if (valor === undefined || valor === null) return '0.0';
    const num = parseFloat(valor);
    return isNaN(num) ? '0.0' : num.toFixed(casasDecimais);
  };

  // Valores seguros para dados do mercado
  const mercadoDataSafe = {
    followUp: mercadoData?.followUp || 0,
    mediaFollowUps: mercadoData?.mediaFollowUps || 0,
    top5: {
      followUp: mercadoData?.top5?.followUp || 0
    }
  };
  
  // Valores seguros para imobiliaria
  const followUpSafe = {
    pontuacao: imobiliariaData?.followUp || 0,
    numeroFollowUps: imobiliariaData?.numeroFollowUps || 0
  };
  
  // Corrigindo a definição de statsData
  const statsData = [
    { 
      label: "Total de Follow-up", 
      valor: followUpSafe.numeroFollowUps, 
      descricao: "Total de contatos adicionais", 
      mediaSetor: formatarNumero(mercadoDataSafe.mediaFollowUps)
    },
    // ... resto do objeto statsData ...
  ];
  
  // Dados reais de comparação do mercado com base no CSV
  const mediaTop5 = mercadoData?.top5?.followUp || 0;
  const mediaGeral = mercadoData?.followUp || 0;
  const maximo = mercadoData?.top5?.maxFollowUp || 15;
  
  // Função para determinar a cor baseada no desempenho
  const obterCorClasse = (valor, maximo) => {
    const percentual = ((valor || 0) / (maximo || 1)) * 100;
    if (percentual >= 80) return "text-purple-500";
    if (percentual >= 60) return "text-purple-400";
    if (percentual >= 40) return "text-purple-300";
    return "text-red-500 bad-score";
  };

  // Dados para o gráfico de distribuição
  const dadosDistribuicao = [
    { nome: "Nenhum follow-up", valor: 31 },
    { nome: "1 follow-up", valor: 28 },
    { nome: "2 follow-ups", valor: 10 },
    { nome: "3+ follow-ups", valor: 3 }
  ];
  
  // Dados para o gráfico de comparação
  const dadosComparacao = [
    {
      nome: "Pontuação",
      imobiliaria: imobiliariaData?.followUp || 0,
      media: mediaGeral,
      top5: mediaTop5,
      maximo: 15
    }
  ];
  
  // Dados para o gráfico de subcategorias
  const dadosSubcategorias = [
    { 
      nome: "Persistência", 
      imobiliaria: imobiliariaData?.persistencia || 0, 
      media: mercadoData?.persistencia || 0,
      top5: 6.3,
      maximo: 7 
    },
    { 
      nome: "Qualidade do Follow-up", 
      imobiliaria: imobiliariaData?.qualidadeFollowUp || 0, 
      media: mercadoData?.qualidadeFollowUp || 0,
      top5: 5.1,
      maximo: 8 
    }
  ];
  
  // Cores para os gráficos
  const COLORS = ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE'];

  // Dados sobre o número de follow-ups
  const followupInfo = {
    quantidade: imobiliariaData?.numeroFollowUps || 0,
    descricao: "Follow-ups realizados",
    mediaSetor: formatarNumero(mercadoDataSafe.mediaFollowUps),
    mediaTop5: 2.5,
    status: (imobiliariaData?.numeroFollowUps || 0) > 0 ? "Realizado" : "Não realizado"
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho com gradiente */}
      <div className="bg-gradient-to-r from-purple-900 to-purple-600 rounded-xl shadow-xl overflow-hidden">
        <div className="relative p-6">
          {/* Overlay pattern */}
          <div className="absolute inset-0 opacity-10 mix-blend-overlay" 
               style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
          
          <div className="flex items-center justify-between relative">
            <div className="flex items-center">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg mr-3 backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div style={{ margin: 0, padding: 0 }}>
                <h2 className="text-2xl font-bold text-white leading-tight m-0 p-0 text-left whitespace-pre">{`Follow-up`}</h2>
                <p className="text-purple-100 text-opacity-90 mt-1 m-0 text-left whitespace-pre">{`Avalia a persistência e qualidade dos contatos subsequentes`}</p>
              </div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg px-6 py-4 flex flex-col border border-white border-opacity-20">
              <p className="text-purple-100 text-sm mb-1 font-medium text-left">Pontuação</p>
              <div className="flex items-baseline">
                <span className={`text-4xl font-bold ${obterCorClasse(imobiliariaData?.followUp || 0, 15)}`}>
                  {formatarNumero(imobiliariaData?.followUp || 0)}
                </span>
                <span className="text-purple-100 text-sm ml-1 opacity-80">/15</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Conteúdo Principal - Layout de 2 colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coluna 1 */}
        <div className="space-y-6">
          {/* Status de follow-up */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className={`p-3 rounded-lg ${followupInfo.quantidade > 0 ? "bg-purple-100 dark:bg-purple-900 dark:bg-opacity-30" : "bg-red-100 dark:bg-red-900 dark:bg-opacity-30"} mr-4`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${followupInfo.quantidade > 0 ? "text-purple-500 dark:text-purple-400" : "text-red-500 dark:text-red-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{followupInfo.descricao}</h3>
                    <div className="flex items-center mt-1">
                      <span className={`text-lg font-medium ${followupInfo.quantidade > 0 ? "text-purple-500 dark:text-purple-400" : "text-red-500 dark:text-red-400"}`}>
                        {followupInfo.quantidade} {followupInfo.quantidade === 1 ? "follow-up" : "follow-ups"}
                      </span>
                      <span className={`ml-3 px-2 py-0.5 rounded-full text-xs ${
                        followupInfo.quantidade > 1 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:bg-opacity-40 dark:text-green-300" : 
                        followupInfo.quantidade === 1 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:bg-opacity-40 dark:text-yellow-300" :
                        "bg-red-100 text-red-800 dark:bg-red-900 dark:bg-opacity-40 dark:text-red-300"
                      }`}>
                        {followupInfo.quantidade > 1 ? "Bom" : 
                         followupInfo.quantidade === 1 ? "Regular" : 
                         "Insuficiente"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Comparações</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Média</span>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{followupInfo.mediaSetor}</p>
                    </div>
                    <div className="text-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Top 5</span>
                      <p className="text-lg font-bold text-purple-500 dark:text-purple-400">{followupInfo.mediaTop5}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Subcategorias */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Desempenho por Subcategoria</h3>
            </div>
            <div className="p-6 space-y-4">
              {dadosSubcategorias.map((item, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-white">{item.nome}</h3>
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
                        className="bg-gradient-to-r from-purple-600 to-purple-400 h-2.5 rounded-full" 
                        style={{ width: `${((item.imobiliaria || 0) / (item.maximo || 1)) * 100}%` }}
                      ></div>
                      
                      {/* Linhas de referência */}
                      <div 
                        className="absolute top-0 h-2.5 border-r border-gray-400 dark:border-gray-300" 
                        style={{ left: `${((item.media || 0) / (item.maximo || 1)) * 100}%` }}
                      ></div>
                      <div 
                        className="absolute top-0 h-2.5 border-r border-purple-500" 
                        style={{ left: `${((item.top5 || 0) / (item.maximo || 1)) * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>Média: {formatarNumero(item.media)}</span>
                      <span className="text-purple-500 dark:text-purple-400">Top 5: {item.top5}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Visão Geral de Mercado - Oportunidades */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg text-left flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Oportunidades de Diferenciação
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {/* Estatísticas do mercado */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center border border-purple-200 dark:border-purple-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Não fazem follow-up</p>
                    <p className="text-xl font-bold text-red-500">43%</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">das imobiliárias</p>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center border border-purple-200 dark:border-purple-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Fazem apenas 1</p>
                    <p className="text-xl font-bold text-yellow-500">39%</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">das imobiliárias</p>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center border border-purple-200 dark:border-purple-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Fazem 2+ follow-ups</p>
                    <p className="text-xl font-bold text-green-500">18%</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">das imobiliárias</p>
                  </div>
                </div>
                
                {/* Oportunidades */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800 text-left">
                  <h4 className="font-medium text-purple-600 dark:text-purple-400 mb-3 text-left">Oportunidades de destaque no mercado:</h4>
                  <ul className="space-y-3 text-left">
                    <li className="flex items-start">
                      <div className="bg-purple-100 dark:bg-purple-800 rounded-full p-1 mr-2 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">Implementar um sistema de acompanhamento programado com pelo menos 3 follow-ups por cliente potencial</p>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-purple-100 dark:bg-purple-800 rounded-full p-1 mr-2 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">Oferecer novas opções de imóveis em cada follow-up, mantendo o interesse do cliente ativo</p>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-purple-100 dark:bg-purple-800 rounded-full p-1 mr-2 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">Utilizar um mix de canais (WhatsApp, e-mail, ligação) para aumentar as chances de resposta do cliente</p>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-purple-100 dark:bg-purple-800 rounded-full p-1 mr-2 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">Personalizar os follow-ups com base nas interações anteriores, mostrando que a imobiliária está atenta às necessidades</p>
                    </li>
                  </ul>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 text-left">
                  Com apenas <span className="text-purple-600 font-medium">18%</span> das imobiliárias realizando 2 ou mais follow-ups, 
                  existe uma clara oportunidade de diferenciação neste aspecto. As imobiliárias top 5 do mercado realizam em média 
                  <span className="text-purple-600 font-medium"> 2.5 follow-ups</span> por atendimento e incluem informações relevantes 
                  e novas opções a cada contato.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Coluna 2 */}
        <div className="space-y-6">
          {/* Gráfico de barras comparativo */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Comparação com o mercado</h3>
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
                    <Bar name={imobiliariaData.nome} dataKey="imobiliaria" fill="#8B5CF6" />
                    <Bar name="Média do Mercado" dataKey="media" fill="#0EA5E9" />
                    <Bar name="Média Top 5" dataKey="top5" fill="#A78BFA" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Análise */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Análise de Desempenho
              </h3>
            </div>
            <div className="p-6">
              <div className="bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-2 text-left">
                  <li>{imobiliariaData.nome} realizou apenas 1 follow-up ({imobiliariaData?.persistencia || 0}/7 pontos em persistência)</li>
                  <li>A qualidade do follow-up foi {imobiliariaData?.qualidadeFollowUp > 0 ? "moderada" : "insuficiente"} ({imobiliariaData?.qualidadeFollowUp || 0}/8 pontos){imobiliariaData?.qualidadeFollowUp > 0 ? "" : " - sem novas opções ou tentativas de agendamento"}</li>
                  <li>A pontuação total na categoria ({imobiliariaData?.followUp || 0}/15) está {(imobiliariaData?.followUp || 0) > (mercadoData?.followUp || 0) ? "acima" : "ligeiramente abaixo"} da média do mercado ({formatarNumero(mercadoData?.followUp || 0)}/15)</li>
                  <li>As melhores imobiliárias realizam 2-3 follow-ups com conteúdo relevante</li>
                </ul>
              </div>
              <p className="mt-4 text-gray-600 dark:text-gray-300 text-left">
                O follow-up avalia a persistência e a qualidade dos contatos após a primeira interação.
                Esta categoria representa 15% da pontuação total e é crucial para aumentar a taxa de conversão.
              </p>
            </div>
          </div>
          
          {/* Método de pontuação */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Método de Pontuação
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h5 className="text-purple-600 dark:text-purple-400 font-medium mb-3 text-left">Persistência (7 pts)</h5>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 text-sm text-left">
                    <li>Follow-up no dia seguinte: 3 pontos</li>
                    <li>Follow-up após 2-3 dias: 2 pontos</li>
                    <li>Follow-up na semana seguinte: 2 pontos</li>
                  </ul>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h5 className="text-purple-600 dark:text-purple-400 font-medium mb-3 text-left">Qualidade do follow-up (8 pts)</h5>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 text-sm text-left">
                    <li>Novas informações ou imóveis: 3 pontos</li>
                    <li>Tentativa de agendamento de visitas: 3 pontos</li>
                    <li>Perguntas de feedback sobre opções: 2 pontos</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Incluímos os elementos da seção inferior na coluna direita */}
    </div>
  );
};

export default TabFollowUp;