
import React, { useState } from 'react';
import { SQL_SCHEMA, SQL_STORED_PROCEDURES, DOTNET_API_CODE } from '../backend-artifacts';

export const TechSpecs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SQL' | 'SP' | 'DOTNET'>('SQL');

  return (
    <div className="space-y-6">
      <div className="flex flex-col mb-8">
        <h1 className="text-3xl font-black text-slate-900">System Architecture</h1>
        <p className="text-slate-500">Industry-grade backend implementation using SQL Server JSON processing and ASP.NET Core.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="flex border-b border-slate-100">
          <button 
            onClick={() => setActiveTab('SQL')}
            className={`px-8 py-4 text-sm font-bold transition-all ${activeTab === 'SQL' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Database Schema
          </button>
          <button 
            onClick={() => setActiveTab('SP')}
            className={`px-8 py-4 text-sm font-bold transition-all ${activeTab === 'SP' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Stored Procedures (JSON)
          </button>
          <button 
            onClick={() => setActiveTab('DOTNET')}
            className={`px-8 py-4 text-sm font-bold transition-all ${activeTab === 'DOTNET' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            ASP.NET Controller
          </button>
        </div>
        
        <div className="p-0 bg-slate-900 h-[600px] overflow-y-auto">
          <pre className="p-8 text-indigo-300 font-mono text-sm leading-relaxed">
            <code>
              {activeTab === 'SQL' && SQL_SCHEMA}
              {activeTab === 'SP' && SQL_STORED_PROCEDURES}
              {activeTab === 'DOTNET' && DOTNET_API_CODE}
            </code>
          </pre>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
            <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Why JSON in SQL Server?
            </h4>
            <ul className="text-sm text-indigo-800 space-y-2 list-disc list-inside">
                <li>Decouples API from DB Table Schema</li>
                <li>Reduces round-trips for batch updates</li>
                <li>Simpler API payloads using <code>OPENJSON</code></li>
                <li>Ensures all business logic stays in the database layer</li>
            </ul>
        </div>
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
            <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Hackathon Success Tips
            </h4>
            <ul className="text-sm text-emerald-800 space-y-2 list-disc list-inside">
                <li>Explain the <code>TRY...CATCH</code> in SPs for error handling</li>
                <li>Highlight <code>FOR JSON PATH</code> for the response structure</li>
                <li>Demo the "Payroll Ready" state to show business value</li>
                <li>Use Dapper in C# for lightweight, fast execution</li>
            </ul>
        </div>
      </div>
    </div>
  );
};
