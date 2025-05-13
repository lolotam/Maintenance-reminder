
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/contexts/RoleContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserRole, DEFAULT_PERMISSIONS } from "@/types/users";

export function UserRolesCard() {
  const { user } = useAuth();
  const { userRole, permissions, setUserRole, updatePermissions, hasPermission } = useRole();
  const [localRole, setLocalRole] = useState<UserRole>(userRole);
  const [localPermissions, setLocalPermissions] = useState({ ...permissions });
  const [isEditing, setIsEditing] = useState(false);

  // Only admin can view and modify roles
  if (!hasPermission('manageUsers')) {
    return null;
  }

  const handleRoleChange = (role: UserRole) => {
    setLocalRole(role);
    setLocalPermissions(DEFAULT_PERMISSIONS[role]);
  };

  const handlePermissionChange = (permission: keyof typeof localPermissions, value: boolean) => {
    setLocalPermissions(prev => ({ ...prev, [permission]: value }));
  };

  const handleSave = async () => {
    await setUserRole(localRole);
    await updatePermissions(localPermissions);
    setIsEditing(false);
    toast.success('User role and permissions updated');
  };

  const handleCancel = () => {
    setLocalRole(userRole);
    setLocalPermissions({ ...permissions });
    setIsEditing(false);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>User Roles & Permissions</CardTitle>
        <CardDescription>
          Configure user roles and specific permissions for the system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between">
            <h3 className="text-md font-medium">Role Settings</h3>
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            ) : (
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave}>
                  Save
                </Button>
              </div>
            )}
          </div>

          <RadioGroup 
            value={localRole} 
            disabled={!isEditing}
            onValueChange={(value) => handleRoleChange(value as UserRole)}
            className="border rounded-md p-4 space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="admin" id="admin-role" />
              <Label htmlFor="admin-role" className="font-medium">Admin</Label>
              <span className="text-sm text-muted-foreground ml-2">
                (Full access to all features)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="data_entry" id="data-entry-role" />
              <Label htmlFor="data-entry-role" className="font-medium">Data Entry</Label>
              <span className="text-sm text-muted-foreground ml-2">
                (Limited access for data input only)
              </span>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <h3 className="text-md font-medium border-b pb-2">Custom Permissions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="view-records" className="flex-grow">View Records</Label>
              <Switch 
                id="view-records" 
                checked={localPermissions.viewRecords}
                disabled={!isEditing}
                onCheckedChange={(checked) => handlePermissionChange('viewRecords', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="add-records" className="flex-grow">Add New Records</Label>
              <Switch 
                id="add-records" 
                checked={localPermissions.addRecords}
                disabled={!isEditing}
                onCheckedChange={(checked) => handlePermissionChange('addRecords', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-records" className="flex-grow">Edit Existing Records</Label>
              <Switch 
                id="edit-records" 
                checked={localPermissions.editRecords}
                disabled={!isEditing}
                onCheckedChange={(checked) => handlePermissionChange('editRecords', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="delete-records" className="flex-grow">Delete Records</Label>
              <Switch 
                id="delete-records" 
                checked={localPermissions.deleteRecords}
                disabled={!isEditing}
                onCheckedChange={(checked) => handlePermissionChange('deleteRecords', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="manage-users" className="flex-grow">Manage Users</Label>
              <Switch 
                id="manage-users" 
                checked={localPermissions.manageUsers}
                disabled={!isEditing}
                onCheckedChange={(checked) => handlePermissionChange('manageUsers', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="view-settings" className="flex-grow">Access Settings</Label>
              <Switch 
                id="view-settings" 
                checked={localPermissions.viewSettings}
                disabled={!isEditing}
                onCheckedChange={(checked) => handlePermissionChange('viewSettings', checked)}
              />
            </div>
          </div>
          
          <h3 className="text-md font-medium border-b pb-2 mt-6">Upload Permissions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="upload-ppm" className="flex-grow">Upload PPM Data</Label>
              <Switch 
                id="upload-ppm" 
                checked={localPermissions.uploadPPM}
                disabled={!isEditing}
                onCheckedChange={(checked) => handlePermissionChange('uploadPPM', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="upload-ocm" className="flex-grow">Upload OCM Data</Label>
              <Switch 
                id="upload-ocm" 
                checked={localPermissions.uploadOCM}
                disabled={!isEditing}
                onCheckedChange={(checked) => handlePermissionChange('uploadOCM', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="upload-training" className="flex-grow">Upload Employee Training</Label>
              <Switch 
                id="upload-training" 
                checked={localPermissions.uploadEmployeeTraining}
                disabled={!isEditing}
                onCheckedChange={(checked) => handlePermissionChange('uploadEmployeeTraining', checked)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
