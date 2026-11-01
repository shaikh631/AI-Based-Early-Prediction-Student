import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldAlert, PlusCircle } from 'lucide-react';

const INTERVENTION_TYPES = [
  "Attendance Improvement Plan",
  "Academic Mentoring",
  "Faculty Counselling",
  "Assignment Support",
  "Peer Learning Groups",
  "Study Skills Workshops",
  "Financial Aid Referral",
  "Mental Health Support Referral"
];

const FACULTY_MENTORS = [
  "Ms. Nagrani Seema (Assistant Professor & Guide)",
  "Dr. Shiwani Gupta (HoD, AI & ML)",
  "Prof. A. Verma (Computer Engineering)",
  "Prof. R. Mehta (Information Technology)",
  "Prof. K. Sen (EXTC)",
  "Campus Student Counselor",
  "Dean of Student Welfare"
];

export default function InterventionFormModal({ isOpen, onClose, defaultStudentId = null }) {
  const { students, addIntervention } = useApp();

  const [studentId, setStudentId] = useState(defaultStudentId || (students[0]?.id || ''));
  const [type, setType] = useState(INTERVENTION_TYPES[0]);
  const [priority, setPriority] = useState('High');
  const [mentor, setMentor] = useState(FACULTY_MENTORS[0]);
  const [targetDate, setTargetDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 21);
    return d.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentId) return;

    addIntervention(studentId, {
      type,
      priority,
      mentor,
      targetDate,
      notes: notes.trim() || 'Initial supportive intervention protocol initiated.'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-violet-600/30 border border-violet-400/40 flex items-center justify-center text-violet-300">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Assign Academic Intervention</h3>
              <p className="text-xs text-slate-400">Proactive & Supportive Action Protocol</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Student *</label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full text-xs px-3 py-2 border rounded-xl bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.id} - {s.name} ({s.department.replace("Engineering", "Engg.")} • {s.riskCategory} Risk {s.riskScore}%)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Intervention Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full text-xs px-3 py-2 border rounded-xl bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              >
                {INTERVENTION_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Urgency / Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full text-xs px-3 py-2 border rounded-xl bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="High">High Urgency</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low / Preventive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Faculty Mentor</label>
              <select
                value={mentor}
                onChange={(e) => setMentor(e.target.value)}
                className="w-full text-xs px-3 py-2 border rounded-xl bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              >
                {FACULTY_MENTORS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Review Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full text-xs px-3 py-2 border rounded-xl bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Intervention Rationale & Action Plan</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Attendance fallen below 60%. Parent-teacher conference arranged and peer mentoring initiated for Mathematics."
              className="w-full text-xs px-3 py-2 border rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Action buttons */}
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
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Confirm & Initiate Action</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
