import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { RiShieldUserLine } from "react-icons/ri";
import { useAuth } from "../../providers/auth";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              type?: "standard" | "icon";
              text?: "signin_with" | "signup_with" | "continue_with" | "signin";
              shape?: "rectangular" | "pill" | "circle" | "square";
              logo_alignment?: "left" | "center";
              width?: number | string;
            }
          ) => void;
        };
      };
    };
  }
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithGoogle, loginAsDemoOwner, loginAsDemoAdmin } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

  const handleGoogleCallback = useCallback(
    async (response: { credential?: string }) => {
      if (!response?.credential) {
        setError("Gagal menerima kredensial otentikasi Google.");
        return;
      }
      setLoading(true);
      setError(null);
      const success = await loginWithGoogle(response.credential);
      setLoading(false);
      if (success) {
        navigate("/dashboard");
      } else {
        setError("Gagal masuk menggunakan akun Google.");
      }
    },
    [loginWithGoogle, navigate]
  );

  const renderGoogleButton = useCallback(() => {
    if (window.google?.accounts?.id && googleClientId) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCallback,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        const btn = document.getElementById("google-btn-container");
        if (btn) {
          btn.innerHTML = "";
          const targetWidth = Math.min(
            Math.max(btn.offsetWidth || 360, 320),
            400
          );
          window.google.accounts.id.renderButton(btn, {
            theme: "outline",
            size: "large",
            type: "standard",
            text: "continue_with",
            shape: "rectangular",
            logo_alignment: "left",
            width: targetWidth,
          });
        }
      } catch (err) {
        console.warn("Google GSI error:", err);
      }
    }
  }, [googleClientId, handleGoogleCallback]);

  useEffect(() => {
    const initGsi = () => {
      requestAnimationFrame(() => {
        renderGoogleButton();
      });
    };

    if (document.getElementById("google-jssdk")) {
      initGsi();
    } else {
      const script = document.createElement("script");
      script.id = "google-jssdk";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGsi;
      document.head.appendChild(script);
    }
  }, [renderGoogleButton]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded shadow-xl border border-gray-100 p-8">
          <div className="flex flex-col items-center mb-8 text-center">
            <img
              src="/images/brm-logo.png"
              alt="Bumi Rekayasa Mandiri"
              className="h-16 w-16 object-contain mb-3 drop-shadow-xs"
            />
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Bumi Rekayasa Mandiri
            </h1>
            <p className="text-xs text-gray-500 mt-1 max-w-[280px] leading-relaxed">
              Sistem Analitik Media Sosial &amp; Otomasi WhatsApp Agentic AI
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="flex justify-center w-full min-h-[44px]">
              <div
                id="google-btn-container"
                className="w-full flex justify-center min-h-[44px]"
              />
            </div>

            {loading && (
              <p className="text-xs text-center font-medium text-[#8B6914] animate-pulse">
                Memverifikasi akun Google...
              </p>
            )}

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-400 font-medium">Atau Akses Cepat</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  loginAsDemoOwner();
                  navigate("/dashboard");
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 border border-[#8B6914] bg-[#8B6914] hover:bg-[#6B5010] text-white rounded text-xs font-semibold cursor-pointer transition-all shadow-xs"
              >
                <RiShieldUserLine size={15} />
                <span>Masuk (Owner)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  loginAsDemoAdmin();
                  navigate("/dashboard");
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 rounded text-xs font-semibold cursor-pointer transition-all shadow-xs"
              >
                <RiShieldUserLine size={15} className="text-[#8B6914]" />
                <span>Masuk (Admin)</span>
              </button>
            </div>

            <p className="text-[11px] text-center text-gray-400 pt-2">
              Single Sign-On (SSO) resmi internal PT Bumi Rekayasa Mandiri
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
