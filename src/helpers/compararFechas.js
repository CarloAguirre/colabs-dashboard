export function compararFechas(fecha1, fecha2) {
    // Convertir las fechas al formato "yyyy/mm/dd" para una comparación adecuada
    const partesFecha1 = fecha1.split('/');
    const fechaFormateada1 = `${partesFecha1[2]}/${partesFecha1[1]}/${partesFecha1[0]}`;
    
    const partesFecha2 = fecha2.split('/');
    const fechaFormateada2 = `${partesFecha2[2]}/${partesFecha2[1]}/${partesFecha2[0]}`;
    
    // Comparar las fechas en formato "yyyy/mm/dd"
    if (fechaFormateada1 > fechaFormateada2) {
      return -1;
    } else if (fechaFormateada1 < fechaFormateada2) {
      return 1;
    } else {
      return 0;
    }
  }