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
        tooltip: "Vegan: no meat, dairy, or eggs. Vegetarian: no meat but eats dairy/eggs. Pescatarian: eats fish but no other meat. Low meat: meat 1-2 times a week. Standard meat: meat most days. Heavy meat: meat at almost every meal.",
        type: "select",
        options: [
          { value: "vegan", label: "Vegan – no animal products at all" },
          { value: "vegetarian", label: "Vegetarian – no meat, but dairy & eggs ok" },
          { value: "pescatarian", label: "Pescatarian – fish only, no other meat" },
          { value: "low_meat", label: "Low Meat – meat once or twice a week" },
          { value: "standard_meat", label: "Standard – meat most days" },
          { value: "heavy_meat", label: "Heavy Meat – meat at almost every meal" },
        ],
      },
      {
        key: "food_local",
        label: "How often do you buy locally sourced food?",
        tooltip: "Locally sourced food is grown or produced close to where you live (within your country or region). It travels shorter distances, which means fewer transport emissions. 'Always' means nearly all your groceries are local; 'Rarely' means most come from supermarkets with no local sourcing.",
        type: "select",
        options: [
          { value: "always", label: "Always – mostly local markets or farm shops" },
          { value: "often", label: "Often – local produce when possible" },
          { value: "occasionally", label: "Occasionally – sometimes local, sometimes not" },
          { value: "rarely", label: "Rarely – mostly supermarket, no focus on local" },
        ],
      },
      {
        key: "food_waste",
        label: "How much food do you waste?",
        tooltip: "Food waste means edible food that gets thrown away. 'Almost none' means you plan meals carefully and rarely throw food out. 'High' means you often throw away leftovers, expired items, or unused groceries.",
        type: "select",
        options: [
          { value: "zero", label: "Almost None – I rarely throw food away" },
          { value: "low", label: "Low – occasional waste, mostly planned meals" },
          { value: "medium", label: "Medium – some leftovers or items go to waste" },
          { value: "high", label: "High – I throw away food regularly" },
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
        tooltip: "Choose the transport you rely on most days. Gas car: runs on petrol or diesel. Hybrid: uses both fuel and electric power. Electric car: fully battery powered. Public transit: bus, train, or metro. Active travel: walking or cycling.",
        type: "select",
        options: [
          { value: "gas_car", label: "Gas Car – petrol or diesel engine" },
          { value: "hybrid_car", label: "Hybrid Car – part fuel, part electric" },
          { value: "electric_car", label: "Electric Car – fully battery powered" },
          { value: "public_transit", label: "Public Transit – bus, train, or metro" },
          { value: "active_travel", label: "Walk or Cycle – no engine" },
        ],
      },
      {
        key: "trans_mileage",
        label: "Weekly driving distance (miles)",
        tooltip: "Add up all the miles you drive in a typical week — commute, errands, school runs, and trips. If you don't drive, enter 0. 1 kilometre = 0.62 miles.",
        type: "number",
        placeholder: "e.g. 100",
      },
      {
        key: "trans_car_size",
        label: "What size is your car?",
        tooltip: "Compact: small city car like a Suzuki Alto or VW Polo. Sedan/Mid-size: everyday family car like a Toyota Corolla or Honda Civic. SUV or Truck: large vehicle like a Ford F-150, Toyota RAV4, or Range Rover — these use significantly more fuel. No Car: select this if you don't own or regularly drive a car.",
        type: "select",
        options: [
          { value: "compact", label: "Compact – small city car (e.g. VW Polo)" },
          { value: "sedan", label: "Mid-size Sedan – family car (e.g. Toyota Corolla)" },
          { value: "suv_truck", label: "SUV or Truck – large vehicle (e.g. Ford F-150)" },
          { value: "none", label: "No Car – I don't drive regularly" },
        ],
      },
      {
        key: "trans_flights_short",
        label: "Short-haul flights per year (under 3 hrs)",
        tooltip: "Count each one-way flight separately — a return trip = 2 flights. Short-haul is typically within the same country or a nearby country, under 3 hours of flying time. Example: London to Paris, Delhi to Mumbai.",
        type: "number",
        placeholder: "e.g. 2",
      },
      {
        key: "trans_flights_long",
        label: "Long-haul flights per year (over 3 hrs)",
        tooltip: "Long-haul flights are international or cross-continental trips over 3 hours. These have a much higher carbon impact per trip. Example: London to New York, Mumbai to Sydney. Count each one-way leg as 1 flight.",
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
        tooltip: "Larger homes use more energy for heating, cooling, and lighting. Studio: single open room. Apartment: flat in a building. Townhouse: multi-floor terraced home. Medium house: 2-3 bedroom detached home. Large house: 4+ bedrooms or a large detached property.",
        type: "select",
        options: [
          { value: "studio", label: "Studio – single room flat" },
          { value: "apartment", label: "Apartment – flat in a building" },
          { value: "townhouse", label: "Townhouse – multi-floor terraced home" },
          { value: "house_medium", label: "Medium House – 2 to 3 bedrooms" },
          { value: "house_large", label: "Large House – 4 or more bedrooms" },
        ],
      },
      {
        key: "energy_renewables",
        label: "What energy source powers your home?",
        tooltip: "Full Solar/Renewable: your home runs mostly on solar panels or a 100% green energy tariff. Partial Green: you have some renewable energy but still rely partly on the grid. Standard Grid: regular electricity from the national grid, mostly fossil fuels.",
        type: "select",
        options: [
          { value: "full_solar", label: "Full Solar or 100% Green Tariff" },
          { value: "half_green", label: "Partial Green – some renewables, some grid" },
          { value: "standard_grid", label: "Standard Grid – regular fossil fuel electricity" },
        ],
      },
      {
        key: "energy_heating",
        label: "What is your primary heating source?",
        tooltip: "Heat pump: uses electricity to extract heat from air or ground — very efficient and low carbon. Electric resistance: electric heaters or storage heaters — higher emissions than heat pumps. Natural gas: common boiler system — fossil fuel based. Fuel oil: oil-fired boiler — highest emissions of all options.",
        type: "select",
        options: [
          { value: "heat_pump", label: "Heat Pump – electric, most efficient" },
          { value: "electric_resist", label: "Electric Heaters – plug-in or storage heaters" },
          { value: "natural_gas", label: "Natural Gas Boiler – common gas central heating" },
          { value: "fuel_oil", label: "Fuel Oil Boiler – oil-fired heating system" },
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
        tooltip: "Frugal: you buy only what you need and rarely purchase new clothes, gadgets, or non-essentials. Moderate: you shop occasionally for new items but are not excessive. Active: you frequently buy new clothing, gadgets, home goods, or other non-essentials.",
        type: "select",
        options: [
          { value: "frugal", label: "Frugal – only buy essentials, rarely shop for extras" },
          { value: "moderate", label: "Moderate – occasional non-essential purchases" },
          { value: "active", label: "Active Shopper – frequent new clothes, gadgets, goods" },
        ],
      },
      {
        key: "shopping_recycle",
        label: "How well do you recycle and sort waste?",
        tooltip: "Extensive: you carefully separate paper, plastic, glass, metal, and compost organic waste. Standard: you recycle the basics like bottles and cans but don't sort everything. Poor/Rarely: most of your waste goes into a single bin without sorting.",
        type: "select",
        options: [
          { value: "extensive", label: "Extensively – sort all waste including compost" },
          { value: "standard", label: "Standard – recycle bottles, cans, and paper" },
          { value: "poor", label: "Rarely – most waste goes in one bin" },
        ],
      },
      {
        key: "shopping_devices",
        label: "How often do you replace phones, laptops, or electronics?",
        tooltip: "Manufacturing electronics produces a significant amount of carbon. Replacing devices only when broken is the most sustainable approach. Every few years is average. Annually means upgrading your phone, laptop, or other gadgets every year even if still working.",
        type: "select",
        options: [
          { value: "annually", label: "Every Year – upgrade gadgets annually" },
          { value: "periodic", label: "Every Few Years – replace when outdated" },
          { value: "need", label: "Only When Broken – use until it stops working" },
        ],
      },
    ],
  },
];

const impactColor = { High: "#ef4444", Medium: "#f59e0b", Low: "#22c55e" };

const friendlyRecommendations = {
  rec_food_diet: {
    what: "Try going meat-free at least one day a week.",
    why: "Producing beef and lamb releases large amounts of greenhouse gases. Even one meat-free day per week can noticeably reduce your food footprint.",
    how: "Replace meat with lentils, chickpeas, beans, tofu, or eggs. Try a vegetarian curry, pasta, or stir-fry — these are cheap, filling, and easy to make.",
  },
  rec_food_waste: {
    what: "Plan your meals before you shop to cut food waste.",
    why: "Food that ends up in landfill produces methane, a powerful greenhouse gas. Wasting less food is one of the simplest ways to reduce emissions.",
    how: "Write a weekly meal plan, make a shopping list, and stick to it. Use leftovers for lunch the next day. Store food properly to extend its life.",
  },
  rec_trans_commute: {
    what: "Switch to an electric or hybrid vehicle for your daily commute.",
    why: "Petrol and diesel cars are among the biggest sources of personal carbon emissions. Electric vehicles produce zero direct emissions.",
    how: "If a full EV is too costly, start with a hybrid. Check for government grants or tax credits available in your country for EV purchases.",
  },
  rec_trans_carpool: {
    what: "Share car journeys or use public transport three times a week.",
    why: "Carpooling and public transit spread emissions across more people, dramatically cutting the per-person carbon cost of travel.",
    how: "Ask colleagues if anyone lives nearby and wants to share the commute. Use apps like BlaBlaCar or your city's ride-share scheme.",
  },
  rec_trans_trains: {
    what: "Replace short flights with train or bus travel where possible.",
    why: "A short-haul flight produces roughly 10 times more CO₂ per kilometre than a train journey on the same route.",
    how: "For trips under 4 hours, check train timetables first. Trains are often cheaper, more comfortable, and drop you in the city centre.",
  },
  rec_energy_solar: {
    what: "Switch to a 100% renewable energy tariff with your electricity provider.",
    why: "Standard grid electricity is mostly generated from coal and gas. Green tariffs ensure your electricity comes from wind, solar, or hydro sources.",
    how: "Contact your energy provider and ask about green tariffs — many are the same price or cheaper. If you own your home, consider installing solar panels.",
  },
  rec_energy_heatpump: {
    what: "Replace your gas or oil boiler with an electric heat pump.",
    why: "Gas and oil boilers burn fossil fuels directly in your home. Heat pumps use electricity to move heat and are 3-4 times more efficient.",
    how: "Look into government schemes such as the Boiler Upgrade Scheme (UK) or similar grants in your country that reduce the upfront cost significantly.",
  },
  rec_shop_thrift: {
    what: "Buy second-hand clothing and furniture before buying new.",
    why: "Manufacturing new clothes and goods produces large amounts of carbon and waste. Second-hand items have already paid that carbon cost.",
    how: "Try apps like Vinted, Depop, or eBay for clothes. Visit charity shops or car boot sales for furniture and homewares.",
  },
  rec_shop_electronics: {
    what: "Keep your phone and laptop for at least 4 years before replacing.",
    why: "Around 80% of a smartphone's lifetime carbon emissions come from manufacturing — not from using it. Keeping devices longer dramatically cuts that impact.",
    how: "Replace batteries instead of whole devices. Buy refurbished if you need an upgrade. Avoid upgrading just for new features you don't really need.",
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
              {result.recommendations.map((rec) => {
                const friendly = friendlyRecommendations[rec.id];
                return (
                  <div key={rec.id} style={styles.recCard}>
                    <div style={styles.recTop}>
                      <span style={styles.recTitle}>
                        {friendly ? friendly.what : rec.title}
                      </span>
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
                    {friendly && (
                      <>
                        <p style={styles.recWhy}>
                          <strong style={{ color: "#e2e8f0" }}>Why it matters: </strong>
                          {friendly.why}
                        </p>
                        <p style={styles.recHow}>
                          <strong style={{ color: "#e2e8f0" }}>How to do it: </strong>
                          {friendly.how}
                        </p>
                      </>
                    )}
                    {!friendly && (
                      <p style={styles.recDesc}>{rec.description}</p>
                    )}
                    <span style={styles.recReduction}>
                      💚 Could save ~{rec.estimatedReduction}t CO₂/year
                    </span>
                  </div>
                );
              })}
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
                    <option key={opt.value} value={opt.value} style={{ color: "#fff", background: "#1e3a2f" }}>
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
    width: "240px",
    background: "#0f2027",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "10px",
    padding: "10px 12px",
    fontSize: "0.78rem",
    color: "#cbd5e1",
    lineHeight: 1.6,
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
    maxWidth: "640px",
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
    padding: "1.1rem",
    marginBottom: "0.85rem",
  },
  recTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "0.6rem",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  recTitle: { fontWeight: 700, fontSize: "0.95rem", flex: 1 },
  recImpact: {
    fontSize: "0.75rem",
    fontWeight: 600,
    padding: "2px 10px",
    borderRadius: "99px",
    whiteSpace: "nowrap",
  },
  recWhy: {
    fontSize: "0.84rem",
    color: "#94a3b8",
    margin: "0 0 0.4rem 0",
    lineHeight: 1.55,
  },
  recHow: {
    fontSize: "0.84rem",
    color: "#94a3b8",
    margin: "0 0 0.5rem 0",
    lineHeight: 1.55,
  },
  recDesc: { fontSize: "0.85rem", color: "#94a3b8", margin: "0 0 0.4rem 0" },
  recReduction: { fontSize: "0.82rem", color: "#22c55e", fontWeight: 600 },
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