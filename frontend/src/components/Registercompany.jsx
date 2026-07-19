import React, { useState } from "react";
import FreightSection, { freightDefaults, validateFreight } from "./FreightSection";
import TravelSection, { travelDefaults, validateTravel } from "./TravelSection";
import HotelSection, { hotelDefaults, validateHotel } from "./HotelSection";
import ElectricitySection, { electricityDefaults, validateElectricity } from "./ElectricitySection";
import FuelSection, { fuelDefaults, validateFuel } from "./FuelSection";

// ---------------------------------------------------------------------------
// Adjust to match your urls.py route for the `company_emission` view.
const API_BASE = "/company/calculate";
// ---------------------------------------------------------------------------

const initialForm = {
  ...freightDefaults,
  ...travelDefaults,
  ...hotelDefaults,
  ...electricityDefaults,
  ...fuelDefaults,
};

function validate(form) {
  return {
    ...validateFreight(form),
    ...validateTravel(form),
    ...validateHotel(form),
    ...validateElectricity(form),
    ...validateFuel(form),
  };
}

export default function RegisterCompany() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [company, setCompany] = useState(null);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      if (!(key in e)) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSubmitError("Fix the highlighted fields before calculating.");
      return;
    }

    setLoading(true);
    setSubmitError(null);
    setCompany(null);

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          travel_return_trip: String(form.travel_return_trip),
          fuel_include_wtt: String(form.fuel_include_wtt),
          electricity_include_wtt: String(form.electricity_include_wtt),
          electricity_include_td_losses: String(form.electricity_include_td_losses),
        }),
      });
      const body = await res.json();

      if (!res.ok) {
        const message =
          typeof body?.error === "string"
            ? body.error
            : body?.error
            ? JSON.stringify(body.error)
            : "Couldn't calculate your company's footprint. Check the values and try again.";
        setSubmitError(message);
        return;
      }

      setCompany(body.company);
    } catch (err) {
      setSubmitError("Couldn't reach the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center px-4 py-10 bg-[#F8FAF9]">
      <div className="w-full max-w-2xl bg-white border border-emerald-900/10 rounded-2xl shadow-sm p-8">
        <div className="mb-7">
          <span className="font-mono text-[11px] tracking-wide uppercase text-amber-600 font-medium">
            Company setup
          </span>
          <h2 className="font-display font-semibold text-2xl text-emerald-950 mt-1">
            Calculate your company's footprint
          </h2>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            Fill in a representative period (e.g. one month) for each category. We'll price it out
            across freight, travel, hotel stays, electricity, and fuel.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <FreightSection values={form} errors={errors} onChange={update} />
          <TravelSection values={form} errors={errors} onChange={update} />
          <HotelSection values={form} errors={errors} onChange={update} />
          <ElectricitySection values={form} errors={errors} onChange={update} />
          <FuelSection values={form} errors={errors} onChange={update} />

          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-900 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-default text-white font-semibold text-sm rounded-lg py-3.5 transition-colors active:translate-y-px"
          >
            {loading ? "Calculating…" : "Calculate company footprint"}
          </button>
        </form>

        {submitError && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2.5">
            {submitError}
          </div>
        )}

        {company && <FootprintSummary company={company} />}
      </div>
    </div>
  );
}

function FootprintSummary({ company }) {
  const rows = [
    { label: "Freight", value: company.freight_footprint },
    { label: "Travel", value: company.travel_footprint },
    { label: "Hotel", value: company.hotel_footprint },
    { label: "Electricity", value: company.electricity_footprint },
    { label: "Fuel", value: company.fuel_footprint },
  ];
  const max = Math.max(...rows.map((r) => Number(r.value) || 0), 1);

  return (
    <div className="mt-6 pt-6 border-t border-emerald-900/10">
      <div className="flex items-baseline gap-2 mb-5">
        <span className="font-mono font-semibold text-4xl text-amber-600">
          {Number(company.total_footprint).toLocaleString(undefined, { maximumFractionDigits: 1 })}
        </span>
        <span className="text-sm text-slate-500">kg CO2e total</span>
      </div>

      <div className="flex flex-col gap-2.5">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-3">
            <span className="w-24 text-xs text-slate-500">{r.label}</span>
            <div className="flex-1 h-2 rounded-full bg-[#F8FAF9] border border-emerald-900/10 overflow-hidden">
              <div
                className="h-full bg-emerald-700"
                style={{ width: `${(Number(r.value) / max) * 100}%` }}
              />
            </div>
            <span className="w-20 text-right font-mono text-xs text-emerald-950">
              {Number(r.value).toFixed(1)}kg
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}