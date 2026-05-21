import { useState } from 'react';
import { User, Department, getUsers, setUsers, getDepts, setDepts, addHistory, getCurUser, uid } from '../store';
import { SHEETS } from '../sheetsConfig';

export default function SettingsPage() {
  const [tab,setTab]=useState<'departments'|'users'>('departments');
  const [depts,setLocalD]=useState<Department[]>(getDepts());
  const [users,setLocalU]=useState<User[]>(getUsers());
  const [ed,setEd]=useState<Department|null>(null);
  const [eu,setEu]=useState<User|null>(null);
  const [newD,setNewD]=useState(false);
  const [newU,setNewU]=useState(false);
  const me=getCurUser();

  const saveD=(d:Department,add:boolean)=>{
    let up:Department[];
    if(add){up=[...depts,d];if(me)addHistory({userId:me.id,userName:me.name,department:me.department,action:'add_department',detail:`Added department: ${d.name}`});}
    else up=depts.map(x=>x.id===d.id?d:x);
    setLocalD(up);setDepts(up);setEd(null);setNewD(false);
  };
  const delD=(id:string)=>{const up=depts.filter(d=>d.id!==id);setLocalD(up);setDepts(up);};

  const saveU=(u:User,add:boolean)=>{
    let up:User[];
    if(add){up=[...users,u];if(me)addHistory({userId:me.id,userName:me.name,department:me.department,action:'add_user',detail:`Added user: ${u.name} (${u.department})`});}
    else up=users.map(x=>x.id===u.id?u:x);
    setLocalU(up);setUsers(up);setEu(null);setNewU(false);
  };
  const delU=(id:string)=>{if(id===me?.id)return;const up=users.filter(u=>u.id!==id);setLocalU(up);setUsers(up);};

  return(
    <div className="p-4 md:p-6 space-y-5">
      <div><h1 className="text-2xl font-extrabold text-gray-900">Settings</h1><p className="text-sm text-gray-400 mt-0.5">Manage departments, users & login credentials</p></div>
      <div className="flex gap-2"><button onClick={()=>setTab('departments')} className={`tp ${tab==='departments'?'on':''}`}>🏢 Departments</button><button onClick={()=>setTab('users')} className={`tp ${tab==='users'?'on':''}`}>👤 Users & Logins</button></div>

      {tab==='departments'&&(
        <div className="space-y-4">
          <div className="flex justify-end"><button onClick={()=>{setEd({id:uid(),name:'',icon:'🏢',color:'#6366f1',allowedViews:['all'],createdAt:new Date().toISOString()});setNewD(true);}} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow shadow-indigo-200 hover:bg-indigo-700 transition">+ Add Department</button></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {depts.map(d=>(
              <div key={d.id} className="cd p-5">
                <div className="flex items-start justify-between mb-3"><div className="flex items-center gap-2"><span className="text-2xl">{d.icon}</span><div><h3 className="text-sm font-bold text-gray-800">{d.name}</h3><p className="text-[10px] text-gray-400">Created {new Date(d.createdAt).toLocaleDateString()}</p></div></div><div className="w-4 h-4 rounded-full" style={{background:d.color}}/></div>
                <div className="text-xs text-gray-400 mb-3">Views: {d.allowedViews.includes('all')?'All Sheets':`${d.allowedViews.length} sheets`}</div>
                <div className="flex gap-2">
                  <button onClick={()=>{setEd(d);setNewD(false);}} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">Edit</button>
                  {!['Account','Project','CRM'].includes(d.name)&&<button onClick={()=>delD(d.id)} className="text-xs text-red-500 hover:text-red-700 font-medium">Delete</button>}
                </div>
              </div>
            ))}
          </div>
          {ed&&<DeptModal dept={ed} isNew={newD} onSave={saveD} onClose={()=>{setEd(null);setNewD(false);}}/>}
        </div>
      )}

      {tab==='users'&&(
        <div className="space-y-4">
          <div className="flex justify-end"><button onClick={()=>{setEu({id:uid(),name:'',email:'',password:'',role:'custom',department:'',avatar:'U',createdAt:new Date().toISOString()});setNewU(true);}} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow shadow-indigo-200 hover:bg-indigo-700 transition">+ Add User</button></div>
          <div className="cd overflow-hidden"><div className="overflow-x-auto"><table className="tb">
            <thead><tr><th>User</th><th>Email</th><th>Password</th><th>Role</th><th>Department</th><th>Created</th><th></th></tr></thead>
            <tbody>{users.map(u=>(
              <tr key={u.id}>
                <td><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0">{u.avatar}</div><span className="font-semibold text-gray-800">{u.name}</span></div></td>
                <td className="font-mono">{u.email}</td><td className="font-mono text-gray-400">{'•'.repeat(u.password.length)}</td>
                <td><span className="bg-badge bg-indigo-50 text-indigo-600 border border-indigo-100">{u.role}</span></td>
                <td>{u.department}</td><td className="text-gray-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td><div className="flex gap-2">
                  <button onClick={()=>{setEu(u);setNewU(false);}} className="text-indigo-500 hover:text-indigo-700"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
                  {u.id!==me?.id&&<button onClick={()=>delU(u.id)} className="text-red-400 hover:text-red-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>}
                </div></td>
              </tr>
            ))}</tbody>
          </table></div></div>
          {eu&&<UserModal user={eu} isNew={newU} depts={depts} onSave={saveU} onClose={()=>{setEu(null);setNewU(false);}}/>}
        </div>
      )}
    </div>
  );
}

function DeptModal({dept,isNew,onSave,onClose}:{dept:Department;isNew:boolean;onSave:(d:Department,n:boolean)=>void;onClose:()=>void}){
  const [f,setF]=useState<Department>(dept);
  const [sel,setSel]=useState<string[]>(dept.allowedViews);
  const allM=sel.includes('all');
  const tog=(g:string)=>{if(g==='all'){setSel(['all']);return;}const w=sel.filter(s=>s!=='all');if(w.includes(g))setSel(w.filter(s=>s!==g));else setSel([...w,g]);};
  return(
    <div className="md-bg" onClick={onClose}><div className="md-box max-w-lg" onClick={e=>e.stopPropagation()}>
      <div className="flex items-center justify-between mb-5"><h2 className="text-lg font-bold text-gray-900">{isNew?'Add Department':'Edit Department'}</h2><button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500">✕</button></div>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Name</label><input value={f.name} onChange={e=>setF({...f,name:e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"/></div>
          <div><label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Icon (emoji)</label><input value={f.icon} onChange={e=>setF({...f,icon:e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"/></div>
        </div>
        <div><label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Color</label><input type="color" value={f.color} onChange={e=>setF({...f,color:e.target.value})} className="w-12 h-8 rounded-lg border border-gray-200 cursor-pointer"/></div>
        <div><label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-2">Allowed Views</label>
          <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-xl border border-gray-100">
            <button onClick={()=>tog('all')} className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${allM?'bg-indigo-600 text-white border-indigo-600':'bg-white text-gray-500 border-gray-200 hover:border-indigo-200'}`}>All Sheets</button>
            {!allM&&SHEETS.map(s=><button key={s.gid} onClick={()=>tog(s.gid)} className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition ${sel.includes(s.gid)?'bg-indigo-100 text-indigo-700 border-indigo-200':'bg-white text-gray-400 border-gray-200 hover:border-indigo-200'}`}>{s.icon} {s.shortName}</button>)}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-gray-100">
        <button onClick={onClose} className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-gray-200 transition">Cancel</button>
        <button onClick={()=>onSave({...f,allowedViews:sel},isNew)} className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow shadow-indigo-200 hover:bg-indigo-700 transition">{isNew?'Create':'Save'}</button>
      </div>
    </div></div>
  );
}

function UserModal({user,isNew,depts,onSave,onClose}:{user:User;isNew:boolean;depts:Department[];onSave:(u:User,n:boolean)=>void;onClose:()=>void}){
  const [f,setF]=useState<User>(user);
  return(
    <div className="md-bg" onClick={onClose}><div className="md-box max-w-md" onClick={e=>e.stopPropagation()}>
      <div className="flex items-center justify-between mb-5"><h2 className="text-lg font-bold text-gray-900">{isNew?'Add User':'Edit User'}</h2><button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500">✕</button></div>
      <div className="space-y-3">
        {[{k:'name',l:'Full Name',t:'text'},{k:'email',l:'Email',t:'email'},{k:'password',l:'Password',t:'text'},{k:'avatar',l:'Avatar (initials)',t:'text'}].map(x=>(
          <div key={x.k}><label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">{x.l}</label><input type={x.t} value={String(f[x.k as keyof User])} onChange={e=>setF({...f,[x.k]:e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"/></div>
        ))}
        <div><label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Role</label><select value={f.role} onChange={e=>setF({...f,role:e.target.value as User['role']})} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"><option value="admin">Admin</option><option value="account">Account</option><option value="project">Project</option><option value="crm">CRM</option><option value="custom">Custom</option></select></div>
        <div><label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Department</label><select value={f.department} onChange={e=>setF({...f,department:e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"><option value="">Select…</option>{depts.map(d=><option key={d.id} value={d.name}>{d.icon} {d.name}</option>)}</select></div>
      </div>
      <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-gray-100">
        <button onClick={onClose} className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-gray-200 transition">Cancel</button>
        <button onClick={()=>onSave(f,isNew)} className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow shadow-indigo-200 hover:bg-indigo-700 transition">{isNew?'Create':'Save'}</button>
      </div>
    </div></div>
  );
}
