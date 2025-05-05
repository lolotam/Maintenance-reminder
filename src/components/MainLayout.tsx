
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Settings, BellRing, Moon, Sun, Menu, X, Info, Calendar, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/AppContext";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { DepartmentSidebar } from "./DepartmentSidebar";
import { SidebarTrigger } from "./ui/sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const { settings, updateSettings } = useAppContext();
  const [isDarkMode, setIsDarkMode] = useState(settings.enableDarkMode || false);
  
  const navItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: ClipboardCheck, label: "Tasks", path: "/tasks" },
    { icon: Calendar, label: "Schedule", path: "/schedule" },
    { icon: BellRing, label: "Notifications", path: "/notifications" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  useEffect(() => {
    setIsDarkMode(settings.enableDarkMode);
  }, [settings.enableDarkMode]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    updateSettings({
      ...settings,
      enableDarkMode: newDarkMode
    });
  };

  return (
    <div className="flex h-screen w-full bg-background transition-colors duration-300 overflow-hidden">
      {/* Sidebar */}
      <DepartmentSidebar />
      
      <div className="flex flex-col flex-1 w-full h-full overflow-hidden">
        <header className="bg-card shadow-sm sticky top-0 z-40 w-full">
          <div className="px-4 py-3 flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              {/* Add sidebar trigger button */}
              <SidebarTrigger className="mr-2" />
              
              <div className="bg-primary rounded-md p-1">
                <BellRing className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xl font-bold text-foreground hidden sm:inline">Alorf Maintenance Reminder</span>
                <span className="text-xl font-bold text-foreground sm:hidden">AMR</span>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">About</span>
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">Developer Information</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p><span className="font-medium">Developer:</span> Waleed Mohamed</p>
                        <p><span className="font-medium">Contact:</span> +96555683677</p>
                        <p><span className="font-medium">Email:</span> dr.vet.waleedtam@gmail.com</p>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleDarkMode}
                className="rounded-full"
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
            
            <nav className="hidden lg:flex gap-3 absolute left-1/2 transform -translate-x-1/2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="group"
                >
                  <Button
                    variant={location.pathname === item.path ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "flex items-center gap-2 transition-all duration-200 hover:scale-105",
                      location.pathname === item.path 
                        ? "font-medium shadow-md" 
                        : "text-foreground/70 hover:text-primary hover:border-primary"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4", 
                      location.pathname === item.path ? "" : "group-hover:text-primary"
                    )} />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
          
          <div 
            className={cn(
              "lg:hidden bg-card border-t overflow-hidden transition-all duration-300 ease-in-out",
              isMobileMenuOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div className="px-4 py-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button
                    variant={location.pathname === item.path ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      location.pathname === item.path ? "bg-primary" : ""
                    )}
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </header>
        
        <main className="flex-1 w-full h-full overflow-auto">
          <div className="p-4 md:p-6 animate-fade-in w-full max-w-full">
            {children}
          </div>
        </main>
        
        <footer className="bg-card border-t py-4 w-full">
          <div className="px-4 text-center text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Alorf Maintenance Reminder - Smart Machine Maintenance App
          </div>
        </footer>
      </div>
    </div>
  );
}
