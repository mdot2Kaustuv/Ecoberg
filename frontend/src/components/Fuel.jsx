import React from "react";
import { Section, Field, fieldClass } from "./FormPrimitives";

export const FUEL_OPTIONS = [
  { value: "natural_gas", label: "Natural Gas", units: ["kwh", "therm", "m3"] },
  { value: "lpg", label: "LPG", units: ["kwh", "litre", "kg"] },
  { value: "cng", label: "CNG", units: ["kwh", "kg"] },
  { value: "biogas", label: "Biogas / Biomethane", units: ["kwh"] },
  { value: "diesel", label: "Diesel (Gas Oil)", units: ["kwh", "litre"] },
  { value: "petrol", label: "Petrol (Gasoline)", units: ["kwh", "litre"] },
  { value: "kerosene", label: "Burning Oil / Kerosene", units: ["kwh", "litre"] },
  { value: "fuel_oil", label: "Fuel Oil (Heavy)", units: ["kwh", "litre"] },
  { value: "red_diesel", label: "Gas Oil (Red Diesel)", units: ["kwh", "litre"] },
  { value: "biodiesel", label: "Biodiesel (B100 / FAME)", units: ["litre"] },
  { value: "hvo", label: "HVO", units: ["litre"] },
  { value: "bioethanol", label: "Bioethanol", units: ["litre"] },
  { value: "wood_logs", label: "Wood Logs", units: ["kwh", "kg"] },
  { value: "wood_pellets", label: "Wood Pellets", units: ["kwh", "kg"] },
  { value: "coal_industrial", label: "Coal (Industrial)", units: ["kwh", "kg"] },
  { value: "coal_domestic", label: "Coal (Domestic)", units: ["kwh", "kg"] },
];

export const fuelDefaults = {
  fuel_type: "natural_gas",
  fuel_unit: "kwh",
  fuel_amount: "",
  fuel_include_wtt: true,
};

function isPositiveNumber(v) {
  return v !== "" && !Number.isNaN(Number(v)) && Number(v) > 0;
}

export function validateFuel(values) {
  const errors = {};
  if (!isPositiveNumber(values.fuel_amount)) errors.fuel_amount = "Enter an amount greater than 0";
  return errors;
}

export default function FuelSection({ values, errors, onChange }) {
  const unitOptions = FUEL_OPTIONS.find((f) => f.value === values.fuel_type)?.units || ["kwh"];

  function handleFuelTypeChange(nextType) {
    const next = FUEL_OPTIONS.find((f) => f.value === nextType);
    onChange("fuel_type", nextType);
    onChange("fuel_unit", next.units[0]);
  }

  return (
    <Section eyebrow="Scope 1 · Stationary combustion" title="Fuel">
      <Field label="Fuel type">
        <select
          className={fieldClass(false)}
          value={values.fuel_type}
          onChange={(e) => handleFuelTypeChange(e.target.value)}
        >
          {FUEL_OPTIONS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Unit">
        <select
          className={fieldClass(false)}
          value={values.fuel_unit}
          onChange={(e) => onChange("fuel_unit", e.target.value)}
        >
          {unitOptions.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Amount" span2 error={errors.fuel_amount}>
        <input
          className={fieldClass(!!errors.fuel_amount)}
          type="number"
          min="0"
          value={values.fuel_amount}
          onChange={(e) => onChange("fuel_amount", e.target.value)}
        />
      </Field>
      <Field label="Well-to-Tank" span2>
        <label className="flex items-center gap-2 text-sm text-slate-600 py-1">
          <input
            type="checkbox"
            className="w-4 h-4 accent-emerald-700"
            checked={values.fuel_include_wtt}
            onChange={(e) => onChange("fuel_include_wtt", e.target.checked)}
          />
          Include upstream (Well-to-Tank) emissions
        </label>
      </Field>
    </Section>
  );
}