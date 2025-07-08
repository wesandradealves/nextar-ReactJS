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
    return;
  }

  const { filename, headers, formatters = {} } = options;

  const headerRow = Object.values(headers).join(',');

  const rows = data.map(item => {
    return Object.keys(headers)
      .map(key => {
        let value = item[key];

        if (formatters[key]) {
          value = formatters[key](value);
        } else if (value === null || value === undefined) {
          value = '';
        } else if (typeof value === 'object') {
          value = JSON.stringify(value);
        }

        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      })
      .join(',');
  });

  const csvContent = [headerRow, ...rows].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
