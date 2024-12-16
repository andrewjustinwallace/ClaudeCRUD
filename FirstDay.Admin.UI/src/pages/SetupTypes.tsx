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

export default function SetupTypes() {
  const [setupTypes, setSetupTypes] = useState<SetupType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadSetupTypes();
  }, []);

  const loadSetupTypes = async () => {
    try {
      setLoading(true);
      const data = await adminService.getActiveSetupTypes();
      console.log('Raw setup types data:', data);
      
      // Validate and convert IDs to numbers
      const idSet = new Set();
      const validatedData = data.map((setup, index) => {
        const convertedSetup = {
          ...setup,
          setupTypeId: typeof setup.setupTypeId === 'string' ? parseInt(setup.setupTypeId) : setup.setupTypeId
        };

        if (!convertedSetup.setupTypeId || isNaN(convertedSetup.setupTypeId)) {
          console.warn(`Setup type missing valid ID, using index:`, setup);
          return { ...convertedSetup, setupTypeId: -(index + 1) };
        }

        if (idSet.has(convertedSetup.setupTypeId)) {
          console.warn(`Duplicate setup type ID found:`, convertedSetup.setupTypeId);
          return { ...convertedSetup, setupTypeId: -(index + 1) };
        }

        idSet.add(convertedSetup.setupTypeId);
        return convertedSetup;
      }) as SetupType[];

      console.log('Validated setup types data:', validatedData);
      setSetupTypes(validatedData);
    } catch (error) {
      console.error('Error loading setup types:', error);
    } finally {
      setLoading(false);
    }
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
          <h2 className="text-2xl font-bold text-gray-900">Setup Types</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage IT setup tasks and their estimated durations
          </p>
        </div>
        <Button onClick={() => navigate('/setuptypes/new')}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Setup Type
        </Button>
      </div>

      <Card className="p-6">
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
            <Button variant="outline">Export</Button>
            <Button variant="outline">Filter</Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Setup Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading setup types...
                  </TableCell>
                </TableRow>
              ) : filteredSetupTypes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No setup types found
                  </TableCell>
                </TableRow>
              ) : (
                filteredSetupTypes.map((setupType) => (
                  <TableRow key={setupType.setupTypeId}>
                    <TableCell className="font-medium">
                      {setupType.setupName}
                    </TableCell>
                    <TableCell className="max-w-md truncate">
                      {setupType.description}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-gray-600">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {formatDuration(setupType.estimatedDurationMinutes)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={setupType.isActive ? "default" : "secondary"}>
                        {setupType.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => navigate(`/setuptypes/${setupType.setupTypeId}`)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
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