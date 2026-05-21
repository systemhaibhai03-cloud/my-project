import { SheetData, isUrl, isNumeric, formatCurrency } from '../csvParser';

interface Props {
  data:SheetData; rowIndex:number; sheetName:string;
  onClose:()=>void; editable:boolean;
  onCellEdit?:(r:number,c:number,v:string)=>void;
}

export default function DetailModal({data,rowIndex,sheetName,onClose,editable,onCellEdit}:Props) {
  const row=data.rows[rowIndex];
  if(!row)return null;
  return(
    <div className="md-bg" onClick={onClose}>
      <div className="md-box" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div><h2 className="text-lg font-bold text-gray-900">Record Detail</h2><p className="text-xs text-gray-400">{sheetName} — Row {rowIndex+1}</p></div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.headers.map((h,ci)=>{
            const v=row[ci]||'';
            if(!h.trim()&&!v.trim())return null;
            return(
              <div key={ci} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">{h||`Column ${ci+1}`}</label>
                {editable?<input defaultValue={v} onBlur={e=>onCellEdit?.(rowIndex,ci,e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"/>
                :isUrl(v)?<a href={v} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:text-indigo-700 text-sm underline flex items-center gap-1">📎 Open Document</a>
                :isNumeric(v)?<div><p className="text-gray-800 text-sm font-mono">{v}</p>{parseFloat(v.replace(/,/g,''))>100&&<p className="text-[10px] text-gray-400 mt-0.5">{formatCurrency(v)}</p>}</div>
                :<p className="text-gray-800 text-sm">{v||'—'}</p>}
              </div>
            );
          })}
        </div>
        <div className="flex justify-end mt-6 pt-4 border-t border-gray-100"><button onClick={onClose} className="px-5 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition">Close</button></div>
      </div>
    </div>
  );
}
