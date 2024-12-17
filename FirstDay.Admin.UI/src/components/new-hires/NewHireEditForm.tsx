import { useState } from 'react';
import { NewHire } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { adminService } from '@/services/adminService';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface NewHireEditFormProps {
  newHire: NewHire;
  onCancel: () => void;
  onSave: () => void;
}

export function NewHireEditForm({ newHire, onCancel, onSave }: NewHireEditFormProps) {
  const [formData, setFormData] = useState<Partial<NewHire>>({
    newHireId: newHire.newHireId,
    firstName: newHire.firstName,
    lastName: newHire.lastName,
    email: newHire.email,
    companyId: newHire.companyId,
    hireDate: newHire.hireDate,
    isActive: newHire.isActive
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await adminService.upsertNewHire(formData);
      onSave();
    } catch (error) {
      console.error('Error saving new hire:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFormattedDate = (date?: string) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-50 p-4 rounded-lg space-y-4 mt-2 border border-zinc-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Edit New Hire</h3>
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
            value={getFormattedDate(formData.hireDate)}
            onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Company</Label>
          <div className="h-9 flex items-center">
            <span className="text-zinc-600">{newHire.companyName}</span>
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

      {/* Display read-only metadata */}
      <div className="grid grid-cols-2 gap-4 text-sm text-zinc-600">
        <div>
          <Label className="text-zinc-500">Created</Label>
          <div className="mt-1">{new Date(newHire.createdDate).toLocaleDateString()}</div>
        </div>
        <div>
          <Label className="text-zinc-500">Last Modified</Label>
          <div className="mt-1">{new Date(newHire.modifiedDate).toLocaleDateString()}</div>
        </div>
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