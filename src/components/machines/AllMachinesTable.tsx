
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Search } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { formatDate } from "@/utils/dateUtils";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export function AllMachinesTable() {
  const { getAllMachines } = useAppContext();
  const [allMachines, setAllMachines] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMachines, setFilteredMachines] = useState<any[]>([]);
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "", direction: 'asc' });
  const [uniqueDepartments, setUniqueDepartments] = useState<string[]>([]);
  
  // Fetch all machines
  useEffect(() => {
    const machines = getAllMachines();
    setAllMachines(machines);
    
    // Extract unique departments
    const departments = Array.from(new Set(
      machines.map(machine => machine.department || machine.location || 'Unknown')
    )).filter(Boolean).sort();
    
    setUniqueDepartments(departments as string[]);
  }, [getAllMachines]);

  // Filter and sort machines
  useEffect(() => {
    let result = [...allMachines];
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(machine => 
        (machine.equipment || machine.name || '').toLowerCase().includes(term) ||
        (machine.model || '').toLowerCase().includes(term) ||
        (machine.serialNumber || machine.serial_number || '').toLowerCase().includes(term) ||
        (machine.manufacturer || '').toLowerCase().includes(term) ||
        (machine.logNo || machine.log_number || '').toLowerCase().includes(term) ||
        (machine.department || machine.location || '').toLowerCase().includes(term)
      );
    }
    
    // Apply department filter
    if (departmentFilter) {
      result = result.filter(machine => 
        (machine.department || machine.location || '').toLowerCase() === departmentFilter.toLowerCase()
      );
    }
    
    // Apply type filter
    if (typeFilter) {
      result = result.filter(machine => {
        if (typeFilter === 'PPM') {
          return machine.q1 || machine.quarters || machine.frequency === 'Quarterly';
        } else if (typeFilter === 'OCM') {
          return machine.maintenanceDate || machine.years || machine.frequency === 'Yearly';
        }
        return true;
      });
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        // Handle nested properties and different field names
        if (!aValue && sortConfig.key === 'equipment') aValue = a.name;
        if (!bValue && sortConfig.key === 'equipment') bValue = b.name;
        
        if (!aValue && sortConfig.key === 'serialNumber') aValue = a.serial_number;
        if (!bValue && sortConfig.key === 'serialNumber') bValue = b.serial_number;
        
        if (!aValue && sortConfig.key === 'logNo') aValue = a.log_number;
        if (!bValue && sortConfig.key === 'logNo') bValue = b.log_number;
        
        if (!aValue && sortConfig.key === 'department') aValue = a.location;
        if (!bValue && sortConfig.key === 'department') bValue = b.location;
        
        // For next maintenance date
        if (sortConfig.key === 'nextMaintenanceDate') {
          aValue = a.nextMaintenanceDate || (a.q1 && a.q1.date) || '';
          bValue = b.nextMaintenanceDate || (b.q1 && b.q1.date) || '';
        }
        
        // Default to empty string if undefined
        aValue = aValue || '';
        bValue = bValue || '';
        
        // Compare values
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredMachines(result);
  }, [allMachines, searchTerm, departmentFilter, typeFilter, sortConfig]);

  // Handle sort click
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };

  // Determine machine type
  const getMachineType = (machine: any): 'PPM' | 'OCM' => {
    if (machine.type) return machine.type as 'PPM' | 'OCM';
    
    if (machine.q1 || machine.quarters || machine.frequency === 'Quarterly') {
      return 'PPM';
    } else {
      return 'OCM';
    }
  };
  
  // Get department name
  const getDepartment = (machine: any): string => {
    return machine.department || machine.location || 'Unknown';
  };
  
  // Get next maintenance date
  const getNextMaintenanceDate = (machine: any): string => {
    if (machine.nextMaintenanceDate) return formatDate(machine.nextMaintenanceDate);
    if (machine.next_maintenance_date) return formatDate(machine.next_maintenance_date);
    if (machine.q1 && machine.q1.date) return formatDate(machine.q1.date);
    return 'Not scheduled';
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex-1 space-y-2">
          <Label htmlFor="search">Search machines</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by name, model, serial number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="w-40">
            <Label htmlFor="department-filter">Department</Label>
            <Select
              value={departmentFilter}
              onValueChange={setDepartmentFilter}
            >
              <SelectTrigger id="department-filter">
                <SelectValue placeholder="All departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All departments</SelectItem>
                {uniqueDepartments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-32">
            <Label htmlFor="type-filter">Type</Label>
            <Select
              value={typeFilter}
              onValueChange={setTypeFilter}
            >
              <SelectTrigger id="type-filter">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All types</SelectItem>
                <SelectItem value="PPM">PPM</SelectItem>
                <SelectItem value="OCM">OCM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('equipment')}>
                    Equipment
                    {sortConfig.key === 'equipment' && (
                      <ArrowUpDown className={`ml-1 h-4 w-4 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('model')}>
                    Model
                    {sortConfig.key === 'model' && (
                      <ArrowUpDown className={`ml-1 h-4 w-4 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('serialNumber')}>
                    Serial Number
                    {sortConfig.key === 'serialNumber' && (
                      <ArrowUpDown className={`ml-1 h-4 w-4 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('department')}>
                    Department
                    {sortConfig.key === 'department' && (
                      <ArrowUpDown className={`ml-1 h-4 w-4 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('type')}>
                    Type
                    {sortConfig.key === 'type' && (
                      <ArrowUpDown className={`ml-1 h-4 w-4 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('nextMaintenanceDate')}>
                    Next Maintenance
                    {sortConfig.key === 'nextMaintenanceDate' && (
                      <ArrowUpDown className={`ml-1 h-4 w-4 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </Button>
                </TableHead>
                <TableHead>View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMachines.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No machines found
                  </TableCell>
                </TableRow>
              ) : (
                filteredMachines.map((machine) => {
                  const machineType = getMachineType(machine);
                  const department = getDepartment(machine);
                  const departmentSlug = department.toLowerCase().replace(/\s+/g, '-');
                  
                  return (
                    <TableRow key={machine.id}>
                      <TableCell className="font-medium">
                        {machine.equipment || machine.name}
                      </TableCell>
                      <TableCell>{machine.model || '-'}</TableCell>
                      <TableCell>{machine.serialNumber || machine.serial_number || '-'}</TableCell>
                      <TableCell>{department}</TableCell>
                      <TableCell>
                        <Badge variant={machineType === 'PPM' ? 'default' : 'secondary'}>
                          {machineType}
                        </Badge>
                      </TableCell>
                      <TableCell>{getNextMaintenanceDate(machine)}</TableCell>
                      <TableCell>
                        <Link 
                          to={`/departments/${departmentSlug}/${machineType.toLowerCase()}`} 
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground">
        Showing {filteredMachines.length} of {allMachines.length} machines
      </div>
    </div>
  );
}
