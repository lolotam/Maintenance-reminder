
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ClipboardCheck, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/contexts/AppContext";
import { differenceInDays, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function TasksList() {
  const { getAllMachines } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  
  const allMachines = getAllMachines();
  
  // Create tasks from machines
  const tasks = allMachines.map(machine => {
    const daysRemaining = machine.nextMaintenanceDate ? 
      differenceInDays(parseISO(machine.nextMaintenanceDate), new Date()) : null;
    
    let status = "upcoming";
    if (daysRemaining !== null) {
      if (daysRemaining < 0) {
        status = "overdue";
      } else if (daysRemaining <= 7) {
        status = "soon";
      }
    }
    
    return {
      id: machine.id,
      name: machine.name,
      type: machine.frequency === "Quarterly" ? "PPM" : "OCM",
      status,
      daysRemaining,
      date: machine.nextMaintenanceDate,
      engineer: "Not assigned",
      department: machine.department || "Not specified",
    };
  });
  
  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    // Filter by search term
    if (searchTerm && !task.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !task.department.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by status
    if (filter !== "all" && task.status !== filter) {
      return false;
    }
    
    return true;
  });
  
  // Sort tasks by urgency (overdue first, then soon, then upcoming)
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const statusOrder = { overdue: 0, soon: 1, upcoming: 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      case "soon":
        return <Badge variant="outline" className="bg-amber-100 text-amber-700 hover:bg-amber-200">Within 7 days</Badge>;
      default:
        return <Badge variant="outline">Upcoming</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks by name or department..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
            <TabsTrigger value="soon">Soon</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Card key={i} className="shadow-md">
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : sortedTasks.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedTasks.map(task => (
            <Card key={task.id} className="shadow-md hover:shadow-lg transition-shadow border border-border">
              <CardHeader className="pb-3">
                <div className="flex justify-between">
                  <CardTitle className="text-xl font-bold">{task.name}</CardTitle>
                  {getStatusBadge(task.status)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {task.type} - {task.department}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {task.date ? new Date(task.date).toLocaleDateString() : "No date set"}
                      {task.daysRemaining !== null && (
                        task.daysRemaining < 0 
                          ? <span className="text-destructive"> ({Math.abs(task.daysRemaining)} days overdue)</span>
                          : <span> ({task.daysRemaining} days remaining)</span>
                      )}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <ClipboardCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Engineer: {task.engineer}</span>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button size="sm" variant="outline" className="mr-2">
                      Details
                    </Button>
                    <Button size="sm">
                      Mark Complete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/20 rounded-lg border border-border">
          <ClipboardCheck className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No tasks found</h3>
          <p className="text-muted-foreground mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
}
