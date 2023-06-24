import { saveAs } from "file-saver";
import ExcelJS from "exceljs";

export const exportToExcel = async () => {
  const table = document.getElementById("tabla");

  const workbook = new ExcelJS.Workbook();

  const sheet = workbook.addWorksheet("Hoja1");

  sheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.numFmt = "General";
    });
  });

  const headerRow = table.querySelector("thead tr");
  const headerCells = Array.from(headerRow.querySelectorAll("th"));

  headerCells.forEach((headerCell, cellIndex) => {
    // Eliminar la expresión "restart_alt" del texto del encabezado
    const cellText = headerCell.textContent.replace("restart_alt", "").trim();

    sheet.getCell(1, cellIndex + 1).value = cellText;
  });

  const dataRows = Array.from(table.querySelectorAll("tbody tr"));

  dataRows.forEach((dataRow, rowIndex) => {
    const dataCells = Array.from(dataRow.querySelectorAll("td"));

    dataCells.forEach((dataCell, cellIndex) => {
      const cellValue = dataCell.textContent;

      const textContent = Array.from(dataCell.childNodes)
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent)
        .join("");

      if (dataCell.querySelector("a")) {
        const linkElement = dataCell.querySelector("a");
        const href = linkElement.getAttribute("href");
        const text = linkElement.textContent;

        const cell = sheet.getCell(rowIndex + 2, cellIndex + 1);
        cell.value = { text, hyperlink: href };
      } else {
        const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
        if (dateRegex.test(cellValue)) {
          const [, day, month, year] = dateRegex.exec(cellValue);

          const formattedDate = new Date(`${month}/${day}/${year}`);

          const cell = sheet.getCell(rowIndex + 2, cellIndex + 1);
          cell.value = formattedDate;
        } else {
          if (cellValue.includes("$")) {
            const numericValue = cellValue.replace(/\$|,/g, "");

            if (!isNaN(parseFloat(numericValue))) {
              const numericCellValue = parseFloat(numericValue);
              const cell = sheet.getCell(rowIndex + 2, cellIndex + 1);
              cell.value = numericCellValue;

              cell.numFmt = "#,##0.00";
            } else {
              sheet.getCell(rowIndex + 2, cellIndex + 1).value = cellValue;
            }
          } else {
            sheet.getCell(rowIndex + 2, cellIndex + 1).value = cellValue;
          }
        }
      }
    });
  });

  const excelBuffer = await workbook.xlsx.writeBuffer();

  const data = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(data, `Informe_ordenes.xlsx`);
};
