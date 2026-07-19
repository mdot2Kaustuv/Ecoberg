import React from "react";

import { Section, Field, fieldClass } from "./FormPrimitives";

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
    errors.hotel_country_code = "2-letter country code (e.g. NP)";
  if (!isIntInRange(values.hotel_nights, 1, 365))
    errors.hotel_nights = "Whole number between 1 and 365";
  if (!isIntInRange(values.hotel_rooms, 1, 100))
    errors.hotel_rooms = "Whole number between 1 and 100";
  return errors;
}

export default function HotelSection({ values, errors, onChange }) {
  return (
    <Section eyebrow="Scope 3 · Accommodation" title="Hotel">
      <Field label="Country code" error={errors.hotel_country_code}>
        <input
          className={fieldClass(!!errors.hotel_country_code)}
          maxLength={2}
          value={values.hotel_country_code}
          onChange={(e) => onChange("hotel_country_code", e.target.value.toUpperCase())}
        />
      </Field>
      <Field label="Nights (1–365)" error={errors.hotel_nights}>
        <input
          className={fieldClass(!!errors.hotel_nights)}
          type="number"
          min="1"
          max="365"
          value={values.hotel_nights}
          onChange={(e) => onChange("hotel_nights", e.target.value)}
        />
      </Field>
      <Field label="Rooms (1–100)" span2 error={errors.hotel_rooms}>
        <input
          className={fieldClass(!!errors.hotel_rooms)}
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