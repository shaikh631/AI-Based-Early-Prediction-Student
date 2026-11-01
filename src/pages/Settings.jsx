import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings as SettingsIcon,
  Sliders,
  Shield,
  Bell,
  User,
  Building2,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Calendar
} from 'lucide-react';

export default function Settings() {
  const {
    thresholds,
    updateThresholds,
    academicYear,
    setAcademicYear,
    departments,
    resetToDefault,
    addToast
  } = useApp();

  // Local state for thresholds form
  const [localThresholds, setLocalThresholds] = useState({
    lowMax: thresholds.lowMax,
    mediumMax: thresholds.mediumMax,
    highMin: thresholds.highMin
  });

  const [thresholdError, setThresholdError] = useState('');

  // Faculty profile state
  const [profile, setProfile] = useState({
    name: 'Ms. Nagrani Seema',
    role: 'Assistant Professor & PBL Project Coordinator',
    department: 'Artificial Intelligence & Machine Learning',
    email: 'nagrani.seema@tcetmumbai.in',
    institution: 'Thakur College of Engineering and Technology (TCET)'
  });

  // Notifications state
  const [notifications, setNotifications] = useState({
    emailHighRisk: true,
    weeklyDigest: true,
    interventionReminders: true,
    attendanceAlerts: true
  });

  // Privacy toggles
  const [privacy, setPrivacy] = useState({
    maskFinancialFlag: true,
    anonymizeAuditExport: false,
    requireReviewBeforeAction: true
  });

  const handleSaveThresholds = (e) => {
    e.preventDefault();
    const low = Number(localThresholds.lowMax);
    const med = Number(localThresholds.mediumMax);

    if (low >= med) {
      setThresholdError('Low Risk threshold must be strictly less than Medium Risk threshold.');
      return;
    }
    if (low < 10 || med > 90) {
      setThresholdError('Thresholds must be reasonable boundaries (e.g., Low: 10-40, Medium: 41-75).');
      return;
    }

    setThresholdError('');
    updateThresholds({
      lowMax: low,
      mediumMax: med,
      highMin: med + 1
    });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    addToast("Faculty advisor profile saved successfully.", "success");
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <SettingsIcon className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              System Settings & Risk Policy Configuration
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure institutional risk cutoffs, academic terms, notifications, and ethical AI safeguards.
          </p>
        </div>

        <button
          onClick={resetToDefault}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All to Defaults</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Risk Thresholds & Privacy (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card 1: Configurable Risk Thresholds (Section 11 requirement) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900">Institutional Risk Cutoff Thresholds</h3>
              </div>
              <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold border border-indigo-200">
                Live Re-indexing
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Define the boundary values (0 to 100) separating Low, Medium, and High risk classifications.
              Updating these cutoffs will automatically re-classify all active students in the cohort.
            </p>

            {thresholdError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{thresholdError}</span>
              </div>
            )}

            <form onSubmit={handleSaveThresholds} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-emerald-700">Low Risk Cutoff (Max)</span>
                    <span className="font-mono font-bold text-slate-800">&le; {localThresholds.lowMax}%</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="45"
                    value={localThresholds.lowMax}
                    onChange={(e) => setLocalThresholds({ ...localThresholds, lowMax: Number(e.target.value) })}
                    className="w-full accent-emerald-600"
                  />
                  <p className="text-[10px] text-slate-400">Score &le; {localThresholds.lowMax} = Low Risk</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-amber-700">Medium Risk Cutoff (Max)</span>
                    <span className="font-mono font-bold text-slate-800">&le; {localThresholds.mediumMax}%</span>
                  </div>
                  <input
                    type="range"
                    min="46"
                    max="80"
                    value={localThresholds.mediumMax}
                    onChange={(e) => setLocalThresholds({ ...localThresholds, mediumMax: Number(e.target.value) })}
                    className="w-full accent-amber-600"
                  />
                  <p className="text-[10px] text-slate-400">
                    Score &gt; {localThresholds.mediumMax} = High Risk (&ge;{localThresholds.mediumMax + 1}%)
                  </p>
                </div>
              </div>

              {/* Threshold Preview Bar */}
              <div className="pt-2">
                <p className="text-xs font-semibold text-slate-700 mb-1.5">Visual Tier Spectrum</p>
                <div className="h-4 rounded-full overflow-hidden flex text-[9px] font-bold text-white text-center leading-4 shadow-inner">
                  <div style={{ width: `${localThresholds.lowMax}%` }} className="bg-emerald-500">
                    Low (0-{localThresholds.lowMax}%)
                  </div>
                  <div style={{ width: `${localThresholds.mediumMax - localThresholds.lowMax}%` }} className="bg-amber-500">
                    Medium ({localThresholds.lowMax + 1}-{localThresholds.mediumMax}%)
                  </div>
                  <div style={{ width: `${100 - localThresholds.mediumMax}%` }} className="bg-rose-500">
                    High ({localThresholds.mediumMax + 1}-100%)
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Apply New Thresholds</span>
                </button>
              </div>
            </form>
          </div>

          {/* Card 2: Privacy & Responsible AI Controls (Section 14) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Shield className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-900">Privacy & Responsible AI Governance</h3>
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-slate-50 transition border border-slate-100">
                <input
                  type="checkbox"
                  checked={privacy.maskFinancialFlag}
                  onChange={(e) => {
                    setPrivacy({ ...privacy, maskFinancialFlag: e.target.checked });
                    addToast(`Financial hardship flag visibility ${e.target.checked ? 'restricted' : 'opened'}.`, 'info');
                  }}
                  className="rounded text-indigo-600 mt-0.5"
                />
                <div>
                  <p className="text-xs font-bold text-slate-800">Restrict Sensitive Financial Indicators</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Hides financial difficulty flags from general faculty view; routes directly to Dean of Student Welfare.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-slate-50 transition border border-slate-100">
                <input
                  type="checkbox"
                  checked={privacy.requireReviewBeforeAction}
                  onChange={(e) => {
                    setPrivacy({ ...privacy, requireReviewBeforeAction: e.target.checked });
                    addToast("Human-in-the-loop review policy updated.", 'info');
                  }}
                  className="rounded text-indigo-600 mt-0.5"
                />
                <div>
                  <p className="text-xs font-bold text-slate-800">Mandatory Human-in-the-Loop Review (NFR-04)</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Prevents automated transmission of parent warning notices without explicit faculty proctor sign-off.
                  </p>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Faculty Profile & Academic Term (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card 3: Faculty Proctor Profile */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <User className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-sm text-slate-900">Faculty Supervisor Account</h3>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Supervisor Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Designation & Role</label>
                <input
                  type="text"
                  value={profile.role}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Department</label>
                <input
                  type="text"
                  value={profile.department}
                  onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Institution</label>
                <input
                  type="text"
                  value={profile.institution}
                  onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>

          {/* Card 4: Academic Year & Term Settings */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-sm text-slate-900">Academic Year & Session</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Active Academic Term</label>
                <select
                  value={academicYear}
                  onChange={(e) => {
                    setAcademicYear(e.target.value);
                    addToast(`Active academic session switched to ${e.target.value}.`, 'info');
                  }}
                  className="w-full px-3 py-2 border rounded-xl bg-white font-medium text-slate-800"
                >
                  <option value="2026-2027 (Odd Sem)">2026-2027 (Odd Semester: Sem 3, 5, 7)</option>
                  <option value="2026-2027 (Even Sem)">2026-2027 (Even Semester: Sem 4, 6, 8)</option>
                  <option value="2025-2026 (Archive)">2025-2026 (Historical Archive)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 space-y-1">
                <p className="font-semibold text-slate-700">Project Credit:</p>
                <p>Thakur College of Engineering & Technology (TCET)</p>
                <p>Team: Shaikh Aayan Altaf, Ayan Shaikh, Amaan Siddiqui</p>
                <p>Mentor: Ms. Nagrani Seema (Assistant Professor)</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
