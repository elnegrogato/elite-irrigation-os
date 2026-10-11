'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Droplets,
  Flower2,
  HelpCircle,
  Layers,
  Lightbulb,
  Phone,
  ShieldCheck,
  Shovel,
  Waves,
} from 'lucide-react';
import Layout from './Layout';
import { conversionPanels, problemFinderItems } from '../lib/outdoorPlatform';

const homepageServiceImages = {
  landscapeDesign: {
    src: '/images/homepage/ratcliff-custom-home-landscape-design.webp',
    alt: 'Ratcliff Properties custom home exterior with landscape beds and walkway near Harrisburg NC',
  },
  irrigationSystems: {
    src: '/images/homepage/charlotte-irrigation-systems.webp',
    alt: 'Charlotte irrigation systems installation repair and water management services',
  },
  patioInstalls: {
    src: '/images/homepage/charlotte-patio-installs-hardscapes.webp',
    alt: 'Charlotte patio installs and hardscape construction for outdoor living spaces',
  },
  retainingWalls: {
    src: '/images/homepage/charlotte-retaining-walls-grade-control.webp',
    alt: 'Charlotte retaining wall installation and grade control landscaping service',
  },
  drainageFixes: {
    src: '/images/homepage/charlotte-drainage-fixes-standing-water.webp',
    alt: 'Charlotte drainage fixes for standing water erosion and soggy yards',
  },
  outdoorLighting: {
    src: '/images/homepage/ratcliff-evening-home-outdoor-lighting.webp',
    alt: 'Ratcliff Properties custom home exterior with evening lighting and curb appeal',
  },
  commercialGrounds: {
    src: '/images/homepage/charlotte-commercial-grounds-maintenance.webp',
    alt: 'Charlotte commercial grounds maintenance for managed properties and HOAs',
  },
  seasonalCleanup: {
    src: '/images/homepage/charlotte-seasonal-cleanup-landscaping.webp',
    alt: 'Charlotte seasonal cleanup landscaping for spring fall and storm resets',
  },
  sodGrading: {
    src: '/images/homepage/ratcliff-new-construction-sod-grading.webp',
    alt: 'Ratcliff Properties new construction lot grading and lawn preparation in North Carolina',
  },
  propertyMaintenance: {
    src: '/images/homepage/ratcliff-finished-property-maintenance.webp',
    alt: 'Ratcliff Properties finished custom home with clean lawn and landscape beds',
  },
};

const homepageServiceCards = [
  {
    title: 'Landscape Design and Installation',
    sub: 'Plan, build, finish',
    outcome: 'Turn a rough yard into a finished outdoor plan with clean beds, walkways, grading, and install work handled together.',
    proof: 'Design to install',
    category: 'Landscaping',
    href: '/services/landscape-design',
    image: homepageServiceImages.landscapeDesign,
    featured: true,
  },
  {
    title: 'Irrigation Systems',
    sub: 'Install, repair, water management',
    outcome: 'Fix dry spots, waste, leaks, and unreliable zones with irrigation work built around your property.',
    proof: 'Water-smart routing',
    category: 'Irrigation',
    href: '/services/irrigation-system-installation',
    image: homepageServiceImages.irrigationSystems,
  },
  {
    title: 'Patio Installs',
    sub: 'Hardscapes',
    outcome: 'Create a stable outdoor living surface that looks intentional and holds up through Carolina weather.',
    proof: 'Clean edges',
    category: 'Hardscape',
    href: '/services/paver-patio-installation',
    image: homepageServiceImages.patioInstalls,
  },
  {
    title: 'Retaining Walls',
    sub: 'Grade control',
    outcome: 'Control slopes, protect usable space, and give your property a sharper finished edge.',
    proof: 'Built for grade',
    category: 'Hardscape',
    href: '/services/retaining-wall-installation',
    image: homepageServiceImages.retainingWalls,
  },
  {
    title: 'Drainage Fixes',
    sub: 'Stop standing water',
    outcome: 'Move water away from soggy turf, washouts, foundations, and unusable low spots.',
    proof: 'Problem-first diagnosis',
    category: 'Drainage',
    href: '/services/drainage-fixes',
    image: homepageServiceImages.drainageFixes,
  },
  {
    title: 'Outdoor Lighting',
    sub: 'Safety and curb appeal',
    outcome: 'Make the property safer at night while highlighting the parts of the landscape worth seeing.',
    proof: 'Evening curb appeal',
    category: 'Lighting',
    href: '/services/landscape-lighting-installation',
    image: homepageServiceImages.outdoorLighting,
  },
  {
    title: 'Commercial Grounds',
    sub: 'Managed properties',
    outcome: 'Keep entrances, beds, turf, and high-visibility areas looking accountable week after week.',
    proof: 'Recurring route care',
    category: 'Maintenance',
    href: '/services/commercial-landscape-maintenance',
    image: homepageServiceImages.commercialGrounds,
  },
  {
    title: 'Seasonal Cleanup',
    sub: 'Spring, fall, storm reset',
    outcome: 'Reset overgrown or weather-hit areas so the property looks maintained again fast.',
    proof: 'Fast visual reset',
    category: 'Maintenance',
    href: '/services/seasonal-cleanup',
    image: homepageServiceImages.seasonalCleanup,
  },
  {
    title: 'Sod / Grading',
    sub: 'Clean lawn surfaces',
    outcome: 'Smooth rough areas and install turf surfaces that feel finished from the curb.',
    proof: 'Level, clean finish',
    category: 'Landscaping',
    href: '/services/sod-grading',
    image: homepageServiceImages.sodGrading,
  },
  {
    title: 'Property Maintenance',
    sub: 'Recurring outdoor care',
    outcome: 'Stay ahead of weeds, edges, beds, irrigation issues, and the small problems that become expensive.',
    proof: 'Ongoing property control',
    category: 'Maintenance',
    href: '/services/property-maintenance',
    image: homepageServiceImages.propertyMaintenance,
  },
];

const Hero = () => (
  <section className="relative bg-stone-950 min-h-[calc(100svh-12rem)] md:min-h-[calc(100svh-8rem)] flex items-center overflow-hidden">
    <div className="absolute inset-0 z-0 scale-105 animate-pulse-slow">
      <Image
        src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2069&auto=format&fit=crop"
        alt="Beautiful backyard of a high-end North Carolina home"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-45 grayscale-[10%]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/70 to-stone-950/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />
    </div>

    <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-10 lg:px-8">
      <div className="lg:w-3/4 animate-fade-in-up">
        <div className="inline-flex items-center px-3 py-1 border border-white/20 bg-white/10 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider mb-4 md:mb-6 rounded-lg">
          <span className="w-2 h-2 bg-forest-400 rounded-full mr-2" />
          Serving Charlotte & Surrounding Areas
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif font-medium leading-[1.1] mb-4 md:mb-6 text-white tracking-tight">
          Irrigation, Drainage, Landscaping, <br />
          <span className="text-forest-300 italic font-light pr-4">and Outdoor Living </span>
          that works.
        </h1>

        <p className="text-base md:text-xl text-stone-200 mb-6 md:mb-10 max-w-xl font-light leading-relaxed border-l-4 border-forest-600 pl-6">
          From sprinkler repairs and drainage fixes to patios, lighting, turf, grading, maintenance, and commercial grounds care, get expert help for the outdoor systems that make your property usable, healthy, and beautiful.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/quick-quote" className="bg-forest-600 hover:bg-forest-700 text-white px-8 py-3 md:py-4 rounded-lg font-bold uppercase tracking-wider text-sm flex items-center justify-center transition-all shadow-lg hover:-translate-y-1">
            Request a Quote <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
          <Link href="/drainage" className="group bg-white/95 hover:bg-white text-stone-900 border border-transparent px-8 py-3 md:py-4 rounded-lg font-bold uppercase tracking-wider text-sm transition-all flex items-center justify-center shadow-lg hover:-translate-y-1">
            <Waves className="w-4 h-4 mr-2" /> Get Drainage Assessment
          </Link>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-stone-300">
          <a href="tel:7048864240" className="inline-flex items-center gap-1.5 font-semibold text-white hover:text-forest-200">
            <Phone className="h-4 w-4 text-forest-300" />
            Call (704) 886-4240
          </a>
          <a href="sms:+17048864240" className="inline-flex items-center gap-1.5 font-semibold text-white hover:text-forest-200">
            <Camera className="h-4 w-4 text-forest-300" />
            Upload or text photos
          </a>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 hidden sm:flex flex-wrap gap-8 md:mt-10 md:gap-12 text-stone-300">
          <div>
            <div className="text-2xl font-serif text-white">Diagnose</div>
            <div className="text-xs uppercase tracking-wider mt-1 opacity-80">Problem-first</div>
          </div>
          <div>
            <div className="text-2xl font-serif text-white">Plan</div>
            <div className="text-xs uppercase tracking-wider mt-1 opacity-80">Water + grade + use</div>
          </div>
          <div>
            <div className="text-2xl font-serif text-white">Report</div>
            <div className="text-xs uppercase tracking-wider mt-1 opacity-80">Photo-documented</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ProofStrip = () => (
  <section className="border-y border-stone-200/70 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid gap-4 py-6 md:grid-cols-3">
        {[
          { icon: Clock, title: 'Diagnose first', body: 'Start with the symptom so your request gets routed by service type, urgency, and location.' },
          { icon: Camera, title: 'Photo-powered quotes', body: 'Text photos before the visit and receive clear proof when work is complete.' },
          { icon: ShieldCheck, title: 'Built for ownership', body: 'Irrigation, drainage, landscaping, hardscape, lighting, and maintenance coordinated by one dependable crew.' },
        ].map((item) => (
          <div key={item.title} className="flex items-start gap-3 rounded-xl border border-stone-200 bg-white/85 p-4 shadow-sm">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-forest-900 text-forest-100">
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-stone-900">{item.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-stone-600">{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ProblemFinder = () => (
  <section className="bg-white py-16 sm:py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-forest-700">Problem Finder</span>
          <h2 className="mt-3 text-3xl font-serif font-semibold leading-tight text-stone-950 sm:text-4xl lg:text-5xl">
            What’s going on with your property?
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-stone-600 sm:text-lg">
            You do not have to know whether the answer is irrigation repair, drainage, grading, sod, hardscape repair, or maintenance. Start with what you can see.
          </p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest-900 text-forest-100">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-stone-950">Not sure what service you need?</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                Send the issue, add the address, and include photos. We’ll help identify the right path.
              </p>
            </div>
          </div>
          <Link href="/problems" className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-forest-600 px-4 py-3 text-sm font-extrabold text-white transition-colors hover:bg-forest-700">
            Open Problem Finder
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {problemFinderItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-forest-300 hover:shadow-lg"
          >
            <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-forest-700">
              {item.category}
            </span>
            <h3 className="mt-3 text-base font-extrabold leading-tight text-stone-950 group-hover:text-forest-700">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">{item.symptom}</p>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

const ServiceCard = ({ title, sub, outcome, proof, icon: Icon, href, className, image, index }: {
  title: string;
  sub: string;
  outcome: string;
  proof: string;
  icon: typeof Droplets;
  href: string;
  className?: string;
  image: {
    src: string;
    alt: string;
  };
  index: number;
}) => (
  <Link
    href={href}
    className={`relative group min-h-[280px] overflow-hidden rounded-xl border border-white/10 bg-stone-900 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-forest-400 focus:ring-offset-2 focus:ring-offset-stone-950 sm:min-h-[320px] sm:p-6 lg:min-h-[350px] ${className ?? ''}`}
  >
    <div className="absolute inset-0 z-0">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-950/10" />
      <div className="absolute inset-0 bg-forest-950/15 mix-blend-multiply" />
    </div>

    <div className="relative z-10 h-full flex flex-col justify-between">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/15 text-white shadow-sm backdrop-blur-md transition-colors group-hover:bg-forest-600">
          <Icon className="h-6 w-6" />
        </div>
        <span className="rounded-full border border-white/15 bg-stone-950/45 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-white/85 backdrop-blur">
          {String(index).padStart(2, '0')}
        </span>
      </div>

      <div className="mt-auto max-w-[94%]">
        <h4 className="text-xs font-bold uppercase tracking-wider mb-2 text-forest-200">{sub}</h4>
        <h3 className="text-2xl font-serif font-bold leading-tight text-white transition-transform group-hover:translate-x-1">{title}</h3>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80">{outcome}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/90 backdrop-blur">
            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-forest-200" />
            {proof}
          </span>
          <span className="inline-flex items-center text-xs font-black uppercase tracking-widest text-white">
            View service <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </div>
  </Link>
);

const Services = () => {
  const getIcon = (category: string) => {
    switch (category) {
      case 'Irrigation': return Droplets;
      case 'Hardscape': return Shovel;
      case 'Drainage': return Waves;
      case 'Lighting': return Lightbulb;
      case 'Maintenance': return ShieldCheck;
      case 'Landscaping': return Flower2;
      default: return BadgeCheck;
    }
  };

  return (
    <section className="relative overflow-hidden bg-stone-950 py-16 text-white sm:py-20 lg:py-24" id="services">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-forest-400/70 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 grid gap-8 lg:mb-14 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
          <div className="max-w-3xl">
            <span className="text-forest-300 font-bold tracking-wider uppercase text-xs">Outdoor problems, handled</span>
            <h2 className="mt-4 text-3xl font-serif leading-tight text-white sm:text-4xl lg:text-5xl">
              Turn yard stress into a property that looks planned, protected, and easy to own.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-stone-300 sm:text-lg">
              Choose the issue you can see. We will route the right crew for irrigation, drainage, hardscapes, outdoor living, lighting, turf, cleanup, or recurring maintenance before small problems become expensive.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur">
            <p className="text-xs font-black uppercase tracking-widest text-forest-200">Not sure where to start?</p>
            <p className="mt-3 text-sm leading-relaxed text-stone-300">
              Send a few photos and the address. We will identify whether this is a water, grade, turf, or hardscape problem and recommend the next step.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <Link href="/quick-quote" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-forest-500 px-4 py-3 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-forest-400">
              Start property assessment
              </Link>
              <a href="tel:7048864240" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/15 px-4 py-3 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-white/10">
                Call now
              </a>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2 text-xs font-bold text-stone-200 sm:mb-8">
          {['Photo-documented work', 'Charlotte-area crews', 'Sister-company build perspective', 'Drainage + irrigation logic', 'Built for repeat property care'].map((item) => (
            <span key={item} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2">
              {item}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
          {homepageServiceCards.map((service, index) => (
            <ServiceCard
              key={service.title}
              className={service.featured ? 'md:col-span-2 xl:col-span-2' : ''}
              title={service.title}
              sub={service.sub}
              outcome={service.outcome}
              proof={service.proof}
              icon={getIcon(service.category)}
              href={service.href}
              image={service.image}
              index={index + 1}
            />
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-sm leading-relaxed text-stone-300">
            Every project starts with the same goal: remove the outdoor headache, protect the property, and leave the site cleaner than we found it.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/services" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/15 px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-white/10">
              View all services <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/quick-quote" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-950 transition-colors hover:bg-forest-100">
              Get my property plan
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const NextSteps = () => (
  <section className="bg-white py-20 sm:py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-stone-200 bg-white/90 p-5 shadow-sm sm:p-8 lg:p-10">
        <div>
          <span className="text-forest-600 font-bold tracking-wider uppercase text-xs">What we do</span>
          <h2 className="mt-4 max-w-3xl text-3xl md:text-4xl font-serif text-stone-900 leading-tight">
            Outdoor services that fix water, improve curb appeal, and keep properties maintained.
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-stone-600">
            We repair irrigation, solve drainage issues, build patios and retaining walls, refresh landscapes, install lighting, prepare properties for the season, and maintain residential, HOA, estate, and commercial grounds.
          </p>
          <Link href="/quick-quote" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-forest-600 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-forest-700">
            Start a quick quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            { icon: Droplets, title: 'Irrigation and water management', body: 'Sprinkler repair, leak detection, controller troubleshooting, smart upgrades, seasonal startup, and winterization.' },
            { icon: Waves, title: 'Drainage and grading fixes', body: 'Standing water, soggy lawns, foundation runoff, downspout routing, French drains, erosion, and patio drainage.' },
            { icon: Shovel, title: 'Hardscapes and outdoor living', body: 'Patio installs, retaining walls, walkways, fire pits, outdoor kitchens, pergolas, fireplaces, and pool-area upgrades.' },
            { icon: Flower2, title: 'Landscaping and turf', body: 'Landscape design, planting, mulch, bed edging, sod, lawn renovation, grading, and curb appeal refreshes.' },
            { icon: Lightbulb, title: 'Lighting and seasonal services', body: 'Outdoor lighting, path lighting, Christmas lighting, spring cleanup, fall cleanup, snow and ice, and storm preparation.' },
            { icon: Building2, title: 'Maintenance, HOA, and commercial grounds', body: 'Recurring lawn care, property maintenance, landscape management, estate care, HOA reporting, and commercial contracts.' },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-stone-200 bg-white p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-900 text-white">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-6 text-lg font-extrabold text-stone-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const ConversionPaths = () => (
  <section className="relative overflow-hidden bg-stone-950 py-16 text-white sm:py-20">
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-forest-400/70 to-transparent" />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-9 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <span className="text-xs font-extrabold uppercase tracking-widest text-forest-300">High-priority paths</span>
          <h2 className="mt-3 text-3xl font-serif font-semibold leading-tight sm:text-4xl">
            Fast entry points for the work people actually need.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-stone-300">
            The site now supports urgency, high-ticket projects, recurring care, and managed property proposals from the first screen.
          </p>
        </div>
        <Link href="/quick-quote" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-forest-500 px-5 py-3 text-sm font-extrabold text-white transition-colors hover:bg-forest-400">
          Start Outdoor Property Assessment
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {conversionPanels.map((panel, index) => {
          const icons = [Droplets, Waves, Layers, Building2];
          const Icon = icons[index] ?? ClipboardCheck;
          return (
            <Link
              key={panel.title}
              href={panel.href}
              className="group rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/10 transition-all hover:-translate-y-1 hover:bg-white/[0.09]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-500 text-white">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-serif font-semibold leading-tight text-white">{panel.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-300">{panel.body}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-forest-200">
                {panel.label}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  </section>
);

const Territory = () => (
  <section className="relative overflow-hidden border-y border-forest-800/60 bg-[linear-gradient(135deg,#052e16_0%,#11100d_58%,#052e16_100%)] py-20 text-white sm:py-24">
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-forest-300/50 to-transparent" />
    <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
      <div>
        <span className="text-forest-200 font-bold tracking-wider uppercase text-xs">Where We Work</span>
        <h2 className="mt-4 max-w-2xl text-3xl font-serif leading-tight text-white md:text-4xl">
          Local crews for Harrisburg, Charlotte, Concord, Lake Norman, and nearby communities.
        </h2>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-stone-300 sm:text-lg">
          Based in Harrisburg, we serve residential properties, estates, HOAs, commercial sites, and recurring maintenance routes across the Charlotte metro.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {[
            'Irrigation repair and audits',
            'Drainage and grading fixes',
            'Patios, retaining walls, and lighting',
            'Commercial, HOA, and estate maintenance',
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-white backdrop-blur">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-forest-200" />
              {item}
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/areas-we-serve" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-forest-500 px-6 py-3 text-sm font-black uppercase tracking-wider text-forest-950 transition-colors hover:bg-forest-300">
            Check Your Area <ArrowRight className="h-4 w-4" />
          </Link>
          <a href="tel:+17048864240" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-6 py-3 text-sm font-black uppercase tracking-wider text-white transition-colors hover:bg-white/15">
            <Phone className="h-4 w-4" />
            Call (704) 886-4240
          </a>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 shadow-2xl shadow-black/20 backdrop-blur sm:p-5">
        <div className="rounded-xl border border-white/10 bg-white p-4 text-stone-900 sm:p-6">
          <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-forest-700">Service Area Dispatch</p>
              <h3 className="mt-2 text-2xl font-serif font-bold text-stone-950">Harrisburg HQ. Charlotte metro coverage.</h3>
            </div>
            <div className="rounded-xl bg-forest-900 px-4 py-3 text-white">
              <p className="text-[11px] font-black uppercase tracking-widest text-forest-200">Base</p>
              <p className="mt-1 text-sm font-bold">Harrisburg, NC</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              { title: 'Core Response Zone', areas: 'Harrisburg, Concord, Kannapolis, Mint Hill' },
              { title: 'Charlotte Routes', areas: 'Charlotte, University City, Matthews, Indian Trail' },
              { title: 'Lake Norman Side', areas: 'Huntersville, Cornelius, Davidson, Mooresville' },
              { title: 'Managed Properties', areas: 'HOAs, estates, retail centers, offices, multifamily' },
            ].map((zone) => (
              <div key={zone.title} className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-forest-500" />
                  <h4 className="text-sm font-extrabold text-stone-950">{zone.title}</h4>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-stone-600">{zone.areas}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-forest-200 bg-white p-4">
            <p className="text-sm font-bold leading-relaxed text-stone-800">
              Not sure if you are inside the route? Send the address and a few photos. We will confirm the right next step before anyone rolls a truck.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export const PublicHome = () => {
  return (
    <Layout fullWidth>
      <Hero />
      <ProofStrip />
      <ProblemFinder />
      <Services />
      <NextSteps />
      <ConversionPaths />
      <Territory />
    </Layout>
  );
};
