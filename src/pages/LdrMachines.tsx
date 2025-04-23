
import { useState, useRef } from "react";
import { MainLayout } from "@/components/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PPMMachinesTable } from "@/components/PPMMachinesTable";
import { OCMMachinesTable } from "@/components/OCMMachinesTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { AddMachineDialog } from "@/components/AddMachineDialog";

const LdrMachines = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">LDR Machines</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Maintenance schedule for PPM and OCM machines
          </p>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search machines..."
              className="pl-9 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <AddMachineDialog type="ppm" />
            <AddMachineDialog type="ocm" />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>PPM Machines (Quarterly Maintenance)</CardTitle>
            </CardHeader>
            <CardContent>
              <PPMMachinesTable searchTerm={searchTerm} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>OCM Machines (Yearly Maintenance)</CardTitle>
            </CardHeader>
            <CardContent>
              <OCMMachinesTable searchTerm={searchTerm} />
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default LdrMachines;
