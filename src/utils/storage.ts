import { Paket } from './types';

const STORAGE_KEY = 'sipaket_data';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

const SEED_DATA: Paket[] = [
  {
    id: generateId() + '1',
    namaPemilik: 'Ahmad Fauzi',
    nomorResi: 'JNE-20250601-001',
    jenisPaket: 'Paket Sedang',
    ekspedisi: 'JNE',
    tanggalMasuk: daysAgo(6),
    catatan: 'Berisi buku pelajaran',
    status: 'diambil',
    tanggalDiambil: daysAgo(4),
  },
  {
    id: generateId() + '2',
    namaPemilik: 'Siti Aisyah',
    nomorResi: 'JNT-20250602-002',
    jenisPaket: 'Paket Kecil',
    ekspedisi: 'J&T',
    tanggalMasuk: daysAgo(5),
    catatan: '',
    status: 'diambil',
    tanggalDiambil: daysAgo(3),
  },
  {
    id: generateId() + '3',
    namaPemilik: 'Muhammad Rizki',
    nomorResi: 'SICEPAT-20250603-003',
    jenisPaket: 'Paket Besar',
    ekspedisi: 'SiCepat',
    tanggalMasuk: daysAgo(4),
    catatan: 'Perlengkapan mandi',
    status: 'menunggu',
    tanggalDiambil: null,
  },
  {
    id: generateId() + '4',
    namaPemilik: 'Fatimah Zahra',
    nomorResi: 'POS-20250604-004',
    jenisPaket: 'Dokumen',
    ekspedisi: 'Pos Indonesia',
    tanggalMasuk: daysAgo(3),
    catatan: 'Surat dari wali santri',
    status: 'menunggu',
    tanggalDiambil: null,
  },
  {
    id: generateId() + '5',
    namaPemilik: 'Umar Hasan',
    nomorResi: 'GRAB-20250605-005',
    jenisPaket: 'Paket Kecil',
    ekspedisi: 'Grab',
    tanggalMasuk: daysAgo(2),
    catatan: '',
    status: 'menunggu',
    tanggalDiambil: null,
  },
  {
    id: generateId() + '6',
    namaPemilik: 'Khadijah Nur',
    nomorResi: 'GOSEND-20250606-006',
    jenisPaket: 'Paket Sedang',
    ekspedisi: 'GoSend',
    tanggalMasuk: daysAgo(1),
    catatan: 'Makanan ringan',
    status: 'diambil',
    tanggalDiambil: daysAgo(0),
  },
  {
    id: generateId() + '7',
    namaPemilik: 'Bilal Ramadhan',
    nomorResi: 'JNE-20250607-007',
    jenisPaket: 'Lainnya',
    ekspedisi: 'JNE',
    tanggalMasuk: daysAgo(0),
    catatan: 'Obat-obatan',
    status: 'menunggu',
    tanggalDiambil: null,
  },
  {
    id: generateId() + '8',
    namaPemilik: 'Zainab Safira',
    nomorResi: 'SICEPAT-20250608-008',
    jenisPaket: 'Dokumen',
    ekspedisi: 'SiCepat',
    tanggalMasuk: daysAgo(0),
    catatan: 'Ijazah fotokopi',
    status: 'menunggu',
    tanggalDiambil: null,
  },
];

export function getPackages(): Paket[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
    return SEED_DATA;
  }
  try {
    return JSON.parse(raw) as Paket[];
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
    return SEED_DATA;
  }
}

export function savePackages(packages: Paket[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(packages));
}

export function addPackage(pkg: Omit<Paket, 'id' | 'status' | 'tanggalDiambil'>): Paket {
  const packages = getPackages();
  const newPkg: Paket = {
    ...pkg,
    id: generateId(),
    status: 'menunggu',
    tanggalDiambil: null,
  };
  packages.push(newPkg);
  savePackages(packages);
  return newPkg;
}

export function updatePackageStatus(id: string): Paket | null {
  const packages = getPackages();
  const idx = packages.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  packages[idx].status = 'diambil';
  packages[idx].tanggalDiambil = new Date().toISOString();
  savePackages(packages);
  return packages[idx];
}

export function deletePackage(id: string): boolean {
  const packages = getPackages();
  const filtered = packages.filter((p) => p.id !== id);
  if (filtered.length === packages.length) return false;
  savePackages(filtered);
  return true;
}

export function isResiUnique(nomorResi: string, excludeId?: string): boolean {
  const packages = getPackages();
  return !packages.some((p) => p.nomorResi === nomorResi && p.id !== excludeId);
}
