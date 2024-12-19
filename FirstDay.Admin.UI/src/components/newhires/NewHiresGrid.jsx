import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

const NewHiresGrid = () => {
  const [newHires, setNewHires] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedNewHire, setSelectedNewHire] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    newHireId: 0,
    firstName: "",
    lastName: "",
    email: "",
    companyId: "",
    hireDate: "",
    isActive: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [newHiresResponse, companiesResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/newhire`),
        axios.get(`${API_BASE_URL}/company`),
      ]);
      setNewHires(newHiresResponse.data);
      setCompanies(companiesResponse.data);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  const handleAdd = () => {
    setSelectedNewHire(null);
    setFormData({
      newHireId: 0,
      firstName: "",
      lastName: "",
      email: "",
      companyId: "",
      hireDate: "",
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEdit = (newHire) => {
    setSelectedNewHire(newHire);
    setFormData({
      newHireId: newHire.newHireId,
      firstName: newHire.firstName,
      lastName: newHire.lastName,
      email: newHire.email,
      companyId: newHire.companyId.toString(),
      hireDate: new Date(newHire.startDate).toISOString().split("T")[0],
      isActive: newHire.isActive,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        newHireId: formData.newHireId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        companyId: parseInt(formData.companyId),
        hireDate: new Date(formData.hireDate).toISOString(),
        isActive: formData.isActive,
      };

      if (selectedNewHire) {
        await axios.put(
          `${API_BASE_URL}/newhire/${formData.newHireId}`,
          payload
        );
      } else {
        await axios.post(`${API_BASE_URL}/newhire`, payload);
      }

      setShowModal(false);
      loadData();
    } catch (error) {
      console.error("Failed to save new hire:", error);
    }
  };

  const handleToggleActive = async (newHire) => {
    try {
      const payload = {
        ...newHire,
        isActive: !newHire.isActive,
      };
      await axios.delete(`${API_BASE_URL}/newhire/${newHire.newHireId}`);
      loadData();
    } catch (error) {
      console.error("Failed to toggle active status:", error);
    }
  };

  const filteredNewHires = newHires.filter(
    (hire) =>
      `${hire.firstName} ${hire.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      hire.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (hire.company?.companyName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          New Hires Management
        </h1>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-flex items-center"
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
          Add New Hire
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search new hires..."
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

      <div className="bg-white shadow-md rounded-lg">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredNewHires.map((newHire) => (
              <tr key={`${newHire.newHireId}-${newHire.email}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {`${newHire.firstName} ${newHire.lastName}`}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{newHire.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {newHire.company?.companyName || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(newHire.startDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      newHire.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {newHire.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(newHire)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                  &nbsp;|&nbsp;
                  <button
                    onClick={() => handleToggleActive(newHire)}
                    className={
                      newHire.isActive
                        ? "text-red-600 hover:text-red-900"
                        : "text-green-600 hover:text-green-900"
                    }
                  >
                    {newHire.isActive ? "De-activate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">
              {selectedNewHire ? "Edit New Hire" : "Add New Hire"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company
                </label>
                <select
                  value={formData.companyId}
                  onChange={(e) =>
                    setFormData({ ...formData, companyId: e.target.value })
                  }
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a company</option>
                  {companies.map((company) => (
                    <option key={company.companyId} value={company.companyId}>
                      {company.companyName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) =>
                    setFormData({ ...formData, hireDate: e.target.value })
                  }
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="isActive"
                  className="ml-2 text-sm text-gray-700"
                >
                  Active
                </label>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  {selectedNewHire ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewHiresGrid;
