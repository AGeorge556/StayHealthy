import React, { useState, useMemo, useId } from 'react';
import './FindDoctorSearchIC.css';
import { useNavigate } from 'react-router-dom';
import SearchIcon from './SearchIcon';
import LocationIcon from './LocationIcon';

const specialities = [
    'Dentist', 'Gynecologist/obstetrician', 'General Physician', 'Dermatologist',
    'Ear-nose-throat (ent) Specialist', 'Homeopath', 'Ayurveda', 'Cardiologist',
    'Neurologist', 'Orthopedic', 'Pediatrician', 'Psychiatrist', 'Urologist'
];

const cities = [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
    'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'
];

const matches = (list, q) => (q.trim() ? list.filter((i) => i.toLowerCase().includes(q.toLowerCase())) : list);

// One labeled input + keyboard-reachable suggestion buttons
const Suggest = ({ id, label, placeholder, icon, value, setValue, options, hidden, setHidden, onPick, emptyText, tag }) => {
    const closeOnLeave = (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setHidden(true);
    };
    return (
        <div
            className="search-field"
            onBlur={closeOnLeave}
            onKeyDown={(e) => { if (e.key === 'Escape') setHidden(true); }}
        >
            <label htmlFor={id} className="label">{label}</label>
            <div className="search-input-wrap">
                <span className="search-input-icon">{icon}</span>
                <input
                    id={id}
                    type="text"
                    role="combobox"
                    aria-expanded={!hidden}
                    aria-controls={`${id}-list`}
                    aria-autocomplete="list"
                    autoComplete="off"
                    className="form-control search-input"
                    placeholder={placeholder}
                    value={value}
                    onFocus={() => setHidden(false)}
                    onChange={(e) => { setValue(e.target.value); setHidden(false); }}
                />
            </div>
            {!hidden && (
                // keep focus in the input while a suggestion is pressed
                <ul id={`${id}-list`} className="search-suggestions" onMouseDown={(e) => e.preventDefault()}>
                    {options.length > 0 ? options.map((opt) => (
                        <li key={opt}>
                            <button type="button" className="search-suggestion" onClick={() => onPick(opt)}>
                                {icon}
                                <span>{opt}</span>
                                <span className="badge">{tag}</span>
                            </button>
                        </li>
                    )) : (
                        <li className="search-suggestions__empty">{emptyText}</li>
                    )}
                </ul>
            )}
        </div>
    );
};

const FindDoctorSearchIC = ({ onSearch, hideHeader = false }) => {
    const [doctorResultHidden, setDoctorResultHidden] = useState(true);
    const [searchDoctor, setSearchDoctor] = useState('');
    const [locationResultHidden, setLocationResultHidden] = useState(true);
    const [searchLocation, setSearchLocation] = useState('');
    const navigate = useNavigate();
    const uid = useId();

    const filteredSpecialities = useMemo(() => matches(specialities, searchDoctor), [searchDoctor]);
    const filteredCities = useMemo(() => matches(cities, searchLocation), [searchLocation]);

    const handleDoctorSelect = (speciality) => {
        setSearchDoctor(speciality);
        setDoctorResultHidden(true);

        if (onSearch) {
            onSearch(speciality);
            return;
        }

        const queryParams = new URLSearchParams();
        queryParams.append('speciality', speciality);
        if (searchLocation) {
            queryParams.append('location', searchLocation);
        }
        navigate(`/instant-consultation?${queryParams.toString()}`);
    };

    const handleLocationSelect = (city) => {
        setSearchLocation(city);
        setLocationResultHidden(true);
    };

    const handleSearch = (e) => {
        e.preventDefault();

        if (onSearch && searchDoctor) {
            onSearch(searchDoctor);
            return;
        }

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
        <div className="search-panel">
            {!hideHeader && (
                <div className="page__header">
                    <h1>Find a doctor and consult instantly</h1>
                    <p>Pick a speciality, optionally add a city, and book in minutes.</p>
                </div>
            )}

            <form onSubmit={handleSearch} className="card search-form">
                <Suggest
                    id={`${uid}-doctor`}
                    label="Speciality"
                    placeholder="Search doctors, clinics, hospitals, etc."
                    icon={<SearchIcon />}
                    value={searchDoctor}
                    setValue={setSearchDoctor}
                    options={filteredSpecialities}
                    hidden={doctorResultHidden}
                    setHidden={setDoctorResultHidden}
                    onPick={handleDoctorSelect}
                    emptyText="No specialities found"
                    tag="Speciality"
                />
                <Suggest
                    id={`${uid}-location`}
                    label="Location"
                    placeholder="Search location"
                    icon={<LocationIcon />}
                    value={searchLocation}
                    setValue={setSearchLocation}
                    options={filteredCities}
                    hidden={locationResultHidden}
                    setHidden={setLocationResultHidden}
                    onPick={handleLocationSelect}
                    emptyText="No cities found"
                    tag="City"
                />
                <button type="submit" className="btn btn--primary search-submit">Find doctors</button>
            </form>
        </div>
    );
};

export default FindDoctorSearchIC;
