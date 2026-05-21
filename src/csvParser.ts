import Papa from 'papaparse';
import { getSheetCsvUrl } from './sheetsConfig';

export interface SheetData {
  headers: string[];
  rows: string[][];
  rawData: string[][];
}

export async function fetchSheetData(gid: string): Promise<SheetData> {
  const url = getSheetCsvUrl(gid);
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch sheet data: ${response.statusText}`);
  }
  
  const csvText = await response.text();
  
  const result = Papa.parse<string[]>(csvText, {
    header: false,
    skipEmptyLines: false,
  });
  
  const rawData = result.data;
  
  if (rawData.length === 0) {
    return { headers: [], rows: [], rawData: [] };
  }
  
  // First row as headers
  const headers = rawData[0].map((h: string) => h.trim());
  const rows = rawData.slice(1);
  
  return { headers, rows, rawData };
}

export function formatCurrency(value: string): string {
  const num = parseFloat(value.replace(/,/g, ''));
  if (isNaN(num)) return value;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(num);
}

export function isNumeric(value: string): boolean {
  return !isNaN(parseFloat(value.replace(/,/g, ''))) && value.trim() !== '';
}

export function isUrl(value: string): boolean {
  return value.startsWith('http://') || value.startsWith('https://');
}
