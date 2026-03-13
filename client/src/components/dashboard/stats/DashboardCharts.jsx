import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from 'recharts';
import { formatKategori } from "@/lib/utils";

export const ScreeningTrendChart = ({ data, period, setPeriod }) => {
  return (
    <Card className="shadow-xl rounded-[2.5rem] border-none overflow-hidden bg-white/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between px-8 pt-8 pb-4">
        <div>
          <CardTitle className="text-xl font-black text-gray-800">Tren Skrining</CardTitle>
          <CardDescription className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Aktivitas kuesioner harian</CardDescription>
        </div>
        <div className="flex bg-gray-100/50 p-1.5 rounded-2xl border border-gray-100 shadow-inner">
          {[
            { id: '7days', label: '7H' },
            { id: '30days', label: '30H' },
            { id: '3months', label: '3B' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`px-4 py-2 text-[10px] font-black rounded-xl transition-all ${period === p.id ? 'bg-white text-primary shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-8">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B68D3D" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#B68D3D" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F1F1" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={str => new Date(str).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="count" name="Jumlah" stroke="#B68D3D" strokeWidth={3} fill="url(#colorCount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export const RiskDistributionChart = ({ data }) => {
  const pieData = (data || []).map(item => ({
    name: formatKategori(item.kategori),
    value: parseInt(item.count)
  }));

  const COLORS = {
    'Tidak Ada': '#10B981', // Hijau
    'Perlu Skrining': '#F59E0B', // Amber
    'Terindikasi': '#EF4444' // Merah
  };

  const getColor = (name) => {
    if (name.includes('Tidak Ada')) return COLORS['Tidak Ada'];
    if (name.includes('Ulang')) return COLORS['Perlu Skrining'];
    return COLORS['Terindikasi'];
  };

  return (
    <Card className="shadow-xl rounded-[2.5rem] border-none overflow-hidden bg-white/80 backdrop-blur-sm">
      <CardHeader className="px-8 pt-8 pb-4">
        <CardTitle className="text-xl font-black text-gray-800">Distribusi Risiko</CardTitle>
        <CardDescription className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Persentase kategori kesehatan</CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-8">
        <div className="h-[300px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%" cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={getColor(entry.name)} className="hover:opacity-80 transition-opacity" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
              />
              <Legend verticalAlign="bottom" align="center" iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
