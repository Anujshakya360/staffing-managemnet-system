
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
    <div className="flex flex-col bg-white overflow-hidden rounded-3xl">
      <div className="p-8 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Requirement Profile</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Specify staffing needs</p>
        </div>
        <button 
          onClick={onClose} 
          className="p-2 bg-white rounded-xl shadow-sm text-slate-400 hover:text-slate-900 transition-colors border border-slate-100"
          aria-label="Close modal"
        >
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <form onSubmit={handleSubmit} className="p-10 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="sm:col-span-2">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Target Client</label>
            <select 
              required
              className="w-full bg-slate-100/50 border-2 border-transparent rounded-2xl p-4 text-sm font-bold focus:bg-white focus:border-indigo-500 transition-all outline-none"
              value={formData.clientId}
              onChange={e => setFormData({...formData, clientId: e.target.value})}
            >
              <option value="">Select organizational partner...</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Official Job Title</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Senior Backend Architect"
              className="w-full bg-slate-100/50 border-2 border-transparent rounded-2xl p-4 text-sm font-bold focus:bg-white focus:border-indigo-500 transition-all outline-none placeholder:text-slate-300"
              value={formData.jobTitle}
              onChange={e => setFormData({...formData, jobTitle: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Region / HQ</label>
            <input 
              type="text" 
              placeholder="e.g. London, UK (Remote)"
              className="w-full bg-slate-100/50 border-2 border-transparent rounded-2xl p-4 text-sm font-bold focus:bg-white focus:border-indigo-500 transition-all outline-none placeholder:text-slate-300"
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Rate ($ USD/hr)</label>
            <input 
              type="number" 
              className="w-full bg-slate-100/50 border-2 border-transparent rounded-2xl p-4 text-sm font-bold focus:bg-white focus:border-indigo-500 transition-all outline-none"
              value={formData.payRate}
              onChange={e => setFormData({...formData, payRate: Number(e.target.value)})}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Skill Matrix (Comma separated)</label>
            <textarea 
              rows={3}
              placeholder="Go, Docker, Kubernetes, Prometheus..."
              className="w-full bg-slate-100/50 border-2 border-transparent rounded-2xl p-4 text-sm font-bold focus:bg-white focus:border-indigo-500 transition-all outline-none placeholder:text-slate-300"
              value={formData.skillsInput}
              onChange={e => setFormData({...formData, skillsInput: e.target.value})}
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button type="button" onClick={onClose} className="flex-1 px-8 py-4 border-2 border-slate-100 text-slate-500 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all">
            Discard
          </button>
          <button type="submit" className="flex-1 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95">
            Validate & Save
          </button>
        </div>
      </form>
    </div>
  );
};
