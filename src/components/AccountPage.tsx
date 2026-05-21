import { useState, useEffect } from 'react';
import { SHEETS, CATEGORIES } from '../sheetsConfig';
import { fetchSheetData, SheetData } from '../csvParser';
import { getDepts, getUsers, getLeads, getProjects, getHistory, Department } from '../store';

interface SS { gid:string;name:string;shortName:string;icon:string;category:string;totalInvoice:number;totalReceived:number;loaded:boolean; }

export default function AccountPage({onSheetSelect}:{onSheetSelect:(g:string)=>void}) {
  const [sums,setSums]=useState<SS[]>([]);
  const [loading,setLoading]=useState(true);
  const [cat,setCat]=useState('all');
  const [vt,setVt]=useState<'sheets'|'departments'>('sheets');
  const depts=getDepts(); const users=getUsers(); const leads=getLeads(); const projects=getProjects(); const history=getHistory();

  useEffect(()=>{loadAll();},[]);
  const loadAll=async()=>{
    setLoading(true);
    const billing=SHEETS.filter(s=>['billing','iocl','other'].includes(s.category)).slice(0,20);
    const results:SS[]=[];
    const settled=await Promise.allSettled(billing.map(async s=>{
      try{const d=await fetchSheetData(s.gid);return ext(d,s);}catch{return{gid:s.gid,name:s.name,shortName:s.shortName,icon:s.icon,category:s.category,totalInvoice:0,totalReceived:0,loaded:false};}
    }));
    settled.forEach(r=>{if(r.status==='fulfilled'&&r.value)results.push(r.value);});
    SHEETS.forEach(s=>{if(!results.find(r=>r.gid===s.gid))results.push({gid:s.gid,name:s.name,shortName:s.shortName,icon:s.icon,category:s.category,totalInvoice:0,totalReceived:0,loaded:false});});
    setSums(results);setLoading(false);
  };
  const ext=(data:SheetData,sh:typeof SHEETS[0]):SS=>{
    let ti=0,tr=0;
    data.rows.forEach(row=>{if(row[0]?.toLowerCase().includes('total')||row[3]?.toLowerCase().includes('total')){if(row[6]){const v=parseFloat(row[6].replace(/,/g,''));if(!isNaN(v)&&v>1000)ti=v;}if(row[9]){const v=parseFloat(row[9].replace(/,/g,''));if(!isNaN(v)&&v>1000)tr=v;}}});
    return{gid:sh.gid,name:sh.name,shortName:sh.shortName,icon:sh.icon,category:sh.category,totalInvoice:ti,totalReceived:tr,loaded:true};
  };

  const fl=sums.filter(s=>cat==='all'||s.category===cat);
  const ti=sums.reduce((a,b)=>a+b.totalInvoice,0);const tr=sums.reduce((a,b)=>a+b.totalReceived,0);
  const fmt=(n:number)=>{if(n>=1e7)return`₹${(n/1e7).toFixed(2)} Cr`;if(n>=1e5)return`₹${(n/1e5).toFixed(2)} L`;return`₹${(n/1e3).toFixed(1)} K`;};

  return(
    <div className="p-4 md:p-6 space-y-5">
      <div><h1 className="text-2xl font-extrabold text-gray-900">Account Overview</h1><p className="text-sm text-gray-400 mt-0.5">Complete view of all departments, sheets & data</p></div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[{l:'Invoiced',v:fmt(ti),c:'text-blue-600 bg-blue-50 border-blue-100',i:'📄'},{l:'Received',v:fmt(tr),c:'text-green-600 bg-green-50 border-green-100',i:'✅'},{l:'Pending',v:fmt(ti-tr),c:'text-amber-600 bg-amber-50 border-amber-100',i:'⏳'},{l:'Departments',v:String(depts.length),c:'text-violet-600 bg-violet-50 border-violet-100',i:'🏢'},{l:'Users',v:String(users.length),c:'text-sky-600 bg-sky-50 border-sky-100',i:'👤'},{l:'CRM Leads',v:String(leads.length),c:'text-emerald-600 bg-emerald-50 border-emerald-100',i:'🤝'}].map((s,i)=>(
          <div key={i} className={`st3d cd p-4 border ${s.c}`}><div className="flex items-start justify-between"><div><p className="text-[10px] text-gray-400 font-bold uppercase">{s.l}</p><p className={`text-xl font-extrabold mt-1 ${s.c.split(' ')[0]}`}>{loading&&i<3?<span className="sk inline-block w-16 h-6"/>:s.v}</p></div><span className="text-lg">{s.i}</span></div></div>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={()=>setVt('sheets')} className={`tp ${vt==='sheets'?'on':''}`}>📑 All Sheets ({SHEETS.length})</button>
        <button onClick={()=>setVt('departments')} className={`tp ${vt==='departments'?'on':''}`}>🏢 Departments ({depts.length})</button>
      </div>

      {vt==='sheets'?(
        <>
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
        </>
      ):(
        <div className="space-y-4">
          {depts.map((d: Department)=>{const du=users.filter(u=>u.department===d.name);const dh=history.filter(h=>h.department===d.name).slice(0,5);return(
            <div key={d.id} className="cd p-5">
              <div className="flex items-start justify-between mb-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{background:d.color+'20'}}>{d.icon}</div><div><h3 className="text-base font-bold text-gray-900">{d.name}</h3><p className="text-xs text-gray-400">{du.length} users • Views: {d.allowedViews.includes('all')?'All':d.allowedViews.length+' sheets'}</p></div></div><div className="w-3 h-3 rounded-full" style={{background:d.color}}/></div>
              <div className="flex gap-2 mb-3 flex-wrap">{du.map(u=><div key={u.id} className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2.5 py-1.5 border border-gray-100"><div className="w-5 h-5 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center text-[8px] font-bold">{u.avatar}</div><span className="text-xs text-gray-700 font-medium">{u.name}</span></div>)}{du.length===0&&<p className="text-xs text-gray-300">No users</p>}</div>
              {dh.length>0&&<div className="border-t border-gray-50 pt-3"><p className="text-[10px] uppercase tracking-widest text-gray-300 font-bold mb-2">Recent Activity</p>{dh.map(h=><div key={h.id} className="flex items-center gap-2 text-xs py-1 text-gray-500"><span className="text-gray-300">{new Date(h.timestamp).toLocaleDateString()}</span><span className="text-gray-600">{h.detail}</span></div>)}</div>}
            </div>
          );})}
          <div className="cd p-5"><h3 className="text-base font-bold text-gray-900 mb-3">📋 All Projects</h3><div className="overflow-x-auto"><table className="tb"><thead><tr><th>Project</th><th>Client</th><th>Status</th><th>Value</th><th>Progress</th></tr></thead><tbody>{projects.map(p=><tr key={p.id}><td className="font-semibold text-gray-800">{p.name}</td><td>{p.client}</td><td><span className={`bg-badge border text-[10px] ${p.status==='in_progress'?'bg-amber-50 text-amber-700 border-amber-200':p.status==='completed'?'bg-green-50 text-green-700 border-green-200':'bg-gray-50 text-gray-600 border-gray-200'}`}>{p.status.replace('_',' ')}</span></td><td className="font-mono text-indigo-600 font-semibold">{fmt(p.value)}</td><td><div className="flex items-center gap-2"><div className="w-20 bg-gray-100 rounded-full h-1.5"><div className="bg-indigo-500 h-1.5 rounded-full" style={{width:`${p.progress}%`}}/></div><span className="text-xs text-gray-500">{p.progress}%</span></div></td></tr>)}</tbody></table></div></div>
          <div className="cd p-5"><h3 className="text-base font-bold text-gray-900 mb-3">🤝 CRM Leads</h3><div className="overflow-x-auto"><table className="tb"><thead><tr><th>Company</th><th>Contact</th><th>Status</th><th>Value</th></tr></thead><tbody>{leads.map(l=><tr key={l.id}><td className="font-semibold text-gray-800">{l.company}</td><td>{l.contact}</td><td><span className={`bg-badge border text-[10px] ${l.status==='won'?'bg-green-50 text-green-700 border-green-200':l.status==='lost'?'bg-red-50 text-red-700 border-red-200':'bg-blue-50 text-blue-600 border-blue-200'}`}>{l.status}</span></td><td className="font-mono text-indigo-600 font-semibold">{fmt(l.value)}</td></tr>)}</tbody></table></div></div>
        </div>
      )}
    </div>
  );
}
