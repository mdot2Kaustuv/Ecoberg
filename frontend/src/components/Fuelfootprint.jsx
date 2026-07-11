import React, { useMemo, useState } from "react";
const API_BASE = "/companys/fuel-footprint";

const FUEL_CATALOGUE = {
  gaseous: {
    label: "Gaseous",
    fuels: [
      { value: "natural_gas", label: "Natural Gas", units: ["kwh", "therm", "m3"], defaultUnit: "kwh" },
      { value: "lpg", label: "LPG", units: ["kwh", "litre", "kg"], defaultUnit: "litre" },
      { value: "cng", label: "CNG", units: ["kwh", "kg"], defaultUnit: "kg" },
      { value: "biogas", label: "Biogas / Biomethane", units: ["kwh"], defaultUnit: "kwh" },
    ],
  },
  liquid: {
    label: "Liquid",
    fuels: [
      { value: "diesel", label: "Diesel (Gas Oil)", units: ["kwh", "litre"], defaultUnit: "litre" },
      { value: "petrol", label: "Petrol (Gasoline)", units: ["kwh", "litre"], defaultUnit: "litre" },
      { value: "kerosene", label: "Burning Oil / Kerosene", units: ["kwh", "litre"], defaultUnit: "litre" },
      { value: "fuel_oil", label: "Fuel Oil (Heavy)", units: ["kwh", "litre"], defaultUnit: "litre" },
      { value: "red_diesel", label: "Gas Oil (Red Diesel)", units: ["kwh", "litre"], defaultUnit: "litre" },
    ],
  },
  biofuel: {
    label: "Biofuel",
    fuels: [
      { value: "biodiesel", label: "Biodiesel (B100 / FAME)", units: ["litre"], defaultUnit: "litre" },
      { value: "hvo", label: "HVO", units: ["litre"], defaultUnit: "litre" },
      { value: "bioethanol", label: "Bioethanol", units: ["litre"], defaultUnit: "litre" },
      { value: "wood_logs", label: "Wood Logs", units: ["kwh", "kg"], defaultUnit: "kg" },
      { value: "wood_pellets", label: "Wood Pellets", units: ["kwh", "kg"], defaultUnit: "kg" },
    ],
  },
  solid: {
    label: "Solid",
    fuels: [
      { value: "coal_industrial", label: "Coal (Industrial)", units: ["kwh", "kg"], defaultUnit: "kg" },
      { value: "coal_domestic", label: "Coal (Domestic)", units: ["kwh", "kg"], defaultUnit: "kg" },
    ],
  },
};

const CATEGORY_ORDER = ["gaseous", "liquid", "biofuel", "solid"];

function extractErrorMessage(body) {
  return (
    body?.error?.error?.message ||
    body?.error?.message ||
    (typeof body?.error === "string" ? body.error : null) ||
    "Couldn't calculate emissions for that input. Check the amount and try again."
  );
}

export default function FuelFootprintCalculator() {
  const [category, setCategory] = useState("gaseous");
  const [fuelType, setFuelType] = useState(FUEL_CATALOGUE.gaseous.fuels[0].value);
  const [unit, setUnit] = useState(FUEL_CATALOGUE.gaseous.fuels[0].defaultUnit);
  const [amount, setAmount] = useState("");
  const [includeWtt, setIncludeWtt] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const fuelsInCategory = FUEL_CATALOGUE[category].fuels;
  const selectedFuel = useMemo(
    () => fuelsInCategory.find((f) => f.value === fuelType) || fuelsInCategory[0],
    [fuelsInCategory, fuelType]
  );

  function handleCategoryChange(nextCategory) {
    const firstFuel = FUEL_CATALOGUE[nextCategory].fuels[0];
    setCategory(nextCategory);
    setFuelType(firstFuel.value);
    setUnit(firstFuel.defaultUnit);
    setResult(null);
    setError(null);
  }

  function handleFuelChange(value) {
    const fuel = fuelsInCategory.find((f) => f.value === value);
    setFuelType(value);
    setUnit(fuel.defaultUnit);
    setResult(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const params = new URLSearchParams({
      fuel_type: fuelType,
      amount,
      unit,
      include_wtt: String(includeWtt),
    });

    try {
      const res = await fetch(`${API_BASE}?${params.toString()}`, {
        method: "GET",
        credentials: "include",
      });
      const body = await res.json();

      if (!res.ok) {
        setError(extractErrorMessage(body));
        return;
      }

      const attributes = body?.data?.data?.attributes;
      if (!attributes) {
        setError("Received an unexpected response shape from the server.");
        return;
      }
      setResult(attributes);
    } catch (err) {
      setError("Couldn't reach the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center px-4 py-8 bg-[#F8FAF9]">
      <div className="w-full max-w-md bg-white border border-emerald-900/10 rounded-2xl shadow-sm p-7">
        {/* Header */}
        <div className="mb-6">
          <span className="font-mono text-[11px] tracking-wide uppercase text-amber-600 font-medium">
            Scope 1 · Stationary combustion
          </span>
          <h2 className="font-display font-semibold text-2xl text-emerald-950 mt-1">Fuel footprint</h2>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            Calculate CO2e from fuel burned on-site — boilers, generators, heating.
          </p>
        </div>

        {/* Category tabs */}
        <div
          role="tablist"
          aria-label="Fuel category"
          className="flex gap-1 bg-[#F8FAF9] border border-emerald-900/10 rounded-xl p-1 mb-5"
        >
          {CATEGORY_ORDER.map((key) => {
            const active = category === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => handleCategoryChange(key)}
                className={`flex-1 text-xs font-semibold rounded-lg py-2 px-1 transition-colors ${
                  active
                    ? "bg-emerald-900 text-white"
                    : "text-slate-500 hover:text-emerald-900"
                }`}
              >
                {FUEL_CATALOGUE[key].label}
              </button>
            );
          })}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="ffc-fuel" className="text-xs font-medium text-slate-500">
              Fuel type
            </label>
            <select
              id="ffc-fuel"
              value={fuelType}
              onChange={(e) => handleFuelChange(e.target.value)}
              className="font-mono text-sm bg-[#F8FAF9] border border-emerald-900/15 rounded-lg px-3 py-2.5 text-slate-800 outline-none focus:border-emerald-600 transition-colors"
            >
              {fuelsInCategory.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col gap-1.5 flex-1">
              <label htmlFor="ffc-amount" className="text-xs font-medium text-slate-500">
                Amount
              </label>
              <input
                id="ffc-amount"
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="font-mono text-sm bg-[#F8FAF9] border border-emerald-900/15 rounded-lg px-3 py-2.5 text-slate-800 outline-none focus:border-emerald-600 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5 w-28">
              <label htmlFor="ffc-unit" className="text-xs font-medium text-slate-500">
                Unit
              </label>
              <select
                id="ffc-unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="font-mono text-sm bg-[#F8FAF9] border border-emerald-900/15 rounded-lg px-3 py-2.5 text-slate-800 outline-none focus:border-emerald-600 transition-colors"
              >
                {selectedFuel.units.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeWtt}
              onChange={(e) => setIncludeWtt(e.target.checked)}
              className="w-4 h-4 accent-emerald-700"
            />
            Include Well-to-Tank (upstream) emissions
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-1 bg-emerald-900 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-default text-white font-semibold text-sm rounded-lg py-3 transition-colors active:translate-y-px"
          >
            {loading ? "Calculating…" : "Calculate emissions"}
          </button>
        </form>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2.5">
            {error}
          </div>
        )}

        {result && <ResultPanel result={result} />}
      </div>
    </div>
  );
}

function ResultPanel({ result }) {
  const { emissions, fuel, notices } = result;
  const b = emissions.breakdown || {};
  const scopes = emissions.ghg_protocol_scopes || {};

  const co2 = Math.max(b.direct_co2 || 0, 0);
  const ch4 = Math.max(b.direct_ch4 || 0, 0);
  const n2o = Math.max(b.direct_n2o || 0, 0);
  const gasTotal = co2 + ch4 + n2o || 1;

  const isBiofuel = fuel?.is_biofuel;
  const biogenicNotice = (notices || []).some((n) =>
    typeof n === "string" ? n.includes("biogenic") : n?.code === "biofuel_biogenic_carbon"
  );

  return (
    <div className="mt-6 pt-5 border-t border-emerald-900/10 animate-[fadeIn_0.25s_ease]">
      {/* Total */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className="font-mono font-semibold text-4xl text-amber-600">
          {emissions.co2e?.toLocaleString(undefined, { maximumFractionDigits: 1 })}
        </span>
        <span className="text-sm text-slate-500">kg CO2e</span>
      </div>

      {/* Gas composition bar — the real breakdown of what makes up the total */}
      <div>
        <div className="flex w-full h-2.5 rounded-full overflow-hidden bg-[#F8FAF9] border border-emerald-900/10">
          <div className="h-full bg-amber-500" style={{ width: `${(co2 / gasTotal) * 100}%` }} />
          <div className="h-full bg-emerald-700" style={{ width: `${(ch4 / gasTotal) * 100}%` }} />
          <div className="h-full bg-yellow-400" style={{ width: `${(n2o / gasTotal) * 100}%` }} />
        </div>
        <div className="flex gap-4 mt-2 font-mono text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <i className="inline-block w-2 h-2 rounded-full bg-amber-500" /> CO2 {co2.toFixed(1)}kg
          </span>
          <span className="flex items-center gap-1.5">
            <i className="inline-block w-2 h-2 rounded-full bg-emerald-700" /> CH4 {ch4.toFixed(1)}kg
          </span>
          <span className="flex items-center gap-1.5">
            <i className="inline-block w-2 h-2 rounded-full bg-yellow-400" /> N2O {n2o.toFixed(1)}kg
          </span>
        </div>
      </div>

      {/* Scope breakdown */}
      <div className="flex gap-2.5 mt-4">
        {"scope_1" in scopes && (
          <div className="flex-1 flex flex-col gap-1 bg-[#F8FAF9] border border-emerald-900/10 rounded-lg px-3 py-2.5">
            <span className="text-[11px] text-slate-500">Scope 1 (direct)</span>
            <span className="font-mono font-semibold text-sm text-emerald-950">
              {scopes.scope_1?.toFixed(1)} kg
            </span>
          </div>
        )}
        {"scope_3_category_3" in scopes && (
          <div className="flex-1 flex flex-col gap-1 bg-[#F8FAF9] border border-emerald-900/10 rounded-lg px-3 py-2.5">
            <span className="text-[11px] text-slate-500">Scope 3.3 (WTT)</span>
            <span className="font-mono font-semibold text-sm text-emerald-950">
              {scopes.scope_3_category_3?.toFixed(1)} kg
            </span>
          </div>
        )}
      </div>

      {isBiofuel && biogenicNotice && (
        <p className="mt-3.5 text-xs leading-relaxed text-slate-500 bg-emerald-50 border-l-2 border-emerald-700 rounded px-3 py-2">
          This fuel's direct CO2 is biogenic carbon, so it's excluded from the Scope 1 total per GHG Protocol
          guidance — the figure above reflects CH4 and N2O only, plus any upstream WTT emissions.
        </p>
      )}
    </div>
  );
}