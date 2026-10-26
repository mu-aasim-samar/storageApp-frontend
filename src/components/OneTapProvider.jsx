import { useNavigate, useLocation } from "react-router-dom";
import { useGoogleOneTapLogin } from "@react-oauth/google";
import { loginWithGoogle } from "../api/authApi";

function OneTapProvider() {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on register (login page can still show One Tap alongside the button)
  const isRegisterPage = location.pathname === "/register";

  useGoogleOneTapLogin({
    disabled: isRegisterPage,

    onSuccess: async (credentialResponse) => {
      try {
        await loginWithGoogle(credentialResponse.credential);
        navigate("/");
      } catch (err) {
        console.error("One Tap login failed:", err);
      }
    },

    onError: () => {
      console.warn("[OneTap] Error during One Tap flow");
    },

    // Fires whenever Google decides to show / skip / dismiss the prompt
    promptMomentNotification: (notification) => {
      if (notification.isNotDisplayed()) {
        console.warn(
          "[OneTap] Not displayed. Reason:",
          notification.getNotDisplayedReason()
          // Common reasons:
          // "opt_out_or_no_session"  → user not signed into Google in this browser
          // "suppressed_by_user"     → user dismissed it recently (cooldown)
          // "invalid_client"         → client ID wrong
          // "missing_client_id"      → no client ID set
          // "browser_not_supported"  → unsupported browser
          // "unknown_reason"
        );
      }
      if (notification.isSkippedMoment()) {
        console.warn(
          "[OneTap] Skipped. Reason:",
          notification.getSkippedReason()
          // "auto_cancel" / "user_cancel" / "tap_outside" / "issuing_failed"
        );
      }
      if (notification.isDismissedMoment()) {
        console.warn(
          "[OneTap] Dismissed. Reason:",
          notification.getDismissedReason()
        );
      }
      if (notification.isDisplayMoment()) {
        console.log("[OneTap] Prompt is being displayed!");
      }
    },

    // Disable FedCM — required for localhost & avoids Chrome FedCM conflicts
    use_fedcm_for_prompt: false,

    // Don't dismiss when clicking outside — makes it easier to interact
    cancel_on_tap_outside: false,
  });

  return null;
}

export default OneTapProvider;
