
import { useState, useEffect } from "react";
import { Settings, defaultSettings } from "@/contexts/types";

export const useSettings = (initialSettings: Settings = defaultSettings) => {
  const [settings, setSettings] = useState<Settings>(initialSettings);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prevSettings) => {
      const updatedSettings = { ...prevSettings, ...newSettings };
      return updatedSettings;
    });
  };

  // Apply dark mode on initial load
  useEffect(() => {
    if (settings.enableDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return {
    settings,
    setSettings,
    updateSettings,
  };
};
