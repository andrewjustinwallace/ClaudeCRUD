import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminService } from '@/services/adminService';
import { NewHireForm } from '@/components/NewHireForm';
import type { NewHireFormData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewHireEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<Partial<NewHireFormData> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNewHire = async () => {
      if (!id) return;
      try {
        const data = await adminService.getNewHireById(parseInt(id));
        setInitialData({
          newHireId: data.newHireId,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          companyId: data.companyId,
          hireDate: data.hireDate.split('T')[0], // Format date for input
          isActive: data.isActive
        });
      } catch (error) {
        console.error('Error loading new hire:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNewHire();
  }, [id]);

  const handleSubmit = async (data: NewHireFormData) => {
    try {
      await adminService.updateNewHire(data);
      navigate('/newhires');
    } catch (error) {
      console.error('Error updating new hire:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit New Hire</CardTitle>
      </CardHeader>
      <CardContent>
        {initialData && (
          <NewHireForm
            initialData={initialData}
            onSubmit={handleSubmit}
          />
        )}
      </CardContent>
    </Card>
  );
}