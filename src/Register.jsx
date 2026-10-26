import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "./api/authApi";
import { registerUser } from "./api/userApi";
import { Eye, EyeOff, AlertCircle, CheckCircle2, User, Mail, Database, Check, HardDrive } from "lucide-react";
import { useTheme } from "./context/ThemeContext";
import { Sun, Moon } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (serverError) setServerError("");
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(formData);
      setIsSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setServerError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { icon: User, name: "name", label: "Full name", type: "text", placeholder: "John Doe" },
    { icon: Mail, name: "email", label: "Email address", type: "email", placeholder: "you@example.com" },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#050608] text-slate-800 dark:text-slate-100 selection:bg-cyan-500/20 selection:text-cyan-300 relative overflow-hidden font-sans">
      {/* ── Background Ambient Glows ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[350px] rounded-full bg-cyan-500/[0.04] blur-[140px]" />
        <div className="absolute -bottom-32 -right-32 w-[550px] h-[550px] rounded-full bg-indigo-500/[0.03] blur-[140px]" />
      </div>

      {/* ── Left brand panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden border-r border-slate-200/80 dark:border-white/[0.07] bg-white/40 dark:bg-[#06070a] backdrop-blur-2xl z-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Executive Luminous Glass Cube Logo */}
          <Link to="/landing" className="flex items-center gap-3 group w-fit">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-b from-cyan-400/35 via-indigo-500/25 to-slate-900/60 p-[1px] shadow-[0_0_16px_rgba(6,182,212,0.35)] shrink-0 transition-transform duration-300 group-hover:scale-105 border border-cyan-400/40">
              <div className="w-full h-full bg-[#0c1322]/90 backdrop-blur-md rounded-[10px] flex items-center justify-center">
                <Database className="w-4 h-4 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
              </div>
              <div className="absolute top-0.5 left-1.5 right-1.5 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent rounded-full pointer-events-none" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              MyDrive
            </span>
          </Link>

          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-6 shadow-[0_0_16px_rgba(6,182,212,0.15)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
              Instant Cloud Provisioning
            </div>

            <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white mb-4">
              Start your cloud{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                journey today
              </span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-8">
              Create your account in seconds and unlock your high-speed personal cloud workspace with full folder organization.
            </p>

            <div className="p-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.08] shadow-lg">
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_14px_rgba(6,182,212,0.2)]">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">15 GB Free Cloud Storage</div>
                  <div className="text-cyan-400 text-xs font-semibold">Zero cost • No credit card required</div>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  "Upload files & organize nested folders",
                  "Access from all mobile and desktop devices",
                  "Encrypted sessions & private by default",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300 font-medium">
                    <div className="w-5 h-5 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-400">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 pt-6 border-t border-slate-200/80 dark:border-white/[0.07]">
            <p>© 2026 MyDrive. Enterprise Cloud Platform.</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee] animate-pulse" />
              <span className="font-medium text-cyan-400">Free Tier Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative z-10">
        {/* Top Right Actions */}
        <div className="absolute top-6 right-6 flex items-center gap-3">
          <Link
            to="/subscription"
            className="text-xs font-medium px-3 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all"
          >
            Pricing
          </Link>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.06] border border-transparent dark:hover:border-white/10 transition-all"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>

        <div className="w-full max-w-sm sm:max-w-md p-8 sm:p-10 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.08] shadow-2xl relative">
          {/* Mobile logo */}
          <Link to="/landing" className="lg:hidden flex items-center gap-2.5 mb-8 group">
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-b from-cyan-400/35 via-indigo-500/25 to-slate-900/60 p-[1px] shadow-[0_0_14px_rgba(6,182,212,0.35)] shrink-0 border border-cyan-400/40">
              <div className="w-full h-full bg-[#0c1322]/90 backdrop-blur-md rounded-[10px] flex items-center justify-center">
                <Database className="w-4 h-4 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
              </div>
            </div>
            <span className="font-extrabold text-slate-900 dark:text-white text-lg">MyDrive</span>
          </Link>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">Create account</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-7 font-normal">
            Already have an account?{" "}
            <Link to="/login" className="text-cyan-500 dark:text-cyan-400 font-semibold hover:text-cyan-300 hover:underline transition-colors">
              Sign in
            </Link>
          </p>

          {/* Success state */}
          {isSuccess && (
            <div className="flex items-center gap-2.5 p-3.5 mb-5 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400 text-sm animate-fade-up">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Account created successfully! Redirecting…</span>
            </div>
          )}

          {/* Error */}
          {serverError && (
            <div className="flex items-center gap-2.5 p-3.5 mb-5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 text-sm animate-fade-up">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  {label}
                </label>
                <input
                  id={`register-${name}`}
                  name={name}
                  type={type}
                  required
                  placeholder={placeholder}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl text-sm border outline-none transition-all duration-200 bg-slate-50 dark:bg-[#0c0e14] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border-slate-200 dark:border-white/[0.08] focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>
            ))}

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="register-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-11 rounded-xl text-sm border outline-none transition-all duration-200 bg-slate-50 dark:bg-[#0c0e14] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border-slate-200 dark:border-white/[0.08] focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="register-submit"
              disabled={loading || isSuccess}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-cyan-500 hover:from-cyan-400 hover:to-blue-500 dark:hover:from-cyan-300 dark:hover:to-cyan-400 text-white dark:text-slate-950 font-bold text-sm shadow-md shadow-cyan-500/25 dark:shadow-[0_2px_14px_rgba(6,182,212,0.4)] transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isSuccess ? "Account created!" : loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-white/[0.08]" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-white dark:bg-[#07080c]">
                or sign up with
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const data = await loginWithGoogle(credentialResponse.credential);
                  if (!data.error) navigate("/");
                } catch (err) {
                  setServerError("Google sign-up failed. Please try again.");
                }
              }}
              onError={() => setServerError("Google sign-up failed.")}
              theme={theme === "dark" ? "filled_black" : "outline"}
              text="signup_with"
              shape="rectangular"
              size="large"
              width="320"
            />
          </div>

          <p className="text-center mt-7 text-xs text-slate-400 dark:text-slate-500">
            By creating an account, you agree to our{" "}
            <span className="text-cyan-500 dark:text-cyan-400 cursor-pointer hover:underline">
              Terms
            </span>{" "}
            and{" "}
            <span className="text-cyan-500 dark:text-cyan-400 cursor-pointer hover:underline">
              Privacy Policy
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
