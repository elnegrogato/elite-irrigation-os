import Link from "next/link";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import PageSeo, { makeFaqSchema, makeBreadcrumbSchema } from "../components/PageSeo";
import AeoBlock from "../components/AeoBlock";
import {
  Camera, Phone, ArrowRight, MapPin, CheckCircle2,
  Droplets, Waves, Lightbulb, Layers, Trees, Flame, Building2
} from "lucide-react";

const PHONE = "+17048864240";

const filters = [
  "All", "Sprinkler Repair", "Irrigation Installation", "Drainage", "French Drains",
  "Hardscapes", "Paver Patios", "Outdoor Living", "Pool Area", "Lighting",
  "Commercial / HOA", "Maintenance",
];

const projectExamples = [
  { title: "Sprinkler Valve Repair", location: "Harrisburg, NC", type: "Sprinkler Repair", desc: "Leaking valve box causing soggy area near foundation. Replaced valve, adjusted coverage.", icon: Droplets },
  { title: "French Drain Installation", location: "Concord, NC", type: "Drainage", desc: "Standing water in side yard after every rain. Installed 60ft French drain with proper outlet.", icon: Waves },
  { title: "Paver Patio with Fire Pit", location: "Mint Hill, NC", type: "Outdoor Living", desc: "Designed and installed a 400sqft paver patio with built-in fire pit and seating wall.", icon: Flame },
  { title: "Landscape Lighting System", location: "Myers Park, NC", type: "Lighting", desc: "Full landscape lighting package — path lights, uplighting, and pool-area safety lighting.", icon: Lightbulb },
  { title: "HOA Common-Area Irrigation Repair", location: "Charlotte, NC", type: "Commercial / HOA", desc: "Repaired 3 broken zones and upgraded controller for 12-zone HOA common-area system.", icon: Building2 },
  { title: "Drainage Repair After Heavy Rain", location: "Charlotte, NC", type: "Drainage", desc: "Post-storm drainage restoration — cleared French drains, regraded low spots, added catch basin.", icon: Waves },
  { title: "Retaining Wall & Walkway", location: "Cornelius, NC", type: "Hardscapes", desc: "Replaced failing timber wall with block retaining wall and connecting paver walkway.", icon: Layers },
  { title: "Full Irrigation System Installation", location: "Weddington, NC", type: "Irrigation Installation", desc: "New construction 8-zone system with smart controller, drip irrigation for beds, rain sensor.", icon: Droplets },
  { title: "Pool-Area Landscaping", location: "Cornelius, NC", type: "Pool Area", desc: "Pool-area privacy plantings, drainage correction, and landscape lighting installation.", icon: Trees },
];

export default function ProjectsPage() {
  return (
    <Layout>
      <PageSeo
        title="Projects — Outdoor Work Proof Gallery"
        description="See Elite's completed outdoor projects in Charlotte — sprinkler repair, French drains, paver patios, outdoor kitchens, landscape lighting, commercial/HOA work. Every project photo-documented."
        canonical="/projects"
        jsonLd={[
          makeFaqSchema([
            { q: "What types of outdoor projects does Elite complete?", a: "Sprinkler repair, irrigation installation, French drains, drainage correction, paver patios, outdoor kitchens, fire pits, retaining walls, landscape lighting, pool-area landscaping, HOA common-area maintenance, and commercial facilities services." },
            { q: "Does Elite document all projects with photos?", a: "Yes. Every project includes before, during, and after photos as part of our standard photo-documented service." },
            { q: "What areas does Elite serve?", a: "We serve the Greater Charlotte metro including Harrisburg, Concord, Charlotte, Huntersville, Cornelius, Matthews, Mint Hill, Kannapolis, and surrounding communities." },
          ]),
          makeBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Projects" },
          ]),
        ]}
      />
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Projects" }]} />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 mb-3">Project <span className="text-forest-600">Proof Gallery</span></h1>
          <p className="text-lg text-stone-600 max-w-3xl mx-auto">
            See the outdoor work we've completed across the Charlotte metro. Every project photo-documented from start to finish.
          </p>
          <p className="text-sm text-stone-500 mt-2">
            <strong>Note:</strong> Project photos shown here are representative examples. Real before/after photos added as projects are completed and documented.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {filters.map((f, i) => (
            <button
              key={f}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${i === 0 ? "bg-forest-600 text-white border-forest-600" : "bg-white text-stone-600 border-stone-300 hover:border-forest-300"}`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {projectExamples.map((project) => (
            <div key={project.title} className="bg-white border border-stone-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="h-40 bg-stone-100 flex items-center justify-center">
                <div className="text-center">
                  <project.icon className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                  <p className="text-xs text-stone-400 font-semibold">Photo Coming Soon</p>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-forest-600 bg-forest-100 px-2 py-0.5 rounded-full">{project.type}</span>
                  <span className="text-[10px] text-stone-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{project.location}</span>
                </div>
                <h3 className="font-bold text-stone-900 mb-1">{project.title}</h3>
                <p className="text-sm text-stone-600">{project.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <AeoBlock
          question="Can I see examples of Elite's outdoor work?"
          shortAnswer="Yes. Our proof gallery shows completed projects including sprinkler repair, French drain installation, paver patios, outdoor living spaces, landscape lighting, and commercial/HOA work across the Charlotte metro. Every project is photo-documented."
          commonCauses={["Sprinkler system issues we've resolved", "Drainage problems we've corrected", "Outdoor living spaces we've built", "Commercial property maintenance we manage"]}
          whenToCall="If you have a similar project in mind, send us your outdoor list or text photos for a free quote."
          whatToDoNext="Browse our project examples above, then request a quick quote or schedule a free site review."
          relatedQuestions={["How long does a French drain installation take?", "What does a paver patio cost in Charlotte?", "Do you offer maintenance plans after installation?"]}
        />

        <div className="bg-stone-900 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl font-extrabold text-white mb-4">Ready to Start Your Project?</h2>
          <p className="text-stone-400 mb-8">Send us your outdoor list, text photos, or request a free site review.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/send-us-your-outdoor-list" className="inline-flex items-center gap-2 bg-forest-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-forest-700 transition-colors">
              Send Us Your Outdoor List <ArrowRight className="w-4 h-4" />
            </Link>
            <a href={`sms:${PHONE}`} className="inline-flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-lg font-bold">
              <Camera className="w-4 h-4" /> Text Photos
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
