import React, { useState } from 'react';

interface SimpleTimeSelectorProps {
  value: string; // Format: "HH:MM" (24-hour format)
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
}

const SimpleTimeSelector: React.FC<SimpleTimeSelectorProps> = ({ 
  value, 
  onChange, 
  label,
  required = false 
}) => {
  // Parse the 24-hour format value (HH:MM) into hours, minutes, and AM/PM
  const parseTime = (timeStr: string): { hour: number; minute: number; isPM: boolean } => {
    if (!timeStr || timeStr === '') {
      return { hour: 12, minute: 0, isPM: false };
    }
    
    const [hours, minutes] = timeStr.split(':').map(Number);
    const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const isPM = hours >= 12;
    
    return { 
      hour: hour12, 
      minute: minutes === 0 ? 0 : 30, // Round to nearest 30 minutes
      isPM 
    };
  };

  // Convert 12-hour format to 24-hour format string
  const formatTime = (hour: number, minute: number, isPM: boolean): string => {
    let hour24 = hour;
    if (hour === 12) {
      hour24 = isPM ? 12 : 0;
    } else {
      hour24 = isPM ? hour + 12 : hour;
    }
    
    return `${String(hour24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  };

  const { hour, minute, isPM } = parseTime(value);
  const [localHour, setLocalHour] = useState(hour);
  const [localMinute, setLocalMinute] = useState(minute);
  const [localIsPM, setLocalIsPM] = useState(isPM);

  // Update local state when value prop changes
  React.useEffect(() => {
    const parsed = parseTime(value);
    setLocalHour(parsed.hour);
    setLocalMinute(parsed.minute);
    setLocalIsPM(parsed.isPM);
  }, [value]);

  const handleHourChange = (delta: number) => {
    let newHour = localHour + delta;
    if (newHour < 1) newHour = 12;
    if (newHour > 12) newHour = 1;
    
    setLocalHour(newHour);
    onChange(formatTime(newHour, localMinute, localIsPM));
  };

  const handleMinuteChange = (newMinute: number) => {
    setLocalMinute(newMinute);
    onChange(formatTime(localHour, newMinute, localIsPM));
  };

  const handleAMPMToggle = () => {
    const newIsPM = !localIsPM;
    setLocalIsPM(newIsPM);
    onChange(formatTime(localHour, localMinute, newIsPM));
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      {label && (
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          {label} {required && '*'}
        </label>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Hours */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            type="button"
            onClick={() => handleHourChange(1)}
            style={{
              width: '28px',
              height: '40px',
              border: '1px solid #d1d5db',
              borderRight: 'none',
              borderRadius: '4px 0 0 4px',
              backgroundColor: '#f9fafb',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: '#374151'
            }}
          >
            ▲
          </button>
          <input
            type="text"
            value={String(localHour).padStart(2, '0')}
            readOnly
            style={{
              width: '50px',
              height: '40px',
              textAlign: 'center',
              border: '1px solid #d1d5db',
              borderLeft: 'none',
              borderRight: 'none',
              borderRadius: '0',
              fontSize: '16px',
              fontWeight: '500',
              backgroundColor: 'white'
            }}
          />
          <button
            type="button"
            onClick={() => handleHourChange(-1)}
            style={{
              width: '28px',
              height: '40px',
              border: '1px solid #d1d5db',
              borderLeft: 'none',
              borderRadius: '0 4px 4px 0',
              backgroundColor: '#f9fafb',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: '#374151'
            }}
          >
            ▼
          </button>
        </div>

        <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#374151', margin: '0 4px' }}>:</span>

        {/* Minutes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            type="button"
            onClick={() => handleMinuteChange(localMinute === 0 ? 30 : 0)}
            style={{
              width: '28px',
              height: '40px',
              border: '1px solid #d1d5db',
              borderRight: 'none',
              borderRadius: '4px 0 0 4px',
              backgroundColor: '#f9fafb',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: '#374151'
            }}
          >
            ▲
          </button>
          <select
            value={String(localMinute).padStart(2, '0')}
            onChange={(e) => handleMinuteChange(Number(e.target.value))}
            style={{
              width: '50px',
              height: '40px',
              textAlign: 'center',
              border: '1px solid #d1d5db',
              borderLeft: 'none',
              borderRight: 'none',
              borderRadius: '0',
              fontSize: '16px',
              fontWeight: '500',
              backgroundColor: 'white',
              cursor: 'pointer',
              padding: '0 4px'
            }}
          >
            <option value="00">00</option>
            <option value="30">30</option>
          </select>
          <button
            type="button"
            onClick={() => handleMinuteChange(localMinute === 0 ? 30 : 0)}
            style={{
              width: '28px',
              height: '40px',
              border: '1px solid #d1d5db',
              borderLeft: 'none',
              borderRadius: '0 4px 4px 0',
              backgroundColor: '#f9fafb',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: '#374151'
            }}
          >
            ▼
          </button>
        </div>

        {/* AM/PM */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            type="button"
            onClick={handleAMPMToggle}
            style={{
              width: '28px',
              height: '40px',
              border: '1px solid #d1d5db',
              borderRight: 'none',
              borderRadius: '4px 0 0 4px',
              backgroundColor: '#f9fafb',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: '#374151'
            }}
          >
            ▲
          </button>
          <input
            type="text"
            value={localIsPM ? 'PM' : 'AM'}
            readOnly
            onClick={handleAMPMToggle}
            style={{
              width: '50px',
              height: '40px',
              textAlign: 'center',
              border: '1px solid #d1d5db',
              borderLeft: 'none',
              borderRight: 'none',
              borderRadius: '0',
              fontSize: '16px',
              fontWeight: '500',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          />
          <button
            type="button"
            onClick={handleAMPMToggle}
            style={{
              width: '28px',
              height: '40px',
              border: '1px solid #d1d5db',
              borderLeft: 'none',
              borderRadius: '0 4px 4px 0',
              backgroundColor: '#f9fafb',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: '#374151'
            }}
          >
            ▼
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleTimeSelector;

