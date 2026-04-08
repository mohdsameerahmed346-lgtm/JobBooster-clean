export async function POST(req) {
  const body = await req.json();

  // TEMP FAKE AI RESPONSE (to avoid build errors)
  return new Response(
    JSON.stringify({
      result: "Your resume looks good. Add more metrics and strong action words."
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
