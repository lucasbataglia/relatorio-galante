import React from 'react';

const TabMetodologia = () => {
  // Categorias de avaliação
  const categories = [
    {
      name: "Tempo de Resposta",
      description: "Rapidez e eficiência no atendimento",
      maxScore: 25,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-blue-500",
      lightColor: "bg-blue-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-200"
    },
    {
      name: "Qualidade do Atendimento",
      description: "Profissionalismo e personalização",
      maxScore: 25,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: "bg-green-500",
      lightColor: "bg-green-50",
      textColor: "text-green-700",
      borderColor: "border-green-200"
    },
    {
      name: "Apresentação de Imóveis",
      description: "Quantidade, relevância e qualidade",
      maxScore: 20,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      color: "bg-amber-500",
      lightColor: "bg-amber-50",
      textColor: "text-amber-700",
      borderColor: "border-amber-200"
    },
    {
      name: "Follow-up",
      description: "Persistência e continuidade",
      maxScore: 15,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      color: "bg-purple-500",
      lightColor: "bg-purple-50",
      textColor: "text-purple-700",
      borderColor: "border-purple-200"
    },
    {
      name: "Experiência do Cliente",
      description: "Adaptabilidade e resolução",
      maxScore: 15,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: "bg-pink-500",
      lightColor: "bg-pink-50",
      textColor: "text-pink-700",
      borderColor: "border-pink-200"
    }
  ];

  // Critérios detalhados por categoria
  const detailedCriteria = [
    {
      category: "Tempo de Resposta",
      items: [
        {
          name: "Primeira resposta",
          maxScore: 10,
          criteria: [
            "Até 5 minutos: 10 pontos",
            "5 minutos a 30 minutos: 8 pontos",
            "30 minutos a 1 hora: 6 pontos",
            "1 hora a 2 horas: 4 pontos",
            "2 horas a 12 horas: 2 pontos",
            "Mais de 12 horas: 1 ponto"
          ]
        },
        {
          name: "Transferência para corretor",
          maxScore: 8,
          criteria: [
            "Até 10 minutos: 8 pontos",
            "10 minutos a 30 minutos: 6 pontos",
            "30 minutos a 1 hora: 5 pontos",
            "1 hora a 3 horas: 3 pontos",
            "3 horas a 12 horas: 2 pontos",
            "Mais de 12 horas: 1 ponto",
            "Sem transferência: 0 pontos"
          ]
        },
        {
          name: "Velocidade média de respostas",
          maxScore: 7,
          criteria: [
            "Menos de 5 minutos: 7 pontos",
            "5 a 15 minutos: 5 pontos",
            "15 a 60 minutos: 3 pontos",
            "Mais de 60 minutos: 1 ponto"
          ]
        }
      ]
    },
    {
      category: "Qualidade do Atendimento",
      items: [
        {
          name: "Personalização",
          maxScore: 7,
          criteria: [
            "Uso do nome do cliente: 2 pontos",
            "Referências às necessidades específicas: 3 pontos",
            "Linguagem adaptada ao perfil do cliente: 2 pontos"
          ]
        },
        {
          name: "Profissionalismo",
          maxScore: 6,
          criteria: [
            "Apresentação adequada do corretor: 2 pontos",
            "Comunicação clara e cortês: 2 pontos",
            "Sem erros graves de ortografia/gramática: 2 pontos"
          ]
        },
        {
          name: "Qualificação do cliente",
          maxScore: 6,
          criteria: [
            "Perguntas relevantes sobre necessidades: 3 pontos",
            "Clarificação de detalhes específicos: 3 pontos"
          ]
        },
        {
          name: "Explicações e informações",
          maxScore: 6,
          criteria: [
            "Detalhamentos completos dos imóveis: 3 pontos",
            "Informações adicionais relevantes: 3 pontos"
          ]
        }
      ]
    },
    {
      category: "Apresentação de Imóveis",
      items: [
        {
          name: "Quantidade de imóveis",
          maxScore: 5,
          criteria: [
            "5 ou mais opções: 5 pontos",
            "3-4 opções: 4 pontos",
            "1-2 opções: 2 pontos",
            "Nenhum imóvel enviado: 0 pontos"
          ]
        },
        {
          name: "Aderência aos critérios",
          maxScore: 10,
          criteria: [
            "Preço dentro do orçamento: 3 pontos",
            "Localização correta: 3 pontos",
            "Número correto de quartos: 2 pontos",
            "Outras características solicitadas: 2 pontos"
          ]
        },
        {
          name: "Qualidade do material",
          maxScore: 5,
          criteria: [
            "Links funcionais/imagens claras: 2 pontos",
            "Descrições detalhadas: 2 pontos",
            "Organização da informação: 1 ponto"
          ]
        }
      ]
    },
    {
      category: "Follow-up",
      items: [
        {
          name: "Persistência",
          maxScore: 7,
          criteria: [
            "Follow-up no dia seguinte: 3 pontos",
            "Follow-up após 2-3 dias: 2 pontos",
            "Follow-up na semana seguinte: 2 pontos"
          ]
        },
        {
          name: "Qualidade do follow-up",
          maxScore: 8,
          criteria: [
            "Novas informações ou imóveis: 3 pontos",
            "Tentativa de agendamento de visitas: 3 pontos",
            "Perguntas de feedback sobre opções: 2 pontos"
          ]
        }
      ]
    },
    {
      category: "Experiência do Cliente",
      items: [
        {
          name: "Adaptabilidade",
          maxScore: 5,
          criteria: [
            "Respeito à disponibilidade do cliente: 3 pontos",
            "Adaptação às preferências de comunicação: 2 pontos"
          ]
        },
        {
          name: "Resolução de objeções",
          maxScore: 5,
          criteria: [
            "Resposta adequada a dúvidas/objeções: 3 pontos",
            "Oferecimento de alternativas: 2 pontos"
          ]
        },
        {
          name: "Eficiência geral",
          maxScore: 5,
          criteria: [
            "Atendimento completo sem redundâncias: 2 pontos",
            "Foco nas necessidades principais: 3 pontos"
          ]
        }
      ]
    }
  ];

  // Etapas do processo
  const processSteps = [
    {
      name: "Contato Inicial",
      description: "Um avaliador se passa por cliente interessado e faz contato via WhatsApp com a imobiliária.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      name: "Monitoramento",
      description: "Todas as mensagens, tempos de resposta e materiais enviados são documentados.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      name: "Observação",
      description: "A interação é mantida por 7 dias para avaliar follow-ups e persistência.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      name: "Análise",
      description: "Aplicação dos critérios de pontuação às interações documentadas.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      name: "Relatório",
      description: "Elaboração de relatório detalhado com análises e recomendações.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  // Métricas coletadas
  const metrics = [
    { name: "Tempo da primeira resposta", format: "HH:MM:SS" },
    { name: "Tempo para transferência ao corretor", format: "HH:MM:SS" },
    { name: "Opções de imóveis enviadas", format: "Sim/Não" },
    { name: "Quantidade de imóveis apresentados", format: "Número" },
    { name: "Número de follow-ups realizados", format: "Número" },
    { name: "Tempo médio de resposta", format: "HH:MM:SS" }
  ];

  return (
    <div className="px-1 py-3 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-xl p-6 shadow-lg">
        <div className="flex items-center mb-4">
          <div className="bg-white p-4 rounded-2xl shadow-xl mr-5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Metodologia de Avaliação</h1>
            <p className="text-indigo-200 mt-1">Avaliação de Cliente Oculto para Imobiliárias</p>
          </div>
        </div>
        
        <p className="text-white text-left">
          Esta metodologia utiliza a técnica de cliente oculto para mensurar objetivamente a qualidade do 
          atendimento imobiliário. A avaliação é realizada via WhatsApp e considera 5 dimensões críticas 
          do atendimento, com pontuação total de 100 pontos, permitindo comparação entre diferentes imobiliárias.
        </p>
      </div>
      
      {/* Main content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
          Distribuição de Pontuação
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className={`${category.lightColor} rounded-lg p-4 border ${category.borderColor} transition-all duration-300 hover:shadow-md`}
            >
              <div className="flex items-center mb-3">
                <div className={`p-2 rounded-lg ${category.color} text-white mr-3 flex items-center justify-center`}>
                  {category.icon}
                </div>
                <div>
                  <h3 className={`font-semibold ${category.textColor}`}>{category.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{category.description}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Pontuação máxima:</span>
                <span className={`font-bold text-lg ${category.textColor}`}>{category.maxScore} pts</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center">
          <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800 mb-4 max-w-lg">
            <div className="flex items-center justify-center mb-2">
              <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Total: 100 pontos</h3>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              A pontuação total reflete a qualidade geral do atendimento imobiliário,
              permitindo comparação objetiva entre diferentes imobiliárias.
            </p>
          </div>
        </div>
      </div>
      
      {/* Process Steps */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
          Processo de Avaliação
        </h2>
        
        <div className="flex overflow-x-auto pb-4">
          <div className="flex space-x-4">
            {processSteps.map((step, index) => (
              <div key={index} className="flex-shrink-0 w-80">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-5 border border-gray-200 dark:border-gray-700 h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-full mr-3 flex items-center justify-center">
                      {step.icon}
                    </div>
                    <div className="flex items-center">
                      <span className="bg-indigo-600 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center mr-2">
                        {index + 1}
                      </span>
                      <h3 className="font-bold text-gray-800 dark:text-white">{step.name}</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm flex-grow text-left">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          Métricas Coletadas
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-left">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{metric.name}</h3>
              <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-500 dark:text-gray-400 text-sm">{metric.format}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Detailed Criteria - Accordion Style */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
          Critérios Detalhados de Pontuação
        </h2>
        
        <div className="space-y-4">
          {detailedCriteria.map((criteria, index) => {
            const category = categories.find(cat => cat.name === criteria.category);
            
            return (
              <details key={index} className="group">
                <summary className={`flex justify-between items-center p-4 rounded-lg ${category?.lightColor} cursor-pointer border border-${category?.color.replace('bg-', '')} border-opacity-30 hover:shadow-md transition-all duration-300`}>
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${category?.color} text-white mr-3 shadow-sm`}>
                      {category?.icon}
                    </div>
                    <h3 className={`font-semibold ${category?.textColor}`}>
                      {criteria.category} <span className="ml-1 text-sm font-normal text-gray-600 dark:text-gray-400">(Máximo: {category?.maxScore} pts)</span>
                    </h3>
                  </div>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${category?.lightColor} border border-${category?.color.replace('bg-', '')} border-opacity-50 group-open:rotate-180 transition-all duration-300`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${category?.textColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </summary>
                
                <div className="mt-6 ml-4 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {criteria.items.map((item, itemIndex) => (
                      <div 
                        key={itemIndex} 
                        className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-${category?.color.replace('bg-', '')} border-opacity-20 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full`}
                      >
                        <div className={`${category?.color} p-4 border-b border-${category?.color.replace('bg-', '')} border-opacity-20`}>
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-white flex items-center">
                              <svg className="h-5 w-5 text-white opacity-80 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                              {item.name}
                            </h4>
                            <span className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                              {item.maxScore} pts
                            </span>
                          </div>
                        </div>
                        <div className="p-4 flex-grow bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                          <ul className="space-y-2 pl-4 list-none text-gray-600 dark:text-gray-300">
                            {item.criteria.map((criterion, criterionIndex) => (
                              <li key={criterionIndex} className="flex items-start">
                                <svg className={`h-5 w-5 ${category?.textColor} mr-2 flex-shrink-0 mt-0.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-sm">{criterion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </div>
      
      {/* Important Notes */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800 shadow-lg">
        <div className="flex justify-center mb-4">
          <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Notas Importantes
          </h2>
        </div>
        
        <ul className="space-y-3">
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-gray-700 dark:text-gray-300">
              A avaliação é conduzida por 7 dias consecutivos para permitir a observação completa de follow-ups e
              do ciclo de atendimento.
            </p>
          </li>
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-gray-700 dark:text-gray-300">
              As métricas de comparação são baseadas no desempenho médio do mercado, coletadas
              a partir de uma amostra representativa de 72 imobiliárias.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TabMetodologia;