import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { NewHireFormData } from '@/types';

interface NewHireFormProps {
  initialData?: NewHireFormData | null;
  onSubmit: (data: NewHireFormData) => Promise<void>;
}

export function NewHireForm({ initialData, onSubmit }: NewHireFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<NewHireFormData>({
    defaultValues: initialData || undefined
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          error={errors.firstName?.message}
          {...register('firstName', { required: 'First name is required' })}
        />
      </div>

      <div>
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          error={errors.lastName?.message}
          {...register('lastName', { required: 'Last name is required' })}
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
        />
      </div>

      <div>
        <Label htmlFor="hireDate">Hire Date</Label>
        <Input
          id="hireDate"
          type="date"
          error={errors.hireDate?.message}
          {...register('hireDate', { required: 'Hire date is required' })}
        />
      </div>

      <div>
        <Label htmlFor="company">Company</Label>
        <Select
          {...register('company', { required: 'Company is required' })}
        >
          <option value="">Select a company...</option>
          {/* Add company options dynamically */}
        </Select>
        {errors.company?.message && (
          <span className="text-sm text-red-500">{errors.company.message}</span>
        )}
      </div>

      <div>
        <Label htmlFor="department">Department</Label>
        <Select
          {...register('department', { required: 'Department is required' })}
        >
          <option value="">Select a department...</option>
          {/* Add department options dynamically */}
        </Select>
        {errors.department?.message && (
          <span className="text-sm text-red-500">{errors.department.message}</span>
        )}
      </div>

      <Button type="submit">Submit</Button>
    </form>
  );
}