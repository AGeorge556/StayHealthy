import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Landing_page.css";

const STEPS = [
  { title: "Tell us what you need", text: "Search by speciality, from general physicians to dermatologists." },
  { title: "Pick a doctor", text: "Compare experience and ratings, then choose a time that works." },
  { title: "Get care", text: "Consult instantly or visit in person, and keep your reports in one place." },
];

const Landing_Page = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!sessionStorage.getItem("auth-token"));
  }, []);

  return (
    <div className="landing">
      <section className="hero page" aria-labelledby="hero-title">
        <div className="hero__copy">
          <p className="hero__eyebrow">Online consultations &amp; appointments</p>
          <h1 id="hero-title">
            Your health, <em>our responsibility.</em>
          </h1>
          <p className="hero__lede">
            Find the right doctor, book a visit or start an instant consultation, all from one place.
          </p>
          <div className="btn-row">
            {isLoggedIn ? (
              <>
                <Link to="/booking-consultation" className="btn btn--primary">Book an appointment</Link>
                <Link to="/instant-consultation" className="btn btn--secondary">Instant consultation</Link>
              </>
            ) : (
              <>
                <Link to="/signup" className="btn btn--primary">Get started</Link>
                <Link to="/login" className="btn btn--secondary">I already have an account</Link>
              </>
            )}
          </div>
        </div>

        <ol className="steps" id="services" aria-label="How it works">
          {STEPS.map((step, i) => (
            <li key={step.title} className="steps__item">
              <span className="steps__num" aria-hidden="true">{i + 1}</span>
              <div>
                <h2 className="steps__title">{step.title}</h2>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
};

export default Landing_Page;
