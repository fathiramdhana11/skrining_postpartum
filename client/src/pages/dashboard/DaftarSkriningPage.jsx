import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, ChevronLeft, ChevronRight, AlertTriangle, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { screeningService, userService } from "../../services/api.service";
import { formatKategori, getStatusColor } from "../../lib/utils";

// Sub-components
import { ScreeningTable } from "../../components/dashboard/screening/ScreeningTable";
import { SOAPDialog } from "../../components/dashboard/screening/SOAPDialog";
import { AnswerDetailDialog } from "../../components/dashboard/screening/AnswerDetailDialog";

export default function DaftarSkriningPage() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [screenings, setScreenings] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, screening: null });
  const [detailScreening, setDetailScreening] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editNotes, setEditNotes] = useState("");
  const [editStatus, setEditStatus] = useState("Belum Ditangani");
  const [assignedBidan, setAssignedBidan] = useState("");
  const [soapS, setSoapS] = useState("");
  const [soapO, setSoapO] = useState("");
  const [soapA, setSoapA] = useState("");
  const [soapP, setSoapP] = useState("");
  const [nakesList, setNakesList] = useState([]);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [patientDeleteConfirm, setPatientDeleteConfirm] = useState({ open: false, patient: null });

  // Filter States
  const [filterKategori, setFilterKategori] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState('date-desc');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [screeningsData, nakesData] = await Promise.all([
        screeningService.getAll(),
        userService.getAll()
      ]);
      setScreenings(screeningsData || []);
      setNakesList((nakesData || [])
        .filter(u => u.role === 'tenagakesehatan')
        .map(u => ({
          ...u,
          nama_lengkap: u.nama_lengkap
            ? u.nama_lengkap.trim().replace(/^[\s\t\n\r\uFEFF\xA0\u200B\u200C\u200D\u200E\u200F]+/, '')
            : "Tanpa Nama"
        }))
      );
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.searchName) {
      setSearch(location.state.searchName);
      setFilterKategori('all');
    }
  }, [location.state]);

  const epdsQuestions = [
    "Saya dapat tertawa dan melihat sisi lucu dari berbagai hal",
    "Saya dapat menikmati dan menantikan berbagai hal dengan penuh harapan",
    "Saya menyalahkan diri sendiri tanpa alasan ketika hal-hal tidak berjalan dengan baik",
    "Saya merasa cemas atau khawatir tanpa alasan yang jelas",
    "Saya merasa takut atau panik tanpa alasan yang jelas",
    "Berbagai hal membuat saya kewalahan",
    "Saya merasa sangat tidak bahagia sehingga sulit tidur",
    "Saya merasa sedih atau sengsara",
    "Saya merasa sangat tidak bahagia sehingga saya menangis",
    "Pikiran untuk menyakiti diri sendiri telah muncul dalam pikiran saya"
  ];

  const filteredScreenings = (screenings || []).filter(s => {
    const screeningDate = new Date(s.waktu_skrining);
    const matchesSearch = (s.nama_lengkap || "").toLowerCase().includes(search.toLowerCase());
    const matchesKategori = (filterKategori === 'all' ||
      (filterKategori === 'terindikasi_depresi' && (s.total_score >= 13 || formatKategori(s.kategori) === 'Terindikasi Gejala Depresi')) ||
      (filterKategori === 'perlu_skrining_ulang' && formatKategori(s.kategori) === 'Perlu Skrining Ulang') ||
      (filterKategori === 'tidak_ada_gejala' && formatKategori(s.kategori) === 'Tidak Ada Gejala Depresi')
    );
    const matchesStatus = (filterStatus === 'all' || s.status_penanganan === filterStatus);

    let matchesDate = true;
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      matchesDate = matchesDate && (screeningDate >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      matchesDate = matchesDate && (screeningDate <= end);
    }

    return matchesSearch && matchesKategori && matchesStatus && matchesDate;
  });

  const patientScreenings = filteredScreenings.reduce((acc, screening) => {
    const existingPatient = acc.find(p => p.user_id === screening.user_id);
    if (existingPatient) {
      existingPatient.screenings.push(screening);
      existingPatient.count++;
      if (new Date(screening.waktu_skrining) > new Date(existingPatient.latest_screening)) {
        Object.assign(existingPatient, {
          latest_screening: screening.waktu_skrining,
          latest_kategori: screening.kategori,
          latest_score: screening.total_score,
          latest_status: screening.status_penanganan,
          no_hp: screening.no_hp
        });
      }
    } else {
      acc.push({
        user_id: screening.user_id,
        nama_lengkap: screening.nama_lengkap,
        latest_screening: screening.waktu_skrining,
        latest_kategori: screening.kategori,
        latest_score: screening.total_score,
        latest_status: screening.status_penanganan,
        no_hp: screening.no_hp,
        count: 1,
        screenings: [screening]
      });
    }
    return acc;
  }, []);

  patientScreenings.sort((a, b) => {
    if (sortBy === 'date-asc') return new Date(a.latest_screening) - new Date(b.latest_screening);
    if (sortBy === 'score-desc') return b.latest_score - a.latest_score;
    if (sortBy === 'score-asc') return a.latest_score - b.latest_score;
    return new Date(b.latest_screening) - new Date(a.latest_screening);
  });

  const totalPages = Math.ceil(patientScreenings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPatients = patientScreenings.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => setCurrentPage(1), [search]);

  const handleViewDetail = (patient) => {
    setSelectedPatient(patient);
    const latest = [...patient.screenings].sort((a, b) => new Date(b.waktu_skrining) - new Date(a.waktu_skrining))[0];
    if (latest) {
      setDetailScreening(latest);
      setEditNotes(latest.catatan_nakes || "");
      setEditStatus(latest.status_penanganan && latest.status_penanganan !== "" ? latest.status_penanganan : "Belum Ditangani");
      setAssignedBidan(latest.handled_by?.toString() || user.id.toString());
      setSoapS(latest.soap_s || "");
      setSoapO(latest.soap_o || "");
      setSoapA(latest.soap_a || "");
      setSoapP(latest.soap_p || "");
    }
    setIsDialogOpen(true);
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      await screeningService.updateNotes(detailScreening.id, {
        catatan_nakes: editNotes,
        status_penanganan: editStatus,
        handled_by: assignedBidan || user.id,
        soap_s: soapS,
        soap_o: soapO,
        soap_a: soapA,
        soap_p: soapP
      });
      toast.success("Catatan SOAP berhasil disimpan");
      fetchData();
      setDetailScreening(prev => ({
        ...prev, editNotes, status_penanganan: editStatus,
        soap_s: soapS, soap_o: soapO, soap_a: soapA, soap_p: soapP,
        handled_by_name: user.nama_lengkap, handled_at: new Date().toISOString()
      }));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handlePrint = (screening) => {
    const doc = new jsPDF();
    doc.setFontSize(18).setFont(undefined, 'bold').text('Hasil Skrining Postpartum (EPDS)', 105, 20, { align: 'center' });
    doc.setFontSize(12).setFont(undefined, 'normal');
    doc.text(`Nama Pasien: ${screening.nama_lengkap}`, 20, 35);
    doc.text(`Tanggal: ${new Date(screening.waktu_skrining).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}`, 20, 42);
    doc.text(`Total Skor: ${screening.total_score}`, 20, 49);
    doc.text(`Kategori: ${formatKategori(screening.kategori)}`, 20, 56);

    doc.setFontSize(14).setFont(undefined, 'bold').text('Rekomendasi:', 20, 70);
    doc.setFontSize(11).setFont(undefined, 'normal');
    const recommendation = formatKategori(screening.kategori) === 'Tidak Ada Gejala Depresi'
      ? 'Pasien dalam kondisi baik. Lanjutkan pemantauan rutin.'
      : formatKategori(screening.kategori) === 'Perlu Skrining Ulang'
        ? 'Disarankan untuk melakukan skrining ulang dalam 1-2 minggu.'
        : 'Segera lakukan konsultasi lebih lanjut dengan tenaga kesehatan profesional.';
    doc.text(doc.splitTextToSize(recommendation, 170), 20, 78);
    doc.save(`Skrining_${screening.nama_lengkap}.pdf`);
  };

  const handleContactPatient = (no_hp, nama) => {
    if (!no_hp) return toast.error("Nomor HP tidak tersedia");
    const cleanNumber = no_hp.replace(/\D/g, '').replace(/^0/, '62');
    const message = encodeURIComponent(`Halo Ibu ${nama}, saya dari tim Tenaga Kesehatan ingin menindaklanjuti hasil skrining Ibu.`);
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  const handleExportAll = () => {
    const ws = XLSX.utils.json_to_sheet(screenings.map((s, i) => ({
      No: i + 1, Nama: s.nama_lengkap, Tanggal: new Date(s.waktu_skrining).toLocaleDateString('id-ID'), Skor: s.total_score, Kategori: formatKategori(s.kategori)
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data Skrining');
    XLSX.writeFile(wb, `Data_Skrining.xlsx`);
  };

  const confirmDelete = async () => {
    try {
      await screeningService.delete(deleteConfirm.screening.id);
      toast.success("Data berhasil dihapus");
      fetchData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeleteConfirm({ open: false, screening: null });
    }
  };

  const confirmPatientDelete = async () => {
    try {
      await userService.deletePatient(patientDeleteConfirm.patient.user_id);
      toast.success("Pasien berhasil dihapus");
      fetchData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setPatientDeleteConfirm({ open: false, patient: null });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9]">
      <AlertDialog open={patientDeleteConfirm.open} onOpenChange={open => setPatientDeleteConfirm({ open, patient: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center"><AlertTriangle className="h-6 w-6 text-red-600" /></div>
              <div>
                <AlertDialogTitle className="text-xl text-red-700">Hapus Seluruh Data Pasien?</AlertDialogTitle>
                <AlertDialogDescription>Ini akan menghapus akun dan SEMUA riwayat pasien secara permanen.</AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmPatientDelete} className="bg-red-600">Ya, Hapus Semua</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteConfirm.open} onOpenChange={open => setDeleteConfirm({ open, screening: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus Riwayat</AlertDialogTitle>
            <AlertDialogDescription>Menghapus satu rekaman skrining ini.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600">Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SOAPDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        selectedPatient={selectedPatient}
        detailScreening={detailScreening}
        setDetailScreening={setDetailScreening}
        nakesList={nakesList}
        editStatus={editStatus}
        setEditStatus={setEditStatus}
        assignedBidan={assignedBidan}
        setAssignedBidan={setAssignedBidan}
        soapS={soapS} setSoapS={setSoapS}
        soapO={soapO} setSoapO={setSoapO}
        soapA={soapA} setSoapA={setSoapA}
        soapP={soapP} setSoapP={setSoapP}
        editNotes={editNotes} setEditNotes={setEditNotes}
        isSavingNotes={isSavingNotes}
        handleSaveNotes={handleSaveNotes}
        handleContactPatient={handleContactPatient}
        getStatusColor={getStatusColor}
        formatKategori={formatKategori}
        setIsDetailOpen={setIsDetailOpen}
      />

      <AnswerDetailDialog
        isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)}
        detailScreening={detailScreening} formatKategori={formatKategori}
        epdsQuestions={epdsQuestions} handlePrint={handlePrint}
        handleDelete={s => setDeleteConfirm({ open: true, screening: s })}
      />

      <DashboardLayout title="Daftar Skrining" role={user.role === 'superadmin' ? "Super Admin" : "Tenaga Kesehatan"}>
        <Card className="shadow-lg border-primary/10">
          <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between border-b bg-primary/5 pb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2.5 rounded-xl shadow-sm border border-primary/10 text-primary">
                <ClipboardList size={24} />
              </div>
              <div>
                <CardTitle className="text-xl md:text-2xl font-bold">Daftar Pasien Skrining</CardTitle>
                <CardDescription>Kelola dan pantau seluruh data pasien</CardDescription>
              </div>
            </div>
            <Button variant="outline" onClick={handleExportAll}><Download className="mr-2 h-4 w-4" /> Export</Button>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
              <div className="flex-1 w-full relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Cari nama pasien..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 h-11 rounded-xl" />
              </div>
              <div className="flex gap-3">
                <Select value={filterKategori} onValueChange={setFilterKategori}>
                  <SelectTrigger className="w-48 h-11 rounded-xl"><SelectValue placeholder="Kategori" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    <SelectItem value="terindikasi_depresi">Terindikasi Depresi (Skor ≥ 13)</SelectItem>
                    <SelectItem value="perlu_skrining_ulang">Perlu Skrining Ulang (Skor 9-12)</SelectItem>
                    <SelectItem value="tidak_ada_gejala">Tidak Ada Gejala (Skor 0-8)</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-44 h-11 rounded-xl"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="Belum Ditangani">Belum Ditangani</SelectItem>
                    <SelectItem value="Sudah Dihubungi">Sudah Dihubungi</SelectItem>
                    <SelectItem value="Sedang Ditangani">Sedang Ditangani</SelectItem>
                    <SelectItem value="Rujukan Medis">Rujukan Medis</SelectItem>
                    <SelectItem value="Selesai">Selesai</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 h-11 rounded-xl"><SelectValue placeholder="Urutan" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Terbaru</SelectItem>
                    <SelectItem value="date-asc">Terlama</SelectItem>
                    <SelectItem value="score-desc">Skor Tertinggi</SelectItem>
                    <SelectItem value="score-asc">Skor Terendah</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ScreeningTable
              patients={paginatedPatients} startIndex={startIndex}
              getStatusColor={getStatusColor} formatKategori={formatKategori}
              handleViewDetail={handleViewDetail} handleDeletePatient={s => setPatientDeleteConfirm({ open: true, patient: s })}
            />

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
                <span className="flex items-center text-sm font-medium px-4">Halaman {currentPage} dari {totalPages}</span>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button>
              </div>
            )}
          </CardContent>
        </Card>
      </DashboardLayout>
    </div>
  );
}
