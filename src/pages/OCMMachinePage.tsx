
import { useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { OCMMachinesTable } from "@/components/OCMMachinesTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { TemplateDownloader } from "@/components/machines/TemplateDownloader";
import { MachineImport } from "@/components/machines/MachineImport";

const OCMMachinePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">OCM Machines</h1>
          <p className="text-muted-foreground">
            View and manage all on-call maintenance machines
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 justify-between">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search machines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => setSearchTerm("")}
            >
              Clear
            </Button>
            
            <TemplateDownloader type="OCM" />
            
            <MachineImport 
              type="OCM" 
              onImportSuccess={() => window.location.reload()} 
            />
          </div>
        </div>

        <OCMMachinesTable 
          searchTerm={searchTerm}
          selectedMachines={selectedMachines}
          setSelectedMachines={setSelectedMachines}
        />
      </div>
    </MainLayout>
  );
};

export default OCMMachinePage;
