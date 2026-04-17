import React from 'react';
import { useApp, DAYS, TIMES } from '../context/AppContext';
import { Download, RefreshCw, Lightbulb, Clock, CheckCircle2 } from 'lucide-react';

const PAL = [
  { bg:"#e0f2fe", header:"#0ea5e9", text:"#082f49" },
  { bg:"#f3e8ff", header:"#a855f7", text:"#3b0764" },
  { bg:"#dcfce7", header:"#22c55e", text:"#052e16" },
  { bg:"#ffe4e6", header:"#f43f5e", text:"#4c0519" },
  { bg:"#fef9c3", header:"#eab308", text:"#422006" },
];

export default function TimetablePage() {
  const { result, generate, loading, courses, totalCredits } = useApp();

  const map = {};
  if (result) {
    result.forEach((item, i) => {
      const p = PAL[i % PAL.length];
      (item.timings || []).forEach(([d, t]) => {
        map[`${d}|${t}`] = { ...item, p };
      });
    });
  }

  return (
    <div className="flex h-full p-8 gap-8">
      {/* ── LEFT MAIN: SCHEDULE ── */}
      <div className="flex-1 max-w-4xl flex flex-col gap-8">
        
        <header className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-heading font-bold text-foreground mb-3 tracking-tight">Weekly Schedule</h1>
            <p className="text-[15px] text-muted-foreground leading-relaxed max-w-lg">
              Your Winter Semester 2024 optimized slot mapping. Curated for balance and high-focus study blocks.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={generate} disabled={loading} className="bg-white border border-black/10 hover:border-black/20 text-[13px] font-semibold text-foreground px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2">
              <RefreshCw size={15} className={loading?"animate-spin":""}/> Regenerate
            </button>
            <button className="bg-destructive hover:bg-destructive/90 text-[13px] font-semibold text-white px-4 py-2.5 rounded-xl shadow-[0_4px_14px_rgba(239,68,68,0.3)] transition-all flex items-center gap-2">
              <Download size={15} /> Export to PDF
            </button>
          </div>
        </header>

        {/* ── GRID ── */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 overflow-x-auto">
           {result || loading ? (
             <table className="w-full min-w-[700px] border-collapse" style={{ tableLayout: 'fixed' }}>
               <thead>
                 <tr>
                   <th className="w-16"></th>
                   {DAYS.map(day => (
                     <th key={day} className="text-[11px] font-bold text-foreground font-heading uppercase tracking-widest pb-6 pt-2">{day}</th>
                   ))}
                 </tr>
               </thead>
               <tbody>
                 {TIMES.map(time => (
                   <tr key={time}>
                     <td className="text-[10px] font-mono font-semibold text-muted-foreground align-top pt-2 pr-4 text-right">
                       {time}
                     </td>
                     {DAYS.map(day => {
                       const c = map[`${day}|${time}`];
                       return (
                         <td key={day} className="p-1.5 h-[90px] border border-black/5 align-top relative">
                           {c && (
                             <div 
                               className="absolute inset-[3px] rounded-xl p-3 flex flex-col justify-between shadow-sm overflow-hidden"
                               style={{ backgroundColor: c.p.bg }}
                             >
                               {/* Colored Top Bar Indicator */}
                               <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: c.p.header }} />
                               
                               <div className="mt-1">
                                 <div className="text-[9px] font-bold tracking-widest uppercase mb-1" style={{ color: c.p.header }}>{c.code}</div>
                                 <div className="font-heading font-bold text-[14px] leading-tight" style={{ color: c.p.text }}>{c.course.length > 20 ? c.course.substring(0, 20) + "…" : c.course}</div>
                               </div>
                               
                               <div className="text-[9.5px] font-semibold opacity-70 mt-auto leading-tight flex items-center gap-1 overflow-hidden">
                                  <span className="truncate block">Slot {c.slot}</span>
                               </div>
                             </div>
                           )}
                         </td>
                       );
                     })}
                   </tr>
                 ))}
               </tbody>
             </table>
           ) : (
             <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
                 <Clock size={32} className="opacity-40" />
                 <p className="font-medium text-sm">No schedule generated yet. Please generate a plan.</p>
             </div>
           )}
        </div>

      </div>

      {/* ── RIGHT MAIN: WIDGETS ── */}
      <div className="w-72 flex-shrink-0 flex flex-col gap-6">
        
        {/* Course Roll */}
        <div className="bg-[#f0ede8]/50 rounded-2xl p-6 border border-black/5">
          <h3 className="font-heading font-bold text-[18px] mb-4 text-foreground">Course Roll</h3>
          <div className="flex flex-col gap-4">
             {result ? result.map((r, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-black/10 flex-shrink-0 flex items-center justify-center text-xs font-bold text-muted-foreground/60 shadow-sm border border-black/5 object-cover overflow-hidden">
                     F{i+1}
                  </div>
                  <div>
                    <div className="text-[12px] font-bold text-foreground leading-tight">{r.faculty}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{r.course} • {r.slot}</div>
                  </div>
                </div>
             )) : (
                <div className="text-xs text-muted-foreground italic">Roll will appear after generation.</div>
             )}
          </div>
        </div>

        {/* Quote Card */}
        <div className="bg-[#a78bfa] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute -bottom-4 -right-4 p-4 opacity-[0.08]"><Lightbulb size={120}/></div>
          <Lightbulb size={24} className="mb-6 opacity-90" fill="currentColor" stroke="none" />
          <p className="text-[17px] font-heading font-bold leading-snug opacity-95 mb-6">
            "The schedule follows a 'Deep Work' philosophy, clustering technical courses in the morning."
          </p>
          <div className="text-[9px] font-bold tracking-widest uppercase opacity-70 border-t border-white/20 pt-4 flex gap-2">
            <span className="w-6 h-[1px] bg-white mt-[5px]"></span> OPTIMIZATION INSIGHT
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-1">
          <div className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase mb-3">Quick Stats</div>
          <div className="grid grid-cols-2 gap-3">
             <div className="bg-[#f0ede8]/60 rounded-xl p-4 border border-black/5 flex flex-col justify-center">
                <div className="font-heading font-bold text-2xl text-foreground animate-fade-in">{totalCredits}</div>
                <div className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase mt-1">Credits</div>
             </div>
             <div className="bg-[#f0ede8]/60 rounded-xl p-4 border border-black/5 flex flex-col justify-center">
                <div className="font-heading font-bold text-2xl text-foreground">{courses.filter(c => c.name || c.code).length}</div>
                <div className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase mt-1">Core Subjects</div>
             </div>
             <div className="bg-[#f0ede8]/60 rounded-xl p-4 border border-black/5 flex flex-col justify-center">
                <div className="font-heading font-bold text-2xl text-foreground">{courses.filter(c => c.type === 'lab' || c.type === 'embedded').length}</div>
                <div className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase mt-1">Lab Sessions</div>
             </div>
             <div className="bg-[#f0ede8]/60 rounded-xl p-4 border border-black/5 flex flex-col justify-center">
                <div className="font-heading font-bold text-2xl text-foreground">0</div>
                <div className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase mt-1">Clashes</div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
