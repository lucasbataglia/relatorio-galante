import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  readExcelFile, 
  processImobiliariasData, 
  getMercadoData, 
  loadConsolidatedData 
} from '../services/ExcelDataService';

// Criando o contexto
const ImobiliariasContext = createContext();

// Criando o provedor do contexto
export const ImobiliariasProvider = ({ children }) => {
  const [imobiliarias, setImobiliarias] = useState([]);
  const [mercadoData, setMercadoData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Iniciando carregamento de dados no ImobiliariasContext...');
        
        // Carregando dados do arquivo consolidado diretamente
        const excelData = await loadConsolidatedData();
        
        // Verificar se temos dados
        if (!excelData || excelData.length === 0) {
          throw new Error('Nenhum dado encontrado no arquivo consolidado. Verifique se o arquivo existe e contém dados válidos.');
        }
        
        console.log(`Arquivo consolidado carregado com sucesso: ${excelData.length} registros`);
        setDataSource('consolidado');
        
        // Processar os dados
        let processedData = processImobiliariasData(excelData);
        console.log(`Dados processados com sucesso: ${processedData.length} imobiliárias`);
        
        // SOLUÇÃO TEMPORÁRIA: Definir manualmente as pontuações por categoria se estiverem faltando
        processedData = processedData.map(imobiliaria => {
          // Se a pontuação total está presente mas as categorias estão zeradas, definimos valores baseados na pontuação total
          // Comentando este bloco para que os valores zerados na planilha sejam respeitados
          /*
          if (imobiliaria.pontuacaoTotal > 0 && 
             (imobiliaria.tempoResposta === 0 || 
              imobiliaria.qualidadeAtendimento === 0 || 
              imobiliaria.apresentacaoImoveis === 0 || 
              imobiliaria.followUp === 0 || 
              imobiliaria.experienciaCliente === 0)) {
            
            console.log(`Ajustando pontuações de categorias para ${imobiliaria.nome}`);
            
            // Distribuir a pontuação total entre as categorias
            const total = imobiliaria.pontuacaoTotal;
            
            // Distribuição aproximada: 30% TR, 25% QA, 20% AI, 15% FU, 10% EC
            return {
              ...imobiliaria,
              tempoResposta: imobiliaria.tempoResposta || Math.round(total * 0.3),
              qualidadeAtendimento: imobiliaria.qualidadeAtendimento || Math.round(total * 0.25),
              apresentacaoImoveis: imobiliaria.apresentacaoImoveis || Math.round(total * 0.2),
              followUp: imobiliaria.followUp || Math.round(total * 0.15),
              experienciaCliente: imobiliaria.experienciaCliente || Math.round(total * 0.1)
            };
          }
          */
          return imobiliaria;
        });
        
        // Log após ajustes
        if (processedData.length > 0) {
          console.log('Primeiro registro após ajustes:', processedData[0]);
        }
        
        // Configurar dados de mercado para comparação
        const mercadoDataValues = getMercadoData();
        
        setImobiliarias(processedData);
        setMercadoData(mercadoDataValues);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError(`Erro ao carregar os dados das imobiliárias: ${err.message}. Verifique o caminho e formato dos arquivos.`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Dados e funções a serem disponibilizados pelo contexto
  const value = {
    imobiliarias,
    mercadoData,
    loading,
    error,
    dataSource,
    // Funções úteis
    getImobiliariaById: (id) => {
      if (!id) {
        console.warn('getImobiliariaById chamado sem ID');
        return null;
      }
      
      const imobiliaria = imobiliarias.find(imob => imob.id === parseInt(id));
      
      if (!imobiliaria) {
        console.warn(`Imobiliária com ID ${id} não encontrada`);
      }
      
      return imobiliaria || null;
    },
    getImobiliariaByNome: (nome) => {
      if (!nome) {
        console.warn('getImobiliariaByNome chamado sem nome');
        return null;
      }
      
      const imobiliaria = imobiliarias.find(imob => 
        imob.nome.toLowerCase() === nome.toLowerCase()
      );
      
      if (!imobiliaria) {
        console.warn(`Imobiliária com nome "${nome}" não encontrada`);
      }
      
      return imobiliaria || null;
    },
  };

  return (
    <ImobiliariasContext.Provider value={value}>
      {children}
    </ImobiliariasContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useImobiliarias = () => {
  const context = useContext(ImobiliariasContext);
  if (context === undefined) {
    throw new Error('useImobiliarias deve ser usado dentro de um ImobiliariasProvider');
  }
  return context;
};

export default ImobiliariasContext; 