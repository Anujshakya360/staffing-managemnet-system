
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
    { name: 'Jobs', count: activeJobs, color: '#4f46e5' },
    { name: 'Staff Assigned', count: assignedCandidates, color: '#0ea5e9' },
    { name: 'Timesheets', count: timesheets.length, color: '#8b5cf6' },
    { name: 'Approved', count: approvedTimesheets, color: '#10b981' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Overview</h1>
        <p className="text-slate-500 mt-1">Real-time staffing operations telemetry.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Job Orders', value: activeJobs, trend: '+12%', color: 'indigo', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745' },
          { label: 'Total Assignments', value: assignedCandidates, trend: '+5%', color: 'blue', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857' },
          { label: 'Pending Approvals', value: pendingTimesheets, trend: '-2', color: 'amber', icon: 'M12 8v4l3 3' },
          { label: 'Payroll Ready', value: approvedTimesheets, trend: 'stable', color: 'emerald', icon: 'M9 12l2 2 4-4' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 bg-${stat.color}-50 text-${stat.color}-600 rounded-lg`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
                </svg>
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.trend}</span>
            </div>
            <div className="text-3xl font-black text-slate-900">{stat.value}</div>
            <div className="text-sm font-medium text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Workflow Distribution</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
          <div className="space-y-3 flex-1">
            <button 
              onClick={() => onNavigate('JOB_ORDERS')}
              className="w-full text-left p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 transition-all group"
            >
              <p className="font-bold text-slate-700 group-hover:text-indigo-700">Open New Job</p>
              <p className="text-xs text-slate-400">Add a client requirement</p>
            </button>
            <button 
              onClick={() => onNavigate('ASSIGNMENTS')}
              className="w-full text-left p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 transition-all group"
            >
              <p className="font-bold text-slate-700 group-hover:text-blue-700">Assign Candidates</p>
              <p className="text-xs text-slate-400">Fill open requisitions</p>
            </button>
            <button 
              onClick={() => onNavigate('APPROVALS')}
              className="w-full text-left p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 transition-all group"
            >
              <p className="font-bold text-slate-700 group-hover:text-emerald-700">Process Timesheets</p>
              <p className="text-xs text-slate-400">Approve pending work hours</p>
            </button>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">System v4.2.0 • Online</p>
          </div>
        </div>
      </div>
    </div>
  );
};
