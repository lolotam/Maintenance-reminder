
import { useState } from "react";
import { Settings, defaultSettings } from "@/contexts/types";

export const useSettings = (initialSettings: Settings = defaultSettings) => {
  const [settings, setSettings] = useState<Settings>(initialSettings);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prevSettings) => ({ ...prevSettings, ...newSettings }));
  };

  return {
    settings,
    setSettings,
    updateSettings,
  };
};
