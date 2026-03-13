import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, Mail, Phone, ChevronLeft, ChevronRight } from "lucide-react";

export const PatientTable = ({
  data, loading, startIndex,
  onView, onDelete,
  pagination: { currentPage, totalPages, setCurrentPage, filteredLength, itemsPerPage }
}) => {
  const endIndex = Math.min(startIndex + itemsPerPage, filteredLength);

  return (
    <div className="mt-6 rounded-md border shadow-sm bg-white overflow-hidden">
      <Table>
        <TableHeader className="bg-primary/5">
          <TableRow>
            <TableHead className="w-[50px] font-bold text-gray-700">No</TableHead>
            <TableHead className="font-bold text-gray-700">Nama Lengkap</TableHead>
            <TableHead className="font-bold text-gray-700">Kontak</TableHead>
            <TableHead className="font-bold text-gray-700">Tanggal Daftar</TableHead>
            <TableHead className="font-bold text-gray-700">Status Profil</TableHead>
            <TableHead className="font-bold text-gray-700 text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">Memuat data...</TableCell>
            </TableRow>
          ) : data.length > 0 ? (
            data.map((p, index) => (
              <TableRow key={p.id} className="hover:bg-primary/5 transition-colors">
                <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{p.nama_lengkap}</span>
                    <span className="text-xs text-muted-foreground md:hidden">{p.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-3 w-3" /> {p.email}
                    </div>
                    {p.no_hp && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3 w-3" /> {p.no_hp}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground">
                    {new Date(p.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </TableCell>
                <TableCell>
                  {p.status_pendidikan ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Lengkap
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Belum Lengkap
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-blue-200 bg-blue-50 text-blue-600 hover:text-blue-700 hover:bg-blue-100 hover:border-blue-300"
                      title="Lihat Detail Profil"
                      onClick={() => onView(p)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-red-200 bg-red-50 text-red-600 hover:text-red-700 hover:bg-red-100 hover:border-red-300"
                      title="Hapus Pasien"
                      onClick={() => onDelete(p)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                Tidak ada data pasien ditemukan.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-4 py-4 border-t bg-gray-50">
        <div className="text-sm text-gray-500">
          Menampilkan <span className="font-medium text-gray-900">{Math.min(startIndex + 1, filteredLength)}</span> - <span className="font-medium text-gray-900">{endIndex}</span> dari <span className="font-medium text-gray-900">{filteredLength}</span> data
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="h-8"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Sebelumnya
          </Button>
          <span className="text-sm font-medium px-2">
            Halaman {currentPage} dari {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="h-8"
          >
            Selanjutnya
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};
