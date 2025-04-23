import { useState, useEffect } from "react";
import { MainLayout } from "@/components/MainLayout";
import { useAppContext } from "@/contexts/AppContext";
import { Machine } from "@/types";
import { differenceInDays, format, parseISO } from "date-fns";
import { Bell, Calendar, Check, X, Mail, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const Notifications = () => {
  const { getAllMachines } = useAppContext();
  const [allMachines, setAllMachines] = useState<Machine[]>([]);
  const [sentNotifications, setSentNotifications] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Get all machines including LDR machines
    setAllMachines(getAllMachines());
  }, [getAllMachines]);

  // Calculate upcoming and overdue maintenance based on reminder days
  const getMachinesNeedingNotifications = () => {
    const today = new Date();
    const upcoming: Machine[] = [];
    const overdue: Machine[] = [];
    
    allMachines.forEach(machine => {
      if (!machine.nextMaintenanceDate) return;
      
      const nextDate = parseISO(machine.nextMaintenanceDate);
      const daysRemaining = differenceInDays(nextDate, today);
      
      if (daysRemaining < 0) {
        overdue.push(machine);
      } else if (
        machine.notificationSettings?.reminderDays?.includes(daysRemaining) ||
        daysRemaining <= 7
      ) {
        upcoming.push(machine);
      }
    });
    
    return { upcoming, overdue };
  };

  const { upcoming, overdue } = getMachinesNeedingNotifications();

  // Simulate sending a notification
  const sendNotification = (machine: Machine, type: 'email' | 'desktop') => {
    // In a real app, this would call an API to send the notification
    const key = `${machine.id}-${type}`;
    
    // Show toast for simulation
    toast.success(`${type === 'email' ? 'Email' : 'Desktop'} Notification Sent for "${machine.name}"`);
    
    // Mark as sent
    setSentNotifications(prev => ({
      ...prev,
      [key]: true
    }));
  };

  const isNotificationSent = (machineId: string, type: 'email' | 'desktop') => {
    return sentNotifications[`${machineId}-${type}`] || false;
  };

  const NotificationCard = ({ machine, isOverdue = false }: { machine: Machine, isOverdue?: boolean }) => {
    const nextDate = parseISO(machine.nextMaintenanceDate || '');
    const daysString = isOverdue 
      ? `Overdue by ${Math.abs(differenceInDays(nextDate, new Date()))} days`
      : `Due in ${differenceInDays(nextDate, new Date())} days`;
      
    return (
      <Card className={isOverdue ? "border-red-200 bg-red-50" : ""}>
        <CardHeader className="pb-2">
          <div className="flex justify-between">
            <CardTitle>{machine.name}</CardTitle>
            <Badge variant={isOverdue ? "destructive" : "outline"}>
              {isOverdue ? "Overdue" : "Upcoming"}
            </Badge>
          </div>
          <CardDescription>
            {daysString} - {format(nextDate, "MMMM d, yyyy")}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            <span>Frequency: {machine.frequency}</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 mr-2"
            onClick={() => sendNotification(machine, 'email')}
            disabled={isNotificationSent(machine.id, 'email')}
          >
            {isNotificationSent(machine.id, 'email') ? (
              <>
                <Check className="mr-2 h-4 w-4" /> Email Sent
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" /> Send Email
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => sendNotification(machine, 'desktop')}
            disabled={isNotificationSent(machine.id, 'desktop')}
          >
            {isNotificationSent(machine.id, 'desktop') ? (
              <>
                <Check className="mr-2 h-4 w-4" /> Notified
              </>
            ) : (
              <>
                <Bell className="mr-2 h-4 w-4" /> Notify
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-2">
            Send and manage maintenance reminders
          </p>
        </div>
        
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending" className="relative">
              Pending
              {(upcoming.length + overdue.length > 0) && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  {upcoming.length + overdue.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
            <TabsTrigger value="all">All Machines</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="space-y-6">
            {/* Overdue section */}
            {overdue.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center text-red-700">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  <h2 className="text-lg font-medium">Overdue Maintenance</h2>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {overdue.map((machine) => (
                    <NotificationCard 
                      key={machine.id} 
                      machine={machine} 
                      isOverdue={true} 
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Upcoming section */}
            {upcoming.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  <h2 className="text-lg font-medium">Upcoming Maintenance</h2>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {upcoming.map((machine) => (
                    <NotificationCard key={machine.id} machine={machine} />
                  ))}
                </div>
              </div>
            )}
            
            {/* Empty state */}
            {overdue.length === 0 && upcoming.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-500 mb-4">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium">All caught up!</h3>
                <p className="text-muted-foreground mt-1">
                  No pending maintenance notifications at this time
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="sent">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">Notification History</h3>
              <p className="text-muted-foreground mt-1">
                Your sent notification history will appear here
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="all">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">All Machines</h3>
              <p className="text-muted-foreground mt-1">
                Complete notification status for all machines
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="border rounded-lg p-4 bg-muted/30">
          <h3 className="font-medium mb-2">About Notifications</h3>
          <p className="text-sm text-muted-foreground">
            This page lets you manually send maintenance reminders. For automatic notifications,
            configure your preferences in Settings.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Notifications;
