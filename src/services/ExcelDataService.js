import * as XLSX from 'xlsx';

// Caminho para o arquivo principal de dados consolidados
const CONSOLIDATED_FILE_PATH = '/files-real-state/imobiliarias_consolidado.xlsx';

// Função para ler o arquivo Excel e converter para JSON
export const readExcelFile = async (filePath) => {
  try {
    console.log('Iniciando carregamento do arquivo Excel:', filePath);
    const response = await fetch(filePath);
    
    if (!response.ok) {
      throw new Error(`Falha ao carregar arquivo: ${response.status} ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });
    
    // Assume que a primeira planilha contém os dados
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Converte para JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    console.log(`Arquivo Excel carregado com sucesso. ${jsonData.length} registros encontrados.`);
    
    // Logar as colunas disponíveis para ajudar no diagnóstico
    if (jsonData.length > 0) {
      console.log('Colunas disponíveis na planilha:', Object.keys(jsonData[0]));
      console.log('Amostra do primeiro registro:', JSON.stringify(jsonData[0], null, 2));
    } else {
      console.warn('Arquivo Excel não contém dados. Verifique o formato e conteúdo do arquivo.');
    }
    
    return jsonData;
  } catch (error) {
    console.error('Erro ao ler o arquivo Excel:', error);
    alert(`Erro ao carregar o arquivo Excel: ${error.message}. Verifique se o caminho está correto e se o arquivo é acessível.`);
    return [];
  }
};

// Função específica para carregar o arquivo consolidado
export const loadConsolidatedData = async () => {
  try {
    console.log('Carregando arquivo consolidado de imobiliárias:', CONSOLIDATED_FILE_PATH);
    const data = await readExcelFile(CONSOLIDATED_FILE_PATH);
    if (data.length === 0) {
      console.error('Arquivo consolidado não contém dados ou não foi possível carregá-lo');
    }
    return data;
  } catch (error) {
    console.error('Erro ao carregar arquivo consolidado:', error);
    return [];
  }
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

// Função para sanitizar strings, removendo espaços extras e caracteres especiais indesejados
const sanitizarString = (texto) => {
  if (!texto) return '';
  
  if (typeof texto !== 'string') {
    return String(texto);
  }
  
  // Remove espaços extras no início e fim e normaliza espaços duplos
  return texto.trim().replace(/\s+/g, ' ');
};

// Função para calcular a pontuação da primeira resposta
const calcularPontuacaoPrimeiraResposta = (tempo) => {
  if (!tempo || tempo === 'N/A') return 0;
  const segundos = tempoParaSegundos(tempo);
  if (segundos === null) return 0;
  
  // Segundo a pesquisa "Lead Response Management 2021", a taxa de conversão é 
  // 8x maior quando o contato ocorre dentro de 5 minutos após o lead.
  // Por isso, damos pontuação máxima para respostas neste intervalo.
  
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

// Função para calcular a pontuação da transferência para o corretor
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

// Função para processar os dados e estruturá-los para uso no dashboard
export const processImobiliariasData = (data) => {
  if (!data || data.length === 0) {
    console.warn('Dados vazios ou inválidos recebidos para processamento');
    return [];
  }
  
  console.log('Iniciando processamento de dados das imobiliárias, registros:', data.length);
  
  // Vamos logar toda a primeira linha para diagnóstico completo
  if (data.length > 0) {
    console.log('DIAGNÓSTICO COMPLETO - Primeira linha da planilha:');
    console.table(data[0]);
    
    // Método alternativo para ver todos os campos e valores
    const firstRow = data[0];
    console.log('Lista completa de campos disponíveis:');
    for (const key in firstRow) {
      console.log(`Campo: "${key}" - Valor: "${firstRow[key]}" - Tipo: ${typeof firstRow[key]}`);
    }
    
    // Vamos buscar campos específicos que podem conter as pontuações
    const possibleScoreFields = Object.keys(firstRow).filter(key => 
      key.toLowerCase().includes('pontu') || 
      key.toLowerCase().includes('nota') || 
      key.toLowerCase().includes('score') ||
      key.toLowerCase().includes('tempo') ||
      key.toLowerCase().includes('qualidade') ||
      key.toLowerCase().includes('apresent') ||
      key.toLowerCase().includes('follow') ||
      key.toLowerCase().includes('experi')
    );
    
    console.log('Campos potencialmente relevantes para pontuações:', possibleScoreFields);
  }
  
  const processedData = data.map((row, index) => {
    // Debug para cada linha
    console.log(`Processando registro #${index + 1}:`, row.Nome || row.nome || row.NOME || row.Imobiliária || row.IMOBILIÁRIA || `Registro #${index + 1}`);
    
    // Para lidar com diferentes formatações de nomes de colunas na planilha
    const getField = (possibleNames, ignoreCase = true) => {
      // Primeiro tentamos correspondência exata
      for (const name of possibleNames) {
        if (row[name] !== undefined) {
          return row[name];
        }
      }
      
      // Se não encontrar, tentamos correspondência ignorando case se solicitado
      if (ignoreCase) {
        const lowerCaseNames = possibleNames.map(name => name.toLowerCase());
        for (const key in row) {
          if (lowerCaseNames.includes(key.toLowerCase())) {
            return row[key];
          }
        }
      }
      
      // Última tentativa: busca parcial
      for (const name of possibleNames) {
        for (const key in row) {
          if (key.toLowerCase().includes(name.toLowerCase())) {
            console.log(`Campo encontrado por correspondência parcial: ${key} -> ${name}`);
            return row[key];
          }
        }
      }
      
      return undefined;
    };
    
    // Encontrar campos com diferentes possíveis nomenclaturas
    const nome = getField(['Nome', 'nome', 'NOME', 'Imobiliária', 'IMOBILIÁRIA', 'imobiliaria', 'IMOBILIARIA']);
    const pontuacaoTotal = getField(['PontuacaoTotal', 'Pontuação Total', 'PONTUACAO_TOTAL', 'Pontuacao_Total', 'Pontuacao Total', 'pontuacao_total', 'NOTA_FINAL', 'Nota Final', 'NOTA', 'nota']);
    
    // URL do logo da imobiliária
    const urlLogo = getField(['url_logo', 'URL_LOGO', 'UrlLogo', 'logoUrl', 'LogoURL', 'logo_url', 'Logo URL', 'Url Logo']);
    
    // Recomendações gerais da imobiliária
    const recomendacoesGerais = getField(['Recomendações Gerais', 'RecomendacoesGerais', 'RECOMENDACOES_GERAIS', 'recomendacoes_gerais', 'Recomendacoes Gerais', 'RECOMENDAÇÕES GERAIS']);
    
    // Tempos originais
    const tempoPrimeiraResposta = getField(['TempoPrimeiraResposta', 'Tempo_Primeira_Resposta', 'TEMPO_PRIMEIRA_RESPOSTA', 'Tempo Primeira Resposta', 'tempo_primeira_resposta']);
    const tempoContatoCorretor = getField(['TempoContatoCorretor', 'Tempo_Contato_Corretor', 'TEMPO_CONTATO_CORRETOR', 'Tempo Contato Corretor', 'tempo_contato_corretor']);
    
    // Subcategorias de tempo de resposta (pontuações detalhadas)
    const primeiraResposta = getField(['PrimeiraResposta', 'Primeira_Resposta', 'PRIMEIRA_RESPOSTA', 'PR', 'NotaPR', 'Nota_PR', 'Nota Primeira Resposta', 'primeira_resposta']);
    const transferenciaCorretor = getField(['TransferenciaCorretor', 'Transferencia_Corretor', 'TRANSFERENCIA_CORRETOR', 'TC', 'NotaTC', 'Nota_TC', 'Nota Transferência Corretor', 'transferencia_corretor']);
    const velocidadeMedia = getField(['VelocidadeMedia', 'Velocidade_Media', 'VELOCIDADE_MEDIA', 'VM', 'NotaVM', 'Nota_VM', 'Nota Velocidade Média', 'velocidade_media']);
    
    // Subcategorias de qualidade de atendimento
    const personalizacao = getField(['Personalizacao', 'Personalização', 'PERSONALIZACAO', 'Personalização Atendimento', 'personalizacao']);
    const profissionalismo = getField(['Profissionalismo', 'PROFISSIONALISMO', 'Prof', 'profissionalismo']);
    const qualificacaoCliente = getField(['QualificacaoCliente', 'Qualificacao_Cliente', 'QUALIFICACAO_CLIENTE', 'Qualificação Cliente', 'qualificacao_cliente']);
    const explicacoesInformacoes = getField(['ExplicacoesInformacoes', 'Explicacoes_Informacoes', 'EXPLICACOES_INFORMACOES', 'Explicações e Informações', 'explicacoes_informacoes']);
    
    // Campos adicionais para subcategorias da qualidade de atendimento
    const satisfacaoClientes = getField(['SatisfacaoClientes', 'Satisfacao_Clientes', 'SATISFACAO_CLIENTES', 'Satisfação de Clientes', 'satisfacao_clientes']);
    const qualificacaoEquipe = getField(['QualificacaoEquipe', 'Qualificacao_Equipe', 'QUALIFICACAO_EQUIPE', 'Qualificação da Equipe', 'qualificacao_equipe']);
    const organizacao = getField(['Organizacao', 'ORGANIZACAO', 'Organização', 'organizacao']);
    const posVenda = getField(['PosVenda', 'Pos_Venda', 'POS_VENDA', 'Pós-venda', 'pos_venda']);
    
    // Subcategorias de apresentação de imóveis
    const quantidadeImoveis = getField(['QuantidadeImoveis', 'Quantidade_Imoveis', 'QUANTIDADE_IMOVEIS', 'Quantidade de Imóveis', 'quantidade_imoveis']);
    const aderenciaCriterios = getField(['AderenciaCriterios', 'Aderencia_Criterios', 'ADERENCIA_CRITERIOS', 'Aderência aos Critérios', 'aderencia_criterios']);
    const qualidadeMaterial = getField(['QualidadeMaterial', 'Qualidade_Material', 'QUALIDADE_MATERIAL', 'Qualidade do Material', 'qualidade_material']);
    
    // Verificar se os dados essenciais existem
    if (!nome) {
      console.warn(`Registro #${index + 1} não possui nome de imobiliária`);
    }
    
    // Logar campos importantes para diagnóstico
    console.log(`DEBUG #${index + 1} - Imobiliária: ${nome || 'Desconhecida'}`);
    console.log(`- Pontuação Total: ${pontuacaoTotal}`);
    console.log(`- Tempo Resposta: ${tempoPrimeiraResposta}`);
    console.log(`- Tempo Contato Corretor: ${tempoContatoCorretor}`);
    console.log(`- Primeira Resposta: ${primeiraResposta}`);
    console.log(`- Transferencia Corretor: ${transferenciaCorretor}`);
    console.log(`- Velocidade Média: ${velocidadeMedia}`);
    console.log(`- Personalização: ${personalizacao}`);
    console.log(`- Profissionalismo: ${profissionalismo}`);
    console.log(`- Qualificação Cliente: ${qualificacaoCliente}`);
    console.log(`- Explicacoes e Informações: ${explicacoesInformacoes}`);
    console.log(`- Quantidade de Imóveis: ${quantidadeImoveis}`);
    console.log(`- Aderencia aos Critérios: ${aderenciaCriterios}`);
    console.log(`- Qualidade do Material: ${qualidadeMaterial}`);
    
    // Log dos novos campos adicionados
    console.log(`- Satisfação de Clientes: ${satisfacaoClientes}`);
    console.log(`- Qualificação da Equipe: ${qualificacaoEquipe}`);
    console.log(`- Organização: ${organizacao}`);
    console.log(`- Pós-venda: ${posVenda}`);
    
    // Função para converter valores para números com segurança
    const safeParseFloat = (valor, padrao = 0) => {
      if (valor === undefined || valor === null) return padrao;
      
      if (typeof valor === 'number') return valor;
      
      if (typeof valor === 'string') {
        // Remover símbolos como % ou $ e substituir vírgula por ponto
        const numeroLimpo = valor.replace(/[^\d.,\-]/g, '').replace(',', '.');
        const parseado = parseFloat(numeroLimpo);
        if (!isNaN(parseado)) {
          console.log(`Convertido "${valor}" para número: ${parseado}`);
          return parseado;
        }
        console.warn(`Não foi possível converter "${valor}" para número`);
        return padrao;
      }
      
      return padrao;
    };
    
    // Extrair todos os dados e criar o objeto base
    const imobiliaria = {
      id: index + 1,
      nome: sanitizarString(nome) || `Imobiliária ${index + 1}`,
      url_logo: urlLogo,
      pontuacaoTotal: safeParseFloat(pontuacaoTotal, 0),
      tempoPrimeiraResposta: tempoPrimeiraResposta || "N/A",
      tempoContatoCorretor: tempoContatoCorretor || "N/A",
      
      // Pontuações para categorias principais
      tempoResposta: safeParseFloat(getField(['PontuacaoTempoResposta', 'Pontuacao_TempoResposta', 'PONTUACAO_TEMPORESPOSTA', 'Pontuação Tempo Resposta', 'TempoResposta', 'Tempo_Resposta', 'TEMPO_RESPOSTA', 'Tempo de Resposta', 'tempo_resposta', 'TR'])),
      qualidadeAtendimento: safeParseFloat(getField(['PontuacaoQualidadeAtendimento', 'Pontuacao_QualidadeAtendimento', 'PONTUACAO_QUALIDADEATENDIMENTO', 'Pontuação Qualidade Atendimento', 'QualidadeAtendimento', 'Qualidade_Atendimento', 'QUALIDADE_ATENDIMENTO', 'Qualidade de Atendimento', 'qualidade_atendimento', 'QA'])),
      apresentacaoImoveis: safeParseFloat(getField(['PontuacaoApresentacaoImoveis', 'Pontuacao_ApresentacaoImoveis', 'PONTUACAO_APRESENTACAOIMOVEIS', 'Pontuação Apresentação Imóveis', 'ApresentacaoImoveis', 'Apresentacao_Imoveis', 'APRESENTACAO_IMOVEIS', 'Apresentação de Imóveis', 'apresentacao_imoveis', 'AI'])),
      experienciaCliente: safeParseFloat(getField(['PontuacaoExperienciaCliente', 'Pontuacao_ExperienciaCliente', 'PONTUACAO_EXPERIENCIACLIENTE', 'Pontuação Experiência Cliente', 'ExperienciaCliente', 'Experiencia_Cliente', 'EXPERIENCIA_CLIENTE', 'Experiência do Cliente', 'experiencia_cliente', 'EC'])),
      followUp: safeParseFloat(getField(['PontuacaoFollowUp', 'Pontuacao_FollowUp', 'PONTUACAO_FOLLOWUP', 'Pontuação Follow-Up', 'FollowUp', 'Follow_Up', 'FOLLOW_UP', 'Follow-up', 'follow_up', 'FU'])),
      
      // Subcategorias detalhadas (conforme prompt.txt)
      // Tempo de Resposta (25 pontos)
      primeiraResposta: safeParseFloat(primeiraResposta),
      transferenciaCorretor: safeParseFloat(transferenciaCorretor),
      velocidadeMedia: safeParseFloat(velocidadeMedia),
      
      // Qualidade do Atendimento (25 pontos)
      personalizacao: safeParseFloat(personalizacao),
      profissionalismo: safeParseFloat(profissionalismo),
      qualificacaoCliente: safeParseFloat(qualificacaoCliente),
      explicacoesInformacoes: safeParseFloat(explicacoesInformacoes),
      
      // Apresentação de Imóveis (20 pontos)
      quantidadeImoveis: safeParseFloat(quantidadeImoveis),
      aderenciaCriterios: safeParseFloat(aderenciaCriterios),
      qualidadeMaterial: safeParseFloat(qualidadeMaterial),
      
      // Follow-up (15 pontos)
      persistencia: safeParseFloat(getField(['Persistencia', 'PERSISTENCIA', 'Persistência', 'persistencia'])),
      qualidadeFollowUp: safeParseFloat(getField(['QualidadeFollowUp', 'Qualidade_FollowUp', 'QUALIDADE_FOLLOWUP', 'Qualidade do Follow-up', 'qualidade_followup'])),
      numeroFollowUps: safeParseFloat(getField(['NumeroFollowUps', 'Numero_FollowUps', 'NUMERO_FOLLOWUPS', 'Número de Follow-ups', 'numero_followups'])),
      
      // Experiência do Cliente (15 pontos)
      adaptabilidade: safeParseFloat(getField(['Adaptabilidade', 'ADAPTABILIDADE', 'adaptabilidade'])),
      resolucaoObjecoes: safeParseFloat(getField(['ResolucaoObjecoes', 'Resolucao_Objecoes', 'RESOLUCAO_OBJECOES', 'Resolução de Objeções', 'resolucao_objecoes'])),
      eficienciaGeral: safeParseFloat(getField(['EficienciaGeral', 'Eficiencia_Geral', 'EFICIENCIA_GERAL', 'Eficiência Geral', 'eficiencia_geral'])),
      
      // Métricas absolutas (conforme prompt.txt)
      opcoesImoveisEnviadas: getField(['OpcoesImoveisEnviadas', 'Opcoes_Imoveis_Enviadas', 'OPCOES_IMOVEIS_ENVIADAS', 'Opções de Imóveis Enviadas', 'opcoes_imoveis_enviadas']) || "Não",
      quantasOpcoesEnviadas: safeParseFloat(getField(['QuantasOpcoesEnviadas', 'Quantas_Opcoes_Enviadas', 'QUANTAS_OPCOES_ENVIADAS', 'Quantas Opções Enviadas', 'quantas_opcoes_enviadas'])),
      
      // Dados de recomendações
      recomendacoesGerais: recomendacoesGerais || "",
    };
    
    // Não sobrescrever os valores gerais com as somas de subcategorias
    // Usar os valores diretamente da planilha, conforme solicitado pelo usuário
    
    return imobiliaria;
  });
  
  console.log(`Processamento concluído: ${processedData.length} imobiliárias processadas`);
  
  // Log detalhado do primeiro registro para debug
  if (processedData.length > 0) {
    console.log('Exemplo do primeiro registro processado:', JSON.stringify(processedData[0], null, 2));
  }
  
  return processedData;
};

// Função para obter uma imobiliária específica por ID
export const getImobiliariaById = (data, id) => {
  if (!data || !Array.isArray(data)) {
    console.error('getImobiliariaById: dados inválidos', data);
    return null;
  }
  
  const imobiliaria = data.find(item => item.id === parseInt(id));
  
  if (!imobiliaria) {
    console.warn(`getImobiliariaById: imobiliária com ID ${id} não encontrada`);
  }
  
  return imobiliaria || null;
};

// Função para obter uma imobiliária específica por nome
export const getImobiliariaByNome = (data, nome) => {
  if (!data || !Array.isArray(data) || !nome) {
    console.error('getImobiliariaByNome: parâmetros inválidos', { data, nome });
    return null;
  }
  
  const imobiliaria = data.find(item => item.nome.toLowerCase() === nome.toLowerCase());
  
  if (!imobiliaria) {
    console.warn(`getImobiliariaByNome: imobiliária com nome "${nome}" não encontrada`);
  }
  
  return imobiliaria || null;
};

// Exportação de dados para mercado (média) para comparação
export const getMercadoData = () => {
  return {
    pontuacaoTotal: 39.6, // Pontuação total média do mercado
    tempoResposta: 18,
    qualidadeAtendimento: 16,
    apresentacaoImoveis: 12,
    followUp: 9,
    experienciaCliente: 8,
    
    // Valores médios para tempos de resposta formatados
    tempoPrimeiraRespostaMedia: "00:26:32",
    tempoContatoCorretorMedia: "01:05:46",
    mediaFollowUps: 1.2,
    mediaOpcoesEnviadas: 2.4,
    
    // Pontuações detalhadas para categorias
    primeiraResposta: 5.8,
    transferenciaCorretor: 6.4,
    velocidadeMedia: 5.8,
    personalizacao: 5.3,
    profissionalismo: 5.7,
    qualificacaoCliente: 5.0,
    persistencia: 4.5,
    qualidadeFollowUp: 4.5,
    adaptabilidade: 4.2,
    resolucaoObjecoes: 3.8,
    
    // Subcategorias de apresentação de imóveis
    quantidadeImoveis: 3.2,
    aderenciaCriterios: 5.1,
    qualidadeMaterial: 3.7,
    
    // Valor de eficiência geral
    eficienciaGeral: 4.0,
    
    top5: {
      pontuacaoTotal: 76.8, // Pontuação total média do top 5
      tempoResposta: 22,
      qualidadeAtendimento: 21,
      apresentacaoImoveis: 17,
      followUp: 13,
      experienciaCliente: 12,
      maxPontuacaoTotal: 88, // Pontuação máxima real observada entre todas as imobiliárias
      
      // Tempos médios para top 5
      tempoPrimeiraRespostaMedia: "00:07:18",
      tempoContatoCorretorMedia: "00:22:35",
      maxFollowUp: 15,
      mediaFollowUps: 2.5,
      
      // Pontuações detalhadas
      primeiraResposta: 7.8,
      transferenciaCorretor: 7.4,
      velocidadeMedia: 6.8,
      personalizacao: 7.2,
      profissionalismo: 7.0,
      qualificacaoCliente: 6.8,
      persistencia: 6.3,
      qualidadeFollowUp: 6.7,
      adaptabilidade: 6.1,
      resolucaoObjecoes: 5.9,
      
      // Valor de eficiência geral
      eficienciaGeral: 4.5,
      
      // Subcategorias de apresentação de imóveis
      quantidadeImoveis: 4.2,
      aderenciaCriterios: 8.1,
      qualidadeMaterial: 4.5
    }
  };
}; 