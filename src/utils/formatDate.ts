const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export function formatTanggalIndonesia(dateStr: string): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  const hari = HARI[d.getDay()];
  const tgl = d.getDate();
  const bulan = BULAN[d.getMonth()];
  const tahun = d.getFullYear();
  const jam = d.getHours().toString().padStart(2, '0');
  const menit = d.getMinutes().toString().padStart(2, '0');
  return `${hari}, ${tgl} ${bulan} ${tahun} — ${jam}:${menit}`;
}

export function formatTanggalPendek(dateStr: string): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  const tgl = d.getDate().toString().padStart(2, '0');
  const bulan = (d.getMonth() + 1).toString().padStart(2, '0');
  const tahun = d.getFullYear();
  const jam = d.getHours().toString().padStart(2, '0');
  const menit = d.getMinutes().toString().padStart(2, '0');
  return `${tgl}/${bulan}/${tahun} ${jam}:${menit}`;
}

export function formatTanggalKategori(dateStr: string): string {
  const d = new Date(dateStr);
  const tgl = d.getDate().toString().padStart(2, '0');
  const bulan = (d.getMonth() + 1).toString().padStart(2, '0');
  return `${tgl}/${bulan}`;
}

export function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

export function getNowLocal(): string {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export function getDateRange(days: number): { start: Date; end: Date } {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const start = new Date();
  start.setDate(start.getDate() - (days - 1));
  start.setHours(0, 0, 0, 0);
  return { start, end };
}
