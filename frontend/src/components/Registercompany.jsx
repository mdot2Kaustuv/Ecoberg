import React, { useState } from "react";
import useAxios from "../utils/Axios";
import FreightSection, { freightDefaults, validateFreight } from "./FreightSection";
import TravelSection, { travelDefaults, validateTravel } from "./TravelSection";
import HotelSection, { hotelDefaults, validateHotel } from "./HotelSection";
import ElectricitySection, { electricityDefaults, validateElectricity } from "./ElectricitySection";
import FuelSection, { fuelDefaults, validateFuel } from "./FuelSection";

const API_PATH = "/company/calculate/";

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
  const api = useAxios();
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

    try {
      // Company name/industry/registration number captured on the previous
      // onboarding step (CompanyDetailsForm.jsx), stashed in sessionStorage.
      let companyDetails = {};
      try {
        companyDetails = JSON.parse(sessionStorage.getItem("companyDetails") || "{}");
      } catch {
        companyDetails = {};
      }

      const res = await api.post(API_PATH, {
        ...companyDetails,
        ...form,
        travel_return_trip: String(form.travel_return_trip),
        fuel_include_wtt: String(form.fuel_include_wtt),
        electricity_include_wtt: String(form.electricity_include_wtt),
        electricity_include_td_losses: String(form.electricity_include_td_losses),
      });

      sessionStorage.removeItem("companyDetails");
      setCompany(res.data.company);
    } catch (err) {
      if (err.response) {
        const body = err.response.data;
        const message =
          typeof body?.error === "string"
            ? body.error
            : body?.error
            ? JSON.stringify(body.error)
            : "Couldn't calculate your company's footprint. Check the values and try again.";
        setSubmitError(message);
      } else {
        setSubmitError("Couldn't reach the server. Check that Django is running and CORS is configured.");
      }
    } finally {
      setLoading(false);
    }
  }

  // -------------------------------------------------------------------------
  // If calculation succeeded, show the results page instead of the form.
  // -------------------------------------------------------------------------
  if (company) {
    return <CompanyResultsPage company={company} onRecalculate={() => setCompany(null)} />;
  }

  return (
    <div className="flex justify-center px-4 py-10 bg-[#F8FAF9] min-h-screen">
      <div className="w-full max-w-2xl bg-white border border-emerald-900/10 rounded-2xl shadow-sm p-8 h-fit">
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
      </div>
    </div>
  );
}

// ===========================================================================
// RESULTS PAGE COMPONENT
// ===========================================================================
function CompanyResultsPage({ company, onRecalculate }) {
  const rows = [
    { label: "Freight", value: company.freight_footprint },
    { label: "Travel", value: company.travel_footprint },
    { label: "Hotel Stays", value: company.hotel_footprint },
    { label: "Electricity", value: company.electricity_footprint },
    { label: "Fuel", value: company.fuel_footprint },
  ];
  const max = Math.max(...rows.map((r) => Number(r.value) || 0), 1);

  return (
    <div className="min-h-screen bg-[#F8FAF9] px-4 py-10 flex justify-center">
      <div className="w-full max-w-4xl space-y-6">

        {/* Header / Success Banner */}
        <div className="bg-emerald-900 text-white rounded-2xl p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="inline-block px-3 py-1 bg-emerald-800 text-amber-400 font-mono text-xs rounded-full uppercase tracking-wider mb-3">
              Calculation Complete
            </span>
            <h1 className="text-3xl font-bold font-display">
              {company.company_name ? `${company.company_name} — Footprint Overview` : "Company Footprint Overview"}
            </h1>
            <p className="text-emerald-200/80 text-sm mt-1">
              Your carbon emissions have been calculated and saved to your account.
            </p>
          </div>
          <button
            onClick={onRecalculate}
            className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm"
          >
            Recalculate Form
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Main Footprint Card */}
          <div className="bg-white border border-emerald-900/10 rounded-2xl p-6 shadow-sm md:col-span-2">
            <h3 className="font-semibold text-emerald-950 text-lg mb-1">Breakdown by Category</h3>
            <p className="text-xs text-slate-500 mb-6">Emissions per segment (kg CO2e)</p>

            <div className="flex items-baseline gap-2 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="font-mono font-bold text-4xl text-amber-600">
                {Number(company.total_footprint).toLocaleString(undefined, { maximumFractionDigits: 1 })}
              </span>
              <span className="text-sm font-medium text-slate-600">kg CO2e Total</span>
            </div>

            <div className="flex flex-col gap-3">
              {rows.map((r) => (
                <div key={r.label} className="flex items-center gap-3">
                  <span className="w-28 text-xs font-medium text-slate-600">{r.label}</span>
                  <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-emerald-700 rounded-full transition-all duration-500"
                      style={{ width: `${(Number(r.value) / max) * 100}%` }}
                    />
                  </div>
                  <span className="w-20 text-right font-mono text-xs font-semibold text-emerald-950">
                    {Number(r.value).toFixed(1)} kg
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Company Details Card */}
          <div className="bg-white border border-emerald-900/10 rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-emerald-950 text-lg mb-4">Company Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="block text-xs text-slate-400 uppercase tracking-wide">Name</span>
                <span className="font-semibold text-slate-800">{company.company_name || "—"}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-400 uppercase tracking-wide">Industry</span>
                <span className="font-semibold text-slate-800">{company.industry || "—"}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-400 uppercase tracking-wide">Registration No.</span>
                <span className="font-semibold text-slate-800">{company.registration_number || "—"}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}