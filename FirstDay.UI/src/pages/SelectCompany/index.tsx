import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Company {
  companyId: number;
  companyName: string;
}

export default function SelectCompany() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!user.authenticated) {
      navigate('/login');
      return;
    }
    
    if (user.companies?.length === 1) {
      handleCompanySelect(user.companies[0].companyId);
    }
  }, []);

  const handleCompanySelect = (companyId: number) => {
    const updatedUser = {
      ...user,
      selectedCompanyId: companyId
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // Always navigate to tasks for the selected company
    navigate(`/tasks/employee/${user.employeeId}?companyId=${companyId}`);
  };

  if (!user.companies || user.companies.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">No Companies Available</h2>
          <p className="mt-2 text-gray-600">You don't have access to any companies.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Select a Company
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Choose a company to view your tasks
          </p>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            {user.companies.map((company: Company) => (
              <button
                key={company.companyId}
                onClick={() => handleCompanySelect(company.companyId)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150"
              >
                <span className="text-lg font-medium text-gray-900">
                  {company.companyName}
                </span>
                <span className="text-indigo-600">
                  <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}