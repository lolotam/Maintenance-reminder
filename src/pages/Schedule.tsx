
import { MainLayout } from "@/components/MainLayout";
import { TasksList } from "@/components/tasks/TasksList";

const Schedule = () => {
  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight mb-2">
            Maintenance Schedule
          </h1>
          <p className="text-muted-foreground">
            View and manage upcoming maintenance tasks by date
          </p>
        </div>
        
        <TasksList />
      </div>
    </MainLayout>
  );
};

export default Schedule;
