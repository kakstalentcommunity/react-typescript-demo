type CellValue = string | number | boolean | null | undefined;

type Worksheet = {
  name: string;
  rows: Record<string, CellValue>[];
};

const xmlEscape = (value: CellValue) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const toTitle = (key: string) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .trim();

const cell = (value: CellValue, styleId?: string) => {
  const type = typeof value === "number" ? "Number" : "String";
  const style = styleId ? ` ss:StyleID="${styleId}"` : "";

  return `<Cell${style}><Data ss:Type="${type}">${xmlEscape(value)}</Data></Cell>`;
};

const worksheetXml = ({ name, rows }: Worksheet) => {
  const columns = rows.length ? Object.keys(rows[0]) : [];
  const header = columns.map((column) => cell(toTitle(column), "Header")).join("");
  const body = rows
    .map((row) => {
      const cells = columns.map((column) => cell(row[column])).join("");
      return `<Row>${cells}</Row>`;
    })
    .join("");

  return `
    <Worksheet ss:Name="${xmlEscape(name)}">
      <Table>
        <Row>${header}</Row>
        ${body}
      </Table>
    </Worksheet>
  `;
};

export const exportExcel = (fileName: string, worksheets: Worksheet[]) => {
  const workbook = `<?xml version="1.0"?>
  <?mso-application progid="Excel.Sheet"?>
  <Workbook
    xmlns="urn:schemas-microsoft-com:office:spreadsheet"
    xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:x="urn:schemas-microsoft-com:office:excel"
    xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
    <Styles>
      <Style ss:ID="Header">
        <Font ss:Bold="1"/>
        <Interior ss:Color="#DFF3FF" ss:Pattern="Solid"/>
      </Style>
    </Styles>
    ${worksheets.map(worksheetXml).join("")}
  </Workbook>`;

  const blob = new Blob([workbook], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName.endsWith(".xls") ? fileName : `${fileName}.xls`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
