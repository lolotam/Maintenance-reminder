
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
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Hospital } from "lucide-react";

// List of all departments (removed "Sheet1")
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
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-bold">Departments</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {departments.map((dept) => (
                <SidebarMenuItem key={dept}>
                  <SidebarMenuButton 
                    isActive={isDepartmentActive(dept)}
                    tooltip={dept}
                    onClick={() => handleDepartmentClick(dept)}
                    className={cn(
                      "transition-all duration-200 hover:bg-primary/10 hover:scale-105",
                      isDepartmentActive(dept) ? "bg-primary/20 font-semibold" : ""
                    )}
                  >
                    <Hospital className={cn("h-4 w-4", isDepartmentActive(dept) ? "text-primary" : "")} />
                    <span>{dept}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
