import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import './DoctorCardIC.css';
import AppointmentFormIC from '../AppointmentFormIC/AppointmentFormIC';
import { v4 as uuidv4 } from 'uuid';
import { formatDoctorName } from '../../../utils/formatDoctorName';

const initials = (name) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

const Avatar = ({ name, profilePic }) => {
  const [failed, setFailed] = useState(false);
  return (
    <div className="doctor-avatar" aria-hidden="true">
      {profilePic && !failed ? (
        <img src={profilePic} alt="" onError={() => setFailed(true)} />
      ) : (
        initials(name) || (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        )
      )}
    </div>
  );
};

const DoctorCardIC = ({ name, speciality, experience, ratings, profilePic }) => {
  const [showModal, setShowModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  // some data sources already include the "Dr." prefix
  const displayName = name.replace(/^dr\.?\s+/i, '');

  useEffect(() => {
    // Load appointments from localStorage if available
    const savedAppointments = localStorage.getItem(`appointments-${name}`);
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
  }, [name]);

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    if (appointments.length > 0) {
      localStorage.setItem(`appointments-${name}`, JSON.stringify(appointments));
    }
  }, [appointments, name]);

  const handleCancel = (appointmentId) => {
    const updatedAppointments = appointments.filter((appointment) => appointment.id !== appointmentId);
    setAppointments(updatedAppointments);

    // Remove from localStorage if no appointments left
    if (updatedAppointments.length === 0) {
      localStorage.removeItem(`appointments-${name}`);
    } else {
      localStorage.setItem(`appointments-${name}`, JSON.stringify(updatedAppointments));
    }

    // Dispatch a custom event to notify other components about appointment cancellation
    const cancelEvent = new CustomEvent('appointmentCancelled', {
      detail: { doctorName: name, appointmentId }
    });
    window.dispatchEvent(cancelEvent);
  };

  const handleFormSubmit = (appointmentData) => {
    const newAppointment = {
      id: uuidv4(),
      doctorName: name,
      doctorSpeciality: speciality,
      bookingDate: new Date().toLocaleDateString(),
      ...appointmentData,
    };
    const updatedAppointments = [...appointments, newAppointment];
    setAppointments(updatedAppointments);

    // Store appointments in localStorage
    localStorage.setItem(`appointments-${name}`, JSON.stringify(updatedAppointments));

    // Store doctor data in localStorage for the notification components
    localStorage.setItem('doctorData', JSON.stringify({
      name,
      speciality,
      experience,
      ratings
    }));

    setShowModal(false);

    // Dispatch an event specifically for the appointment notification
    const bookedEvent = new CustomEvent('appointmentBooked', {
      detail: {
        doctorName: name,
        appointment: newAppointment,
        notificationType: 'appointmentConfirmation'
      }
    });
    window.dispatchEvent(bookedEvent);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const booked = appointments.length > 0;

  return (
    <article className="card doctor-card">
      <div className="doctor-card__head">
        <Avatar name={displayName} profilePic={profilePic} />
        <div>
          <h3 className="doctor-card__name">{formatDoctorName(name)}</h3>
          <span className="badge">{speciality}</span>
        </div>
      </div>

      <dl className="doctor-card__meta">
        <div><dt>Experience</dt><dd>{experience} years</dd></div>
        <div><dt>Rating</dt><dd>{ratings} / 5</dd></div>
      </dl>

      <Popup
        trigger={
          <button type="button" className={`btn btn--block ${booked ? 'btn--secondary' : 'btn--primary'}`}>
            {booked ? 'View / cancel appointment' : 'Book appointment'}
          </button>
        }
        modal
        open={showModal}
        onClose={() => setShowModal(false)}
      >
        {(close) => (
          <div className="doctor-modal">
            <div className="doctor-card__head">
              <Avatar name={displayName} profilePic={profilePic} />
              <div>
                <h3 className="doctor-card__name">{formatDoctorName(name)}</h3>
                <span className="badge">{speciality}</span>
                <p className="doctor-modal__meta">{experience} years experience &middot; Rating {ratings} / 5</p>
              </div>
            </div>

            {booked ? (
              <div>
                <h4>Your appointments</h4>
                {appointments.map((appointment) => (
                  <div className="doctor-appointment" key={appointment.id}>
                    <p><strong>Patient:</strong> {appointment.name}</p>
                    <p><strong>Phone:</strong> {appointment.phoneNumber}</p>
                    <p><strong>Date:</strong> {formatDate(appointment.appointmentDate)}</p>
                    <p><strong>Time:</strong> {appointment.timeSlot}</p>
                    <p><strong>Booked on:</strong> {appointment.bookingDate}</p>
                    <button type="button" className="btn btn--danger btn--sm" onClick={() => handleCancel(appointment.id)}>
                      Cancel appointment
                    </button>
                  </div>
                ))}
                <button type="button" className="btn btn--secondary" onClick={close}>Close</button>
              </div>
            ) : (
              <AppointmentFormIC
                doctorName={displayName}
                doctorSpeciality={speciality}
                onSubmit={handleFormSubmit}
                onCancel={close}
              />
            )}
          </div>
        )}
      </Popup>
    </article>
  );
};

export default DoctorCardIC;
