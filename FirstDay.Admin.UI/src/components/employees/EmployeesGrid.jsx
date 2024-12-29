import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import Modal from "../shared/Modal";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeTable from "./components/EmployeeTable";

const EmployeesGrid = () => {
  const [employees, setEmployees] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    itEmployeeId: 0,
    firstName: "",
    lastName: "",
    email: "",
    hireDate: new Date().toISOString().split("T")[0],
    userTypeId: 2, // Default to IT Employee type
    isActive: true,
    username: "",
    password: "",
    companies: [],
    companyCount: 0,
    onChange: (newForm) => setEditForm(newForm),
  });

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [selectedCompany]);

  const loadCompanies = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/company`);
      setCompanies(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching companies");
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      let response;
      if (selectedCompany) {
        response = await axios.get(
          `${API_BASE_URL}/itemployee/company/${selectedCompany}`
        );

        setEmployees(response.data);
        setLoading(false);
      }
      // else {
      //   response = await axios.get(`${API_BASE_URL}/itemployee`);
      // }
    } catch (err) {
      setError("Error fetching employees");
      setLoading(false);
    }
  };

  const handleEdit = (employee) => {
    setEditingId(employee.itEmployeeId);
    setEditForm({
      ...employee,
      hireDate: new Date(employee.hireDate).toISOString().split("T")[0],
      password: "", // Clear password on edit
      onChange: (newForm) => setEditForm(newForm),
    });
  };

  const handleSave = async (employeeId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/itemployee`, editForm);
      if (response.data) {
        loadEmployees();
        setEditingId(null);
      }
    } catch (err) {
      setError("Error updating employee");
    }
  };

  const handleDelete = async (employeeId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/itemployee/${employeeId}`
      );
      if (response.data) {
        loadEmployees();
        setEditingId(null);
      }
    } catch (err) {
      setError("Error updating employee");
    }
  };

  const handleAdd = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/itemployee`, editForm);
      if (response.data) {
        loadEmployees();
        setIsAddModalOpen(false);
        setEditForm({
          itEmployeeId: 0,
          firstName: "",
          lastName: "",
          email: "",
          hireDate: new Date().toISOString().split("T")[0],
          userTypeId: 2,
          isActive: true,
          username: "",
          password: "",
          companies: [],
          companyCount: 0,
          onChange: (newForm) => setEditForm(newForm),
        });
      }
    } catch (err) {
      setError("Error adding employee");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({
      itEmployeeId: 0,
      firstName: "",
      lastName: "",
      email: "",
      hireDate: new Date().toISOString().split("T")[0],
      userTypeId: 2,
      isActive: true,
      username: "",
      password: "",
      companies: [],
      companyCount: 0,
      onChange: (newForm) => setEditForm(newForm),
    });
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );

  const filteredEmployees = employees.filter(
    (employee) =>
      `${employee.firstName} ${employee.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">IT Employees</h1>
        <div className="flex space-x-4">
          <select
            className="px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={selectedCompany || ""}
            onChange={(e) =>
              setSelectedCompany(e.target.value ? Number(e.target.value) : null)
            }
          >
            <option value="">Select Company</option>
            {companies.map((company) => (
              <option key={company.companyId} value={company.companyId}>
                {company.companyName}
              </option>
            ))}
          </select>
          {selectedCompany && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Employee
            </button>
          )}
        </div>
      </div>

      {selectedCompany && (
        <>
          <Modal
            isOpen={isAddModalOpen}
            onClose={() => {
              setIsAddModalOpen(false);
              handleCancel();
            }}
            title="Add New IT Employee"
          >
            <EmployeeForm
              form={editForm}
              onSubmit={handleAdd}
              onCancel={() => setIsAddModalOpen(false)}
            />
          </Modal>

          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search employees..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchTerm("")}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <EmployeeTable
            employees={filteredEmployees}
            onEdit={handleEdit}
            editingId={editingId}
            handleSave={handleSave}
            handleCancel={handleCancel}
            editForm={editForm}
            handleDelete={handleDelete}
          />
        </>
      )}
    </div>
  );
};

export default EmployeesGrid;
