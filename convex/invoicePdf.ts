// convex/invoicePdf.ts
import { action } from "convex/server";
import { v } from "convex/values";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { api } from "./_generated/api";

export const generateInvoicePdf = action({
  args: { invoiceId: v.id("invoices") },
  handler: async (ctx, { invoiceId }) => {
    const inv: any = await ctx.runQuery(api.invoices.get, { invoiceId });
    if (!inv) throw new Error("Invoice not found");

    const wo = inv.workOrderId ? await ctx.runQuery(api.workOrders.get, { workOrderId: inv.workOrderId }) : null;
    // note: workOrders.get returns { wo, media }, we need just wo
    const workOrder = wo?.wo ?? null;
    
    const lead = inv.leadId ? await ctx.runQuery(api.leads.get, { leadId: inv.leadId }) : null;

    const pdf = await PDFDocument.create();
    const page = pdf.addPage([612, 792]); // letter
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

    const draw = (text: string, x: number, y: number, size = 11, isBold = false) => {
      page.drawText(text, { x, y, size, font: isBold ? bold : font });
    };

    let y = 740;
    draw("ELITE IRRIGATION & LANDSCAPING", 50, y, 16, true);
    y -= 20;
    draw("Invoice", 50, y, 13, true);
    y -= 18;

    draw(`Invoice ID: ${String(inv._id)}`, 50, y);
    y -= 14;
    draw(`Status: ${inv.status}`, 50, y);
    y -= 14;
    draw(`Date: ${new Date(inv.createdAt).toLocaleDateString()}`, 50, y);
    y -= 24;

    draw("Bill To:", 50, y, 12, true);
    y -= 14;
    draw(`${lead?.name ?? "Customer"}`, 50, y);
    y -= 14;
    if (lead?.phone) { draw(`Phone: ${lead.phone}`, 50, y); y -= 14; }
    if (lead?.email) { draw(`Email: ${lead.email}`, 50, y); y -= 14; }
    y -= 10;

    draw("Job:", 50, y, 12, true);
    y -= 14;
    draw(`Service: ${workOrder?.serviceSlug ?? "—"}`, 50, y); y -= 14;
    draw(`Location: ${workOrder?.locationSlug ?? "—"}`, 50, y); y -= 14;
    if (workOrder?.addressText) { draw(`Address: ${workOrder.addressText}`, 50, y); y -= 14; }
    y -= 18;

    draw("Charges", 50, y, 12, true); y -= 14;
    draw(`Subtotal: $${inv.subtotal.toFixed(2)}`, 50, y); y -= 14;
    draw(`Tax: $${inv.tax.toFixed(2)}`, 50, y); y -= 14;
    draw(`Total: $${inv.total.toFixed(2)}`, 50, y, 12, true); y -= 18;

    draw(`Amount Paid: $${(inv.amountPaid ?? 0).toFixed(2)}`, 50, y); y -= 14;
    draw(`Balance Due: $${(inv.balanceDue ?? inv.total).toFixed(2)}`, 50, y, 12, true); y -= 24;

    if (inv.notes) {
      draw("Notes:", 50, y, 12, true); y -= 14;
      const lines = String(inv.notes).split("\n").slice(0, 12);
      for (const line of lines) { draw(line.slice(0, 90), 50, y); y -= 12; }
    }

    const bytes = await pdf.save();
    const blob = new Blob([bytes], { type: "application/pdf" });
    const storageId = await ctx.storage.store(blob);
    const url = await ctx.storage.getUrl(storageId);

    await ctx.runMutation(api.invoicePdfMutations.attachPdfMut2, { invoiceId, storageId, url: url! });

    return { ok: true, storageId, url };
  },
});

// helper mutation to patch invoice
export const attachPdfMut = action({
  args: { invoiceId: v.id("invoices"), storageId: v.string(), url: v.string() } as any,
  handler: async (ctx, { invoiceId, storageId, url }: any) => {
    await ctx.runMutation(api.invoicePdfMutations.attachPdfMut2, { invoiceId, storageId, url });
    return true;
  },
});