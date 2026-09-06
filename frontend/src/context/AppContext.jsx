import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const AppContext = createContext();

export const SLOT_TIMING = {
  "A1": [["MON", "08:00"], ["WED", "09:00"]], "F1": [["MON", "09:00"], ["WED", "10:00"]], "D1": [["MON", "10:00"], ["THU", "08:00"]], "TB1": [["MON", "11:00"]], "TG1": [["MON", "12:00"]], "A2": [["MON", "14:00"], ["WED", "15:00"]], "F2": [["MON", "15:00"], ["WED", "16:00"]], "D2": [["MON", "16:00"], ["THU", "14:00"]], "TB2": [["MON", "17:00"]], "TG2": [["MON", "18:00"]], "V3": [["MON", "19:01"]], "L1": [["MON", "08:00"]], "L2": [["MON", "08:51"]], "L3": [["MON", "09:51"]], "L4": [["MON", "10:41"]], "L5": [["MON", "11:40"]], "L6": [["MON", "12:31"]], "L31": [["MON", "14:00"]], "L32": [["MON", "14:51"]], "L33": [["MON", "15:51"]], "L34": [["MON", "16:41"]], "L35": [["MON", "17:40"]], "L36": [["MON", "18:31"]], "B1": [["TUE", "08:00"], ["THU", "09:00"]], "G1": [["TUE", "09:00"], ["THU", "10:00"]], "E1": [["TUE", "10:00"], ["FRI", "08:00"]], "TC1": [["TUE", "11:00"]], "TAA1": [["TUE", "12:00"]], "B2": [["TUE", "14:00"], ["THU", "15:00"]], "G2": [["TUE", "15:00"], ["THU", "16:00"]], "E2": [["TUE", "16:00"], ["FRI", "14:00"]], "TC2": [["TUE", "17:00"]], "TAA2": [["TUE", "18:00"]], "V4": [["TUE", "19:01"]], "L7": [["TUE", "08:00"]], "L8": [["TUE", "08:51"]], "L9": [["TUE", "09:51"]], "L10": [["TUE", "10:41"]], "L11": [["TUE", "11:40"]], "L12": [["TUE", "12:31"]], "L37": [["TUE", "14:00"]], "L38": [["TUE", "14:51"]], "L39": [["TUE", "15:51"]], "L40": [["TUE", "16:41"]], "L41": [["TUE", "17:40"]], "L42": [["TUE", "18:31"]], "C1": [["WED", "08:00"], ["FRI", "09:00"]], "V1": [["WED", "11:00"]], "V2": [["WED", "12:00"]], "C2": [["WED", "14:00"], ["FRI", "15:00"]], "TD2": [["WED", "17:00"]], "TBB2": [["WED", "18:00"]], "V5": [["WED", "19:01"]], "L13": [["WED", "08:00"]], "L14": [["WED", "08:51"]], "L15": [["WED", "09:51"]], "L16": [["WED", "10:41"]], "L17": [["WED", "11:40"]], "L18": [["WED", "12:31"]], "L43": [["WED", "14:00"]], "L44": [["WED", "14:51"]], "L45": [["WED", "15:51"]], "L46": [["WED", "16:41"]], "L47": [["WED", "17:40"]], "L48": [["WED", "18:31"]], "TE1": [["THU", "11:00"]], "TCC1": [["THU", "12:00"]], "TE2": [["THU", "17:00"]], "TCC2": [["THU", "18:00"]], "V6": [["THU", "19:01"]], "L19": [["THU", "08:00"]], "L20": [["THU", "08:51"]], "L21": [["THU", "09:51"]], "L22": [["THU", "10:41"]], "L23": [["THU", "11:40"]], "L24": [["THU", "12:31"]], "L49": [["THU", "14:00"]], "L50": [["THU", "14:51"]], "L51": [["THU", "15:51"]], "L52": [["THU", "16:41"]], "L53": [["THU", "17:40"]], "L54": [["THU", "18:31"]], "TA1": [["FRI", "10:00"]], "TF1": [["FRI", "11:00"]], "TD1": [["FRI", "12:00"]], "TA2": [["FRI", "16:00"]], "TF2": [["FRI", "17:00"]], "TDD2": [["FRI", "18:00"]], "V7": [["FRI", "19:01"]], "L25": [["FRI", "08:00"]], "L26": [["FRI", "08:51"]], "L27": [["FRI", "09:51"]], "L28": [["FRI", "10:41"]], "L29": [["FRI", "11:40"]], "L30": [["FRI", "12:31"]], "L55": [["FRI", "14:00"]], "L56": [["FRI", "14:51"]], "L57": [["FRI", "15:51"]], "L58": [["FRI", "16:41"]], "L59": [["FRI", "17:40"]], "L60": [["FRI", "18:31"]]
};

export const DAYS  = ["MON","TUE","WED","THU","FRI","SAT"];
export const TIMES = Array.from(new Set(Object.values(SLOT_TIMING).flat().map(t => t[1]))).sort();
export const THEORY_SLOTS = Object.keys(SLOT_TIMING).filter(s=>!s.startsWith("L"));
const rawLabs = Object.keys(SLOT_TIMING).filter(s=> s.startsWith("L")).sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)));
export const LAB_SLOTS = [];
for (let i = 0; i < rawLabs.length; i += 2) {
  if (i + 1 < rawLabs.length) LAB_SLOTS.push(`${rawLabs[i]}+${rawLabs[i+1]}`);
  else LAB_SLOTS.push(rawLabs[i]);
}
const BACKEND = "http://localhost:8080";

export function AppContextProvider({ children }) {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([
    { id:1, name:"Design and Analysis of Algorithms", code:"BCSE204L", options:[{faculty:"Dr.Athira.K", slot:"F1+TF1"}], type:"theory", credits: 3 },
    { id:2, name:"Computer Architecture and Organization", code:"BCSE205L", options:[{faculty:"Mr.SivaKumar.N", slot:"A1+TAA1"}], type:"theory", credits: 3 },
  ]);
  const [result,   setResult]   = useState(null);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [trace,    setTrace]    = useState([]);
  const [vizSteps, setVizSteps] = useState([]);
  const [genMs,    setGenMs]    = useState(null);

  const addCourse = () => setCourses(p=>[...p,{id:Date.now(),name:"",code:"",options:[{faculty:"",slot:"A1"}], type:"theory", credits: 3}]);
  const removeCourse = id => setCourses(p=>p.filter(c=>c.id!==id));
  const updateCourse = (id, field, v) => setCourses(p=>p.map(c=>c.id===id?{...c,[field]:v}:c));
  
  const addOpt = id => setCourses(p=>p.map(c=>c.id===id?{...c,options:[...c.options,{faculty:"",slot:"A1"}]}:c));
  const removeOpt = (id, i) => setCourses(p=>p.map(c=>c.id===id?{...c,options:c.options.filter((_,j)=>j!==i)}:c));
  const updateOpt = (id, i, f, v) => setCourses(p=>p.map(c=>c.id===id?{...c,options:c.options.map((o,j)=>j===i?{...o,[f]:v}:o)}:c));

  const totalCredits = useMemo(() => courses.reduce((acc, curr) => acc + (Number(curr.credits) || 0), 0), [courses]);

  const generate = useCallback(async () => {
    setError(""); setResult(null); setTrace([]); setVizSteps([]);
    const valid = courses.filter(c=>c.name&&c.options.some(o=>o.faculty&&o.slot));
    if (!valid.length) { setError("Add at least one course with a faculty and slot."); return; }
    
    setLoading(true);
    const t0 = performance.now();
    try {
      const res  = await fetch(`${BACKEND}/generate`,{
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({courses:valid.map(c=>({name:c.name,options:c.options.filter(o=>o.faculty&&o.slot)}))})
      });
      const data = await res.json();
      const ms   = Math.round(performance.now()-t0);
      setGenMs(ms);
      if (data.success) {
        // Map backend generic item to our course obj to get type/codes
        const enhancedResult = data.assignment.map(a => {
          const matchedCourse = courses.find(c => c.name === a.course);
          return {
            ...a,
            code: matchedCourse?.code || "N/A",
            type: matchedCourse?.type || "theory",
          };
        });
        setResult(enhancedResult);
        setVizSteps(data.steps||[]);
        setTrace([{type:"ok",msg:`Solved in ${ms}ms — ${enhancedResult.length} courses assigned.`}]);
        navigate('/timetable'); // redirect to Timetable page
      } else {
        setError(data.message);
        setVizSteps(data.steps||[]);
        setTrace([{type:"fail",msg:"No valid assignment exists."}]);
      }
    } catch {
      setError("Cannot reach Python backend — run: python3 app.py");
    }
    setLoading(false);
  }, [courses, navigate]);

  return (
    <AppContext.Provider value={{
      courses, addCourse, removeCourse, updateCourse, updateOpt, addOpt, removeOpt,
      result, error, loading, trace, vizSteps, genMs, totalCredits, generate
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
