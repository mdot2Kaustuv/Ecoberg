import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
        label: "How would you describe your typical diet?",
        tooltip: "Vegan: only plant-based foods. Vegetarian: no meat or eggs. Eggitarian: no meat, but you eat eggs. Low meat: meat or fish 1-2 times a week. Standard: regular meat/fish. Heavy meat: meat with most meals.",
        type: "select",
        options: [
          { value: "vegan", label: "Vegan", description: "Entirely plant-based, no animal products" },
          { value: "pure_vegetarian", label: "Vegetarian", description: "Plant-based and dairy, no meat or eggs" },
          { value: "lacto_ovo_vegetarian", label: "Eggitarian / Veg with Eggs", description: "No meat, but okay with eggs and dairy" },
          { value: "low_meat", label: "Flexitarian / Low Meat", description: "Enjoy meat or fish just once or twice a week" },
          { value: "regional_non_veg", label: "Standard Non-Vegetarian", description: "Regularly eat chicken, fish, or meat" },
          { value: "heavy_meat", label: "Meat Lover", description: "Enjoy meat with almost every meal" },
        ],
      },
      {
        key: "food_waste",
        label: "How much food tends to go to waste in your home?",
        tooltip: "Throwing away food means wasted resources. 'Almost none' means you're great at planning. 'High' means leftovers or ingredients get tossed out quite often.",
        type: "select",
        options: [
          { value: "zero", label: "Almost none", description: "I rarely throw food away" },
          { value: "low", label: "A little bit", description: "Occasional waste, but we try to plan ahead" },
          { value: "high", label: "Quite a lot", description: "Leftovers or unused groceries often go to waste" },
        ],
      },
    ],
  },
  {
    id: "transport",
    title: "Getting Around",
    icon: <Car className="h-5 w-5" />,
    questions: [
      {
        key: "trans_commute",
        label: "How do you usually travel or commute?",
        tooltip: "Pick the way you get around most of the time.",
        type: "select",
        options: [
          { value: "two_wheeler", label: "Motorcycle or Scooter", description: "Two-wheeler" },
          { value: "public_transit", label: "Public Transit", description: "Metro, bus, or train" },
          { value: "auto_rickshaw", label: "Auto-Rickshaw", description: "CNG, electric, or diesel rickshaw" },
          { value: "gas_car", label: "Petrol or Diesel Car", description: "Standard gas-powered car" },
          { value: "cng_hybrid_car", label: "CNG or Hybrid Car", description: "An alternative fuel or hybrid vehicle" },
          { value: "electric_car", label: "Electric Vehicle (EV)", description: "Battery-powered car" },
          { value: "active_travel", label: "Walk or Cycle", description: "Powered entirely by you!" },
        ],
      },
      {
        key: "trans_distance_weekly",
        label: "About how many kilometers do you travel in a week?",
        unit: "KM",
        tooltip: "Think about your weekly total for work, school, grocery runs, and weekend trips.",
        type: "number",
        placeholder: "e.g., 100",
      },
      {
        key: "trans_car_size",
        label: "If you drive a car, what size is it?",
        tooltip: "Hatchbacks are small city cars. Sedans are mid-sized. SUVs/Luxury vehicles are larger and heavier.",
        type: "select",
        options: [
          { value: "hatchback", label: "Hatchback", description: "Small, compact city car (like a Swift or Alto)" },
          { value: "sedan", label: "Sedan", description: "Mid-sized everyday car (like a Honda City)" },
          { value: "suv_luxury", label: "SUV or Luxury Car", description: "Larger utility vehicle or premium car (like a Scorpio)" },
          { value: "none", label: "I don't drive a car", description: "I don't use a car on a regular basis" },
        ],
      },
      {
        key: "trans_flights_short",
        label: "How many short or domestic flights do you take per year?",
        unit: "Flights",
        tooltip: "Count any one-way flight under 3 hours. A round trip counts as 2.",
        type: "number",
        placeholder: "e.g., 2",
      },
      {
        key: "trans_flights_long",
        label: "How many long or international flights do you take per year?",
        unit: "Flights",
        tooltip: "Count cross-continental flights over 3 hours. Connecting flights count as 1 trip.",
        type: "number",
        placeholder: "e.g., 1",
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
        label: "What kind of home do you live in?",
        tooltip: "This helps estimate your home's basic heating, cooling, and lighting needs.",
        type: "select",
        options: [
          { value: "room_shared", label: "Single Room or Shared Apartment" },
          { value: "apartment_small", label: "Small Apartment", description: "1 or 2 BHK" },
          { value: "apartment_medium", label: "Large Apartment", description: "3 or more BHK" },
          { value: "independent_house", label: "Independent House", description: "A standalone house, villa, or bungalow" },
        ],
      },
      {
        key: "energy_ac",
        label: "How often do you run the Air Conditioning?",
        tooltip: "AC units use a lot of electricity, which impacts your overall carbon footprint.",
        type: "select",
        options: [
          { value: "none", label: "No AC", description: "We use fans or air coolers instead" },
          { value: "seasonal", label: "Only in peak summer", description: "Just during heatwaves or very hot months" },
          { value: "heavy", label: "Frequently / Heavy use", description: "Multiple units running on most days" },
        ],
      },
      {
        key: "energy_cooking",
        label: "What is your main household cooking setup?",
        tooltip: "LPG cylinders are standard. Electric induction plates are cleaner, depending on where your electricity comes from.",
        type: "select",
        options: [
          { value: "lpg", label: "LPG Gas Cylinder", description: "Piped or bottled cooking gas" },
          { value: "induction_electric", label: "Electric Induction", description: "A modern electric cooktop" },
          { value: "biomass_wood", label: "Traditional Stove", description: "Wood, charcoal, or biomass stoves" },
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
        label: "How would you describe your shopping habits?",
        tooltip: "Frugal: you fix things and only buy what you need. Moderate: you upgrade occasionally. Active: you love keeping up with the latest trends.",
        type: "select",
        options: [
          { value: "frugal", label: "Minimalist / Frugal", description: "I prefer repairing things and buying only the essentials" },
          { value: "moderate", label: "Moderate Shopper", description: "I pick up new clothes or gadgets every now and then" },
          { value: "active", label: "Frequent Shopper", description: "I regularly buy new clothes, gadgets, and trending items" },
        ],
      },
    ],
  },
];

const friendlyRecommendations = {
  rec_food_diet: {
    what: "Try adding a few more plant-based meals to your week.",
    why: "Traditional vegetarian staples like lentils, beans, and paneer have a much lower environmental impact than raising poultry or livestock.",
    how: "Swap out meat for a few dinners a week and enjoy classic, protein-packed dishes like dal, chole, or a hearty vegetable curry.",
  },
  rec_trans_public: {
    what: "Consider taking the public transit for longer commutes.",
    why: "Taking the train or a bus keeps you out of traffic jams and cuts down on the emissions your car creates while sitting idly in gridlock.",
    how: "Try using the local metro or express bus lanes for your daily route to work or school instead of driving individual trips.",
  },
  rec_energy_ac: {
    what: "Set your air conditioner to a comfortable 24°C.",
    why: "Bumping your AC setting up toward 24°C instead of freezing at 18°C can ease the strain on the power grid and lower your home energy bill by up to 24%.",
    how: "Use your AC's Eco mode or set a sleep timer at night so it switches off automatically once the room is cool.",
  },
  rec_energy_cooking: {
    what: "Give electric induction cooking a try.",
    why: "Switching to an induction cooktop means you're cooking with electricity rather than burning fossil fuels directly from a gas cylinder.",
    how: "Pick up a portable, single-burner induction plate to handle quick daily tasks like boiling water, making tea, or prepping breakfast.",
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
      const response = await axiosInstance.post("/api/calculate/", { inputs: answers });
      setResult(response.data);
    } catch (err) {
      setError("Server connection failed. Ensure your Django backend is running.");
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

  // Results view
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