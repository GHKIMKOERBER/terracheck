const { getStore } = require("@netlify/blobs");

exports.handler = async function(event) {

  const uid = (event.queryStringParameters && event.queryStringParameters.uid) || "";

  if (!uid) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" },
      body: "<h1>Fehlende ID</h1><p>Kein Ergebnis angegeben.</p>"
    };
  }

  // UID validieren (nur erlaubte Zeichen, Schutz vor Missbrauch)
  if (!/^TRR-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(uid)) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" },
      body: "<h1>Ungültige ID</h1><p>Das Format der ID ist nicht korrekt.</p>"
    };
  }

  try {
    const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
    const token  = process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_API_TOKEN;

    let store;
    if (siteID && token) {
      store = getStore({ name: "terra-results", siteID: siteID, token: token });
    } else {
      store = getStore("terra-results");
    }

    const html = await store.get(`${uid}.html`);

    if (!html) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "text/html; charset=utf-8" },
        body: "<h1>Ergebnis nicht gefunden</h1><p>Zu dieser ID gibt es kein gespeichertes Ergebnis.</p>"
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=31536000, immutable"
      },
      body: html
    };

  } catch(err) {
    console.error("get-result Fehler:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "text/html; charset=utf-8" },
      body: "<h1>Fehler</h1><p>Das Ergebnis konnte nicht geladen werden.</p>"
    };
  }
};
