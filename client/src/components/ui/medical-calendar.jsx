import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

export const MedicalCalendar = ({ value, onChange, placeholder = "Pilih Tanggal" }) => {
  const [activeView, setActiveView] = useState('days');
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date(value || new Date()));
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const handleDateSelect = (date) => {
    onChange(date.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="relative group">
      <div
        onClick={toggle}
        className="h-12 w-full rounded-2xl bg-gray-50 border border-gray-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 transition-all text-gray-700 px-4 flex items-center justify-between cursor-pointer hover:bg-white hover:border-primary/30 relative"
      >
        <span className={`text-sm font-bold ${value ? 'text-gray-900' : 'text-gray-400 font-normal'}`}>
          {value ? new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : placeholder}
        </span>
        <Calendar size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-3 w-[280px] bg-white rounded-[1.5rem] shadow-[0_15px_40px_-12px_rgba(0,0,0,0.12)] border border-gray-50 p-4 z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => {
                const current = new Date(currentCalendarDate);
                if (activeView === 'days') current.setMonth(current.getMonth() - 1);
                else current.setFullYear(current.getFullYear() - 12);
                setCurrentCalendarDate(current);
              }}
              className="p-1.5 hover:bg-gray-50 rounded-lg text-primary transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setActiveView(activeView === 'days' ? 'years' : 'days')}
                className="font-bold text-gray-900 hover:text-primary transition-colors flex flex-col items-center"
              >
                {activeView === 'days' ? (
                  <>
                    <span className="text-[10px] text-primary uppercase tracking-widest mb-0.5">
                      {currentCalendarDate.toLocaleDateString('id-ID', { month: 'long' })}
                    </span>
                    <span className="text-base font-extrabold flex items-center gap-1 leading-none">
                      {currentCalendarDate.getFullYear()} <ChevronRight size={12} className="rotate-90 ml-1" />
                    </span>
                  </>
                ) : (
                  <span className="text-base font-extrabold">Pilih Tahun</span>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                const current = new Date(currentCalendarDate);
                if (activeView === 'days') current.setMonth(current.getMonth() + 1);
                else current.setFullYear(current.getFullYear() + 12);
                setCurrentCalendarDate(current);
              }}
              className="p-1.5 hover:bg-gray-50 rounded-lg text-primary transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {activeView === 'days' ? (
            <div className="animate-in fade-in zoom-in-95 duration-200">
              <div className="grid grid-cols-7 gap-0.5 mb-1">
                {['S', 'S', 'R', 'K', 'J', 'S', 'M'].map((d, i) => (
                  <div key={i} className="text-center text-[9px] font-bold text-gray-300 uppercase py-1">{d}</div>
                ))}
                {(() => {
                  const firstDay = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth(), 1).getDay();
                  const daysInMonth = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, 0).getDate();
                  const days = [];
                  for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) days.push(<div key={`empty-${i}`} />);
                  for (let d = 1; d <= daysInMonth; d++) {
                    const date = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth(), d);
                    const dateStr = date.toISOString().split('T')[0];
                    const isSelected = value === dateStr;
                    days.push(
                      <button
                        key={d}
                        type="button"
                        onClick={() => handleDateSelect(date)}
                        className={`h-8 w-8 rounded-lg flex items-center justify-center text-[11px] font-bold transition-all ${isSelected ? 'bg-primary text-white shadow-md shadow-primary/20' : 'hover:bg-primary/10 hover:text-primary text-gray-600'}`}
                      >
                        {d}
                      </button>
                    );
                  }
                  return days;
                })()}
              </div>
            </div>
          ) : (
            <div className="max-h-[200px] overflow-y-auto grid grid-cols-3 gap-2 animate-in fade-in zoom-in-95 duration-200 pb-2 custom-scrollbar">
              {years.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => {
                    const newDate = new Date(currentCalendarDate);
                    newDate.setFullYear(year);
                    setCurrentCalendarDate(newDate);
                    setActiveView('days');
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition-all ${currentCalendarDate.getFullYear() === year ? 'bg-primary text-white shadow-sm shadow-primary/20' : 'hover:bg-gray-50 text-gray-600 border border-transparent hover:border-gray-100'}`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-gray-50 flex justify-between items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                handleDateSelect(today);
                setCurrentCalendarDate(today);
              }}
              className="text-[10px] filter hover:brightness-95 active:scale-95 font-extrabold text-primary bg-primary/5 px-4 py-1.5 rounded-full transition-all uppercase tracking-wider"
            >
              Hari Ini
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[9px] font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
