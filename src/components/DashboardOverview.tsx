import { useState, useEffect } from 'react';
import { SHEETS, CATEGORIES } from '../sheetsConfig';
import { fetchSheetData, SheetData } from '../csvParser';
import { getLeads, getProjects, getHistory } from '../store';

interface SS { gid:string;name:string;shortName:string;icon:string;category:string;totalInvoice:number;totalReceived:number;loaded:boolean; }

export default function DashboardOverview({onSheetSelect}:{onSheetSelect:(g:string)=>void}) {
  const [sums,setSums]=useState<SS[]>([]);
  const [loading,setLoading]=useState(true);
  const [cat,setCat]=useState('all');
  const leads=getLeads();const projects=getProjects();const history=getHistory();

  useEffect(()=>{load();},[]);
  const load=async()=>{
    setLoading(true);
    const billing=SHEETS.filter(s=>['billing','iocl','other'].includes(s.category)).slice(0,16);
    const results:SS[]=[];
    const settled=await Promise.allSettled(billing.map(async s=>{
      try{const d=await fetchSheetData(s.gid);return ext(d,s);}catch{return{gid:s.gid,name:s.name,shortName:s.shortName,icon:s.icon,category:s.category,totalInvoice:0,totalReceived:0,loaded:false};}
    }));
    settled.forEach(r=>{if(r.status==='fulfilled'&&r.value)results.push(r.value);});
    SHEETS.forEach(s=>{if(!results.find(r=>r.gid===s.gid))results.push({gid:s.gid,name:s.name,shortName:s.shortName,icon:s.icon,category:s.category,totalInvoice:0,totalReceived:0,loaded:false});});
    setSums(results);setLoading(false);
  };
  const ext=(d:SheetData,sh:typeof SHEETS[0]):SS=>{
    let ti=0,tr=0;
    d.rows.forEach(row=>{if(row[0]?.toLowerCase().includes('total')||row[3]?.toLowerCase().includes('total')){if(row[6]){const v=parseFloat(row[6].replace(/,/g,''));if(!isNaN(v)&&v>1000)ti=v;}if(row[9]){const v=parseFloat(row[9].replace(/,/g,''));if(!isNaN(v)&&v>1000)tr=v;}}});
    return{gid:sh.gid,name:sh.name,shortName:sh.shortName,icon:sh.icon,category:sh.category,totalInvoice:ti,totalReceived:tr,loaded:true};
  };

  const fl=sums.filter(s=>cat==='all'||s.category===cat);
  const ti=sums.reduce((a,b)=>a+b.totalInvoice,0);const tr=sums.reduce((a,b)=>a+b.totalReceived,0);const tp=ti-tr;const rate=ti>0?(tr/ti)*100:0;
  const wv=leads.filter(l=>l.status==='won').reduce((a,b)=>a+b.value,0);
  const ap=projects.filter(p=>p.status==='in_progress').length;
  const fmt=(n:number)=>{if(n>=1e7)return`₹${(n/1e7).toFixed(2)} Cr`;if(n>=1e5)return`₹${(n/1e5).toFixed(2)} L`;if(n>=1e3)return`₹${(n/1e3).toFixed(1)} K`;return`₹${n.toFixed(0)}`;};

  return(
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div><h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Dashboard</h1><p className="text-sm text-gray-400 mt-0.5">Overview of all operations • {SHEETS.length} project sheets</p></div>
        <div className="flex items-center gap-2 text-xs text-green-500 font-medium"><span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/> Live Data</div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {[{l:'Total Invoiced',v:fmt(ti),c:'text-blue-600 bg-blue-50 border-blue-100',i:'📄'},{l:'Total Received',v:fmt(tr),c:'text-green-600 bg-green-50 border-green-100',i:'✅'},{l:'Pending',v:fmt(tp),c:'text-amber-600 bg-amber-50 border-amber-100',i:'⏳'},{l:'Collection Rate',v:`${rate.toFixed(1)}%`,c:'text-violet-600 bg-violet-50 border-violet-100',i:'📈'},{l:'Won Deals',v:fmt(wv),c:'text-emerald-600 bg-emerald-50 border-emerald-100',i:'🏆'},{l:'Active Projects',v:String(ap),c:'text-sky-600 bg-sky-50 border-sky-100',i:'🚧'}].map((s,i)=>(
          <div key={i} className={`st3d cd ${s.c} p-4`}><div className="flex items-start justify-between"><div><p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{s.l}</p><p className={`text-xl font-extrabold ${s.c.split(' ')[0]} mt-1`}>{loading&&i<4?<span className="sk inline-block w-20 h-6"/>:s.v}</p></div><span className="text-xl">{s.i}</span></div></div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="cd p-5 lg:col-span-2">
          <h3 className="text-sm font-bold text-gray-800 mb-3">Recent Activity</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {history.slice(0,8).map(h=>(
              <div key={h.id} className="flex items-center gap-3 text-xs py-1.5 border-b border-gray-50 last:border-0">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0 ${h.action==='login'?'bg-green-50 text-green-600':h.action==='edit_cell'?'bg-amber-50 text-amber-600':'bg-blue-50 text-blue-600'}`}>
                  {h.action==='login'?'🔑':h.action==='edit_cell'?'✏️':h.action==='add_lead'?'🤝':'📋'}
                </span>
                <div className="min-w-0 flex-1"><p className="text-gray-700 font-medium truncate">{h.detail}</p><p className="text-gray-400">{h.userName} • {h.department}</p></div>
                <span className="text-gray-300 shrink-0">{new Date(h.timestamp).toLocaleDateString()}</span>
              </div>
            ))}
            {history.length===0&&<p className="text-gray-300 text-center py-6">No activity yet</p>}
          </div>
        </div>
        <div className="cd p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-3">Lead Pipeline</h3>
          <div className="space-y-2">
            {['new','contacted','qualified','proposal','negotiation','won','lost'].map(st=>{
              const cnt=leads.filter(l=>l.status===st).length;
              const cl:Record<string,string>={new:'bg-blue-100 text-blue-700',contacted:'bg-sky-100 text-sky-700',qualified:'bg-indigo-100 text-indigo-700',proposal:'bg-violet-100 text-violet-700',negotiation:'bg-amber-100 text-amber-700',won:'bg-green-100 text-green-700',lost:'bg-red-100 text-red-700'};
              return <div key={st} className="flex items-center justify-between text-xs py-1"><span className={`bg-badge ${cl[st]||'bg-gray-100 text-gray-600'}`}>{st.charAt(0).toUpperCase()+st.slice(1)}</span><span className="font-bold text-gray-700">{cnt}</span></div>;
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">{CATEGORIES.map(c=><button key={c.key} onClick={()=>setCat(c.key)} className={`tp ${cat===c.key?'on':''}`}>{c.icon} {c.label}</button>)}</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {loading?Array.from({length:12}).map((_,i)=><div key={i} className="cd p-4"><div className="sk w-full h-4 mb-3"/><div className="sk w-3/4 h-3 mb-2"/><div className="sk w-1/2 h-3"/></div>):fl.map(s=>(
          <div key={s.gid} className="cd cd-lift p-4 cursor-pointer group" onClick={()=>onSheetSelect(s.gid)}>
            <div className="flex items-start gap-3 mb-3"><span className="text-xl">{s.icon}</span><div className="min-w-0"><h4 className="text-sm font-semibold text-gray-800 truncate group-hover:text-indigo-600 transition">{s.shortName}</h4><p className="text-[10px] text-gray-400 truncate">{s.name}</p></div></div>
            {s.loaded&&s.totalInvoice>0?(<div className="space-y-1.5"><div className="flex justify-between text-xs"><span className="text-gray-400">Invoiced</span><span className="text-blue-600 font-mono font-semibold">{fmt(s.totalInvoice)}</span></div><div className="flex justify-between text-xs"><span className="text-gray-400">Received</span><span className="text-green-600 font-mono font-semibold">{fmt(s.totalReceived)}</span></div><div className="w-full bg-gray-100 rounded-full h-1.5 mt-1"><div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-1.5 rounded-full" style={{width:`${Math.min((s.totalReceived/s.totalInvoice)*100,100)}%`}}/></div></div>):<p className="text-xs text-gray-300">Click to view →</p>}
            <div className="mt-3 pt-2 border-t border-gray-50 flex items-center justify-between"><span className={`bg-badge text-[9px] ${s.category==='iocl'?'bg-orange-50 text-orange-600':s.category==='billing'?'bg-blue-50 text-blue-600':'bg-gray-50 text-gray-500'}`}>{s.category.toUpperCase()}</span><svg className="w-4 h-4 text-gray-200 group-hover:text-indigo-400 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></div>
          </div>
        ))}
      </div>
    </div>
  );
}
