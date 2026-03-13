import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Phone, Mail, MapPin, Clock, User, LogOut, Menu, X, Activity
} from "lucide-react";
import { toast } from "sonner";
import logoKlinik from "../assets/logo_klinik.png";

export default function Navbar({ activeSection: externalActiveSection }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(externalActiveSection || null);
  const navigate = useNavigate();
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  // Auth State
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    // Sync state if localStorage changes (rare in SPA but good for consistency)
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem("user") || "null"));
      setIsLoggedIn(!!localStorage.getItem("token"));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const isNakes = user?.role === "tenagakesehatan" || user?.role === "superadmin";
  const currentHour = new Date().getHours();
  const isClinicOpen = currentHour >= 8 && currentHour < 20;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("profileData");
    toast.success("Berhasil keluar. Sampai jumpa lagi, Bunda!");
    setTimeout(() => {
      if (isLandingPage) {
        window.location.reload();
      } else {
        navigate("/");
        window.location.reload();
      }
    }, 1000);
  };

  const navItems = [
    { name: "Beranda", id: "beranda" },
    { name: "Tentang", id: "tentang" },
    { name: "Layanan", id: "layanan" },
    { name: "Skrining", id: "skrining" },
    { name: "Bidan", id: "bidan" },
    { name: "Testimoni", id: "testimoni" },
    { name: "FAQ", id: "faq" }
  ];

  const handleNavClick = (e, id) => {
    if (isLandingPage) {
      e.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    } else {
      // If not on landing page, navigate to landing page with hash
      navigate(`/#${id}`);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 shadow-sm transition-all duration-300">
      {/* 1. TOP BAR - MEDICAL BLUE ACCENT */}
      <div className="w-full bg-gradient-to-r from-primary to-yellow-600 text-white py-2 text-[10px] md:text-xs hidden md:block border-b border-white/10 relative overflow-hidden transition-all duration-300">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/medical-icons.png')] opacity-10"></div>
        <div className="container mx-auto px-6 flex justify-between items-center relative z-10">
          <div className="flex gap-6">
            <span className="flex items-center gap-1.5 font-medium hover:text-white/80 transition-colors cursor-pointer">
              <Phone className="h-3 w-3" /> +62 822-9858-7473
            </span>
            <span className="flex items-center gap-1.5 font-medium hover:text-white/80 transition-colors cursor-pointer">
              <Mail className="h-3 w-3" /> bidanrafikaputri2020@gmail.com
            </span>
          </div>
          <div className="flex gap-4 font-medium">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-white/90">
                <Clock className="h-3 w-3" /> 08.00 - 20.00 WIB
              </span>
              <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-sm ${isClinicOpen ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                <div className={`w-1.5 h-1.5 rounded-full bg-white ${isClinicOpen ? 'animate-pulse' : ''}`}></div>
                {isClinicOpen ? 'Buka' : 'Tutup'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. NAVBAR MAIN - GLASSMORPHISM */}
      <header className="w-full bg-white/80 backdrop-blur-lg border-b border-gray-100 transition-all duration-300">
        <div className="container mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="h-10 w-10 md:h-12 md:w-12 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
              <img src={logoKlinik} alt="Logo PMB Rafika Putri" className="h-full w-full object-contain" />
            </div>
            <div className="leading-tight">
              <h1 className="font-heading font-bold text-lg md:text-xl text-gray-900 tracking-tight group-hover:text-primary transition-colors">Bidan Rafika Putri</h1>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest hidden sm:block">Sahabat Keluarga</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 font-semibold text-base text-gray-700">
            {navItems.map((item) => {
              const isActive = isLandingPage && activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={isLandingPage ? `#${item.id}` : `/#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`relative py-2 group transition-colors ${isActive ? 'text-primary' : 'hover:text-primary'}`}
                >
                  {item.name}
                  <span className={`absolute inset-x-0 bottom-0 h-0.5 bg-primary transform transition-transform duration-300 origin-left ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            {/* Desktop Auth Button */}
            <div className="hidden md:flex items-center gap-4">
              {!isLoggedIn ? (
                <Link to="/login">
                  <Button className="font-heading font-bold shadow-lg shadow-primary/20 px-8 h-11 rounded-full hover:scale-105 transition-transform text-base">Masuk</Button>
                </Link>
              ) : isNakes ? (
                <Link to="/nakes/dashboard">
                  <Button className="font-heading font-bold shadow-lg shadow-primary/20 px-8 h-11 rounded-full hover:scale-105 transition-transform text-base">Dashboard Nakes</Button>
                </Link>
              ) : (
                <div className="flex items-center gap-6 pl-6 border-l border-gray-100">
                  <div className="flex items-center gap-3">
                    <Link to="/lengkapi-profil">
                      <Button className={`font-bold rounded-full px-5 h-10 transition-all flex items-center gap-2 border-0 ${location.pathname === '/lengkapi-profil' ? 'bg-primary text-white' : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'}`}>
                        <User size={16} />
                        Profil
                      </Button>
                    </Link>
                    <Button
                      onClick={handleLogout}
                      className="font-bold bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-full px-5 h-10 transition-all flex items-center gap-2 border border-red-100 shadow-sm"
                    >
                      <LogOut size={16} />
                      Keluar
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-gray-600 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 p-6 flex flex-col gap-4 animate-in slide-in-from-top-5 duration-300">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={isLandingPage ? `#${item.id}` : `/#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className="p-3 text-lg font-medium text-gray-700 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
              >
                {item.name}
              </a>
            ))}
            <div className="h-px bg-gray-100 my-2"></div>
            {!isLoggedIn ? (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full font-heading font-bold h-12 text-lg rounded-xl shadow-lg shadow-primary/20">Masuk</Button>
              </Link>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to="/lengkapi-profil" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className={`w-full font-heading font-bold h-12 text-lg rounded-xl flex items-center justify-center gap-3 ${location.pathname === '/lengkapi-profil' ? 'bg-primary text-white border-0' : 'bg-primary/10 text-primary border-0'}`}>
                    <User size={20} />
                    Profil Saya
                  </Button>
                </Link>
                <Button
                  onClick={handleLogout}
                  className="w-full font-heading font-bold h-12 text-lg rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center gap-3 shadow-sm"
                >
                  <LogOut size={20} />
                  Keluar
                </Button>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}
