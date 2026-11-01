import React from 'react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  badgeType = "info",
  borderColor = "border-slate-200",
  iconBg = "bg-indigo-50 text-indigo-600"
}) {
  return (
    <div className={`p-5 rounded-2xl bg-white border ${borderColor} shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between`}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</span>
          {badgeText && (
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              badgeType === 'danger' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
              badgeType === 'warning' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
              badgeType === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
              'bg-indigo-50 text-indigo-700 border border-indigo-200'
            }`}>
              {badgeText}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
