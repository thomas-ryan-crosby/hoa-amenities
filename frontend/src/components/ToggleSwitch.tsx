import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  disabled = false
}) => {
  return (
    <label style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      cursor: disabled ? 'not-allowed' : 'pointer',
      userSelect: 'none'
    }}>
      <div
        onClick={() => !disabled && onChange(!checked)}
        style={{
          position: 'relative',
          width: '48px',
          height: '24px',
          backgroundColor: checked ? '#355B45' : '#d1d5db',
          borderRadius: '12px',
          transition: 'background-color 0.2s',
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '2px',
            left: checked ? '26px' : '2px',
            width: '20px',
            height: '20px',
            backgroundColor: 'white',
            borderRadius: '50%',
            transition: 'left 0.2s',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}
        />
      </div>
      {label && (
        <span style={{
          fontSize: '0.875rem',
          fontWeight: 500,
          color: disabled ? '#9ca3af' : '#374151'
        }}>
          {label}
        </span>
      )}
    </label>
  );
};

export default ToggleSwitch;

