import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MODEL_BENCHMARKS } from '../data/modelEvaluation';
import { exportStudentsToCSV, exportInterventionsToCSV } from '../utils/csvExport';
import {
  BarChart3,
  TrendingUp,
  Download,
  Award,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

export default function Analytics() {
  const { students, stats, departments, selectedDepartment, setSelectedDepartment } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('academic'); // 'academic' | 'models'
  const [selectedModelId, setSelectedModelId] = useState('xgboost');

  // Semester-wise distribution
  const semesterStatsData = useMemo(() => {
    const semMap = {
      3: { name: 'Sem 3 (SE)', high: 0, medium: 0, low: 0, total: 0 },
      5: { name: 'Sem 5 (TE)', high: 0, medium: 0, low: 0, total: 0 },
      7: { name: 'Sem 7 (BE)', high: 0, medium: 0, low: 0, total: 0 }
    };

    students.forEach(s => {
      if (semMap[s.semester]) {
        semMap[s.semester].total += 1;
        if (s.riskCategory === 'High') semMap[s.semester].high += 1;
        else if (s.riskCategory === 'Medium') semMap[s.semester].medium += 1;
        else semMap[s.semester].low += 1;
      }
    });

    return Object.values(semMap);
  }, [students]);

  // Model comparison radar data
  const radarData = useMemo(() => [
    { metric: 'Recall (Early Warn)', LR: 74.2, DT: 78.8, RF: 87.9, XGB: 92.4 },
    { metric: 'ROC-AUC', LR: 79.8, DT: 81.4, RF: 92.5, XGB: 94.1 },
    { metric: 'Accuracy', LR: 76.5, DT: 79.0, RF: 87.5, XGB: 89.2 },
    { metric: 'Precision', LR: 71.0, DT: 73.2, RF: 84.1, XGB: 85.7 },
    { metric: 'F1-Score', LR: 72.6, DT: 75.9, RF: 85.9, XGB: 88.9 },
  ], []);

  const activeModel = MODEL_BENCHMARKS.find(m => m.id === selectedModelId) || MODEL_BENCHMARKS[0];

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      
      {/* Top Banner & Export Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Cohort Analytics & ML Benchmarks
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Institutional educational trends, intervention tracking, and machine learning model validation.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => exportStudentsToCSV(students)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Students CSV</span>
          </button>

          <button
            onClick={() => exportInterventionsToCSV(students)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Interventions CSV</span>
          </button>
        </div>
      </div>

      {/* Sub-tabs: Cohort Analytics vs Model Benchmarks */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('academic')}
          className={`px-4 py-2 rounded-lg transition ${
            activeSubTab === 'academic'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Cohort Academic Analytics
        </button>
        <button
          onClick={() => setActiveSubTab('models')}
          className={`px-4 py-2 rounded-lg transition flex items-center gap-1.5 ${
            activeSubTab === 'models'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>ML Model Benchmarks (Chapter 5)</span>
        </button>
      </div>

      {/* SUB-TAB 1: Academic Analytics */}
      {activeSubTab === 'academic' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <p className="text-xs font-medium text-slate-500">Cohort Total Enrolled</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{students.length}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Across 4 Engineering Depts</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <p className="text-xs font-medium text-slate-500">Avg Cumulative CGPA</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {(students.reduce((acc, c) => acc + c.cgpa, 0) / students.length).toFixed(2)}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Target: &ge;6.75</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <p className="text-xs font-medium text-slate-500">Interventions Completed</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.completedInterventions}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{stats.inProgressInterventions} actively running</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <p className="text-xs font-medium text-slate-500">Avg Semester Attendance</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {Math.round(students.reduce((acc, c) => acc + c.attendance, 0) / students.length)}%
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Mandatory cutoff: 75%</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Semester-wise vulnerability */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col">
              <div className="mb-3">
                <h3 className="text-sm font-bold text-slate-900">Semester-wise Risk Prevalence</h3>
                <p className="text-xs text-slate-400">Risk classification breakdown across academic years</p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={semesterStatsData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <ReTooltip />
                    <Legend />
                    <Bar dataKey="high" name="High Risk" fill="#ef4444" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="medium" name="Medium Risk" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="low" name="Low Risk" fill="#10b981" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Attendance vs Risk Score Regression trend */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col">
              <div className="mb-3">
                <h3 className="text-sm font-bold text-slate-900">Intervention Progress Summary</h3>
                <p className="text-xs text-slate-400">Status of active student support actions</p>
              </div>

              <div className="space-y-4 my-auto">
                <div>
                  <div className="flex justify-between text-xs mb-1 font-semibold">
                    <span className="text-slate-700">Completed Interventions</span>
                    <span className="text-emerald-600">{stats.completedInterventions} / {stats.totalInterventions} ({stats.successRate}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${stats.successRate}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-semibold">
                    <span className="text-slate-700">In Progress (Active Mentoring & Plans)</span>
                    <span className="text-blue-600">{stats.inProgressInterventions} ({Math.round((stats.inProgressInterventions / (stats.totalInterventions || 1)) * 100)}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${(stats.inProgressInterventions / (stats.totalInterventions || 1)) * 100}%` }}></div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                  <span className="font-semibold text-slate-800">Causality Disclaimer (Section 10):</span> An observed increase in academic performance following an intervention provides promising operational evidence, but should not be interpreted as definitive causal proof without randomized control validation.
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SUB-TAB 2: ML Model Benchmarks (Chapter 2 & 5) */}
      {activeSubTab === 'models' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-900 flex items-start gap-3">
            <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-indigo-950">
                PBL Methodology: Comparison of Candidate Classifiers (Vaarma & Li 2024, TCET Report)
              </p>
              <p className="mt-0.5 text-indigo-800 leading-relaxed">
                In academic early-warning systems, <strong>Recall</strong> is given the highest design priority because failing to identify a high-risk student (False Negative) has severe academic consequences, whereas a False Positive simply results in a supportive check-in.
              </p>
            </div>
          </div>

          {/* Model Cards Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MODEL_BENCHMARKS.map(model => (
              <div
                key={model.id}
                onClick={() => setSelectedModelId(model.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedModelId === model.id
                    ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-600/10'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    model.status === 'Active Production Candidate'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {model.status}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{model.latencyMs}ms</span>
                </div>

                <h4 className="font-bold text-sm text-slate-900">{model.name}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{model.family}</p>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <p className="text-[10px] text-slate-400">Recall</p>
                    <p className="font-bold text-indigo-600 text-sm">{model.recall}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">ROC-AUC</p>
                    <p className="font-bold text-slate-800 text-sm">{model.rocAuc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Selected Model Inspector */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Metrics & Confusion Matrix (6 Cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">{activeModel.name} Performance Evaluation</h3>
                <p className="text-xs text-slate-500 mt-0.5">{activeModel.description}</p>
              </div>

              {/* Metrics Table */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Accuracy</p>
                  <p className="text-lg font-bold text-slate-800">{activeModel.accuracy}%</p>
                </div>
                <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-200">
                  <p className="text-[10px] text-indigo-700 font-bold uppercase">Recall (Priority)</p>
                  <p className="text-lg font-extrabold text-indigo-700">{activeModel.recall}%</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Precision</p>
                  <p className="text-lg font-bold text-slate-800">{activeModel.precision}%</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">F1-Score</p>
                  <p className="text-lg font-bold text-slate-800">{activeModel.f1Score}%</p>
                </div>
              </div>

              {/* Confusion Matrix Table */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Validation Confusion Matrix (200 Holdout Samples)
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <div className="grid grid-cols-3 bg-slate-100 font-semibold text-slate-600 p-2 text-center text-[11px]">
                    <div>Actual \ Predicted</div>
                    <div>Predicted At-Risk</div>
                    <div>Predicted Not At-Risk</div>
                  </div>
                  <div className="grid grid-cols-3 p-3 border-t border-slate-200 text-center items-center">
                    <div className="font-semibold text-slate-700 text-left pl-2">Actual At-Risk</div>
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-800 font-bold">
                      TP: {activeModel.confusionMatrix.tp}
                    </div>
                    <div className="p-2 bg-rose-50 rounded-lg text-rose-800 font-bold">
                      FN: {activeModel.confusionMatrix.fn} (Missed!)
                    </div>
                  </div>
                  <div className="grid grid-cols-3 p-3 border-t border-slate-200 text-center items-center">
                    <div className="font-semibold text-slate-700 text-left pl-2">Actual Not At-Risk</div>
                    <div className="p-2 bg-amber-50 rounded-lg text-amber-800 font-bold">
                      FP: {activeModel.confusionMatrix.fp}
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-700 font-bold">
                      TN: {activeModel.confusionMatrix.tn}
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  XGBoost demonstrates only {activeModel.confusionMatrix.fn} false negatives, validating its selection as the lead model.
                </p>
              </div>
            </div>

            {/* Right: Radar Chart Multi-model Comparison (6 Cols) */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">Classifier Trade-off Radar</h3>
                <p className="text-xs text-slate-400">Multidimensional metric comparison across baselines and ensembles</p>
              </div>

              <div className="h-64 w-full my-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[60, 100]} tick={{ fontSize: 9 }} />
                    <Radar name="XGBoost" dataKey="XGB" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                    <Radar name="Random Forest" dataKey="RF" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                    <Radar name="Logistic Reg." dataKey="LR" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.1} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <strong>PBL Chapter 5 Finding:</strong> Tree-based ensembles (XGBoost, Random Forest) consistently outperform linear models due to non-linear interactions between declining attendance and internal exam drops.
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
