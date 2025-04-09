import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

// Função para exportar o relatório como PDF
export const exportToPDF = async (element, filename = 'relatorio.pdf') => {
  try {
    // Configurações do PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    // Adicionar título
    pdf.setFontSize(20);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Relatório de Análise de Atendimento Imobiliário', 105, 15, { align: 'center' });
    
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: '#111827', // Match background color
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const ratio = canvas.width / canvas.height;
    const imgWidth = pdfWidth - 20;
    const imgHeight = imgWidth / ratio;
    
    // Adicionar página
    pdf.addImage(
      imgData,
      'PNG',
      10, // x
      25, // y
      imgWidth, // width
      imgHeight // height
    );
    
    // Se o conteúdo for maior que uma página, adicione páginas adicionais
    if (imgHeight > pdfHeight - 40) {
      const numPages = Math.ceil(imgHeight / (pdfHeight - 40));
      for (let i = 1; i < numPages; i++) {
        pdf.addPage();
        pdf.addImage(
          imgData,
          'PNG',
          10, // x
          -(pdfHeight - 40) * i + 25, // y
          imgWidth, // width
          imgHeight // height
        );
      }
    }
    
    // Salvar o PDF
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    return false;
  }
};

// Função para exportar todos os relatórios como um único PDF
export const exportAllToPDF = async (imobiliarias, getElementForId, filename = 'todos_relatorios.pdf') => {
  try {
    // Configurações do PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    // Adicionar capa
    pdf.setFontSize(24);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Relatórios de Análise', 105, 80, { align: 'center' });
    pdf.text('de Atendimento Imobiliário', 105, 90, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.text('Gerado em: ' + new Date().toLocaleDateString('pt-BR'), 105, 110, { align: 'center' });
    
    // Para cada imobiliária
    for (let i = 0; i < imobiliarias.length; i++) {
      const imobiliaria = imobiliarias[i];
      
      // Adicionar nova página para cada relatório
      if (i > 0) pdf.addPage();
      
      // Adicionar título da imobiliária
      pdf.setFontSize(16);
      pdf.text(`Relatório: ${imobiliaria.nome}`, 105, 20, { align: 'center' });
      
      // Adicionar tabela de pontuação
      pdf.setFontSize(12);
      pdf.text(`Pontuação Total: ${imobiliaria.pontuacaoTotal}/100`, 105, 30, { align: 'center' });
      
      // Obter canvas do elemento
      const element = getElementForId(imobiliaria.id);
      if (!element) continue;
      
      const canvas = await html2canvas(element, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#111827',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const ratio = canvas.width / canvas.height;
      const imgWidth = pdfWidth - 20;
      const imgHeight = imgWidth / ratio;
      
      // Adicionar imagem
      pdf.addImage(
        imgData,
        'PNG',
        10, // x
        40, // y
        imgWidth, // width
        imgHeight // height
      );
    }
    
    // Salvar o PDF
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Erro ao exportar todos os relatórios:', error);
    return false;
  }
};

export default {
  exportToPDF,
  exportAllToPDF,
}; 