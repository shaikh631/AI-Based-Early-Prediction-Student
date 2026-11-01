import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Sparkles,
  Download
} from 'lucide-react';
import { exportStudentsToCSV } from '../../utils/csvExport';

export default function StudentTable({ onAddStudent, onEditStudent }) {
  const {
    students,
    deleteStudent,
    openStudentProfile,
    selectedDepartment,
    setSelectedDepartment,
    departments,
    selectedSemester,
    setSelectedSemester
  } = useApp();

  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');
  const [sortField, setSortField] = useState('riskScore');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Filter & Search Logic
  const processedStudents = useMemo(() => {
    return students
      .filter((s) => {
        const matchesDept = selectedDepartment === 'All Departments' || s.department === selectedDepartment;
        const matchesSem = selectedSemester === 'All' || s.semester === Number(selectedSemester);
        const matchesRisk = riskFilter === 'All' || s.riskCategory === riskFilter;
        const matchesSearch =
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.id.toLowerCase().includes(search.toLowerCase());
        return matchesDept && matchesSem && matchesRisk && matchesSearch;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [students, selectedDepartment, selectedSemester, riskFilter, search, sortField, sortOrder]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const confirmDelete = () => {
    if (studentToDelete) {
      deleteStudent(studentToDelete.id);
      setStudentToDelete(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* Controls Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name or roll ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Risk Level Filter */}
          <div className="flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-transparent border-none text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="All">All Risk Levels</option>
              <option value="High">High Risk Only</option>
              <option value="Medium">Medium Risk Only</option>
              <option value="Low">Low Risk Only</option>
            </select>
          </div>

          <button
            onClick={() => exportStudentsToCSV(processedStudents)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
            <tr>
              <th 
                className="px-4 py-3 cursor-pointer hover:bg-slate-100 transition"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center gap-1">
                  <span>Student ID</span>
                  {sortField === 'id' && (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                </div>
              </th>

              <th 
                className="px-4 py-3 cursor-pointer hover:bg-slate-100 transition"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">
                  <span>Student Name</span>
                  {sortField === 'name' && (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                </div>
              </th>

              <th className="px-4 py-3">Department</th>
              
              <th 
                className="px-4 py-3 cursor-pointer hover:bg-slate-100 transition"
                onClick={() => handleSort('attendance')}
              >
                <div className="flex items-center gap-1">
                  <span>Attendance</span>
                  {sortField === 'attendance' && (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                </div>
              </th>

              <th 
                className="px-4 py-3 cursor-pointer hover:bg-slate-100 transition"
                onClick={() => handleSort('cgpa')}
              >
                <div className="flex items-center gap-1">
                  <span>CGPA</span>
                  {sortField === 'cgpa' && (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                </div>
              </th>

              <th className="px-4 py-3">Internal (IA)</th>
              <th className="px-4 py-3">Backlogs</th>

              <th 
                className="px-4 py-3 cursor-pointer hover:bg-slate-100 transition"
                onClick={() => handleSort('riskScore')}
              >
                <div className="flex items-center gap-1">
                  <span>Risk Score</span>
                  {sortField === 'riskScore' && (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                </div>
              </th>

              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {processedStudents.length > 0 ? (
              processedStudents.map((s) => (
                <tr 
                  key={s.id} 
                  className="hover:bg-slate-50/80 transition cursor-pointer"
                  onClick={() => openStudentProfile(s.id)}
                >
                  <td className="px-4 py-3 font-mono font-semibold text-slate-700">
                    {s.id}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900">{s.name}</div>
                    <div className="text-[10px] text-slate-400">Sem {s.semester} • {s.lmsActivity}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-medium">
                    {s.department.replace("Engineering", "Engg.")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${s.attendance < 75 ? 'text-rose-600 font-bold' : 'text-slate-800'}`}>
                      {s.attendance}%
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-800">
                    {s.cgpa.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {s.internalExamScore}/100
                  </td>
                  <td className="px-4 py-3">
                    {s.failedSubjects > 0 ? (
                      <span className="text-rose-600 font-bold px-1.5 py-0.5 rounded bg-rose-50 border border-rose-200">
                        {s.failedSubjects} KT
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-medium">0</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`
                        px-2.5 py-0.5 rounded-full text-[10px] font-bold border
                        ${s.riskCategory === 'High' 
                          ? 'bg-rose-50 text-rose-700 border-rose-200' 
                          : s.riskCategory === 'Medium'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }
                      `}>
                        {s.riskCategory} ({s.riskScore}%)
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openStudentProfile(s.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                        title="View Full Profile & Explainability"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditStudent(s)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition"
                        title="Edit Student Record"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setStudentToDelete(s)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete Student Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-slate-400">
                  No students found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Summary */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
        <span>Showing {processedStudents.length} of {students.length} students</span>
        <span>Local persistence enabled</span>
      </div>

      {/* Delete Confirmation Modal */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Confirm Deletion</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Are you sure you want to remove <strong>{studentToDelete.name}</strong> ({studentToDelete.id}) from the early warning system? This action will remove associated interventions from demo storage.
            </p>
            <div className="flex items-center justify-end gap-2.5 mt-5">
              <button
                onClick={() => setStudentToDelete(null)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
