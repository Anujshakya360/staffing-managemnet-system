
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

interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error';
}

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('DASHBOARD');
  const [clients] = useState<Client[]>(INITIAL_CLIENTS);
  const [candidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [jobOrders, setJobOrders] = useState<JobOrder[]>([]);
  const [assignments, setAssignments] = useState<JobAssignment[]>([]);
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const notify = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  // Workflow Handlers
  const handleCreateJobOrder = async (newJob: Omit<JobOrder, 'id' | 'status'>) => {
    setIsLoading(true);
    // Simulate Backend API Latency
    await new Promise(r => setTimeout(r, 800));
    const job: JobOrder = {
      ...newJob,
      id: `JO-${Math.floor(Math.random() * 10000)}`,
      status: JobStatus.OPEN,
    };
    setJobOrders(prev => [job, ...prev]);
    setIsLoading(false);
    notify(`Job Order ${job.id} created successfully.`);
    setView('JOB_ORDERS');
  };

  const handleAssignCandidate = async (jobOrderId: string, candidateId: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 600));
    
    if (assignments.find(a => a.jobOrderId === jobOrderId && a.candidateId === candidateId)) {
      setIsLoading(false);
      notify("Candidate is already assigned to this job.", 'error');
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
    setIsLoading(false);
    notify("Assignment confirmed.");
    setView('ASSIGNMENTS');
  };

  const handleSubmitTimesheet = async (newTimesheet: Omit<Timesheet, 'id' | 'status'>) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const ts: Timesheet = {
      ...newTimesheet,
      id: `TS-${Math.floor(Math.random() * 10000)}`,
      status: TimesheetStatus.SUBMITTED,
    };
    setTimesheets(prev => [...prev, ts]);
    setIsLoading(false);
    notify("Timesheet submitted for approval.");
    setView('TIMESHEETS');
  };

  const handleApproveTimesheet = async (id: string, approve: boolean) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 500));
    setTimesheets(prev => prev.map(ts => 
      ts.id === id 
        ? { ...ts, status: approve ? TimesheetStatus.PAYROLL_READY : TimesheetStatus.REJECTED } 
        : ts
    ));
    setIsLoading(false);
    notify(approve ? "Timesheet approved and marked for payroll." : "Timesheet rejected.");
  };

  return (
    <Layout currentView={view} onViewChange={setView}>
      {/* Notifications */}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {notifications.map(n => (
          <div 
            key={n.id} 
            className={`pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border transition-all animate-slide-in ${
              n.type === 'success' ? 'bg-white border-emerald-100 text-emerald-800' : 'bg-white border-red-100 text-red-800'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${n.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
            <span className="font-semibold text-sm">{n.message}</span>
          </div>
        ))}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/40 backdrop-blur-[2px] z-[9998] flex items-center justify-center pointer-events-none transition-all">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Job Orders</h1>
              <p className="text-slate-500 text-sm mt-1">Manage corporate client requisitions.</p>
            </div>
            <button 
              onClick={() => (document.getElementById('jobModal') as any)?.showModal()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
              aria-label="Create new job order"
            >
              + New Requirement
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobOrders.length === 0 ? (
              <div className="col-span-full py-24 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 group hover:border-indigo-300 transition-colors">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 rounded-2xl mb-4 group-hover:bg-indigo-50 transition-colors">
                  <svg className="w-8 h-8 text-slate-300 group-hover:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="font-semibold text-slate-900">No Requisitions</p>
                <p className="text-sm mt-1">Click the button above to start staffing.</p>
              </div>
            ) : (
              jobOrders.map(jo => {
                const client = clients.find(c => c.id === jo.clientId);
                return (
                  <div key={jo.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-200 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                       <span className="px-3 py-1 text-[10px] font-black rounded-full bg-green-50 text-green-700 uppercase tracking-widest">{jo.status}</span>
                    </div>
                    <div className="flex flex-col h-full">
                      <span className="text-xs font-bold text-slate-400 mb-4">{jo.id}</span>
                      <h3 className="text-xl font-extrabold text-slate-900 mb-1 group-hover:text-indigo-700 transition-colors">{jo.jobTitle}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                        <span className="font-semibold text-slate-700">{client?.name}</span>
                        <span>•</span>
                        <span>{jo.location}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-8 flex-1">
                        {jo.requiredSkills.map(s => (
                          <span key={s} className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-medium border border-slate-100">{s}</span>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-6 border-t border-slate-50 mt-auto">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pay Rate</p>
                          <p className="text-lg font-black text-slate-900">${jo.payRate}<span className="text-xs font-normal text-slate-400">/hr</span></p>
                        </div>
                        <button 
                          onClick={() => setView('ASSIGNMENTS')}
                          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition-colors"
                        >
                          Match Talent
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <dialog id="jobModal" className="rounded-3xl shadow-2xl p-0 w-full max-w-xl backdrop:bg-slate-900/60 overflow-hidden outline-none">
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

      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
      `}</style>
    </Layout>
  );
};

export default App;
