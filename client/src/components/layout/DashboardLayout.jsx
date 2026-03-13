import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, FileText, User, Users, Menu, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logoKlinik from "../../assets/logo_klinik.png";
import { useState } from "react";
import { toast } from "sonner";

export default function DashboardLayout({ children, title, role }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("profileData");
    toast.success("Berhasil keluar. Sampai jumpa lagi!");
    navigate("/login");
  };

  const nakesMenus = [
    { label: "Dashboard", href: "/nakes/dashboard", icon: LayoutDashboard },
    { label: "Data Pasien", href: "/nakes/pasien", icon: Users },
    { label: "Daftar Skrining", href: "/nakes/skrining", icon: FileText },
    { label: "Tenaga Kesehatan", href: "/nakes/tim", icon: ShieldCheck },
  ];

  const pasienMenus = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Lengkapi Profil", href: "/dashboard/lengkapi-profil", icon: User },
  ];

  const menus = (role === "Tenaga Kesehatan" || role === "Super Admin") ? nakesMenus : pasienMenus;
  const isNakes = role === "Tenaga Kesehatan" || role === "Super Admin";

  return (
    <div className="flex min-h-screen bg-[#FDFBF7] font-sans selection:bg-primary/20">
      {/* Sidebar - Fixed Left - ONLY FOR NAKES */}
      {isNakes && (
        <aside className={cn(
          "flex flex-col border-r border-primary/10 bg-white/80 backdrop-blur-xl min-h-screen fixed left-0 top-0 bottom-0 z-20 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] transition-all duration-300 overflow-hidden",
          isSidebarOpen ? "w-64" : "w-20"
        )}>
          {/* Sidebar branding: Full or Logo Only */}
          <div className={cn("h-20 flex items-center border-b border-primary/10 bg-gradient-to-r from-white to-primary/5 transition-all select-none", isSidebarOpen ? "px-4 gap-3" : "justify-center px-0")}>
            <img src={logoKlinik} alt="Logo" className={cn("object-contain drop-shadow-sm transition-all", isSidebarOpen ? "h-12 w-12" : "h-10 w-10")} />

            <div className={cn("flex flex-col justify-center transition-all duration-300 origin-left", !isSidebarOpen && "w-0 opacity-0 overflow-hidden scale-0")}>
              <span className="font-heading font-bold text-sm text-gray-800 leading-tight whitespace-nowrap">Bidan Rafika Putri</span>
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase whitespace-nowrap">Sahabat Keluarga</span>
            </div>
          </div>

          <nav className="flex-1 p-2 md:p-4 space-y-2 overflow-y-auto h-[calc(100vh-10rem)]">
            {menus.map((menu) => {
              const Icon = menu.icon;
              const isActive = location.pathname === menu.href;

              return (
                <Link key={menu.href} to={menu.href} title={!isSidebarOpen ? menu.label : ""}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full mb-1 font-medium text-base h-11 transition-all duration-200",
                      isSidebarOpen ? "justify-start gap-3" : "justify-center px-0",
                      isActive
                        ? "bg-primary/10 text-primary hover:bg-primary/15 shadow-sm border border-primary/10"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                    )}
                  >
                    <Icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-primary" : "text-muted-foreground/70 group-hover:text-primary")} />
                    <span className={cn("transition-all duration-300 origin-left truncate", !isSidebarOpen && "w-0 opacity-0 hidden")}>
                      {menu.label}
                    </span>
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* User Profile Footer */}
          <div className="p-4 border-t border-primary/10 bg-gradient-to-b from-transparent to-primary/5 absolute bottom-0 left-0 w-full transition-all">
            <Button
              variant="outline"
              className={cn("w-full text-destructive hover:text-white hover:bg-destructive border-destructive/20 hover:border-destructive transition-all shadow-sm", !isSidebarOpen && "px-0 justify-center border-0 bg-transparent hover:bg-destructive/10")}
              onClick={handleLogout}
              title={!isSidebarOpen ? "Keluar" : ""}
            >
              <LogOut className={cn("h-4 w-4", isSidebarOpen ? "mr-2" : "")} />
              <span className={cn("transition-all duration-300", !isSidebarOpen && "hidden")}>Keluar</span>
            </Button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className={cn(
        "flex-1 bg-[#FDFBF7] min-h-screen flex flex-col relative transition-all duration-300",
        isNakes ? (isSidebarOpen ? "md:ml-64" : "md:ml-20") : "md:ml-0"
      )}>
        {/* Background Pattern Overlay matching Landing Page */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/medical-icons.png')] opacity-[0.03] pointer-events-none fixed z-0"></div>

        {/* Header Sticky */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-primary/10 h-20 flex items-center justify-between px-6 shadow-sm transition-all duration-300">
          {/* Left Header: Title / Breadcrumb / Pasien Nav */}
          <div className="flex items-center gap-4 md:gap-8 relative z-10">
            <div className="flex items-center gap-3">
              {/* Sidebar Toggle for Nakes */}
              {isNakes && (
                <Button variant="ghost" size="icon" className="mr-2 text-muted-foreground hover:text-primary" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                  <Menu className="h-6 w-6" />
                </Button>
              )}

              {/* Logo khusus Pasien jika tidak punya sidebar */}
              {!isNakes && (
                <div className="h-9 w-9 bg-gradient-to-br from-primary to-yellow-600 rounded-lg flex items-center justify-center text-white font-bold text-lg md:flex hidden shadow-md">SP</div>
              )}

              <h2 className="text-xl font-heading font-bold text-gray-800 tracking-tight">{title}</h2>
            </div>

            {/* ... Rest of Nav ... */}
            {role === "Pasien" && (
              <nav className="hidden md:flex items-center gap-1">
                {pasienMenus.map(menu => (
                  <Link key={menu.href} to={menu.href}>
                    <Button variant="ghost" className={cn("text-muted-foreground font-medium hover:text-primary transition-colors", location.pathname === menu.href && "text-primary bg-primary/10 font-bold")}>
                      {menu.label}
                    </Button>
                  </Link>
                ))}
              </nav>
            )}
          </div>

          {/* Right Header: Actions */}
          <div className="flex items-center gap-4 relative z-10">


            <div className="flex items-center gap-3 pl-4 border-l border-primary/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none text-gray-800">{user.nama_lengkap}</p>
                <p className="text-xs text-primary font-medium capitalize mt-0.5">{role}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-yellow-600 flex items-center justify-center text-white font-bold ring-2 ring-white shadow-md cursor-pointer hover:scale-105 transition-transform">
                {user.nama_lengkap ? user.nama_lengkap.charAt(0) : "U"}
              </div>

              {/* Logout Button di Header Khusus Pasien (karena ga ada sidebar) */}
              {!isNakes && (
                <Button variant="ghost" size="icon" onClick={handleLogout} title="Keluar" className="text-gray-400 hover:text-destructive hover:bg-destructive/10 transition-colors">
                  <LogOut className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full flex-1 relative z-0">
          {children}
        </div>
      </main>
    </div>
  );
}
