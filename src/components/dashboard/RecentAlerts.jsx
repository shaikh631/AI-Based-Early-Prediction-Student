import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, ArrowRight, Eye, ShieldAlert, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RecentAlerts({ onSelectStudent }) {
  const { filteredStudents, openStudentProfile } = useApp();

  // Prioritize High and Medium risk students
  const urgentStudents = [...filteredStudents]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 6);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">Priority Early-Warning Alerts</h3>
            <p className="text-xs text-slate-400">Students ranked by calculated vulnerability score</p>
          </div>
        </div>

        <Link
          to="/students"
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition"
        >
          <span>View All Students</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-4 py-3">Student ID</th>
              <th className="px-4 py-3">Student Name</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Attendance</th>
              <th className="px-4 py-3">CGPA</th>
              <th className="px-4 py-3">Risk Level</th>
              <th className="px-4 py-3">Primary Factor</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {urgentStudents.length > 0 ? (
              urgentStudents.map((s) => (
                <tr 
                  key={s.id} 
                  className="hover:bg-slate-50/80 transition cursor-pointer"
                  onClick={() => openStudentProfile(s.id)}
                >
                  <td className="px-4 py-3 font-mono font-medium text-slate-700">
                    {s.id}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {s.name}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {s.department.replace("Engineering", "Engg.")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${s.attendance < 75 ? 'text-rose-600 font-bold' : 'text-slate-700'}`}>
                      {s.attendance}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${s.cgpa < 6.0 ? 'text-amber-600' : 'text-slate-700'}`}>
                      {s.cgpa.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`
                      inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold
                      ${s.riskCategory === 'High'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-soft-pulse'
                        : s.riskCategory === 'Medium'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }
                    `}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        s.riskCategory === 'High' ? 'bg-rose-500' : s.riskCategory === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} />
                      {s.riskCategory} ({s.riskScore}%)
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-medium">
                    {s.attendance < 75 ? (
                      <span className="text-rose-600">Attendance &lt; 75%</span>
                    ) : s.failedSubjects > 0 ? (
                      <span className="text-rose-600">{s.failedSubjects} Active Backlog(s)</span>
                    ) : s.internalExamScore < 50 ? (
                      <span className="text-amber-600">Low Mid-Term IA ({s.internalExamScore}%)</span>
                    ) : s.assignmentRate < 60 ? (
                      <span className="text-amber-600">Low Assignments ({s.assignmentRate}%)</span>
                    ) : (
                      <span className="text-slate-500">Normal Variance</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openStudentProfile(s.id);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-[11px] transition"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                  No students found matching current filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
