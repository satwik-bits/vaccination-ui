import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationMenu from './NavigationMenu';
import axios from '../api/axios';
import './Dashboard.css'

const Dashboard = ({ token }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDrive, setEditingDrive] = useState(null);
  const [updatedDrive, setUpdatedDrive] = useState({
    identifier: '',
    name: '',
    title: '',
    scheduledDate: '',
    location: '',
    availableDozes: '',
    applicableClasses: []
  });

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.post(
          '/dashboard/overview',
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setData(res.data);
      } catch (e) {
        console.error(e);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  const handleEditClick = (drive) => {
    setEditingDrive(drive);
    setUpdatedDrive({
      identifier: drive.identifier,
      name: drive.name,
      title: drive.title,
      scheduledDate: new Date(drive.scheduledDate).toISOString().slice(0, 16),
      location: drive.location,
      availableDozes: drive.availableDozes,
      applicableClasses: drive.applicableClasses
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'applicableClasses') {
      setUpdatedDrive((prev) => ({
        ...prev,
        applicableClasses: value.split(',').map(cls => cls.trim())
      }));
    } else {
      setUpdatedDrive((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `/vaccine-drive/update/${editingDrive.identifier}`,
        updatedDrive,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedList = data.vaccinationDriveList.map((drive) =>
        drive.id === editingDrive.id ? { ...drive, ...updatedDrive } : drive
      );
      setData((prev) => ({ ...prev, vaccinationDriveList: updatedList }));
      setEditingDrive(null);
    } catch (e) {
      console.error(e);
      setError('Failed to update vaccination drive.');
    }
  };

  const styles = {
    container: { maxWidth: '900px', margin: '2rem auto', padding: '1.5rem', backgroundColor: '#E3D7FF', borderRadius: '8px', border: '1px solid #ddd' },
    header: { textAlign: 'center', marginBottom: '2rem' },
    statContainer: { display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' },
    statBox: { flex: '1', margin: '0 0.5rem', padding: '1rem', borderRadius: '8px', backgroundColor: '#F6A5A5', border: '1px solid #ccc', textAlign: 'center' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' },
    th: { border: '1px solid #ccc', padding: '10px', backgroundColor: '#f0f0f0', textAlign: 'left' },
    td: { border: '1px solid #ccc', padding: '10px' },
    button: { backgroundColor: '#007bff', color: 'white', padding: '8px 12px', border: 'none', cursor: 'pointer', borderRadius: '5px', fontWeight: 'bold' },
    formGroup: { marginBottom: '1rem' },
    input: { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginTop: '4px' }
  };

  return (
    <div id="grad" style={styles.container}>
      <NavigationMenu onNavigate={() => {}} />
      <h2 style={styles.header}>Dashboard Analytics</h2>

      {loading && <p>Loading dashboard data...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {data && (
        <>
          <div style={styles.statContainer}>
            <div style={styles.statBox}>
              <h3>Total Students</h3>
              <p>{data.totalStudents}</p>
            </div>
            <div style={styles.statBox}>
              <h3>Vaccinated Students</h3>
              <p>{data.vaccinatedStudents}</p>
            </div>
            <div style={styles.statBox}>
              <h3>Vaccinated Percentage</h3>
              <p>{data.vaccinatedPercentage}%</p>
            </div>
          </div>

          <h3>Upcoming Vaccination Drives</h3>
          {data.vaccinationDriveList.length > 0 ? (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Drive Identifier</th>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Scheduled Date</th>
                  <th style={styles.th}>Location</th>
                  <th style={styles.th}>Available Doses</th>
                  <th style={styles.th}>Applicable Classes</th>
                  <th style={styles.th}>Edit</th>
                </tr>
              </thead>
              <tbody>
                {data.vaccinationDriveList.map((drive) => (
                  <tr key={drive.id}>
                    <td style={styles.td}>{drive.driveIdentifier}</td>
                    <td style={styles.td}>{drive.title}</td>
                    <td style={styles.td}>{new Date(drive.scheduledDate).toLocaleString()}</td>
                    <td style={styles.td}>{drive.location}</td>
                    <td style={styles.td}>{drive.availableDozes}</td>
                    <td style={styles.td}>{drive.applicableClasses.join(', ')}</td>
                    <td style={styles.td}>
                      <button style={styles.button} onClick={() => handleEditClick(drive)}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ textAlign: 'center', marginTop: '1rem' }}>No vaccination drives available.</p>
          )}
        </>
      )}

      {/* Edit Form */}
      {editingDrive && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Edit Vaccination Drive</h3>
          <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
                                  <label>Identifier</label>
                                  <input
                                    type="text"
                                    name="identifier"
                                    value={updatedDrive.identifier}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    required
             />
          </div>
          <div style={styles.formGroup}>
                        <label>Name</label>
                        <input
                          type="text"
                          name="name"
                          value={updatedDrive.name}
                          onChange={handleInputChange}
                          style={styles.input}
                          required
               />
            </div>
            <div style={styles.formGroup}>
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={updatedDrive.title}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label>Scheduled Date</label>
              <input
                type="datetime-local"
                name="scheduledDate"
                value={updatedDrive.scheduledDate}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={updatedDrive.location}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label>Available Doses</label>
              <input
                type="number"
                name="availableDozes"
                value={updatedDrive.availableDozes}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label>Applicable Classes (comma-separated)</label>
              <input
                type="text"
                name="applicableClasses"
                value={updatedDrive.applicableClasses.join(', ')}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
            </div>
            <button type="submit" style={styles.button}>Update Drive</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
