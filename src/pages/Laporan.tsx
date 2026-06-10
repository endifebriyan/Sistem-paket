import { useMemo, useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Package, Loader2 } from 'lucide-react';
import { getPackages } from '../utils/storage';
import { Paket } from '../utils/types';
import { formatTanggalIndonesia, formatTanggalKategori, getDateRange } from '../utils/formatDate';

const PIE_COLORS = ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0'];

export default function Laporan() {
  const [packages, setPackages] = useState<Paket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPackages().then(data => {
      setPackages(data);
      setLoading(false);
    });
  }, []);

  const stats = useMemo(() => {
    const total = packages.length;
    const sudahDiambil = packages.filter((p) => p.status === 'diambil').length;
    const belumDiambil = packages.filter((p) => p.status === 'menunggu').length;
    const persentase = total > 0 ? Math.round((sudahDiambil / total) * 100) : 0;
    return { total, sudahDiambil, belumDiambil, persentase };
  }, [packages]);

  // Bar chart: packages per day (last 7 days)
  const barData = useMemo(() => {
    const { start, end } = getDateRange(7);
    const days: Record<string, number> = {};
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const key = formatTanggalKategori(d.toISOString());
      days[key] = 0;
    }
    packages.forEach((p) => {
      const d = new Date(p.tanggalMasuk);
      if (d >= start && d <= end) {
        const key = formatTanggalKategori(p.tanggalMasuk);
        days[key] = (days[key] || 0) + 1;
      }
    });
    return Object.entries(days).map(([date, count]) => ({ date, jumlah: count }));
  }, [packages]);

  // Pie chart: by jenis paket
  const pieData = useMemo(() => {
    const counts: Record<string, number> = {};
    packages.forEach((p) => {
      counts[p.jenisPaket] = (counts[p.jenisPaket] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [packages]);

  // Overdue: belum diambil, sorted oldest first
  const overdue = useMemo(() => {
    return packages
      .filter((p) => p.status === 'menunggu')
      .sort((a, b) => new Date(a.tanggalMasuk).getTime() - new Date(b.tanggalMasuk).getTime());
  }, [packages]);

  function exportCSV() {
    const headers = ['No', 'Nama Pemilik', 'No. Resi', 'Jenis Paket', 'Ekspedisi', 'Tanggal Masuk', 'Status', 'Tanggal Diambil', 'Catatan'];
    const rows = packages.map((p, i) => [
      i + 1,
      p.namaPemilik,
      p.nomorResi,
      p.jenisPaket,
      p.ekspedisi,
      formatTanggalIndonesia(p.tanggalMasuk),
      p.status === 'menunggu' ? 'Menunggu' : 'Sudah Diambil',
      p.tanggalDiambil ? formatTanggalIndonesia(p.tanggalDiambil) : '-',
      p.catatan || '-',
    ]);

    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SiPaket_Laporan_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Laporan</h2>
          <p className="text-sm text-gray-500 mt-1">Statistik dan laporan penerimaan paket</p>
        </div>
        <button onClick={exportCSV} className="btn-primary flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export ke CSV
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard label="Total Paket" value={stats.total} />
        <SummaryCard label="Sudah Diambil" value={stats.sudahDiambil} color="text-primary-600" />
        <SummaryCard label="Belum Diambil" value={stats.belumDiambil} color="text-amber-600" />
        <SummaryCard label="Persentase Pengambilan" value={`${stats.persentase}%`} color="text-primary-700" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar chart */}
        <div className="card">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Paket per Hari (7 Hari Terakhir)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #dcfce7', fontSize: '13px' }}
              />
              <Bar dataKey="jumlah" fill="#16a34a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="card">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Berdasarkan Jenis Paket</h3>
          {pieData.length === 0 ? (
            <div className="flex items-center justify-center h-[260px] text-gray-400 text-sm">Belum ada data</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                  labelLine={{ stroke: '#86efac' }}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Overdue table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">Paket Belum Diambil</h3>
          <p className="text-xs text-gray-400 mt-0.5">Diurutkan dari yang paling lama</p>
        </div>
        {overdue.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Package className="w-12 h-12 text-gray-200 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Semua paket sudah diambil!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-amber-50/50">
                  <th className="text-left py-3 px-4 text-gray-600 font-medium text-xs">No</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium text-xs">Nama Pemilik</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium text-xs">No. Resi</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium text-xs hidden sm:table-cell">Jenis</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium text-xs">Tgl Masuk</th>
                </tr>
              </thead>
              <tbody>
                {overdue.map((pkg, i) => (
                  <tr key={pkg.id} className="border-b border-gray-50 hover:bg-amber-50/30 transition-colors">
                    <td className="py-3 px-4 text-gray-500">{i + 1}</td>
                    <td className="py-3 px-4 font-medium text-gray-800">{pkg.namaPemilik}</td>
                    <td className="py-3 px-4 text-gray-600 font-mono text-xs">{pkg.nomorResi}</td>
                    <td className="py-3 px-4 text-gray-600 hidden sm:table-cell">{pkg.jenisPaket}</td>
                    <td className="py-3 px-4 text-gray-600 text-xs">{formatTanggalIndonesia(pkg.tanggalMasuk)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ label, value, color }: { label: string; value: number | string; color?: string }) {
  return (
    <div className="card text-center py-5">
      <p className={`text-3xl font-bold ${color || 'text-gray-800'}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}
