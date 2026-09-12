(async () => {
  const SCRAP_ID = 'cm-hourly-scrapper-v4';
  if (document.getElementById(SCRAP_ID)) { document.getElementById(SCRAP_ID).remove(); return; }

  const st = document.createElement('style');
  st.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
    #${SCRAP_ID} * { box-sizing:border-box; font-family:'Inter',sans-serif!important; }
    
    #${SCRAP_ID} {
      position: fixed; inset: 0; z-index: 2147483647;
      display: flex; align-items: center; justify-content: center;
      background: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(4px) saturate(180%);
      -webkit-backdrop-filter: blur(4px) saturate(180%);
      animation: fadeIn 0.3s ease;
    }
    #${SCRAP_ID}.light {
      background: rgba(255, 255, 255, 0.2);
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .scrap-modal {
      width: 500px; max-width: 95vw; max-height: 85vh; 
      background: rgba(255, 255, 255, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.9);
      border-radius: 24px;
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2), 0 0 40px rgba(59, 130, 246, 0.15);
      display: flex; flex-direction: column;
      overflow: hidden;
      position: relative;
      color: #1c1e21;
      animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    #${SCRAP_ID}.dark .scrap-modal {
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #e2e8f0;
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5), 0 0 40px rgba(16, 185, 129, 0.2);
    }
    @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

    .scrap-header {
      padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; gap: 12px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    #${SCRAP_ID}.dark .scrap-header { border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
    
    .scrap-logo { font-size: 16px; font-weight: 900; display: flex; align-items: center; gap: 8px; }
    .scrap-logo span { color: #fbbf24; text-shadow: 0 0 10px rgba(251,191,36,0.8); }
    
    .scrap-tabs { display: flex; gap: 4px; background: rgba(0,0,0,0.05); padding: 4px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.1); }
    #${SCRAP_ID}.dark .scrap-tabs { background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); }
    .scrap-tab-btn { padding: 6px 16px; border-radius: 6px; border: none; background: transparent; font-size: 11px; font-weight: 800; cursor: pointer; color: #65676b; transition: all 0.3s ease; }
    #${SCRAP_ID}.dark .scrap-tab-btn { color: #94a3b8; }
    .scrap-tab-btn:hover { background: rgba(59, 130, 246, 0.1); color: #2563eb; transform: translateY(-1px); }
    #${SCRAP_ID}.dark .scrap-tab-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
    .scrap-tab-btn.active { background: rgba(59, 130, 246, 0.2); color: #2563eb; box-shadow: inset 0 1px 1px rgba(255,255,255,0.4); }
    #${SCRAP_ID}.dark .scrap-tab-btn.active { background: rgba(255,255,255,0.1); color: #fff; box-shadow: none; }

    .scrap-btn-icon { width: 32px; height: 32px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.1); background: transparent; cursor: pointer; font-weight: 900; display: flex; align-items: center; justify-content: center; transition: 0.2s; color: #1c1e21; }
    #${SCRAP_ID}.dark .scrap-btn-icon { color: #e2e8f0; border: 1px solid rgba(255,255,255,0.1); }
    .scrap-btn-icon:hover { background: rgba(0,0,0,0.05); transform: scale(1.05); }
    #${SCRAP_ID}.dark .scrap-btn-icon:hover { background: rgba(255,255,255,0.1); }
    .scrap-exit:hover { background: rgba(239, 68, 68, 0.2); color: #ef4444; border-color: #ef4444; }

    .scrap-body { padding: 24px; overflow-y: auto; flex: 1; }
    .scrap-body::-webkit-scrollbar { width: 6px; }
    .scrap-body::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 3px; }
    #${SCRAP_ID}.dark .scrap-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); }

    /* HOME TAB */
    .clock-container { text-align: center; margin-bottom: 24px; }
    .live-date { font-size: 12px; font-weight: 700; color: #65676b; margin-bottom: 4px; letter-spacing: 0.5px; }
    #${SCRAP_ID}.dark .live-date { color: #94a3b8; }
    .live-clock { font-size: 48px; font-weight: 900; line-height: 1; letter-spacing: -2px; background: linear-gradient(135deg, #1c1e21, #65676b); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
    #${SCRAP_ID}.dark .live-clock { background: linear-gradient(135deg, #fff, #94a3b8); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
    .next-run { font-size: 12px; font-weight: 700; color: #65676b; margin-top: 8px; letter-spacing: 1px; }
    #${SCRAP_ID}.dark .next-run { color: #94a3b8; }

    .btn-group { display: flex; gap: 12px; margin-bottom: 24px; }
    .btn-control { flex: 1; height: 48px; border: none; border-radius: 12px; font-size: 14px; font-weight: 900; cursor: pointer; color: #fff; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .btn-control:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-control:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.2); }
    .btn-control.start { background: linear-gradient(135deg, rgba(22, 163, 74, 0.8), rgba(16, 185, 129, 1)); }
    .btn-control.stop { background: linear-gradient(135deg, rgba(239, 68, 68, 0.8), rgba(220, 38, 38, 1)); animation: pulse 1.5s infinite; }
    .btn-control.push { background: linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(29, 78, 216, 1)); }
    @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.7; } 100% { opacity: 1; } }

    .snapshot-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
    .snap-card { background: rgba(0, 0, 0, 0.03); border: 1px solid rgba(0,0,0,0.05); border-radius: 12px; padding: 12px; text-align: center; transition: 0.3s; }
    #${SCRAP_ID}.dark .snap-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); }
    .snap-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .snap-card.full { grid-column: 1 / -1; display: flex; align-items: center; justify-content: space-between; padding: 16px; }
    .snap-lbl { font-size: 10px; font-weight: 800; color: #65676b; margin-bottom: 4px; text-transform: uppercase; }
    #${SCRAP_ID}.dark .snap-lbl { color: #94a3b8; }
    .snap-val { font-size: 24px; font-weight: 900; }
    .snap-val.full-val { font-size: 20px; }

    .console-box { background: rgba(0,0,0,0.8); border: 1px solid rgba(0,0,0,0.8); border-radius: 12px; padding: 12px; height: 150px; overflow-y: auto; font-family: 'Courier New', monospace; }
    #${SCRAP_ID}.dark .console-box { background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); }
    .console-line { font-size: 11px; margin-bottom: 4px; color: #22c55e; }
    .console-line.wait { color: #94a3b8; }
    .console-line.err { color: #ef4444; }
    .console-line.info { color: #3b82f6; }

    /* CONFIG TAB */
    .config-inp-grp { margin-bottom: 16px; }
    .config-lbl { font-size: 11px; font-weight: 800; color: #65676b; margin-bottom: 6px; display: block; }
    #${SCRAP_ID}.dark .config-lbl { color: #94a3b8; }
    .config-inp { width: 100%; height: 40px; padding: 0 12px; border: 1px solid rgba(0,0,0,0.1); border-radius: 8px; font-size: 13px; background: rgba(255,255,255,0.5); color: #1c1e21; outline: none; font-family: monospace; transition: 0.3s; }
    #${SCRAP_ID}.dark .config-inp { background: rgba(0,0,0,0.2); color: #fff; border: 1px solid rgba(255,255,255,0.1); }
    .config-inp:focus { border-color: rgba(59,130,246,0.8); box-shadow: 0 0 0 2px rgba(59,130,246,0.1); }
  `;
  document.head.appendChild(st);

  let isDark = localStorage.getItem('cm-theme') === 'dark';
  if (!isDark) isDark = localStorage.getItem('cm-scrap-theme') === 'dark';

  const ui = document.createElement('div');
  ui.id = SCRAP_ID;
  if (isDark) ui.classList.add('dark');
  else ui.classList.add('light');

  const _scrapUrl = localStorage.getItem('cm-scrap-url') || '';
  const _scrapPanel = localStorage.getItem('cm-scrap-panel') || '';
  const themeIcon = isDark ? '☀️' : '🌙';

  ui.innerHTML = `
    <div class="scrap-modal">
      <div class="scrap-header">
        <div class="scrap-logo">
          <span>⚡</span> HOURLY REPORT
        </div>
        <div class="scrap-tabs">
          <button class="scrap-tab-btn active" onclick="switchTab('home')">HOME</button>
          <button class="scrap-tab-btn" onclick="switchTab('config')">CONFIG</button>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="scrap-btn-icon" onclick="toggleTheme()">${themeIcon}</button>
          <button class="scrap-btn-icon scrap-exit" onclick="document.getElementById('${SCRAP_ID}').remove()">✖</button>
        </div>
      </div>
      
      <div class="scrap-body">
        <!-- HOME TAB -->
        <div id="tab-home" style="display:flex; flex-direction:column;">
          <div class="clock-container">
            <div class="live-date" id="live-date">--</div>
            <div class="live-clock" id="live-clock">00:00:00</div>
            <div class="next-run" id="next-run">Next auto-scrape at 01:00:00</div>
          </div>
          
          <div class="btn-group">
            <button class="btn-control start" id="btn-start" onclick="toggleScrapper()">START</button>
            <button class="btn-control push" id="btn-push" onclick="pushNow()">PUSH NOW</button>
          </div>
          
          <div class="snapshot-grid">
            <div class="snap-card">
              <div class="snap-lbl">RG (Register)</div>
              <div class="snap-val" id="snap-rg">0</div>
            </div>
            <div class="snap-card">
              <div class="snap-lbl">ND (New Depo)</div>
              <div class="snap-val" id="snap-nd">0</div>
            </div>
            <div class="snap-card">
              <div class="snap-lbl">TRX (Tickets)</div>
              <div class="snap-val" id="snap-trx">0</div>
            </div>
            <div class="snap-card full">
              <div class="snap-lbl">TO (Turnover)</div>
              <div class="snap-val full-val" id="snap-to">Rp 0</div>
            </div>
            <div class="snap-card full">
              <div class="snap-lbl">WL (Winlose)</div>
              <div class="snap-val full-val" id="snap-wl">Rp 0</div>
            </div>
          </div>
          
          <div class="console-box" id="console-box">
            <div class="console-line wait">[System] Initializing...</div>
          </div>
        </div>

        <!-- CONFIG TAB -->
        <div id="tab-config" style="display:none;">
          <div class="config-inp-grp">
            <label class="config-lbl">URL Google Apps Script (GAS Web App)</label>
            <input type="text" class="config-inp" id="inp-url" placeholder="https://script.google.com/macros/s/.../exec" value="${_scrapUrl}">
          </div>
          
          <div class="config-inp-grp">
            <label class="config-lbl">Nama Panel / Operator (Opsional)</label>
            <input type="text" class="config-inp" id="inp-panel" placeholder="Contoh: Budi" value="${_scrapPanel}" style="font-family:sans-serif;">
          </div>
          
          <button class="btn-control start" style="width:100%; margin-top:16px;" onclick="saveConfig()">💾 SIMPAN KONFIGURASI</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(ui);

  let _isRunning = false;
  let _lastHour = new Date().getHours();

  window.toggleTheme = () => { 
    const el = document.getElementById(SCRAP_ID); 
    el.classList.toggle('dark'); 
    el.classList.toggle('light');
    const btn = el.querySelector('.scrap-btn-icon[onclick="toggleTheme()"]'); 
    if (el.classList.contains('dark')) { 
      localStorage.setItem('cm-scrap-theme', 'dark'); 
      btn.innerText = '☀️'; 
    } else { 
      localStorage.setItem('cm-scrap-theme', 'light'); 
      btn.innerText = '🌙'; 
    } 
  };

  window.switchTab = (tab) => {
    document.querySelectorAll('.scrap-tab-btn').forEach(e => e.classList.remove('active'));
    document.querySelector(`.scrap-tab-btn[onclick="switchTab('${tab}')"]`).classList.add('active');
    document.getElementById('tab-home').style.display = tab === 'home' ? 'flex' : 'none';
    document.getElementById('tab-config').style.display = tab === 'config' ? 'block' : 'none';
  };

  window.saveConfig = () => {
    localStorage.setItem('cm-scrap-url', document.getElementById('inp-url').value.trim());
    localStorage.setItem('cm-scrap-panel', document.getElementById('inp-panel').value.trim());
    logMsg('Konfigurasi berhasil disimpan!', 'success');
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

  // Live Clock, Date & Auto Refresh UI tiap detik
  setInterval(() => {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    
    // Live Date
    const dateOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    document.getElementById('live-date').innerText = now.toLocaleDateString('id-ID', dateOptions);
    
    document.getElementById('live-clock').innerText = `${h}:${m}:${s}`;
    
    let nextH = now.getHours() + 1;
    if (nextH > 23) nextH = 0;
    document.getElementById('next-run').innerText = `Next auto-scrape at ${String(nextH).padStart(2, '0')}:00:00`;

    // Auto refresh UI saat ganti jam
    if (now.getHours() !== _lastHour) {
      _lastHour = now.getHours();
      fetchSnapshot();
    }

    // Auto scrape logic kalau START ditekan
    if (_isRunning && now.getMinutes() === 0 && now.getSeconds() <= 2) {
      executeScrape(false);
    }
  }, 1000);

  async function fetchAPI(url, payload) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      body: JSON.stringify(payload)
    });
    return res.json();
  }

  async function getData() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const ddmm = `${dd}-${mm}-${yyyy}`;
    
    const payloadRG = { filter: { fs: [ddmm, ddmm] }, idus: 233598653, limit: 500, page: 1, sort: { usnm: ["asc"] } };
    const resRG = await fetchAPI('/memberlist', payloadRG);
    const rg = resRG.usls ? resRG.usls.length : 0;

    const payloadND = { filter: { fs: [ddmm, ddmm], nonnewmb: [true] }, idus: 233598653, limit: 500, page: 1, sort: { usnm: ["asc"] } };
    const resND = await fetchAPI('/memberlist', payloadND);
    const nd = resND.usls ? resND.usls.length : 0;

    let trx = 0;
    let page = 1;
    while(true) {
      const payloadTrx = { "idusBr": 224326595, "startdate": `${ddmm} 00:00:00`, "enddate": `${ddmm} 23:59:59`, "level": 5, "usernameBr": "egaxbets@xbets988", "page": page, "limit": 500, "type": "1001", "bo": true, "st": "10" };
      const resTrx = await fetchAPI('/trx/historypl', payloadTrx);
      let batch = resTrx.trx || [];
      trx += batch.length;
      if (batch.length < 500) break;
      page++;
    }

    const payloadWL = { "start": ddmm, "end": ddmm, "idus": 233598653, "usnm": "billybet@xbets988", "level": 5, "levelbr": 6, "idpv": null, "pvnm": null, "by": 1, "pg": 1, "sort": ["asc"], "limit": "100" };
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
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    
    let targetHour = now.getHours();
    if (isPush) {
      targetHour = (targetHour + 1) % 24; // Push now mengisi jam berikutnya
    }
    
    const hh = String(targetHour).padStart(2, '0');
    const dateStr = `${dd}-${mm}-${yyyy}`;
    const timeStr = `${hh}:00`;
    
    const lastSentKey = `scrap_${dateStr}_${timeStr}`;
    if (!isPush && localStorage.getItem('cm-scrap-last') === lastSentKey) {
      return; 
    }

    logMsg(`Scraping data for ${timeStr}...`, 'wait');
    
    const url = localStorage.getItem('cm-scrap-url');
    const panel = localStorage.getItem('cm-scrap-panel') || 'Unknown';
    
    if (!url) {
      logMsg('URL GAS belum diatur di Config!', 'err');
      return;
    }

    const data = await fetchSnapshot();
    if (!data) return;

    const payload = {
      date: dateStr,
      time: timeStr,
      rg: data.rg,
      nd: data.nd,
      trx: data.trx,
      to: data.to,
      wl: data.wl,
      panel: panel,
      is_push: isPush,
      scrapedAt: new Date().toISOString()
    };

    try {
      await fetch(url, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) });
      if (!isPush) localStorage.setItem('cm-scrap-last', lastSentKey);
      logMsg(`✅ ${isPush ? 'PUSH NOW' : 'AUTO'}: Data untuk jam ${timeStr} terkirim ke Sheet.`, 'success');
    } catch (e) {
      logMsg(`❌ Gagal kirim ke Sheet: ${e.message}`, 'err');
    }
  }

  window.toggleScrapper = () => {
    _isRunning = !_isRunning;
    const btn = document.getElementById('btn-start');
    if (_isRunning) {
      btn.innerText = 'STOP';
      btn.classList.remove('start');
      btn.classList.add('stop');
      logMsg('Scrapper STARTED. Menunggu jam tepat...', 'info');
    } else {
      btn.innerText = 'START';
      btn.classList.remove('stop');
      btn.classList.add('start');
      logMsg('Scrapper STOPPED.', 'wait');
    }
  };

  window.pushNow = async () => {
    const btn = document.getElementById('btn-push');
    btn.innerText = 'LOADING...';
    btn.disabled = true;
    await executeScrape(true);
    btn.innerText = 'PUSH NOW';
    btn.disabled = false;
  };

  // Init saat dibuka
  logMsg('Scrapper siap. Memuat data awal...', 'info');
  fetchSnapshot();
})();
