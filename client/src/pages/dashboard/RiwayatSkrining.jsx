import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ChevronLeft, ChevronRight, Calendar, BarChart3, Clock,
  AlertCircle, Activity, HeartPulse
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

// Components
import { ScreeningDetailModal } from "@/components/dashboard/screening/ScreeningDetailModal";

// Services
import { screeningService } from "@/services/api.service";
import { getStatusColor, getVibrantColor, formatKategori } from "@/lib/utils";

export default function RiwayatSkrining() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedScreening, setSelectedScreening] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) return navigate("/login");

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await screeningService.getHistory(user.id);
        setHistory(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error("Gagal Memuat Riwayat");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [navigate]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = history.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(history.length / itemsPerPage);

  return (
    <div className="min-h-screen w-full bg-[#FCFAF7] flex flex-col font-sans relative overflow-x-hidden text-[#423D33] pb-20 pt-28 md:pt-36">
      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none origin-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(182,141,61,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(182,141,61,0.08)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-primary/10 to-amber-100/20 rounded-full blur-[100px]" />
      </div>

      <Navbar />

      <div className="flex-1 flex flex-col items-center mt-6 px-4 relative z-10 w-full max-w-3xl mx-auto">
        <Card className="w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white overflow-hidden min-h-[500px] flex flex-col transition-all duration-500">
          <div className="px-6 pt-8 pb-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="bg-primary/10 w-10 h-10 rounded-xl flex items-center justify-center text-primary mb-2 shadow-sm">
                <HeartPulse size={20} />
              </div>
              <h1 className="text-2xl font-black text-gray-800 tracking-tight">Riwayat Skrining</h1>
              <p className="text-gray-400 font-bold uppercase text-[9px] tracking-widest mt-1">Pantau Kesehatan Secara Berkala</p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/lengkapi-profil")}
              className="rounded-xl h-10 px-6 border-gray-100 text-gray-500 font-bold hover:bg-white hover:text-primary shadow-sm text-xs"
            >
              <ChevronLeft className="mr-2 h-3.5 w-3.5" /> Kembali ke Profil
            </Button>
          </div>

          <div className="p-6 flex-1 flex flex-col bg-gray-50/30">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-80 text-gray-300 animate-pulse">
                <Activity size={48} className="mb-4 opacity-20" />
                <p className="font-black uppercase text-[10px] tracking-widest">Sinkronisasi Data...</p>
              </div>
            ) : history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center mb-6 text-gray-200 shadow-inner">
                  <BarChart3 size={40} />
                </div>
                <h3 className="text-xl font-black text-gray-800 mb-2">Bunda Belum Memulai Skrining</h3>
                <p className="text-gray-400 font-bold max-w-sm mx-auto mb-8 text-xs leading-relaxed uppercase tracking-tight">Ayo mulai deteksi dini sekarang untuk masa postpartum yang lebih tenang dan bahagia.</p>
                <Button
                  onClick={() => navigate("/skrining")}
                  className="h-12 px-10 rounded-2xl font-black text-base shadow-lg shadow-primary/30 bg-primary text-white hover:scale-105 transition-transform"
                >
                  Mulai Skrining Sekarang
                </Button>
              </div>
            ) : (
              <div className="flex flex-col h-full justify-between">
                <div className="grid gap-4">
                  {currentItems.map((item) => (
                    <div
                      key={item.id}
                      className="group bg-white border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-primary/10 rounded-2xl p-5 transition-all duration-500 flex flex-col md:flex-row gap-4 items-center justify-between"
                    >
                      <div className="flex items-center gap-5 w-full md:w-auto">
                        <div className={`w-14 h-14 shrink-0 rounded-2xl border flex flex-col items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-md ${getVibrantColor(item.kategori)}`}>
                          <span className="text-2xl font-black tracking-tighter leading-none mb-0.5">{item.total_score}</span>
                          <span className="text-[8px] font-black uppercase tracking-widest opacity-60 text-center">Skor</span>
                        </div>

                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${getStatusColor(item.kategori)}`}>
                              {formatKategori(item.kategori)}
                            </span>
                            {item.flag_bunuh_diri && (
                              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600 text-white text-[8px] font-black uppercase tracking-widest shadow-lg shadow-red-200 animate-bounce">
                                <AlertCircle size={9} /> Atensi Segera
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                            <div className="flex items-center gap-1.5"><Calendar size={12} className="text-primary" /> {new Date(item.waktu_skrining).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                            <div className="flex items-center gap-1.5"><Clock size={12} className="text-primary" /> {new Date(item.waktu_skrining).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</div>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={() => setSelectedScreening(item)}
                        variant="ghost"
                        className="h-10 w-full md:w-auto px-6 rounded-xl font-black text-[10px] uppercase tracking-widest border border-gray-100 hover:bg-primary hover:text-white transition-all group-hover:border-primary group-hover:shadow-lg shadow-primary/20"
                      >
                        Lihat Analisis <ChevronRight size={14} className="ml-1.5 group-hover:translate-x-1.5 transition-transform" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-6 pt-10 mt-10 border-t border-gray-50">
                    <Button
                      variant="ghost" onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="h-12 w-12 p-0 rounded-2xl bg-white border border-gray-50 text-gray-400 hover:text-primary transition-all disabled:opacity-20"
                    >
                      <ChevronLeft size={20} />
                    </Button>
                    <div className="h-10 px-6 flex items-center bg-white rounded-full border border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">Halaman {currentPage} <span className="mx-2 opacity-20">/</span> {totalPages}</div>
                    <Button
                      variant="ghost" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="h-12 w-12 p-0 rounded-2xl bg-white border border-gray-50 text-gray-400 hover:text-primary transition-all disabled:opacity-20"
                    >
                      <ChevronRight size={20} />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>

      <ScreeningDetailModal screening={selectedScreening} onClose={() => setSelectedScreening(null)} />
    </div>
  );
}
