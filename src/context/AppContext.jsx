import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { INITIAL_STUDENTS, DEFAULT_THRESHOLDS, DEPARTMENTS } from '../data/students';
import { calculateAcademicRisk } from '../services/predictionService';

const AppContext = createContext();

const STORAGE_KEY_STUDENTS = 'tcet_xai_students_v1';
const STORAGE_KEY_THRESHOLDS = 'tcet_xai_thresholds_v1';

export function AppProvider({ children }) {
  // 1. Initialize thresholds
  const [thresholds, setThresholds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THRESHOLDS);
      return saved ? JSON.parse(saved) : DEFAULT_THRESHOLDS;
    } catch (e) {
      return DEFAULT_THRESHOLDS;
    }
  });

  // 2. Initialize students with risk calculation synced to current thresholds
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STUDENTS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Could not load from localStorage, falling back to default.", e);
    }
    // Calculate initial risk for default students
    return INITIAL_STUDENTS.map(student => {
      const riskResult = calculateAcademicRisk(student, DEFAULT_THRESHOLDS);
      return {
        ...student,
        riskScore: riskResult.riskScore,
        riskCategory: riskResult.riskCategory
      };
    });
  });

  // 3. Filters & UI State
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedSemester, setSelectedSemester] = useState("All");
  const [academicYear, setAcademicYear] = useState("2026-2027 (Odd Sem)");
  const [toasts, setToasts] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.error("Failed to save students to localStorage", e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_THRESHOLDS, JSON.stringify(thresholds));
    } catch (e) {
      console.error("Failed to save thresholds to localStorage", e);
    }
  }, [thresholds]);

  // Toast notifications
  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // CRUD Operations
  const addStudent = (studentData) => {
    const id = studentData.id || `STU${Math.floor(100 + Math.random() * 900)}`;
    const riskResult = calculateAcademicRisk(studentData, thresholds);
    
    const newStudent = {
      ...studentData,
      id,
      riskScore: riskResult.riskScore,
      riskCategory: riskResult.riskCategory,
      interventions: studentData.interventions || [],
      trend: "stable",
      notes: studentData.notes || "Newly enrolled / ingested student record."
    };

    setStudents(prev => [newStudent, ...prev]);
    addToast(`Student ${newStudent.name} (${newStudent.id}) added with predicted risk ${newStudent.riskCategory} (${newStudent.riskScore}%).`, "success");
    return newStudent;
  };

  const updateStudent = (id, updatedFields) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        const merged = { ...s, ...updatedFields };
        const riskResult = calculateAcademicRisk(merged, thresholds);
        return {
          ...merged,
          riskScore: riskResult.riskScore,
          riskCategory: riskResult.riskCategory
        };
      }
      return s;
    }));
    addToast(`Record for student ${id} updated successfully.`, "success");
  };

  const deleteStudent = (id) => {
    const target = students.find(s => s.id === id);
    setStudents(prev => prev.filter(s => s.id !== id));
    if (selectedStudentId === id) {
      setSelectedStudentId(null);
      setIsProfileModalOpen(false);
    }
    addToast(`Student ${target?.name || id} removed from institutional records.`, "info");
  };

  // Interventions Management
  const addIntervention = (studentId, intervention) => {
    const newId = `INT-${Date.now().toString().slice(-4)}`;
    const newIntervention = {
      id: newId,
      assignedDate: new Date().toISOString().split('T')[0],
      status: "In Progress",
      ...intervention
    };

    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          interventions: [newIntervention, ...(s.interventions || [])]
        };
      }
      return s;
    }));

    addToast(`Intervention "${intervention.type}" assigned to student ${studentId}.`, "success");
  };

  const updateInterventionStatus = (studentId, interventionId, newStatus, followUpNotes = "") => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          interventions: (s.interventions || []).map(inv => {
            if (inv.id === interventionId) {
              return {
                ...inv,
                status: newStatus,
                notes: followUpNotes ? `${inv.notes ? inv.notes + ' | ' : ''}${followUpNotes}` : inv.notes
              };
            }
            return inv;
          })
        };
      }
      return s;
    }));
    addToast(`Intervention ${interventionId} updated to "${newStatus}".`, "info");
  };

  // Thresholds updater (re-runs risk categorizer across all students)
  const updateThresholds = (newThresholds) => {
    setThresholds(newThresholds);
    setStudents(prev => prev.map(s => {
      const riskResult = calculateAcademicRisk(s, newThresholds);
      return {
        ...s,
        riskScore: riskResult.riskScore,
        riskCategory: riskResult.riskCategory
      };
    }));
    addToast("Risk threshold policies updated and applied across all cohorts.", "success");
  };

  // Reset to default sample dataset
  const resetToDefault = () => {
    localStorage.removeItem(STORAGE_KEY_STUDENTS);
    localStorage.removeItem(STORAGE_KEY_THRESHOLDS);
    setThresholds(DEFAULT_THRESHOLDS);
    setStudents(INITIAL_STUDENTS.map(student => {
      const riskResult = calculateAcademicRisk(student, DEFAULT_THRESHOLDS);
      return {
        ...student,
        riskScore: riskResult.riskScore,
        riskCategory: riskResult.riskCategory
      };
    }));
    addToast("Database reset to initial sample student dataset.", "info");
  };

  // Quick helper to view student modal
  const openStudentProfile = (id) => {
    setSelectedStudentId(id);
    setIsProfileModalOpen(true);
  };

  const closeStudentProfile = () => {
    setIsProfileModalOpen(false);
  };

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesDept = selectedDepartment === "All Departments" || student.department === selectedDepartment;
      const matchesSem = selectedSemester === "All" || student.semester === Number(selectedSemester);
      return matchesDept && matchesSem;
    });
  }, [students, selectedDepartment, selectedSemester]);

  // Aggregate statistics
  const stats = useMemo(() => {
    const total = filteredStudents.length;
    const highRisk = filteredStudents.filter(s => s.riskCategory === "High").length;
    const mediumRisk = filteredStudents.filter(s => s.riskCategory === "Medium").length;
    const lowRisk = filteredStudents.filter(s => s.riskCategory === "Low").length;
    
    let totalInterventions = 0;
    let completedInterventions = 0;
    let inProgressInterventions = 0;
    
    filteredStudents.forEach(s => {
      if (s.interventions) {
        totalInterventions += s.interventions.length;
        completedInterventions += s.interventions.filter(i => i.status === "Completed").length;
        inProgressInterventions += s.interventions.filter(i => i.status === "In Progress").length;
      }
    });

    const studentsWithActiveInterventions = filteredStudents.filter(
      s => s.interventions && s.interventions.some(i => i.status !== "Completed")
    ).length;

    const successRate = totalInterventions > 0 
      ? Math.round((completedInterventions / totalInterventions) * 100) 
      : 76;

    const avgAttendance = total > 0
      ? Math.round(filteredStudents.reduce((acc, curr) => acc + curr.attendance, 0) / total)
      : 0;

    const avgCgpa = total > 0
      ? (filteredStudents.reduce((acc, curr) => acc + curr.cgpa, 0) / total).toFixed(2)
      : 0;

    return {
      total,
      highRisk,
      mediumRisk,
      lowRisk,
      totalInterventions,
      completedInterventions,
      inProgressInterventions,
      studentsRequiringIntervention: highRisk + mediumRisk,
      studentsWithActiveInterventions,
      successRate,
      avgAttendance,
      avgCgpa
    };
  }, [filteredStudents]);

  const value = {
    students,
    filteredStudents,
    thresholds,
    updateThresholds,
    selectedDepartment,
    setSelectedDepartment,
    selectedSemester,
    setSelectedSemester,
    academicYear,
    setAcademicYear,
    departments: DEPARTMENTS,
    stats,
    addStudent,
    updateStudent,
    deleteStudent,
    addIntervention,
    updateInterventionStatus,
    resetToDefault,
    selectedStudentId,
    setSelectedStudentId,
    isProfileModalOpen,
    openStudentProfile,
    closeStudentProfile,
    toasts,
    addToast,
    removeToast
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
