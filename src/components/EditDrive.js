// src/components/EditDrive.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

export default function EditDrive({ token }) {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    scheduledDate: '',
    location: '',
    availableDozes: '',
    applicableClasses: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1) On mount, fetch the overview and pull out our drive
  useEffect(() => {
    async function load() {
      try {
        const res = await axios.post(
          '/dashboard/overview',
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const drive = res.data.vaccinationDriveList
          .find(d => d.driveIdentifier === identifier);
        if (!drive) {
          setError('Drive not found');
        } else {
          setForm({
            title: drive.title,
            scheduledDate: drive.scheduledDate.slice(0,16), // yyyy-MM-ddTHH:mm
            location: drive.location,
            availableDozes: drive.availableDozes,
            applicableClasses: drive.applicableClasses.join(', ')
          });
        }
      } catch {
        setError('Failed to load drive');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [identifier, token]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await axios.put(
        `/vaccine-drive/update/${identifier}`,
        {
          title: form.title,
          scheduledDate: form.scheduledDate,
          location: form.location,
          availableDozes: parseInt(form.availableDozes,10),
          applicableClasses: form.applicableClasses.split(',').map(n=>parseInt(n.trim(),10))
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/dashboard', { replace: true });
    } catch {
      setError('Update failed');
    }
  };

  if (loading) return <p>Loading…</p>;
  if (error)   return <p style={{color:'red'}}>{error}</p>;

  return (
    <div style={{ maxWidth:600, margin:'2rem auto', padding:20, border:'1px solid #ccc', borderRadius:8 }}>
      <h2>Edit Vaccination Drive</h2>
      <form onSubmit={handleSubmit}>
        {[
          ['Title','title','text'],
          ['Scheduled Date','scheduledDate','datetime-local'],
          ['Location','location','text'],
          ['Available Doses','availableDozes','number'],
          ['Applicable Classes (comma-separated)','applicableClasses','text']
        ].map(([label,name,type])=>(
          <div key={name} style={{ marginBottom:16 }}>
            <label style={{ display:'block', marginBottom:4 }}>{label}</label>
            <input
              name={name}
              type={type}
              value={form[name]}
              onChange={handleChange}
              required
              style={{ width:'100%', padding:8, borderRadius:4, border:'1px solid #ccc' }}
            />
          </div>
        ))}
        <button
          type="submit"
          style={{ padding:'0.75rem 1.5rem', background:'#007bff', color:'#fff', border:'none', borderRadius:4, cursor:'pointer' }}
        >
          Update Drive
        </button>
      </form>
    </div>
  );
}
