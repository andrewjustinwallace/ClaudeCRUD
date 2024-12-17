import { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { SetupType } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { SetupTypeEditForm } from '@/components/setup-types/SetupTypeEditForm';

export default function SetupTypes() {
  const [setupTypes, setSetupTypes] = useState<SetupType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingSetupTypeId, setEditingSetupTypeId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadSetupTypes();
  }, []);

  const loadSetupTypes = async () => {
    try {
      setLoading(true);
      const data = await adminService.getActiveSetupTypes();
      const validatedData = data.map((setup, index) => ({
        ...setup,
        setupTypeId: typeof setup.setupTypeId === 'string' ? parseInt(setup.setupTypeId) : setup.setupTypeId || -(index + 1)
      }));
      setSetupTypes(validatedData);
    } catch (error) {
      console.error('Error loading setup types:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (setupTypeId: number) => {
    setEditingSetupTypeId(setupTypeId);
  };

  const handleCancelEdit = () => {
    setEditingSetupTypeId(null);
  };

  const handleSaveEdit = async () => {
    await loadSetupTypes();
    setEditingSetupTypeId(null);
  };

  const filteredSetupTypes = setupTypes.filter(setupType =>
    setupType.setupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    setupType.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours === 0) return `${minutes} min`;
    if (remainingMinutes === 0) return `${hours} hr`;
    return `${hours} hr ${remainingMinutes} min`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Setup Types</h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage IT setup tasks and their estimated durations
          </p>
        </div>
        <Button onClick={() => navigate('/setuptypes/new')} className="bg-violet-600 text-white hover:bg-violet-700 shadow-sm">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Setup Type
        </Button>
      </div>

      <Card className="p-6 bg-white shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="w-1/3">
            <Input
              placeholder="Search setup types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="space-x-2">
            <Button variant="outline" className="bg-white text-slate-700 border-slate-300 hover:bg-slate-50">Export</Button>
            <Button variant="outline" className="bg-white text-slate-700 border-slate-300 hover:bg-slate-50">Filter</Button>
          </div>
        </div>

        <div className="rounded-md border border-slate-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Setup Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow key="loading">
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading setup types...
                  </TableCell>
                </TableRow>
              ) : filteredSetupTypes.length === 0 ? (
                <TableRow key="no-results">
                  <TableCell colSpan={5} className="text-center py-8">
                    No setup types found
                  </TableCell>
                </TableRow>
              ) : (
                filteredSetupTypes.map(setupType => (
                  <TableRow key={setupType.setupTypeId}>
                    {editingSetupTypeId === setupType.setupTypeId ? (
                      <TableCell colSpan={5} className="bg-slate-50">
                        <SetupTypeEditForm
                          setupType={setupType}
                          onCancel={handleCancelEdit}
                          onSave={handleSaveEdit}
                        />
                      </TableCell>
                    ) : (
                      <>
                        <TableCell className="font-medium">
                          {setupType.setupName}
                        </TableCell>
                        <TableCell className="max-w-md truncate">
                          {setupType.description}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-slate-600">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {formatDuration(setupType.estimatedDurationMinutes)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={setupType.isActive ? "default" : "secondary"}
                            className={setupType.isActive ? "bg-violet-100 text-violet-700 hover:bg-violet-100" : "bg-slate-100 text-slate-700 hover:bg-slate-100"}
                          >
                            {setupType.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-slate-700 hover:bg-slate-100"
                              onClick={() => handleEdit(setupType.setupTypeId)}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-slate-700 hover:bg-slate-100"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}