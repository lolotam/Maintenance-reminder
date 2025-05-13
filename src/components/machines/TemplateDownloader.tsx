
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { downloadTemplate, downloadTemplateWithSample } from "@/utils/excelTemplates";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TemplateDownloaderProps {
  type: 'PPM' | 'OCM';
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
  
  const handleDownloadBlank = () => {
    setIsLoading(true);
    try {
      const success = downloadTemplate(type);
      if (success) {
        toast.success(`Blank ${type} template downloaded successfully`);
      } else {
        toast.error(`Failed to download ${type} template`);
      }
    } catch (error) {
      console.error(`Error downloading ${type} template:`, error);
      toast.error(`Failed to download ${type} template`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownloadWithSamples = () => {
    setIsLoading(true);
    try {
      const success = downloadTemplateWithSample(type);
      if (success) {
        toast.success(`${type} templates downloaded successfully`);
      } else {
        toast.error(`Failed to download ${type} templates`);
      }
    } catch (error) {
      console.error(`Error downloading ${type} templates:`, error);
      toast.error(`Failed to download ${type} templates`);
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
          {buttonText || `Download ${type} Template`}
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
