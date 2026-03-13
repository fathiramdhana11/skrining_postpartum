import React, { useEffect, useState } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Mail, ShieldCheck, Users, Eye, AlertCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { screeningService, userService } from "../../services/api.service";
import { formatKategori, getStatusColor } from "../../lib/utils";

export default function TimNakesPage() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [loading, setLoading] = useState(true);
  const [nakes, setNakes] = useState([]);
  const [screenings, setScreenings] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedNakes, setSelectedNakes] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [nakesData, screeningsData] = await Promise.all([
        userService.getAll(),
        screeningService.getAll()
      ]);
      setNakes((nakesData || [])
        .filter(u => u.role === 'tenagakesehatan')
        .map(u => ({ ...u, nama_lengkap: u.nama_lengkap?.trim() }))
      );
      setScreenings(screeningsData || []);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNakes = nakes.filter(p =>
    p.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  const getHandledPatients = (nakesId) => {
    return screenings.filter(s => s.handled_by === nakesId);
  };

  const handleGoToDetail = (patientName) => {
    navigate('/nakes/skrining', { state: { searchName: patientName } });
  };

  const handleShowPatients = (nakes) => {
    setSelectedNakes(nakes);
    setIsDialogOpen(true);
  };

  return (
    <DashboardLayout title="Tim Tenaga Kesehatan" role={user.role === 'superadmin' ? "Super Admin" : "Tenaga Kesehatan"}>
      <Card className="shadow-lg border-primary/10">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-primary/5 bg-gradient-to-r from-primary/5 to-transparent pb-6">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2.5 rounded-xl shadow-sm border border-primary/10 text-primary">
              <ShieldCheck size={24} />
            </div>
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">Daftar Tenaga Kesehatan</CardTitle>
              <CardDescription className="text-gray-500 mt-1 font-medium">Daftar bidan dan personil medis yang bertugas di klinik</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
            <div className="flex-1 w-full relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Cari nakes..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 h-11 bg-white border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl transition-all shadow-sm"
              />
            </div>
            <Badge variant="outline" className="px-4 py-2 rounded-lg bg-white border-primary/20 text-primary font-bold">
              Total: {filteredNakes.length} Personil
            </Badge>
          </div>

          <div className="rounded-xl border shadow-sm bg-white overflow-hidden">
            <Table>
              <TableHeader className="bg-primary/5">
                <TableRow>
                  <TableHead className="w-[50px] font-bold text-gray-700">No</TableHead>
                  <TableHead className="font-bold text-gray-700">Nama Lengkap</TableHead>
                  <TableHead className="font-bold text-gray-700">Role</TableHead>
                  <TableHead className="font-bold text-gray-700">Email</TableHead>
                  <TableHead className="font-bold text-gray-700 text-center">Pasien Ditangani</TableHead>
                  <TableHead className="font-bold text-gray-700 text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} className="h-48 text-center text-gray-400">Memuat data tim...</TableCell></TableRow>
                ) : filteredNakes.length > 0 ? (
                  filteredNakes.map((n, index) => (
                    <TableRow key={n.id} className="hover:bg-primary/5 transition-colors">
                      <TableCell className="font-medium text-gray-500">{index + 1}</TableCell>
                      <TableCell className="font-bold text-gray-800">{n.nama_lengkap}</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">Bidan</Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-gray-400" />
                          {n.email}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-bold text-primary border-primary/20">
                          {getHandledPatients(n.id).length} Pasien
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-blue-200 bg-blue-50 text-blue-600 hover:text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-all shadow-sm"
                          onClick={() => handleShowPatients(n)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={6} className="h-48 text-center text-gray-400">Anggota tim tidak ditemukan</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="p-6 bg-primary text-white">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6" />
              Pasien dalam Tanggung Jawab: {selectedNakes?.nama_lengkap}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6">
            {selectedNakes && getHandledPatients(selectedNakes.id).length > 0 ? (
              <div className="rounded-xl border overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead>Nama Pasien</TableHead>
                      <TableHead>Tanggal Skrining</TableHead>
                      <TableHead>Hasil Skrining</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getHandledPatients(selectedNakes.id).map((s) => (
                      <TableRow key={s.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-bold text-gray-800 py-4">{s.nama_lengkap}</TableCell>
                        <TableCell className="text-sm text-gray-500 py-4">
                          {new Date(s.waktu_skrining).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge className={getStatusColor(s.kategori)}>
                            {formatKategori(s.kategori)}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary font-bold hover:bg-primary/10 gap-2 px-4 rounded-xl"
                            onClick={() => handleGoToDetail(s.nama_lengkap)}
                          >
                            Buka Detail SOAP <ArrowRight className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-gray-400 gap-2">
                <AlertCircle className="h-10 w-10 opacity-20" />
                <p>Belum ada pasien yang ditangani oleh tenaga kesehatan ini.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
