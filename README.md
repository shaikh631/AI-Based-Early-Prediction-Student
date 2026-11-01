# Explainable AI-Based Early Prediction and Intervention System for At-Risk Students in Higher Education

[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Charts-Recharts-22c55e)](https://recharts.org/)
[![Lucide](https://img.shields.io/badge/Icons-Lucide_React-f59e0b)](https://lucide.dev/)

An enterprise-grade, responsive AI-powered SaaS dashboard built for higher education institutions to detect students at risk of academic failure or course dropout early in the semester, explain the underlying factors using Explainable AI (SHAP principles), and coordinate targeted, non-punitive supportive interventions.

Developed as a Third-Year Engineering Project-Based Learning (PBL) prototype at **Thakur College of Engineering & Technology (TCET), Department of Artificial Intelligence & Machine Learning (Autonomous College Affiliated to University of Mumbai)**.

---

## 🏛️ Project Metadata
* **Project Title:** Explainable AI-Based Early Prediction and Intervention System for At-Risk Students in Higher Education
* **Institution:** Thakur College of Engineering & Technology (TCET), Mumbai
* **Department:** Artificial Intelligence & Machine Learning Engineering
* **Faculty Guide:** Ms. Nagrani Seema (Assistant Professor & PBL Coordinator)
* **Student Team:** 
  - Shaikh Aayan Altaf (12-TT_AI&ML_C)
  - Ayan Shaikh (13-TT_AI&ML_C)
  - Amaan Nafis Siddiqui (24-TT_AI&ML_C)

---

## 🚀 The Core Engineering Framework

$$\mathbf{PREDICT} \longrightarrow \mathbf{EXPLAIN} \longrightarrow \mathbf{INTERVENE}$$

1. **PREDICT:** Evaluates in-semester student feature vectors (Attendance %, Internal Assessments IA-1 & IA-2, Assignment Completion Rate, Active Backlogs, CGPA, and LMS activity hours) to compute an early-warning risk probability (0 to 100).
2. **EXPLAIN:** Deconstructs the prediction into local feature attributions (emulating SHAP additive contributions), identifying which signals drive risk upwards (e.g., Attendance < 75%) and which act as protective buffers (e.g., strong previous GPA).
3. **INTERVENE:** Systematically maps identified risk factors to practical, supportive intervention packages (Attendance Counseling, Remedial Tutoring, Peer Learning Groups, Financial Aid Referral, Academic Mentoring) with progress tracking and mentor accountability.

---

## 💻 Tech Stack

* **Frontend Framework:** React 19 (JavaScript) with Vite
* **Styling Engine:** Tailwind CSS v4
* **Routing:** React Router DOM v7
* **Data Visualizations:** Recharts (Donut Risk Distribution, Semester Line Trends, Stacked Department Bars, Attendance vs CGPA Scatter Plot, Radar Model Comparison, Horizontal SHAP Waterfall)
* **Iconography:** Lucide React
* **State Management:** React Context API (`AppContext.jsx`) with automatic `localStorage` synchronization
* **Data Export:** Clean CSV Export utility for Student Rosters and Intervention Action Plans

---

## 📂 Project Architecture

```
PBL/
├── index.html                           # Entry HTML with Google Fonts & TCET metadata
├── package.json                         # Project dependencies and run scripts
├── vite.config.js                       # Vite configuration with React & Tailwind plugins
├── src/
│   ├── main.jsx                         # Application root mount
│   ├── App.jsx                          # React Router route registry
│   ├── index.css                        # Tailwind v4 setup & custom styling
│   ├── context/
│   │   └── AppContext.jsx               # Global state, LocalStorage sync, CRUD, filters
│   ├── data/
│   │   ├── students.js                  # Realistic 24-record institutional student dataset
│   │   └── modelEvaluation.js           # ML benchmarks (XGBoost, RF, DT, LR) & global SHAP
│   ├── services/
│   │   └── predictionService.js         # Deterministic multi-factor scoring & What-If engine
│   ├── utils/
│   │   └── csvExport.js                 # CSV export engine for rosters & intervention logs
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx              # Responsive navigation & faculty profile footer
│   │   │   ├── Navbar.jsx               # Breadcrumbs, department/term filters, alert pill
│   │   │   └── DashboardLayout.jsx      # Shell wrapper, global toast notifications
│   │   ├── dashboard/
│   │   │   ├── StatCard.jsx             # Metric KPI card component
│   │   │   └── RecentAlerts.jsx         # Priority alert roster table
│   │   ├── students/
│   │   │   ├── StudentTable.jsx         # Searchable, sortable student data table
│   │   │   ├── StudentFormModal.jsx     # Ingestion & edit modal with validation
│   │   │   └── StudentProfileModal.jsx  # Multi-tab dossier: Overview, History, XAI, Actions
│   │   └── interventions/
│   │       └── InterventionFormModal.jsx# Assign plan with mentor and target date
│   └── pages/
│       ├── Dashboard.jsx                # Institutional overview with 4 Recharts charts
│       ├── Students.jsx                 # Full student management & CSV export
│       ├── RiskPrediction.jsx           # AI inference sandbox with circular gauge & ML toggle
│       ├── ExplainableAI.jsx            # Local SHAP waterfall, evidence narrative & What-If
│       ├── Interventions.jsx            # Supportive action board with follow-up logs
│       ├── Analytics.jsx                # Cohort trends & ML model evaluation lab (Chapter 5)
│       └── Settings.jsx                 # Configurable risk thresholds (Low, Med, High)
```

---

## 🏃 Quick Start Guide

### 1. Prerequisites
- Node.js (v18.0 or higher)
- npm (v9.0 or higher)

### 2. Development Mode
Run the development server locally:
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 3. Production Build
Create an optimized production bundle:
```bash
npm run build
npm run preview
```

---

## 🛡️ Responsible AI & Ethical Governance
1. **Decision-Support Only:** The model generates probabilistic risk estimations to prioritize students for early human-led mentoring. It does **not** make autonomous disciplinary or punitive decisions.
2. **Transparent Rationale:** Every prediction is paired with human-readable explanations rather than a bare risk label.
3. **Data Minimization:** Sensitive financial flags are strictly access-controlled and confidential.
4. **Counterfactual Exploration:** The What-If simulator allows faculty to visualize positive academic recovery pathways before designing intervention plans.
# AI-Based-Early-Prediction-Student
