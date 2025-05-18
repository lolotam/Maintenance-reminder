
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useExcelTemplates } from "@/hooks/useExcelTemplates";
import { ImportType } from "@/hooks/useExcelImport";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TemplateDownloaderProps {
  type: ImportType | string;
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
  const { isGenerating, createTemplateWithSamples, createBlankTemplate } = useExcelTemplates();
  
  // Normalize type for internal processing (ensure uppercase for ImportType)
  const normalizedType = type.toUpperCase() as ImportType;
  
  // Display type in uppercase for the UI
  const displayType = normalizedType === 'PPM' ? 'PPM' : 
                      normalizedType === 'OCM' ? 'OCM' : 
                      normalizedType.charAt(0).toUpperCase() + normalizedType.slice(1).toLowerCase();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`flex items-center gap-2 ${fullWidth ? 'w-full' : ''} ${className}`}
          disabled={isGenerating}
        >
          <Download className="h-4 w-4" />
          {buttonText || `Download ${displayType} Template`}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => createBlankTemplate(normalizedType)}>
          Blank Template
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => createTemplateWithSamples(normalizedType)}>
          Template with Sample Data
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
