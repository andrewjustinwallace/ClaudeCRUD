import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import { ITEmployee } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export default function ITEmployees() {
  const [employees, setEmployees] = useState<ITEmployee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await adminService.getActiveITEmployees();
      console.log("Raw employee data:", data);

      // Validate and convert IDs to numbers
      const idSet = new Set();
      const validatedData = data.map((emp, index) => {
        const convertedEmp = {
          ...emp,
          itEmployeeId: typeof emp.itEmployeeId === 'string' ? parseInt(emp.itEmployeeId) : emp.itEmployeeId
        };

        if (!convertedEmp.itEmployeeId || isNaN(convertedEmp.itEmployeeId)) {
          console.warn(`Employee missing valid ID, using index:`, emp);
          return { ...convertedEmp, itEmployeeId: -(index + 1) }; // Use negative numbers for temporary IDs
        }

        if (idSet.has(convertedEmp.itEmployeeId)) {
          console.warn(`Duplicate employee ID found:`, convertedEmp.itEmployeeId);
          return { ...convertedEmp, itEmployeeId: -(index + 1) };
        }

        idSet.add(convertedEmp.itEmployeeId);
        return convertedEmp;
      }) as ITEmployee[];

      console.log("Validated employee data:", validatedData);
      setEmployees(validatedData);
    } catch (error) {
      console.error("Error loading IT employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      `${employee.firstName} ${employee.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">IT Staff</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage IT staff members and their company assignments
          </p>
        </div>
        <Button onClick={() => navigate("/employees/new")}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add IT Staff
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="w-1/3">
            <Input
              placeholder="Search by name or email..."
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
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Companies</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Hire Date</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading IT staff...
                  </TableCell>
                </TableRow>
              ) : filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No IT staff members found
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.itEmployeeId}>
                    <TableCell className="font-medium">
                      {employee.firstName} {employee.lastName}
                    </TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{employee.userTypeName}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                        <span>{employee.companyCount || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={employee.isActive ? "default" : "secondary"}
                      >
                        {employee.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(employee.hireDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            navigate(`/employees/${employee.itEmployeeId}`)
                          }
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
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