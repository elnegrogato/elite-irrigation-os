export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({
    ok: true,
    service: "elite-irrigation-landscaping-os",
    timestamp: new Date().toISOString(),
  });
}
