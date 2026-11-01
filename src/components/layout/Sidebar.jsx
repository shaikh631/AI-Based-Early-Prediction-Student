import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BrainCircuit,
  Sparkles,
  ShieldAlert,
  BarChart3,
  Settings,
  GraduationCap,
  ChevronRight,
  Info,
  X
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/students', label: 'Students', icon: Users },
  { path: '/prediction', label: 'Risk Prediction', icon: BrainCircuit },
  { path: '/explainable-ai', label: 'Explainable AI', icon: Sparkles, badge: 'XAI' },
  { path: '/interventions', label: 'Intervention Center', icon: ShieldAlert },
  { path: '/analytics', label: 'Analytics & Reports', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50
        w-72 bg-slate-900 text-slate-200
        flex flex-col border-r border-slate-800
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand / Logo */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 ring-1 ring-white/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-base tracking-tight">XAI At-Risk</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">PBL</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">TCET Early Warning System</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Framework Banner: PREDICT -> EXPLAIN -> INTERVENE */}
        <div className="mx-4 my-3 p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-[11px] text-indigo-200 flex items-center justify-between">
          <div className="flex items-center gap-1 font-mono font-medium tracking-tight">
            <span className="text-indigo-400">PREDICT</span>
            <span className="text-slate-500">→</span>
            <span className="text-violet-400">EXPLAIN</span>
            <span className="text-slate-500">→</span>
            <span className="text-emerald-400">ACT</span>
          </div>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-300 font-semibold uppercase">Framework</span>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Main Navigation
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`
                  flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                  ${isActive 
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30' 
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-white/20 text-white' : 'bg-violet-500/20 text-violet-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                </div>
              </NavLink>
            );
          })}
        </div>

        {/* Ethical AI Notice in Sidebar */}
        <div className="p-3 mx-3 mb-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 text-amber-300 font-medium mb-1">
            <Info className="w-3.5 h-3.5" />
            <span>Human-in-the-Loop</span>
          </div>
          <p className="text-[10px] leading-relaxed text-slate-400">
            AI risk scores are decision-support estimates. Faculty discretion is mandatory before interventions.
          </p>
        </div>

        {/* User Profile / Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center font-bold text-white text-sm shadow-inner">
            NS
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">Ms. Nagrani Seema</p>
            <p className="text-[11px] text-slate-400 truncate">Assistant Professor & Guide</p>
            <p className="text-[10px] text-indigo-400 font-mono">Dept. of AI & ML, TCET</p>
          </div>
        </div>
      </aside>
    </>
  );
}
