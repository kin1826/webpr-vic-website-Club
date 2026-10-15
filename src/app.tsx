import { Footer } from "./components/layout/footer";
import { Header } from "./components/layout/header";
import { DesignSystemPage } from "./pages/design-system-page";
import { HomePage } from "./pages/home-page";

export function App() {
  const isDesignSystem = window.location.pathname.replace(/\/$/, "") === "/design-system";
  return <><a href="#main" className="fixed left-3 top-3 z-[200] -translate-y-24 rounded-full bg-vic-ink px-4 py-2 text-sm text-white focus:translate-y-0">Đi đến nội dung chính</a><Header />{isDesignSystem ? <DesignSystemPage /> : <HomePage />}<Footer /></>;
}
