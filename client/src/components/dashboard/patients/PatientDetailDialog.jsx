import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Mail, Phone, Calendar, User, MapPin,
  GraduationCap, Briefcase
} from "lucide-react";

export const PatientDetailDialog = ({ isOpen, onOpenChange, patient }) => {
  if (!patient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl">
        {/* Header with Gradient */}
        <div className="relative px-8 py-10 bg-gradient-to-br from-primary via-primary/90 to-yellow-600">
          <div className="flex items-center gap-6 relative z-10">
            <div className="h-24 w-24 rounded-3xl bg-white/20 backdrop-blur-md border-4 border-white/30 flex items-center justify-center text-white font-black text-4xl shadow-xl animate-in zoom-in-50 duration-500">
              {patient.nama_lengkap.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">{patient.nama_lengkap}</h2>
              <div className="flex flex-wrap gap-4">
                <p className="text-white/90 text-sm flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                  <Mail className="h-4 w-4" />
                  {patient.email}
                </p>
                {patient.no_hp && (
                  <p className="text-white/90 text-sm flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                    <Phone className="h-4 w-4" />
                    {patient.no_hp}
                  </p>
                )}
              </div>
            </div>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-400/10 rounded-full -ml-12 -mb-12 blur-2xl"></div>
        </div>

        {/* Content Sections */}
        <div className="p-8 space-y-6 bg-gray-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information Card */}
            <InfoSection
              icon={User}
              title="Informasi Personal"
              color="blue"
              items={[
                { label: 'Tanggal Daftar', value: formatDate(patient.created_at), icon: Calendar },
                { label: 'No. Handphone', value: patient.no_hp || 'Belum diisi', icon: Phone },
              ]}
            />

            {/* Address Card */}
            <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all duration-300 md:col-span-2">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-purple-500" /> Alamat Domisili
              </h3>
              <p className="text-lg font-bold text-gray-700 leading-relaxed">
                {patient.alamat || <span className="text-gray-300 font-normal italic">Alamat belum diisi oleh pasien</span>}
              </p>
            </div>

            {/* Education & Work Card */}
            <InfoSection
              icon={GraduationCap}
              title="Latar Belakang"
              color="green"
              className="md:col-span-2"
              items={[
                { label: 'Status Pendidikan', value: patient.status_pendidikan || 'Belum diisi', icon: GraduationCap },
                { label: 'Status Pekerjaan', value: patient.status_pekerjaan || 'Belum diisi', icon: Briefcase },
              ]}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const InfoSection = ({ icon: Icon, title, color, items, className = "" }) => {
  const colorMap = {
    blue: "bg-blue-500 text-blue-500",
    purple: "bg-purple-500 text-purple-500",
    green: "bg-green-500 text-green-500"
  };

  return (
    <div className={`bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
        <Icon className={`h-4 w-4 ${colorMap[color].split(' ')[1]}`} /> {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {items.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-tighter flex items-center gap-1">
              <item.icon className="h-3 w-3" /> {item.label}
            </p>
            <p className="text-base font-bold text-gray-700">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString('id-ID', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};
