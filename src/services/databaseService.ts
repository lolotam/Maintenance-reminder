
import { Machine } from "@/types";

// Use environment-aware API URL
const API_URL = import.meta.env.DEV 
  ? "http://localhost:3001/api"  // Development
  : "/api";                     // Production

export const databaseService = {
  // PPM Machines
  async getPPMMachines(): Promise<Machine[]> {
    try {
      const response = await fetch(`${API_URL}/machines/ppm`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP error ${response.status}: ${errorData.error || response.statusText}`);
      }
      
      const machines = await response.json();
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
