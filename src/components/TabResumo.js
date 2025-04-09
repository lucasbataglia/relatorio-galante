import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar
} from 'recharts';

const TabResumo = ({ imobiliariaData, mercadoData, todasImobiliarias }) => {
  // Verificar se os objetos principais existem para evitar erros
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

  // Garantir que mercadoData existe
  const mercadoDataSafe = mercadoData || { pontuacaoTotal: 0, top5: {} };

  // Função para determinar a cor baseada no desempenho
  const getScoreColor = (score, max) => {
    const percent = (score / max) * 100;
    if (percent >= 80) return "text-green-500";
    if (percent >= 60) return "text-blue-500";
    if (percent >= 40) return "text-yellow-500";
    return "text-red-500 bad-score";
  };

  // Cores para os gráficos
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
  
  // Cores específicas para entidades consistentes em todos os gráficos
  const ENTITY_COLORS = {
    imobiliaria: '#6366F1', // Cor principal para a imobiliária atual
    mercado: '#0EA5E9',     // Cor para a média do mercado
    top5: '#10B981'         // Cor para o Top 5
  };
  
  // Dados para os gráficos e análises
  const categoryData = !imobiliariaData ? [] : [
    { name: "Tempo de Resposta", value: imobiliariaData.tempoResposta || 0, maxValue: 25, avgValue: mercadoDataSafe?.tempoResposta || 0, top5Value: mercadoDataSafe?.top5?.tempoResposta || 0, color: COLORS[0] },
    { name: "Qualidade do Atendimento", value: imobiliariaData.qualidadeAtendimento || 0, maxValue: 25, avgValue: mercadoDataSafe?.qualidadeAtendimento || 0, top5Value: mercadoDataSafe?.top5?.qualidadeAtendimento || 0, color: COLORS[1] },
    { name: "Apresentação de Imóveis", value: imobiliariaData.apresentacaoImoveis || 0, maxValue: 20, avgValue: mercadoDataSafe?.apresentacaoImoveis || 0, top5Value: mercadoDataSafe?.top5?.apresentacaoImoveis || 0, color: COLORS[2] },
    { name: "Follow-up", value: imobiliariaData.followUp || 0, maxValue: 15, avgValue: mercadoDataSafe?.followUp || 0, top5Value: mercadoDataSafe?.top5?.followUp || 0, color: COLORS[3] },
    { name: "Experiência do Cliente", value: imobiliariaData.experienciaCliente || 0, maxValue: 15, avgValue: mercadoDataSafe?.experienciaCliente || 0, top5Value: mercadoDataSafe?.top5?.experienciaCliente || 0, color: COLORS[4] }
  ];
  
  // Dados para o gráfico de radar
  const radarData = !categoryData || categoryData.length === 0 ? [] : categoryData.map(category => ({
    subject: category.name.split(' ')[0],
    company: Math.round(((category.value || 0) / category.maxValue) * 100),
    average: Math.round(((category.avgValue || 0) / category.maxValue) * 100)
  }));
  
  // Função para calcular pontuação de primeira resposta
  const calcularPontuacaoPrimeiraResposta = (tempo) => {
    if (!tempo || tempo === 'N/A') return 0;
    
    try {
      // Converter tempo no formato "HH:MM:SS" para segundos
      const tempoParaSegundos = (tempo) => {
        if (typeof tempo === 'string' && tempo.includes(':')) {
          const [horas, minutos, segundos] = tempo.split(':').map(Number);
          return horas * 3600 + minutos * 60 + segundos;
        }
        return null;
      };
      
      const segundos = tempoParaSegundos(tempo);
      if (segundos === null) return 0;
      
      // Até 5 min (300s): 10 pontos
      if (segundos <= 300) return 10;
      // Até 10 min (600s): 8 pontos  
      if (segundos <= 600) return 8;
      // Até 15 min (900s): 6 pontos
      if (segundos <= 900) return 6;
      // Até 30 min (1800s): 4 pontos
      if (segundos <= 1800) return 4;
      // Até 1h (3600s): 2 pontos
      if (segundos <= 3600) return 2;
      // Mais de 1h: 0 pontos
      return 0;
    } catch (e) {
      console.error("Erro ao calcular pontuação de primeira resposta:", e);
      return 0;
    }
  };

  // Função para calcular pontuação de transferência ao corretor
  const calcularPontuacaoTransferenciaCorretor = (tempo) => {
    if (!tempo || tempo === 'N/A') return 0;
    
    try {
      // Converter tempo no formato "HH:MM:SS" para segundos
      const tempoParaSegundos = (tempo) => {
        if (typeof tempo === 'string' && tempo.includes(':')) {
          const [horas, minutos, segundos] = tempo.split(':').map(Number);
          return horas * 3600 + minutos * 60 + segundos;
        }
        return null;
      };
      
      const segundos = tempoParaSegundos(tempo);
      if (segundos === null) return 0;
      
      // Até 10 min: 8 pontos
      if (segundos <= 600) return 8;
      // Até 30 min: 6 pontos
      if (segundos <= 1800) return 6;
      // Até 1h: 4 pontos
      if (segundos <= 3600) return 4;
      // Até 2h: 2 pontos
      if (segundos <= 7200) return 2;
      // Mais de 2h: 0 pontos
      return 0;
    } catch (e) {
      console.error("Erro ao calcular pontuação de transferência ao corretor:", e);
      return 0;
    }
  };

  // Cálculo das pontuações
  const pontuacaoPrimeiraResposta = calcularPontuacaoPrimeiraResposta(imobiliariaData.tempoPrimeiraResposta);
  const pontuacaoTransferenciaCorretor = calcularPontuacaoTransferenciaCorretor(imobiliariaData.tempoContatoCorretor);

  // Array para armazenar pontos fortes
  const strengths = [];
  const weaknesses = [];

  // Verificar pontos fortes com base na pontuação calculada
  // Tempo de Resposta - Primeira Resposta
  if (imobiliariaData && pontuacaoPrimeiraResposta >= 8) {
    const adjetivo = pontuacaoPrimeiraResposta === 10 ? "extremamente" : "muito";
    strengths.push({
      category: "Tempo de Resposta",
      title: `Primeira resposta ${adjetivo} rápida`,
      details: `${imobiliariaData.tempoPrimeiraResposta} (pontuação: ${pontuacaoPrimeiraResposta}/10)`
    });
  }

  // Tempo de Resposta - Transferência para Corretor
  if (imobiliariaData && pontuacaoTransferenciaCorretor >= 6) {
    strengths.push({
      category: "Tempo de Resposta",
      title: "Transferência para corretor rápida",
      details: `${imobiliariaData.tempoContatoCorretor} (pontuação: ${pontuacaoTransferenciaCorretor}/8)`
    });
  }
  
  if (imobiliariaData && imobiliariaData.personalizacao >= 5) {
    strengths.push({
      category: "Qualidade do Atendimento",
      title: "Atendimento personalizado",
      details: `Pontuação: ${imobiliariaData.personalizacao}/7`
    });
  }
  
  if (imobiliariaData && imobiliariaData.apresentacaoImoveis >= 12) {
    strengths.push({
      category: "Apresentação de Imóveis",
      title: "Boa apresentação de imóveis",
      details: `Pontuação: ${imobiliariaData.apresentacaoImoveis}/20`
    });
  }
  
  if (imobiliariaData && imobiliariaData.followUp >= 12) {
    strengths.push({
      category: "Follow-up",
      title: "Excelente acompanhamento do cliente",
      details: `${imobiliariaData.followUp}/15 pontos`
    });
  }
  
  // Qualidade do Atendimento
  if (imobiliariaData && imobiliariaData.qualidadeAtendimento >= 20) {
    strengths.push({
      category: "Qualidade do Atendimento",
      title: "Excelente qualidade no atendimento",
      details: `${imobiliariaData.qualidadeAtendimento}/25 pontos`
    });
  }

  // Apresentação de Imóveis
  if (imobiliariaData && imobiliariaData.apresentacaoImoveis >= 20) {
    strengths.push({
      category: "Apresentação de Imóveis",
      title: "Excelente apresentação de imóveis",
      details: `${imobiliariaData.apresentacaoImoveis}/25 pontos`
    });
  }

  // Follow-up
  if (imobiliariaData && imobiliariaData.followUp >= 12) {
    strengths.push({
      category: "Follow-up",
      title: "Excelente acompanhamento do cliente",
      details: `${imobiliariaData.followUp}/15 pontos`
    });
  }
  
  // Experiência do Cliente
  if (imobiliariaData && imobiliariaData.experienciaCliente >= 12) {
    strengths.push({
      category: "Experiência do Cliente",
      title: "Excelente experiência do cliente",
      details: `${imobiliariaData.experienciaCliente}/15 pontos`
    });
  }
  
  // Pontos fracos identificados - gerados dinamicamente com base na pontuação e características específicas da imobiliária
  if (imobiliariaData && imobiliariaData.apresentacaoImoveis < 10) {
    const titulo = !imobiliariaData.quantasOpcoesEnviadas 
      ? "Nenhum imóvel enviado ao cliente" 
      : imobiliariaData.quantasOpcoesEnviadas === 1 
        ? "Apenas um imóvel apresentado ao cliente" 
        : `Apenas ${imobiliariaData.quantasOpcoesEnviadas} imóveis apresentados`;
    
    const diferenca = Math.round(((mercadoDataSafe && mercadoDataSafe.apresentacaoImoveis) || 0) - (imobiliariaData.apresentacaoImoveis || 0));
    const detalhes = diferenca > 0 
      ? `${imobiliariaData.apresentacaoImoveis}/20 pontos (${diferenca} pontos abaixo da média do mercado: ${(mercadoDataSafe && mercadoDataSafe.apresentacaoImoveis) || 0}/20)` 
      : `${imobiliariaData.apresentacaoImoveis}/20 pontos (média do mercado: ${(mercadoDataSafe && mercadoDataSafe.apresentacaoImoveis) || 0}/20)`;
    
    weaknesses.push({
      category: "Apresentação de Imóveis",
      title: titulo,
      details: detalhes
    });
  }
  
  // Tempo de Resposta - Transferência para Corretor
  if (imobiliariaData && pontuacaoTransferenciaCorretor < 4) {
    const tempoPartes = imobiliariaData.tempoContatoCorretor.split(':');
    let mensagem = "";
    
    if (tempoPartes.length === 3) {
      const horas = parseInt(tempoPartes[0]);
      const minutos = parseInt(tempoPartes[1]);
      
      if (horas > 0) {
        mensagem = `${horas}h${minutos}min de espera para transferência`;
      } else if (minutos > 30) {
        mensagem = `${minutos} minutos de espera para transferência`;
      } else {
        mensagem = "Tempo elevado para transferência ao corretor";
      }
    } else {
      mensagem = "Tempo elevado para transferência ao corretor";
    }
    
    weaknesses.push({
      category: "Tempo de Resposta",
      title: mensagem,
      details: `${imobiliariaData.tempoContatoCorretor} (pontuação: ${pontuacaoTransferenciaCorretor}/8)`
    });
  }
  
  // Primeira Resposta
  if (imobiliariaData && pontuacaoPrimeiraResposta < 6) {
    const tempoPartes = imobiliariaData.tempoPrimeiraResposta.split(':');
    let mensagem = "";
    
    if (tempoPartes.length === 3) {
      const horas = parseInt(tempoPartes[0]);
      const minutos = parseInt(tempoPartes[1]);
      
      if (horas > 0) {
        mensagem = `${horas}h${minutos}min para primeira resposta`;
      } else if (minutos > 10) {
        mensagem = `${minutos} minutos para primeira resposta`;
      } else {
        mensagem = "Tempo de primeira resposta acima do ideal";
      }
    } else {
      mensagem = "Tempo de primeira resposta acima do ideal";
    }
    
    weaknesses.push({
      category: "Tempo de Resposta",
      title: mensagem,
      details: `${imobiliariaData.tempoPrimeiraResposta} (pontuação: ${pontuacaoPrimeiraResposta}/10)`
    });
  }
  
  // Qualificação do Cliente
  if (imobiliariaData && imobiliariaData.qualificacaoCliente < 3) {
    const porcentagem = Math.round((imobiliariaData.qualificacaoCliente / 6) * 100);
    const mediaSetor = Math.round(((mercadoDataSafe && mercadoDataSafe.qualificacaoCliente) || 0) / 6 * 100);
    const titulo = imobiliariaData.qualificacaoCliente <= 1 
      ? "Ausência de qualquer qualificação das necessidades do cliente" 
      : "Qualificação insuficiente das necessidades do cliente";
    
    weaknesses.push({
      category: "Qualidade do Atendimento",
      title: titulo,
      details: `${imobiliariaData.qualificacaoCliente}/6 pontos (${porcentagem}% vs. média do mercado: ${mediaSetor}%)`
    });
  }
  
  // Explicações e Informações
  if (imobiliariaData && imobiliariaData.explicacoesInformacoes < 3) {
    weaknesses.push({
      category: "Qualidade do Atendimento",
      title: "Falta de detalhamento nas informações fornecidas",
      details: `${imobiliariaData.explicacoesInformacoes}/6 pontos na qualidade das explicações e informações`
    });
  }
  
  // Adaptabilidade e Resolução de Objeções
  if (imobiliariaData && (imobiliariaData.adaptabilidade < 2 || imobiliariaData.resolucaoObjecoes < 2)) {
    const adaptTotal = imobiliariaData.adaptabilidade + imobiliariaData.resolucaoObjecoes;
    const titulo = adaptTotal < 3 
      ? "Sérias deficiências na adaptabilidade e resolução de objeções" 
      : "Dificuldades em adaptar o atendimento e resolver objeções";
    
    weaknesses.push({
      category: "Experiência do Cliente",
      title: titulo,
      details: `Adaptabilidade: ${imobiliariaData.adaptabilidade}/5 + Resolução de objeções: ${imobiliariaData.resolucaoObjecoes}/5 pontos`
    });
  }
  
  // Follow-up
  if (imobiliariaData && (imobiliariaData.persistencia < 3 || imobiliariaData.numeroFollowUps < 1)) {
    let titulo = "";
    if (imobiliariaData.numeroFollowUps === 0) {
      titulo = "Nenhum follow-up realizado após o contato inicial";
    } else if (imobiliariaData.numeroFollowUps === 1) {
      titulo = "Apenas um follow-up realizado";
    } else {
      titulo = "Falta de persistência adequada no follow-up";
    }
    
    weaknesses.push({
      category: "Follow-up",
      title: titulo,
      details: `Persistência: ${imobiliariaData.persistencia}/7 pontos (${imobiliariaData.numeroFollowUps} follow-ups realizados)`
    });
  }
  
  // Qualidade do Follow-up
  if (imobiliariaData && imobiliariaData.qualidadeFollowUp < 4 && imobiliariaData.numeroFollowUps > 0) {
    weaknesses.push({
      category: "Follow-up",
      title: "Baixa qualidade nos follow-ups realizados",
      details: `${imobiliariaData.qualidadeFollowUp}/8 pontos na qualidade dos ${imobiliariaData.numeroFollowUps} follow-ups`
    });
  }
  
  // Eficiência Geral
  if (imobiliariaData && imobiliariaData.eficienciaGeral < 3) {
    weaknesses.push({
      category: "Experiência do Cliente",
      title: "Baixa eficiência geral no processo de atendimento",
      details: `${imobiliariaData.eficienciaGeral}/5 pontos na eficiência geral`
    });
  }
  
  // Se não houver pontos fracos identificados (caso improvável), adicione um genérico
  if (weaknesses.length === 0) {
    weaknesses.push({
      category: "Geral",
      title: "Oportunidades de melhoria em várias áreas",
      details: `Mesmo com boa pontuação (${imobiliariaData.pontuacaoTotal}/100), há espaço para aprimoramento`
    });
  }

  // Oportunidades de melhoria - geradas dinamicamente
  const opportunities = [];
  
  if (imobiliariaData && imobiliariaData.apresentacaoImoveis < 15) {
    opportunities.push({ 
      title: "Envio consistente de imóveis", 
      impact: (imobiliariaData.apresentacaoImoveis || 0) < 10 ? "Crítico" : "Alto",
      description: `Implementar processo de envio de pelo menos ${Math.min(5, (imobiliariaData.quantasOpcoesEnviadas || 0) + 3)}-${Math.min(8, (imobiliariaData.quantasOpcoesEnviadas || 0) + 5)} opções de imóveis por cliente`
    });
  }
  
  if (imobiliariaData && imobiliariaData.transferenciaCorretor < 6) {
    opportunities.push({ 
      title: "Transferência rápida para corretor", 
      impact: imobiliariaData.transferenciaCorretor < 3 ? "Alto" : "Médio",
      description: `Reduzir tempo de transferência para o corretor (atual: ${imobiliariaData.tempoContatoCorretor})`
    });
  }
  
  if (imobiliariaData && imobiliariaData.qualificacaoCliente < 4) {
    opportunities.push({ 
      title: "Qualificação do cliente", 
      impact: imobiliariaData.qualificacaoCliente < 2 ? "Alto" : "Médio",
      description: "Desenvolver questionário para entender as necessidades específicas do cliente"
    });
  }
  
  if (imobiliariaData && imobiliariaData.numeroFollowUps < 2) {
    opportunities.push({ 
      title: "Follow-up estruturado", 
      impact: imobiliariaData.numeroFollowUps < 1 ? "Alto" : "Médio",
      description: `Estabelecer protocolo de ${Math.min(3, imobiliariaData.numeroFollowUps + 2)}-${Math.min(4, imobiliariaData.numeroFollowUps + 3)} follow-ups para cada cliente (atual: ${imobiliariaData.numeroFollowUps})`
    });
  }
  
  // Se não tivermos pelo menos 3 oportunidades, adicione uma genérica
  if (opportunities.length < 3) {
    opportunities.push({ 
      title: "Melhoria na experiência do cliente", 
      impact: "Médio",
      description: "Implementar sistema de feedback após cada interação com o cliente"
    });
  }

  // Métricas-chave
  const keyMetrics = [
    {
      name: "Primeira Resposta",
      value: imobiliariaData.tempoPrimeiraResposta,
      score: calcularPontuacaoPrimeiraResposta(imobiliariaData.tempoPrimeiraResposta),
      maxScore: 10,
      color: "bg-blue-500",
      lightColor: "bg-blue-100",
      textColor: "text-blue-600"
    },
    {
      name: "Transferência Corretor",
      value: imobiliariaData.tempoContatoCorretor,
      score: calcularPontuacaoTransferenciaCorretor(imobiliariaData.tempoContatoCorretor),
      maxScore: 8,
      color: "bg-red-500",
      lightColor: "bg-red-100",
      textColor: "text-red-600"
    },
    {
      name: "Imóveis Enviados",
      value: imobiliariaData.quantasOpcoesEnviadas,
      score: imobiliariaData.quantidadeImoveis || (imobiliariaData.quantasOpcoesEnviadas ? Math.min(Math.ceil(imobiliariaData.quantasOpcoesEnviadas), 5) : 0),
      maxScore: 5,
      color: "bg-amber-500",
      lightColor: "bg-amber-100",
      textColor: "text-amber-600"
    },
    {
      name: "Follow-ups",
      value: imobiliariaData.numeroFollowUps,
      score: imobiliariaData.persistencia || (imobiliariaData.numeroFollowUps ? Math.min(imobiliariaData.numeroFollowUps * 2, 7) : 0),
      maxScore: 7,
      color: "bg-purple-500",
      lightColor: "bg-purple-100",
      textColor: "text-purple-600"
    }
  ];

  // Calcular a posição real no ranking baseada na classificação entre todas as imobiliárias
  let rankingPosition = 0;
  if (todasImobiliarias && todasImobiliarias.length > 0) {
    // Ordenar todas as imobiliárias por pontuação total em ordem decrescente
    const imobiliariasOrdenadas = [...todasImobiliarias].sort((a, b) => 
      b.pontuacaoTotal - a.pontuacaoTotal
    );
    
    // Encontrar a posição da imobiliária atual na lista ordenada
    rankingPosition = imobiliariasOrdenadas.findIndex(imob => 
      imob.id === imobiliariaData.id
    ) + 1; // +1 porque o índice começa em 0
  } else {
    // Fallback para o cálculo antigo se não tivermos os dados de todas as imobiliárias
    rankingPosition = Math.max(1, Math.min(
      72,
      Math.round((100 - imobiliariaData.pontuacaoTotal) / 1.5)
    ));
  }

  return (
    <div className="px-1 py-3 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-4 rounded-2xl shadow-xl mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div style={{ margin: 0, padding: 0 }}>
              <h1 className="text-2xl font-bold text-white m-0 p-0 text-left whitespace-pre">{`Relatório ${imobiliariaData.nome}`}</h1>
              <p className="text-blue-200 mt-1 m-0 text-left whitespace-pre">{`Avaliação de Desempenho em Atendimento Imobiliário`}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-blue-400/20 text-left w-36">
              <p className="text-gray-300 text-sm mb-1">Pontuação Total</p>
              <div className="flex items-baseline">
                <span className={`text-4xl font-bold ${getScoreColor(imobiliariaData.pontuacaoTotal, 100)}`}>
                  {imobiliariaData.pontuacaoTotal}
                </span>
                <span className="text-gray-400 ml-1">/100</span>
              </div>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-blue-400/20 text-left w-36">
              <p className="text-gray-300 text-sm mb-1">Média do Mercado</p>
              <div className="text-2xl font-bold text-blue-400 text-left">
                {(mercadoDataSafe?.pontuacaoTotal || 0).toFixed(1)}
              </div>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-blue-400/20 text-left w-36">
              <p className="text-gray-300 text-sm mb-1">Posição Ranking</p>
              <div className="text-2xl font-bold text-yellow-500 text-left">
                {rankingPosition}º <span className="text-xs text-gray-400">de 72</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content: two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column: radar chart and key metrics */}
        <div className="space-y-6">
          {/* Radar Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-white">
              Desempenho por Categoria
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {radarData && radarData.length > 0 ? (
                  <RadarChart outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#8884d8" strokeDasharray="3 3" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF' }} />
                    <Radar
                      name={imobiliariaData.nome}
                      dataKey="company"
                      stroke={ENTITY_COLORS.imobiliaria}
                      fill={ENTITY_COLORS.imobiliaria}
                      fillOpacity={0.5}
                    />
                    <Radar
                      name="Média do Mercado"
                      dataKey="average"
                      stroke={ENTITY_COLORS.mercado}
                      fill={ENTITY_COLORS.mercado}
                      fillOpacity={0.3}
                    />
                    <Legend />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, '']}
                      contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', borderColor: '#475569', color: '#e2e8f0' }}
                    />
                  </RadarChart>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-500">Dados insuficientes para o gráfico radar</p>
                  </div>
                )}
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Key Metrics */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-white">
              Métricas-Chave
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {keyMetrics && keyMetrics.length > 0 ? keyMetrics.map((metric, index) => (
                <div 
                  key={index} 
                  className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div className={`py-2 px-4 ${metric.lightColor} ${metric.textColor} font-medium`}>
                    {metric.name}
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-900">
                    <div className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                      {metric.value}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Pontuação
                      </div>
                      <div className="flex items-center">
                        <div 
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${metric.color} text-white font-bold`}
                        >
                          {metric.score}
                        </div>
                        <span className="text-gray-400 text-xs ml-1">/{metric.maxScore}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-2 bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400">Dados de métricas não disponíveis.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Strengths */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border-t-4 border-blue-500">
            <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              Pontos Fortes
            </h2>
            
            <div className="space-y-4">
              {strengths && strengths.length > 0 ? (
                strengths.map((strength, index) => (
                  <div key={index} className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <h3 className="font-semibold text-blue-700 dark:text-blue-300">{strength.title}</h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">{strength.details}</p>
                  </div>
                ))
              ) : (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400">Nenhum ponto forte significativo identificado.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Right column: weaknesses, bar chart and opportunities */}
        <div className="space-y-6">
          {/* Bar Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Comparativo com o Mercado
              </h2>
              <p className="text-blue-100 text-opacity-80 mt-1">Pontuação por categoria versus média do setor</p>
            </div>
            <div className="p-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {categoryData && categoryData.length > 0 ? (
                    <BarChart
                      data={categoryData}
                      margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                      layout="vertical"
                      barSize={20}
                      barGap={5}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={true} vertical={false} />
                      <XAxis 
                        type="number"
                        tick={{ fill: '#6b7280' }}
                        axisLine={{ stroke: '#d1d5db' }}
                        tickLine={{ stroke: '#d1d5db' }}
                      />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        tick={{ fill: '#4b5563', fontSize: 12 }}
                        width={150}
                        axisLine={{ stroke: '#d1d5db' }}
                        tickLine={{ stroke: '#d1d5db' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          borderRadius: '0.5rem',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                          border: '1px solid #e5e7eb' 
                        }}
                        formatter={(value, name, props) => [
                          `${value}/${props.payload.maxValue}`,
                          name === "value" ? imobiliariaData.nome : "Média do Mercado"
                        ]}
                        labelStyle={{ color: '#111827', fontWeight: 'bold' }}
                        itemStyle={{ color: '#374151' }}
                      />
                      <Legend 
                        wrapperStyle={{ paddingTop: '15px' }}
                        formatter={(value) => {
                          return <span style={{ 
                            color: value === "value" ? ENTITY_COLORS.imobiliaria : ENTITY_COLORS.mercado, 
                            fontSize: '13px',
                            fontWeight: '500'
                          }}>
                            {value === "value" ? imobiliariaData.nome : "Média do Mercado"}
                          </span>
                        }}
                      />
                      <Bar 
                        dataKey="value" 
                        name="value"
                        fill={ENTITY_COLORS.imobiliaria}
                        radius={[0, 4, 4, 0]} 
                        animationDuration={1500}
                      />
                      <Bar 
                        dataKey="avgValue" 
                        name="Média do Mercado" 
                        fill={ENTITY_COLORS.mercado}
                        radius={[0, 4, 4, 0]} 
                        animationDuration={1500}
                        animationDelay={300}
                      />
                    </BarChart>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-gray-500">Dados insuficientes para o gráfico de barras</p>
                    </div>
                  )}
                </ResponsiveContainer>
              </div>
              <div className="mt-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 border border-indigo-100 dark:border-indigo-800/30">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">As maiores diferenças</span> em relação ao mercado estão em 
                  "Apresentação de Imóveis" ({imobiliariaData.apresentacaoImoveis < (mercadoDataSafe?.apresentacaoImoveis || 0) ? "abaixo" : "acima"} da média) e 
                  "Tempo de Resposta" ({imobiliariaData.tempoResposta > (mercadoDataSafe?.tempoResposta || 0) ? "acima" : "abaixo"} da média).
                </p>
              </div>
            </div>
          </div>
          
          {/* Weaknesses */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border-t-4 border-red-500">
            <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              Pontos Críticos
            </h2>
            
            <div className="space-y-3">
              {weaknesses && weaknesses.length > 0 ? weaknesses.map((weakness, index) => (
                <div key={index} className="bg-red-50 dark:bg-red-900/30 rounded-lg p-4 border border-red-200 dark:border-red-800">
                  <h3 className="font-semibold text-red-700 dark:text-red-300">{weakness.title}</h3>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">{weakness.details}</p>
                </div>
              )) : (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400">Nenhum ponto crítico identificado.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Opportunities */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border-t-4 border-purple-500">
            <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Oportunidades de Melhoria
            </h2>
            
            <div className="space-y-3">
              {opportunities && opportunities.length > 0 ? opportunities.map((opportunity, index) => (
                <div key={index} className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-purple-700 dark:text-purple-300">{opportunity.title}</h3>
                    <div className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
                      opportunity.impact === 'Crítico' ? 'bg-red-500' : 
                      opportunity.impact === 'Alto' ? 'bg-orange-500' : 
                      'bg-blue-500'
                    }`}>
                      {opportunity.impact}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{opportunity.description}</p>
                </div>
              )) : (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400">Nenhuma oportunidade de melhoria específica identificada.</p>
                </div>
              )}
            </div>
            
            {/* Potential growth */}
            <div className="mt-5 p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <h3 className="font-semibold text-indigo-700 dark:text-indigo-300 flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Potencial de Crescimento
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Implementando as melhorias sugeridas, a {imobiliariaData.nome} pode aumentar sua pontuação em até <span className="text-indigo-600 dark:text-indigo-300 font-bold">
                {Math.round(Math.min(100 - imobiliariaData.pontuacaoTotal, 60))}-{Math.round(Math.min(100 - imobiliariaData.pontuacaoTotal, 60) * 1.2)}</span> pontos, 
                alcançando o top 25% do mercado. Principais oportunidades: apresentação de imóveis (+{20 - imobiliariaData.apresentacaoImoveis} pts) e 
                qualidade do atendimento (+{Math.min(25 - imobiliariaData.qualidadeAtendimento, 20)} pts).
              </p>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Consulte a aba <span className="text-purple-600 dark:text-purple-400 font-medium">Recomendações</span> para um plano detalhado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabResumo;