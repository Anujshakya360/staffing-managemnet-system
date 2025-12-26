
import React, { useState, useEffect } from 'react';
import { 
  AppView, 
  JobOrder, 
  JobStatus, 
  Candidate, 
  JobAssignment, 
  Timesheet, 
  TimesheetStatus,
  Client
} from './types';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { JobOrderForm } from './components/JobOrderForm';
import { CandidateAssignment } from './components/CandidateAssignment';
import { TimesheetSubmission } from './components/TimesheetSubmission';
import { ApprovalDashboard } from './components/ApprovalDashboard';
import { TechSpecs } from './components/TechSpecs';

// Mock Initial Data
const INITIAL_CLIENTS: Client[] = [
  { id: 'C1', name: 'TechCorp Global', industry: 'Software' },
  { id: 'C2', name: 'HealthNet Systems', industry: 'Healthcare' },
  { id: 'C3', name: 'BuildRight Inc', industry: 'Construction' },
];

const INITIAL_CANDIDATES: Candidate[] = [
  { id: 'CAN1', fullName: 'Alice Johnson', email: 'alice@example.com', skills: ['React', 'Node.js', 'TypeScript'] },
  { id: 'CAN2', fullName: 'Bob Smith', email: 'bob@example.com', skills: ['C#', 'SQL Server', 'ASP.NET Core'] },
  { id: 'CAN3', fullName: 'Charlie Davis', email: 'charlie@example.com', skills: ['Angular', 'Java', 'Spring Boot'] },
];

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('DASHBOARD');
  const [clients] = useState<Client[]>(INITIAL_CLIENTS);
  const [candidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [jobOrders, setJobOrders] = useState<JobOrder[]>([]);
  const [assignments, setAssignments] = useState<JobAssignment[]>([]);
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);

  // Workflow Handlers
  const handleCreateJobOrder = (newJob: Omit<JobOrder, 'id' | 'status'>) => {
    const job: JobOrder = {
      ...newJob,
      id: `JO-${Math.floor(Math.random() * 10000)}`,
      status: JobStatus.OPEN,
    };
    setJobOrders(prev => [job, ...prev]);
    setView('JOB_ORDERS');
  };

  const handleAssignCandidate = (jobOrderId: string, candidateId: string) => {
    // Check for double assignment
    if (assignments.find(a => a.jobOrderId === jobOrderId && a.candidateId === candidateId)) {
      alert("Candidate is already assigned to this job.");
      return;
    }
    const newAssignment: JobAssignment = {
      id: `AS-${Math.floor(Math.random() * 10000)}`,
      jobOrderId,
      candidateId,
      assignedDate: new Date().toISOString(),
      status: 'ACTIVE'
    };
    setAssignments(prev => [...prev, newAssignment]);
    setView('ASSIGNMENTS');
  };

  const handleSubmitTimesheet = (newTimesheet: Omit<Timesheet, 'id' | 'status'>) => {
    const ts: Timesheet = {
      ...newTimesheet,
      id: `TS-${Math.floor(Math.random() * 10000)}`,
      status: TimesheetStatus.SUBMITTED,
    };
    setTimesheets(prev => [...prev, ts]);
    setView('TIMESHEETS');
  };

  const handleApproveTimesheet = (id: string, approve: boolean) => {
    setTimesheets(prev => prev.map(ts => 
      ts.id === id 
        ? { ...ts, status: approve ? TimesheetStatus.PAYROLL_READY : TimesheetStatus.REJECTED } 
        : ts
    ));
  };

  return (
    <Layout currentView={view} onViewChange={setView}>
      {view === 'DASHBOARD' && (
        <Dashboard 
          jobOrders={jobOrders} 
          assignments={assignments} 
          timesheets={timesheets} 
          onNavigate={setView}
        />
      )}
      
      {view === 'JOB_ORDERS' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-800">Job Order Management</h1>
            <button 
              onClick={() => (document.getElementById('jobModal') as any)?.showModal()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-all"
            >
              + Create New Job
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobOrders.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white rounded-xl border border-dashed border-slate-300 text-slate-400">
                No job orders created yet.
              </div>
            ) : (
              jobOrders.map(jo => {
                const client = clients.find(c => c.id === jo.clientId);
                return (
                  <div key={jo.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-300 transition-all">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{jo.id}</span>
                      <span className="px-2 py-1 text-[10px] font-bold rounded-full bg-green-100 text-green-700">{jo.status}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">{jo.jobTitle}</h3>
                    <p className="text-sm text-slate-500 mb-4">{client?.name} • {jo.location}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {jo.requiredSkills.map(s => (
                        <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">{s}</span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                      <span className="text-indigo-600 font-bold">${jo.payRate}/hr</span>
                      <button 
                        onClick={() => setView('ASSIGNMENTS')}
                        className="text-sm font-medium text-slate-500 hover:text-indigo-600"
                      >
                        Assign Candidate →
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <dialog id="jobModal" className="rounded-xl shadow-2xl p-0 w-full max-w-lg backdrop:bg-slate-900/50">
            <JobOrderForm 
              clients={clients} 
              onSubmit={handleCreateJobOrder} 
              onClose={() => (document.getElementById('jobModal') as any)?.close()} 
            />
          </dialog>
        </div>
      )}

      {view === 'ASSIGNMENTS' && (
        <CandidateAssignment 
          jobOrders={jobOrders} 
          candidates={candidates} 
          assignments={assignments}
          onAssign={handleAssignCandidate} 
        />
      )}

      {view === 'TIMESHEETS' && (
        <TimesheetSubmission 
          assignments={assignments} 
          jobOrders={jobOrders}
          candidates={candidates}
          timesheets={timesheets}
          onSubmit={handleSubmitTimesheet} 
        />
      )}

      {view === 'APPROVALS' && (
        <ApprovalDashboard 
          timesheets={timesheets} 
          assignments={assignments}
          candidates={candidates}
          jobOrders={jobOrders}
          onApprove={handleApproveTimesheet}
        />
      )}

      {view === 'ARCH_SPECS' && (
        <TechSpecs />
      )}
    </Layout>
  );
};

export default App;
