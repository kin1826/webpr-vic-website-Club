import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Footer } from "./components/layout/footer";
import { Header } from "./components/layout/header";

const HomePreviewPage = lazy(() => import("./pages/home-preview-page").then((module) => ({ default: module.HomePreviewPage })));
const HomePreview1Page = lazy(() => import("./pages/home-preview1-page").then((module) => ({ default: module.HomePreview1Page })));
const AboutPage = lazy(() => import("./pages/about-page").then((module) => ({ default: module.AboutPage })));
const DepartmentPage = lazy(() => import("./pages/department-page").then((module) => ({ default: module.DepartmentPage })));
const JoinPage = lazy(() => import("./pages/join-page").then((module) => ({ default: module.JoinPage })));
const RecruitmentAnnouncementPage = lazy(() => import("./pages/recruitment-announcement-page").then((module) => ({ default: module.RecruitmentAnnouncementPage })));
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
  const { pathname } = useLocation();
  const routePath = pathname.replace(/\/+$/, "") || "/";
  const isHomePreview1 = routePath === "/home-preview1";
  const isRecruitmentAnnouncement = routePath === "/tuyen-thanh-vien";
  const isMinimalChrome = isHomePreview1 || isRecruitmentAnnouncement;
  return <><ScrollManager /><a href="#main" className={"fixed left-3 top-3 z-[200] -translate-y-24 rounded-full px-4 py-2 text-sm focus:translate-y-0 " + (isHomePreview1 ? "hyper-skip-link" : "bg-vic-ink text-white")}>Đi đến nội dung chính</a>{!isMinimalChrome && <Header />}<Suspense fallback={<PageFallback />}><Routes>
    <Route path="/" element={<HomePreviewPage />} />
    <Route path="/home-preview" element={<HomePreviewPage />} />
    <Route path="/home-preview1" element={<HomePreview1Page />} />
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
    <Route path="/tuyen-thanh-vien" element={<RecruitmentAnnouncementPage />} />
    <Route path="/tham-gia" element={<JoinPage />} />
    <Route path="/admin/tuyen-thanh-vien" element={<RecruitmentAdminPage />} />
    <Route path="/design-system" element={<DesignSystemPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes></Suspense>{!isMinimalChrome && <Footer />}</>;
}
