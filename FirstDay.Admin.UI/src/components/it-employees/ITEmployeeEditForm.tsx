import { useState, useEffect } from 'react';
import { ITEmployee, UserType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { adminService } from '@/services/adminService';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ITEmployeeEditFormProps {
  employee: ITEmployee;
  onCancel: () => void;
  onSave: () => void;
}

export function ITEmployeeEditForm({ employee, onCancel, onSave }: ITEmployeeEditFormProps) {
  const [formData, setFormData] = useState<Partial<ITEmployee>>({
    itEmployeeId: employee.itEmployeeId,
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    hireDate: employee.hireDate,
    userTypeId: employee.userTypeId,
    isActive: employee.isActive
  });
  const [loading, setLoading] = useState(false);
  const [userTypes, setUserTypes] = useState<UserType[]>([]);

  useEffect(() => {
    loadUserTypes();
  }, []);

  const loadUserTypes = async () => {
    try {
      const types = await adminService.getUserTypes();
      setUserTypes(types);
    } catch (error) {
      console.error('Error loading user types:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await adminService.upsertITEmployee(formData);
      onSave();
    } catch (error) {
      console.error('Error saving IT employee:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-50 p-4 rounded-lg space-y-4 mt-2 border border-zinc-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Edit IT Employee</h3>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="h-8 w-8"
        >
          <XMarkIcon className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hireDate">Hire Date</Label>
          <Input
            id="hireDate"
            type="date"
            value={formData.hireDate ? formData.hireDate.split('T')[0] : ''}
            onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="userType">Role</Label>
          <Select
            value={formData.userTypeId?.toString()}
            onValueChange={(value) => setFormData({ ...formData, userTypeId: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {userTypes.map((type) => (
                <SelectItem key={type.userTypeId} value={type.userTypeId.toString()}>
                  {type.typeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Companies Assigned</Label>
          <div className="h-9 flex items-center">
            <span className="text-zinc-600">{employee.companyCount || 0} companies</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
        <Label htmlFor="isActive">Active</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}