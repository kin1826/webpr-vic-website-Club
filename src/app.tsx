import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Footer } from "./components/layout/footer";
import { Header } from "./components/layout/header";

const HomePage = lazy(() => import("./pages/home-page").then((module) => ({ default: module.HomePage })));
const AboutPage = lazy(() => import("./pages/about-page").then((module) => ({ default: module.AboutPage })));
const DepartmentPage = lazy(() => import("./pages/department-page").then((module) => ({ default: module.DepartmentPage })));
const JoinPage = lazy(() => import("./pages/join-page").then((module) => ({ default: module.JoinPage })));
const DesignSystemPage = lazy(() => import("./pages/design-system-page").then((module) => ({ default: module.DesignSystemPage })));
const NotFoundPage = lazy(() => import("./pages/not-found-page").then((module) => ({ default: module.NotFoundPage })));
const ActivitiesPage = lazy(() => import("./pages/listing-pages").then((module) => ({ default: module.ActivitiesPage })));
const ProjectsPage = lazy(() => import("./pages/listing-pages").then((module) => ({ default: module.ProjectsPage })));
const AcademicsPage = lazy(() => import("./pages/listing-pages").then((module) => ({ default: module.AcademicsPage })));
const ActivityDetailPage = lazy(() => import("./pages/detail-pages").then((module) => ({ default: module.ActivityDetailPage })));
const ProjectDetailPage = lazy(() => import("./pages/detail-pages").then((module) => ({ default: module.ProjectDetailPage })));
const ArticleDetailPage = lazy(() => import("./pages/detail-pages").then((module) => ({ default: module.ArticleDetailPage })));
const MemberDetailPage = lazy(() => import("./pages/detail-pages").then((module) => ({ default: module.MemberDetailPage })));
const RecruitmentAdminPage = lazy(() => import("./pages/recruitment-admin-page").then((module) => ({ default: module.RecruitmentAdminPage })));

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    let frame = 0;
    let attempts = 0;
    const scroll = () => {
      if (!hash) { window.scrollTo({ top: 0, left: 0, behavior: "instant" }); return; }
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) target.scrollIntoView({ block: "start" });
      else if (attempts < 20) { attempts += 1; frame = requestAnimationFrame(scroll); }
    };
    frame = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
  return null;
}

function PageFallback() {
  return <div className="grid min-h-[70vh] place-items-center pt-28" role="status"><span className="font-mono text-xs font-semibold text-vic-blue">ĐANG MỞ KHÔNG GIAN VIC…</span></div>;
}

export function App() {
  return <><ScrollManager /><a href="#main" className="fixed left-3 top-3 z-[200] -translate-y-24 rounded-full bg-vic-ink px-4 py-2 text-sm text-white focus:translate-y-0">Đi đến nội dung chính</a><Header /><Suspense fallback={<PageFallback />}><Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/gioi-thieu" element={<AboutPage />} />
    <Route path="/hoctap" element={<DepartmentPage departmentId="learning" />} />
    <Route path="/truyenthong" element={<DepartmentPage departmentId="media" />} />
    <Route path="/hoat-dong" element={<ActivitiesPage />} />
    <Route path="/hoat-dong/:slug" element={<ActivityDetailPage />} />
    <Route path="/san-pham" element={<ProjectsPage />} />
    <Route path="/san-pham/:slug" element={<ProjectDetailPage />} />
    <Route path="/hoc-thuat" element={<AcademicsPage />} />
    <Route path="/hoc-thuat/:slug" element={<ArticleDetailPage />} />
    <Route path="/thanh-vien/:slug" element={<MemberDetailPage />} />
    <Route path="/tham-gia" element={<JoinPage />} />
    <Route path="/admin/tuyen-thanh-vien" element={<RecruitmentAdminPage />} />
    <Route path="/design-system" element={<DesignSystemPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes></Suspense><Footer /></>;
}
