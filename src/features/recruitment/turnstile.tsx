import { useEffect, useRef, useState } from "react";
import { recruitmentEnvironment } from "./config";

export function TurnstileChallenge({ onToken, resetKey = 0 }: { onToken: (token: string) => void; resetKey?: number }) {
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  const [error, setError] = useState("");
  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    if (!recruitmentEnvironment.turnstileSiteKey || !container.current) return;
    let active = true;
    const render = () => {
      if (!active || !window.turnstile || !container.current || widgetId.current) return;
      widgetId.current = window.turnstile.render(container.current, {
        sitekey: recruitmentEnvironment.turnstileSiteKey,
        action: "vic_recruitment",
        callback: (token) => { setError(""); onTokenRef.current(token); },
        "expired-callback": () => onTokenRef.current(""),
        "error-callback": () => { setError("Không thể tải bước xác minh chống bot."); onTokenRef.current(""); },
        theme: "light",
      });
    };
    if (window.turnstile) render();
    else {
      const existing = document.querySelector<HTMLScriptElement>('script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]');
      const script = existing ?? document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.addEventListener("load", render, { once: true });
      script.addEventListener("error", () => setError("Không thể tải bước xác minh chống bot."), { once: true });
      if (!existing) document.head.appendChild(script);
    }
    return () => {
      active = false;
      if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
      widgetId.current = null;
    };
  }, []);

  useEffect(() => {
    if (!resetKey || !widgetId.current || !window.turnstile) return;
    window.turnstile.reset(widgetId.current);
    setError("");
  }, [resetKey]);
  if (!recruitmentEnvironment.turnstileSiteKey) return null;
  return <div><div ref={container} /><p className="mt-2 text-sm text-red-700" role="alert">{error}</p></div>;
}
