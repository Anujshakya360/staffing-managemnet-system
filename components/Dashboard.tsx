
import React from 'react';
import { JobOrder, JobAssignment, Timesheet, AppView, TimesheetStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  jobOrders: JobOrder[];
  assignments: JobAssignment[];
  timesheets: Timesheet[];
  onNavigate: (view: AppView) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ jobOrders, assignments, timesheets, onNavigate }) => {
  const pendingTimesheets = timesheets.filter(t => t.status === TimesheetStatus.SUBMITTED).length;
  const approvedTimesheets = timesheets.filter(t => t.status === TimesheetStatus.PAYROLL_READY).length;
  const activeJobs = jobOrders.length;
  const assignedCandidates = assignments.length;

  const chartData = [
    { name: 'Reqs', count: activeJobs, color: '#6366f1' },
    { name: 'Staff', count: assignedCandidates, color: '#3b82f6' },
    { name: 'Hours', count: timesheets.length, color: '#8b5cf6' },
    { name: 'PayReady', count: approvedTimesheets, color: '#10b981' },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">Executive Dashboard</h1>
        <p className="text-slate-500 font-medium text-lg mt-1 italic">Welcome back, Admin. Here's your operations pulse.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Requirements', value: activeJobs, color: 'indigo', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745' },
          { label: 'Staff Deployed', value: assignedCandidates, color: 'blue', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857' },
          { label: 'Pending Approvals', value: pendingTimesheets, color: 'amber', icon: 'M12 8v4l3 3' },
          { label: 'Payroll Ready', value: approvedTimesheets, color: 'emerald', icon: 'M9 12l2 2 4-4' },
        ].map((stat, i) => (
          <div key={i} className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 transition-all hover:-translate-y-1 overflow-hidden relative">
            <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${stat.color}-500/5 rounded-full transition-transform group-hover:scale-150 duration-700`}></div>
            <div className="flex items-center justify-between mb-6">
              <div className={`p-4 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl shadow-inner group-hover:bg-${stat.color}-600 group-hover:text-white transition-colors duration-300`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={stat.icon} />
                </svg>
              </div>
            </div>
            <div className="text-5xl font-black text-slate-900 tracking-tighter mb-1">{stat.value}</div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Workflow Velocity</h3>
              <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Operational Benchmarks</p>
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc', radius: 10}}
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)', padding: '20px' }}
                  itemStyle={{fontWeight: 900}}
                />
                <Bar dataKey="count" radius={[10, 10, 10, 10]} barSize={50}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <h3 className="text-2xl font-black text-white tracking-tight mb-8 relative">Command Center</h3>
          <div className="space-y-4 flex-1 relative">
            <button 
              onClick={() => onNavigate('JOB_ORDERS')}
              className="w-full text-left p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-500/50 transition-all group/btn"
              aria-label="Navigate to job orders"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-black text-white text-lg">New Req</p>
                  <p className="text-xs text-slate-400 font-medium">Define hiring goals</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover/btn:bg-indigo-600 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                </div>
              </div>
            </button>
            <button 
              onClick={() => onNavigate('ASSIGNMENTS')}
              className="w-full text-left p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/50 transition-all group/btn"
              aria-label="Navigate to assignments"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-black text-white text-lg">Staff Jobs</p>
                  <p className="text-xs text-slate-400 font-medium">Deploy candidates</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover/btn:bg-blue-600 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 20h5v-2a3 3 0 00-5.356-1.857" /></svg>
                </div>
              </div>
            </button>
            <button 
              onClick={() => onNavigate('APPROVALS')}
              className="w-full text-left p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/50 transition-all group/btn"
              aria-label="Navigate to approvals"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-black text-white text-lg">Pay Audit</p>
                  <p className="text-xs text-slate-400 font-medium">Verify submissions</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover/btn:bg-emerald-600 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
              </div>
            </button>
          </div>
          <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between relative">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Version 4.5.0 Enterprise</span>
            <div className="flex gap-1">
              {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>)}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};
