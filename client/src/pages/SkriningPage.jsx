import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2, ChevronRight, ChevronLeft, HeartPulse, ShieldCheck,
  Stethoscope, Info, AlertTriangle, CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import { API_URL } from "../apiConfig";

const questions = [
  {
    id: 1,
    question: "Saya dapat tertawa dan melihat segi kelucuan hal-hal tertentu:",
    options: [
      { text: "Seperti biasanya", score: 0 },
      { text: "Sekarang tidak terlalu sering", score: 1 },
      { text: "Sekarang agak jarang", score: 2 },
      { text: "Tidak sama sekali", score: 3 }
    ]
  },
  {
    id: 2,
    question: "Saya menanti-nanti untuk melakukan sesuatu dengan penuh harapan:",
    options: [
      { text: "Sebanyak sebelumnya", score: 0 },
      { text: "Agak sedikit kurang dibandingkan dengan sebelumnya", score: 1 },
      { text: "Kurang dibandingkan dengan sebelumnya", score: 2 },
      { text: "Tidak pernah sama sekali", score: 3 }
    ]
  },
  {
    id: 3,
    question: "Saya menyalahkan diri jika ada sesuatu yang tidak berjalan dengan baik:",
    options: [
      { text: "Ya, hampir selalu", score: 3 },
      { text: "Ya, kadang-kadang", score: 2 },
      { text: "Tidak terlalu sering", score: 1 },
      { text: "Tidak, tidak pernah", score: 0 }
    ]
  },
  {
    id: 4,
    question: "Saya merasa cemas atau merasa khawatir tanpa alasan:",
    options: [
      { text: "Tidak pernah sama sekali", score: 0 },
      { text: "Hampir tidak pernah", score: 1 },
      { text: "Ya, kadang-kadang", score: 2 },
      { text: "Ya, sering sekali", score: 3 }
    ]
  },
  {
    id: 5,
    question: "Saya merasa takut atau panik tanpa alasan:",
    options: [
      { text: "Ya, sering sekali", score: 3 },
      { text: "Ya, kadang-kadang", score: 2 },
      { text: "Tidak terlalu sering", score: 1 },
      { text: "Tidak pernah sama sekali", score: 0 }
    ]
  },
  {
    id: 6,
    question: "Banyak hal menjadi beban untuk saya:",
    options: [
      { text: "Ya, seringkali saya sama sekali tidak dapat mengatasinya", score: 3 },
      { text: "Ya, kadang saya tidak dapat mengatasi seperti biasanya", score: 2 },
      { text: "Tidak, biasanya saya dapat mengatasinya dengan baik", score: 1 },
      { text: "Tidak, saya dapat mengatasinya dengan baik seperti biasanya", score: 0 }
    ]
  },
  {
    id: 7,
    question: "Saya merasa begitu sedih sampai sulit tidur:",
    options: [
      { text: "Ya, hampir selalu", score: 3 },
      { text: "Ya, kadang-kadang", score: 2 },
      { text: "Tidak, tidak sering", score: 1 },
      { text: "Tidak, tidak pernah", score: 0 }
    ]
  },
  {
    id: 8,
    question: "Saya merasa sedih atau susah:",
    options: [
      { text: "Ya, hampir selalu", score: 3 },
      { text: "Ya, sering", score: 2 },
      { text: "Jarang", score: 1 },
      { text: "Tidak pernah", score: 0 }
    ]
  },
  {
    id: 9,
    question: "Saya merasa sangat sedih sehingga saya menangis:",
    options: [
      { text: "Ya, hampir selalu", score: 3 },
      { text: "Ya, sering", score: 2 },
      { text: "Hanya sekali-kali", score: 1 },
      { text: "Tidak pernah", score: 0 }
    ]
  },
  {
    id: 10,
    question: "Pikiran untuk menyakiti diri saya sendiri sering muncul:",
    options: [
      { text: "Ya, agak sering", score: 3 },
      { text: "Kadang-kadang", score: 2 },
      { text: "Hampir tidak pernah", score: 1 },
      { text: "Tidak pernah", score: 0 }
    ]
  }
];

export default function SkriningPage() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Fetch user profile for risk analysis
    const fetchProfile = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.id) {
        try {
          const res = await fetch(`${API_URL}/api/users/${user.id}`);
          if (res.ok) {
            const data = await res.json();
            setUserProfile(data);
          }
        } catch (e) {
          console.error("Failed to fetch profile", e);
        }
      }
    };
    fetchProfile();
  }, []);

  const handleSelect = (score) => {
    setAnswers({ ...answers, [currentQuestion]: score });
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsFinished(true);
      const score = Object.values(answers).reduce((acc, curr) => acc + curr, 0);
      const resultData = getResult(score, answers);
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (user.id) {
        try {
          await fetch(`${API_URL}/api/screenings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: user.id,
              total_score: score,
              kategori: resultData.status,
              jawaban_json: answers
            })
          });
          toast.success("Data berhasil disimpan", {
            description: "Hasil skrining Anda aman di database."
          });
        } catch (error) {
          console.error("Gagal menyimpan hasil skrining", error);
          toast.error("Gagal menyimpan hasil", { description: "Namun hasil tetap dapat dilihat di layar." });
        }
      } else {
        toast.success("Skrining selesai!", { description: "Silakan login untuk menyimpan histori." });
      }
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const getTotalScore = () => {
    return Object.values(answers).reduce((acc, curr) => acc + curr, 0);
  };

  const getResult = (score, answers) => {
    const q10Score = answers[9];

    // Kemenkes Standard & User Req:
    // 1. Score >= 13 OR Q10 Answer == "Ya, agak sering" (Score 3) -> High Risk
    if (score >= 13 || q10Score === 3) {
      return {
        status: "Terindikasi Gejala Depresi",
        color: "text-red-700",
        bg: "bg-red-50",
        border: 'border-red-200',
        desc: "Skor menunjukkan indikasi gejala depresi. Sangat disarankan untuk segera melakukan Pemeriksaan Kesehatan Jiwa dan Konseling dengan tenaga profesional (Bidan/Dokter/Psikolog)."
      };
    }

    // 2. Score 9 - 12 -> Medium Risk (Repeat Screening)
    if (score >= 9) {
      return {
        status: "Perlu Skrining Ulang",
        color: "text-yellow-700",
        bg: "bg-yellow-50",
        border: 'border-yellow-200',
        desc: "Skor menunjukkan kemungkinan gejala depresi. Disarankan untuk melakukan skrining ulang pada kunjungan ANC/Nifas berikutnya (1-2 minggu lagi) untuk memantau perkembangan kondisi."
      };
    }

    // 3. Score < 9 -> No Symptoms (0-8)
    return {
      status: "Tidak Ada Gejala Depresi",
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      border: 'border-emerald-200',
      desc: "Kondisi kesehatan jiwa saat ini baik. Lanjutkan edukasi kesehatan jiwa dan tetap jaga pola hidup sehat ya."
    };
  };

  const getRiskAnalysis = () => {
    if (!userProfile) return [];
    const risks = [];
    const p = userProfile;

    // 1. Usia
    if (p.tanggal_lahir) {
      const birthDate = new Date(p.tanggal_lahir);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      if (age < 21) risks.push({ label: "Usia < 21 Tahun", status: "Berisiko", color: "text-red-600", bg: "bg-red-50" });
      else if (age > 35) risks.push({ label: "Usia > 35 Tahun", status: "Berisiko", color: "text-red-600", bg: "bg-red-50" });
      else risks.push({ label: `Usia ${age} Tahun`, status: "Tidak Berisiko", color: "text-emerald-600", bg: "bg-emerald-50" });
    }

    // 2. Pendidikan
    const pend = p.pendidikan?.toLowerCase() || '';
    if (pend.includes('tidak') || pend.includes('sd') || pend.includes('smp'))
      risks.push({ label: `Pendidikan: ${p.pendidikan}`, status: "Berisiko", color: "text-red-600", bg: "bg-red-50" });
    else if (pend)
      risks.push({ label: `Pendidikan: ${p.pendidikan}`, status: "Tidak Berisiko", color: "text-emerald-600", bg: "bg-emerald-50" });

    // 3. Status Pernikahan
    const stat = p.status_pernikahan?.toLowerCase() || '';
    if (stat.includes('tidak') || stat.includes('cerai'))
      risks.push({ label: `Status: ${p.status_pernikahan}`, status: "Berisiko", color: "text-red-600", bg: "bg-red-50" });

    // 4. Jumlah Anak
    let ja = p.jumlah_anak?.toString().toLowerCase() || '';
    if (ja === 'lebih dari 3' || parseInt(ja) > 3)
      risks.push({ label: `Jumlah Anak: ${p.jumlah_anak}`, status: "Berisiko", color: "text-red-600", bg: "bg-red-50" });
    else if (ja)
      risks.push({ label: `Jumlah Anak: ${p.jumlah_anak}`, status: "Tidak Berisiko", color: "text-emerald-600", bg: "bg-emerald-50" });

    // 5. Riwayat Kes Jiwa
    if (p.riwayat_kesehatan_jiwa === "Pernah")
      risks.push({ label: "Riwayat Masalah Kesehatan Jiwa: Pernah", status: "Berisiko", color: "text-red-600", bg: "bg-red-50" });
    else
      risks.push({ label: "Riwayat Masalah Kesehatan Jiwa: Tidak Pernah", status: "Tidak Berisiko", color: "text-emerald-600", bg: "bg-emerald-50" });

    // 6. Komplikasi
    if (p.komplikasi_hamil_ini && p.komplikasi_hamil_ini !== "Tidak Ada")
      risks.push({ label: `Komplikasi Kehamilan Saat Ini: ${p.komplikasi_hamil_ini}`, status: "Berisiko", color: "text-red-600", bg: "bg-red-50" });

    if (p.komplikasi_persalinan_lalu && p.komplikasi_persalinan_lalu !== "Tidak Ada" && !p.komplikasi_persalinan_lalu.includes("Kehamilan Pertama"))
      risks.push({ label: `Komplikasi Persalinan Sebelumnya: ${p.komplikasi_persalinan_lalu}`, status: "Berisiko", color: "text-red-600", bg: "bg-red-50" });

    return risks;
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const result = isFinished ? getResult(getTotalScore(), answers) : null;
  const riskFactors = isFinished ? getRiskAnalysis() : [];

  return (
    <div className="min-h-screen w-full bg-[#FCFAF7] flex flex-col font-sans relative overflow-x-hidden text-[#423D33]">
      {/* Decorative Background - Warm Pattern & Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Grid Pattern (Kotak-kotak) - Warm Theme */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(182,141,61,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(182,141,61,0.08)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-primary/10 to-amber-100/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-orange-50/30 to-primary/5 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-amber-50/40 rounded-full blur-[80px]" />
      </div>

      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 md:p-6 pb-20 pt-32 md:pt-40 relative z-10">
        <div className="w-full max-w-2xl">
          {!isFinished ? (
            <Card className="bg-white/90 backdrop-blur-sm shadow-sm border border-[#EBE5DA] rounded-[2rem] overflow-hidden">
              {/* Question View (Same as before) */}
              <div className="px-8 pt-8 pb-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20 shrink-0">
                    <Stethoscope size={20} />
                  </div>
                  <div>
                    <h1 className="text-lg md:text-xl font-bold text-[#423D33] leading-tight">
                      Skrining Kesehatan Jiwa
                    </h1>
                  </div>
                  <div className="ml-auto text-right">
                    <span className="text-xl font-bold text-primary">
                      {String(currentQuestion + 1).padStart(2, '0')}
                    </span>
                    <span className="text-xs font-bold text-[#8C8576] block">
                      / {questions.length}
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full bg-[#EBE5DA] rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
                </div>
              </div>

              <CardContent className="p-8 pt-4">
                <div className="mb-8">
                  <div className="inline-block px-3 py-1 rounded-full bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider mb-3 border border-primary/10">
                    Instrumen EPDS
                  </div>
                  <h2 className="text-xl font-bold text-[#423D33] leading-relaxed">
                    {questions[currentQuestion].question}
                  </h2>
                </div>

                <RadioGroup key={currentQuestion} value={answers[currentQuestion]?.toString()} onValueChange={(val) => handleSelect(parseInt(val))} className="grid gap-3">
                  {questions[currentQuestion].options.map((option, idx) => (
                    <div key={idx} className="relative group w-full">
                      <Label htmlFor={`q${currentQuestion}-o${idx}`} className="flex w-full items-center p-4 rounded-2xl border border-[#EBE5DA] bg-white hover:border-primary/30 hover:bg-[#FCFAF7] cursor-pointer transition-all duration-200 peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:shadow-sm">
                        <div className={`h-5 w-5 rounded-full border mr-4 flex items-center justify-center shrink-0 transition-all duration-200 ${answers[currentQuestion] === option.score ? 'border-primary bg-primary text-white' : 'border-[#CCC5B9] text-transparent'}`}>
                          <CheckCircle2 size={12} strokeWidth={4} />
                        </div>
                        <span className={`text-base font-medium transition-colors duration-200 ${answers[currentQuestion] === option.score ? 'text-primary font-bold' : 'text-[#5C5547]'}`}>
                          {option.text}
                        </span>
                      </Label>
                      <RadioGroupItem value={option.score.toString()} id={`q${currentQuestion}-o${idx}`} className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer" />
                    </div>
                  ))}
                </RadioGroup>

                <div className="flex justify-between items-center pt-8 mt-4 border-t border-[#F0EBE0]/50">
                  <Button variant="secondary" onClick={handlePrev} className={`bg-gray-200 text-gray-700 hover:bg-gray-300 font-bold text-sm h-11 px-6 rounded-xl ${currentQuestion === 0 ? "invisible" : ""}`}>
                    <ChevronLeft className="mr-2 h-4 w-4" /> KEMBALI
                  </Button>
                  <Button onClick={handleNext} disabled={answers[currentQuestion] === undefined} className="h-11 px-6 rounded-xl font-bold text-sm shadow-lg shadow-primary/10 bg-primary hover:bg-primary/90 text-white transition-all transform hover:-translate-y-0.5 active:translate-y-0 ml-auto">
                    {currentQuestion === questions.length - 1 ? "ANALISIS HASIL" : "SELANJUTNYA"} <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            // Result View with Integrated Risk Analysis
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border border-primary/10 rounded-[2.5rem] overflow-visible animate-in zoom-in duration-300 relative mt-16 mb-8">

              <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20">
                <div className="bg-white p-6 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#EBE5DA]">
                  <HeartPulse size={48} className={result.color} />
                </div>
              </div>

              <div className="px-8 pt-20 pb-10 text-center">
                <h3 className="text-[11px] font-bold text-[#8C8576] uppercase tracking-[0.25em] mb-4">HASIL ANALISIS EPDS</h3>

                <div className="mb-6 flex flex-col items-center justify-center">
                  <span className={`text-[100px] md:text-[120px] font-black tracking-tighter leading-none ${result.color}`}>
                    {getTotalScore()}
                  </span>
                  <span className="mt-2 text-xs font-bold text-[#8C8576] bg-[#F4F0E8] px-4 py-1.5 rounded-full">
                    Total Skor
                  </span>
                </div>

                <h2 className={`text-2xl font-bold mb-4 ${result.color}`}>
                  {result.status}
                </h2>

                <p className={`text-sm font-bold text-center px-4 leading-relaxed max-w-sm mx-auto mb-8 ${result.color}`}>
                  {result.status === "Terindikasi Gejala Depresi" ?
                    "Skor Bunda menunjukkan perlunya konsultasi lebih lanjut. Jangan khawatir, kami akan membantu Bunda melewati masa ini." :
                    result.status === "Perlu Skrining Ulang" ?
                      "Skor Bunda menunjukkan perlunya skrining ulang pada kunjungan ANC berikutnya. Tetap pantau kondisi Bunda ya." :
                      "Hasil skrining menunjukkan kondisi Bunda stabil. Tetap jaga kesehatan dan istirahat yang cukup!"
                  }
                </p>

                {/* Alert Khusus jika Pertanyaan 10 Bernilai Tinggi (Flag Bunuh Diri) */}
                {answers[9] === 3 && (
                  <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-left animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="bg-red-100 p-2 rounded-full text-red-600">
                      <AlertTriangle size={20} className="animate-pulse" />
                    </div>
                    <div>
                      <p className="font-bold text-red-900 text-sm">Risiko Menyakiti Diri Terdeteksi</p>
                      <p className="text-xs text-red-800 leading-relaxed">
                        Penting: Kami mendeteksi adanya pikiran untuk menyakiti diri sendiri. Mohon segera hubungi tenaga medis atau orang terdekat untuk bantuan.
                      </p>
                    </div>
                  </div>
                )}

                <div className={`p-6 rounded-3xl mb-8 text-left border flex items-start gap-4 ${result.bg} ${result.border}`}>
                  <div className={`mt-0.5 p-2 rounded-full bg-white border border-[#EBE5DA] shrink-0 ${result.color}`}>
                    <Info size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1.5 text-sm text-[#423D33]">Rekomendasi Tindak Lanjut</h4>
                    <p className="text-sm text-[#5C5547] leading-relaxed">
                      {result.desc}
                    </p>
                  </div>
                </div>

                {/* Risk Analysis Section */}
                {/* Risk Analysis Section */}
                <div className="text-left bg-[#FCFAF7] rounded-[1.5rem] border border-[#EBE5DA] p-6 mb-8">
                  <h4 className="text-sm font-bold text-[#423D33] uppercase tracking-wider mb-4 border-b border-[#EBE5DA] pb-3 flex items-center gap-2">
                    <AlertTriangle size={14} className="text-amber-500" /> Analisis Faktor Risiko Depresi Postpartum
                  </h4>
                  {riskFactors.filter(r => r.status === 'Berisiko').length > 0 ? (
                    <div className="space-y-3">
                      {riskFactors.filter(r => r.status === 'Berisiko').map((risk, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-xl border bg-red-50/50 border-red-100">
                          <span className="text-sm font-semibold text-[#5C5547]">{risk.label}</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-red-100 text-red-600">
                            {risk.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-emerald-100 bg-emerald-50/50">
                      <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                        <CheckCircle size={16} strokeWidth={3} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#423D33] mb-0.5">Tidak Ditemukan Faktor Risiko</p>
                        <p className="text-xs text-[#8C8576]">Berdasarkan data profil, tidak ada faktor risiko signifikan.</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <Button
                    onClick={() => navigate("/riwayat-skrining")}
                    className="w-full h-14 rounded-2xl font-bold text-base shadow-xl shadow-primary/20 bg-primary text-white hover:bg-primary/90 transition-all hover:scale-[1.01]"
                  >
                    Selesai & Lihat Riwayat
                  </Button>
                  <p className="flex items-center justify-center gap-2 text-[10px] text-[#A8A293] font-bold uppercase tracking-widest">
                    <ShieldCheck size={12} className="text-primary/60" /> Data Skrining Tersimpan dengan Aman
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
