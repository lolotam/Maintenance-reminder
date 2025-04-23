
import { MainLayout } from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Wrench, Settings } from "lucide-react";

const LdrMachines = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">LDR Machines</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Maintenance Management Dashboard
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/ldr-machines/ppm" className="block">
            <Button
              variant="outline"
              size="lg"
              className="w-full h-32 text-lg flex flex-col gap-2"
            >
              <Wrench className="h-8 w-8" />
              <span>PPM Machines</span>
              <span className="text-sm text-muted-foreground">Quarterly Maintenance</span>
            </Button>
          </Link>

          <Link to="/ldr-machines/ocm" className="block">
            <Button
              variant="outline"
              size="lg"
              className="w-full h-32 text-lg flex flex-col gap-2"
            >
              <Settings className="h-8 w-8" />
              <span>OCM Machines</span>
              <span className="text-sm text-muted-foreground">Yearly Maintenance</span>
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default LdrMachines;
