// src/AppRoutes.tsx
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner";

// Non-lazy loaded pages (frequently accessed)
import HomePage from "./pages/HomePage";
import NotFound from "./components/NotFound";

// Lazy load public pages
const ServicesIndexPage = lazy(() => import("./pages/ServicesIndexPage"));
const ServicePage = lazy(() => import("./pages/ServicePage"));
const AreasIndexPage = lazy(() => import("./pages/AreasIndexPage"));
const AreaPage = lazy(() => import("./pages/AreaPage"));
const SpokePage = lazy(() => import("./pages/SpokePage"));
const ProblemsIndexPage = lazy(() => import("./pages/ProblemsIndexPage"));
const ProblemPage = lazy(() => import("./pages/ProblemPage"));
const BrandsIndexPage = lazy(() => import("./pages/BrandsIndexPage"));
const BrandPage = lazy(() => import("./pages/BrandPage"));
const NearMePage = lazy(() => import("./pages/NearMePage"));
const CostIndexPage = lazy(() => import("./pages/CostIndexPage"));
const CostPage = lazy(() => import("./pages/CostPage"));
const CompareIndexPage = lazy(() => import("./pages/CompareIndexPage"));
const ComparePage = lazy(() => import("./pages/ComparePage"));
const BookNowPage = lazy(() => import("./pages/BookNowPage"));
const FamilyPage = lazy(() => import("./pages/FamilyPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));

// Lazy load project pages
const ProjectsIndexPage = lazy(() => import("./pages/projects/ProjectsIndexPage"));
const ProjectsServicePage = lazy(() => import("./pages/projects/ProjectsServicePage"));
const ProjectsLocationPage = lazy(() => import("./pages/projects/ProjectsLocationPage"));
const CaseStudyPage = lazy(() => import("./pages/projects/CaseStudyPage"));

// Lazy load public pages
const InvoicePage = lazy(() => import("./pages/public/InvoicePage"));

// Lazy load auth pages
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));

// Lazy load tech app pages
const TechJobsPage = lazy(() => import("./pages/tech/TechJobsPage"));
const TechJobPage = lazy(() => import("./pages/tech/TechJobPage"));

// Lazy load admin pages (these are heavy and benefit most from code splitting)
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));
const LeadsPipelineBulkPage = lazy(() => import("./pages/admin/LeadsPipelineBulkPage"));
const InboxPage = lazy(() => import("./pages/admin/InboxPage"));
const SourcesAnalyticsPage = lazy(() => import("./pages/admin/SourcesAnalyticsPage"));
const ReportsPage = lazy(() => import("./pages/admin/ReportsPage"));
const ForecastingPage = lazy(() => import("./pages/admin/ForecastingPage"));
const PerformancePage = lazy(() => import("./pages/admin/PerformancePage"));
const EstimatesPage = lazy(() => import("./pages/admin/EstimatesPage"));
const CalendarRoutesPage = lazy(() => import("./pages/admin/CalendarRoutesPage"));
const ContentFactoryPage = lazy(() => import("./pages/admin/ContentFactoryPage"));
const AutomationsPage = lazy(() => import("./pages/admin/AutomationsPage"));
const RoutePlannerPage = lazy(() => import("./pages/admin/RoutePlannerPage"));
const PolicyCenterPage = lazy(() => import("./pages/admin/PolicyCenterPage"));
const AgentRunsPage = lazy(() => import("./pages/admin/AgentRunsPage"));
const ApprovalsPage = lazy(() => import("./pages/admin/ApprovalsPage"));
const CaseStudiesPage = lazy(() => import("./pages/admin/CaseStudiesPage"));
const RouteWeekPlannerPage = lazy(() => import("./pages/admin/RouteWeekPlannerPage"));
const WorkOrdersPage = lazy(() => import("./pages/admin/WorkOrdersPage"));
const CaseStudyDraftsPage = lazy(() => import("./pages/admin/CaseStudyDraftsPage"));
const InvoicesPage = lazy(() => import("./pages/admin/InvoicesPage"));
const CompliancePage = lazy(() => import("./pages/admin/CompliancePage"));
const FleetPage = lazy(() => import("./pages/admin/FleetPage"));
const StaffPage = lazy(() => import("./pages/admin/StaffPage"));
const InventoryPage = lazy(() => import("./pages/admin/InventoryPage"));
const EmailsPage = lazy(() => import("./pages/admin/EmailsPage"));

// Loading fallback with better UX
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-sm text-slate-600">Loading...</p>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Public Site Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesIndexPage />} />
        <Route path="/services/:slug" element={<ServicePage />} />

        <Route path="/areas-we-serve" element={<AreasIndexPage />} />
        <Route path="/areas/:locationSlug" element={<AreaPage />} />

        <Route path="/problems" element={<ProblemsIndexPage />} />
        <Route path="/problems/:problemSlug" element={<ProblemPage />} />
        <Route path="/problems/:problemSlug/:locationSlug" element={<ProblemPage />} />

        <Route path="/brands" element={<BrandsIndexPage />} />
        <Route path="/brands/:brandSlug" element={<BrandPage />} />
        <Route path="/brands/:brandSlug/:locationSlug" element={<BrandPage />} />

        <Route path="/cost" element={<CostIndexPage />} />
        <Route path="/cost/:slug" element={<CostPage />} />

        <Route path="/compare" element={<CompareIndexPage />} />
        <Route path="/compare/:slug" element={<ComparePage />} />

        <Route path="/book-now" element={<BookNowPage />} />

        {/* Projects / Case Studies */}
        <Route path="/projects" element={<ProjectsIndexPage />} />
        <Route path="/projects/case/:caseStudyId" element={<CaseStudyPage />} />
        <Route path="/projects/:serviceSlug" element={<ProjectsServicePage />} />
        <Route path="/projects/:serviceSlug/:locationSlug" element={<ProjectsLocationPage />} />

        {/* Public Invoice */}
        <Route path="/invoice/:token" element={<InvoicePage />} />

        {/* Tech App Routes */}
        <Route path="/tech/jobs" element={<TechJobsPage />} />
        <Route path="/tech/jobs/:workOrderId" element={<TechJobPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/leads" element={<LeadsPipelineBulkPage />} />
        <Route path="/admin/inbox" element={<InboxPage />} />
        <Route path="/admin/emails" element={<EmailsPage />} />
        <Route path="/admin/sources" element={<SourcesAnalyticsPage />} />
        <Route path="/admin/reports" element={<ReportsPage />} />
        <Route path="/admin/forecasting" element={<ForecastingPage />} />
        <Route path="/admin/performance" element={<PerformancePage />} />
        <Route path="/admin/estimates" element={<EstimatesPage />} />
        <Route path="/admin/calendar" element={<CalendarRoutesPage />} />
        <Route path="/admin/routes" element={<RoutePlannerPage />} />
        <Route path="/admin/week" element={<RouteWeekPlannerPage />} />
        <Route path="/admin/content" element={<ContentFactoryPage />} />
        <Route path="/admin/case-studies" element={<CaseStudiesPage />} />
        <Route path="/admin/case-study-drafts" element={<CaseStudyDraftsPage />} />
        <Route path="/admin/automations" element={<AutomationsPage />} />
        <Route path="/admin/approvals" element={<ApprovalsPage />} />
        <Route path="/admin/work-orders" element={<WorkOrdersPage />} />
        <Route path="/admin/invoices" element={<InvoicesPage />} />
        <Route path="/admin/policy" element={<PolicyCenterPage />} />
        <Route path="/admin/agent-runs" element={<AgentRunsPage />} />
        <Route path="/admin/compliance" element={<CompliancePage />} />
        <Route path="/admin/fleet" element={<FleetPage />} />
        <Route path="/admin/staff" element={<StaffPage />} />
        <Route path="/admin/inventory" element={<InventoryPage />} />

        {/* Page Families */}
        <Route path="/f/:familySlug/:locationSlug" element={<FamilyPage />} />

        {/* Dynamic Routes */}
        <Route path="/:variantSlug/:locationSlug" element={<NearMePage />} />
        <Route path="/:serviceSlug-:locationSlug" element={<SpokePage />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}