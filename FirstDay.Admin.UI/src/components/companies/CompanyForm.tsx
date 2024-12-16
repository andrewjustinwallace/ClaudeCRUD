import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CompanyDTO } from '../../types/Company';
import { upsertCompany } from '../../services/companyService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export const CompanyForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [company, setCompany] = useState<CompanyDTO>({
        name: '',
        isActive: true
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            await upsertCompany(company);
            navigate('/companies');
        } catch (error) {
            console.error('Error saving company:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">
                    {id ? 'Edit Company' : 'New Company'}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                    {id ? 'Update company details' : 'Add a new company to the system'}
                </p>
            </div>

            <Card className="p-6">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Company Name</Label>
                            <Input
                                id="name"
                                value={company.name}
                                onChange={(e) => setCompany({ ...company, name: e.target.value })}
                                required
                                placeholder="Enter company name"
                                className="max-w-md"
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="isActive"
                                checked={company.isActive}
                                onCheckedChange={(checked: boolean) => setCompany({ ...company, isActive: checked })}
                            />
                            <Label htmlFor="isActive">Active</Label>
                        </div>

                        <div className="flex space-x-4 pt-4">
                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                {loading ? 'Saving...' : id ? 'Update Company' : 'Create Company'}
                            </Button>
                            <Button 
                                type="button" 
                                variant="outline"
                                onClick={() => navigate('/companies')}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </form>
            </Card>
        </div>
    );
};