import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { cancelSubscription } from "../api/subscriptionApi";
import { AlertTriangle, X } from "lucide-react";

export default function CancelSubscriptionModal({ currentPlan, onClose, onSuccess }) {
  const [selectedReason, setSelectedReason] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const reasons = [
    {
      id: "expensive",
      label: "Price is too high / Looking for a cheaper alternative",
    },
    {
      id: "not_using",
      label: "I don't use it enough / Don't need extra storage",
    },
    {
      id: "missing_features",
      label: "Missing specific features I need for my workflow",
    },
    {
      id: "alternative",
      label: "Switching to another cloud storage service",
    },
    {
      id: "temporary",
      label: "Taking a temporary break, will resubscribe later",
    },
    {
      id: "other",
      label: "Other reason",
    },
  ];

  const handleConfirmCancel = async () => {
    if (!selectedReason) {
      setError("Please select a reason for cancelling.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const chosenReasonText =
        reasons.find((r) => r.id === selectedReason)?.label || selectedReason;

      await cancelSubscription({
        reason: chosenReasonText,
        feedback: feedback.trim(),
      });

      window.dispatchEvent(new Event("storageUpdated"));
      if (onSuccess) await onSuccess();
      onClose();
    } catch (err) {
      console.error("Cancellation error:", err);
      setError(
        err.response?.data?.error ||
          "Failed to cancel subscription. Please try again.",
      );
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center z-[9999] p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#07090e]/95 border border-rose-500/40 rounded-3xl p-6 sm:p-7 shadow-[0_0_80px_rgba(244,63,94,0.25)] animate-scale-in overflow-hidden backdrop-blur-2xl max-h-[92vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-4 shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-400 shadow-[0_0_16px_rgba(244,63,94,0.3)] shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-black text-white tracking-tight">
              Cancel Subscription
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Active plan: <strong className="text-white">{currentPlan || "Pro"}</strong>
            </p>
          </div>
        </div>

        {/* Warning Callout */}
        <div className="mb-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-xs text-amber-200/90 shrink-0 text-left">
          <div className="font-bold text-amber-300 mb-1">
            Cancellation Policy:
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-200/80">
            <li>
              Your account immediately reverts to the free{" "}
              <strong>Starter (100 MB)</strong> plan.
            </li>
            <li>No further recurring payments will be billed to your card/bank.</li>
            <li>
              Your existing files remain safe, but new uploads will pause if
              storage exceeds 100 MB.
            </li>
          </ul>
        </div>

        {/* Reason Selector */}
        <div className="space-y-2 overflow-y-auto pr-1 flex-1 mb-4 text-left">
          <div className="text-xs font-bold text-slate-300 mb-1">
            Why are you cancelling? (Select one)
          </div>
          {reasons.map((r) => {
            const isSelected = selectedReason === r.id;
            return (
              <label
                key={r.id}
                onClick={() => {
                  setSelectedReason(r.id);
                  setError(null);
                }}
                className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                  isSelected
                    ? "bg-rose-500/15 border-rose-400/50 text-white shadow-sm"
                    : "bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.08] text-slate-300"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                    isSelected
                      ? "border-rose-400 bg-rose-500"
                      : "border-slate-500 bg-white/[0.04]"
                  }`}
                >
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
                <span>{r.label}</span>
              </label>
            );
          })}

          {/* Optional Feedback */}
          <div className="pt-2">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Any additional feedback or comments? (optional)"
              rows={2}
              className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400/50 resize-none transition-all"
            />
          </div>

          {error && (
            <div className="text-xs text-rose-400 font-semibold p-2.5 rounded-xl bg-rose-500/10 border border-rose-400/30">
              {error}
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 transition-all cursor-pointer"
          >
            Keep My Plan
          </button>
          <button
            type="button"
            onClick={handleConfirmCancel}
            disabled={isSubmitting || !selectedReason}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 shadow-[0_0_16px_rgba(244,63,94,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-2"
          >
            {isSubmitting ? "Cancelling..." : "Confirm Cancellation"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
