import { useEffect, useState, useMemo } from 'react';
import { adminService } from '@/services/adminService';
import { NewHire } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  CalendarIcon
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function NewHires() {
  const [newHires, setNewHires] = useState<NewHire[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadNewHires();
  }, []);

  const loadNewHires = async () => {
    try {
      setLoading(true);
      const data = await adminService.getActiveNewHires();
      console.log('Raw new hires data:', data);
      
      // Validate and convert IDs to numbers
      const idSet = new Set();
      const validatedData = data.map((hire, index) => {
        const convertedHire = {
          ...hire,
          newHireId: typeof hire.newHireId === 'string' ? parseInt(hire.newHireId) : hire.newHireId
        };

        if (!convertedHire.newHireId || isNaN(convertedHire.newHireId)) {
          console.warn(`New hire missing valid ID, using index:`, hire);
          return { ...convertedHire, newHireId: -(index + 1) };
        }

        if (idSet.has(convertedHire.newHireId)) {
          console.warn(`Duplicate new hire ID found:`, convertedHire.newHireId);
          return { ...convertedHire, newHireId: -(index + 1) };
        }

        idSet.add(convertedHire.newHireId);
        return convertedHire;
      }) as NewHire[];

      console.log('Validated new hires data:', validatedData);
      setNewHires(validatedData);
    } catch (error) {
      console.error('Error loading new hires:', error);
    } finally {
      setLoading(false);
    }
  };

  const uniqueCompanies = useMemo(() => {
    console.log('Generating unique companies list');
    const companyMap = new Map();
    newHires.forEach(nh => {
      if (!companyMap.has(nh.companyId)) {
        companyMap.set(nh.companyId, {
          id: nh.companyId,
          name: nh.companyName
        });
      }
    });
    const companies = Array.from(companyMap.values());
    companies.sort((a, b) => a.name.localeCompare(b.name));
    console.log('Unique companies:', companies);
    return companies;
  }, [newHires]);

  const filteredNewHires = useMemo(() => {
    return newHires.filter(newHire => {
      const matchesSearch = `${newHire.firstName} ${newHire.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        newHire.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCompany = selectedCompany === 'all' || newHire.companyId.toString() === selectedCompany;
      return matchesSearch && matchesCompany;
    });
  }, [newHires, searchQuery, selectedCompany]);

  const getDaysUntilStart = (hireDate: string) => {
    const today = new Date();
    const start = new Date(hireDate);
    const diffTime = start.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">New Hires</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage new hire onboarding and setup progress
          </p>
        </div>
        <Button onClick={() => navigate('/newhires/create')}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add New Hire
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4 items-center">
            <div className="w-64">
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={selectedCompany}
              onValueChange={setSelectedCompany}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="company-all" value="all">
                  All Companies
                </SelectItem>
                {uniqueCompanies.map(company => (
                  <SelectItem 
                    key={`company-${company.id}-${company.name}`} 
                    value={company.id.toString()}
                  >
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Hire Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading new hires...
                  </TableCell>
                </TableRow>
              ) : filteredNewHires.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No new hires found
                  </TableCell>
                </TableRow>
              ) : (
                filteredNewHires.map((newHire) => {
                  const daysUntilStart = getDaysUntilStart(newHire.hireDate);
                  
                  return (
                    <TableRow key={newHire.newHireId}>
                      <TableCell className="font-medium">
                        {newHire.firstName} {newHire.lastName}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <BuildingOfficeIcon className="h-4 w-4 mr-1 text-gray-500" />
                          {newHire.companyName}
                        </div>
                      </TableCell>
                      <TableCell>{newHire.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center text-gray-600">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {new Date(newHire.hireDate).toLocaleDateString()}
                          {daysUntilStart > 0 && (
                            <Badge variant="outline" className="ml-2">
                              In {daysUntilStart} days
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={newHire.isActive ? "default" : "secondary"}>
                          {newHire.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          className="h-8"
                          onClick={() => navigate(`/newhires/${newHire.newHireId}/progress`)}
                        >
                          <ChartBarIcon className="h-4 w-4 mr-1" />
                          View Progress
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => navigate(`/newhires/${newHire.newHireId}/edit`)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}