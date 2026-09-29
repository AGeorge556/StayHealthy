import React, { useState, useEffect } from 'react';
import './ReportsLayout.css';

const ReportsLayout = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    // Function to fetch user reports
    const fetchReports = async () => {
      setLoading(true);
      try {
        // In a real application, this would be an API call
        // For now, we'll use mock data
        const mockReports = [
          { 
            id: 1, 
            date: '2023-04-10', 
            type: 'Blood Test', 
            doctor: 'Dr. Sarah Johnson',
            summary: 'Normal blood count, slightly elevated cholesterol',
            fileUrl: '/reports/report_viewer.html?type=blood',
            fileName: 'blood_test_report.html'
          },
          { 
            id: 2, 
            date: '2023-03-15', 
            type: 'X-Ray', 
            doctor: 'Dr. Michael Chen',
            summary: 'No fractures detected, minor inflammation',
            fileUrl: '/reports/report_viewer.html?type=xray',
            fileName: 'xray_report.html'
          },
          { 
            id: 3, 
            date: '2023-02-22', 
            type: 'General Checkup', 
            doctor: 'Dr. Emily Rodriguez',
            summary: 'Patient in good health, recommended regular exercise',
            fileUrl: '/reports/report_viewer.html?type=general',
            fileName: 'general_checkup_report.html'
          },
          { 
            id: 4, 
            date: '2023-01-05', 
            type: 'Allergy Test', 
            doctor: 'Dr. David Williams',
            summary: 'Mild allergic reaction to pollen detected',
            fileUrl: '/reports/report_viewer.html?type=allergy',
            fileName: 'allergy_test_report.html'
          }
        ];

        // Simulate network delay
        setTimeout(() => {
          setReports(mockReports);
          setLoading(false);
        }, 800);
      } catch (err) {
        setError('Failed to load reports. Please try again later.');
        setLoading(false);
      }
    };

    // Check if user is logged in
    const authToken = sessionStorage.getItem('auth-token');
    const email = sessionStorage.getItem('email');
    
    if (authToken && email) {
      fetchReports();
    } else {
      setError('Please log in to view your reports');
      setLoading(false);
    }
  }, []);

  // Format date from YYYY-MM-DD to Month DD, YYYY
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle view report action
  const handleViewReport = (report) => {
    setViewingReport(report);
    setReportModalOpen(true);
    
    // Open the HTML report in a new tab
    window.open(report.fileUrl, '_blank');
  };

  // Handle print report action
  const handlePrintReport = (report) => {
    // Open the report in a new tab and trigger print
    const printWindow = window.open(report.fileUrl, '_blank');
    if (printWindow) {
      setTimeout(() => {
        try {
          printWindow.print();
        } catch (e) {
          console.error('Print dialog could not be opened automatically', e);
        }
      }, 1000);
    }
  };

  // Handle download report action
  const handleDownloadReport = (report) => {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = report.fileUrl;
    link.download = report.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show instructions alert with a delay to ensure the click is processed
    setNotice('To save as PDF: use your browser\'s Print function and select "Save as PDF" as the destination.');
  };

  // Close the report modal
  const closeReportModal = () => {
    setReportModalOpen(false);
    setViewingReport(null);
  };

  if (loading) {
    return (
      <main className="page">
        <div className="state" role="status">
          <div className="spinner" aria-hidden="true"></div>
          <p>Loading your reports...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page">
        <div className="alert alert--error" role="alert">{error}</div>
      </main>
    );
  }

  return (
    <main className="page">
      <header className="page__header">
        <h1>Your medical reports</h1>
        {reports.length > 0 && (
          <p>You have <strong>{reports.length}</strong> medical reports available.</p>
        )}
      </header>

      {notice && (
        <div className="alert alert--info" role="status">{notice}</div>
      )}

      {reports.length === 0 ? (
        <div className="state">
          <h3>No reports yet</h3>
          <p>You don't have any medical reports yet.</p>
        </div>
      ) : (
        <div className="table-wrap reports-table-wrap">
          <table className="table reports-table">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Type</th>
                <th scope="col">Doctor</th>
                <th scope="col">Summary</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td data-label="Date">{formatDate(report.date)}</td>
                  <td data-label="Type">{report.type}</td>
                  <td data-label="Doctor">{report.doctor}</td>
                  <td data-label="Summary">{report.summary}</td>
                  <td data-label="Actions">
                    <div className="btn-row">
                      <button
                        type="button"
                        className="btn btn--primary btn--sm"
                        onClick={() => handleViewReport(report)}
                        aria-label={`View ${report.type} report`}
                      >
                        View
                      </button>
                      <button
                        type="button"
                        className="btn btn--secondary btn--sm"
                        onClick={() => handlePrintReport(report)}
                        aria-label={`Print ${report.type} report`}
                      >
                        Print
                      </button>
                      <button
                        type="button"
                        className="btn btn--secondary btn--sm"
                        onClick={() => handleDownloadReport(report)}
                        aria-label={`Download ${report.type} report`}
                      >
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {reportModalOpen && viewingReport && (
        <div className="modal-overlay" onClick={closeReportModal}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="report-modal-title">{viewingReport.type} report</h2>
            <p>The report is now open in a new tab. If it didn't open automatically, please check your browser's popup settings.</p>
            <p>Doctor: {viewingReport.doctor}<br />Date: {formatDate(viewingReport.date)}</p>
            <button type="button" className="btn btn--secondary" onClick={closeReportModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default ReportsLayout;
