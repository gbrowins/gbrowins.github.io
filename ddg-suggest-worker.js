// Cloudflare Worker: DuckDuckGo suggestion proxy
//
// Does exactly one thing: forwards ?q= to DuckDuckGo's own suggestion endpoint
// and returns the result with a CORS header so your homepage can read it.
// No data is sent anywhere except to DuckDuckGo.
//
// SETUP:
// 1. Go to https://dash.cloudflare.com -> Workers & Pages -> Create -> Create Worker.
// 2. Give it any name (e.g. "ddg-suggest-proxy"), deploy the default template.
// 3. Click "Edit code", delete everything, paste this whole file in, click "Deploy".
// 4. Copy the resulting URL (looks like https://ddg-suggest-proxy.YOURNAME.workers.dev)
//    and paste it into the WORKER_URL constant in start.html.
// 5. Edit ALLOWED_ORIGIN below to your actual homepage's origin (scheme + host,
//    no trailing slash or path), e.g. "https://gregg.github.io" -- this stops
//    random other sites from riding on your Worker's free-tier quota.

const ALLOWED_ORIGIN = "https://gbrowins.github.io";

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    const url = new URL(request.url);
    const q = (url.searchParams.get("q") || "").trim();
    if (!q) return json([], 200);

    const ddgUrl = "https://ac.duckduckgo.com/ac/?q=" + encodeURIComponent(q) + "&type=list";

    try {
      const resp = await fetch(ddgUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; personal-homepage-suggest-proxy)" },
      });
      if (!resp.ok) return json([], 502);
      const data = await resp.json();
      return json(data, 200);
    } catch (err) {
      return json([], 502);
    }
  },
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
}