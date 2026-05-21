import { useState, useEffect, useCallback, useMemo } from 'react';
import { SHEETS, getSheetEditUrl } from '../sheetsConfig';
import { fetchSheetData, SheetData } from '../csvParser';
import { addHistory, getCurUser } from '../store';
import DataTable from './DataTable';
import DetailModal from './DetailModal';

export default function SheetView({ gid }: { gid: string }) {
  const [data, setData] = useState<SheetData|null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [edit, setEdit] = useState(false);
  const [detail, setDetail] = useState<number|null>(null);
  const [q, setQ] = useState('');
  const [rk, setRk] = useState(0);
  const sheet = SHEETS.find(s=>s.gid===gid);
  const user = getCurUser();

  useEffect(() => { load(); }, [gid, rk]);
  const load = async () => {
    setLoading(true); setError(null); setQ(''); setDetail(null); setEdit(false);
    try { const r = await fetchSheetData(gid); setData(r);
      if(user) addHistory({userId:user.id,userName:user.name,department:user.department,action:'view_sheet',detail:`Viewed ${sheet?.shortName||gid}`,sheetGid:gid});
    } catch(e) { setError(e instanceof Error?e.message:'Failed'); } setLoading(false);
  };

  const onEdit = useCallback((row:number,col:number,val:string)=>{
    if(!data) return;
    const nr=[...data.rows]; const nc=[...nr[row]]; nc[col]=val; nr[row]=nc; setData({...data,rows:nr});
    if(user) addHistory({userId:user.id,userName:user.name,department:user.department,action:'edit_cell',detail:`Edited cell [${row+1},${col+1}] in ${sheet?.shortName||gid}`,sheetGid:gid});
  },[data,user,sheet,gid]);

  const fd: SheetData|null = data?{...data,rows:q?data.rows.filter(r=>r.some(c=>c.toLowerCase().includes(q.toLowerCase()))):data.rows}:null;

  const stats = useMemo(()=>{
    if(!data) return null;
    let ti=0,tr=0;
    data.rows.forEach(row=>{
      if(row[0]?.toLowerCase().includes('total')||row[3]?.toLowerCase().includes('total')){
        if(row[6]){const v=parseFloat(row[6].replace(/,/g,''));if(!isNaN(v)&&v>100) ti=v;}
        if(row[9]){const v=parseFloat(row[9].replace(/,/g,''));if(!isNaN(v)&&v>100) tr=v;}
      }
    });
    return {rows:data.rows.filter(r=>r.some(c=>c.trim())).length,ti,tr,pen:ti-tr,rate:ti>0?(tr/ti)*100:0};
  },[data]);

  const fmt=(n:number)=>{if(n>=1e7)return`₹${(n/1e7).toFixed(2)} Cr`;if(n>=1e5)return`₹${(n/1e5).toFixed(2)} L`;if(n>=1e3)return`₹${(n/1e3).toFixed(1)} K`;return`₹${n.toFixed(0)}`;};

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl">{sheet?.icon||'📄'}</div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{sheet?.name||'Sheet'}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-gray-400 font-mono">GID: {gid}</span>
              <span className="text-gray-200">•</span>
              <span className="text-[10px] text-gray-400">{stats?`${stats.rows} records`:'Loading…'}</span>
              <span className={`bg-badge text-[9px] ${sheet?.category==='iocl'?'bg-orange-50 text-orange-600':sheet?.category==='billing'?'bg-blue-50 text-blue-600':'bg-gray-50 text-gray-500'}`}>{sheet?.category?.toUpperCase()}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search…" className="pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 w-40 md:w-48" />
          </div>
          <button onClick={()=>setEdit(!edit)} className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 border ${edit?'bg-amber-50 text-amber-700 border-amber-200':'bg-gray-50 text-gray-500 border-gray-200 hover:border-indigo-200 hover:text-indigo-600'}`}>✏️ {edit?'Editing':'Edit'}</button>
          <button onClick={()=>setRk(k=>k+1)} className="px-3 py-2 rounded-xl text-xs font-semibold bg-gray-50 text-gray-500 border border-gray-200 hover:border-indigo-200 hover:text-indigo-600 transition flex items-center gap-1.5">
            <svg className={`w-3.5 h-3.5 ${loading?'animate-spin':''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>Refresh</button>
          <a href={getSheetEditUrl(gid)} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-xl text-xs font-semibold bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>Google Sheet</a>
        </div>
      </div>

      {stats && stats.ti>0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[{l:'Total Invoiced',v:fmt(stats.ti),c:'text-blue-600 bg-blue-50 border-blue-100'},{l:'Total Received',v:fmt(stats.tr),c:'text-green-600 bg-green-50 border-green-100'},{l:'Pending',v:fmt(stats.pen),c:'text-amber-600 bg-amber-50 border-amber-100'},{l:'Collection %',v:`${stats.rate.toFixed(1)}%`,c:'text-violet-600 bg-violet-50 border-violet-100'}].map((s,i)=>(
            <div key={i} className={`cd p-3 border ${s.c}`}><p className="text-[10px] text-gray-400 font-bold uppercase">{s.l}</p><p className={`text-lg font-extrabold font-mono mt-0.5 ${s.c.split(' ')[0]}`}>{s.v}</p></div>
          ))}
        </div>
      )}

      {edit && <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200"><span className="text-amber-500">⚠️</span><p className="text-xs text-amber-700"><strong>Edit Mode</strong> — Double-click cells to edit. Click rows for detail. Changes are local only.</p></div>}

      {loading ? <div className="cd p-6 space-y-2">{Array.from({length:8}).map((_,i)=><div key={i} className="sk h-10 w-full" style={{animationDelay:`${i*.1}s`}}/>)}</div>
      : error ? <div className="cd p-10 text-center"><p className="text-4xl mb-3">⚠️</p><h3 className="text-lg font-bold text-red-500 mb-1">Error Loading Data</h3><p className="text-sm text-gray-400 mb-4">{error}</p><button onClick={load} className="px-5 py-2 rounded-xl bg-indigo-50 text-indigo-600 text-sm font-semibold hover:bg-indigo-100 transition">↻ Retry</button></div>
      : fd ? <div className="cd overflow-hidden">{q && <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 text-xs text-gray-400">Found {fd.rows.filter(r=>r.some(c=>c.trim())).length} results for "{q}"</div>}<DataTable data={fd} editable={edit} onCellEdit={onEdit} onRowClick={ri=>setDetail(ri)}/></div> : null}

      {detail!==null && fd && <DetailModal data={fd} rowIndex={detail} sheetName={sheet?.name||'Sheet'} onClose={()=>setDetail(null)} editable={edit} onCellEdit={onEdit}/>}
    </div>
  );
}
