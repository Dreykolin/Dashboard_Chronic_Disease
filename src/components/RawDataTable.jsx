import React, { useMemo, useState, useEffect } from 'react';
import {
  useTable,
  useGlobalFilter,
  usePagination,
  useSortBy,
} from 'react-table';

function RawDataTable() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    year: 'Todos',
    sex: 'Todos',
    disease: 'Todos',
  });

  useEffect(() => {
    fetch('/data/rawData.json')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setFiltered(json);
        setLoading(false);
      });
  }, []);

  // Filtros únicos
  const years = useMemo(
    () => ['Todos', ...new Set(data.map((d) => d.year))],
    [data]
  );
  const sexes = useMemo(
    () => ['Todos', ...new Set(data.map((d) => d.sex).filter(Boolean))],
    [data]
  );
  const diseases = useMemo(
    () => ['Todos', ...new Set(data.map((d) => d.disease))],
    [data]
  );

  // Aplicar filtros
  useEffect(() => {
    let result = data;
    if (filters.year !== 'Todos') {
      result = result.filter((r) => String(r.year) === String(filters.year));
    }
    if (filters.sex !== 'Todos') {
      result = result.filter((r) => r.sex === filters.sex);
    }
    if (filters.disease !== 'Todos') {
      result = result.filter((r) => r.disease === filters.disease);
    }
    setFiltered(result);
  }, [filters, data]);

  const columns = useMemo(
    () => [
      { Header: 'País', accessor: 'country' },
      { Header: 'Año', accessor: 'year' },
      { Header: 'Sexo', accessor: 'sex' },
      { Header: 'Enfermedad', accessor: 'disease' },
      { Header: 'Indicador', accessor: 'indicator' },
      {
        Header: 'Valor (%)',
        accessor: 'value',
        sortType: 'basic',
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    pageOptions,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data: filtered,
      initialState: { pageIndex: 0, pageSize: 50 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { globalFilter, pageIndex } = state;

  if (loading) return <p style={{ textAlign: 'center' }}>Cargando datos...</p>;

  return (
    <div style={{ padding: '1rem' }}>
      {/* Buscador global */}
      <input
        value={globalFilter || ''}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Buscar país, enfermedad..."
        style={{
          padding: '8px',
          width: '100%',
          marginBottom: '16px',
          border: '1px solid #ccc',
          borderRadius: '8px',
        }}
      />

      {/* Filtros */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <select
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              Año: {y}
            </option>
          ))}
        </select>

        <select
          value={filters.sex}
          onChange={(e) => setFilters({ ...filters, sex: e.target.value })}
        >
          {sexes.map((s) => (
            <option key={s} value={s}>
              Sexo: {s}
            </option>
          ))}
        </select>

        <select
          value={filters.disease}
          onChange={(e) => setFilters({ ...filters, disease: e.target.value })}
        >
          {diseases.map((d) => (
            <option key={d} value={d}>
              Enfermedad: {d}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      <table
        {...getTableProps()}
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          boxShadow: '0 0 8px rgba(0,0,0,0.1)',
        }}
      >
        <thead style={{ backgroundColor: '#f4f4f4' }}>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  style={{
                    padding: '12px',
                    borderBottom: '2px solid #ddd',
                    textAlign: 'left',
                    fontWeight: '600',
                  }}
                >
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                style={{
                  backgroundColor: 'white',
                  borderBottom: '1px solid #eee',
                }}
              >
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    style={{ padding: '10px', fontSize: '14px' }}
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Navegación */}
      <div
        style={{
          marginTop: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          style={{
            padding: '8px 16px',
            backgroundColor: '#eee',
            border: '1px solid #ccc',
            borderRadius: '6px',
            cursor: canPreviousPage ? 'pointer' : 'not-allowed',
          }}
        >
          Anterior
        </button>

        <span>
          Página <strong>{pageIndex + 1}</strong> de {pageOptions.length}
        </span>

        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
          style={{
            padding: '8px 16px',
            backgroundColor: '#eee',
            border: '1px solid #ccc',
            borderRadius: '6px',
            cursor: canNextPage ? 'pointer' : 'not-allowed',
          }}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default RawDataTable;
