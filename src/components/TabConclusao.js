import React from 'react';
import { FaChartLine, FaExclamationTriangle, FaLightbulb, FaChartPie } from 'react-icons/fa';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer
} from 'recharts';

function TabConclusao({ imobiliariaData, mercadoData }) {
  // Verificar se os dados necessários existem
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
  const mercadoDataSafe = mercadoData || { pontuacaoTotal: 0 };

  // Calcula a pontuação total atual e a pontuação máxima possível
  const pontuacaoAtual = imobiliariaData.pontuacaoTotal;
  const pontuacaoMaxima = 100;
  const percentAtual = Math.round((pontuacaoAtual / pontuacaoMaxima) * 100);
  
  // Calcula posição relativa ao mercado
  const acimaMedia = pontuacaoAtual > (mercadoDataSafe.pontuacaoTotal || 0);
  const percentAcimaMedia = acimaMedia 
    ? Math.round(((pontuacaoAtual - (mercadoDataSafe.pontuacaoTotal || 0)) / (mercadoDataSafe.pontuacaoTotal || 1)) * 100) 
    : Math.round((((mercadoDataSafe.pontuacaoTotal || 0) - pontuacaoAtual) / (mercadoDataSafe.pontuacaoTotal || 1)) * 100);
  
  // Determina áreas mais críticas para melhoria
  const areas = [
    { 
      nome: "Tempo de Resposta", 
      pontuacao: imobiliariaData.primeiraResposta + imobiliariaData.transferenciaCorretor,
      max: 18,
      percentual: Math.round(((imobiliariaData.primeiraResposta + imobiliariaData.transferenciaCorretor) / 18) * 100)
    },
    { 
      nome: "Qualificação do Cliente", 
      pontuacao: imobiliariaData.qualificacaoCliente,
      max: 6,
      percentual: Math.round((imobiliariaData.qualificacaoCliente / 6) * 100)
    },
    { 
      nome: "Apresentação de Imóveis", 
      pontuacao: imobiliariaData.apresentacaoImoveis,
      max: 20,
      percentual: Math.round((imobiliariaData.apresentacaoImoveis / 20) * 100)
    },
    { 
      nome: "Experiência do Cliente", 
      pontuacao: imobiliariaData.personalizacao + imobiliariaData.adaptabilidade + imobiliariaData.resolucaoObjecoes,
      max: 17,
      percentual: Math.round(((imobiliariaData.personalizacao + imobiliariaData.adaptabilidade + imobiliariaData.resolucaoObjecoes) / 17) * 100)
    },
    { 
      nome: "Follow-up", 
      pontuacao: imobiliariaData.followUp + imobiliariaData.persistencia,
      max: 22,
      percentual: Math.round(((imobiliariaData.followUp + imobiliariaData.persistencia) / 22) * 100)
    }
  ];
  
  // Ordenar áreas pelo percentual (crescente) para identificar as mais críticas
  areas.sort((a, b) => a.percentual - b.percentual);
  
  // Identificar as 2 áreas mais críticas
  const areasCriticas = areas.slice(0, 2);
  
  // Identificar as áreas de melhor desempenho
  const areasFortes = [...areas].sort((a, b) => b.percentual - a.percentual).slice(0, 2);
  
  // Calcula aumento potencial na pontuação
  const potencialAumento = Math.min(
    pontuacaoMaxima - pontuacaoAtual,
    Math.round(areasCriticas.reduce((sum, area) => sum + ((area.max * 0.7) - area.pontuacao), 0))
  );
  
  // Gera recomendações específicas com base nas áreas críticas
  const recomendacoes = [];
  
  if (areas[0].nome === "Tempo de Resposta") {
    recomendacoes.push({
      titulo: "Otimização do tempo de resposta",
      descricao: `Implementar um sistema de alertas para novos contatos e garantir que o primeiro contato ocorra em até 30 minutos após a solicitação do cliente. Reduzir o tempo de transferência para o corretor (atual: ${imobiliariaData.tempoContatoCorretor}).`
    });
  }
  
  if (areas[0].nome === "Apresentação de Imóveis" || areas[1].nome === "Apresentação de Imóveis") {
    recomendacoes.push({
      titulo: "Melhorar apresentação de imóveis",
      descricao: `Aumentar o número de opções enviadas para cada cliente (atual: ${imobiliariaData.quantasOpcoesEnviadas}) para pelo menos 5 imóveis bem alinhados às necessidades específicas do cliente. Utilizar material de alta qualidade com vídeos e fotos profissionais.`
    });
  }
  
  if (areas[0].nome === "Qualificação do Cliente" || areas[1].nome === "Qualificação do Cliente") {
    recomendacoes.push({
      titulo: "Implementar questionário de qualificação",
      descricao: "Desenvolver e aplicar um questionário estruturado de qualificação para entender profundamente as necessidades, preferências e restrições de cada cliente antes de apresentar imóveis."
    });
  }
  
  if (areas[0].nome === "Experiência do Cliente" || areas[1].nome === "Experiência do Cliente") {
    recomendacoes.push({
      titulo: "Aprimorar a experiência do cliente",
      descricao: "Treinar a equipe em técnicas de atendimento personalizado, abordar objeções de forma eficaz e adaptar a comunicação ao perfil de cada cliente. Implementar sistema de feedback após cada interação."
    });
  }
  
  if (areas[0].nome === "Follow-up" || areas[1].nome === "Follow-up") {
    recomendacoes.push({
      titulo: "Estruturar protocolo de follow-up",
      descricao: `Estabelecer um protocolo de pelo menos 3 follow-ups para cada cliente em intervalos estratégicos (atual: ${imobiliariaData.numeroFollowUps}). Utilizar sistema de CRM para acompanhamento sistemático de cada lead.`
    });
  }
  
  // Se não tivermos pelo menos 3 recomendações, adicione genéricas baseadas na pontuação total
  if (recomendacoes.length < 3) {
    if (pontuacaoAtual < 50) {
      recomendacoes.push({
        titulo: "Revisão completa do processo de vendas",
        descricao: "Realizar treinamento completo da equipe e estabelecer novos processos e métricas para monitoramento do desempenho em todas as etapas do funil de vendas."
      });
    } else if (pontuacaoAtual < 70) {
      recomendacoes.push({
        titulo: "Implementação de CRM avançado",
        descricao: "Utilizar um sistema de CRM para gerenciar todo o ciclo de atendimento, garantindo que nenhum lead seja perdido e que todas as interações sejam registradas e acompanhadas."
      });
    } else {
      recomendacoes.push({
        titulo: "Otimização contínua",
        descricao: "Implementar reuniões semanais de análise de desempenho e compartilhamento de melhores práticas entre a equipe para manter o alto padrão de atendimento."
      });
    }
  }

  // Calcular a diferença entre a pontuação da imobiliária e a média do mercado
  const pontuacaoImobiliaria = imobiliariaData.pontuacaoTotal || 0;
  const pontuacaoMercado = mercadoDataSafe.pontuacaoTotal || 0;
  const diferenca = pontuacaoImobiliaria - pontuacaoMercado;
  
  // Calcular potencial de crescimento
  const potencialCrescimento = pontuacaoMaxima - pontuacaoImobiliaria;

  // Dados para o gráfico de comparação
  const comparisonData = [
    {
      name: "Pontuação Total",
      imobiliaria: pontuacaoImobiliaria,
      mercado: pontuacaoMercado,
      potencial: potencialCrescimento
    }
  ];

  // Gerar dicas baseadas nas áreas de menor pontuação
  const categoriasComPontuacao = [
    { 
      nome: 'Online Marketing', 
      pontuacao: (imobiliariaData.marketingDigital || 0), 
      max: 20 
    },
    { 
      nome: 'Qualidade do Atendimento', 
      pontuacao: (imobiliariaData.qualidadeAtendimento || 0), 
      max: 25 
    },
    { 
      nome: 'Tempo de Resposta', 
      pontuacao: (imobiliariaData.tempoResposta || 0), 
      max: 25 
    },
    { 
      nome: 'Canais de Comunicação', 
      pontuacao: (imobiliariaData.canaisComunicacao || 0), 
      max: 15 
    },
    { 
      nome: 'Gestão de Clientes', 
      pontuacao: (imobiliariaData.gestaoClientes || 0), 
      max: 15 
    }
  ];

  // Ordenar categorias pela diferença entre max e pontuação (do maior para o menor déficit)
  const categoriasOrdenadas = [...categoriasComPontuacao].sort((a, b) => 
    (b.max - b.pontuacao) - (a.max - a.pontuacao)
  );

  // Pegar as 3 categorias com maior potencial de melhoria
  const top3CategoriasParaMelhoria = categoriasOrdenadas.slice(0, 3);

  return (
    <div className="p-4 space-y-8">
      {/* Cabeçalho */}
      <div className="bg-blue-50 p-4 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-blue-800">Conclusão e Recomendações</h2>
        <p className="mt-2 text-gray-600">
          Análise completa do desempenho da {imobiliariaData.nome} no atendimento e oportunidades de melhoria.
        </p>
      </div>

      {/* Resumo da pontuação */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold flex items-center text-blue-700">
          <FaChartPie className="mr-2" /> Resumo da Pontuação
        </h3>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-gray-600">Pontuação Atual</p>
            <p className="text-2xl font-bold text-blue-700">{pontuacaoAtual.toFixed(1)} <span className="text-sm font-normal">/ {pontuacaoMaxima}</span></p>
            <p className="text-sm text-gray-600">{percentAtual}% do potencial</p>
          </div>
          <div className={`${acimaMedia ? 'bg-green-50' : 'bg-amber-50'} p-3 rounded-md`}>
            <p className="text-sm text-gray-600">Comparativo ao Mercado</p>
            <p className={`text-2xl font-bold ${acimaMedia ? 'text-green-600' : 'text-amber-600'}`}>
              {acimaMedia ? '+' : '-'}{percentAcimaMedia}%
            </p>
            <p className="text-sm text-gray-600">
              {acimaMedia 
                ? `Acima da média (${mercadoDataSafe.pontuacaoTotal.toFixed(1) || 0})` 
                : `Abaixo da média (${mercadoDataSafe.pontuacaoTotal.toFixed(1) || 0})`}
            </p>
          </div>
          <div className="bg-purple-50 p-3 rounded-md">
            <p className="text-sm text-gray-600">Potencial de Melhoria</p>
            <p className="text-2xl font-bold text-purple-700">+{potencialAumento.toFixed(1)}</p>
            <p className="text-sm text-gray-600">Ganho potencial imediato</p>
          </div>
        </div>
      </div>

      {/* Áreas Críticas */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold flex items-center text-red-600">
          <FaExclamationTriangle className="mr-2" /> Áreas Críticas
        </h3>
        <div className="mt-4 space-y-4">
          {areasCriticas.map((area, index) => (
            <div key={index} className="border-l-4 border-red-400 pl-4 py-2">
              <h4 className="font-semibold">{area.nome}</h4>
              <div className="flex items-center mt-1">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-red-500 h-2.5 rounded-full" 
                    style={{ width: `${area.percentual}%` }}
                  ></div>
                </div>
                <p className="ml-2 text-sm text-gray-600">{area.pontuacao}/{area.max} ({area.percentual}%)</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Áreas de Força */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold flex items-center text-green-600">
          <FaChartLine className="mr-2" /> Áreas de Destaque
        </h3>
        <div className="mt-4 space-y-4">
          {areasFortes.map((area, index) => (
            <div key={index} className="border-l-4 border-green-400 pl-4 py-2">
              <h4 className="font-semibold">{area.nome}</h4>
              <div className="flex items-center mt-1">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-500 h-2.5 rounded-full" 
                    style={{ width: `${area.percentual}%` }}
                  ></div>
                </div>
                <p className="ml-2 text-sm text-gray-600">{area.pontuacao}/{area.max} ({area.percentual}%)</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recomendações */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold flex items-center text-blue-700">
          <FaLightbulb className="mr-2" /> Recomendações de Melhoria
        </h3>
        <div className="mt-4 space-y-6">
          {recomendacoes.map((rec, index) => (
            <div key={index} className="border-l-4 border-blue-400 pl-4 py-1">
              <h4 className="font-semibold text-blue-800">{rec.titulo}</h4>
              <p className="mt-1 text-gray-600">{rec.descricao}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Próximos Passos */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-5 rounded-lg text-white shadow">
        <h3 className="text-xl font-semibold">Próximos Passos</h3>
        <p className="mt-2">
          Recomendamos uma reunião com a equipe de vendas da {imobiliariaData.nome} para apresentar este relatório e desenvolver um plano de ação detalhado para implementação das melhorias sugeridas, com foco prioritário nas áreas críticas identificadas.
        </p>
        <div className="mt-4 bg-white/20 p-3 rounded-md">
          <p className="font-medium">Meta Sugerida: Aumentar a pontuação em {Math.min(10, potencialAumento)} pontos nos próximos 60 dias</p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-blue-700">Resumo do Desempenho</h3>
        <p className="text-gray-700 mb-4">
          A {imobiliariaData.nome || 'Imobiliária'} obteve uma pontuação total de <span className="font-bold">{pontuacaoImobiliaria.toFixed(1)}</span> pontos, 
          {diferenca >= 0 
            ? ` superando a média do mercado em ${diferenca.toFixed(1)} pontos.` 
            : ` ficando ${Math.abs(diferenca).toFixed(1)} pontos abaixo da média do mercado.`}
          Isso coloca a empresa {diferenca >= 0 ? 'em uma posição favorável' : 'em posição de crescimento'} em relação aos concorrentes.
        </p>
        
        <div className="h-64 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="imobiliaria" name={imobiliariaData.nome || 'Imobiliária'} fill="#3B82F6" />
              <Bar dataKey="mercado" name="Média do Mercado" fill="#9CA3AF" />
              <Bar dataKey="potencial" name="Potencial de Crescimento" fill="#D1D5DB" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-blue-700">Pontos Fortes</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          {pontuacaoImobiliaria >= pontuacaoMercado && (
            <li>Desempenho acima da média do mercado, demonstrando boa competitividade.</li>
          )}
          {(imobiliariaData.marketingDigital || 0) >= 15 && (
            <li>Forte presença de marketing digital, com boa utilização de canais online.</li>
          )}
          {(imobiliariaData.qualidadeAtendimento || 0) >= 20 && (
            <li>Excelente qualidade no atendimento, com alta satisfação dos clientes.</li>
          )}
          {(imobiliariaData.tempoResposta || 0) >= 20 && (
            <li>Tempo de resposta eficiente, atendendo rapidamente às solicitações dos clientes.</li>
          )}
          {(imobiliariaData.canaisComunicacao || 0) >= 12 && (
            <li>Ampla variedade de canais de comunicação disponíveis para os clientes.</li>
          )}
          {(imobiliariaData.gestaoClientes || 0) >= 12 && (
            <li>Sistema de gestão de clientes bem implementado e eficaz.</li>
          )}
        </ul>
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-blue-700">Áreas para Melhoria</h3>
        <p className="text-gray-700 mb-4">
          Identificamos as seguintes áreas prioritárias onde a {imobiliariaData.nome || 'Imobiliária'} pode focar para melhorar seu desempenho:
        </p>
        
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          {top3CategoriasParaMelhoria.map((categoria, index) => (
            <li key={index}>
              <span className="font-semibold">{categoria.nome}:</span> Atualmente {categoria.pontuacao.toFixed(1)} de {categoria.max} pontos. 
              {categoria.nome === 'Online Marketing' && 
                ' Recomendamos aumentar a presença nas redes sociais e melhorar o SEO do site.'}
              {categoria.nome === 'Qualidade do Atendimento' && 
                ' Sugerimos investir em treinamento de equipe e implementar um sistema de avaliação de satisfação.'}
              {categoria.nome === 'Tempo de Resposta' && 
                ' Considere otimizar os processos internos e implementar automação para respostas iniciais.'}
              {categoria.nome === 'Canais de Comunicação' && 
                ' Amplie a disponibilidade em novos canais e melhore a integração entre os existentes.'}
              {categoria.nome === 'Gestão de Clientes' && 
                ' Implemente um CRM mais robusto e estabeleça processos de acompanhamento pós-venda.'}
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4 text-blue-700">Próximos Passos Recomendados</h3>
        <p className="text-gray-700 mb-4">
          Com base na análise, recomendamos que a {imobiliariaData.nome || 'Imobiliária'} siga o seguinte plano de ação:
        </p>
        
        <ol className="list-decimal pl-5 space-y-2 text-gray-700">
          <li>Priorizar melhorias nas 3 áreas identificadas acima, focando primeiro em ganhos rápidos.</li>
          <li>Realizar uma análise competitiva mais detalhada em relação aos líderes do mercado.</li>
          <li>Implementar um sistema de monitoramento contínuo para acompanhar o progresso.</li>
          <li>Revisar este relatório em 3 meses para avaliar o progresso e ajustar as estratégias conforme necessário.</li>
        </ol>
      </div>
    </div>
  );
}

export default TabConclusao; 