export type JenisPaket = 'Paket Kecil' | 'Paket Sedang' | 'Paket Besar' | 'Dokumen' | 'Lainnya';
export type Ekspedisi = 'JNE' | 'J&T' | 'SiCepat' | 'Pos Indonesia' | 'GoSend' | 'Grab' | 'Lainnya';
export type StatusPaket = 'menunggu' | 'diambil';

export interface Paket {
  id: string;
  namaPemilik: string;
  nomorResi: string;
  jenisPaket: JenisPaket;
  ekspedisi: Ekspedisi;
  tanggalMasuk: string;
  catatan: string;
  status: StatusPaket;
  tanggalDiambil: string | null;
  foto?: string;
}

export const JENIS_PAKET_OPTIONS: JenisPaket[] = ['Paket Kecil', 'Paket Sedang', 'Paket Besar', 'Dokumen', 'Lainnya'];
export const EKSPEDISI_OPTIONS: Ekspedisi[] = ['JNE', 'J&T', 'SiCepat', 'Pos Indonesia', 'GoSend', 'Grab', 'Lainnya'];
