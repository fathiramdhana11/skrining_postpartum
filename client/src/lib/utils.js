import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const formatKategori = (kategori) => {
  if (['Aman', 'Tidak Ada Gejala/Normal', 'Tidak Ada Gejala Depresi'].includes(kategori)) return 'Tidak Ada Gejala Depresi';
  if (['Kemungkinan Depresi', 'Terindikasi Gejala Depresi'].includes(kategori)) return 'Terindikasi Gejala Depresi';
  return kategori;
};

export const getStatusColor = (kategori) => {
  const formatted = formatKategori(kategori);
  if (formatted === 'Tidak Ada Gejala Depresi') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (formatted === 'Perlu Skrining Ulang') return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-red-50 text-red-700 border-red-200';
};

export const getVibrantColor = (kategori) => {
  const formatted = formatKategori(kategori);
  if (formatted === 'Tidak Ada Gejala Depresi') return 'bg-emerald-500 text-white border-emerald-600';
  if (formatted === 'Perlu Skrining Ulang') return 'bg-amber-500 text-white border-amber-600';
  return 'bg-red-500 text-white border-red-600';
};

export const analyzeRisks = (p) => {
  if (!p) return [];
  const risks = [];

  // 1. Usia
  if (p.tanggal_lahir) {
    const birthDate = new Date(p.tanggal_lahir);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    
    if (age < 21) risks.push({ label: `Usia Terlalu Muda (${age} thn)`, status: "Berisiko" });
    else if (age > 35) risks.push({ label: `Usia > 35 Tahun (${age} thn)`, status: "Berisiko" });
  }

  // 2. Pendidikan
  const pend = (p.pendidikan || '').toLowerCase();
  if (pend.includes('tidak') || pend.includes('sd') || pend.includes('smp'))
    risks.push({ label: `Pendidikan: ${p.pendidikan || 'Rendah'}`, status: "Berisiko" });

  // 3. Status Pernikahan
  const stat = (p.status_pernikahan || '').toLowerCase();
  if (stat.includes('tidak') || stat.includes('cerai') || stat.includes('janda'))
    risks.push({ label: `Status: ${p.status_pernikahan}`, status: "Berisiko" });

  // 4. Jumlah Anak
  let ja = p.jumlah_anak?.toString().toLowerCase() || '';
  if (ja.includes('lebih dari 3') || parseInt(ja) > 3)
    risks.push({ label: `Jumlah Anak Tinggi: ${p.jumlah_anak}`, status: "Berisiko" });

  // 5. Riwayat Kes Jiwa
  if (p.riwayat_kesehatan_jiwa === "Pernah")
    risks.push({ label: "Ada Riwayat Masalah Kesehatan Jiwa", status: "Berisiko" });

  // 6. Komplikasi
  if (p.komplikasi_hamil_ini && p.komplikasi_hamil_ini !== "Tidak Ada")
    risks.push({ label: `Komplikasi Hamil Ini: ${p.komplikasi_hamil_ini}`, status: "Berisiko" });

  if (p.komplikasi_persalinan_lalu && p.komplikasi_persalinan_lalu !== "Tidak Ada" && !p.komplikasi_persalinan_lalu.includes("Kehamilan Pertama"))
    risks.push({ label: `Komplikasi Lahir Lalu: ${p.komplikasi_persalinan_lalu}`, status: "Berisiko" });

  return risks;
};
