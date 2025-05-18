
import { useState } from 'react';
import { toast } from 'sonner';
import { EmployeeTraining, TrainingFilters } from '@/types/training';
import { v4 as uuidv4 } from 'uuid';

const mockTrainingData: EmployeeTraining[] = [
  {
    id: '1',
    name: 'Waleed',
    employeeId: '7678',
    department: 'LDR',
    trainer: 'Marline',
    machines: [
      { name: 'sonar', trained: true },
      { name: 'fmx', trained: true },
      { name: 'max', trained: false },
      { name: 'box20', trained: true },
      { name: 'hex', trained: false }
    ]
  },
  {
    id: '2',
    name: 'Ahmed',
    employeeId: '1234',
    department: 'ICU',
    trainer: 'Sarah',
    machines: [
      { name: 'sonar', trained: false },
      { name: 'fmx', trained: true },
      { name: 'max', trained: true },
      { name: 'box20', trained: false },
      { name: 'hex', trained: true }
    ]
  },
  {
    id: '3',
    name: 'Fatima',
    employeeId: '5678',
    department: 'Emergency',
    trainer: 'John',
    machines: [
      { name: 'sonar', trained: true },
      { name: 'fmx', trained: false },
      { name: 'max', trained: true },
      { name: 'box20', trained: true },
      { name: 'hex', trained: true }
    ]
  }
];

export function useEmployeeTraining() {
  const [employees, setEmployees] = useState<EmployeeTraining[]>(() => {
    const stored = localStorage.getItem("employeeTraining");
    return stored ? JSON.parse(stored) : mockTrainingData;
  });
  
  const [editingEmployee, setEditingEmployee] = useState<EmployeeTraining | null>(null);
  const [filters, setFilters] = useState<TrainingFilters>({
    name: "",
    employeeId: "",
    department: "",
    trainer: ""
  });

  const saveToLocalStorage = (updatedEmployees: EmployeeTraining[]) => {
    localStorage.setItem("employeeTraining", JSON.stringify(updatedEmployees));
  };

  const handleDelete = (employee: EmployeeTraining) => {
    if (window.confirm(`Are you sure you want to delete ${employee.name}?`)) {
      const newEmployees = employees.filter(e => e.id !== employee.id);
      setEmployees(newEmployees);
      saveToLocalStorage(newEmployees);
      toast.success(`${employee.name} has been deleted`);
    }
  };
  
  const bulkDelete = (employeeIds: string[]) => {
    if (window.confirm(`Are you sure you want to delete ${employeeIds.length} employees?`)) {
      const newEmployees = employees.filter(e => !employeeIds.includes(e.id));
      setEmployees(newEmployees);
      saveToLocalStorage(newEmployees);
      toast.success(`${employeeIds.length} employees have been deleted`);
    }
  };
  
  const addEmployee = (employee: Omit<EmployeeTraining, 'id'>) => {
    const newEmployee = {
      ...employee,
      id: `${Date.now()}`
    };
    
    const updatedEmployees = [...employees, newEmployee];
    setEmployees(updatedEmployees);
    saveToLocalStorage(updatedEmployees);
    toast.success(`${employee.name} has been added`);
    return true;
  };
  
  const updateEmployee = (updatedEmployee: EmployeeTraining) => {
    const updatedEmployees = employees.map(e =>
      e.id === updatedEmployee.id ? updatedEmployee : e
    );
    setEmployees(updatedEmployees);
    saveToLocalStorage(updatedEmployees);
    toast.success(`${updatedEmployee.name} has been updated`);
    return true;
  };

  const importEmployees = (newEmployees: EmployeeTraining[]) => {
    if (!newEmployees || newEmployees.length === 0) {
      toast.error("No valid employees to import");
      return false;
    }

    try {
      // Assign ID to any employees without an ID
      const employeesWithIds = newEmployees.map(emp => ({
        ...emp,
        id: emp.id || uuidv4()
      }));
      
      // Merge with existing employees, replacing duplicates by name and employee ID
      const mergedEmployees = [...employees];
      
      employeesWithIds.forEach(newEmp => {
        const existingIndex = mergedEmployees.findIndex(
          e => e.name === newEmp.name && e.employeeId === newEmp.employeeId
        );
        
        if (existingIndex >= 0) {
          mergedEmployees[existingIndex] = newEmp;
        } else {
          mergedEmployees.push(newEmp);
        }
      });
      
      setEmployees(mergedEmployees);
      saveToLocalStorage(mergedEmployees);
      return true;
    } catch (error) {
      console.error("Error importing employees:", error);
      toast.error("Failed to import employee data");
      return false;
    }
  };
  
  // Safe string lowercase comparison helper
  const safeIncludes = (value: string | null | undefined, term: string) => {
    return value && typeof value === 'string' 
      ? value.toLowerCase().includes(term.toLowerCase()) 
      : false;
  };
  
  const getFilteredEmployees = (searchTerm: string) => {
    return employees.filter((employee) => {
      const nameMatch = safeIncludes(employee.name, searchTerm);
      const idMatch = safeIncludes(employee.employeeId, searchTerm);
      const departmentMatch = safeIncludes(employee.department, searchTerm);
      const trainerMatch = safeIncludes(employee.trainer, searchTerm);
      
      const matchesSearch = nameMatch || idMatch || departmentMatch || trainerMatch;

      const matchesNameFilter = !filters.name || 
        safeIncludes(employee.name, filters.name);
      const matchesIdFilter = !filters.employeeId || 
        safeIncludes(employee.employeeId, filters.employeeId);
      const matchesDepartmentFilter = !filters.department || 
        safeIncludes(employee.department, filters.department);
      const matchesTrainerFilter = !filters.trainer || 
        safeIncludes(employee.trainer, filters.trainer);

      const matchesFilters = matchesNameFilter && matchesIdFilter && 
        matchesDepartmentFilter && matchesTrainerFilter;

      return matchesSearch && matchesFilters;
    });
  };

  const availableMachines = ['sonar', 'fmx', 'max', 'box20', 'hex'];
  
  return {
    employees,
    filters,
    setFilters,
    editingEmployee,
    setEditingEmployee,
    filteredEmployees: (searchTerm: string) => getFilteredEmployees(searchTerm),
    handleDelete,
    bulkDelete,
    addEmployee,
    updateEmployee,
    importEmployees,
    availableMachines
  };
}
