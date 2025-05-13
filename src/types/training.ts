
export interface TrainingMachine {
  name: string;
  trained: boolean;
}

export interface EmployeeTraining {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  trainer: string;
  machines: TrainingMachine[];
}

export interface TrainingFilters {
  name: string;
  employeeId: string;
  department: string;
  trainer: string;
}
