
import { useState, useEffect } from "react";
import { Machine } from "@/types";
import { Settings, defaultSettings } from "./types";

// LocalStorage keys
const MACHINES_STORAGE_KEY = "maintenance-machines";
const SETTINGS_STORAGE_KEY = "maintenance-settings";
export const PPM_MACHINES_KEY = "ppmMachines";
export const OCM_MACHINES_KEY = "ocmMachines";

export const useLocalStorage = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [initialized, setInitialized] = useState(false);

  // Load data from localStorage on initial load
  useEffect(() => {
    try {
      const storedMachines = localStorage.getItem(MACHINES_STORAGE_KEY);
      if (storedMachines) {
        setMachines(JSON.parse(storedMachines));
      }

      const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        setSettings(prevSettings => ({
          ...defaultSettings,
          ...JSON.parse(storedSettings)
        }));
      }
      setInitialized(true);
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      setInitialized(true);
    }
  }, []);

  // Save machines to localStorage whenever they change
  useEffect(() => {
    if (initialized) {
      localStorage.setItem(MACHINES_STORAGE_KEY, JSON.stringify(machines));
    }
  }, [machines, initialized]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (initialized) {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    }
  }, [settings, initialized]);

  return {
    machines,
    setMachines,
    settings,
    setSettings,
    initialized
  };
};
