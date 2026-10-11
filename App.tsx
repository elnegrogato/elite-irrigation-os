import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { PublicHome } from './components/PublicPages';
import { AdminDashboard } from './components/AdminPages';
import NotFound from './src/components/NotFound';

const ServicesIndexPage = lazy(() => import('./src/pages/ServicesIndexPage'));
const ServicePage = lazy(() => import('./src/pages/ServicePage'));
const AreasIndexPage = lazy(() => import('./src/pages/AreasIndexPage'));
const AreaPage = lazy(() => import('./src/pages/AreaPage'));
const ContactPage = lazy(() => import('./src/pages/ContactPage'));
const QuickQuotePage = lazy(() => import('./src/pages/QuickQuotePage'));
const IrrigationQuickQuotePage = lazy(() => import('./src/pages/IrrigationQuickQuotePage'));
const SendOutdoorListPage = lazy(() => import('./src/pages/SendOutdoorListPage'));
const OutdoorIssueReviewPage = lazy(() => import('./src/pages/OutdoorIssueReviewPage'));
const DrainageAssessmentPage = lazy(() => import('./src/pages/DrainageAssessmentPage'));
const ProcessPage = lazy(() => import('./src/pages/ProcessPage'));
const PhotoDocumentedServicePage = lazy(() => import('./src/pages/PhotoDocumentedServicePage'));
const MaintenancePlansPage = lazy(() => import('./src/pages/MaintenancePlansPage'));
const OutdoorPropertyReviewPage = lazy(() => import('./src/pages/OutdoorPropertyReviewPage'));
const SubmitPropertyIssuePage = lazy(() => import('./src/pages/SubmitPropertyIssuePage'));
const PostStormInspectionPage = lazy(() => import('./src/pages/PostStormInspectionPage'));
const OutdoorSiteReportsPage = lazy(() => import('./src/pages/OutdoorSiteReportsPage'));
const BoardReadyReportsPage = lazy(() => import('./src/pages/BoardReadyReportsPage'));
const OutdoorFacilitiesPage = lazy(() => import('./src/pages/OutdoorFacilitiesPage'));
const OutdoorFacilityReviewPage = lazy(() => import('./src/pages/OutdoorFacilityReviewPage'));
const OutdoorSiteReviewPage = lazy(() => import('./src/pages/OutdoorSiteReviewPage'));
const GuidePage = lazy(() => import('./src/pages/GuidePage'));
const ProjectsPage = lazy(() => import('./src/pages/ProjectsPage'));
const CustomerPortalPage = lazy(() => import('./src/pages/CustomerPortalPage'));

const RealtorOutdoorPunchListPage = lazy(() => import('./src/pages/RealtorOutdoorPunchListPage'));
const BuilderOutdoorPunchListPage = lazy(() => import('./src/pages/BuilderOutdoorPunchListPage'));
const PoolBuilderLandscapePartnerPage = lazy(() => import('./src/pages/PoolBuilderLandscapePartnerPage'));

const QrBookPage = lazy(() => import('./src/pages/QrBookPage'));
const QrSprinklerRepairPage = lazy(() => import('./src/pages/QrSprinklerRepairPage'));
const QrDrainageReviewPage = lazy(() => import('./src/pages/QrDrainageReviewPage'));
const QrHoaOutdoorReviewPage = lazy(() => import('./src/pages/QrHoaOutdoorReviewPage'));
const QrLightingQuotePage = lazy(() => import('./src/pages/QrLightingQuotePage'));
const QrMaintenancePlanPage = lazy(() => import('./src/pages/QrMaintenancePlanPage'));
const QrFacilityWalkthroughPage = lazy(() => import('./src/pages/QrFacilityWalkthroughPage'));
const QrPropertyReviewPage = lazy(() => import('./src/pages/QrPropertyReviewPage'));
const QrPostStormPage = lazy(() => import('./src/pages/QrPostStormPage'));

const HoaOutdoorServicesPage = lazy(() => import('./src/pages/HoaOutdoorServicesPage'));
const PropertyManagerOutdoorServicesPage = lazy(() => import('./src/pages/PropertyManagerOutdoorServicesPage'));
const MultifamilyOutdoorServicesPage = lazy(() => import('./src/pages/MultifamilyOutdoorServicesPage'));
const OfficeParkOutdoorServicesPage = lazy(() => import('./src/pages/OfficeParkOutdoorServicesPage'));
const RetailCenterOutdoorServicesPage = lazy(() => import('./src/pages/RetailCenterOutdoorServicesPage'));
const ChurchSchoolOutdoorServicesPage = lazy(() => import('./src/pages/ChurchSchoolOutdoorServicesPage'));
const CountryClubOutdoorServicesPage = lazy(() => import('./src/pages/CountryClubOutdoorServicesPage'));
const LuxuryHoaOutdoorServicesPage = lazy(() => import('./src/pages/LuxuryHoaOutdoorServicesPage'));
const MunicipalOutdoorServicesPage = lazy(() => import('./src/pages/MunicipalOutdoorServicesPage'));
const ConstructionOutdoorServicesPage = lazy(() => import('./src/pages/ConstructionOutdoorServicesPage'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-sm text-stone-500">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<PublicHome />} />

            <Route path="/services" element={<ServicesIndexPage />} />
            <Route path="/services/:slug" element={<ServicePage />} />

            <Route path="/areas-we-serve" element={<AreasIndexPage />} />
            <Route path="/areas/:locationSlug" element={<AreaPage />} />

            <Route path="/contact" element={<ContactPage />} />

            <Route path="/quick-quote" element={<QuickQuotePage />} />
            <Route path="/irrigation-quick-quote" element={<IrrigationQuickQuotePage />} />
            <Route path="/send-us-your-outdoor-list" element={<SendOutdoorListPage />} />
            <Route path="/outdoor-issue-review" element={<OutdoorIssueReviewPage />} />
            <Route path="/drainage-assessment" element={<DrainageAssessmentPage />} />
            <Route path="/process" element={<ProcessPage />} />
            <Route path="/project-process" element={<ProcessPage />} />
            <Route path="/photo-documented-service" element={<PhotoDocumentedServicePage />} />
            <Route path="/maintenance-plans" element={<MaintenancePlansPage />} />
            <Route path="/outdoor-property-review" element={<OutdoorPropertyReviewPage />} />
            <Route path="/submit-property-issue" element={<SubmitPropertyIssuePage />} />
            <Route path="/post-storm-drainage-inspection" element={<PostStormInspectionPage />} />
            <Route path="/outdoor-site-reports" element={<OutdoorSiteReportsPage />} />
            <Route path="/board-ready-outdoor-reports" element={<BoardReadyReportsPage />} />
            <Route path="/outdoor-facilities-services" element={<OutdoorFacilitiesPage />} />
            <Route path="/outdoor-facility-review" element={<OutdoorFacilityReviewPage />} />
            <Route path="/outdoor-site-review" element={<OutdoorSiteReviewPage />} />
            <Route path="/guide" element={<GuidePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/customer-portal" element={<CustomerPortalPage />} />

            <Route path="/realtor-outdoor-punch-list" element={<RealtorOutdoorPunchListPage />} />
            <Route path="/builder-outdoor-punch-list" element={<BuilderOutdoorPunchListPage />} />
            <Route path="/pool-builder-landscape-partner" element={<PoolBuilderLandscapePartnerPage />} />

            <Route path="/book" element={<QrBookPage />} />
            <Route path="/sprinkler-repair-qr" element={<QrSprinklerRepairPage />} />
            <Route path="/drainage-review-qr" element={<QrDrainageReviewPage />} />
            <Route path="/hoa-outdoor-review-qr" element={<QrHoaOutdoorReviewPage />} />
            <Route path="/lighting-quote-qr" element={<QrLightingQuotePage />} />
            <Route path="/maintenance-plan-qr" element={<QrMaintenancePlanPage />} />
            <Route path="/facility-walkthrough-qr" element={<QrFacilityWalkthroughPage />} />
            <Route path="/property-review-qr" element={<QrPropertyReviewPage />} />
            <Route path="/post-storm-qr" element={<QrPostStormPage />} />

            <Route path="/hoa-outdoor-services" element={<HoaOutdoorServicesPage />} />
            <Route path="/property-manager-outdoor-services" element={<PropertyManagerOutdoorServicesPage />} />
            <Route path="/multifamily-outdoor-services" element={<MultifamilyOutdoorServicesPage />} />
            <Route path="/office-park-outdoor-services" element={<OfficeParkOutdoorServicesPage />} />
            <Route path="/retail-center-outdoor-services" element={<RetailCenterOutdoorServicesPage />} />
            <Route path="/church-school-outdoor-services" element={<ChurchSchoolOutdoorServicesPage />} />
            <Route path="/country-club-outdoor-services" element={<CountryClubOutdoorServicesPage />} />
            <Route path="/luxury-hoa-outdoor-services" element={<LuxuryHoaOutdoorServicesPage />} />
            <Route path="/municipal-outdoor-services" element={<MunicipalOutdoorServicesPage />} />
            <Route path="/construction-outdoor-services" element={<ConstructionOutdoorServicesPage />} />

            <Route path="/admin" element={<AdminDashboard />} />

            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  );
}
