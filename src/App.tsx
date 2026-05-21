import { useState, useEffect } from 'react';
import { User, getCurUser, setCurUser, addHistory } from './store';
import LoginPage from './components/LoginPage';
import Sidebar, { TabKey } from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import AccountPage from './components/AccountPage';
import ProjectsPage from './components/ProjectsPage';
import CRMPage from './components/CRMPage';
import HistoryPage from './components/HistoryPage';
import SettingsPage from './components/SettingsPage';
import SheetView from './components/SheetView';

export default function App() {
  const [user, setUser] = useState<User|null>(getCurUser());
  const [tab, setTab] = useState<TabKey>('dashboard');
  const [sheet, setSheet] = useState('');
  const [sbOpen, setSbOpen] = useState(false);
  const [sbCol, setSbCol] = useState(false);
  const [mob, setMob] = useState(false);

  useEffect(() => {
    const c = () => { setMob(window.innerWidth<768); if(window.innerWidth<768) setSbCol(false); };
    c(); window.addEventListener('resize',c); return ()=>window.removeEventListener('resize',c);
  }, []);

  if (!user) return <LoginPage onLogin={u => { setUser(u); setCurUser(u); }} />;

  const logout = () => {
    addHistory({ userId:user.id, userName:user.name, department:user.department, action:'logout', detail:`${user.name} logged out` });
    setUser(null); setCurUser(null); setTab('dashboard'); setSheet('');
  };

  const goSheet = (g: string) => { setSheet(g); setTab('sheet'); if(mob) setSbOpen(false); };
  const goTab = (t: TabKey) => { setTab(t); setSheet(''); };

  const content = () => {
    if (sheet) return <SheetView gid={sheet} />;
    switch(tab) {
      case 'dashboard': return <DashboardOverview onSheetSelect={goSheet} />;
      case 'account': return <AccountPage onSheetSelect={goSheet} />;
      case 'project': return <ProjectsPage onSheetSelect={goSheet} />;
      case 'crm': return <CRMPage />;
      case 'history': return <HistoryPage />;
      case 'settings': return <SettingsPage />;
      default: return <DashboardOverview onSheetSelect={goSheet} />;
    }
  };

  return (
    <div className="min-h-screen" style={{background:'var(--bg)'}}>
      <Sidebar user={user} activeTab={tab} activeSheet={sheet} onTabChange={goTab} onSheetSelect={goSheet}
        open={sbOpen} onToggle={()=>setSbOpen(!sbOpen)} collapsed={sbCol} onCollapse={()=>setSbCol(!sbCol)} onLogout={logout} />

      {mob && (
        <header className="fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur border-b border-gray-100 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={()=>setSbOpen(true)} className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-[10px] font-bold shadow shadow-indigo-200">VE</div>
              <div>
                <p className="text-sm font-bold text-gray-900 leading-tight">{sheet?'Sheet View':tab.charAt(0).toUpperCase()+tab.slice(1)}</p>
                <p className="text-[9px] text-gray-400">Vishal Electricals</p>
              </div>
            </div>
          </div>
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-bold">{user.avatar}</div>
        </header>
      )}

      <main className={`mn ${sbCol?'col':''} ${mob?'pt-14':''}`}>{content()}</main>
    </div>
  );
}
