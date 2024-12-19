import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

const ITSetupGrid = () => {
  const [setupTypes, setSetupTypes] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSetupType, setSelectedSetupType] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    setupTypeId: 0,
    name: "",
    description: "",
    estimatedTime: 0,
    priority: 1,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [setupTypesResponse, statisticsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/setuptype`),
        axios.get(`${API_BASE_URL}/setuptype/statistics`),
      ]);
      setSetupTypes(setupTypesResponse.data || []);
      setStatistics(statisticsResponse.data || []);
    } catch (error) {
      console.error("Failed to load data:", error);
      setSetupTypes([]);
      setStatistics([]);
    }
  };

  const handleAdd = () => {
    setSelectedSetupType(null);
    setFormData({
      setupTypeId: 0,
      name: "",
      description: "",
      estimatedTime: 0,
      priority: 1,
    });
    setShowModal(true);
  };

  const handleEdit = (setupType) => {
    setSelectedSetupType(setupType);
    setFormData({
      setupTypeId: setupType.setupTypeId,
      name: setupType.setupName || "",
      description: setupType.description || "",
      estimatedTime: setupType.estimatedTime || 0,
      priority: setupType.priority || 1,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        estimatedTime: parseInt(formData.estimatedTime) || 0,
        priority: parseInt(formData.priority) || 1,
      };

      await axios.post(`${API_BASE_URL}/setuptype`, payload);
      setShowModal(false);
      loadData();
    } catch (error) {
      console.error("Failed to save setup type:", error);
    }
  };

  const filteredSetupTypes = setupTypes.filter((setup) => {
    if (!setup || !searchTerm) return true;

    const name = setup.name || "";
    const description = setup.description || "";
    const searchLower = searchTerm.toLowerCase();

    return (
      name.toLowerCase().includes(searchLower) ||
      description.toLowerCase().includes(searchLower)
    );
  });

  const getStatisticsForSetupType = (setupTypeId) => {
    return (
      statistics.find((stat) => stat?.setupTypeId === setupTypeId) || {
        totalAssignments: 0,
        completedAssignments: 0,
        averageCompletionTime: 0,
      }
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">IT Setup Types</h1>
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
          Add Setup Task Type
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search setup types..."
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
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Est. Time (min)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statistics
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
            {filteredSetupTypes.map((setupType) => {
              const stats = getStatisticsForSetupType(setupType?.setupTypeId);
              return (
                <tr key={setupType?.setupTypeId || Math.random()}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {setupType?.setupName || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {setupType?.description || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {setupType?.estimatedTime || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {setupType?.priority || 1}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      <div>Total: {stats?.totalAssignments || 0}</div>
                      <div>Completed: {stats?.completedAssignments || 0}</div>
                      <div>
                        Avg Time:{" "}
                        {stats?.averageCompletionTime
                          ? `${Math.round(stats.averageCompletionTime)}min`
                          : "N/A"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(setupType)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">
              {selectedSetupType ? "Edit Setup Type" : "Add Setup Type"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.setupName}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows="3"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Estimated Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.estimatedTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        estimatedTime: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Priority
                  </label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="1"
                    max="5"
                    required
                  />
                </div>
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
                  {selectedSetupType ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ITSetupGrid;
