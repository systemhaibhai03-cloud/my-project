import { useState, useCallback } from 'react';
import { SheetData, isUrl, isNumeric } from '../csvParser';

interface Props {
  data: SheetData; editable?: boolean;
  onCellEdit?: (r:number,c:number,v:string) => void;
  onRowClick?: (r:number) => void;
}

export default function DataTable({data,editable=false,onCellEdit,onRowClick}:Props) {
  const [ec,setEc]=useState<{r:number;c:number}|null>(null);
  const [ev,setEv]=useState('');
  const start=useCallback((r:number,c:number,v:string)=>{if(!editable)return;setEc({r,c});setEv(v);},[editable]);
  const save=useCallback(()=>{if(ec&&onCellEdit)onCellEdit(ec.r,ec.c,ev);setEc(null);},[ec,ev,onCellEdit]);

  if(!data||data.headers.length===0) return(
    <div className="flex flex-col items-center justify-center py-16 text-gray-300">
      <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
      <p className="text-sm">No data available</p>
    </div>
  );

  const vis=data.headers.map((h,i)=>h.trim()!==''||data.rows.some(r=>r[i]&&r[i].trim()!==''));

  return(
    <div className="overflow-x-auto">
      <table className="tb">
        <thead><tr>
          {data.headers.map((h,i)=>vis[i]?<th key={i}>{h||`Col ${i+1}`}</th>:null)}
          {editable&&<th style={{width:40}}></th>}
        </tr></thead>
        <tbody>
          {data.rows.map((row,ri)=>{
            if(row.every(c=>!c||!c.trim()))return null;
            const tot=row[0]?.toLowerCase().includes('total')||row[3]?.toLowerCase().includes('total');
            return <tr key={ri} className={`${onRowClick?'ptr':''} ${tot?'font-semibold bg-indigo-50/50':''}`} onClick={()=>onRowClick?.(ri)}>
              {row.map((cell,ci)=>vis[ci]?<td key={ci} className={`${editable?'ec':''} ${isNumeric(cell)?'text-right font-mono':''} ${tot?'text-indigo-700':''}`} onDoubleClick={()=>start(ri,ci,cell)}>
                {ec?.r===ri&&ec?.c===ci?<input autoFocus value={ev} onChange={e=>setEv(e.target.value)} onBlur={save} onKeyDown={e=>{if(e.key==='Enter')save();if(e.key==='Escape')setEc(null);}} className="ei"/>
                :isUrl(cell)?<a href={cell} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:text-indigo-700 text-xs underline" onClick={e=>e.stopPropagation()}>📎 View</a>
                :cell}
              </td>:null)}
              {editable&&<td className="text-center"><button onClick={e=>{e.stopPropagation();start(ri,0,row[0]);}} className="text-gray-300 hover:text-indigo-500 transition"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button></td>}
            </tr>;
          })}
        </tbody>
      </table>
    </div>
  );
}
