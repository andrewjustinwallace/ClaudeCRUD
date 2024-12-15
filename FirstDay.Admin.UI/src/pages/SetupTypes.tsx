import { useEffect, useState } from 'react';
import {
  Card,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text,
  Badge
} from '@tremor/react';
import { PencilIcon } from '@heroicons/react/24/outline';
import { adminService } from '@/services/adminService';
import { SetupType } from '@/types';

export default function SetupTypes() {
  const [setupTypes, setSetupTypes] = useState<SetupType[]>([]);

  useEffect(() => {
    const loadSetupTypes = async () => {
      const data = await adminService.getActiveSetupTypes();
      setSetupTypes(data);
    };
    loadSetupTypes();
  }, []);

  return (
    <main className="p-4">
      <Card>
        <div className="md:flex justify-between items-center mb-4">
          <Text className="text-xl font-bold">Setup Types</Text>
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Description</TableHeaderCell>
              <TableHeaderCell>Duration (min)</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {setupTypes.map((type) => (
              <TableRow key={type.setupTypeId}>
                <TableCell>{type.setupName}</TableCell>
                <TableCell>{type.description}</TableCell>
                <TableCell>{type.estimatedDurationMinutes}</TableCell>
                <TableCell>
                  <Badge color={type.isActive ? "green" : "red"}>
                    {type.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <PencilIcon className="h-5 w-5" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </main>
  );
}