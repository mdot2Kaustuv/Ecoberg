import React from "react";
import { Section, Field } from "./FormPrimitives";
import CountrySelect from "./CountrySelect";

const COUNTRY_CODE_RE = /^[A-Z]{2}$/;

export const hotelDefaults = {
  hotel_country_code: "NP",
  hotel_nights: "",
  hotel_rooms: 1,
};

function isIntInRange(v, min, max) {
  const n = Number(v);
  return v !== "" && Number.isInteger(n) && n >= min && n <= max;
}

export function validateHotel(values) {
  const errors = {};
  if (!COUNTRY_CODE_RE.test(values.hotel_country_code))
    errors.hotel_country_code = "Select a country";
  if (!isIntInRange(values.hotel_nights, 1, 365))
    errors.hotel_nights = "Whole number between 1 and 365";
  if (!isIntInRange(values.hotel_rooms, 1, 100))
    errors.hotel_rooms = "Whole number between 1 and 100";
  return errors;
}

export default function HotelSection({ values, errors, onChange }) {
  return (
    <Section eyebrow="Scope 3 · Accommodation" title="Hotel">
      <Field label="Country" error={errors.hotel_country_code}>
        <CountrySelect
          value={values.hotel_country_code}
          error={errors.hotel_country_code}
          onChange={(v) => onChange("hotel_country_code", v)}
        />
      </Field>
      <Field label="Nights (1–365)" error={errors.hotel_nights}>
        <input
          className="w-full rounded-md border px-3 py-2 text-sm"
          type="number"
          min="1"
          max="365"
          value={values.hotel_nights}
          onChange={(e) => onChange("hotel_nights", e.target.value)}
        />
      </Field>
      <Field label="Rooms (1–100)" span2 error={errors.hotel_rooms}>
        <input
          className="w-full rounded-md border px-3 py-2 text-sm"
          type="number"
          min="1"
          max="100"
          value={values.hotel_rooms}
          onChange={(e) => onChange("hotel_rooms", e.target.value)}
        />
      </Field>
    </Section>
  );
}