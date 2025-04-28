
import * as XLSX from "xlsx";

export const cleanHeaderName = (header: string): string => {
  return header
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '');
};

export const validateHeaders = (worksheetHeaders: string[], expectedHeaders: string[]) => {
  const cleanedHeaders = worksheetHeaders.map(cleanHeaderName);
  
  console.log("DEBUG - Cleaned Headers:", cleanedHeaders);
  console.log("DEBUG - Expected Headers:", expectedHeaders);
  
  const missingColumns = expectedHeaders.filter(expected => 
    !cleanedHeaders.some(header => header === expected)
  );
  
  if (missingColumns.length) {
    const errorMessage = `Invalid headers in your Excel file.\n\nMissing or incorrect columns:\n${missingColumns.join(", ")}\n\nRequired headers:\n${expectedHeaders.join(", ")}`;
    throw new Error(errorMessage);
  }
  
  return {
    cleanedHeaders,
    headerIndexMap: cleanedHeaders.reduce((map, header, index) => {
      if (expectedHeaders.includes(header)) {
        map[header] = index;
      }
      return map;
    }, {} as Record<string, number>)
  };
};
