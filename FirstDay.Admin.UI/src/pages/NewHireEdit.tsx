import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { NewHireForm } from '@/components/NewHireForm';
import { adminService } from '@/services/adminService';
import type { NewHireFormData } from '@/types';
import { useToast } from '@/components/ui/use-toast';

export default function NewHireEdit() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const [hire, setHire] = useState<NewHireFormData>();

  useEffect(() => {
    const loadNewHire = async () => {
      if (id) {
        try {
          const response = await adminService.getActiveNewHires();
          const found = response.find(h => h.newHireId === parseInt(id));
          if (found) {
            const formData: NewHireFormData = {
              firstName: found.firstName,
              lastName: found.lastName,
              email: found.email,
              hireDate: found.hireDate,
              company: found.companyId.toString(),
              department: ''
            };
            setHire(formData);
          }
        } catch (error) {
          console.error('Error loading new hire:', error);
          toast({
            title: "Error",
            description: "Failed to load new hire data",
            variant: "destructive"
          });
        }
      }
    };
    loadNewHire();
  }, [id, toast]);

  const handleSubmit = async (formData: NewHireFormData) => {
    try {
      await adminService.upsertNewHire({
        ...formData,
        newHireId: parseInt(id || '0')
      });
      toast({
        title: "Success",
        description: "New hire has been updated successfully"
      });
      navigate('/newhires');
    } catch (error) {
      console.error('Error updating new hire:', error);
      toast({
        title: "Error",
        description: "Failed to update new hire",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {id ? 'Edit New Hire' : 'Add New Hire'}
      </h1>
      {hire ? (
        <NewHireForm initialData={hire} onSubmit={handleSubmit} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}