import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Phone, MessageSquare, Save, User as UserIcon, ShieldCheck, History, FileText } from "lucide-react";

export const SOAPDialog = ({
  isOpen,
  onClose,
  selectedPatient,
  detailScreening,
  setDetailScreening,
  nakesList,
  editStatus,
  setEditStatus,
  assignedBidan,
  setAssignedBidan,
  soapS,
  setSoapS,
  soapO,
  setSoapO,
  soapA,
  setSoapA,
  soapP,
  setSoapP,
  editNotes,
  setEditNotes,
  isSavingNotes,
  handleSaveNotes,
  handleContactPatient,
  getStatusColor,
  formatKategori,
  setIsDetailOpen // To open AnswerDetailDialog
}) => {
  if (!selectedPatient || !detailScreening) return null;

  const handleSwitchScreening = (s) => {
    setDetailScreening(s);
    setEditNotes(s.catatan_nakes || "");
    setEditStatus(s.status_penanganan && s.status_penanganan !== "" ? s.status_penanganan : "Belum Ditangani");
    setSoapS(s.soap_s || "");
    setSoapO(s.soap_o || "");
    setSoapA(s.soap_a || "");
    setSoapP(s.soap_p || "");
    setAssignedBidan(s.handled_by?.toString() || "");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden flex flex-col p-0 text-left">
        <DialogHeader className="p-6 bg-primary text-white shrink-0">
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            <div className="flex items-center gap-2 text-left">
              <UserIcon className="h-6 w-6" />
              Detail Tindak Lanjut: {selectedPatient.nama_lengkap}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Column: Form & Info */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Hasil Skrining Terpilih</span>
                      <h3 className="text-xl font-bold text-gray-800">{formatKategori(detailScreening.kategori)}</h3>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-none mt-4 font-bold">
                      {selectedPatient.count}x Skrining
                    </Badge>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Skor</span>
                    <p className="text-3xl font-black text-primary">{detailScreening.total_score}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(detailScreening.waktu_skrining).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary font-bold hover:bg-primary/10 gap-2 h-8"
                    onClick={() => setIsDetailOpen(true)}
                  >
                    <FileText className="h-4 w-4" /> Lihat Jawaban Detail
                  </Button>
                </div>
              </div>

              {/* Form SOAP */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" /> Catatan Pemeriksa (SOAP)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Subjektif (S)', val: soapS, set: setSoapS, placeholder: 'Keluhan pasien...' },
                    { label: 'Objektif (O)', val: soapO, set: setSoapO, placeholder: 'Hasil pemeriksaan fisik...' },
                    { label: 'Assessment (A)', val: soapA, set: setSoapA, placeholder: 'Diagnosis/analisis...' },
                    { label: 'Planning (P)', val: soapP, set: setSoapP, placeholder: 'Rencana tindakan...' },
                  ].map((field, idx) => (
                    <div key={idx} className="space-y-2 text-left">
                      <label className="text-[11px] font-bold text-gray-500 uppercase ml-1 block">{field.label}</label>
                      <Textarea
                        placeholder={field.placeholder}
                        className="min-h-[120px] rounded-xl bg-gray-50 border-gray-100 focus:bg-white transition-all text-left"
                        value={field.val}
                        onChange={(e) => field.set(e.target.value)}
                      />
                    </div>
                  ))}
                </div>
                <div className="pt-2 text-left">
                  <label className="text-[11px] font-bold text-gray-500 uppercase ml-1 block">Catatan Tambahan (Opsional)</label>
                  <Textarea
                    placeholder="Informasi tambahan lainnya..."
                    className="min-h-[80px] mt-1 rounded-xl bg-gray-50 border-gray-100 focus:bg-white text-left"
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Sidebar Action & History */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4 text-left">
                <h4 className="font-bold text-gray-800 border-b pb-2">Penanganan</h4>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase block">Status</label>
                    <Select value={editStatus || "Belum Ditangani"} onValueChange={setEditStatus}>
                      <SelectTrigger className="rounded-xl h-10 border-gray-100 bg-gray-50 text-left">
                        <SelectValue placeholder="Pilih status..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="Belum Ditangani">Belum Ditangani</SelectItem>
                        <SelectItem value="Sudah Dihubungi">Sudah Dihubungi</SelectItem>
                        <SelectItem value="Sedang Ditangani">Sedang Ditangani</SelectItem>
                        <SelectItem value="Selesai">Selesai</SelectItem>
                        <SelectItem value="Rujukan Medis">Rujukan Medis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase block">Tenaga Kesehatan</label>
                    <Select value={assignedBidan} onValueChange={setAssignedBidan}>
                      <SelectTrigger className="rounded-xl h-10 border-gray-100 bg-gray-50 text-left">
                        <SelectValue placeholder="Pilih bidan..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {nakesList.map(bidan => (
                          <SelectItem key={bidan.id} value={bidan.id.toString()} className="pl-3">
                            {bidan.nama_lengkap}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <Button
                    className="w-full h-11 rounded-xl shadow-md gap-2 font-bold"
                    onClick={handleSaveNotes}
                    disabled={isSavingNotes}
                  >
                    <Save className="h-4 w-4" />
                    {isSavingNotes ? "Menyimpan..." : "Simpan Data"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-11 rounded-xl border-green-200 bg-green-50 text-green-700 hover:bg-green-100 gap-2 text-xs font-bold"
                    onClick={() => handleContactPatient(selectedPatient.no_hp, selectedPatient.nama_lengkap)}
                  >
                    <MessageSquare className="h-4 w-4" />
                    WhatsApp Pasien
                  </Button>
                </div>
              </div>

              {/* History List */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-left">
                <h4 className="font-bold text-gray-800 border-b pb-3 flex items-center gap-2 mb-3">
                  <History className="h-4 w-4 text-primary" /> Riwayat Skrining
                </h4>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {[...selectedPatient.screenings]
                    .sort((a, b) => new Date(b.waktu_skrining) - new Date(a.waktu_skrining))
                    .map((s, idx) => (
                      <div
                        key={s.id}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${detailScreening.id === s.id ? 'bg-primary/5 border-primary shadow-sm' : 'bg-gray-50 border-gray-100 hover:border-primary/30'}`}
                        onClick={() => handleSwitchScreening(s)}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] text-gray-400 font-bold">{new Date(s.waktu_skrining).toLocaleDateString('id-ID')}</span>
                          <Badge className={`text-[9px] h-4 px-1.5 ${getStatusColor(s.kategori)} border-none`}>Skor: {s.total_score}</Badge>
                        </div>
                        <p className="text-xs font-bold text-gray-700 truncate">{formatKategori(s.kategori)}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
