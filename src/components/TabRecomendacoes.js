import React, { useState } from 'react';

const TabRecomendacoes = ({ imobiliariaData, mercadoData }) => {
  // Estado para a fase ativa do plano
  const [faseAtiva, setFaseAtiva] = useState(0);
  
  // Estado para simular o progresso das tarefas (em ambiente real viria do backend)
  const [progressoTarefas] = useState({
    "automatizarResposta": 15,
    "processoEnvioImoveis": 0,
    "questionarioQualificacao": 5
  });
  
  // Função para processar as recomendações específicas da imobiliária
  const processarRecomendacoes = () => {
    if (!imobiliariaData?.recomendacoesGerais) return [];
    
    try {
      // Tenta dividir por pontos, linhas, etc.
      const itensTexto = imobiliariaData.recomendacoesGerais
        .split(/[.;\n]/) // Divide por ponto, ponto e vírgula ou nova linha
        .map(item => item.trim())
        .filter(item => item.length > 3); // Remove itens em branco ou muito curtos
        
      // Estrutura organizada de seções e itens
      const secoes = [];
      let secaoAtual = null;
      
      // Primeiro passo: identificar títulos e conteúdos
      itensTexto.forEach((texto, index) => {
        // Remover marcações do texto e hífens iniciais
        let textoLimpo = texto.replace(/^#+\s*/g, '').trim();
        textoLimpo = textoLimpo.replace(/^-\s*/, ''); // Remove hífen no início
        
        // Anonimizar qualquer nome de corretor
        textoLimpo = textoLimpo.replace(/corretor\s+\w+/gi, 'corretor');
        
        const lowerText = textoLimpo.toLowerCase();
        
        // Identificar títulos de seção
        const isTitulo = 
          textoLimpo.endsWith(':') || 
          lowerText.includes('resumo') ||
          lowerText.includes('principais') ||
          lowerText.includes('destaques') ||
          lowerText.includes('áreas') ||
          lowerText.includes('específicas') ||
          lowerText.includes('melhoria') ||
          lowerText.includes('recomendações');
        
        // Se for um título, criar nova seção
        if (isTitulo) {
          secaoAtual = {
            id: `secao-${index}`,
            titulo: textoLimpo,
            itens: []
          };
          secoes.push(secaoAtual);
        } 
        // Se não for título e tivermos uma seção atual, adicionar como item
        else if (secaoAtual) {
          // Determinar categoria e ícone com base no texto
          let categoria = "Geral";
          let icon = (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          );
          let impacto = "Médio";
          
          // Detecção de categoria baseada em palavras-chave
          if (lowerText.includes('tempo') || lowerText.includes('resposta') || lowerText.includes('rápid')) {
            categoria = "Tempo de Resposta";
            icon = (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            );
          } else if (lowerText.includes('atendimento') || lowerText.includes('qualidade') || lowerText.includes('cliente')) {
            categoria = "Qualidade do Atendimento";
            icon = (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            );
          } else if (lowerText.includes('imóve') || lowerText.includes('apresent') || lowerText.includes('foto') || lowerText.includes('opções')) {
            categoria = "Apresentação de Imóveis";
            icon = (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            );
          } else if (lowerText.includes('follow') || lowerText.includes('acompanhamento') || lowerText.includes('seguimento')) {
            categoria = "Follow-up";
            icon = (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            );
          } else if (lowerText.includes('experiência') || lowerText.includes('objetiv') || lowerText.includes('percepção')) {
            categoria = "Experiência do Cliente";
            icon = (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-500 dark:text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            );
          }

          // Detectar impacto com base em palavras-chave
          if (lowerText.includes('crucial') || lowerText.includes('essencial') || lowerText.includes('crítico') || lowerText.includes('urgente')) {
            impacto = "Crítico";
          } else if (lowerText.includes('important') || lowerText.includes('fundament') || lowerText.includes('principal')) {
            impacto = "Alto";
          } else if (lowerText.includes('secund') || lowerText.includes('adicional')) {
            impacto = "Baixo";
          }
          
          // Estimar prioridade e implementação
          let prioridade = impacto === "Crítico" ? "Urgente" : impacto === "Alto" ? "Alta" : "Média";
          let implementacao = lowerText.includes('simples') || lowerText.includes('rápid') ? "Fácil" : 
                            lowerText.includes('complex') || lowerText.includes('difícil') ? "Complexa" : "Média";
          
          secaoAtual.itens.push({
            id: `item-${index}`,
            texto: textoLimpo,
            categoria,
            icon,
            impacto,
            prioridade,
            implementacao
          });
        }
      });
      
      return secoes;
    } catch (error) {
      console.error("Erro ao processar recomendações:", error);
      return [];
    }
  };
  
  // Processa as recomendações
  const secoes = processarRecomendacoes();

  // Lista de recomendações consolidadas (mantemos a lista, mas não usaremos na renderização)
  // eslint-disable-next-line no-unused-vars
  const recomendacoes = [
    {
      categoria: "Tempo de Resposta",
      titulo: "Automatizar primeira resposta",
      descricao: "Implementar sistema de resposta automática instantânea para garantir o primeiro contato em menos de 1 minuto.",
      impacto: "Alto",
      prioridade: "Urgente",
      implementacao: "Fácil",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      categoria: "Tempo de Resposta",
      titulo: "Otimizar transferência para corretor",
      descricao: "Estabelecer protocolo claro para transferência rápida ao corretor especializado, com alertas após 5 minutos e escalação automática.",
      impacto: "Alto",
      prioridade: "Alta",
      implementacao: "Média",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      categoria: "Apresentação de Imóveis",
      titulo: "Criar processo estruturado de envio de imóveis",
      descricao: "Desenvolver processo padronizado para enviar no mínimo 3-5 opções de imóveis para cada cliente, com descrições detalhadas e fotos de qualidade.",
      impacto: "Crítico",
      prioridade: "Urgente",
      implementacao: "Média",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      categoria: "Qualidade do Atendimento",
      titulo: "Implementar roteiro de qualificação do cliente",
      descricao: "Desenvolver questionário estruturado para qualificar as necessidades específicas do cliente, incluindo perguntas sobre localização, preço, tamanho e outras preferências.",
      impacto: "Alto",
      prioridade: "Alta",
      implementacao: "Fácil",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      categoria: "Follow-up",
      titulo: "Estabelecer protocolo de follow-up",
      descricao: "Criar sistema automatizado de lembretes para realizar pelo menos 2 follow-ups com cada cliente (24h e 72h após o contato inicial), enviando novas opções de imóveis e tentando agendar visitas.",
      impacto: "Médio",
      prioridade: "Média",
      implementacao: "Média",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      categoria: "Experiência do Cliente",
      titulo: "Implementar treinamento em resolução de objeções",
      descricao: "Treinar os corretores em técnicas de identificação e resolução de objeções, com roteiros e alternativas para cada tipo comum de objeção apresentada pelos clientes.",
      impacto: "Médio",
      prioridade: "Média",
      implementacao: "Média",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-500 dark:text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      categoria: "Geral",
      titulo: "Implementar sistema de medição de KPIs",
      descricao: "Criar dashboard para monitoramento em tempo real dos indicadores-chave de desempenho, como tempo de resposta, taxa de envio de imóveis e frequência de follow-ups.",
      impacto: "Alto",
      prioridade: "Alta",
      implementacao: "Complexa",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ];

  // Mapeamento de cores para as categorias
  const categoriaColors = {
    "Tempo de Resposta": "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20",
    "Qualidade do Atendimento": "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20",
    "Apresentação de Imóveis": "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20",
    "Follow-up": "border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20",
    "Experiência do Cliente": "border-pink-200 dark:border-pink-800 bg-pink-50 dark:bg-pink-900/20",
    "Geral": "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30"
  };
  
  // Mapeamento de cores para o nível de impacto
  const impactoColors = {
    "Crítico": "bg-red-600 text-white dark:bg-red-700",
    "Alto": "bg-orange-500 text-white dark:bg-orange-700",
    "Médio": "bg-blue-500 text-white dark:bg-blue-700",
    "Baixo": "bg-gray-500 text-white dark:bg-gray-700"
  };
  
  // Mapeamento de cores para a prioridade
  const prioridadeColors = {
    "Urgente": "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300",
    "Alta": "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:border-orange-800 dark:text-orange-300",
    "Média": "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300",
    "Baixa": "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/30 dark:border-gray-700 dark:text-gray-300"
  };

  // Mapeamento de cores para a implementação
  const implementacaoColors = {
    "Fácil": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
    "Média": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
    "Complexa": "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
  };

  // Cores para os blocos de seção - mais variação
  const secaoColors = {
    "Resumo": "from-blue-600/80 to-blue-800/80 border-blue-500/50",
    "Principais Destaques": "from-emerald-600/80 to-emerald-800/80 border-emerald-500/50",
    "Áreas de Melhoria": "from-amber-600/80 to-amber-800/80 border-amber-500/50",
    "Recomendações": "from-rose-600/80 to-rose-800/80 border-rose-500/50",
    "Default": "from-indigo-600/80 to-indigo-800/80 border-indigo-500/50"
  };
  
  // Função para determinar a cor da seção com base no título
  const getSectionColor = (titulo) => {
    const tituloLower = titulo.toLowerCase();
    if (tituloLower.includes('resumo')) return secaoColors["Resumo"];
    if (tituloLower.includes('destaque') || tituloLower.includes('positivo')) return secaoColors["Principais Destaques"];
    if (tituloLower.includes('melhoria') || tituloLower.includes('áreas')) return secaoColors["Áreas de Melhoria"];
    if (tituloLower.includes('recomend')) return secaoColors["Recomendações"];
    return secaoColors["Default"];
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho com gradiente */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-600 rounded-xl shadow-xl overflow-hidden">
        <div className="relative p-6">
          {/* Overlay pattern */}
          <div className="absolute inset-0 opacity-10 mix-blend-overlay" 
               style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
          
          <div className="flex items-center relative mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg mr-5 backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white leading-tight">Recomendações para Melhoria</h2>
              <p className="text-indigo-100 text-opacity-90 mt-1">Estratégias para elevar a qualidade do atendimento imobiliário</p>
            </div>
          </div>
          
          <p className="text-white text-opacity-80 mb-6 relative text-left">
            Com base na análise detalhada do atendimento da {imobiliariaData.nome}, identificamos pontos críticos de atenção e oportunidades 
            de melhoria. As recomendações abaixo foram ordenadas por prioridade e estão concentradas nas áreas de maior impacto potencial.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 relative">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-3 border border-white border-opacity-20 text-left">
              <div className="text-xs text-indigo-100 mb-1 font-medium text-left">Pontuação Atual</div>
              <div className="text-right">
                <span className="text-2xl font-bold text-white">
                  {imobiliariaData && imobiliariaData.pontuacaoTotal !== undefined
                    ? imobiliariaData.pontuacaoTotal
                    : "N/A"}
                </span>
                <span className="text-sm text-indigo-200">/100</span>
              </div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-3 border border-white border-opacity-20 text-left">
              <div className="text-xs text-indigo-100 mb-1 font-medium text-left">Média Mercado</div>
              <div className="text-right">
                <span className="text-2xl font-bold text-white">
                  {mercadoData && mercadoData.pontuacaoTotal !== undefined
                    ? mercadoData.pontuacaoTotal.toFixed(1)
                    : "N/A"}
                </span>
                <span className="text-sm text-indigo-200">/100</span>
              </div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-3 border border-white border-opacity-20 text-left">
              <div className="text-xs text-indigo-100 mb-1 font-medium text-left">Média Top 5</div>
              <div className="text-right">
                <span className="text-2xl font-bold text-white">
                  {mercadoData && mercadoData.top5 && mercadoData.top5.pontuacaoTotal 
                    ? mercadoData.top5.pontuacaoTotal.toFixed(1) 
                    : "N/A"}
                </span>
                <span className="text-sm text-indigo-200">/100</span>
              </div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-3 border border-white border-opacity-20 text-left">
              <div className="text-xs text-indigo-100 mb-1 font-medium text-left">Máximo Mercado</div>
              <div className="text-right">
                <span className="text-2xl font-bold text-white">
                  {mercadoData && mercadoData.top5 && mercadoData.top5.maxPontuacaoTotal !== undefined
                    ? mercadoData.top5.maxPontuacaoTotal
                    : "N/A"}
                </span>
                <span className="text-sm text-indigo-200">/100</span>
              </div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-3 border border-white border-opacity-20 text-left">
              <div className="text-xs text-indigo-100 mb-1 font-medium text-left">Ganho Potencial</div>
              <div className="text-right">
                <span className="text-2xl font-bold text-white">
                  +{mercadoData && mercadoData.top5 && mercadoData.top5.pontuacaoTotal 
                    ? (mercadoData.top5.pontuacaoTotal.toFixed(0) - imobiliariaData.pontuacaoTotal) 
                    : "N/A"}
                </span>
                <span className="text-sm text-indigo-200">pts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recomendações específicas para esta imobiliária */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-700 rounded-xl shadow-xl overflow-hidden mb-6">
        <div className="p-6 relative">
          <div className="absolute inset-0 opacity-10 mix-blend-overlay" 
              style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
          
          <div className="flex items-center relative mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg mr-5 backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white leading-tight">Recomendações Personalizadas</h2>
              <p className="text-blue-100 text-opacity-90 mt-1">Estratégias específicas para {imobiliariaData.nome}</p>
            </div>
          </div>
          
          {/* Seções de recomendações */}
          <div className="space-y-6">
            {secoes.map((secao) => (
              <div key={secao.id} className="space-y-4">
                {/* Título da seção com cores dinâmicas */}
                <div className={`bg-gradient-to-r ${getSectionColor(secao.titulo)} rounded-lg p-3 backdrop-blur-sm shadow-lg border`}>
                  <h3 className="text-lg font-bold text-white">{secao.titulo}</h3>
                </div>
                
                {/* Cards dos itens desta seção */}
                <div className="ml-4 space-y-3">
                  {secao.itens.map((item) => (
                    <div
                      key={item.id}
                      className={`rounded-xl border p-4 shadow-md bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm transform transition-all duration-200 hover:scale-102 hover:-translate-y-1 hover:shadow-lg ${categoriaColors[item.categoria]}`}
                    >
                      <div className="flex items-start">
                        <div className="mr-3 mt-0.5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-2 rounded-md shadow-inner">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`rounded-full px-2 py-1 text-xs font-medium shadow-sm ${impactoColors[item.impacto]}`}
                              >
                                {item.impacto}
                              </span>
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                {item.categoria}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-200 mb-3 font-medium leading-relaxed">{item.texto}</p>
                          <div className="flex justify-end items-center mt-2 space-x-2">
                            <span className={`rounded-md px-2 py-1 text-xs font-medium shadow-sm ${prioridadeColors[item.prioridade]}`}>
                              {item.prioridade}
                            </span>
                            <span className={`rounded-md px-2 py-1 text-xs font-medium shadow-sm ${implementacaoColors[item.implementacao]}`}>
                              {item.implementacao}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Plano de Implementação */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-indigo-100 dark:border-indigo-800">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-white dark:from-indigo-900/30 dark:to-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white text-xl flex items-center text-left">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            Plano de Implementação Estratégico
          </h3>
        </div>
        
        {/* Navegação por abas */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex overflow-x-auto">
            {['Curto prazo (30 dias)', 'Médio prazo (60-90 dias)', 'Longo prazo (90-120 dias)'].map((fase, index) => (
              <button 
                key={index}
                onClick={() => setFaseAtiva(index)}
                className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors ${
                  faseAtiva === index 
                    ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20" 
                    : "text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-300"
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    index === 0 ? (faseAtiva === 0 ? 'bg-blue-500' : 'bg-gray-300') :
                    index === 1 ? (faseAtiva === 1 ? 'bg-green-500' : 'bg-gray-300') :
                    (faseAtiva === 2 ? 'bg-purple-500' : 'bg-gray-300')
                  }`}></div>
                  {fase}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-6">
          {/* Fase 1: Curto prazo */}
          <div className={faseAtiva === 0 ? 'block' : 'hidden'}>
            <div className="bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent p-4 rounded-lg mb-6 border-l-4 border-blue-500 dark:border-blue-400">
              <h4 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2 text-left">Fase 1: Melhorias Imediatas</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-left">
                Implementações rápidas de alto impacto que podem ser executadas em paralelo para resultados imediatos.
                <span className="inline-block ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full">ROI Esperado: Alto</span>
              </p>
            </div>
            
            <div className="space-y-4">
              {/* Item 1 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                <div className="grid grid-cols-12">
                  <div className="col-span-1 bg-blue-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="col-span-11 p-4">
                    <div className="flex justify-between mb-2">
                      <h5 className="font-medium text-gray-900 dark:text-white text-left">Automatizar primeira resposta</h5>
                      <span className="inline-block ml-2 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full">Fácil</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 text-left">Implementar sistema de resposta automática para garantir o primeiro contato em menos de 1 minuto.</p>
                    
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mb-1">
                      <div 
                        className="bg-blue-600 dark:bg-blue-500 h-1.5 rounded-full transition-all duration-1000" 
                        style={{ width: `${progressoTarefas.automatizarResposta}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {progressoTarefas.automatizarResposta > 0 
                          ? `Em progresso: ${progressoTarefas.automatizarResposta}%` 
                          : 'Não iniciado'}
                      </span>
                      <button className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                        Ver detalhes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Item 2 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                <div className="grid grid-cols-12">
                  <div className="col-span-1 bg-amber-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div className="col-span-11 p-4">
                    <div className="flex justify-between mb-2">
                      <h5 className="font-medium text-gray-900 dark:text-white text-left">Criar processo de envio de imóveis</h5>
                      <span className="inline-block ml-2 px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full">Média</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 text-left">Desenvolver processo padronizado para enviar no mínimo 3-5 opções de imóveis para cada cliente.</p>
                    
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mb-1">
                      <div 
                        className="bg-amber-600 dark:bg-amber-500 h-1.5 rounded-full transition-all duration-1000" 
                        style={{ width: `${progressoTarefas.processoEnvioImoveis}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {progressoTarefas.processoEnvioImoveis > 0 
                          ? `Em progresso: ${progressoTarefas.processoEnvioImoveis}%` 
                          : 'Não iniciado'}
                      </span>
                      <button className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300">
                        Ver detalhes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Item 3 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                <div className="grid grid-cols-12">
                  <div className="col-span-1 bg-green-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="col-span-11 p-4">
                    <div className="flex justify-between mb-2">
                      <h5 className="font-medium text-gray-900 dark:text-white text-left">Desenvolver questionário de qualificação</h5>
                      <span className="inline-block ml-2 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full">Fácil</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 text-left">Desenvolver questionário estruturado para qualificação das necessidades específicas do cliente.</p>
                    
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mb-1">
                      <div 
                        className="bg-green-600 dark:bg-green-500 h-1.5 rounded-full transition-all duration-1000" 
                        style={{ width: `${progressoTarefas.questionarioQualificacao}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {progressoTarefas.questionarioQualificacao > 0 
                          ? `Em progresso: ${progressoTarefas.questionarioQualificacao}%` 
                          : 'Não iniciado'}
                      </span>
                      <button className="text-xs font-medium text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300">
                        Ver detalhes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Fase 2: Médio prazo */}
          <div className={faseAtiva === 1 ? 'block' : 'hidden'}>
            <div className="bg-gradient-to-r from-green-50 to-transparent dark:from-green-900/20 dark:to-transparent p-4 rounded-lg mb-6 border-l-4 border-green-500 dark:border-green-400">
              <h4 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-2 text-left">Fase 2: Melhorias Processuais</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-left">
                Aprimoramentos intermediários dos processos e treinamentos para a equipe de corretores.
                <span className="inline-block ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full">ROI Esperado: Médio</span>
              </p>
            </div>
            
            <div className="space-y-4">
              {/* Item 1 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                <div className="grid grid-cols-12">
                  <div className="col-span-1 bg-purple-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="col-span-11 p-4">
                    <div className="flex justify-between mb-2">
                      <h5 className="font-medium text-gray-900 dark:text-white text-left">Estabelecer protocolo de follow-up</h5>
                      <span className="inline-block ml-2 px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full">Média</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 text-left">Criar sistema automatizado de lembretes para realizar pelo menos 2 follow-ups com cada cliente (24h e 72h após o contato inicial).</p>
                    
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mb-1">
                      <div className="bg-purple-600 dark:bg-purple-500 h-1.5 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Não iniciado</span>
                      <button className="text-xs font-medium text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300">
                        Ver detalhes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Item 2 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                <div className="grid grid-cols-12">
                  <div className="col-span-1 bg-pink-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div className="col-span-11 p-4">
                    <div className="flex justify-between mb-2">
                      <h5 className="font-medium text-gray-900 dark:text-white text-left">Implementar treinamento em resolução de objeções</h5>
                      <span className="inline-block ml-2 px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full">Média</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 text-left">Treinar os corretores em técnicas de identificação e resolução de objeções, com roteiros para cada tipo comum de objeção.</p>
                    
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mb-1">
                      <div className="bg-pink-600 dark:bg-pink-500 h-1.5 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Não iniciado</span>
                      <button className="text-xs font-medium text-pink-600 dark:text-pink-400 hover:text-pink-800 dark:hover:text-pink-300">
                        Ver detalhes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Item 3 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                <div className="grid grid-cols-12">
                  <div className="col-span-1 bg-blue-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="col-span-11 p-4">
                    <div className="flex justify-between mb-2">
                      <h5 className="font-medium text-gray-900 dark:text-white text-left">Otimizar transferência para corretor</h5>
                      <span className="inline-block ml-2 px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full">Média</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 text-left">Estabelecer protocolo claro para transferência rápida ao corretor especializado, com alertas após 5 minutos.</p>
                    
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mb-1">
                      <div className="bg-blue-600 dark:bg-blue-500 h-1.5 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Não iniciado</span>
                      <button className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                        Ver detalhes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Fase 3: Longo prazo */}
          <div className={faseAtiva === 2 ? 'block' : 'hidden'}>
            <div className="bg-gradient-to-r from-purple-50 to-transparent dark:from-purple-900/20 dark:to-transparent p-4 rounded-lg mb-6 border-l-4 border-purple-500 dark:border-purple-400">
              <h4 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-2 text-left">Fase 3: KPIs e Monitoramento</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-left">
                Implementação de sistemas de medição, análise e melhoria contínua de desempenho.
                <span className="inline-block ml-2 px-2 py-1 text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-full">ROI Esperado: Longo Prazo</span>
              </p>
            </div>
            
            <div className="space-y-4">
              {/* Item 1 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                <div className="grid grid-cols-12">
                  <div className="col-span-1 bg-indigo-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="col-span-11 p-4">
                    <div className="flex justify-between mb-2">
                      <h5 className="font-medium text-gray-900 dark:text-white text-left">Implementar dashboard de KPIs</h5>
                      <span className="inline-block ml-2 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full">Complexa</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 text-left">Criar dashboard para monitoramento em tempo real dos indicadores-chave de desempenho, como tempo de resposta e taxa de envio de imóveis.</p>
                    
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mb-1">
                      <div className="bg-indigo-600 dark:bg-indigo-500 h-1.5 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Não iniciado</span>
                      <button className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                        Ver detalhes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Item 2 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                <div className="grid grid-cols-12">
                  <div className="col-span-1 bg-blue-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="col-span-11 p-4">
                    <div className="flex justify-between mb-2">
                      <h5 className="font-medium text-gray-900 dark:text-white text-left">Estabelecer revisões mensais de desempenho</h5>
                      <span className="inline-block ml-2 px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full">Média</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 text-left">Estabelecer revisões mensais de desempenho com base nos KPIs definidos e criar planos de ação para melhorias contínuas.</p>
                    
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mb-1">
                      <div className="bg-blue-600 dark:bg-blue-500 h-1.5 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Não iniciado</span>
                      <button className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                        Ver detalhes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Item 3 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                <div className="grid grid-cols-12">
                  <div className="col-span-1 bg-amber-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div className="col-span-11 p-4">
                    <div className="flex justify-between mb-2">
                      <h5 className="font-medium text-gray-900 dark:text-white text-left">Implementar sistema de feedback do cliente</h5>
                      <span className="inline-block ml-2 px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full">Média</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 text-left">Criar mecanismo para coletar feedback dos clientes após cada interação importante, para medir satisfação e identificar pontos de melhoria.</p>
                    
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mb-1">
                      <div className="bg-amber-600 dark:bg-amber-500 h-1.5 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Não iniciado</span>
                      <button className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300">
                        Ver detalhes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default TabRecomendacoes;