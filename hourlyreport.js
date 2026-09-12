(async () => {
  const SCRAP_ID = 'cm-hourly-scrapper-v13';
  if (document.getElementById(SCRAP_ID)) { document.getElementById(SCRAP_ID).remove(); return; }

  // === AUTO DOMAIN & DOM SCRAPER (ZERO-CLICK UNIVERSAL) ===
  const currentDomain = window.location.hostname.replace('www.', '');
  const rawHTML = document.documentElement.outerHTML;
  
  const idusMatch = rawHTML.match(/var\s+idus\s*=\s*"?(\d+)"?;/);
  const usernameMatch = rawHTML.match(/Username\s*:\s*([a-zA-Z0-9_@.-]+)/);
  
  if (idusMatch) {
      localStorage.setItem('cm-scrap-idus_' + currentDomain, idusMatch[1]);
      localStorage.setItem('cm-scrap-idusBr_' + currentDomain, idusMatch[1]); 
  }
  if (usernameMatch) {
      localStorage.setItem('cm-scrap-usnm_' + currentDomain, usernameMatch[1]);
      localStorage.setItem('cm-scrap-usernameBr_' + currentDomain, usernameMatch[1]); 
  }

  // ── PREMIUM STYLE ───────────────────────────────────────────────────────────
  const st = document.createElement('style');
  st.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800;900&display=swap');
    #${SCRAP_ID} * { box-sizing:border-box; font-family:'Inter',sans-serif!important; }
    
    #${SCRAP_ID} {
      position: fixed; inset: 0; z-index: 2147483647;
      display: flex; align-items: center; justify-content: center;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(8px) saturate(180%);
      -webkit-backdrop-filter: blur(8px) saturate(180%);
      animation: fadeIn 0.4s ease;
    }
    #${SCRAP_ID}.light { background: rgba(230, 230, 235, 0.5); }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .scrap-modal {
      width: 640px; max-width: 95vw; max-height: 88vh; 
      background: rgba(255, 255, 255, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.9);
      border-radius: 28px;
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.2), 0 0 80px rgba(59, 130, 246, 0.1);
      display: flex; flex-direction: column;
      overflow: hidden; position: relative; color: #1c1e21;
      animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    #${SCRAP_ID}.dark .scrap-modal {
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.1); color: #e2e8f0;
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6), 0 0 80px rgba(16, 185, 129, 0.15);
    }
    @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }

    .scrap-header { padding: 18px 28px; display: flex; align-items: center; justify-content: space-between; gap: 12px; border-bottom: 1px solid rgba(0, 0, 0, 0.05); }
    #${SCRAP_ID}.dark .scrap-header { border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
    .scrap-logo { font-size: 18px; font-weight: 700; letter-spacing: -0.5px; display: flex; align-items: center; gap: 12px; }
    .scrap-logo span.icon { color: #fbbf24; text-shadow: 0 0 12px rgba(251,191,36,0.8); }
    
    /* SHIMMER / GLINT EFFECT UNTUK TEKS HOURLY REPORT */
    .shimmer-text {
      font-weight: 800;
      background: linear-gradient(110deg, #1c1e21 30%, #ffffff 50%, #1c1e21 70%);
      background-size: 200% 100%;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shimmerGlint 4s linear infinite;
    }
    #${SCRAP_ID}.dark .shimmer-text {
      background: linear-gradient(110deg, #e2e8f0 30%, #ffffff 50%, #e2e8f0 70%);
      background-size: 200% 100%;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    @keyframes shimmerGlint {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* DOMAIN BADGE STYLE */
    .domain-badge { 
      font-size: 11px; font-weight: 600; color: #3b82f6; 
      background: rgba(59, 130, 246, 0.1); padding: 4px 10px; border-radius: 20px; 
      border: 1px solid rgba(59, 130, 246, 0.2); 
    }
    #${SCRAP_ID}.dark .domain-badge { color: #60a5fa; background: rgba(59, 130, 246, 0.15); border-color: rgba(59, 130, 246, 0.3); }

    .scrap-tabs { display: flex; gap: 4px; background: rgba(0,0,0,0.04); padding: 4px; border-radius: 12px; border: 1px solid rgba(0,0,0,0.05); }
    #${SCRAP_ID}.dark .scrap-tabs { background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); }
    .scrap-tab-btn { padding: 8px 18px; border-radius: 8px; border: none; background: transparent; font-size: 12px; font-weight: 600; cursor: pointer; color: #65676b; transition: all 0.3s ease; }
    #${SCRAP_ID}.dark .scrap-tab-btn { color: #94a3b8; }
    .scrap-tab-btn:hover { color: #2563eb; }
    #${SCRAP_ID}.dark .scrap-tab-btn:hover { color: #fff; }
    .scrap-tab-btn.active { background: rgba(255,255,255,0.8); color: #1c1e21; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    #${SCRAP_ID}.dark .scrap-tab-btn.active { background: rgba(255,255,255,0.1); color: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }

    .scrap-btn-icon { width: 36px; height: 36px; border-radius: 10px; border: 1px solid rgba(0,0,0,0.05); background: transparent; cursor: pointer; font-weight: 700; display: flex; align-items: center; justify-content: center; transition: 0.2s; color: #1c1e21; }
    #${SCRAP_ID}.dark .scrap-btn-icon { color: #e2e8f0; border: 1px solid rgba(255,255,255,0.05); }
    .scrap-btn-icon:hover { background: rgba(0,0,0,0.03); }
    #${SCRAP_ID}.dark .scrap-btn-icon:hover { background: rgba(255,255,255,0.05); }
    .scrap-exit:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; border-color: rgba(239, 68, 68, 0.2); }

    .scrap-body { padding: 28px; overflow-y: auto; flex: 1; }
    .scrap-body::-webkit-scrollbar { width: 6px; }
    .scrap-body::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
    #${SCRAP_ID}.dark .scrap-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }

    /* PREMIUM CLOCK CARD */
    .clock-card { 
      text-align: center; margin-bottom: 28px; padding: 24px; 
      background: rgba(255,255,255,0.4); border: 1px solid rgba(255,255,255,0.6); border-radius: 20px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.03), inset 0 1px 1px rgba(255,255,255,0.8);
    }
    #${SCRAP_ID}.dark .clock-card { 
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); 
      box-shadow: 0 8px 24px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.05); 
    }
    .live-date { font-size: 13px; font-weight: 500; color: #65676b; margin-bottom: 8px; letter-spacing: 0.5px; text-transform: uppercase; }
    #${SCRAP_ID}.dark .live-date { color: #94a3b8; }
    .live-clock { 
      font-family: 'Space Grotesk', sans-serif!important; 
      font-size: 64px; font-weight: 600; line-height: 1; letter-spacing: 4px; 
      color: #1c1e21; font-variant-numeric: tabular-nums; 
    }
    #${SCRAP_ID}.dark .live-clock { color: #fff; }
    .auto-status { margin-top: 12px; display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600; color: #16a34a; background: rgba(22, 163, 74, 0.1); padding: 4px 10px; border-radius: 20px; }
    #${SCRAP_ID}.dark .auto-status { color: #22c55e; background: rgba(34, 197, 94, 0.1); }
    .auto-status .dot { width: 6px; height: 6px; background: #16a34a; border-radius: 50%; animation: blink 2s infinite; }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
    .next-run { font-size: 11px; font-weight: 500; color: #65676b; margin-top: 8px; letter-spacing: 0.5px; font-variant-numeric: tabular-nums; }
    #${SCRAP_ID}.dark .next-run { color: #94a3b8; }

    /* PREMIUM BUTTON */
    .btn-control { 
      width: 100%; height: 52px; border: none; border-radius: 16px; font-size: 15px; font-weight: 600; cursor: pointer; color: #fff; transition: all 0.3s ease; 
      background: linear-gradient(135deg, rgba(59, 130, 246, 1), rgba(29, 78, 216, 1)); 
      box-shadow: 0 8px 20px rgba(59, 130, 246, 0.25); 
      display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 28px;
    }
    .btn-control:disabled { opacity: 0.6; cursor: not-allowed; transform: none !important; }
    .btn-control:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(59, 130, 246, 0.35); }
    .btn-control:active { transform: translateY(0); }

    /* SNAPSHOT GRID */
    .snapshot-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 28px; }
    .snap-card { 
      background: rgba(255,255,255,0.5); border: 1px solid rgba(0,0,0,0.03); border-radius: 16px; padding: 16px; text-align: center; 
      transition: 0.3s; box-shadow: 0 4px 12px rgba(0,0,0,0.02);
    }
    #${SCRAP_ID}.dark .snap-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .snap-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.05); }
    #${SCRAP_ID}.dark .snap-card:hover { box-shadow: 0 8px 20px rgba(0,0,0,0.2); }
    .snap-card.full { grid-column: 1 / -1; display: flex; align-items: center; justify-content: space-between; padding: 20px; }
    .snap-lbl { font-size: 11px; font-weight: 600; color: #65676b; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
    #${SCRAP_ID}.dark .snap-lbl { color: #94a3b8; }
    .snap-val { font-family: 'Space Grotesk', sans-serif!important; font-size: 28px; font-weight: 700; font-variant-numeric: tabular-nums; }
    .snap-val.full-val { font-size: 22px; }

    .console-box { background: rgba(0,0,0,0.9); border: 1px solid rgba(0,0,0,0.8); border-radius: 16px; padding: 16px; height: 140px; overflow-y: auto; font-family: 'Space Grotesk', monospace; }
    #${SCRAP_ID}.dark .console-box { background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.05); }
    .console-line { font-size: 12px; margin-bottom: 6px; color: #22c55e; }
    .console-line.wait { color: #64748b; }
    .console-line.err { color: #ef4444; }
    .console-line.info { color: #3b82f6; }

    /* PREMIUM TABLE */
    .history-table { width: 100%; border-collapse: separate; border-spacing: 0 8px; font-family: 'Space Grotesk', sans-serif; }
    
    /* FIX STICKY HEADER SAAT DI SCROLL */
    .history-table th { 
      text-align: center; padding: 12px 8px; font-size: 11px; font-weight: 600; color: #65676b; 
      text-transform: uppercase; letter-spacing: 1px; 
      position: sticky; top: 0; z-index: 10;
      background: rgba(248, 250, 252, 0.95);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }
    #${SCRAP_ID}.dark .history-table th { 
      color: #e2e8f0; 
      background: rgba(15, 23, 42, 0.95);
    }
    
    .history-table td { text-align: center; padding: 14px; font-size: 13px; font-weight: 500; border: none; }
    .history-table tr.row-filled td { background: rgba(255,255,255,0.6); }
    #${SCRAP_ID}.dark .history-table tr.row-filled td { background: rgba(255,255,255,0.05); }
    .history-table tr.row-filled td:first-child { border-radius: 12px 0 0 12px; }
    .history-table tr.row-filled td:last-child { border-radius: 0 12px 12px 0; }
    .history-table tr.row-empty { opacity: 0.3; }
    .history-table .jam-col { font-weight: 700; }
  `;
  document.head.appendChild(st);

  let isDark = localStorage.getItem('cm-theme') === 'dark';
  if (!isDark) isDark = localStorage.getItem('cm-scrap-theme') === 'dark';

  const ui = document.createElement('div');
  ui.id = SCRAP_ID;
  if (isDark) ui.classList.add('dark'); else ui.classList.add('light');
  const themeIcon = isDark ? '☀️' : '🌙';

  ui.innerHTML = `
    <div class="scrap-modal">
      <div class="scrap-header">
        <div class="scrap-logo">
          <span class="icon">⚡</span> 
          <span class="shimmer-text">HOURLY REPORT</span> 
          <div class="domain-badge">${currentDomain}</div>
        </div>
        <div class="scrap-tabs">
          <button class="scrap-tab-btn active" onclick="switchTab('home')">HOME</button>
          <button class="scrap-tab-btn" onclick="switchTab('history')">HISTORY</button>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="scrap-btn-icon" onclick="toggleTheme()">${themeIcon}</button>
          <button class="scrap-btn-icon scrap-exit" onclick="document.getElementById('${SCRAP_ID}').remove()">✖</button>
        </div>
      </div>
      
      <div class="scrap-body">
        <!-- HOME TAB -->
        <div id="tab-home" style="display:flex; flex-direction:column;">
          <div class="clock-card">
            <div class="live-date" id="live-date">--</div>
            <div class="live-clock" id="live-clock">00:00:00</div>
            <div class="next-run" id="next-run">Next auto-scrape at 01:00:00</div>
            <div class="auto-status"><div class="dot"></div> AUTO-SCRAPE ACTIVE</div>
          </div>
          
          <button class="btn-control" id="btn-push" onclick="pushNow()">PUSH NOW</button>
          
          <div class="snapshot-grid">
            <div class="snap-card"><div class="snap-lbl">RG (Register)</div><div class="snap-val" id="snap-rg">0</div></div>
            <div class="snap-card"><div class="snap-lbl">ND (New Depo)</div><div class="snap-val" id="snap-nd">0</div></div>
            <div class="snap-card"><div class="snap-lbl">TRX (Tickets)</div><div class="snap-val" id="snap-trx">0</div></div>
            <div class="snap-card full"><div class="snap-lbl">TO (Turnover)</div><div class="snap-val full-val" id="snap-to">Rp 0</div></div>
            <div class="snap-card full"><div class="snap-lbl">WL (Winlose)</div><div class="snap-val full-val" id="snap-wl">Rp 0</div></div>
          </div>
          
          <div class="console-box" id="console-box">
            <div class="console-line wait">[System] Initializing...</div>
          </div>
        </div>

        <!-- HISTORY TAB -->
        <div id="tab-history" style="display:none;">
          <table class="history-table">
            <thead>
              <tr>
                <th>JAM</th><th>RG</th><th>ND</th><th>TRX</th><th>TO</th><th>WL</th>
              </tr>
            </thead>
            <tbody id="history-body"></tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(ui);

  let _lastHour = new Date().getHours();

  window.toggleTheme = () => { 
    const el = document.getElementById(SCRAP_ID); 
    el.classList.toggle('dark'); el.classList.toggle('light');
    const btn = el.querySelector('.scrap-btn-icon[onclick="toggleTheme()"]'); 
    if (el.classList.contains('dark')) { localStorage.setItem('cm-scrap-theme', 'dark'); btn.innerText = '☀️'; } 
    else { localStorage.setItem('cm-scrap-theme', 'light'); btn.innerText = '🌙'; } 
  };

  window.switchTab = (tab) => {
    document.querySelectorAll('.scrap-tab-btn').forEach(e => e.classList.remove('active'));
    document.querySelector(`.scrap-tab-btn[onclick="switchTab('${tab}')"]`).classList.add('active');
    document.getElementById('tab-home').style.display = tab === 'home' ? 'flex' : 'none';
    document.getElementById('tab-history').style.display = tab === 'history' ? 'block' : 'none';
    if (tab === 'history') renderHistoryTable();
  };

  function logMsg(msg, type = 'success') {
    const box = document.getElementById('console-box');
    const time = new Date().toLocaleTimeString('id-ID', { hour12: false });
    const div = document.createElement('div');
    div.className = `console-line ${type}`;
    div.innerText = `[${time}] ${msg}`;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }

  function formatRupiah(angka) {
    if (angka === 0 || isNaN(angka)) return 'Rp 0';
    const neg = angka < 0;
    const abs = Math.abs(Math.round(angka));
    return (neg ? '-Rp ' : 'Rp ') + abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  // --- HISTORY DATA MANAGEMENT (PER DOMAIN) ---
  function getTodayKey() {
    const today = new Date();
    return `cm-scrap-hist-${currentDomain}-${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}`;
  }

  function getTodayHistory() {
    const key = getTodayKey();
    let data = JSON.parse(localStorage.getItem(key) || '{}');
    return data;
  }

  function saveHistoryData(hourStr, data, isPush = false) {
    const key = getTodayKey();
    let hist = getTodayHistory();
    hist[hourStr] = { ...data, is_push: isPush };
    localStorage.setItem(key, JSON.stringify(hist));
    renderHistoryTable();
  }

  function renderHistoryTable() {
    const tbody = document.getElementById('history-body');
    const hist = getTodayHistory();
    let html = '';
    for(let i=1; i<=24; i++) {
      const hh = String(i).padStart(2, '0') + ':00';
      const d = hist[hh];
      
      const cls = d ? 'row-filled' : 'row-empty';
      let wlText = '-', wlStyle = '';
      if (d) {
        wlText = formatRupiah(d.wl);
        if (d.wl > 0) wlStyle = 'color:#16a34a; font-weight:600;';
        else if (d.wl < 0) wlStyle = 'color:#ef4444; font-weight:600;';
      }

      html += `<tr class="${cls}">
        <td class="jam-col">${hh}</td>
        <td>${d ? d.rg : '-'}</td>
        <td>${d ? d.nd : '-'}</td>
        <td>${d ? d.trx : '-'}</td>
        <td>${d ? formatRupiah(d.to) : '-'}</td>
        <td style="${wlStyle}">${wlText}</td>
      </tr>`;
    }
    tbody.innerHTML = html;
  }
  renderHistoryTable();

  function getDisplayHour(dateObj) {
    let h = dateObj.getHours();
    return h === 0 ? 24 : h;
  }

  // --- LIVE CLOCK & AUTO RUN (ALWAYS ACTIVE) ---
  setInterval(() => {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const dateOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    document.getElementById('live-date').innerText = now.toLocaleDateString('id-ID', dateOptions);
    document.getElementById('live-clock').innerText = `${h}:${m}:${s}`;
    
    let nextH = getDisplayHour(now) + 1;
    if (nextH > 24) nextH = 1;
    document.getElementById('next-run').innerText = `Next auto-scrape at ${String(nextH).padStart(2, '0')}:00:00`;

    if (now.getHours() !== _lastHour) {
      _lastHour = now.getHours();
      executeScrape(false);
    }
  }, 1000);

  async function fetchAPI(url, payload) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  async function getData() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const ddmm = `${dd}-${mm}-${yyyy}`;
    
    const idus = localStorage.getItem('cm-scrap-idus_' + currentDomain);
    const usnm = localStorage.getItem('cm-scrap-usnm_' + currentDomain);
    const idusBr = localStorage.getItem('cm-scrap-idusBr_' + currentDomain);
    const usernameBr = localStorage.getItem('cm-scrap-usernameBr_' + currentDomain);
    
    if (!idus || !idusBr) {
      logMsg('ID belum terdeteksi. Coba refresh halaman panel!', 'err');
      return null;
    }

    const payloadRG = { filter: { fs: [ddmm, ddmm] }, idus: parseInt(idus), limit: 500, page: 1, sort: { usnm: ["asc"] } };
    const resRG = await fetchAPI('/memberlist', payloadRG);
    const rg = resRG.usls ? resRG.usls.length : 0;

    const payloadND = { filter: { fs: [ddmm, ddmm], nonnewmb: [true] }, idus: parseInt(idus), limit: 500, page: 1, sort: { usnm: ["asc"] } };
    const resND = await fetchAPI('/memberlist', payloadND);
    const nd = resND.usls ? resND.usls.length : 0;

    let trx = 0;
    let page = 1;
    
    while(true) {
      const payloadTrx = { "idusBr": parseInt(idusBr), "startdate": `${ddmm} 00:00:00`, "enddate": `${ddmm} 23:59:59`, "level": 5, "usernameBr": usernameBr, "page": page, "limit": 500, "type": "1001", "bo": true, "st": "10" };
      const resTrx = await fetchAPI('/trx/historypl', payloadTrx);
      let batch = resTrx.trx || [];
      trx += batch.length;
      if (batch.length < 500) break;
      page++;
    }

    const payloadWL = { "start": ddmm, "end": ddmm, "idus": parseInt(idus), "usnm": usnm, "level": 5, "levelbr": 6, "idpv": null, "pvnm": null, "by": 1, "pg": 1, "sort": ["asc"], "limit": "100" };
    const resWL = await fetchAPI('/t1/report', payloadWL);
    let to = 0, wl = 0;
    if (resWL.data && resWL.data.length > 0) {
      resWL.data.forEach(item => {
        to += parseFloat(item.stake || 0) * 1000;
        wl += (parseFloat(item.agWinlost || 0) - parseFloat(item.agCommGive || 0) + parseFloat(item.agBonus || 0)) * 1000;
      });
    }

    return { rg, nd, trx, to, wl };
  }

  async function fetchSnapshot() {
    try {
      const data = await getData();
      if (!data) return null;
      document.getElementById('snap-rg').innerText = data.rg;
      document.getElementById('snap-nd').innerText = data.nd;
      document.getElementById('snap-trx').innerText = data.trx;
      document.getElementById('snap-to').innerText = formatRupiah(data.to);
      document.getElementById('snap-wl').innerText = formatRupiah(data.wl);
      return data;
    } catch (e) {
      logMsg('Gagal memuat snapshot: ' + e.message, 'err');
      return null;
    }
  }

  async function executeScrape(isPush) {
    const now = new Date();
    let targetHour = getDisplayHour(now); 
    
    if (isPush) {
      targetHour = targetHour + 1;
      if (targetHour > 24) targetHour = 1;
      logMsg(`PUSH NOW: Menarik data untuk jam ${String(targetHour).padStart(2, '0')}:00...`, 'info');
    } else {
      logMsg(`AUTO SCRAPE: Menarik data final untuk jam ${String(targetHour).padStart(2, '0')}:00...`, 'info');
    }
    
    const hh = String(targetHour).padStart(2, '0') + ':00';

    const data = await fetchSnapshot();
    if (!data) {
      logMsg('Gagal scrape: Data kosong atau ID belum terdeteksi.', 'err');
      return;
    }

    saveHistoryData(hh, data, isPush);
    logMsg(`✅ Data jam ${hh} tersimpan di History.`, 'success');
  }

  window.pushNow = async () => {
    const btn = document.getElementById('btn-push');
    btn.innerText = 'LOADING...'; btn.disabled = true;
    await executeScrape(true);
    btn.innerText = 'PUSH NOW'; btn.disabled = false;
  };

  logMsg('Auto-Scrapper Active. Memuat data awal...', 'info');
  fetchSnapshot();
})();
