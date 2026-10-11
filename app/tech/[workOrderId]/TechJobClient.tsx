"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { services } from "../../../data/services";
import { buildChecklists } from "../../../src/lib/contentBlocks";

async function uploadToConvex(url: string, file: File) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!response.ok) {
    throw new Error("Upload failed");
  }
  const { storageId } = await response.json();
  return storageId;
}

function findService(slug: string) {
  return services.find(s => s.slug === slug);
}

export default function TechJobPage() {
  const { workOrderId } = useParams<{ workOrderId: string }>();
  const detail = useQuery(api.workOrders.get, workOrderId ? { workOrderId: workOrderId as any } : "skip" as any);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const attachMedia = useMutation(api.files.attachWorkOrderMedia);
  const setNotes = useMutation(api.workOrders.setNotes);
  const tryComplete = useMutation(api.workOrders.tryComplete);

  const [notes, setNotesLocal] = useState("");
  const [busy, setBusy] = useState(false);

  const wo = detail?.wo;
  const svc = wo ? findService(wo.serviceSlug) : undefined;
  const checklists = useMemo(() => (svc ? buildChecklists(svc) : null), [svc]);

  async function handleUpload(kind: string, file: File, caption?: string) {
    if (!wo) return;
    setBusy(true);
    try {
      const url = await generateUploadUrl({});
      const storageId = await uploadToConvex(url as any, file);
      await attachMedia({ workOrderId: wo._id, storageId, kind, caption });
    } finally {
      setBusy(false);
    }
  }

  async function captureSignature() {
    // Super simple: user draws on canvas, then exports PNG
    const canvas = document.getElementById("sig") as HTMLCanvasElement | null;
    if (!canvas) return;
    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) return;
    const file = new File([blob], `signature-${Date.now()}.png`, { type: "image/png" });
    await handleUpload("signature", file, "Customer signature");
  }

  if (!detail) {
    return (
      <div className="text-sm text-zinc-600 p-4">Loading...</div>
    );
  }
  if (!wo) {
    return (
      <div className="text-sm text-zinc-600 p-4">Work order not found.</div>
    );
  }

  return (
    <>
      <div className="rounded-sm border border-zinc-200 bg-white p-4 shadow-sm mb-4">
        <div className="text-lg font-bold text-slate-900 mb-1">{wo.serviceSlug}</div>
        <div className="flex flex-wrap gap-2 mb-3">
           <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wide border border-slate-200 rounded-sm">{wo.status}</span>
           <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wide border border-slate-200 rounded-sm">{wo.priority}</span>
        </div>
        <div className="text-sm text-zinc-600">
          {wo.locationSlug ?? "—"} • {wo.addressText ?? "—"}
        </div>
      </div>

      {/* Checklist */}
      {checklists ? (
        <div className="mb-4 rounded-sm border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="font-bold text-xs uppercase tracking-widest text-slate-500 mb-3">Checklist</div>
          <div className="grid gap-3">
            <div className="p-3 bg-slate-50 rounded-sm border border-slate-100">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-700 mb-2">Pre-Arrival</div>
              <ul className="list-disc pl-4 text-xs text-zinc-600 space-y-1">
                {checklists.preArrival.map(x => <li key={x}>{x}</li>)}
              </ul>
            </div>
            <div className="p-3 bg-slate-50 rounded-sm border border-slate-100">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-700 mb-2">On-Site</div>
              <ul className="list-disc pl-4 text-xs text-zinc-600 space-y-1">
                {checklists.onSite.map(x => <li key={x}>{x}</li>)}
              </ul>
            </div>
            <div className="p-3 bg-slate-50 rounded-sm border border-slate-100">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-700 mb-2">Closeout</div>
              <ul className="list-disc pl-4 text-xs text-zinc-600 space-y-1">
                {checklists.closeout.map(x => <li key={x}>{x}</li>)}
              </ul>
            </div>
          </div>
        </div>
      ) : null}

      {/* Media Uploads */}
      <div className="mb-4 rounded-sm border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="font-bold text-xs uppercase tracking-widest text-slate-500 mb-3">Proof Evidence</div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <label className="flex items-center justify-center rounded-sm border border-dashed border-zinc-300 p-4 text-xs font-bold uppercase tracking-wide cursor-pointer hover:bg-zinc-50 text-slate-600">
            + Before
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (f) await handleUpload("before", f, "Before");
              }}
            />
          </label>

          <label className="flex items-center justify-center rounded-sm border border-dashed border-zinc-300 p-4 text-xs font-bold uppercase tracking-wide cursor-pointer hover:bg-zinc-50 text-slate-600">
            + After
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (f) await handleUpload("after", f, "After");
              }}
            />
          </label>

          <label className="flex items-center justify-center rounded-sm border border-dashed border-zinc-300 p-4 text-xs font-bold uppercase tracking-wide cursor-pointer hover:bg-zinc-50 text-slate-600">
            + During
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (f) await handleUpload("during", f, "During");
              }}
            />
          </label>

          <label className="flex items-center justify-center rounded-sm border border-dashed border-zinc-300 p-4 text-xs font-bold uppercase tracking-wide cursor-pointer hover:bg-zinc-50 text-slate-600">
            + Video
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (f) await handleUpload("video", f, "Test video");
              }}
            />
          </label>
        </div>

        {busy ? <div className="text-xs text-zinc-500 animate-pulse mb-4">Uploading...</div> : null}

        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Uploaded</div>
          <div className="grid grid-cols-3 gap-2">
            {detail.media.map((m: any) => (
              <div key={m._id} className="rounded-sm border border-zinc-200 overflow-hidden bg-slate-50 relative aspect-square">
                <Image
                  src={m.url}
                  alt={m.kind || "Work order photo"}
                  fill
                  sizes="120px"
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] p-1 truncate text-center">{m.kind}</div>
              </div>
            ))}
            {detail.media.length === 0 && <div className="text-xs text-slate-400 italic col-span-3">No media yet.</div>}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="mb-4 rounded-sm border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="font-bold text-xs uppercase tracking-widest text-slate-500 mb-3">Work Notes</div>
        <textarea
          className="w-full rounded-sm border border-zinc-200 p-3 text-sm focus:outline-none focus:border-elite-500"
          rows={3}
          defaultValue={wo.notes ?? ""}
          onChange={(e) => setNotesLocal(e.target.value)}
          placeholder="Describe work done, parts used, test results..."
        />
        <div className="flex justify-end mt-2">
            <button
            className="rounded-sm bg-white border border-slate-200 px-3 py-2 text-xs font-bold uppercase tracking-wider hover:bg-slate-50"
            onClick={async () => {
                await setNotes({ workOrderId: wo._id, notes: notes });
                alert("Notes saved.");
            }}
            >
            Save Notes
            </button>
        </div>
      </div>

      {/* Signature */}
      <div className="mb-6 rounded-sm border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="font-bold text-xs uppercase tracking-widest text-slate-500 mb-2">Customer Signature</div>
        <p className="text-xs text-zinc-500 mb-3">Sign below to confirm satisfaction.</p>
        <div className="rounded-sm border border-zinc-200 overflow-hidden bg-slate-50">
          <canvas id="sig" width={600} height={180} style={{ width: "100%", height: 180, touchAction: "none" }} />
        </div>
        <div className="mt-3 flex gap-2 justify-end">
          <button
            className="rounded-sm border border-zinc-200 px-3 py-2 text-xs font-bold uppercase tracking-wider hover:bg-slate-50"
            onClick={() => {
              const canvas = document.getElementById("sig") as HTMLCanvasElement | null;
              if (!canvas) return;
              const ctx = canvas.getContext("2d");
              if (!ctx) return;
              ctx.clearRect(0, 0, canvas.width, canvas.height);
            }}
          >
            Clear
          </button>
          <button
            className="rounded-sm bg-slate-900 text-white px-3 py-2 text-xs font-bold uppercase tracking-wider"
            onClick={captureSignature}
          >
            Save Signature
          </button>
        </div>
      </div>

      {/* Completion */}
      <button
        className="w-full rounded-sm bg-elite-600 text-white px-4 py-4 text-sm font-bold uppercase tracking-widest hover:bg-elite-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={wo.proofRequired && !wo.proofComplete}
        onClick={async () => {
          try {
            await tryComplete({ workOrderId: wo._id });
            alert("Marked completed. Case study draft will auto-generate.");
            window.location.reload();
          } catch (e: any) {
            alert(String(e?.message ?? e));
          }
        }}
      >
        {wo.proofRequired && !wo.proofComplete ? "Proof Required to Complete" : "Mark Job Completed"}
      </button>

      {/* Signature drawing logic script injection */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
          (function(){
            const canvas = document.getElementById('sig');
            if(!canvas) return;
            const ctx = canvas.getContext('2d');
            let drawing = false;
            function pos(e){
              const r = canvas.getBoundingClientRect();
              const x = (e.touches?e.touches[0].clientX:e.clientX) - r.left;
              const y = (e.touches?e.touches[0].clientY:e.clientY) - r.top;
              return {x: x*(canvas.width/r.width), y: y*(canvas.height/r.height)};
            }
            function start(e){ drawing=true; const p=pos(e); ctx.beginPath(); ctx.moveTo(p.x,p.y); if(e.type!='mousedown') e.preventDefault(); }
            function move(e){ if(!drawing) return; const p=pos(e); ctx.lineWidth=3; ctx.lineCap='round'; ctx.strokeStyle='#000'; ctx.lineTo(p.x,p.y); ctx.stroke(); if(e.type!='mousemove') e.preventDefault(); }
            function end(){ drawing=false; }
            canvas.addEventListener('mousedown', start);
            canvas.addEventListener('mousemove', move);
            window.addEventListener('mouseup', end);
            canvas.addEventListener('touchstart', start, {passive:false});
            canvas.addEventListener('touchmove', move, {passive:false});
            canvas.addEventListener('touchend', end);
          })();
        `,
        }}
      />
    </>
  );
}
