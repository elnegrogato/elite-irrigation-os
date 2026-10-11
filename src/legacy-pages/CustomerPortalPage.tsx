import Link from "next/link";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import PageSeo, { makeBreadcrumbSchema } from "../components/PageSeo";
import {
  User, Phone, FileText, Clock, ShieldCheck,
  CheckCircle2, ArrowRight, Lock, Bell, Camera
} from "lucide-react";

const PHONE = "+17048864240";

export default function CustomerPortalPage() {
  return (
    <Layout>
      <PageSeo
        title="Customer Portal — Coming Soon"
        description="The Elite customer portal is coming soon. Track service history, view photo documentation, submit requests, and manage your outdoor maintenance online. In the meantime, call or text us directly."
        canonical="/customer-portal"
        jsonLd={[
          makeBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Customer Portal" },
          ]),
        ]}
      />
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Customer Portal" }]} />

      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="w-20 h-20 bg-forest-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-forest-600" />
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 mb-4">Customer Portal<br /><span className="text-forest-600">Coming Soon</span></h1>
        <p className="text-lg text-stone-600 max-w-2xl mx-auto mb-12">
          We're building a secure online portal where you can track service history, view photo documentation, submit requests, and manage your outdoor maintenance — all in one place.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {[
            { icon: FileText, title: "Service History", desc: "View past service visits with notes and photos." },
            { icon: Camera, title: "Photo Documentation", desc: "Access before, during, and after photos from every visit." },
            { icon: Bell, title: "Request Service", desc: "Submit new requests and track status online." },
            { icon: ShieldCheck, title: "Secure Access", desc: "Your property data protected with secure login." },
          ].map((item) => (
            <div key={item.title} className="bg-stone-50 border border-stone-200 rounded-xl p-5">
              <item.icon className="w-6 h-6 text-stone-400 mx-auto mb-2" />
              <h3 className="font-bold text-stone-700 mb-1 text-sm">{item.title}</h3>
              <p className="text-xs text-stone-500">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-forest-50 border border-forest-200 rounded-2xl p-8 mb-8">
          <h2 className="text-xl font-bold text-stone-900 mb-3">In the Meantime</h2>
          <p className="text-stone-600 mb-6">You can reach us directly for any service requests, questions, or documentation needs.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 bg-forest-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-forest-700 transition-colors">
              <Phone className="w-4 h-4" /> Call (704) 886-4240
            </a>
            <a href={`sms:${PHONE}`} className="inline-flex items-center gap-2 bg-amber-500 text-white px-8 py-3 rounded-lg font-bold">
              <Camera className="w-4 h-4" /> Text Photos
            </a>
            <Link href="/quick-quote" className="inline-flex items-center gap-2 bg-white text-forest-700 px-8 py-3 rounded-lg font-bold border-2 border-forest-200">
              Quick Quote
            </Link>
          </div>
        </div>

        <div className="text-sm text-stone-500">
          <p>Existing staff? <Link href="/admin" className="text-forest-600 font-semibold hover:underline">Sign in to the admin portal →</Link></p>
        </div>
      </div>
    </Layout>
  );
}
