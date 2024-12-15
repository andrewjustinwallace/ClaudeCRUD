import { useNavigate } from 'react-router-dom';
import { NewHireForm } from '../components/NewHireForm';
import type { NewHireFormData } from '@/types';
import { adminService } from '@/services/adminService';
import { useToast } from '@/components/ui/use-toast';

export default function NewHireCreate() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (data: NewHireFormData) => {
    try {
      await adminService.upsertNewHire(data);
      toast({
        title: "Success",
        description: "New hire has been created successfully"
      });
      navigate('/newhires');
    } catch (error) {
      console.error('Error creating new hire:', error);
      toast({
        title: "Error",
        description: "Failed to create new hire",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Hire</h1>
      <NewHireForm onSubmit={handleSubmit} />
    </div>
  );
}