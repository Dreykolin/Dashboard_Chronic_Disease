import React, { useMemo, useState, useEffect } from 'react';
import {
  useTable,
  useGlobalFilter,
  usePagination,
  useSortBy,
} from 'react-table';
import Select from 'react-select';

const diseaseLabels = {
  NCD_BMI_30A: "Obesidad (IMC ≥ 30)",
  NCD_DIABETES_PREVALENCE_AGESTD: "Prevalencia de diabetes",
  NCD_DIABETES_TREATMENT_AGESTD: "Tratamiento de diabetes",
  NCD_HYP_PREVALENCE_A: "Prevalencia de hipertensión",
  NCD_HYP_DIAGNOSIS_A: "Hipertensión diagnosticada",
  NCD_HYP_TREATMENT_A: "Tratamiento de hipertensión",
  NCD_HYP_CONTROL_A: "Hipertensión controlada",
  NCDMORT3070: "Probabilidad de morir 30-70 años (ENT)",
  SA_0000001419: "DALYs - cáncer de mama",
  SA_0000001420: "DALYs - cáncer colorrectal",
  SA_0000001430: "DALYs - cáncer de esófago",
  SA_0000001438: "Mortalidad - cáncer de mama",
  SA_0000001439: "Mortalidad - cáncer colorrectal",
  SA_0000001445: "Mortalidad - cáncer de hígado",
  SA_0000001448: "Mortalidad - cáncer orofaríngeo",
  ORAL_HEALTH_CANCER_LIPORALCAVITY_100K: "Cáncer oral/labial"
};


const sexLabels = {
  SEX_FMLE: 'Mujeres',
  SEX_MLE: 'Hombres',
  SEX_BTSX: 'Ambos sexos',
};

const RawDataTable = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    year: 'Todos',
    sex: 'Todos',
    disease: 'Todos',
    region: 'Todos',
    continent: 'Todos',
    indicator: 'Todos',
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

  const years = useMemo(() => ['Todos', ...new Set(data.map((d) => d.year))].sort().reverse(), [data]);
  const sexes = useMemo(() => ['Todos', ...new Set(data.map((d) => d.sex).filter(Boolean))], [data]);
  const diseases = useMemo(() => ['Todos', ...new Set(data.map((d) => d.disease))], [data]);
  const regions = useMemo(() => ['Todos', ...new Set(data.map((d) => d.region).filter(Boolean))], [data]);
  const continents = useMemo(() => ['Todos', ...new Set(data.map((d) => d.continent).filter(Boolean))], [data]);

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
    if (filters.indicator !== 'Todos') {
      result = result.filter((r) => r.indicator === filters.indicator);
    }
    if (filters.region !== 'Todos') {
      result = result.filter((r) => r.region === filters.region);
    }
    if (filters.continent !== 'Todos') {
      result = result.filter((r) => r.continent === filters.continent);
    }
    setFiltered(result);
  }, [filters, data]);

  const columns = useMemo(
    () => [
      { Header: 'País', accessor: 'country' },
      { Header: 'Año', accessor: 'year' },
      {
        Header: 'Sexo',
        accessor: 'sex',
        Cell: ({ value }) => sexLabels[value] || value,
      },
      { Header: 'Enfermedad', accessor: 'disease' },
      {
        Header: 'Indicador',
        accessor: 'indicator',
        Cell: ({ value }) => (
          <span title={diseaseLabels[value] || value}>
            {value}
          </span>
        ),
      },
      {
        Header: 'Valor (%)',
        accessor: 'value',
        sortType: 'basic',
      },
      { Header: 'Región', accessor: 'region' },
      { Header: 'Continente', accessor: 'continent' },
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

  const indicatorsByDisease = useMemo(() => {
    const map = {};
    data.forEach((d) => {
      if (!map[d.disease]) map[d.disease] = new Set();
      if (d.indicator) map[d.disease].add(d.indicator);
    });
    // Convierte Set a Array
    Object.keys(map).forEach((k) => map[k] = Array.from(map[k]));
    return map;
  }, [data]);

  const indicators = useMemo(() => {
    if (filters.disease !== 'Todos' && indicatorsByDisease[filters.disease]) {
      return ['Todos', ...indicatorsByDisease[filters.disease]];
    }
    // Si no hay enfermedad seleccionada, muestra todos los indicadores únicos
    return ['Todos', ...new Set(data.map((d) => d.indicator).filter(Boolean))];
  }, [filters.disease, indicatorsByDisease, data]);

  if (loading) return <p style={{ textAlign: 'center' }}>Cargando datos...</p>;

  const styledSelect = {
    control: (base) => ({
      ...base,
      minWidth: 180,
      fontSize: '0.95rem',
      zIndex: 5,
    }),
  };

  return (
    <div style={{ padding: '1rem' }}>
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

      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1rem',
          flexWrap: 'wrap',
        }}
      >
        {[{
          name: 'year', options: years
        }, {
          name: 'sex', options: sexes
        }, {
          name: 'disease', options: diseases
        }, {
          name: 'indicator', options: indicators
        }, {
          name: 'region', options: regions
        }, {
          name: 'continent', options: continents
        }].map(({ name, options }) => (
          <Select
            key={name}
            styles={styledSelect}
            options={options.map((v) => ({ value: v, label: v }))}
            value={{ value: filters[name], label: filters[name] }}
            onChange={(selected) =>
              setFilters((prev) => ({ ...prev, [name]: selected.value }))
            }
          />
        ))}
      </div>

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
            backgroundColor: '#e74c3c',
            color: '#fff',
            border: 'none',
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
            backgroundColor: '#e74c3c',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: canNextPage ? 'pointer' : 'not-allowed',
          }}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default RawDataTable;