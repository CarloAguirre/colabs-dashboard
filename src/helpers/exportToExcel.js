import { saveAs } from "file-saver";
import ExcelJS from "exceljs";

export const exportToExcel = async () => {
    const table = document.getElementById("tabla");
  
    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();
  
    // Agregar una nueva hoja al libro de Excel
    const sheet = workbook.addWorksheet("Hoja1");
  
    // Establecer el formato de fecha general para todas las celdas
    sheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.numFmt = "General";
      });
    });
  
    // Obtener los encabezados de columna de la tabla
    const headerRow = table.querySelector("thead tr");
    const headerCells = Array.from(headerRow.querySelectorAll("th"));
  
    // Escribir los encabezados de columna en el libro de Excel
    headerCells.forEach((headerCell, cellIndex) => {
      sheet.getCell(1, cellIndex + 1).value = headerCell.textContent;
    });
  
    // Obtener las filas de datos de la tabla
    const dataRows = Array.from(table.querySelectorAll("tbody tr"));
  
    // Recorrer las filas de datos y obtener los valores de las celdas
    dataRows.forEach((dataRow, rowIndex) => {
      const dataCells = Array.from(dataRow.querySelectorAll("td"));
  
      // Escribir los valores de las celdas en el libro de Excel
      dataCells.forEach((dataCell, cellIndex) => {
        const cellValue = dataCell.textContent;
  
        // Verificar si el valor de la celda es un enlace
        if (dataCell.querySelector("a")) {
          const linkElement = dataCell.querySelector("a");
          const href = linkElement.getAttribute("href");
          const text = linkElement.textContent;
  
          // Agregar un hipervínculo a la celda
          const cell = sheet.getCell(rowIndex + 2, cellIndex + 1);
          cell.value = { text, hyperlink: href };
        } else {
          // Verificar si el valor de la celda es una fecha
          const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
          if (dateRegex.test(cellValue)) {
            // Obtener los componentes de la fecha
            const [, day, month, year] = dateRegex.exec(cellValue);
  
            // Crear la fecha en el formato "dd/mm/yyyy"
            const formattedDate = new Date(`${month}/${day}/${year}`);
  
            // Escribir la fecha en la celda
            const cell = sheet.getCell(rowIndex + 2, cellIndex + 1);
            cell.value = formattedDate;
            // cell.numFmt = "mm/dd/yyyy"; // Establecer el formato de fecha como "mm/dd/yyyy"
          } else {
            // Verificar si el valor de la celda contiene el signo "$"
            if (cellValue.includes("$")) {
              // Eliminar el signo de peso y las comas del valor
              const numericValue = cellValue.replace(/\$|,/g, "");
  
              // Verificar si el valor es un número
              if (!isNaN(parseFloat(numericValue))) {
                // Convertir el valor a número y escribirlo en la celda
                const numericCellValue = parseFloat(numericValue);
                const cell = sheet.getCell(rowIndex + 2, cellIndex + 1);
                cell.value = numericCellValue;
  
                // Establecer el formato de número en la celda
                cell.numFmt = "#,##0.00";
              } else {
                // Escribir el valor de la celda sin modificar
                sheet.getCell(rowIndex + 2, cellIndex + 1).value = cellValue;
              }
            } else {
              // Escribir el valor de la celda sin modificar
              sheet.getCell(rowIndex + 2, cellIndex + 1).value = cellValue;
            }
          }
        }
      });
    });
  
    // Generar un búfer de Excel en memoria
    const excelBuffer = await workbook.xlsx.writeBuffer();
  
    // Crear un objeto Blob a partir del búfer de Excel
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  
    // Descargar el archivo de Excel
    saveAs(data, `Informe_ordenes.xlsx`);
  };