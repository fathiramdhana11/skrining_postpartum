import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, ShieldCheck } from "lucide-react";

export const AnswerDetailDialog = ({
  isOpen,
  onClose,
  detailScreening,
  formatKategori,
  epdsQuestions,
  handlePrint,
  handleDelete
}) => {
  if (!detailScreening) return null;

  const getAnswerLabel = (score) => {
    const labels = ['Tidak Pernah', 'Kadang-kadang', 'Cukup Sering', 'Sangat Sering'];
    return labels[score] || 'N/A';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[85vh] flex flex-col p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          <div className={`p-8 pr-16 ${formatKategori(detailScreening.kategori) === 'Tidak Ada Gejala Depresi' ? 'bg-green-600' : formatKategori(detailScreening.kategori) === 'Perlu Skrining Ulang' ? 'bg-yellow-500' : 'bg-red-600'}`}>
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-1">Detail Jawaban Kuesioner</h2>
              <p className="font-semibold">{detailScreening.nama_lengkap}</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex flex-col items-center mb-8">
              <span className="text-sm text-gray-500 uppercase">Total Skor</span>
              <div className="text-6xl font-bold mt-1">{detailScreening.total_score}</div>
              <div className={`mt-2 px-4 py-1.5 rounded-full text-sm font-bold ${formatKategori(detailScreening.kategori) === 'Tidak Ada Gejala Depresi' ? 'bg-green-100 text-green-700' : formatKategori(detailScreening.kategori) === 'Perlu Skrining Ulang' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                {formatKategori(detailScreening.kategori)}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 border-b pb-2">Butir Jawaban EPDS</h3>
              {epdsQuestions.map((q, qIndex) => (
                <div key={qIndex} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-sm font-medium text-gray-700 mb-2">{qIndex + 1}. {q}</p>
                  <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 italic">
                    <span className="text-sm text-gray-600">Jawaban: {getAnswerLabel(detailScreening.jawaban_json?.[qIndex])}</span>
                    <span className="text-xs font-bold text-primary">Skor: {detailScreening.jawaban_json?.[qIndex] || 0}</span>
                  </div>
                </div>
              ))}
            </div>

            {detailScreening.status_penanganan && detailScreening.status_penanganan !== 'Belum Ditangani' && (
              <div className="mt-8 p-6 rounded-2xl bg-green-50/50 border border-green-100">
                <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" /> Catatan Tindak Lanjut Nakes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-white rounded-xl border border-green-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Status</span>
                    <p className="font-bold text-green-700">{detailScreening.status_penanganan}</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-green-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Tindakan</span>
                    <p className="font-bold text-gray-700">{detailScreening.tindakan_nakes || '-'}</p>
                  </div>
                </div>

                {/* SOAP Display */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: 'Subjektif (S)', val: detailScreening.soap_s },
                    { label: 'Objektif (O)', val: detailScreening.soap_o },
                    { label: 'Assessment (A)', val: detailScreening.soap_a },
                    { label: 'Planning (P)', val: detailScreening.soap_p },
                  ].map((item, i) => (
                    <div key={i} className="p-3 bg-white rounded-xl border border-green-100">
                      <span className="text-[10px] font-bold text-primary uppercase">{item.label}</span>
                      <p className="text-xs text-gray-700 whitespace-pre-line mt-1">{item.val || '-'}</p>
                    </div>
                  ))}
                </div>

                {detailScreening.catatan_nakes && (
                  <p className="text-sm text-gray-600 mt-1 whitespace-pre-line border-t border-green-200/30 pt-1">
                    {detailScreening.catatan_nakes}
                  </p>
                )}
                <div className="mt-2 pt-2 border-t border-green-200/50 flex justify-between items-center text-[10px] text-gray-400 font-medium">
                  <span className="flex items-center gap-1">
                    <ShieldCheck size={10} className="text-green-600" />
                    Penanggung Jawab: {detailScreening.handled_by_name || 'Bidan'}
                  </span>
                  <span>
                    {detailScreening.handled_at ? new Date(detailScreening.handled_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-8">
              <Button variant="outline" className="flex-1" onClick={() => handlePrint(detailScreening)}>Cetak</Button>
              <Button variant="outline" className="w-12 border-red-200 text-red-600 hover:bg-red-50" onClick={() => handleDelete(detailScreening)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
