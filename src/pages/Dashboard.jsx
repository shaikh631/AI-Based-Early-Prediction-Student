import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/dashboard/StatCard';
import RecentAlerts from '../components/dashboard/RecentAlerts';
import {
  Users,
  AlertOctagon,
  AlertTriangle,
  ShieldCheck,
  Award,
  Sparkles,
  TrendingUp,
  Download,
  Info
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import { exportStudentsToCSV } from '../utils/csvExport';

const PIE_COLORS = {
  High: '#ef4444',
  Medium: '#f59e0b',
  Low: '#10b981'
};

export default function Dashboard() {
  const {
    filteredStudents,
    stats,
    selectedDepartment,
    setSelectedDepartment,
    departments,
    selectedSemester,
    setSelectedSemester,
    thresholds
  } = useApp();

  // 1. Donut Chart Data: Student Risk Distribution
  const riskDistributionData = useMemo(() => [
    { name: 'High Risk', value: stats.highRisk, color: PIE_COLORS.High },
    { name: 'Medium Risk', value: stats.mediumRisk, color: PIE_COLORS.Medium },
    { name: 'Low Risk', value: stats.lowRisk, color: PIE_COLORS.Low }
  ], [stats]);

  // 2. Line Chart Data: Weekly Cohort Risk Trends (Semester Weeks 1 - 10)
  const riskTrendsData = useMemo(() => [
    { week: 'Wk 2', highRisk: 2, mediumRisk: 5, lowRisk: 17 },
    { week: 'Wk 4', highRisk: 3, mediumRisk: 6, lowRisk: 15 },
    { week: 'Wk 6 (IA-1)', highRisk: 6, mediumRisk: 8, lowRisk: 10 },
    { week: 'Wk 8', highRisk: 5, mediumRisk: 7, lowRisk: 12 },
    { week: 'Wk 10 (IA-2)', highRisk: stats.highRisk, mediumRisk: stats.mediumRisk, lowRisk: stats.lowRisk }
  ], [stats]);

  // 3. Department-wise Risk Analysis
  const departmentChartData = useMemo(() => {
    const map = {};
    departments.filter(d => d !== "All Departments").forEach(dept => {
      map[dept] = { name: dept.replace("Engineering", "Engg."), high: 0, medium: 0, low: 0 };
    });

    filteredStudents.forEach(s => {
      if (map[s.department]) {
        if (s.riskCategory === "High") map[s.department].high += 1;
        else if (s.riskCategory === "Medium") map[s.department].medium += 1;
        else map[s.department].low += 1;
      }
    });

    return Object.values(map);
  }, [filteredStudents, departments]);

  // 4. Scatter Plot: Attendance vs CGPA
  const scatterData = useMemo(() => {
    return filteredStudents.map(s => ({
      name: s.name,
      id: s.id,
      attendance: s.attendance,
      cgpa: s.cgpa,
      riskCategory: s.riskCategory,
      fill: s.riskCategory === "High" ? '#ef4444' : s.riskCategory === "Medium" ? '#f59e0b' : '#10b981'
    }));
  }, [filteredStudents]);

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Higher Education Early-Warning Overview
            </h2>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Active Cohort: {filteredStudents.length} Students
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            PREDICT → EXPLAIN → INTERVENE framework for early academic assistance at TCET Mumbai.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => exportStudentsToCSV(filteredStudents)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Roster CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Students"
          value={stats.total}
          subtitle={`Avg Attendance: ${stats.avgAttendance}%`}
          icon={Users}
          badgeText="Active Cohort"
          iconBg="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          title="High Risk Students"
          value={stats.highRisk}
          subtitle="Attendance &lt;65% or Backlogs"
          icon={AlertOctagon}
          badgeText={stats.highRisk > 0 ? "Immediate Action" : "Clear"}
          badgeType={stats.highRisk > 0 ? "danger" : "success"}
          iconBg="bg-rose-50 text-rose-600"
          borderColor={stats.highRisk > 0 ? "border-rose-200" : "border-slate-200"}
        />
        <StatCard
          title="Medium Risk Students"
          value={stats.mediumRisk}
          subtitle="Borderline IA / low LMS"
          icon={AlertTriangle}
          badgeText="Advisory"
          badgeType="warning"
          iconBg="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Requiring Support"
          value={stats.studentsRequiringIntervention}
          subtitle={`${stats.studentsWithActiveInterventions} currently assigned`}
          icon={ShieldCheck}
          badgeText="Intervention Target"
          badgeType="info"
          iconBg="bg-violet-50 text-violet-600"
        />
        <StatCard
          title="Intervention Success"
          value={`${stats.successRate}%`}
          subtitle={`${stats.completedInterventions} completed actions`}
          icon={Award}
          badgeText="Closed Loops"
          badgeType="success"
          iconBg="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Primary Analytics Charts Grid (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Donut Chart - Risk Distribution */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Student Risk Distribution</h3>
              <p className="text-xs text-slate-400">Classified by configurable risk policy</p>
            </div>
            <span className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border">
              High: &ge;{thresholds.highMin}%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ReTooltip 
                  formatter={(val, name) => [`${val} students (${Math.round((val / (stats.total || 1)) * 100)}%)`, name]}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-xs font-medium text-slate-700">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Line Chart - Risk Trends Over Time */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Risk Trends Across Semester</h3>
              <p className="text-xs text-slate-400">Progression after IA-1 and IA-2 examinations</p>
            </div>
            <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              Bi-weekly Milestones
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={riskTrendsData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <ReTooltip />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-xs font-medium text-slate-700">{value}</span>}
                />
                <Line type="monotone" dataKey="highRisk" name="High Risk" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="mediumRisk" name="Medium Risk" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="lowRisk" name="Low Risk" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Bar Chart - Department-wise Risk Analysis */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Department-wise Risk Breakdown</h3>
              <p className="text-xs text-slate-400">Vulnerability comparison across academic streams</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} />
                <ReTooltip />
                <Legend 
                  verticalAlign="top" 
                  height={30}
                  formatter={(value) => <span className="text-xs font-medium text-slate-700">{value}</span>}
                />
                <Bar dataKey="high" name="High Risk" fill="#ef4444" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="medium" name="Medium Risk" fill="#f59e0b" stackId="a" />
                <Bar dataKey="low" name="Low Risk" fill="#10b981" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Scatter Plot - Attendance vs CGPA */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Attendance vs Academic Performance</h3>
              <p className="text-xs text-slate-400">Correlation cluster of attendance percentage vs CGPA</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span>High</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span>Med</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Low</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 15, right: 20, bottom: 15, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  type="number" 
                  dataKey="attendance" 
                  name="Attendance" 
                  unit="%" 
                  domain={[30, 100]} 
                  tick={{ fontSize: 11 }}
                  label={{ value: 'Attendance %', position: 'bottom', offset: 0, fontSize: 11, fill: '#64748b' }}
                />
                <YAxis 
                  type="number" 
                  dataKey="cgpa" 
                  name="CGPA" 
                  domain={[3, 10]} 
                  tick={{ fontSize: 11 }}
                  label={{ value: 'CGPA', angle: -90, position: 'left', offset: 10, fontSize: 11, fill: '#64748b' }}
                />
                <ZAxis range={[50, 70]} />
                <ReTooltip 
                  cursor={{ strokeDasharray: '3 3' }} 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-lg">
                          <p className="font-bold">{data.name} ({data.id})</p>
                          <p className="text-slate-300">Attendance: {data.attendance}%</p>
                          <p className="text-slate-300">CGPA: {data.cgpa}</p>
                          <p className="text-amber-300 font-semibold mt-0.5">Risk: {data.riskCategory}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Students" data={scatterData} fill="#6366f1" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Priority Alerts Table */}
      <RecentAlerts />

      {/* Responsible AI Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3.5 text-xs text-amber-950">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-amber-900">
            Responsible AI & Faculty Decision-Support Safeguard (TCET PBL Protocol)
          </p>
          <p className="mt-0.5 text-amber-800 leading-relaxed">
            Early prediction models provide probabilistic risk estimations to prioritize students for supportive mentorship and academic guidance. No automated punitive actions, grade sanctions, or disqualifications are triggered autonomously by this system.
          </p>
        </div>
      </div>

    </div>
  );
}
