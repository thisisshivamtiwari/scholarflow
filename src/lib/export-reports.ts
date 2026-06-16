import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

export const exportGradesPdf = (
  title: string,
  rows: string[][],
  headers: string[],
) => {
  const doc = new jsPDF()
  doc.setFontSize(14)
  doc.text(title, 14, 16)
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 22,
  })
  doc.save(`${title.replace(/\s+/g, '-').toLowerCase()}.pdf`)
}

export const exportGradesExcel = (
  title: string,
  rows: Record<string, string | number>[],
) => {
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Report')
  XLSX.writeFile(wb, `${title.replace(/\s+/g, '-').toLowerCase()}.xlsx`)
}
