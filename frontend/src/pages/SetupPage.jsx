import React from 'react';
import { useApp, THEORY_SLOTS, LAB_SLOTS } from '../context/AppContext';
import { Search, PlusCircle, Pencil, Trash2, BookOpen, Lightbulb, Beaker, FileCode2, ChevronRight } from 'lucide-react';

export default function SetupPage() {
  const { courses, addCourse, removeCourse, updateCourse, updateOpt, addOpt, removeOpt, totalCredits } = useApp();

  return (
    <div className="flex h-full p-8 gap-8">
      {/* ── LEFT MAIN: ARCHITECTURE ── */}
      <div className="flex-1 max-w-3xl flex flex-col gap-8">
        
        <header>
          <h1 className="text-4xl font-heading font-bold text-foreground mb-3 tracking-tight">Course Architecture</h1>
          <p className="text-[15px] text-muted-foreground leading-relaxed max-w-2xl">
            Define your academic trajectory for the upcoming semester. Add your core subjects, preferred faculty members, and structural slots to begin the synthesis.
          </p>
        </header>

        {/* INPUT FORM BLOCK */}
        {courses.map((course, idx) => (
          <div key={course.id} className="bg-white rounded-2xl p-6 shadow-sm border border-black/5 flex flex-col gap-5 border-l-4 border-l-primary/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-destructive" />
                <h3 className="font-heading font-bold text-[18px] tracking-wide">Primary Course Entry 
                  <span className="ml-2 font-mono text-[10px] bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full uppercase tracking-widest font-semibold">Active Slot</span>
                </h3>
              </div>
              {idx > 0 && (
                 <button onClick={() => removeCourse(course.id)} className="text-muted-foreground hover:text-destructive">
                   <Trash2 size={16} />
                 </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-muted-foreground tracking-wider uppercase">Course Code</label>
                <input 
                  value={course.code} 
                  onChange={e => updateCourse(course.id, 'code', e.target.value)} 
                  className="bg-[#f0ede8]/50 border-none rounded-lg px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60 w-full"
                  placeholder="e.g. CSE1001"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-muted-foreground tracking-wider uppercase">Course Title</label>
                <input 
                  value={course.name} 
                  onChange={e => updateCourse(course.id, 'name', e.target.value)} 
                  className="bg-[#f0ede8]/50 border-none rounded-lg px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60 w-full"
                  placeholder="e.g. Operating Systems"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-muted-foreground tracking-wider uppercase">Credits</label>
                <input 
                  type="number"
                  min="1"
                  max="5"
                  value={course.credits} 
                  onChange={e => updateCourse(course.id, 'credits', e.target.value)} 
                  className="bg-[#f0ede8]/50 border-none rounded-lg px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60 w-full"
                  placeholder="e.g. 3"
                />
              </div>
            </div>

            {course.options.map((opt, oIdx) => (
              <div key={oIdx} className="flex flex-col gap-1.5 pt-2 border-t border-black/5">
                <label className="text-[11px] font-bold text-muted-foreground tracking-wider uppercase flex items-center justify-between">
                  <span>Faculty Selection</span>
                  {oIdx > 0 && <button onClick={() => removeOpt(course.id, oIdx)} className="text-destructive font-normal normal-case hover:underline">Remove Option</button>}
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                    <input 
                      value={opt.faculty} 
                      onChange={e => updateOpt(course.id, oIdx, 'faculty', e.target.value)} 
                      className="bg-[#f0ede8]/50 border-none rounded-lg pl-10 pr-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60 w-full"
                      placeholder="Search Faculty Name..."
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 w-auto items-end min-w-[120px]">
                    <div className="flex gap-1 flex-wrap justify-end">
                      {opt.slot ? opt.slot.split('+').filter(Boolean).map((s, si) => (
                        <span key={si} className="bg-primary/10 text-primary text-xs font-mono font-bold px-2 py-1 rounded flex items-center gap-1">
                          {s} <button onClick={() => updateOpt(course.id, oIdx, 'slot', opt.slot.split('+').filter(x => x !== s).join('+'))} className="hover:text-destructive hover:bg-destructive/10 rounded-full w-4 h-4 flex items-center justify-center transition-colors">×</button>
                        </span>
                      )) : <span className="text-xs text-muted-foreground italic py-1">No slots</span>}
                    </div>
                    <select 
                      value="" 
                      onChange={e => {
                        const val = e.target.value;
                        if (!val) return;
                        const current = opt.slot ? opt.slot.split('+').filter(Boolean) : [];
                        const newSlots = val.split('+').filter(Boolean);
                        const uniqueSlots = Array.from(new Set([...current, ...newSlots]));
                        updateOpt(course.id, oIdx, 'slot', uniqueSlots.join('+'));
                      }}
                      className="bg-[#f0ede8]/50 border-none rounded-lg px-2 py-1.5 text-[11px] font-bold tracking-wider uppercase outline-none hover:bg-[#e4e2de] transition-all cursor-pointer text-muted-foreground w-full max-w-[120px]"
                    >
                      <option value="">+ Add Slot</option>
                      <optgroup label="Theory">{THEORY_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}</optgroup>
                      <optgroup label="Lab">{LAB_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}</optgroup>
                    </select>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex gap-2">
                <button onClick={() => updateCourse(course.id, 'type', 'lab')} className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${course.type==='lab'?'bg-indigo-400 text-white shadow-sm':'bg-indigo-400/20 text-indigo-700 hover:bg-indigo-400/30'}`}><Beaker size={14}/> Lab Only</button>
                <button onClick={() => updateCourse(course.id, 'type', 'theory')} className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${course.type==='theory'?'bg-teal-400 text-white shadow-sm':'bg-teal-400/20 text-teal-700 hover:bg-teal-400/30'}`}><Pen tool="true" size={14} /> Theory Only</button>
                <button onClick={() => updateCourse(course.id, 'type', 'embedded')} className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${course.type==='embedded'?'bg-red-400 text-white shadow-sm':'bg-red-400/20 text-red-700 hover:bg-red-400/30'}`}><FileCode2 size={14}/> Embedded</button>
              </div>
            </div>

            <button onClick={() => addOpt(course.id)} className="text-right text-xs font-semibold text-primary/80 hover:text-primary mt-1">+ Add Backup Slot/Faculty</button>

          </div>
        ))}

        <div className="flex justify-end">
          <button onClick={addCourse} className="flex items-center gap-2 text-destructive font-bold text-sm tracking-wide bg-destructive/10 hover:bg-destructive/15 px-5 py-2.5 rounded-full transition-colors">
            <PlusCircle size={18} /> Add Course to Stack
          </button>
        </div>

        {/* CURRENT STACK */}
        <div className="mb-10">
          <h2 className="font-heading font-bold text-xl text-foreground mb-4">Current Curriculum Stack</h2>
          <div className="flex flex-col gap-3">
            {courses.filter(c => c.name || c.code).length > 0 ? courses.filter(c => c.name || c.code).map((course, idx) => (
              <div key={course.id} className="bg-white rounded-xl p-4 shadow-sm border border-black/5 border-l-4 flex items-center justify-between animate-fade-in" style={{ borderLeftColor: course.type === 'lab' ? '#818cf8' : course.type === 'theory' ? '#2dd4bf' : '#f87171', animationDelay: `${idx * 100}ms` }}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-black/5 flex items-center justify-center text-muted-foreground/70">
                    {course.type === 'lab' ? <Beaker size={20}/> : course.type === 'theory' ? <Pen tool="true" size={20}/> : <FileCode2 size={20}/>}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-destructive mb-0.5">{course.code || "XXX000"}</div>
                    <div className="font-heading font-bold text-[17px] text-foreground leading-tight">{course.name || "Unnamed Course"}</div>
                    <div className="text-[12px] italic text-muted-foreground mt-0.5 flex items-center gap-1.5">
                      {course.options[0]?.faculty || "No faculty selected"} <span className="opacity-50">•</span> {course.options[0]?.slot || "A1"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="text-muted-foreground/60 hover:text-primary transition-colors"><Pencil size={18}/></button>
                  <button onClick={() => removeCourse(course.id)} className="text-muted-foreground/60 hover:text-destructive transition-colors"><Trash2 size={18}/></button>
                </div>
              </div>
            )) : (
              <div className="py-8 text-center bg-black/5 rounded-xl border border-dashed border-black/10 flex flex-col items-center justify-center gap-3">
                 <BookOpen size={24} className="text-muted-foreground/40" />
                 <p className="text-sm font-medium text-muted-foreground/70">No core subjects have been successfully stacked yet.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── RIGHT MAIN: WIDGETS ── */}
      <div className="w-72 flex-shrink-0 flex flex-col gap-6">
        
        {/* Quote Card */}
        <div className="bg-[#6154b7] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Lightbulb size={64}/></div>
          <Lightbulb size={24} className="mb-6 opacity-90" fill="currentColor" stroke="none" />
          <h3 className="font-heading font-bold text-[22px] leading-tight mb-4">Academic Spotlight</h3>
          <p className="text-[15px] font-light leading-relaxed opacity-90 mb-6">
            "The secret of getting ahead is getting started."
          </p>
          <div className="text-[10px] font-bold tracking-widest uppercase opacity-70 border-t border-white/20 pt-4">— Mark Twain</div>
        </div>

        {/* Stack Overview */}
        <div className="bg-[#f6f5f3] rounded-2xl p-6 border border-black/5 flex flex-col justify-between" style={{ minHeight: '260px' }}>
          <div>
            <h3 className="font-heading font-bold text-[20px] mb-6">Stack Overview</h3>
            <div className="flex items-end justify-between mb-2">
              <span className="text-sm font-semibold text-muted-foreground">Total Credits</span>
              <div className="font-heading font-bold text-3xl">
                <span className="text-destructive">{totalCredits}</span> <span className="text-2xl text-muted-foreground/50">/ 27</span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="h-2 w-full bg-[#e5e5e5] rounded-full overflow-hidden mb-8">
              <div className="h-full bg-destructive rounded-full" style={{ width: `${Math.min(totalCredits/27 * 100, 100)}%` }}></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
             <div className="bg-white rounded-xl p-4 shadow-sm border border-black/5">
                <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-1">Core Subjects</div>
                <div className="font-heading font-bold text-2xl">{courses.filter(c=>c.name||c.code).length < 10 ? `0${courses.filter(c=>c.name||c.code).length}` : courses.filter(c=>c.name||c.code).length}</div>
             </div>
             <div className="bg-white rounded-xl p-4 shadow-sm border border-black/5">
                <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-1">Lab Slots</div>
                <div className="font-heading font-bold text-2xl">{courses.filter(c=>c.name||c.code).filter(c=>c.type==='lab'||c.type==='embedded').length < 10 ? `0${courses.filter(c=>c.name||c.code).filter(c=>c.type==='lab'||c.type==='embedded').length}` : courses.filter(c=>c.name||c.code).filter(c=>c.type==='lab'||c.type==='embedded').length}</div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// small dummy Pen tool component to avoid react-lucide issue if it changed
function Pen({ size, className }) {
  return <Pencil size={size} className={className} />;
}
