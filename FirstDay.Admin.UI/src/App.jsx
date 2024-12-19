import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainMenu from "./components/navigation/MainMenu";
import Dashboard from "./components/Dashboard";
import CompaniesGrid from "./components/companies/CompaniesGrid";
import EmployeesGrid from "./components/employees/EmployeesGrid";
import NewHiresGrid from "./components/newhires/NewHiresGrid";
import ITSetupGrid from "./components/itsetup/ITSetupGrid";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <MainMenu />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/companies" element={<CompaniesGrid />} />
          <Route path="/employees" element={<EmployeesGrid />} />
          <Route path="/newhire" element={<NewHiresGrid />} />
          <Route path="/itsetup" element={<ITSetupGrid />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;