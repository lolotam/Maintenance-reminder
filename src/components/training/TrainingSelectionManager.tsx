
import { useState } from "react";
import { EmployeeTraining } from "@/types/training";

interface UseTrainingSelectionReturn {
  selectedEmployees: string[];
  toggleEmployeeSelection: (employeeId: string) => void;
  handleSelectAll: (employees: EmployeeTraining[]) => void;
  clearSelection: () => void;
  isSelected: (employeeId: string) => boolean;
}

export const useTrainingSelection = (): UseTrainingSelectionReturn => {
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  const toggleEmployeeSelection = (employeeId: string) => {
    setSelectedEmployees(
      selectedEmployees.includes(employeeId)
        ? selectedEmployees.filter(id => id !== employeeId)
        : [...selectedEmployees, employeeId]
    );
  };

  const handleSelectAll = (employees: EmployeeTraining[]) => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employees.map(e => e.id));
    }
  };

  const clearSelection = () => {
    setSelectedEmployees([]);
  };

  const isSelected = (employeeId: string) => {
    return selectedEmployees.includes(employeeId);
  };

  return {
    selectedEmployees,
    toggleEmployeeSelection,
    handleSelectAll,
    clearSelection,
    isSelected
  };
};
