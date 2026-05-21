import { useState } from 'react';
import { auth, addHistory, getUsers, User } from '../store';

export default function LoginPage({ onLogin }: { onLogin: (u: User) => void }) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [show, setShow] = useState(false);
  const users = getUsers();

  const go = (e: React.FormEvent) => {
    e.preventDefault(); setErr('');
    const u = auth(email, pw);
    if (u) { addHistory({ userId:u.id, userName:u.name, department:u.department, action:'login', detail:`${u.name} logged in` }); onLogin(u); }
    else setErr('Invalid email or password');
  };

  return (
    <div className="login-bg">
      <div className="w-full max-w-md px-4">
        <div className="cd p-8 shadow-xl shadow-indigo-100/40">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 mx-auto flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-200">VE</div>
            <h1 className="text-2xl font-bold text-gray-900 mt-4">Vishal Electricals</h1>
            <p className="text-sm text-gray-400 mt-1">ERP Dashboard — Sign In</p>
          </div>
          <form onSubmit={go} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest">Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@ve.com" required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest">Password</label>
              <div className="relative">
                <input type={show?'text':'password'} value={pw} onChange={e=>setPw(e.target.value)} placeholder="••••••" required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition pr-10" />
                <button type="button" onClick={()=>setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">{show?'🙈':'👁️'}</button>
              </div>
            </div>
            {err && <div className="bg-red-50 text-red-600 text-xs font-medium px-4 py-2.5 rounded-xl border border-red-100">{err}</div>}
            <button type="submit" className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 transition-all hover:-translate-y-0.5">Sign In</button>
          </form>
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-3 text-center">Demo Accounts</p>
            <div className="grid grid-cols-2 gap-2">
              {users.map(u => (
                <button key={u.id} onClick={()=>{setEmail(u.email);setPw(u.password)}}
                  className="text-left px-3 py-2 rounded-lg bg-gray-50 hover:bg-indigo-50 border border-gray-100 hover:border-indigo-200 transition group">
                  <p className="text-xs font-semibold text-gray-700 group-hover:text-indigo-600">{u.department}</p>
                  <p className="text-[10px] text-gray-400 truncate">{u.email}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
