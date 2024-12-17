import { useState } from 'react';
import { SetupType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { adminService } from '@/services/adminService';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface SetupTypeEditFormProps {
  setupType: SetupType;
  onCancel: () => void;
  onSave: () => void;
}

export function SetupTypeEditForm({ setupType, onCancel, onSave }: SetupTypeEditFormProps) {
  const [formData, setFormData] = useState<Partial<SetupType>>({
    setupTypeId: setupType.setupTypeId,
    setupName: setupType.setupName,
    description: setupType.description,
    estimatedDurationMinutes: setupType.estimatedDurationMinutes,
    isActive: setupType.isActive
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await adminService.upsertSetupType(formData);
      onSave();
    } catch (error) {
      console.error('Error saving setup type:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-50 p-4 rounded-lg space-y-4 mt-2 border border-zinc-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Edit Setup Type</h3>
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
      
      <div className="space-y-4">
        <div className="grid w-full items-center gap-2">
          <Label htmlFor="setupName">Setup Name</Label>
          <Input
            id="setupName"
            value={formData.setupName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, setupName: e.target.value })}
            required
          />
        </div>

        <div className="grid w-full items-center gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>

        <div className="grid w-full items-center gap-2">
          <Label htmlFor="duration">Estimated Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            min="1"
            value={formData.estimatedDurationMinutes}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, estimatedDurationMinutes: parseInt(e.target.value) })}
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
          />
          <Label htmlFor="isActive">Active</Label>
        </div>

        {/* Display read-only metadata */}
        <div className="grid grid-cols-2 gap-4 pt-4 text-sm text-zinc-600">
          <div>
            <Label className="text-zinc-500">Created</Label>
            <div className="mt-1">{new Date(setupType.createdDate).toLocaleDateString()}</div>
          </div>
          <div>
            <Label className="text-zinc-500">Last Modified</Label>
            <div className="mt-1">{new Date(setupType.modifiedDate).toLocaleDateString()}</div>
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
      </div>
    </form>
  );
}