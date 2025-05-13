
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
  '2026_Maintenance_Date',
  '2026_Engineer'
];

export const generateTemplate = (headers: string[]) => {
  const ws = XLSX.utils.aoa_to_sheet([headers]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template');
  
  // Add column widths for better readability
  const colWidths = headers.map(() => ({ wch: 20 }));
  ws['!cols'] = colWidths;
  
  return wb;
};

export const downloadTemplate = (type: 'PPM' | 'OCM') => {
  try {
    const headers = type === 'PPM' ? PPM_HEADERS : OCM_HEADERS;
    const wb = generateTemplate(headers);
    XLSX.writeFile(wb, `${type}_Maintenance_Template.xlsx`);
    return true;
  } catch (error) {
    console.error(`Error downloading ${type} template:`, error);
    return false;
  }
};

// Generate sample data for templates
export const generateSampleData = (type: 'PPM' | 'OCM', count: number = 2) => {
  const headers = type === 'PPM' ? PPM_HEADERS : OCM_HEADERS;
  const data: string[][] = [headers];
  
  const currentYear = new Date().getFullYear();
  
  for (let i = 0; i < count; i++) {
    if (type === 'PPM') {
      data.push([
        `Sample Equipment ${i+1}`,
        `Model-${100+i}`,
        `SN-${1000+i}`,
        `Manufacturer ${i+1}`,
        `LOG-${2000+i}`,
        `${currentYear}-03-15`,
        'John Smith',
        `${currentYear}-06-15`,
        'Emma Davis',
        `${currentYear}-09-15`,
        'Michael Brown',
        `${currentYear}-12-15`,
        'Sarah Wilson'
      ]);
    } else { // OCM
      data.push([
        `Sample Equipment ${i+1}`,
        `Model-${100+i}`,
        `SN-${1000+i}`,
        `Manufacturer ${i+1}`,
        `LOG-${2000+i}`,
        `${currentYear+1}-06-15`,
        'John Smith',
        `${currentYear+2}-06-15`,
        'Emma Davis'
      ]);
    }
  }
  
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sample Data');
  
  // Add column widths for better readability
  const colWidths = headers.map(() => ({ wch: 20 }));
  ws['!cols'] = colWidths;
  
  XLSX.writeFile(wb, `${type}_Sample_Data.xlsx`);
};

// Download both blank template and sample data
export const downloadTemplateWithSample = (type: 'PPM' | 'OCM') => {
  try {
    // First download the blank template
    downloadTemplate(type);
    
    // Then download a template with sample data
    generateSampleData(type);
    
    return true;
  } catch (error) {
    console.error(`Error downloading ${type} templates:`, error);
    return false;
  }
};
