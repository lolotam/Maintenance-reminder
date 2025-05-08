
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { useParams, Link } from "react-router-dom";
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
  // We need to check frequency or other indicators since 'type' property doesn't exist directly
  const ppmCount = departmentMachines.filter(m => 
    (m as any).frequency === 'Quarterly' || 
    (m as any).quarters ||
    (m as any).q1
  ).length;
  
  const ocmCount = departmentMachines.filter(m => 
    (m as any).frequency === 'Yearly' || 
    (m as any).maintenanceDate ||
    (m as any).engineer
  ).length;

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
          
          <Link to={`/departments/${departmentId}/ppm`} className="block">
            <Card className="h-full hover:border-primary hover:shadow-md transition-all">
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
                <Button variant="link" className="p-0">View all PPM machines</Button>
              </CardFooter>
            </Card>
          </Link>
          
          <Link to={`/departments/${departmentId}/ocm`} className="block">
            <Card className="h-full hover:border-primary hover:shadow-md transition-all">
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
                <Button variant="link" className="p-0">View all OCM machines</Button>
              </CardFooter>
            </Card>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default DepartmentPage;
