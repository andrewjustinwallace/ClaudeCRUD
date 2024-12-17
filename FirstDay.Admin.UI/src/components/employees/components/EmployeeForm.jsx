import React from "react";

const EmployeeForm = ({ form, onSubmit, onCancel }) => (
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
          onChange={(e) =>
            form.onChange({ ...form, firstName: e.target.value })
          }
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
          onChange={(e) => form.onChange({ ...form, lastName: e.target.value })}
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
        onChange={(e) => form.onChange({ ...form, email: e.target.value })}
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          value={form.username}
          onChange={(e) => form.onChange({ ...form, username: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          value={form.password}
          onChange={(e) => form.onChange({ ...form, password: e.target.value })}
          placeholder={
            form.itEmployeeId !== 0 ? "Leave blank to keep current" : ""
          }
        />
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Hire Date
      </label>
      <input
        type="date"
        className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        value={form.hireDate}
        onChange={(e) => form.onChange({ ...form, hireDate: e.target.value })}
      />
    </div>
    <div>
      <label className="flex items-center">
        <input
          type="checkbox"
          className="form-checkbox h-4 w-4 text-blue-600"
          checked={form.isActive}
          onChange={(e) =>
            form.onChange({ ...form, isActive: e.target.checked })
          }
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
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        Save
      </button>
    </div>
  </div>
);

export default EmployeeForm;
