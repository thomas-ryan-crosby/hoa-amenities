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

  // Parse initial value
  const initialParsed = parseTime(value);
  const [localHour, setLocalHour] = useState(initialParsed.hour);
  const [localMinute, setLocalMinute] = useState(initialParsed.minute);
  const [localIsPM, setLocalIsPM] = useState(initialParsed.isPM);

  // Update local state when value prop changes
  React.useEffect(() => {
    const parsed = parseTime(value);
    console.log('SimpleTimeSelector useEffect:', {
      label,
      value,
      parsed,
      hour: parsed.hour,
      minute: parsed.minute,
      isPM: parsed.isPM,
      currentState: { localHour, localMinute, localIsPM }
    });
    
    // Only update if the parsed values are different from current state
    if (parsed.hour !== localHour || parsed.minute !== localMinute || parsed.isPM !== localIsPM) {
      console.log('SimpleTimeSelector: Updating state from', { localHour, localMinute, localIsPM }, 'to', parsed);
      setLocalHour(parsed.hour);
      setLocalMinute(parsed.minute);
      setLocalIsPM(parsed.isPM);
    }
  }, [value, label, localHour, localMinute, localIsPM]);

  const handleHourChange = (newHour: number) => {
    setLocalHour(newHour);
    onChange(formatTime(newHour, localMinute, localIsPM));
  };

  const handleMinuteChange = (newMinute: number) => {
    setLocalMinute(newMinute);
    onChange(formatTime(localHour, newMinute, localIsPM));
  };

  const handleAMPMChange = (newIsPM: boolean) => {
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
        {/* Hours Dropdown */}
        <select
          value={String(localHour).padStart(2, '0')}
          onChange={(e) => handleHourChange(Number(e.target.value))}
          style={{
            width: '70px',
            height: '40px',
            textAlign: 'center',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: '500',
            backgroundColor: 'white',
            cursor: 'pointer',
            padding: '0 8px'
          }}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
            <option key={hour} value={hour}>
              {String(hour).padStart(2, '0')}
            </option>
          ))}
        </select>

        <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#374151', margin: '0 4px' }}>:</span>

        {/* Minutes Dropdown */}
        <select
          value={String(localMinute).padStart(2, '0')}
          onChange={(e) => handleMinuteChange(Number(e.target.value))}
          style={{
            width: '70px',
            height: '40px',
            textAlign: 'center',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: '500',
            backgroundColor: 'white',
            cursor: 'pointer',
            padding: '0 8px'
          }}
        >
          <option value="00">00</option>
          <option value="30">30</option>
        </select>

        {/* AM/PM Dropdown */}
        <select
          value={localIsPM ? 'PM' : 'AM'}
          onChange={(e) => handleAMPMChange(e.target.value === 'PM')}
          style={{
            width: '70px',
            height: '40px',
            textAlign: 'center',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: '500',
            backgroundColor: 'white',
            cursor: 'pointer',
            padding: '0 8px'
          }}
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
};

export default SimpleTimeSelector;

