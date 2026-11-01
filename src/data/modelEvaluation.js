/**
 * Machine Learning Model Evaluation & Benchmark Data
 * Based on Chapter 2 (Literature Survey) & Chapter 4 (Methodology) of TCET PBL:
 * Comparing Baseline and Tree-based Ensembles for Academic Early Warning.
 */

export const MODEL_BENCHMARKS = [
  {
    id: "xgboost",
    name: "XGBoost Classifier (Selected)",
    family: "Gradient Boosted Trees",
    accuracy: 89.2,
    precision: 85.7,
    recall: 92.4, // Key metric: high recall to minimize false negatives for at-risk students
    f1Score: 88.9,
    rocAuc: 0.941,
    latencyMs: 14,
    status: "Active Production Candidate",
    description: "Highest recall (92.4%) with lowest false negative rate on minority high-risk cohort.",
    confusionMatrix: {
      tp: 61,
      fn: 5,
      fp: 10,
      tn: 124
    }
  },
  {
    id: "random_forest",
    name: "Random Forest Ensemble",
    family: "Bagging Trees",
    accuracy: 87.5,
    precision: 84.1,
    recall: 87.9,
    f1Score: 85.9,
    rocAuc: 0.925,
    latencyMs: 18,
    status: "Benchmark",
    description: "Robust non-linear ensemble; highly resistant to overfitting on small institutional batches.",
    confusionMatrix: {
      tp: 58,
      fn: 8,
      fp: 11,
      tn: 123
    }
  },
  {
    id: "decision_tree",
    name: "Decision Tree (CART)",
    family: "Rule-based Tree",
    accuracy: 79.0,
    precision: 73.2,
    recall: 78.8,
    f1Score: 75.9,
    rocAuc: 0.814,
    latencyMs: 4,
    status: "Baseline",
    description: "Interpretable threshold rules, but prone to high variance across semester boundaries.",
    confusionMatrix: {
      tp: 52,
      fn: 14,
      fp: 19,
      tn: 115
    }
  },
  {
    id: "logistic_regression",
    name: "Logistic Regression",
    family: "Linear Model Baseline",
    accuracy: 76.5,
    precision: 71.0,
    recall: 74.2,
    f1Score: 72.6,
    rocAuc: 0.798,
    latencyMs: 2,
    status: "Baseline",
    description: "Standard statistical baseline; struggles with non-linear interaction terms.",
    confusionMatrix: {
      tp: 49,
      fn: 17,
      fp: 20,
      tn: 114
    }
  }
];

export const GLOBAL_FEATURE_IMPORTANCE = [
  { feature: "Attendance %", importance: 0.28, shapAvg: "+0.32", domain: "Behavioral Engagement" },
  { feature: "Internal Assessment (IA)", importance: 0.22, shapAvg: "+0.26", domain: "Academic Milestones" },
  { feature: "Active Backlogs / KT", importance: 0.20, shapAvg: "+0.23", domain: "Historical Progress" },
  { feature: "Current CGPA", importance: 0.15, shapAvg: "+0.18", domain: "Cumulative Capacity" },
  { feature: "Assignment Completion", importance: 0.10, shapAvg: "+0.12", domain: "Continuous Work" },
  { feature: "LMS Activity (Moodle/Hrs)", importance: 0.05, shapAvg: "+0.07", domain: "Digital Footprint" }
];
