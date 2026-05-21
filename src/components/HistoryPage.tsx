import { useState } from 'react';
import { getHistory, ChangeRecord } from '../store';

const AM:Record<string,{label:string;icon:string;color:string}>={
  login:{label:'Login',icon:'🔑',color:'bg-green-50 text-green-700'},
  logout:{label:'Logout',icon:'🚪',color:'bg-gray-100 text-gray-600'},
  edit_cell:{label:'Cell Edit',icon:'✏️',color:'bg-amber-50 text-amber-700'},
  view_sheet:{label:'View Sheet',icon:'👁️',color:'bg-blue-50 text-blue-700'},
  add_department:{label:'Add Dept',icon:'🏢',color:'bg-violet-50 text-violet-700'},
  add_user:{label:'Add User',icon:'👤',color:'bg-indigo-50 text-indigo-700'},
  add_lead:{label:'Add Lead',icon:'🤝',color:'bg-emerald-50 text-emerald-700'},
  edit_lead:{label:'Edit Lead',icon:'📝',color:'bg-orange-50 text-orange-700'},
  add_project:{label:'Add Project',icon:'📋',color:'bg-sky-50 text-sky-700'},
  edit_project:{label:'Edit Project',icon:'🔧',color:'bg-teal-50 text-teal-700'},
};

export default function HistoryPage() {
  const [history]=useState<ChangeRecord[]>(getHistory());
  const [filter,setFilter]=useState('all');
  const [q,setQ]=useState('');
  const acts=Array.from(new Set(history.map(h=>h.action)));
  const fl=history.filter(h=>{
    const fa=filter==='all'||h.action===filter;
    const fs=!q||h.detail.toLowerCase().includes(q.toLowerCase())||h.userName.toLowerCase().includes(q.toLowerCase())||h.department.toLowerCase().includes(q.toLowerCase());
    return fa&&fs;
  });

  return(
    <div className="p-4 md:p-6 space-y-5">
      <div><h1 className="text-2xl font-extrabold text-gray-900">Change History</h1><p className="text-sm text-gray-400 mt-0.5">{history.length} total actions tracked</p></div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search history…" className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"/>
        </div>
        <button onClick={()=>setFilter('all')} className={`tp ${filter==='all'?'on':''}`}>All</button>
        {acts.map(a=><button key={a} onClick={()=>setFilter(a)} className={`tp ${filter===a?'on':''}`}>{AM[a]?.icon||'📌'} {AM[a]?.label||a}</button>)}
      </div>
      <div className="cd overflow-hidden"><div className="overflow-x-auto"><table className="tb">
        <thead><tr><th>Action</th><th>Detail</th><th>User</th><th>Department</th><th>Date & Time</th></tr></thead>
        <tbody>
          {fl.length===0?<tr><td colSpan={5} className="text-center py-12 text-gray-300">No history records found</td></tr>:fl.map(h=>{
            const m=AM[h.action]||{label:h.action,icon:'📌',color:'bg-gray-100 text-gray-600'};
            return <tr key={h.id}>
              <td><span className={`bg-badge border ${m.color}`}>{m.icon} {m.label}</span></td>
              <td className="max-w-xs truncate text-gray-700 font-medium">{h.detail}</td>
              <td>{h.userName}</td>
              <td><span className="bg-badge bg-gray-50 text-gray-600 border border-gray-200">{h.department}</span></td>
              <td className="text-gray-400 text-xs">{new Date(h.timestamp).toLocaleString()}</td>
            </tr>;
          })}
        </tbody>
      </table></div></div>
    </div>
  );
}
