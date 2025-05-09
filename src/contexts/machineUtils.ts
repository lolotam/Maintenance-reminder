export const filterMachines = (machines: any[], searchTerm: string, filters: any = {}) => {
  return machines.filter((machine) => {
    // Search term filter
    const nameMatch = machine.equipment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      machine.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const modelMatch = machine.model?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const serialMatch = machine.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       machine.serial_number?.toLowerCase().includes(searchTerm.toLowerCase());
                       
    const manufacturerMatch = machine.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const logNoMatch = machine.logNo?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                       machine.log_number?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    
    const departmentMatch = (machine.department || machine.location)?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const searchTermMatch = !searchTerm || 
      nameMatch || modelMatch || serialMatch || manufacturerMatch || logNoMatch || departmentMatch;
    
    // Frequency filter
    let frequencyMatch = true;
    if (filters.frequency) {
      if (filters.frequency === 'quarterly') {
        frequencyMatch = machine.frequency === 'Quarterly' || machine.q1 || machine.quarters;
      } else if (filters.frequency === 'yearly') {
        frequencyMatch = machine.frequency === 'Yearly' || machine.maintenanceDate || machine.years;
      }
    }
    
    // Status filter
    let statusMatch = true;
    if (filters.status) {
      const today = new Date();
      const nextDate = machine.nextMaintenanceDate || machine.next_maintenance_date;
      
      if (nextDate) {
        const nextDateObj = new Date(nextDate);
        const diffDays = Math.ceil((nextDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (filters.status === 'overdue') {
          statusMatch = diffDays < 0;
        } else if (filters.status === 'upcoming') {
          statusMatch = diffDays >= 0 && diffDays <= 7;
        } else if (filters.status === 'ok') {
          statusMatch = diffDays > 7;
        }
      } else {
        // If no next maintenance date, it's neither overdue nor upcoming
        statusMatch = filters.status === 'ok';
      }
    }
    
    // Department filter
    let departmentFilterMatch = true;
    if (filters.department) {
      const machineDepartment = (machine.department || machine.location || '').toLowerCase();
      departmentFilterMatch = machineDepartment === filters.department.toLowerCase();
    }
    
    // Type filter
    let typeFilterMatch = true;
    if (filters.type) {
      if (filters.type === 'PPM') {
        typeFilterMatch = machine.type === 'PPM' || 
                         machine.frequency === 'Quarterly' ||
                         machine.q1 || 
                         machine.quarters;
      } else if (filters.type === 'OCM') {
        typeFilterMatch = machine.type === 'OCM' || 
                         machine.frequency === 'Yearly' ||
                         machine.maintenanceDate || 
                         machine.years;
      }
    }
    
    return searchTermMatch && frequencyMatch && statusMatch && departmentFilterMatch && typeFilterMatch;
  });
};
