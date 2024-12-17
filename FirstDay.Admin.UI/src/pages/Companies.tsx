import { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { Company, CompanyStatistics } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon,
  CalendarIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { CompanyEditForm } from '@/components/companies/CompanyEditForm';

interface CompanyWithStats extends Company {
  statistics?: CompanyStatistics;
}

export default function Companies() {
  const [companies, setCompanies] = useState<CompanyWithStats[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingCompanyId, setEditingCompanyId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const [companiesData, statsData] = await Promise.all([
        adminService.getActiveCompanies(),
        adminService.getCompanyStatistics()
      ]);
      
      const enrichedData = companiesData.map(company => {
        const stats = statsData.find(stat => stat.companyId === company.companyId);
        return {
          ...company,
          statistics: stats
        };
      });

      setCompanies(enrichedData);
    } catch (error) {
      console.error('Error loading companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (companyId: number) => {
    setEditingCompanyId(companyId);
  };

  const handleCancelEdit = () => {
    setEditingCompanyId(null);
  };

  const handleSaveEdit = async () => {
    await loadCompanies();
    setEditingCompanyId(null);
  };

  const filteredCompanies = companies.filter(company =>
    company.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">Companies</h2>
          <p className="mt-1 text-sm text-blue-700">
            Manage companies and their onboarding processes
          </p>
        </div>
        <Button onClick={() => navigate('/companies/new')} className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Company
        </Button>
      </div>

      <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <div className="flex justify-between items-center mb-6">
          <div className="w-1/3">
            <Input
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm bg-white/70"
            />
          </div>
          <div className="space-x-2">
            <Button variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
              Export
            </Button>
            <Button variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
              Filter
            </Button>
          </div>
        </div>

        <div className="rounded-md border border-blue-100 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-50/50">
                <TableHead className="text-blue-900">Company Name</TableHead>
                <TableHead className="text-blue-900">Active Onboarding</TableHead>
                <TableHead className="text-blue-900">Total New Hires</TableHead>
                <TableHead className="text-blue-900">Created Date</TableHead>
                <TableHead className="text-blue-900">Status</TableHead>
                <TableHead className="text-blue-900">Analytics</TableHead>
                <TableHead className="text-blue-900 w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow key="loading">
                  <TableCell colSpan={7} className="text-center py-8 text-blue-800">
                    Loading companies...
                  </TableCell>
                </TableRow>
              ) : filteredCompanies.length === 0 ? (
                <TableRow key="no-results">
                  <TableCell colSpan={7} className="text-center py-8 text-blue-800">
                    No companies found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCompanies.map(company => (
                  <TableRow key={company.companyId} className="hover:bg-blue-50/30">
                    {editingCompanyId === company.companyId ? (
                      <TableCell colSpan={7} className="bg-blue-50/50">
                        <CompanyEditForm
                          company={company}
                          onCancel={handleCancelEdit}
                          onSave={handleSaveEdit}
                        />
                      </TableCell>
                    ) : (
                      <>
                        <TableCell className="font-medium text-blue-900">
                          {company.companyName}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-blue-800">
                            <UsersIcon className="h-4 w-4 mr-1 text-blue-600" />
                            {company.statistics?.pendingSetups || 0}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-blue-800">
                            <UsersIcon className="h-4 w-4 mr-1 text-blue-600" />
                            {company.statistics?.totalNewHires || 0}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-blue-800">
                            <CalendarIcon className="h-4 w-4 mr-1 text-blue-600" />
                            {new Date(company.createdDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={company.isActive ? "default" : "secondary"}
                            className={company.isActive ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-red-100 text-red-700 hover:bg-red-100"}
                          >
                            {company.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            className="text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                            onClick={() => navigate(`/companies/${company.companyId}/dashboard`)}
                          >
                            <ChartBarIcon className="h-4 w-4 mr-1" />
                            View Analytics
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                              onClick={() => handleEdit(company.companyId)}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}