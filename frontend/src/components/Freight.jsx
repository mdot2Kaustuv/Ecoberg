import React from "react";
import { Section, Field, fieldClass } from "./FormPrimitives";

export const FREIGHT_TRANSPORT_MODES = [
  { value: "", label: "Auto" },
  { value: "road", label: "Road" },
  { value: "rail", label: "Rail" },
  { value: "sea", label: "Sea" },
  { value: "air", label: "Air" },
];

export const FREIGHT_FUEL_SOURCES = ["diesel", "petrol", "electric", "hybrid", "hvo", "cng"];
export const FREIGHT_WEIGHT_UNITS = ["kg", "g", "lb", "tonne"];

const COUNTRY_CODE_RE = /^[A-Z]{2}$/;

export const freightDefaults = {
  freight_origin_country: "NP",
  freight_destination_country: "NP",
  freight_origin_location: "Kathmandu",
  freight_destination_location: "Kathmandu",
  freight_weight: "",
  freight_weight_unit: "kg",
  freight_transport_mode: "",
  freight_fuel_source: "diesel",
};

function isPositiveNumber(v) {
  return v !== "" && !Number.isNaN(Number(v)) && Number(v) > 0;
}

export function validateFreight(values) {
  const errors = {};
  if (!COUNTRY_CODE_RE.test(values.freight_origin_country))
    errors.freight_origin_country = "2-letter country code (e.g. NP)";
  if (!COUNTRY_CODE_RE.test(values.freight_destination_country))
    errors.freight_destination_country = "2-letter country code (e.g. NP)";
  if (!isPositiveNumber(values.freight_weight))
    errors.freight_weight = "Enter a weight greater than 0";
  return errors;
}

export default function FreightSection({ values, errors, onChange }) {
  return (
    <Section eyebrow="Scope 3 · Logistics" title="Freight">
      <Field label="Origin country code" error={errors.freight_origin_country}>
        <input
          className={fieldClass(!!errors.freight_origin_country)}
          maxLength={2}
          value={values.freight_origin_country}
          onChange={(e) => onChange("freight_origin_country", e.target.value.toUpperCase())}
        />
      </Field>
      <Field label="Destination country code" error={errors.freight_destination_country}>
        <input
          className={fieldClass(!!errors.freight_destination_country)}
          maxLength={2}
          value={values.freight_destination_country}
          onChange={(e) => onChange("freight_destination_country", e.target.value.toUpperCase())}
        />
      </Field>
      <Field label="Origin location">
        <input
          className={fieldClass(false)}
          value={values.freight_origin_location}
          onChange={(e) => onChange("freight_origin_location", e.target.value)}
        />
      </Field>
      <Field label="Destination location">
        <input
          className={fieldClass(false)}
          value={values.freight_destination_location}
          onChange={(e) => onChange("freight_destination_location", e.target.value)}
        />
      </Field>
      <Field label="Transport mode">
        <select
          className={fieldClass(false)}
          value={values.freight_transport_mode}
          onChange={(e) => onChange("freight_transport_mode", e.target.value)}
        >
          {FREIGHT_TRANSPORT_MODES.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Fuel source">
        <select
          className={fieldClass(false)}
          value={values.freight_fuel_source}
          onChange={(e) => onChange("freight_fuel_source", e.target.value)}
        >
          {FREIGHT_FUEL_SOURCES.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Weight" error={errors.freight_weight}>
        <input
          className={fieldClass(!!errors.freight_weight)}
          type="number"
          min="0"
          value={values.freight_weight}
          onChange={(e) => onChange("freight_weight", e.target.value)}
        />
      </Field>
      <Field label="Weight unit">
        <select
          className={fieldClass(false)}
          value={values.freight_weight_unit}
          onChange={(e) => onChange("freight_weight_unit", e.target.value)}
        >
          {FREIGHT_WEIGHT_UNITS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </Field>
    </Section>
  );
}