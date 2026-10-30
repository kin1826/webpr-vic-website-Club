import { useEffect, useRef, useState } from "react";
import { recruitmentEnvironment } from "./config";

export function TurnstileChallenge({ onToken }: { onToken: (token: string) => void }) {
  const container = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!recruitmentEnvironment.turnstileSiteKey || !container.current) return;
    let widgetId = "";
    const render = () => {
      if (!window.turnstile || !container.current || container.current.childElementCount) return;
      widgetId = window.turnstile.render(container.current, { sitekey: recruitmentEnvironment.turnstileSiteKey, callback: (token) => { setError(""); onToken(token); }, "expired-callback": () => onToken(""), "error-callback": () => { setError("Không thể tải bước xác minh chống bot."); onToken(""); }, theme: "light" });
    };
    if (window.turnstile) render();
    else {
      const script = document.createElement("script"); script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"; script.async = true; script.defer = true; script.onload = render; script.onerror = () => setError("Không thể tải bước xác minh chống bot."); document.head.appendChild(script);
    }
    return () => { if (widgetId && window.turnstile) window.turnstile.reset(widgetId); };
  }, [onToken]);
  if (!recruitmentEnvironment.turnstileSiteKey) return null;
  return <div><div ref={container} /><p className="mt-2 text-sm text-red-700" role="alert">{error}</p></div>;
}
