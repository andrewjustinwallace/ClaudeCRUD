import React, { useState } from "react";
import SetupTaskForm from "./SetupTaskForm";

const SetupTaskTable = ({
  tasks,
  onEdit,
  editingId,
  handleSave,
  handleCancel,
  editForm,
  handleComplete,
  employees,
  newHires,
  setupTypes,
}) => {
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completionNotes, setCompletionNotes] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);

  const openCompleteModal = (task) => {
    setSelectedTask(task);
    setShowCompleteModal(true);
    setCompletionNotes("");
  };

  const handleCompleteSubmit = () => {
    handleComplete(
      selectedTask.taskId,
      selectedTask.itEmployeeId,
      selectedTask.newHireId,
      completionNotes
    );
    setShowCompleteModal(false);
    setSelectedTask(null);
    setCompletionNotes("");
  };

  const CompleteTaskModal = () => (
    <div
      className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full ${
        showCompleteModal ? "" : "hidden"
      }`}
    >
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Complete Task
          </h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              rows="3"
              className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
              value={completionNotes}
              onChange={(e) => setCompletionNotes(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowCompleteModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCompleteSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="overflow-x-auto">
      <CompleteTaskModal />
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Setup Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              IT Employee
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              New Hire
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Scheduled Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tasks.map((task) => (
            <tr key={task.taskId}>
              {editingId === task.taskId ? (
                <td colSpan="6" className="px-6 py-4">
                  <SetupTaskForm
                    form={editForm}
                    employees={employees}
                    newHires={newHires}
                    setupTypes={setupTypes}
                    onSubmit={() => handleSave(task.taskId)}
                    onCancel={handleCancel}
                  />
                </td>
              ) : (
                <>
                  <td className="px-6 py-4">{task.setupType}</td>
                  <td className="px-6 py-4">{task.itEmployeeName}</td>
                  <td className="px-6 py-4">{task.newHireName}</td>
                  <td className="px-6 py-4">
                    {new Date(task.scheduledDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        task.isCompleted
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {task.isCompleted ? "Completed" : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {!task.isCompleted && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onEdit(task)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openCompleteModal(task)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Complete
                        </button>
                      </div>
                    )}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SetupTaskTable;
