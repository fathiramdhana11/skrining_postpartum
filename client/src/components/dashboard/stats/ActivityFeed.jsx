import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronRight } from "lucide-react";
import { formatKategori, getStatusColor } from "@/lib/utils";

export const ActivityFeed = ({ activities, onAll, timeAgo }) => {
  return (
    <Card className="shadow-xl rounded-[2.5rem] border-none overflow-hidden bg-white/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between px-8 pt-8 pb-4">
        <div>
          <CardTitle className="text-xl font-black text-gray-800 tracking-tight">Aktivitas Terkini</CardTitle>
          <CardDescription className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">5 Hasil survei terbaru Bunda</CardDescription>
        </div>
        <Button
          variant="outline"
          onClick={onAll}
          className="rounded-[1.25rem] h-10 px-8 border-primary/20 text-primary font-bold hover:bg-primary/5 shadow-sm transition-all"
        >
          Lihat Semua <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1" />
        </Button>
      </CardHeader>
      <CardContent className="px-8 pb-10 space-y-4">
        {activities.length > 0 ? activities.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-[1.75rem] shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 group">
            <div className="flex items-center gap-5">
              <div className={`h-14 w-14 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-lg ${getStatusColor(item.kategori)} transition-transform group-hover:scale-110`}>
                {item.total_score}
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-gray-800 group-hover:text-primary transition-colors text-lg tracking-tight">{item.nama_lengkap}</h4>
                <div className="flex items-center gap-3 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  {timeAgo(item.waktu_skrining)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={`rounded-xl px-4 py-1.5 text-[10px] font-black uppercase tracking-widest ${getStatusColor(item.kategori)} border-none shadow-sm`}>
                {formatKategori(item.kategori)}
              </Badge>
              <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                <ChevronRight size={20} />
              </div>
            </div>
          </div>
        )) : (
          <div className="h-32 flex items-center justify-center text-gray-300 font-bold italic bg-gray-50/50 rounded-[1.75rem] border-dashed border-2 border-gray-100">
            Belum ada aktivitas skrining terbaru
          </div>
        )}
      </CardContent>
    </Card>
  );
};
