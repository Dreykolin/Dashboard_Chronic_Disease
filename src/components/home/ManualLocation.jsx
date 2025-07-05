import React, { useState } from 'react';

function ManualLocation({ onCoordsReady }) {
  const [ubicacion, setUbicacion] = useState('');

  const manejarEnter = async (e) => {
    if (e.key === 'Enter') {
      await buscarCoordenadas();
    }
  };

  const buscarCoordenadas = async () => {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(ubicacion)}`);
    const data = await res.json();
    if (data.length > 0) {
      const { lat, lon } = data[0];
      onCoordsReady(lat, lon);
    } else {
      alert("No se encontraron coordenadas para esa ubicación");
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <button onClick={buscarCoordenadas} style={{ padding: '0.5rem 1rem', fontSize: '1rem', marginRight: '0.5rem' }}>
        Buscar
      </button>
      <input
        type="text"
        placeholder="Ej: Santiago, Chile"
        value={ubicacion}
        onChange={(e) => setUbicacion(e.target.value)}
        onKeyDown={manejarEnter}
        style={{ flex: 1, padding: '0.5rem', fontSize: '1rem' }}
      />
    </div>
  );
}

export default ManualLocation;
