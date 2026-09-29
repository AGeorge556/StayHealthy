import React, { useCallback, useEffect, useState } from 'react';
import './InstantConsultation.css';
import { useSearchParams } from 'react-router-dom';
import FindDoctorSearchIC from './FindDoctorSearchIC/FindDoctorSearchIC';
import DoctorResults from './DoctorResults/DoctorResults';

const InstantConsultation = () => {
    const [searchParams] = useSearchParams();
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [isSearched, setIsSearched] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const getDoctorsDetails = useCallback(() => {
        setIsLoading(true);
        setError(false);
        fetch('https://api.npoint.io/9a5543d36f1460da2f63')
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then(data => {
            if (searchParams.get('speciality')) {
                const filtered = data.filter(doctor => doctor.speciality.toLowerCase() === searchParams.get('speciality').toLowerCase());
                setFilteredDoctors(filtered);
                setIsSearched(true);
            } else {
                setFilteredDoctors([]);
                setIsSearched(false);
            }
            setDoctors(data);
        })
        .catch(err => {
            console.error(err);
            setError(true);
        })
        .finally(() => setIsLoading(false));
    }, [searchParams]);

    const handleSearch = (searchText) => {
        if (searchText === '') {
            setFilteredDoctors([]);
            setIsSearched(false);
        } else {
            const filtered = doctors.filter(
                (doctor) => doctor.speciality.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredDoctors(filtered);
            setIsSearched(true);
        }
    };

    useEffect(() => {
        getDoctorsDetails();
    }, [getDoctorsDetails]);

    return (
        <div className="page">
            <FindDoctorSearchIC onSearch={handleSearch} />
            <div className="doctor-results">
                <DoctorResults
                    isLoading={isLoading}
                    error={error}
                    onRetry={getDoctorsDetails}
                    isSearched={isSearched}
                    doctors={filteredDoctors}
                    location={searchParams.get('location')}
                />
            </div>
        </div>
    );
};

export default InstantConsultation;
