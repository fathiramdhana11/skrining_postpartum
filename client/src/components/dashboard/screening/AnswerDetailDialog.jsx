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


            <div className="flex justify-end mt-8">
              <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 gap-2 font-bold" onClick={() => handleDelete(detailScreening)}>
                <Trash2 className="h-4 w-4" /> Hapus Rekaman Skrining
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
