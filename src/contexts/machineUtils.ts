
import { Machine } from "@/types";
import { addMonths, addYears } from "date-fns";

// Calculate next maintenance date based on last date and frequency
export const calculateNextDate = (lastDate: string, frequency: "Quarterly" | "Yearly"): string => {
  try {
    const date = new Date(lastDate);
    if (isNaN(date.getTime())) {
      console.error("Invalid date in calculateNextDate:", lastDate);
      return "";
    }
    
    if (frequency === "Quarterly") {
      return addMonths(date, 3).toISOString();
    } else {
      return addYears(date, 1).toISOString();
    }
  } catch (error) {
    console.error("Error in calculateNextDate:", error);
    return "";
  }
};

// Filter machines based on search term and filters
export const filterMachines = (
  machines: Machine[],
  searchTerm: string,
  filters: any
): Machine[] => {
  return machines.filter((machine) => {
    // Search term filtering (case insensitive)
    const matchesSearch = !searchTerm ||
      machine.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Frequency filtering
    const matchesFrequency = !filters.frequency || 
      machine.frequency === filters.frequency;
      
    // Status filtering (overdue, upcoming, all)
    let matchesStatus = true;
    if (filters.status) {
      const today = new Date();
      const nextDate = new Date(machine.nextMaintenanceDate || "");
      
      if (filters.status === "overdue") {
        matchesStatus = nextDate < today;
      } else if (filters.status === "upcoming") {
        matchesStatus = nextDate > today;
      }
    }
    
    // Department filtering
    let matchesDepartment = true;
    if (filters.department) {
      matchesDepartment = machine.department?.toLowerCase() === filters.department.toLowerCase();
    }
    
    return matchesSearch && matchesFrequency && matchesStatus && matchesDepartment;
  });
};

// Get PPM machines that have maintenance scheduled in the specified quarter
export const getPPMMachinesByQuarter = (quarter: 'q1' | 'q2' | 'q3' | 'q4') => {
  try {
    const storedData = localStorage.getItem("ppmMachines");
    if (!storedData) return [];
    
    const machines = JSON.parse(storedData);
    return machines.filter((machine: any) => 
      machine[quarter] && machine[quarter].date
    );
  } catch (error) {
    console.error(`Error getting PPM machines for quarter ${quarter}:`, error);
    return [];
  }
};

// Get OCM machines that have maintenance scheduled in the specified year
export const getOCMMachinesByYear = (year: string) => {
  try {
    const storedData = localStorage.getItem("ocmMachines");
    if (!storedData) return [];
    
    const machines = JSON.parse(storedData);
    const yearField = `maintenance${year}`;
    
    return machines.filter((machine: any) => 
      machine[yearField] && machine[yearField].date
    );
  } catch (error) {
    console.error(`Error getting OCM machines for year ${year}:`, error);
    return [];
  }
};
