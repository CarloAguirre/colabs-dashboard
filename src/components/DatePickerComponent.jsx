import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

export const DatePickerComponent = ({ orderNumber, deliveryDate, onDateChange }) => {
  const handleChange = (date) => {
    const formattedDate = moment(date).format('DD/MM/YYYY');
    onDateChange(orderNumber, formattedDate);
  };

  const parsedDeliveryDate = moment(deliveryDate, 'DD/MM/YYYY').toDate();

  return (
    <DatePicker
      selected={deliveryDate ? parsedDeliveryDate : null}
      onChange={handleChange}
      dateFormat="dd/MM/yyyy"
    //   popperPlacement="bottom-start" // Ajusta la posición del selector de fechas
    />
  );
};
