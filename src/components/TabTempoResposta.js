import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, LabelList,
  RadialBarChart, RadialBar, PolarAngleAxis, PolarGrid, PolarRadiusAxis
} from 'recharts';

// Função para formatar tempos em formato legível
const formatarTempo = (tempo) => {
  if (!tempo || tempo === "N/A") return "N/A";
  
  // Se já estiver no formato "00:00:00", apenas retorna
  if (typeof tempo === 'string' && tempo.includes(':')) {
    return tempo;
  }
  
  // Se for um número (em segundos), converte para formato de tempo
  if (typeof tempo === 'number') {
    const horas = Math.floor(tempo / 3600);
    const minutos = Math.floor((tempo % 3600) / 60);
    const segundos = Math.floor(tempo % 60);
    
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  }
  
  return "N/A";
};

// Função para converter tempo no formato "HH:MM:SS" para segundos
const tempoParaSegundos = (tempo) => {
  if (!tempo || tempo === "N/A") return null;
  
  try {
    if (typeof tempo === 'string' && tempo.includes(':')) {
      const [horas, minutos, segundos] = tempo.split(':').map(Number);
      return horas * 3600 + minutos * 60 + segundos;
    }
    
    if (typeof tempo === 'number') {
      return tempo;
    }
  } catch (e) {
    console.warn(`Erro ao converter tempo para segundos: ${tempo}`, e);
  }
  
  return null;
};

// Função para avaliar a qualidade do tempo de resposta
const avaliarTempo = (tempo, tipo) => {
  if (!tempo || tempo === "N/A") return { cor: "#888", mensagem: "Não disponível" };
  
  const segundos = tempoParaSegundos(tempo);
  if (segundos === null) return { cor: "#888", mensagem: "Formato inválido" };
  
  // Definição dos limiares para os diferentes tipos de tempo
  const limiares = {
    "primeiraResposta": {
      excelente: 300, // 5 minutos
      bom: 900,       // 15 minutos
      regular: 1800,  // 30 minutos
      ruim: 3600      // 1 hora
    },
    "contatoCorretor": {
      excelente: 900,  // 15 minutos
      bom: 1800,       // 30 minutos
      regular: 3600,   // 1 hora
      ruim: 7200       // 2 horas
    },
    "default": {
      excelente: 600,  // 10 minutos
      bom: 1200,       // 20 minutos
      regular: 2400,   // 40 minutos
      ruim: 4800       // 80 minutos
    }
  };
  
  const limiar = limiares[tipo] || limiares.default;
  
  if (segundos <= limiar.excelente) {
    return { cor: "#10B981", mensagem: "Excelente" };
  } else if (segundos <= limiar.bom) {
    return { cor: "#3B82F6", mensagem: "Bom" };
  } else if (segundos <= limiar.regular) {
    return { cor: "#F59E0B", mensagem: "Regular" };
  } else if (segundos <= limiar.ruim) {
    return { cor: "#EF4444", mensagem: "Ruim" };
  } else {
    return { cor: "#7F1D1D", mensagem: "Crítico" };
  }
};

// Cores consistentes para entidades
const ENTITY_COLORS = {
  imobiliaria: '#3B82F6', // Azul para a imobiliária atual
  mercado: '#FBBF24',     // Amarelo para média do mercado
  top5: '#10B981'         // Verde para o Top 5
};

const TabTempoResposta = ({ imobiliariaData, mercadoData, subcategoriasTempoResposta }) => {
  // Função para formatar número com toFixed de forma segura
  const formatarNumero = (valor, casasDecimais = 1) => {
    if (valor === undefined || valor === null) return '0.0';
    const num = parseFloat(valor);
    return isNaN(num) ? '0.0' : num.toFixed(casasDecimais);
  };
  
  // Verificação de segurança para subcategoriasTempoResposta
  const subcategoriasSeguras = Array.isArray(subcategoriasTempoResposta) 
    ? subcategoriasTempoResposta.map(item => ({
        ...item,
        imobiliaria: item.imobiliaria || 0,
        mercado: item.mercado || 0,
        maximo: item.maximo || 1
      }))
    : [];
  
  // Garantir que temos valores seguros para os dados do tempo de resposta
  const tempoRespostaSafe = {
    pontuacao: imobiliariaData?.tempoResposta || 0,
    tempoPrimeiraResposta: imobiliariaData?.tempoPrimeiraResposta || 'N/A',
    tempoContatoCorretor: imobiliariaData?.tempoContatoCorretor || 'N/A'
  };
  
  // Garantir que temos valores seguros para os dados de mercado
  const mercadoDataSafe = {
    tempoResposta: mercadoData?.tempoResposta || 0,
    top5: {
      tempoResposta: mercadoData?.top5?.tempoResposta || 0
    },
    tempoPrimeiraRespostaMedia: mercadoData?.tempoPrimeiraRespostaMedia || 'N/A'
  };
  
  // Verificar se temos dados válidos
  if (!imobiliariaData) {
    return (
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Erro: Dados não disponíveis</h2>
        <p className="text-white">Não foi possível carregar os dados da imobiliária.</p>
      </div>
    );
  }

  // Formatar os tempos para exibição
  const tempoPrimeiraRespostaFormatado = formatarTempo(imobiliariaData.tempoPrimeiraResposta);
  const tempoContatoCorretorFormatado = formatarTempo(imobiliariaData.tempoContatoCorretor);
  
  // Avaliar os tempos
  const avaliacaoPrimeiraResposta = avaliarTempo(imobiliariaData.tempoPrimeiraResposta, "primeiraResposta");
  const avaliacaoContatoCorretor = avaliarTempo(imobiliariaData.tempoContatoCorretor, "contatoCorretor");
  
  // Dados para o gráfico de barras de pontuações detalhadas
  const subcategoriasData = subcategoriasTempoResposta || [
    { 
      nome: 'Primeira resposta', 
      imobiliaria: imobiliariaData?.primeiraResposta || 0, 
      mercado: mercadoData?.primeiraResposta || 0,
      top5: mercadoData?.top5?.primeiraResposta || 0,
      maximo: 10 // Máximo para primeira resposta conforme prompt.txt
    },
    { 
      nome: 'Transferência para corretor', 
      imobiliaria: imobiliariaData?.transferenciaCorretor || 0, 
      mercado: mercadoData?.transferenciaCorretor || 0,
      top5: mercadoData?.top5?.transferenciaCorretor || 0,
      maximo: 8 // Máximo para transferência conforme prompt.txt
    },
    { 
      nome: 'Velocidade média', 
      imobiliaria: imobiliariaData?.velocidadeMedia || 0, 
      mercado: mercadoData?.velocidadeMedia || 0,
      top5: mercadoData?.top5?.velocidadeMedia || 0,
      maximo: 7 // Máximo para velocidade média conforme prompt.txt
    }
  ];
  
  // Calculando pontuação baseada no tempo, conforme o sistema do prompt.txt
  const calcularPontuacaoPrimeiraResposta = (tempo) => {
    if (!tempo || tempo === 'N/A') return 0;
    const segundos = tempoParaSegundos(tempo);
    if (segundos === null) return 0;
    
    // Até 5 min (300s): 10 pontos
    if (segundos <= 300) return 10;
    // 5 min - 30 min (300s - 1800s): 8 pontos
    if (segundos <= 1800) return 8;
    // 1h - 2h (3600s - 7200s): 6 pontos
    if (segundos <= 7200) return 6;
    // 2h - 12h (7200s - 43200s): 3 pontos
    if (segundos <= 43200) return 3;
    // Mais de 12h: 1 ponto
    return 1;
  };

  const calcularPontuacaoTransferenciaCorretor = (tempo) => {
    if (!tempo || tempo === 'N/A') return 0;
    const segundos = tempoParaSegundos(tempo);
    if (segundos === null) return 0;
    
    // Até 10 min após primeiro contato: 8 pontos
    if (segundos <= 600) return 8;
    // 10 min - 30 min: 6 pontos
    if (segundos <= 1800) return 6;
    // 30 min - 1h: 5 pontos
    if (segundos <= 3600) return 5;
    // 1h - 3h: 3 pontos
    if (segundos <= 10800) return 3;
    // 3h - 12h: 2 pontos
    if (segundos <= 43200) return 2;
    // mais de 12h: 1 ponto
    return 1;
  };
  
  // Velocidade média (assumindo 7 pontos máximos)
  const calcularPontuacaoVelocidadeMedia = () => {
    // Se não temos os dados necessários, retorna zero
    if (!imobiliariaData?.velocidadeMedia && !imobiliariaData?.tempoResposta) {
      return 0;
    }
    
    // Se temos a pontuação direta da velocidade média, usamos ela
    if (imobiliariaData?.velocidadeMedia) {
      return imobiliariaData.velocidadeMedia;
    }
    
    // Caso contrário, atribuímos um valor padrão baseado na experiência geral
    // Este é um fallback e deve ser ajustado conforme necessário
    return 5; // Valor padrão moderado (em uma escala de 0-7)
  };
  
  const pontuacaoVelocidadeMedia = calcularPontuacaoVelocidadeMedia();
  
  // Calculando a pontuação total do tempo de resposta (máximo: 25 pontos)
  const pontuacaoTotalTempoResposta = calcularPontuacaoPrimeiraResposta(imobiliariaData?.tempoPrimeiraResposta) + calcularPontuacaoTransferenciaCorretor(imobiliariaData?.tempoContatoCorretor) + pontuacaoVelocidadeMedia;

  // Garantir que usamos o valor calculado para o gráfico, não o valor bruto
  imobiliariaData.tempoResposta = pontuacaoTotalTempoResposta;

  // Atualizar os dados de subcategoria com as pontuações calculadas
  subcategoriasData[0].imobiliaria = calcularPontuacaoPrimeiraResposta(imobiliariaData?.tempoPrimeiraResposta);
  subcategoriasData[1].imobiliaria = calcularPontuacaoTransferenciaCorretor(imobiliariaData?.tempoContatoCorretor);
  subcategoriasData[2].imobiliaria = pontuacaoVelocidadeMedia;
  
  // Função para determinar cor do score
  const getScoreColor = (score, max) => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return "#10B981"; // Verde
    if (percentage >= 60) return "#3B82F6"; // Azul
    if (percentage >= 40) return "#F59E0B"; // Amarelo
    if (percentage >= 20) return "#EF4444"; // Vermelho
    return "#7F1D1D"; // Vermelho escuro
  };

  return (
    <div className="text-gray-700 dark:text-gray-300 space-y-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Análise do Tempo de Resposta
      </h2>
      
      {/* Novo componente destacando a importância dos 5 minutos */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-xl overflow-hidden shadow-lg mb-6">
        <div className="px-6 py-8 md:flex items-center justify-between">
          <div className="md:w-3/5 mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              A Regra dos 5 Minutos
            </h3>
            <p className="text-blue-100 mb-3">
              Segundo o estudo <span className="font-bold italic">Lead Response Management 2021</span>, a taxa de conversão é <span className="font-bold text-yellow-300">8 vezes maior</span> quando o contato com leads ocorre em até 5 minutos.
            </p>
            <p className="text-blue-200 text-sm">
              Pesquisa baseada em 5,7 milhões de leads e 55 milhões de atividades de vendas, analisados ao longo de 3 anos em mais de 400 empresas.
            </p>
          </div>
          <div className="md:w-2/5 flex justify-center">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-5 border border-blue-400/20 text-center">
              <div className="text-6xl font-bold text-white mb-2">8x</div>
              <div className="flex justify-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-2 h-8 bg-green-400 rounded-t-sm animate-pulse" style={{ animationDelay: `${i * 0.15}s` }}></div>
                ))}
                <div className="w-2 h-3 bg-red-400 rounded-t-sm"></div>
                <div className="w-2 h-2 bg-red-400 rounded-t-sm"></div>
                <div className="w-2 h-1 bg-red-400 rounded-t-sm"></div>
              </div>
              <div className="text-xs text-blue-100">
                <span className="inline-block px-2 py-1 rounded bg-green-500/20 text-green-100 mr-2">≤ 5 min</span>
                <span className="inline-block px-2 py-1 rounded bg-red-500/20 text-red-100">≥ 6 min</span>
              </div>
              <div className="mt-2 text-white text-xs">Taxa de conversão comparativa</div>
            </div>
          </div>
        </div>
        <div className="bg-blue-900/50 px-6 py-3 flex justify-between items-center">
          <p className="text-blue-100 text-sm">
            Pontuação atual: <span className={`font-bold ${imobiliariaData.tempoPrimeiraResposta && tempoParaSegundos(imobiliariaData.tempoPrimeiraResposta) <= 300 ? 'text-green-300' : 'text-yellow-300'}`}>
              {formatarTempo(imobiliariaData.tempoPrimeiraResposta)}
            </span>
          </p>
          <span className="bg-blue-700 text-xs text-white px-3 py-1 rounded-full">
            {imobiliariaData.tempoPrimeiraResposta && tempoParaSegundos(imobiliariaData.tempoPrimeiraResposta) <= 300 
              ? '✓ Dentro do tempo ideal' 
              : '! Acima do tempo ideal'}
          </span>
        </div>
      </div>
      
      <p className="text-lg my-4">
        A velocidade do primeiro contato é um dos fatores mais determinantes na conversão de leads em clientes.
        Abaixo, você confere a análise detalhada do tempo de resposta da {imobiliariaData.nome}.
      </p>
      
      {/* Cabeçalho da seção */}
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Tempo de Resposta</h2>
            <p className="text-gray-400">
              Pontuação: <span className="text-blue-400 font-semibold">{pontuacaoTotalTempoResposta}</span> de <span className="text-gray-300">25</span> pontos
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 px-4 py-2 bg-gray-700 rounded-lg">
                    <div className="flex items-center">
              <span className="text-gray-400 mr-2">Média mercado:</span>
              <span className="text-yellow-400 font-semibold">{mercadoData?.tempoResposta || 0}</span>
              <span className="mx-2 text-gray-500">|</span>
              <span className="text-gray-400 mr-2">Top 5:</span>
              <span className="text-green-400 font-semibold">{mercadoData?.top5?.tempoResposta || 0}</span>
                    </div>
                    </div>
                  </div>
                  
        <p className="text-gray-300 mb-8 text-justify">
          Esta métrica avalia a rapidez com que a imobiliária responde às solicitações iniciais dos clientes e o tempo 
          necessário para conectar o cliente a um corretor. Tempos de resposta rápidos são cruciais para não perder 
          potenciais clientes para a concorrência.
        </p>
        
        {/* Tempos de resposta */}
        <div className="bg-gray-700/60 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Tempos de Resposta</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-600">
                  <th className="text-left py-3 px-4">Métrica</th>
                  <th className="text-center py-3 px-4">{imobiliariaData.nome}</th>
                  <th className="text-center py-3 px-4">Média do Mercado</th>
                  <th className="text-center py-3 px-4">Top 5</th>
                  <th className="text-center py-3 px-4">Avaliação</th>
                  <th className="text-center py-3 px-4">Pontuação</th>
                </tr>
              </thead>
              <tbody>
                {/* Primeira Resposta */}
                <tr className="border-b border-gray-700/50">
                  <td className="py-3 px-4 text-gray-300">
                    <div className="font-medium">Primeira Resposta</div>
                    <div className="text-xs text-gray-500 mt-1">Tempo até o primeiro contato</div>
                  </td>
                  <td className="py-3 px-4 text-center font-semibold" style={{ color: avaliacaoPrimeiraResposta.cor }}>
                    {tempoPrimeiraRespostaFormatado}
                  </td>
                  <td className="py-3 px-4 text-center text-gray-400">
                    {formatarTempo(mercadoData?.tempoPrimeiraRespostaMedia)}
                  </td>
                  <td className="py-3 px-4 text-center text-green-400">
                    {formatarTempo(mercadoData?.top5?.tempoPrimeiraRespostaMedia)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${avaliacaoPrimeiraResposta.cor}25`, color: avaliacaoPrimeiraResposta.cor }}>
                      {avaliacaoPrimeiraResposta.mensagem}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-bold" style={{ color: getScoreColor(calcularPontuacaoPrimeiraResposta(imobiliariaData?.tempoPrimeiraResposta), 10) }}>
                    {calcularPontuacaoPrimeiraResposta(imobiliariaData?.tempoPrimeiraResposta)}/10
                  </td>
                </tr>
                
                {/* Contato Corretor */}
                <tr className="border-b border-gray-700/50">
                  <td className="py-3 px-4 text-gray-300">
                    <div className="font-medium">Contato Corretor</div>
                    <div className="text-xs text-gray-500 mt-1">Tempo até contato do corretor</div>
                  </td>
                  <td className="py-3 px-4 text-center font-semibold" style={{ color: avaliacaoContatoCorretor.cor }}>
                    {tempoContatoCorretorFormatado}
                  </td>
                  <td className="py-3 px-4 text-center text-gray-400">
                    {formatarTempo(mercadoData?.tempoContatoCorretorMedia)}
                  </td>
                  <td className="py-3 px-4 text-center text-green-400">
                    {formatarTempo(mercadoData?.top5?.tempoContatoCorretorMedia)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${avaliacaoContatoCorretor.cor}25`, color: avaliacaoContatoCorretor.cor }}>
                      {avaliacaoContatoCorretor.mensagem}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-bold" style={{ color: getScoreColor(calcularPontuacaoTransferenciaCorretor(imobiliariaData?.tempoContatoCorretor), 8) }}>
                    {calcularPontuacaoTransferenciaCorretor(imobiliariaData?.tempoContatoCorretor)}/8
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Gráfico pontuações por subcategoria */}
        <div className="bg-gray-700/50 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-6">Pontuações por Subcategoria</h3>
          
          <div className="mb-4">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                data={subcategoriasData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="nome" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                  <Tooltip 
                  contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '4px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value) => [`${value} pontos`, ``]}
                  />
                  <Legend />
                <Bar name={imobiliariaData.nome} dataKey="imobiliaria" fill={ENTITY_COLORS.imobiliaria} />
                <Bar name="Média Mercado" dataKey="mercado" fill={ENTITY_COLORS.mercado} />
                <Bar name="Top 5" dataKey="top5" fill={ENTITY_COLORS.top5} />
                </BarChart>
              </ResponsiveContainer>
          </div>
          
          {/* Tabela detalhada */}
          <div className="overflow-x-auto mt-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="text-left py-2 px-3">Subcategoria</th>
                  <th className="text-right py-2 px-3">Pontuação</th>
                  <th className="text-right py-2 px-3">Média</th>
                  <th className="text-right py-2 px-3">Máximo</th>
                  <th className="text-left py-2 px-3">Nível</th>
                </tr>
              </thead>
              <tbody>
                {subcategoriasData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-700/50">
                    <td className="py-3 px-3 text-gray-300">{item.nome}</td>
                    <td className="py-3 px-3 text-right font-medium" style={{ color: getScoreColor(item.imobiliaria || 0, item.maximo || 1) }}>
                      {formatarNumero(item.imobiliaria)}
                    </td>
                    <td className="py-3 px-3 text-right text-yellow-400">{formatarNumero(item.mercado)}</td>
                    <td className="py-3 px-3 text-right text-gray-400">{item.maximo}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center">
                        <div 
                          className="w-16 h-2 rounded-full bg-gray-700 overflow-hidden mr-2"
                        >
                          <div 
                            className="h-full rounded-full" 
                      style={{ 
                              width: `${(item.imobiliaria / item.maximo) * 100}%`,
                              backgroundColor: getScoreColor(item.imobiliaria || 0, item.maximo || 1)
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">
                          {Math.round((item.imobiliaria / item.maximo) * 100)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
                    </div>
                  </div>
                  
        {/* Recomendações */}
        <div className="bg-gray-700/50 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Recomendações para Melhoria</h3>
          
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-blue-400 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                      </div>
              <div className="ml-3">
                <p className="text-white font-medium">Implementar sistema de notificações instantâneas</p>
                <p className="text-gray-400 mt-1">
                  A {imobiliariaData.nome || 'imobiliária'} tem um tempo médio de primeira resposta de {imobiliariaData.tempoPrimeiraResposta || "N/A"}. 
                  Configure alertas para que os atendentes sejam notificados imediatamente quando um novo lead chegar, 
                  reduzindo o tempo de resposta atual, que está {
                    mercadoData && imobiliariaData.tempoPrimeiraResposta && mercadoData.tempoPrimeiraRespostaMedia ? 
                    (tempoParaSegundos(imobiliariaData.tempoPrimeiraResposta) > tempoParaSegundos(mercadoData.tempoPrimeiraRespostaMedia) ? 
                    "acima" : "abaixo") : ""
                  } da média do mercado ({mercadoData?.tempoPrimeiraRespostaMedia || "N/A"}).
                      </p>
                    </div>
            </li>
            
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-blue-400 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                      </div>
              <div className="ml-3">
                <p className="text-white font-medium">Estabelecer protocolo de transferência para corretores</p>
                <p className="text-gray-400 mt-1">
                  O tempo atual de transferência para o corretor da {imobiliariaData.nome || 'imobiliária'} é de {imobiliariaData.tempoContatoCorretor || "N/A"}, 
                  {
                    mercadoData && imobiliariaData.tempoContatoCorretor && mercadoData.tempoContatoCorretorMedia ? 
                    (tempoParaSegundos(imobiliariaData.tempoContatoCorretor) > tempoParaSegundos(mercadoData.tempoContatoCorretorMedia) ? 
                    " acima" : " abaixo") : ""
                  } da média do mercado ({mercadoData?.tempoContatoCorretorMedia || "N/A"}). 
                  Defina um processo claro para transferência de leads para corretores disponíveis, incluindo um sistema de backup 
                  para quando o corretor principal não estiver disponível.
                      </p>
                    </div>
            </li>
            
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-blue-400 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                  </div>
              <div className="ml-3">
                <p className="text-white font-medium">Monitorar métricas de tempo em tempo real</p>
                <p className="text-gray-400 mt-1">
                  A pontuação atual de tempo de resposta da {imobiliariaData.nome || 'imobiliária'} é de {imobiliariaData.tempoResposta || "0"}/25 pontos, 
                  o que representa {
                    mercadoData && imobiliariaData.tempoResposta ? 
                    Math.round((imobiliariaData.tempoResposta / mercadoData.tempoResposta) * 100) : "0"
                  }% da média do mercado. Implemente um dashboard em tempo real para acompanhar os tempos de resposta da equipe, 
                  permitindo intervenções imediatas quando os tempos estiverem acima do ideal.
                </p>
              </div>
            </li>
          </ul>
        </div>
                    </div>
                    
      {/* Tabela de performance de tempo - Adicione aqui o conteúdo existente */}
      
      {/* Melhores Práticas com base na pesquisa - NOVA SEÇÃO */}
      <div className="mt-10 bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-blue-200 dark:border-blue-900 shadow-lg">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
            Melhores Práticas para Tempo de Resposta
          </h3>
          <p className="text-blue-100 text-opacity-90 mt-1">
            Recomendações baseadas em dados do estudo Lead Response Management 2021
          </p>
                    </div>
                    
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-5 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-800 rounded-full p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
              <h4 className="text-lg font-semibold text-blue-700 dark:text-blue-300">Resposta em 5 Minutos</h4>
                    </div>
            <p className="text-gray-600 dark:text-gray-300 ml-11">
              Configure um sistema de alertas para garantir que qualquer novo lead seja contatado em até 5 minutos.
              Isso aumenta as chances de conversão em <span className="font-semibold">8 vezes</span> comparado com respostas após 6 minutos.
            </p>
                  </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-5 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-800 rounded-full p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-purple-700 dark:text-purple-300">Escolha o Melhor Dia</h4>
            </div>
            <p className="text-gray-600 dark:text-gray-300 ml-11">
              Priorize o contato com leads nas terças-feiras, quando a taxa de conversão é <span className="font-semibold">19,7% maior</span> que a média semanal.
              Segundas e quintas-feiras também têm conversões 15% maiores.
            </p>
          </div>
          
          <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-5 border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-800 rounded-full p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">Persistência no Contato</h4>
            </div>
            <p className="text-gray-600 dark:text-gray-300 ml-11">
              Realize pelo menos 7 tentativas de contato, o que aumenta em <span className="font-semibold">15%</span> a probabilidade de conexão.
              Segundo a pesquisa, 81% dos vendedores desistem após apenas 5 tentativas.
            </p>
            </div>
            
          <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-5 border border-green-200 dark:border-green-800">
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0 bg-green-100 dark:bg-green-800 rounded-full p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-green-700 dark:text-green-300">Horário Ideal</h4>
            </div>
            <p className="text-gray-600 dark:text-gray-300 ml-11">
              Concentre-se nos contatos entre 9h e 10h da manhã, quando a taxa de contato é <span className="font-semibold">28,4% maior</span> 
              que a média do dia. A faixa de 6h às 11h apresenta resultados 27,2% melhores que o período da tarde.
            </p>
        </div>
      </div>
      
        <div className="bg-gray-50 dark:bg-gray-900/50 p-5 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>A implementação destas práticas pode aumentar a taxa de conversão de leads em até 391%, segundo o estudo.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabTempoResposta;