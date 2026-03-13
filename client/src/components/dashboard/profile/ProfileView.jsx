import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UserCircle, Activity, Calendar, Phone, Users, GraduationCap,
  Briefcase, MapPin, HeartPulse, Stethoscope
} from "lucide-react";

export const ProfileView = ({ formData, user, onEdit, onHistory, calculateAge }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-yellow-600 h-24 relative">
          <div className="absolute -bottom-12 left-8 h-24 w-24 rounded-3xl bg-white p-1 shadow-lg flex items-center justify-center">
            <div className="h-full w-full rounded-[1.25rem] bg-gray-50 flex items-center justify-center text-primary">
              <UserCircle size={48} />
            </div>
          </div>
        </div>

        <CardContent className="pt-16 px-8 pb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {user.nama_lengkap || "Bunda"}
              </h3>
              <p className="text-sm text-gray-400">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</p>
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Button onClick={onHistory} variant="outline" className="rounded-xl border-blue-200 text-blue-600 font-bold hover:bg-blue-50">
                <Activity className="mr-2 h-4 w-4" /> Riwayat Skrining
              </Button>
              <Button onClick={onEdit} variant="outline" className="rounded-xl border-primary/20 text-primary font-bold hover:bg-primary/5">
                Edit Profil
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <InfoCard icon={Calendar} label="Tanggal Lahir" value={formData.tanggal_lahir ? new Date(formData.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'} badge={calculateAge(formData.tanggal_lahir) + " Tahun"} />
            <InfoCard icon={Phone} label="WhatsApp" value={formData.no_hp || '-'} />
            <InfoCard icon={Users} label="Status" value={formData.status_pernikahan || '-'} />
            <InfoCard icon={GraduationCap} label="Pendidikan" value={formData.pendidikan || '-'} />
            <InfoCard icon={Briefcase} label="Pekerjaan" value={formData.pekerjaan || '-'} />
            <InfoCard icon={MapPin} label="Alamat" value={formData.alamat || '-'} />
          </div>

          <div className="border-t border-dashed border-gray-200 my-8"></div>

          <div className="space-y-8">
            <div>
              <h5 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary"></div> Riwayat Obstetri & Kesehatan Jiwa
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard icon={Users} label="Jumlah Anak" value={(formData.jumlah_anak || '0') + " Orang"} color="blue" />
                <StatusCard icon={HeartPulse} label="Riwayat Keguguran" value={formData.riwayat_keguguran || 'Tidak Pernah'} color={formData.riwayat_keguguran?.includes('Ya') || formData.riwayat_keguguran === 'Pernah' ? 'red' : 'green'} />
                <StatusCard icon={Activity} label="Riwayat Kes. Jiwa" value={formData.riwayat_kesehatan_jiwa || 'Tidak Pernah'} color={formData.riwayat_kesehatan_jiwa === 'Pernah' ? 'purple' : 'indigo'} />
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-orange-500"></div> Riwayat Komplikasi Medis
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ComplicationCard icon={Stethoscope} label="Kehamilan Saat Ini" value={formData.komplikasi_hamil_ini || 'Tidak Ada'} active={formData.komplikasi_hamil_ini && formData.komplikasi_hamil_ini !== 'Tidak Ada'} />
                <ComplicationCard icon={Activity} label="Persalinan Sebelumnya" value={formData.komplikasi_persalinan_lalu || 'Tidak Ada'} active={formData.komplikasi_persalinan_lalu && formData.komplikasi_persalinan_lalu !== 'Tidak Ada' && !formData.komplikasi_persalinan_lalu.includes('Kehamilan Pertama')} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const InfoCard = ({ icon: Icon, label, value, badge }) => (
  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col gap-1 hover:bg-white hover:shadow-sm transition-all duration-300">
    <div className="flex justify-between items-center">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
        <Icon size={12} className="text-primary" /> {label}
      </span>
      {badge && <span className="bg-primary/10 text-primary text-[9px] px-2 py-0.5 rounded-full font-bold">{badge}</span>}
    </div>
    <p className="text-sm font-bold text-gray-700 truncate">{value}</p>
  </div>
);

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_15px_-5px_rgba(0,0,0,0.05)] flex flex-col items-center text-center justify-center gap-2 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
    <div className={`h-12 w-12 rounded-full bg-${color}-50 text-${color}-600 flex items-center justify-center mb-1`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">{label}</p>
      <p className="text-lg font-extrabold text-gray-800">{value}</p>
    </div>
  </div>
);

const StatusCard = ({ icon: Icon, label, value, color }) => (
  <div className={`p-5 rounded-2xl border shadow-[0_2px_15px_-5px_rgba(0,0,0,0.05)] flex flex-col items-center text-center justify-center gap-2 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ${color === 'red' ? 'bg-red-50/30 border-red-100' : color === 'purple' ? 'bg-purple-50/30 border-purple-100' : 'bg-white border-gray-100'}`}>
    <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-1 transition-colors ${color === 'red' ? 'bg-red-100 text-red-600' : color === 'green' ? 'bg-green-50 text-green-600' : color === 'purple' ? 'bg-purple-100 text-purple-600' : 'bg-indigo-50 text-indigo-600'}`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">{label}</p>
      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border bg-white border-${color}-100 text-${color}-600`}>
        {value}
      </span>
    </div>
  </div>
);

const ComplicationCard = ({ icon: Icon, label, value, active }) => (
  <div className={`px-6 py-5 rounded-2xl border shadow-[0_2px_15px_-5px_rgba(0,0,0,0.05)] flex items-center gap-5 hover:bg-white transition-all duration-300 ${active ? 'bg-orange-50/30 border-orange-100' : 'bg-white border-gray-100'}`}>
    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${active ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'}`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">{label}</p>
      <p className={`text-sm font-bold ${active ? 'text-orange-700' : 'text-gray-800'}`}>{value}</p>
    </div>
  </div>
);
