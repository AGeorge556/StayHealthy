import React, { useId, useState } from 'react';
import './AppointmentFormIC.css';
import { formatDoctorName } from '../../../utils/formatDoctorName';

// Generate time slots from 9 AM to 5 PM
const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

const AppointmentFormIC = ({ doctorName, doctorSpeciality, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const uid = useId();

  // Date range: today .. 3 months out (YYYY-MM-DD)
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  const maxDate = new Date(today);
  maxDate.setMonth(today.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Enter your full name.';
    if (!phoneNumber) e.phoneNumber = 'Enter your phone number.';
    else if (!/^\d{10}$/.test(phoneNumber)) e.phoneNumber = 'Enter a valid 10-digit phone number.';
    if (!appointmentDate) e.appointmentDate = 'Choose an appointment date.';
    if (!selectedSlot) e.timeSlot = 'Select a time slot.';
    return e;
  };

  const handleFormSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSubmitting(true);
    onSubmit({
      name,
      phoneNumber,
      appointmentDate,
      timeSlot: selectedSlot
    });

    setName('');
    setPhoneNumber('');
    setAppointmentDate('');
    setSelectedSlot(null);
    setSubmitting(false);
  };

  const field = (key) => ({
    'aria-invalid': errors[key] ? 'true' : undefined,
    'aria-describedby': errors[key] ? `${uid}-${key}-err` : undefined,
  });
  const err = (key) => errors[key] && <p className="field-error" id={`${uid}-${key}-err`} role="alert">{errors[key]}</p>;

  return (
    <form onSubmit={handleFormSubmit} className="appointment-form" noValidate>
      <h4>Book appointment with {formatDoctorName(doctorName)}</h4>
      <p className="appointment-form__sub">{doctorSpeciality}</p>

      <div className="form-group">
        <label htmlFor={`${uid}-name`}>Full name</label>
        <input
          type="text"
          id={`${uid}-name`}
          className="form-control"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          {...field('name')}
        />
        {err('name')}
      </div>

      <div className="form-group">
        <label htmlFor={`${uid}-phone`}>Phone number</label>
        <input
          type="tel"
          id={`${uid}-phone`}
          className="form-control"
          autoComplete="tel"
          inputMode="numeric"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="10-digit phone number"
          {...field('phoneNumber')}
        />
        {err('phoneNumber')}
      </div>

      <div className="form-group">
        <label htmlFor={`${uid}-date`}>Appointment date</label>
        <input
          type="date"
          id={`${uid}-date`}
          className="form-control"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
          min={minDate}
          max={maxDateStr}
          {...field('appointmentDate')}
        />
        {err('appointmentDate')}
      </div>

      <fieldset className="form-group appointment-slots">
        <legend className="label">Time slot</legend>
        <div className="appointment-slots__grid">
          {timeSlots.map((slot) => (
            <button
              key={slot}
              type="button"
              aria-pressed={selectedSlot === slot}
              className={`btn btn--sm ${selectedSlot === slot ? 'btn--primary' : 'btn--secondary'}`}
              onClick={() => setSelectedSlot(slot)}
            >
              {slot}
            </button>
          ))}
        </div>
        {err('timeSlot')}
      </fieldset>

      <div className="btn-row">
        <button type="submit" className={`btn btn--primary${submitting ? ' is-loading' : ''}`} disabled={submitting}>
          Book appointment
        </button>
        {onCancel && <button type="button" className="btn btn--ghost" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
};

export default AppointmentFormIC;
