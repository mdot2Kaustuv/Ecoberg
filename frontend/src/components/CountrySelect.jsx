import React from "react";
import { COUNTRIES } from "./countries";
import { fieldClass } from "./FormPrimitives";

export default function CountrySelect({ value, onChange, error, placeholder = "Select country" }) {
  return (
    <select
      className={fieldClass(!!error)}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {COUNTRIES.map((c) => (
        <option key={c.code} value={c.code}>
          {c.name}
        </option>
      ))}
    </select>
  );
}