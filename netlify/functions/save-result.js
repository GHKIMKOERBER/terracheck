const { getStore } = require("@netlify/blobs");
const TERRA = require("./terra-content.js");

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

  const { uid, eteam, fokusF, sdt, scores, timestamp, headline, nextstep, winF, winE, winS } = data;

  if (!uid) {
    return { statusCode: 400, body: "UID fehlt" };
  }

  // ── HTML GENERIEREN ──────────────────────────────
  const html = buildResultHTML({ uid, eteam, fokusF, sdt, scores, timestamp, headline, nextstep, winF, winE, winS });

  // ── IN BLOB STORAGE SPEICHERN ────────────────────
  try {
    // Store mit expliziten Credentials konfigurieren (robuster als auto-detect)
    const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
    const token  = process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_API_TOKEN;

    let store;
    if (siteID && token) {
      store = getStore({ name: "terra-results", siteID: siteID, token: token });
    } else {
      store = getStore("terra-results");
    }

    await store.set(`${uid}.html`, html, {
      metadata: {
        uid,
        eteam,
        fokusF,
        sdt,
        timestamp: timestamp || new Date().toISOString(),
      }
    });

    // Öffentliche URL über get-result Function
    const siteUrl = process.env.URL || "https://check.kimkoerber.com";
    const resultUrl = `${siteUrl}/.netlify/functions/get-result?uid=${uid}`;

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

// ── HTML BUILDER (nutzt terra-content.js) ────────
function buildResultHTML(data) {
  const uid = data.uid;
  const timestamp = data.timestamp || "";

  // Body über die gemeinsame Funktion bauen (1:1 wie im Browser)
  const body = TERRA.buildResultBodyHTML({
    winF:   data.winF   || data.fokusF,
    winE:   data.winE,
    winS:   data.winS   || data.sdt,
    scores: data.scores || { F:{}, S:{} }
  }, { interactive: false });

  const CSS = `
:root {
  --gold:#F8AB26; --gold-bg:#FEF3C7; --gold-dark:#633806;
  --blue:#4F69B0; --blue-dark:#3B5292; --blue-bg:#DBEAFE; --blue-mid:#1E3A6E;
  --green:#53B263; --green-bg:#D1FAE5; --green-dark:#065F46;
  --red:#C91D1C; --red-bg:#FEE2E2;
  --purple:#C59ECA; --purple-bg:#EDE9FE; --purple-dark:#5B21B6;
  --orange:#EF7728; --orange-bg:#FFEDD5;
  --teal:#10B981; --teal-bg:#D1FAE5;
  --slate:#64748B; --slate-bg:#F1F5F9;
  --black:#000; --dark:#1F2937; --mid:#6B7280; --light:#F3F4F6; --border:#E5E7EB; --white:#fff;
}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Montserrat',sans-serif;background:var(--white);color:var(--dark);min-height:100vh;}
.container{max-width:680px;margin:0 auto;padding:0 20px;}

/* HEADER */
.header{display:flex;align-items:center;justify-content:space-between;padding:24px 0 26px;border-bottom:2px solid var(--gold);margin-bottom:36px;}
.logo-img{height:42px;width:auto;}
.header-right{display:flex;flex-direction:column;align-items:flex-end;gap:3px;}
.header-badge{font-size:11px;font-weight:600;color:var(--mid);background:var(--light);padding:4px 10px;border-radius:20px;}
.header-version{font-size:10px;color:var(--mid);letter-spacing:.06em;}

/* SCREENS */
.screen{animation:fadeUp .3s ease both;}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}

/* INTRO */
#intro{padding-bottom:60px;}
.intro-eyebrow{font-size:11px;font-weight:700;letter-spacing:.14em;color:var(--blue);text-transform:uppercase;margin-bottom:18px;}
.intro-title{font-size:clamp(24px,5vw,38px);font-weight:700;line-height:1.18;letter-spacing:-.02em;color:var(--black);margin-bottom:16px;}
.intro-title .gold{color:var(--gold);}
.intro-body{font-size:15px;line-height:1.75;color:var(--mid);margin-bottom:26px;max-width:520px;}
.tag-row{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:32px;}
.tag{font-size:11px;font-weight:600;padding:5px 12px;border-radius:20px;}
.t1{background:var(--blue-bg);color:var(--blue-mid);}
.t2{background:var(--gold-bg);color:var(--gold-dark);}
.t3{background:var(--green-bg);color:var(--green-dark);}
.t4{background:var(--purple-bg);color:var(--purple-dark);}
.t5{background:var(--orange-bg);color:#9A3412;}
.t6{background:var(--teal-bg);color:#047857;}
.t7{background:var(--slate-bg);color:var(--slate);}

/* CAPTCHA */
.captcha-box{background:var(--light);border:1.5px solid var(--border);border-radius:8px;padding:16px 18px;margin-bottom:18px;width:100%;}
.captcha-label{font-size:10px;font-weight:700;letter-spacing:.12em;color:var(--mid);text-transform:uppercase;margin-bottom:8px;}
.captcha-question{font-size:16px;font-weight:600;color:var(--dark);margin-bottom:10px;}
.captcha-row{display:flex;align-items:center;gap:10px;}
.captcha-input{font-family:'Montserrat',sans-serif;font-size:15px;font-weight:500;color:var(--dark);background:var(--white);border:1.5px solid var(--border);border-radius:6px;padding:10px 14px;width:100%;outline:none;transition:border-color .15s;-moz-appearance:textfield;}
.captcha-input::-webkit-inner-spin-button,.captcha-input::-webkit-outer-spin-button{-webkit-appearance:none;}
.captcha-input:focus{border-color:var(--blue);}
.captcha-input.correct{border-color:var(--green);}
.captcha-check{width:28px;height:28px;border-radius:50%;background:var(--green);color:var(--white);font-size:14px;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s;flex-shrink:0;}
.captcha-check.vis{opacity:1;}
.captcha-error{font-size:12px;color:var(--red);margin-top:8px;display:none;}
.captcha-error.vis{display:block;}

/* BUTTONS */
.btn-start{display:flex;align-items:center;justify-content:center;gap:10px;background:var(--blue);color:var(--white);font-family:'Montserrat',sans-serif;font-size:15px;font-weight:700;padding:16px 32px;border:none;border-radius:6px;cursor:pointer;transition:background .2s,transform .15s;width:100%;max-width:380px;}
.btn-start:hover{background:var(--blue-dark);transform:translateY(-1px);}
.intro-meta{margin-top:16px;display:flex;gap:18px;flex-wrap:wrap;}
.intro-meta span{font-size:12px;color:var(--mid);display:flex;align-items:center;gap:6px;}
.intro-meta span::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--gold);flex-shrink:0;}

/* QUIZ */
#quiz{display:none;flex-direction:column;padding-bottom:40px;}
.progress-wrap{margin-bottom:28px;}
.progress-meta{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}
.progress-label{font-size:12px;font-weight:600;color:var(--mid);letter-spacing:.06em;text-transform:uppercase;}
.progress-num{font-size:13px;font-weight:700;color:var(--blue);}
.progress-track{height:4px;background:var(--border);border-radius:2px;overflow:hidden;}
.progress-fill{height:100%;background:var(--blue);border-radius:2px;transition:width .4s cubic-bezier(.4,0,.2,1);}

/* BLOCK HEADER */
.block-header{margin-bottom:20px;}
.block-eyebrow{font-size:10px;font-weight:700;letter-spacing:.12em;color:var(--blue);text-transform:uppercase;margin-bottom:6px;}
.block-title{font-size:clamp(18px,3vw,24px);font-weight:700;line-height:1.3;letter-spacing:-.01em;color:var(--black);}
.block-desc{font-size:13px;color:var(--mid);line-height:1.6;margin-top:6px;}

/* LIKERT ITEM */
.likert-item{margin-bottom:24px;}
.likert-statement{font-size:15px;font-weight:500;line-height:1.55;color:var(--dark);margin-bottom:14px;}
.likert-scale{display:flex;flex-direction:column;gap:0;}
.likert-labels{display:flex;justify-content:space-between;margin-bottom:8px;}
.likert-label-text{font-size:11px;color:var(--mid);font-weight:500;}
.likert-options{display:flex;gap:8px;justify-content:space-between;}
.likert-btn{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;padding:10px 4px;background:var(--white);border:1.5px solid var(--border);border-radius:8px;cursor:pointer;transition:all .15s;}
.likert-btn:hover{border-color:var(--blue);background:var(--blue-bg);}
.likert-btn.selected{border-color:var(--blue);background:var(--blue-bg);}
.likert-num{font-size:16px;font-weight:700;color:var(--mid);transition:color .15s;}
.likert-btn.selected .likert-num{color:var(--blue);}
.likert-dot{width:10px;height:10px;border-radius:50%;border:2px solid var(--border);transition:all .15s;}
.likert-btn.selected .likert-dot{background:var(--blue);border-color:var(--blue);}
.likert-divider{height:1px;background:var(--border);margin:20px 0;}

/* SINGLE CHOICE (E-Team) */
.eteam-header{background:var(--dark);border-radius:8px;padding:16px 18px;margin-bottom:20px;}
.eteam-eyebrow{font-size:10px;font-weight:700;letter-spacing:.12em;color:var(--gold);text-transform:uppercase;margin-bottom:6px;}
.eteam-title{font-size:18px;font-weight:700;color:var(--white);margin-bottom:4px;}
.eteam-desc{font-size:13px;color:#9CA3AF;line-height:1.55;}
.option{display:flex;align-items:flex-start;gap:13px;padding:14px 16px;background:var(--white);border:1.5px solid var(--border);border-radius:8px;cursor:pointer;transition:border-color .15s,background .15s;text-align:left;width:100%;margin-bottom:9px;}
.option:hover{border-color:var(--blue);background:var(--blue-bg);}
.option.selected{border-color:var(--blue);background:var(--blue-bg);}
.option-dot{width:20px;height:20px;border-radius:50%;border:2px solid var(--border);flex-shrink:0;margin-top:2px;transition:all .15s;display:flex;align-items:center;justify-content:center;}
.option.selected .option-dot{border-color:var(--blue);background:var(--blue);}
.option.selected .option-dot::after{content:'';width:6px;height:6px;border-radius:50%;background:var(--white);}
.option-text{font-size:14px;font-weight:400;line-height:1.55;color:var(--dark);transition:color .15s;}
.option.selected .option-text{color:var(--blue-dark);font-weight:500;}

/* NAV */
.nav-row{display:flex;justify-content:space-between;align-items:center;margin-top:8px;}
.btn-back{font-family:'Montserrat',sans-serif;font-size:13px;font-weight:500;color:var(--mid);background:none;border:none;cursor:pointer;padding:8px 0;transition:color .15s;}
.btn-back:hover{color:var(--dark);}
.btn-next{font-family:'Montserrat',sans-serif;font-size:14px;font-weight:700;background:var(--blue);color:var(--white);border:none;border-radius:6px;padding:12px 26px;cursor:pointer;transition:all .15s;opacity:.3;pointer-events:none;}
.btn-next.active{opacity:1;pointer-events:all;}
.btn-next.active:hover{background:var(--blue-dark);}

/* RESULT */
#result{display:none;flex-direction:column;padding-bottom:60px;}

/* Hero result */
.result-hero{background:var(--dark);border-radius:10px;padding:24px;margin-bottom:24px;}
.result-hero-eyebrow{font-size:10px;font-weight:700;letter-spacing:.12em;color:var(--gold);text-transform:uppercase;margin-bottom:10px;}
.result-hero-title{font-size:clamp(18px,3.5vw,26px);font-weight:700;line-height:1.25;color:var(--white);margin-bottom:6px;}
.result-hero-sub{font-size:13px;color:#9CA3AF;line-height:1.6;}

/* E-Team badge */
.eteam-result-badge{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:10px;border:1.5px solid;margin-bottom:20px;}
.eteam-result-icon{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;}
.eteam-result-body{}
.eteam-result-label{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:4px;}
.eteam-result-name{font-size:18px;font-weight:700;margin-bottom:2px;}
.eteam-result-sub{font-size:12px;opacity:.8;}

/* 7F bars */
.bars-section{margin-bottom:24px;}
.bars-label{font-size:11px;font-weight:700;letter-spacing:.08em;color:var(--mid);text-transform:uppercase;margin-bottom:12px;}
.bars{display:flex;flex-direction:column;gap:10px;}
.bar-row{display:flex;align-items:center;gap:12px;}
.bar-label{font-size:12px;font-weight:600;width:80px;flex-shrink:0;color:var(--mid);}
.bar-winner .bar-label{color:var(--dark);display:flex;align-items:center;gap:5px;}
.winner-dot{width:6px;height:6px;border-radius:50%;background:var(--gold);flex-shrink:0;}
.bar-track{flex:1;height:7px;background:var(--light);border-radius:4px;overflow:hidden;}
.bar-fill{height:100%;border-radius:4px;width:0;transition:width 1.1s cubic-bezier(.4,0,.2,1);}
.bar-pct{font-size:12px;font-weight:600;width:34px;text-align:right;flex-shrink:0;color:var(--mid);}
.bar-winner .bar-pct{color:var(--dark);}

/* SDT pills */
.sdt-section{margin-bottom:24px;}
.sdt-label{font-size:11px;font-weight:700;letter-spacing:.08em;color:var(--mid);text-transform:uppercase;margin-bottom:10px;}
.sdt-pills{display:flex;gap:8px;flex-wrap:wrap;}
.sdt-pill{flex:1;min-width:110px;padding:12px 14px;border-radius:8px;border:1.5px solid var(--border);text-align:center;}
.sdt-pill.dominant{border-color:var(--blue);background:var(--blue-bg);}
.sdt-pill-name{font-size:13px;font-weight:600;color:var(--dark);margin-bottom:3px;}
.sdt-pill.dominant .sdt-pill-name{color:var(--blue-dark);}
.sdt-pill-bar{height:4px;background:var(--border);border-radius:2px;overflow:hidden;margin-bottom:4px;}
.sdt-pill-fill{height:100%;background:var(--blue);border-radius:2px;width:0;transition:width 1s ease .3s;}
.sdt-pill-pct{font-size:11px;color:var(--mid);}
.sdt-pill.dominant .sdt-pill-pct{color:var(--blue);}

/* Insight box */
.insight-box{background:var(--blue-bg);border:1.5px solid var(--blue);border-radius:10px;padding:22px 24px;margin-bottom:16px;}
.insight-label{font-size:10px;font-weight:700;letter-spacing:.12em;color:var(--blue);text-transform:uppercase;margin-bottom:10px;}
.insight-headline{font-size:16px;font-weight:700;color:var(--dark);margin-bottom:10px;line-height:1.4;}
.insight-text{font-size:13px;color:var(--dark);line-height:1.8;}

/* Next step box */
.nextstep-box{background:var(--gold-bg);border:1.5px solid var(--gold);border-radius:10px;padding:20px 24px;margin-bottom:24px;}
.nextstep-label{font-size:10px;font-weight:700;letter-spacing:.12em;color:var(--gold-dark);text-transform:uppercase;margin-bottom:8px;}
.nextstep-text{font-size:14px;font-weight:500;color:var(--dark);line-height:1.7;}

/* CTAs */
.cta-section{display:flex;flex-direction:column;gap:10px;margin-bottom:20px;}
.btn-primary{display:flex;align-items:center;justify-content:center;gap:10px;background:var(--blue);color:var(--white);font-family:'Montserrat',sans-serif;font-size:15px;font-weight:700;padding:16px 22px;border:none;border-radius:6px;cursor:pointer;transition:background .2s,transform .15s;}
.btn-primary:hover{background:var(--blue-dark);transform:translateY(-1px);}
.btn-secondary{display:flex;align-items:center;justify-content:center;background:var(--white);color:var(--blue);font-family:'Montserrat',sans-serif;font-size:13px;font-weight:600;padding:13px 22px;border:1.5px solid var(--blue);border-radius:6px;cursor:pointer;transition:all .2s;}
.btn-secondary:hover{background:var(--blue-bg);}
.cta-note{font-size:11px;color:var(--mid);text-align:center;line-height:1.7;margin-bottom:20px;}
.divider{height:1px;background:var(--border);margin:20px 0;}

/* Mobile */
@media(max-width:600px){
  .container{padding:0 14px;}
  .header{padding:18px 0 22px;margin-bottom:28px;}
  .logo-img{height:36px;}
  .intro-title{font-size:22px;}
  .likert-btn{padding:8px 2px;}
  .likert-num{font-size:14px;}
  .sdt-pills{gap:6px;}
  .sdt-pill{min-width:90px;padding:10px 8px;}
  .eteam-result-badge{flex-direction:column;align-items:flex-start;gap:10px;}
}
@media(max-width:380px){
  .intro-title{font-size:20px;}
  .block-title{font-size:17px;}
  .likert-statement{font-size:14px;}
  .option-text{font-size:13px;}
}

  /* EMAIL GATE */
  #email-gate { display:none; flex-direction:column; padding-bottom:60px; }
  .gate-hero { background:var(--dark); border-radius:10px; padding:24px; margin-bottom:24px; }
  .gate-eyebrow { font-size:10px; font-weight:700; letter-spacing:.12em; color:var(--gold); text-transform:uppercase; margin-bottom:10px; }
  .gate-title { font-size:clamp(18px,3.5vw,26px); font-weight:700; color:var(--white); margin-bottom:6px; line-height:1.3; }
  .gate-sub { font-size:13px; color:#9CA3AF; line-height:1.6; }
  .gate-preview { display:flex; flex-direction:column; gap:10px; margin-bottom:24px; }
  .gate-preview-item { display:flex; align-items:center; gap:12px; padding:12px 16px; background:var(--light); border-radius:8px; border:1.5px solid var(--border); }
  .gate-preview-icon { font-size:20px; flex-shrink:0; }
  .gate-preview-text { font-size:13px; font-weight:500; color:var(--dark); }
  .gate-form { margin-bottom:16px; }
  .gate-input-wrap { position:relative; margin-bottom:12px; }
  .gate-input { font-family:'Montserrat',sans-serif; font-size:15px; color:var(--dark); background:var(--white); border:1.5px solid var(--border); border-radius:8px; padding:14px 16px; width:100%; outline:none; transition:border-color .15s; }
  .gate-input:focus { border-color:var(--blue); }
  .gate-input.error { border-color:var(--red); }
  .gate-error { font-size:12px; color:var(--red); margin-top:4px; display:none; }
  .gate-error.vis { display:block; }
  .gate-submit { display:flex; align-items:center; justify-content:center; gap:10px; background:var(--blue); color:var(--white); font-family:'Montserrat',sans-serif; font-size:15px; font-weight:700; padding:15px 22px; border:none; border-radius:6px; cursor:pointer; transition:background .2s; width:100%; }
  .gate-submit:hover { background:var(--blue-dark); }
  .gate-submit:disabled { opacity:.5; pointer-events:none; }
  .gate-skip { display:block; text-align:center; font-size:12px; color:var(--mid); margin-top:12px; cursor:pointer; text-decoration:underline; }
  .gate-skip:hover { color:var(--dark); }
  .gate-privacy { font-size:11px; color:var(--mid); text-align:center; line-height:1.6; margin-top:10px; }

  /* UNIQUE ID BOX */
  .uid-box { background:var(--light); border:1.5px solid var(--border); border-radius:8px; padding:14px 18px; margin-bottom:20px; display:flex; align-items:center; justify-content:space-between; gap:12px; }
  .uid-label { font-size:10px; font-weight:700; letter-spacing:.1em; color:var(--mid); text-transform:uppercase; margin-bottom:3px; }
  .uid-value { font-size:15px; font-weight:700; color:var(--dark); letter-spacing:.06em; font-family:monospace; }
  .uid-copy { font-family:'Montserrat',sans-serif; font-size:11px; font-weight:600; color:var(--blue); background:var(--blue-bg); border:none; border-radius:4px; padding:5px 10px; cursor:pointer; flex-shrink:0; }
  .uid-copy:hover { background:var(--blue); color:var(--white); }

  /* SENDING STATE */
  .sending-overlay { display:none; position:fixed; inset:0; background:rgba(255,255,255,.9); z-index:100; align-items:center; justify-content:center; flex-direction:column; gap:16px; }
  .sending-overlay.vis { display:flex; }
  .sending-spinner { width:36px; height:36px; border:3px solid var(--border); border-top-color:var(--blue); border-radius:50%; animation:spin .8s linear infinite; }
  @keyframes spin { to { transform:rotate(360deg); } }
  .sending-text { font-size:14px; font-weight:500; color:var(--dark); }

  /* SUCCESS STATE */
  .success-box { background:var(--green-bg); border:1.5px solid var(--green); border-radius:10px; padding:20px 24px; margin-bottom:20px; display:none; }
  .success-box.vis { display:block; }
  .success-title { font-size:15px; font-weight:700; color:var(--green-dark); margin-bottom:6px; }
  .success-text { font-size:13px; color:var(--green-dark); line-height:1.65; }

  @media print {
    .header, .cta-section, .cta-note, .divider, button, .uid-copy { display:none !important; }
    body { background:white; }
    .result-hero { background:#1F2937 !important; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  }

  /* ── ERGEBNISSEITE DETAIL-SEKTIONEN ─────────────── */
  .detail-section { margin-bottom: 4px; }
  .detail-eyebrow { font-size:10px; font-weight:700; letter-spacing:.12em; color:var(--mid); text-transform:uppercase; margin-bottom:6px; }
  .detail-title { font-size:20px; font-weight:700; color:var(--dark); margin-bottom:14px; letter-spacing:-.01em; }
  .detail-text p { font-size:14px; line-height:1.8; color:var(--dark); margin-bottom:12px; }
  .detail-text p:last-child { margin-bottom:0; }
  #tie-choices .option { border:1.5px solid var(--border); border-radius:8px; padding:14px 16px; cursor:pointer; transition:all .15s; background:var(--white); display:flex; align-items:center; gap:12px; margin-bottom:8px; width:100%; }
  #tie-choices .option:hover { border-color:var(--gold); background:var(--gold-bg); }
  #tie-choices .option.selected { border-color:var(--gold); background:var(--gold-bg); }
  #tie-choices .option.selected .option-dot { border-color:var(--gold-dark); background:var(--gold); }
  .terra-hint { background:var(--purple-bg,#F5F0FF); border-left:3px solid var(--purple,#C59ECA); border-radius:6px; padding:14px 16px; margin:14px 0; }
  .terra-task { background:var(--green-bg,#E8F5E9); border-left:3px solid var(--green,#53B263); border-radius:6px; padding:14px 16px; margin:14px 0; }
  .terra-label { font-size:10px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; margin-bottom:6px; }
  .terra-hint .terra-label { color:var(--purple-dark,#7B4F8C); }
  .terra-task .terra-label { color:var(--green-dark,#2E7D32); }
  .terra-body { font-size:13px; line-height:1.7; color:var(--dark); }
  @media(max-width:600px){ .detail-title{font-size:17px;} .detail-text p{font-size:13px;} }
`;
  const LOGO = "data:image/png;base64,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";

  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>Dein TERRA-Profil · ${uid}</title>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>${CSS}
body { padding:24px 16px; }
.stored-wrap { max-width:600px; margin:0 auto; }
.stored-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; }
.stored-logo { height:38px; width:auto; }
.stored-meta { font-size:11px; color:var(--mid); text-align:right; }
.stored-footer { margin-top:32px; padding-top:20px; border-top:1px solid var(--border); text-align:center; font-size:12px; color:var(--mid); }
.stored-footer a { color:var(--blue); text-decoration:none; font-weight:600; }
</style>
</head>
<body>
<div class="stored-wrap">
  <div class="stored-header">
    <img src="${LOGO}" alt="Kim Koerber" class="stored-logo">
    <div class="stored-meta">TERRA CHECK 3.5<br>${timestamp}</div>
  </div>
  <div class="result-hero">
    <div class="result-hero-eyebrow">Dein TERRA-Profil</div>
    <h2 class="result-hero-title">Dein gespeichertes Ergebnis</h2>
    <p class="result-hero-sub">Unique ID: ${uid}</p>
  </div>
  <div class="uid-box">
    <div>
      <div class="uid-label">Deine Unique ID</div>
      <div class="uid-value">${uid}</div>
    </div>
  </div>
  ${body}
  <div class="cta-section">
    <a class="btn-primary" href="https://tidycal.com/tckimkoerber/terra-clarity-call" target="_blank" style="display:block;text-align:center;text-decoration:none;">TERRA Clarity Call buchen · 45 Min · 150 € →</a>
    <a class="btn-secondary" href="https://kimkoerber.com/terra/bites" target="_blank" style="display:block;text-align:center;text-decoration:none;">TERRA Bites abonnieren →</a>
  </div>
  <div class="stored-footer">
    Dieses Ergebnis wurde am ${timestamp} erstellt.<br>
    <a href="https://check.kimkoerber.com">Neuen TERRA Check starten</a>
  </div>
</div>
</body>
</html>`;
}
