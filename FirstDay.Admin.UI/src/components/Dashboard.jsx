import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

const Dashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [newHires, setNewHires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesRes, employeesRes, newHiresRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/company`),
          axios.get(`${API_BASE_URL}/itemployee`),
          axios.get(`${API_BASE_URL}/newhire`),
        ]);

        setCompanies(companiesRes.data);
        setEmployees(employeesRes.data);
        setNewHires(newHiresRes.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching dashboard data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Companies Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Companies</h2>
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {companies.length}
          </div>
          <p className="text-gray-600">Active Companies</p>
        </div>

        {/* Employees Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">IT Employees</h2>
          <div className="text-4xl font-bold text-green-600 mb-2">
            {employees.length}
          </div>
          <p className="text-gray-600">Active Employees</p>
        </div>

        {/* New Hires Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">New Hires</h2>
          <div className="text-4xl font-bold text-purple-600 mb-2">
            {newHires.length}
          </div>
          <p className="text-gray-600">Total New Hires</p>
        </div>
      </div>

      {/* Recent New Hires */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Recent New Hires</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {newHires.slice(0, 5).map((hire) => (
                <tr key={hire.newHireId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {hire.firstName} {hire.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {hire.companyName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(hire.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        new Date(hire.startDate) > new Date()
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {new Date(hire.startDate) > new Date()
                        ? "Pending"
                        : "Active"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Companies List */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Companies Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <div
              key={company.companyId}
              className="bg-white rounded-lg shadow p-6"
            >
              <h3 className="text-lg font-semibold mb-2">
                {company.companyName}
              </h3>
              <div className="text-sm text-gray-600">
                <p>
                  Created: {new Date(company.createdDate).toLocaleDateString()}
                </p>
                <p
                  className={`mt-2 ${
                    company.isActive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  Status: {company.isActive ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
