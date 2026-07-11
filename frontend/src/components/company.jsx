import React, { useState } from "react";
import { Section, Field, inputClass } from "./FormPrimitives";
import FuelSection, { fuelSectionDefaults } from "./FuelSection";

const API_BASE = "/company/calculate";

const initialForm = {

  freight_origin_country: "NP",
  freight_destination_country: "NP",
  freight_origin_location: "Kathmandu",
  freight_destination_location: "Kathmandu",
  freight_weight: "",
  // Travel
  travel_origin_country: "NP",
  travel_destination_country: "NP",
  travel_origin_location: "Kathmandu",
  travel_destination_location: "",
  travel_mode: "car",
  travel_vehicle_type: "diesel",
  travel_cabin_class: "economy",
  travel_return_trip: false,
  travel_passengers: 1,
  // Hotel
  hotel_country_code: "NP",
  hotel_nights: "",
  hotel_rooms: 1,
  // Electricity
  electricity_kwh: "",
  electricity_country_code: "NP",
  electricity_cloud_provider: "aws",
  // Fuel
  ...fuelSectionDefaults,
};

export default function RegisterCompany() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [company, setCompany] = useState(null);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
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
        setError(message);
        return;
      }

      setCompany(body.company);
    } catch (err) {
      setError("Couldn't reach the server. Is the backend running?");
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Section eyebrow="Scope 3 · Logistics" title="Freight">
            <Field label="Origin location">
              <input
                className={inputClass}
                value={form.freight_origin_location}
                onChange={(e) => update("freight_origin_location", e.target.value)}
              />
            </Field>
            <Field label="Destination location">
              <input
                className={inputClass}
                value={form.freight_destination_location}
                onChange={(e) => update("freight_destination_location", e.target.value)}
              />
            </Field>
            <Field label="Origin country code">
              <input
                className={inputClass}
                maxLength={2}
                value={form.freight_origin_country}
                onChange={(e) => update("freight_origin_country", e.target.value.toUpperCase())}
              />
            </Field>
            <Field label="Destination country code">
              <input
                className={inputClass}
                maxLength={2}
                value={form.freight_destination_country}
                onChange={(e) => update("freight_destination_country", e.target.value.toUpperCase())}
              />
            </Field>
            <Field label="Weight (kg)" span2>
              <input
                className={inputClass}
                type="number"
                min="0"
                value={form.freight_weight}
                onChange={(e) => update("freight_weight", e.target.value)}
              />
            </Field>
          </Section>

          <Section eyebrow="Scope 3 · Business travel" title="Travel">
            <Field label="Origin country code">
              <input
                className={inputClass}
                maxLength={2}
                value={form.travel_origin_country}
                onChange={(e) => update("travel_origin_country", e.target.value.toUpperCase())}
              />
            </Field>
            <Field label="Destination country code">
              <input
                className={inputClass}
                maxLength={2}
                value={form.travel_destination_country}
                onChange={(e) => update("travel_destination_country", e.target.value.toUpperCase())}
              />
            </Field>
            <Field label="Origin location">
              <input
                className={inputClass}
                value={form.travel_origin_location}
                onChange={(e) => update("travel_origin_location", e.target.value)}
              />
            </Field>
            <Field label="Destination location">
              <input
                className={inputClass}
                value={form.travel_destination_location}
                onChange={(e) => update("travel_destination_location", e.target.value)}
              />
            </Field>
            <Field label="Mode">
              <select
                className={inputClass}
                value={form.travel_mode}
                onChange={(e) => update("travel_mode", e.target.value)}
              >
                <option value="car">Car</option>
                <option value="flight">Flight</option>
                <option value="rail">Rail</option>
                <option value="bus">Bus</option>
              </select>
            </Field>
            <Field label="Passengers">
              <input
                className={inputClass}
                type="number"
                min="1"
                value={form.travel_passengers}
                onChange={(e) => update("travel_passengers", e.target.value)}
              />
            </Field>
            {form.travel_mode === "car" && (
              <Field label="Vehicle type">
                <select
                  className={inputClass}
                  value={form.travel_vehicle_type}
                  onChange={(e) => update("travel_vehicle_type", e.target.value)}
                >
                  <option value="diesel">Diesel</option>
                  <option value="petrol">Petrol</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </Field>
            )}
            {form.travel_mode === "flight" && (
              <Field label="Cabin class">
                <select
                  className={inputClass}
                  value={form.travel_cabin_class}
                  onChange={(e) => update("travel_cabin_class", e.target.value)}
                >
                  <option value="economy">Economy</option>
                  <option value="premium_economy">Premium economy</option>
                  <option value="business">Business</option>
                  <option value="first">First</option>
                </select>
              </Field>
            )}
            <Field label="Return trip">
              <label className="flex items-center gap-2 text-sm text-slate-600 py-2.5">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-emerald-700"
                  checked={form.travel_return_trip}
                  onChange={(e) => update("travel_return_trip", e.target.checked)}
                />
                Round trip
              </label>
            </Field>
          </Section>

          <Section eyebrow="Scope 3 · Accommodation" title="Hotel">
            <Field label="Country code">
              <input
                className={inputClass}
                maxLength={2}
                value={form.hotel_country_code}
                onChange={(e) => update("hotel_country_code", e.target.value.toUpperCase())}
              />
            </Field>
            <Field label="Nights">
              <input
                className={inputClass}
                type="number"
                min="0"
                value={form.hotel_nights}
                onChange={(e) => update("hotel_nights", e.target.value)}
              />
            </Field>
            <Field label="Rooms" span2>
              <input
                className={inputClass}
                type="number"
                min="1"
                value={form.hotel_rooms}
                onChange={(e) => update("hotel_rooms", e.target.value)}
              />
            </Field>
          </Section>

          <Section eyebrow="Scope 2 · Energy" title="Electricity">
            <Field label="Usage (kWh)">
              <input
                className={inputClass}
                type="number"
                min="0"
                value={form.electricity_kwh}
                onChange={(e) => update("electricity_kwh", e.target.value)}
              />
            </Field>
            <Field label="Country code">
              <input
                className={inputClass}
                maxLength={2}
                value={form.electricity_country_code}
                onChange={(e) => update("electricity_country_code", e.target.value.toUpperCase())}
              />
            </Field>
            <Field label="Cloud provider" span2>
              <select
                className={inputClass}
                value={form.electricity_cloud_provider}
                onChange={(e) => update("electricity_cloud_provider", e.target.value)}
              >
                <option value="aws">AWS</option>
                <option value="gcp">Google Cloud</option>
                <option value="azure">Azure</option>
                <option value="none">Not cloud-hosted</option>
              </select>
            </Field>
          </Section>

          <FuelSection values={form} onChange={update} />

          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-900 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-default text-white font-semibold text-sm rounded-lg py-3.5 transition-colors active:translate-y-px"
          >
            {loading ? "Calculating…" : "Calculate company footprint"}
          </button>
        </form>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2.5">
            {error}
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