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

        tooltip: "Vegan: no animal products. Pure Vegetarian: traditional veg diet (no meat, fish, or eggs). Eggitarian: no meat or fish, but eats eggs. Low meat: non-veg 1-2 times a week. Regional Non-Veg: regular consumption of poultry/fish/mutton. Heavy meat: meat consumed with almost every meal.",

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

        tooltip: "Food waste decomposing in warm climates generates strong localized emissions. 'Almost None' means careful planning and finish leftovers. 'High' means frequent disposal of spoiled ingredients or unconsumed food.",

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

        tooltip: "Select your most dominant transit choice. Two-Wheeler: motorcycles or scooters. Auto-Rickshaw: shared or personal local transit. Public Transit: local buses, metros, or commuter trains. Electric Car: battery vehicles.",

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

        tooltip: "Combine your estimated weekly travels for office, college, and personal tasks. Enter 0 if you only walk, cycle, or work fully from home.",

        type: "number",

        placeholder: "e.g. 100",

      },

      {

        key: "trans_car_size",

        label: "If you drive a car, what size category is it?",

        tooltip: "Hatchback: compact city cars (e.g., Alto, Swift, i10). Sedan: mid-sized passenger cars (e.g., City, Dzire, Verna). SUV/Luxury: larger utility or high-capacity variants (e.g., Creta, Scorpio, Fortuner). Choose 'No Car' if you travel strictly on transit or bikes.",

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

        tooltip: "Count each single one-way flight leg. A round trip equals 2 flights. Includes common inner-region flights (e.g., Kathmandu to Delhi, Mumbai to Bengaluru).",

        type: "number",

        placeholder: "e.g. 2",

      },

      {

        key: "trans_flights_long",

        label: "International flights per year (over 3 hours)",

        tooltip: "Count cross-continental flights (e.g., Delhi to London, Dhaka to Sydney). Each direct or connection leg counts as 1 individual flight.",

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

        tooltip: "Matches space sizes with common local building types. Shared room, small apartment (1-2 BHK flats), medium apartment (3+ BHK units), or multi-level standalone properties.",

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

        tooltip: "AC draws heavily from regional grids. None: only ceiling fans or air coolers. Seasonal: runs strictly during peak hot summer months. Heavy: multiple structural units running consistently all day or night.",

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

        tooltip: "LPG cylinders are the regional baseline. Electric induction cuts carbon footprints dramatically depending on local clean grids. Biomass includes wood/charcoal setups.",

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

        tooltip: "Frugal: focus heavily on item repair and purchase only immediate necessities. Moderate: predictable upgrades for clothing and items. Active: routine lifestyle updates matching high disposable habits.",

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



const impactColor = { High: "#ef4444", Medium: "#f59e0b", Low: "#22c55e" };



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

    // Adjusted from 15 to 6 to make visual bar charts accurate for localized South Asian limits

    const maxFootprint = 6;

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



// Keeping original custom styles intact

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

