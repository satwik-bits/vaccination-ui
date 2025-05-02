//// src/components/RegisterVaccination.jsx
//import React, { useState } from 'react';
//import axios from '../api/axios';
//
//const RegisterVaccination = ({ token }) => {
//  const [studentIdentifier, setStudentIdentifier] = useState('');
//  const [driveIdentifier, setDriveIdentifier] = useState('');
//  const [message, setMessage] = useState('');
//
//  const handleRegister = async (e) => {
//    e.preventDefault();
//    try {
//      const response = await axios.post('/register/vaccine', null, {
//        params: { studentIdentifier, driveIdentifier },
//        headers: {
//          Authorization: `Bearer ${token}`
//        }
//      });
//      setMessage(response.data);
//    } catch (err) {
//      setMessage(err.response?.data || 'Registration failed');
//    }
//  };
//
//  return (
//    <div className="container">
//      <h2 className="heading">Register Student for Vaccination</h2>
//      <form onSubmit={handleRegister} className="filters">
//        <input
//          type="text"
//          placeholder="Student Identifier"
//          className="filter-input"
//          value={studentIdentifier}
//          onChange={(e) => setStudentIdentifier(e.target.value)}
//          required
//        />
//        <input
//          type="text"
//          placeholder="Drive Identifier"
//          className="filter-input"
//          value={driveIdentifier}
//          onChange={(e) => setDriveIdentifier(e.target.value)}
//          required
//        />
//        <button type="submit" className="download-button">Register</button>
//      </form>
//      {message && <p className="heading">{message}</p>}
//    </div>
//  );
//};
//
//export default RegisterVaccination;


import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import './RegisterVaccination.css';


const RegisterVaccination = ({ token }) => {
  const [students, setStudents] = useState([]);
  const [drives, setDrives] = useState([]);
  const [studentIdentifier, setStudentIdentifier] = useState('');
  const [driveIdentifier, setDriveIdentifier] = useState('');
  const [message, setMessage] = useState('');

  // Fetch students and drives on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, drivesRes] = await Promise.all([
          axios.get('/student/fetchAll', {params: { pageNo: 0, pageSize: 1000 }, headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/vaccine-drive/fetchAllDrives', {params: { pageNo: 0, pageSize: 1000 }, headers: { Authorization: `Bearer ${token}` } })
        ]);
        setStudents(studentsRes.data || []);
        setDrives(drivesRes.data || []);
      } catch (err) {
        setMessage('Failed to load data');
      }
    };

    fetchData();
  }, [token]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/register/vaccine', null, {
        params: { studentIdentifier, driveIdentifier },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessage(response.data);
    } catch (err) {
      setMessage('Registration failed');
    }
  };

  return (
    <div id = "grad" className="container">
      <h2 className="heading">Register Student for Vaccination</h2>
      <form onSubmit={handleRegister} className="filters">
        <select
          className="filter-input"
          value={studentIdentifier}
          onChange={(e) => setStudentIdentifier(e.target.value)}
          required
        >
          <option value="">Select Student</option>
          {students.map((student) => (
            <option key={student.studentIdentifier} value={student.studentIdentifier}>
              {student.name} ({student.studentIdentifier})
            </option>
          ))}
        </select>

        <select
          className="filter-input"
          value={driveIdentifier}
          onChange={(e) => setDriveIdentifier(e.target.value)}
          required
        >
          <option value="">Select Vaccine Drive</option>
          {drives.map((drive) => (
            <option key={drive.driveIdentifier} value={drive.driveIdentifier}>
              {drive.name} ({drive.driveIdentifier})
            </option>
          ))}
        </select>

        <button type="submit" className="download-button">Register</button>
      </form>

      {message && (
        <div className={message === 'Registration failed' || message === 'Failed to load data' ? 'error-message' : 'success-message'}>
          {message === 'Registration failed' || message === 'Failed to load data' ? (
            <span>{message}</span>
          ) : (
            <span>{message}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default RegisterVaccination;
