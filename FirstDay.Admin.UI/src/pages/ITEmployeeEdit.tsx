import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { ITEmployee } from '@/types';

export default function ITEmployeeEdit() {
  const { id } = useParams();
  const [employee, setEmployee] = useState<ITEmployee | null>(null);

  useEffect(() => {
    const loadEmployee = async () => {
      if (id) {
        try {
          const data = await adminService.getActiveITEmployees();
          const foundEmployee = data.find(emp => emp.itEmployeeId === parseInt(id));
          setEmployee(foundEmployee || null);
        } catch (error) {
          console.error('Error loading employee:', error);
        }
      }
    };
    loadEmployee();
  }, [id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit IT Employee</CardTitle>
      </CardHeader>
      <CardContent>
        {employee ? (
          <div>
            <pre>{JSON.stringify(employee, null, 2)}</pre>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </CardContent>
    </Card>
  );
}