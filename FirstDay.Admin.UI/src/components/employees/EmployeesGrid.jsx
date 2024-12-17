import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import Modal from '../shared/Modal';

const EmployeesGrid = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    itEmployeeId: 0,
    firstName: '',
    lastName: '',
    email: '',
    hireDate: new Date().toISOString().split('T')[0],
    userTypeId: 2,  // Default to IT Employee type
    isActive: true
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/itemployee`);
        setEmployees(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching employees');
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleEdit = (employee) => {
    setEditingId(employee.itEmployeeId);
    setEditForm({
      itEmployeeId: employee.itEmployeeId,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      hireDate: new Date(employee.hireDate).toISOString().split('T')[0],
      userTypeId: employee.userTypeId,
      isActive: employee.isActive
    });
  };

  const handleSave = async (employeeId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/itemployee`, editForm);
      if (response.data) {
        const refreshResponse = await axios.get(`${API_BASE_URL}/itemployee`);
        setEmployees(refreshResponse.data);
        setEditingId(null);
      }
    } catch (err) {
      setError('Error updating employee');
    }
  };

  const handleAdd = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/itemployee`, editForm);
      if (response.data) {
        const refreshResponse = await axios.get(`${API_BASE_URL}/itemployee`);
        setEmployees(refreshResponse.data);
        setIsAddModalOpen(false);
        setEditForm({
          itEmployeeId: 0,
          firstName: '',
          lastName: '',
          email: '',
          hireDate: new Date().toISOString().split('T')[0],
          userTypeId: 2,
          isActive: true
        });
      }
    } catch (err) {
      setError('Error adding employee');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({
      itEmployeeId: 0,
      firstName: '',
      lastName: '',
      email: '',
      hireDate: new Date().toISOString().split('T')[0],
      userTypeId: 2,
      isActive: true
    });
  };

  const filteredEmployees = employees.filter(employee =>
    `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl">Loading...</div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl text-red-600">{error}</div>
    </div>
  );

  const renderForm = (form, onSubmit, onCancel) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={form.firstName}
            onChange={(e) => setEditForm({...form, firstName: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={form.lastName}
            onChange={(e) => setEditForm({...form, lastName: e.target.value})}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          value={form.email}
          onChange={(e) => setEditForm({...form, email: e.target.value})}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hire Date
        </label>
        <input
          type="date"
          className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          value={form.hireDate}
          onChange={(e) => setEditForm({...form, hireDate: e.target.value})}
        />
      </div>
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 text-blue-600"
            checked={form.isActive}
            onChange={(e) => setEditForm({...form, isActive: e.target.checked})}
          />
          <span className="ml-2 text-sm text-gray-700">Active</span>
        </label>
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md inline-flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          Save
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">IT Employees</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Employee
        </button>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          handleCancel();
        }}
        title="Add New IT Employee"
      >
        {renderForm(editForm, handleAdd, () => setIsAddModalOpen(false))}
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
              onClick={() => setSearchTerm('')}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hire Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Companies
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <React.Fragment key={employee.itEmployeeId}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {employee.firstName} {employee.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {employee.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(employee.hireDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {employee.companyCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        employee.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {employee.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingId === employee.itEmployeeId ? (
                        <>
                          <button 
                            onClick={() => handleSave(employee.itEmployeeId)}
                            className="text-green-600 hover:text-green-900 mr-2 inline-flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Save
                          </button>
                          <button 
                            onClick={handleCancel}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => handleEdit(employee)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                  {editingId === employee.itEmployeeId && (
                    <tr className="bg-gray-50">
                      <td colSpan="6" className="px-6 py-4">
                        {renderForm(editForm, () => handleSave(employee.itEmployeeId), handleCancel)}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No employees found matching your search criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeesGrid;