
import React, { useState } from 'react';
import { JobAssignment, JobOrder, Candidate, Timesheet, TimesheetStatus } from '../types';

interface TimesheetSubmissionProps {
  assignments: JobAssignment[];
  jobOrders: JobOrder[];
  candidates: Candidate[];
  timesheets: Timesheet[];
  onSubmit: (timesheet: Omit<Timesheet, 'id' | 'status'>) => void;
}

export const TimesheetSubmission: React.FC<TimesheetSubmissionProps> = ({ assignments, jobOrders, candidates, timesheets, onSubmit }) => {
  const [formData, setFormData] = useState({
    assignmentId: '',
    workDate: '',
    hoursWorked: 8,
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.assignmentId) return;
    onSubmit({
      assignmentId: formData.assignmentId,
      workDate: formData.workDate,
      hoursWorked: formData.hoursWorked,
      description: formData.description
    });
    setFormData({ assignmentId: '', workDate: '', hoursWorked: 8, description: '' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm h-fit">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Log Work Hours</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Select Assignment</label>
            <select 
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500"
              value={formData.assignmentId}
              onChange={e => setFormData({...formData, assignmentId: e.target.value})}
            >
              <option value="">-- Choose your active assignment --</option>
              {assignments.map(a => {
                const job = jobOrders.find(j => j.id === a.jobOrderId);
                const cand = candidates.find(c => c.id === a.candidateId);
                return (
                  <option key={a.id} value={a.id}>
                    {cand?.fullName} @ {job?.jobTitle}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Work Date</label>
              <input 
                required
                type="date"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500"
                value={formData.workDate}
                onChange={e => setFormData({...formData, workDate: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Hours</label>
              <input 
                required
                type="number"
                step="0.5"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500"
                value={formData.hoursWorked}
                onChange={e => setFormData({...formData, hoursWorked: Number(e.target.value)})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Description / Comments</label>
            <textarea 
              rows={3}
              placeholder="What did you work on today?"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg transition-all"
          >
            Submit Timesheet
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-800">My Recent Submissions</h3>
        <div className="space-y-3">
          {timesheets.length === 0 ? (
            <div className="p-10 text-center bg-slate-100 rounded-xl text-slate-400">No recent submissions.</div>
          ) : (
            timesheets.map(ts => {
                const assignment = assignments.find(a => a.id === ts.assignmentId);
                const job = jobOrders.find(j => j.id === assignment?.jobOrderId);
                const statusColors = {
                    [TimesheetStatus.SUBMITTED]: 'bg-amber-50 text-amber-600',
                    [TimesheetStatus.APPROVED]: 'bg-indigo-50 text-indigo-600',
                    [TimesheetStatus.REJECTED]: 'bg-red-50 text-red-600',
                    [TimesheetStatus.PAYROLL_READY]: 'bg-emerald-50 text-emerald-600'
                };
                return (
                  <div key={ts.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{new Date(ts.workDate).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                      <p className="font-bold text-slate-800">{job?.jobTitle}</p>
                      <p className="text-sm text-slate-500">{ts.hoursWorked} Hours • {ts.description.substring(0, 30)}...</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${statusColors[ts.status]}`}>
                      {ts.status.replace('_', ' ')}
                    </span>
                  </div>
                )
            })
          )}
        </div>
      </div>
    </div>
  );
};
