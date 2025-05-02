import React, { useState } from 'react';
import axios from '../api/axios';
import './GenerateReport.css';

const ManageVaccination = ({ token }) => {
  const [form, setForm] = useState({
    identifier: '',
    name: '',
    availableDozes: '',
    applicableClasses: '',
    title: '',
    scheduledDate: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Parse applicableClasses into array of ints
    const classesArray = form.applicableClasses
      .split(',')
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n));

    const payload = {
      identifier: form.identifier,
      name: form.name,
      availableDozes: parseInt(form.availableDozes, 10),
      applicableClasses: classesArray,
      title: form.title,
      scheduledDate: form.scheduledDate,
      location: form.location
    };

    try {
      await axios.post(
        '/vaccine-drive/addVaccineDrive',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Vaccination drive added successfully.');
      setForm({ identifier: '', name: '', availableDozes: '', applicableClasses: '', title: '', scheduledDate: '', location: '' });
    } catch (err) {
      setError(err.response?.data || 'Failed to add vaccination drive.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: { maxWidth: '600px', margin: '2rem auto', padding: '1.5rem', backgroundColor: '#fafafa', borderRadius: '8px', border: '1px solid #ddd' },
    field: { marginBottom: '1rem' },
    label: { display: 'block', marginBottom: '0.5rem', fontWeight: '500' },
    input: { width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' },
    button: { padding: '0.75rem 1.5rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    messageError: { color: '#f44336', marginBottom: '1rem', textAlign: 'center' },
    messageSuccess: { color: '#4caf50', marginBottom: '1rem', textAlign: 'center' }
  };

  return (
    <div id="grad" style={styles.container}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Book Vaccination Drive</h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.field}>
          <label style={styles.label}>Drive Identifier</label>
          <input type="text" name="identifier" value={form.identifier} onChange={handleChange} required style={styles.input} />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required style={styles.input} />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Title</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} required style={styles.input} />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Available Doses</label>
          <input type="number" name="availableDozes" value={form.availableDozes} onChange={handleChange} required style={styles.input} />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Applicable Classes (comma-separated)</label>
          <input type="text" name="applicableClasses" value={form.applicableClasses} onChange={handleChange} required placeholder="e.g. 5,6,7" style={styles.input} />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Scheduled Date & Time</label>
          <input type="datetime-local" name="scheduledDate" value={form.scheduledDate} onChange={handleChange} required style={styles.input} />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Location</label>
          <input type="text" name="location" value={form.location} onChange={handleChange} required style={styles.input} />
        </div>
        {error && <div style={styles.messageError}>{error}</div>}
        {success && <div style={styles.messageSuccess}>{success}</div>}
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Booking...' : 'Book Drive'}
        </button>
      </form>
    </div>
  );
};

export default ManageVaccination;
