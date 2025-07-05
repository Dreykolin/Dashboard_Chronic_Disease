import React from 'react';

function AutomaticLocation({ onCoordsReady }) {
  const obtenerUbicacion = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onCoordsReady(latitude, longitude);
      },
      () => alert('No se pudo obtener la ubicación'),
      { enableHighAccuracy: true }
    );
  };

  return (
    <button onClick={obtenerUbicacion} style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
      Detectar ubicación
    </button>
  );
}

export default AutomaticLocation;
