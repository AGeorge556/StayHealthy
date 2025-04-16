import React, { useState, useEffect } from "react"; // Importing the necessary modules from React library
import { Link, useNavigate } from "react-router-dom"; // Importing the Link and useNavigate components from react-router-dom library
import "./Landing_page.css"; // Importing the CSS styles for the Landing_Page component

// Defining the Function component Landing_Page
const Landing_Page = () => {
  const navigate = useNavigate(); // Initialize the navigate function
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to check if user is logged in
  
  // Effect to check user's login status on component mount
  useEffect(() => {
    const authToken = sessionStorage.getItem("auth-token");
    if (authToken) {
      setIsLoggedIn(true);
    }
  }, []);
  
  // Handle Get Started button click
  const handleGetStarted = () => {
    if (isLoggedIn) {
      // If user is logged in, navigate to booking consultation page
      navigate("/booking-consultation");
    } else {
      // If not logged in, scroll to services section
      document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
      // Alternatively, you could redirect to login page
      // navigate("/login");
    }
  };
  
  return (
    <section className="hero-section"> {/* Creating a section with class name 'hero-section' */}
      <div>
        <div data-aos="fade-up" className="flex-hero"> {/* Creating a div with data-aos attribute and class name 'flex-hero' */}
            
            <h1>
              Your Health<br/>

              <span className="text-gradient">
                
                Our Responsibility
              </span>
            </h1>
              <div className="blob-cont"> {/* Creating a div with class name 'blob-cont' */}
                  <div className="blue blob"></div> {/* Creating a blue blob inside the 'blob-cont' div */}
              </div>
              <div className="blob-cont"> {/* Creating another div with class name 'blob-cont' */}
                  <div className="blue1 blob"></div> {/* Creating a different blue blob inside the second 'blob-cont' div */}
              </div>
            {/* Use button with onClick handler instead of anchor tag */}
            <button className="button" onClick={handleGetStarted}>
              {isLoggedIn ? "Book Consultation" : "Get Started"}
            </button>
        </div>
      </div>
      
      <div id="services"></div> {/* Add an empty div as the services section target */}
    </section>
  );
};

export default Landing_Page; // Exporting the Landing_Page component to be used in other parts of the application