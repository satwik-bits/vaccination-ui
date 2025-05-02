import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import './GenerateReport.css';

const GenerateReport = ({ token }) => {
  const [records, setRecords] = useState([]);
  const [vaccineFilter, setVaccineFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/register/display', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Fetched Data:', res.data); // Log fetched data for debugging
        setRecords(res.data || []);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };
    fetchData();
  }, [token]);

  const handleDownload = async (type) => {
    try {
      const res = await axios.get('/register/download', {
        params: { fileDownloadType: type },
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` },
      });

      const url = URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `vaccination_report.${type.toLowerCase()}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(`Download ${type} failed:`, err);
    }
  };

  const filtered = records.filter((rec) =>
    rec.vaccineName?.toLowerCase().includes(vaccineFilter.toLowerCase())
  );

  return (
    <div id="grad" className="container">
      <h2 className="heading">Vaccination Report</h2>

      <div className="filters">
        <input
          type="text"
          value={vaccineFilter}
          onChange={(e) => setVaccineFilter(e.target.value)}
          placeholder="🔍 Filter by Vaccine Name"
          className="filter-input"
        />
        <div className="buttons">
          <button
            onClick={() => handleDownload('CSV')}
            className="download-button"
          >
            Download CSV
          </button>
          <button
            onClick={() => handleDownload('PDF')}
            className="download-button"
          >
            Download PDF
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="vaccination-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Vaccination Status</th>
              <th>Vaccination Date</th>
              <th>Vaccine Name</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-records">No records found</td>
              </tr>
            ) : (
              filtered.map((r, i) => (
                <tr key={i} className="table-row">
                  <td>{r.studentName}</td>
                  <td>
                    <span className={`status ${r.vaccinated ? 'vaccinated' : 'not-vaccinated'}`}>
                      {r.vaccinated ? 'Vaccinated' : 'Not Vaccinated'}
                    </span>
                  </td>
                  <td>{r.vaccinationDate ? new Date(r.vaccinationDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{r.vaccineName}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GenerateReport;
