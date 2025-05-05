
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { useParams, Link } from "react-router-dom";
import { MachineCard } from "@/components/MachineCard";
import { useAppContext } from "@/contexts/AppContext";
import { Calendar, Settings, Wrench } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BaseMachine } from "@/types/machines";

const DepartmentPage = () => {
  const { departmentId } = useParams<{ departmentId: string }>();
  const { machines, filteredMachines } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Format the department name for display
  const displayName = departmentId 
    ? departmentId.toUpperCase().replace(/-/g, ' ')
    : "";
  
  // Filter machines by current department
  const departmentMachines = filteredMachines(searchTerm, { department: displayName });
  
  // Count PPM and OCM machines for this department
  // Use optional chaining to safely access the type property
  const ppmCount = departmentMachines.filter(m => m.type === "PPM" || (m as any).frequency === 'Quarterly').length;
  const ocmCount = departmentMachines.filter(m => m.type === "OCM" || (m as any).frequency === 'Yearly').length;

  const handleMarkComplete = (id: string) => {
    // This is a placeholder function to satisfy the onMarkComplete prop requirement
    console.log(`Marking machine ${id} as complete`);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{displayName} Department</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track machine maintenance for {displayName}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Link to={`/departments/${departmentId}/ppm`}>
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                PPM Machines
              </Button>
            </Link>
            <Link to={`/departments/${departmentId}/ocm`}>
              <Button variant="outline" className="gap-2">
                <Wrench className="h-4 w-4" />
                OCM Machines
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total Machines</CardTitle>
              <CardDescription>
                All machines in {displayName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{departmentMachines.length}</div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                {ppmCount} PPM + {ocmCount} OCM machines
              </p>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>PPM Machines</CardTitle>
              <CardDescription>
                Quarterly maintenance machines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{ppmCount}</div>
            </CardContent>
            <CardFooter>
              <Link to={`/departments/${departmentId}/ppm`}>
                <Button variant="link" className="p-0">View all PPM machines</Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>OCM Machines</CardTitle>
              <CardDescription>
                Operational condition machines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{ocmCount}</div>
            </CardContent>
            <CardFooter>
              <Link to={`/departments/${departmentId}/ocm`}>
                <Button variant="link" className="p-0">View all OCM machines</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Machines</h2>
          {departmentMachines.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {departmentMachines.slice(0, 6).map((machine) => (
                <MachineCard 
                  key={machine.id} 
                  machine={machine} 
                  onMarkComplete={() => handleMarkComplete(machine.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-md">
              <p className="text-muted-foreground">No machines found for this department.</p>
              <div className="mt-4">
                <Link to={`/departments/${departmentId}/ppm`}>
                  <Button>Add PPM Machine</Button>
                </Link>
                <span className="mx-2">or</span>
                <Link to={`/departments/${departmentId}/ocm`}>
                  <Button variant="outline">Add OCM Machine</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default DepartmentPage;
