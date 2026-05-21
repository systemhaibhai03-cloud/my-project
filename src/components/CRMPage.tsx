import { useState } from 'react';
import { CRMLead, getLeads, setLeads, addHistory, getCurUser, uid } from '../store';

const STS = ['new','contacted','qualified','proposal','negotiation','won','lost'] as const;
const SC: Record<string,string> = {new:'bg-blue-50 text-blue-700 border-blue-200',contacted:'bg-sky-50 text-sky-700 border-sky-200',qualified:'bg-indigo-50 text-indigo-700 border-indigo-200',proposal:'bg-violet-50 text-violet-700 border-violet-200',negotiation:'bg-amber-50 text-amber-700 border-amber-200',won:'bg-green-50 text-green-700 border-green-200',lost:'bg-red-50 text-red-700 border-red-200'};

export default function CRMPage() {
  const [leads,setL] = useState<CRMLead[]>(getLeads());
  const [view,setView] = useState<'pipeline'|'list'>('pipeline');
  const [el,setEl] = useState<CRMLead|null>(null);
  const [isNew,setIsNew] = useState(false);
  const [filter,setFilter] = useState('all');
  const user = getCurUser();
  const fmt=(n:number)=>{if(n>=1e7)return`₹${(n/1e7).toFixed(2)} Cr`;if(n>=1e5)return`₹${(n/1e5).toFixed(2)} L`;if(n>=1e3)return`₹${(n/1e3).toFixed(1)} K`;return`₹${n.toFixed(0)}`;};

  const save = (lead:CRMLead,add:boolean) => {
    let up:CRMLead[];
    if(add){up=[lead,...leads];if(user)addHistory({userId:user.id,userName:user.name,department:user.department,action:'add_lead',detail:`Added lead: ${lead.company}`});}
    else{up=leads.map(l=>l.id===lead.id?lead:l);if(user)addHistory({userId:user.id,userName:user.name,department:user.department,action:'edit_lead',detail:`Updated lead: ${lead.company}`});}
    setL(up);setLeads(up);setEl(null);setIsNew(false);
  };

  const fl = filter==='all'?leads:leads.filter(l=>l.status===filter);
  const tv = leads.reduce((a,b)=>a+b.value,0);
  const wv = leads.filter(l=>l.status==='won').reduce((a,b)=>a+b.value,0);

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div><h1 className="text-2xl font-extrabold text-gray-900">CRM Dashboard</h1><p className="text-sm text-gray-400 mt-0.5">{leads.length} leads • Pipeline {fmt(tv)}</p></div>
        <button onClick={()=>{setEl({id:uid(),company:'',contact:'',phone:'',email:'',source:'',status:'new',value:0,notes:'',assignedTo:user?.name||'',createdAt:new Date().toISOString().slice(0,10),updatedAt:new Date().toISOString().slice(0,10)});setIsNew(true);}}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow shadow-indigo-200 hover:bg-indigo-700 transition flex items-center gap-1.5 self-start">+ Add Lead</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[{l:'Total Leads',v:String(leads.length),c:'text-blue-600 bg-blue-50 border-blue-100'},{l:'Won Value',v:fmt(wv),c:'text-green-600 bg-green-50 border-green-100'},{l:'In Pipeline',v:fmt(tv-wv),c:'text-amber-600 bg-amber-50 border-amber-100'},{l:'Win Rate',v:leads.length>0?`${((leads.filter(l=>l.status==='won').length/leads.length)*100).toFixed(0)}%`:'0%',c:'text-violet-600 bg-violet-50 border-violet-100'}].map((s,i)=>(
          <div key={i} className={`st3d cd p-4 border ${s.c}`}><p className="text-[10px] text-gray-400 font-bold uppercase">{s.l}</p><p className={`text-xl font-extrabold mt-1 ${s.c.split(' ')[0]}`}>{s.v}</p></div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button onClick={()=>setView('pipeline')} className={`tp ${view==='pipeline'?'on':''}`}>🔲 Pipeline</button>
        <button onClick={()=>setView('list')} className={`tp ${view==='list'?'on':''}`}>📋 List</button>
        <div className="flex-1"/>
        <div className="flex gap-1 overflow-x-auto">
          <button onClick={()=>setFilter('all')} className={`tp ${filter==='all'?'on':''}`}>All</button>
          {STS.map(s=><button key={s} onClick={()=>setFilter(s)} className={`tp ${filter===s?'on':''}`}>{s.charAt(0).toUpperCase()+s.slice(1)}</button>)}
        </div>
      </div>

      {view==='pipeline'?(
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {STS.map(st=>{const items=leads.filter(l=>l.status===st);return(
            <div key={st} className="space-y-2">
              <div className={`text-center py-2 rounded-xl text-xs font-bold border ${SC[st]}`}>{st.charAt(0).toUpperCase()+st.slice(1)} ({items.length})</div>
              {items.map(l=><div key={l.id} className="cd p-3 cursor-pointer hover:shadow-md transition" onClick={()=>{setEl(l);setIsNew(false);}}>
                <p className="text-xs font-semibold text-gray-800 truncate">{l.company}</p>
                <p className="text-[10px] text-gray-400 truncate">{l.contact}</p>
                <p className="text-xs font-bold text-indigo-600 mt-1">{fmt(l.value)}</p>
              </div>)}
            </div>
          );})}
        </div>
      ):(
        <div className="cd overflow-hidden"><div className="overflow-x-auto"><table className="tb">
          <thead><tr><th>Company</th><th>Contact</th><th>Phone</th><th>Status</th><th>Value</th><th>Source</th><th>Updated</th><th></th></tr></thead>
          <tbody>{fl.map(l=><tr key={l.id} className="ptr" onClick={()=>{setEl(l);setIsNew(false);}}>
            <td className="font-semibold text-gray-800">{l.company}</td><td>{l.contact}</td><td className="font-mono">{l.phone}</td>
            <td><span className={`bg-badge border ${SC[l.status]}`}>{l.status}</span></td>
            <td className="text-right font-mono font-semibold text-indigo-600">{fmt(l.value)}</td><td>{l.source}</td><td className="text-gray-400">{l.updatedAt}</td>
            <td><svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></td>
          </tr>)}</tbody>
        </table></div></div>
      )}

      {el && <LeadModal lead={el} isNew={isNew} onSave={save} onClose={()=>{setEl(null);setIsNew(false);}} />}
    </div>
  );
}

function LeadModal({lead,isNew,onSave,onClose}:{lead:CRMLead;isNew:boolean;onSave:(l:CRMLead,n:boolean)=>void;onClose:()=>void}){
  const [f,setF]=useState<CRMLead>(lead);
  const up=(k:keyof CRMLead,v:string|number)=>setF({...f,[k]:v,updatedAt:new Date().toISOString().slice(0,10)});
  return(
    <div className="md-bg" onClick={onClose}><div className="md-box max-w-lg" onClick={e=>e.stopPropagation()}>
      <div className="flex items-center justify-between mb-5"><h2 className="text-lg font-bold text-gray-900">{isNew?'Add Lead':'Edit Lead'}</h2><button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500">✕</button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[{k:'company',l:'Company',t:'text'},{k:'contact',l:'Contact Person',t:'text'},{k:'phone',l:'Phone',t:'tel'},{k:'email',l:'Email',t:'email'},{k:'source',l:'Source',t:'text'},{k:'assignedTo',l:'Assigned To',t:'text'}].map(x=>(
          <div key={x.k}><label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">{x.l}</label>
          <input type={x.t} value={String(f[x.k as keyof CRMLead])} onChange={e=>up(x.k as keyof CRMLead,e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"/></div>
        ))}
        <div><label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Value (₹)</label><input type="number" value={f.value} onChange={e=>up('value',parseFloat(e.target.value)||0)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"/></div>
        <div><label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Status</label><select value={f.status} onChange={e=>up('status',e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 bg-white">{STS.map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}</select></div>
        <div className="md:col-span-2"><label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Notes</label><textarea value={f.notes} onChange={e=>up('notes',e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 resize-none"/></div>
      </div>
      <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-gray-100">
        <button onClick={onClose} className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-gray-200 transition">Cancel</button>
        <button onClick={()=>onSave(f,isNew)} className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow shadow-indigo-200 hover:bg-indigo-700 transition">{isNew?'Create Lead':'Save Changes'}</button>
      </div>
    </div></div>
  );
}
