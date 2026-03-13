import React, { useEffect, useState } from 'react';
import { toast } from "sonner";
import { Search, UserPlus, AlertTriangle } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";

// Components
import { PatientTable } from "@/components/dashboard/patients/PatientTable";
import { PatientDetailDialog } from "@/components/dashboard/patients/PatientDetailDialog";

// Services
import { userService } from "@/services/api.service";

export default function DataPasienPage() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [loading, setLoading] = useState(true);
  const [pasien, setPasien] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPasien, setSelectedPasien] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [patientDeleteConfirm, setPatientDeleteConfirm] = useState({ open: false, patient: null });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadPasien();
  }, []);

  const loadPasien = async () => {
    try {
      setLoading(true);
      const data = await userService.getPatients();
      setPasien(data);
    } catch (error) {
      toast.error("Gagal Memuat Data", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const filteredPasien = pasien.filter(p =>
    (p.nama_lengkap || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.email || "").toLowerCase().includes(search.toLowerCase())
  );

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.ceil(filteredPasien.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPasien = filteredPasien.slice(startIndex, startIndex + itemsPerPage);

  const handleViewProfile = (p) => {
    setSelectedPasien(p);
    setIsDialogOpen(true);
  };

  const handleDeletePatient = (p) => {
    setPatientDeleteConfirm({ open: true, patient: p });
  };

  const confirmPatientDelete = async () => {
    const patientToDelete = patientDeleteConfirm.patient;
    if (!patientToDelete) return;

    try {
      await userService.deletePatient(patientToDelete.id);
      toast.success("Data pasien berhasil dihapus", {
        description: `Seluruh data terkait ${patientToDelete.nama_lengkap} telah dihapus dari sistem`
      });
      await loadPasien();
    } catch (error) {
      toast.error("Gagal Menghapus Pasien", { description: error.message });
    } finally {
      setPatientDeleteConfirm({ open: false, patient: null });
    }
  };

  return (
    <>
      <PatientDetailDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        patient={selectedPasien}
      />

      <DashboardLayout title="Data Pasien" role={user.role === 'superadmin' ? "Super Admin" : "Tenaga Kesehatan"}>
        <Card className="shadow-lg border-primary/10 overflow-hidden">
          <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-primary/5 bg-gradient-to-r from-primary/5 to-transparent pb-6">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2.5 rounded-xl shadow-sm border border-primary/10 text-primary">
                <UserPlus size={24} />
              </div>
              <div>
                <CardTitle className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">Daftar Data Pasien</CardTitle>
                <CardDescription className="text-gray-500 mt-1 font-medium">
                  Total <span className="text-primary font-bold">{pasien.length}</span> Pasien Terdata
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama atau email..."
                  className="pl-9 w-full md:w-[280px] bg-white transition-all focus:ring-2 focus:ring-primary/20"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <PatientTable
              data={paginatedPasien}
              loading={loading}
              startIndex={startIndex}
              onView={handleViewProfile}
              onDelete={handleDeletePatient}
              pagination={{
                currentPage,
                totalPages,
                setCurrentPage,
                filteredLength: filteredPasien.length,
                itemsPerPage
              }}
            />
          </CardContent>
        </Card>
      </DashboardLayout>

      {/* Delete Confirmation */}
      <AlertDialog open={patientDeleteConfirm.open} onOpenChange={(open) => setPatientDeleteConfirm({ open, patient: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <AlertDialogTitle className="text-xl text-red-700">Hapus Seluruh Data Pasien?</AlertDialogTitle>
                <AlertDialogDescription className="mt-1">
                  Peringatan: Ini akan menghapus akun user, profil, dan SEMUA riwayat skrining pasien ini secara permanen.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          {patientDeleteConfirm.patient && (
            <div className="py-4 p-4 bg-red-50 rounded-xl border border-red-100">
              <p className="text-sm text-red-800">
                Anda akan menghapus data pasien: <span className="font-bold underline">{patientDeleteConfirm.patient.nama_lengkap}</span>
              </p>
              <p className="text-xs text-red-600 mt-2 font-medium">Tindakan ini tidak dapat dibatalkan!</p>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmPatientDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              Ya, Hapus Semua Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
