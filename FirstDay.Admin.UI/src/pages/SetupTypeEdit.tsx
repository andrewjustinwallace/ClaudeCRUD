import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { SetupType } from '@/types';
import { useToast } from '@/components/ui/use-toast';

export default function SetupTypeEdit() {
  const { id } = useParams();
  const { toast } = useToast();
  const [setupType, setSetupType] = useState<SetupType | null>(null);

  useEffect(() => {
    const loadSetupType = async () => {
      if (id) {
        try {
          const data = await adminService.getActiveSetupTypes();
          const found = data.find(st => st.setupTypeId === parseInt(id));
          setSetupType(found || null);
        } catch (error) {
          console.error('Error loading setup type:', error);
          toast({
            title: "Error",
            description: "Failed to load setup type data",
            variant: "destructive",
          });
        }
      }
    };
    loadSetupType();
  }, [id, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Setup Type</CardTitle>
      </CardHeader>
      <CardContent>
        {setupType ? (
          <div>
            {/* Setup type edit form will go here */}
            <pre>{JSON.stringify(setupType, null, 2)}</pre>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </CardContent>
    </Card>
  );
}