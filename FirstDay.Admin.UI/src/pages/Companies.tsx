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

interface CompanyWithStats extends Company {
  statistics?: CompanyStatistics;
}

export default function Companies() {
  const [companies, setCompanies] = useState<CompanyWithStats[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
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
      
      console.log('Raw companies data:', JSON.stringify(companiesData, null, 2));
      console.log('Raw statistics data:', JSON.stringify(statsData, null, 2));
      
      // Combine company data with statistics
      const enrichedData = companiesData.map(company => {
        const stats = statsData.find(stat => stat.companyId === company.companyId);
        const enrichedCompany = {
          ...company,
          statistics: stats
        };
        console.log('Enriched company:', JSON.stringify(enrichedCompany, null, 2));
        return enrichedCompany;
      });

      console.log('All enriched companies:', JSON.stringify(enrichedData, null, 2));
      setCompanies(enrichedData);
    } catch (error) {
      console.error('Error loading companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(company =>
    company.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Companies</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage companies and their onboarding processes
          </p>
        </div>
        <Button onClick={() => navigate('/companies/new')}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Company
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="w-1/3">
            <Input
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="space-x-2">
            <Button variant="outline">Export</Button>
            <Button variant="outline">Filter</Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Active Onboarding</TableHead>
                <TableHead>Total New Hires</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Analytics</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow key="loading">
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading companies...
                  </TableCell>
                </TableRow>
              ) : filteredCompanies.length === 0 ? (
                <TableRow key="no-results">
                  <TableCell colSpan={7} className="text-center py-8">
                    No companies found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCompanies.map((company, index) => (
                  <TableRow key={`${company.companyId}-${index}`}>
                    <TableCell className="font-medium">
                      {company.companyName}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <UsersIcon className="h-4 w-4 mr-1 text-gray-500" />
                        {company.statistics?.pendingSetups || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <UsersIcon className="h-4 w-4 mr-1 text-gray-500" />
                        {company.statistics?.totalNewHires || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-gray-600">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {new Date(company.createdDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={company.isActive ? "default" : "secondary"}>
                        {company.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        className="h-8"
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
                          className="h-8 w-8"
                          onClick={() => navigate(`/companies/${company.companyId}/edit`)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
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