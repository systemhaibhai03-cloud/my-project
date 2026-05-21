/* ── Types ── */
export interface User {
  id: string; name: string; email: string; password: string;
  role: 'admin'|'account'|'project'|'crm'|'custom';
  department: string; avatar: string; createdAt: string;
}
export interface Department {
  id: string; name: string; icon: string; color: string;
  allowedViews: string[]; createdAt: string;
}
export interface ChangeRecord {
  id: string; userId: string; userName: string; department: string;
  action: 'login'|'logout'|'edit_cell'|'view_sheet'|'add_department'|'add_user'|'add_lead'|'edit_lead'|'add_project'|'edit_project';
  detail: string; timestamp: string; sheetGid?: string;
}
export interface CRMLead {
  id: string; company: string; contact: string; phone: string;
  email: string; source: string;
  status: 'new'|'contacted'|'qualified'|'proposal'|'negotiation'|'won'|'lost';
  value: number; notes: string; assignedTo: string;
  createdAt: string; updatedAt: string;
}
export interface Project {
  id: string; name: string; client: string; location: string;
  status: 'planning'|'in_progress'|'on_hold'|'completed'|'cancelled';
  value: number; startDate: string; endDate: string;
  manager: string; progress: number; linkedSheetGid?: string;
}

/* ── Helpers ── */
const LS = {
  get<T>(key: string, fb: T): T { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fb; } catch { return fb; } },
  set(key: string, v: unknown) { localStorage.setItem(key, JSON.stringify(v)); },
};

/* ── Defaults ── */
const D_USERS: User[] = [
  { id:'u1', name:'Admin', email:'admin@ve.com', password:'admin123', role:'admin', department:'Admin', avatar:'A', createdAt:new Date().toISOString() },
  { id:'u2', name:'Accounts Manager', email:'account@ve.com', password:'acc123', role:'account', department:'Account', avatar:'AC', createdAt:new Date().toISOString() },
  { id:'u3', name:'Project Manager', email:'project@ve.com', password:'proj123', role:'project', department:'Project', avatar:'PM', createdAt:new Date().toISOString() },
  { id:'u4', name:'CRM Manager', email:'crm@ve.com', password:'crm123', role:'crm', department:'CRM', avatar:'CR', createdAt:new Date().toISOString() },
];
const D_DEPTS: Department[] = [
  { id:'d1', name:'Account', icon:'💰', color:'#10b981', allowedViews:['all'], createdAt:new Date().toISOString() },
  { id:'d2', name:'Project', icon:'📋', color:'#3b82f6', allowedViews:['all'], createdAt:new Date().toISOString() },
  { id:'d3', name:'CRM', icon:'🤝', color:'#f59e0b', allowedViews:['crm'], createdAt:new Date().toISOString() },
];
const D_LEADS: CRMLead[] = [
  { id:'l1', company:'IOCL Mathura', contact:'Rajesh Kumar', phone:'+91 98765 43210', email:'rajesh@iocl.com', source:'Tender', status:'won', value:12039940, notes:'BDFP project - ongoing', assignedTo:'CRM Manager', createdAt:'2024-06-15', updatedAt:'2025-01-10' },
  { id:'l2', company:'NTPC Dadri', contact:'Anil Sharma', phone:'+91 87654 32109', email:'anil@ntpc.com', source:'Referral', status:'proposal', value:1992135, notes:'Electrical maintenance contract', assignedTo:'CRM Manager', createdAt:'2025-01-20', updatedAt:'2025-05-15' },
  { id:'l3', company:'GAIL Vijaipur', contact:'Suresh Patel', phone:'+91 76543 21098', email:'suresh@gail.com', source:'Tender', status:'negotiation', value:1308904, notes:'Plant wiring project', assignedTo:'CRM Manager', createdAt:'2025-03-01', updatedAt:'2025-06-01' },
  { id:'l4', company:'AAI Amritsar', contact:'Harpreet Singh', phone:'+91 65432 10987', email:'harpreet@aai.com', source:'Gov Portal', status:'qualified', value:3405751, notes:'Airport electrical infrastructure', assignedTo:'CRM Manager', createdAt:'2025-04-10', updatedAt:'2025-06-20' },
  { id:'l5', company:'Paradip Port Authority', contact:'Mohan Das', phone:'+91 54321 09876', email:'mohan@ppa.com', source:'Tender', status:'won', value:18685032, notes:'Port electrification project', assignedTo:'CRM Manager', createdAt:'2025-02-01', updatedAt:'2025-06-25' },
  { id:'l6', company:'HPCL Loni', contact:'Vikram Joshi', phone:'+91 43210 98765', email:'vikram@hpcl.com', source:'Direct', status:'new', value:2500000, notes:'New supply chain enquiry', assignedTo:'CRM Manager', createdAt:'2026-01-05', updatedAt:'2026-01-05' },
];
const D_PROJECTS: Project[] = [
  { id:'p1', name:'IOCL Mathura BDFP', client:'Indian Oil Corporation Ltd', location:'Mathura, UP', status:'in_progress', value:12039940, startDate:'2024-06-01', endDate:'2025-12-31', manager:'Project Manager', progress:65, linkedSheetGid:'0' },
  { id:'p2', name:'NTPC Dadri Maintenance', client:'NTPC Limited', location:'Dadri, UP', status:'in_progress', value:1992135, startDate:'2025-01-01', endDate:'2025-09-30', manager:'Project Manager', progress:40, linkedSheetGid:'1347791283' },
  { id:'p3', name:'GAIL Vijaipur Wiring', client:'GAIL India Limited', location:'Vijaipur, MP', status:'in_progress', value:1308904, startDate:'2025-03-01', endDate:'2025-12-31', manager:'Project Manager', progress:25, linkedSheetGid:'751444077' },
  { id:'p4', name:'AAI Amritsar Infra', client:'Airports Authority of India', location:'Amritsar, Punjab', status:'planning', value:3405751, startDate:'2025-07-01', endDate:'2026-06-30', manager:'Project Manager', progress:10, linkedSheetGid:'1893067828' },
  { id:'p5', name:'Paradip Port Electrification', client:'Paradip Port Authority', location:'Paradip, Odisha', status:'in_progress', value:18685032, startDate:'2025-02-01', endDate:'2026-03-31', manager:'Project Manager', progress:55, linkedSheetGid:'321034887' },
  { id:'p6', name:'IOCL Paradeep HM', client:'Indian Oil Corporation Ltd', location:'Paradeep, Odisha', status:'in_progress', value:7685217, startDate:'2025-04-01', endDate:'2026-01-31', manager:'Project Manager', progress:35, linkedSheetGid:'1979702996' },
];

/* ── API ── */
export const getUsers = (): User[] => LS.get('ve_users', D_USERS);
export const setUsers = (u: User[]) => LS.set('ve_users', u);
export const getDepts = (): Department[] => LS.get('ve_depts', D_DEPTS);
export const setDepts = (d: Department[]) => LS.set('ve_depts', d);
export const getHistory = (): ChangeRecord[] => LS.get('ve_history', []);
export const addHistory = (r: Omit<ChangeRecord, 'id'|'timestamp'>) => {
  const h = getHistory();
  h.unshift({ ...r, id:'h'+Date.now()+Math.random().toString(36).slice(2,6), timestamp:new Date().toISOString() });
  if (h.length > 500) h.length = 500;
  LS.set('ve_history', h);
};
export const getLeads = (): CRMLead[] => LS.get('ve_leads', D_LEADS);
export const setLeads = (l: CRMLead[]) => LS.set('ve_leads', l);
export const getProjects = (): Project[] => LS.get('ve_projects', D_PROJECTS);
export const setProjects = (p: Project[]) => LS.set('ve_projects', p);
export const getCurUser = (): User|null => LS.get<User|null>('ve_cur', null);
export const setCurUser = (u: User|null) => LS.set('ve_cur', u);
export const auth = (e: string, p: string): User|null => getUsers().find(u => u.email===e && u.password===p) || null;
export const uid = (): string => Date.now().toString(36)+Math.random().toString(36).slice(2,8);
