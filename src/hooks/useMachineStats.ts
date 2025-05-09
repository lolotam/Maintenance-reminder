
export const useMachineStats = (machines: any[] = []) => {
  const countMachinesByType = (machineType: "PPM" | "OCM"): number => {
    return machines.filter(machine => {
      // If machine has explicit type, use it
      if (machine.type) {
        return machine.type === machineType;
      }

      // Identify PPM machines by quarterly maintenance fields
      if (machineType === "PPM") {
        return machine.frequency === 'Quarterly' || 
               machine.quarters !== undefined || 
               (machine.q1 !== undefined) ||
               (machine.maintenance_interval && machine.maintenance_interval === 'quarterly');
      }
      
      // Identify OCM machines by yearly maintenance fields
      if (machineType === "OCM") {
        return machine.frequency === 'Yearly' || 
               (machine.maintenanceDate !== undefined) || 
               machine.years !== undefined ||
               (machine.maintenance_interval && machine.maintenance_interval === 'yearly');
      }

      return false;
    }).length;
  };

  return {
    countMachinesByType,
  };
};
