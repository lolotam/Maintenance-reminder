
export type UserRole = 'admin' | 'data_entry';

export interface UserPermissions {
  viewRecords: boolean;
  addRecords: boolean;
  editRecords: boolean;
  deleteRecords: boolean;
  manageUsers: boolean;
  viewSettings: boolean;
  uploadPPM: boolean;
  uploadOCM: boolean;
  uploadEmployeeTraining: boolean;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  permissions: UserPermissions;
}

export const DEFAULT_PERMISSIONS: Record<UserRole, UserPermissions> = {
  admin: {
    viewRecords: true,
    addRecords: true,
    editRecords: true,
    deleteRecords: true,
    manageUsers: true,
    viewSettings: true,
    uploadPPM: true,
    uploadOCM: true,
    uploadEmployeeTraining: true,
  },
  data_entry: {
    viewRecords: true,
    addRecords: true,
    editRecords: false,
    deleteRecords: false,
    manageUsers: false,
    viewSettings: false,
    uploadPPM: true,
    uploadOCM: true,
    uploadEmployeeTraining: true,
  }
};
