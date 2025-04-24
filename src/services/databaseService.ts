
import { Machine } from "@/types";

// Use environment-aware API URL with better fallback mechanism
const API_URL = (() => {
  // Check if we're in development mode (Vite sets this)
  if (import.meta.env.DEV) {
    return "http://localhost:3001/api";
  }
  
  // In production, use relative path
  return "/api";
})();

// Add logging to help with debugging
console.log("API URL configured as:", API_URL);

export const databaseService = {
  // PPM Machines
  async getPPMMachines(): Promise<Machine[]> {
    try {
      console.log("Fetching PPM machines from:", `${API_URL}/machines/ppm`);
      const response = await fetch(`${API_URL}/machines/ppm`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP error ${response.status}: ${errorData.error || response.statusText}`);
      }
      
      const machines = await response.json();
      console.log(`Retrieved ${machines.length} PPM machines`);
      return machines;
    } catch (error) {
      console.error("Error fetching PPM machines:", error);
      throw error;
    }
  },

  async addPPMMachine(machine: any): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/machines/ppm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(machine),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP error ${response.status}: ${errorData.error || response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error adding PPM machine:", error);
      throw error;
    }
  },

  async bulkAddPPMMachines(machines: any[]): Promise<any> {
    try {
      console.log("Sending bulk PPM machines to server:", machines.length);
      console.log("Using API URL:", `${API_URL}/machines/ppm/bulk`);
      
      const response = await fetch(`${API_URL}/machines/ppm/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(machines),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP error ${response.status}: ${errorData.error || response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error adding PPM machines in bulk:", error);
      throw error;
    }
  },

  async deletePPMMachine(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/machines/ppm/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP error ${response.status}: ${errorData.error || response.statusText}`);
      }
      
      const result = await response.json();
      return result.deleted;
    } catch (error) {
      console.error("Error deleting PPM machine:", error);
      throw error;
    }
  },

  // OCM Machines
  async getOCMMachines(): Promise<Machine[]> {
    try {
      const response = await fetch(`${API_URL}/machines/ocm`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP error ${response.status}: ${errorData.error || response.statusText}`);
      }
      
      const machines = await response.json();
      return machines;
    } catch (error) {
      console.error("Error fetching OCM machines:", error);
      throw error;
    }
  },

  async addOCMMachine(machine: any): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/machines/ocm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(machine),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP error ${response.status}: ${errorData.error || response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error adding OCM machine:", error);
      throw error;
    }
  },

  async bulkAddOCMMachines(machines: any[]): Promise<any> {
    try {
      console.log("Sending bulk OCM machines to server:", machines.length);
      console.log("Using API URL:", `${API_URL}/machines/ocm/bulk`);
      
      const response = await fetch(`${API_URL}/machines/ocm/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(machines),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP error ${response.status}: ${errorData.error || response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error adding OCM machines in bulk:", error);
      throw error;
    }
  },

  async deleteOCMMachine(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/machines/ocm/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP error ${response.status}: ${errorData.error || response.statusText}`);
      }
      
      const result = await response.json();
      return result.deleted;
    } catch (error) {
      console.error("Error deleting OCM machine:", error);
      throw error;
    }
  },
};
