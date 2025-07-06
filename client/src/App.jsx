import React from 'react';
import ChoroplethMap from './components/ChoroplethMap';
import './App.css'; // Estilos generales de la app

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Mi Mapa Coroplético con React + Vite</h1>
        <p>Este mapa muestra datos de ejemplo y funciona de manera 100% cliente.</p>
      </header>
      <main>
        <ChoroplethMap />
      </main>
    </div>
  );
}

export default App;