import Form from 'react-bootstrap/Form';
import { useOrdenes } from '../context';
import { useState } from 'react';
import { format, parse, isBefore } from 'date-fns';

export const YearSelector = () => {
  const { orders, licitations, year, setFacturadoYear, setYear } = useOrdenes();

  // Combinar las fechas de orders y licitations
  const allDates = [...orders, ...licitations].map(item => item.fecha);

  // Obtener los años únicos de las fechas combinadas
  const uniqueYears = [...new Set(allDates.map((date) => parse(date, 'dd/MM/yyyy', new Date()).getFullYear()))];

  // Obtener el año actual y el mes actual
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // Agregar 1 ya que los meses en JavaScript son base 0 (enero = 0, febrero = 1, etc.)

  // Filtrar los años futuros antes de septiembre
  const filteredYears = uniqueYears.filter((year) => {
    return currentMonth >= 9 ? year <= currentYear : year < currentYear;
  });

  // Calcular los periodos de septiembre a septiembre
  const periodOptions = filteredYears.map((year) => {
    const startYear = year;
    const endYear = year + 1;
    const periodLabel = `Septiembre ${startYear}-${endYear}`;
    return (
      <option key={startYear} value={startYear}>
        {periodLabel}
      </option>
    );
  });

  const handleYearChange = (e) => {
    const selectedYear = e.target.value;
    setFacturadoYear(selectedYear);
  };

  return (
    <Form.Select
      aria-label="Default select example"
      value={year}
      onChange={handleYearChange}
    >
      <option value="all">Todos los periodos</option>
      {periodOptions}
    </Form.Select>
  );
}
