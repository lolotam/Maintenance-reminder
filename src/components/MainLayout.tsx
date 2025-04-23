
import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Upload, Settings, BellRing } from "lucide-react";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Upload, label: "Upload Data", path: "/upload" },
    { icon: BellRing, label: "Notifications", path: "/notifications" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-md p-1">
              <BellRing className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">MaintenanceReminder</span>
          </div>
          
          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md lg:hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          
          {/* Desktop navigation */}
          <nav className="hidden lg:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Mobile navigation */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden bg-white border-t">
            <div className="container mx-auto px-4 py-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="flex items-center gap-2 p-3 rounded-md text-gray-600 hover:bg-gray-50 hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>
      
      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} MaintenanceReminder - Smart Machine Maintenance App
        </div>
      </footer>
    </div>
  );
}
