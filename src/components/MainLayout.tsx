import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Settings, BellRing, Wrench, Moon, Sun, Menu, X, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/AppContext";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

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
    { icon: BellRing, label: "Notifications", path: "/notifications" },
    { icon: Wrench, label: "LDR Machines", path: "/ldr-machines" },
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
    <div className="flex flex-col min-h-screen bg-background transition-colors duration-300">
      <header className="bg-card shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-primary rounded-md p-1">
              <BellRing className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xl font-bold text-foreground">Alorf Maintenance Reminder</span>
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
          
          <nav className="hidden lg:flex gap-6 absolute left-1/2 transform -translate-x-1/2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 transition-colors px-3 py-2 rounded-md",
                  location.pathname === item.path
                    ? "text-primary bg-accent font-medium"
                    : "text-foreground/70 hover:text-primary hover:bg-accent/50"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
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
          <div className="container mx-auto px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 p-3 rounded-md transition-colors",
                  location.pathname === item.path
                    ? "bg-accent text-primary font-medium"
                    : "text-foreground/70 hover:bg-accent/50 hover:text-primary"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8 animate-fade-in">
        {children}
      </main>
      
      <footer className="bg-card border-t py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} Alorf Maintenance Reminder - Smart Machine Maintenance App
        </div>
      </footer>
    </div>
  );
}
