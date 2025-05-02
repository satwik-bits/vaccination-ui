import React from 'react';

const NavigationMenu = ({ onNavigate }) => (
  <nav style={navStyle}>
    <button style={btnStyle} onClick={() => onNavigate('dashboard')} className="download-button">
      Dashboard
    </button>
    <button style={btnStyle} onClick={() => onNavigate('add-student')} className="download-button">
      Add/Manage Students
    </button>
    <button style={btnStyle} onClick={() => onNavigate('manage-vaccination')} className="download-button">
      Manage Vaccination
    </button>
    <button onClick={() => onNavigate('register-vaccine')} className="download-button">
      Register Vaccine
    </button>
    <button style={btnStyle} onClick={() => onNavigate('generate-report')} className="download-button">
      Generate Reports
    </button>
  </nav>
);

const navStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '1rem',
  padding: '1rem',
  borderBottom: '2px solid #ccc',
  marginBottom: '1.5rem'
};

const btnStyle = {
  padding: '0.5rem 1rem',
  fontSize: '1rem',
  cursor: 'pointer',
  border: '1px solid #007bff',
  backgroundColor: 'white',
  color: '#007bff',
  borderRadius: '4px'
};

export default NavigationMenu;
