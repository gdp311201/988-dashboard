javascript:(async () => {
  const SPA_ID = 'spa-staff-monitor-v12';
  if (document.getElementById(SPA_ID)) { document.getElementById(SPA_ID).remove(); return; }

  // === 1. AUTO DOMAIN & CREDENTIAL SCRAPE ===
  const currentDomain = window.location.hostname.replace('www.', '');
  const rawHTML = document.documentElement.outerHTML;
  
  const idusMatch = rawHTML.match(/var\s+idus\s*=\s*"?(\d+)"?;/);
  const usernameMatch = rawHTML.match(/Username\s*:\s*([a-zA-Z0-9_@.-]+)/);
  
  if (idusMatch) localStorage.setItem('cm-scrap-idus_' + currentDomain, idusMatch[1]);
  if (usernameMatch) localStorage.setItem('cm-scrap-usnm_' + currentDomain, usernameMatch[1]);

  const idusBr = localStorage.getItem('cm-scrap-idus_' + currentDomain);
  const usernameBr = localStorage.getItem('cm-scrap-usnm_' + currentDomain);

  // === DETEKSI NAMA BRAND UNTUK HEADER (Berdasarkan Suffix Username / wlhun) ===
  let _brandName = currentDomain; // Default fallback jika gagal
  const _extractedUser = usernameMatch ? usernameMatch[1] : '';
  if (_extractedUser && _extractedUser.includes('@')) {
    let rawBrand = _extractedUser.split('@')[1].toLowerCase();
    if (rawBrand === 'xbets988') _brandName = '988BET';
    else if (rawBrand === 'wttan777') _brandName = 'TITAN777';
    else _brandName = _extractedUser.split('@')[1].toUpperCase();
  }

  // === 2. PREMIUM GLASSMORPHISM STYLES ===
  const st = document.createElement('style');
  st.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800;900&display=swap');
    #${SPA_ID} * { box-sizing:border-box; font-family:'Inter',sans-serif!important; }
    
    #${SPA_ID} {
      position: fixed; inset: 0; z-index: 2147483647;
      display: flex; align-items: center; justify-content: center;
      background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(8px);
      animation: spaFade 0.3s ease;
    }
    @keyframes spaFade { from { opacity: 0; } to { opacity: 1; } }

    #${SPA_ID}.dark {
      --bg-modal: rgba(15, 23, 42, 0.55); --bg-solid: #0f172a; --text-main: #e2e8f0; --text-muted: #94a3b8;
      --border: rgba(255, 255, 255, 0.12); --bg-card: rgba(255, 255, 255, 0.04);
      --bg-input: rgba(255, 255, 255, 0.06); --bg-hover: rgba(255, 255, 255, 0.1);
      --accent: #3b82f6; --accent-light: #60a5fa; --glow: 0 0 20px rgba(59, 130, 246, 0.3);
      --success: #22c55e; --danger: #ef4444;
    }
    #${SPA_ID}.light {
      --bg-modal: rgba(255, 255, 255, 0.65); --bg-solid: #ffffff; --text-main: #1e293b; --text-muted: #64748b;
      --border: rgba(0, 0, 0, 0.08); --bg-card: rgba(255, 255, 255, 0.4);
      --bg-input: rgba(255, 255, 255, 0.5); --bg-hover: rgba(0, 0, 0, 0.04);
      --accent: #2563eb; --accent-light: #3b82f6; --glow: 0 0 20px rgba(37, 99, 235, 0.15);
      --success: #16a34a; --danger: #dc2626;
    }

    .spa-modal {
      width: min(1200px, 95vw); height: 85vh; 
      background: var(--bg-modal); color: var(--text-main);
      border: 1px solid var(--border); border-radius: 24px;
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      box-shadow: 0 24px 64px rgba(0,0,0,0.3), var(--glow);
      display: flex; flex-direction: column; overflow: hidden;
      animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }

    .spa-header { padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); }
    .spa-title { font-weight: 700; font-size: 18px; color: var(--text-main); display:flex; gap:12px; align-items:center; letter-spacing: -0.5px; }
    .spa-logo img { width: 28px; height: 28px; filter: drop-shadow(0 0 8px rgba(251,191,36,0.6)); }
    
    .shimmer-text {
      font-weight: 800; background: linear-gradient(110deg, var(--text-main) 30%, #ffffff 50%, var(--text-main) 70%);
      background-size: 200% 100%; -webkit-background-clip: text; background-clip: text;
      -webkit-text-fill-color: transparent; animation: shimmerGlint 4s linear infinite;
    }
    @keyframes shimmerGlint { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

    .spa-badge { font-size: 10px; font-weight: 600; color: var(--accent-light); background: var(--bg-input); padding: 4px 10px; border-radius: 20px; border: 1px solid var(--border); }
    .spa-actions { display: flex; gap: 8px; align-items: center; }
    .spa-btn-icon { width: 36px; height: 36px; border-radius: 10px; border: 1px solid var(--border); background: var(--bg-input); color: var(--text-main); cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; backdrop-filter: blur(4px); }
    .spa-btn-icon:hover { background: var(--bg-hover); transform: translateY(-1px); }
    
    .spa-controls { padding: 12px 24px; display: flex; gap: 10px; align-items: center; border-bottom: 1px solid var(--border); flex-wrap: wrap; }
    
    /* TABS STYLE */
    .spa-tabs { display: flex; background: var(--bg-input); border-radius: 10px; padding: 4px; border: 1px solid var(--border); margin-right: 10px; }
    .spa-tab-btn { padding: 8px 16px; border: none; background: transparent; color: var(--text-muted); font-weight: 700; font-size: 12px; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; }
    .spa-tab-btn:hover { color: var(--text-main); }
    .spa-tab-btn.active { background: linear-gradient(135deg, var(--accent), var(--accent-light)); color: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }

    .spa-toggle { display: flex; background: var(--bg-input); border-radius: 10px; padding: 4px; border: 1px solid var(--border); backdrop-filter: blur(4px); }
    .spa-toggle button { padding: 8px 16px; border: none; background: transparent; color: var(--text-muted); font-weight: 600; font-size: 12px; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; }
    .spa-toggle button.active { background: linear-gradient(135deg, var(--accent), var(--accent-light)); color: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
    
    .spa-select { padding: 8px 12px; border-radius: 10px; border: 1px solid var(--border); background: var(--bg-solid); color: var(--text-main); font-weight: 500; font-size: 12px; cursor: pointer; outline: none; transition: all 0.3s ease; }
    .spa-select:hover { border-color: var(--accent); }
    .spa-select option { background: var(--bg-solid); color: var(--text-main); }
    
    .spa-sort-btns { display: flex; gap: 6px; margin-left: auto; }
    .spa-sort-btns button { padding: 8px 14px; font-size: 12px; font-weight: 700; color: var(--text-main); border-radius: 10px; border: 1px solid var(--border); background: var(--bg-input); cursor: pointer; transition: all 0.3s ease; backdrop-filter: blur(4px); }
    .spa-sort-btns button:hover { background: var(--bg-hover); transform: translateY(-1px); }
    .spa-sort-btns button.active { border-color: var(--accent); color: var(--accent); background: var(--bg-hover); box-shadow: 0 0 10px rgba(59,130,246,0.1); }
    
    .spa-stats { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; padding: 16px 24px; }
    .stat-card { background: var(--bg-card); border-radius: 14px; padding: 14px; border: 1px solid var(--border); transition: all 0.3s ease; backdrop-filter: blur(4px); }
    .stat-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .stat-lbl { font-size: 10px; color: var(--text-muted); text-transform: uppercase; font-weight: 600; margin-bottom: 4px; letter-spacing: 0.5px; }
    .stat-val { font-size: 18px; font-weight: 700; color: var(--text-main); font-family: 'Space Grotesk',sans-serif; line-height: 1.2; }
    .stat-sub { font-size: 11px; color: var(--text-muted); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .stat-sub.highlight { color: var(--accent); font-weight: 700; font-size: 12px; }
    
    .spa-content { flex: 1; overflow-y: auto; padding: 0 24px 20px; min-height: 300px; position: relative; }
    .spa-content::-webkit-scrollbar { width: 6px; }
    .spa-content::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
    
    table.spa-table { width: 100%; border-collapse: collapse; font-size: 12px; table-layout: auto; }
    table.spa-table th { text-align: left; padding: 12px 8px; font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; position: sticky; top: 0; background: var(--bg-solid); border-bottom: 1px solid var(--border); white-space: nowrap; z-index: 10; }
    table.spa-table td { padding: 12px 8px; border-bottom: 1px solid var(--border); color: var(--text-main); vertical-align: top; }
    table.spa-table tbody tr { transition: all 0.2s ease; }
    table.spa-table tbody tr:hover { background: var(--bg-hover); }
    .delay-fast { color: var(--success); font-weight: 700; }
    .delay-slow { color: var(--danger); font-weight: 700; }
    .spa-empty { text-align:center; padding: 60px 0; color: var(--text-muted); font-size: 14px; }
    
    /* RANK STYLES FOR ANALYSIS */
    .rank-badge { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; font-weight: 700; font-size: 11px; background: var(--bg-input); color: var(--text-muted); }
    .rank-1 { background: linear-gradient(135deg, #facc15, #f59e0b); color: #fff; box-shadow: 0 2px 8px rgba(250, 204, 21, 0.3); }
    .rank-2 { background: linear-gradient(135deg, #cbd5e1, #94a3b8); color: #fff; box-shadow: 0 2px 8px rgba(203, 213, 225, 0.3); }
    .rank-3 { background: linear-gradient(135deg, #fb923c, #ea580c); color: #fff; box-shadow: 0 2px 8px rgba(251, 146, 60, 0.3); }

    .spa-loader-box { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 0; gap: 0px; }
    .circular-loader { position: relative; width: 60px; height: 60px; }
    .circular-loader svg { transform: rotate(-90deg); }
    .loader-circle-bg { stroke: var(--border); }
    .loader-circle-fg { stroke: var(--accent); stroke-linecap: round; transition: stroke-dashoffset 0.5s ease; filter: drop-shadow(0 0 5px var(--accent)); }
    .loader-percent { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: var(--text-main); font-family: 'Space Grotesk'; }
  `;
  document.head.appendChild(st);

  // === 3. MODAL HTML STRUCTURE ===
  let isDark = localStorage.getItem('spa-theme') !== 'light';
  const ui = document.createElement('div');
  ui.id = SPA_ID;
  ui.className = isDark ? 'dark' : 'light';
  const themeIcon = isDark ? '☀️' : '🌙';
  
  ui.innerHTML = `
    <div class="spa-modal">
      <div class="spa-header">
        <div class="spa-title">
          <span class="spa-logo"><img src="https://i.ibb.co/Xk66G0bC/8-logo.png" alt="8 logo" border="0"></span>
          <span class="shimmer-text">TRANSACTION MONITORING</span> 
          <span class="spa-badge">${_brandName}</span>
        </div>
        <div class="spa-actions">
          <button class="spa-btn-icon" id="spa-theme-toggle">${themeIcon}</button>
          <button class="spa-btn-icon" style="border-color:rgba(239,68,68,0.3); color:#ef4444;" onclick="document.getElementById('${SPA_ID}').remove()">✖</button>
        </div>
      </div>
      
      <div class="spa-controls">
        <div class="spa-tabs">
          <button class="spa-tab-btn active" id="tab-dashboard-btn" onclick="window.switchTab('dashboard')">DASHBOARD</button>
          <button class="spa-tab-btn" id="tab-analysis-btn" onclick="window.switchTab('analysis')">ANALYSIS</button>
        </div>
        <div class="spa-toggle">
          <button class="active" id="toggle-dp" onclick="window.spaSetType('dp')">DEPOSIT</button>
          <button id="toggle-wd" onclick="window.spaSetType('wd')">WITHDRAW</button>
        </div>
        <select class="spa-select" id="spa-filter-type" onchange="window.handleFilterChange()">
          <option value="all">ALL</option>
          <option value="staff">STAFF</option>
          <option value="system">SYSTEM</option>
        </select>
        <select class="spa-select" id="spa-timeframe" onchange="window.spaHandleTimeframe()">
          <option value="today">Hari Ini</option>
          <option value="yesterday">Kemarin</option>
          <option value="7days">7 Hari Terakhir</option>
          <option value="thismonth">Bulan Ini</option>
          <option value="lastmonth">Bulan Lalu</option>
          <option value="custom">Custom Tanggal</option>
        </select>
        <div id="spa-custom-date-wrap" style="display:none; gap:6px;">
          <input type="date" id="spa-start-date" class="spa-select">
          <input type="date" id="spa-end-date" class="spa-select">
        </div>
        <button class="spa-btn-proses" id="spa-proses" onclick="window.spaFetchData()" style="display:none;">PROSES DATA</button>
        <div class="spa-sort-btns" id="sort-controls">
          <button id="sort-default" class="active" onclick="window.spaSort('default')">⟲ Refresh</button>
          <button id="sort-fast" onclick="window.spaSort('fast')">⬇ Tercepat</button>
          <button id="sort-slow" onclick="window.spaSort('slow')">⬆ Terlama</button>
        </div>
      </div>

      <!-- TAB DASHBOARD -->
      <div id="content-dashboard" class="spa-content">
        <div class="spa-stats">
          <div class="stat-card"><div class="stat-lbl">Total Transaksi</div><div class="stat-val" id="stat-total">0</div><div class="stat-sub">Form Diproses</div></div>
          <div class="stat-card"><div class="stat-lbl">Total Nominal</div><div class="stat-val" id="stat-nominal">Rp 0</div><div class="stat-sub">Akumulasi Amount</div></div>
          <div class="stat-card"><div class="stat-lbl">🚀 Tercepat</div><div class="stat-val" id="stat-fast" style="color:var(--success)">-</div><div class="stat-sub highlight" id="stat-fast-staff">Menunggu data</div></div>
          <div class="stat-card"><div class="stat-lbl">🐢 Terlama</div><div class="stat-val" id="stat-slow" style="color:var(--danger)">-</div><div class="stat-sub highlight" id="stat-slow-staff">Menunggu data</div></div>
          <div class="stat-card"><div class="stat-lbl">⏱️ Rata-Rata</div><div class="stat-val" id="stat-avg">-</div><div class="stat-sub">Waktu proses</div></div>
        </div>
        <table class="spa-table">
          <thead>
            <tr>
              <th style="width:30px">NO</th><th>CREATE DATE</th><th>USERNAME</th><th>DESCRIPTION</th><th>STATUS</th><th>PROCESS DATE</th><th>PROCESS BY</th><th>AMOUNT</th><th>JEDA</th>
            </tr>
          </thead>
          <tbody id="spa-tbody">
            <tr><td colspan="9"><div class="spa-empty">Memuat data dashboard...</div></td></tr>
          </tbody>
        </table>
      </div>

      <!-- TAB ANALYSIS -->
      <div id="content-analysis" class="spa-content" style="display: none;">
        <table class="spa-table">
          <thead>
            <tr>
              <th style="width:50px">RANK</th><th>HANDLER (PROCESS BY)</th><th>TOTAL HANDLE</th><th>🚀 TERCEPAT</th><th>⏱️ RATA-RATA</th><th>🐢 TERLAMA</th>
            </tr>
          </thead>
          <tbody id="analysis-tbody">
            <tr><td colspan="6"><div class="spa-empty">Belum ada data analisis.</div></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
  document.body.appendChild(ui);

  // === 4. TAB & UI EVENTS ===
  document.getElementById('spa-theme-toggle').onclick = () => {
    const el = document.getElementById(SPA_ID);
    const btn = document.getElementById('spa-theme-toggle');
    if (el.classList.contains('dark')) {
      el.classList.remove('dark'); el.classList.add('light');
      localStorage.setItem('spa-theme', 'light'); btn.innerText = '🌙';
    } else {
      el.classList.remove('light'); el.classList.add('dark');
      localStorage.setItem('spa-theme', 'dark'); btn.innerText = '☀️';
    }
  };

  window.switchTab = (tab) => {
    document.getElementById('tab-dashboard-btn').classList.toggle('active', tab === 'dashboard');
    document.getElementById('tab-analysis-btn').classList.toggle('active', tab === 'analysis');
    document.getElementById('content-dashboard').style.display = tab === 'dashboard' ? 'block' : 'none';
    document.getElementById('content-analysis').style.display = tab === 'analysis' ? 'block' : 'none';
    document.getElementById('sort-controls').style.display = tab === 'dashboard' ? 'flex' : 'none';
  };

  window.handleFilterChange = () => { renderTable(); renderAnalysis(); };

  window.spaHandleTimeframe = () => {
    const tf = document.getElementById('spa-timeframe').value;
    const customWrap = document.getElementById('spa-custom-date-wrap');
    const prosesBtn = document.getElementById('spa-proses');
    if (tf === 'custom') {
      customWrap.style.display = 'flex';
      prosesBtn.style.display = 'block';
    } else {
      customWrap.style.display = 'none';
      prosesBtn.style.display = 'none';
      window.spaFetchData(); 
    }
  };

  let currentType = 'dp'; 
  let rawData = [];
  let currentSort = 'default';

  window.spaSetType = (type) => {
    currentType = type;
    document.getElementById('toggle-dp').classList.toggle('active', type === 'dp');
    document.getElementById('toggle-wd').classList.toggle('active', type === 'wd');
    window.spaFetchData(); 
  };

  window.spaSort = (sortType) => {
    currentSort = sortType;
    ['default', 'fast', 'slow'].forEach(t => {
      document.getElementById(`sort-${t}`).classList.toggle('active', sortType === t);
    });
    renderTable();
  };

  function formatRupiah(angka) {
    if (!angka) return 'Rp 0';
    return 'Rp ' + Math.round(angka).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function parseTrxDate(dateStr) {
    if (!dateStr) return null;
    const parts = dateStr.split(/[-\s:]/);
    if (parts.length < 6) return null;
    return new Date(parts[2], parts[1] - 1, parts[0], parts[3], parts[4], parts[5]);
  }

  function formatDelay(totalSec) {
    if (isNaN(totalSec) || totalSec < 0) return '0d';
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    let parts = [];
    if (h > 0) parts.push(h + 'j');
    if (m > 0) parts.push(m + 'm');
    if (s > 0 || parts.length === 0) parts.push(s + 'd');
    return parts.join(' ');
  }

  function calcDelay(rcdtm, prctm) {
    const d1 = parseTrxDate(rcdtm);
    const d2 = parseTrxDate(prctm);
    if (!d1 || !d2) return null;
    const diffMs = d2 - d1;
    if (isNaN(diffMs) || diffMs < 0) return null;
    const totalSec = Math.floor(diffMs / 1000);
    const text = formatDelay(totalSec);
    return { totalSec, text };
  }

  function getDates() {
    const tf = document.getElementById('spa-timeframe').value;
    if (tf === 'custom') {
      const sVal = document.getElementById('spa-start-date').value;
      const eVal = document.getElementById('spa-end-date').value;
      if (!sVal || !eVal) return { start: '01-01-2020', end: '01-01-2020' };
      const s = new Date(sVal);
      const e = new Date(eVal);
      const pad = (n) => String(n).padStart(2, '0');
      return { start: `${pad(s.getDate())}-${pad(s.getMonth() + 1)}-${s.getFullYear()}`, end: `${pad(e.getDate())}-${pad(e.getMonth() + 1)}-${e.getFullYear()}` };
    }

    const today = new Date();
    let start = new Date(today);
    let end = new Date(today);
    
    if (tf === 'yesterday') {
      start.setDate(today.getDate() - 1); end.setDate(today.getDate() - 1);
    } else if (tf === '7days') {
      start.setDate(today.getDate() - 6);
    } else if (tf === 'thismonth') {
      start.setDate(1);
    } else if (tf === 'lastmonth') {
      start.setMonth(today.getMonth() - 1, 1); end.setDate(0);
    }
    const pad = (n) => String(n).padStart(2, '0');
    const fmt = (d) => `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
    return { start: fmt(start), end: fmt(end) };
  }

  function updateLoader(percent) {
    const circle = document.getElementById('loader-circle-fg');
    const txt = document.getElementById('loader-percent');
    if(!circle || !txt) return;
    const radius = 26;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = offset;
    txt.innerText = Math.round(percent) + '%';
  }

  // === 5. API FETCHER ===
  window.spaFetchData = async () => {
    const tbody = document.getElementById('spa-tbody');
    
    tbody.innerHTML = `<tr><td colspan="9" style="height: 100%; vertical-align: middle;">
      <div class="spa-loader-box">
        <div class="circular-loader">
          <svg width="60" height="60" viewBox="0 0 60 60">
            <circle class="loader-circle-bg" cx="30" cy="30" r="26" stroke-width="4" fill="none" />
            <circle id="loader-circle-fg" cx="30" cy="30" r="26" stroke-width="4" fill="none" />
          </svg>
          <div id="loader-percent" class="loader-percent">0%</div>
        </div>
      </div>
    </td></tr>`;

    if (!idusBr || !usernameBr) {
      tbody.innerHTML = `<tr><td colspan="9"><div class="spa-empty" style="color:var(--danger)">Gagal! ID/Username tidak terdeteksi. Refresh halaman.</div></td></tr>`;
      return;
    }

    const { start, end } = getDates();
    const typeCode = currentType === 'dp' ? '1001' : '1002';
    const limit = 500;
    let page = 1;
    rawData = [];

    try {
      let progress = 10;
      updateLoader(progress);

      while (true) {
        const payload = {
          idusBr: parseInt(idusBr), startdate: start, enddate: end,
          level: 5, usernameBr: usernameBr, page: page, limit: limit,
          type: typeCode, bo: true, st: "10"
        };

        const res = await fetch('/trx/historypl', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
          body: JSON.stringify(payload)
        });
        const resJson = await res.json();
        
        if (resJson.msg !== "SUCCESS") throw new Error(resJson.errorMsg || 'API Error');
        
        const batch = resJson.trx || [];
        if (batch.length === 0) break;

        rawData = rawData.concat(batch);
        progress = Math.min(progress + 15, 90);
        updateLoader(progress);

        if (batch.length < limit) break;
        page++;
      }
      
      updateLoader(100);
      renderTable();
      renderAnalysis();
    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="9"><div class="spa-empty" style="color:var(--danger)">Error: ${e.message}</div></td></tr>`;
    }
  };

  // === 6. TABLE & STATS RENDERER ===
  function renderTable() {
    const tbody = document.getElementById('spa-tbody');
    const filterType = document.getElementById('spa-filter-type').value;
    
    if (rawData.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9"><div class="spa-empty">Tidak ada data transaksi pada periode ini.</div></td></tr>`;
      updateStats([], 0); return;
    }

    let filteredData = rawData.filter(item => {
      const trxNoteStr = (item.trxNote || '').toLowerCase();
      const rawProcBy = item.usb?.unfn || item.unfn || '';
      let isSystem = rawProcBy === 'xbets988' || trxNoteStr.includes('auto') || trxNoteStr.includes('system');
      
      if (filterType === 'staff') return !isSystem;
      if (filterType === 'system') return isSystem;
      return true; 
    });

    if (filteredData.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9"><div class="spa-empty">Tidak ada data yang cocok dengan filter ini.</div></td></tr>`;
      updateStats([], 0); return;
    }

    filteredData.sort((a, b) => {
      if (currentSort === 'default') {
        const dA = parseTrxDate(a.rcdtm);
        const dB = parseTrxDate(b.rcdtm);
        return dA - dB;
      } else {
        const delayA = calcDelay(a.rcdtm, a.prctm)?.totalSec ?? 0;
        const delayB = calcDelay(b.rcdtm, b.prctm)?.totalSec ?? 0;
        return currentSort === 'fast' ? delayA - delayB : delayB - delayA;
      }
    });

    let html = '';
    let totalNominal = 0;
    let processedItems = []; 

    filteredData.forEach((item, idx) => {
      const delayObj = calcDelay(item.rcdtm, item.prctm);
      const delayText = delayObj ? delayObj.text : '0d';
      const delaySec = delayObj ? delayObj.totalSec : 0;
      
      const amount = parseFloat(item.amt || 0) * 1000; 
      totalNominal += amount;
      
      const username = item.usb?.usnn || item.usnn || item.usb?.un || '-';
      const desc = item.usb?.accnm || '-'; 
      
      const trxNoteStr = (item.trxNote || '').toLowerCase();
      const rawProcBy = item.usb?.unfn || item.unfn || '';
      let procBy = 'System';
      if (rawProcBy && rawProcBy !== 'xbets988' && !trxNoteStr.includes('auto') && !trxNoteStr.includes('system')) {
        procBy = rawProcBy;
      }
      
      if (delayObj) {
        processedItems.push({ delaySec, delayText, staff: procBy });
      }
      
      const delayClass = delaySec <= 300 ? 'delay-fast' : (delaySec > 900 ? 'delay-slow' : '');
      
      html += `
        <tr>
          <td>${idx + 1}</td>
          <td style="white-space:nowrap;">${item.rcdtm || '-'}</td>
          <td style="font-weight:500;">${username}</td>
          <td>${desc}</td>
          <td style="color:var(--success);font-weight:600; white-space:nowrap;">${item.ststr || '-'}</td>
          <td style="white-space:nowrap;">${item.prctm || '-'}</td>
          <td style="font-weight:500; white-space:nowrap;">${procBy}</td>
          <td style="font-variant-numeric: tabular-nums; white-space:nowrap;">${formatRupiah(amount)}</td>
          <td class="${delayClass}" style="white-space:nowrap;">${delayText}</td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
    updateStats(processedItems, totalNominal);
  }

  function updateStats(processedItems, totalNominal) {
    document.getElementById('stat-total').innerText = processedItems.length;
    document.getElementById('stat-nominal').innerText = formatRupiah(totalNominal);

    if (processedItems.length > 0) {
      let fast = processedItems[0];
      let slow = processedItems[0];
      let totalDelaySec = 0;
      
      processedItems.forEach(d => {
        if (d.delaySec < fast.delaySec) fast = d;
        if (d.delaySec > slow.delaySec) slow = d;
        totalDelaySec += d.delaySec;
      });

      const avgSec = Math.round(totalDelaySec / processedItems.length);
      const avgText = formatDelay(avgSec);

      document.getElementById('stat-fast').innerText = `${fast.delayText}`;
      document.getElementById('stat-fast-staff').innerText = fast.staff;
      
      document.getElementById('stat-slow').innerText = `${slow.delayText}`;
      document.getElementById('stat-slow-staff').innerText = slow.staff;

      document.getElementById('stat-avg').innerText = avgText;
    } else {
      ['stat-fast', 'stat-slow', 'stat-avg'].forEach(id => document.getElementById(id).innerText = '-');
      document.getElementById('stat-fast-staff').innerText = 'Tidak ada data';
      document.getElementById('stat-slow-staff').innerText = 'Tidak ada data';
    }
  }

  // === 7. ANALYSIS TAB RENDERER ===
  function renderAnalysis() {
    const tbody = document.getElementById('analysis-tbody');
    const filterType = document.getElementById('spa-filter-type').value;
    
    if (rawData.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6"><div class="spa-empty">Belum ada data untuk dianalisis. Silakan tarik data terlebih dahulu.</div></td></tr>`;
      return;
    }

    let filteredData = rawData.filter(item => {
      const trxNoteStr = (item.trxNote || '').toLowerCase();
      const rawProcBy = item.usb?.unfn || item.unfn || '';
      let isSystem = rawProcBy === 'xbets988' || trxNoteStr.includes('auto') || trxNoteStr.includes('system');
      
      if (filterType === 'staff') return !isSystem;
      if (filterType === 'system') return isSystem;
      return true; 
    });

    // Grouping data by Handler
    const handlerStats = {};
    filteredData.forEach(item => {
      const trxNoteStr = (item.trxNote || '').toLowerCase();
      const rawProcBy = item.usb?.unfn || item.unfn || '';
      let procBy = 'System';
      if (rawProcBy && rawProcBy !== 'xbets988' && !trxNoteStr.includes('auto') && !trxNoteStr.includes('system')) {
        procBy = rawProcBy;
      }

      const delayObj = calcDelay(item.rcdtm, item.prctm);
      const delaySec = delayObj ? delayObj.totalSec : 0;

      if (!handlerStats[procBy]) {
        handlerStats[procBy] = { count: 0, totalDelaySec: 0, delays: [] };
      }
      handlerStats[procBy].count++;
      if (delayObj) {
        handlerStats[procBy].delays.push(delaySec);
        handlerStats[procBy].totalDelaySec += delaySec;
      }
    });

    // Convert ke Array & Sort by Total Handle (Descending)
    const handlers = Object.entries(handlerStats).map(([name, data]) => {
      const fast = data.delays.length ? Math.min(...data.delays) : 0;
      const slow = data.delays.length ? Math.max(...data.delays) : 0;
      const avg = data.delays.length ? Math.round(data.totalDelaySec / data.delays.length) : 0;
      return { name, count: data.count, fast, slow, avg };
    }).sort((a, b) => b.count - a.count);

    let html = '';
    handlers.forEach((h, i) => {
      // Rank Badge Logic
      let rankClass = '';
      if (i === 0) rankClass = 'rank-1';
      else if (i === 1) rankClass = 'rank-2';
      else if (i === 2) rankClass = 'rank-3';

      const fastClass = h.fast <= 300 ? 'delay-fast' : '';
      const slowClass = h.slow > 900 ? 'delay-slow' : '';

      html += `
        <tr>
          <td style="text-align: center;"><span class="rank-badge ${rankClass}">${i + 1}</span></td>
          <td style="font-weight:700; color:var(--accent); font-size: 13px;">${h.name}</td>
          <td style="font-weight:600;">${h.count} Form</td>
          <td class="${fastClass}">${formatDelay(h.fast)}</td>
          <td style="font-weight:600;">${formatDelay(h.avg)}</td>
          <td class="${slowClass}">${formatDelay(h.slow)}</td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
  }

  // Expose renderAnalysis to handle re-rendering on filter change
  window.renderAnalysis = renderAnalysis;
  window.renderTable = renderTable;

  // Auto Init Data
  window.spaFetchData();

})();
