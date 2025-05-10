
import React, { useState } from 'react';
import axios from '../api/axios';
import './AddStudent.css';

const AddStudent = ({ token }) => {
  const [mode, setMode] = useState('individual'); // 'individual' or 'bulk'
  const [form, setForm] = useState({
    identifier: '', name: '', age: '', classId: '', mobileNo: '', isVaccinated: false
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handle form field changes
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle individual add submit
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    const payload = {
      identifier: form.identifier,
      name: form.name,
      age: parseInt(form.age, 10),
      classId: parseInt(form.classId, 10),
      mobileNo: form.mobileNo,
      isVaccinated: form.isVaccinated
    };
    try {
      await axios.post(
        '/student/add',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Student added successfully.');
      setForm({ identifier: '', name: '', age: '', classId: '', mobileNo: '', isVaccinated: false });
    } catch (err) {
      setError(err.response?.data || 'Failed to add student.');
    } finally {
      setLoading(false);
    }
  };

  // Handle bulk file selection
  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };

  // Handle bulk upload submit
  const handleBulkUpload = async e => {
    e.preventDefault();
    if (!file) {
      setError('Please select a CSV file.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      await axios.post(
        '/student/uploadCsv',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setSuccess('Bulk upload successful.');
      setFile(null);
      e.target.reset();
    } catch (err) {
      setError(err.response?.data || 'Bulk upload failed.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: { maxWidth: '600px', margin: '2rem auto', padding: '1.5rem', backgroundColor: '#fafafa', borderRadius: '8px', border: '1px solid #ddd' },
    tabBar: { display: 'flex', justifyContent: 'center', marginBottom: '2rem' },
    tabBtn: selected => ({
      padding: '0.5rem 1rem',
      margin: '0 0.5rem',
      cursor: 'pointer',
      border: selected ? '2px solid #007bff' : '1px solid #ccc',
      backgroundColor: selected ? '#e7f1ff' : 'white',
      color: 'black',
      borderRadius: '4px'
    }),
    field: { marginBottom: '1rem' },
    label: { display: 'block', marginBottom: '0.5rem', fontWeight: '500' },
    input: { width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' },
    checkbox: { marginRight: '0.5rem' },
    button: { padding: '0.75rem 1.5rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    messageError: { color: '#f44336', marginBottom: '1rem', textAlign: 'center' },
    messageSuccess: { color: '#4caf50', marginBottom: '1rem', textAlign: 'center' }
  };

  return (
    <div id="grad" style={styles.container}>
      <div style={styles.tabBar}>
        <button style={styles.tabBtn(mode === 'individual')} onClick={() => { setMode('individual'); setError(null); setSuccess(null); }}>
          Individual Entry
        </button>
        <button style={styles.tabBtn(mode === 'bulk')} onClick={() => { setMode('bulk'); setError(null); setSuccess(null); }}>
          Bulk Upload
        </button>
      </div>

      {error && <div style={styles.messageError}>{error}</div>}
      {success && <div style={styles.messageSuccess}>{success}</div>}

      {mode === 'individual' ? (
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Identifier</label>
            <input
              type="text" name="identifier" value={form.identifier} onChange={handleChange} required style={styles.input} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required style={styles.input} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Age</label>
            <input type="number" name="age" value={form.age} onChange={handleChange} required style={styles.input} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Class ID</label>
            <input type="number" name="classId" value={form.classId} onChange={handleChange} required style={styles.input} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Mobile No</label>
            <input type="text" name="mobileNo" value={form.mobileNo} onChange={handleChange} required style={styles.input} />
          </div>
          <div style={styles.field}>
            <label>
              <input type="checkbox" name="isVaccinated" checked={form.isVaccinated} onChange={handleChange} style={styles.checkbox} />
              Vaccinated
            </label>
          </div>
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Adding...' : 'Add Student'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleBulkUpload}>
          <div style={styles.field}>
            <label style={styles.label}>Upload CSV File</label>
            <input type="file" accept=".csv" onChange={handleFileChange} />
          </div>
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Uploading...' : 'Upload File'}
          </button>
        </form>
      )}
    </div>
  );
};

export default AddStudent;
