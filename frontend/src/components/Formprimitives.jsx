
import React from "react";

export const inputClass =
  "font-mono text-sm bg-[#F8FAF9] border border-emerald-900/15 rounded-lg px-3 py-2.5 text-slate-800 outline-none focus:border-emerald-600 transition-colors w-full";

export function fieldClass(hasError) {
  return hasError
    ? "font-mono text-sm bg-[#FDF5F4] border border-red-300 rounded-lg px-3 py-2.5 text-slate-800 outline-none focus:border-red-400 transition-colors w-full"
    : inputClass;
}

export function Section({ eyebrow, title, children }) {
  return (
    <div className="border border-emerald-900/10 rounded-xl p-5">
      <span className="font-mono text-[11px] tracking-wide uppercase text-amber-600 font-medium">
        {eyebrow}
      </span>
      <h3 className="font-display font-semibold text-lg text-emerald-950 mt-0.5 mb-4">{title}</h3>
      <div className="grid grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

export function Field({ label, span2, error, children }) {
  return (
    <div className={`flex flex-col gap-1.5 ${span2 ? "col-span-2" : ""}`}>
      <label className="text-xs font-medium text-slate-500">{label}</label>
      {children}
      {error && <span className="text-[11px] text-red-500">{error}</span>}
    </div>
  );
}