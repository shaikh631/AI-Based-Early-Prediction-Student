import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateAcademicRisk } from '../services/predictionService';
import {
  BrainCircuit,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  ShieldCheck,
  Server,
  Zap,
  ArrowRight,
  UserCheck
} from 'lucide-react';

export default function RiskPrediction() {
  const { students, thresholds, addToast, openStudentProfile } = useApp();

  const [selectedPresetId, setSelectedPresetId] = useState('');
  const [backendMode, setBackendMode] = useState('demo'); // 'demo' | 'api'
  const [apiUrl, setApiUrl] = useState('http://localhost:8000/api/predict');

  const [formData, setFormData] = useState({
    attendance: 62,
    prevGpa: 6.5,
    cgpa: 6.1,
    assignmentRate: 55,
    internalExamScore: 48,
    failedSubjects: 1,
    lmsHours: 5,
    semester: 5
  });

  const [predictionResult, setPredictionResult] = useState(() => {
    return calculateAcademicRisk({
      attendance: 62,
      prevGpa: 6.5,
      cgpa: 6.1,
      assignmentRate: 55,
      internalExamScore: 48,
      failedSubjects: 1,
      lmsHours: 5
    }, thresholds);
  });

  // Handle Preset Selection
  const handlePresetChange = (e) => {
    const studentId = e.target.value;
    setSelectedPresetId(studentId);
    if (!studentId) return;

    const found = students.find(s => s.id === studentId);
    if (found) {
      const updated = {
        attendance: found.attendance,
        prevGpa: found.prevGpa,
        cgpa: found.cgpa,
        assignmentRate: found.assignmentRate,
        internalExamScore: found.internalExamScore,
        failedSubjects: found.failedSubjects,
        lmsHours: found.lmsHours || 8,
        semester: found.semester
      };
      setFormData(updated);
      setPredictionResult(calculateAcademicRisk(updated, thresholds));
      addToast(`Populated metrics from student ${found.name} (${found.id})`, "info");
    }
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    const result = calculateAcademicRisk(formData, thresholds);
    setPredictionResult(result);
    addToast(`Prediction evaluated: ${result.riskCategory} Risk (${result.riskScore}%)`, "success");
  };

  const handleReset = () => {
    const defaults = {
      attendance: 75,
      prevGpa: 7.0,
      cgpa: 7.0,
      assignmentRate: 75,
      internalExamScore: 65,
      failedSubjects: 0,
      lmsHours: 10,
      semester: 5
    };
    setFormData(defaults);
    setSelectedPresetId('');
    setPredictionResult(calculateAcademicRisk(defaults, thresholds));
  };

  // Circular gauge calculations
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (predictionResult.riskScore / 100) * circumference;

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      
      {/* Page Title & Backend Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              AI Risk Prediction Engine
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
              Inference Sandbox
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Simulate or evaluate early academic risk using validated Educational Data Mining feature vectors.
          </p>
        </div>

        {/* Backend Endpoint Switcher */}
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
          <Server className="w-4 h-4 text-slate-500 ml-1" />
          <span className="text-slate-600 font-medium">Model Engine:</span>
          <div className="flex rounded-lg bg-white border border-slate-200 p-0.5">
            <button
              type="button"
              onClick={() => setBackendMode('demo')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                backendMode === 'demo'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Demo Scoring
            </button>
            <button
              type="button"
              onClick={() => {
                setBackendMode('api');
                addToast("Python FastAPI/Flask endpoint toggled. Ready for backend integration.", "info");
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                backendMode === 'api'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Live ML API (REST)
            </button>
          </div>
        </div>
      </div>

      {backendMode === 'api' && (
        <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-900 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Target Python ML API Endpoint:</span>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="bg-white border border-indigo-200 rounded-lg px-2.5 py-1 font-mono text-[11px] w-64 text-indigo-950"
            />
          </div>
          <span className="text-[11px] text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
            Accepts JSON {`{ attendance, internalExamScore, failedSubjects, ... }`}
          </span>
        </div>
      )}

      {/* Main Grid: Input Form (Left) & Prediction Output (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Input Form Column (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Student Feature Vector Inputs</h3>
              <p className="text-xs text-slate-400">Pre-exam in-semester academic indicators</p>
            </div>

            {/* Quick Populate from existing student */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium hidden sm:inline">Load Preset:</span>
              <select
                value={selectedPresetId}
                onChange={handlePresetChange}
                className="text-xs px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none"
              >
                <option value="">-- Select Student --</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.id} - {s.name} ({s.riskCategory})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <form onSubmit={handleCalculate} className="space-y-4">
            
            {/* Row 1: Attendance & LMS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Attendance Percentage</label>
                  <span className={`text-xs font-bold font-mono ${formData.attendance < 75 ? 'text-rose-600' : 'text-slate-800'}`}>
                    {formData.attendance}%
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={formData.attendance}
                  onChange={(e) => setFormData({ ...formData, attendance: Number(e.target.value) })}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>30%</span>
                  <span className="text-rose-500 font-semibold">75% Cutoff</span>
                  <span>100%</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">LMS Engagement</label>
                  <span className="text-xs font-bold font-mono text-slate-800">
                    {formData.lmsHours} hrs/wk
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={formData.lmsHours}
                  onChange={(e) => setFormData({ ...formData, lmsHours: Number(e.target.value) })}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>0 hrs</span>
                  <span>10 hrs recommended</span>
                  <span>30 hrs</span>
                </div>
              </div>
            </div>

            {/* Row 2: CGPA & Previous GPA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Current CGPA (0-10)</label>
                  <span className="text-xs font-bold font-mono text-slate-800">{formData.cgpa}</span>
                </div>
                <input
                  type="number"
                  step="0.1"
                  min="2"
                  max="10"
                  value={formData.cgpa}
                  onChange={(e) => setFormData({ ...formData, cgpa: Number(e.target.value) })}
                  className="w-full text-xs px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Previous Sem GPA (0-10)</label>
                  <span className="text-xs font-bold font-mono text-slate-800">{formData.prevGpa}</span>
                </div>
                <input
                  type="number"
                  step="0.1"
                  min="2"
                  max="10"
                  value={formData.prevGpa}
                  onChange={(e) => setFormData({ ...formData, prevGpa: Number(e.target.value) })}
                  className="w-full text-xs px-3 py-2 border rounded-xl"
                />
              </div>
            </div>

            {/* Row 3: Internal Exam & Assignments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Internal Exam Score (/100)</label>
                  <span className={`text-xs font-bold font-mono ${formData.internalExamScore < 50 ? 'text-rose-600' : 'text-slate-800'}`}>
                    {formData.internalExamScore}
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={formData.internalExamScore}
                  onChange={(e) => setFormData({ ...formData, internalExamScore: Number(e.target.value) })}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>20</span>
                  <span className="text-rose-500 font-semibold">50 passing</span>
                  <span>100</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Assignment Completion (%)</label>
                  <span className="text-xs font-bold font-mono text-slate-800">{formData.assignmentRate}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={formData.assignmentRate}
                  onChange={(e) => setFormData({ ...formData, assignmentRate: Number(e.target.value) })}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>20%</span>
                  <span>75% benchmark</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            {/* Row 4: Failed Subjects & Semester */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Active Backlogs / KT</label>
                <select
                  value={formData.failedSubjects}
                  onChange={(e) => setFormData({ ...formData, failedSubjects: Number(e.target.value) })}
                  className="w-full text-xs px-3 py-2 border rounded-xl bg-white"
                >
                  <option value={0}>0 Backlogs (Clear)</option>
                  <option value={1}>1 Backlog</option>
                  <option value={2}>2 Backlogs</option>
                  <option value={3}>3 Backlogs</option>
                  <option value={4}>4+ Backlogs (Critical)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Current Semester</label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                  className="w-full text-xs px-3 py-2 border rounded-xl bg-white"
                >
                  <option value={3}>Semester 3</option>
                  <option value={5}>Semester 5</option>
                  <option value={7}>Semester 7</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Inputs</span>
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition flex items-center gap-2"
              >
                <BrainCircuit className="w-4 h-4" />
                <span>Execute Prediction Model</span>
              </button>
            </div>
          </form>
        </div>

        {/* Output Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Main Risk Output Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center text-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Predicted Academic Vulnerability
            </span>

            {/* Circular Progress Meter */}
            <div className="relative w-40 h-40 my-4 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-slate-100"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className={`transition-all duration-700 ease-out ${
                    predictionResult.riskCategory === 'High'
                      ? 'text-rose-500'
                      : predictionResult.riskCategory === 'Medium'
                      ? 'text-amber-500'
                      : 'text-emerald-500'
                  }`}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {predictionResult.riskScore}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">/ 100 Index</span>
              </div>
            </div>

            {/* Risk Tier Badge */}
            <div className={`
              px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5
              ${predictionResult.riskCategory === 'High'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : predictionResult.riskCategory === 'Medium'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }
            `}>
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{predictionResult.riskCategory.toUpperCase()} RISK CLASSIFICATION</span>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              Model Confidence: <strong>{predictionResult.confidence}%</strong> (Decision Threshold: &ge;{thresholds.highMin} High)
            </p>

            {/* Top Factor Alert */}
            <div className="w-full mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs">
              <p className="font-semibold text-slate-800">Primary Risk Driver:</p>
              <p className="text-slate-600 mt-0.5">{predictionResult.factors[0]?.explanation}</p>
            </div>
          </div>

          {/* Recommended Intervention Preview */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Automated Support Action Recommendation
            </h4>

            {predictionResult.recommendedInterventions.slice(0, 2).map((rec, i) => (
              <div key={i} className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-950">{rec.type}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                    {rec.priority} Priority
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">{rec.recommendedAction}</p>
              </div>
            ))}
          </div>

          {/* Transparent Model Documentation Card */}
          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 text-[11px] space-y-1">
            <p className="font-bold text-slate-800">Demonstration Model Notice (Section 6 & 13)</p>
            <p>
              This calculation is generated by a deterministic educational scoring service weighted according to TCET AI&ML PBL methodology. For production institutional deployment, a serialized XGBoost model validated via 5-fold cross-validation is connected via REST API.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
