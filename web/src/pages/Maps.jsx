import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useState } from 'react';

const pois = [
  { id: 1, name: 'Puerta del Sol', position: { lat: 40.4169, lng: -3.7035 } },
  { id: 2, name: 'Plaza Mayor', position: { lat: 40.4154, lng: -3.7074 } },
  {
    id: 3,
    name: 'Parque del Retiro',
    position: { lat: 40.4153, lng: -3.6844 },
  },
];

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = { lat: 40.4169, lng: -3.7035 };

const gmapsKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

export const Maps = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: gmapsKey,
  });
  const [selectedPoi, setSelectedPoi] = useState(null);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '32px 32px',
      }}
    >
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
        {pois.map((poi) => (
          <Marker
            key={poi.id}
            position={poi.position}
            label={poi.name}
            onClick={() => setSelectedPoi(poi)}
          />
        ))}
      </GoogleMap>
      {selectedPoi && (
        <div
          style={{
            marginTop: '16px',
            padding: '12px 24px',
            background: '#f5f5f5',
            borderRadius: '8px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}
        >
          <h3 style={{ margin: 0 }}>{selectedPoi.name}</h3>
          <p style={{ margin: '8px 0 0 0' }}>
            Lat: {selectedPoi.position.lat}, Lng: {selectedPoi.position.lng}
          </p>
        </div>
      )}
    </div>
  );
};
