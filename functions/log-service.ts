export async function onRequest(context: {
  request: Request
}) {
  console.log("📡 Request received:", context.request.url);

  try {
    return await fetch(context.request);
  } catch (err) {
    console.error("❌ Worker error:", err);
    return new Response("Internal Error", { status: 500 });
  }
}
