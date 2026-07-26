function escapeCsvCell(value: string | number): string {
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function toCsv(headers: string[], rows: (string | number)[][]): string {
  const lines = [headers, ...rows].map((row) =>
    row.map(escapeCsvCell).join(",")
  );
  // BOM so accented pt-BR characters open correctly in Excel.
  return "﻿" + lines.join("\r\n") + "\r\n";
}
