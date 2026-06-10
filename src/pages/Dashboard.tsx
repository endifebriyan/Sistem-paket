import { useMemo, useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, Inbox, Loader2 } from 'lucide-react';
import { getPackages } from '../utils/storage';
import { Paket } from '../utils/types';
import { isToday, formatTanggalPendek } from '../utils/formatDate';
import { useToast } from '../hooks/useToast';

export default function Dashboard() {
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
    const belumDiambil = packages.filter((p) => p.status === 'menunggu').length;
    const sudahDiambil = packages.filter((p) => p.status === 'diambil').length;
    const hariIni = packages.filter((p) => isToday(p.tanggalMasuk)).length;
    return { total, belumDiambil, sudahDiambil, hariIni };
  }, [packages]);

  const recentPackages = useMemo(() => {
    return [...packages].sort((a, b) => new Date(b.tanggalMasuk).getTime() - new Date(a.tanggalMasuk).getTime()).slice(0, 5);
  }, [packages]);

  useToast(); // ensure toast context available

  const cards = [
    { label: 'Total Paket Masuk', value: stats.total, icon: Package, color: 'bg-primary-600' },
    { label: 'Belum Diambil', value: stats.belumDiambil, icon: Clock, color: 'bg-amber-500' },
    { label: 'Sudah Diambil', value: stats.sudahDiambil, icon: CheckCircle, color: 'bg-emerald-500' },
    { label: 'Masuk Hari Ini', value: stats.hariIni, icon: Inbox, color: 'bg-blue-500' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">Ringkasan penerimaan paket pesantren</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="card flex items-center gap-4">
            <div className={`${card.color} w-12 h-12 rounded-xl flex items-center justify-center shadow-sm`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              <p className="text-xs text-gray-500">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent packages */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Paket Terbaru</h3>
        {recentPackages.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Belum ada paket yang tercatat</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-3 text-gray-500 font-medium">Nama Pemilik</th>
                  <th className="text-left py-3 px-3 text-gray-500 font-medium">No. Resi</th>
                  <th className="text-left py-3 px-3 text-gray-500 font-medium">Ekspedisi</th>
                  <th className="text-left py-3 px-3 text-gray-500 font-medium">Tgl Masuk</th>
                  <th className="text-left py-3 px-3 text-gray-500 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPackages.map((pkg) => (
                  <tr key={pkg.id} className="border-b border-gray-50 hover:bg-primary-50/50 transition-colors">
                    <td className="py-3 px-3 font-medium text-gray-800">{pkg.namaPemilik}</td>
                    <td className="py-3 px-3 text-gray-600 font-mono text-xs">{pkg.nomorResi}</td>
                    <td className="py-3 px-3 text-gray-600">{pkg.ekspedisi}</td>
                    <td className="py-3 px-3 text-gray-600">{formatTanggalPendek(pkg.tanggalMasuk)}</td>
                    <td className="py-3 px-3">
                      <span className={pkg.status === 'menunggu' ? 'badge-menunggu' : 'badge-diambil'}>
                        {pkg.status === 'menunggu' ? 'Menunggu' : 'Sudah Diambil'}
                      </span>
                    </td>
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
