import { Paket } from './types';
import { supabase } from './supabase';

export async function getPackages(): Promise<Paket[]> {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .order('tanggalMasuk', { ascending: false });

  if (error) {
    console.error('Error fetching packages:', error);
    return [];
  }
  return data as Paket[];
}

export async function addPackage(pkg: Omit<Paket, 'id' | 'status' | 'tanggalDiambil'>): Promise<Paket | null> {
  const { data, error } = await supabase
    .from('packages')
    .insert([{
      namaPemilik: pkg.namaPemilik,
      nomorResi: pkg.nomorResi,
      jenisPaket: pkg.jenisPaket,
      ekspedisi: pkg.ekspedisi,
      tanggalMasuk: pkg.tanggalMasuk,
      catatan: pkg.catatan,
      foto: pkg.foto,
      status: 'menunggu',
      tanggalDiambil: null,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error adding package:', error);
    return null;
  }
  return data as Paket;
}

export async function updatePackageStatus(id: string): Promise<Paket | null> {
  const { data, error } = await supabase
    .from('packages')
    .update({ 
      status: 'diambil',
      tanggalDiambil: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating package:', error);
    return null;
  }
  return data as Paket;
}

export async function deletePackage(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('packages')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting package:', error);
    return false;
  }
  return true;
}

export async function isResiUnique(nomorResi: string, excludeId?: string): Promise<boolean> {
  let query = supabase
    .from('packages')
    .select('id')
    .eq('nomorResi', nomorResi);
    
  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error checking resi:', error);
    return false;
  }
  
  return data.length === 0;
}
