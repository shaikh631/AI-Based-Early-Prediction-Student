import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { calculateAcademicRisk, simulateWhatIf } from '../services/predictionService';
import { GLOBAL_FEATURE_IMPORTANCE } from '../data/modelEvaluation';
import {
  Sparkles,
  BarChart3,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  TrendingDown,
  TrendingUp,
  Info,
  ArrowRight,
  ShieldCheck,
  User
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid
} from 'recharts';

export default function ExplainableAI() {
  const { students, thresholds, addToast, openStudentProfile } = useApp();

  // Student selection for local explanation
  const [selectedStudentId, setSelectedStudentId] = useState(() => {
    // Default to a high risk student like STU102 if available
    const high = students.find(s => s.riskCategory === "High");
    return high ? high.id : students[0]?.id;
  });

  const selectedStudent = useMemo(() => {
    return students.find(s => s.id === selectedStudentId) || students[0];
  }, [students, selectedStudentId]);

  // Current student calculation
  const currentRisk = useMemo(() => {
    if (!selectedStudent) return null;
    return calculateAcademicRisk(selectedStudent, thresholds);
  }, [selectedStudent, thresholds]);

  // Counterfactual / What-If sliders state initialized with selected student values
  const [whatIfAttendance, setWhatIfAttendance] = useState(selectedStudent?.attendance || 75);
  const [whatIfAssignment, setWhatIfAssignment] = useState(selectedStudent?.assignmentRate || 75);
  const [whatIfInternal, setWhatIfInternal] = useState(selectedStudent?.internalExamScore || 65);
  const [whatIfBacklogs, setWhatIfBacklogs] = useState(selectedStudent?.failedSubjects || 0);

  // Sync sliders when selected student changes
  const handleSelectStudent = (id) => {
    setSelectedStudentId(id);
    const stu = students.find(s => s.id === id);
    if (stu) {
      setWhatIfAttendance(stu.attendance);
      setWhatIfAssignment(stu.assignmentRate);
      setWhatIfInternal(stu.internalExamScore);
      setWhatIfBacklogs(stu.failedSubjects);
    }
  };

  // What-If simulation result
  const whatIfResult = useMemo(() => {
    if (!selectedStudent) return null;
    return simulateWhatIf(selectedStudent, {
      attendance: Number(whatIfAttendance),
      assignmentRate: Number(whatIfAssignment),
      internalExamScore: Number(whatIfInternal),
      failedSubjects: Number(whatIfBacklogs)
    });
  }, [selectedStudent, whatIfAttendance, whatIfAssignment, whatIfInternal, whatIfBacklogs]);

  // Chart data for Local Attribution
  const localAttributionData = useMemo(() => {
    if (!currentRisk) return [];
    return currentRisk.factors.map(f => ({
      name: f.name,
      contribution: Number(f.rawContribution.toFixed(1)),
      value: f.value,
      impact: f.impact,
      explanation: f.explanation
    }));
  }, [currentRisk]);

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Explainable AI (XAI) Attribution Hub
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-violet-50 text-violet-700 font-bold border border-violet-200">
              SHAP Principles
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Unpacking the "Black Box": Local feature contributions, evidence narratives, and counterfactual simulation.
          </p>
        </div>

        {/* Student Selector */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5 text-xs">
          <User className="w-4 h-4 text-slate-400 ml-1.5" />
          <span className="font-semibold text-slate-700">Subject:</span>
          <select
            value={selectedStudentId}
            onChange={(e) => handleSelectStudent(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 font-semibold focus:outline-none"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.id} - {s.name} ({s.riskCategory} Risk: {s.riskScore}%)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Student Profile Summary Card */}
      {selectedStudent && currentRisk && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-slate-900">{selectedStudent.name}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">{selectedStudent.id}</span>
                <span className="text-xs text-slate-500">• {selectedStudent.department} (Sem {selectedStudent.semester})</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Baseline Model Expectation: ~38% Risk • Student Computed Risk: <strong>{currentRisk.riskScore}% ({currentRisk.riskCategory})</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className={`
                px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5
                ${currentRisk.riskCategory === 'High'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : currentRisk.riskCategory === 'Medium'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }
              `}>
                <AlertTriangle className="w-3.5 h-3.5" />
                {currentRisk.riskCategory} Risk ({currentRisk.riskScore}%)
              </span>
              <button
                onClick={() => openStudentProfile(selectedStudent.id)}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition"
              >
                Full Dossier
              </button>
            </div>
          </div>

          {/* Natural Language Explanation (Section 7 B) */}
          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed">
            <span className="font-bold text-indigo-900 mr-1.5">Synthesized Diagnostic Rationale:</span>
            Student <strong>{selectedStudent.name} ({selectedStudent.id})</strong> is classified as <strong>{currentRisk.riskCategory} Risk</strong> ({currentRisk.riskScore}%) primarily because
            attendance is <strong>{selectedStudent.attendance}%</strong> ({selectedStudent.attendance < 75 ? 'below university 75% cutoff' : 'satisfactory'}),
            internal examination score is <strong>{selectedStudent.internalExamScore}/100</strong>,
            and assignment completion is at <strong>{selectedStudent.assignmentRate}%</strong>.
            {selectedStudent.failedSubjects > 0 && ` Additionally, ${selectedStudent.failedSubjects} active backlog(s) compound semester load.`}
          </div>
        </div>
      )}

      {/* Grid: Local SHAP Waterfall/Bar (Left) & Global Feature Importance (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Local SHAP Waterfall (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Local Feature Attributions (SHAP Concept)</h3>
                <p className="text-xs text-slate-400">Direction & magnitude of each variable for {selectedStudent?.name}</p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-semibold">
                <span className="text-rose-600 flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-rose-500"></span>Increases Risk (+)
                </span>
                <span className="text-emerald-600 flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>Reduces Risk (-)
                </span>
              </div>
            </div>

            <div className="h-64 w-full mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={localAttributionData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" domain={[-15, 25]} tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} />
                  <ReTooltip
                    formatter={(val, name, item) => [
                      `${val > 0 ? '+' : ''}${val} risk impact`,
                      `Student Value: ${item.payload.value}`
                    ]}
                  />
                  <Bar dataKey="contribution" radius={[0, 4, 4, 0]}>
                    {localAttributionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.contribution > 0 ? '#ef4444' : '#10b981'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Itemized Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4 pt-4 border-t border-slate-100">
            {currentRisk?.factors.slice(0, 4).map((f, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{f.name}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    f.impact === 'increases_risk' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {f.rawContribution > 0 ? `+${f.rawContribution.toFixed(1)}` : f.rawContribution.toFixed(1)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">{f.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Global Feature Importance (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Cohort Global Feature Importance</h3>
                <p className="text-xs text-slate-400">Aggregated SHAP mean absolute value across dataset</p>
              </div>
              <span className="text-[10px] font-mono bg-slate-50 px-2 py-0.5 rounded border text-slate-600">
                N=649 Benchmarks
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {GLOBAL_FEATURE_IMPORTANCE.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{item.feature}</span>
                    <span className="font-mono text-slate-500 text-[11px]">Weight: {(item.importance * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.importance * 100 * 3.2}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">{item.domain}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-[11px] text-indigo-900 leading-relaxed">
            <span className="font-bold">Intervention Note:</span> A high feature importance identifies predictive association, not direct causality. Interventions must address pedagogical root causes.
          </div>
        </div>

      </div>

      {/* SECTION C: What-If Counterfactual Analysis Simulator */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Interactive What-If (Counterfactual) Simulator
              </h3>
              <p className="text-xs text-slate-400">
                Test hypothetical improvements for {selectedStudent?.name} to estimate intervention impact
              </p>
            </div>
          </div>

          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
            Simulated Hypothesis Mode
          </span>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Slider 1: Attendance */}
          <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700">Hypothetical Attendance</span>
              <span className="font-mono font-bold text-indigo-600">{whatIfAttendance}%</span>
            </div>
            <input
              type="range"
              min="40"
              max="100"
              value={whatIfAttendance}
              onChange={(e) => setWhatIfAttendance(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Original: {selectedStudent?.attendance}%</span>
              <span>Target: 85%</span>
            </div>
          </div>

          {/* Slider 2: Assignment Rate */}
          <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700">Assignment Rate</span>
              <span className="font-mono font-bold text-indigo-600">{whatIfAssignment}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="100"
              value={whatIfAssignment}
              onChange={(e) => setWhatIfAssignment(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Original: {selectedStudent?.assignmentRate}%</span>
              <span>Target: 90%</span>
            </div>
          </div>

          {/* Slider 3: Internal Exam */}
          <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700">Re-test / Midterm Score</span>
              <span className="font-mono font-bold text-indigo-600">{whatIfInternal}/100</span>
            </div>
            <input
              type="range"
              min="30"
              max="100"
              value={whatIfInternal}
              onChange={(e) => setWhatIfInternal(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Original: {selectedStudent?.internalExamScore}</span>
              <span>Passing: 50+</span>
            </div>
          </div>

          {/* Slider 4: Cleared Backlogs */}
          <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700">Remaining Backlogs</span>
              <span className="font-mono font-bold text-indigo-600">{whatIfBacklogs}</span>
            </div>
            <input
              type="range"
              min="0"
              max="4"
              value={whatIfBacklogs}
              onChange={(e) => setWhatIfBacklogs(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Original: {selectedStudent?.failedSubjects}</span>
              <span>Target: 0 KT</span>
            </div>
          </div>
        </div>

        {/* Counterfactual Outcome Banner */}
        {whatIfResult && (
          <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="text-left">
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Simulated Trajectory</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="text-xl font-bold">
                    <span className="text-rose-400">{whatIfResult.original.riskScore}%</span>
                    <span className="mx-2 text-slate-500">➔</span>
                    <span className="text-emerald-400">{whatIfResult.simulated.riskScore}%</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    whatIfResult.simulated.riskCategory === 'Low' ? 'bg-emerald-500/20 text-emerald-300' :
                    whatIfResult.simulated.riskCategory === 'Medium' ? 'bg-amber-500/20 text-amber-300' :
                    'bg-rose-500/20 text-rose-300'
                  }`}>
                    {whatIfResult.simulated.riskCategory} Risk
                  </span>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-300 sm:text-right">
              <p className="font-semibold text-emerald-300">{whatIfResult.message}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Simulated counterfactual model estimation. Not causal certainty.
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
