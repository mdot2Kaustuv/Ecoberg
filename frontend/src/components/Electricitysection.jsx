import React from "react";
import { Section, Field, fieldClass } from "./FormPrimitives";
import CountrySelect from "./CountrySelect";

export const ELECTRICITY_UNITS = ["kwh", "mwh", "wh"];
export const CLOUD_PROVIDERS = [
  { value: "", label: "Not cloud-hosted" },
  { value: "aws", label: "AWS" },
  { value: "gcp", label: "Google Cloud" },
  { value: "azure", label: "Azure" },
];

const US_STATE_RE = /^[A-Z]{2}$/;
const COUNTRY_CODE_RE = /^[A-Z]{2}$/;

export const electricityDefaults = {
  electricity_kwh: "",
  electricity_unit: "kwh",
  electricity_country_code: "NP",
  electricity_state: "",
  electricity_cloud_provider: "",
  electricity_cloud_region: "",
  electricity_include_wtt: true,
  electricity_include_td_losses: false,
};

function isPositiveNumber(v) {
  return v !== "" && !Number.isNaN(Number(v)) && Number(v) > 0;
}

export function validateElectricity(values) {
  const errors = {};
  if (!isPositiveNumber(values.electricity_kwh))
    errors.electricity_kwh = "Enter usage greater than 0";
  if (!COUNTRY_CODE_RE.test(values.electricity_country_code))
    errors.electricity_country_code = "Select a country";
  if (values.electricity_state && !US_STATE_RE.test(values.electricity_state))
    errors.electricity_state = "2-letter US state code (e.g. CA)";
  if (values.electricity_cloud_provider && !values.electricity_cloud_region)
    errors.electricity_cloud_region = "Required when a cloud provider is selected";
  return errors;
}

export default function ElectricitySection({ values, errors, onChange }) {
  return (
    <Section eyebrow="Scope 2 · Energy" title="Electricity">
      <Field label="Usage" error={errors.electricity_kwh}>
        <input
          className={fieldClass(!!errors.electricity_kwh)}
          type="number"
          min="0"
          value={values.electricity_kwh}
          onChange={(e) => onChange("electricity_kwh", e.target.value)}
        />
      </Field>
      <Field label="Unit">
        <select
          className={fieldClass(false)}
          value={values.electricity_unit}
          onChange={(e) => onChange("electricity_unit", e.target.value)}
        >
          {ELECTRICITY_UNITS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Country" error={errors.electricity_country_code}>
        <CountrySelect
          value={values.electricity_country_code}
          error={errors.electricity_country_code}
          onChange={(v) => onChange("electricity_country_code", v)}
        />
      </Field>
      <Field label="US state (optional)" error={errors.electricity_state}>
        <input
          className={fieldClass(!!errors.electricity_state)}
          maxLength={2}
          placeholder="e.g. CA"
          value={values.electricity_state}
          onChange={(e) => onChange("electricity_state", e.target.value.toUpperCase())}
        />
      </Field>
      <Field label="Cloud provider">
        <select
          className={fieldClass(false)}
          value={values.electricity_cloud_provider}
          onChange={(e) => onChange("electricity_cloud_provider", e.target.value)}
        >
          {CLOUD_PROVIDERS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </Field>
      {values.electricity_cloud_provider && (
        <Field label="Cloud region" error={errors.electricity_cloud_region}>
          <input
            className={fieldClass(!!errors.electricity_cloud_region)}
            placeholder="e.g. eu-west-1"
            value={values.electricity_cloud_region}
            onChange={(e) => onChange("electricity_cloud_region", e.target.value)}
          />
        </Field>
      )}
      <Field label="Well-to-Tank" span2>
        <label className="flex items-center gap-2 text-sm text-slate-600 py-1">
          <input
            type="checkbox"
            className="w-4 h-4 accent-emerald-700"
            checked={values.electricity_include_wtt}
            onChange={(e) => onChange("electricity_include_wtt", e.target.checked)}
          />
          Include upstream (Well-to-Tank) emissions
        </label>
      </Field>
      <Field label="Transmission losses" span2>
        <label className="flex items-center gap-2 text-sm text-slate-600 py-1">
          <input
            type="checkbox"
            className="w-4 h-4 accent-emerald-700"
            checked={values.electricity_include_td_losses}
            onChange={(e) => onChange("electricity_include_td_losses", e.target.checked)}
          />
          Include transmission & distribution losses
        </label>
      </Field>
    </Section>
  );
}