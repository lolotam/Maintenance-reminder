
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
    
    return matchesSearch && matchesFrequency && matchesStatus;
  });
};
