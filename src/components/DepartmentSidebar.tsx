
import { useLocation, useNavigate } from "react-router-dom";
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
        <div className="p-4 border-b border-[#1c3a50] flex items-center justify-center">
          <h2 className="text-lg font-semibold">Departments</h2>
        </div>

        <SidebarContent className="p-0">
          <SidebarGroup className="mt-2 p-0">
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
