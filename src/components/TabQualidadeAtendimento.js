import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const TabQualidadeAtendimento = ({ imobiliariaData, mercadoData, subcategoriasQualidade }) => {
  // Função para formatar número com toFixed de forma segura
  const formatarNumero = (valor, casasDecimais = 1) => {
    if (valor === undefined || valor === null) return '0.0';
    const num = parseFloat(valor);
    return isNaN(num) ? '0.0' : num.toFixed(casasDecimais);
  };
  
  // Garantir que mercadoData existe com todos os campos necessários
  const mercadoDataSafe = {
    qualidadeAtendimento: mercadoData?.qualidadeAtendimento || 0,
    personalizacao: mercadoData?.personalizacao || 0,
    profissionalismo: mercadoData?.profissionalismo || 0,
    qualificacaoCliente: mercadoData?.qualificacaoCliente || 0,
    explicacoesInformacoes: mercadoData?.explicacoesInformacoes || 0,
    satisfacaoClientes: mercadoData?.satisfacaoClientes || 0,
    qualificacaoEquipe: mercadoData?.qualificacaoEquipe || 0,
    organizacao: mercadoData?.organizacao || 0,
    posVenda: mercadoData?.posVenda || 0,
    top5: {
      qualidadeAtendimento: mercadoData?.top5?.qualidadeAtendimento || 0,
      personalizacao: mercadoData?.top5?.personalizacao || 0,
      profissionalismo: mercadoData?.top5?.profissionalismo || 0,
      qualificacaoCliente: mercadoData?.top5?.qualificacaoCliente || 0,
      explicacoesInformacoes: mercadoData?.top5?.explicacoesInformacoes || 0,
      satisfacaoClientes: mercadoData?.top5?.satisfacaoClientes || 0,
      qualificacaoEquipe: mercadoData?.top5?.qualificacaoEquipe || 0,
      organizacao: mercadoData?.top5?.organizacao || 0,
      posVenda: mercadoData?.top5?.posVenda || 0
    }
  };
  
  // Valores seguros para imobiliariaData
  const imobiliariaDataSafe = {
    qualidadeAtendimento: imobiliariaData?.qualidadeAtendimento || 0,
    personalizacao: imobiliariaData?.personalizacao || 0,
    profissionalismo: imobiliariaData?.profissionalismo || 0,
    qualificacaoCliente: imobiliariaData?.qualificacaoCliente || 0,
    explicacoesInformacoes: imobiliariaData?.explicacoesInformacoes || 0
  };

  // Verificação se os dados necessários existem
  if (!imobiliariaData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Erro ao carregar dados</h2>
          <p className="text-gray-600">Não foi possível carregar os dados da imobiliária.</p>
        </div>
      </div>
    );
  }

  // Garantir que subcategoriasQualidade existe
  const subcategoriasQualidadeSafe = subcategoriasQualidade || [
    { 
      nome: 'Personalização', 
      imobiliaria: imobiliariaData?.personalizacao || 0, 
      mercado: mercadoDataSafe.personalizacao || 0,
      top5: mercadoDataSafe.top5?.personalizacao || 0,
      maximo: 7
    },
    { 
      nome: 'Profissionalismo', 
      imobiliaria: imobiliariaData?.profissionalismo || 0, 
      mercado: mercadoDataSafe.profissionalismo || 0,
      top5: mercadoDataSafe.top5?.profissionalismo || 0,
      maximo: 6
    },
    { 
      nome: 'Qualificação do cliente', 
      imobiliaria: imobiliariaData?.qualificacaoCliente || 0, 
      mercado: mercadoDataSafe.qualificacaoCliente || 0,
      top5: mercadoDataSafe.top5?.qualificacaoCliente || 0,
      maximo: 6
    },
    { 
      nome: 'Explicações e informações', 
      imobiliaria: imobiliariaData?.explicacoesInformacoes || 0, 
      mercado: mercadoDataSafe.explicacoesInformacoes || 0,
      top5: mercadoDataSafe.top5?.explicacoesInformacoes || 0,
      maximo: 6
    }
  ];
  
  // Dados reais de comparação do mercado com base no CSV
  const mediaTop5 = mercadoDataSafe.top5?.qualidadeAtendimento || 0;
  const mediaGeral = mercadoDataSafe.qualidadeAtendimento || 0;
  const maximo = mercadoDataSafe.top5?.maxQualidadeAtendimento || 25;
  
  // Função para determinar a cor baseada no desempenho
  const getScoreColor = (score, max) => {
    const percent = ((score || 0) / max) * 100;
    if (percent >= 80) return "text-green-500";
    if (percent >= 60) return "text-blue-500";
    if (percent >= 40) return "text-yellow-500";
    return "text-red-500 bad-score";
  };

  // Dados para o gráfico de comparação
  const comparisonData = [
    {
      name: "Pontuação Total",
      company: imobiliariaData.qualidadeAtendimento || 0,
      average: mediaGeral,
      top5: mediaTop5,
      maxValue: 25
    }
  ];
  
  // Dados para o gráfico de subcategorias
  const subcategoryData = subcategoriasQualidadeSafe.map(item => ({
    name: item.nome,
    value: item.imobiliaria || 0,
    average: item.mercado || 0,
    top5: item.top5 || 0,
    maxValue: item.maximo || 0
  }));
  
  // Cores específicas para entidades consistentes em todos os gráficos
  const ENTITY_COLORS = {
    imobiliaria: '#3B82F6', // Cor principal para a imobiliária atual
    mercado: '#9CA3AF',     // Cor para a média do mercado
    top5: '#60A5FA'         // Cor para o Top 5
  };
  
  // Dados para o gráfico de distribuição de pontos por subcategoria
  const distributionData = [
    { name: "Personalização", value: imobiliariaData.personalizacao || 0, maxScore: 7, color: ENTITY_COLORS.imobiliaria },
    { name: "Profissionalismo", value: imobiliariaData.profissionalismo || 0, maxScore: 6, color: ENTITY_COLORS.imobiliaria },
    { name: "Qualificação do cliente", value: imobiliariaData.qualificacaoCliente || 0, maxScore: 6, color: ENTITY_COLORS.imobiliaria },
    { name: "Explicações e informações", value: imobiliariaData.explicacoesInformacoes || 0, maxScore: 6, color: ENTITY_COLORS.imobiliaria }
  ];

  // Critérios de pontuação
  const scoringCriteria = [
    {
      name: "Personalização",
      maxScore: 7,
      criteria: [
        "Uso consistente do nome do cliente: 2 pontos",
        "Referências às necessidades específicas: 3 pontos",
        "Linguagem adaptada ao perfil do cliente: 2 pontos"
      ],
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
      score: imobiliariaData.personalizacao
    },
    {
      name: "Profissionalismo",
      maxScore: 6,
      criteria: [
        "Apresentação adequada do corretor: 2 pontos",
        "Comunicação clara e cortês: 2 pontos",
        "Sem erros graves de ortografia/gramática: 2 pontos"
      ],
      color: "text-teal-500",
      bgColor: "bg-teal-50 dark:bg-teal-900/20",
      borderColor: "border-teal-200 dark:border-teal-800",
      score: imobiliariaData.profissionalismo
    },
    {
      name: "Qualificação do cliente",
      maxScore: 6,
      criteria: [
        "Perguntas relevantes para entender necessidades: 3 pontos",
        "Clarificação de detalhes específicos: 3 pontos"
      ],
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      borderColor: "border-emerald-200 dark:border-emerald-800",
      score: imobiliariaData.qualificacaoCliente
    },
    {
      name: "Explicações e informações",
      maxScore: 6,
      criteria: [
        "Detalhamentos completos dos imóveis: 3 pontos",
        "Informações adicionais relevantes: 3 pontos"
      ],
      color: "text-lime-500",
      bgColor: "bg-lime-50 dark:bg-lime-900/20",
      borderColor: "border-lime-200 dark:border-lime-800",
      score: imobiliariaData.explicacoesInformacoes
    }
  ];

  // Strengths and weaknesses - Gerados dinamicamente com base nos dados reais
  const strengths = [];
  const weaknesses = [];
  
  // Verificando personalização
  if (imobiliariaData.personalizacao >= 4) {
    strengths.push(`Uso adequado de personalização no atendimento (${imobiliariaData.personalizacao}/7 pontos)`);
  } else if (imobiliariaData.personalizacao > 0) {
    strengths.push(`Uso de linguagem adaptada ao perfil do cliente (${imobiliariaData.personalizacao}/7 pontos na personalização)`);
  } else {
    weaknesses.push(`Ausência de personalização no atendimento (${imobiliariaData.personalizacao}/7 pontos)`);
  }
  
  // Verificando profissionalismo
  if (imobiliariaData.profissionalismo >= 4) {
    strengths.push(`Demonstrou alto profissionalismo no atendimento (${imobiliariaData.profissionalismo}/6 pontos)`);
  } else if (imobiliariaData.profissionalismo > 0) {
    strengths.push(`Demonstrou profissionalismo no atendimento (${imobiliariaData.profissionalismo}/6 pontos)`);
  } else {
    weaknesses.push(`Falta de profissionalismo no atendimento (${imobiliariaData.profissionalismo}/6 pontos)`);
  }
  
  // Verificando qualificação do cliente
  if (imobiliariaData.qualificacaoCliente >= 3) {
    strengths.push(`Boa qualificação das necessidades do cliente (${imobiliariaData.qualificacaoCliente}/6 pontos)`);
  } else if (imobiliariaData.qualificacaoCliente > 0) {
    weaknesses.push(`Qualificação insuficiente das necessidades do cliente (${imobiliariaData.qualificacaoCliente}/6 pontos)`);
  } else {
    weaknesses.push(`Ausência de perguntas para qualificar as necessidades do cliente (${imobiliariaData.qualificacaoCliente}/6 pontos)`);
  }
  
  // Verificando explicações e informações
  if (imobiliariaData.explicacoesInformacoes >= 3) {
    strengths.push(`Explicações e informações detalhadas (${imobiliariaData.explicacoesInformacoes}/6 pontos)`);
  } else if (imobiliariaData.explicacoesInformacoes > 0) {
    weaknesses.push(`Explicações e informações insuficientes (${imobiliariaData.explicacoesInformacoes}/6 pontos)`);
  } else {
    weaknesses.push(`Falta de explicações e informações detalhadas (${imobiliariaData.explicacoesInformacoes}/6 pontos)`);
  }
  
  // Verificando pontuação total
  const pontuacaoTotal = imobiliariaData.qualidadeAtendimento || 0;
  const mediaDoMercado = mercadoData?.qualidadeAtendimento || 0;
  
  if (pontuacaoTotal < mediaDoMercado * 0.7) {
    weaknesses.push(`Pontuação total na categoria (${pontuacaoTotal.toFixed(1)}/25) abaixo da média do mercado (${mediaDoMercado.toFixed(1)}/25)`);
  }
  
  // Garantir que temos pelo menos um item em cada lista
  if (strengths.length === 0) {
    strengths.push("Oportunidade para melhorar em todas as áreas do atendimento");
  }
  
  if (weaknesses.length === 0) {
    weaknesses.push("Excelente desempenho em todas as áreas do atendimento");
  }

  // Função para gerar texto de análise dinâmico baseado na pontuação
  const gerarAnaliseTextual = () => {
    const percentualPontuacao = (pontuacaoTotal / 25) * 100;
    const comparacaoMercado = pontuacaoTotal > mediaDoMercado 
      ? `acima da média do mercado de ${formatarNumero(mediaDoMercado)}/25`
      : pontuacaoTotal === mediaDoMercado
        ? `igual à média do mercado de ${formatarNumero(mediaDoMercado)}/25`
        : `abaixo da média do mercado de ${formatarNumero(mediaDoMercado)}/25`;

    let analiseDesempenho = '';
    let recomendacoes = [];

    // Análise com base na pontuação percentual
    if (percentualPontuacao >= 85) {
      analiseDesempenho = `A ${imobiliariaData.nome} demonstrou excelente desempenho na qualidade do atendimento, com destaque para o profissionalismo e personalização. Com uma pontuação de ${pontuacaoTotal}/25 pontos, está significativamente ${comparacaoMercado}.`;
      recomendacoes = [
        "Manter o alto padrão de atendimento em todos os aspectos",
        "Compartilhar as melhores práticas entre toda a equipe de corretores",
        "Implementar sistema de avaliação contínua para manter a qualidade",
        "Documentar os processos bem-sucedidos para treinamento de novos colaboradores"
      ];
    } else if (percentualPontuacao >= 70) {
      analiseDesempenho = `A ${imobiliariaData.nome} apresentou bom desempenho geral na qualidade do atendimento, com pontos fortes em algumas áreas. Com uma pontuação de ${pontuacaoTotal}/25 pontos, está ${comparacaoMercado}.`;
      recomendacoes = [
        "Fortalecer os aspectos positivos já identificados",
        "Desenvolver estratégias para melhorar os pontos mais fracos",
        "Estabelecer metas claras para os corretores em cada critério",
        "Implementar treinamentos focados nas áreas com menor pontuação"
      ];
    } else if (percentualPontuacao >= 50) {
      analiseDesempenho = `A ${imobiliariaData.nome} demonstrou desempenho moderado na qualidade do atendimento, com algumas áreas que precisam de atenção. Com pontuação de ${pontuacaoTotal}/25 pontos, está ${comparacaoMercado}.`;
      recomendacoes = [
        "Revisar os processos de atendimento ao cliente",
        "Implementar treinamento abrangente em qualificação de clientes",
        "Desenvolver scripts para padronizar explicações sobre imóveis",
        "Estabelecer métricas claras para avaliar o desempenho em cada critério"
      ];
    } else {
      analiseDesempenho = `A ${imobiliariaData.nome} apresentou desempenho abaixo do esperado na qualidade do atendimento, com várias áreas críticas que precisam de melhorias imediatas. Com pontuação de ${pontuacaoTotal}/25 pontos, está ${comparacaoMercado}.`;
      recomendacoes = [
        "Realizar uma revisão completa dos procedimentos de atendimento",
        "Implementar programa intensivo de treinamento para toda a equipe",
        "Desenvolver materiais padronizados para qualificação de clientes",
        "Estabelecer sistema de supervisão e feedback contínuo"
      ];
    }

    return { analiseDesempenho, recomendacoes };
  };

  // Gerar análise baseada nos dados reais
  const { analiseDesempenho, recomendacoes } = gerarAnaliseTextual();

  // Dados para o gráfico de radar
  const radarData = subcategoriasQualidadeSafe.map(item => {
    // Garantir que todas as porcentagens estejam limitadas a 100%
    const normalizeValue = (value, max) => Math.min(((value || 0) / (max || 1)) * 100, 100);
    
    return {
      subject: item.nome,
      A: normalizeValue(item.imobiliaria, item.maximo),
      B: normalizeValue(item.mercado, item.maximo),
      C: normalizeValue(item.top5, item.maximo),
      fullMark: 100
    };
  });

  return (
    <div className="px-1 py-3 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900 to-teal-900 rounded-xl p-6 shadow-lg relative overflow-hidden">
        {/* Removido logo da marca no canto, agora está apenas no cabeçalho principal */}
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-gradient-to-br from-green-600 to-teal-700 p-4 rounded-2xl shadow-xl mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div style={{ margin: 0, padding: 0 }}>
              <h1 className="text-2xl font-bold text-white m-0 p-0 text-left whitespace-pre">{`Qualidade do Atendimento`}</h1>
              <p className="text-green-200 mt-1 m-0 text-left whitespace-pre">{`Avalia o profissionalismo e personalização do atendimento`}</p>
            </div>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-green-400/20 text-left w-36">
            <p className="text-gray-300 text-sm mb-1">Pontuação</p>
            <div className="flex items-baseline">
              <span className={`text-4xl font-bold ${getScoreColor(imobiliariaData.qualidadeAtendimento || 0, maximo)}`}>
                {(imobiliariaData.qualidadeAtendimento || 0).toFixed(1)}
              </span>
              <span className="text-gray-400 ml-1">/ {maximo}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content: two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column: radar chart and subcategories */}
        <div className="space-y-6">
          {/* Radar Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-white text-left">
              Perfil de Atendimento
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#e0e0e0" />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]} 
                    tick={false}
                  />
                  <Radar
                    name={imobiliariaData.nome || 'Imobiliária'}
                    dataKey="A"
                    stroke={ENTITY_COLORS.imobiliaria}
                    fill={ENTITY_COLORS.imobiliaria}
                    fillOpacity={0.5}
                  />
                  <Radar
                    name="Média do Mercado"
                    dataKey="B"
                    stroke={ENTITY_COLORS.mercado}
                    fill={ENTITY_COLORS.mercado}
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Top 5 do Mercado"
                    dataKey="C"
                    stroke={ENTITY_COLORS.top5}
                    fill={ENTITY_COLORS.top5}
                    fillOpacity={0.3}
                  />
                  <Legend />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderColor: '#e2e8f0', color: '#1e293b' }}
                    formatter={() => ['']}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Scoring Criteria Cards */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-white text-left">
              Critérios de Pontuação
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scoringCriteria.map((criterion, index) => (
                <div key={index} className={`${criterion.bgColor} rounded-lg p-4 border ${criterion.borderColor}`}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className={`font-medium ${criterion.color} text-left`}>{criterion.name}</h3>
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-gray-800 border ${criterion.borderColor} ${criterion.color} font-bold`}>
                        {criterion.score}
                      </div>
                      <span className="text-gray-400 text-xs ml-1">/{criterion.maxScore}</span>
                    </div>
                  </div>
                  <ul className="space-y-1 pl-5 list-disc text-gray-600 dark:text-gray-300 text-sm text-left">
                    {criterion.criteria.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right column: comparison chart, strengths and weaknesses */}
        <div className="space-y-6">
          {/* Subcategory Progress Bars */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-white text-left">
              Subcategorias de Avaliação
            </h2>
            <div className="space-y-4">
              {subcategoryData.map((category, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-800 dark:text-white text-left">{category.name}</h3>
                    <div className="flex items-baseline">
                      <span className={`text-xl font-bold ${getScoreColor(category.value, category.maxValue)}`}>
                        {category.value}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">/{category.maxValue}</span>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="relative pt-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-teal-600 h-2.5 rounded-full" 
                        style={{ width: `${(category.value / category.maxValue) * 100}%` }}
                      ></div>
                      
                      {/* Reference lines */}
                      <div 
                        className="absolute top-4 h-2.5 border-r border-gray-400" 
                        style={{ left: `${(category.average / category.maxValue) * 100}%` }}
                      ></div>
                      <div 
                        className="absolute top-4 h-2.5 border-r border-green-400" 
                        style={{ left: `${(category.top5 / category.maxValue) * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1 text-left">
                      <span>Média: {category.average.toFixed(1)}</span>
                      <span className="text-green-500 dark:text-green-400">Top 5: {category.top5}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          
          {/* Strengths and Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border-t-4 border-green-500">
              <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-white flex items-center text-left">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                Pontos Fortes
              </h2>
              
              <div className="space-y-3">
                {strengths.map((strength, index) => (
                  <div key={index} className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3 border border-green-200 dark:border-green-800">
                    <p className="text-gray-700 dark:text-gray-200 text-left">{strength}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Weaknesses */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border-t-4 border-red-500">
              <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-white flex items-center text-left">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                Pontos a Melhorar
              </h2>
              
              <div className="space-y-3">
                {weaknesses.map((weakness, index) => (
                  <div key={index} className="bg-red-50 dark:bg-red-900/30 rounded-lg p-3 border border-red-200 dark:border-red-800">
                    <p className="text-gray-700 dark:text-gray-200 text-left">{weakness}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Analysis Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-white flex items-center text-left">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Análise Detalhada
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-left">
          A qualidade do atendimento avalia como o cliente é tratado pelos profissionais da imobiliária,
          incluindo personalização, profissionalismo, qualificação e explicações fornecidas. 
          Esta categoria representa 25% da pontuação total.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-3 text-left">Avaliação Geral</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4 text-left">
              {analiseDesempenho}
            </p>
            
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="text-md font-medium text-gray-800 dark:text-white mb-2 text-left">Principais Recomendações:</h4>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1 text-left">
                {recomendacoes.map((recomendacao, index) => (
                  <li key={index}>{recomendacao}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 text-left">Comparativo do Mercado</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-12 items-center gap-2">
                <span className="text-gray-700 dark:text-gray-300 text-left col-span-3">{imobiliariaData.nome}</span>
                <div className="col-span-7 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(imobiliariaData.qualidadeAtendimento / 25) * 100}%` }}></div>
                </div>
                <span className="text-green-500 font-medium text-right col-span-2">{imobiliariaData.qualidadeAtendimento}/25</span>
              </div>
              
              <div className="grid grid-cols-12 items-center gap-2">
                <span className="text-gray-700 dark:text-gray-300 text-left col-span-3">Média do Mercado</span>
                <div className="col-span-7 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${(mercadoData?.qualidadeAtendimento || 0) / 25 * 100}%` }}></div>
                </div>
                <span className="text-blue-500 font-medium text-right col-span-2">{formatarNumero(mercadoData?.qualidadeAtendimento || 0)}/25</span>
              </div>
              
              <div className="grid grid-cols-12 items-center gap-2">
                <span className="text-gray-700 dark:text-gray-300 text-left col-span-3">Top 5</span>
                <div className="col-span-7 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${(mercadoData?.top5?.qualidadeAtendimento || 0) / 25 * 100}%` }}></div>
                </div>
                <span className="text-purple-500 font-medium text-right col-span-2">{formatarNumero(mercadoData?.top5?.qualidadeAtendimento || 0)}/25</span>
              </div>
              
              <div className="grid grid-cols-12 items-center gap-2">
                <span className="text-gray-700 dark:text-gray-300 text-left col-span-3">Melhor Imobiliária</span>
                <div className="col-span-7 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${(mercadoData?.maxQualidadeAtendimento || 22) / 25 * 100}%` }}></div>
                </div>
                <span className="text-emerald-500 font-medium text-right col-span-2">{formatarNumero(mercadoData?.maxQualidadeAtendimento || 22)}/25</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabQualidadeAtendimento;