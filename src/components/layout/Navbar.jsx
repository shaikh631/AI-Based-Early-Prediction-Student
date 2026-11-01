import React from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Bell,
  Search,
  Filter,
  Calendar,
  Building2,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

const PAGE_TITLES = {
  '/': { title: 'Academic Risk Dashboard', subtitle: 'Real-time early warning & cohort vulnerability monitor' },
  '/students': { title: 'Student Management', subtitle: 'Comprehensive student registry, indicators & risk records' },
  '/prediction': { title: 'AI Risk Prediction Engine', subtitle: 'Modular early-risk assessment & counterfactual evaluation' },
  '/explainable-ai': { title: 'Explainable AI (XAI) Hub', subtitle: 'SHAP-based local attribution, feature importance & What-If simulator' },
  '/interventions': { title: 'Intervention Center', subtitle: 'Actionable support coordination, mentoring assignments & follow-up' },
  '/analytics': { title: 'Analytics & Model Benchmarks', subtitle: 'Cohort distribution, model comparisons (XGBoost, RF, LR) & CSV audits' },
  '/settings': { title: 'System & Risk Threshold Settings', subtitle: 'Configure institutional risk policy thresholds and preferences' },
};

export default function Navbar({ onToggleSidebar, onQuickSearch }) {
  const location = useLocation();
  const {
    selectedDepartment,
    setSelectedDepartment,
    selectedSemester,
    setSelectedSemester,
    departments,
    stats,
    academicYear
  } = useApp();

  const currentMeta = PAGE_TITLES[location.pathname] || {
    title: 'Student Analytics',
    subtitle: 'TCET Early Warning Decision Support'
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Titles */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                {currentMeta.title}
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                Inference Online
              </span>
            </div>
            <p className="hidden md:block text-xs text-slate-500 font-medium">
              {currentMeta.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Global Filters & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Department Selector */}
          <div className="hidden xl:flex items-center gap-2 bg-slate-50 border border-slate-200/90 rounded-xl px-2.5 py-1.5 text-xs">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="bg-transparent border-none text-slate-700 font-medium focus:outline-none cursor-pointer pr-1"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === "All Departments" ? "All Departments" : dept.replace("Engineering", "Engg.")}
                </option>
              ))}
            </select>
          </div>

          {/* Semester Selector */}
          <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200/90 rounded-xl px-2.5 py-1.5 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="bg-transparent border-none text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="All">All Semesters</option>
              <option value="3">Semester 3 (SE)</option>
              <option value="5">Semester 5 (TE)</option>
              <option value="7">Semester 7 (BE)</option>
            </select>
          </div>

          {/* Academic Term Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700">
            <span>{academicYear}</span>
          </div>

          {/* High Risk Notification Pill */}
          <div className="relative">
            <button 
              title={`${stats.highRisk} students requiring urgent attention`}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition relative flex items-center justify-center"
            >
              <Bell className="w-4 h-4" />
              {stats.highRisk > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {stats.highRisk}
                </span>
              )}
            </button>
          </div>

          {/* College / Institution Badge */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/10 border border-indigo-200 text-indigo-700 font-bold text-xs flex items-center justify-center">
              TCET
            </div>
            <div className="hidden 2xl:block text-left">
              <p className="text-xs font-semibold text-slate-800 leading-tight">Thakur College</p>
              <p className="text-[10px] text-slate-500">Autonomous Institute</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
