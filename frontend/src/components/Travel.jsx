import React from "react";
import { Section, Field, fieldClass } from "./FormPrimitives";

export const TRAVEL_MODES = ["car", "flight", "rail", "bus", "ferry", "taxi"];

// Per the docs these are the fuel-type values the API accepts for car/taxi vehicle_type.
export const TRAVEL_VEHICLE_TYPES = [
  { value: "petrol", label: "Petrol" },
  { value: "diesel", label: "Diesel" },
  { value: "hybrid", label: "Hybrid" },
  { value: "phev", label: "Plug-in hybrid (PHEV)" },
  { value: "bev", label: "Battery electric (BEV)" },
];

export const CABIN_CLASSES = ["economy", "premium_economy", "business", "first"];

const COUNTRY_CODE_RE = /^[A-Z]{2}$/;

export const travelDefaults = {
  travel_origin_country: "NP",
  travel_destination_country: "NP",
  travel_origin_location: "Kathmandu",
  travel_destination_location: "",
  travel_mode: "car",
  travel_vehicle_type: "diesel",
  travel_cabin_class: "economy",
  travel_return_trip: false,
  travel_passengers: 1,
};

function isIntInRange(v, min, max) {
  const n = Number(v);
  return v !== "" && Number.isInteger(n) && n >= min && n <= max;
}

export function validateTravel(values) {
  const errors = {};
  if (!COUNTRY_CODE_RE.test(values.travel_origin_country))
    errors.travel_origin_country = "2-letter country code (e.g. NP)";
  if (!COUNTRY_CODE_RE.test(values.travel_destination_country))
    errors.travel_destination_country = "2-letter country code (e.g. NP)";
  if (!isIntInRange(values.travel_passengers, 1, 10))
    errors.travel_passengers = "Whole number between 1 and 10";
  return errors;
}

export default function TravelSection({ values, errors, onChange }) {
  return (
    <Section eyebrow="Scope 3 · Business travel" title="Travel">
      <Field label="Origin country code" error={errors.travel_origin_country}>
        <input
          className={fieldClass(!!errors.travel_origin_country)}
          maxLength={2}
          value={values.travel_origin_country}
          onChange={(e) => onChange("travel_origin_country", e.target.value.toUpperCase())}
        />
      </Field>
      <Field label="Destination country code" error={errors.travel_destination_country}>
        <input
          className={fieldClass(!!errors.travel_destination_country)}
          maxLength={2}
          value={values.travel_destination_country}
          onChange={(e) => onChange("travel_destination_country", e.target.value.toUpperCase())}
        />
      </Field>
      <Field label="Origin location">
        <input
          className={fieldClass(false)}
          value={values.travel_origin_location}
          onChange={(e) => onChange("travel_origin_location", e.target.value)}
        />
      </Field>
      <Field label="Destination location">
        <input
          className={fieldClass(false)}
          value={values.travel_destination_location}
          onChange={(e) => onChange("travel_destination_location", e.target.value)}
        />
      </Field>
      <Field label="Mode">
        <select
          className={fieldClass(false)}
          value={values.travel_mode}
          onChange={(e) => onChange("travel_mode", e.target.value)}
        >
          {TRAVEL_MODES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Passengers (1–10)" error={errors.travel_passengers}>
        <input
          className={fieldClass(!!errors.travel_passengers)}
          type="number"
          min="1"
          max="10"
          value={values.travel_passengers}
          onChange={(e) => onChange("travel_passengers", e.target.value)}
        />
      </Field>
      {(values.travel_mode === "car" || values.travel_mode === "taxi") && (
        <Field label="Vehicle type">
          <select
            className={fieldClass(false)}
            value={values.travel_vehicle_type}
            onChange={(e) => onChange("travel_vehicle_type", e.target.value)}
          >
            {TRAVEL_VEHICLE_TYPES.map((v) => (
              <option key={v.value} value={v.value}>
                {v.label}
              </option>
            ))}
          </select>
        </Field>
      )}
      {values.travel_mode === "flight" && (
        <Field label="Cabin class">
          <select
            className={fieldClass(false)}
            value={values.travel_cabin_class}
            onChange={(e) => onChange("travel_cabin_class", e.target.value)}
          >
            {CABIN_CLASSES.map((c) => (
              <option key={c} value={c}>
                {c.replace("_", " ")}
              </option>
            ))}
          </select>
        </Field>
      )}
      <Field label="Return trip">
        <label className="flex items-center gap-2 text-sm text-slate-600 py-2.5">
          <input
            type="checkbox"
            className="w-4 h-4 accent-emerald-700"
            checked={values.travel_return_trip}
            onChange={(e) => onChange("travel_return_trip", e.target.checked)}
          />
          Round trip
        </label>
      </Field>
    </Section>
  );
}