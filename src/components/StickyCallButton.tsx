// src/components/StickyCallButton.tsx
import { Phone } from "lucide-react";

export default function StickyCallButton({ phone }: { phone: string }) {
  return (
    <a
      href={`tel:${phone.replace(/[^\d+]/g, "")}`}
      className="fixed bottom-6 right-6 rounded-full bg-elite-900 text-white px-6 py-4 shadow-2xl text-sm font-bold uppercase tracking-widest flex items-center hover:scale-105 transition-transform z-50 border-4 border-white"
    >
      <Phone className="w-4 h-4 mr-2" />
      <span className="hidden sm:inline">Call </span>{phone}
    </a>
  );
}