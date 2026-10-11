import React, { useState } from 'react';
import Link from "next/link";
import { Helmet } from 'react-helmet-async';
import Layout from '../src/components/Layout';
import {
  ArrowRight, Droplets, Phone, MapPin, ChevronRight,
  ShieldCheck, CheckCircle2, Star, Clock, Users, Wrench,
  Waves, Layers, Lightbulb, Flower2, Zap, Trees, Flame,
  Building2, Camera, ClipboardList, MessageSquare, Eye,
  Search, FileText, RefreshCw, HardHat, AlertTriangle
} from 'lucide-react';
import { services } from '../data/services';
import { locationsFull, locationsByRing } from '../data/locations_full';

const PHONE = '+17048864240';



const Hero = () => (
  <section className="relative min-h-screen flex items-center overflow-hidden">
    <div className="absolute inset-0 z-0">
      <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop" alt="Professional irrigation system in a green Charlotte lawn" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-stone-900/85 via-stone-900/65 to-stone-900/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 via-transparent to-transparent" />
    </div>
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 bg-forest-600/20 backdrop-blur-sm border border-forest-500/30 text-forest-300 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full mb-6">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Licensed & Insured · Charlotte Metro Since 2004
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
          Outdoor Systems That Work Together.
        </h1>
        <p className="text-lg text-stone-300 mb-10 leading-relaxed max-w-lg">
          Irrigation, drainage, hardscapes, outdoor living, pool areas, lighting, and property maintenance for the Charlotte metro.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Link href="/quick-quote" className="bg-forest-600 hover:bg-forest-500 text-white px-8 py-4 rounded-lg font-bold text-base flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg shadow-forest-600/25">
            Get a Quick Quote <ArrowRight className="w-5 h-5" />
          </Link>
          <a href={`sms:${PHONE}`} className="bg-amber-500 hover:bg-amber-400 text-white px-8 py-4 rounded-lg font-bold text-base flex items-center justify-center gap-2 transition-all">
            <Camera className="w-5 h-5" /> Text Us Photos
          </a>
          <a href={`tel:${PHONE}`} className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded-lg font-bold text-base flex items-center justify-center gap-2 transition-all">
            <Phone className="w-5 h-5" /> Call Now
          </a>
        </div>
        <div className="inline-flex items-center gap-2 bg-red-600/20 backdrop-blur-sm border border-red-500/30 text-red-200 text-sm font-bold px-4 py-2 rounded-full">
          <AlertTriangle className="w-4 h-4" />
          Sprinkler Emergency? <a href={`tel:${PHONE}`} className="underline text-white ml-1">Call Now</a>
        </div>
      </div>
    </div>
  </section>
);

const SITUATIONS = [
  { icon: Droplets, label: 'Broken Sprinkler Head', desc: 'Water shooting everywhere or no water at all', to: '/irrigation-quick-quote', category: 'Irrigation' },
  { icon: Droplets, label: 'Dry or Brown Spots', desc: 'Patches of dead grass where sprinklers miss', to: '/irrigation-quick-quote', category: 'Irrigation' },
  { icon: Waves, label: 'Standing Water', desc: 'Puddles that never drain after rain', to: '/drainage-assessment', category: 'Drainage' },
  { icon: Waves, label: 'Soggy Yard or Flooding', desc: 'Soft, muddy ground that never dries out', to: '/drainage-assessment', category: 'Drainage' },
  { icon: Waves, label: 'Erosion & Washout', desc: 'Soil washing away from slopes or downspouts', to: '/drainage-assessment', category: 'Drainage' },
  { icon: Layers, label: 'Cracked or Uneven Patio', desc: 'Pavers shifting, settling, or separating', to: '/quick-quote', category: 'Hardscapes' },
  { icon: Layers, label: 'Need a Walkway or Wall', desc: 'New path, steps, or retaining wall needed', to: '/quick-quote', category: 'Hardscapes' },
  { icon: Lightbulb, label: 'Lights Not Working', desc: 'Landscape lights out, flickering, or dim', to: '/quick-quote', category: 'Lighting' },
  { icon: Lightbulb, label: 'Dark Pathways', desc: 'Unsafe walkways with no illumination', to: '/quick-quote', category: 'Lighting' },
  { icon: Flame, label: 'Want Outdoor Living', desc: 'Kitchen, fire pit, pergola, or entertainment space', to: '/quick-quote', category: 'Outdoor Living' },
  { icon: Droplets, label: 'Pool Area Needs Help', desc: 'Drainage, landscaping, or irrigation near pool', to: '/quick-quote', category: 'Pool Area' },
  { icon: Trees, label: 'Overgrown Landscape', desc: 'Beds need mulch, shrubs need trimming, cleanup', to: '/maintenance-plans', category: 'Maintenance' },
  { icon: Building2, label: 'HOA or Commercial', desc: 'Managed property outdoor services', to: '/outdoor-facilities-services', category: 'Commercial' },
  { icon: AlertTriangle, label: 'Storm Damage', desc: 'Post-storm drainage, erosion, or sprinkler damage', to: '/post-storm-drainage-inspection', category: 'Emergency' },
  { icon: ClipboardList, label: 'Not Sure — Send List', desc: 'Have multiple issues? Send us your outdoor list', to: '/send-us-your-outdoor-list', category: 'Not Sure' },
];

const SITUATION_CATEGORIES = ['All', 'Irrigation', 'Drainage', 'Hardscapes', 'Lighting', 'Outdoor Living', 'Pool Area', 'Maintenance', 'Commercial', 'Emergency'];

const SituationSelector = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? SITUATIONS
    : SITUATIONS.filter(s => s.category === activeCategory);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-forest-600 font-bold text-sm uppercase tracking-wider">What's Going On?</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-3 mb-4">
            What's Going On With Your Outdoor Space?
          </h2>
          <p className="text-stone-500 text-lg">
            Pick the situation that matches yours. We'll point you to the right next step.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {SITUATION_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-forest-600 text-white shadow-md'
                  : 'bg-stone-100 text-stone-600 hover:bg-forest-50 hover:text-forest-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((card) => (
            <Link key={card.label} href={card.to} className="group flex items-start gap-3 p-5 rounded-xl border-2 border-stone-200 hover:border-forest-300 hover:shadow-lg transition-all">
              <div className="w-10 h-10 rounded-lg bg-forest-50 text-forest-600 flex items-center justify-center shrink-0 group-hover:bg-forest-600 group-hover:text-white transition-colors">
                <card.icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-forest-600 mb-0.5 block">{card.category}</span>
                <h3 className="font-bold text-stone-900 text-sm group-hover:text-forest-600 transition-colors">{card.label}</h3>
                <p className="text-stone-500 text-xs mt-1 leading-relaxed">{card.desc}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/send-us-your-outdoor-list" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white px-8 py-4 rounded-lg font-bold text-base transition-colors">
            <ClipboardList className="w-5 h-5" /> Send Us Your Outdoor List
          </Link>
        </div>
      </div>
    </section>
  );
};

const SYSTEM_CARDS = [
  { icon: Droplets, title: 'Irrigation', desc: 'Sprinkler repair, system installation, smart controllers, seasonal startup & winterization', slug: 'sprinkler-repair' },
  { icon: Waves, title: 'Drainage', desc: 'French drains, standing water correction, downspout drainage, erosion control', slug: 'drainage-assessment' },
  { icon: Layers, title: 'Hardscapes', desc: 'Paver patios, walkways, retaining walls, outdoor steps, pool decks', slug: 'paver-patio-installation' },
  { icon: Flame, title: 'Outdoor Living', desc: 'Outdoor kitchens, fire pits, pergolas, entertainment spaces', slug: 'outdoor-kitchen' },
  { icon: Droplets, title: 'Pool Areas', desc: 'Pool-area landscaping, drainage, irrigation, and hardscape surfaces', slug: 'pool-landscaping' },
  { icon: Lightbulb, title: 'Lighting', desc: 'Landscape lighting, pathway lights, pool-area lights, security lighting', slug: 'landscape-lighting-installation' },
  { icon: Trees, title: 'Maintenance', desc: 'Lawn care, seasonal cleanups, bed maintenance, recurring property care', slug: 'hoa-grounds-contract' },
  { icon: Building2, title: 'Commercial / HOA', desc: 'Facilities services, board-ready reports, multi-site maintenance, inspections', slug: 'outdoor-facilities-services', isFacilities: true },
];

const OutdoorSystems = () => (
  <section className="py-24 bg-stone-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-forest-600 font-bold text-sm uppercase tracking-wider">One Company. Every Outdoor System.</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-3 mb-4">
          Full Outdoor Services for Charlotte Properties
        </h2>
        <p className="text-stone-500 text-lg">
          From sprinkler repair to outdoor kitchens — one call covers every system outside the building.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SYSTEM_CARDS.map((card) => (
          <Link key={card.title} href={card.isFacilities ? `/${card.slug}` : `/services/${card.slug}`} className="group bg-white rounded-xl p-6 border border-stone-200 hover:border-forest-300 hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-xl bg-forest-50 text-forest-600 flex items-center justify-center mb-4 group-hover:bg-forest-600 group-hover:text-white transition-colors">
              <card.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-forest-600 transition-colors">{card.title}</h3>
            <p className="text-stone-500 text-sm leading-relaxed">{card.desc}</p>
            <span className="text-forest-600 text-sm font-semibold mt-3 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              Learn More <ChevronRight className="w-4 h-4" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

const QUOTE_CATEGORIES = [
  { icon: Wrench, title: 'Sprinkler Repair', desc: 'Broken head, stuck zone, dry area, or controller issue?', cta: 'Start Sprinkler Quote', to: '/irrigation-quick-quote' },
  { icon: Droplets, title: 'Irrigation Installation', desc: 'New system design, zone planning, smart controller setup?', cta: 'Start Irrigation Quote', to: '/irrigation-quick-quote' },
  { icon: Waves, title: 'Drainage / French Drains', desc: 'Standing water, soggy yard, downspout runoff?', cta: 'Request Drainage Review', to: '/drainage-assessment' },
  { icon: Layers, title: 'Hardscape / Patio', desc: 'Patio, walkway, retaining wall, or outdoor feature?', cta: 'Start Hardscape Quote', to: '/quick-quote' },
  { icon: Flame, title: 'Outdoor Living', desc: 'Kitchen, fire pit, pergola, or poolside space?', cta: 'Start Outdoor Living Quote', to: '/quick-quote' },
  { icon: Droplets, title: 'Pool-Area Landscaping', desc: 'Pool surround, drainage, planting, or cleanup?', cta: 'Start Pool Area Quote', to: '/quick-quote' },
  { icon: Lightbulb, title: 'Landscape Lighting', desc: 'Pathway, patio, pool, or security lighting?', cta: 'Start Lighting Quote', to: '/quick-quote' },
  { icon: Building2, title: 'Commercial / HOA', desc: 'Multi-site maintenance, board reporting, inspections?', cta: 'Request Commercial Service', to: '/outdoor-facilities-services' },
  { icon: ClipboardList, title: 'Maintenance', desc: 'Recurring irrigation, drainage, lighting, or landscape care?', cta: 'Ask About Maintenance', to: '/maintenance-plans' },
];

const QuickQuoteSection = () => (
  <section className="py-24 bg-forest-600">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-forest-200 font-bold text-sm uppercase tracking-wider">Quick Quote</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-4">
          Get a Quick Outdoor Quote
        </h2>
        <p className="text-forest-100 text-lg">
          Answer a few questions, upload photos if you have them, and we'll help you get moving toward a clear outdoor service estimate.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {QUOTE_CATEGORIES.map((cat) => (
          <Link key={cat.title} href={cat.to} className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 hover:bg-white/20 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <cat.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-white">{cat.title}</h3>
            </div>
            <p className="text-forest-100 text-sm mb-3">{cat.desc}</p>
            <span className="text-amber-300 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
              {cat.cta} <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        ))}
      </div>
      <div className="text-center mt-10">
        <Link href="/quick-quote" className="inline-flex items-center gap-2 bg-white text-forest-700 px-8 py-4 rounded-lg font-bold text-base hover:bg-forest-50 transition-colors">
          Start Quick Quote <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  </section>
);

const PROCESS_STEPS = [
  { icon: MessageSquare, title: 'Request', desc: 'Call, text, or fill out a quick form' },
  { icon: Camera, title: 'Photos & Intake', desc: 'Text us photos of the issue' },
  { icon: MapPin, title: 'Site Review', desc: 'We visit and inspect the property' },
  { icon: Search, title: 'Diagnosis', desc: 'Identify the root cause' },
  { icon: ClipboardList, title: 'Proposal', desc: 'Clear scope with options' },
  { icon: HardHat, title: 'Field Work', desc: 'Professional installation or repair' },
  { icon: Camera, title: 'Documentation', desc: 'Before, during, and after photos' },
  { icon: Eye, title: 'Closeout', desc: 'Walkthrough and maintenance plan' },
];

const ProcessTimeline = () => (
  <section className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-forest-600 font-bold text-sm uppercase tracking-wider">How It Works</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-3 mb-4">
          A Clearer Process for Outdoor Projects
        </h2>
        <p className="text-stone-500 text-lg">
          Elite does not rely on vague ballparks or mystery scopes. We collect the right details, inspect the issue, document the work, and close out clearly.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {PROCESS_STEPS.map((step, i) => (
          <div key={step.title} className="text-center">
            <div className="w-14 h-14 rounded-full bg-forest-50 text-forest-600 flex items-center justify-center mx-auto mb-3">
              <step.icon className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-forest-600 mb-1">Step {i + 1}</div>
            <h3 className="font-bold text-stone-900 text-sm">{step.title}</h3>
            <p className="text-stone-500 text-xs mt-1">{step.desc}</p>
          </div>
        ))}
      </div>
      <div className="text-center mt-10">
        <Link href="/project-process" className="text-forest-600 font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all">
          See Full Process <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  </section>
);

const TRUST_FEATURES = [
  { icon: FileText, title: 'Site Notes', desc: 'Detailed observations from every visit' },
  { icon: Camera, title: 'Before Photos', desc: 'Condition documented before work starts' },
  { icon: Camera, title: 'In-Progress Photos', desc: 'Work captured as it happens' },
  { icon: CheckCircle2, title: 'Completed Photos', desc: 'Finished results documented' },
  { icon: ClipboardList, title: 'Recommendations', desc: 'Priority items and next steps' },
  { icon: Building2, title: 'Commercial Reporting', desc: 'Board-ready summaries for managed properties' },
];

const DocumentationTrust = () => (
  <section className="py-24 bg-stone-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <span className="text-forest-600 font-bold text-sm uppercase tracking-wider">Documented Service</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-3 mb-6">
            Outdoor Work, Documented Clearly
          </h2>
          <p className="text-stone-500 text-lg leading-relaxed mb-8">
            Outdoor work is easier to trust when it is documented. Elite captures site notes, before photos, work-in-progress photos, completed work photos, and recommended next steps so homeowners, property managers, HOAs, and commercial customers know what was found, what was completed, and what may need attention.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/photo-documented-service" className="bg-forest-600 hover:bg-forest-700 text-white px-6 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors">
              Learn More <ArrowRight className="w-4 h-4" />
            </Link>
            <a href={`sms:${PHONE}`} className="bg-amber-500 hover:bg-amber-400 text-white px-6 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors">
              <Camera className="w-4 h-4" /> Text Us Photos
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {TRUST_FEATURES.map((feat) => (
            <div key={feat.title} className="bg-white rounded-xl p-5 border border-stone-200">
              <feat.icon className="w-8 h-8 text-forest-600 mb-3" />
              <h3 className="font-bold text-stone-900 text-sm">{feat.title}</h3>
              <p className="text-stone-500 text-xs mt-1">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const ringNames: Record<string, string> = { '0': 'Core Area', '1': 'Greater Charlotte', '2': 'Extended Metro' };

const ServiceAreas = () => (
  <section className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-forest-600 font-bold text-sm uppercase tracking-wider">Where We Work</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-3 mb-4">
          Serving the Greater Charlotte Metro Area
        </h2>
        <p className="text-stone-500 text-lg">
          Based in Harrisburg, NC — our crews cover a wide service area across the Charlotte metro region.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[0, 1, 2].map((ring) => {
          const cities = locationsByRing[String(ring)] || [];
          return (
            <div key={ring} className={`rounded-xl p-8 border-2 transition-all ${ring === 0 ? 'bg-forest-600 text-white border-forest-600 shadow-lg' : 'bg-white border-stone-200 hover:border-forest-300 hover:shadow-md'}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${ring === 0 ? 'bg-white/20 text-white' : 'bg-forest-50 text-forest-600'}`}>
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-bold ${ring === 0 ? 'text-white' : 'text-stone-900'}`}>{ringNames[String(ring)]}</h3>
                  <span className={`text-xs ${ring === 0 ? 'text-forest-200' : 'text-stone-400'}`}>
                    {ring === 0 ? 'Harrisburg, Concord, NE Charlotte' : ring === 1 ? 'Huntersville, Matthews, Mint Hill' : 'Kannapolis, Monroe, Mooresville'}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {cities.slice(0, 8).map((city: any) => (
                  <Link key={city.slug} href={`/areas/${city.slug}`} className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${ring === 0 ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-stone-100 text-stone-600 hover:bg-forest-50 hover:text-forest-700'}`}>
                    {city.name}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-center mt-10">
        <Link href="/areas-we-serve" className="text-forest-600 font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all">
          See All Service Areas <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  </section>
);

const WhyElite = () => (
  <section className="py-24 bg-forest-900 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-forest-300 font-bold text-sm uppercase tracking-wider">Why Elite</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-4">
          Builder-Grade Organization for Outdoor Services
        </h2>
        <p className="text-forest-200 text-lg">
          Elite brings structured processes, photo documentation, and clear communication to every outdoor project.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { icon: ShieldCheck, label: 'Licensed & Insured', detail: 'NCICLB Licensed, $5M coverage' },
          { icon: Clock, label: 'Priority Emergency Repair', detail: 'Urgent issues handled during business hours' },
          { icon: Camera, label: 'Photo-Documented Work', detail: 'Before, during, and after photos' },
          { icon: ClipboardList, label: 'Structured Process', detail: 'Inspection → Scope → Proposal → Work → Closeout' },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <div className="w-14 h-14 rounded-xl bg-forest-800 text-forest-300 flex items-center justify-center mx-auto mb-4">
              <item.icon className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-white text-sm mb-1">{item.label}</h3>
            <p className="text-forest-400 text-xs">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CtaBanner = () => (
  <section className="py-20 bg-amber-500">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
        Not Sure What You Need?
      </h2>
      <p className="text-amber-100 text-lg mb-10 max-w-2xl mx-auto">
        Text us photos of the sprinkler, drainage issue, patio, lighting, pool area, or outdoor space and we'll help you choose the right next step.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a href={`sms:${PHONE}`} className="bg-white text-amber-700 px-8 py-4 rounded-lg font-bold text-base flex items-center justify-center gap-2 hover:bg-amber-50 transition-colors">
          <Camera className="w-5 h-5" /> Text Photos
        </a>
        <Link href="/outdoor-site-review" className="bg-amber-700 hover:bg-amber-800 text-white px-8 py-4 rounded-lg font-bold text-base flex items-center justify-center gap-2 transition-colors border border-amber-600">
          Schedule Site Review
        </Link>
        <a href={`tel:${PHONE}`} className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg font-bold text-base flex items-center justify-center gap-2 transition-colors border border-amber-500">
          <Phone className="w-5 h-5" /> Call Now
        </a>
      </div>
    </div>
  </section>
);

const LocalBusinessSchema = () => (
  <>
    <Helmet>
      <title>Elite Irrigation & Landscaping — Outdoor Work Without the Guesswork</title>
      <meta name="description" content="Irrigation, drainage, hardscapes, outdoor living, lighting, and property maintenance for the Charlotte metro. Photo-documented service, structured process, free estimates." />
      <link rel="canonical" href="https://eliteirrigation.com/" />
      <meta property="og:title" content="Elite Irrigation & Landscaping — Charlotte Outdoor Services" />
      <meta property="og:description" content="Outdoor systems that work together. Irrigation, drainage, hardscapes, outdoor living, lighting, maintenance, and commercial facilities care." />
      <meta property="og:image" content="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Elite Irrigation & Landscaping",
      description: "Irrigation, drainage, hardscapes, outdoor living, landscape lighting, and property maintenance for the Charlotte metro area. Photo-documented service with structured process.",
      telephone: "+1-704-886-4240",
      address: { "@type": "PostalAddress", streetAddress: "4502 Rocky River Rd", addressLocality: "Harrisburg", addressRegion: "NC", postalCode: "28075" },
      areaServed: { "@type": "GeoCircle", geoMidpoint: { "@type": "GeoCoordinates", latitude: 35.3245, longitude: -80.6447 }, geoRadius: "32186" },
      openingHoursSpecification: [
        { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "07:00", closes: "17:00" },
        { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday","Sunday"], opens: "07:30", closes: "16:00" }
      ],
      priceRange: "$$",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
      url: "https://eliteirrigation.com",
      sameAs: [],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Outdoor Services",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Sprinkler Repair" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Drainage Solutions" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Hardscape Installation" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Outdoor Living" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Landscape Lighting" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Property Maintenance" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Outdoor Facilities Services" } },
        ]
      }
    })}} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "What outdoor services does Elite offer in Charlotte?", acceptedAnswer: { "@type": "Answer", text: "Elite provides irrigation repair and installation, drainage solutions, hardscape installation (patios, walkways, retaining walls), outdoor living spaces (kitchens, fire pits), landscape lighting, lawn and property maintenance, and commercial/HOA facilities services across the Charlotte metro." } },
        { "@type": "Question", name: "Does Elite provide free estimates?", acceptedAnswer: { "@type": "Answer", text: "Yes. All initial estimates and assessments are free with no obligation. You can request a quick quote online, call (704) 886-4240, or text photos of your outdoor issue." } },
        { "@type": "Question", name: "What areas does Elite Irrigation serve?", acceptedAnswer: { "@type": "Answer", text: "Elite serves the Greater Charlotte metro area including Harrisburg, Concord, Charlotte, Huntersville, Cornelius, Matthews, Mint Hill, Kannapolis, Waxhaw, Weddington, Davidson, Mooresville, Pineville, and surrounding communities." } },
        { "@type": "Question", name: "Does Elite document work with photos?", acceptedAnswer: { "@type": "Answer", text: "Yes. Every service visit includes before, during, and after photos. This photo documentation is standard at no extra charge and is shared with customers after each visit." } },
      ]
    })}} />
  </>
);

export const PublicHome = () => {
  return (
    <Layout>
      <LocalBusinessSchema />
      <Hero />
      <SituationSelector />
      <OutdoorSystems />
      <QuickQuoteSection />
      <ProcessTimeline />
      <DocumentationTrust />
      <ServiceAreas />
      <WhyElite />
      <CtaBanner />
    </Layout>
  );
};
