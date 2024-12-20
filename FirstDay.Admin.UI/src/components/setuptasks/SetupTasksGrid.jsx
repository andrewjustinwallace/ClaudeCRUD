import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import Modal from "../shared/Modal";
import SetupTaskForm from "./components/SetupTaskForm";
import SetupTaskTable from "./components/SetupTaskTable";

const SetupTasksGrid = () => {
  const [tasks, setTasks] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [newHires, setNewHires] = useState([]);
  const [setupTypes, setSetupTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [editForm, setEditForm] = useState({
    taskId: 0,
    setupType: "",
    setupTypeId: 0,
    itEmployeeId: 0,
    itEmployeeName: "",
    newHireId: 0,
    newHireName: "",
    companyId: 0,
    companyName: "",
    scheduledDate: new Date().toISOString().split("T")[0],
    isCompleted: false,
    completedDate: null,
    notes: "",
    details: "",
    createdDate: null,
    modifiedDate: null,
    onChange: (newForm) => setEditForm(newForm),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all required data
        const [companiesRes, employeesRes, setupTypesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/company`),
          axios.get(`${API_BASE_URL}/itemployee`),
          axios.get(`${API_BASE_URL}/setuptype`),
        ]);

        setCompanies(companiesRes.data);
        setEmployees(employeesRes.data);
        setSetupTypes(setupTypesRes.data);

        // If a company is selected, fetch its tasks and new hires
        if (selectedCompany) {
          const [tasksRes, newHiresRes] = await Promise.all([
            axios.get(`${API_BASE_URL}/setuptask/company/${selectedCompany}`),
            axios.get(`${API_BASE_URL}/newhire/company/${selectedCompany}`),
          ]);
          setTasks(tasksRes.data);
          setNewHires(newHiresRes.data);
        }

        setLoading(false);
      } catch (err) {
        setError("Error fetching data");
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCompany]);

  const handleEdit = (task) => {
    setEditingId(task.taskId);
    setEditForm({
      ...task,
      scheduledDate: new Date(task.scheduledDate).toISOString().split("T")[0],
      onChange: (newForm) => setEditForm(newForm),
    });
  };

  const handleSave = async (taskId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/setuptask`, editForm);
      if (response.data) {
        const refreshResponse = await axios.get(
          `${API_BASE_URL}/setuptask/company/${selectedCompany}`
        );
        setTasks(refreshResponse.data);
        setEditingId(null);
      }
    } catch (err) {
      setError("Error updating task");
    }
  };

  const handleAdd = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/setuptask`, editForm);
      if (response.data) {
        const refreshResponse = await axios.get(
          `${API_BASE_URL}/setuptask/company/${selectedCompany}`
        );
        setTasks(refreshResponse.data);
        setIsAddModalOpen(false);
        setEditForm({
          taskId: 0,
          setupType: "",
          setupTypeId: 0,
          itEmployeeId: 0,
          itEmployeeName: "",
          newHireId: 0,
          newHireName: "",
          companyId: selectedCompany,
          companyName: companies.find(c => c.companyId === selectedCompany)?.companyName || "",
          scheduledDate: new Date().toISOString().split("T")[0],
          isCompleted: false,
          completedDate: null,
          notes: "",
          details: "",
          createdDate: null,
          modifiedDate: null,
          onChange: (newForm) => setEditForm(newForm),
        });
      }
    } catch (err) {
      setError("Error adding task");
    }
  };

  const handleComplete = async (taskId, itEmployeeId, newHireId, notes) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/setuptask/complete`, {
        taskId,
        itEmployeeId,
        newHireId,
        notes
      });
      if (response.data) {
        const refreshResponse = await axios.get(
          `${API_BASE_URL}/setuptask/company/${selectedCompany}`
        );
        setTasks(refreshResponse.data);
      }
    } catch (err) {
      setError("Error completing task");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({
      taskId: 0,
      setupType: "",
      setupTypeId: 0,
      itEmployeeId: 0,
      itEmployeeName: "",
      newHireId: 0,
      newHireName: "",
      companyId: selectedCompany,
      companyName: companies.find(c => c.companyId === selectedCompany)?.companyName || "",
      scheduledDate: new Date().toISOString().split("T")[0],
      isCompleted: false,
      completedDate: null,
      notes: "",
      details: "",
      createdDate: null,
      modifiedDate: null,
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

  const filteredTasks = tasks.filter((task) => {
    const searchString = searchTerm.toLowerCase();
    return (
      task.setupType?.toLowerCase().includes(searchString) ||
      task.itEmployeeName?.toLowerCase().includes(searchString) ||
      task.newHireName?.toLowerCase().includes(searchString) ||
      task.companyName?.toLowerCase().includes(searchString)
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Setup Tasks</h1>
        <div className="flex space-x-4">
          <select
            className="px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={selectedCompany || ""}
            onChange={(e) => setSelectedCompany(Number(e.target.value))}
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
              Add Task
            </button>
          )}
        </div>
      </div>

      {selectedCompany ? (
        <>
          <Modal
            isOpen={isAddModalOpen}
            onClose={() => {
              setIsAddModalOpen(false);
              handleCancel();
            }}
            title="Add New Setup Task"
          >
            <SetupTaskForm
              form={editForm}
              employees={employees}
              newHires={newHires}
              setupTypes={setupTypes}
              onSubmit={handleAdd}
              onCancel={() => setIsAddModalOpen(false)}
            />
          </Modal>

          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tasks..."
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

          <SetupTaskTable
            tasks={filteredTasks}
            onEdit={handleEdit}
            editingId={editingId}
            handleSave={handleSave}
            handleCancel={handleCancel}
            editForm={editForm}
            handleComplete={handleComplete}
            employees={employees}
            newHires={newHires}
            setupTypes={setupTypes}
          />
        </>
      ) : (
        <div className="text-center text-gray-500 mt-8">
          Please select a company to view and manage setup tasks
        </div>
      )}
    </div>
  );
};

export default SetupTasksGrid;