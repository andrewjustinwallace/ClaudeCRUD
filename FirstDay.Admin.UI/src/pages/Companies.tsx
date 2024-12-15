import { useEffect, useState } from 'react';
import {
  Card,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text,
  Badge
} from '@tremor/react';
import { adminService } from '@/services/adminService';
import { Company } from '@/types';

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const loadCompanies = async () => {
      const data = await adminService.getActiveCompanies();
      setCompanies(data);
    };
    loadCompanies();
  }, []);

  return (
    <main className="p-4">
      <Card>
        <div className="md:flex justify-between items-center mb-4">
          <Text className="text-xl font-bold">Companies</Text>
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Created</TableHeaderCell>
              <TableHeaderCell>Modified</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.companyId}>
                <TableCell>{company.companyName}</TableCell>
                <TableCell>
                  <Badge color={company.isActive ? "green" : "red"}>
                    {company.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(company.createdDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(company.modifiedDate).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </main>
  );
}