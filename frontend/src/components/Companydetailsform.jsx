import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Lock, ShieldQuestion, RefreshCcw, Eye, EyeOff } from "lucide-react";
import useAxios from "../utils/Axios";
import AuthContext from "../utils/AuthContext";

function makeCaptcha() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  return { a, b, answer: a + b };
}

export default function CompanyDetailsForm() {
  const api = useAxios();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [details, setDetails] = useState({
    company_name: "",
    industry: "",
    registration_number: "",
  });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState(makeCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");

  const [stage, setStage] = useState("form");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCaptcha(makeCaptcha());
  }, []);

  const refreshCaptcha = () => {
    setCaptcha(makeCaptcha());
    setCaptchaInput("");
  };

  const handleDetailChange = (key, value) => {
    setDetails((d) => ({ ...d, [key]: value }));
  };

  const validateForm = () => {
    if (!details.company_name.trim()) return "Company name is required.";
    if (!details.industry.trim()) return "Please select or enter an industry.";
    if (!password) return "Please re-enter your password to confirm it's you.";
    if (parseInt(captchaInput, 10) !== captcha.answer) return "Captcha answer is incorrect.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      refreshCaptcha();
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/account/verify-password/", { password });
      if (res.data.ok) {
        sessionStorage.setItem("companyDetails", JSON.stringify(details));
        navigate("/registercompany");
      } else {

        await api.post("/account/send-company-otp/", {});
        setStage("otp");
      }
    } catch (err) {
      setError("Something went wrong verifying your password. Please try again.");
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/account/verify-company-otp/", { code: otp });
      if (res.data.ok) {
        sessionStorage.setItem("companyDetails", JSON.stringify(details));
        navigate("/registercompany");
      } else {
        setError(res.data.error || "Invalid code. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong verifying the code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setError("");
    try {
      await api.post("/account/send-company-otp/", {});
      setError("A new code has been sent to your email.");
    } catch {
      setError("Couldn't resend the code. Please try again shortly.");
    }
  };

  return (
    <div className="flex justify-center px-4 py-12 bg-[#F8FAF9] min-h-screen">
      <div className="w-full max-w-xl">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-900 text-emerald-300 mb-4">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold text-emerald-950 tracking-tight">
            Company Details
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Tell us a bit about your company, then confirm it's really you.
          </p>
        </div>

        <div className="bg-white border border-emerald-900/10 rounded-2xl shadow-sm p-8">

          {stage === "form" && (
            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Company Name
                </label>
                <input
                  type="text"
                  value={details.company_name}
                  onChange={(e) => handleDetailChange("company_name", e.target.value)}
                  placeholder="e.g. Himalayan Textiles Pvt. Ltd."
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Industry
                </label>
                <input
                  type="text"
                  value={details.industry}
                  onChange={(e) => handleDetailChange("industry", e.target.value)}
                  placeholder="e.g. Manufacturing, Retail, IT Services, Hospitality"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Registration Number <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={details.registration_number}
                  onChange={(e) => handleDetailChange("registration_number", e.target.value)}
                  placeholder="e.g. company registration or PAN/VAT number"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  Confirm your password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your account password"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-1.5">
                  Logged in as <span className="font-semibold">{user?.username || user?.email}</span>.
                  If your password doesn't match, we'll send a verification code to your email instead.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <ShieldQuestion className="w-4 h-4 text-emerald-600" />
                  Quick check — are you human?
                </label>
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-base font-bold text-slate-700 select-none">
                    {captcha.a} + {captcha.b} = ?
                  </div>
                  <input
                    type="number"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    placeholder="Answer"
                    className="w-24 rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="p-2.5 rounded-xl text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                    title="Get a new question"
                  >
                    <RefreshCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-sm font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-emerald-900 hover:bg-emerald-800 disabled:opacity-60 text-white font-semibold text-sm transition-colors"
              >
                {loading ? "Verifying..." : "Continue"}
              </button>
            </form>
          )}

          {stage === "otp" && (
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 text-sm text-amber-800">
                That password didn't match. We've sent a 6-digit code to your email —
                enter it below to continue.
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm tracking-widest font-mono text-center focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {error && (
                <div className="text-sm font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-emerald-900 hover:bg-emerald-800 disabled:opacity-60 text-white font-semibold text-sm transition-colors"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>

              <button
                type="button"
                onClick={resendOtp}
                className="w-full text-center text-xs font-semibold text-emerald-700 hover:underline"
              >
                Resend Code
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}