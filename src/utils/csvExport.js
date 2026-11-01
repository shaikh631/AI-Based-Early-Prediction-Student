/**
 * CSV Export utility for Student Records and Intervention Reports
 */

export function exportStudentsToCSV(students, filename = "TCET_Student_Early_Warning_Report.csv") {
  if (!students || students.length === 0) {
    alert("No student data available to export.");
    return;
  }

  const headers = [
    "Student ID",
    "Full Name",
    "Department",
    "Semester",
    "Attendance (%)",
    "Previous GPA",
    "Current CGPA",
    "Assignment Completion (%)",
    "Internal Exam Score (100)",
    "Failed Subjects (Backlogs)",
    "LMS Hours/Wk",
    "Risk Score (0-100)",
    "Risk Category",
    "Active Interventions Count",
    "Academic Trend"
  ];

  const rows = students.map(s => [
    `"${s.id}"`,
    `"${s.name}"`,
    `"${s.department}"`,
    s.semester,
    s.attendance,
    s.prevGpa,
    s.cgpa,
    s.assignmentRate,
    s.internalExamScore,
    s.failedSubjects,
    s.lmsHours || 0,
    s.riskScore,
    `"${s.riskCategory}"`,
    s.interventions ? s.interventions.length : 0,
    `"${s.trend || 'stable'}"`
  ]);

  const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
  triggerDownload(csvContent, filename);
}

export function exportInterventionsToCSV(students, filename = "TCET_Academic_Interventions_Log.csv") {
  const allInterventions = [];
  students.forEach(s => {
    if (s.interventions && s.interventions.length > 0) {
      s.interventions.forEach(inv => {
        allInterventions.push({
          studentId: s.id,
          studentName: s.name,
          department: s.department,
          semester: s.semester,
          riskCategory: s.riskCategory,
          ...inv
        });
      });
    }
  });

  if (allInterventions.length === 0) {
    alert("No active interventions found to export.");
    return;
  }

  const headers = [
    "Intervention ID",
    "Student ID",
    "Student Name",
    "Department",
    "Semester",
    "Student Risk Level",
    "Intervention Type",
    "Priority",
    "Assigned Faculty Mentor",
    "Status",
    "Assigned Date",
    "Target Completion Date",
    "Notes & Actions Taken"
  ];

  const rows = allInterventions.map(i => [
    `"${i.id}"`,
    `"${i.studentId}"`,
    `"${i.studentName}"`,
    `"${i.department}"`,
    i.semester,
    `"${i.riskCategory}"`,
    `"${i.type}"`,
    `"${i.priority}"`,
    `"${i.mentor || 'Unassigned'}"`,
    `"${i.status}"`,
    `"${i.assignedDate || ''}"`,
    `"${i.targetDate || ''}"`,
    `"${(i.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
  triggerDownload(csvContent, filename);
}

function triggerDownload(content, filename) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
