import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Play, RotateCcw, BookOpen, Search, Lightbulb } from 'lucide-react';

export default function VisualizerPage() {
  const { vizSteps } = useApp();
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play logic
  useEffect(() => {
    let t;
    if (isPlaying && stepIdx < (vizSteps?.length || 0) - 1) {
      t = setTimeout(() => setStepIdx(s => s + 1), 600);
    } else if (stepIdx >= (vizSteps?.length || 0) - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(t);
  }, [isPlaying, stepIdx, vizSteps]);

  const currentStep = vizSteps?.[stepIdx] || null;

  // Build tree representation
  const byParent = {};
  if (currentStep) {
    currentStep.nodes.forEach(n => {
      const p = n.parent || 'root';
      if (!byParent[p]) byParent[p] = [];
      byParent[p].push(n);
    });
  }

  const renderTree = (parentId, depth=0) => {
    const children = byParent[parentId] || [];
    if (!children.length) return null;
    return (
      <div className="flex justify-center">
        {children.map((node, i) => {
          // Color based on state
          let bgClass = "bg-gray-200 border-gray-300";
          if (node.state === 'active') bgClass = "bg-[#7c3aed] text-white shadow-lg shadow-purple-500/20 ring-4 ring-purple-100 animate-pulse";
          else if (node.state === 'done') bgClass = "bg-teal-600 border-teal-600 text-white shadow-md shadow-teal-500/20";
          else if (node.state === 'solved') bgClass = "bg-green-600 border-green-600 text-white shadow-md";
          else if (node.state === 'fail') bgClass = "bg-destructive border-destructive text-white shadow-md shadow-red-500/20";

          return (
            <div key={node.id} className={`relative flex flex-col items-center animate-fade-in px-4 ${parentId !== 'root' ? 'pt-8' : ''}`}>
              
              {/* Connectors (only if not root) */}
              {parentId !== 'root' && (
                <>
                  {/* Horizontal joining line */}
                  {children.length > 1 && (
                    <div className={`absolute top-0 h-[1px] border-t-2 border-black/10 ${
                      i === 0 ? 'left-1/2 right-0' :
                      i === children.length - 1 ? 'left-0 right-1/2' :
                      'left-0 right-0'
                    }`}></div>
                  )}
                  {/* Vertical line up from node to horizontal line */}
                  <div className="absolute top-0 left-1/2 w-[1px] h-8 border-l-2 border-black/10"></div>
                </>
              )}
              
              {/* Node Circle/Box */}
              <div className={`relative z-10 flex flex-col items-center justify-center p-3 px-5 rounded-2xl min-w-[100px] border-2 transition-all duration-300 ${bgClass}`}>
                <span className="font-heading font-bold text-[16px] tracking-wide leading-tight">{(node.course || "??").substring(0, 8)}</span>
                <span className="text-[10px] font-mono font-semibold tracking-wider opacity-90 mt-0.5">{node.slot}</span>
              </div>
              
              {/* Vertical line DOWN from parent node (only if it has children) */}
              {(byParent[node.id] && byParent[node.id].length > 0) && (
                <div className="w-[1px] h-8 border-l-2 border-black/10"></div>
              )}
              
              {/* Recursive child subtree */}
              {renderTree(node.id, depth + 1)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full h-full p-8 max-w-[1500px] mx-auto overflow-y-auto">
      
      {/* ── HEADER ── */}
      <header className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-4xl font-heading font-bold text-foreground mb-3 tracking-tight">Backtracking Visualizer</h1>
          <p className="text-[15px] text-muted-foreground leading-relaxed max-w-2xl">
            Watch the algorithm navigate through billions of possible slot combinations to find your perfect academic semester.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsPlaying(!isPlaying)} className={`px-5 py-3 rounded-xl font-bold text-[13px] transition-all flex items-center gap-2 shadow-sm ${isPlaying ? 'bg-orange-100 text-orange-700' : 'bg-destructive text-white hover:bg-destructive/90 shadow-[0_4px_14px_rgba(239,68,68,0.3)]'}`}>
            <Play size={16} className={isPlaying?"animate-pulse":""}/> {isPlaying ? "Pause Solver" : "Start Solver"}
          </button>
          <button onClick={() => {setStepIdx(0); setIsPlaying(false);}} className="bg-black/5 hover:bg-black/10 px-5 py-3 rounded-xl font-bold text-[13px] text-foreground transition-all flex items-center gap-2">
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </header>

      {/* ── MAIN VIZ GRID ── */}
      <div className="grid grid-cols-3 gap-8 mb-8">
        
        {/* Visualizer Canvas */}
        <div className="col-span-2 bg-white rounded-[32px] p-8 shadow-sm border border-black/5 min-h-[500px] relative overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <h3 className="font-heading font-bold text-xl">Decision Tree</h3>
            <div className="flex gap-4">
              <span className="flex items-center gap-2 text-xs font-semibold text-muted-foreground"><span className="w-2.5 h-2.5 rounded-full bg-[#7c3aed]"></span> TRYING</span>
              <span className="flex items-center gap-2 text-xs font-semibold text-muted-foreground"><span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span> ASSIGNED</span>
              <span className="flex items-center gap-2 text-xs font-semibold text-muted-foreground"><span className="w-2.5 h-2.5 rounded-full bg-destructive"></span> CLASH</span>
            </div>
          </div>

          {/* Canvas Wrapper */}
          <div className="flex-1 flex justify-center pt-4 pb-20">
             {vizSteps && vizSteps.length > 0 ? renderTree('root') : (
                <div className="mt-20 text-muted-foreground italic text-sm flex flex-col items-center justify-center text-center">
                  <span className="mb-2">No algorithm steps captured yet.</span>
                  <span>Run <strong className="font-bold">Regenerate</strong> on the Timetable page to see the generated tree logic here.</span>
                </div>
             )}
          </div>

          {/* Pruning tip overlay */}
          <div className="absolute bottom-8 left-8 right-8 bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex gap-4 text-indigo-900 shadow-sm">
            <Lightbulb className="flex-shrink-0 text-indigo-500 mt-0.5" size={18} />
            <p className="text-xs font-medium leading-relaxed">
              <strong>Pruning logic:</strong> When a "Clash" (Red) is detected, the algorithm immediately stops exploring that branch, saving thousands of computations.
            </p>
          </div>
        </div>

        {/* Right Panel: Code & Trace */}
        <div className="col-span-1 flex flex-col gap-6">
          
          <div className="bg-[#f0ede8]/50 rounded-3xl p-6 border border-black/5">
            <div className="flex items-center justify-between mb-4">
               <h3 className="font-heading font-bold text-lg">Algorithm Logic</h3>
               <span className="text-[9px] font-bold tracking-widest bg-teal-100 text-teal-800 px-2 py-1 rounded uppercase">Recursive DFS</span>
            </div>
            {/* Syntax Highlighted dark block */}
            <div className="bg-[#1e1e1e] rounded-2xl p-5 text-[#d4d4d4] font-mono text-[11px] leading-[1.8] shadow-inner overflow-x-auto">
              <div><span className="text-pink-400">function</span> <span className="text-yellow-200">solve</span>(index):</div>
              <div className="text-green-400 pl-4">// Base case</div>
              <div className="pl-4"><span className="text-pink-400">if</span> index == courses.len:</div>
              <div className="pl-8"><span className="text-pink-400">return</span> <span className="text-blue-300">SUCCESS</span></div>
              <br/>
              <div className="pl-4"><span className="text-pink-400">for</span> slot <span className="text-pink-400">in</span> courses[index]:</div>
              <div className="pl-8"><span className="text-pink-400">if</span> <span className="text-yellow-200">is_valid</span>(slot):</div>
              <div className="pl-12"><span className="text-yellow-200">assign</span>(slot)</div>
              <div className="pl-12"><span className="text-pink-400">if</span> <span className="text-yellow-200">solve</span>(index + 1):</div>
              <div className="pl-16"><span className="text-pink-400">return</span> <span className="text-blue-300">SUCCESS</span></div>
              <div className="pl-12"><span className="text-yellow-200">unassign</span>(slot)</div>
            </div>
          </div>

          <div className="bg-[#f0ede8]/50 rounded-3xl p-6 border border-black/5 flex-1 flex flex-col">
            <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span> Solver Trace
            </h3>
            <div className="flex-1 flex flex-col gap-2.5 overflow-hidden">
               {vizSteps && vizSteps.map((step, i) => {
                 // Only show trace elements up to current step
                 if (i > stepIdx) return null;
                 const isLatest = i === stepIdx;
                 let borderClass = 'border-l-teal-500 bg-white text-teal-900';
                 if (step.label.includes('clashes')) borderClass = 'border-l-destructive bg-red-50 text-red-900';
                 if (step.label.includes('Backtrack')) borderClass = 'border-l-purple-500 bg-purple-50 text-purple-900';
                 if (step.label.includes('Solution')) borderClass = 'border-l-green-500 bg-green-50 text-green-900 font-bold';
                 
                 return (
                   <div key={i} className={`text-[10px] font-mono px-4 py-3 rounded-lg border-l-4 shadow-sm transition-all ${borderClass} ${isLatest ? 'opacity-100 ring-1 ring-black/5' : 'opacity-60'}`}>
                     {step.label}
                   </div>
                 );
               })}
            </div>
          </div>

        </div>
      </div>

      {/* ── BOTTOM CARDS ── */}
      <div className="grid grid-cols-3 gap-6">
         {[
           {ic:BookOpen, color:"text-cyan-600", bg:"bg-cyan-100", title:"Space Complexity", desc:"The algorithm uses O(N) space where N is the number of courses, managing only the current active recursion stack."},
           {ic:Search, color:"text-purple-600", bg:"bg-purple-100", title:"Heuristic Sorting", desc:"Courses with fewer available slots are prioritized first to fail fast and prune the search space efficiently."},
           {ic:Lightbulb, color:"text-red-500", bg:"bg-red-100", title:"Constraint Solver", desc:"Checks for time conflicts, credit limits, and lab-theory pairings simultaneously in every step."}
         ].map((card, i) => (
           <div key={i} className="bg-[#f0ede8]/40 rounded-3xl p-6 border border-black/5 relative overflow-hidden">
              <div className={`w-10 h-10 rounded-full ${card.bg} ${card.color} flex items-center justify-center mb-4`}>
                 <card.ic size={18} strokeWidth={2.5}/>
              </div>
              <h4 className="font-heading font-bold text-[17px] mb-2">{card.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed shadow-sm pb-1">{card.desc}</p>
           </div>
         ))}
      </div>

    </div>
  );
}
