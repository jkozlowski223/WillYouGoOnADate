import React, { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Date.css';

function CurrentDate() {
  const API_BASE = process.env.REACT_APP_API_URL || '';
  const [step, setStep] = useState('initial');
  const [date, setDate] = useState(null);
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const cardRef = useRef(null);
  const [cardPos, setCardPos] = useState({ floating: false, top: 0, left: 0 });
  const [selectedActivities, setSelectedActivities] = useState([]); // array of ids
  const [customActivity, setCustomActivity] = useState('');

  const ACTIVITIES = [
    { id: 'bowling', label: 'Bowling 🎳' },
    { id: 'cinema', label: 'Cinema 🎬' },
    { id: 'coffee', label: 'Coffee ☕' },
    { id: 'dinner', label: 'Dinner 🍝' },
    { id: 'iceSkating', label: 'Ice skating ⛸️' },
    { id: 'walk', label: 'Evening walk 🌆' },
    { id: 'museum', label: 'Museum 🖼️' },
    { id: 'concert', label: 'Live music 🎶' },
    { id: 'boardGames', label: 'Board games 🎲' },
    { id: 'picnic', label: 'Picnic in park 🌳' },
    { id: 'other', label: 'Other ❤️' },
  ];

  const handleYesClick = () => {
    setStep('activity');
  };

  const handleNoClick = () => {
    const margin = 16; 
    const el = cardRef.current;
    const cardWidth = el ? el.offsetWidth : 360;
    const cardHeight = el ? el.offsetHeight : 220;

    const maxLeft = Math.max(margin, window.innerWidth - cardWidth - margin);
    const maxTop = Math.max(margin, window.innerHeight - cardHeight - margin);

    const newLeft = Math.floor(Math.random() * (maxLeft - margin + 1)) + margin;
    const newTop = Math.floor(Math.random() * (maxTop - margin + 1)) + margin;

    if (el && !cardPos.floating) {
      const rect = el.getBoundingClientRect();
      // Lock to current screen position
      setCardPos({ floating: true, top: rect.top, left: rect.left });
      
      requestAnimationFrame(() => {
        setCardPos({ floating: true, top: newTop, left: newLeft });
      });
    } else {
      setCardPos({ floating: true, top: newTop, left: newLeft });
    }
  };

  const handleDateSelect = (d) => {
    setDate(d);
    setStep('phone');
  };

  const handlePhoneChange = (e) => {
    const rawValue = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
    let formattedValue = '';
    if (rawValue.length > 0) {
      // Group digits in sets of 3
      formattedValue = rawValue.match(/.{1,3}/g).join(' ');
    }

    // Limit to 9 digits (which is 11 characters with spaces)
    if (formattedValue.length > 11) {
      formattedValue = formattedValue.substring(0, 11);
    }

    setPhone(formattedValue);
    if (phoneError) {
      setPhoneError('');
    }
  };

  const handleToggleActivity = (id) => {
    setSelectedActivities((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((x) => x !== id) : [...prev, id];
      // If turning off 'other', clear custom text
      if (id === 'other' && exists) {
        setCustomActivity('');
      }
      return next;
    });
  };

  const handleCustomActivityChange = (e) => {
    setCustomActivity(e.target.value);
  };

  const handleActivityNext = () => {
    setStep('date');
  };

  const handleSubmit = () => {
    const cleanPhone = phone.replace(/\s/g, ''); // Remove spaces for validation
    const phoneRegex = /^\d{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setPhoneError('HONEY YOUR NUMBER IS NOT CORRECT ❤️');
      return;
    }

    const idToLabel = Object.fromEntries(ACTIVITIES.map((a) => [a.id, a.label]));
    const selectedLabels = selectedActivities
      .filter((id) => id !== 'other')
      .map((id) => idToLabel[id] || id);
    const activitiesArray = [
      ...selectedLabels,
      ...(customActivity.trim() ? [customActivity.trim()] : []),
    ];
    const selectedDateStr = date instanceof Date ? date.toISOString().slice(0, 10) : '';
    const data = {
      selectedDate: selectedDateStr,
      phoneNumber: cleanPhone, // Send the clean number
      activities: activitiesArray,
      activityDescription: activitiesArray.join(', '),
    };

    console.log('Dane do wysłania:', data);
    // Prefer configured API base in production; fall back to relative path for dev proxy/same-origin
    fetch(`${API_BASE}/api/save-date`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(responseData => {
        console.log('Server response:', responseData);
      })
      .catch(error => {
        console.error('Error sending data to server:', error);
      });

    setStep('submitted');
  };

  const handleReset = () => {
    setStep('initial');
    setDate('');
    setPhone('');
    setPhoneError('');
    setCardPos({ floating: false, top: 0, left: 0 });
    setSelectedActivities([]);
    setCustomActivity('');
  };

  const renderInitial = () => (
    <div className="form-step">
      <h2>Will you go on a date with me?</h2>
      <div className="buttons-container">
        <button onClick={handleYesClick}>YES</button>
        <button onClick={handleNoClick}>NO</button>
      </div>
    </div>
  );

  const renderDate = () => (
    <div className="form-step">
      <h2>Select a date:</h2>
      <DatePicker
        selected={date}
        onChange={handleDateSelect}
        minDate={new Date()}
        dateFormat="yyyy-MM-dd"
        placeholderText="Pick a date"
        className="datepicker-input"/>
    </div>
  );

  const renderActivity = () => {
    const isOtherSelected = selectedActivities.includes('other');
    const allowNext = selectedActivities.filter((id) => id !== 'other').length > 0 || (isOtherSelected && customActivity.trim());
    return (
    <div className="form-step">
      <h2>Pick your date activities</h2>
      <div className="chips">
        {ACTIVITIES.map((a) => (
          <button
            key={a.id}
            type="button"
            className={`chip ${selectedActivities.includes(a.id) ? 'chip--selected' : ''}`}
            onClick={() => handleToggleActivity(a.id)}
          >
            {a.label}
          </button>
        ))}
      </div>
      {isOtherSelected && (
        <input
          type="text"
          value={customActivity}
          onChange={handleCustomActivityChange}
          placeholder="Your suggestion (optional)"
          className="custom-activity-input"
        />
      )}
      <div className="buttons">
        <button onClick={handleActivityNext} disabled={!allowNext}>
          Next
        </button>
      </div>
    </div>
    );
  };
  const renderPhone = () => (
    <div className="form-step">
      <h2>Enter your phone number:</h2>
      <input
        type="tel"
        onChange={handlePhoneChange}
        value={phone}
        placeholder="Phone number"
      />
      {phoneError && <p style={{ color: 'red' }}>{phoneError}</p>}
      <div className="buttons">
        <button onClick={handleSubmit}>DATE</button>
      </div>
    </div>
  );

  const renderSubmitted = () => (
    <div className="form-step">
      <h2>LOVE YOU I cannot wait to see you ❤️</h2>
      <div className="buttons">
        <button onClick={handleReset}>SEE YOU ❤️</button>
      </div>
    </div>
  );

  return (
    <div
      className="date-container"
      ref={cardRef}
      style={step === 'initial' && cardPos.floating ? { position: 'fixed', top: cardPos.top, left: cardPos.left } : undefined}
    >
      {step === 'initial' && renderInitial()}
      {step === 'activity' && renderActivity()}
      {step === 'date' && renderDate()}
      {step === 'phone' && renderPhone()}
      {step === 'submitted' && renderSubmitted()}
    </div>
  );
}

export default CurrentDate;


