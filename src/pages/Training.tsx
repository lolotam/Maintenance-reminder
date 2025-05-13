
import { useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { EmployeeTrainingTable } from "@/components/EmployeeTrainingTable";

const Training = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Employee Training</h1>
          <p className="text-muted-foreground">
            Manage employee training records and machine proficiencies.
          </p>
        </div>
        
        <EmployeeTrainingTable />
      </div>
    </MainLayout>
  );
};

export default Training;
