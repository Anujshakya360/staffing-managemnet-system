
import React, { useState } from 'react';
import { Client, JobOrder } from '../types';

interface JobOrderFormProps {
  clients: Client[];
  onSubmit: (job: Omit<JobOrder, 'id' | 'status'>) => void;
  onClose: () => void;
}

export const JobOrderForm: React.FC<JobOrderFormProps> = ({ clients, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    clientId: '',
    jobTitle: '',
    location: '',
    payRate: 0,
    startDate: '',
    endDate: '',
    skillsInput: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientId || !formData.jobTitle) {
        alert("Please fill in required fields.");
        return;
    }
    onSubmit({
      clientId: formData.clientId,
      jobTitle: formData.jobTitle,
      location: formData.location,
      payRate: formData.payRate,
      startDate: formData.startDate,
      endDate: formData.endDate,
      requiredSkills: formData.skillsInput.split(',').map(s => s.trim()).filter(Boolean),
    });
    onClose();
  };

  return (
    <div className="flex flex-col">
      <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">New Job Order</h2>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <form onSubmit={handleSubmit} className="p-8 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Select Client</label>
            <select 
              required
              className="w-full bg-slate-100 border-0 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500"
              value={formData.clientId}
              onChange={e => setFormData({...formData, clientId: e.target.value})}
            >
              <option value="">Choose a client...</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Job Title</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Senior Backend Engineer"
              className="w-full bg-slate-100 border-0 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500"
              value={formData.jobTitle}
              onChange={e => setFormData({...formData, jobTitle: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Location</label>
            <input 
              type="text" 
              placeholder="City, State"
              className="w-full bg-slate-100 border-0 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500"
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Pay Rate ($/hr)</label>
            <input 
              type="number" 
              className="w-full bg-slate-100 border-0 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500"
              value={formData.payRate}
              onChange={e => setFormData({...formData, payRate: Number(e.target.value)})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Start Date</label>
            <input 
              type="date" 
              className="w-full bg-slate-100 border-0 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500"
              value={formData.startDate}
              onChange={e => setFormData({...formData, startDate: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">End Date</label>
            <input 
              type="date" 
              className="w-full bg-slate-100 border-0 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500"
              value={formData.endDate}
              onChange={e => setFormData({...formData, endDate: e.target.value})}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Skills (Comma separated)</label>
            <textarea 
              rows={2}
              placeholder="React, SQL Server, TypeScript..."
              className="w-full bg-slate-100 border-0 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500"
              value={formData.skillsInput}
              onChange={e => setFormData({...formData, skillsInput: e.target.value})}
            />
          </div>
        </div>
        <div className="pt-4 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-all">
            Cancel
          </button>
          <button type="submit" className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-md transition-all">
            Create Order
          </button>
        </div>
      </form>
    </div>
  );
};
