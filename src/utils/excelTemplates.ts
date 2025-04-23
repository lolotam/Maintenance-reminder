
import * as XLSX from 'xlsx';

export const PPM_HEADERS = [
  'Equipment_Name',
  'Model',
  'Serial_Number',
  'Manufacturer',
  'Log_Number',
  'Q1_Date',
  'Q1_Engineer',
  'Q2_Date',
  'Q2_Engineer',
  'Q3_Date',
  'Q3_Engineer',
  'Q4_Date',
  'Q4_Engineer'
];

export const OCM_HEADERS = [
  'Equipment_Name',
  'Model',
  'Serial_Number',
  'Manufacturer',
  'Log_Number',
  '2025_Maintenance_Date',
  '2025_Engineer',
  '2026_Maintenance_Date'
];

export const generateTemplate = (headers: string[]) => {
  const ws = XLSX.utils.aoa_to_sheet([headers]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template');
  return wb;
};

export const downloadTemplate = (type: 'PPM' | 'OCM') => {
  const headers = type === 'PPM' ? PPM_HEADERS : OCM_HEADERS;
  const wb = generateTemplate(headers);
  XLSX.writeFile(wb, `${type}_Template.xlsx`);
};
