import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Calendar, Phone, MapPin, Users, GraduationCap, Briefcase,
  ChevronDown, HeartPulse, Stethoscope, Activity, RadioTower
} from "lucide-react";
import { MedicalCalendar } from "@/components/ui/medical-calendar";

export const StepBiodata = ({ formData, setFormData, handleChange, openDropdown, setOpenDropdown }) => {
  const pendidikanOptions = [
    "Tidak Sekolah", "SD / Sederajat", "SMP / Sederajat",
    "SMA / SMK / Sederajat", "Perguruan Tinggi (D3 / S1 / S2)"
  ];

  const statusPernikahanOptions = ["Menikah", "Tidak Menikah / Cerai"];
  const pekerjaanOptions = ["Tidak Bekerja", "Bekerja"];

  return (
    <div className="grid md:grid-cols-2 gap-x-6 gap-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2">
        <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1">
          <Calendar size={12} className="text-primary" /> Tanggal Lahir
        </Label>
        <MedicalCalendar
          value={formData.tanggal_lahir}
          onChange={(val) => setFormData({ ...formData, tanggal_lahir: val })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="no_hp" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1">
          <Phone size={12} className="text-primary" /> Nomor WhatsApp
        </Label>
        <Input
          id="no_hp"
          name="no_hp"
          placeholder="Contoh: 081234567890"
          className="h-12 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white focus:border-primary/30 transition-all text-sm font-semibold text-gray-700"
          value={formData.no_hp}
          onChange={handleChange}
          required
        />
      </div>

      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="alamat" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1">
          <MapPin size={12} className="text-primary" /> Alamat Lengkap
        </Label>
        <Input
          id="alamat"
          name="alamat"
          placeholder="Masukkan alamat lengkap domisili saat ini..."
          className="h-12 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white focus:border-primary/30 transition-all text-sm font-semibold text-gray-700"
          value={formData.alamat}
          onChange={handleChange}
          required
        />
      </div>

      <div className="md:col-span-2 space-y-2">
        <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1">
          <Users size={12} className="text-primary" /> Status Pernikahan
        </Label>
        <div className="flex p-1 bg-gray-50 rounded-2xl border border-gray-100">
          {statusPernikahanOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setFormData({ ...formData, status_pernikahan: opt })}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${formData.status_pernikahan === opt ? 'bg-white shadow-sm text-primary border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 relative">
        <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1">
          <GraduationCap size={12} className="text-primary" /> Pendidikan Terakhir
        </Label>
        <div
          onClick={() => setOpenDropdown(openDropdown === 'pendidikan' ? null : 'pendidikan')}
          className="h-12 w-full rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between px-4 cursor-pointer hover:bg-white hover:border-primary/30 transition-all group"
        >
          <span className={`text-sm font-bold ${formData.pendidikan ? 'text-gray-700' : 'text-gray-400 font-normal'}`}>
            {formData.pendidikan || "Pilih Pendidikan"}
          </span>
          <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${openDropdown === 'pendidikan' ? 'rotate-180' : ''}`} />
        </div>
        {openDropdown === 'pendidikan' && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-50 p-2 z-[50] animate-in fade-in slide-in-from-top-2 duration-200">
            {pendidikanOptions.map((opt) => (
              <div
                key={opt}
                onClick={() => {
                  setFormData({ ...formData, pendidikan: opt });
                  setOpenDropdown(null);
                }}
                className={`px-4 py-3 rounded-xl text-sm font-bold cursor-pointer transition-colors ${formData.pendidikan === opt ? 'bg-primary/5 text-primary' : 'hover:bg-gray-50 text-gray-600'}`}
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2 relative">
        <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1">
          <Briefcase size={12} className="text-primary" /> Pekerjaan
        </Label>
        <div
          onClick={() => setOpenDropdown(openDropdown === 'pekerjaan' ? null : 'pekerjaan')}
          className="h-12 w-full rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between px-4 cursor-pointer hover:bg-white hover:border-primary/30 transition-all group"
        >
          <span className={`text-sm font-bold ${formData.pekerjaan ? 'text-gray-700' : 'text-gray-400 font-normal'}`}>
            {formData.pekerjaan || "Pilih Pekerjaan"}
          </span>
          <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${openDropdown === 'pekerjaan' ? 'rotate-180' : ''}`} />
        </div>
        {openDropdown === 'pekerjaan' && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-50 p-2 z-[50] animate-in fade-in slide-in-from-top-2 duration-200">
            {pekerjaanOptions.map((opt) => (
              <div
                key={opt}
                onClick={() => {
                  setFormData({ ...formData, pekerjaan: opt });
                  setOpenDropdown(null);
                }}
                className={`px-4 py-3 rounded-xl text-sm font-bold cursor-pointer transition-colors ${formData.pekerjaan === opt ? 'bg-primary/5 text-primary' : 'hover:bg-gray-50 text-gray-600'}`}
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const StepKehamilan = ({ formData, setFormData, openDropdown, setOpenDropdown }) => {
  const jumlahAnakOptions = ["Satu", "Dua", "Tiga", "Lebih dari 3"];
  const komplikasiHamilOptions = [
    "Tidak Ada", "Hipertensi / Preeklamsia", "Diabetes Gestasional",
    "Anemia", "Perdarahan / Plasenta Previa"
  ];
  const riwayatKeguguranOptions = ["Tidak Pernah", "1 Kali", "2 Kali", "Lebih dari 2 Kali"];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-2 relative">
          <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1">
            <Users size={12} className="text-primary" /> Jumlah Anak
          </Label>
          <div
            onClick={() => setOpenDropdown(openDropdown === 'jumlah_anak' ? null : 'jumlah_anak')}
            className="h-12 w-full rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between px-4 cursor-pointer hover:bg-white hover:border-primary/30 transition-all group"
          >
            <span className={`text-sm font-bold ${formData.jumlah_anak ? 'text-gray-700' : 'text-gray-400 font-normal'}`}>
              {formData.jumlah_anak || "Pilih Jumlah Anak"}
            </span>
            <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${openDropdown === 'jumlah_anak' ? 'rotate-180' : ''}`} />
          </div>
          {openDropdown === 'jumlah_anak' && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-50 p-2 z-[50] animate-in fade-in slide-in-from-top-2 duration-200">
              {jumlahAnakOptions.map((opt) => (
                <div
                  key={opt}
                  onClick={() => {
                    setFormData({ ...formData, jumlah_anak: opt });
                    setOpenDropdown(null);
                  }}
                  className={`px-4 py-3 rounded-xl text-sm font-bold cursor-pointer transition-colors ${formData.jumlah_anak === opt ? 'bg-primary/5 text-primary' : 'hover:bg-gray-50 text-gray-600'}`}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2 relative">
          <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1">
            <HeartPulse size={12} className="text-primary" /> Riwayat Keguguran
          </Label>
          <div
            onClick={() => setOpenDropdown(openDropdown === 'riwayat_keguguran' ? null : 'riwayat_keguguran')}
            className="h-12 w-full rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between px-4 cursor-pointer hover:bg-white hover:border-primary/30 transition-all group"
          >
            <span className={`text-sm font-bold ${formData.riwayat_keguguran ? 'text-gray-700' : 'text-gray-400 font-normal'}`}>
              {formData.riwayat_keguguran || "Pilih Riwayat Keguguran"}
            </span>
            <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${openDropdown === 'riwayat_keguguran' ? 'rotate-180' : ''}`} />
          </div>
          {openDropdown === 'riwayat_keguguran' && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-50 p-2 z-[50] animate-in fade-in slide-in-from-top-2 duration-200">
              {riwayatKeguguranOptions.map((opt) => (
                <div
                  key={opt}
                  onClick={() => {
                    setFormData({ ...formData, riwayat_keguguran: opt });
                    setOpenDropdown(null);
                  }}
                  className={`px-4 py-3 rounded-xl text-sm font-bold cursor-pointer transition-colors ${formData.riwayat_keguguran === opt ? 'bg-primary/5 text-primary' : 'hover:bg-gray-50 text-gray-600'}`}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 relative">
        <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1">
          <Stethoscope size={12} className="text-primary" /> Komplikasi Kehamilan Saat Ini
        </Label>
        <div
          onClick={() => setOpenDropdown(openDropdown === 'komplikasi_hamil' ? null : 'komplikasi_hamil')}
          className="h-12 w-full rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between px-4 cursor-pointer hover:bg-white hover:border-primary/30 transition-all group"
        >
          <span className={`text-sm font-bold ${formData.komplikasi_hamil_ini ? 'text-gray-700' : 'text-gray-400 font-normal'}`}>
            {formData.komplikasi_hamil_ini || "Pilih Komplikasi"}
          </span>
          <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${openDropdown === 'komplikasi_hamil' ? 'rotate-180' : ''}`} />
        </div>
        {openDropdown === 'komplikasi_hamil' && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-50 p-2 z-[50] animate-in fade-in slide-in-from-top-2 duration-200">
            {komplikasiHamilOptions.map((opt) => (
              <div
                key={opt}
                onClick={() => {
                  setFormData({ ...formData, komplikasi_hamil_ini: opt });
                  setOpenDropdown(null);
                }}
                className={`px-4 py-3 rounded-xl text-sm font-bold cursor-pointer transition-colors ${formData.komplikasi_hamil_ini === opt ? 'bg-primary/5 text-primary' : 'hover:bg-gray-50 text-gray-600'}`}
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const StepKesehatan = ({ formData, setFormData, openDropdown, setOpenDropdown }) => {
  const mentalHealthOptions = ["Tidak Pernah", "Kadang Berasa Sedih", "Pernah Mengalami Depresi", "Sedang Dalam Pengobatan"];
  const komplikasiPersalinanOptions = [
    "Tidak Ada / Kehamilan Pertama", "Perdarahan Pasca Salin", "Partus Lama / Macet",
    "Robekan Jalan Lahir (Grade 3-4)", "Infeksi", "Operasi Caesar Darurat", "Lainnya"
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2 relative">
        <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1">
          <Activity size={12} className="text-primary" /> Riwayat Kesehatan Jiwa
        </Label>
        <div
          onClick={() => setOpenDropdown(openDropdown === 'jiwa' ? null : 'jiwa')}
          className="h-12 w-full rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between px-4 cursor-pointer hover:bg-white hover:border-primary/30 transition-all group"
        >
          <span className={`text-sm font-bold ${formData.riwayat_kesehatan_jiwa ? 'text-gray-700' : 'text-gray-400 font-normal'}`}>
            {formData.riwayat_kesehatan_jiwa || "Pilih Riwayat Kesehatan Jiwa"}
          </span>
          <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${openDropdown === 'jiwa' ? 'rotate-180' : ''}`} />
        </div>
        {openDropdown === 'jiwa' && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-50 p-2 z-[50] animate-in fade-in slide-in-from-top-2 duration-200">
            {mentalHealthOptions.map((opt) => (
              <div
                key={opt}
                onClick={() => {
                  setFormData({ ...formData, riwayat_kesehatan_jiwa: opt });
                  setOpenDropdown(null);
                }}
                className={`px-4 py-3 rounded-xl text-sm font-bold cursor-pointer transition-colors ${formData.riwayat_kesehatan_jiwa === opt ? 'bg-primary/5 text-primary' : 'hover:bg-gray-50 text-gray-600'}`}
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2 relative">
        <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1">
          <Stethoscope size={12} className="text-primary" /> Riwayat Komplikasi Persalinan Lalu
        </Label>
        <div
          onClick={() => setOpenDropdown(openDropdown === 'komplikasi_lalu' ? null : 'komplikasi_lalu')}
          className="h-12 w-full rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between px-4 cursor-pointer hover:bg-white hover:border-primary/30 transition-all group"
        >
          <span className={`text-sm font-bold ${formData.komplikasi_persalinan_lalu ? 'text-gray-700' : 'text-gray-400 font-normal'}`}>
            {formData.komplikasi_persalinan_lalu || "Pilih Komplikasi Lalu"}
          </span>
          <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${openDropdown === 'komplikasi_lalu' ? 'rotate-180' : ''}`} />
        </div>
        {openDropdown === 'komplikasi_lalu' && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-50 p-2 z-[50] animate-in fade-in slide-in-from-top-2 duration-200">
            {komplikasiPersalinanOptions.map((opt) => (
              <div
                key={opt}
                onClick={() => {
                  setFormData({ ...formData, komplikasi_persalinan_lalu: opt });
                  setOpenDropdown(null);
                }}
                className={`px-4 py-3 rounded-xl text-sm font-bold cursor-pointer transition-colors ${formData.komplikasi_persalinan_lalu === opt ? 'bg-primary/5 text-primary' : 'hover:bg-gray-50 text-gray-600'}`}
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
