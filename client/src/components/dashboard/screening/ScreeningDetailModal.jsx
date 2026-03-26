import React from 'react';
import { Button } from "@/components/ui/button";
import { AlertCircle, Calendar, X, User, Stethoscope, ClipboardCheck, ShieldCheck, HeartPulse } from "lucide-react";
import { getStatusColor, formatKategori, analyzeRisks } from "@/lib/utils";

export const ScreeningDetailModal = ({ screening, onClose }) => {
  if (!screening) return null;

  const risks = analyzeRisks(screening.profile_snapshot);
  const hasSOAP = screening.catatan_nakes || screening.soap_s || screening.soap_o || screening.soap_a || screening.soap_p;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto md:overflow-hidden relative animate-in zoom-in-95 duration-200 border border-gray-100 flex flex-col">
        <Button
          onClick={onClose}
          variant="ghost"
          className="absolute top-6 right-6 h-10 w-10 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-400 p-0 z-10"
        >
          <X size={20} />
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-5 h-full">
          {/* LEFT SIDE: SUMMARY (2 columns on md) */}
          <div className="md:col-span-2 p-10 bg-gray-50/50 flex flex-col items-center justify-center text-center border-r border-gray-100">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-8">Hasil Skrining Bunda</span>

            <div className="mb-8 flex flex-col items-center justify-center group">
              <span className={`text-[100px] md:text-[110px] font-black tracking-tighter leading-none transition-transform group-hover:scale-110 duration-500 ${getStatusColor(screening.kategori).split(' ')[1]}`}>
                {screening.total_score}
              </span>
              <span className="mt-4 text-[10px] font-black text-primary bg-primary/5 px-4 py-2 rounded-full uppercase tracking-widest border border-primary/10">
                Skor Akumulasi
              </span>
            </div>

            <div className="flex flex-col justify-center items-center mb-6 gap-4">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${getStatusColor(screening.kategori)}`}>
                {formatKategori(screening.kategori)}
              </span>
              <p className={`text-sm font-bold text-center px-6 leading-relaxed ${
                formatKategori(screening.kategori) === 'Terindikasi Gejala Depresi' ? 'text-red-600' :
                  formatKategori(screening.kategori) === 'Perlu Skrining Ulang' ? 'text-amber-600' :
                    'text-emerald-600'
              }`}>
                {formatKategori(screening.kategori) === 'Terindikasi Gejala Depresi' ?
                  "Skor Bunda menunjukkan perlunya konsultasi lebih lanjut, harap hubungi bidan." :
                  formatKategori(screening.kategori) === 'Perlu Skrining Ulang' ?
                    "Bunda disarankan untuk melakukan skrining ulang." :
                    "Hasil skrining Bunda stabil."
                }
              </p>
            </div>

            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white border border-gray-100 text-gray-400">
              <Calendar size={14} />
              <span className="text-[9px] font-black uppercase tracking-wide">
                {new Date(screening.waktu_skrining).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB
              </span>
            </div>
          </div>

          {/* RIGHT SIDE: DETAILS (3 columns on md) */}
          <div className="md:col-span-3 p-10 overflow-y-auto custom-scrollbar flex flex-col gap-8 bg-white">
            {/* 1. Health History Risks */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2.5">
                <AlertCircle size={16} className="text-amber-500" /> Analisis Faktor Risiko
              </h4>

              {screening.profile_snapshot ? (
                risks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {risks.map((risk, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border bg-red-50/30 border-red-100 transition-colors">
                        <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
                        <span className="text-[11px] font-bold text-red-900/80 leading-tight">{risk.label}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl border border-emerald-100 bg-emerald-50/30">
                    <p className="text-xs font-black text-emerald-700 uppercase tracking-tight">Kondisi Riwayat Stabil</p>
                    <p className="text-[10px] font-bold text-emerald-600/70 mt-1 uppercase tracking-widest">Tidak ditemukan faktor risiko medis signifikan.</p>
                  </div>
                )
              ) : (
                <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50">
                  <p className="text-xs font-bold text-gray-400 italic">Data riwayat detail tidak tersedia.</p>
                </div>
              )}
            </div>

            {/* 2. FOLLOW UP & MESSAGES (SOAP HIDDEN FOR PATIENTS) */}
            <div className="space-y-4 pt-4 border-t border-gray-50">
              <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2.5">
                <ShieldCheck size={16} className="text-primary" /> Tindak Lanjut & Pesan Bidan
              </h4>

              {screening.handled_by_name ? (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white shadow-md">
                    <User size={14} />
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.1em] leading-none mb-1">Bidan Penanggung Jawab</p>
                    <p className="text-xs font-black text-primary uppercase">{screening.handled_by_name?.trim()}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                    <User size={14} />
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Belum Ditugaskan</p>
                </div>
              )}

              {screening.catatan_nakes ? (
                <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100 border-dashed relative overflow-hidden group">
                  <div className="absolute -top-1 -right-1 opacity-10 group-hover:scale-110 transition-transform">
                    <HeartPulse size={60} className="text-amber-600" />
                  </div>
                  <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <ClipboardCheck size={12} /> Pesan untuk Bunda:
                  </p>
                  <p className="text-sm text-amber-900/90 leading-relaxed italic font-bold">"{screening.catatan_nakes}"</p>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 border-dashed">
                  <p className="text-[10px] font-bold text-gray-300 italic uppercase tracking-wider text-center">Belum ada pesan tambahan dari bidan.</p>
                </div>
              )}

              {screening.handled_at && (
                <div className="flex justify-end pt-2 text-[8px] font-bold text-gray-300 uppercase tracking-widest">
                  Terakhir diperbarui: {new Date(screening.handled_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
