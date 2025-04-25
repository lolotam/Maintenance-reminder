
export const useMachineStats = () => {
  const countMachinesByType = (type: "PPM" | "OCM") => {
    try {
      let storedMachines = [];
      const key = type === "OCM" ? "ocmMachines" : "ppmMachines";
      
      const storedData = localStorage.getItem(key);
      if (storedData) {
        storedMachines = JSON.parse(storedData);
      }
      
      return Array.isArray(storedMachines) ? storedMachines.length : 0;
    } catch (error) {
      console.error("Error counting machines:", error);
      return 0;
    }
  };

  return {
    countMachinesByType,
  };
};
