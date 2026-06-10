import { useState, FormEvent } from 'react';
import { Save } from 'lucide-react';
import { addPackage, isResiUnique } from '../utils/storage';
import { JENIS_PAKET_OPTIONS, EKSPEDISI_OPTIONS } from '../utils/types';
import { getNowLocal } from '../utils/formatDate';
import { useToast } from '../hooks/useToast';

export default function InputPaket() {
  const { addToast } = useToast();
  const [form, setForm] = useState({
    namaPemilik: '',
    nomorResi: '',
    jenisPaket: JENIS_PAKET_OPTIONS[0],
    ekspedisi: EKSPEDISI_OPTIONS[0],
    tanggalMasuk: getNowLocal(),
    catatan: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.namaPemilik.trim()) e.namaPemilik = 'Nama pemilik wajib diisi';
    if (!form.nomorResi.trim()) e.nomorResi = 'Nomor resi wajib diisi';
    else if (!isResiUnique(form.nomorResi.trim())) e.nomorResi = 'Nomor resi sudah terdaftar';
    if (!form.tanggalMasuk) e.tanggalMasuk = 'Tanggal masuk wajib diisi';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const tanggalMasukISO = new Date(form.tanggalMasuk).toISOString();

    addPackage({
      namaPemilik: form.namaPemilik.trim(),
      nomorResi: form.nomorResi.trim(),
      jenisPaket: form.jenisPaket,
      ekspedisi: form.ekspedisi,
      tanggalMasuk: tanggalMasukISO,
      catatan: form.catatan.trim(),
    });

    addToast('Paket berhasil dicatat!', 'success');
    setForm({
      namaPemilik: '',
      nomorResi: '',
      jenisPaket: JENIS_PAKET_OPTIONS[0],
      ekspedisi: EKSPEDISI_OPTIONS[0],
      tanggalMasuk: getNowLocal(),
      catatan: '',
    });
    setErrors({});
    setSubmitting(false);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Input Paket</h2>
        <p className="text-sm text-gray-500 mt-1">Catat paket yang baru masuk</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        {/* Nama Pemilik */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Pemilik <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={form.namaPemilik}
            onChange={(e) => setForm({ ...form, namaPemilik: e.target.value })}
            className={`input-field ${errors.namaPemilik ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : ''}`}
            placeholder="Masukkan nama pemilik paket"
          />
          {errors.namaPemilik && <p className="text-xs text-red-500 mt-1">{errors.namaPemilik}</p>}
        </div>

        {/* Nomor Resi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nomor Resi <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={form.nomorResi}
            onChange={(e) => setForm({ ...form, nomorResi: e.target.value })}
            className={`input-field font-mono ${errors.nomorResi ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : ''}`}
            placeholder="Contoh: JNE-20250610-001"
          />
          {errors.nomorResi && <p className="text-xs text-red-500 mt-1">{errors.nomorResi}</p>}
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Jenis Paket */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Jenis Paket</label>
            <select
              value={form.jenisPaket}
              onChange={(e) => setForm({ ...form, jenisPaket: e.target.value as any })}
              className="select-field"
            >
              {JENIS_PAKET_OPTIONS.map((j) => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>
          </div>

          {/* Ekspedisi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ekspedisi</label>
            <select
              value={form.ekspedisi}
              onChange={(e) => setForm({ ...form, ekspedisi: e.target.value as any })}
              className="select-field"
            >
              {EKSPEDISI_OPTIONS.map((ex) => (
                <option key={ex} value={ex}>{ex}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tanggal & Jam Masuk */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal & Jam Masuk</label>
          <input
            type="datetime-local"
            value={form.tanggalMasuk}
            onChange={(e) => setForm({ ...form, tanggalMasuk: e.target.value })}
            className={`input-field ${errors.tanggalMasuk ? 'border-red-400' : ''}`}
          />
          {errors.tanggalMasuk && <p className="text-xs text-red-500 mt-1">{errors.tanggalMasuk}</p>}
        </div>

        {/* Catatan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Catatan Tambahan <span className="text-gray-400">(opsional)</span></label>
          <textarea
            value={form.catatan}
            onChange={(e) => setForm({ ...form, catatan: e.target.value })}
            className="input-field resize-none"
            rows={3}
            placeholder="Catatan tambahan jika ada..."
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base"
        >
          <Save className="w-5 h-5" />
          Catat Paket Masuk
        </button>
      </form>
    </div>
  );
}
