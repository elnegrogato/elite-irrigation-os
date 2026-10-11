// src/pages/tech/TechLoginPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAssignee, setAssignee } from "./techAuth";

export default function TechLoginPage() {
  const nav = useNavigate();
  const existing = getAssignee();
  const [code, setCode] = useState(existing ?? "");

  return (
    <div className="min-h-screen bg-slate-50 text-zinc-900 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm rounded-sm border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="font-serif font-bold text-2xl mb-2 text-slate-900">Elite Tech Portal</div>
        <p className="mb-6 text-sm text-zinc-500">Enter your crew assignment ID to access jobs.</p>

        <input
          className="w-full rounded-sm border border-zinc-200 p-3 text-sm focus:border-elite-500 outline-none transition-colors"
          placeholder="e.g. crew-1"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <button
          className="mt-6 w-full rounded-sm bg-elite-900 text-white px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-elite-800 transition-colors"
          onClick={() => {
            if (!code.trim()) return;
            setAssignee(code.trim());
            nav("/tech/jobs");
          }}
        >
          Access Dashboard
        </button>
      </div>
    </div>
  );
}