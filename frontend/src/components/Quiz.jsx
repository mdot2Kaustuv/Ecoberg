import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios" 
import { 
  Apple, Car, Flame, ShoppingBag, 
  ChevronLeft, ChevronRight, Sparkles, 
  CheckCircle, Leaf, Home, Lightbulb
} from 'lucide-react';
import useAxios from '../utils/Axios';

const steps = [
  {
    id: "food",
    title: "Food & Diet",
    icon: <Apple className="h-5 w-5" />,
    questions: [
      {
        key: "food_diet",
        label: "What best describes your diet?",
        tooltip: "Vegan: no animal products. Pure Vegetarian: traditional veg diet. Eggitarian: no meat/fish, eats eggs. Low meat: non-veg 1-2 times a week. Standard Non-Veg: regular poultry/fish/mutton. Heavy meat: meat with almost every meal.",
        type: "select",
        options: [
          { value: "vegan", label: "Vegan", description: "No animal products at all" },
          { value: "pure_vegetarian", label: "Pure Vegetarian", description: "Traditional veg, no meat or eggs" },
          { value: "lacto_ovo_vegetarian", label: "Eggitarian / Lacto-Ovo", description: "Eats eggs & dairy" },
          { value: "low_meat", label: "Low Non-Veg", description: "Meat/fish once or twice a week" },
          { value: "regional_non_veg", label: "Standard Non-Veg", description: "Regular chicken, fish, or mutton" },
          { value: "heavy_meat", label: "Heavy Non-Veg", description: "Meat at almost every meal" },
        ],
      },
      {
        key: "food_waste",
        label: "How much food gets wasted in your household?",
        tooltip: "Food waste decomposing generates localized emissions. 'Almost None' means careful planning. 'High' means frequent disposal of spoiled ingredients.",
        type: "select",
        options: [
          { value: "zero", label: "Almost None", description: "I rarely throw food away" },
          { value: "low", label: "Low", description: "Occasional waste, mostly planned meals" },
          { value: "high", label: "High", description: "I throw away food or leftovers regularly" },
        ],
      },
    ],
  },
  {
    id: "transport",
    title: "Transportation",
    icon: <Car className="h-5 w-5" />,
    questions: [
      {
        key: "trans_commute",
        label: "What is your primary mode of commute?",
        tooltip: "Select your dominant transit choice.",
        type: "select",
        options: [
          { value: "two_wheeler", label: "Two-Wheeler", description: "Motorcycle or scooter" },
          { value: "public_transit", label: "Public Transit", description: "Metro, city bus, or train" },
          { value: "auto_rickshaw", label: "Auto-Rickshaw", description: "CNG, diesel, or electric rickshaws" },
          { value: "gas_car", label: "Petrol or Diesel Car", description: "Standard combustion engine" },
          { value: "cng_hybrid_car", label: "CNG or Hybrid Car", description: "Alternative fuel or hybrid engine" },
          { value: "electric_car", label: "Electric Car (EV)", description: "Battery powered vehicle" },
          { value: "active_travel", label: "Walk or Cycle", description: "No engine footprint" },
        ],
      },
      {
        key: "trans_distance_weekly",
        label: "Weekly commuting distance",
        unit: "KM",
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
          { value: "hatchback", label: "Hatchback", description: "Small city car (e.g. Swift, Alto)" },
          { value: "sedan", label: "Sedan", description: "Everyday mid-size car (e.g. Honda City)" },
          { value: "suv_luxury", label: "SUV / Luxury", description: "Large utility vehicle (e.g. Scorpio)" },
          { value: "none", label: "No Car", description: "I do not use a car regularly" },
        ],
      },
      {
        key: "trans_flights_short",
        label: "Domestic or regional flights per year",
        unit: "Flights",
        tooltip: "Count each single one-way flight leg under 3 hours. A round trip equals 2.",
        type: "number",
        placeholder: "e.g. 2",
      },
      {
        key: "trans_flights_long",
        label: "International flights per year",
        unit: "Flights",
        tooltip: "Count cross-continental flights over 3 hours. Connection legs count as 1.",
        type: "number",
        placeholder: "e.g. 1",
      },
    ],
  },
  {
    id: "energy",
    title: "Home Energy",
    icon: <Flame className="h-5 w-5" />,
    questions: [
      {
        key: "energy_size",
        label: "What type of housing do you live in?",
        tooltip: "Matches space sizes with common local building types.",
        type: "select",
        options: [
          { value: "room_shared", label: "Single Room or Shared Space" },
          { value: "apartment_small", label: "Small Apartment", description: "1-2 BHK" },
          { value: "apartment_medium", label: "Large Apartment", description: "3+ BHK" },
          { value: "independent_house", label: "Independent House", description: "Bungalow or Villa" },
        ],
      },
      {
        key: "energy_ac",
        label: "How intensively do you use Air Conditioning?",
        tooltip: "AC draws heavily from regional grids.",
        type: "select",
        options: [
          { value: "none", label: "No AC", description: "Fans or air coolers only" },
          { value: "seasonal", label: "Seasonal", description: "Turned on during heatwaves/peak summer" },
          { value: "heavy", label: "Heavy Usage", description: "Multiple units running frequently" },
        ],
      },
      {
        key: "energy_cooking",
        label: "What is your primary household cooking fuel?",
        tooltip: "LPG cylinders are the baseline. Electric induction cuts footprints depending on grid.",
        type: "select",
        options: [
          { value: "lpg", label: "LPG Cylinder", description: "Piped or bottled cooking gas" },
          { value: "induction_electric", label: "Electric Induction", description: "Modern electric cooktop" },
          { value: "biomass_wood", label: "Biomass / Wood", description: "Traditional cooking stoves" },
        ],
      },
    ],
  },
  {
    id: "shopping",
    title: "Shopping",
    icon: <ShoppingBag className="h-5 w-5" />,
    questions: [
      {
        key: "shopping_intensity",
        label: "How would you describe your consumer shopping habits?",
        tooltip: "Frugal: repair culture. Moderate: predictable upgrades. Active: routine trend updates.",
        type: "select",
        options: [
          { value: "frugal", label: "Frugal", description: "Repair culture, buying absolute essentials" },
          { value: "moderate", label: "Moderate", description: "Occasional new clothing or gear" },
          { value: "active", label: "Active Shopper", description: "Frequent purchases of trending items" },
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

const flatQuestions = steps.flatMap(step =>
  step.questions.map(q => ({
    ...q,
    categoryId: step.id,
    categoryTitle: step.title,
    icon: step.icon
  }))
);

export default function Quiz() {
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [calculatingMessages, setCalculatingMessages] = useState('Aggregating greenhouse coefficients...');
  const [activeTooltip, setActiveTooltip] = useState(false);

  const totalQuestions = flatQuestions.length;
  const currentQuestion = flatQuestions[currentIndex];
  const currentValue = answers[currentQuestion.key];

  const getCategoryTheme = (catId) => {
    switch (catId) {
      case 'food': return { bg: 'bg-emerald-500', text: 'text-emerald-700', activeBg: 'bg-emerald-50/20', activeBorder: 'border-emerald-600' };
      case 'transport': return { bg: 'bg-sky-500', text: 'text-sky-700', activeBg: 'bg-sky-50/20', activeBorder: 'border-sky-600' };
      case 'energy': return { bg: 'bg-amber-500', text: 'text-amber-700', activeBg: 'bg-amber-50/20', activeBorder: 'border-amber-600' };
      case 'shopping': return { bg: 'bg-indigo-500', text: 'text-indigo-700', activeBg: 'bg-indigo-50/20', activeBorder: 'border-indigo-600' };
      default: return { bg: 'bg-gray-500', text: 'text-gray-700', activeBg: 'bg-gray-50/20', activeBorder: 'border-gray-600' };
    }
  };

  const theme = getCategoryTheme(currentQuestion.categoryId);

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const handleSelectOption = (value) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.key]: value }));
    setTimeout(() => {
      if (currentIndex < totalQuestions - 1) {
        setCurrentIndex((prev) => prev + 1);
      }
    }, 350);
  };

  const handleNumberChange = (e) => {
    const val = e.target.value === '' ? '' : Number(e.target.value);
    setAnswers((prev) => ({ ...prev, [currentQuestion.key]: val }));
  };

 const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const messages = [
      'Aggregating greenhouse coefficients...',
      'Mapping carbon footprint indexes...',
      'Analyzing lifestyle offsets and metrics...',
      'Connecting to Ecoberg sustainability engine...',
      'Synthesizing tailored carbon savings checklists...'
    ];
    let msgIdx = 0;
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % messages.length;
      setCalculatingMessages(messages[msgIdx]);
    }, 2200);

    try {
      // 1. Sanitize the data: Convert any empty string numbers ("") to 0 
      // so Django's serializers don't reject them as bad data types
      const cleanedAnswers = { ...answers };
      flatQuestions.forEach(q => {
        if (q.type === 'number') {
          if (cleanedAnswers[q.key] === '' || cleanedAnswers[q.key] === undefined || cleanedAnswers[q.key] === null) {
            cleanedAnswers[q.key] = 0;
          }
        }
      });

      // 2. Wrap it back inside the 'inputs' key that your Django view expects,
      // while keeping the direct standard axios call.
      const response = await axios.post("http://127.0.0.1:8000/api/calculate/", { 
        inputs: cleanedAnswers 
      });
      
      setResult(response.data);
    } catch (err) {
      console.error("Quiz submission failure context:", err);
      
      // If Django sent back specific validation errors, show them!
      if (err.response && err.response.data) {
        console.log("Django Validation Errors:", err.response.data);
        setError(`Server validation failed: ${JSON.stringify(err.response.data)}`);
      } else {
        setError("Server connection failed. Ensure your Django backend is running.");
      }
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };
  const handleReset = () => {
    setAnswers({});
    setResult(null);
    setCurrentIndex(0);
    setError(null);
  };

 
 
  if (result) {
    const scoreColorClass = result.sustainability_score >= 75 ? "border-emerald-500 text-emerald-700" :
                            result.sustainability_score >= 50 ? "border-sky-500 text-sky-700" :
                            result.sustainability_score >= 30 ? "border-amber-500 text-amber-700" :
                            "border-rose-500 text-rose-700";

    return (
      <div className="w-full max-w-3xl mx-auto my-12 px-4 font-sans select-none">
        <div className="bg-white rounded-[32px] p-8 sm:p-12 border border-slate-100 shadow-2xl shadow-emerald-950/5">
          
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Your Impact Profile</h1>
            <p className="text-slate-400 font-medium">Detailed breakdown of your footprint</p>
          </div>

          <div className="flex flex-col items-center gap-4 mb-12 p-8 bg-slate-50/50 rounded-[28px] border border-slate-100">
            <div className={`w-40 h-40 rounded-full flex flex-col items-center justify-center bg-white border-[10px] shadow-sm ${scoreColorClass}`}>
              <span className="text-5xl font-extrabold">{result.sustainability_score}</span>
              <span className="text-xs font-bold uppercase mt-1 tracking-wider text-slate-400">Score</span>
            </div>
            <div className="text-center mt-2">
              <span className="text-4xl font-black text-slate-800">{result.total_footprint}</span>
              <span className="text-lg font-bold text-slate-400"> tCO₂/yr</span>
            </div>
          </div>

          {/* Recommendations */}
          {result.recommendations && result.recommendations.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-6">
                <Lightbulb className="h-5 w-5 text-emerald-600" />
                <h2 className="text-xl font-extrabold text-slate-900">Action Plan</h2>
              </div>
              <div className="grid gap-4">
                {result.recommendations.map((rec) => {
                  const friendly = friendlyRecommendations[rec.id];
                  const impactColor = rec.impact === "High" ? "bg-rose-100 text-rose-800" : 
                                      rec.impact === "Medium" ? "bg-amber-100 text-amber-800" :
                                      "bg-emerald-100 text-emerald-800";
                  return (
                    <div key={rec.id} className="bg-white rounded-[24px] p-6 border-2 border-slate-100 hover:border-emerald-200 transition-colors">
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="h-4 w-4 text-emerald-500 mt-1 shrink-0" />
                          <span className="font-extrabold text-slate-800 text-base">
                            {friendly ? friendly.what : rec.title}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shrink-0 ${impactColor}`}>
                          {rec.impact} Impact
                        </span>
                      </div>
                      {friendly ? (
                        <>
                          <p className="text-sm text-slate-500 mb-2 font-medium leading-relaxed ml-6">
                            <strong className="text-slate-700">Why: </strong>{friendly.why}
                          </p>
                          <p className="text-sm text-slate-500 mb-2 font-medium leading-relaxed ml-6">
                            <strong className="text-slate-700">How: </strong>{friendly.how}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-slate-500 mb-2 font-medium leading-relaxed ml-6">{rec.description}</p>
                      )}
                      <div className="mt-4 ml-6 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
                        <Sparkles className="h-4 w-4" />
                        <span>Save ~{rec.estimatedReduction}t CO₂/yr</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              onClick={handleReset}
              className="flex-1 py-4 rounded-full text-sm font-bold uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            >
              Recalculate
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 py-4 rounded-full text-sm font-bold uppercase tracking-wider bg-emerald-900 hover:bg-emerald-800 text-white transition flex items-center justify-center gap-2"
            >
              <Home className="h-4 w-4" />
              Finish & Go Home
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Quiz view
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 select-none font-sans min-h-[75vh] flex flex-col justify-center">

      {loading && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center transition-opacity duration-300">
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-75"></div>
            <div className="relative p-5 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600">
              <Leaf className="h-10 w-10 animate-pulse" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Calculating Footprint</h2>
          <p className="text-sm text-slate-500 font-medium mt-2 max-w-md h-6 transition-all duration-300">
            {calculatingMessages}
          </p>
          <div className="w-64 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-6">
            <div className="bg-emerald-600 h-full w-2/3 animate-pulse rounded-full"></div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 tracking-wider uppercase mb-3">
          <div className="flex items-center space-x-2">
            <span className={`p-1.5 rounded-xl text-white ${theme.bg}`}>
              {currentQuestion.icon}
            </span>
            <span className={`${theme.text} font-bold`}>{currentQuestion.categoryTitle}</span>
          </div>
          <span className="font-bold">Q {currentIndex + 1} of {totalQuestions}</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          {steps.map((cat, idx) => {
            const isCompleted = steps.findIndex(c => c.id === currentQuestion.categoryId) > idx;
            const isCurrent = currentQuestion.categoryId === cat.id;
            return (
              <div
                key={cat.id}
                className={`h-full rounded-full transition-all duration-500 ${
                  isCompleted ? 'bg-emerald-600' : isCurrent ? theme.bg : 'bg-slate-200'
                }`}
              />
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl shadow-emerald-950/4 p-6 sm:p-10 min-h-[420px] flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {currentQuestion.label}
            </h1>

            {currentQuestion.tooltip && (
              <div className="relative inline-flex group mt-1.5">
                <button
                  onMouseEnter={() => setActiveTooltip(true)}
                  onMouseLeave={() => setActiveTooltip(false)}
                  className="text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 bg-slate-50 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                >
                  <span className="font-bold text-sm">i</span>
                </button>
                {activeTooltip && (
                  <div className="absolute right-0 top-full mt-2 w-64 p-3.5 bg-slate-800 text-white text-xs font-medium leading-relaxed rounded-2xl shadow-xl z-10 pointer-events-none">
                    {currentQuestion.tooltip}
                  </div>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 mb-6 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="mt-4">
            {currentQuestion.type === "select" && (
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((opt) => {
                  const isSelected = currentValue === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelectOption(opt.value)}
                      type="button"
                      className={`w-full text-left p-4 rounded-[22px] border-2 transition-all duration-200 relative group flex items-center justify-between ${
                        isSelected
                          ? `${theme.activeBorder} ${theme.activeBg}`
                          : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="pr-4">
                        <p className={`font-bold text-sm transition-colors ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                          {opt.label}
                        </p>
                        {opt.description && (
                          <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">
                            {opt.description}
                          </p>
                        )}
                      </div>
                      <div className={`rounded-full p-0.5 border flex-shrink-0 transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-slate-200 text-transparent group-hover:border-slate-300'
                      }`}>
                        <CheckCircle className="h-4 w-4 fill-current text-white" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {currentQuestion.type === "number" && (
              <div className="max-w-md">
                <div className="relative rounded-2xl border-2 border-slate-100 overflow-hidden bg-white py-3 px-4 focus-within:border-emerald-600 focus-within:ring-1 focus-within:ring-emerald-500 transition shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider block uppercase mb-1">
                    Enter Amount
                  </span>
                  <div className="flex items-center">
                    <input
                      type="number"
                      min={0}
                      value={currentValue === undefined ? '' : currentValue}
                      onChange={handleNumberChange}
                      placeholder={currentQuestion.placeholder}
                      className="block w-full border-0 p-0 text-slate-900 font-extrabold text-2xl focus:ring-0 focus:outline-none placeholder-slate-200 bg-transparent"
                    />
                    {currentQuestion.unit && (
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-50 rounded-xl py-1.5 px-3 border border-slate-100 flex-shrink-0 uppercase tracking-wide">
                        {currentQuestion.unit}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-8">
          <button
            onClick={handleBack}
            disabled={currentIndex === 0}
            type="button"
            className="flex items-center space-x-1 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-0 disabled:pointer-events-none"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentValue === undefined || currentValue === ''}
            type="button"
            className="flex items-center space-x-1.5 px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition shadow-sm disabled:opacity-50 disabled:pointer-events-none bg-emerald-900 hover:bg-emerald-800 text-white"
          >
            <span>
              {currentIndex === totalQuestions - 1 ? 'Analyze Lifestyle' : 'Next Step'}
            </span>
            {currentIndex === totalQuestions - 1 ? (
              <Sparkles className="h-4 w-4 fill-white/10" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}