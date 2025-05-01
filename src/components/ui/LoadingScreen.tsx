
import React from 'react';
import { Spinner } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        <Spinner className="h-10 w-10 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
};
