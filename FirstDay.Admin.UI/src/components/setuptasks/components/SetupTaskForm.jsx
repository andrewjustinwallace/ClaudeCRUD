import React from "react";

const SetupTaskForm = ({
  form,
  employees,
  newHires,
  setupTypes,
  onSubmit,
  onCancel,
}) => {
  return (
    <form className="p-4" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Setup Type
          </label>
          <select
            value={form.setupTypeId || ""}
            onChange={(e) => {
              const selectedType = setupTypes.find(
                (type) => type.setupTypeId === Number(e.target.value)
              );
              form.onChange({
                ...form,
                setupTypeId: Number(e.target.value),
                setupType: selectedType ? selectedType.setupName : "",
              });
            }}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Setup Type</option>
            {setupTypes.map((type) => (
              <option key={type.setupTypeId} value={type.setupTypeId}>
                {type.setupName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            IT Employee
          </label>
          <select
            value={form.itEmployeeId || ""}
            onChange={(e) => {
              const selectedEmployee = employees.find(
                (emp) => emp.itEmployeeId === Number(e.target.value)
              );
              form.onChange({
                ...form,
                itEmployeeId: Number(e.target.value),
                itEmployeeName: selectedEmployee
                  ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}`
                  : "",
              });
            }}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select IT Employee</option>
            {employees.map((employee) => (
              <option key={employee.itEmployeeId} value={employee.itEmployeeId}>
                {employee.firstName} {employee.lastName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            New Hire
          </label>
          <select
            value={form.newHireId || ""}
            onChange={(e) => {
              const selectedHire = newHires.find(
                (hire) => hire.newHireId === Number(e.target.value)
              );
              form.onChange({
                ...form,
                newHireId: Number(e.target.value),
                newHireName: selectedHire
                  ? `${selectedHire.firstName} ${selectedHire.lastName}`
                  : "",
              });
            }}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select New Hire</option>
            {newHires.map((hire) => (
              <option key={hire.newHireId} value={hire.newHireId}>
                {hire.firstName} {hire.lastName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Scheduled Date
          </label>
          <input
            type="date"
            value={form.scheduledDate || ""}
            onChange={(e) =>
              form.onChange({ ...form, scheduledDate: e.target.value })
            }
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Details
          </label>
          <textarea
            value={form.details || ""}
            onChange={(e) =>
              form.onChange({ ...form, details: e.target.value })
            }
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows="3"
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

export default SetupTaskForm;
