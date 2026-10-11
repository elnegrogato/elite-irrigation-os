import { Phone, MessageSquare, ClipboardList } from "lucide-react";
import Link from "next/link";

const PHONE = "+17048864240";

export default function StickyMobileCta() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 xl:hidden">
      <div className="border-t border-stone-200 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <div className="grid grid-cols-3 gap-0">
          <a
            href={`tel:${PHONE}`}
            className="flex min-h-[76px] flex-col items-center justify-center gap-1 py-3 active:bg-forest-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-forest-600 flex items-center justify-center">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <span className="text-[11px] font-bold text-stone-800">Call Now</span>
          </a>

          <a
            href={`sms:${PHONE}`}
            className="flex min-h-[76px] flex-col items-center justify-center gap-1 border-x border-stone-100 py-3 active:bg-forest-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-forest-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <span className="text-[11px] font-bold text-stone-800">Text Us</span>
          </a>

          <Link
            href="/quick-quote"
            className="flex min-h-[76px] flex-col items-center justify-center gap-1 py-3 active:bg-forest-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-forest-500 flex items-center justify-center">
              <ClipboardList className="w-4 h-4 text-white" />
            </div>
            <span className="text-[11px] font-bold text-stone-800">Quick Quote</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
