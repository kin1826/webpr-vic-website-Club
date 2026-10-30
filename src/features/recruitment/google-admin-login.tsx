import { useEffect, useRef, useState } from "react";
import { AlertCircle, LoaderCircle } from "lucide-react";
import { recruitmentEnvironment } from "./config";

export function GoogleAdminLogin({ onCredential }: { onCredential: (token: string) => void }) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!recruitmentEnvironment.googleClientId) { setError("VITE_GOOGLE_CLIENT_ID chưa được cấu hình."); setLoading(false); return; }
    const setup = () => {
      if (!window.google || !buttonRef.current) return;
      window.google.accounts.id.initialize({ client_id: recruitmentEnvironment.googleClientId, callback: (response) => onCredential(response.credential), auto_select: false });
      buttonRef.current.replaceChildren();
      window.google.accounts.id.renderButton(buttonRef.current, { theme: "outline", size: "large", shape: "pill", text: "signin_with", width: 280 });
      setLoading(false);
    };
    if (window.google) { setup(); return; }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = setup;
    script.onerror = () => { setError("Không thể tải Google Sign-In."); setLoading(false); };
    document.head.appendChild(script);
    return () => script.remove();
  }, [onCredential]);

  return <div className="glass-surface mx-auto max-w-xl rounded-[2rem] p-8 text-center md:p-10">
    <h2 className="text-2xl font-bold tracking-[-.035em]">Xác thực quản trị viên</h2>
    <p className="mt-3 leading-7 text-vic-muted">Đăng nhập bằng tài khoản Google có trong danh sách quản trị của Apps Script. Token chỉ được giữ trong bộ nhớ trang.</p>
    {loading && <div className="mt-7 flex justify-center gap-2 text-sm text-vic-muted"><LoaderCircle className="animate-spin" size={18} /> Đang tải…</div>}
    {error && <p className="mt-7 flex items-center justify-center gap-2 rounded-2xl bg-red-50 p-4 text-sm text-red-800"><AlertCircle size={17} />{error}</p>}
    <div ref={buttonRef} className="mt-7 flex justify-center" />
  </div>;
}
