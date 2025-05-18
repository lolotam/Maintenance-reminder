
import { useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { ImportType } from "./useExcelImport";

// Define headers for templates
const PPM_HEADERS = [
  'Equipment', 'Model', 'Serial Number', 'Manufacturer', 
  'Log No', 'Department', 'Type', 'Q1 Date', 'Q1 Engineer',
  'Q2 Date', 'Q2 Engineer', 'Q3 Date', 'Q3 Engineer',
  'Q4 Date', 'Q4 Engineer'
];

const OCM_HEADERS = [
  'Equipment', 'Model', 'Serial Number', 'Manufacturer', 
  'Log No', 'Department', 'Type', 'Last Maintenance Date',
  'Next Maintenance Date', 'Engineer'
];

const TRAINING_HEADERS = [
  'Name', 'Employee ID', 'Department', 'Trainer',
  'sonar', 'fmx', 'max', 'box20', 'hex'
];

// Sample data for templates
const PPM_SAMPLE_DATA = [
  {
    'Equipment': 'Patient Monitor', 'Model': 'IntelliVue MX450', 'Serial Number': 'PM789012', 
    'Manufacturer': 'Philips', 'Log No': 'LG002', 'Department': 'Emergency', 
    'Type': 'PPM', 'Q1 Date': '2025-02-20', 'Q1 Engineer': 'John Smith',
    'Q2 Date': '2025-05-20', 'Q2 Engineer': 'Emma Davis',
    'Q3 Date': '2025-08-20', 'Q3 Engineer': 'Michael Brown',
    'Q4 Date': '2025-11-20', 'Q4 Engineer': 'Sarah Wilson'
  }
];

const OCM_SAMPLE_DATA = [
  {
    'Equipment': 'Ultrasound', 'Model': 'Voluson E10', 'Serial Number': 'US456789', 
    'Manufacturer': 'GE Healthcare', 'Log No': 'LG003', 'Department': 'Radiology', 
    'Type': 'OCM', 'Last Maintenance Date': '2025-01-15', 
    'Next Maintenance Date': '2026-01-15', 'Engineer': 'Michael Brown'
  }
];

const TRAINING_SAMPLE_DATA = [
  {
    'Name': 'Waleed', 'Employee ID': '7678', 'Department': 'LDR', 'Trainer': 'Marline',
    'sonar': 'Yes', 'fmx': 'Yes', 'max': 'No', 'box20': 'Yes', 'hex': 'No'
  },
  {
    'Name': 'Ahmed', 'Employee ID': '1234', 'Department': 'ICU', 'Trainer': 'Sarah',
    'sonar': 'No', 'fmx': 'Yes', 'max': 'Yes', 'box20': 'No', 'hex': 'Yes'
  }
];

/**
 * Hook for handling Excel template management
 */
export const useExcelTemplates = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  /**
   * Creates and downloads an Excel template with sample data
   */
  const createTemplateWithSamples = (type: ImportType) => {
    setIsGenerating(true);
    try {
      const normalizedType = type.toLowerCase() as 'ppm' | 'ocm' | 'training';
      let headers: string[] = [];
      let sampleData: Record<string, any>[] = [];

      // Set headers and sample data based on template type
      if (normalizedType === 'ppm') {
        headers = PPM_HEADERS;
        sampleData = PPM_SAMPLE_DATA;
      } 
      else if (normalizedType === 'ocm') {
        headers = OCM_HEADERS;
        sampleData = OCM_SAMPLE_DATA;
      } 
      else if (normalizedType === 'training') {
        headers = TRAINING_HEADERS;
        sampleData = TRAINING_SAMPLE_DATA;
      }

      // Create worksheet with sample data
      const ws = XLSX.utils.json_to_sheet(sampleData, { header: headers });
      
      // Create a new workbook and add the worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, type.toUpperCase());
      
      // Generate file name based on template type
      const fileName = `${normalizedType}_template.xlsx`;
      
      // Write the workbook and download
      XLSX.writeFile(wb, fileName);
      
      toast.success(`${type} template with samples downloaded successfully`);
    } catch (error) {
      console.error(`Error downloading ${type} template:`, error);
      toast.error(`Failed to download ${type} template`);
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Creates and downloads a blank Excel template
   */
  const createBlankTemplate = (type: ImportType) => {
    setIsGenerating(true);
    try {
      const normalizedType = type.toLowerCase() as 'ppm' | 'ocm' | 'training';
      let headers: string[] = [];

      // Set headers based on template type
      if (normalizedType === 'ppm') {
        headers = PPM_HEADERS;
      }
      else if (normalizedType === 'ocm') {
        headers = OCM_HEADERS;
      }
      else if (normalizedType === 'training') {
        headers = TRAINING_HEADERS;
      }

      // Create a new worksheet with only headers
      const ws = XLSX.utils.aoa_to_sheet([headers]);
      
      // Create a new workbook and add the worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, type.toUpperCase());
      
      // Generate file name based on template type
      const fileName = `${normalizedType}_template_blank.xlsx`;
      
      // Write the workbook and download
      XLSX.writeFile(wb, fileName);
      
      toast.success(`Blank ${type} template downloaded successfully`);
    } catch (error) {
      console.error(`Error downloading blank ${type} template:`, error);
      toast.error(`Failed to download blank ${type} template`);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    createTemplateWithSamples,
    createBlankTemplate
  };
};
