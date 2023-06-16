import { format } from 'date-fns';
import { orderUpdate } from './orderUpdate';

export const handleDateChange = async(orderNumber, newDate) => {

    const dateParts = newDate.split("/"); // Divide la cadena en partes separadas por "/"
    const day = parseInt(dateParts[0], 10); // Obtiene el día y lo convierte en un número entero
    const month = parseInt(dateParts[1], 10) - 1; // Obtiene el mes (restamos 1 porque los meses en JavaScript son indexados desde 0)
    const year = parseInt(dateParts[2], 10); // Obtiene el año

    const date = new Date(year, month, day);

    const fechaFormateada = format(date, 'dd/MM/yyyy');

    // eslint-disable-next-line no-restricted-globals
    const result = confirm(`Estas seguro que deseas cambiar la fecha a ${fechaFormateada}?`);
      if (result === true) {
        try {
          await orderUpdate(orderNumber, null, fechaFormateada)
          
        } catch (error) {
          alert('Se produjo un error, por favor comunicate con el administrador del sitio.')
        }
      } else {
      }
  };