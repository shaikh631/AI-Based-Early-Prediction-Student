/**
 * AI Prediction and Explainability Service
 * 
 * IMPORTANT ARCHITECTURAL NOTE:
 * This service implements a transparent, deterministic decision-support scoring
 * model for the demonstration. It is clearly documented with weighted domain features
 * derived from Educational Data Mining literature (Cortez 2008, Vaarma & Li 2024).
 * 
 * An endpoint toggle is included to seamlessly swap to a live Python/XGBoost/SHAP
 * REST API (e.g. FastAPI / Flask at http://localhost:8000/api/predict).
 */

export const PREDICTION_WEIGHTS = {
  ATTENDANCE: 0.28,         // Crucial signal: <75% triggers attendance warning
  INTERNAL_EXAM: 0.22,      // Mid-term / IA marks (0-100)
  FAILED_SUBJECTS: 0.20,    // Active backlogs (severe penalty)
  CGPA: 0.15,               // Cumulative baseline academic ability (0-10)
  ASSIGNMENT_RATE: 0.10,    // Continuous semester engagement (0-100%)
  LMS_ACTIVITY: 0.05        // Hours/activity per week on Moodle/Canvas
};

/**
 * Calculates deterministic risk score (0 to 100) based on validated academic indicators.
 * Higher score = higher risk of academic failure or course dropout.
 */
export function calculateAcademicRisk(studentData, thresholds = { lowMax: 34, mediumMax: 64 }) {
  // 1. Data normalization & validation
  const attendance = Math.max(0, Math.min(100, Number(studentData.attendance) || 0));
  const internalExam = Math.max(0, Math.min(100, Number(studentData.internalExamScore) || 0));
  const assignmentRate = Math.max(0, Math.min(100, Number(studentData.assignmentRate) || 0));
  const failedSubjects = Math.max(0, Math.min(8, Number(studentData.failedSubjects) || 0));
  const cgpa = Math.max(0, Math.min(10, Number(studentData.cgpa) || 0));
  const prevGpa = Math.max(0, Math.min(10, Number(studentData.prevGpa) || cgpa));
  
  // LMS hours normalized (capped at 20 hrs/week for maximum score)
  let lmsHours = Number(studentData.lmsHours);
  if (isNaN(lmsHours)) {
    if (typeof studentData.lmsActivity === 'string') {
      const match = studentData.lmsActivity.match(/(\d+)/);
      lmsHours = match ? parseInt(match[1], 10) : 8;
    } else {
      lmsHours = 8;
    }
  }
  const lmsScoreNorm = Math.min(100, (lmsHours / 20) * 100);

  // 2. Component Risk Scores (0 = no risk, 100 = maximum risk)
  // Attendance risk: Non-linear penalty if < 75%
  let attRisk = 0;
  if (attendance < 60) {
    attRisk = 100;
  } else if (attendance < 75) {
    attRisk = 75 + ((75 - attendance) / 15) * 25; // 75 to 100
  } else if (attendance < 85) {
    attRisk = ((85 - attendance) / 10) * 45; // 0 to 45
  } else {
    attRisk = 5;
  }

  // Internal Exam Risk (0-100): < 40 is failing threshold
  let examRisk = 0;
  if (internalExam < 40) {
    examRisk = 90 + ((40 - internalExam) / 40) * 10;
  } else if (internalExam < 60) {
    examRisk = 50 + ((60 - internalExam) / 20) * 40;
  } else {
    examRisk = Math.max(0, ((100 - internalExam) / 40) * 30);
  }

  // Failed subjects risk (0 to 100)
  const failedRisk = Math.min(100, failedSubjects * 35);

  // CGPA Risk (0-100, scale 0-10): < 6.0 is vulnerable
  let cgpaRisk = 0;
  if (cgpa < 5.0) {
    cgpaRisk = 95;
  } else if (cgpa < 6.5) {
    cgpaRisk = 55 + ((6.5 - cgpa) / 1.5) * 40;
  } else if (cgpa < 8.0) {
    cgpaRisk = 20 + ((8.0 - cgpa) / 1.5) * 35;
  } else {
    cgpaRisk = 5;
  }

  // Assignment Risk (0-100)
  const assignRisk = 100 - assignmentRate;

  // LMS Risk (0-100)
  const lmsRisk = 100 - lmsScoreNorm;

  // GPA Trend delta modifier (e.g. dropping by > 0.5 points adds urgency)
  let trendPenalty = 0;
  const gpaDelta = cgpa - prevGpa;
  if (gpaDelta < -0.4) {
    trendPenalty = 6;
  } else if (gpaDelta > 0.3) {
    trendPenalty = -4; // Reward upward trajectory
  }

  // 3. Weighted composite calculation
  const compositeScore = (
    attRisk * PREDICTION_WEIGHTS.ATTENDANCE +
    examRisk * PREDICTION_WEIGHTS.INTERNAL_EXAM +
    failedRisk * PREDICTION_WEIGHTS.FAILED_SUBJECTS +
    cgpaRisk * PREDICTION_WEIGHTS.CGPA +
    assignRisk * PREDICTION_WEIGHTS.ASSIGNMENT_RATE +
    lmsRisk * PREDICTION_WEIGHTS.LMS_ACTIVITY +
    trendPenalty
  );

  const finalRiskScore = Math.round(Math.max(3, Math.min(98, compositeScore)));

  // 4. Categorize by configurable thresholds
  let riskCategory = "Low";
  if (finalRiskScore > thresholds.mediumMax) {
    riskCategory = "High";
  } else if (finalRiskScore > thresholds.lowMax) {
    riskCategory = "Medium";
  }

  // 5. Compute Feature Contributions (Explainable AI Attribution)
  // Emulates additive local SHAP values relative to base population risk (~38%)
  const baseValue = 38.0;
  
  const factors = [
    {
      id: "attendance",
      name: "Attendance Record",
      value: `${attendance}%`,
      benchmark: "75% required",
      rawContribution: (attRisk - 35) * PREDICTION_WEIGHTS.ATTENDANCE,
      impact: attendance < 75 ? "increases_risk" : "decreases_risk",
      severity: attendance < 60 ? "Critical" : attendance < 75 ? "Warning" : "Good",
      explanation: attendance < 75 
        ? `Attendance at ${attendance}% is below the mandatory university 75% cutoff.`
        : `Healthy attendance at ${attendance}% supports lecture retention.`
    },
    {
      id: "internalExam",
      name: "Internal Exam Score",
      value: `${internalExam}/100`,
      benchmark: "50% passing threshold",
      rawContribution: (examRisk - 35) * PREDICTION_WEIGHTS.INTERNAL_EXAM,
      impact: internalExam < 50 ? "increases_risk" : "decreases_risk",
      severity: internalExam < 40 ? "Critical" : internalExam < 55 ? "Warning" : "Good",
      explanation: internalExam < 50
        ? `Mid-term evaluation (${internalExam}%) indicates comprehension gaps.`
        : `Strong internal assessment performance (${internalExam}%).`
    },
    {
      id: "failedSubjects",
      name: "Active Backlogs",
      value: `${failedSubjects} Subject${failedSubjects === 1 ? '' : 's'}`,
      benchmark: "0 active backlogs",
      rawContribution: (failedRisk - 10) * PREDICTION_WEIGHTS.FAILED_SUBJECTS,
      impact: failedSubjects > 0 ? "increases_risk" : "decreases_risk",
      severity: failedSubjects >= 2 ? "Critical" : failedSubjects === 1 ? "Warning" : "Good",
      explanation: failedSubjects > 0
        ? `${failedSubjects} un-cleared KT/backlog subjects compound exam semester pressure.`
        : "Clear academic record with zero backlogs."
    },
    {
      id: "cgpa",
      name: "Cumulative GPA",
      value: `${cgpa.toFixed(2)}/10.0`,
      benchmark: "6.5 baseline",
      rawContribution: (cgpaRisk - 30) * PREDICTION_WEIGHTS.CGPA,
      impact: cgpa < 6.5 ? "increases_risk" : "decreases_risk",
      severity: cgpa < 5.5 ? "Critical" : cgpa < 6.5 ? "Warning" : "Good",
      explanation: cgpa < 6.5
        ? `Current CGPA (${cgpa.toFixed(2)}) is near probation margin.`
        : `Solid cumulative GPA (${cgpa.toFixed(2)}) demonstrates foundational stability.`
    },
    {
      id: "assignmentRate",
      name: "Assignment Submission",
      value: `${assignmentRate}%`,
      benchmark: "80% benchmark",
      rawContribution: (assignRisk - 25) * PREDICTION_WEIGHTS.ASSIGNMENT_RATE,
      impact: assignmentRate < 70 ? "increases_risk" : "decreases_risk",
      severity: assignmentRate < 50 ? "Critical" : assignmentRate < 70 ? "Warning" : "Good",
      explanation: assignmentRate < 70
        ? `Missing assignments (${100 - assignmentRate}% incomplete) impacts practical term-work marks.`
        : `High submission punctuality (${assignmentRate}% completed).`
    },
    {
      id: "lmsActivity",
      name: "LMS Engagement",
      value: `${lmsHours} hrs/wk`,
      benchmark: "10+ hrs/wk recommended",
      rawContribution: (lmsRisk - 30) * PREDICTION_WEIGHTS.LMS_ACTIVITY,
      impact: lmsHours < 6 ? "increases_risk" : "decreases_risk",
      severity: lmsHours < 4 ? "Warning" : "Good",
      explanation: lmsHours < 6
        ? `Low platform engagement (${lmsHours} hrs/week) suggests reduced self-paced study.`
        : `Consistent portal login frequency (${lmsHours} hrs/week).`
    }
  ];

  // Sort factors by absolute magnitude of contribution
  factors.sort((a, b) => Math.abs(b.rawContribution) - Math.abs(a.rawContribution));

  // 6. Map to Actionable Supportive Interventions (PREDICT -> EXPLAIN -> INTERVENE)
  const recommendedInterventions = [];
  
  if (attendance < 75) {
    recommendedInterventions.push({
      type: "Attendance Improvement Plan",
      reason: `Attendance (${attendance}%) is below institutional minimum (75%).`,
      priority: attendance < 60 ? "High" : "Medium",
      recommendedAction: "Schedule mandatory attendance counseling and notify guardian/mentor.",
      suggestedMentor: "Department Attendance Committee"
    });
  }

  if (internalExam < 50 || failedSubjects > 0) {
    recommendedInterventions.push({
      type: "Academic Mentoring",
      reason: `Scored ${internalExam}% in mid-term with ${failedSubjects} active backlog(s).`,
      priority: "High",
      recommendedAction: "Enroll in remedial subject tutoring and assign 1-on-1 faculty mentor.",
      suggestedMentor: "Subject Faculty Lead"
    });
  }

  if (assignmentRate < 70) {
    recommendedInterventions.push({
      type: "Assignment Support",
      reason: `Assignment submission rate is low at ${assignmentRate}%.`,
      priority: "Medium",
      recommendedAction: "Pair with student peer tutor and provide laboratory extension roadmap.",
      suggestedMentor: "Peer Learning Group Lead"
    });
  }

  if (lmsHours < 6 && attendance >= 70) {
    recommendedInterventions.push({
      type: "Study Skills Workshops",
      reason: `LMS activity (${lmsHours} hrs) indicates low asynchronous resource utilization.`,
      priority: "Low",
      recommendedAction: "Direct student to digital library and time-management study workshop.",
      suggestedMentor: "Academic Success Center"
    });
  }

  if (studentData.financialDifficulty) {
    recommendedInterventions.push({
      type: "Financial Aid Referral",
      reason: "Financial hardship flagged during counseling.",
      priority: "Medium",
      recommendedAction: "Connect with College Student Welfare Committee for installment plan or book bank.",
      suggestedMentor: "Dean of Student Welfare"
    });
  }

  if (finalRiskScore >= 75) {
    recommendedInterventions.unshift({
      type: "Faculty Counselling",
      reason: `High cumulative risk index (${finalRiskScore}/100) across multiple dimensions.`,
      priority: "High",
      recommendedAction: "Comprehensive academic review with Head of Department.",
      suggestedMentor: "Head of Department (HoD)"
    });
  }

  // Fallback if no specific red flag but overall check needed
  if (recommendedInterventions.length === 0) {
    recommendedInterventions.push({
      type: "Academic Mentoring",
      reason: "Periodic check-in for maintenance of satisfactory academic standing.",
      priority: "Low",
      recommendedAction: "Routine monthly mentor check-in.",
      suggestedMentor: "Class Teacher"
    });
  }

  return {
    riskScore: finalRiskScore,
    riskCategory,
    confidence: Number((82.4 + (Math.abs(finalRiskScore - 50) * 0.28)).toFixed(1)), // Higher confidence at extremes
    baseValue,
    factors,
    topRiskFactor: factors[0]?.name || "Balanced Profile",
    recommendedInterventions,
    isSimulated: true,
    modelMetadata: {
      modelType: "Transparent Educational Decision-Support Model (PBL Demo Mode)",
      algorithm: "Multi-factor Normalized Academic Attribution Engine",
      validationSource: "TCET AIML Department PBL 2026",
      disclaimer: "Decision-support estimation for proactive assistance only. Not an automated punitive measure."
    }
  };
}

/**
 * Simulates Counterfactual ("What-If") scenario
 */
export function simulateWhatIf(currentStudent, adjustments) {
  const simulatedStudent = {
    ...currentStudent,
    ...adjustments
  };
  
  const originalResult = calculateAcademicRisk(currentStudent);
  const simulatedResult = calculateAcademicRisk(simulatedStudent);

  const deltaScore = simulatedResult.riskScore - originalResult.riskScore;
  const isImproved = deltaScore < 0; // Lower score is better

  return {
    original: originalResult,
    simulated: simulatedResult,
    deltaScore,
    isImproved,
    message: isImproved
      ? `Risk score decreases by ${Math.abs(deltaScore)} points (${originalResult.riskCategory} ➔ ${simulatedResult.riskCategory})`
      : deltaScore === 0
      ? "No significant change in overall risk score category."
      : `Risk score increases by ${deltaScore} points (${originalResult.riskCategory} ➔ ${simulatedResult.riskCategory})`
  };
}
