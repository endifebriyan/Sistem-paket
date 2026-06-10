import { useState, useMemo, useCallback } from 'react';
import { Search, Eye, CheckCircle, Trash2, ChevronLeft, ChevronRight, Package, Image as ImageIcon } from 'lucide-react';
import { getPackages, updatePackageStatus, deletePackage } from '../utils/storage';
import { Paket } from '../utils/types';
import { formatTanggalIndonesia, formatTanggalPendek } from '../utils/formatDate';
import { useToast } from '../hooks/useToast';

const PAGE_SIZE = 10;

export default function ManajemenStatus() {
  const { addToast } = useToast();
  const [packages, setPackages] = useState<Paket[]>(() => getPackages());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'semua' | 'menunggu' | 'diambil'>('semua');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);

  // Modal states
  const [detailPkg, setDetailPkg] = useState<Paket | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ type: 'ambil' | 'hapus'; pkg: Paket } | null>(null);
  const [imageReview, setImageReview] = useState<string | null>(null);

  const refresh = useCallback(() => setPackages(getPackages()), []);

  const filtered = useMemo(() => {
    let result = [...packages];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.namaPemilik.toLowerCase().includes(q) || p.nomorResi.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'semua') {
      result = result.filter((p) => p.status === statusFilter);
    }

    if (dateFrom) {
      const from = new Date(dateFrom);
      from.setHours(0, 0, 0, 0);
      result = result.filter((p) => new Date(p.tanggalMasuk) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      result = result.filter((p) => new Date(p.tanggalMasuk) <= to);
    }

    result.sort((a, b) => new Date(b.tanggalMasuk).getTime() - new Date(a.tanggalMasuk).getTime());
    return result;
  }, [packages, search, statusFilter, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handleAmbil(pkg: Paket) {
    updatePackageStatus(pkg.id);
    refresh();
    addToast(`Paket ${pkg.nomorResi} ditandai sudah diambil`, 'success');
    setConfirmAction(null);
  }

  function handleHapus(pkg: Paket) {
    deletePackage(pkg.id);
    refresh();
    addToast(`Paket ${pkg.nomorResi} dihapus`, 'info');
    setConfirmAction(null);
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Manajemen Status</h2>
        <p className="text-sm text-gray-500 mt-1">Kelola dan pantau status paket</p>
      </div>

      {/* Filters */}
      <div className="card space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input-field pl-10"
              placeholder="Cari nama pemilik atau no. resi..."
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as any); setPage(1); }}
            className="select-field sm:w-44"
          >
            <option value="semua">Semua Status</option>
            <option value="menunggu">Menunggu</option>
            <option value="diambil">Sudah Diambil</option>
          </select>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Dari tanggal</label>
            <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }} className="input-field" />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Sampai tanggal</label>
            <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }} className="input-field" />
          </div>
          {(dateFrom || dateTo) && (
            <button
              onClick={() => { setDateFrom(''); setDateTo(''); setPage(1); }}
              className="btn-secondary text-sm whitespace-nowrap"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        {filtered.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Package className="w-14 h-14 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">Tidak ada paket ditemukan</p>
            <p className="text-xs text-gray-300 mt-1">Coba ubah filter atau kata kunci pencarian</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary-50/60 border-b border-primary-100">
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-xs uppercase tracking-wider">No</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-xs uppercase tracking-wider">Nama Pemilik</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-xs uppercase tracking-wider">No. Resi</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-xs uppercase tracking-wider hidden sm:table-cell">Jenis</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-xs uppercase tracking-wider hidden md:table-cell">Ekspedisi</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-xs uppercase tracking-wider hidden lg:table-cell">Tgl Masuk</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-xs uppercase tracking-wider">Status</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-semibold text-xs uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((pkg, i) => (
                    <tr key={pkg.id} className="border-b border-gray-50 hover:bg-primary-50/30 transition-colors">
                      <td className="py-3 px-4 text-gray-500">{(safePage - 1) * PAGE_SIZE + i + 1}</td>
                      <td className="py-3 px-4 font-medium text-gray-800">
                        <div className="flex items-center gap-3">
                          {pkg.foto ? (
                            <img src={pkg.foto} alt="Foto" className="w-8 h-8 rounded-lg object-cover border border-gray-100 flex-shrink-0" />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                              <Package className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                          <span className="truncate">{pkg.namaPemilik}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-mono text-xs">{pkg.nomorResi}</td>
                      <td className="py-3 px-4 text-gray-600 hidden sm:table-cell">{pkg.jenisPaket}</td>
                      <td className="py-3 px-4 text-gray-600 hidden md:table-cell">{pkg.ekspedisi}</td>
                      <td className="py-3 px-4 text-gray-600 hidden lg:table-cell">{formatTanggalPendek(pkg.tanggalMasuk)}</td>
                      <td className="py-3 px-4">
                        <span className={pkg.status === 'menunggu' ? 'badge-menunggu' : 'badge-diambil'}>
                          {pkg.status === 'menunggu' ? 'Menunggu' : 'Diambil'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          {pkg.status === 'menunggu' && (
                            <button
                              onClick={() => setConfirmAction({ type: 'ambil', pkg })}
                              className="p-1.5 rounded-lg hover:bg-primary-100 text-primary-600 transition-colors"
                              title="Tandai Diambil"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setDetailPkg(pkg)}
                            className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors"
                            title="Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {pkg.foto && (
                            <button
                              onClick={() => setImageReview(pkg.foto!)}
                              className="p-1.5 rounded-lg hover:bg-emerald-100 text-emerald-600 transition-colors"
                              title="Lihat Foto"
                            >
                              <ImageIcon className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setConfirmAction({ type: 'hapus', pkg })}
                            className="p-1.5 rounded-lg hover:bg-red-100 text-red-500 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/50">
              <p className="text-xs text-gray-500">
                Menampilkan {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} dari {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(safePage - 1)}
                  disabled={safePage <= 1}
                  className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-gray-600 px-2">{safePage} / {totalPages}</span>
                <button
                  onClick={() => setPage(safePage + 1)}
                  disabled={safePage >= totalPages}
                  className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {detailPkg && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setDetailPkg(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Detail Paket</h3>
            {detailPkg.foto && (
              <div className="mb-4">
                <img src={detailPkg.foto} alt="Foto Paket" className="w-full h-48 object-cover rounded-xl border border-gray-100 shadow-sm" />
              </div>
            )}
            <div className="space-y-3 text-sm">
              <DetailRow label="Nama Pemilik" value={detailPkg.namaPemilik} />
              <DetailRow label="Nomor Resi" value={detailPkg.nomorResi} mono />
              <DetailRow label="Jenis Paket" value={detailPkg.jenisPaket} />
              <DetailRow label="Ekspedisi" value={detailPkg.ekspedisi} />
              <DetailRow label="Tanggal Masuk" value={formatTanggalIndonesia(detailPkg.tanggalMasuk)} />
              <DetailRow label="Status" value={detailPkg.status === 'menunggu' ? 'Menunggu' : 'Sudah Diambil'} />
              {detailPkg.tanggalDiambil && <DetailRow label="Tanggal Diambil" value={formatTanggalIndonesia(detailPkg.tanggalDiambil)} />}
              {detailPkg.catatan && <DetailRow label="Catatan" value={detailPkg.catatan} />}
            </div>
            <button onClick={() => setDetailPkg(null)} className="btn-secondary w-full mt-6">Tutup</button>
          </div>
        </div>
      )}

      {/* Image Review Modal */}
      {imageReview && (
        <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4" onClick={() => setImageReview(null)}>
          <div className="relative max-w-4xl w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setImageReview(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 text-sm font-medium"
            >
              Tutup (X)
            </button>
            <img src={imageReview} alt="Review" className="w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-2xl" />
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setConfirmAction(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {confirmAction.type === 'ambil' ? 'Konfirmasi Pengambilan' : 'Konfirmasi Hapus'}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {confirmAction.type === 'ambil'
                ? `Tandai paket ${confirmAction.pkg.nomorResi} a/n ${confirmAction.pkg.namaPemilik} sebagai "Sudah Diambil"?`
                : `Hapus paket ${confirmAction.pkg.nomorResi} a/n ${confirmAction.pkg.namaPemilik}? Tindakan ini tidak dapat dibatalkan.`
              }
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmAction(null)} className="btn-secondary flex-1">Batal</button>
              <button
                onClick={() => confirmAction.type === 'ambil' ? handleAmbil(confirmAction.pkg) : handleHapus(confirmAction.pkg)}
                className={`flex-1 ${confirmAction.type === 'ambil' ? 'btn-primary' : 'btn-danger'}`}
              >
                {confirmAction.type === 'ambil' ? 'Tandai Diambil' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-gray-500 flex-shrink-0">{label}</span>
      <span className={`text-gray-800 text-right ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}
