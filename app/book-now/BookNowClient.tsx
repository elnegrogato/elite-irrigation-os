'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '../../src/components/Layout';
import PageHero from '../../src/components/PageHero';
import Breadcrumbs from '../../src/components/Breadcrumbs';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Phone, MessageSquare, CheckCircle2, ArrowRight, ShieldCheck, Camera } from 'lucide-react';

const PHONE = "+17048864240";

export default function BookNowPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    service: 'Irrigation Repair',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const createLead = useMutation(api.leads.createLead);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        addressText: formData.address,
        serviceSlug: formData.service.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        message: formData.message,
        surfaceHint: 'book-now',
      });
      setIsSuccess(true);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
      alert('Error sending request. Please call us at (704) 886-4240.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <div className="w-20 h-20 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-forest-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 mb-4">Request Sent!</h1>
          <p className="text-lg text-stone-600 mb-10">
            We've received your booking request. One of our local experts will reach out within one business day.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 bg-forest-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-forest-700 transition-colors">
            Return to Homepage
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Book Now' }]} />
      
      <PageHero 
        title="Get on the Schedule" 
        subtitle="Professional outdoor services in the Charlotte metro area. Fill out the form or reach us directly via phone or text." 
        chips={["Free Estimates", "NC Licensed", "Fast Response"]}
      />

      <div className="mb-24 grid gap-8 lg:grid-cols-5 xl:gap-12">
        <div className="min-w-0 lg:col-span-3">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xl sm:p-8 md:p-12">
            <h2 className="text-2xl font-bold text-stone-900 mb-8">Project Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="book-now-name" className="block text-xs font-bold text-stone-700 mb-2 uppercase tracking-widest">Full Name</label>
                  <input 
                    id="book-now-name"
                    required
                    type="text" 
                    className="w-full p-4 border border-stone-200 rounded-xl focus:border-forest-500 focus:ring-forest-500 outline-none transition-all" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label htmlFor="book-now-email" className="block text-xs font-bold text-stone-700 mb-2 uppercase tracking-widest">Email Address</label>
                  <input 
                    id="book-now-email"
                    required
                    type="email" 
                    className="w-full p-4 border border-stone-200 rounded-xl focus:border-forest-500 focus:ring-forest-500 outline-none transition-all" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="book-now-phone" className="block text-xs font-bold text-stone-700 mb-2 uppercase tracking-widest">Phone Number</label>
                  <input 
                    id="book-now-phone"
                    required
                    type="tel" 
                    className="w-full p-4 border border-stone-200 rounded-xl focus:border-forest-500 focus:ring-forest-500 outline-none transition-all" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label htmlFor="book-now-service" className="block text-xs font-bold text-stone-700 mb-2 uppercase tracking-widest">Service Needed</label>
                  <select 
                    id="book-now-service"
                    className="w-full p-4 border border-stone-200 rounded-xl focus:border-forest-500 focus:ring-forest-500 outline-none transition-all bg-white"
                    value={formData.service}
                    onChange={(e) => setFormData({...formData, service: e.target.value})}
                  >
                    <option>Landscape Design and Installation</option>
                    <option>Irrigation Systems</option>
                    <option>Irrigation and Water Management Services</option>
                    <option>Lawn Care and Maintenance</option>
                    <option>Tree and Shrub Care Services</option>
                    <option>Weed and Pest Control Treatments</option>
                    <option>Patio Installs</option>
                    <option>Retaining Walls</option>
                    <option>Drainage Fixes</option>
                    <option>Landscaping</option>
                    <option>Drainage</option>
                    <option>Hardscapes</option>
                    <option>Outdoor Lighting</option>
                    <option>Commercial Grounds</option>
                    <option>Seasonal Cleanup</option>
                    <option>Snow & Ice Removal</option>
                    <option>Christmas Lighting</option>
                    <option>Sod / Grading</option>
                    <option>Property Maintenance</option>
                    <option>Other / Not Sure</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="book-now-address" className="block text-xs font-bold text-stone-700 mb-2 uppercase tracking-widest">Property Address</label>
                <input
                  id="book-now-address"
                  required
                  type="text"
                  className="w-full p-4 border border-stone-200 rounded-xl focus:border-forest-500 focus:ring-forest-500 outline-none transition-all"
                  placeholder="Street address, city, and ZIP"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <div>
                <label htmlFor="book-now-message" className="block text-xs font-bold text-stone-700 mb-2 uppercase tracking-widest">How can we help?</label>
                <textarea 
                  id="book-now-message"
                  required
                  className="w-full p-4 border border-stone-200 rounded-xl focus:border-forest-500 focus:ring-forest-500 outline-none transition-all h-32" 
                  placeholder="Describe the issue or project goals..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>
              <button 
                disabled={isSubmitting}
                className="w-full bg-forest-600 text-white font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-forest-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Request Free Estimate'}
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-8 lg:col-span-2">
          <div className="rounded-2xl bg-forest-900 p-5 text-white shadow-xl sm:p-8">
            <h3 className="text-xl font-bold mb-6">Need Immediate Help?</h3>
            <div className="space-y-6">
              <a href={`tel:${PHONE}`} className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-forest-800 rounded-full flex items-center justify-center group-hover:bg-forest-700 transition-colors">
                  <Phone className="w-6 h-6 text-forest-300" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-forest-400 font-bold">Call Us</div>
                  <div className="text-xl font-bold">(704) 886-4240</div>
                </div>
              </a>
              <a href={`sms:${PHONE}`} className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-forest-500 rounded-full flex items-center justify-center group-hover:bg-forest-600 transition-colors">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-forest-400 font-bold">Text Us Photos</div>
                  <div className="text-xl font-bold">(704) 886-4240</div>
                </div>
              </a>
            </div>
            
            <div className="mt-10 pt-8 border-t border-forest-800 space-y-4">
              <div className="flex items-center gap-3 text-sm text-forest-300">
                <ShieldCheck className="w-5 h-5 text-forest-500" />
                <span>NC Licensed Contractor (NCICLB)</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-forest-300">
                <Camera className="w-5 h-5 text-forest-500" />
                <span>Photo-Documented Service</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-forest-300">
                <CheckCircle2 className="w-5 h-5 text-forest-500" />
                <span>Free Initial Assessment</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5 sm:p-8">
            <h4 className="font-bold text-stone-900 mb-4">Our Service Area</h4>
            <p className="text-sm text-stone-600 mb-6">
              Based in Harrisburg, we serve the entire Charlotte metro area including Concord, Huntersville, Lake Norman, and Northern SC.
            </p>
            <Link href="/areas-we-serve" className="text-forest-600 font-bold text-sm inline-flex items-center gap-2 hover:underline">
              View full coverage map <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
