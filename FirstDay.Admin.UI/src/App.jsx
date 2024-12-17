import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainMenu from './components/navigation/MainMenu';
import Dashboard from './components/Dashboard';
import CompaniesGrid from './components/companies/CompaniesGrid';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <MainMenu />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/companies" element={<CompaniesGrid />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;