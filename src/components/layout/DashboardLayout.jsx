import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import StudentProfileModal from '../students/StudentProfileModal';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { 
    toasts, 
    removeToast, 
    isProfileModalOpen, 
    selectedStudentId, 
    closeStudentProfile,
    students 
  } = useApp();

  const activeStudent = students.find(s => s.id === selectedStudentId);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Container */}
      <div className="lg:pl-72 flex flex-col flex-1 min-w-0 transition-all">
        {/* Navbar */}
        <Navbar 
          onToggleSidebar={() => setSidebarOpen(prev => !prev)} 
        />

        {/* Dynamic Route Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-200/80 bg-white/60 py-4 px-6 text-center text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <p>
              <strong>TCET AI&ML PBL Project</strong> • Explainable AI-Based Early Prediction and Intervention System
            </p>
            <p className="text-slate-400">
              Submitted under Ms. Nagrani Seema • Team: Aayan Altaf, Ayan Shaikh, Amaan Siddiqui
            </p>
          </div>
        </footer>
      </div>

      {/* Global Student Profile Modal */}
      {isProfileModalOpen && activeStudent && (
        <StudentProfileModal 
          student={activeStudent} 
          onClose={closeStudentProfile} 
        />
      )}

      {/* Toast Notification Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl shadow-lg border text-xs sm:text-sm font-medium transition-all transform animate-in slide-in-from-bottom-2 duration-200
              ${toast.type === 'success' 
                ? 'bg-emerald-900/90 text-emerald-50 border-emerald-700/60 shadow-emerald-950/20' 
                : toast.type === 'warning'
                ? 'bg-amber-900/90 text-amber-50 border-amber-700/60 shadow-amber-950/20'
                : 'bg-slate-900/90 text-slate-50 border-slate-700/60 shadow-slate-950/20'
              }
            `}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />}
            
            <p className="flex-1 leading-snug">{toast.message}</p>
            
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
