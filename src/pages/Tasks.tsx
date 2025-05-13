
import { useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { TasksList } from "@/components/tasks/TasksList";

const Tasks = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight mb-2">
            Maintenance Tasks
          </h1>
          <p className="text-muted-foreground">
            View and manage upcoming maintenance tasks
          </p>
        </div>
        
        <TasksList />
      </div>
    </MainLayout>
  );
};

export default Tasks;
