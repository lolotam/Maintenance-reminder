
import * as XLSX from 'xlsx';

// Define headers for templates
export const PPM_HEADERS = [
  'Equipment', 'Model', 'Serial Number', 'Manufacturer', 
  'Log No', 'Department', 'Type', 'Q1 Date', 'Q1 Engineer',
  'Q2 Date', 'Q2 Engineer', 'Q3 Date', 'Q3 Engineer',
  'Q4 Date', 'Q4 Engineer'
];

export const OCM_HEADERS = [
  'Equipment', 'Model', 'Serial Number', 'Manufacturer', 
  'Log No', 'Department', 'Type', 'Last Maintenance Date',
  'Next Maintenance Date', 'Engineer'
];

export const TRAINING_HEADERS = [
  'Name', 'Employee ID', 'Department', 'Trainer',
  'sonar', 'fmx', 'max', 'box20', 'hex'
];

// Function to create a blank template with sample structure
export const createExcelTemplate = (templateType: 'ppm' | 'ocm' | 'training') => {
  let header: string[] = [];
  let sampleData: Record<string, string>[] = [];

  if (templateType === 'ppm') {
    header = PPM_HEADERS;
    
    sampleData = [
      {
        'Equipment': 'Patient Monitor', 'Model': 'IntelliVue MX450', 'Serial Number': 'PM789012', 
        'Manufacturer': 'Philips', 'Log No': 'LG002', 'Department': 'Emergency', 
        'Type': 'PPM', 'Q1 Date': '2025-02-20', 'Q1 Engineer': 'John Smith',
        'Q2 Date': '2025-05-20', 'Q2 Engineer': 'Emma Davis',
        'Q3 Date': '2025-08-20', 'Q3 Engineer': 'Michael Brown',
        'Q4 Date': '2025-11-20', 'Q4 Engineer': 'Sarah Wilson'
      }
    ];
  }
  else if (templateType === 'ocm') {
    header = OCM_HEADERS;
    
    sampleData = [
      {
        'Equipment': 'Ultrasound', 'Model': 'Voluson E10', 'Serial Number': 'US456789', 
        'Manufacturer': 'GE Healthcare', 'Log No': 'LG003', 'Department': 'Radiology', 
        'Type': 'OCM', 'Last Maintenance Date': '2025-01-15', 
        'Next Maintenance Date': '2026-01-15', 'Engineer': 'Michael Brown'
      }
    ];
  }
  else if (templateType === 'training') {
    header = TRAINING_HEADERS;
    
    sampleData = [
      {
        'Name': 'Waleed', 'Employee ID': '7678', 'Department': 'LDR', 'Trainer': 'Marline',
        'sonar': 'Yes', 'fmx': 'Yes', 'max': 'No', 'box20': 'Yes', 'hex': 'No'
      },
      {
        'Name': 'Ahmed', 'Employee ID': '1234', 'Department': 'ICU', 'Trainer': 'Sarah',
        'sonar': 'No', 'fmx': 'Yes', 'max': 'Yes', 'box20': 'No', 'hex': 'Yes'
      }
    ];
  }

  // Create worksheet with the header
  const ws = XLSX.utils.json_to_sheet(sampleData, { header });
  
  // Create a new workbook and add the worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, templateType.toUpperCase());
  
  // Generate file name based on template type
  const fileName = `${templateType}_template.xlsx`;
  
  // Write the workbook and download
  XLSX.writeFile(wb, fileName);
  
  return true;
};

// Create a blank template (without sample data)
export const createBlankTemplate = (templateType: 'ppm' | 'ocm' | 'training') => {
  let header: string[] = [];

  if (templateType === 'ppm') {
    header = PPM_HEADERS;
  }
  else if (templateType === 'ocm') {
    header = OCM_HEADERS;
  }
  else if (templateType === 'training') {
    header = TRAINING_HEADERS;
  }

  // Create a new worksheet
  const ws = XLSX.utils.aoa_to_sheet([header]);
  
  // Create a new workbook and add the worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, templateType.toUpperCase());
  
  // Generate file name based on template type
  const fileName = `${templateType}_template_blank.xlsx`;
  
  // Write the workbook and download
  XLSX.writeFile(wb, fileName);
  
  return true;
};
