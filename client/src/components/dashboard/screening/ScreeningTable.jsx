import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Trash2 } from "lucide-react";

export const ScreeningTable = ({
  patients,
  startIndex,
  getStatusColor,
  formatKategori,
  handleViewDetail,
  handleDeletePatient
}) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader className="bg-primary/5">
          <TableRow>
            <TableHead className="w-12 font-bold text-gray-700">No</TableHead>
            <TableHead className="font-bold text-gray-700">Nama Pasien</TableHead>
            <TableHead className="text-center font-bold text-gray-700">Skrining</TableHead>
            <TableHead className="text-center font-bold text-gray-700">Tanggal Skrining</TableHead>
            <TableHead className="font-bold text-gray-700">Hasil</TableHead>
            <TableHead className="font-bold text-gray-700">Status</TableHead>
            <TableHead className="text-center font-bold text-gray-700">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.length > 0 ? (
            patients.map((p, i) => (
              <TableRow key={p.user_id} className={p.latest_score >= 13 ? "bg-red-50" : ""}>
                <TableCell>{startIndex + i + 1}</TableCell>
                <TableCell className="font-bold">{p.nama_lengkap}</TableCell>
                <TableCell className="text-center font-bold text-primary">{p.count}x</TableCell>
                <TableCell className="text-center text-xs text-gray-500">
                  {new Date(p.latest_screening).toLocaleDateString('id-ID')}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(p.latest_kategori)}>
                    {formatKategori(p.latest_kategori)} (Skor: {p.latest_score})
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-[10px]">
                    {p.latest_status || 'Belum Ditangani'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-blue-200 bg-blue-50 text-blue-600 hover:text-blue-700 hover:bg-blue-100 hover:border-blue-300"
                      title="Lihat Detail & Tindak Lanjut"
                      onClick={() => handleViewDetail(p)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-red-200 bg-red-50 text-red-600 hover:text-red-700 hover:bg-red-100 hover:border-red-300"
                      title="Hapus Seluruh Riwayat Pasien"
                      onClick={() => handleDeletePatient(p)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-64 text-center">Data tidak ditemukan</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
