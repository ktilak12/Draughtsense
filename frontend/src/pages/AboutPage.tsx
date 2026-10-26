import React from 'react';
import {
  Info,
  Users,
  BookOpen,
  Award,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Target,
  FileCode,
  Layers,
  Sparkles
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl pb-10">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white p-8 rounded-3xl shadow-sm space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
          <Award className="w-3.5 h-3.5" />
          <span>Course: EHDS-2026 Project 1</span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight">DroughtSense</h1>
        <p className="text-sm text-emerald-100/90 leading-relaxed font-medium">
          A Machine Learning-Based Framework for Drought Prediction and Early Warning Using Hydrological and Meteorological Data.
        </p>

        <div className="pt-4 border-t border-emerald-800/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-emerald-400 block text-[10px] uppercase font-bold tracking-wider">Institution</span>
            <span className="font-semibold text-white">Department of Data Science & Environmental Informatics</span>
          </div>
          <div>
            <span className="text-emerald-400 block text-[10px] uppercase font-bold tracking-wider">Project Phase</span>
            <span className="font-semibold text-white">Phase 1 (Functional Release v1.0.0)</span>
          </div>
          <div>
            <span className="text-emerald-400 block text-[10px] uppercase font-bold tracking-wider">Indices Implemented</span>
            <span className="font-semibold text-white">SPI-3, SPEI-3, ML Multi-Class</span>
          </div>
        </div>
      </div>

      {/* Team Members Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2 pb-2 border-b border-slate-100">
          <Users className="w-4 h-4 text-emerald-700" />
          <span>Project Research & Development Team</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-800">Team Member</span>
            <h4 className="font-bold text-slate-900 text-sm">Vyoam Joshi</h4>
            <p className="text-xs font-mono text-slate-500">RA2411056010048</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-800">Team Member</span>
            <h4 className="font-bold text-slate-900 text-sm">Midhu John</h4>
            <p className="text-xs font-mono text-slate-500">RA2411026010534</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-800">Team Member</span>
            <h4 className="font-bold text-slate-900 text-sm">Tilak</h4>
            <p className="text-xs font-mono text-slate-500">RA241103010556</p>
          </div>
        </div>
      </div>

      {/* The Environmental Problem & Objectives */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2 pb-2 border-b border-slate-100">
          <Target className="w-4 h-4 text-emerald-700" />
          <span>The Environmental Problem & Project Objectives</span>
        </h3>

        <div className="text-xs text-slate-600 leading-relaxed space-y-3">
          <p>
            Drought is a creeping natural hazard characterized by persistent precipitation deficits, depleted soil moisture reserves, and diminished streamflow volumes. Unlike acute events such as floods or cyclones, droughts evolve imperceptibly across months, making proactive prediction and early warning vital to prevent severe agricultural losses, municipal water supply crises, and ecosystem degradation.
          </p>

          <h4 className="font-bold text-slate-800 pt-1">Core Objectives:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Data Integration:</strong> Unify ground-station hydrometeorological observations with automated data quality auditing.
            </li>
            <li>
              <strong>Drought Indices:</strong> Statistically calculate Standardized Precipitation Index (SPI) and Standardized Precipitation Evapotranspiration Index (SPEI) using Gamma and Generalized Extreme Value distributions.
            </li>
            <li>
              <strong>Machine Learning Classification:</strong> Train Random Forest and gradient-boosted ensembles to predict drought severity and risk probability without data leakage.
            </li>
            <li>
              <strong>Actionable Early Warning:</strong> Automatically translate model outputs into graded early warnings (Normal, Watch, Warning, Critical) coupled with recommended regional preparedness measures.
            </li>
          </ul>
        </div>
      </div>

      {/* Scientific Methodology */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2 pb-2 border-b border-slate-100">
          <BookOpen className="w-4 h-4 text-emerald-700" />
          <span>Scientific Indices & Machine Learning Pipeline</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900">1. Standardized Precipitation Index (SPI)</h4>
            <p className="leading-relaxed">
              Formulated by McKee et al. (1993). Evaluates rainfall deviation against a fitted 2-parameter Gamma probability distribution over flexible aggregation windows (1, 3, 6, 12 months). Incorporates Thom&apos;s zero-rain probability adjustment:
            </p>
            <div className="p-2 bg-white rounded font-mono text-[11px] text-slate-800 border border-slate-200">
              H(x) = q + (1 - q) &times; G(x)
            </div>
            <p className="text-[11px] text-slate-500">
              Transformed into standard normal deviates Z ~ N(0, 1). SPI &le; -1.0 indicates meteorological drought.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900">2. Standardized Precipitation Evapotranspiration Index (SPEI)</h4>
            <p className="leading-relaxed">
              Developed by Vicente-Serrano et al. (2010). Accounts for temperature-driven evaporative demand by computing climatic water balance D = P - PET:
            </p>
            <div className="p-2 bg-white rounded font-mono text-[11px] text-slate-800 border border-slate-200">
              D = Precipitation - Potential Evapotranspiration
            </div>
            <p className="text-[11px] text-slate-500">
              Fitted using Generalized Extreme Value (GEV) and Pearson Type III distributions to model positive and negative water balance anomalies.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
          <h4 className="font-bold text-slate-900">3. Machine Learning Decision Architecture</h4>
          <p className="leading-relaxed">
            The platform supports four distinct learning algorithms: <strong>Random Forest</strong> (primary proposed model), <strong>XGBoost</strong>, <strong>Decision Tree</strong>, and <strong>Logistic Regression</strong>. Preprocessing (median imputation and feature standard scaling) is strictly fitted on training splits to eliminate temporal data leakage.
          </p>
        </div>
      </div>

      {/* Scientific Limitation Statement */}
      <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-2">
        <div className="flex items-center space-x-2 font-bold text-amber-800">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>Scientific Disclaimer & Operational Scope</span>
        </div>
        <p className="leading-relaxed">
          DroughtSense is an academic research platform developed for Course EHDS-2026 Project 1. Predictions generated by the system represent statistical inferences based on the provided hydrological and meteorological variables and do not constitute official statutory weather forecasts or government disaster declarations. Ground truth validation requires localized station calibration and high-density soil probe telemetry.
        </p>
      </div>
    </div>
  );
};
