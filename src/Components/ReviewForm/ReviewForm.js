import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReviewForm.css';
import { formatDoctorName } from '../../utils/formatDoctorName';

const ReviewForm = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [reviewData, setReviewData] = useState({
    doctorName: '',
    doctorSpecialty: '',
    rating: 0,
    comments: '',
    appointmentId: ''
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const authToken = sessionStorage.getItem('auth-token');
    const email = sessionStorage.getItem('email');
    
    if (authToken && email) {
      setIsLoggedIn(true);
      // Get all appointments from localStorage
      getAllAppointments();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Retrieve all appointments from localStorage
  const getAllAppointments = () => {
    const allAppointments = [];
    
    // Search for all appointments in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('appointments-')) {
        try {
          const appointmentsData = JSON.parse(localStorage.getItem(key));
          if (Array.isArray(appointmentsData)) {
            // Extract doctor name from the key
            const doctorName = key.replace('appointments-', '');
            
            // Add doctor name and review status to each appointment
            const appointments = appointmentsData.map(appointment => ({
              ...appointment,
              doctorName,
              reviewSubmitted: localStorage.getItem(`review-${appointment.id}`) ? true : false
            }));
            
            allAppointments.push(...appointments);
          }
        } catch (error) {
          console.error('Error parsing appointments:', error);
        }
      }
    }
    
    setAppointments(allAppointments);
  };

  // Open the review form for a specific doctor
  const handleOpenReviewForm = (appointment) => {
    setReviewData({
      doctorName: appointment.doctorName,
      doctorSpecialty: appointment.doctorSpeciality,
      rating: 0,
      comments: '',
      appointmentId: appointment.id
    });
    setShowReviewForm(true);
  };

  // Handle changes in the review form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewData({
      ...reviewData,
      [name]: value
    });
  };

  // Handle star rating selection
  const handleRatingChange = (rating) => {
    setReviewData({
      ...reviewData,
      rating
    });
  };

  // Submit the review
  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    // Save review in localStorage
    localStorage.setItem(`review-${reviewData.appointmentId}`, JSON.stringify(reviewData));
    
    // Update the appointment in state to show review submitted
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === reviewData.appointmentId 
          ? { ...appointment, reviewSubmitted: true } 
          : appointment
      )
    );
    
    // Show success message and reset form
    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setShowReviewForm(false);
    }, 2000);
  };

  if (!isLoggedIn) {
    return (
      <div className="page">
        <div className="state"><p>Please log in to view your appointments and provide feedback.</p></div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page__header">
        <h1>Reviews</h1>
      </div>

      {appointments.length === 0 ? (
        <div className="state">
          <h3>Nothing to review yet</h3>
          <p>You don't have any appointments to review.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Serial Number</th>
                <th scope="col">Doctor Name</th>
                <th scope="col">Doctor Speciality</th>
                <th scope="col">Provide feedback</th>
                <th scope="col">Review Given</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment, index) => (
                <tr key={appointment.id}>
                  <td>{index + 1}</td>
                  <td>{formatDoctorName(appointment.doctorName)}</td>
                  <td>{appointment.doctorSpeciality}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn--secondary btn--sm"
                      onClick={() => handleOpenReviewForm(appointment)}
                      disabled={appointment.reviewSubmitted}
                    >
                      Write review
                    </button>
                  </td>
                  <td>
                    {appointment.reviewSubmitted ? (
                      <span className="badge">Reviewed</span>
                    ) : (
                      <span className="review-pending">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showReviewForm && (
        <div className="modal-overlay">
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="review-title">
            <h3 id="review-title">Provide Feedback</h3>

            <p>
              <strong>Doctor:</strong> {formatDoctorName(reviewData.doctorName)}<br />
              <strong>Speciality:</strong> {reviewData.doctorSpecialty}
            </p>

            <form onSubmit={handleSubmitReview}>
              <fieldset className="review-rating">
                <legend className="label">Rating</legend>
                <div className="review-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`review-star${reviewData.rating >= star ? ' is-selected' : ''}`}
                      aria-label={`${star} star${star > 1 ? 's' : ''}`}
                      aria-pressed={reviewData.rating === star}
                      onClick={() => handleRatingChange(star)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="form-group">
                <label htmlFor="comments">Comments</label>
                <textarea
                  id="comments"
                  name="comments"
                  className="form-control"
                  value={reviewData.comments}
                  onChange={handleInputChange}
                  placeholder="Share your experience with this doctor..."
                  rows="4"
                  required
                ></textarea>
              </div>

              {reviewSubmitted && (
                <div className="alert alert--success" role="status">
                  Thank you for your feedback!
                </div>
              )}

              <div className="btn-row">
                <button type="submit" className="btn btn--primary" disabled={reviewSubmitted}>Submit Review</button>
                <button type="button" className="btn btn--secondary" onClick={() => setShowReviewForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewForm;
