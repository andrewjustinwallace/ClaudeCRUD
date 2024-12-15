import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import type { NewHireFormData } from '@/types';
import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import type { Company } from '@/types';

interface NewHireFormProps {
  initialData?: Partial<NewHireFormData>;
  onSubmit: (data: NewHireFormData) => Promise<void>;
}

export function NewHireForm({ initialData, onSubmit }: NewHireFormProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch
  } = useForm<NewHireFormData>({
    defaultValues: {
      isActive: true,
      ...initialData
    }
  });

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const data = await adminService.getActiveCompanies();
        setCompanies(data);
      } catch (error) {
        console.error('Error loading companies:', error);
      }
    };
    loadCompanies();
  }, []);

  // Handle company selection separately since we're using a custom Select component
  const handleCompanyChange = (value: string) => {
    setValue('companyId', parseInt(value));
  };

  const selectedCompanyId = watch('companyId');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          {...register('firstName', { required: 'First name is required' })}
        />
        {errors.firstName?.message && (
          <span className="text-sm text-red-500">{errors.firstName.message}</span>
        )}
      </div>

      <div>
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          {...register('lastName', { required: 'Last name is required' })}
        />
        {errors.lastName?.message && (
          <span className="text-sm text-red-500">{errors.lastName.message}</span>
        )}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
        />
        {errors.email?.message && (
          <span className="text-sm text-red-500">{errors.email.message}</span>
        )}
      </div>

      <div>
        <Label htmlFor="hireDate">Hire Date</Label>
        <Input
          id="hireDate"
          type="date"
          {...register('hireDate', { required: 'Hire date is required' })}
        />
        {errors.hireDate?.message && (
          <span className="text-sm text-red-500">{errors.hireDate.message}</span>
        )}
      </div>

      <div>
        <Label htmlFor="companyId">Company</Label>
        <Select
          value={selectedCompanyId?.toString()}
          onValueChange={handleCompanyChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a company..." />
          </SelectTrigger>
          <SelectContent>
            {companies.map((company) => (
              <SelectItem key={company.companyId} value={company.companyId.toString()}>
                {company.companyName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.companyId?.message && (
          <span className="text-sm text-red-500">{errors.companyId.message}</span>
        )}
      </div>

      <input type="hidden" {...register('isActive')} />

      <div className="pt-4">
        <Button type="submit">
          {initialData?.newHireId ? 'Update New Hire' : 'Create New Hire'}
        </Button>
      </div>
    </form>
  );
}