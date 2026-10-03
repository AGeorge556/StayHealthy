import React, { useCallback, useEffect, useState } from 'react';
import './BookingConsultation.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FindDoctorSearchIC from '../InstantConsultationBooking/FindDoctorSearchIC/FindDoctorSearchIC';
import DoctorResults from '../InstantConsultationBooking/DoctorResults/DoctorResults';

// Custom wrapper to hide the header in FindDoctorSearchIC
const CustomFindDoctorSearch = ({ onSearch }) => (
    <FindDoctorSearchIC onSearch={onSearch} hideHeader={true} />
);

// Mock doctor data - in a real application, this would come from an API
const mockDoctors = [
    {
        id: 1,
        name: "Dr. John Smith",
        speciality: "Cardiologist",
        experience: 15,
        ratings: 4.8,
        profilePic: "/images/doctor1.jpg",
        location: "New York",
        clinic: "Heart Care Center",
        consultationFees: "$150"
    },
    {
        id: 2,
        name: "Dr. Emily Johnson",
        speciality: "Dermatologist",
        experience: 10,
        ratings: 4.7,
        profilePic: "/images/doctor2.jpg",
        location: "Los Angeles",
        clinic: "Skin Health Clinic",
        consultationFees: "$130"
    },
    {
        id: 3,
        name: "Dr. Michael Brown",
        speciality: "Pediatrician",
        experience: 12,
        ratings: 4.9,
        profilePic: "/images/doctor3.jpg",
        location: "Chicago",
        clinic: "Children's Wellness Center",
        consultationFees: "$120"
    },
    {
        id: 4,
        name: "Dr. Sarah Davis",
        speciality: "Gynecologist/obstetrician",
        experience: 14,
        ratings: 4.6,
        profilePic: "/images/doctor4.jpg",
        location: "Houston",
        clinic: "Women's Health Clinic",
        consultationFees: "$160"
    },
    {
        id: 5,
        name: "Dr. Robert Wilson",
        speciality: "Orthopedic",
        experience: 18,
        ratings: 4.5,
        profilePic: "/images/doctor5.jpg",
        location: "Phoenix",
        clinic: "Joint & Bone Center",
        consultationFees: "$170"
    },
    {
        id: 6,
        name: "Dr. Jennifer Martinez",
        speciality: "Neurologist",
        experience: 11,
        ratings: 4.8,
        profilePic: "/images/doctor6.jpg",
        location: "Philadelphia",
        clinic: "Brain & Nerve Clinic",
        consultationFees: "$180"
    },
    {
        id: 7,
        name: "Dr. David Thompson",
        speciality: "Dentist",
        experience: 9,
        ratings: 4.7,
        profilePic: "/images/doctor7.jpg",
        location: "San Antonio",
        clinic: "Smile Dental Care",
        consultationFees: "$110"
    },
    {
        id: 8,
        name: "Dr. Lisa Rodriguez",
        speciality: "General Physician",
        experience: 13,
        ratings: 4.9,
        profilePic: "/images/doctor8.jpg",
        location: "San Diego",
        clinic: "Primary Care Clinic",
        consultationFees: "$100"
    }
];

const BookingConsultation = () => {
    const [searchParams] = useSearchParams();
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [isSearched, setIsSearched] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    
    const getDoctorsDetails = useCallback(() => {
        setIsLoading(true);
        
        // In a real application, you would fetch from an API
        setTimeout(() => {
            setDoctors(mockDoctors);
            
            if (searchParams.get('speciality')) {
                const filtered = mockDoctors.filter(doctor => 
                    doctor.speciality.toLowerCase() === searchParams.get('speciality').toLowerCase()
                );
                setFilteredDoctors(filtered);
                setIsSearched(true);
            } else {
                setFilteredDoctors([]);
                setIsSearched(false);
            }
            
            setIsLoading(false);
        }, 1000); // Simulate API delay
    }, [searchParams]);
    
    const handleSearch = (searchText) => {
        if (searchText === '') {
            setFilteredDoctors([]);
            setIsSearched(false);
        } else {
            const filtered = doctors.filter(doctor => 
                doctor.speciality.toLowerCase().includes(searchText.toLowerCase())
            );
            
            setFilteredDoctors(filtered);
            setIsSearched(true);
            
            // Update URL with search parameter
            navigate(`/booking-consultation?speciality=${encodeURIComponent(searchText)}`);
        }
    };
    
    useEffect(() => {
        // Check if user is logged in
        const authtoken = sessionStorage.getItem("auth-token");
        if (!authtoken) {
            navigate("/login");
            return;
        }
        
        getDoctorsDetails();
    }, [getDoctorsDetails, navigate]);
    
    return (
        <div className="page">
            <div className="page__header">
                <h1>Book an appointment</h1>
                <p>Find a doctor and book an appointment at your convenience.</p>
            </div>

            <CustomFindDoctorSearch onSearch={handleSearch} />

            <div className="booking-results">
                <DoctorResults
                    isLoading={isLoading}
                    error={null}
                    isSearched={isSearched}
                    doctors={filteredDoctors}
                    location={searchParams.get('location')}
                />
            </div>
        </div>
    );
};

export default BookingConsultation;
