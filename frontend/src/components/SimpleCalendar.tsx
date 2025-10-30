import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Amenity {
  id: number;
  name: string;
  reservationFee: number;
  deposit: number;
  capacity: number;
}

const SimpleCalendar: React.FC = () => {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAmenities();
  }, []);

  const fetchAmenities = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/api/amenities`);
      console.log('API Response:', response.data); // Debug log
      
      // Ensure we have an array
      if (Array.isArray(response.data)) {
        setAmenities(response.data);
      } else {
        console.error('API did not return an array:', response.data);
        setError('Invalid data format received from server');
      }
    } catch (err) {
      setError('Failed to load amenities');
      console.error('Error fetching amenities:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div>Loading amenities...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ color: 'red' }}>{error}</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
        Amenities Calendar
      </h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '2rem' }}>
        {Array.isArray(amenities) && amenities.map((amenity) => (
          <div key={amenity.id} style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
            padding: '20px',
            border: '1px solid #e5e7eb'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '10px' }}>
              {amenity.name}
            </h2>
            <div style={{ marginBottom: '15px' }}>
              <p><strong>Reservation Fee:</strong> ${amenity.reservationFee}</p>
              <p><strong>Deposit:</strong> ${amenity.deposit}</p>
              <p><strong>Capacity:</strong> {amenity.capacity} people</p>
            </div>
            <button style={{
              backgroundColor: '#355B45',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer'
            }}>
              Make Reservation
            </button>
          </div>
        ))}
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
        padding: '20px' 
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '15px' }}>
          Calendar View
        </h2>
        <div>
          <p>Calendar component will be implemented here with Google Calendar-like interface.</p>
          <p>Features will include:</p>
          <ul style={{ paddingLeft: '20px' }}>
            <li>Monthly/Weekly/Daily views</li>
            <li>Drag and drop reservation creation</li>
            <li>Setup time and party time configuration</li>
            <li>Multi-day reservation support</li>
            <li>Color-coded availability</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SimpleCalendar;
