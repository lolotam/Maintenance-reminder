
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { 
  Home, 
  LinkIcon, 
  Layout, 
  Calendar, 
  HelpCircle, 
  Settings, 
  Mail
} from "lucide-react";

// List of all departments
const departments = [
  "LDR",
  "IM",
  "ENT",
  "OPTHA",
  "DERMA",
  "ENDOSCOPY",
  "NURSERY",
  "OB-GYN",
  "X-RAY",
  "OR",
  "LABORATORY",
  "ER",
  "PT",
  "IVF",
  "GENERAL SURGERY",
  "DENTAL",
  "CSSD",
  "5 A",
  "5 B",
  "6 A",
  "6 B",
  "LAUNDRY",
  "4A",
  "4 B",
  "PEDIA",
  "PLASTIC",
];

// Icons for navigation menu items
const navItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: LinkIcon, label: "Shortcuts", path: "/shortcuts" },
  { icon: Layout, label: "Overview", path: "/overview" },
  { icon: Calendar, label: "Events", path: "/events" },
  { icon: HelpCircle, label: "About", path: "/about" },
  { icon: Settings, label: "Services", path: "/services" },
  { icon: Mail, label: "Contact", path: "/contact" },
];

export function DepartmentSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Convert department names to URL-friendly format
  const getDepartmentUrl = (dept: string) => {
    return `/departments/${dept.toLowerCase().replace(/\s+/g, "-")}`;
  };

  // Check if current route is for a specific department
  const isDepartmentActive = (dept: string) => {
    const deptUrl = getDepartmentUrl(dept);
    return location.pathname.startsWith(deptUrl);
  };

  const handleDepartmentClick = (dept: string) => {
    navigate(getDepartmentUrl(dept));
  };

  return (
    <Sidebar>
      <div className="bg-[#0c2840] h-full text-white">
        <div className="p-4 border-b border-[#1c3a50] flex items-center justify-between">
          <h2 className="text-lg font-semibold">My App</h2>
          <button className="text-white/70 hover:text-white">
            ✕
          </button>
        </div>

        <SidebarContent className="p-0">
          <div className="flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 hover:bg-[#143755] transition-colors",
                  location.pathname === item.path ? "bg-[#143755]" : ""
                )}
              >
                <item.icon className="h-5 w-5 text-white/70" />
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </div>
          
          <SidebarGroup className="mt-4 p-0">
            <SidebarGroupLabel className="px-4 py-2 text-white/50 uppercase text-xs tracking-wider">
              Departments
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {departments.map((dept) => (
                  <SidebarMenuItem key={dept}>
                    <SidebarMenuButton 
                      isActive={isDepartmentActive(dept)}
                      onClick={() => handleDepartmentClick(dept)}
                      className={cn(
                        "transition-colors hover:bg-[#143755] text-white/90 hover:text-white",
                        isDepartmentActive(dept) ? "bg-[#143755] text-white" : ""
                      )}
                    >
                      <span>{dept}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </div>
    </Sidebar>
  );
}
