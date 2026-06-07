import React, { useState } from "react";
import axios from "axios";
import 
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

  const getScoreLabel = (score) => {
    if (score >= 75) return { label: "Excellent", className: styles.scoreExcellent };
    if (score >= 50) return { label: "Good", className: styles.scoreGood };
    if (score >= 30) return { label: "Average", className: styles.scoreAverage };
    return { label: "Needs Work", className: styles.scoreBad };
  };

  if (result) {
    const scoreInfo = getScoreLabel(result.sustainability_score);
    const maxFootprint = 6; 

    return (
      <div className={styles.quizContainer}>
        <div className={styles.resultCard}>
          <div className={styles.resultHeader}>
            <h1 className={styles.resultTitle}>Your Carbon Footprint</h1>
            <p className={styles.resultSubtitle}>Here's how your lifestyle measures up</p>
          </div>

          <div className={styles.scoreSection}>
            <div className={`${styles.scoreCircle} ${scoreInfo.className}`}>
              <span className={styles.scoreNumber}>{result.sustainability_score}</span>
              <span className={styles.scoreMax}>/100</span>
              <span className={styles.scoreLabelText}>{scoreInfo.label}</span>
            </div>
            <div className={styles.totalFootprint}>
              <span className={styles.footprintNumber}>{result.total_footprint}</span>
              <span className={styles.footprintUnit}> tonnes CO₂/year</span>
            </div>
          </div>

          <div className={styles.breakdownSection}>
            <h2 className={styles.sectionTitle}>Breakdown</h2>
            {Object.entries(result.breakdown).map(([key, value]) => {
              const pct = Math.min((value / maxFootprint) * 100, 100);
              const catClass = styles[`barFill_${key}`] || "";
              
              return (
                <div key={key} className={styles.barRow}>
                  <span className={styles.barLabel}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                  <div className={styles.barTrack}>
                    <div
                      className={`${styles.barFill} ${catClass}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className={styles.barValue}>{value}t</span>
                </div>
              );
            })}
          </div>

          {result.recommendations && result.recommendations.length > 0 && (
            <div className={styles.recsSection}>
              <h2 className={styles.sectionTitle}>Top Recommendations</h2>
              {result.recommendations.map((rec) => {
                const friendly = friendlyRecommendations[rec.id];
                const impactClass = styles[`impact${rec.impact}`];

                return (
                  <div key={rec.id} className={styles.recCard}>
                    <div className={styles.recTop}>
                      <span className={styles.recTitle}>
                        {friendly ? friendly.what : rec.title}
                      </span>
                      <span className={`${styles.recImpact} ${impactClass}`}>
                        {rec.impact} Impact
                      </span>
                    </div>
                    {friendly ? (
                      <>
                        <p className={styles.recWhy}>
                          <strong className={styles.boldLabel}>Why it matters: </strong>
                          {friendly.why}
                        </p>
                        <p className={styles.recHow}>
                          <strong className={styles.boldLabel}>How to do it: </strong>
                          {friendly.how}
                        </p>
                      </>
                    ) : (
                      <p className={styles.recDesc}>{rec.description}</p>
                    )}
                    <span className={styles.recReduction}>
                      💚 Could save ~{rec.estimatedReduction}t CO₂/year
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <button onClick={handleReset} className={styles.submitBtn} style={{ width: "100%" }}>
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.quizContainer}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.mainTitle}>Carbon Footprint Calculator</h1>
          <p className={styles.subtitle}>
            Step {currentStep + 1} of {totalSteps}
          </p>
        </div>

        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>

        <div className={styles.stepTabs}>
          {steps.map((s, i) => {
            let tabStatusClass = "";
            if (i === currentStep) tabStatusClass = styles.stepTabActive;
            else if (i < currentStep) tabStatusClass = styles.stepTabDone;

            return (
              <div key={s.id} className={`${styles.stepTab} ${tabStatusClass}`}>
                <span>{s.icon}</span>
                <span className={styles.stepTabLabel}>{s.title}</span>
              </div>
            );
          })}
        </div>

        <div className={styles.questionsBlock}>
          <h2 className={styles.stepTitle}>
            {step.icon} {step.title}
          </h2>
          {step.questions.map((q) => (
            <div key={q.key} className={styles.questionRow}>
              <div className={styles.labelRow}>
                <label className={styles.questionLabel}>{q.label}</label>
                {q.tooltip && (
                  <div className={styles.tooltipWrapper}>
                    <span
                      className={styles.infoIcon}
                      onMouseEnter={() => setActiveTooltip(q.key)}
                      onMouseLeave={() => setActiveTooltip(null)}
                    >
                      ℹ
                    </span>
                    {activeTooltip === q.key && (
                      <div className={styles.tooltipBox}>{q.tooltip}</div>
                    )}
                  </div>
                )}
              </div>
              {q.type === "select" ? (
                <div className={styles.selectWrapper}>
                  <select
                    className={`${styles.select} ${answers[q.key] ? "" : styles.selectPlaceholder}`}
                    value={answers[q.key] || ""}
                    onChange={(e) => handleChange(q.key, e.target.value)}
                  >
                    <option value="" disabled>Select an option</option>
                    {q.options?.map((opt) => (
                      <option key={opt.value} value={opt.value} className={styles.optionItem}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <input
                  type="number"
                  min="0"
                  className={styles.input}
                  placeholder={q.placeholder}
                  value={answers[q.key] || ""}
                  onChange={(e) => handleChange(q.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.navRow}>
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`${styles.navBtn} ${styles.backBtn} ${currentStep === 0 ? styles.disabledBtn : ""}`}
          >
            ← Back
          </button>

          {currentStep < totalSteps - 1 ? (
            <button
              onClick={handleNext}
              disabled={!isStepComplete()}
              className={`${styles.navBtn} ${styles.nextBtn} ${!isStepComplete() ? styles.disabledBtn : ""}`}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isStepComplete() || loading}
              className={`${styles.navBtn} ${styles.submitBtn} ${(!isStepComplete() || loading) ? styles.disabledBtn : ""}`}
            >
              {loading ? "Calculating..." : "Calculate 🌍"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}