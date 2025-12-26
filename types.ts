
export enum JobStatus {
  OPEN = 'OPEN',
  FILLED = 'FILLED',
  CLOSED = 'CLOSED'
}

export enum TimesheetStatus {
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PAYROLL_READY = 'PAYROLL_READY'
}

export interface Client {
  id: string;
  name: string;
  industry: string;
}

export interface JobOrder {
  id: string;
  clientId: string;
  jobTitle: string;
  requiredSkills: string[];
  location: string;
  payRate: number;
  startDate: string;
  endDate: string;
  status: JobStatus;
}

export interface Candidate {
  id: string;
  fullName: string;
  skills: string[];
  email: string;
}

export interface JobAssignment {
  id: string;
  jobOrderId: string;
  candidateId: string;
  assignedDate: string;
  status: string;
}

export interface Timesheet {
  id: string;
  assignmentId: string;
  workDate: string;
  hoursWorked: number;
  description: string;
  status: TimesheetStatus;
}

export type AppView = 'DASHBOARD' | 'JOB_ORDERS' | 'ASSIGNMENTS' | 'TIMESHEETS' | 'APPROVALS' | 'ARCH_SPECS';
