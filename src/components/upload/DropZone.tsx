
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface DropZoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  type: 'PPM' | 'OCM';
}

export function DropZone({ onDrop, type }: DropZoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
        isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/50"
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-2">
        <Upload className="h-10 w-10 text-gray-400" />
        <p className="text-lg font-medium">
          Drag & drop your {type} Excel file here
        </p>
        <p className="text-sm text-gray-500">
          or click to select a file (xlsx, xls, csv)
        </p>
      </div>
    </div>
  );
}
