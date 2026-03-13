import React, { useEffect, useState } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, AlertTriangle, FileText, Activity, Calendar, ChevronRight, Phone, Check, Stethoscope } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend, LineChart, Line, BarChart, Bar } from 'recharts';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { dashboardService } from "../../services/dashboard.service";
import { formatKategori, getStatusColor } from "../../lib/utils";

const CountUp = ({ end, duration = 1500 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutQuad = (t) => t * (2 - t);
      const currentCount = Math.floor(easeOutQuad(progress) * end);

      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <>{count}</>;
};

export default function NakesDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [data, setData] = useState({
    stats: { totalPasien: 0, totalScreeningMonth: 0, totalHighRisk: 0, totalQ10Risk: 0 },
    recentActivity: [],
    riskDistribution: [],
    statusDistribution: [],
    trends: [],
    scoreTrend: [],
    demographics: []
  });
  const [loading, setLoading] = useState(true);
  const [isInitialMount, setIsInitialMount] = useState(true);
  const [filterPeriod, setFilterPeriod] = useState('7days');

  useEffect(() => {
    const fetchData = async () => {
      if (isInitialMount) setLoading(true);

      try {
        const result = await dashboardService.getStats(filterPeriod);
        setData(result);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        toast.error("Gagal memuat data statistik");
      } finally {
        if (isInitialMount) {
          setTimeout(() => {
            setLoading(false);
            setIsInitialMount(false);
          }, 800);
        }
      }
    };
    fetchData();
  }, [filterPeriod, isInitialMount]);

  // Skeleton Components
  const StatSkeleton = () => (
    <Card className="shadow-sm border-l-4 border-gray-100 animate-pulse">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-8 w-16 bg-gray-300 rounded"></div>
          </div>
          <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
        </div>
        <div className="mt-4 h-4 w-32 bg-gray-100 rounded"></div>
      </CardContent>
    </Card>
  );

  const ChartSkeleton = () => (
    <Card className="shadow-lg border-primary/10 animate-pulse">
      <CardHeader className="space-y-2">
        <div className="h-6 w-48 bg-gray-200 rounded"></div>
        <div className="h-4 w-64 bg-gray-100 rounded"></div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full bg-gray-50 rounded-lg"></div>
      </CardContent>
    </Card>
  );

  const ActivitySkeleton = () => (
    <Card className="shadow-lg border-primary/10 animate-pulse">
      <CardHeader className="space-y-2">
        <div className="h-6 w-32 bg-gray-200 rounded"></div>
        <div className="h-4 w-48 bg-gray-100 rounded"></div>
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 w-full bg-gray-50 rounded-lg border border-gray-100"></div>
        ))}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <DashboardLayout title="Dashboard Monitoring" role={user.role === 'superadmin' ? "Super Admin" : "Tenaga Kesehatan"}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatSkeleton /><StatSkeleton /><StatSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ChartSkeleton /><ChartSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ActivitySkeleton />
        </div>
      </DashboardLayout>
    );
  }

  const statusDist = data.statusDistribution || [];
  const getStatusCount = (status) => statusDist.find(i => i.status_penanganan === status)?.count || 0;

  const belumDitangani = getStatusCount('Belum Ditangani');
  const sudahDihubungi = getStatusCount('Sudah Dihubungi');
  const rujukanMedis = getStatusCount('Rujukan Medis');
  const selesai = getStatusCount('Selesai');

  const pieData = (data.riskDistribution || []).map(item => ({
    name: formatKategori(item.kategori),
    value: parseInt(item.count)
  }));

  const statsCards = [
    { title: "Total Pasien", value: data.stats.totalPasien, desc: "Pasien terdaftar", icon: Users, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
    { title: "Perlu Perhatian", value: data.stats.totalHighRisk, desc: "Skor Tinggi / Risiko Depresi", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
    { title: "Skrining Bulan Ini", value: data.stats.totalScreeningMonth, desc: "Total survei 30 hari terakhir", icon: FileText, color: "text-green-600", bg: "bg-green-50", border: "border-green-100" }
  ];

  const timeAgo = (dateString) => {
    const diff = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (diff < 60) return `${diff} detik lalu`;
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} hari lalu`;
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const getSolidColor = (kategori) => {
    const formatted = formatKategori(kategori);
    if (formatted === 'Tidak Ada Gejala Depresi') return 'bg-green-600';
    if (formatted === 'Perlu Skrining Ulang') return 'bg-yellow-500';
    return 'bg-red-600';
  };

  return (
    <DashboardLayout title="Dashboard Monitoring" role={user.role === 'superadmin' ? "Super Admin" : "Tenaga Kesehatan"}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statsCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className={`shadow-sm border-l-4 ${stat.border} hover:shadow-md transition-shadow`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1"><CountUp end={stat.value} /></h3>
                  </div>
                  <div className={`h-12 w-12 ${stat.bg} rounded-full flex items-center justify-center`}><Icon className={`h-6 w-6 ${stat.color}`} /></div>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-500"><Activity className="h-4 w-4 mr-1" /><span>{stat.desc}</span></div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="shadow-lg border-primary/10 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Tren Aktivitas Skrining</CardTitle>
              <CardDescription>Aktivitas pengisian kuesioner</CardDescription>
            </div>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              {['7days', '30days', '3months'].map(p => (
                <button
                  key={p}
                  onClick={() => setFilterPeriod(p)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${filterPeriod === p ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}
                >
                  {p === '7days' ? '7 Hari' : p === '30days' ? '30 Hari' : '3 Bulan'}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.trends}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={str => new Date(str).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" name="Jumlah" stroke="#3B82F6" fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-primary/10">
          <CardHeader>
            <CardTitle>Distribusi Risiko Pasien</CardTitle>
            <CardDescription>Persentase kategori hasil skrining</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%" cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.name.includes('Tidak Ada') ? '#10B981' : entry.name.includes('Ulang') ? '#F59E0B' : '#EF4444'} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="shadow-lg border-primary/10 overflow-hidden">
          <CardHeader>
            <CardTitle>Tren Skor Rata-rata</CardTitle>
            <CardDescription>Rerata skor EPDS harian</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.scoreTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={str => new Date(str).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  />
                  <YAxis domain={[0, 30]} />
                  <Tooltip
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Line type="monotone" dataKey="avg_score" name="Skor Rata-rata" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 4, fill: '#8B5CF6' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-primary/10 overflow-hidden">
          <CardHeader>
            <CardTitle>Analisis Risiko per Kelompok</CardTitle>
            <CardDescription>Perbandingan risiko berdasarkan kategori pasien</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.demographics}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="group_name" />
                  <YAxis />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Legend />
                  <Bar dataKey="risk_count" name="Terindikasi Depresi" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="total_count" name="Total Pasien" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <Card className="md:col-span-2 shadow-lg border-primary/10">
          <CardHeader>
            <CardTitle>Status Penanganan Kasus</CardTitle>
            <CardDescription>Monitoring tindak lanjut pasien skor tinggi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Belum Ditangani', count: belumDitangani, color: 'red', icon: AlertTriangle },
                { label: 'Sudah Dihubungi', count: sudahDihubungi, color: 'blue', icon: Phone },
                { label: 'Rujukan Medis', count: rujukanMedis, color: 'amber', icon: Stethoscope },
                { label: 'Selesai', count: selesai, color: 'green', icon: Check }
              ].map((item, idx) => (
                <div key={idx} className={`p-4 rounded-xl bg-${item.color}-50 border border-${item.color}-100 text-center`}>
                  <div className={`h-10 w-10 bg-${item.color}-100 text-${item.color}-600 mx-auto flex items-center justify-center rounded-full mb-3`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h4 className="text-2xl font-bold">{item.count}</h4>
                  <p className={`text-xs font-bold text-${item.color}-600 mt-1 uppercase tracking-tight`}>{item.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-l-4 border-l-red-600 bg-red-50/50">
          <CardHeader>
            <div className="flex items-center gap-2 text-red-700 mb-2">
              <AlertTriangle className="h-6 w-6 animate-pulse" />
              <span className="font-bold uppercase text-sm">Peringatan Kritis</span>
            </div>
            <CardTitle>Keinginan Bunuh Diri (Q10)</CardTitle>
            <CardDescription className="text-red-800/80">Pasien menjawab positif pada kuesioner ke-10</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-4">
            <div className="text-6xl font-black text-red-600 mb-2">{data.stats.totalQ10Risk || 0}</div>
            <Button variant="destructive" className="w-full mt-4" onClick={() => navigate('/nakes/skrining')}>Lihat Daftar Pasien</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg border-primary/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>5 Hasil skrining terakhir</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/nakes/skrining')}>Lihat Semua <ChevronRight className="h-4 w-4" /></Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.recentActivity.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-white transition-all group">
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-white ${getSolidColor(item.kategori)}`}>
                  {item.total_score}
                </div>
                <div>
                  <h4 className="font-bold group-hover:text-primary">{item.nama_lengkap}</h4>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />{timeAgo(item.waktu_skrining)}
                  </p>
                </div>
              </div>
              <Badge className={getStatusColor(item.kategori)}>{formatKategori(item.kategori)}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
