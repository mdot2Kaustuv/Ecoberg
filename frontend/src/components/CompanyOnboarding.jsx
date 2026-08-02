import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Building2, ShieldCheck, ArrowRight, CheckCircle2, LogIn } from "lucide-react";
import AuthContext from "../utils/AuthContext";

const terms = [
  {
    title: "One account, one company",
    body: "Your company footprint will be linked to your existing EcoBerg account — you won't need a separate login.",
  },
  {
    title: "Your data stays yours",
    body: "We only use the numbers you enter to calculate emissions and generate recommendations. We never sell or share your company data.",
  },
  {
    title: "You can update anytime",
    body: "Recalculate as often as you like. Your latest submission is what shows up on your company dashboard.",
  },
];

export default function CompanyOnboarding() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [hasCompany, setHasCompany] = useState(null); // null | true | false
  const [agreed, setAgreed] = useState(false);

  const isLoggedIn = !!user;
  const canContinue = isLoggedIn && hasCompany === true && agreed;

  const handleContinue = () => {
    if (!canContinue) return;
    navigate("/company-details");
  };

  return (
    
    <div className="flex justify-center px-4 py-12 bg-[#F8FAF9] min-h-screen">
      <div className="w-full max-w-2xl">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-900 text-emerald-300 mb-4">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold text-emerald-950 tracking-tight">
            Register your company's footprint
          </h1>
          <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
            A couple of quick questions before we get to the form.
          </p>
        </div>

    

        {!isLoggedIn && (
          <div className="bg-white border border-amber-200 rounded-2xl shadow-sm p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-50 text-amber-600 mb-4">
              <LogIn className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-slate-800 text-lg mb-2">
              You need to be logged in first
            </h2>
            <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
              Company footprints are tied to your EcoBerg account, so we need to know who you are
              before you can register one.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/login"
                className="px-6 py-3 rounded-full bg-emerald-900 hover:bg-emerald-800 text-white font-semibold text-sm transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 rounded-full border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-semibold text-sm transition-colors"
              >
                Create an account
              </Link>
            </div>
          </div>
        )}

        {/* Rest of the flow only shows once actually logged in */}
        {isLoggedIn && (
          <div className="bg-white border border-emerald-900/10 rounded-2xl shadow-sm p-8 space-y-8">

            <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              Logged in as <span className="font-semibold">{user.username || user.email}</span>
            </div>

            {/* Question 1 */}
            <div>
              <h2 className="font-bold text-slate-800 text-base mb-3">
                Do you have a company you'd like to register?
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setHasCompany(true)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    hasCompany === true
                      ? "border-emerald-600 bg-emerald-50/50"
                      : "border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <span className="font-semibold text-sm text-slate-800">Yes, I do</span>
                  <p className="text-xs text-slate-400 mt-1">I want to track my company's emissions</p>
                </button>
                <button
                  type="button"
                  onClick={() => setHasCompany(false)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    hasCompany === false
                      ? "border-slate-300 bg-slate-50"
                      : "border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <span className="font-semibold text-sm text-slate-800">Not right now</span>
                  <p className="text-xs text-slate-400 mt-1">Just here for my personal footprint</p>
                </button>
              </div>
            </div>

            {/* If "Not right now" */}
            {hasCompany === false && (
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-5 text-sm text-slate-600">
                No worries at all — you can always come back to this later. In the meantime,{" "}
                <Link to="/quiz" className="font-semibold text-emerald-700 hover:underline">
                  take the personal carbon quiz
                </Link>{" "}
                instead.
              </div>
            )}

            {/* If "Yes" — show terms, gated on explicit agreement */}
            {hasCompany === true && (
              <>
                <div>
                  <h2 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Before you continue, a few things worth knowing
                  </h2>
                  <div className="space-y-4">
                    {terms.map((t) => (
                      <div key={t.title} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-semibold text-sm text-slate-800">{t.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{t.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <label className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-600">
                    I understand and agree to the above, and I confirm I'm authorized to submit
                    emissions data on behalf of this company.
                  </span>
                </label>

                <button
                  onClick={handleContinue}
                  disabled={!canContinue}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-emerald-900 hover:bg-emerald-800 disabled:opacity-40 disabled:pointer-events-none text-white font-semibold text-sm transition-colors"
                >
                  Continue to company form
                  <ArrowRight className="w-4 h-4" />
                </button>
                {!agreed && (
                  <p className="text-xs text-center text-slate-400 -mt-4">
                    Check the box above to continue.
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}