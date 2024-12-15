import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import type { NewHire } from '@/types';

export default function NewHires() {
  const navigate = useNavigate();
  const [hires, setHires] = useState<NewHire[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHires = async () => {
      try {
        const data = await adminService.getActiveNewHires();
        setHires(data);
      } catch (error) {
        console.error('Error loading new hires:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHires();
  }, []);

  const columns = [
    {
      accessorKey: 'fullName',
      header: 'Name',
      cell: ({ row }: { row: { original: NewHire } }) => 
        `${row.original.firstName} ${row.original.lastName}`,
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'companyName',
      header: 'Company',
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: { original: NewHire } }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/newhires/${row.original.newHireId}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/newhires/${row.original.newHireId}/progress`)}
          >
            Progress
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>New Hires</CardTitle>
        <Button 
          variant="outline" 
          size="default" 
          onClick={() => navigate('/newhires/create')}
        >
          Add New Hire
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={hires} />
      </CardContent>
    </Card>
  );
}