
import React from 'react';
import { Timesheet, JobAssignment, Candidate, JobOrder, TimesheetStatus } from '../types';

interface ApprovalDashboardProps {
  timesheets: Timesheet[];
  assignments: JobAssignment[];
  candidates: Candidate[];
  jobOrders: JobOrder[];
  onApprove: (id: string, approve: boolean) => void;
}

export const ApprovalDashboard: React.FC<ApprovalDashboardProps> = ({ timesheets, assignments, candidates, jobOrders, onApprove }) => {
  const pending = timesheets.filter(ts => ts.status === TimesheetStatus.SUBMITTED);

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-slate-800">Pending Approvals</h1>
        <p className="text-slate-500">Review and authorize timesheets for payroll processing.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {pending.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 flex flex-col items-center">
             <svg className="w-12 h-12 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
             <p className="font-medium">All caught up! No pending timesheets.</p>
          </div>
        ) : (
          pending.map(ts => {
            const assignment = assignments.find(a => a.id === ts.assignmentId);
            const candidate = candidates.find(c => c.id === assignment?.candidateId);
            const job = jobOrders.find(j => j.id === assignment?.jobOrderId);

            return (
              <div key={ts.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                    {candidate?.fullName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{candidate?.fullName}</h4>
                    <p className="text-sm text-indigo-600 font-medium">{job?.jobTitle}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-400">Date: {ts.workDate}</span>
                      <span className="text-xs font-bold text-slate-800">{ts.hoursWorked} Hrs</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2 rounded italic">"{ts.description}"</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => onApprove(ts.id, false)}
                    className="px-4 py-2 border border-red-100 text-red-600 rounded-lg text-sm font-bold hover:bg-red-50 transition-all"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => onApprove(ts.id, true)}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-md transition-all"
                  >
                    Approve
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {timesheets.some(ts => ts.status === TimesheetStatus.PAYROLL_READY) && (
        <div className="mt-12">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                Completed for Payroll
            </h3>
            <div className="bg-slate-900 text-slate-300 rounded-xl p-6 font-mono text-xs overflow-x-auto">
                <p className="mb-2 text-slate-500">// READY_FOR_PAYROLL_QUEUE_EXPORT</p>
                {timesheets.filter(ts => ts.status === TimesheetStatus.PAYROLL_READY).map(ts => (
                    <div key={ts.id} className="mb-1">
                        <span className="text-emerald-400">SUCCESS</span>: Record <span className="text-indigo-400">{ts.id}</span> - UserID <span className="text-indigo-400">{assignments.find(a => a.id === ts.assignmentId)?.candidateId}</span> - Hours: <span className="text-amber-400">{ts.hoursWorked}</span>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};
