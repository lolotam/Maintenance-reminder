
import { useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { OCMMachinesTable } from "@/components/OCMMachinesTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileUp } from "lucide-react";
import { TemplateDownloader } from "@/components/machines/TemplateDownloader";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FileUploader } from "@/components/FileUploader";
import { toast } from "sonner";

const OCMMachinePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);
  const [importSheetOpen, setImportSheetOpen] = useState(false);

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
            
            <Sheet open={importSheetOpen} onOpenChange={setImportSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <FileUp className="h-4 w-4" />
                  Import Data
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[600px]">
                <SheetHeader className="mb-5">
                  <SheetTitle>Import OCM Machines Data</SheetTitle>
                </SheetHeader>
                <div className="space-y-6">
                  <TemplateDownloader type="OCM" fullWidth buttonText="Download Template" />
                  <FileUploader 
                    onDataReady={(machines) => {
                      toast.success(`${machines.length} machines imported successfully!`);
                      window.location.reload();
                    }} 
                    type="OCM"
                  />
                </div>
              </SheetContent>
            </Sheet>
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
