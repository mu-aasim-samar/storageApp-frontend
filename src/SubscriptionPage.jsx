import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import AppLayout from "./components/layout/AppLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import {
  createSubscription,
  verifySubscription,
  cancelSubscription,
} from "./api/subscriptionApi";
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  X,
  FlaskConical,
  Building2,
  Check,
  Shield,
  HelpCircle,
  AlertCircle,
  AlertTriangle,
  Copy,
  CreditCard,
} from "lucide-react";
import CancelSubscriptionModal from "./components/CancelSubscriptionModal";

/**
 * Executive Liquid Glass Subscription Icons
 */
function GlassStarterIcon({ className = "w-6 h-6" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="starterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
      <rect
        x="3"
        y="4"
        width="18"
        height="7"
        rx="2"
        stroke="url(#starterGrad)"
        strokeWidth="1.8"
        className="drop-shadow-[0_0_6px_rgba(56,189,248,0.7)]"
      />
      <rect
        x="3"
        y="13"
        width="18"
        height="7"
        rx="2"
        stroke="url(#starterGrad)"
        strokeWidth="1.8"
        className="drop-shadow-[0_0_6px_rgba(56,189,248,0.7)]"
      />
      <line
        x1="6.5"
        y1="7.5"
        x2="11.5"
        y2="7.5"
        stroke="#38bdf8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="6.5"
        y1="16.5"
        x2="11.5"
        y2="16.5"
        stroke="#38bdf8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="17" cy="7.5" r="1" fill="#22d3ee" />
      <circle cx="17" cy="16.5" r="1" fill="#4ade80" />
    </svg>
  );
}

function GlassProZapIcon({ className = "w-6 h-6" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="proZapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>
      <path
        d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
        stroke="url(#proZapGrad)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="url(#proZapGrad)"
        fillOpacity="0.25"
        className="drop-shadow-[0_0_14px_rgba(34,211,238,0.85)]"
      />
    </svg>
  );
}

function GlassUltimateShieldIcon({ className = "w-6 h-6" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="ultShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="50%" stopColor="#e879f9" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke="url(#ultShieldGrad)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="url(#ultShieldGrad)"
        fillOpacity="0.12"
        className="drop-shadow-[0_0_10px_rgba(251,113,133,0.7)]"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="#fb7185"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GlassCheckBullet({ isPro = false }) {
  return (
    <div
      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
        isPro
          ? "bg-cyan-500/20 border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.4)] text-cyan-300"
          : "bg-slate-500/10 dark:bg-white/[0.05] border-slate-300/40 dark:border-white/10 text-slate-500 dark:text-slate-400"
      }`}
    >
      <svg
        className={`w-3 h-3 ${isPro ? "text-cyan-300" : "text-slate-400"}`}
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          d="M2.5 6L4.5 8L9.5 3.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

const PLAN_TIERS = {
  starter: 0,
  pro: 1,
  ultimate: 2,
};

export default function SubscriptionPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [successPlan, setSuccessPlan] = useState(null);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState(null);
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const isAdmin = user?.role === "Admin" || user?.role === "Owner";
  const hasActivePaidPlan =
    user?.subscriptionStatus === "active" &&
    user?.subscriptionPlan &&
    user?.subscriptionPlan !== "Starter";

  useEffect(() => {
    const razorpayScript = document.querySelector("#razorpay-script");
    if (razorpayScript) return;
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.id = "razorpay-script";
    document.body.appendChild(script);
  }, []);

  const plans = [
    {
      id: "free_plan",
      name: "Starter",
      storage: "100 MB",
      price: "Free",
      period: "",
      description: "Perfect for testing the waters and light file backups.",
      icon: GlassStarterIcon,
      containerGlow: "from-cyan-500/10 to-indigo-500/5",
      badgeBorder: "border-cyan-400/30",
      iconBg:
        "bg-cyan-500/15 border-cyan-400/30 shadow-[0_0_16px_rgba(6,182,212,0.25)]",
      popular: false,
      features: [
        "100 MB Secure Cloud Storage",
        "Fast Direct Upload & Download",
        "Mobile & Desktop Access",
        "Community Support",
      ],
    },
    {
      id: isYearly ? "plan_TaPCBIKWZDXmH2" : "plan_TaP4pR1KzOjoAC",
      name: "Pro",
      storage: "500 MB",
      price: isYearly ? "₹990" : "₹99",
      period: isYearly ? "/yr" : "/mo",
      description:
        "Ideal for personal backups, multimedia, and active daily use.",
      icon: GlassProZapIcon,
      containerGlow: "from-cyan-500/25 via-sky-500/15 to-blue-600/10",
      badgeBorder: "border-cyan-400/60 shadow-[0_0_35px_rgba(6,182,212,0.28)]",
      iconBg:
        "bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-cyan-400/40 shadow-[0_0_24px_rgba(6,182,212,0.35)]",
      popular: true,
      features: [
        "500 MB High-Performance Storage",
        "Unlimited File Versioning",
        "Instant Secure Link Sharing",
        "Priority Customer Support",
        "Activity Logs & Audit Trail",
      ],
    },
    {
      id: isYearly ? "plan_TaPDMHVj5WRBYW" : "plan_TaP6lULZnkYYi0",
      name: "Ultimate",
      storage: "1 GB",
      price: isYearly ? "₹1990" : "₹199",
      period: isYearly ? "/yr" : "/mo",
      description:
        "Maximum bandwidth and capacity for creators and heavy files.",
      icon: GlassUltimateShieldIcon,
      containerGlow: "from-rose-500/10 to-purple-500/5",
      badgeBorder: "border-rose-400/30",
      iconBg:
        "bg-rose-500/15 border-rose-400/30 shadow-[0_0_16px_rgba(244,63,94,0.25)]",
      popular: false,
      features: [
        "1 GB Enterprise Cloud Vault",
        "Multi-Device Simultaneous Sync",
        "Advanced Encryption & Security",
        "24/7 VIP Dedicated Support",
        "Zero-Knowledge Privacy",
      ],
    },
  ];

  const handlePlanSelect = async (plan) => {
    if (plan.id === "free_plan") return;

    try {
      const data = await createSubscription(plan.id);

      if (data && data.subscriptionId) {
        openRazorpayPopup({
          subscriptionId: data.subscriptionId,
          planId: plan.id,
          planName: plan.name,
          user: user,
          onSuccess: async () => {
            // Refresh user context
            if (refreshUser) await refreshUser();

            // Refresh sidebar storage widget instantly
            window.dispatchEvent(new Event("storageUpdated"));

            // Open celebratory success modal
            setSuccessPlan({
              name: plan.name,
              storage: plan.storage,
            });
          },
        });
      } else {
        alert("Failed to initiate subscription with payment provider.");
      }
    } catch (error) {
      console.error("Error creating subscription:", error);
      alert(error.response?.data?.error || "Error initiating subscription");
    }
  };

  return (
    <AppLayout>
      <div className="relative max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-fade-up">
        {/* Ambient Subtle Center Aura (Centered, No Asymmetric Bleed) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/[0.03] rounded-full blur-[140px] pointer-events-none" />

        {/* ── Header ── */}
        <div className="text-center mb-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/35 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-[0_0_16px_rgba(6,182,212,0.25)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
            Transparent Pricing
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            Choose your{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              storage plan
            </span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Upgrade your account to unlock extra high-speed cloud space for your
            files, photos, and databases.
          </p>
        </div>

        {/* ── Billing Toggle (Liquid Glass Capsule) ── */}
        <div className="flex justify-center mb-14 relative z-10">
          <div className="inline-flex items-center p-1.5 bg-slate-200/80 dark:bg-[#080a10]/90 backdrop-blur-2xl rounded-2xl border border-slate-300/80 dark:border-white/10 shadow-inner">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-7 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                !isYearly
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/80 dark:bg-[#0c1422]/90 dark:text-cyan-300 dark:border-cyan-400/40 dark:shadow-[0_0_14px_rgba(6,182,212,0.25),inset_0_1px_1px_rgba(255,255,255,0.15)]"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border border-transparent"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                isYearly
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/80 dark:bg-[#0c1422]/90 dark:text-cyan-300 dark:border-cyan-400/40 dark:shadow-[0_0_14px_rgba(6,182,212,0.25),inset_0_1px_1px_rgba(255,255,255,0.15)]"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border border-transparent"
              }`}
            >
              Yearly
              <span className="text-[11px] font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 border border-cyan-300/80 px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                2 months off
              </span>
            </button>
          </div>
        </div>

        {/* ── Pricing Cards (Liquid Glass Prisms) ── */}
        <div className="grid md:grid-cols-3 gap-8 items-stretch relative z-10">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            const currentPlanName = (
              user?.subscriptionPlan || "Starter"
            ).toLowerCase();
            const currentTier = PLAN_TIERS[currentPlanName] ?? 0;
            const planTier = PLAN_TIERS[plan.name.toLowerCase()] ?? 0;
            const isCurrentPlan = currentTier === planTier;
            const isLowerTier = currentTier > planTier;
            const isUpgrade = currentTier < planTier;

            return (
              <div
                key={plan.name}
                className={`relative rounded-3xl p-8 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between ${
                  plan.popular
                    ? "bg-gradient-to-b from-cyan-500/15 via-white/80 to-white/95 dark:from-cyan-500/15 dark:via-[#070b14]/95 dark:to-[#04060a]/98 border-2 border-cyan-400/60 shadow-[0_16px_36px_rgba(6,182,212,0.2),inset_0_1px_1px_rgba(255,255,255,0.25)] md:-translate-y-3"
                    : "bg-white dark:bg-[#08090d] border border-slate-200/80 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.16] shadow-xl shadow-slate-200/40 dark:shadow-[0_12px_36px_rgba(0,0,0,0.5)]"
                }`}
              >
                {/* Specular Top Rim Glint */}
                <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-full pointer-events-none" />

                {/* Popular Floating Glass Ribbon */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1 rounded-full bg-slate-900/95 dark:bg-[#040812] border border-cyan-400/70 shadow-[0_0_20px_rgba(6,182,212,0.45),inset_0_1px_1px_rgba(255,255,255,0.35)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
                    <span className="text-[11px] font-black tracking-widest uppercase text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                      Most Popular
                    </span>
                  </div>
                )}

                <div>
                  {/* Icon & Plan Name Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border backdrop-blur-xl ${plan.iconBg}`}
                    >
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-wide">
                        {plan.name}
                      </h3>
                      <div
                        className={
                          plan.popular
                            ? "text-cyan-400 font-bold text-sm tracking-wide drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                            : "text-slate-500 dark:text-slate-400 font-semibold text-sm tracking-wide"
                        }
                      >
                        {plan.storage} Cloud Vault
                      </div>
                    </div>
                  </div>

                  {/* Price display */}
                  <div className="mb-4 flex items-baseline gap-1">
                    <span className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-slate-500 dark:text-slate-400 font-semibold text-sm">
                        {plan.period}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed min-h-[36px]">
                    {plan.description}
                  </p>

                  {/* Feature Checklist */}
                  <div className="space-y-3 mb-8 pt-6 border-t border-slate-200/60 dark:border-white/[0.08]">
                    {plan.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300"
                      >
                        <GlassCheckBullet isPro={plan.popular} />
                        <span className="font-medium">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action CTA Button */}
                <div className="w-full">
                  <button
                    onClick={() => isUpgrade && handlePlanSelect(plan)}
                    disabled={isCurrentPlan || isLowerTier}
                    className={`w-full py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all duration-200 ${
                      isCurrentPlan
                        ? "bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.15)] cursor-default opacity-90"
                        : isLowerTier
                          ? "bg-slate-100/60 dark:bg-white/[0.03] text-slate-400 dark:text-slate-500 border border-slate-200/50 dark:border-white/[0.05] cursor-not-allowed opacity-60"
                          : plan.popular
                            ? "cursor-pointer bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black shadow-[0_6px_28px_rgba(6,182,212,0.5),inset_0_1px_1px_rgba(255,255,255,0.6)] hover:scale-[1.02] active:scale-[0.98]"
                            : "cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-slate-800 dark:text-white border border-slate-200/80 dark:border-white/10 hover:border-cyan-400/40 shadow-sm hover:scale-[1.01] active:scale-[0.99]"
                    }`}
                  >
                    {isCurrentPlan ? (
                      <span className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                        Current Plan
                      </span>
                    ) : isLowerTier ? (
                      <span className="flex items-center justify-center gap-1.5">
                        {plan.id === "free_plan"
                          ? "Included in your plan"
                          : "Downgrade Unavailable"}
                      </span>
                    ) : (
                      `Upgrade to ${plan.name}`
                    )}
                  </button>
                  {isLowerTier && plan.id !== "free_plan" && (
                    <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 mt-2 font-medium">
                      Your active {user?.subscriptionPlan} plan has higher capacity.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Admin Test Mode Simulation Guide (Admin Only) ── */}
        {isAdmin && (
          <div className="mt-14 pt-8 border-t border-slate-200/60 dark:border-white/[0.08] relative z-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-slate-100/70 dark:bg-white/[0.03] backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-lg">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-400/35 flex items-center justify-center text-amber-500 dark:text-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.25)] shrink-0">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    Payment Test Sandbox Guide
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Instructions for testing recurring E-Mandate & Netbanking subscriptions in Razorpay test mode.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTestModal(true)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-600 dark:text-amber-300 border border-amber-400/40 shadow-[0_0_14px_rgba(245,158,11,0.2)] hover:scale-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>How to Test Payment</span>
              </button>
            </div>
          </div>
        )}

        {/* ── Discreet Membership Management Footer (Non-Intrusive) ── */}
        {hasActivePaidPlan && (
          <div className="mt-14 pt-6 border-t border-slate-200/40 dark:border-white/[0.04] text-center text-xs text-slate-500 dark:text-slate-500 relative z-10">
            <span>Need to make changes to your active {user?.subscriptionPlan} plan? </span>
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              className="text-slate-400 hover:text-rose-400 underline underline-offset-4 transition-colors cursor-pointer ml-1"
            >
              Cancel subscription
            </button>
          </div>
        )}

        {/* Celebration Success Modal */}
        {successPlan && (
          <SubscriptionSuccessModal
            planName={successPlan.name}
            storage={successPlan.storage}
            onClose={() => setSuccessPlan(null)}
            onGoToDrive={() => navigate("/")}
          />
        )}

        {/* Cancel Subscription Modal */}
        {showCancelModal && (
          <CancelSubscriptionModal
            currentPlan={user?.subscriptionPlan}
            onClose={() => setShowCancelModal(false)}
            onSuccess={async () => {
              if (refreshUser) await refreshUser();
              window.dispatchEvent(new Event("storageUpdated"));
              setCancelSuccessMsg(
                "Your subscription has been cancelled and reverted to the Starter free tier.",
              );
            }}
          />
        )}

        {/* Cancel Success Notification Toast */}
        {cancelSuccessMsg && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#090d16]/95 border border-emerald-400/40 text-white shadow-2xl backdrop-blur-xl flex items-center gap-3 animate-fade-in max-w-md">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs text-slate-200">{cancelSuccessMsg}</span>
            <button
              onClick={() => setCancelSuccessMsg(null)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Admin Test Payment Guide Modal */}
        {showTestModal && (
          <AdminTestPaymentModal onClose={() => setShowTestModal(false)} />
        )}
      </div>
    </AppLayout>
  );
}

function SubscriptionSuccessModal({ planName, storage, onClose, onGoToDrive }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center z-[9999] p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#07090e]/95 border border-cyan-400/40 rounded-3xl p-8 shadow-[0_0_80px_rgba(6,182,212,0.3)] text-center animate-scale-in overflow-hidden backdrop-blur-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-56 h-56 bg-cyan-500/25 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Celebratory Icon Badge */}
        <div className="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-3xl blur-lg opacity-60 animate-pulse" />
          <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500/20 via-sky-500/30 to-blue-600/20 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4)]">
            <Sparkles className="w-9 h-9 text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
          </div>
        </div>

        {/* Headings */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-3">
          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Payment Verified</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">
          Welcome to {planName}!
        </h2>

        <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto mb-6">
          Your cloud vault has been upgraded successfully. Your new high-speed capacity is ready to use immediately.
        </p>

        {/* Storage Highlight Pill */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div className="text-left">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Active Storage Vault
            </div>
            <div className="text-lg font-black text-white flex items-center gap-2">
              <span className="text-cyan-400">{storage}</span>
              <span className="text-xs font-medium text-slate-500">Total Capacity</span>
            </div>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            Active
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-1/3 py-3 rounded-xl font-bold text-xs text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={onGoToDrive}
            className="w-full sm:w-2/3 py-3 rounded-xl font-black text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 shadow-[0_0_24px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>Go to My Drive</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function openRazorpayPopup({ subscriptionId, planId, planName, user, onSuccess }) {
  const rzp = new window.Razorpay({
    key: import.meta.env.VITE_RAZORPAY_ID,
    name: "MyDrive Cloud",
    description: `Upgrade to ${planName} Plan`,
    subscription_id: subscriptionId,
    prefill: {
      name: user?.name || "Test User",
      email: user?.email || "user@example.com",
    },
    theme: {
      color: "#06b6d4", 
    },
    handler: async function (response) {
      try {
        await verifySubscription({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_subscription_id: response.razorpay_subscription_id,
          razorpay_signature: response.razorpay_signature,
          planId: planId,
        });

        if (onSuccess) {
          await onSuccess();
        }
      } catch (err) {
        console.error("Payment verification failed:", err);
        alert(err.response?.data?.error || "Payment verification failed on server");
      }
    },
  });

  rzp.on("payment.failed", function (response) {
    console.error("Payment failed:", response.error);
    alert(`Payment failed: ${response.error.description}`);
  });

  rzp.open();
}

function AdminTestPaymentModal({ onClose }) {
  const [activeTab, setActiveTab] = useState("hdfc");
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const copyText = (val, key) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const CopyRow = ({ label, value, id }) => {
    const isCopied = copiedKey === id;
    return (
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/70 dark:bg-black/50 border border-slate-200/50 dark:border-white/10 hover:border-amber-400/40 transition-all">
        <span className="text-[11px] font-semibold text-slate-400">
          {label}
        </span>
        <div className="flex items-center gap-2">
          <code className="text-xs font-mono font-bold text-amber-300 dark:text-amber-400 select-all">
            {value}
          </code>
          <button
            type="button"
            onClick={() => copyText(value, id)}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
              isCopied
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-400/40"
                : "bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 border border-white/10 hover:text-white"
            }`}
          >
            {isCopied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center z-[9999] p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#07090e]/95 border border-amber-400/40 rounded-3xl p-6 sm:p-7 shadow-[0_0_80px_rgba(245,158,11,0.25)] animate-scale-in overflow-hidden backdrop-blur-2xl max-h-[92vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-5 shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.3)] shrink-0">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Razorpay Test Bank Credentials
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Copy test bank info directly for sandbox recurring mandate testing.
            </p>
          </div>
        </div>

        {/* Quick 3-Step Flow Banner */}
        <div className="mb-4 p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-slate-300 shrink-0">
          <div className="font-bold text-amber-400 mb-1 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
            <span>Fast Test Flow:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-[10px] shrink-0">1</span>
              <span>Click <strong>Upgrade Plan</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-[10px] shrink-0">2</span>
              <span>Select <strong>Netbanking</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-[10px] shrink-0">3</span>
              <span>Click <strong>Success</strong> in simulator</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mb-4 p-1 bg-slate-900/60 rounded-2xl border border-white/10 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("hdfc")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "hdfc"
                ? "bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm"
                : "text-slate-400 hover:text-white border border-transparent"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>HDFC Bank (Recommended)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("sbi")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "sbi"
                ? "bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm"
                : "text-slate-400 hover:text-white border border-transparent"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>SBI Bank</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("cards")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "cards"
                ? "bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm"
                : "text-slate-400 hover:text-white border border-transparent"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Test Cards</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-2.5 overflow-y-auto pr-1 flex-1">
          {activeTab === "hdfc" && (
            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 text-[11px] text-cyan-200">
                <strong>HDFC E-Mandate Simulator:</strong> When redirected to HDFC test simulator, simply click the green <strong>"Success"</strong> button to authorize the mandate. If prompted for details, use the copyable fields below:
              </div>
              <CopyRow label="Bank Name" value="HDFC Bank" id="hdfc-bank" />
              <CopyRow label="Customer ID / User ID" value="12345678" id="hdfc-user" />
              <CopyRow label="Net Banking Password" value="testpassword" id="hdfc-pass" />
              <CopyRow label="Account Number" value="111222333444" id="hdfc-acc" />
              <CopyRow label="IFSC Code" value="HDFC0000001" id="hdfc-ifsc" />
              <CopyRow label="Test OTP" value="1234" id="hdfc-otp" />
            </div>
          )}

          {activeTab === "sbi" && (
            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-400/30 text-[11px] text-indigo-200">
                <strong>SBI Netbanking Simulator:</strong> Choose SBI in the bank list. On the simulator screen, click <strong>"Success"</strong> or enter the test credentials below:
              </div>
              <CopyRow label="Bank Name" value="State Bank of India (SBI)" id="sbi-bank" />
              <CopyRow label="User ID / Username" value="sbitest" id="sbi-user" />
              <CopyRow label="Net Banking Password" value="testpassword" id="sbi-pass" />
              <CopyRow label="Account Number" value="12345678901" id="sbi-acc" />
              <CopyRow label="IFSC Code" value="SBIN0000001" id="sbi-ifsc" />
              <CopyRow label="Test OTP" value="1234" id="sbi-otp" />
            </div>
          )}

          {activeTab === "cards" && (
            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-400/30 text-[11px] text-purple-200">
                <strong>Recurring Mandate Cards:</strong> Razorpay recurring subscriptions support tokenized Visa & Mastercard test cards:
              </div>
              <CopyRow label="Visa Test Card" value="4111 1111 1111 1111" id="card-visa" />
              <CopyRow label="Mastercard Test Card" value="5123 4567 8901 2345" id="card-mc" />
              <CopyRow label="Expiry (MM/YY)" value="12/28" id="card-exp" />
              <CopyRow label="CVV" value="123" id="card-cvv" />
              <CopyRow label="Card OTP" value="1234" id="card-otp" />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            Click any field to copy • Razorpay Test Mode
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            Done, Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}