
import { Search, Filter, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card } from "@/components/ui/card";

interface FiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filters: { frequency: string; status: string };
  setFilters: React.Dispatch<React.SetStateAction<{ frequency: string; status: string }>>;
  isMobile: boolean;
  isFiltersOpen: boolean;
  setIsFiltersOpen: (value: boolean) => void;
}

export const DashboardFilters = ({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  isMobile,
  isFiltersOpen,
  setIsFiltersOpen,
}: FiltersProps) => {
  const resetFilters = () => {
    setSearchTerm("");
    setFilters({ frequency: "", status: "" });
  };

  return (
    <Card className="p-4 shadow-sm border border-border">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search machines..."
            className="pl-10 h-11 rounded-lg border-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {isMobile ? (
          <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full flex justify-between items-center h-11 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </div>
                <Badge variant={filters.frequency || filters.status ? "default" : "outline"} className="ml-2">
                  {(filters.frequency ? 1 : 0) + (filters.status ? 1 : 0)}
                </Badge>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 space-y-4">
              <Select
                value={filters.frequency}
                onValueChange={(value) =>
                  setFilters({ ...filters, frequency: value })
                }
              >
                <SelectTrigger className="h-11 rounded-lg border-input">
                  <SelectValue placeholder="Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Frequencies</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                  <SelectItem value="Yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters({ ...filters, status: value })
                }
              >
                <SelectTrigger className="h-11 rounded-lg border-input">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                className="w-full h-11 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                onClick={resetFilters}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Filters
              </Button>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <div className="flex flex-wrap gap-4">
            <Select
              value={filters.frequency}
              onValueChange={(value) =>
                setFilters({ ...filters, frequency: value })
              }
            >
              <SelectTrigger className="w-[180px] h-11 rounded-lg border-input">
                <SelectValue placeholder="Frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Frequencies</SelectItem>
                <SelectItem value="Quarterly">Quarterly</SelectItem>
                <SelectItem value="Yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters({ ...filters, status: value })
              }
            >
              <SelectTrigger className="w-[180px] h-11 rounded-lg border-input">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              onClick={resetFilters}
              className="h-11 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
