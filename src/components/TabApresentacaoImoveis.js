import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const TabApresentacaoImoveis = ({ imobiliariaData, mercadoData, subcategoriasApresentacao }) => {
  // Dados reais de comparação do mercado com base no CSV
  const mediaTop5 = mercadoData?.top5?.apresentacaoImoveis || 0;
  const mediaGeral = mercadoData?.apresentacaoImoveis || 0;
  const maximo = mercadoData?.top5?.maxApresentacaoImoveis || 0;
  
  // Função para formatar número com toFixed de forma segura
  const formatarNumero = (valor, casasDecimais = 1) => {
    if (valor === undefined || valor === null) return '0.0';
    const num = parseFloat(valor);
    return isNaN(num) ? '0.0' : num.toFixed(casasDecimais);
  };
  
  // Valores seguros para mercadoData
  const mercadoDataSafe = {
    apresentacaoImoveis: mercadoData?.apresentacaoImoveis || 0,
    quantidadeImoveis: mercadoData?.quantidadeImoveis || 0,
    aderenciaCriterios: mercadoData?.aderenciaCriterios || 0,
    qualidadeMaterial: mercadoData?.qualidadeMaterial || 0,
    top5: {
      apresentacaoImoveis: mercadoData?.top5?.apresentacaoImoveis || 0,
      quantidadeImoveis: mercadoData?.top5?.quantidadeImoveis || 0,
      aderenciaCriterios: mercadoData?.top5?.aderenciaCriterios || 0,
      qualidadeMaterial: mercadoData?.top5?.qualidadeMaterial || 0
    },
    mediaOpcoesEnviadas: mercadoData?.mediaOpcoesEnviadas || 0
  };
  
  // Valores seguros para imobiliária
  const imobiliariaDataSafe = {
    apresentacaoImoveis: imobiliariaData?.apresentacaoImoveis || 0,
    quantidadeImoveis: imobiliariaData?.quantidadeImoveis || 0,
    aderenciaCriterios: imobiliariaData?.aderenciaCriterios || 0,
    qualidadeMaterial: imobiliariaData?.qualidadeMaterial || 0,
    opcoesImoveisEnviadas: imobiliariaData?.opcoesImoveisEnviadas || "Não",
    quantasOpcoesEnviadas: imobiliariaData?.quantasOpcoesEnviadas || 0
  };
  
  // Função para determinar a cor baseada no desempenho
  const obterCorClasse = (valor, maximo) => {
    const percentual = ((valor || 0) / (maximo || 1)) * 100;
    if (percentual >= 80) return "text-amber-500";
    if (percentual >= 60) return "text-amber-400";
    if (percentual >= 40) return "text-yellow-500";
    return "text-red-500 bad-score";
  };

  // Dados para o gráfico de distribuição
  const dadosQuantidade = [
    { nome: "0 imóveis", valor: 38 },
    { nome: "1-2 imóveis", valor: 12 },
    { nome: "3-4 imóveis", valor: 15 },
    { nome: "5+ imóveis", valor: 7 }
  ];
  
  // Dados para o gráfico de comparação
  const dadosComparacao = [
    {
      nome: "Pontuação Total",
      imobiliaria: imobiliariaDataSafe.apresentacaoImoveis,
      media: mediaGeral,
      top5: mediaTop5,
      maximo: 20
    }
  ];
  
  // Cores para os gráficos
  const COLORS = ['#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A'];

  // Cores específicas para entidades consistentes em todos os gráficos
  const ENTITY_COLORS = {
    imobiliaria: '#F59E0B', // Cor principal para a imobiliária atual (amber-500)
    mercado: '#0EA5E9',     // Cor para a média do mercado
    top5: '#8B5CF6'         // Cor para o Top 5 (roxo - violet-500)
  };

  // Verificar se subcategoriasApresentacao existe e tem os dados necessários
  const subcategoriasSeguras = Array.isArray(subcategoriasApresentacao) 
    ? subcategoriasApresentacao.map(item => ({
        ...item,
        imobiliaria: item.imobiliaria || 0,
        mercado: item.mercado || 0,
        maximo: item.maximo || 1
      }))
    : [];

  return (
    <div className="space-y-6">
      {/* Cabeçalho com gradiente */}
      <div className="bg-gradient-to-r from-amber-900 to-amber-700 rounded-xl shadow-xl overflow-hidden">
        <div className="relative p-6">
          {/* Overlay pattern */}
          <div className="absolute inset-0 opacity-10 mix-blend-overlay" 
               style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
          
          {/* Removido logo da marca no canto, agora está apenas no cabeçalho principal */}
          
          <div className="flex items-center justify-between relative">
            <div className="flex items-center">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg mr-3 backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div style={{ margin: 0, padding: 0 }}>
                <h2 className="text-2xl font-bold text-white leading-tight m-0 p-0 text-left whitespace-pre">{`Apresentação de Imóveis`}</h2>
                <p className="text-amber-100 text-opacity-90 mt-1 m-0 text-left whitespace-pre">{`Avalia os imóveis apresentados e sua adequação às necessidades`}</p>
              </div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg px-6 py-4 flex flex-col border border-white border-opacity-20">
              <p className="text-amber-100 text-sm mb-1 font-medium text-left">Pontuação</p>
              <div className="flex items-baseline">
                <span className={`text-4xl font-bold ${obterCorClasse(imobiliariaDataSafe.apresentacaoImoveis, 20)}`}>
                  {formatarNumero(imobiliariaDataSafe.apresentacaoImoveis || 0)}
                </span>
                <span className="text-amber-100 text-sm ml-1 opacity-80">/20</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Conteúdo Principal - Layout de 2 colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coluna 1 */}
        <div className="space-y-6">
          {/* Status de envio de imóveis */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Status de Apresentação</h3>
                    <div className="flex items-center mt-1">
                      <span className={`text-lg font-medium ${imobiliariaDataSafe.opcoesImoveisEnviadas === "Sim" ? "text-green-500" : "text-red-500"}`}>
                        {imobiliariaDataSafe.opcoesImoveisEnviadas === "Sim" ? "Imóveis enviados" : "Nenhum imóvel enviado"}
                      </span>
                      {imobiliariaDataSafe.opcoesImoveisEnviadas === "Sim" && (
                        <span className="ml-2 text-amber-500 font-bold">
                          ({imobiliariaDataSafe.quantasOpcoesEnviadas || 0} opções)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Média do mercado</div>
                      <div className="text-center">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">{formatarNumero(mercadoDataSafe.mediaOpcoesEnviadas)}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-amber-500 dark:text-amber-400 mb-1">Top 5</div>
                      <div className="text-center">
                        <span className="text-lg font-bold text-amber-500 dark:text-amber-400">4.7</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">imóveis por atendimento</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Visão Geral - Subcategorias */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Desempenho por Subcategoria</h3>
            </div>
            <div className="p-6 space-y-4">
              {subcategoriasSeguras.map((item, index) => (
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
                        className="bg-gradient-to-r from-amber-600 to-amber-400 h-2.5 rounded-full" 
                        style={{ width: `${((item.imobiliaria || 0) / (item.maximo || 1)) * 100}%` }}
                      ></div>
                      
                      {/* Linhas de referência */}
                      <div 
                        className="absolute top-0 h-2.5 border-r border-gray-400 dark:border-gray-300" 
                        style={{ left: `${((item.mercado || 0) / (item.maximo || 1)) * 100}%` }}
                      ></div>
                      <div 
                        className="absolute top-0 h-2.5 border-r border-amber-500" 
                        style={{ left: `${((mercadoDataSafe.top5[item.nome === "Quantidade de imóveis" ? "quantidadeImoveis" : 
                                             item.nome === "Aderência aos critérios" ? "aderenciaCriterios" : 
                                             "qualidadeMaterial"] || 0) / (item.maximo || 1)) * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>Média: {formatarNumero(item.mercado)}</span>
                      <span className="text-amber-500">Top 5: {formatarNumero(mercadoDataSafe.top5[item.nome === "Quantidade de imóveis" ? "quantidadeImoveis" : 
                                             item.nome === "Aderência aos critérios" ? "aderenciaCriterios" : 
                                             "qualidadeMaterial"] || 0)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Análise crítica */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Análise crítica
              </h3>
            </div>
            <div className="p-6">
              <div className="bg-red-50 dark:bg-red-900 dark:bg-opacity-20 rounded-lg p-4 border border-red-200 dark:border-red-800 text-left">
                <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-2 text-left">
                  {imobiliariaDataSafe.opcoesImoveisEnviadas === "Não" && (
                    <>
                      <li>{imobiliariaData.nome} não enviou nenhuma opção de imóvel ao cliente</li>
                      <li>Este é um dos pontos mais graves de todo o atendimento, impactando drasticamente a pontuação geral</li>
                      <li>A média de mercado é de {formatarNumero(mercadoDataSafe.mediaOpcoesEnviadas)} imóveis enviados por atendimento</li>
                      <li>As melhores imobiliárias enviam em média 4-5 opções de imóveis por cliente</li>
                    </>
                  )}
                  {imobiliariaDataSafe.opcoesImoveisEnviadas === "Sim" && imobiliariaDataSafe.quantasOpcoesEnviadas < 3 && (
                    <>
                      <li>{imobiliariaData.nome} enviou apenas {imobiliariaDataSafe.quantasOpcoesEnviadas} {imobiliariaDataSafe.quantasOpcoesEnviadas === 1 ? "opção de imóvel" : "opções de imóveis"} ao cliente</li>
                      <li>Este número é insuficiente para dar boas alternativas e aumentar chances de conversão</li>
                      <li>A média de mercado é de {formatarNumero(mercadoDataSafe.mediaOpcoesEnviadas)} imóveis enviados por atendimento</li>
                      <li>É recomendado enviar pelo menos 3-4 opções para aumentar as chances de sucesso</li>
                    </>
                  )}
                  {imobiliariaDataSafe.opcoesImoveisEnviadas === "Sim" && imobiliariaDataSafe.quantasOpcoesEnviadas >= 3 && imobiliariaDataSafe.aderenciaCriterios < 5 && (
                    <>
                      <li>{imobiliariaData.nome} enviou {imobiliariaDataSafe.quantasOpcoesEnviadas} opções de imóveis, mas com baixa aderência aos critérios desejados ({imobiliariaDataSafe.aderenciaCriterios}/10)</li>
                      <li>Os imóveis apresentados não correspondem adequadamente às necessidades do cliente</li>
                      <li>É essencial focar na qualificação das necessidades para apresentar imóveis mais relevantes</li>
                      <li>Imóveis não adequados às necessidades reduzem drasticamente as chances de conversão em visitas</li>
                    </>
                  )}
                  {imobiliariaDataSafe.opcoesImoveisEnviadas === "Sim" && imobiliariaDataSafe.quantasOpcoesEnviadas >= 3 && imobiliariaDataSafe.aderenciaCriterios >= 5 && imobiliariaDataSafe.qualidadeMaterial < 3 && (
                    <>
                      <li>{imobiliariaData.nome} apresentou imóveis com boa aderência aos critérios, mas com baixa qualidade de material ({imobiliariaDataSafe.qualidadeMaterial}/5)</li>
                      <li>Fotos, descrições ou informações sobre os imóveis são insuficientes ou de baixa qualidade</li>
                      <li>A qualidade do material de apresentação tem impacto direto no interesse do cliente</li>
                      <li>É recomendável melhorar a qualidade das informações e imagens fornecidas</li>
                    </>
                  )}
                  {imobiliariaDataSafe.opcoesImoveisEnviadas === "Sim" && imobiliariaDataSafe.quantasOpcoesEnviadas >= 3 && imobiliariaDataSafe.aderenciaCriterios >= 5 && imobiliariaDataSafe.qualidadeMaterial >= 3 && imobiliariaDataSafe.apresentacaoImoveis < 15 && (
                    <>
                      <li>{imobiliariaData.nome} tem pontuação total ({imobiliariaDataSafe.apresentacaoImoveis}/20) abaixo do esperado</li>
                      <li>Ainda existem pontos específicos a melhorar em cada subcategoria</li>
                      <li>A média do mercado é de {formatarNumero(mercadoDataSafe.apresentacaoImoveis)}/20 pontos</li>
                      <li>As melhores imobiliárias alcançam mais de 16/20 pontos nesta categoria</li>
                    </>
                  )}
                  {imobiliariaDataSafe.opcoesImoveisEnviadas === "Sim" && imobiliariaDataSafe.quantasOpcoesEnviadas >= 3 && imobiliariaDataSafe.aderenciaCriterios >= 5 && imobiliariaDataSafe.qualidadeMaterial >= 3 && imobiliariaDataSafe.apresentacaoImoveis >= 15 && (
                    <>
                      <li>{imobiliariaData.nome} apresenta excelente desempenho na apresentação de imóveis</li>
                      <li>Mesmo com bom desempenho, sempre é possível melhorar para alcançar resultados excepcionais</li>
                      <li>Ainda existe espaço para chegar à pontuação máxima de 20 pontos</li>
                      <li>Manter este padrão de qualidade é essencial para continuar destacando-se do mercado</li>
                    </>
                  )}
                </ul>
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
                    <YAxis stroke="#6b7280" domain={[0, 20]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                                     borderColor: '#e5e7eb', 
                                     color: '#1f2937',
                                     boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                    />
                    <Legend wrapperStyle={{ color: '#4b5563' }} />
                    <Bar name={imobiliariaData.nome} dataKey="imobiliaria" fill={ENTITY_COLORS.imobiliaria} />
                    <Bar name="Média do Mercado" dataKey="media" fill={ENTITY_COLORS.mercado} />
                    <Bar name="Média Top 5" dataKey="top5" fill={ENTITY_COLORS.top5} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Métricas de Apresentação */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg text-left">Métricas de Apresentação</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-5">
                {/* Quantidade de Imóveis */}
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="py-3 px-4 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 font-medium flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-amber-500 text-white mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <span>Quantidade de Imóveis</span>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs text-white ${
                      imobiliariaDataSafe.opcoesImoveisEnviadas === "Sim" && imobiliariaDataSafe.quantasOpcoesEnviadas >= 5 ? "bg-green-500" : 
                      imobiliariaDataSafe.opcoesImoveisEnviadas === "Sim" && imobiliariaDataSafe.quantasOpcoesEnviadas >= 3 ? "bg-blue-500" :
                      imobiliariaDataSafe.opcoesImoveisEnviadas === "Sim" ? "bg-yellow-500" : "bg-red-500"
                    }`}>
                      {imobiliariaDataSafe.opcoesImoveisEnviadas === "Sim" && imobiliariaDataSafe.quantasOpcoesEnviadas >= 5 ? "Excelente" : 
                       imobiliariaDataSafe.opcoesImoveisEnviadas === "Sim" && imobiliariaDataSafe.quantasOpcoesEnviadas >= 3 ? "Bom" :
                       imobiliariaDataSafe.opcoesImoveisEnviadas === "Sim" ? "Regular" : "Insuficiente"}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white dark:bg-gray-900">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 text-left">Quantidade de imóveis apresentados ao cliente</p>
                    <div className="text-2xl font-bold text-gray-800 dark:text-white mb-3 text-left">
                      {imobiliariaDataSafe.opcoesImoveisEnviadas === "Sim" ? imobiliariaDataSafe.quantasOpcoesEnviadas : 0}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-left">Média do mercado</p>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 text-left">{formatarNumero(mercadoDataSafe.mediaOpcoesEnviadas)}</p>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-left">Máximo do mercado</p>
                        <p className="text-sm font-medium text-amber-500 dark:text-amber-400 text-left">12</p>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Métrica de pontuação - Seção inferior */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg flex items-center text-left">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Como a pontuação é calculada
          </h3>
        </div>
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-left">
            A apresentação de imóveis avalia a quantidade, qualidade e relevância das opções de imóveis mostradas ao cliente.
            Esta categoria representa 20% da pontuação total e é crucial para a conversão em visitas.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h5 className="text-amber-600 dark:text-amber-400 font-medium mb-3 text-left">Quantidade de imóveis (5 pts)</h5>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 text-sm text-left">
                <li>5+ opções: 5 pontos</li>
                <li>3-4 opções: 4 pontos</li>
                <li>1-2 opções: 2 pontos</li>
                <li>Nenhum imóvel: 0 pontos</li>
              </ul>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h5 className="text-amber-600 dark:text-amber-400 font-medium mb-3 text-left">Aderência aos critérios (10 pts)</h5>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 text-sm text-left">
                <li>Preço: 3 pontos</li>
                <li>Localização: 3 pontos</li>
                <li>Quartos: 2 pontos</li>
                <li>Outras características: 2 pontos</li>
              </ul>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h5 className="text-amber-600 dark:text-amber-400 font-medium mb-3 text-left">Qualidade do material (5 pts)</h5>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 text-sm text-left">
                <li>Links/imagens de qualidade: 2 pontos</li>
                <li>Descrições detalhadas: 2 pontos</li>
                <li>Organização da informação: 1 ponto</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabApresentacaoImoveis;