
import { useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PPMMachinesTable } from "@/components/PPMMachinesTable";
import { OCMMachinesTable } from "@/components/OCMMachinesTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const LdrMachines = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">LDR Machines</h1>
          <p className="text-muted-foreground mt-2">
            Maintenance schedule for PPM and OCM machines
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search machines by name, model, or manufacturer..."
            className="pl-9 w-full sm:max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tabs for PPM and OCM machines */}
        <Tabs defaultValue="ppm" className="w-full">
          <TabsList className="grid w-full sm:w-[400px] grid-cols-2">
            <TabsTrigger value="ppm">PPM Machines</TabsTrigger>
            <TabsTrigger value="ocm">OCM Machines</TabsTrigger>
          </TabsList>
          <TabsContent value="ppm">
            <Card>
              <CardHeader>
                <CardTitle>PPM Machines (Quarterly Maintenance)</CardTitle>
              </CardHeader>
              <CardContent>
                <PPMMachinesTable searchTerm={searchTerm} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="ocm">
            <Card>
              <CardHeader>
                <CardTitle>OCM Machines (Yearly Maintenance)</CardTitle>
              </CardHeader>
              <CardContent>
                <OCMMachinesTable searchTerm={searchTerm} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default LdrMachines;
