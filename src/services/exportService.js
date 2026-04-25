import * as XLSX from 'xlsx'

/**
 * Service to export ticket data to Excel
 * @param {Array} tickets - List of ticket objects
 */
export const exportTicketsToExcel = (tickets) => {
  if (!tickets || tickets.length === 0) {
    alert('Tidak ada data untuk di-export.')
    return
  }

  // Format data for Excel
  const data = tickets.map(t => ({
    'ID Tiket': t.id,
    'Judul': t.title,
    'Kategori': t.category,
    'Prioritas': t.priority,
    'Status': t.status,
    'Pengirim': t.userName,
    'Dibuat Pada': t.createdAt?.toDate ? t.createdAt.toDate().toLocaleString() : t.createdAt,
    'Rating': t.rating || 'Belum ada',
    'Feedback': t.feedback || '-'
  }))

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(data)
  
  // Create workbook
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Daftar Tiket")

  // Generate and download file
  const fileName = `DameDesk_Report_${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(workbook, fileName)
}
