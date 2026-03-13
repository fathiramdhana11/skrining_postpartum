import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const StatSkeleton = () => (
  <Card className="rounded-[2.5rem] border-none shadow-xl overflow-hidden bg-white/80 animate-pulse">
    <CardContent className="p-8">
      <div className="flex items-center justify-between gap-6">
        <div className="space-y-4 flex-1">
          <div className="h-4 w-24 bg-gray-100 rounded-full"></div>
          <div className="h-12 w-20 bg-gray-200 rounded-2xl"></div>
        </div>
        <div className="h-16 w-16 bg-gray-100 rounded-[1.5rem]"></div>
      </div>
      <div className="mt-8 h-4 w-32 bg-gray-50 rounded-full"></div>
    </CardContent>
  </Card>
);

export const ChartSkeleton = () => (
  <Card className="rounded-[2.5rem] border-none shadow-xl overflow-hidden bg-white/80 animate-pulse">
    <CardHeader className="p-8 space-y-4">
      <div className="h-8 w-48 bg-gray-200 rounded-full"></div>
      <div className="h-4 w-64 bg-gray-100 rounded-full"></div>
    </CardHeader>
    <CardContent className="px-8 pb-10">
      <div className="h-[300px] w-full bg-gray-50 rounded-[2rem]"></div>
    </CardContent>
  </Card>
);

export const ActivitySkeleton = () => (
  <Card className="rounded-[2.5rem] border-none shadow-xl overflow-hidden bg-white/80 animate-pulse">
    <CardHeader className="p-8 space-y-4 flex flex-row items-center justify-between">
      <div className="space-y-4">
        <div className="h-8 w-32 bg-gray-200 rounded-full"></div>
        <div className="h-4 w-48 bg-gray-100 rounded-full"></div>
      </div>
      <div className="h-10 w-32 bg-gray-100 rounded-2xl"></div>
    </CardHeader>
    <CardContent className="px-8 pb-10 space-y-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-24 w-full bg-gray-50 rounded-[2rem] border border-gray-100"></div>
      ))}
    </CardContent>
  </Card>
);
