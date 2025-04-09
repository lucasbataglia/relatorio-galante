import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, ComposedChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell, Scatter, ScatterChart, ZAxis, Treemap, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, ReferenceLine } from 'recharts';
import { useImobiliarias } from '../context/ImobiliariasContext';

// Componentes importados do
import MetricaCard from './MetricaCard';
import TabNavigation from './TabNavigation';
import TabTempoResposta from './TabTempoResposta';
import TabQualidadeAtendimento from './TabQualidadeAtendimento';
import TabApresentacaoImoveis from './TabApresentacaoImoveis';
import TabFollowUp from './TabFollowUp';
import TabExperienciaCliente from './TabExperienciaCliente';
import TabRecomendacoes from './TabRecomendacoes';
import TabResumo from './TabResumo';
import TabMetodologia from './TabMetodologia';

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

// Calculando pontuação baseada no tempo
const calcularPontuacaoPrimeiraResposta = (tempo) => {
  if (!tempo || tempo === 'N/A') return 0;
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
};

const calcularPontuacaoTransferenciaCorretor = (tempo) => {
  if (!tempo || tempo === 'N/A') return 0;
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
};

// Dados da Imobiliária Central baseados nos dados reais
const imobiliariaDefault = {
  nome: "[Dados Padrão]",
  pontuacaoTotal: 0,
  tempoPrimeiraResposta: "N/A",
  tempoContatoCorretor: "N/A",
  opcoesImoveisEnviadas: "Não",
  quantasOpcoesEnviadas: 0,
  numeroFollowUps: 0,
  
  // Pontuações por categoria
  tempoResposta: 0,
  qualidadeAtendimento: 0,
  apresentacaoImoveis: 0,
  followUp: 0,
  experienciaCliente: 0,
  
  // Pontuações detalhadas
  primeiraResposta: 0,
  transferenciaCorretor: 0,
  velocidadeMedia: 0,
  personalizacao: 0,
  profissionalismo: 0,
  qualificacaoCliente: 0,
  explicacoesInformacoes: 0,
  quantidadeImoveis: 0,
  aderenciaCriterios: 0,
  qualidadeMaterial: 0,
  persistencia: 0,
  qualidadeFollowUp: 0,
  adaptabilidade: 0,
  resolucaoObjecoes: 0,
  eficienciaGeral: 0,
  
  // Histórico de 6 meses para análise de tendência
  historicoMensal: [],
  
  // Análise aprofundada do tempo de resposta
  analiseTempo: {
    primeirasRespostas: [
      { faixa: '0-5 min', quantidade: 16, percentual: 32 },
      { faixa: '5-15 min', quantidade: 24, percentual: 48 },
      { faixa: '15-30 min', quantidade: 7, percentual: 14 },
      { faixa: '30-60 min', quantidade: 2, percentual: 4 },
      { faixa: '> 60 min', quantidade: 1, percentual: 2 },
    ],
    tempoMedioRespostaPorHora: [
      { hora: '8h', tempo: 12.5 },
      { hora: '9h', tempo: 8.3 },
      { hora: '10h', tempo: 5.7 },
      { hora: '11h', tempo: 6.2 },
      { hora: '12h', tempo: 15.1 },
      { hora: '13h', tempo: 18.3 },
      { hora: '14h', tempo: 10.2 },
      { hora: '15h', tempo: 7.5 },
      { hora: '16h', tempo: 9.1 },
      { hora: '17h', tempo: 9.8 },
      { hora: '18h', tempo: 13.4 },
      { hora: '19h', tempo: 11.2 },
    ],
    tempoPorDiaSemana: [
      { dia: 'Seg', tempoMedio: 15.3, transferencia: 28.1 },
      { dia: 'Ter', tempoMedio: 10.7, transferencia: 24.8 },
      { dia: 'Qua', tempoMedio: 12.1, transferencia: 22.5 },
      { dia: 'Qui', tempoMedio: 11.8, transferencia: 27.2 },
      { dia: 'Sex', tempoMedio: 13.5, transferencia: 25.4 },
      { dia: 'Sáb', tempoMedio: 8.9, transferencia: 19.7 },
    ]
  },
  
  // Análise detalhada de qualidade do atendimento
  analiseQualidade: {
    usoNomeCliente: { 
      sempreUsou: 68, 
      usouAlgumasVezes: 24, 
      nuncaUsou: 8 
    },
    linguagemComercial: {
      excelente: 72,
      boa: 16,
      regular: 9,
      ruim: 3
    },
    qualificacaoDetalhada: [
      { tipo: 'Orçamento', perguntou: 92, percentual: 92 },
      { tipo: 'Prazo', perguntou: 84, percentual: 84 },
      { tipo: 'Localização', perguntou: 96, percentual: 96 },
      { tipo: 'Tamanho', perguntou: 89, percentual: 89 },
      { tipo: 'Financiamento', perguntou: 64, percentual: 64 },
      { tipo: 'Finalidade', perguntou: 76, percentual: 76 },
    ],
  },
  
  // Análise de imóveis apresentados
  analiseImoveis: {
    tipologiaEnviada: [
      { tipo: 'Apartamento', quantidade: 23, percentual: 58 },
      { tipo: 'Casa', quantidade: 12, percentual: 30 },
      { tipo: 'Cobertura', quantidade: 3, percentual: 7 },
      { tipo: 'Kitnet', quantidade: 2, percentual: 5 },
    ],
    aderenciaDetalhada: [
      { criterio: 'Localização', atendeu: 82, percentual: 82 },
      { criterio: 'Preço', atendeu: 74, percentual: 74 },
      { criterio: 'Tamanho', atendeu: 68, percentual: 68 },
      { criterio: 'Quartos', atendeu: 92, percentual: 92 },
      { criterio: 'Vagas', atendeu: 65, percentual: 65 },
    ],
    tempoPrimeiroImovel: "00:35:12",
    qualidadeMaterialDetalhada: {
      fotos: 7.8,
      descricao: 7.2,
      planta: 6.4,
      video: 5.1,
      tour360: 3.3,
    }
  },
  
  // Análise de follow-up
  analiseFollowUp: {
    tempoEntreContatos: [
      { intervalo: '1 dia', percentual: 42 },
      { intervalo: '2-3 dias', percentual: 35 },
      { intervalo: '4-7 dias', percentual: 15 },
      { intervalo: '> 7 dias', percentual: 8 },
    ],
    conteudoFollowUp: [
      { tipo: 'Novos imóveis', percentual: 65 },
      { tipo: 'Agendamento', percentual: 82 },
      { tipo: 'Feedback', percentual: 45 },
      { tipo: 'Promoção', percentual: 28 },
      { tipo: 'Redução preço', percentual: 12 },
    ],
    taxaConversao: {
      contatoVisita: 23,
      visitaPropostaCompra: 18,
      propostaFechamento: 35,
    }
  }
};

// Dados do mercado baseados em análise real
const mercadoDataDefault = {
  pontuacaoTotal: 39.6,
  tempoResposta: 13.0,
  qualidadeAtendimento: 10.1,
  apresentacaoImoveis: 7.1,
  followUp: 3.2,
  experienciaCliente: 6.2,
  
  // Médias de subcategorias
  primeiraResposta: 8.4,
  transferenciaCorretor: 2.3,
  velocidadeMedia: 2.3,
  personalizacao: 2.6,
  profissionalismo: 3.3,
  qualificacaoCliente: 1.7,
  explicacoesInformacoes: 2.5,
  quantidadeImoveis: 2.2,
  aderenciaCriterios: 3.1,
  qualidadeMaterial: 1.8,
  persistencia: 2.0,
  qualidadeFollowUp: 1.2,
  adaptabilidade: 2.5,
  resolucaoObjecoes: 1.5,
  eficienciaGeral: 2.2,
  
  // Máximos e mínimos
  maxPontuacaoTotal: 81,
  minPontuacaoTotal: 1,
  
  // Dados estatísticos
  tempoPrimeiraRespostaMedia: "00:25:15",
  mediaOpcoesEnviadas: 2.4,
  mediaFollowUps: 1.3,
  
  // Distribuição de pontuação no mercado por quartil
  quartis: {
    q1: 25,
    q2: 40,
    q3: 58,
    outliers: [1, 5, 79, 81],
  },
  
  // Médias do top 5 por categoria
  top5: {
    pontuacaoTotal: 76.8,
    tempoResposta: 21.6,
    qualidadeAtendimento: 21,
    apresentacaoImoveis: 16.8,
    followUp: 10.6,
    experienciaCliente: 13,
    
    // Máximos por categoria (mantendo anônimo)
    maxPontuacaoTotal: 81,
    maxTempoResposta: 22,
    maxQualidadeAtendimento: 22,
    maxApresentacaoImoveis: 18,
    maxFollowUp: 13,
    maxExperienciaCliente: 13
  },
  
  // Melhores práticas do mercado (top 5 imobiliárias)
  melhoresPraticas: {
    tempoPrimeiraResposta: "00:01:30",
    tempoContatoCorretor: "00:05:00",
    quantasOpcoesEnviadas: 4.5,
    numeroFollowUps: 2.5,
    taxaConversaoVisita: 32,
    aderenciaCriterios: 94,
  },
  
  // Benchmark por tamanho de imobiliária
  benchmarkPorTamanho: [
    { tamanho: 'Pequena (1-5 corretores)', pontuacao: 58, resposta: 15, qualidade: 16, apresentacao: 11, followUp: 8, experiencia: 8 },
    { tamanho: 'Média (6-20 corretores)', pontuacao: 62, resposta: 16, qualidade: 17, apresentacao: 12, followUp: 9, experiencia: 8 },
    { tamanho: 'Grande (21+ corretores)', pontuacao: 66, resposta: 18, qualidade: 18, apresentacao: 13, followUp: 9, experiencia: 8 },
  ],
  
  // Correlações entre métricas (valor de -1 a 1, onde 1 é forte correlação positiva)
  correlacoes: [
    { metricas: 'Tempo resposta vs Conversão', valor: -0.72 },
    { metricas: 'Qualidade atendimento vs Fidelização', valor: 0.83 },
    { metricas: 'Follow-up vs Fechamento negócio', valor: 0.68 },
    { metricas: 'Personalização vs Experiência', valor: 0.76 },
    { metricas: 'Quantidade imóveis vs Aderência', valor: -0.42 },
  ]
};

// Dados para gráficos
const categoriasRadarData = [
  { categoria: 'Tempo de Resposta', imobiliaria: imobiliariaDefault.tempoResposta, mercado: mercadoDataDefault.tempoResposta, maximo: 25 },
  { categoria: 'Qualidade do Atendimento', imobiliaria: imobiliariaDefault.qualidadeAtendimento, mercado: mercadoDataDefault.qualidadeAtendimento, maximo: 25 },
  { categoria: 'Apresentação de Imóveis', imobiliaria: imobiliariaDefault.apresentacaoImoveis, mercado: mercadoDataDefault.apresentacaoImoveis, maximo: 20 },
  { categoria: 'Follow-up', imobiliaria: imobiliariaDefault.followUp, mercado: mercadoDataDefault.followUp, maximo: 15 },
  { categoria: 'Experiência do Cliente', imobiliaria: imobiliariaDefault.experienciaCliente, mercado: mercadoDataDefault.experienciaCliente, maximo: 15 }
];

const distribuicaoPontuacaoData = [
  { faixa: '0-10', quantidade: 5 },
  { faixa: '11-20', quantidade: 10 },
  { faixa: '21-30', quantidade: 15 },
  { faixa: '31-40', quantidade: 18 },
  { faixa: '41-50', quantidade: 12 },
  { faixa: '51-60', quantidade: 7 },
  { faixa: '61-70', quantidade: 3 },
  { faixa: '71-80', quantidade: 1 },
  { faixa: '81-90', quantidade: 1 }
];

const subcategoriasTempoResposta = [
  { 
    nome: 'Primeira resposta', 
    imobiliaria: imobiliariaDefault.primeiraResposta, 
    mercado: mercadoDataDefault.primeiraResposta,
    maximo: 10
  },
  { 
    nome: 'Transferência para corretor', 
    imobiliaria: imobiliariaDefault.transferenciaCorretor, 
    mercado: mercadoDataDefault.transferenciaCorretor,
    maximo: 8
  },
  { 
    nome: 'Velocidade média', 
    imobiliaria: imobiliariaDefault.velocidadeMedia, 
    mercado: mercadoDataDefault.velocidadeMedia,
    maximo: 7
  }
];

const subcategoriasQualidade = [
  { 
    nome: 'Personalização', 
    imobiliaria: imobiliariaDefault.personalizacao, 
    mercado: mercadoDataDefault.personalizacao,
    maximo: 7
  },
  { 
    nome: 'Profissionalismo', 
    imobiliaria: imobiliariaDefault.profissionalismo, 
    mercado: mercadoDataDefault.profissionalismo,
    maximo: 6
  },
  { 
    nome: 'Qualificação do cliente', 
    imobiliaria: imobiliariaDefault.qualificacaoCliente, 
    mercado: mercadoDataDefault.qualificacaoCliente,
    maximo: 6
  },
  { 
    nome: 'Explicações', 
    imobiliaria: imobiliariaDefault.explicacoesInformacoes, 
    mercado: mercadoDataDefault.explicacoesInformacoes,
    maximo: 6
  }
];

const subcategoriasApresentacao = [
  { 
    nome: 'Quantidade de imóveis', 
    imobiliaria: imobiliariaDefault.quantidadeImoveis, 
    mercado: mercadoDataDefault.quantidadeImoveis,
    maximo: 5
  },
  { 
    nome: 'Aderência aos critérios', 
    imobiliaria: imobiliariaDefault.aderenciaCriterios, 
    mercado: mercadoDataDefault.aderenciaCriterios,
    maximo: 10
  },
  { 
    nome: 'Qualidade do material', 
    imobiliaria: imobiliariaDefault.qualidadeMaterial, 
    mercado: mercadoDataDefault.qualidadeMaterial,
    maximo: 5
  }
];

// Recomendações baseadas em pontuações mais baixas
const recomendacoes = [
  {
    categoria: "Resolução de Objeções",
    descricao: "Implementar treinamento de objeções comuns e técnicas de resposta para equipe comercial",
    impacto: "Alto",
    dificuldade: "Média"
  },
  {
    categoria: "Aderência aos Critérios",
    descricao: "Criar checklist de validação de critérios do cliente antes do envio de opções de imóveis",
    impacto: "Alto",
    dificuldade: "Baixa"
  },
  {
    categoria: "Experiência do Cliente",
    descricao: "Implementar sistema de feedback após cada interação comercial",
    impacto: "Médio",
    dificuldade: "Média"
  }
];

// Componente principal do dashboard
const Dashboard = ({ imobiliariaId }) => {
  const { getImobiliariaById, mercadoData: contextMercadoData, imobiliarias, loading, error } = useImobiliarias();
  const [imobiliariaData, setImobiliariaData] = useState(imobiliariaDefault);
  const [selectedTab, setSelectedTab] = useState("resumo");
  const [isDataValid, setIsDataValid] = useState(true);
  const [dataError, setDataError] = useState(null);
  const [usandoDadosPadrao, setUsandoDadosPadrao] = useState(false);
  
  // Adicionar logs para diagnóstico
  useEffect(() => {
    if (imobiliariaId) {
      console.log("Dashboard: imobiliariaId recebido =", imobiliariaId);
    }
    
    if (imobiliarias && imobiliarias.length > 0) {
      console.log(`Dashboard: ${imobiliarias.length} imobiliárias carregadas`);
      
      // Log da primeira imobiliária para verificar estrutura
      console.log("Primeira imobiliária:", imobiliarias[0]);
    } else {
      console.warn("Dashboard: Nenhuma imobiliária carregada do contexto");
    }
  }, [imobiliariaId, imobiliarias]);

  // Efeito para carregar os dados da imobiliária quando o ID mudar
  useEffect(() => {
    try {
      if (imobiliariaId) {
        // Busca a imobiliária pelo ID diretamente pelo contexto
        const foundImobiliaria = getImobiliariaById(imobiliariaId);
        if (foundImobiliaria) {
          setImobiliariaData(foundImobiliaria);
          setUsandoDadosPadrao(false);
          console.log("Imobiliária encontrada:", foundImobiliaria.nome, "ID:", foundImobiliaria.id);
        } else {
          console.warn(`Imobiliária com ID ${imobiliariaId} não encontrada.`);
          // Verificar se há imobiliárias disponíveis antes de usar dados padrão
          if (imobiliarias && imobiliarias.length > 0) {
            // Use a primeira imobiliária disponível como fallback
            setImobiliariaData(imobiliarias[0]);
            setUsandoDadosPadrao(true);
            console.log("Usando primeira imobiliária disponível como fallback:", imobiliarias[0].nome);
          } else {
            // Se não houver imobiliárias disponíveis, use os dados padrão
            setImobiliariaData(imobiliariaDefault);
            setUsandoDadosPadrao(true);
            console.warn("Usando dados padrão pois nenhuma imobiliária está disponível");
          }
        }
      } else {
        // Se não houver ID, use dados padrão
        setImobiliariaData(imobiliariaDefault);
        setUsandoDadosPadrao(true);
        console.log("Nenhum ID de imobiliária fornecido. Usando dados padrão.");
      }
    } catch (e) {
      console.error("Erro ao obter dados da imobiliária:", e);
      setDataError(`Erro ao carregar dados: ${e.message}`);
      setImobiliariaData(imobiliariaDefault);
      setUsandoDadosPadrao(true);
    }
  }, [imobiliariaId, imobiliarias, getImobiliariaById]);

  // Usar o mercadoData do contexto se disponível, caso contrário use o valor padrão
  const mercadoData = contextMercadoData && Object.keys(contextMercadoData).length > 0 
    ? contextMercadoData 
    : mercadoDataDefault;
  
  // Efeito para recalcular tempoResposta quando imobiliariaData mudar
  useEffect(() => {
    if (imobiliariaData && imobiliariaData !== imobiliariaDefault) {
      // Evita recalcular para os dados padrão
      const pontuacaoCalculada = calcularPontuacaoTempoResposta(imobiliariaData);
      
      // Se a pontuação calculada for diferente da atual, atualizar
      if (pontuacaoCalculada !== imobiliariaData.tempoResposta) {
        console.log(`Recalculando tempo de resposta para ${imobiliariaData.nome}: ${pontuacaoCalculada}`);
        
        // Atualizar os dados da imobiliária com tempoResposta recalculado
        setImobiliariaData(prevData => ({
          ...prevData,
          tempoResposta: pontuacaoCalculada
        }));
      }
      
      // Validar campos essenciais
      const camposEssenciais = ['pontuacaoTotal', 'tempoResposta', 'qualidadeAtendimento', 'apresentacaoImoveis', 'followUp'];
      const camposAusentes = camposEssenciais.filter(campo => 
        imobiliariaData[campo] === undefined || imobiliariaData[campo] === null
      );
      
      if (camposAusentes.length > 0) {
        console.warn(`Dashboard: Campos essenciais ausentes na imobiliária ${imobiliariaData.nome}:`, camposAusentes);
        
        if (camposAusentes.length > 2) {
          setDataError(`Dados incompletos: faltam ${camposAusentes.length} campos importantes`);
        }
      }
    }
  }, [imobiliariaData]);

  // Após obter os dados da imobiliária, calcular o tempo de resposta correto
  const calcularPontuacaoTempoResposta = (imobiliariaData) => {
    if (!imobiliariaData) return 0;
    
    // Calcular pontuações individuais
    const pontuacaoPrimeiraResposta = calcularPontuacaoPrimeiraResposta(imobiliariaData.tempoPrimeiraResposta);
    const pontuacaoTransferenciaCorretor = calcularPontuacaoTransferenciaCorretor(imobiliariaData.tempoContatoCorretor);
    const pontuacaoVelocidadeMedia = imobiliariaData.velocidadeMedia || 0;
    
    // Retornar a soma (máximo 25 pontos)
    return pontuacaoPrimeiraResposta + pontuacaoTransferenciaCorretor + pontuacaoVelocidadeMedia;
  };

  // Mostrar indicador de carregamento
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Carregando dados...</p>
        </div>
      </div>
    );
  }
  
  // Mostrar mensagem de erro
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center bg-gray-800 p-8 rounded-xl max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-4">Erro</h2>
          <p className="mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // Renderização do componente de alerta para dados inválidos/padrão
  const renderDataAlert = () => {
    if (dataError) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Erro: </strong>
          <span className="block sm:inline">{dataError}</span>
        </div>
      );
    }
    
    if (usandoDadosPadrao) {
      return (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Aviso: </strong>
          <span className="block sm:inline">
            Exibindo dados {imobiliariaData.nome !== imobiliariaDefault.nome ? `da imobiliária ${imobiliariaData.nome}` : "padrão"} pois a imobiliária solicitada não foi encontrada.
          </span>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute w-full h-[300px] top-[500px] left-0 opacity-30 rounded-[50%] bg-blue-900 blur-[100px] -z-10"></div>
      <div className="absolute w-[70%] h-[400px] top-0 right-0 opacity-20 rounded-[50%] bg-blue-800 blur-[100px] -z-10"></div>
      
      {/* Pequenos pontos/estrelas no fundo */}
      <div className="stars absolute inset-0 -z-20">
        {[...Array(100)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 bg-blue-300 rounded-full opacity-30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${(Math.random() * 3) + 2}s`
            }}
          />
        ))}
      </div>
        
      {/* Seção principal */}
      <main className="container mx-auto px-4 py-8">
        {renderDataAlert()}
        
        {/* Cabeçalho do relatório com logo da imobiliária - versão aprimorada */}
        <div className="mb-14 relative">
          {/* Fundo com efeito de gradiente e blur */}
          <div className="absolute -inset-6 bg-gradient-to-r from-blue-600/20 via-indigo-500/10 to-blue-600/20 blur-xl opacity-50 rounded-full -z-10"></div>
          
          <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row items-start justify-between">
              {/* Lado esquerdo - Logo puro sem efeitos de fundo */}
              <div className="mb-6 md:mb-0">
                {/* Contêiner de tamanho fixo para os logos */}
                <div className="relative w-48 h-16 rounded-lg overflow-hidden logo-container flex items-center justify-center" id="header-logo-container">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-700/20 via-gray-200/30 to-gray-700/20 mix-blend-overlay"></div>
                  <img 
                    src={imobiliariaData.url_logo || "/files-real-state/logo/Logo-Horizontal-Negativo-768x184.png"} 
                    alt={`Logo ${imobiliariaData.nome}`}
                    style={{
                      maxWidth: '90%',
                      maxHeight: '90%',
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain',
                    }}
                    className="relative z-10 transition-transform hover:scale-105"
                    key={Date.now()} /* Forçando re-renderização */
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/files-real-state/logo/Logo-Horizontal-Negativo-768x184.png";
                    }}
                  />
                </div>
              </div>
              
              {/* Centro - Nome da imobiliária */}
              <div className="flex-1 flex flex-col items-center self-center mx-4">
                <h2 className="text-3xl font-bold text-white text-center mb-3">{imobiliariaData.nome}</h2>
                <div className="w-48 h-0.5 bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400"></div>
              </div>
              
              {/* Lado direito - Pontuação total */}
              <div className="bg-gray-900/70 border border-gray-800 rounded-xl py-3 px-6 backdrop-blur-md shadow-inner flex flex-col items-center self-start md:self-end">
                <p className="text-gray-400 text-sm font-medium mb-1">Pontuação Total</p>
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">{imobiliariaData.pontuacaoTotal}</span>
                  <span className="text-gray-400 ml-1 text-lg">/100</span>
                </div>
              </div>
            </div>
            
            {/* Descrição simples em linha */}
            <div className="mt-8 border-t border-gray-700/50 pt-6 flex justify-center">
              <p className="text-gray-300 truncate max-w-full px-4">
                Análise detalhada do atendimento imobiliário via cliente oculto, comparando com as médias do mercado e oferecendo insights para melhoria.
              </p>
            </div>
          </div>
        </div>
        
        {/* Navegação em abas */}
        <TabNavigation 
          selectedTab={selectedTab} 
          setSelectedTab={setSelectedTab}
          imobiliariaData={imobiliariaData}
        />
        
        {/* Conteúdo das abas */}
        {selectedTab === "tempoResposta" && (
          <TabTempoResposta 
            imobiliariaData={imobiliariaData} 
            mercadoData={mercadoData}
          />
        )}
        
        {selectedTab === "qualidadeAtendimento" && (
          <TabQualidadeAtendimento 
            imobiliariaData={imobiliariaData} 
            mercadoData={mercadoData}
          />
        )}
        
        {selectedTab === "apresentacaoImoveis" && (
          <TabApresentacaoImoveis 
            imobiliariaData={imobiliariaData} 
            mercadoData={mercadoData}
            subcategoriasApresentacao={[
              { 
                nome: 'Quantidade de imóveis', 
                imobiliaria: imobiliariaData.quantidadeImoveis, 
                mercado: mercadoData.quantidadeImoveis,
                maximo: 5
              },
              { 
                nome: 'Aderência aos critérios', 
                imobiliaria: imobiliariaData.aderenciaCriterios, 
                mercado: mercadoData.aderenciaCriterios,
                maximo: 10
              },
              { 
                nome: 'Qualidade do material', 
                imobiliaria: imobiliariaData.qualidadeMaterial, 
                mercado: mercadoData.qualidadeMaterial,
                maximo: 5
              }
            ]}
          />
        )}
        
        {selectedTab === "followUp" && (
          <TabFollowUp 
            imobiliariaData={imobiliariaData} 
            mercadoData={mercadoData}
          />
        )}
        
        {selectedTab === "experienciaCliente" && (
          <TabExperienciaCliente 
            imobiliariaData={imobiliariaData} 
            mercadoData={mercadoData}
          />
        )}
        
        {selectedTab === "recomendacoes" && (
          <TabRecomendacoes 
            imobiliariaData={imobiliariaData} 
            mercadoData={mercadoData}
          />
        )}
        
        {selectedTab === "resumo" && (
          <TabResumo 
            imobiliariaData={imobiliariaData} 
            mercadoData={mercadoData}
            todasImobiliarias={imobiliarias}
          />
        )}
        
        {selectedTab === "metodologia" && (
          <TabMetodologia />
        )}
      </main>
      
      <footer className="bg-gray-900 bg-opacity-80 backdrop-blur-md text-white py-6 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              {/* Contêiner de tamanho fixo para o logo do rodapé */}
              <div className="relative w-32 h-8 rounded-lg overflow-hidden mr-3 flex items-center justify-center" id="footer-logo-container">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700/20 via-gray-200/30 to-gray-700/20 mix-blend-overlay"></div>
                <img 
                  src={imobiliariaData.url_logo || "/files-real-state/logo/Logo-Horizontal-Negativo-768x184.png"} 
                  alt={`Logo ${imobiliariaData.nome}`}
                  style={{
                    maxWidth: '90%',
                    maxHeight: '90%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    opacity: 0.85
                  }}
                  className="relative z-10"
                  key={Date.now()+1} /* Forçando re-renderização */
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/files-real-state/logo/Logo-Horizontal-Negativo-768x184.png";
                  }}
                />
              </div>
              <div>
                <span className="font-semibold">Relatório de Atendimento Imobiliário</span>
                <span className="text-sm text-gray-400 block md:inline md:ml-2">© 2025 Multimachine Analytics</span>
              </div>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">Suporte</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Documentação</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Política de Privacidade</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;