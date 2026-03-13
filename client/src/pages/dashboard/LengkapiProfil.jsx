import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ChevronRight, ChevronLeft, Save, UserCircle, Activity, HeartPulse, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "../../components/Navbar";

// Components
import { ProfileView } from "@/components/dashboard/profile/ProfileView";
import { StepBiodata, StepKehamilan, StepKesehatan } from "@/components/dashboard/profile/ProfileSteps";

// Services
import { profileService } from "@/services/profile.service";

const steps = [
  { id: 1, title: "Biodata Diri", icon: UserCircle },
  { id: 2, title: "Riwayat Kehamilan", icon: Activity },
  { id: 3, title: "Riwayat Kesehatan", icon: HeartPulse },
];

export default function LengkapProfil() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    tanggal_lahir: "", alamat: "", no_hp: "", pendidikan: "", pekerjaan: "",
    status_pernikahan: "", jumlah_anak: "", riwayat_keguguran: "Tidak Pernah",
    komplikasi_hamil_ini: "Tidak Ada", riwayat_kesehatan_jiwa: "Tidak Pernah",
    komplikasi_persalinan_lalu: "Tidak Ada",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isProfileExist, setIsProfileExist] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user.id) return;
    const loadProfile = async () => {
      try {
        const data = await profileService.getProfile(user.id);
        if (data.profile_completed) {
          setIsProfileExist(true);
          setFormData({
            ...data,
            tanggal_lahir: data.tanggal_lahir ? data.tanggal_lahir.split('T')[0] : "",
            jumlah_anak: mapJumlahAnakToString(data.jumlah_anak) || data.jumlah_anak || ""
          });
        }
      } catch (error) {
        console.error("Fetch profile failed:", error);
      }
    };
    loadProfile();
  }, [user.id]);

  const mapJumlahAnakToString = (val) => {
    if (val === 1) return "Satu";
    if (val === 2) return "Dua";
    if (val === 3) return "Tiga";
    if (val > 3) return "Lebih dari 3";
    return val;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "no_hp") {
      const numeric = value.replace(/[^0-9]/g, "");
      if (numeric.length <= 13) setFormData(prev => ({ ...prev, [name]: numeric }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = (e) => {
    e?.preventDefault();
    if (currentStep === 1) {
      if (!formData.tanggal_lahir || !formData.no_hp || !formData.alamat || !formData.pendidikan || !formData.pekerjaan) {
        return toast.error("Data Belum Lengkap", { description: "Mohon lengkapi semua data diri." });
      }
      if (!/^08[0-9]{8,11}$/.test(formData.no_hp)) {
        return toast.error("WhatsApp Tidak Valid", { description: "Gunakan format 08xxxxxxxx (10-13 digit)." });
      }
    }
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (currentStep < 3) return;
    try {
      await profileService.updateProfile(user.id, formData);
      const updatedUser = { ...user, profile_completed: true };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setIsProfileExist(true);
      setIsEditing(false);
      toast.success("Profil Berhasil Disimpan!");
    } catch (error) {
      toast.error("Gagal Menyimpan Data");
    }
  };

  const calculateAge = (dateString) => {
    if (!dateString) return 0;
    const diff = new Date() - new Date(dateString);
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  return (
    <div className="min-h-screen w-full bg-[#FCFAF7] flex flex-col items-center font-sans pb-20 pt-28 md:pt-36 relative overflow-x-hidden text-[#423D33]">
      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none origin-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(182,141,61,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(182,141,61,0.08)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <Navbar />

      <div className="w-full max-w-3xl mt-6 px-6 relative z-10">
        {isProfileExist && !isEditing ? (
          <ProfileView
            formData={formData} user={user}
            onEdit={() => { setIsEditing(true); setCurrentStep(1); }}
            onHistory={() => navigate("/riwayat-skrining")}
            calculateAge={calculateAge}
          />
        ) : (
          <Card className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white animate-in fade-in zoom-in-95 duration-500">
            <div className="relative text-center pt-12 pb-6 px-6 bg-gradient-to-b from-primary/5 via-primary/5 to-transparent rounded-t-[2rem]">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-primary/10 shadow-sm text-primary font-bold text-[10px] uppercase tracking-widest mb-4 backdrop-blur-sm">
                <Activity size={14} className="animate-pulse" /> {isEditing ? "Mode Edit Data" : "Pendaftaran Pasien Baru"}
              </div>
              <h2 className="text-3xl font-black text-[#423D33] tracking-tight mb-2">
                {isEditing ? "Perbarui Profil" : "Lengkapi Profil"}
              </h2>
              <p className="text-[#8C8576] text-sm max-w-lg mx-auto">
                {isEditing ? "Perbarui data medis Bunda untuk hasil skrining akurat." : "Lengkapi data medis Bunda dalam 3 langkah mudah."}
              </p>
            </div>

            <div className="pt-8 pb-4 px-10 relative">
              <div className="absolute top-[56px] left-[50px] right-[50px] h-1 bg-gray-100 -translate-y-1/2 -z-10 rounded-full"></div>
              <div className="absolute top-[56px] left-[50px] h-1 bg-primary transition-all duration-700 -translate-y-1/2 -z-10 rounded-full" style={{ width: `calc(${((currentStep - 1) / 2) * 100}% - ${currentStep === 1 ? 0 : 20}px)` }}></div>
              <div className="flex items-center justify-between">
                {steps.map((s) => (
                  <div key={s.id} className="flex flex-col items-center gap-2 relative">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 relative ${currentStep >= s.id ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-300 border-gray-100'}`}>
                      <s.icon size={22} />
                      {currentStep > s.id && <div className="absolute -top-2 -right-2 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm"><Check size={14} strokeWidth={4} /></div>}
                    </div>
                    <span className={`text-[10px] font-extrabold uppercase tracking-widest ${currentStep >= s.id ? 'text-primary' : 'text-gray-400'}`}>{s.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <CardContent className="px-8 py-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {currentStep === 1 && <StepBiodata formData={formData} setFormData={setFormData} handleChange={handleChange} openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} />}
                {currentStep === 2 && <StepKehamilan formData={formData} setFormData={setFormData} openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} />}
                {currentStep === 3 && <StepKesehatan formData={formData} setFormData={setFormData} openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} />}

                <div className="flex justify-between gap-4 pt-6">
                  {currentStep > 1 ? (
                    <Button type="button" variant="outline" onClick={() => setCurrentStep(prev => prev - 1)} className="rounded-2xl h-12 px-8 border-gray-100 text-gray-500 font-bold hover:bg-gray-50">
                      <ChevronLeft className="mr-2 h-5 w-5" /> Kembali
                    </Button>
                  ) : <div />}

                  {currentStep < 3 ? (
                    <Button type="button" onClick={handleNext} className="rounded-2xl h-12 px-10 shadow-lg shadow-primary/20 font-bold group">
                      Selanjutnya <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  ) : (
                    <Button type="submit" className="rounded-2xl h-12 px-10 shadow-lg shadow-primary/30 font-bold bg-gradient-to-r from-primary to-yellow-600">
                      <Save className="mr-2 h-5 w-5" /> Simpan Profil
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
