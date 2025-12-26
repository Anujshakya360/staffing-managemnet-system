
import React, { useState } from 'react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  onViewChange: (view: AppView) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'DASHBOARD', label: 'Overview', icon: 'M4 6h16M4 12h16M4 18h7' },
    { id: 'JOB_ORDERS', label: 'Job Orders', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { id: 'ASSIGNMENTS', label: 'Assignments', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'TIMESHEETS', label: 'Submit Time', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'APPROVALS', label: 'Approvals', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'ARCH_SPECS', label: 'Tech Stack', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
  ];

  const handleNav = (id: AppView) => {
    onViewChange(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans antialiased text-slate-900">
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-8 flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200">
              <span className="text-white font-black text-2xl tracking-tighter">PS</span>
            </div>
            <div>
              <span className="font-black text-xl tracking-tight block leading-tight">ProStaff</span>
              <span className="text-[10px] uppercase tracking-widest font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded mt-1 inline-block">Enterprise</span>
            </div>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id as AppView)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all group ${
                  currentView === item.id
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
                aria-current={currentView === item.id ? 'page' : undefined}
              >
                <svg className={`w-6 h-6 ${currentView === item.id ? 'text-indigo-200' : 'text-slate-400 group-hover:text-indigo-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} />
                </svg>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-6 mt-auto">
            <div className="bg-slate-950 rounded-3xl p-6 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-500"></div>
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-2">Hackathon Edition</p>
              <p className="text-sm font-bold">Standard Staffing ERP</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-[10px] text-slate-400 font-bold">System Status: OK</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="bg-white/70 backdrop-blur-xl border-b border-slate-200 h-20 flex items-center justify-between px-6 sm:px-10 sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 md:hidden"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
            </button>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Portal</span>
              <span className="text-slate-200">/</span>
              <span className="text-slate-900 font-black uppercase tracking-widest text-[10px]">{currentView.replace('_', ' ')}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-xs font-black text-slate-900">Administrator</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global Ops</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-sm shadow-sm">
              AD
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 sm:p-10 scroll-smooth">
          <div className="max-w-7xl mx-auto pb-12">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
