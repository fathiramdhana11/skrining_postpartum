import { useState, useEffect } from "react";
import logoKlinik from "../assets/logo_klinik.png";
import heroImage from "../assets/ibu dan anak.jpg";
import bidanJendi from "../assets/bidan_jendi.jpeg";
import bidanSalsa from "../assets/bidan_salsa.jpeg";
import bidanMaudy from "../assets/bidan_maudy.jpeg";
import bidanRafika from "../assets/bidan_rafika.jpeg";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Phone, Mail, MapPin, Clock, Calendar,
  Stethoscope, Baby, Activity, HeartPulse,
  CheckCircle2, ArrowRight, User, Star, HelpCircle, ChevronUp, ChevronLeft, ChevronRight,
  ShieldCheck, Award, X,
  Instagram, Music2, Camera, Home, Sparkles
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { API_URL } from "../apiConfig";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  const [count, setCount] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [activeSection, setActiveSection] = useState("beranda");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showProfileAlert, setShowProfileAlert] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(1);
  const navigate = useNavigate();

  // Auth State
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isLoggedIn = !!localStorage.getItem("token");
  const isProfileComplete = user?.profile_completed === true;

  // Scroll Progress & Back to Top Logic
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for Scroll Reveal
  useEffect(() => {
    const observerOptions = {
      root: null,
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll(".reveal-on-scroll");
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Refresh User Data from Server (Sync LocalStorage)
  useEffect(() => {
    const fetchLatestUserData = async () => {
      if (isLoggedIn && user?.id) {
        try {
          const response = await fetch(`${API_URL}/api/users/${user.id}`);
          if (response.ok) {
            const data = await response.json();
            // Check if profile exists (meaning completed)
            const isCompleted = data.profile_completed || false;

            // Update LocalStorage if changed
            if (user.profile_completed !== isCompleted) {
              const updatedUser = { ...user, profile_completed: isCompleted };
              localStorage.setItem("user", JSON.stringify(updatedUser));
              // Force reload to reflect changes or use a context (but reload is simpler for now without context)
              window.location.reload();
            }
          }
        } catch (error) {
          console.error("Failed to sync user data", error);
        }
      }
    };

    fetchLatestUserData();
  }, []);

  const handleSkriningAction = () => {
    if (!isLoggedIn) {
      // Redirect to login, but tell it to come back to /skrining
      navigate("/login", { state: { from: "/skrining" } });
    } else if (!isProfileComplete) {
      setShowProfileAlert(true);
    } else {
      navigate("/skrining");
    }
  };

  // Scroll Spy Logic
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["beranda", "tentang", "layanan", "skrining", "bidan", "testimoni", "faq"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
          setActiveSection(section);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const services = [
    { title: "ANC (Antenatal Care)", desc: "Pemeriksaan kehamilan rutin, USG terjadwal dengan obgyn, dan pemberian suplemen.", longDesc: "Layanan lengkap pemeriksaan kehamilan untuk memantau kesehatan ibu dan janin. Meliputi pengukuran berat badan, tekanan darah, detak jantung janin, dan konsultasi keluhan.", icon: Stethoscope },
    { title: "Persalinan Normal 24 Jam", desc: "Pertolongan persalinan yang aman, bersih, dan sayang ibu dengan metode Gentle Birth.", longDesc: "Fasilitas persalinan 24 jam dengan suasana homey. Didukung bidan profesional yang menerapkan metode Gentle Birth untuk minim trauma dan rasa sakit.", icon: Baby },
    { title: "Perawatan Nifas (PNC)", desc: "Pemantauan kesehatan ibu pasca melahirkan, perawatan luka perineum, perawatan luka caesar.", longDesc: "Kunjungan nifas untuk memastikan pemulihan rahim, perawatan luka jalan lahir, dan pendampingan menyusui awal (IMD).", icon: HeartPulse },
    { title: "Imunisasi Dasar & Lanjutan", desc: "Vaksinasi lengkap sesuai IDAI dan pemantauan sesuai dengan SDIDTK.", longDesc: "Layanan imunisasi lengkap (BCG, Polio, DPT, Campak, dll) dengan penanganan yang ramah anak untuk memimalkan trauma jarum suntik.", icon: ShieldCheck },
    { title: "Pelayanan KB", desc: "Konsultasi dan pemasangan alat kontrasepsi (Suntik, Pil, IUD, Implan).", longDesc: "Konsultasi pemilihan metode kontrasepsi yang paling sesuai dengan kondisi kesehatan dan rencana keluarga Anda.", icon: Calendar },
    { title: "Kelas Ibu Hamil & Yoga", desc: "Edukasi persiapan persalinan dan latihan fisik ringan.", longDesc: "Program mingguan yoga hamil dan edukasi seputar kehamilan, persalinan, dan perawatan bayi baru lahir.", icon: Activity },
    { title: "Moms and Baby Treatment", desc: "Pijat relaksasi ibu dan bayi untuk kesehatan fisik & bonding.", longDesc: "Paket treatment spa untuk memanjakan ibu dan menstimulasi motorik bayi dengan tenaga terapis bersertifikat.", icon: Sparkles },
    { title: "Layanan Homecare", desc: "Kunjungan bidan ke rumah untuk pemeriksaan ibu & bayi.", longDesc: "Layanan kesehatan panggil ke rumah (visit) untuk kenyamanan ibu pasca bersalin yang belum bisa bepergian jauh.", icon: Home },
    { title: "Newborn Photoshoot", desc: "Dokumentasi momen berharga bayi baru lahir dengan tema menarik.", longDesc: "Abadikan momen gemas si kecil dengan properti foto bayi yang aman, bersih, dan estetik.", icon: Camera }
  ];

  // Animated Counter Logic
  useEffect(() => {
    let start = 0;
    const end = 2000;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, []);

  const testimonials = [
    {
      name: "Rina N.",
      initials: "RN",
      rating: 5,
      text: "Fasilitasnya sangat bersih dan steril. Bidan Rafika sangat telaten menjelaskan setiap prosedur. Merasa aman sekali di sini."
    },
    {
      name: "Sarah D.",
      initials: "SD",
      rating: 5,
      text: "Fitur skrining EPDS-nya sangat membantu! Saya baru sadar kalau saya mengalami baby blues ringan. Berkat konsultasi dini, saya cepat pulih."
    },
    {
      name: "Amel P.",
      initials: "AM",
      rating: 5,
      text: "Jadwal imunisasinya jelas dan on-time. Anak saya tenang banget pas disuntik karena bidannya jago ambil hati anak."
    },
    {
      name: "Maya K.",
      initials: "MK",
      rating: 5,
      text: "Sangat terbantu dengan layanan homecare-nya, apalagi pasca lahiran caesar yang susah gerak. Bidan datang tepat waktu dan ramah."
    }
  ];

  return (
    <div className="font-sans text-gray-800 scroll-smooth bg-gray-50/50 overflow-x-hidden w-full relative">
      <Navbar activeSection={activeSection} />

      {/* Custom Keyframes for Floating Animation */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(20px) translateZ(0);
          transition: opacity 1.2s ease-out, transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
          will-change: opacity, transform;
          backface-visibility: hidden;
        }
        .reveal-visible {
          opacity: 1 !important;
          transform: translateY(0) translateZ(0) !important;
        }
        .drip-wave-container {
          position: absolute;
          top: -5px;
          left: 0;
          width: 100%;
          overflow: hidden;
          line-height: 0;
          z-index: 20;
          pointer-events: none;
        }
        .drip-wave-container svg {
          transform: scaleY(1.2);
          transform-origin: top;
        }
        .drip-wave-container path {
          filter: drop-shadow(0 0.5px 0 currentColor) drop-shadow(0 -0.5px 0 currentColor);
        }
        @keyframes check-pop {
          0% { transform: scale(0) rotate(-45deg); opacity: 0; }
          70% { transform: scale(1.2) rotate(10deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .animate-check-pop {
          animation: check-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
        }
      `}</style>

      {/* 3. HERO BANNER - CINEMATIC & ANIMATED */}
      <section id="beranda" className="relative pt-32 md:pt-40 pb-0 overflow-hidden scroll-mt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-white to-white -z-20"></div>
        <div className="absolute inset-0 -z-10" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.5 }}></div>

        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32 -z-10 animate-blob"></div>
        <div className="absolute top-1/2 right-1/2 w-[400px] h-[400px] bg-blue-200/30 rounded-full blur-[100px] -z-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-100/40 rounded-full blur-[80px] -ml-20 -mb-20 -z-10 animate-blob animation-delay-4000"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 fill-mode-both">
              <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-white border border-primary/20 text-primary font-bold text-xs uppercase tracking-widest shadow-sm hover:shadow-md transition-shadow cursor-default">
                <Activity className="h-4 w-4 animate-pulse" />
                Mitra Kesehatan Ibu & Anak Terpercaya
              </div>
              <div className="flex gap-6 lg:gap-10">
                <div className="w-1.5 self-stretch bg-gradient-to-b from-primary via-primary/50 to-transparent rounded-full hidden sm:block"></div>
                <h1 className="font-heading text-5xl lg:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight">
                  Kesehatan Ibu<br />
                  <span className="text-primary">Prioritas Utama,</span>
                  <div className="mt-6 text-2xl lg:text-4xl font-medium text-gray-500 tracking-normal flex flex-wrap items-center gap-x-3">
                    Kebahagiaan Bayi
                    <span className="text-gray-900 font-bold relative inline-block">
                      Sempurna
                      <div className="absolute -bottom-1 left-0 w-full h-1.5 bg-primary/20 rounded-full"></div>
                    </span>
                  </div>
                </h1>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed max-w-xl border-l-4 border-primary/30 pl-6">
                Kami menghadirkan pelayanan kebidanan modern dengan pendekatan personal yang hangat.
                Mendampingi setiap langkah perjalanan Anda mulai dari perencanaan kehamilan, persalinan, hingga pemulihan pasca melahirkan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  onClick={handleSkriningAction}
                  size="lg" className="font-heading h-14 px-10 rounded-full text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all bg-gradient-to-r from-primary to-yellow-600 hover:from-primary/90 hover:to-yellow-600/90 border-0 text-white"
                >
                  Mulai Skrining
                </Button>
                <a href="#layanan">
                  <Button variant="outline" size="lg" className="font-heading h-14 px-10 rounded-full text-lg border-2 border-gray-200 hover:border-primary hover:bg-primary/5 text-gray-600 hover:text-primary transition-all bg-white/50 backdrop-blur-sm">
                    Lihat Layanan Kami
                  </Button>
                </a>
              </div>
              <div className="pt-8 flex items-center gap-8 text-sm font-bold text-gray-500">
                <div className="flex items-center gap-2 relative group cursor-help">
                  <div className="w-2 h-2 rounded-full bg-primary/80 animate-ping"></div>
                  Terverifikasi
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-2 bg-gray-900 text-white text-[10px] rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">Izin Praktik Resmi Kemenkes RI</div>
                </div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary/80"></div> Bidan Profesional</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary/80"></div> Alat Modern</div>
              </div>
            </div>

            <div className="lg:w-1/2 relative animate-in fade-in zoom-in duration-1000 delay-300 fill-mode-both">
              <div className="relative z-10 w-full max-w-lg mx-auto p-4">
                <div className="absolute inset-0 bg-primary rounded-full opacity-5 blur-3xl animate-pulse"></div>
                <div className="relative rounded-[3rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] border-8 border-white group">
                  <img
                    src={heroImage}
                    alt="Ibu dan Bidan"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[2000ms]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* Floating Badge 1 - Soft Shadow */}
                <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-[0_10px_40px_-5px_rgba(0,0,0,0.1)] z-20 flex items-center gap-4 animate-bounce duration-[4000ms] border border-gray-50 text-gray-800">
                  <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold">Privasi Terjamin</p>
                    <p className="text-xs text-gray-500">Data Medis Aman</p>
                  </div>
                </div>
                <div className="absolute -bottom-8 -left-8 bg-white p-4 rounded-2xl shadow-[0_10px_40px_-5px_rgba(0,0,0,0.1)] z-20 flex items-center gap-4 animate-bounce duration-[3000ms] delay-700 border border-gray-50 text-gray-800">
                  <div className="h-12 w-12 bg-gradient-to-br from-primary to-yellow-500 rounded-full flex items-center justify-center text-white shadow-lg">
                    <HeartPulse className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-xl flex items-center">
                      {count.toLocaleString()}+
                    </p>
                    <p className="text-xs text-gray-500">Ibu Telah Terbantu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. INFO CARDS - INTEGRATED UNIFIED LOOK */}
        <div className="container mx-auto px-6 relative z-30 mt-8 mb-16">
          <div className="grid md:grid-cols-3 gap-8 reveal-on-scroll">
            <div className="bg-primary hover:bg-primary/95 transition-colors text-white p-10 rounded-3xl shadow-[0_20px_40px_-10px_rgba(182,141,61,0.4)] hover:-translate-y-2 transform duration-300 relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
              <Phone className="h-12 w-12 mb-6 opacity-90 relative z-10" />
              <h3 className="font-heading text-2xl font-bold mb-3 relative z-10">Persalinan 24 Jam</h3>
              <p className="opacity-90 leading-relaxed mb-6 relative z-10">
                Layanan respon cepat untuk persalinan mendadak atau kondisi kegawatdaruratan kebidanan.
              </p>
              <a href="https://wa.me/6282298587473" target="_blank" className="inline-flex items-center font-bold px-6 py-3 bg-white text-primary rounded-full hover:shadow-lg transition-all relative z-10">
                Hubungi Bidan <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
            <div className="bg-gray-900 hover:bg-gray-800 transition-colors text-white p-10 rounded-3xl shadow-2xl hover:-translate-y-2 transform duration-300 relative overflow-hidden">
              <Clock className="h-12 w-12 mb-6 text-primary" />
              <h3 className="font-heading text-2xl font-bold mb-6">Jadwal Operasional</h3>

              <div className="space-y-6 font-medium relative z-10">
                {/* Jadwal Klinik */}
                <div>
                  <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Jadwal Praktik Klinik</h4>
                  <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                    <span className="text-white">Senin - Minggu</span>
                    <span className="text-primary font-bold">08.00 - 20.00</span>
                  </div>
                </div>

                {/* Jadwal Bidan Rafika */}
                <div>
                  <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Jadwal Praktik Bidan Rafika</h4>
                  <div className="flex justify-between items-center border-gray-700 pb-2">
                    <span className="text-white">Rabu, Jumat, Minggu</span>
                    <span className="text-primary font-bold">09.00 - 11.00</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white hover:bg-gray-50 transition-colors text-gray-800 p-10 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] border border-gray-100 hover:-translate-y-2 transform duration-300 relative">
              <Activity className="h-12 w-12 mb-6 text-primary" />
              <h3 className="font-heading text-2xl font-bold mb-3">Skrining Mandiri</h3>
              <p className="text-gray-500 leading-relaxed mb-6">
                Deteksi dini risiko <span className="text-primary font-bold">Depresi Postpartum</span> metode EPDS. Cepat, Mudah & Akurat.
              </p>
              <Button
                onClick={handleSkriningAction}
                className="w-full h-12 rounded-full font-bold text-lg shadow-lg hover:shadow-primary/20 text-white"
              >
                Mulai Skrining Sekarang
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ABOUT US - CLEAN MEDICAL LOOK */}
      <section id="tentang" className="py-24 bg-white relative overflow-hidden scroll-mt-32">
        <div className="drip-wave-container text-white">
          <svg className="relative block w-full h-16 md:h-24" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
          </svg>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50"></div>

        <div className="container mx-auto px-6 relative reveal-on-scroll">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2 grid grid-cols-2 gap-6 relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-transparent rounded-[2.5rem] -z-10 blur-xl"></div>
              <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" className="rounded-3xl shadow-lg w-full h-80 object-cover -translate-y-8 hover:scale-105 transition-transform duration-500 border border-white" alt="Fasilitas 1" />
              <img src="https://images.unsplash.com/photo-1519494476857-81788909b139?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" className="rounded-3xl shadow-lg w-full h-80 object-cover translate-y-8 hover:scale-105 transition-transform duration-500 border border-white" alt="Fasilitas 2" />
            </div>
            <div className="lg:w-1/2 space-y-8">
              <div>
                <h4 className="font-heading text-primary font-bold uppercase tracking-widest text-sm mb-2 flex items-center gap-2">
                  <span className="w-8 h-px bg-primary"></span> Tentang PMB Rafika Putri
                </h4>
                <h2 className="font-heading text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                  Dedikasi Penuh untuk <br /> Kenyamanan Ibu & Anak
                </h2>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed text-justify">
                Didirikan pada tahun 2021, Praktek Mandiri Bidan (PMB) Rafika Putri telah membantu banyak keluarga menyambut kehadiran buah hati. Kami percaya bahwa proses kehamilan dan persalinan adalah momen sakral yang harus dijalani dengan rasa aman, nyaman, dan bahagia.
              </p>

              <div className="space-y-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="flex items-start gap-4 text-gray-800">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0"><CheckCircle2 className="h-5 w-5" /></div>
                  <div>
                    <h5 className="font-bold font-heading text-lg">Tim Medis Berkompeten</h5>
                    <p className="text-sm text-gray-500 mt-1">Ditangani langsung oleh Bidan senior bersertifikasi (STR & SIPB aktif).</p>
                  </div>
                </div>
                <div className="w-full h-px bg-gray-100"></div>
                <div className="flex items-start gap-4 text-gray-800">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0"><CheckCircle2 className="h-5 w-5" /></div>
                  <div>
                    <h5 className="font-bold font-heading text-lg">Fasilitas Homey & Steril</h5>
                    <p className="text-sm text-gray-500 mt-1">Ruang tunggu dan kamar bersalin yang bersih dan rapih.</p>
                  </div>
                </div>
                <div className="w-full h-px bg-gray-100"></div>
                <div className="flex items-start gap-4 text-gray-800">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0"><CheckCircle2 className="h-5 w-5" /></div>
                  <div>
                    <h5 className="font-bold font-heading text-lg">Pendekatan Holistik</h5>
                    <p className="text-sm text-gray-500 mt-1">Tidak hanya fisik, kami juga peduli pada kesehatan mental ibu (Screening EPDS).</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LAYANAN - GRID WITH TRANSPARENT BG PATTERN */}
      <section id="layanan" className="pt-20 pb-16 bg-gray-50/50 relative scroll-mt-24 overflow-hidden">
        <div className="drip-wave-container text-white">
          <svg className="relative block w-full h-12 md:h-16" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
          </svg>
        </div>
        <div className="absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-70"></div>
        <div className="container mx-auto px-6 relative z-10 reveal-on-scroll">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <h4 className="font-heading text-primary font-bold uppercase tracking-widest text-sm">Layanan Unggulan</h4>
            <h2 className="font-heading text-4xl lg:text-5xl font-extrabold text-gray-900">Solusi Kesehatan Terpadu</h2>
            <p className="text-gray-500 text-lg">Kami menyediakan rangkaian layanan medis lengkap untuk kebutuhan Ibu & Anak.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedService(item)}
                className="bg-white p-10 rounded-[2rem] shadow-sm hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-300 group border border-gray-100 relative overflow-hidden flex flex-col items-start h-full cursor-pointer"
              >
                <div className="absolute -right-6 -bottom-6 text-gray-100 group-hover:text-primary/10 transition-colors duration-500 pointer-events-none">
                  <item.icon strokeWidth={1} size={160} className="transform -rotate-12 opacity-50" />
                </div>
                <div className="h-14 w-14 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-yellow-500 group-hover:text-white transition-all shadow-sm relative z-10 hover:scale-110 duration-300">
                  <item.icon className="h-7 w-7" />
                </div>
                <h4 className="font-heading text-xl font-bold mb-4 relative z-10 text-gray-900 group-hover:text-primary transition-colors">{item.title}</h4>
                <p className="text-gray-500 leading-relaxed mb-6 text-sm relative z-10 flex-1">{item.desc}</p>
                <button className="inline-flex items-center text-gray-400 font-bold text-xs tracking-widest group-hover:text-primary uppercase group-hover:gap-3 transition-all relative z-10 mt-auto">
                  Detail Layanan <ArrowRight className="ml-2 h-3 w-3" />
                </button>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-yellow-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. SKRINING HIGHLIGHT - PARALLAX EFFECT */}
      <section id="skrining"
        className="py-32 relative isolate overflow-hidden bg-fixed bg-center bg-cover scroll-mt-32"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1555252333-9f8e92e65df9?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80")`
        }}
      >
        <div className="absolute inset-0 bg-gray-900/80 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
        <div className="drip-wave-container text-gray-50">
          <svg className="relative block w-full h-16 md:h-24" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
          </svg>
        </div>

        <div className="container mx-auto px-6 relative z-10 reveal-on-scroll">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-3/5 space-y-8 text-center lg:text-left">
              <span className="inline-flex items-center gap-2 py-2 px-6 rounded-full bg-white/10 border border-white/20 text-white font-bold text-sm uppercase tracking-widest backdrop-blur-md shadow-lg">
                <Star className="h-4 w-4 text-primary fill-primary" />
                Program Pencegahan Depresi Postpartum
              </span>
              <h2 className="font-heading text-5xl lg:text-7xl font-extrabold text-white leading-tight drop-shadow-md">
                Deteksi Dini Depresi <br /> <span className="text-primary">Postpartum</span>
              </h2>
              <p className="text-gray-200 text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light drop-shadow">
                Kehamilan membawa perubahan besar. Jangan biarkan <b>Baby Blues</b> berkembang menjadi Depresi. Skrining mandiri sekarang juga, gratis & rahasia.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-4">
                <Button
                  onClick={handleSkriningAction}
                  size="lg" className="font-heading h-16 px-12 text-lg rounded-full bg-primary hover:bg-yellow-600 border border-transparent hover:border-white/20 shadow-[0_10px_40px_-10px_rgba(182,141,61,0.5)] hover:scale-105 transition-all text-white"
                >
                  Mulai Skrining
                </Button>
              </div>
            </div>

            <div className="lg:w-2/5 w-full">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[2.5rem] text-white space-y-8 shadow-2xl relative">
                <div className="absolute top-0 right-0 p-6 opacity-20"><Activity size={64} /></div>
                <h3 className="font-heading text-2xl font-bold border-b border-white/10 pb-6">Kenapa Harus Skrining?</h3>
                <ul className="space-y-6">
                  {[
                    "Mendeteksi gejala kecemasan & depresi sejak dini.",
                    "Mencegah dampak negatif pada tumbuh kembang bayi.",
                    "Mendapatkan rekomendasi penanganan medis yang tepat.",
                    "Meningkatkan kualitas hidup & keharmonisan keluarga."
                  ].map((item, i) => (
                    <li key={i} className="flex gap-4 items-start group cursor-default relative">
                      {/* Connecting Line */}
                      {i !== 3 && (
                        <div className="absolute left-[11px] top-8 bottom-[-16px] w-[2px] bg-white/10 group-hover:bg-primary/50 transition-colors duration-300"></div>
                      )}

                      <div
                        style={{ animationDelay: `${i * 200 + 500}ms` }}
                        className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 animate-check-pop group-hover:bg-primary group-hover:text-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 z-10 relative"
                      >
                        <CheckCircle2 size={14} strokeWidth={3} />
                      </div>
                      <span className="text-gray-200 leading-snug font-light pt-0.5 group-hover:text-white transition-colors duration-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TEAM / BIDAN PROFILE */}
      <section id="bidan" className="py-24 bg-white relative overflow-visible scroll-mt-10">
        <div className="drip-wave-container text-gray-900">
          <svg className="relative block w-full h-16 md:h-24" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
          </svg>
        </div>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-50 to-white"></div>
        <div className="container mx-auto px-6 relative z-10 reveal-on-scroll">
          <div className="flex flex-col xl:flex-row bg-white rounded-[2rem] md:rounded-[3rem] p-6 xl:p-16 border border-gray-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-20 -mt-20"></div>
            <div className="xl:w-1/3 text-center relative z-10">
              <div className="inline-block relative">
                <div className="h-64 w-64 lg:h-80 lg:w-80 rounded-[2rem] overflow-hidden border-8 border-white shadow-2xl mx-auto mb-8 bg-gray-100 transition-transform hover:scale-105 duration-500">
                  <img src={bidanRafika} alt="bidanrafika" className="w-full h-full object-cover" />
                </div>
              </div>
              <h3 className="font-heading text-3xl font-extrabold text-gray-900">Siti Rafika Putri</h3>
              <p className="text-primary font-bold text-lg">S.ST., Bdn., M.Kes</p>
              <p className="text-gray-500 text-sm mt-2 font-medium bg-gray-50 inline-block px-4 py-1 rounded-full border border-gray-100 uppercase tracking-widest">SIPB: 446/1234/SIPB/2023</p>
            </div>
            <div className="xl:w-2/3 xl:pl-20 space-y-8 py-8 relative z-10 text-center xl:text-left flex flex-col justify-center">
              <Award className="h-16 w-16 text-primary/10 absolute top-0 right-0 hidden md:block" />
              <h2 className="font-heading text-4xl font-extrabold text-gray-900 leading-tight">Melayani dengan Hati,<br />Didukung Kompetensi Tinggi</h2>
              <blockquote className="text-gray-600 leading-relaxed text-xl italic font-serif relative">
                <span className="text-4xl text-primary/20 absolute -top-4 -left-4 font-serif">"</span>
                Menjadi saksi lahirnya kehidupan adalah kehormatan bagi kami. Di PMB Rafika Putri, standar keamanan medis dan kenyamanan pasien adalah prioritas tak tertawar.
              </blockquote>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-gray-100">
                <div>
                  <h4 className="font-heading font-extrabold text-4xl text-primary text-gray-800">12+</h4>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Tahun Praktik</p>
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-4xl text-primary text-gray-800">5rb+</h4>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Persalinan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Midwives Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center group hover:-translate-y-2 transition-transform duration-300 hover:shadow-lg">
              <div className="h-28 w-28 mx-auto rounded-full overflow-hidden mb-6 border-4 border-primary/10 group-hover:border-primary transition-colors duration-300">
                <img src={bidanJendi} alt="Bidan Siti" className="w-full h-full object-cover" />
              </div>
              <h4 className="font-heading font-bold text-xl text-gray-900 mb-1">Jendiana Lit Saputri</h4>
              <p className="text-primary text-sm font-bold uppercase tracking-wider">Bidan Pelaksana</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center group hover:-translate-y-2 transition-transform duration-300 hover:shadow-lg">
              <div className="h-28 w-28 mx-auto rounded-full overflow-hidden mb-6 border-4 border-primary/10 group-hover:border-primary transition-colors duration-300">
                <img src={bidanMaudy} alt="bidanMaudy" className="w-full h-full object-cover" />
              </div>
              <h4 className="font-heading font-bold text-xl text-gray-900 mb-1">Maudy Yulinda Ekawati</h4>
              <p className="text-primary text-sm font-bold uppercase tracking-wider">Bidan Pelaksana</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center group hover:-translate-y-2 transition-transform duration-300 hover:shadow-lg">
              <div className="h-28 w-28 mx-auto rounded-full overflow-hidden mb-6 border-4 border-primary/10 group-hover:border-primary transition-colors duration-300">
                <img src={bidanSalsa} alt="Bidansalsa" className="w-full h-full object-cover" />
              </div>
              <h4 className="font-heading font-bold text-xl text-gray-900 mb-1">Salsabila Oktaviani</h4>
              <p className="text-primary text-sm font-bold uppercase tracking-wider">Bidan Pelaksana</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS */}
      <section id="testimoni" className="py-24 bg-gray-50 relative scroll-mt-32">
        <div className="drip-wave-container text-white">
          <svg className="relative block w-full h-16 md:h-24" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
          </svg>
        </div>
        <div className="relative z-10 reveal-on-scroll text-gray-800">
          <div className="container mx-auto px-6 text-center mb-12">
            <h4 className="font-heading text-primary font-bold uppercase tracking-widest text-sm mb-2">Testimoni Pasien</h4>
            <h2 className="font-heading text-4xl font-extrabold text-gray-900">Cerita Kebahagiaan</h2>
          </div>

          <div className="container mx-auto px-6 relative">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
              {/* Prev Button */}
              <button
                onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="h-12 w-12 rounded-full bg-white shadow-lg border border-gray-100 hidden md:flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all z-20 shrink-0"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Cards Container */}
              <div className="flex items-center justify-center w-full md:h-[450px] relative overflow-hidden md:overflow-visible py-10">
                {/* Mobile: Just show active. Desktop: Show 3 focused on active */}
                <div className="hidden md:flex items-center justify-center w-full gap-6">
                  {[-1, 0, 1].map((offset) => {
                    const index = (activeTestimonial + offset + testimonials.length) % testimonials.length;
                    const item = testimonials[index];
                    const isActive = offset === 0;

                    return (
                      <div
                        key={index}
                        onClick={() => setActiveTestimonial(index)}
                        className={`w-[350px] transition-all duration-500 ease-in-out cursor-pointer relative bg-white p-8 rounded-3xl border flex flex-col items-start h-[380px] ${isActive ? 'scale-110 shadow-2xl z-20 border-primary/20 opacity-100' : 'scale-90 shadow-sm border-gray-100 z-10 opacity-50 grayscale hover:opacity-100 hover:grayscale-0'}`}
                      >
                        <div className="text-yellow-400 flex gap-1 mb-6">
                          {[...Array(5)].map((_, n) => <Star key={n} size={16} fill="currentColor" />)}
                        </div>
                        <p className="text-gray-600 text-base leading-relaxed mb-6 italic flex-1 line-clamp-4">"{item.text}"</p>
                        <div className="flex items-center gap-3 mt-auto w-full pt-6 border-t border-gray-100">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs bg-gray-100 text-gray-500`}>{item.initials}</div>
                          <div className="font-heading font-bold text-gray-900 text-sm">{item.name}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Mobile View (Single Card) */}
                <div className="md:hidden w-full max-w-sm mx-auto">
                  {(() => {
                    const item = testimonials[activeTestimonial];
                    return (
                      <div className="bg-white p-8 rounded-3xl shadow-xl border-t-4 border-t-primary flex flex-col items-start h-full">
                        <div className="text-yellow-400 flex gap-1 mb-6">
                          {[...Array(5)].map((_, n) => <Star key={n} size={16} fill="currentColor" />)}
                        </div>
                        <p className="text-gray-600 text-base leading-relaxed mb-8 italic flex-1">"{item.text}"</p>
                        <div className="flex items-center gap-3 mt-auto w-full pt-6 border-t border-gray-100">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs bg-gray-100 text-gray-500`}>{item.initials}</div>
                          <div className="font-heading font-bold text-gray-900 text-sm">{item.name}</div>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </div>

              {/* Next Button */}
              <button
                onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
                className="h-12 w-12 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all z-20 shrink-0"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${activeTestimonial === idx ? 'w-8 bg-primary' : 'bg-gray-300 hover:bg-gray-400'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 10. FAQ */}
      <section id="faq" className="py-32 bg-white relative scroll-mt-32">
        <div className="drip-wave-container text-gray-50">
          <svg className="relative block w-full h-16 md:h-24" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
          </svg>
        </div>
        <div className="container mx-auto px-6 reveal-on-scroll text-gray-800">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="lg:w-1/3 space-y-6 lg:sticky lg:top-32">
              <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-blue-50 text-primary font-bold text-xs uppercase tracking-widest border border-blue-100">
                <HelpCircle className="h-4 w-4" /> Pusat Bantuan
              </div>
              <h2 className="font-heading text-4xl font-extrabold text-gray-900 leading-tight">
                Punya Pertanyaan <br /> Seputar <span className="text-primary underline decoration-wavy decoration-primary/30 underline-offset-8">Kehamilan?</span>
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed">
                Kami telah merangkum pertanyaan yang paling sering diajukan oleh para ibu. Jika belum terjawab, jangan ragu untuk menghubungi kami.
              </p>
              <a href="https://wa.me/6282298587473" target="_blank" className="block sm:inline-block">
                <Button className="h-14 px-8 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all mt-4 w-full sm:w-auto text-white">
                  <Phone className="mr-2 h-5 w-5" /> Chat Bidan Sekarang
                </Button>
              </a>
            </div>
            <div className="lg:w-2/3 w-full">
              <Accordion type="single" collapsible className="space-y-4">
                {[
                  {
                    q: "Kapan waktu terbaik untuk periksa kehamilan (ANC) pertama kali?",
                    a: "Segera setelah Anda mengetahui atau menduga bahwa Anda hamil (telat haid). Pemeriksaan awal sangat penting untuk memastikan lokasi kehamilan, usia janin, dan mendeteksi faktor risiko sejak dini."
                  },
                  {
                    q: "Apakah Skrining Depresi Postpartum (EPDS) itu wajib?",
                    a: "Sangat disarankan. Perubahan hormon pasca melahirkan sangat drastis. Skrining membantu mendeteksi gejala depresi postpartum sedini mungkin agar ibu bisa segera mendapatkan dukungan yang tepat demi kesehatan mental ibu dan tumbuh kembang bayi."
                  },
                  {
                    q: "Apa saja persiapan persalinan yang harus dibawa ke klinik?",
                    a: "Buku KIA (Pink), KTP & KK, pakaian ganti ibu (kancing depan untuk menyusui), pakaian bayi lengkap, pampers lansia perekat, dan perlengkapan mandi. Kami menyarankan untuk menyiapkan tas persalinan (Hospital Bag) sejak usia kehamilan 36 minggu."
                  },
                  {
                    q: "Berapa kisaran biaya persalinan di PMB Rafika Putri?",
                    a: "Biaya bervariasi tergantung tindakan medis yang diperlukan. Paket persalinan normal kami mulai dari Rp 1.500.000 (sudah termasuk perawatan bayi awal). Silakan hubungi bidan kami untuk rincian paket terbaru & promo yang berlaku."
                  },
                  {
                    q: "Apakah menerima pasien BPJS Kesehatan / KIS?",
                    a: "Saat ini kami menerima pasien BPJS dan KIS tanpa perlu pindah fasilitas kesehatan. Untuk persyaratan lebih lanjut, silakan hubungi bidan kami."
                  }
                ].map((item, idx) => (
                  <AccordionItem key={idx} value={`item-${idx}`} className="bg-white border border-gray-100 rounded-2xl px-6">
                    <AccordionTrigger className="font-heading font-bold text-lg text-gray-800 hover:no-underline py-6 text-left">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 text-base leading-relaxed pb-6">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FOOTER */}
      <footer id="kontak" className="bg-gray-900 text-gray-300 pt-20 pb-10 relative">
        <div className="drip-wave-container text-white">
          <svg className="relative block w-full h-16 md:h-24" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
          </svg>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-gray-400">
          <div className="grid md:grid-cols-12 gap-12 mb-12">
            <div className="md:col-span-4 space-y-6 text-gray-400">
              <div className="flex items-center gap-3">
                <img src={logoKlinik} alt="Logo" className="h-10 w-10 object-contain" />
                <h2 className="font-heading text-xl font-bold text-white">Bidan Rafika Putri</h2>
              </div>
              <p className="text-sm leading-relaxed">Sahabat keluarga terpercaya untuk kesehatan Ibu & Anak. Melayani dengan hati untuk masa depan buah hati yang cerah.</p>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/bidan_rafikaputri" target="_blank" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all text-white"><Instagram size={20} /></a>
                <a href="https://www.tiktok.com/@bidan_rafikaputri" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all text-white" title="TikTok"><Music2 size={20} /></a>
              </div>
            </div>
            <div className="md:col-span-2 space-y-6">
              <h3 className="text-white font-bold text-sm uppercase">Layanan</h3>
              <ul className="space-y-3 text-sm">
                {services.map((item, idx) => (
                  <li key={idx}>
                    <a href="#layanan" className="flex items-center gap-2 hover:text-primary transition-colors group">
                      <item.icon size={16} className="text-primary/70 group-hover:text-primary transition-colors" />
                      <span>{item.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-3 space-y-6">
              <h3 className="text-white font-bold text-sm uppercase">Hubungi Kami</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary shrink-0" />
                  <span>Perumahan Bojong Depok Baru 1 Blok GH No.12, RT.1/RW.17, Bojonggede, Kabupaten Bogor, Jawa Barat 16923</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary shrink-0" />
                  <span>+62 822-9858-7473</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary shrink-0" />
                  <span>bidanrafikaputri2022@gmail.com</span>
                </li>
              </ul>
            </div>
            <div className="md:col-span-3 space-y-6">
              <h3 className="text-white font-bold text-sm uppercase">Lokasi</h3>
              <div className="h-48 w-full rounded-2xl overflow-hidden bg-gray-800 shadow-lg border border-gray-700">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15856.910161565771!2d106.802057!3d-6.492848!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c31cc663515b%3A0x7a29d0f5cacad21a!2sBidan%20Rafika%20Putri%2CS.ST.%2CM.Kes!5e0!3m2!1sid!2sid!4v1767785281215!5m2!1sid!2sid"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 text-center text-xs">
            <p>&copy; 2025 Bidan Rafika Putri.</p>
          </div>
        </div>
      </footer>

      {/* Floating Buttons */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 left-8 z-[60] h-12 w-12 rounded-full bg-white shadow-2xl flex items-center justify-center text-primary transition-all duration-500 hover:-translate-y-2 ${showBackToTop ? 'opacity-100' : 'opacity-0'}`}
      >
        <ChevronUp size={24} />
      </button>

      <a
        href="https://wa.me/6282298587473" target="_blank"
        className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all duration-300"
      >
        <Phone className="h-7 w-7 fill-white" />
      </a>

      {/* Profile Alert Modal */}
      {showProfileAlert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowProfileAlert(false)}></div>
          <div className="bg-white rounded-[2rem] w-full max-w-md relative z-10 shadow-2xl p-8 text-center animate-in zoom-in-95 duration-300 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-yellow-600"></div>
            <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
              <User size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Lengkapi Profil</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Untuk hasil yang akurat, Bunda wajib melengkapi profil sebelum memulai skrining.
            </p>
            <Link to="/lengkapi-profil">
              <Button className="w-full h-14 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 bg-primary text-white">
                Lengkapi Sekarang
              </Button>
            </Link>
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
              <ShieldCheck size={14} /> Keamanan Data Terjamin
            </div>
          </div>
        </div>
      )}

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setSelectedService(null)}></div>
          <div className="bg-white rounded-[2rem] w-full max-w-lg relative z-10 shadow-2xl p-8 animate-in zoom-in-95 duration-300">
            <button onClick={() => setSelectedService(null)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
              <X size={24} />
            </button>
            <div className="h-20 w-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
              {(() => { const Icon = selectedService.icon; return <Icon size={40} /> })()}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{selectedService.title}</h3>
            <p className="text-gray-600 leading-relaxed mb-6">{selectedService.longDesc}</p>
            <Button onClick={() => setSelectedService(null)} className="w-full h-12 rounded-xl font-bold bg-primary text-white">Tutup Detail</Button>
          </div>
        </div>
      )}
    </div>
  );
}
