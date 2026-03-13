import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { CountUp } from "@/components/ui/count-up";

export const StatCard = ({ title, value, desc, icon: Icon, color, bg, border }) => {
  return (
    <Card className={`shadow-sm border-l-4 ${border} hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden group`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
            <h3 className="text-4xl font-black text-gray-800 tracking-tight">
              <CountUp end={value} />
            </h3>
          </div>
          <div className={`h-14 w-14 ${bg} rounded-[1.25rem] flex items-center justify-center group-hover:scale-110 transition-transform`}>
            <Icon className={`h-7 w-7 ${color}`} />
          </div>
        </div>
        <div className="mt-6 flex items-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          <Activity className="h-3.5 w-3.5 mr-2 text-primary" />
          <span>{desc}</span>
        </div>
      </CardContent>
    </Card>
  );
};
