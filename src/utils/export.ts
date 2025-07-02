"use client";

/**
 * Utilitário para exportação de dados para CSV
 * Converte dados de qualquer entidade para um arquivo CSV e inicia o download
 */

/**
 * Interface para configurações de exportação
 */
export interface ExportCSVOptions {
  filename: string;
  headers: Record<string, string>; // Mapeamento de chave para cabeçalho legível
  formatters?: Record<string, (value: unknown) => string>; // Formatadores para campos específicos
}

/**
 * Converte array de objetos para CSV e inicia o download
 * 
 * @param data Array de objetos a serem exportados
 * @param options Configurações de exportação
 */
export function exportToCSV<T extends Record<string, unknown>>(data: T[], options: ExportCSVOptions): void {
  if (!data || !data.length) {
    console.warn('Nenhum dado para exportar');
    return;
  }

  // Extrair cabeçalhos e formatadores
  const { filename, headers, formatters = {} } = options;

  // Criar linha de cabeçalho
  const headerRow = Object.values(headers).join(',');

  // Criar linhas de dados
  const rows = data.map(item => {
    return Object.keys(headers)
      .map(key => {
        // Obter valor, aplicando formatador se existir
        let value = item[key];

        // Aplicar formatador específico se disponível
        if (formatters[key]) {
          value = formatters[key](value);
        } else if (value === null || value === undefined) {
          value = '';
        } else if (typeof value === 'object') {
          // Para objetos aninhados, converter para JSON string
          value = JSON.stringify(value);
        }

        // Escapar vírgulas e aspas
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      })
      .join(',');
  });

  // Combinar todas as linhas
  const csvContent = [headerRow, ...rows].join('\n');

  // Criar Blob e link de download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  // Configurar e simular clique no link
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
