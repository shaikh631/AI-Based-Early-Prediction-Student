import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, UserPlus, Save, AlertCircle } from 'lucide-react';

export default function StudentFormModal({ isOpen, onClose, initialData = null }) {
  const { addStudent, updateStudent, departments } = useApp();
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    department: 'Artificial Intelligence and Machine Learning',
    semester: 5,
    attendance: 80,
    prevGpa: 7.5,
    cgpa: 7.5,
    assignmentRate: 85,
    internalExamScore: 70,
    failedSubjects: 0,
    lmsHours: 12,
    financialDifficulty: false,
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        lmsHours: initialData.lmsHours || 10
      });
    } else {
      setFormData({
        id: `STU${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        department: 'Artificial Intelligence and Machine Learning',
        semester: 5,
        attendance: 80,
        prevGpa: 7.5,
        cgpa: 7.5,
        assignmentRate: 85,
        internalExamScore: 70,
        failedSubjects: 0,
        lmsHours: 12,
        financialDifficulty: false,
        notes: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Student Name is required.';
    if (!formData.id.trim()) newErrors.id = 'Student ID is required.';
    
    if (formData.attendance < 0 || formData.attendance > 100) {
      newErrors.attendance = 'Attendance must be between 0% and 100%.';
    }
    if (formData.cgpa < 0 || formData.cgpa > 10) {
      newErrors.cgpa = 'CGPA must be between 0.0 and 10.0.';
    }
    if (formData.prevGpa < 0 || formData.prevGpa > 10) {
      newErrors.prevGpa = 'Prev GPA must be between 0.0 and 10.0.';
    }
    if (formData.assignmentRate < 0 || formData.assignmentRate > 100) {
      newErrors.assignmentRate = 'Assignment completion must be between 0% and 100%.';
    }
    if (formData.internalExamScore < 0 || formData.internalExamScore > 100) {
      newErrors.internalExamScore = 'Internal Exam must be between 0 and 100.';
    }
    if (formData.failedSubjects < 0 || formData.failedSubjects > 10) {
      newErrors.failedSubjects = 'Backlogs count must be between 0 and 10.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      attendance: Number(formData.attendance),
      cgpa: Number(Number(formData.cgpa).toFixed(2)),
      prevGpa: Number(Number(formData.prevGpa).toFixed(2)),
      assignmentRate: Number(formData.assignmentRate),
      internalExamScore: Number(formData.internalExamScore),
      failedSubjects: Number(formData.failedSubjects),
      lmsHours: Number(formData.lmsHours),
      lmsActivity: `${formData.lmsHours} hrs/wk`
    };

    if (initialData) {
      updateStudent(initialData.id, payload);
    } else {
      addStudent(payload);
    }

    onClose();
  };

  const availableDepts = departments.filter(d => d !== "All Departments");

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {initialData ? `Edit Record: ${initialData.name}` : 'Register New Student Profile'}
              </h3>
              <p className="text-xs text-slate-400">Institutional Educational Data Ingestion Pipeline</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {Object.keys(errors).length > 0 && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>Please resolve the highlighted validation errors before saving.</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Student ID *</label>
              <input
                type="text"
                disabled={!!initialData}
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full text-xs px-3 py-2 border rounded-xl bg-slate-50 disabled:bg-slate-100 disabled:text-slate-500 font-mono"
              />
              {errors.id && <p className="text-[11px] text-rose-600 mt-0.5">{errors.id}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Student Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Sahil Khan"
                className="w-full text-xs px-3 py-2 border rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
              {errors.name && <p className="text-[11px] text-rose-600 mt-0.5">{errors.name}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full text-xs px-3 py-2 border rounded-xl bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              >
                {availableDepts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Semester</label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                className="w-full text-xs px-3 py-2 border rounded-xl bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              >
                <option value={3}>Semester 3 (Second Year)</option>
                <option value={5}>Semester 5 (Third Year)</option>
                <option value={7}>Semester 7 (Final Year)</option>
              </select>
            </div>
          </div>

          {/* Academic Indicators */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Academic & Engagement Indicators
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Attendance (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.attendance}
                  onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
                  className="w-full text-xs px-3 py-1.5 border rounded-lg"
                />
                {errors.attendance && <p className="text-[10px] text-rose-600">{errors.attendance}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Current CGPA (0-10)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={formData.cgpa}
                  onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                  className="w-full text-xs px-3 py-1.5 border rounded-lg"
                />
                {errors.cgpa && <p className="text-[10px] text-rose-600">{errors.cgpa}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Prev Sem GPA (0-10)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={formData.prevGpa}
                  onChange={(e) => setFormData({ ...formData, prevGpa: e.target.value })}
                  className="w-full text-xs px-3 py-1.5 border rounded-lg"
                />
                {errors.prevGpa && <p className="text-[10px] text-rose-600">{errors.prevGpa}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Internal Exam (/100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.internalExamScore}
                  onChange={(e) => setFormData({ ...formData, internalExamScore: e.target.value })}
                  className="w-full text-xs px-3 py-1.5 border rounded-lg"
                />
                {errors.internalExamScore && <p className="text-[10px] text-rose-600">{errors.internalExamScore}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Assignment Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.assignmentRate}
                  onChange={(e) => setFormData({ ...formData, assignmentRate: e.target.value })}
                  className="w-full text-xs px-3 py-1.5 border rounded-lg"
                />
                {errors.assignmentRate && <p className="text-[10px] text-rose-600">{errors.assignmentRate}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Active Backlogs (KT)</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.failedSubjects}
                  onChange={(e) => setFormData({ ...formData, failedSubjects: e.target.value })}
                  className="w-full text-xs px-3 py-1.5 border rounded-lg"
                />
                {errors.failedSubjects && <p className="text-[10px] text-rose-600">{errors.failedSubjects}</p>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">LMS Activity (Hours/Week)</label>
              <input
                type="number"
                min="0"
                max="50"
                value={formData.lmsHours}
                onChange={(e) => setFormData({ ...formData, lmsHours: e.target.value })}
                className="w-full text-xs px-3 py-2 border rounded-xl"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">Average weekly engagement hours on learning portal.</p>
            </div>

            <div className="flex flex-col justify-center">
              <label className="flex items-center gap-2 cursor-pointer pt-4">
                <input
                  type="checkbox"
                  checked={formData.financialDifficulty}
                  onChange={(e) => setFormData({ ...formData, financialDifficulty: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span className="text-xs font-medium text-slate-700">Financial Aid / Hardship Flag</span>
              </label>
              <p className="text-[10px] text-slate-400 mt-1 pl-6">Access-restricted; enables confidential scholarship routing.</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Faculty / Proctor Remarks</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Student informed of illness; participating in extra tutorials."
              className="w-full text-xs px-3 py-2 border rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{initialData ? 'Save Changes' : 'Register & Run Model'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
