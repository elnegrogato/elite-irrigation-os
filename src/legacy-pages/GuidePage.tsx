import Link from "next/link";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import PageSeo, { makeFaqSchema, makeBreadcrumbSchema } from "../components/PageSeo";
import AeoBlock from "../components/AeoBlock";
import {
  BookOpen, Phone, Camera, CheckCircle2, ArrowRight,
  Droplets, Waves, Lightbulb, Trees, Layers, Flame,
  Calendar, ShieldCheck, Clock
} from "lucide-react";

const PHONE = "+17048864240";

const guideSections = [
  { num: "01", title: "Sprinkler Repair Warning Signs", desc: "How to know when your sprinkler system needs professional attention.", icon: Droplets },
  { num: "02", title: "Irrigation Maintenance Checklist", desc: "Seasonal tasks that keep your system running efficiently.", icon: Droplets },
  { num: "03", title: "Yard Drainage Warning Signs", desc: "Spot drainage problems before they cause foundation or landscape damage.", icon: Waves },
  { num: "04", title: "French Drain Decision Guide", desc: "When a French drain is the right solution and when something else might work better.", icon: Waves },
  { num: "05", title: "Outdoor Lighting Planning Guide", desc: "Design considerations for path lighting, uplighting, safety, and smart controls.", icon: Lightbulb },
  { num: "06", title: "Pool-Area Landscaping Checklist", desc: "What to consider for drainage, privacy, plantings, and safety around pool areas.", icon: Waves },
  { num: "07", title: "Patio & Hardscape Drainage Guide", desc: "How to prevent water pooling on patios, walkways, and retaining walls.", icon: Layers },
  { num: "08", title: "HOA Common-Area Checklist", desc: "Outdoor issues HOA boards should track — irrigation, drainage, lighting, safety.", icon: Trees },
  { num: "09", title: "Seasonal Maintenance Calendar", desc: "Month-by-month outdoor tasks for Charlotte-area properties.", icon: Calendar },
  { num: "10", title: "Post-Storm Inspection Checklist", desc: "What to check after heavy rain — drainage, erosion, irrigation, hardscape.", icon: Waves },
  { num: "11", title: "Outdoor Project Planning Guide", desc: "How to plan, scope, and budget for outdoor projects from repair to installation.", icon: Flame },
  { num: "12", title: "When to Repair vs Replace", desc: "Decision framework for irrigation, drainage, lighting, and hardscape systems.", icon: ShieldCheck },
  { num: "13", title: "What to Send Before an Estimate", desc: "Photos, notes, and information that help contractors give accurate quotes.", icon: Camera },
  { num: "14", title: "How Elite Reviews, Scopes & Documents Work", desc: "Our process from intake to closeout — scopes, photos, and communication.", icon: CheckCircle2 },
];

export default function GuidePage() {
  return (
    <Layout>
      <PageSeo
        title="Greater Charlotte Outdoor Property Guide"
        description="Free 14-section guide covering sprinkler repair, irrigation maintenance, yard drainage, French drains, outdoor lighting, pool-area landscaping, hardscapes, seasonal maintenance, and outdoor project planning for Charlotte properties."
        canonical="/guide"
        jsonLd={[
          makeFaqSchema([
            { q: "What does the Charlotte Outdoor Property Guide cover?", a: "14 sections including sprinkler repair warning signs, irrigation maintenance, yard drainage, French drain decisions, outdoor lighting planning, pool-area landscaping, hardscape drainage, HOA checklists, seasonal calendar, post-storm inspection, project planning, repair vs replace decisions, estimate preparation, and Elite's documentation process." },
            { q: "Is the outdoor property guide free?", a: "Yes. The guide is completely free for homeowners, HOA boards, property managers, and anyone managing outdoor property in the Charlotte metro area." },
            { q: "Who should use this guide?", a: "Homeowners, HOA boards, property managers, commercial property owners, realtors, builders, and luxury homeowners in the Greater Charlotte area." },
            { q: "How do I get the full guide?", a: "Request it through our quick quote form or call (704) 886-4240. We'll send the complete guide to your email." },
          ]),
          makeBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Outdoor Property Guide" },
          ]),
        ]}
      />
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Outdoor Property Guide" }]} />

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-14 h-14 bg-forest-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-7 h-7 text-forest-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 mb-3">The Greater Charlotte<br /><span className="text-forest-600">Outdoor Property Guide</span></h1>
          <p className="text-lg text-stone-600 max-w-3xl mx-auto">
            A practical guide to sprinkler repair, irrigation, drainage, French drains, landscape lighting, hardscapes, outdoor living, pool-area landscaping, seasonal maintenance, and outdoor property planning.
          </p>
        </div>

        <div className="bg-stone-900 rounded-2xl p-8 md:p-12 text-center mb-16">
          <h2 className="text-2xl font-extrabold text-white mb-4">Get the Full Guide</h2>
          <p className="text-stone-400 mb-8">14 sections covering everything you need to know about outdoor property care in the Charlotte area.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/quick-quote" className="inline-flex items-center gap-2 bg-forest-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-forest-700 transition-colors">
              Request the Guide <ArrowRight className="w-4 h-4" />
            </Link>
            <a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 bg-white text-stone-900 px-6 py-3 rounded-lg font-bold">
              <Phone className="w-4 h-4" /> (704) 886-4240
            </a>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-extrabold text-stone-900 mb-8 text-center">What's Inside</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guideSections.map((section) => (
              <div key={section.num} className="bg-white border border-stone-200 rounded-xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-forest-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-sm font-extrabold text-forest-600">{section.num}</span>
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm mb-1">{section.title}</h3>
                  <p className="text-xs text-stone-600">{section.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-forest-50 border border-forest-200 rounded-2xl p-8 text-center mb-8">
          <h2 className="text-xl font-extrabold text-stone-900 mb-3">Who This Guide Is For</h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {["Homeowners", "HOA Boards", "Property Managers", "Commercial Owners", "Realtors", "Builders", "Luxury Homeowners"].map((role) => (
              <span key={role} className="bg-white text-forest-700 px-4 py-2 rounded-full text-sm font-semibold border border-forest-200">{role}</span>
            ))}
          </div>
        </div>

        <AeoBlock
          question="What should I check on my Charlotte outdoor property?"
          shortAnswer="Inspect your sprinkler system for dry spots or leaks, check for standing water after rain, test landscape lighting, examine pavers for shifting, and look for erosion around downspouts. Our free 14-section guide covers all warning signs."
          commonCauses={["Dry or brown lawn patches from sprinkler misalignment", "Standing water 24+ hours after rain signals drainage issues", "Flickering or dim landscape lights need bulb or transformer check", "Shifting or cracking pavers indicate base or drainage problems"]}
          whenToCall="If you notice any of these warning signs on your property, call or text us for a free assessment."
          whatToDoNext="Download our free 14-section guide or request a free property review."
          relatedQuestions={["How often should I check my irrigation system?", "When should French drains be cleaned?", "What month should I winterize sprinklers in Charlotte?"]}
        />

        <div className="text-center mt-8">
          <p className="text-sm text-stone-500 mb-4">Or skip the guide and go straight to a conversation:</p>
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
