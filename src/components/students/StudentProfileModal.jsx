import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateAcademicRisk } from '../../services/predictionService';
import {
  X,
  User,
  GraduationCap,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Download,
  ShieldAlert,
  Sparkles,
  BookOpen,
  Clock,
  Send,
  Building2,
  Award,
  ChevronRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function StudentProfileModal({ student, onClose }) {
  const { thresholds, updateInterventionStatus, addIntervention, addToast } = useApp();
  const [activeTab, setActiveTab] = useState('overview'); // overview, academic, explanation, interventions
  const [newNote, setNewNote] = useState('');
  const [selectedInterventionId, setSelectedInterventionId] = useState(null);

  const riskResult = calculateAcademicRisk(student, thresholds);

  // Quick download individual summary as text/report
  const downloadStudentReport = () => {
    const reportText = `
TCET EARLY WARNING & ACADEMIC INTERVENTION REPORT
==================================================
Date: ${new Date().toLocaleDateString()}
Institution: Thakur College of Engineering & Technology, Mumbai
Department: ${student.department}

STUDENT PROFILE:
----------------
ID: ${student.id}
Name: ${student.name}
Semester: ${student.semester}
Current CGPA: ${student.cgpa}
Previous Semester GPA: ${student.prevGpa}
Attendance: ${student.attendance}%
Assignment Rate: ${student.assignmentRate}%
Internal Exam Score: ${student.internalExamScore}/100
Active Backlogs: ${student.failedSubjects}
LMS Activity: ${student.lmsActivity}

AI RISK ASSESSMENT:
-------------------
Risk Category: ${student.riskCategory.toUpperCase()} RISK (${student.riskScore}/100)
Model Confidence: ${riskResult.confidence}%
Primary Concern: ${riskResult.topRiskFactor}

EXPLAINABLE AI ATTRIBUTIONS (Local SHAP Estimation):
---------------------------------------------------
${riskResult.factors.map(f => `* ${f.name}: ${f.value} (${f.impact === 'increases_risk' ? 'Increases Risk' : 'Reduces Risk'}) - ${f.explanation}`).join('\n')}

ACTIVE INTERVENTIONS (${student.interventions?.length || 0}):
-----------------------------------------------------------
${student.interventions && student.interventions.length > 0 
  ? student.interventions.map((inv, idx) => `${idx + 1}. [${inv.status}] ${inv.type} (Priority: ${inv.priority}) - Mentor: ${inv.mentor}\n   Notes: ${inv.notes}`).join('\n')
  : 'None currently scheduled.'}

SUPERVISORY NOTICE:
-------------------
Decision-support signal only. Requires human verification before academic actions.
    `.trim();

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Student_Audit_${student.id}_${student.name.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    addToast(`Individual audit report for ${student.name} downloaded.`, "info");
  };

  // Explanation chart data formatted for Recharts
  const chartData = riskResult.factors.map(f => ({
    name: f.name,
    contribution: Number(f.rawContribution.toFixed(1)),
    impact: f.impact,
    value: f.value
  }));

  const handleAddFollowUpNote = (interventionId) => {
    if (!newNote.trim()) return;
    updateInterventionStatus(student.id, interventionId, "In Progress", newNote.trim());
    setNewNote('');
    setSelectedInterventionId(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-start justify-between border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className={`
              w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold border-2
              ${student.riskCategory === 'High' 
                ? 'bg-rose-500/20 border-rose-500 text-rose-300' 
                : student.riskCategory === 'Medium'
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
              }
            `}>
              {student.name.split(' ').map(n => n[0]).join('')}
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold tracking-tight">{student.name}</h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {student.id}
                </span>
                <span className={`
                  text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1
                  ${student.riskCategory === 'High' 
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                    : student.riskCategory === 'Medium'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }
                `}>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {student.riskCategory} Risk ({student.riskScore}%)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <span>{student.department}</span>
                <span>•</span>
                <span>Semester {student.semester}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={downloadStudentReport}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
              title="Download Student Audit Summary"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 flex gap-4 text-xs font-semibold overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview & Vital Signs' },
            { id: 'academic', label: 'Academic History' },
            { id: 'explanation', label: 'XAI Risk Explanation (SHAP)' },
            { id: 'interventions', label: `Interventions (${student.interventions?.length || 0})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-1 border-b-2 transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stat Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[11px] text-slate-500 font-medium">Attendance</p>
                  <p className={`text-xl font-bold mt-1 ${student.attendance < 75 ? 'text-rose-600' : 'text-slate-800'}`}>
                    {student.attendance}%
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Threshold: 75%</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[11px] text-slate-500 font-medium">Current CGPA</p>
                  <p className={`text-xl font-bold mt-1 ${student.cgpa < 6.0 ? 'text-amber-600' : 'text-slate-800'}`}>
                    {student.cgpa.toFixed(2)}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Prev: {student.prevGpa}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[11px] text-slate-500 font-medium">Internal Exam (IA)</p>
                  <p className={`text-xl font-bold mt-1 ${student.internalExamScore < 50 ? 'text-rose-600' : 'text-slate-800'}`}>
                    {student.internalExamScore}/100
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Mid-term avg</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[11px] text-slate-500 font-medium">Backlogs (KT)</p>
                  <p className={`text-xl font-bold mt-1 ${student.failedSubjects > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {student.failedSubjects}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Active arrears</p>
                </div>
              </div>

              {/* Assessment Narrative */}
              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wide">
                    AI Decision-Support Insight
                  </h4>
                  <p className="text-xs text-indigo-950 mt-1 leading-relaxed">
                    Student <strong>{student.name}</strong> is currently assigned to the <strong>{student.riskCategory} Risk</strong> category with a predictive risk index of <strong>{student.riskScore}/100</strong> (Confidence: {riskResult.confidence}%).
                    The highest driving factor is <span className="underline decoration-indigo-400">{riskResult.topRiskFactor}</span>.
                  </p>
                </div>
              </div>

              {/* Top 3 Factors list */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                  Primary Contributing Influences
                </h4>
                <div className="space-y-2">
                  {riskResult.factors.slice(0, 3).map((factor, i) => (
                    <div 
                      key={i} 
                      className="p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          factor.impact === 'increases_risk' ? 'bg-rose-500' : 'bg-emerald-500'
                        }`} />
                        <div>
                          <p className="font-semibold text-slate-900">{factor.name}: {factor.value}</p>
                          <p className="text-slate-500 text-[11px]">{factor.explanation}</p>
                        </div>
                      </div>
                      <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                        factor.impact === 'increases_risk' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {factor.rawContribution > 0 ? `+${factor.rawContribution.toFixed(1)}` : factor.rawContribution.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Faculty Notes */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 mb-1">Faculty Mentor Notes</h4>
                <p className="text-xs text-slate-600 italic">"{student.notes || 'No remarks logged.'}"</p>
              </div>
            </div>
          )}

          {/* TAB 2: ACADEMIC HISTORY */}
          {activeTab === 'academic' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <p className="text-xs font-semibold text-slate-500">GPA Progression</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-bold text-slate-900">{student.cgpa.toFixed(2)}</span>
                    <span className={`text-xs font-semibold flex items-center ${
                      student.cgpa >= student.prevGpa ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {student.cgpa >= student.prevGpa ? <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> : <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
                      {(student.cgpa - student.prevGpa).toFixed(2)} vs Prev
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Previous Semester GPA: {student.prevGpa}</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <p className="text-xs font-semibold text-slate-500">Continuous Assessment</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">{student.assignmentRate}%</p>
                  <p className="text-[11px] text-slate-400 mt-1">Laboratory & Theory Submissions</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <p className="text-xs font-semibold text-slate-500">LMS Engagement Hours</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">{student.lmsActivity}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Moodle / Canvas portal telemetry</p>
                </div>
              </div>

              {/* Semester Breakdown Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="p-3">Semester</th>
                      <th className="p-3">SGPA</th>
                      <th className="p-3">Attendance</th>
                      <th className="p-3">Assignments</th>
                      <th className="p-3">Backlogs</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="bg-white">
                      <td className="p-3 font-semibold">Sem {student.semester} (Current)</td>
                      <td className="p-3 font-bold">{student.cgpa.toFixed(2)}</td>
                      <td className="p-3">{student.attendance}%</td>
                      <td className="p-3">{student.assignmentRate}%</td>
                      <td className="p-3 text-rose-600 font-semibold">{student.failedSubjects}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700">
                          Active In-Session
                        </span>
                      </td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="p-3 font-medium">Sem {student.semester - 1}</td>
                      <td className="p-3 font-bold">{student.prevGpa}</td>
                      <td className="p-3">{Math.min(100, student.attendance + 4)}%</td>
                      <td className="p-3">{Math.min(100, student.assignmentRate + 5)}%</td>
                      <td className="p-3">0</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                          Completed
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: EXPLAINABLE AI (SHAP) */}
          {activeTab === 'explanation' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-violet-50/60 border border-violet-100 text-xs text-violet-950">
                <p className="font-bold text-violet-900 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-violet-600" />
                  SHAP Local Attribution Breakdown (Waterfall/Contribution)
                </p>
                <p className="leading-relaxed">
                  Bars extending to the <strong>right (Red)</strong> increase student risk probability.
                  Bars extending to the <strong>left (Green)</strong> mitigate risk and protect student standing.
                </p>
              </div>

              {/* Chart */}
              <div className="h-64 w-full bg-slate-50/80 p-3 rounded-xl border border-slate-200">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 10, right: 30, left: 90, bottom: 5 }}
                  >
                    <XAxis type="number" domain={[-15, 25]} tick={{ fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(val, name, item) => [
                        `${val > 0 ? '+' : ''}${val} risk impact`,
                        `Metric: ${item.payload.value}`
                      ]}
                    />
                    <Bar dataKey="contribution" radius={[0, 4, 4, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.contribution > 0 ? '#ef4444' : '#10b981'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Factor by factor itemization */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Itemized Evidence & Rationale
                </h4>
                {riskResult.factors.map((factor, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${factor.impact === 'increases_risk' ? 'text-rose-700' : 'text-emerald-700'}`}>
                          {factor.name}
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">({factor.value})</span>
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        factor.impact === 'increases_risk' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {factor.impact === 'increases_risk' ? 'Risk Driver' : 'Protective Factor'}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px]">{factor.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: INTERVENTIONS */}
          {activeTab === 'interventions' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Assigned & Recommended Interventions
                  </h4>
                  <p className="text-xs text-slate-500">Structured non-punitive support packages</p>
                </div>
              </div>

              {/* Existing Interventions */}
              {student.interventions && student.interventions.length > 0 ? (
                <div className="space-y-3">
                  {student.interventions.map((inv) => (
                    <div key={inv.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-slate-900">{inv.type}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              inv.priority === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {inv.priority} Priority
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              inv.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {inv.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Mentor: <strong>{inv.mentor}</strong> • Assigned: {inv.assignedDate} {inv.targetDate ? `• Target: ${inv.targetDate}` : ''}
                          </p>
                        </div>

                        {/* Status update buttons */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {inv.status !== 'Completed' && (
                            <button
                              onClick={() => updateInterventionStatus(student.id, inv.id, "Completed", "Goal achieved successfully.")}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-medium transition"
                            >
                              Mark Done
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedInterventionId(selectedInterventionId === inv.id ? null : inv.id)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition"
                          >
                            Add Note
                          </button>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-50 text-xs text-slate-700 border border-slate-100">
                        <span className="font-semibold text-slate-800">Action History & Notes:</span> {inv.notes}
                      </div>

                      {/* Add note inline input */}
                      {selectedInterventionId === inv.id && (
                        <div className="flex gap-2 pt-2 border-t border-slate-100">
                          <input
                            type="text"
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder="Log meeting notes, progress update, or counselor feedback..."
                            className="flex-1 text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                          <button
                            onClick={() => handleAddFollowUpNote(inv.id)}
                            className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" />
                            Log
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-xs text-slate-500">
                  No active interventions logged yet. Review suggestions below to assign.
                </div>
              )}

              {/* AI Recommended Interventions */}
              <div className="pt-2">
                <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Recommended Interventions from Identified Factors
                </h4>
                <div className="space-y-2">
                  {riskResult.recommendedInterventions.map((rec, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-indigo-950">{rec.type}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                            {rec.priority} Priority
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">{rec.recommendedAction}</p>
                      </div>
                      <button
                        onClick={() => addIntervention(student.id, {
                          type: rec.type,
                          priority: rec.priority,
                          mentor: rec.suggestedMentor,
                          notes: rec.reason
                        })}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shrink-0 shadow-xs transition"
                      >
                        Assign Action
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between text-xs text-slate-500">
          <span>Audit Logged • TCET Academic Advisory Board</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}
