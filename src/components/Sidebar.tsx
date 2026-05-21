import { useState } from 'react';
import { SHEETS, CATEGORIES } from '../sheetsConfig';
import { User, getDepts, Department } from '../store';

export type TabKey = 'dashboard'|'account'|'project'|'crm'|'history'|'settings'|'sheet';

interface Props {
  user: User; activeTab: TabKey; activeSheet: string;
  onTabChange: (t: TabKey) => void; onSheetSelect: (g: string) => void;
  open: boolean; onToggle: () => void; collapsed: boolean; onCollapse: () => void; onLogout: () => void;
}

export default function Sidebar({ user, activeTab, activeSheet, onTabChange, onSheetSelect, open, onToggle, collapsed, onCollapse, onLogout }: Props) {
  const [cat, setCat] = useState('all');
  const [q, setQ] = useState('');
  const [sOpen, setSOpen] = useState(false);
  const depts: Department[] = getDepts();

  const nav: { key: TabKey; label: string; icon: string }[] = [
    { key:'dashboard', label:'Dashboard', icon:'📊' },
    { key:'account', label:'Account', icon:'💰' },
    { key:'project', label:'Projects', icon:'📋' },
    { key:'crm', label:'CRM', icon:'🤝' },
    { key:'history', label:'Change History', icon:'🕑' },
    { key:'settings', label:'Settings', icon:'⚙️' },
  ];

  const filtered = SHEETS.filter(s => {
    const mc = cat==='all' || s.category===cat;
    const ms = s.name.toLowerCase().includes(q.toLowerCase()) || s.shortName.toLowerCase().includes(q.toLowerCase());
    return mc && ms;
  });

  const close = () => { if (window.innerWidth<768) onToggle(); };

  return (
    <>
      <div className={`ov ${open?'on':''} md:hidden`} onClick={onToggle} />
      <aside className={`sb ${collapsed?'col':''} ${open?'mob':''}`}>
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow shadow-indigo-200">VE</div>
          {!collapsed && <div className="min-w-0 flex-1"><h1 className="text-sm font-bold text-gray-900 truncate">Vishal Electricals</h1><p className="text-[10px] text-gray-400">ERP Dashboard</p></div>}
          <button onClick={onCollapse} className="text-gray-400 hover:text-gray-600 hidden md:block shrink-0 p-1 rounded-lg hover:bg-gray-100 transition">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">{collapsed?<path d="M9 18l6-6-6-6"/>:<path d="M15 18l-6-6 6-6"/>}</svg>
          </button>
          <button onClick={onToggle} className="text-gray-400 hover:text-gray-600 md:hidden shrink-0 p-1">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-2">
          {!collapsed && <p className="px-5 pt-2 pb-1 text-[10px] uppercase tracking-widest text-gray-300 font-bold">Navigation</p>}
          {nav.map(n => (
            <button key={n.key} onClick={()=>{onTabChange(n.key);close()}} className={`sb-link w-full text-left ${activeTab===n.key && !activeSheet?'on':''}`} title={n.label}>
              <span className="text-base shrink-0">{n.icon}</span>{!collapsed && <span>{n.label}</span>}
            </button>
          ))}

          {/* Custom departments */}
          {depts.filter((d: Department) => !['Account','Project','CRM'].includes(d.name)).length > 0 && (
            <>
              {!collapsed && <p className="px-5 pt-4 pb-1 text-[10px] uppercase tracking-widest text-gray-300 font-bold">Departments</p>}
              {depts.filter((d: Department) => !['Account','Project','CRM'].includes(d.name)).map((d: Department) => (
                <button key={d.id} onClick={()=>{onTabChange('dashboard');close()}} className="sb-link w-full text-left" title={d.name}>
                  <span className="text-base shrink-0">{d.icon}</span>{!collapsed && <span>{d.name}</span>}
                </button>
              ))}
            </>
          )}

          {/* Sheets */}
          {!collapsed && (
            <>
              <button onClick={()=>setSOpen(!sOpen)} className="sb-link w-full text-left mt-1 group">
                <span className="text-base shrink-0">📑</span><span className="flex-1">Google Sheets</span>
                <svg className={`w-4 h-4 text-gray-300 transition ${sOpen?'rotate-180':''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
              </button>
              {sOpen && (
                <div className="pl-2 pr-1">
                  <div className="px-2 py-1.5">
                    <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search sheets…"
                      className="w-full px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs placeholder-gray-300 focus:outline-none focus:border-indigo-300 text-gray-700" />
                  </div>
                  <div className="flex gap-1 px-2 pb-1 flex-wrap">
                    {CATEGORIES.map(c => (
                      <button key={c.key} onClick={()=>setCat(c.key)} className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition ${cat===c.key?'bg-indigo-100 text-indigo-600':'text-gray-400 hover:bg-gray-50'}`}>{c.label}</button>
                    ))}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {filtered.map(s => (
                      <button key={s.gid} onClick={()=>{onSheetSelect(s.gid);close()}} className={`sb-link w-full text-left text-xs py-1.5 ${activeSheet===s.gid?'on':''}`} title={s.name}>
                        <span className="text-sm shrink-0">{s.icon}</span><span className="truncate">{s.shortName}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          {collapsed && <button onClick={()=>{setSOpen(true);onCollapse()}} className="sb-link w-full text-left" title="Sheets"><span className="text-base shrink-0">📑</span></button>}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">{user.avatar}</div>
            {!collapsed && <div className="min-w-0 flex-1"><p className="text-xs font-semibold text-gray-800 truncate">{user.name}</p><p className="text-[10px] text-gray-400 truncate">{user.department}</p></div>}
            {!collapsed && <button onClick={onLogout} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition shrink-0" title="Logout"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg></button>}
          </div>
        </div>
      </aside>
    </>
  );
}
