import { useState } from "react";
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
        tooltip: "Vegan eats no animal products, Vegetarian avoids meat, Pescatarian eats fish but no meat, Heavy meat eats meat daily.",
        type: "select",
        options: [
          { value: "vegan", label: "Vegan" },
          { value: "vegetarian", label: "Vegetarian" },
          { value: "pescatarian", label: "Pescatarian" },
          { value: "low_meat", label: "Low Meat" },
          { value: "standard_meat", label: "Standard Meat" },
          { value: "heavy_meat", label: "Heavy Meat" },
        ],
      },
      {
        key: "food_local",
        label: "How often do you buy locally sourced food?",
        tooltip: "Locally sourced means food grown or produced within your region, reducing transport emissions.",
        type: "select",
        options: [
          { value: "always", label: "Always" },
          { value: "often", label: "Often" },
          { value: "occasionally", label: "Occasionally" },
          { value: "rarely", label: "Rarely" },
        ],
      },
      {
        key: "food_waste",
        label: "How much food do you waste?",
        tooltip: "Food waste refers to edible food thrown away. Zero means you waste almost nothing, High means you throw away a significant amount regularly.",
        type: "select",
        options: [
          { value: "zero", label: "Almost None" },
          { value: "low", label: "Low" },
          { value: "medium", label: "Medium" },
          { value: "high", label: "High" },
        ],
      },
    ],
  },
  {
    id: "transport",
    title: "Transportation",
    icon: "🚗",
    questions: [
      {
        key: "trans_commute",
        label: "What is your primary mode of commute?",
        tooltip: "Choose the transport you use most days. Gas car uses petrol/diesel, Electric car runs on electricity, Active travel means walking or cycling.",
        type: "select",
        options: [
          { value: "gas_car", label: "Gas Car" },
          { value: "hybrid_car", label: "Hybrid Car" },
          { value: "electric_car", label: "Electric Car" },
          { value: "public_transit", label: "Public Transit" },
          { value: "active_travel", label: "Walk / Cycle" },
        ],
      },
      {
        key: "trans_mileage",
        label: "Weekly driving distance (miles)",
        tooltip: "Estimate the total miles you drive per week including commute, errands, and trips. If you don't drive, enter 0.",
        type: "number",
        placeholder: "e.g. 100",
      },
      {
        key: "trans_car_size",
        label: "What size is your car?",
        tooltip: "Compact cars are small hatchbacks, Sedan is a standard mid-size car, SUV/Truck are larger heavier vehicles. Select 'No Car' if you don't own one.",
        type: "select",
        options: [
          { value: "compact", label: "Compact" },
          { value: "sedan", label: "Sedan" },
          { value: "suv_truck", label: "SUV / Truck" },
          { value: "none", label: "No Car" },
        ],
      },
      {
        key: "trans_flights_short",
        label: "Short-haul flights per year (under 3 hrs)",
        tooltip: "Count each one-way flight separately. A return trip counts as 2 flights. Short-haul is typically within the same country or nearby region.",
        type: "number",
        placeholder: "e.g. 2",
      },
      {
        key: "trans_flights_long",
        label: "Long-haul flights per year (over 3 hrs)",
        tooltip: "Long-haul flights are international or cross-continental trips. Each one-way leg counts as 1 flight. These have a much higher carbon impact.",
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
        label: "What type of home do you live in?",
        tooltip: "Larger homes use more energy for heating, cooling and lighting. A studio is a single room, an apartment is a flat, a house is a standalone property.",
        type: "select",
        options: [
          { value: "studio", label: "Studio" },
          { value: "apartment", label: "Apartment" },
          { value: "townhouse", label: "Townhouse" },
          { value: "house_medium", label: "Medium House" },
          { value: "house_large", label: "Large House" },
        ],
      },
      {
        key: "energy_renewables",
        label: "What energy source do you use?",
        tooltip: "Full Solar means your home runs mostly on solar panels. Partial Green means you have a green energy tariff or some renewables. Standard Grid is regular fossil-fuel electricity.",
        type: "select",
        options: [
          { value: "full_solar", label: "Full Solar / Renewable" },
          { value: "half_green", label: "Partial Green Energy" },
          { value: "standard_grid", label: "Standard Grid" },
        ],
      },
      {
        key: "energy_heating",
        label: "What is your primary heating source?",
        tooltip: "Heat pumps are the most efficient and low-carbon option. Natural gas is common but fossil-fuel based. Fuel oil has the highest emissions.",
        type: "select",
        options: [
          { value: "heat_pump", label: "Heat Pump" },
          { value: "electric_resist", label: "Electric Resistance" },
          { value: "natural_gas", label: "Natural Gas" },
          { value: "fuel_oil", label: "Fuel Oil" },
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
        label: "How would you describe your shopping habits?",
        tooltip: "Frugal means you only buy essentials and rarely shop for new items. Moderate is average consumer behaviour. Active means you frequently buy new clothes, gadgets, or goods.",
        type: "select",
        options: [
          { value: "frugal", label: "Frugal (buy only essentials)" },
          { value: "moderate", label: "Moderate" },
          { value: "active", label: "Active (frequent shopper)" },
        ],
      },
      {
        key: "shopping_recycle",
        label: "How well do you recycle?",
        tooltip: "Extensive recycling means you sort all waste including glass, paper, plastic and compost. Standard is basic recycling. Poor means most waste goes to general landfill.",
        type: "select",
        options: [
          { value: "extensive", label: "Extensively" },
          { value: "standard", label: "Standard" },
          { value: "poor", label: "Rarely" },
        ],
      },
      {
        key: "shopping_devices",
        label: "How often do you replace electronics?",
        tooltip: "Manufacturing electronics has a high carbon cost. Replacing devices only when broken is the most sustainable choice. Annually means you upgrade gadgets every year.",
        type: "select",
        options: [
          { value: "annually", label: "Every year" },
          { value: "periodic", label: "Every few years" },
          { value: "need", label: "Only when broken" },
        ],
      },
    ],
  },
];

const impactColor = { High: "#ef4444", Medium: "#f59e0b", Low: "#22c55e" };

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
      setError("Something went wrong. Make sure the backend is running.");
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
    if (score >= 75) return { label: "Excellent", color: "#22c55e" };
    if (score >= 50) return { label: "Good", color: "#84cc16" };
    if (score >= 30) return { label: "Average", color: "#f59e0b" };
    return { label: "Needs Work", color: "#ef4444" };
  };

  if (result) {
    const scoreInfo = getScoreLabel(result.sustainability_score);
    const maxFootprint = 15;
    return (
      <div style={styles.page}>
        <div style={styles.resultCard}>
          <div style={styles.resultHeader}>
            <h1 style={styles.resultTitle}>Your Carbon Footprint</h1>
            <p style={styles.resultSubtitle}>Here's how your lifestyle measures up</p>
          </div>

          <div style={styles.scoreSection}>
            <div style={{ ...styles.scoreCircle, borderColor: scoreInfo.color }}>
              <span style={{ ...styles.scoreNumber, color: scoreInfo.color }}>
                {result.sustainability_score}
              </span>
              <span style={styles.scoreMax}>/100</span>
              <span style={{ ...styles.scoreLabel, color: scoreInfo.color }}>
                {scoreInfo.label}
              </span>
            </div>
            <div style={styles.totalFootprint}>
              <span style={styles.footprintNumber}>{result.total_footprint}</span>
              <span style={styles.footprintUnit}> tonnes CO₂/year</span>
            </div>
          </div>

          <div style={styles.breakdownSection}>
            <h2 style={styles.sectionTitle}>Breakdown</h2>
            {Object.entries(result.breakdown).map(([key, value]) => {
              const pct = Math.min((value / maxFootprint) * 100, 100);
              const categoryColors = {
                food: "#22c55e",
                transportation: "#3b82f6",
                energy: "#f59e0b",
                shopping: "#a855f7",
              };
              return (
                <div key={key} style={styles.barRow}>
                  <span style={styles.barLabel}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                  <div style={styles.barTrack}>
                    <div
                      style={{
                        ...styles.barFill,
                        width: `${pct}%`,
                        background: categoryColors[key] || "#64748b",
                      }}
                    />
                  </div>
                  <span style={styles.barValue}>{value}t</span>
                </div>
              );
            })}
          </div>

          {result.recommendations?.length > 0 && (
            <div style={styles.recsSection}>
              <h2 style={styles.sectionTitle}>Top Recommendations</h2>
              {result.recommendations.map((rec) => (
                <div key={rec.id} style={styles.recCard}>
                  <div style={styles.recTop}>
                    <span style={styles.recTitle}>{rec.title}</span>
                    <span
                      style={{
                        ...styles.recImpact,
                        background: impactColor[rec.impact] + "22",
                        color: impactColor[rec.impact],
                      }}
                    >
                      {rec.impact} Impact
                    </span>
                  </div>
                  <p style={styles.recDesc}>{rec.description}</p>
                  <span style={styles.recReduction}>
                    Save ~{rec.estimatedReduction}t CO₂/year
                  </span>
                </div>
              ))}
            </div>
          )}

          <button onClick={handleReset} style={styles.resetBtn}>
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.mainTitle}>Carbon Footprint Calculator</h1>
          <p style={styles.subtitle}>
            Step {currentStep + 1} of {totalSteps}
          </p>
        </div>

        <div style={styles.progressTrack}>
          <div
            style={{
              ...styles.progressFill,
              width: `${((currentStep + 1) / totalSteps) * 100}%`,
            }}
          />
        </div>

        <div style={styles.stepTabs}>
          {steps.map((s, i) => (
            <div
              key={s.id}
              style={{
                ...styles.stepTab,
                ...(i === currentStep ? styles.stepTabActive : {}),
                ...(i < currentStep ? styles.stepTabDone : {}),
              }}
            >
              <span>{s.icon}</span>
              <span style={styles.stepTabLabel}>{s.title}</span>
            </div>
          ))}
        </div>

        <div style={styles.questionsBlock}>
          <h2 style={styles.stepTitle}>
            {step.icon} {step.title}
          </h2>
          {step.questions.map((q) => (
            <div key={q.key} style={styles.questionRow}>
              <div style={styles.labelRow}>
                <label style={styles.questionLabel}>{q.label}</label>
                {q.tooltip && (
                  <div style={styles.tooltipWrapper}>
                    <span
                      style={styles.infoIcon}
                      onMouseEnter={() => setActiveTooltip(q.key)}
                      onMouseLeave={() => setActiveTooltip(null)}
                    >
                      ℹ
                    </span>
                    {activeTooltip === q.key && (
                      <div style={styles.tooltipBox}>{q.tooltip}</div>
                    )}
                  </div>
                )}
              </div>
              {q.type === "select" ? (
                <select
                  style={{
                    ...styles.select,
                    color: answers[q.key] ? "#fff" : "rgba(255,255,255,0.35)",
                  }}
                  value={answers[q.key] || ""}
                  onChange={(e) => handleChange(q.key, e.target.value)}
                >
                  <option value="" disabled style={{ color: "#888" }}>Select an option</option>
                  {q.options.map((opt) => (
                    <option key={opt.value} value={opt.value} style={{ color: "#fff" }}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="number"
                  min="0"
                  style={styles.input}
                  placeholder={q.placeholder}
                  value={answers[q.key] || ""}
                  onChange={(e) => handleChange(q.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.navRow}>
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            style={{
              ...styles.navBtn,
              ...styles.backBtn,
              opacity: currentStep === 0 ? 0.3 : 1,
            }}
          >
            ← Back
          </button>

          {currentStep < totalSteps - 1 ? (
            <button
              onClick={handleNext}
              disabled={!isStepComplete()}
              style={{
                ...styles.navBtn,
                ...styles.nextBtn,
                opacity: isStepComplete() ? 1 : 0.4,
              }}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isStepComplete() || loading}
              style={{
                ...styles.navBtn,
                ...styles.submitBtn,
                opacity: isStepComplete() && !loading ? 1 : 0.4,
              }}
            >
              {loading ? "Calculating..." : "Calculate 🌍"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 1rem",
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "20px",
    padding: "2rem",
    width: "100%",
    maxWidth: "600px",
    color: "#fff",
  },
  header: { marginBottom: "1rem" },
  mainTitle: { fontSize: "1.6rem", fontWeight: 700, margin: 0 },
  subtitle: { color: "#94a3b8", fontSize: "0.9rem", marginTop: "4px" },
  progressTrack: {
    height: "6px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "99px",
    overflow: "hidden",
    marginBottom: "1.5rem",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #22c55e, #3b82f6)",
    borderRadius: "99px",
    transition: "width 0.4s ease",
  },
  stepTabs: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "1.5rem",
    flexWrap: "wrap",
  },
  stepTab: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "6px 12px",
    borderRadius: "99px",
    background: "rgba(255,255,255,0.06)",
    fontSize: "0.78rem",
    color: "#94a3b8",
    border: "1px solid transparent",
  },
  stepTabActive: {
    background: "rgba(59,130,246,0.2)",
    border: "1px solid #3b82f6",
    color: "#fff",
  },
  stepTabDone: {
    background: "rgba(34,197,94,0.15)",
    border: "1px solid #22c55e",
    color: "#22c55e",
  },
  stepTabLabel: { fontSize: "0.78rem" },
  questionsBlock: { marginBottom: "1.5rem" },
  stepTitle: {
    fontSize: "1.2rem",
    fontWeight: 600,
    marginBottom: "1.2rem",
    color: "#e2e8f0",
  },
  questionRow: { marginBottom: "1.2rem" },
  labelRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "0.4rem",
  },
  questionLabel: {
    fontSize: "0.9rem",
    color: "#cbd5e1",
  },
  tooltipWrapper: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
  },
  infoIcon: {
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.15)",
    color: "#94a3b8",
    fontSize: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    userSelect: "none",
    fontStyle: "normal",
  },
  tooltipBox: {
    position: "absolute",
    left: "24px",
    top: "-4px",
    width: "220px",
    background: "#0f2027",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "10px",
    padding: "10px 12px",
    fontSize: "0.78rem",
    color: "#cbd5e1",
    lineHeight: 1.5,
    zIndex: 10,
    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
  },
  select: {
    width: "100%",
    padding: "10px 14px",
    paddingRight: "36px",
    borderRadius: "10px",
    background: "#1e3a2f",
    border: "1px solid rgba(255,255,255,0.15)",
    fontSize: "0.95rem",
    outline: "none",
    cursor: "pointer",
    appearance: "none",
    WebkitAppearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 14px center",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#fff",
    fontSize: "0.95rem",
    outline: "none",
    boxSizing: "border-box",
  },
  error: { color: "#f87171", fontSize: "0.9rem", marginBottom: "1rem" },
  navRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navBtn: {
    padding: "10px 24px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.95rem",
    transition: "all 0.2s",
  },
  backBtn: {
    background: "rgba(255,255,255,0.08)",
    color: "#cbd5e1",
  },
  nextBtn: {
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    color: "#fff",
  },
  submitBtn: {
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "#fff",
  },
  resultCard: {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "20px",
    padding: "2rem",
    width: "100%",
    maxWidth: "620px",
    color: "#fff",
  },
  resultHeader: { textAlign: "center", marginBottom: "1.5rem" },
  resultTitle: { fontSize: "1.8rem", fontWeight: 700, margin: 0 },
  resultSubtitle: { color: "#94a3b8", marginTop: "6px" },
  scoreSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "2rem",
  },
  scoreCircle: {
    width: "130px",
    height: "130px",
    borderRadius: "50%",
    border: "5px solid",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.05)",
  },
  scoreNumber: { fontSize: "2.4rem", fontWeight: 800, lineHeight: 1 },
  scoreMax: { fontSize: "0.8rem", color: "#94a3b8" },
  scoreLabel: { fontSize: "0.85rem", fontWeight: 600, marginTop: "4px" },
  totalFootprint: { textAlign: "center" },
  footprintNumber: { fontSize: "2rem", fontWeight: 700 },
  footprintUnit: { fontSize: "1rem", color: "#94a3b8" },
  breakdownSection: { marginBottom: "2rem" },
  sectionTitle: {
    fontSize: "1.1rem",
    fontWeight: 600,
    marginBottom: "1rem",
    color: "#e2e8f0",
  },
  barRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    marginBottom: "0.75rem",
  },
  barLabel: { width: "110px", fontSize: "0.88rem", color: "#cbd5e1" },
  barTrack: {
    flex: 1,
    height: "10px",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "99px",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: "99px",
    transition: "width 0.6s ease",
  },
  barValue: { width: "40px", fontSize: "0.82rem", color: "#94a3b8", textAlign: "right" },
  recsSection: { marginBottom: "1.5rem" },
  recCard: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    padding: "1rem",
    marginBottom: "0.75rem",
  },
  recTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.4rem",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  recTitle: { fontWeight: 600, fontSize: "0.95rem" },
  recImpact: {
    fontSize: "0.75rem",
    fontWeight: 600,
    padding: "2px 10px",
    borderRadius: "99px",
  },
  recDesc: { fontSize: "0.85rem", color: "#94a3b8", margin: "0 0 0.4rem 0" },
  recReduction: { fontSize: "0.8rem", color: "#22c55e", fontWeight: 600 },
  resetBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    color: "#fff",
    fontWeight: 700,
    fontSize: "1rem",
    border: "none",
    cursor: "pointer",
  },
};