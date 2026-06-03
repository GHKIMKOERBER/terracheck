const { getStore } = require("@netlify/blobs");

exports.handler = async function(event) {

  // Nur POST erlaubt
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch(e) {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  const { uid, eteam, fokusF, sdt, scores, timestamp, headline, nextstep } = data;

  if (!uid) {
    return { statusCode: 400, body: "UID fehlt" };
  }

  // ── HTML GENERIEREN ──────────────────────────────
  const html = buildResultHTML({ uid, eteam, fokusF, sdt, scores, timestamp, headline, nextstep });

  // ── IN BLOB STORAGE SPEICHERN ────────────────────
  try {
    const store = getStore("terra-results");
    await store.set(`${uid}.html`, html, {
      metadata: {
        uid,
        eteam,
        fokusF,
        sdt,
        timestamp: timestamp || new Date().toISOString(),
      }
    });

    // Öffentliche URL zusammenbauen
    const siteUrl = process.env.URL || "https://check.kimkoerber.com";
    const resultUrl = `${siteUrl}/.netlify/blobs/terra-results/${uid}.html`;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true, url: resultUrl, uid })
    };

  } catch(err) {
    console.error("Blob Storage Fehler:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
};

// ── HTML BUILDER ─────────────────────────────────
function buildResultHTML({ uid, eteam, fokusF, sdt, scores, timestamp, headline, nextstep }) {

  const fScores = scores?.F || {};
  const sScores = scores?.S || {};
  const fTotal  = Object.values(fScores).reduce((a,b) => a+b, 0) || 1;
  const sTotal  = Object.values(sScores).reduce((a,b) => a+b, 0) || 1;

  const sdtLabels = { auto: "Autonomie", zug: "Zugehörigkeit", wirk: "Wirksamkeit" };
  const fColors = {
    Firma:"#4F69B0", Freude:"#F8AB26", Familie:"#E05A5A",
    Freunde:"#9B59B6", Fitness:"#53B263", Finanzen:"#2AA9B0", Fundament:"#7B8EA0"
  };

  const fBars = Object.entries(fScores)
    .sort((a,b) => b[1]-a[1])
    .map(([f, v]) => {
      const pct = Math.round((v / fTotal) * 100);
      const isWin = f === fokusF;
      return `
        <div style="margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
            <span style="font-size:13px;font-weight:${isWin?'700':'400'};color:${isWin?fColors[f]:'#374151'};">
              ${isWin ? '▶ ' : ''}${f}
            </span>
            <span style="font-size:12px;color:#6B7280;">${v} Pkt · ${pct}%</span>
          </div>
          <div style="background:#F3F4F6;border-radius:4px;height:8px;">
            <div style="background:${fColors[f]||'#888'};width:${pct}%;height:8px;border-radius:4px;"></div>
          </div>
        </div>`;
    }).join('');

  const sdtPills = Object.entries(sScores)
    .sort((a,b) => b[1]-a[1])
    .map(([k, v], i) => {
      const pct = Math.round((v / sTotal) * 100);
      const isDom = i === 0;
      return `
        <div style="flex:1;background:${isDom?'#D1FAE5':'#F3F4F6'};border:${isDom?'2px solid #53B263':'2px solid #E5E7EB'};border-radius:8px;padding:12px;text-align:center;">
          <div style="font-size:11px;font-weight:700;color:${isDom?'#065F46':'#6B7280'};text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px;">${sdtLabels[k]||k}</div>
          <div style="font-size:20px;font-weight:700;color:${isDom?'#065F46':'#374151'};">${pct}%</div>
        </div>`;
    }).join('');

  const ts = timestamp || new Date().toLocaleString('de-DE');

  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TERRA Ergebnis · ${uid}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Helvetica Neue',Helvetica,Arial,sans-serif; background:#F3F4F6; color:#1F2937; }
  .container { max-width:600px; margin:24px auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,.08); }
  .hero { background:#1F2937; padding:28px 32px; }
  .section { padding:24px 32px; border-bottom:1px solid #F3F4F6; }
  .section:last-child { border-bottom:none; }
  .eyebrow { font-size:10px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:#9CA3AF; margin-bottom:6px; }
  .card { background:#F9FAFB; border:1.5px solid #E5E7EB; border-radius:10px; padding:16px 18px; margin-bottom:12px; }
  .footer { background:#1F2937; padding:16px 32px; text-align:center; }
  @media print { .cta-btn { display:none; } }
</style>
</head>
<body>
<div class="container">

  <!-- HERO -->
  <div class="hero">
    <div style="font-size:10px;font-weight:700;color:#F8AB26;letter-spacing:.12em;text-transform:uppercase;margin-bottom:10px;">TERRA Check 3.3 · Ergebnis</div>
    <h1 style="font-size:22px;font-weight:700;color:#fff;margin-bottom:8px;line-height:1.2;">${eteam} · Fokus ${fokusF}</h1>
    <div style="font-size:12px;color:#9CA3AF;">
      UID: <strong style="color:#F8AB26;font-family:'Courier New',monospace;">${uid}</strong>
      &nbsp;·&nbsp; ${ts}
    </div>
  </div>

  <!-- KOMBINIERTES PROFIL -->
  <div class="section">
    <div class="eyebrow">Dein kombiniertes Profil</div>
    <div style="font-size:16px;font-weight:700;color:#1F2937;margin-bottom:10px;line-height:1.4;">${headline||''}</div>
    <div style="font-size:13px;color:#4B5563;line-height:1.7;">${nextstep||''}</div>
  </div>

  <!-- DIMENSIONEN -->
  <div class="section">
    <div class="eyebrow" style="margin-bottom:12px;">Deine drei Dimensionen</div>
    <div class="card" style="border-color:#C59ECA;background:#F5F0FF;">
      <div style="font-size:9px;font-weight:700;color:#5B21B6;letter-spacing:.1em;text-transform:uppercase;margin-bottom:4px;">E-Team-Typ</div>
      <div style="font-size:18px;font-weight:700;color:#5B21B6;">${eteam}</div>
    </div>
    <div class="card" style="border-color:#F8AB26;background:#FFFBEB;">
      <div style="font-size:9px;font-weight:700;color:#633806;letter-spacing:.1em;text-transform:uppercase;margin-bottom:4px;">Fokus-F</div>
      <div style="font-size:18px;font-weight:700;color:#633806;">${fokusF}</div>
    </div>
    <div class="card" style="border-color:#53B263;background:#D1FAE5;">
      <div style="font-size:9px;font-weight:700;color:#065F46;letter-spacing:.1em;text-transform:uppercase;margin-bottom:4px;">SDT-Dimension</div>
      <div style="font-size:18px;font-weight:700;color:#065F46;">${sdtLabels[sdt]||sdt}</div>
    </div>
  </div>

  <!-- 7F BARS -->
  <div class="section">
    <div class="eyebrow" style="margin-bottom:16px;">Dein 7F-Energieprofil</div>
    ${fBars}
  </div>

  <!-- SDT PILLS -->
  <div class="section">
    <div class="eyebrow" style="margin-bottom:12px;">SDT-Dimensionen</div>
    <div style="display:flex;gap:8px;">${sdtPills}</div>
  </div>

  <!-- CTA -->
  <div class="section" style="text-align:center;padding:28px 32px;">
    <a class="cta-btn" href="https://tidycal.com/tckimkoerber/terra-clarity-call"
       style="display:inline-block;background:#F8AB26;color:#1F2937;font-weight:700;font-size:14px;padding:14px 28px;border-radius:8px;text-decoration:none;">
      TERRA Clarity Call buchen · 45 Min · 150 €
    </a>
    <div style="font-size:11px;color:#9CA3AF;margin-top:10px;">Kein Funnel. Kein Verkaufsdruck. Direkt mit Kim.</div>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <div style="font-size:11px;color:#6B7280;">TERRA Check 3.3 · kimkoerber.com · UID: ${uid}</div>
  </div>

</div>
</body>
</html>`;
}
