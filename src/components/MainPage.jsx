import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Tooltip } from 'react-tooltip';
import styles from '@/styles/MainPage.module.css'; // Estilos de la página principal
import NavBar from '@/components/NavBar';
import FilterMenu from '@/components/FilterMenu'; // Importamos el menú separado
import RawDataTable from './RawDataTable';
import Statistics from './Statistics';

// Cargamos el mapa de forma dinámica para evitar errores de hidratación
const DynamicCoropletico = dynamic(
  () => import('@/components/Coropletico'),
  {
    ssr: false,
    loading: () => <p style={{ textAlign: 'center' }}>Cargando mapa...</p>
  }
);

export default function MainPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [filters, setFilters] = useState({ year: '2019', sex: 'SEX_BTSX' });
  const [tooltipContent, setTooltipContent] = useState("");
  const [activeTab, setActiveTab] = useState('Coropletico');

  return (
    <div>
      <NavBar setActiveTab={setActiveTab} activeTab={activeTab} />

      {activeTab === 'Coropletico' && (
        <FilterMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          filters={filters}
          onFilterChange={setFilters}
        />
      )}

      <main className={styles.content}>
        {activeTab === 'Coropletico' && (
          <DynamicCoropletico
            filters={filters}
            setFilters={setFilters}  // para actualizar el año desde el slider
            setTooltipContent={setTooltipContent}
          />
        )}

        {activeTab === 'Estadísticas' && <Statistics />}
        {activeTab === 'Datos Crudos' && <RawDataTable />}
      </main>

      <Tooltip id="map-tooltip" content={tooltipContent} />
    </div>
  );
}