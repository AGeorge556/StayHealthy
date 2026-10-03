import React from 'react';
import DoctorCardIC from '../DoctorCardIC/DoctorCardIC';

// Shared results area: loading / error / prompt / empty / grid
const DoctorResults = ({ isLoading, error, onRetry, isSearched, doctors, location }) => {
  if (isLoading) {
    return (
      <div className="state" role="status">
        <div className="spinner" aria-hidden="true"></div>
        <p>Loading doctors...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="alert alert--error" role="alert">
        <p>Could not load doctors. Check your connection and try again.</p>
        {onRetry && <button type="button" className="btn btn--secondary btn--sm" onClick={onRetry}>Retry</button>}
      </div>
    );
  }
  if (!isSearched) {
    return (
      <div className="state">
        <h3>Search by speciality</h3>
        <p>Choose a speciality above to see available doctors.</p>
      </div>
    );
  }
  if (doctors.length === 0) {
    return (
      <div className="state">
        <h3>No doctors found</h3>
        <p>Try another speciality{location ? ' or location' : ''}.</p>
      </div>
    );
  }
  return (
    <section aria-live="polite">
      <div className="page__header">
        <h2>{doctors.length} {doctors.length === 1 ? 'doctor is' : 'doctors are'} available{location ? ` in ${location}` : ''}</h2>
        <p>Book appointments with minimum wait time and verified doctor details.</p>
      </div>
      <ul className="doctor-grid">
        {doctors.map((doctor) => (
          <li key={doctor.id || doctor.name}><DoctorCardIC {...doctor} /></li>
        ))}
      </ul>
    </section>
  );
};

export default DoctorResults;
