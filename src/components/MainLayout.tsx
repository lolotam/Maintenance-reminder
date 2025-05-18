
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Settings, BellRing, Moon, Sun, Menu, X, Info, Calendar, ClipboardCheck, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/AppContext";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    { icon: ClipboardCheck, label: "PPM", path: "/ppm" },
    { icon: Calendar, label: "OCM", path: "/ocm" },
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
      <div className="flex flex-col flex-1 w-full h-full overflow-hidden">
        {/* Header section */}
        <header className="bg-card shadow-md sticky top-0 z-40 w-full border-b border-border">
          <div className="px-6 py-4 flex items-center justify-between w-full">
            {/* Left side of header */}
            <div className="flex items-center gap-4">
              <div className="bg-primary rounded-md p-2">
                <BellRing className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-foreground hidden sm:inline">AL ORF MAINTENANCE</span>
                <span className="text-xl font-bold text-foreground sm:hidden">AMR</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">About</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="p-4 max-w-xs">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Developer Information</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p><span className="font-medium">Developer:</span> Waleed Mohamed</p>
                          <p><span className="font-medium">Contact:</span> +96555683677</p>
                          <p><span className="font-medium">Email:</span> dr.vet.waleedtam@gmail.com</p>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            {/* Right side of header */}
            <div className="flex items-center gap-2">
              {/* Dark/light mode toggle */}
              <Button 
                variant="outline" 
                size="icon" 
                onClick={toggleDarkMode}
                className="rounded-full hover:shadow-sm"
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              
              {/* Mobile menu toggle */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden hover:shadow-sm"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
            
            {/* Desktop navigation */}
            <nav className="hidden lg:flex gap-4 absolute left-1/2 transform -translate-x-1/2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="group"
                >
                  <Button
                    variant={location.pathname === item.path ? "default" : "outline"}
                    size="lg"
                    className={cn(
                      "flex items-center gap-2 transition-all duration-200 hover:shadow-md",
                      location.pathname === item.path 
                        ? "font-semibold shadow-sm" 
                        : "text-foreground hover:bg-accent hover:text-primary"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", 
                      location.pathname === item.path ? "" : "group-hover:text-primary"
                    )} />
                    <span className="text-base">{item.label}</span>
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
          
          {/* Mobile navigation menu */}
          <div 
            className={cn(
              "lg:hidden bg-card border-t overflow-hidden transition-all duration-300 ease-in-out shadow-md",
              isMobileMenuOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div className="px-4 py-3 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button
                    variant={location.pathname === item.path ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start rounded-lg",
                      location.pathname === item.path ? "bg-primary shadow-sm" : ""
                    )}
                    size="lg"
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span className="text-base">{item.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 w-full h-full overflow-auto">
          <div className="p-6 md:p-8 animate-fade-in w-full max-w-full">
            {children}
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-card border-t py-4 w-full">
          <div className="px-6 text-center text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Alorf Maintenance Reminder - Smart Machine Maintenance App
          </div>
        </footer>
      </div>
    </div>
  );
}
