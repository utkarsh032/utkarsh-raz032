import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useParams } from "react-router-dom";
import { applySeo, getSeo } from "./seo";
import { useIsoLayoutEffect } from "./hooks/motion";
import { profile } from "./data/profile";
import { useScrollSpy } from "./hooks/useScrollSpy";
import { Nav, TraceRail } from "./components/Nav";
import { CommandMenu } from "./components/CommandMenu";
import { DocViewerProvider } from "./components/DocViewer";
import { Footer } from "./sections/Closing";
import { NotFound } from "./pages/NotFound";
import Home from "./pages/Home";

const Projects = lazy(() => import("./pages/Projects"));
const Beyond = lazy(() => import("./pages/Beyond"));
const ProjectRoute = lazy(() => import("./pages/ProjectRoute"));

/** Keeps title, meta tags and structured data in sync with the route. */
function SeoManager() {
  const { pathname } = useLocation();
  useEffect(() => {
    applySeo(getSeo(pathname));
  }, [pathname]);
  return null;
}

/** Scrolls to the hash target after navigation, otherwise to the top. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    // Wait a frame so lazily rendered routes have mounted their sections.
    const id = decodeURIComponent(hash.slice(1));
    const frame = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
  return null;
}

function Layout() {
  const { scrolled, progress, activeId, span } = useScrollSpy();
  const [menuOpen, setMenuOpen] = useState(false);

  // Enable reveal animations only after hydration, once on-screen content is marked visible.
  // (Parent layout effects run after their children's.)
  useIsoLayoutEffect(() => {
    document.documentElement.classList.add("js");
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setMenuOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <DocViewerProvider>
      <a className="skip" href="#main">Skip to content</a>
      <ScrollManager />
      <SeoManager />
      <Nav scrolled={scrolled} activeId={activeId} onOpenMenu={() => setMenuOpen(true)} />
      <TraceRail progress={progress} span={span} />
      <main id="main" tabIndex={-1}>
        <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <CommandMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </DocViewerProvider>
  );
}

/** Case studies used to live at /work/:slug. */
function WorkRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/projects/${slug}`} replace />;
}

/** Old links to /resume open the PDF. */
function ResumeRedirect() {
  useEffect(() => {
    window.location.replace(profile.resume);
  }, []);
  return null;
}

/** The route tree. Wrapped in BrowserRouter here and in StaticRouter by the prerenderer. */
export function AppRoutes() {
  return (
    <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:slug" element={<ProjectRoute />} />
          <Route path="beyond" element={<Beyond />} />
          <Route path="work/:slug" element={<WorkRedirect />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="resume" element={<ResumeRedirect />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
