import { useState } from 'react';
import { Project, getProjects, setProjects, addHistory, getCurUser, uid } from '../store';

const PS = ['planning','in_progress','on_hold','completed','cancelled'] as const;
const PC: Record<string,string> = {planning:'bg-blue-50 text-blue-700 border-blue-200',in_progress:'bg-amber-50 text-amber-700 border-amber-200',on_hold:'bg-gray-100 text-gray-600 border-gray-200',completed:'bg-green-50 text-green-700 border-green-200',cancelled:'bg-red-50 text-red-700 border-red-200'};
const PL: Record<string,string> = {planning:'Planning',in_progress:'In Progress',on_hold:'On Hold',completed:'Completed',cancelled:'Cancelled'};

export default function ProjectsPage({onSheetSelect}:{onSheetSelect:(g:string)=>void}) {
  const [proj,setP] = useState<Project[]>(getProjects());
  const [ep,setEp] = useState<Project|null>(null);
  const [isNew,setIsNew] = useState(false);
  const [filter,setFilter] = useState('all');
  const user = getCurUser();
  const fmt=(n:number)=>{if(n>=1e7)return`₹${(n/1e7).toFixed(2)} Cr`;if(n>=1e5)return`₹${(n/1e5).toFixed(2)} L`;return`₹${(n/1e3).toFixed(1)} K`;};

  const save=(p:Project,add:boolean)=>{
    let up:Project[];
    if(add){up=[p,...proj];if(user)addHistory({userId:user.id,userName:user.name,department:user.department,action:'add_project',detail:`Added project: ${p.name}`});}
    else{up=proj.map(x=>x.id===p.id?p:x);if(user)addHistory({userId:user.id,userName:user.name,department:user.department,action:'edit_project',detail:`Updated project: ${p.name}`});}
    setP(up);setProjects(up);setEp(null);setIsNew(false);
  };

  const fl=filter==='all'?proj:proj.filter(p=>p.status===filter);
  const tv=proj.reduce((a,b)=>a+b.value,0);

  return(
    <div className="p-4 md:p-6 space-y-5">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div><h1 className="text-2xl font-extrabold text-gray-900">Projects</h1><p className="text-sm text-gray-400 mt-0.5">{proj.length} projects • Total value {fmt(tv)}</p></div>
        <button onClick={()=>{setEp({id:uid(),name:'',client:'',location:'',status:'planning',value:0,startDate:new Date().toISOString().slice(0,10),endDate:'',manager:user?.name||'',progress:0});setIsNew(true);}}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow shadow-indigo-200 hover:bg-indigo-700 transition flex items-center gap-1.5 self-start">+ Add Project</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[{l:'Total',v:String(proj.length),c:'text-blue-600 bg-blue-50 border-blue-100'},{l:'Active',v:String(proj.filter(p=>p.status==='in_progress').length),c:'text-amber-600 bg-amber-50 border-amber-100'},{l:'Completed',v:String(proj.filter(p=>p.status==='completed').length),c:'text-green-600 bg-green-50 border-green-100'},{l:'Value',v:fmt(tv),c:'text-violet-600 bg-violet-50 border-violet-100'}].map((s,i)=>(
          <div key={i} className={`st3d cd p-4 border ${s.c}`}><p className="text-[10px] text-gray-400 font-bold uppercase">{s.l}</p><p className={`text-xl font-extrabold mt-1 ${s.c.split(' ')[0]}`}>{s.v}</p></div>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <button onClick={()=>setFilter('all')} className={`tp ${filter==='all'?'on':''}`}>All</button>
        {PS.map(s=><button key={s} onClick={()=>setFilter(s)} className={`tp ${filter===s?'on':''}`}>{PL[s]}</button>)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fl.map(p=>(
          <div key={p.id} className="cd p-5 cd-lift cursor-pointer group" onClick={()=>{setEp(p);setIsNew(false);}}>
            <div className="flex items-start justify-between mb-3">
              <div className="min-w-0"><h3 className="text-sm font-bold text-gray-800 truncate group-hover:text-indigo-600 transition">{p.name}</h3><p className="text-xs text-gray-400 truncate">{p.client}</p></div>
              <span className={`bg-badge border text-[10px] shrink-0 ${PC[p.status]}`}>{PL[p.status]}</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-gray-400">Location</span><span className="text-gray-700 font-medium">{p.location}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Value</span><span className="text-indigo-600 font-mono font-bold">{fmt(p.value)}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Timeline</span><span className="text-gray-500">{p.startDate} → {p.endDate||'TBD'}</span></div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-50">
              <div className="flex items-center justify-between mb-1"><span className="text-[10px] text-gray-400 font-bold">Progress</span><span className="text-xs font-bold text-indigo-600">{p.progress}%</span></div>
              <div className="w-full bg-gray-100 rounded-full h-2"><div className={`h-2 rounded-full transition-all ${p.progress>=100?'bg-green-500':'bg-gradient-to-r from-indigo-500 to-violet-500'}`} style={{width:`${p.progress}%`}}/></div>
            </div>
            {p.linkedSheetGid && <button onClick={e=>{e.stopPropagation();onSheetSelect(p.linkedSheetGid!);}} className="mt-3 text-xs text-indigo-500 hover:text-indigo-700 font-medium flex items-center gap-1">📑 View Billing Sheet →</button>}
          </div>
        ))}
      </div>

      {ep && <div className="md-bg" onClick={()=>{setEp(null);setIsNew(false);}}><div className="md-box max-w-lg" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5"><h2 className="text-lg font-bold text-gray-900">{isNew?'Add Project':'Edit Project'}</h2><button onClick={()=>{setEp(null);setIsNew(false);}} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500">✕</button></div>
        <ProjForm p={ep} isNew={isNew} onSave={save}/>
      </div></div>}
    </div>
  );
}

function ProjForm({p,isNew,onSave}:{p:Project;isNew:boolean;onSave:(p:Project,n:boolean)=>void}){
  const [f,setF]=useState<Project>(p);
  const up=(k:keyof Project,v:string|number)=>setF({...f,[k]:v});
  return(
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[{k:'name',l:'Project Name'},{k:'client',l:'Client'},{k:'location',l:'Location'},{k:'manager',l:'Manager'}].map(x=>(
          <div key={x.k}><label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">{x.l}</label><input value={String(f[x.k as keyof Project])} onChange={e=>up(x.k as keyof Project,e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"/></div>
        ))}
        <div><label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Value (₹)</label><input type="number" value={f.value} onChange={e=>up('value',parseFloat(e.target.value)||0)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"/></div>
        <div><label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Status</label><select value={f.status} onChange={e=>up('status',e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400">{PS.map(s=><option key={s} value={s}>{PL[s]}</option>)}</select></div>
        <div><label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Start Date</label><input type="date" value={f.startDate} onChange={e=>up('startDate',e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"/></div>
        <div><label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">End Date</label><input type="date" value={f.endDate} onChange={e=>up('endDate',e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"/></div>
        <div><label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Progress (%)</label><input type="number" min="0" max="100" value={f.progress} onChange={e=>up('progress',parseInt(e.target.value)||0)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"/></div>
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
        <button onClick={()=>onSave(f,isNew)} className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow shadow-indigo-200 hover:bg-indigo-700 transition">{isNew?'Create':'Save'}</button>
      </div>
    </div>
  );
}
