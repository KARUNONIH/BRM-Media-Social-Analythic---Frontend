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
          }) => void;
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithGoogle, loginAsDemoOwner } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

  const handleGoogleCallback = useCallback(
    async (response: { credential?: string }) => {
      if (!response?.credential) {
        setError("Kredensial Google tidak ditemukan.");
        return;
      }
      setLoading(true);
      setError(null);
      const success = await loginWithGoogle(response.credential);
      setLoading(false);
      if (success) {
        navigate("/dashboard");
      } else {
        setError("Gagal memvalidasi kredensial Google ke backend.");
      }
    },
    [loginWithGoogle, navigate]
  );

  useEffect(() => {
    if (!googleClientId) return;

    const initGsi = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCallback,
        });

        const btn = document.getElementById("google-btn-container");
        if (btn) {
          btn.innerHTML = "";
          window.google.accounts.id.renderButton(btn, {
            theme: "outline",
            size: "large",
            text: "signin_with",
            shape: "rectangular",
            width: 320,
          });
        }
      }
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
  }, [googleClientId, handleGoogleCallback]);

  const handleDemoLogin = () => {
    loginAsDemoOwner();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded shadow-sm border border-slate-200 p-8">
          <div className="flex flex-col items-center mb-6 text-center">
            <img
              src="/images/brm-logo.png"
              alt="Bumi Rekayasa Mandiri"
              className="h-14 w-14 object-contain mb-3"
            />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              PT Bumi Rekayasa Mandiri
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-[280px]">
              Media Social Analytics &amp; WhatsApp AI Assistant
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {googleClientId ? (
              <div className="flex justify-center w-full min-h-[44px]">
                <div id="google-btn-container" className="w-full flex justify-center" />
              </div>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-800 text-xs text-center">
                <span className="font-semibold">Info Konfigurasi:</span> VITE_GOOGLE_CLIENT_ID belum diisi di .env.
              </div>
            )}

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400">Atau Akses Cepat</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 border border-[#8B6914] bg-[#8B6914] hover:bg-[#735710] text-white rounded text-xs font-semibold cursor-pointer transition-colors shadow-xs"
            >
              <RiShieldUserLine size={16} />
              <span>Masuk Sebagai Owner (Demo)</span>
            </button>

            {loading && (
              <p className="text-xs text-center font-medium text-[#8B6914] animate-pulse">
                Memverifikasi akun Google...
              </p>
            )}

            <p className="text-[11px] text-center text-slate-400 pt-2">
              Single Sign-On Resmi Internal PT BRM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
