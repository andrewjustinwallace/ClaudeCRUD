import React, { useState, useEffect } from 'react';
import { Plus, Edit, BarChart2 } from 'lucide-react';
import { Company } from '../../types/Company';
import { getActiveCompanies } from '../../services/companyService';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

export const CompanyList: React.FC = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadCompanies();
    }, []);

    const loadCompanies = async () => {
        try {
            const data = await getActiveCompanies();
            setCompanies(data);
        } catch (error) {
            console.error('Error loading companies:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Companies</h1>
                <Button onClick={() => navigate('/companies/new')} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Company
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {companies.map((company) => (
                    <div key={company.id} className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-semibold">{company.name}</h2>
                            <div className="flex gap-2">
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => navigate(`/companies/${company.id}/edit`)}
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => navigate(`/companies/${company.id}/dashboard`)}
                                >
                                    <BarChart2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="text-sm text-gray-600">
                            <p>Created: {new Date(company.createdDate).toLocaleDateString()}</p>
                            <p>Last Modified: {new Date(company.lastModifiedDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};