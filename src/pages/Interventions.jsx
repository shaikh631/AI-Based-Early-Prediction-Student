import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import InterventionFormModal from '../components/interventions/InterventionFormModal';
import {
  ShieldAlert,
  PlusCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  Filter,
  Search,
  User,
  Calendar,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { exportInterventionsToCSV } from '../utils/csvExport';

export default function Interventions() {
  const {
    students,
    updateInterventionStatus,
    openStudentProfile,
    addToast
  } = useApp();

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedStudentForModal, setSelectedStudentForModal] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Pending' | 'In Progress' | 'Completed'
  const [typeFilter, setTypeFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [noteInputMap, setNoteInputMap] = useState({});

  // Flatten all interventions across students
  const allInterventions = useMemo(() => {
    const list = [];
    students.forEach(student => {
      if (student.interventions && student.interventions.length > 0) {
        student.interventions.forEach(inv => {
          list.push({
            studentId: student.id,
            studentName: student.name,
            department: student.department,
            semester: student.semester,
            studentRisk: student.riskCategory,
            studentScore: student.riskScore,
            ...inv
          });
        });
      }
    });
    return list;
  }, [students]);

  // Filtered interventions
  const filteredInterventions = useMemo(() => {
    return allInterventions.filter(item => {
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchesType = typeFilter === 'All' || item.type === typeFilter;
      const matchesSearch =
        item.studentName.toLowerCase().includes(search.toLowerCase()) ||
        item.studentId.toLowerCase().includes(search.toLowerCase()) ||
        (item.mentor && item.mentor.toLowerCase().includes(search.toLowerCase()));
      return matchesStatus && matchesType && matchesSearch;
    });
  }, [allInterventions, statusFilter, typeFilter, search]);

  // Students requiring intervention but currently lacking one
  const studentsNeedingIntervention = useMemo(() => {
    return students.filter(s => 
      (s.riskCategory === "High" || s.riskCategory === "Medium") &&
      (!s.interventions || s.interventions.length === 0 || s.interventions.every(i => i.status === "Completed"))
    );
  }, [students]);

  const handleOpenAssignModal = (studentId = null) => {
    setSelectedStudentForModal(studentId);
    setIsAssignModalOpen(true);
  };

  const handleAddNote = (studentId, interventionId) => {
    const text = noteInputMap[interventionId];
    if (!text || !text.trim()) return;

    updateInterventionStatus(studentId, interventionId, "In Progress", text.trim());
    setNoteInputMap(prev => ({ ...prev, [interventionId]: '' }));
    addToast("Follow-up note appended to intervention record.", "info");
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Academic Intervention Center
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
              Support Protocols
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Map identified risk factors to practical assistance: mentoring, counseling, and study groups.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => exportInterventionsToCSV(students)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Action Plan CSV</span>
          </button>

          <button
            onClick={() => handleOpenAssignModal()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Assign New Intervention</span>
          </button>
        </div>
      </div>

      {/* Unassigned At-Risk Alert Banner (if any) */}
      {studentsNeedingIntervention.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-900 text-xs font-bold">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>{studentsNeedingIntervention.length} At-Risk Student(s) Require Active Intervention Action</span>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {studentsNeedingIntervention.map(s => (
              <div key={s.id} className="bg-white p-2.5 rounded-xl border border-rose-200 text-xs shrink-0 flex items-center gap-3">
                <div>
                  <p className="font-bold text-slate-900">{s.name} ({s.id})</p>
                  <p className="text-[10px] text-slate-500">{s.riskCategory} Risk ({s.riskScore}%) • Att: {s.attendance}%</p>
                </div>
                <button
                  onClick={() => handleOpenAssignModal(s.id)}
                  className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold transition"
                >
                  Assign Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, ID or faculty mentor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Status filter */}
          <div className="flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none text-slate-700 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <span className="text-slate-500 font-medium">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent border-none text-slate-700 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Attendance Improvement Plan">Attendance Plan</option>
              <option value="Academic Mentoring">Academic Mentoring</option>
              <option value="Faculty Counselling">Faculty Counselling</option>
              <option value="Assignment Support">Assignment Support</option>
              <option value="Peer Learning Groups">Peer Groups</option>
              <option value="Financial Aid Referral">Financial Aid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interventions Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredInterventions.length > 0 ? (
          filteredInterventions.map((inv) => (
            <div
              key={inv.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:shadow-md transition-all duration-200"
            >
              <div className="space-y-3">
                {/* Card Top: Student Name + Status Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3
                      onClick={() => openStudentProfile(inv.studentId)}
                      className="font-bold text-sm text-slate-900 hover:text-indigo-600 cursor-pointer transition"
                    >
                      {inv.studentName}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {inv.studentId} • {inv.department.replace("Engineering", "Engg.")}
                    </p>
                  </div>

                  <span className={`
                    text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider
                    ${inv.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : inv.status === 'In Progress'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }
                  `}>
                    {inv.status}
                  </span>
                </div>

                {/* Intervention Type & Priority */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800">{inv.type}</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                      inv.priority === 'High' ? 'bg-rose-100 text-rose-800 font-bold' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {inv.priority} Priority
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    <span>Mentor: {inv.mentor}</span>
                  </p>
                  {inv.targetDate && (
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>Target: {inv.targetDate}</span>
                    </p>
                  )}
                </div>

                {/* Notes & Actions taken */}
                <div className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100">
                  <span className="font-semibold text-slate-700">Follow-up Log: </span>
                  <span className="italic">{inv.notes || 'No recent notes.'}</span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
                {/* Status Toggle & Note Input */}
                <div className="flex items-center justify-between gap-2">
                  <select
                    value={inv.status}
                    onChange={(e) => updateInterventionStatus(inv.studentId, inv.id, e.target.value)}
                    className="text-[11px] font-semibold px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>

                  <button
                    onClick={() => openStudentProfile(inv.studentId)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
                  >
                    View Dossier
                  </button>
                </div>

                {/* Append note inline */}
                <div className="flex gap-1.5 pt-1">
                  <input
                    type="text"
                    value={noteInputMap[inv.id] || ''}
                    onChange={(e) => setNoteInputMap({ ...noteInputMap, [inv.id]: e.target.value })}
                    placeholder="Log session update..."
                    className="flex-1 text-[11px] px-2.5 py-1 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() => handleAddNote(inv.studentId, inv.id)}
                    className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg text-[11px] font-semibold hover:bg-indigo-700 transition"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400">
            No interventions match the selected filters.
          </div>
        )}
      </div>

      {/* Assign Modal */}
      <InterventionFormModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        defaultStudentId={selectedStudentForModal}
      />

    </div>
  );
}
