
import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import AddStudent from './components/AddStudent';
import ManageVaccination from './components/ManageVaccination';
import GenerateReport from './components/GenerateReport';
import EditDrive from './components/EditDrive';
import NavigationMenu from './components/NavigationMenu';
import RegisterVaccination from './components/RegisterVaccination';
import './App.css';

export default function App() {
  const [token, setToken] = useState('');
  const [page, setPage] = useState('dashboard');
  const [editId, setEditId] = useState('');

  if (!token) {
    return <LoginForm setToken={setToken} />;
  }

  let Content;
  switch (page) {
    case 'add-student':
      Content = <AddStudent token={token} />;
      break;
    case 'manage-vaccination':
      Content = <ManageVaccination token={token} />;
      break;
    case 'generate-report':
      Content = <GenerateReport token={token} />;
      break;
    case 'edit-drive':
      Content = <EditDrive token={token} identifier={editId} onDone={() => setPage('dashboard')} />;
      break;
    case 'register-vaccine':
      Content = <RegisterVaccination token={token} />;
      break;
    default:
      // Pass onEdit callback for Dashboard
      Content = <Dashboard token={token} setToken={setToken} onEdit={(id) => { setEditId(id); setPage('edit-drive'); }} />;
      break;
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">
        School Vaccination Portal
      </h1>
      <NavigationMenu onNavigate={(p) => setPage(p)} />
      <div className="dashboard-content">
        {Content}
      </div>
    </div>
  );

}
