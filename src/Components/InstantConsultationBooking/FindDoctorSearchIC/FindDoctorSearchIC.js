import React, { useState, useEffect } from 'react';
import './FindDoctorSearchIC.css';
import { useNavigate } from 'react-router-dom';
// Import icons as React components (better approach)
import SearchIcon from './SearchIcon';
import LocationIcon from './LocationIcon';

// Initial specialties list
const initSpeciality = [
    'Dentist', 'Gynecologist/obstetrician', 'General Physician', 'Dermatologist', 
    'Ear-nose-throat (ent) Specialist', 'Homeopath', 'Ayurveda', 'Cardiologist',
    'Neurologist', 'Orthopedic', 'Pediatrician', 'Psychiatrist', 'Urologist'
];

// Initial cities list
const initCities = [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 
    'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'
];

const FindDoctorSearchIC = ({ onSearch, hideHeader = false }) => {
    // State for specialty search
    const [doctorResultHidden, setDoctorResultHidden] = useState(true);
    const [searchDoctor, setSearchDoctor] = useState('');
    const [specialities, setSpecialities] = useState(initSpeciality);
    
    // State for location search
    const [locationResultHidden, setLocationResultHidden] = useState(true);
    const [searchLocation, setSearchLocation] = useState('');
    const [cities, setCities] = useState(initCities);
    
    // State for filtered results
    const [filteredSpecialities, setFilteredSpecialities] = useState(initSpeciality);
    const [filteredCities, setFilteredCities] = useState(initCities);
    
    const navigate = useNavigate();
    
    // Filter specialties based on search input
    useEffect(() => {
        if (searchDoctor.trim() !== '') {
            const filtered = specialities.filter(specialty => 
                specialty.toLowerCase().includes(searchDoctor.toLowerCase())
            );
            setFilteredSpecialities(filtered);
        } else {
            setFilteredSpecialities(specialities);
        }
    }, [searchDoctor, specialities]);
    
    // Filter cities based on location search input
    useEffect(() => {
        if (searchLocation.trim() !== '') {
            const filtered = cities.filter(city => 
                city.toLowerCase().includes(searchLocation.toLowerCase())
            );
            setFilteredCities(filtered);
        } else {
            setFilteredCities(cities);
        }
    }, [searchLocation, cities]);
    
    // Handler for specialty selection
    const handleDoctorSelect = (speciality) => {
        setSearchDoctor(speciality);
        setDoctorResultHidden(true);
        
        // If an external onSearch handler is provided, use it
        if (onSearch) {
            onSearch(speciality);
            return;
        }
        
        // Create query parameters for navigation
        const queryParams = new URLSearchParams();
        queryParams.append('speciality', speciality);
        
        if (searchLocation) {
            queryParams.append('location', searchLocation);
        }
        
        navigate(`/instant-consultation?${queryParams.toString()}`);
    };
    
    // Handler for location selection
    const handleLocationSelect = (city) => {
        setSearchLocation(city);
        setLocationResultHidden(true);
    };
    
    // Handler for form submission
    const handleSearch = (e) => {
        e.preventDefault();
        
        // If an external onSearch handler is provided, use it
        if (onSearch && searchDoctor) {
            onSearch(searchDoctor);
            return;
        }
        
        // Create query parameters for navigation
        const queryParams = new URLSearchParams();
        
        if (searchDoctor) {
            queryParams.append('speciality', searchDoctor);
        }
        
        if (searchLocation) {
            queryParams.append('location', searchLocation);
        }
        
        navigate(`/instant-consultation?${queryParams.toString()}`);
    };
    
    return (
        <div className='finddoctor'>
            <center>
                {!hideHeader && (
                    <>
                        <h1>Find a doctor and Consult instantly</h1>
                        <div>
                            <i style={{color:'#000000',fontSize:'20rem'}} className="fa fa-user-md"></i>
                        </div>
                    </>
                )}
                
                <form onSubmit={handleSearch} className="search-form">
                    <div className="home-search-container" style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column',gap:'15px'}}>
                        {/* Doctor specialty search */}
                        <div className="doctor-search-box">
                            <input 
                                type="text" 
                                className="search-doctor-input-box" 
                                placeholder="Search doctors, clinics, hospitals, etc." 
                                onFocus={() => setDoctorResultHidden(false)} 
                                onBlur={() => setDoctorResultHidden(true)} 
                                value={searchDoctor} 
                                onChange={(e) => setSearchDoctor(e.target.value)} 
                            />
                            
                            <div className="findiconimg">
                                <SearchIcon />
                            </div>
                            
                            <div className="search-doctor-input-results" hidden={doctorResultHidden}>
                                {filteredSpecialities.length > 0 ? (
                                    filteredSpecialities.map(speciality => (
                                        <div 
                                            className="search-doctor-result-item" 
                                            key={speciality} 
                                            onMouseDown={() => handleDoctorSelect(speciality)}
                                        >
                                            <span className="icon-container">
                                                <SearchIcon />
                                            </span>
                                            <span>{speciality}</span>
                                            <span>SPECIALITY</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-results">No specialties found</div>
                                )}
                            </div>
                        </div>
                        
                        {/* Location search */}
                        <div className="location-search-box">
                            <input 
                                type="text" 
                                className="search-location-input-box" 
                                placeholder="Search location" 
                                onFocus={() => setLocationResultHidden(false)} 
                                onBlur={() => setLocationResultHidden(true)} 
                                value={searchLocation} 
                                onChange={(e) => setSearchLocation(e.target.value)} 
                            />
                            
                            <div className="findiconimg">
                                <LocationIcon />
                            </div>
                            
                            <div className="search-location-input-results" hidden={locationResultHidden}>
                                {filteredCities.length > 0 ? (
                                    filteredCities.map(city => (
                                        <div 
                                            className="search-location-result-item" 
                                            key={city} 
                                            onMouseDown={() => handleLocationSelect(city)}
                                        >
                                            <span className="icon-container">
                                                <LocationIcon />
                                            </span>
                                            <span>{city}</span>
                                            <span>CITY</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-results">No cities found</div>
                                )}
                            </div>
                        </div>
                        
                        <button type="submit" className="search-button">
                            Find Doctors
                        </button>
                    </div>
                </form>
            </center>
        </div>
    );
};

export default FindDoctorSearchIC;