import { useState } from "react";
import { Company } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { adminService } from "@/services/adminService";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface CompanyEditFormProps {
  company: Company;
  onCancel: () => void;
  onSave: () => void;
}

export function CompanyEditForm({
  company,
  onCancel,
  onSave,
}: CompanyEditFormProps) {
  const [formData, setFormData] = useState<Partial<Company>>({
    companyId: company.companyId,
    companyName: company.companyName,
    isActive: company.isActive,
    createdDate: company.createdDate,
    modifiedDate: company.modifiedDate,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await adminService.upsertCompany(formData);
      onSave();
    } catch (error) {
      console.error("Error saving company:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-zinc-50 p-4 rounded-lg space-y-4 mt-2 border border-zinc-200"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Edit Company</h3>
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
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) =>
              setFormData({ ...formData, companyName: e.target.value })
            }
            required
          />
        </div>

        {/* Display read-only statistics */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm text-gray-600">Created Date</Label>
            <div className="mt-1 text-sm">
              {formData.createdDate
                ? new Date(formData.createdDate).toLocaleDateString()
                : "N/A"}
            </div>
          </div>
          <div>
            <Label className="text-sm text-gray-600">Last Modified</Label>
            <div className="mt-1 text-sm">
              {formData.modifiedDate
                ? new Date(formData.modifiedDate).toLocaleDateString()
                : "N/A"}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isActive: checked })
            }
          />
          <Label htmlFor="isActive">Active</Label>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            type="submit"
            disabled={loading}
            className="border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
