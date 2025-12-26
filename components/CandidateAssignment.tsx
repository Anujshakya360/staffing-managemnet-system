
import React, { useState } from 'react';
import { JobOrder, Candidate, JobAssignment } from '../types';

interface CandidateAssignmentProps {
  jobOrders: JobOrder[];
  candidates: Candidate[];
  assignments: JobAssignment[];
  onAssign: (jobOrderId: string, candidateId: string) => void;
}

export const CandidateAssignment: React.FC<CandidateAssignmentProps> = ({ jobOrders, candidates, assignments, onAssign }) => {
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');

  const handleAssign = () => {
    if (!selectedJob || !selectedCandidate) return;
    onAssign(selectedJob, selectedCandidate);
    setSelectedCandidate('');
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Create Assignment</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Select Open Job</label>
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500"
              value={selectedJob}
              onChange={e => setSelectedJob(e.target.value)}
            >
              <option value="">-- Choose Job --</option>
              {jobOrders.filter(j => j.status === 'OPEN').map(j => (
                <option key={j.id} value={j.id}>{j.jobTitle} - {j.id}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Select Candidate</label>
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500"
              value={selectedCandidate}
              onChange={e => setSelectedCandidate(e.target.value)}
            >
              <option value="">-- Choose Candidate --</option>
              {candidates.map(c => (
                <option key={c.id} value={c.id}>{c.fullName} ({c.skills.slice(0, 2).join(', ')}...)</option>
              ))}
            </select>
          </div>

          <button 
            disabled={!selectedJob || !selectedCandidate}
            onClick={handleAssign}
            className="w-full py-4 bg-indigo-600 disabled:bg-slate-300 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg transition-all"
          >
            Confirm Assignment
          </button>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Active Assignments</h3>
        <div className="overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Candidate</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Job Order</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assignments.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-400">No active assignments.</td></tr>
              ) : (
                assignments.map(a => {
                  const job = jobOrders.find(j => j.id === a.jobOrderId);
                  const cand = candidates.find(c => c.id === a.candidateId);
                  return (
                    <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">{cand?.fullName}</p>
                        <p className="text-xs text-slate-500">{cand?.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-indigo-600">{job?.jobTitle}</p>
                        <p className="text-xs text-slate-400">{job?.id}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(a.assignedDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase">{a.status}</span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
