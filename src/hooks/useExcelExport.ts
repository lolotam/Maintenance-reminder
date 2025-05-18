
import { useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Machine } from "@/types";
import { EmployeeTraining } from "@/types/training";

export type ExportableData = Machine[] | EmployeeTraining[] | Record<string, any>[];

/**
 * Hook for handling Excel export functionality
 */
export const useExcelExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  /**
   * Exports data to Excel file
   */
  const exportToExcel = (data: ExportableData, filename: string) => {
    setIsExporting(true);
    
    try {
      if (!data || data.length === 0) {
        toast.error("No data to export");
        return;
      }
      
      // Prepare the worksheet
      const ws = XLSX.utils.json_to_sheet(data);
      
      // Create a workbook and add the worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Data");
      
      // Generate file name with current date
      const exportFileName = `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // Write the workbook and trigger download
      XLSX.writeFile(wb, exportFileName);
      
      toast.success(`Data exported successfully to ${exportFileName}`);
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };
  
  /**
   * Formats PPM machines data for export
   */
  const formatPPMDataForExport = (machines: Machine[]) => {
    return machines.map(machine => ({
      Equipment: machine.equipment || '',
      Department: machine.department || '',
      Model: machine.model || '',
      SerialNumber: machine.serialNumber || '',
      Q1Date: machine.q1?.date || 'Not scheduled',
      Q1Engineer: machine.q1?.engineer || '',
      Q2Date: machine.q2?.date || 'Not scheduled',
      Q2Engineer: machine.q2?.engineer || '',
      Q3Date: machine.q3?.date || 'Not scheduled',
      Q3Engineer: machine.q3?.engineer || '',
      Q4Date: machine.q4?.date || 'Not scheduled',
      Q4Engineer: machine.q4?.engineer || '',
      Status: machine.q1?.date ? 'Maintained' : 'Pending'
    }));
  };
  
  /**
   * Formats OCM machines data for export
   */
  const formatOCMDataForExport = (machines: Machine[]) => {
    return machines.map(machine => ({
      Equipment: machine.equipment || machine.name || '',
      Department: machine.department || machine.location || '',
      Model: machine.model || '',
      SerialNumber: machine.serialNumber || machine.serial_number || '',
      LastMaintenance: machine.maintenanceDate || machine.last_maintenance_date || 'Not Done',
      NextDueDate: machine.nextMaintenanceDate || machine.next_maintenance_date || 'Not Scheduled',
      Status: (machine.maintenanceDate || machine.last_maintenance_date) ? 'Maintained' : 'Pending'
    }));
  };
  
  /**
   * Formats training data for export
   */
  const formatTrainingDataForExport = (employees: EmployeeTraining[]) => {
    return employees.map(employee => {
      const baseData = {
        Name: employee.name,
        'Employee ID': employee.employeeId,
        Department: employee.department,
        Trainer: employee.trainer
      };
      
      // Add machine training status
      const machineData: {[key: string]: string} = {};
      employee.machines.forEach(machine => {
        machineData[machine.name] = machine.trained ? 'Yes' : 'No';
      });
      
      return { ...baseData, ...machineData };
    });
  };

  return {
    isExporting,
    exportToExcel,
    formatPPMDataForExport,
    formatOCMDataForExport,
    formatTrainingDataForExport
  };
};
