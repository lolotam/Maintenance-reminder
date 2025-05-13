
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

  const getMachinesByDepartment = (type: "PPM" | "OCM") => {
    try {
      const key = type === "OCM" ? "ocmMachines" : "ppmMachines";
      const storedData = localStorage.getItem(key);
      if (!storedData) return {};
      
      const machines = JSON.parse(storedData);
      if (!Array.isArray(machines)) return {};
      
      // Group by department
      const departmentCounts: Record<string, number> = {};
      
      machines.forEach((machine: any) => {
        const department = machine.department || 'Unassigned';
        if (!departmentCounts[department]) {
          departmentCounts[department] = 0;
        }
        departmentCounts[department]++;
      });
      
      return departmentCounts;
    } catch (error) {
      console.error("Error getting machines by department:", error);
      return {};
    }
  };

  const getUpcomingMaintenance = (days: number = 30) => {
    try {
      const ppmData = localStorage.getItem("ppmMachines");
      const ocmData = localStorage.getItem("ocmMachines");
      
      const ppmMachines = ppmData ? JSON.parse(ppmData) : [];
      const ocmMachines = ocmData ? JSON.parse(ocmData) : [];
      
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + days);
      
      const upcoming: any[] = [];
      
      // Check PPM machines
      if (Array.isArray(ppmMachines)) {
        ppmMachines.forEach((machine: any) => {
          const quarters = ['q1', 'q2', 'q3', 'q4'];
          quarters.forEach(q => {
            if (machine[q] && machine[q].date) {
              const maintenanceDate = new Date(machine[q].date);
              if (maintenanceDate >= today && maintenanceDate <= futureDate) {
                upcoming.push({
                  id: machine.id,
                  name: machine.equipment || 'Unknown Equipment',
                  date: machine[q].date,
                  quarter: q.toUpperCase(),
                  type: 'PPM',
                  department: machine.department || 'Unknown'
                });
              }
            }
          });
        });
      }
      
      // Check OCM machines
      if (Array.isArray(ocmMachines)) {
        ocmMachines.forEach((machine: any) => {
          const years = ['maintenance2025', 'maintenance2026'];
          years.forEach(y => {
            if (machine[y] && machine[y].date) {
              const maintenanceDate = new Date(machine[y].date);
              if (maintenanceDate >= today && maintenanceDate <= futureDate) {
                upcoming.push({
                  id: machine.id,
                  name: machine.equipment || 'Unknown Equipment',
                  date: machine[y].date,
                  year: y.replace('maintenance', ''),
                  type: 'OCM',
                  department: machine.department || 'Unknown'
                });
              }
            }
          });
        });
      }
      
      // Sort by date
      return upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } catch (error) {
      console.error("Error getting upcoming maintenance:", error);
      return [];
    }
  };

  return {
    countMachinesByType,
    getMachinesByDepartment,
    getUpcomingMaintenance
  };
};
