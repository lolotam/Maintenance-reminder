
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { createExcelTemplate, createBlankTemplate } from "@/utils/excelTemplates";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TemplateDownloaderProps {
  type: 'PPM' | 'OCM' | 'training' | 'ppm' | 'ocm';
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  fullWidth?: boolean;
  className?: string;
  buttonText?: string;
}

export function TemplateDownloader({
  type,
  variant = 'outline',
  size = 'sm',
  fullWidth = false,
  className = '',
  buttonText
}: TemplateDownloaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Normalize type to lowercase for internal processing
  const normalizedType = type.toLowerCase() as 'ppm' | 'ocm' | 'training';
  
  // Display type in uppercase for the UI
  const displayType = type === 'ppm' ? 'PPM' : 
                      type === 'ocm' ? 'OCM' : 
                      type.charAt(0).toUpperCase() + type.slice(1);
  
  const handleDownloadBlank = () => {
    setIsLoading(true);
    try {
      createBlankTemplate(normalizedType);
      toast.success(`Blank ${displayType} template downloaded successfully`);
    } catch (error) {
      console.error(`Error downloading ${displayType} template:`, error);
      toast.error(`Failed to download ${displayType} template`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownloadWithSamples = () => {
    setIsLoading(true);
    try {
      createExcelTemplate(normalizedType);
      toast.success(`${displayType} template with samples downloaded successfully`);
    } catch (error) {
      console.error(`Error downloading ${displayType} template with samples:`, error);
      toast.error(`Failed to download ${displayType} template with samples`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`flex items-center gap-2 ${fullWidth ? 'w-full' : ''} ${className}`}
          disabled={isLoading}
        >
          <Download className="h-4 w-4" />
          {buttonText || `Download ${displayType} Template`}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleDownloadBlank}>
          Blank Template
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownloadWithSamples}>
          Template with Sample Data
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
