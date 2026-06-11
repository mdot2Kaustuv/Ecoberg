import React, { useState } from "react";
import axios from "axios";

const steps = [
  {
    id: "food",
    title: "Food & Diet",
    icon: "🌿",
    questions: [
      {
        key: "food_diet",
        label: "What best describes your diet?",
        tooltip: "Vegan: no animal products. Pure Vegetarian: traditional veg diet. Eggitarian: no meat/fish, eats eggs. Low meat: non-veg 1-2 times a week. Standard Non-Veg: regular poultry/fish/mutton. Heavy meat: meat with almost every meal.",
        type: "select",
        options: [
          { value: "vegan", label: "Vegan – no animal products at all" },
          { value: "pure_vegetarian", label: "Pure Vegetarian – traditional veg, no meat or eggs" },
          { value: "lacto_ovo_vegetarian", label: "Eggitarian / Lacto-Ovo Veg – eats eggs & dairy" },
          { value: "low_meat", label: "Low Non-Veg – meat/fish once or twice a week" },
          { value: "regional_non_veg", label: "Standard Non-Veg – regular chicken, fish, or mutton" },
          { value: "heavy_meat", label: "Heavy Non-Veg – meat at almost every meal" },
        ],
      },
      {
        key: "food_waste",
        label: "How much food gets wasted in your household?",
        tooltip: "Food waste decomposing generates localized emissions. 'Almost None' means careful planning. 'High' means frequent disposal of spoiled ingredients.",
        type: "select",
        options: [
          { value: "zero", label: "Almost None – I rarely throw food away" },
          { value: "low", label: "Low – occasional waste, mostly planned meals" },
          { value: "high", label: "High – I throw away food or leftovers regularly" },
        ],
      },
    ],
  },
  {
    id: "transport",
    title: "Transportation",
    icon: "🏍️",
    questions: [
      {
        key: "trans_commute",
        label: "What is your primary mode of commute?",
        tooltip: "Select your dominant transit choice. Two-Wheeler: motorcycles/scooters. Public Transit: buses/metros. Electric Car: battery vehicles.",
        type: "select",
        options: [
          { value: "two_wheeler", label: "Two-Wheeler – motorcycle or scooter" },
          { value: "public_transit", label: "Public Transit – metro, city bus, or train" },
          { value: "auto_rickshaw", label: "Auto-Rickshaw – CNG, diesel, or electric rickshaws" },
          { value: "gas_car", label: "Petrol or Diesel Car" },
          { value: "cng_hybrid_car", label: "CNG or Hybrid Car" },
          { value: "electric_car", label: "Electric Car (EV)" },
          { value: "active_travel", label: "Walk or Cycle – no engine" },
        ],
      },
      {
        key: "trans_distance_weekly",
        label: "Weekly commuting distance (in Kilometers)",
        tooltip: "Combine estimated weekly travels for work, college, and errands.",
        type: "number",
        placeholder: "e.g. 100",
      },
      {
        key: "trans_car_size",
        label: "If you drive a car, what size category is it?",
        tooltip: "Hatchback: compact city cars. Sedan: mid-sized passenger cars. SUV/Luxury: larger utility variants.",
        type: "select",
        options: [
          { value: "hatchback", label: "Hatchback – small city car (e.g. Swift, Alto)" },
          { value: "sedan", label: "Sedan – everyday mid-size car (e.g. Honda City)" },
          { value: "suv_luxury", label: "SUV / Luxury – large utility vehicle (e.g. Scorpio)" },
          { value: "none", label: "No Car – I do not use a car regularly" },
        ],
      },
      {
        key: "trans_flights_short",
        label: "Domestic or regional flights per year (under 3 hours)",
        tooltip: "Count each single one-way flight leg. A round trip equals 2 flights.",
        type: "number",
        placeholder: "e.g. 2",
      },
      {
        key: "trans_flights_long",
        label: "International flights per year (over 3 hours)",
        tooltip: "Count cross-continental flights. Each connection leg counts as 1 individual flight.",
        type: "number",
        placeholder: "e.g. 1",
      },
    ],
  },
  {
    id: "energy",
    title: "Home Energy",
    icon: "⚡",
    questions: [
      {
        key: "energy_size",
        label: "What type of housing do you live in?",
        tooltip: "Matches space sizes with common local building types.",
        type: "select",
        options: [
          { value: "room_shared", label: "Single Room or Shared Space" },
          { value: "apartment_small", label: "Small Apartment / Flat (1-2 BHK)" },
          { value: "apartment_medium", label: "Large Apartment / Flat (3+ BHK)" },
          { value: "independent_house", label: "Independent House / Bungalow" },
        ],
      },
      {
        key: "energy_ac",
        label: "How intensively do you use Air Conditioning (AC)?",
        tooltip: "AC draws heavily from regional grids. Seasonal: runs strictly during peak hot months. Heavy: multiple units running consistently.",
        type: "select",
        options: [
          { value: "none", label: "No AC – fans or air coolers only" },
          { value: "seasonal", label: "Seasonal – only turned on during heatwaves/peak summer" },
          { value: "heavy", label: "Heavy Usage – multiple units running frequently" },
        ],
      },
      {
        key: "energy_cooking",
        label: "What is your primary household cooking fuel?",
        tooltip: "LPG cylinders are the baseline. Electric induction cuts carbon footprints dramatically depending on grid cleanliness.",
        type: "select",
        options: [
          { value: "lpg", label: "LPG Cylinder – piped or bottled cooking gas" },
          { value: "induction_electric", label: "Electric Induction – modern electric cooktop" },
          { value: "biomass_wood", label: "Biomass / Wood – traditional cooking stoves" },
        ],
      },
    ],
  },
  {
    id: "shopping",
    title: "Shopping",
    icon: "🛍️",
    questions: [
      {
        key: "shopping_intensity",
        label: "How would you describe your consumer shopping habits?",
        tooltip: "Frugal: repair culture and absolute essentials. Moderate: predictable upgrades. Active: routine trend updates.",
        type: "select",
        options: [
          { value: "frugal", label: "Frugal – repair culture, buying mostly absolute essentials" },
          { value: "moderate", label: "Moderate – occasional new clothing or non-essential gear" },
          { value: "active", label: "Active Shopper – frequent purchases of trending items" },
        ],
      },
    ],
  },
];

const friendlyRecommendations = {
  rec_food_diet: {
    what: "Incorporate more plant-based days into your week.",
    why: "Traditional regional vegetarian alternatives like lentils and pulses carry highly optimized carbon footprints compared to farmed poultry or mutton production.",
    how: "Swap a few non-veg dinners for classic protein-rich meals like dal-bhat, paneer curry, or chickpea alternatives.",
  },
  rec_trans_public: {
    what: "Shift long commutes towards Metros or public transit links.",
    why: "Using localized mass rail or urban bus lines keeps you out of heavy gridlock traffic, preventing extensive vehicle emissions from idling engine hours.",
    how: "Use the local metro networks or rapid bus lanes for fixed daily office routes rather than reliance on individual car paths.",
  },
  rec_energy_ac: {
    what: "Keep air conditioners adjusted to a stable 24°C base.",
    why: "Every degree you step up from 18°C up to 24°C protects grid storage and curtails baseline home appliance energy pull by up to 24%.",
    how: "Set an automatic shutdown timer at night or default your air condition unit straight to Eco / 24°C mode.",
  },
  rec_energy_cooking: {
    what: "Transition cooking setups over to Electric Induction cooktops.",
    why: "Using electric induction heating avoids direct fossil resource burn from fossil LPG cylinder dependencies.",
    how: "Introduce a portable single-burner induction plate alongside your regular gas line to manage daily boiling and standard tasks cleanly.",
  },
};

export default function Quiz() {
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalSteps = steps.length;
  const step = steps[currentStep];

  const handleChange = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const isStepComplete = () => {
    return step.questions.every((q) => {
      const val = answers[q.key];
      return val !== undefined && val !== "";
    });
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/calculate/",
        { inputs: answers }
      );
      setResult(response.data);
    } catch (err) {
      setError("Something went wrong. Make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setResult(null);
    setCurrentStep(0);
    setError(null);
  };

  const getScoreColorClasses = (score) => {
    if (score >= 75) return "border-emerald-500 text-emerald-700";
    if (score >= 50) return "border-teal-500 text-teal-700";
    if (score >= 30) return "border-amber-500 text-amber-700";
    return "border-red-500 text-red-700";
  };

  const getScoreLabel = (score) => {
    if (score >= 75) return "Excellent";
    if (score >= 50) return "Good";
    if (score >= 30) return "Average";
    return "Needs Work";
  };

  const getBarColorClass = (key) => {
    const maps = {
      food: "bg-teal-400",
      transport: "bg-blue-400",
      energy: "bg-amber-400",
      shopping: "bg-pink-400",
    };
    return maps[key] || "bg-gray-400";
  };

  const getImpactColorClass = (impact) => {
    if (impact === "High") return "bg-red-100 text-red-800";
    if (impact === "Medium") return "bg-orange-100 text-orange-800";
    return "bg-teal-100 text-teal-800";
  };

  if (result) {
    const scoreLabel = getScoreLabel(result.sustainability_score);
    const scoreColorClass = getScoreColorClasses(result.sustainability_score);
    const maxFootprint = 6;

    return (
      <div className="w-full max-w-2xl mx-auto my-12 px-4 text-gray-800 font-sans">
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-md">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Your Carbon Footprint</h1>
            <p className="text-gray-500 text-sm">Here's how your lifestyle measures up</p>
          </div>

          <div className="flex flex-col items-center gap-4 mb-10 p-6 bg-gray-50 rounded-xl">
            <div className={`w-36 h-36 rounded-full flex flex-col items-center justify-center bg-white border-8 ${scoreColorClass}`}>
              <span className="text-4xl font-extrabold">{result.sustainability_score}</span>
              <span className="text-xs text-gray-400 mt-1">/100</span>
              <span className="text-xs font-bold uppercase mt-1 tracking-wider">{scoreLabel}</span>
            </div>
            <div className="text-center">
              <span className="text-3xl font-black text-gray-800">{result.total_footprint}</span>
              <span className="text-base text-gray-500"> tonnes CO₂/year</span>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Breakdown</h2>
            {Object.entries(result.breakdown).map(([key, value]) => {
              const pct = Math.min((value / maxFootprint) * 100, 100);
              return (
                <div key={key} className="flex items-center gap-4 mb-4">
                  <span className="w-24 text-sm font-medium text-gray-600 capitalize">{key}</span>
                  <div className="flex-1 h-3.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getBarColorClass(key)}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-sm font-semibold text-gray-800">{value}t</span>
                </div>
              );
            })}
          </div>

          {result.recommendations && result.recommendations.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Top Recommendations</h2>
              {result.recommendations.map((rec) => {
                const friendly = friendlyRecommendations[rec.id];
                return (
                  <div key={rec.id} className="bg-gray-50 rounded-xl p-6 mb-4 border-l-4 border-gray-300">
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <span className="font-semibold text-gray-900 text-base">
                        {friendly ? friendly.what : rec.title}
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shrink-0 ${getImpactColorClass(rec.impact)}`}>
                        {rec.impact} Impact
                      </span>
                    </div>
                    {friendly ? (
                      <>
                        <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                          <strong className="text-gray-700">Why it matters: </strong>{friendly.why}
                        </p>
                        <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                          <strong className="text-gray-700">How to do it: </strong>{friendly.how}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-600 mb-2 leading-relaxed">{rec.description}</p>
                    )}
                    <span className="inline-block mt-1 text-sm font-semibold text-emerald-700">
                      💚 Could save ~{rec.estimatedReduction}t CO₂/year
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <button
            onClick={handleReset}
            className="w-full mt-6 py-3.5 px-6 rounded-xl text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow transition duration-150"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto my-12 px-4 text-gray-800 font-sans">
      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-md">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Carbon Footprint Calculator</h1>
          <p className="text-gray-500 text-sm">
            Step {currentStep + 1} of {totalSteps}
          </p>
        </div>

        {/* Progress bar line setup */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-emerald-600 transition-all duration-300 ease-out"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step Tab Links row alignment */}
        <div className="flex justify-between items-center gap-2 mb-10 border-b border-gray-100 pb-4">
          {steps.map((s, i) => {
            let activeStyle = "text-gray-400";
            if (i === currentStep) activeStyle = "text-emerald-700 font-semibold bg-emerald-50";
            else if (i < currentStep) activeStyle = "text-emerald-600 font-medium";

            return (
              <div key={s.id} className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition ${activeStyle}`}>
                <span>{s.icon}</span>
                <span className="hidden sm:inline">{s.title}</span>
              </div>
            );
          })}
        </div>

        {/* Dynamic Interactive questions layout block */}
        <div className="mb-10">
          {step.questions.map((q) => (
            <div key={q.key} className="mb-8 last:mb-0">
              <div className="flex items-center gap-2 mb-3">
                <label className="font-semibold text-base text-gray-800">{q.label}</label>
                {q.tooltip && (
                  <div className="relative inline-flex group">
                    <span
                      className="cursor-pointer text-gray-400 text-xs bg-gray-100 w-5 h-5 inline-flex items-center justify-center rounded-full font-bold select-none hover:bg-gray-200"
                      onMouseEnter={() => setActiveTooltip(q.key)}
                      onMouseLeave={() => setActiveTooltip(null)}
                    >
                      ℹ
                    </span>
                    {activeTooltip === q.key && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white p-3 rounded-lg text-xs leading-relaxed w-64 z-50 shadow-lg">
                        {q.tooltip}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {q.type === "select" ? (
                <div className="relative">
                  <select
                    className={`w-full p-3.5 border border-gray-300 rounded-xl text-base bg-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition appearance-none ${
                      answers[q.key] ? "text-gray-900" : "text-gray-400"
                    }`}
                    value={answers[q.key] || ""}
                    onChange={(e) => handleChange(q.key, e.target.value)}
                  >
                    <option value="" disabled>Select an option</option>
                    {q.options?.map((opt) => (
                      <option key={opt.value} value={opt.value} className="text-gray-800">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                    ▼
                  </div>
                </div>
              ) : (
                <input
                  type="number"
                  min="0"
                  className="w-full p-3.5 border border-gray-300 rounded-xl text-base focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                  placeholder={q.placeholder}
                  value={answers[q.key] || ""}
                  onChange={(e) => handleChange(q.key, Number(e.target.value))}
                />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="p-4 mb-6 border border-red-200 bg-red-50 rounded-xl text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Footer actions row alignment */}
        <div className="flex justify-between items-center gap-4 pt-6 border-t border-gray-100">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`py-3 px-6 rounded-xl text-base font-semibold transition ${
              currentStep === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                : "bg-gray-100 hover:bg-gray-200 text-gray-600"
            }`}
          >
            ← Back
          </button>

          {currentStep < totalSteps - 1 ? (
            <button
              onClick={handleNext}
              disabled={!isStepComplete()}
              className={`py-3 px-6 rounded-xl text-base font-semibold text-white transition ${
                !isStepComplete()
                  ? "bg-emerald-600/50 cursor-not-allowed opacity-50"
                  : "bg-emerald-600 hover:bg-emerald-700 shadow"
              }`}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isStepComplete() || loading}
              className={`py-3 px-6 rounded-xl text-base font-semibold text-white transition ${
                !isStepComplete() || loading
                  ? "bg-emerald-600/50 cursor-not-allowed opacity-50"
                  : "bg-emerald-600 hover:bg-emerald-700 shadow"
              }`}
            >
              {loading ? "Calculating..." : "Calculate 🌍"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}