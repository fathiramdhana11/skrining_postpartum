import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import logoKlinik from "../../assets/logo_klinik.png";
import { API_URL } from "../../apiConfig";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("error") === "session_conflict") {
      const msg = "Sesi anda telah berakhir karena login di perangkat lain";
      setError(msg);
      toast.error(msg, {
        duration: 5000,
      });
    } else if (params.get("error") === "timeout") {
      const msg = "Sesi anda telah berakhir karena tidak ada aktivitas selama 30 menit. Silakan masuk kembali.";
      setError(msg);
      toast.info(msg, {
        duration: 5000,
      });
    }
  }, [location.search]);

  const savedEmail = localStorage.getItem("rememberedEmail") || "";

  const [formData, setFormData] = useState({
    email: savedEmail,
    password: "",
    rememberMe: !!savedEmail,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Email atau password salah");
      }

      if (formData.rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      toast.success(`Selamat datang, ${data.data.user.nama_lengkap}!`);

      const role = data.data.user.role;

      // Check if there's a return url
      const from = location.state?.from;

      if (from) {
        navigate(from, { replace: true });
      } else if (role === "tenagakesehatan") {
        navigate("/nakes/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 lg:p-10 animate-in fade-in zoom-in-95 duration-500">

        {/* Header */}
        <div className="text-center mb-8">
          <img src={logoKlinik} alt="Logo" className="h-16 w-16 mx-auto mb-4 object-contain" />
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Masuk Akun</h2>
          <p className="text-gray-400 text-sm mt-1">Bidan Rafika Putri Sahabat Keluarga</p>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-600 mb-6 animate-in shake duration-500">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-700 ml-1">Email</Label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary h-5 w-5 transition-colors" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nama@email.com"
                className="pl-12 h-12 rounded-xl border-gray-200 bg-gray-50/30 focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-base"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" name="password" className="text-sm font-semibold text-gray-700 ml-1">Kata Sandi</Label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary h-5 w-5 transition-colors" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan Kata Sandi"
                className="pl-12 pr-12 h-12 rounded-xl border-gray-200 bg-gray-50/30 focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-base"
                required
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2 px-1">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20 accent-primary cursor-pointer"
            />
            <label htmlFor="rememberMe" className="text-sm font-medium text-gray-500 cursor-pointer select-none">
              Ingat Saya
            </label>
          </div>

          <Button type="submit" className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all mt-2" disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Mencoba Masuk...
              </div>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Masuk Sekarang <ArrowRight className="h-5 w-5" />
              </span>
            )}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Belum punya akun?{" "}
            <Link to="/register" className="text-primary font-bold hover:underline">
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
