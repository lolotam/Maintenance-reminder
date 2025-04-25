
import { addMonths, addYears, isValid, parseISO } from "date-fns";

export const parseExcelDate = (value: any): string => {
  if (!value) return '';
  
  try {
    if (typeof value === 'number') {
      const excelEpoch = new Date(1900, 0, 1);
      const date = new Date(excelEpoch);
      date.setDate(excelEpoch.getDate() + value - 1);
      return date.toISOString();
    }
    
    if (typeof value === 'string') {
      const isoDate = new Date(value);
      if (isValid(isoDate)) {
        return isoDate.toISOString();
      }
      
      const parts = value.split(/[-\/]/);
      if (parts.length === 3) {
        const month = parseInt(parts[0]) - 1;
        const day = parseInt(parts[1]);
        const year = parseInt(parts[2]);
        const date = new Date(year, month, day);
        if (isValid(date)) {
          return date.toISOString();
        }
      }
    }
    
    console.warn("Could not parse date value:", value);
    return '';
  } catch (error) {
    console.error("Error parsing date:", error, value);
    return '';
  }
};

export const calculateNextDate = (lastDate: string, frequency: string) => {
  try {
    if (!lastDate) return '';
    
    const date = parseISO(lastDate);
    if (!isValid(date)) {
      throw new Error("Invalid date");
    }
    
    if (frequency.toLowerCase() === "quarterly") {
      return addMonths(date, 3).toISOString();
    } else if (frequency.toLowerCase() === "yearly") {
      return addYears(date, 1).toISOString();
    } else {
      throw new Error(`Unknown frequency: ${frequency}`);
    }
  } catch (error) {
    console.error("Error calculating next date:", error);
    return '';
  }
};
