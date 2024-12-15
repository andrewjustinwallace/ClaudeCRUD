import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ITEmployees() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>IT Employees</CardTitle>
        <Button 
          variant="outline" 
          size="default" 
          onClick={() => navigate('/employees/create')}
        >
          Add Employee
        </Button>
      </CardHeader>
      <CardContent>
        {/* Employee list will go here */}
      </CardContent>
    </Card>
  );
}