"use client";

import { PropsWithChildren, useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import StickyMobileCta from "./StickyMobileCta";
import {
  Droplets, Phone, Menu, X,
  ChevronDown, Camera, Wrench, Waves, Layers, Lightbulb,
  Trees, Building2, ArrowRight, ExternalLink, ClipboardList
} from "lucide-react";

const PHONE = "+17048864240";
const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=100063566473826";
const LINKEDIN_URL = "https://www.linkedin.com/company/elite-irrigation-llc/";

const serviceGroups = [
  {
    label: "Plan & Build",
    icon: Layers,
    description: "Design, landscaping, hardscapes, outdoor living, turf, and grading.",
    items: [
      { label: "Design", to: "/design" },
      { label: "Landscaping", to: "/landscaping" },
      { label: "Hardscapes", to: "/hardscapes" },
      { label: "Outdoor Living", to: "/outdoor-living" },
      { label: "Turf & Grading", to: "/turf-grading" },
    ],
  },
  {
    label: "Water Systems",
    icon: Droplets,
    description: "Irrigation, water management, drainage, and dry-yard fixes.",
    items: [
      { label: "Irrigation", to: "/irrigation" },
      { label: "Drainage", to: "/drainage" },
      { label: "Emergency Sprinkler Repair", to: "/services/emergency-sprinkler-repair" },
      { label: "Standing Water Solutions", to: "/services/standing-water-solutions" },
      { label: "French Drains", to: "/services/french-drain-installation" },
    ],
  },
  {
    label: "Lighting & Seasonal",
    icon: Lightbulb,
    description: "Outdoor lighting, holiday lighting, cleanups, and weather response.",
    items: [
      { label: "Lighting", to: "/lighting" },
      { label: "Seasonal Services", to: "/seasonal" },
      { label: "Christmas Lighting", to: "/services/christmas-lighting" },
      { label: "Seasonal Cleanup", to: "/services/seasonal-cleanup" },
      { label: "Snow & Ice Removal", to: "/services/snow-ice-removal" },
    ],
  },
  {
    label: "Care & Maintenance",
    icon: Trees,
    description: "Recurring property care for homes, HOAs, and commercial sites.",
    items: [
      { label: "Maintenance", to: "/maintenance" },
      { label: "Plans", to: "/plans" },
      { label: "Commercial", to: "/commercial" },
      { label: "HOA", to: "/hoa" },
      { label: "Estate Maintenance", to: "/estate-maintenance" },
      { label: "Tree & Brush", to: "/tree-brush" },
      { label: "Weed and Pest Control Treatments", to: "/services/weed-pest-control" },
    ],
  },
];

const popularServices = [
  {
    label: "Irrigation",
    to: "/irrigation",
    description: "Install, repair, optimize, and manage every zone.",
    icon: Droplets,
  },
  {
    label: "Drainage",
    to: "/drainage",
    description: "Stop standing water, erosion, and soggy lawns.",
    icon: Waves,
  },
  {
    label: "Hardscapes",
    to: "/hardscapes",
    description: "Outdoor rooms built for daily use and curb appeal.",
    icon: Layers,
  },
  {
    label: "Problem Finder",
    to: "/problems",
    description: "Start with the symptom and find the right next step.",
    icon: Wrench,
  },
  {
    label: "Commercial Grounds",
    to: "/commercial",
    description: "Reliable grounds care for HOAs and managed sites.",
    icon: Building2,
  },
  {
    label: "Landscape Design",
    to: "/design",
    description: "A clear plan from concept to installed landscape.",
    icon: Trees,
  },
];

const desktopLinks = [
  { label: "Problems", to: "/problems" },
  { label: "Plans", to: "/plans" },
  { label: "Areas", to: "/areas-we-serve" },
  { label: "Projects", to: "/projects" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const commercialItems = [
  { label: "Commercial Grounds", to: "/commercial" },
  { label: "Facilities Services", to: "/services/property-maintenance" },
  { label: "HOA Services", to: "/hoa" },
  { label: "Estate Maintenance", to: "/estate-maintenance" },
  { label: "Property Managers", to: "/commercial" },
  { label: "Multifamily", to: "/commercial" },
  { label: "Office & Retail", to: "/commercial" },
  { label: "Churches & Schools", to: "/services/commercial-landscape-maintenance" },
  { label: "Country Clubs", to: "/services/commercial-irrigation-maintenance" },
];

function DesktopDropdown({ label, children, wide = false }: { label: string; children: React.ReactNode; wide?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleEnter = () => {
    clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div ref={ref} className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`flex min-h-11 items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${open ? "bg-white text-forest-700" : "text-stone-600 hover:bg-forest-50 hover:text-forest-700"}`}
      >
        {label}
        <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div className={wide ? "fixed left-0 top-16 h-2 w-full" : "absolute left-0 right-0 top-full h-2"} />
          <div
            role="menu"
            className={
              wide
                ? "fixed left-1/2 top-[72px] z-50 w-[min(calc(100vw-2rem),1040px)] -translate-x-1/2 rounded-2xl border border-stone-200 bg-white p-3 shadow-2xl shadow-stone-900/15"
                : "absolute left-0 top-[calc(100%+8px)] z-50 min-w-[280px] rounded-xl border border-stone-200 bg-white py-1 shadow-xl shadow-stone-900/10"
            }
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
}

type LayoutProps = PropsWithChildren<{
  fullWidth?: boolean;
}>;

export default function Layout({ children, fullWidth = false }: LayoutProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    setMobileOpen(false);
    setMobileSection(null);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-white pb-24 text-stone-900 xl:pb-0">
      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/95 shadow-sm backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-[72px] items-center justify-between">
            <Link href="/" aria-label="Elite Irrigation & Landscaping home" className="flex h-full w-[148px] shrink-0 items-center py-2 sm:w-[176px] xl:w-[190px]">
              <Image
                src="/Elite-Irrigation-and-Landscaping-optimized.png"
                alt="Elite Irrigation & Landscaping"
                width={240}
                height={93}
                priority
                className="h-full w-auto max-w-full object-contain"
              />
            </Link>

            <nav className="hidden xl:flex items-center gap-0.5">
              <DesktopDropdown label="Services" wide>
                <div className="grid gap-3 lg:grid-cols-[0.9fr_1.4fr]">
                  <div className="rounded-xl bg-forest-900 p-5 text-white">
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                      <Wrench className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-extrabold leading-tight">Diagnose the issue. Route the right outdoor service.</h2>
                    <p className="mt-2 text-sm leading-6 text-forest-100">
                      Start with irrigation, drainage, hardscapes, lighting, maintenance, commercial grounds, HOA care, or the problem you can see.
                    </p>
                    <div className="mt-5 grid gap-2">
                      <Link href="/quick-quote" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-forest-800 transition-colors hover:bg-forest-50">
                        Start Assessment <ArrowRight className="h-4 w-4" />
                      </Link>
                      <a href={`sms:${PHONE}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/10">
                        <Camera className="h-4 w-4" />
                        Text Photos
                      </a>
                    </div>
                  </div>

                  <div className="rounded-xl border border-stone-200 bg-white p-3">
                    <div className="mb-2 flex items-center justify-between px-1">
                      <h2 className="text-xs font-extrabold uppercase tracking-wider text-stone-500">Most Requested</h2>
                      <Link href="/services" className="text-xs font-bold text-forest-700 hover:text-forest-800">
                        All Services
                      </Link>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {popularServices.map((item) => (
                        <Link
                          key={item.label}
                          href={item.to}
                          className="group rounded-xl border border-stone-200 bg-white p-3 transition-all hover:-translate-y-0.5 hover:border-forest-300 hover:shadow-sm"
                        >
                          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-forest-700 transition-colors group-hover:bg-forest-600 group-hover:text-white">
                            <item.icon className="h-4 w-4" />
                          </div>
                          <h3 className="text-sm font-extrabold leading-tight text-stone-900 group-hover:text-forest-700">{item.label}</h3>
                          <p className="mt-1 text-xs leading-5 text-stone-500">{item.description}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid gap-3 border-t border-stone-200 pt-3 lg:grid-cols-4">
                  {serviceGroups.map((group) => (
                    <div key={group.label} className="rounded-xl bg-white p-3">
                      <div className="mb-2 flex items-start gap-2">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-forest-700">
                          <group.icon className="h-4 w-4" />
                        </span>
                        <div>
                          <h3 className="text-sm font-extrabold text-stone-900">{group.label}</h3>
                          <p className="mt-0.5 text-xs leading-5 text-stone-500">{group.description}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {group.items.map((item) => (
                          <Link
                            key={item.label}
                            href={item.to}
                            className="block rounded-md px-2 py-1.5 text-xs font-semibold text-stone-600 transition-colors hover:bg-forest-50 hover:text-forest-700"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </DesktopDropdown>

              {desktopLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.to}
                  aria-current={isActive(item.to) ? "page" : undefined}
                  className={`flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${isActive(item.to) ? "bg-white text-forest-700" : "text-stone-600 hover:bg-forest-50 hover:text-forest-700"}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden xl:flex items-center gap-2">
              <a href={`tel:${PHONE}`} className="flex min-h-11 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold text-stone-700 transition-colors hover:bg-forest-50 hover:text-forest-700">
                <Phone className="w-4 h-4" />
                <span>(704) 886-4240</span>
              </a>
              <Link href="/quick-quote" className="ml-1 flex min-h-11 items-center rounded-lg bg-forest-600 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-forest-700">
                Quick Quote
              </Link>
            </div>

            <button type="button" onClick={() => setMobileOpen(!mobileOpen)} aria-expanded={mobileOpen} className="xl:hidden p-2 text-stone-700">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <MobileMenuOverlay
          close={() => setMobileOpen(false)}
          mobileSection={mobileSection}
          setMobileSection={setMobileSection}
        />
      )}

      <main className={fullWidth ? "py-0" : "mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8"}>{children}</main>

      <footer className={`relative overflow-hidden border-t border-forest-800/70 bg-[radial-gradient(circle_at_top_left,rgba(22,101,52,0.42),transparent_34%),linear-gradient(135deg,#052e16_0%,#11100d_58%,#052e16_100%)] text-stone-300 ${fullWidth ? "" : "mt-20"}`}>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-forest-300/70 to-transparent" />
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mb-10 rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur md:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link href="/" aria-label="Elite Irrigation & Landscaping home" className="inline-flex h-20 w-56 items-center py-1">
                  <Image
                    src="/Elite-Irrigation-and-Landscaping-optimized.png"
                    alt="Elite Irrigation & Landscaping"
                    width={320}
                    height={131}
                    className="h-full w-auto max-w-full object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.42)]"
                  />
                </Link>
                <div className="max-w-xl">
                  <h2 className="text-xl font-extrabold text-white">Outdoor systems that look sharp and work right.</h2>
                  <p className="mt-2 text-sm leading-6 text-stone-400">
                    Diagnose, plan, quote, schedule, maintain, and report on irrigation, drainage, hardscapes, lighting, turf, landscaping, and managed property care.
                  </p>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <a href={`tel:${PHONE}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-stone-950 transition-colors hover:bg-forest-50">
                  <Phone className="h-4 w-4 text-forest-700" />
                  (704) 886-4240
                </a>
                <Link href="/quick-quote" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-forest-600 px-5 py-3 text-sm font-extrabold text-white transition-colors hover:bg-forest-500">
                  Quick Quote
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_0.8fr_0.8fr]">
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">Elite Irrigation & Landscaping</h3>
              <p className="mt-4 max-w-sm text-sm leading-6 text-stone-400">
                Complete outdoor property care for water problems, curb appeal, hardscapes, lighting, and long-term maintenance across homes, HOAs, estates, and commercial sites.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {["NCICLB Licensed", "Bonded & Insured", "Charlotte Metro"].map((badge) => (
                  <span key={badge} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-stone-300">{badge}</span>
                ))}
              </div>
              <div className="mt-6 grid gap-2 text-sm font-semibold text-stone-300">
                <a href={`sms:${PHONE}`} className="inline-flex items-center gap-2 transition-colors hover:text-forest-300">
                  <Camera className="h-4 w-4 text-forest-400" />
                  Text project photos
                </a>
                <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-forest-300">
                  Facebook <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-forest-300">
                  LinkedIn <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {[
              {
                title: "Platform",
                links: [
                  { label: "Problem Finder", to: "/problems" },
                  { label: "Irrigation", to: "/irrigation" },
                  { label: "Drainage", to: "/drainage" },
                  { label: "Hardscapes", to: "/hardscapes" },
                  { label: "Outdoor Living", to: "/outdoor-living" },
                  { label: "Maintenance Plans", to: "/plans" },
                  { label: "All Services", to: "/services" },
                ],
              },
              {
                title: "Company",
                links: [
                  { label: "Projects", to: "/projects" },
                  { label: "Service Areas", to: "/areas-we-serve" },
                  { label: "Pricing", to: "/pricing" },
                  { label: "Quick Quote", to: "/quick-quote" },
                  { label: "About", to: "/about" },
                  { label: "Contact", to: "/contact" },
                  { label: "Support", to: "/support" },
                ],
              },
              {
                title: "Commercial",
                links: [
                  { label: "Commercial Grounds", to: "/commercial" },
                  { label: "HOA Services", to: "/hoa" },
                  { label: "Estate Maintenance", to: "/estate-maintenance" },
                  { label: "Seasonal Services", to: "/seasonal" },
                  { label: "Privacy", to: "/privacy" },
                  { label: "Terms", to: "/terms" },
                ],
              },
            ].map((group) => (
              <div key={group.title}>
                <h4 className="mb-4 text-xs font-extrabold uppercase tracking-wider text-white">{group.title}</h4>
                <ul className="space-y-2.5 text-sm">
                  {group.links.map((item) => (
                    <li key={item.label}>
                      <Link href={item.to} className="text-stone-400 transition-colors hover:text-forest-300">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-stone-500 md:flex-row md:items-center md:justify-between">
            <p>&copy; {new Date().getFullYear()} Elite Irrigation & Landscaping. All rights reserved.</p>
            <p>Monday-Friday 7:00 AM-5:00 PM | Saturday-Sunday 7:30 AM-4:00 PM</p>
          </div>
        </div>
      </footer>

      {!mobileOpen && <StickyMobileCta />}
    </div>
  );
}

function MobileMenuOverlay({
  close,
  mobileSection,
  setMobileSection,
}: {
  close: () => void;
  mobileSection: string | null;
  setMobileSection: (s: string | null) => void;
}) {
  const primaryLinks = [
    { label: "Irrigation", to: "/irrigation", icon: Droplets },
    { label: "Drainage", to: "/drainage", icon: Waves },
    { label: "Hardscapes", to: "/hardscapes", icon: Layers },
    { label: "Outdoor Living", to: "/outdoor-living", icon: Lightbulb },
    { label: "Maintenance", to: "/maintenance", icon: Trees },
    { label: "Problems", to: "/problems", icon: Wrench },
    { label: "Commercial", to: "/commercial", icon: Building2 },
    { label: "Plans", to: "/plans", icon: ClipboardList },
  ];

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-white xl:hidden">
      <div className="shrink-0 border-b border-stone-200 bg-white shadow-sm">
        <div className="flex h-[72px] items-center justify-between px-4 sm:px-6">
          <Link href="/" onClick={close} aria-label="Elite Irrigation & Landscaping home" className="flex h-full w-[168px] items-center py-2 sm:w-[190px]">
            <Image
              src="/Elite-Irrigation-and-Landscaping-optimized.png"
              alt="Elite Irrigation & Landscaping"
              width={240}
              height={93}
              priority
              className="h-full w-auto max-w-full object-contain"
            />
          </Link>
          <button type="button" onClick={close} aria-label="Close menu" className="flex h-11 w-11 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-800 shadow-sm">
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        <div className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-3xl border border-forest-900/15 bg-[linear-gradient(135deg,#052e16_0%,#11100d_72%,#052e16_100%)] p-4 text-white shadow-2xl shadow-stone-900/15 sm:p-5">
            <p className="text-xs font-extrabold uppercase tracking-widest text-forest-200">Outdoor property care</p>
            <h2 className="mt-2 text-xl font-serif font-semibold leading-tight sm:mt-3 sm:text-3xl">
              Diagnose the issue and route the right service.
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:grid-cols-4">
              <a href={`tel:${PHONE}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-extrabold text-stone-950 sm:min-h-12">
                <Phone className="h-4 w-4 text-forest-700" />
                Call
              </a>
              <a href={`sms:${PHONE}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm font-extrabold text-white sm:min-h-12">
                <Camera className="h-4 w-4 text-forest-200" />
                Photos
              </a>
              <Link href="/quick-quote" onClick={close} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-forest-500 px-3 py-2 text-sm font-extrabold text-white sm:min-h-12">
                Quote
              </Link>
              <Link href="/services/emergency-sprinkler-repair" onClick={close} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-forest-500 px-3 py-2 text-sm font-extrabold text-white sm:min-h-12">
                Emergency
              </Link>
            </div>
          </section>

          <section className="rounded-3xl border border-stone-200 bg-white p-3 shadow-sm sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-stone-500">Direct Paths</h2>
              <Link href="/services" onClick={close} className="text-xs font-extrabold text-forest-700">
                All Services
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
              {primaryLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.to}
                  onClick={close}
                  className="flex min-h-12 items-center gap-2 rounded-2xl border border-stone-200 bg-white px-3 py-2 text-stone-900 transition-colors hover:border-forest-300 sm:min-h-16 sm:gap-3"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-forest-100 text-forest-700 sm:h-10 sm:w-10">
                    <item.icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-extrabold leading-tight">{item.label}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="mx-auto mt-4 grid max-w-5xl gap-3 lg:grid-cols-2">
          <MobileSection
            label="All Service Categories"
            section="services"
            current={mobileSection}
            toggle={setMobileSection}
            icon={<Wrench className="w-5 h-5 text-forest-600" />}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {serviceGroups.map((group) => (
                <div key={group.label}>
                  <div className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-stone-500">
                    <group.icon className="h-3.5 w-3.5 text-forest-600" />
                    {group.label}
                  </div>
                  <div className="grid gap-1.5">
                    {group.items.map((item) => (
                      <Link
                        key={item.label}
                        href={item.to}
                        onClick={close}
                        className="block min-h-11 rounded-lg bg-stone-50 px-3 py-2 text-sm font-semibold text-stone-700"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </MobileSection>

          <MobileSection
            label="Commercial, HOA & Estate"
            section="commercial"
            current={mobileSection}
            toggle={setMobileSection}
            icon={<Building2 className="w-5 h-5 text-forest-600" />}
          >
            <div className="grid gap-1.5 sm:grid-cols-2">
              {commercialItems.map((item) => (
                <Link key={item.label} href={item.to} onClick={close} className="block min-h-11 rounded-lg bg-stone-50 px-3 py-2 text-sm font-semibold text-stone-700">
                  {item.label}
                </Link>
              ))}
            </div>
          </MobileSection>
        </div>

        <div className="mx-auto mt-4 hidden max-w-5xl grid-cols-2 gap-2 pb-6 sm:grid sm:grid-cols-4">
          {[...desktopLinks, { label: "Pricing", to: "/pricing" }, { label: "Portal", to: "/login" }].map((item) => (
            <Link
              key={item.label}
              href={item.to}
              onClick={close}
              className="flex min-h-12 items-center justify-between rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-extrabold text-stone-800 shadow-sm"
            >
              {item.label}
              <ArrowRight className="h-4 w-4 text-stone-400" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileSection({ label, section, current, toggle, icon, children }: {
  label: string;
  section: string;
  current: string | null;
  toggle: (s: string | null) => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const isOpen = current === section;
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => toggle(isOpen ? null : section)}
        aria-expanded={isOpen}
        className="flex min-h-12 w-full items-center justify-between px-4 py-3 sm:min-h-14"
      >
        <span className="flex items-center gap-3 text-base font-extrabold text-stone-800">
          {icon}
          {label}
        </span>
        <ChevronDown className={`w-5 h-5 text-stone-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && <div className="border-t border-stone-100 px-4 py-3">{children}</div>}
    </div>
  );
}
