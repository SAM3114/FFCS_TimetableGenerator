import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Layers, CalendarDays, Sparkles, User, Settings, FileBox } from 'lucide-react';

export default function SidebarLayout() {
  const { generate, loading } = useApp();
  const location = useLocation();

  const currentStep = location.pathname.includes('/timetable') ? 3 : 1; // 1: Setup, 2: Slot Selection (not used yet), 3: Final View

  return (
    <div className="flex-1 flex max-w-[1700px] w-full mx-auto bg-white rounded-tr-3xl rounded-br-3xl shadow-sm border border-black/5 overflow-hidden">
      
      {/* ── LEFT SIDEBAR ── */}
      <aside className="w-64 bg-[#f0ede8]/40 border-r border-black/5 flex flex-col pt-8 pb-8 px-6">
        
        {/* Profile Card */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-[#1F2937] text-white flex items-center justify-center rounded-full shadow-md">
            <User size={18} />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground leading-tight">Curator</div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mt-0.5">Winter Sem 2024</div>
          </div>
        </div>

        {/* Navigation Steps */}
        <nav className="flex flex-col gap-2 flex-1">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${currentStep === 1 ? 'bg-white shadow-sm text-primary font-semibold' : 'text-muted-foreground hover:bg-black/5'}`}>
            <FileBox size={18} className={currentStep === 1 ? 'text-primary' : ''} />
            <span className="text-[13px]">Course Setup</span>
          </div>
          
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-muted-foreground hover:bg-black/5">
            <Layers size={18} />
            <span className="text-[13px]">Slot Selection</span>
          </div>

          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${currentStep === 3 ? 'bg-white shadow-sm text-primary font-semibold' : 'text-muted-foreground hover:bg-black/5'}`}>
            <Sparkles size={18} className={currentStep === 3 ? 'text-primary' : ''} />
            <span className="text-[13px]">Final View</span>
          </div>
        </nav>

        {/* Action Button */}
        <button 
          onClick={generate}
          disabled={loading}
          className="w-full mt-auto bg-destructive hover:bg-destructive/90 text-white font-medium text-[13px] py-3.5 rounded-xl shadow-[0_4px_14px_rgba(239,68,68,0.3)] transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {loading ? (
             <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span> Solving…</>
          ) : (
            <>Generate Plan <span>⚡</span></>
          )}
        </button>

      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 overflow-y-auto bg-[#faf9f8]">
        <Outlet />
      </div>

    </div>
  );
}
