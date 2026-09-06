(async () => {
  const ID = 'cm-universal-dash-v36';
  if (document.getElementById(ID)) { document.getElementById(ID).remove(); return; }

  // ── STYLE ──────────────────────────────────────────────────────────────────
  const st = document.createElement('style');
  st.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
    #${ID} * { box-sizing:border-box; font-family:'Inter',sans-serif!important; }
    
    #${ID} {
      --bg-app: rgba(241, 245, 249, 0.75); 
      --bg-card: rgba(255, 255, 255, 0.55);
      --bg-sec: rgba(255, 255, 255, 0.35);
      --text-main: #1c1e21; --text-sub: #65676b;
      --glass-border: 1px solid rgba(255, 255, 255, 0.8);
      --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), inset 0 0 15px rgba(255, 255, 255, 0.5);
      --glass-glow: 0 0 25px rgba(0, 0, 0, 0.15); 
      --tbl-head-bg: rgba(255, 255, 255, 0.7); --tbl-head-text: #1c1e21; --tbl-border: rgba(200, 210, 225, 0.5);
      --tbl-row-even: rgba(255, 255, 255, 0.15); --tbl-row-hover: rgba(255, 255, 255, 0.35);
      --modal-bg: rgba(255, 255, 255, 0.85); --input-bg: rgba(255, 255, 255, 0.9);
      --switch-bg: rgba(0, 0, 0, 0.05);
    }
    #${ID}.dark {
      --bg-app: rgba(15, 23, 42, 0.75); 
      --bg-card: rgba(30, 41, 59, 0.55);
      --bg-sec: rgba(15, 23, 42, 0.45);
      --text-main: #e2e8f0; --text-sub: #94a3b8;
      --glass-border: 1px solid rgba(16, 185, 129, 0.3); 
      --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(16, 185, 129, 0.05);
      --glass-glow: 0 0 30px rgba(16, 185, 129, 0.25); 
      --tbl-head-bg: rgba(15, 23, 42, 0.8); --tbl-head-text: #e2e8f0; --tbl-border: rgba(255, 255, 255, 0.1);
      --tbl-row-even: rgba(255, 255, 255, 0.03); --tbl-row-hover: rgba(255, 255, 255, 0.08);
      --modal-bg: rgba(15, 23, 42, 0.9); --input-bg: rgba(15, 23, 42, 0.8);
      --switch-bg: rgba(255, 255, 255, 0.05);
    }
    
    #${ID} { position:fixed; inset:0; background:var(--bg-app); backdrop-filter: blur(2.5px) saturate(150%); -webkit-backdrop-filter: blur(2.5px) saturate(150%); z-index:2147483647; display:flex; flex-direction:column; color:var(--text-main); transition: background .3s, color .3s; }
    #${ID} ::-webkit-scrollbar { width:6px; height:6px; }
    #${ID} ::-webkit-scrollbar-thumb { background:#1e3a5f; border-radius:4px; }
    #${ID} ::-webkit-scrollbar-track { background: transparent; }
    
    .cm-top { background:rgba(0, 0, 0, 0.75); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); padding:6px 16px; display:flex; align-items:center; gap:12px; box-shadow:0 4px 20px rgba(0,0,0,.5); position:sticky; top:0; z-index:100; flex-wrap:wrap; border-bottom: 1px solid rgba(255,255,255,0.1); }
    
    /* EFEK LIGHT SWEEP LOGO */
    .cm-logo { font-size:14px; font-weight:900; letter-spacing:.5px; display:flex; align-items:center; gap:4px; }
    .cm-logo span.zap { color:#fbbf24; text-shadow:0 0 10px rgba(251,191,36,0.8); }
    .cm-shine-text {
      background: linear-gradient(90deg, #fff 0%, #b1b1b1 40%, #fff 50%, #b1b1b1 60%, #fff 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shine 3s linear infinite;
    }
    @keyframes shine { to { background-position: 200% center; } }
    .cm-logo em { font-style:normal; color:#22c55e; }
    
    .cm-dbar { display:flex; align-items:center; gap:8px; flex:1; flex-wrap:wrap; }
    .cm-qb { height:30px; padding:0 12px; border-radius:6px; border:1px solid rgba(255,255,255,.2); background:rgba(255,255,255,.1); color:#fff; font-size:11px; font-weight:700; cursor:pointer; transition: 0.2s; }
    .cm-qb:hover { background:rgba(255,255,255,.2); }
    .cm-qb.act { background:#22c55e; color:#000; border-color:#22c55e; }
    .cm-dinp { height:30px; padding:0 8px; border:1px solid rgba(255,255,255,.2); border-radius:6px; font-size:12px; font-weight:600; color:#fff; background:rgba(255,255,255,.1); outline:none; }
    #cm-month-sel { color:#000 !important; background:#fff !important; border:1px solid #cbd5e1 !important; }
    #cm-month-sel option { color:#000 !important; background:#fff !important; }
    
    /* TOMBOL GLASSMORPHISM */
    .cm-btn-glass { height:32px; padding:0 16px; border:none; border-radius:8px; font-size:12px; font-weight:900; cursor:pointer; color:#fff; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); display:flex; align-items:center; justify-content:center; gap:6px; transition: all 0.2s; }
    .cm-btn-glass:disabled { opacity:0.6; cursor:not-allowed; }
    
    .cm-btn-blue { background:rgba(59, 130, 246, 0.7); box-shadow: 0 4px 12px rgba(59,130,246,.3), inset 0 1px 1px rgba(255,255,255,0.4); border:1px solid rgba(59,130,246,0.8); }
    .cm-btn-blue:hover:not(:disabled) { background:rgba(59, 130, 246, 0.9); transform: translateY(-1px); box-shadow: 0 6px 16px rgba(59,130,246,.4), inset 0 1px 1px rgba(255,255,255,0.5); }
    
    .cm-btn-green { background:rgba(22, 163, 74, 0.7); box-shadow: 0 4px 12px rgba(22,163,74,.3), inset 0 1px 1px rgba(255,255,255,0.4); border:1px solid rgba(22,163,74,0.8); color:#fff; }
    .cm-btn-green:hover:not(:disabled) { background:rgba(22, 163, 74, 0.9); transform: translateY(-1px); }
    
    .cm-btn-red { background:rgba(239, 68, 68, 0.7); box-shadow: 0 4px 12px rgba(239,68,68,.3), inset 0 1px 1px rgba(255,255,255,0.4); border:1px solid rgba(239,68,68,0.8); color:#fff; }
    .cm-btn-red:hover:not(:disabled) { background:rgba(239, 68, 68, 0.9); transform: translateY(-1px); }
    
    .cm-btn-grey { background:rgba(255, 255, 255, 0.15); box-shadow: 0 4px 12px rgba(0,0,0,.1), inset 0 1px 1px rgba(255,255,255,0.2); border:1px solid rgba(255,255,255,0.3); color:#fff; }
    .cm-btn-grey:hover:not(:disabled) { background:rgba(255, 255, 255, 0.25); transform: translateY(-1px); }
    
    .cm-auto-wrap { display:flex; align-items:center; gap:4px; margin-left:8px; padding-left:8px; border-left:1px solid rgba(255,255,255,.2); }
    .cm-auto-sel { height:30px; padding:0 8px; border:1px solid #cbd5e1; border-radius:6px; font-size:11px; font-weight:700; color:#000; background:#fff; outline:none; cursor:pointer; }
    .cm-auto-custom { width:50px; height:30px; padding:0 4px; border:1px solid #cbd5e1; border-radius:6px; font-size:11px; font-weight:700; color:#000; background:#fff; outline:none; text-align:center; display:none; }
    .cm-auto-btn { height:32px; padding:0 12px; border-radius:8px; border:none; font-size:11px; font-weight:900; cursor:pointer; color:#fff; background:#f59e0b; box-shadow:0 4px 12px rgba(245,158,11,.3), inset 0 1px 1px rgba(255,255,255,0.3); }
    .cm-auto-btn.active { background:#ef4444; animation:pulse 1.5s infinite; box-shadow:0 4px 12px rgba(239,68,68,.3); }
    @keyframes pulse { 0% { opacity:1; } 50% { opacity:.7; } 100% { opacity:1; } }
    .cm-auto-label { color:rgba(255,255,255,0.6); font-size:10px; font-weight:700; margin-right:4px; }
    
    .cm-tabs-right { display:flex; gap:6px; align-items:center; margin-left:auto; }
    .cm-theme-btn { height:32px; width:32px; background:rgba(255,255,255,.1); border:1px solid rgba(255,255,255,.2); border-radius:8px; cursor:pointer; color:#fff; font-size:16px; display:flex; align-items:center; justify-content:center; backdrop-filter: blur(8px); }
    
    .cm-sbar { background:rgba(0, 0, 0, 0.6); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); padding:4px 20px; font-size:10px; color:rgba(255,255,255,.5); border-bottom: 1px solid rgba(255,255,255,.1); }
    .cm-sbar b { color:#e2e8f0; }
    
    .cm-content { flex:1; min-height:0; overflow:hidden; display:flex; flex-direction:column; padding:16px; }
    
    .cm-cards-area { flex-shrink:0; margin-bottom:16px; }
    .cm-cards { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
    .cm-card { background:var(--bg-card); backdrop-filter: blur(16px) saturate(180%); -webkit-backdrop-filter: blur(16px) saturate(180%); border:var(--glass-border); box-shadow: var(--glass-shadow), var(--glass-glow); border-radius:16px; padding:14px 16px; transition: 0.2s; }
    .cm-clbl { font-size:9px; font-weight:800; color:var(--text-sub); text-transform:uppercase; letter-spacing:.7px; margin-bottom:6px; }
    .cm-card-flex { display:flex; justify-content:space-between; align-items:flex-end; gap:10px; }
    .cm-cval { font-size:16px; font-weight:900; line-height:1.1; color:var(--text-main); }
    .cm-csub-inline { font-size:9px; color:var(--text-sub); margin-top:6px; text-align:left; white-space:nowrap; overflow-x:auto; font-weight:700; }
    .cm-csub { font-size:9px; color:var(--text-sub); margin-top:4px; text-align:right; white-space:pre-line; font-weight:600; }
    
    .cm-fee-bar { margin-top:12px; background:var(--bg-card); backdrop-filter: blur(16px) saturate(180%); -webkit-backdrop-filter: blur(16px) saturate(180%); border:var(--glass-border); box-shadow: var(--glass-shadow), var(--glass-glow); color:var(--text-main); padding:10px 16px; border-radius:12px; font-size:11px; display:flex; gap:20px; flex-wrap:wrap; }
    .cm-fee-bar b { color:#fbbf24; }
    
    .cm-main-switcher { display:flex; gap:8px; justify-content:center; padding:0 0 16px 0; }
    .cm-sw-btn { padding:10px 20px; border-radius:12px; border:var(--glass-border); background:var(--bg-card); backdrop-filter: blur(12px) saturate(180%); -webkit-backdrop-filter: blur(12px) saturate(180%); color:var(--text-sub); font-weight:800; font-size:12px; cursor:pointer; transition: 0.2s; width:200px; text-align:center; box-shadow: var(--glass-shadow); }
    .cm-sw-btn.active { background:rgba(22, 163, 74, 0.8); color:#fff; border:1px solid rgba(255,255,255,0.4); box-shadow:0 8px 20px rgba(22,163,74,.4); }
    
    .cm-pane { display:none; flex:1; min-height:0; flex-direction:column; }
    .cm-pane.active { display:flex; }
    
    .cm-sec { flex:1; min-height:0; overflow:hidden; display:flex; flex-direction:column; background:var(--bg-sec); backdrop-filter: blur(16px) saturate(180%); -webkit-backdrop-filter: blur(16px) saturate(180%); border-radius:16px; box-shadow: var(--glass-shadow), var(--glass-glow); border:var(--glass-border); }
    .cm-shead { padding:12px 16px; border-bottom:1px solid var(--tbl-border); font-size:12px; font-weight:900; display:flex; justify-content:space-between; align-items:center; color:var(--text-main); background: rgba(255,255,255,0.05); flex-wrap:wrap; gap:8px; }
    .cm-shead-left { display:flex; align-items:center; gap:16px; flex:1; flex-wrap:wrap; }
    .cm-subtabs { display:flex; gap:4px; background:var(--switch-bg); padding:4px; border-radius:8px; border: 1px solid var(--tbl-border); }
    .cm-subtab { padding:6px 12px; border-radius:6px; border:none; background:transparent; font-size:10px; font-weight:800; cursor:pointer; color:var(--text-sub); }
    .cm-subtab.active { background:var(--bg-card); color:var(--text-main); box-shadow:0 1px 3px rgba(0,0,0,.1); }
    
    .cm-filters { display:none; gap:6px; align-items:center; flex-wrap:wrap; }
    .cm-filter-sel { height:28px; padding:0 8px; background:var(--input-bg); color:var(--text-main); border:1px solid var(--tbl-border); border-radius:6px; font-size:10px; font-weight:600; outline:none; cursor:pointer; }
    .cm-filter-inp { height:28px; padding:0 8px; background:var(--input-bg); color:var(--text-main); border:1px solid var(--tbl-border); border-radius:6px; font-size:10px; font-weight:600; outline:none; min-width:120px; }
    .cm-filter-btn { height:28px; padding:0 12px; border-radius:8px; font-size:10px; font-weight:800; cursor:pointer; color:#fff; transition:0.2s; }
    .cm-filter-btn:hover { transform: translateY(-1px); }
    .cm-btn-search { background:rgba(59, 130, 246, 0.7); border:1px solid rgba(59,130,246,0.8); box-shadow: 0 2px 6px rgba(59,130,246,.3), inset 0 1px 1px rgba(255,255,255,0.4); }
    .cm-btn-reset { background:rgba(107, 114, 128, 0.7); border:1px solid rgba(107,114,128,0.8); box-shadow: 0 2px 6px rgba(107,114,128,.3), inset 0 1px 1px rgba(255,255,255,0.4); }
    .cm-btn-excel { background:rgba(13, 148, 136, 0.7); border:1px solid rgba(13,148,136,0.8); box-shadow: 0 2px 6px rgba(13,148,136,.3), inset 0 1px 1px rgba(255,255,255,0.4); }
    
    .cm-subpane { display:none; flex:1; min-height:0; flex-direction:column; overflow:hidden; }
    .cm-subpane.active { display:flex; }
    
    .cm-tbl-area { flex:1; min-height:0; overflow:auto; padding:0 16px 14px; }
    table.cm-tbl { width:100%; border-collapse:collapse; font-size:11px; background: transparent; }
    table.cm-tbl.thin { table-layout:auto; white-space:normal; }
    table.cm-tbl.wide { min-width:2500px; white-space:nowrap; }
    
    table.cm-tbl thead { position: sticky; top: 0; z-index: 10; }
    table.cm-tbl th { background:var(--tbl-head-bg); backdrop-filter: blur(8px); padding:8px; font-size:9px; font-weight:900; color:var(--tbl-head-text); border: 1px solid var(--tbl-border); text-align:center; vertical-align:middle; }
    table.cm-tbl td { padding:6px 8px; border: 1px solid var(--tbl-border); font-weight:600; color:var(--text-main); font-size:10px; text-align:center; vertical-align:middle; background: transparent; }
    table.cm-tbl tbody tr:nth-child(even) { background:var(--tbl-row-even); }
    table.cm-tbl tbody tr:hover { background:var(--tbl-row-hover); }
    
    table.cm-tbl tbody tr.row-total { background:var(--tbl-head-bg) !important; font-weight:900; font-size:11px; position:sticky; bottom:0; backdrop-filter: blur(8px); }
    table.cm-tbl tbody tr.row-total td { border-top:2px solid #475569; color:var(--text-main); }
    
    .rp-flex { display:flex; justify-content:space-between; width:100%; align-items:center; }
    .rp-flex span:first-child { opacity:.6; font-weight:400; }
    .rp-flex span:last-child { font-weight:700; }
    
    .bg-baby-blue { background:rgba(219, 234, 254, 0.7) !important; color:#1c1e21; }
    .bg-lavender { background:rgba(243, 232, 255, 0.7) !important; color:#1c1e21; }
    .bg-cream { background:rgba(250, 247, 240, 0.7) !important; color:#1c1e21; }
    .bg-mint { background:rgba(209, 250, 229, 0.7) !important; color:#1c1e21; }
    .bg-grey { background:rgba(229, 231, 235, 0.7) !important; color:#1c1e21; }
    .bg-sage { background:rgba(215, 225, 216, 0.7) !important; color:#1c1e21; }
    .bg-butter-yellow { background:rgba(254, 249, 195, 0.7) !important; color:#1c1e21; }
    .bg-baby-pink { background:rgba(255, 228, 230, 0.7) !important; color:#1c1e21; }
    .bg-red { background:rgba(252, 165, 165, 0.7) !important; color:#1c1e21; }
    .bg-light-green { background:rgba(220, 252, 231, 0.7) !important; color:#1c1e21; }
    
    .dark .bg-baby-blue { background:rgba(30, 58, 138, 0.6) !important; color:#bfdbfe !important; }
    .dark .bg-lavender { background:rgba(76, 29, 149, 0.6) !important; color:#ddd6fe !important; }
    .dark .bg-cream { background:rgba(41, 37, 36, 0.6) !important; color:#d6d3d1 !important; }
    .dark .bg-mint { background:rgba(6, 95, 70, 0.6) !important; color:#a7f3d0 !important; }
    .dark .bg-grey { background:rgba(55, 65, 81, 0.6) !important; color:#d1d5db !important; }
    .dark .bg-sage { background:rgba(63, 79, 68, 0.6) !important; color:#d7e1d8 !important; }
    .dark .bg-butter-yellow { background:rgba(113, 63, 18, 0.6) !important; color:#fef08a !important; }
    .dark .bg-baby-pink { background:rgba(131, 24, 67, 0.6) !important; color:#fbcfe8 !important; }
    .dark .bg-red { background:rgba(127, 29, 29, 0.6) !important; color:#fecaca !important; }
    .dark .bg-light-green { background:rgba(20, 83, 45, 0.6) !important; color:#bbf7d0 !important; }
    
    .badge-depo { background:#dcfce7; color:#15803d; padding:2px 6px; border-radius:4px; font-weight:900; font-size:9px; }
    .badge-wd { background:#fee2e2; color:#b91c1c; padding:2px 6px; border-radius:4px; font-weight:900; font-size:9px; }
    .badge-in { background:#dcfce7; color:#15803d; padding:2px 6px; border-radius:4px; font-weight:900; font-size:9px; }
    .badge-out { background:#fee2e2; color:#b91c1c; padding:2px 6px; border-radius:4px; font-weight:900; font-size:9px; }
    
    .gs-modal-bg { display:none; position:fixed; inset:0; background:rgba(0,0,0,.5); backdrop-filter: blur(4px); z-index:2147483648; align-items:center; justify-content:center; }
    .gs-modal-bg.show { display:flex; }
    .gs-modal { background:var(--modal-bg); backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%); border-radius:16px; padding:24px; width:480px; box-shadow:0 8px 40px rgba(0,0,0,.2); border:var(--glass-border); }
    .gs-modal h3 { font-size:14px; font-weight:900; margin:0 0 4px; color:var(--text-main); }
    .gs-modal p { font-size:11px; color:var(--text-sub); margin:0 0 16px; }
    .gs-inp { width:100%; height:36px; padding:0 12px; border:1.5px solid var(--tbl-border); border-radius:8px; font-size:12px; outline:none; font-family:monospace; margin-bottom:8px; background:var(--input-bg); color:var(--text-main); }
    .gs-btns { display:flex; gap:8px; margin-top:16px; justify-content:flex-end; }
  `;
  document.head.appendChild(st);

  const ui = document.createElement('div');
  ui.id = ID;
  
  if (localStorage.getItem('cm-theme') === 'dark') ui.classList.add('dark');
  
  function getLocalYMD(dateObj) {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  const _t = getLocalYMD(new Date());
  
  let _gsUrl = localStorage.getItem('cm-gs-url') || '';
  let _gsPanel = localStorage.getItem('cm-gs-panel') || '';
  const gsBtnTxt = _gsUrl ? '✓ LINKED' : 'LINK GSHEET';
  const themeIcon = ui.classList.contains('dark') ? '☀️' : '🌙';

  ui.innerHTML = `
    <div class="cm-top">
      <div class="cm-logo">
        <span class="zap">⚡</span>
        <span class="cm-shine-text">CASH MARKET</span>
        <em>UNIVERSAL</em>
      </div>
      <div class="cm-dbar">
        <button class="cm-qb act" onclick="setDateRange('today')">HARI INI</button>
        <button class="cm-qb" onclick="setDateRange('yesterday')">KEMARIN</button>
        <button class="cm-qb" onclick="setDateRange('thisMonth')">BULAN INI</button>
        <select id="cm-month-sel" class="cm-dinp" style="cursor:pointer;" onchange="setDateRange('month', this.value)"></select>
        <label style="color:#fff; font-size:11px;">Dari:</label>
        <input type="date" id="cm-start" class="cm-dinp" value="${_t}">
        <label style="color:#fff; font-size:11px;">Sampai:</label>
        <input type="date" id="cm-end" class="cm-dinp" value="${_t}">
        <button class="cm-btn-glass cm-btn-blue" id="cm-load">🚀 TARIK DATA</button>
        
        <div class="cm-auto-wrap">
          <span class="cm-auto-label">AUTO</span>
          <select id="cm-auto-sel" class="cm-auto-sel">
            <option value="0" selected>Off</option>
            <option value="60">1 Menit</option>
            <option value="300">5 Menit</option>
            <option value="900">15 Menit</option>
            <option value="1800">30 Menit</option>
            <option value="3600">1 Jam</option>
            <option value="custom">Custom</option>
          </select>
          <input type="number" id="cm-auto-custom" class="cm-auto-custom" placeholder="Mnt" min="1">
          <button class="cm-auto-btn" id="cm-auto-btn" onclick="toggleAuto()">START</button>
        </div>
      </div>
      
      <div class="cm-tabs-right">
        <button class="cm-btn-glass cm-btn-grey" onclick="openGSModal()">${gsBtnTxt}</button>
        <button class="cm-btn-glass cm-btn-green" onclick="exportToSheet(false)">EXPORT</button>
        <button class="cm-theme-btn" onclick="toggleTheme()">${themeIcon}</button>
        <button class="cm-btn-glass cm-btn-red" onclick="document.getElementById('${ID}').remove()">EXIT</button>
      </div>
    </div>
    
    <div class="cm-sbar" id="cm-status">Siap. Pilih periode lalu klik TARIK DATA.</div>
    
    <div class="cm-content">
      <div class="cm-main-switcher">
        <button class="cm-sw-btn active" onclick="switchMainTab('tunai')">TRANSAKSI TUNAI</button>
        <button class="cm-sw-btn" onclick="switchMainTab('cb')">CREDIT BALANCE</button>
      </div>
      
      <div id="pane-tunai" class="cm-pane active">
        <div class="cm-cards-area">
          <div class="cm-cards">
            <div class="cm-card" style="--accent-color:#10b981">
              <div class="cm-clbl">TOTAL DEPOSIT</div>
              <div class="cm-card-flex">
                <div class="cm-cval" id="cm-card-depo" style="color:#10b981">Rp 0</div>
                <div class="cm-csub" id="cm-card-depo-tkt">0 Tiket</div>
              </div>
            </div>
            <div class="cm-card" style="--accent-color:#ef4444">
              <div class="cm-clbl">TOTAL WITHDRAW</div>
              <div class="cm-card-flex">
                <div class="cm-cval" id="cm-card-wd" style="color:#ef4444">Rp 0</div>
                <div class="cm-csub" id="cm-card-wd-tkt">0 Tiket</div>
              </div>
            </div>
            <div class="cm-card" style="--accent-color:#3b82f6">
              <div class="cm-clbl">PROFIT KOTOR</div>
              <div class="cm-card-flex">
                <div class="cm-cval" id="cm-card-profit-kotor" style="color:#3b82f6">Rp 0</div>
                <div class="cm-csub">Sebelum Fee</div>
              </div>
            </div>
            <div class="cm-card" style="--accent-color:#16a34a">
              <div class="cm-clbl">PROFIT BERSIH</div>
              <div class="cm-card-flex">
                <div class="cm-cval" id="cm-card-profit-bersih" style="color:#16a34a">Rp 0</div>
                <div class="cm-csub">Setelah Fee</div>
              </div>
            </div>
            <div class="cm-card" style="--accent-color:#06b6d4">
              <div class="cm-clbl">QR KOTOR</div>
              <div class="cm-cval" id="cm-card-qr-kotor" style="color:#06b6d4">Rp 0</div>
              <div class="cm-csub-inline" id="cm-card-qr-kotor-sub">-</div>
            </div>
            <div class="cm-card" style="--accent-color:#0891b2">
              <div class="cm-clbl">QR BERSIH</div>
              <div class="cm-cval" id="cm-card-qr-bersih" style="color:#0891b2">Rp 0</div>
              <div class="cm-csub-inline" id="cm-card-qr-bersih-sub">-</div>
            </div>
            <div class="cm-card" style="--accent-color:#8b5cf6">
              <div class="cm-clbl">DEPOSIT NON QRIS</div>
              <div class="cm-cval" id="cm-card-depo-nonqr" style="color:#8b5cf6">Rp 0</div>
            </div>
            <div class="cm-card" style="--accent-color:#f97316">
              <div class="cm-clbl">WD NON QRIS</div>
              <div class="cm-cval" id="cm-card-wd-nonqr" style="color:#f97316">Rp 0</div>
            </div>
          </div>
          <div class="cm-fee-bar" id="cm-fee-bar">RINCIAN FEE QRIS: <span id="cm-fee-details">Belum ada data</span></div>
        </div>
        
        <div class="cm-sec">
          <div class="cm-shead">
            <div class="cm-shead-left">
              <div style="white-space:nowrap;">📋 REKAPITULASI TUNAI</div>
              <div class="cm-filters" id="tunai-filters">
                <select id="filter-tipe" class="cm-filter-sel">
                  <option value="">Semua Tipe</option>
                  <option value="Deposit">Deposit</option>
                  <option value="Withdraw">Withdraw</option>
                </select>
                <input type="text" id="filter-user" class="cm-filter-inp" placeholder="Cari Username...">
                <select id="filter-handler" class="cm-filter-sel">
                  <option value="">Semua Handler</option>
                </select>
                <select id="filter-ket" class="cm-filter-sel">
                  <option value="">Semua Keterangan</option>
                </select>
                <button class="cm-filter-btn cm-btn-search" onclick="renderTunaiHistory()">🔍 SEARCH</button>
                <button class="cm-filter-btn cm-btn-reset" onclick="resetFilters('tunai')">↺ RESET</button>
                <button class="cm-filter-btn cm-btn-excel" onclick="exportTableToCSV('cm-table-tunai-history', 'History_Tunai.csv')">📊 EXCEL</button>
              </div>
            </div>
            <div class="cm-subtabs">
              <button class="cm-subtab active" onclick="switchSubTab('tunai-rekap')">REKAP HARIAN</button>
              <button class="cm-subtab" onclick="switchSubTab('tunai-history')">HISTORY TRANSAKSI</button>
            </div>
          </div>
          <div class="cm-subpane active" id="subpane-tunai-rekap">
            <div class="cm-tbl-area">
              <table class="cm-tbl wide">
                <thead>
                  <tr>
                    <th rowspan="2">TANGGAL</th>
                    <th colspan="2" class="bg-baby-blue">QRIS OPA (DEPO)</th>
                    <th colspan="2" class="bg-baby-blue">QRIS OPT (DEPO)</th>
                    <th colspan="2" class="bg-baby-blue">QRIS OPZ (DEPO)</th>
                    <th colspan="2" class="bg-baby-blue">QRIS GPP (DEPO)</th>
                    <th colspan="2" class="bg-baby-blue">QRIS PEN (DEPO)</th>
                    <th rowspan="2" class="bg-lavender">TOTAL DP QR KOTOR</th>
                    <th rowspan="2" class="bg-cream">TOTAL DP QR BERSIH</th>
                    <th colspan="2" class="bg-mint">DP NON QR</th>
                    <th rowspan="2" class="bg-grey">TOTAL TK DEPO</th>
                    <th rowspan="2" class="bg-sage">TOTAL DEPO ALL</th>
                    
                    <th colspan="2" class="bg-butter-yellow">QRIS OPA (WD)</th>
                    <th colspan="2" class="bg-butter-yellow">QRIS OPT (WD)</th>
                    <th colspan="2" class="bg-butter-yellow">QRIS OPZ (WD)</th>
                    <th colspan="2" class="bg-butter-yellow">QRIS GPP (WD)</th>
                    <th colspan="2" class="bg-butter-yellow">QRIS PEN (WD)</th>
                    <th rowspan="2" class="bg-lavender">TOTAL WD QR KOTOR</th>
                    <th rowspan="2" class="bg-cream">TOTAL WD QR BERSIH</th>
                    <th colspan="2" class="bg-mint">WD NON QR</th>
                    <th rowspan="2" class="bg-grey">TOTAL TK WD</th>
                    <th rowspan="2" class="bg-baby-pink">TOTAL WD ALL</th>
                    
                    <th rowspan="2" class="bg-red">AGENT FEE</th>
                    <th rowspan="2" class="bg-sage">PROFIT KOTOR</th>
                    <th rowspan="2" class="bg-mint">PROFIT BERSIH</th>
                  </tr>
                  <tr>
                    <th class="bg-baby-blue">TK</th><th class="bg-baby-blue">NOMINAL</th>
                    <th class="bg-baby-blue">TK</th><th class="bg-baby-blue">NOMINAL</th>
                    <th class="bg-baby-blue">TK</th><th class="bg-baby-blue">NOMINAL</th>
                    <th class="bg-baby-blue">TK</th><th class="bg-baby-blue">NOMINAL</th>
                    <th class="bg-baby-blue">TK</th><th class="bg-baby-blue">NOMINAL</th>
                    <th class="bg-mint">TK</th><th class="bg-mint">NOMINAL</th>
                    
                    <th class="bg-butter-yellow">TK</th><th class="bg-butter-yellow">NOMINAL</th>
                    <th class="bg-butter-yellow">TK</th><th class="bg-butter-yellow">NOMINAL</th>
                    <th class="bg-butter-yellow">TK</th><th class="bg-butter-yellow">NOMINAL</th>
                    <th class="bg-butter-yellow">TK</th><th class="bg-butter-yellow">NOMINAL</th>
                    <th class="bg-butter-yellow">TK</th><th class="bg-butter-yellow">NOMINAL</th>
                    <th class="bg-mint">TK</th><th class="bg-mint">NOMINAL</th>
                  </tr>
                </thead>
                <tbody id="cm-table-tunai-rekap"><tr><td colspan="36" style="text-align:center; color:#aaa; padding:20px;">Data belum dimuat.</td></tr></tbody>
              </table>
            </div>
          </div>
          <div class="cm-subpane" id="subpane-tunai-history">
            <div class="cm-tbl-area">
              <table class="cm-tbl thin">
                <thead><tr><th>WAKTU</th><th>TIPE</th><th>USERNAME</th><th>MASUK</th><th>KELUAR</th><th>FEE</th><th>NETT</th><th>BANK</th><th>NAMA REK</th><th>HANDLER</th><th>KETERANGAN</th><th>STATUS</th></tr></thead>
                <tbody id="cm-table-tunai-history"><tr><td colspan="12" style="text-align:center; color:#aaa; padding:20px;">Data belum dimuat.</td></tr></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div id="pane-cb" class="cm-pane">
        <div class="cm-cards-area">
          <div class="cm-cards">
            <div class="cm-card" style="--accent-color:#3b82f6"><div class="cm-clbl">SALDO AWAL</div><div class="cm-cval" id="cm-card-cb-start" style="color:#3b82f6">Rp 0</div></div>
            <div class="cm-card" style="--accent-color:#8b5cf6"><div class="cm-clbl">SALDO AKHIR</div><div class="cm-cval" id="cm-card-cb-end" style="color:#8b5cf6">Rp 0</div></div>
            <div class="cm-card" style="--accent-color:#10b981"><div class="cm-clbl">TOTAL MASUK</div><div class="cm-cval" id="cm-card-cb-in" style="color:#10b981">Rp 0</div></div>
            <div class="cm-card" style="--accent-color:#ef4444"><div class="cm-clbl">TOTAL KELUAR</div><div class="cm-cval" id="cm-card-cb-out" style="color:#ef4444">Rp 0</div></div>
          </div>
        </div>
        <div class="cm-sec">
          <div class="cm-shead">
            <div class="cm-shead-left">
              <div style="white-space:nowrap;">💳 MUTASI CREDIT BALANCE</div>
              <div class="cm-filters" id="cb-filters">
                <select id="filter-module" class="cm-filter-sel">
                  <option value="">Semua Module</option>
                </select>
                <button class="cm-filter-btn cm-btn-search" onclick="renderCBHistory()">🔍 SEARCH</button>
                <button class="cm-filter-btn cm-btn-reset" onclick="resetFilters('cb')">↺ RESET</button>
                <button class="cm-filter-btn cm-btn-excel" onclick="exportTableToCSV('cm-table-cb-history', 'History_CB.csv')">📊 EXCEL</button>
              </div>
            </div>
            <div class="cm-subtabs">
              <button class="cm-subtab active" onclick="switchSubTab('cb-rekap')">REKAP HARIAN</button>
              <button class="cm-subtab" onclick="switchSubTab('cb-history')">HISTORY TRANSAKSI</button>
            </div>
          </div>
          <div class="cm-subpane active" id="subpane-cb-rekap">
            <div class="cm-tbl-area">
              <table class="cm-tbl wide">
                <thead>
                  <tr>
                    <th rowspan="2" class="bg-grey">TANGGAL</th>
                    <th rowspan="2" class="bg-grey">SALDO AWAL</th>
                    <th colspan="8" class="bg-baby-pink">CREDIT KELUAR (OUT)</th>
                    <th rowspan="2" class="bg-baby-pink">TOTAL KELUAR</th>
                    <th colspan="4" class="bg-light-green">CREDIT MASUK (IN)</th>
                    <th rowspan="2" class="bg-light-green">TOTAL MASUK</th>
                    <th rowspan="2" class="bg-grey">SALDO AKHIR</th>
                  </tr>
                  <tr>
                    <th class="bg-baby-pink">DEPOSIT</th><th class="bg-baby-pink">MANUAL DEP</th><th class="bg-baby-pink">PROVIDER WD</th><th class="bg-baby-pink">DEDUCT CRED</th>
                    <th class="bg-baby-pink">BONUS CLAIM</th><th class="bg-baby-pink">BONUS TRANS</th><th class="bg-baby-pink">REBATE</th><th class="bg-baby-pink">BONUS DEP</th>
                    <th class="bg-light-green">WITHDRAW</th><th class="bg-light-green">ADD CREDIT</th><th class="bg-light-green">MANUAL WD</th><th class="bg-light-green">PROVIDER DEP</th>
                  </tr>
                </thead>
                <tbody id="cm-table-cb-rekap"><tr><td colspan="18" style="text-align:center; color:#aaa; padding:20px;">Data belum dimuat.</td></tr></tbody>
              </table>
            </div>
          </div>
          <div class="cm-subpane" id="subpane-cb-history">
            <div class="cm-tbl-area">
              <table class="cm-tbl thin">
                <thead><tr><th>WAKTU</th><th>MODULE</th><th>USERNAME</th><th>INFO</th><th>START</th><th>IN</th><th>OUT</th><th>END</th></tr></thead>
                <tbody id="cm-table-cb-history"><tr><td colspan="8" style="text-align:center; color:#aaa; padding:20px;">Data belum dimuat.</td></tr></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="gs-modal-bg" id="gs-modal-bg" onclick="if(event.target===this)closeGSModal()">
      <div class="gs-modal">
        <h3>🔗 Setup Google Sheets</h3>
        <p>Paste URL Google Apps Script Web App deployment:</p>
        <input class="gs-inp" id="gs-url-inp" placeholder="https://script.google.com/macros/s/.../exec" value="${_gsUrl}">
        <p style="margin-top:12px; margin-bottom:4px;">Nama Panel / Operator:</p>
        <input class="gs-inp" id="gs-panel-inp" placeholder="Contoh: Budi / Sinta / dll" value="${_gsPanel}" style="font-family:sans-serif;">
        <div class="gs-btns">
          <button class="cm-btn-glass cm-btn-grey" onclick="closeGSModal()">Batal</button>
          <button class="cm-btn-glass cm-btn-green" onclick="saveGSUrl()">Simpan</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(ui);

  (function() {
    const sel = document.getElementById('cm-month-sel');
    const now = new Date(), curY = now.getFullYear(), curM = now.getMonth();
    let opts = '<option value="">-- BULAN --</option>';
    for (let y = curY; y >= 2026; y--) {
      const maxM = (y === curY) ? curM : 11;
      for (let m = maxM; m >= 0; m--) {
        const val = y + '-' + String(m + 1).padStart(2, '0');
        const text = new Date(y, m, 1).toLocaleString('id-ID', { month: 'long' }) + ' ' + y;
        opts += `<option value="${val}">${text.toUpperCase()}</option>`;
      }
    }
    sel.innerHTML = opts;

    document.getElementById('cm-auto-sel').onchange = function() {
      document.getElementById('cm-auto-custom').style.display = (this.value === 'custom') ? 'block' : 'none';
    };
  })();

  let _allTrx = []; let _cbRawList = []; let _dailyTunai = {}; let _dailyCB = {};
  let _autoTimer = null; 
  let _lastSummary = { tktDepo:0, depo:0, tktWd:0, wd:0, pKotor:0, pBersih:0, saldoAkhir:0 };
  
  const cbOutMods = ["Deposit", "Manual Deposit", "Provider Withdraw", "Deduct Credit", "Bonus Claim", "Bonus Transfer", "Rebate", "Bonus Deposit"];
  const cbInMods = ["Withdraw", "Add Credit", "Manual Withdraw", "Provider Deposit"];

  function toDDMM(ymd) { const [y, m, d] = ymd.split('-'); return `${d}-${m}-${y}`; }
  
  function formatRupiahPlain(angka) { 
    if (angka === 0 || isNaN(angka)) return 'Rp 0';
    const neg = angka < 0;
    const abs = Math.abs(Math.round(angka));
    return (neg ? '-Rp ' : 'Rp ') + abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  function formatRupiahTable(angka) { 
    if (angka === 0 || isNaN(angka)) return '<span style="color:#cbd5e1; display:block; text-align:center;">-</span>';
    const neg = angka < 0;
    const abs = Math.abs(Math.round(angka));
    const str = abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `<div class="rp-flex"><span>Rp</span><span>${neg ? '-' : ''}${str}</span></div>`;
  }
  function formatTK(val) { return val > 0 ? val : '<span style="color:#cbd5e1;">-</span>'; }
  function parseTrxTime(dateStr) { if (!dateStr || dateStr === '-') return new Date(0); const [d, m, y] = dateStr.split(' ')[0].split('-'); const t = dateStr.split(' ')[1] || '00:00:00'; return new Date(`${y}-${m}-${d}T${t}`); }
  
  window.toggleTheme = () => {
    const el = document.getElementById(ID);
    const btn = document.querySelector('.cm-theme-btn');
    el.classList.toggle('dark');
    if (el.classList.contains('dark')) {
      localStorage.setItem('cm-theme', 'dark');
      btn.innerText = '☀️';
    } else {
      localStorage.setItem('cm-theme', 'light');
      btn.innerText = '🌙';
    }
  };

  window.setDateRange = (type, val) => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    document.querySelectorAll('.cm-qb').forEach(b => b.classList.remove('act'));
    document.getElementById('cm-month-sel').value = "";
    if (type === 'today') {
      document.querySelector('.cm-qb[onclick="setDateRange(\'today\')"]').classList.add('act');
      const t = getLocalYMD(today); document.getElementById('cm-start').value = t; document.getElementById('cm-end').value = t;
    } else if (type === 'yesterday') {
      document.querySelector('.cm-qb[onclick="setDateRange(\'yesterday\')"]').classList.add('act');
      const yDay = new Date(today); yDay.setDate(today.getDate() - 1); const t = getLocalYMD(yDay);
      document.getElementById('cm-start').value = t; document.getElementById('cm-end').value = t;
    } else if (type === 'thisMonth') {
      document.querySelector('.cm-qb[onclick="setDateRange(\'thisMonth\')"]').classList.add('act');
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      document.getElementById('cm-start').value = getLocalYMD(firstDay); document.getElementById('cm-end').value = getLocalYMD(today);
    } else if (type === 'month' && val) {
      const [y, m] = val.split('-').map(Number);
      document.getElementById('cm-start').value = getLocalYMD(new Date(y, m - 1, 1)); document.getElementById('cm-end').value = getLocalYMD(new Date(y, m, 0));
    }
  };

  window.switchMainTab = (tab) => {
    document.querySelectorAll('.cm-sw-btn').forEach(e => e.classList.remove('active'));
    document.querySelectorAll('.cm-pane').forEach(e => e.classList.remove('active'));
    if(tab === 'tunai') { 
      document.querySelector('.cm-sw-btn[onclick="switchMainTab(\'tunai\')"]').classList.add('active'); 
      document.getElementById('pane-tunai').classList.add('active');
      switchSubTab('tunai-rekap');
    } else {
      document.querySelector('.cm-sw-btn[onclick="switchMainTab(\'cb\')"]').classList.add('active'); 
      document.getElementById('pane-cb').classList.add('active');
      switchSubTab('cb-rekap');
    }
  };

  window.switchSubTab = (sub) => {
    document.querySelectorAll('.cm-subtab').forEach(e => e.classList.remove('active'));
    document.querySelectorAll('.cm-subpane').forEach(e => e.classList.remove('active'));
    let btn = document.querySelector(`.cm-subtab[onclick="switchSubTab('${sub}')"]`);
    let pane = document.getElementById(`subpane-${sub}`);
    if(btn && pane) {
      btn.classList.add('active');
      pane.classList.add('active');
    }
    
    let tunaiFilters = document.getElementById('tunai-filters');
    let cbFilters = document.getElementById('cb-filters');
    if(tunaiFilters) tunaiFilters.style.display = (sub === 'tunai-history') ? 'flex' : 'none';
    if(cbFilters) cbFilters.style.display = (sub === 'cb-history') ? 'flex' : 'none';
  };

  window.openGSModal = () => { 
    document.getElementById('gs-url-inp').value = _gsUrl; 
    document.getElementById('gs-panel-inp').value = _gsPanel; 
    document.getElementById('gs-modal-bg').classList.add('show'); 
  };
  window.closeGSModal = () => { document.getElementById('gs-modal-bg').classList.remove('show'); };
  window.saveGSUrl = () => {
    _gsUrl = document.getElementById('gs-url-inp').value.trim();
    _gsPanel = document.getElementById('gs-panel-inp').value.trim();
    localStorage.setItem('cm-gs-url', _gsUrl);
    localStorage.setItem('cm-gs-panel', _gsPanel);
    document.querySelector('.cm-btn-glass.cm-btn-grey').innerText = _gsUrl ? '✓ LINKED' : 'LINK GSHEET';
    closeGSModal();
  };

  window.toggleAuto = () => {
    const btn = document.getElementById('cm-auto-btn');
    const sel = document.getElementById('cm-auto-sel');
    let secs = 0;
    if (sel.value === 'custom') {
      const mnt = parseInt(document.getElementById('cm-auto-custom').value) || 0;
      secs = mnt * 60;
    } else {
      secs = parseInt(sel.value);
    }
    
    if (_autoTimer) {
      clearInterval(_autoTimer);
      _autoTimer = null;
      btn.innerText = 'START';
      btn.classList.remove('active');
      document.getElementById('cm-status').innerHTML += ' | <b>Auto Sync Dihentikan</b>';
    } else {
      if (secs === 0) { alert('Pilih interval atau masukkan menit dulu!'); return; }
      btn.innerText = 'STOP';
      btn.classList.add('active');
      runLoadAndExport(true);
      _autoTimer = setInterval(() => runLoadAndExport(true), secs * 1000);
    }
  };

  async function runLoadAndExport(isAuto) {
    document.getElementById('cm-status').innerHTML = `🔄 <b>Auto Sync:</b> Tarik data & Export...`;
    const success = await loadData();
    if (success) {
      await exportToSheet(isAuto);
    }
  }

  window.exportToSheet = async (isAuto) => {
    if (!_gsUrl) { alert('Setup Link Google Sheets dulu!'); return; }
    if (Object.keys(_dailyTunai).length === 0 && Object.keys(_dailyCB).length === 0) {
      if (!isAuto) alert('Data masih kosong! Klik TARIK DATA dulu sebelum EXPORT.');
      return;
    }

    const btn = document.querySelector('.cm-btn-green'); 
    const originalText = btn.innerText;
    btn.innerText = '⏳ Sending...'; 
    btn.disabled = true;
    const statusEl = document.getElementById('cm-status');
    statusEl.innerHTML = '⏳ <b>Exporting...</b> Mengirim data ke Google Sheets...';

    let tunaiRows = [];
    Object.keys(_dailyTunai).sort().forEach(day => {
      let d = _dailyTunai[day];
      let dp = d.depo, wd = d.wd;
      let totalAgentFee = dp.totalQrFee + wd.totalQrFee;
      let pKotor = dp.totalGross - wd.totalGross;
      let pBersih = (dp.totalQrNett + dp.nonQr.v) - (wd.totalQrNett + wd.nonQr.v);
      
      tunaiRows.push([
        day,
        dp.qris.OPA ? dp.qris.OPA.c : 0, dp.qris.OPA ? dp.qris.OPA.v : 0,
        dp.qris.OPT ? dp.qris.OPT.c : 0, dp.qris.OPT ? dp.qris.OPT.v : 0,
        dp.qris.OPZ ? dp.qris.OPZ.c : 0, dp.qris.OPZ ? dp.qris.OPZ.v : 0,
        dp.qris.GPP ? dp.qris.GPP.c : 0, dp.qris.GPP ? dp.qris.GPP.v : 0,
        dp.qris.PEN ? dp.qris.PEN.c : 0, dp.qris.PEN ? dp.qris.PEN.v : 0,
        dp.totalQrGross, dp.totalQrNett,
        dp.nonQr.c, dp.nonQr.v,
        dp.totalTkt, dp.totalGross,
        wd.qris.OPA ? wd.qris.OPA.c : 0, wd.qris.OPA ? wd.qris.OPA.v : 0,
        wd.qris.OPT ? wd.qris.OPT.c : 0, wd.qris.OPT ? wd.qris.OPT.v : 0,
        wd.qris.OPZ ? wd.qris.OPZ.c : 0, wd.qris.OPZ ? wd.qris.OPZ.v : 0,
        wd.qris.GPP ? wd.qris.GPP.c : 0, wd.qris.GPP ? wd.qris.GPP.v : 0,
        wd.qris.PEN ? wd.qris.PEN.c : 0, wd.qris.PEN ? wd.qris.PEN.v : 0,
        wd.totalQrGross, wd.totalQrNett,
        wd.nonQr.c, wd.nonQr.v,
        wd.totalTkt, wd.totalGross,
        totalAgentFee, pKotor, pBersih
      ]);
    });

    let cbRows = [];
    Object.keys(_dailyCB).sort().forEach(day => {
      let d = _dailyCB[day];
      let totOut = Object.values(d.out).reduce((a,b) => a+b, 0);
      let totIn = Object.values(d.in).reduce((a,b) => a+b, 0);
      cbRows.push([
        day, d.start,
        d.out['Deposit']||0, d.out['Manual Deposit']||0, d.out['Provider Withdraw']||0, d.out['Deduct Credit']||0,
        d.out['Bonus Claim']||0, d.out['Bonus Transfer']||0, d.out['Rebate']||0, d.out['Bonus Deposit']||0,
        totOut, 
        d.in['Withdraw']||0, d.in['Add Credit']||0, d.in['Manual Withdraw']||0, d.in['Provider Deposit']||0,
        totIn, d.end
      ]);
    });

    const logData = {
      syncAt: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
      panel: _gsPanel || 'Unknown',
      dateFrom: document.getElementById('cm-start').value,
      dateTo: document.getElementById('cm-end').value,
      tktDepo: _lastSummary.tktDepo,
      totalDepo: _lastSummary.depo,
      tktWd: _lastSummary.tktWd,
      totalWd: _lastSummary.wd,
      profitKotor: _lastSummary.pKotor,
      profitBersih: _lastSummary.pBersih,
      saldoAkhir: _lastSummary.saldoAkhir
    };

    const payload = { tunaiRows, cbRows, logData, exportedAt: new Date().toISOString() };
    
    try {
      await fetch(_gsUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      setTimeout(() => { 
        btn.innerText = '✓ SENT!'; 
        statusEl.innerHTML = `✅ <b>Export Berhasil!</b> Panel: ${_gsPanel} | ${isAuto ? 'Auto' : 'Manual'} Export selesai.`;
      }, 1000);
      
    } catch (e) {
      statusEl.innerHTML = '❌ <b>Export Gagal:</b> ' + e.message;
      console.error('Export Error:', e);
    } finally {
      setTimeout(() => { 
        btn.innerText = originalText; 
        btn.disabled = false; 
      }, 4000);
    }
  };

  window.exportTableToCSV = (tableId, filename) => {
    const table = document.getElementById(tableId);
    if (!table) return alert('Tabel tidak ditemukan!');
    
    let csv = [];
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      const cols = row.querySelectorAll('td, th');
      let rowData = [];
      cols.forEach(col => {
        let text = col.innerText.replace(/\n/g, ' ').replace(/"/g, '""');
        if (text.includes('Rp')) {
          text = text.replace(/Rp/g, '').replace(/\./g, '').trim();
          if (text.includes('-')) text = '-' + text.replace('-', '').trim();
        }
        rowData.push(`"${text}"`);
      });
      csv.push(rowData.join(','));
    });
    
    const csvString = csv.join('\n');
    const blob = new Blob(["\ufeff" + csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  window.resetFilters = (type) => {
    if (type === 'tunai') {
      document.getElementById('filter-tipe').value = '';
      document.getElementById('filter-user').value = '';
      document.getElementById('filter-handler').value = '';
      document.getElementById('filter-ket').value = '';
      renderTunaiHistory();
    } else if (type === 'cb') {
      document.getElementById('filter-module').value = '';
      renderCBHistory();
    }
  };

  function getPayloadTrx(type, startVal, endVal, page) {
    let p = { "idusBr": 224326595, "startdate": toDDMM(startVal), "enddate": toDDMM(endVal), "level": 5, "usernameBr": "egaxbets@xbets988", "page": page, "limit": 500, "type": type, "bo": true, "st": "10" };
    if(type === "1001") p.mbids = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","16","49","50","82","83","115","148","149","150","151","152","153","181","10986","10992","10003","10990","10004","10997","10013","11001","11003","11121","10988","11005","10002","10656","11642","11873","12088","11319","10568","12221","12334","10816","11135","10012","10974","11646","11316","11994"];
    return p;
  }
  async function fetchTrx(type, startVal, endVal, label) {
    let allData = []; let page = 1; const limit = 500;
    while(true) {
      document.getElementById('cm-status').innerHTML = `⏳ <b>Loading ${label}...</b> Page ${page}`;
      const r = await fetch('/trx/historypl', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }, body: JSON.stringify(getPayloadTrx(type, startVal, endVal, page)) }); 
      const json = await r.json();
      let batch = json.trx || [];
      allData = allData.concat(batch);
      if (batch.length < limit) break; 
      page++;
    }
    return { trx: allData };
  }
  
  async function fetchCB(startVal, endVal) {
    let allData = []; let page = 1; const limit = 500;
    while(true) {
      document.getElementById('cm-status').innerHTML = `⏳ <b>Loading Credit Balance...</b> Page ${page}`;
      const r = await fetch('/chbalhsls', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }, body: JSON.stringify({"startdate": toDDMM(startVal), "enddate": toDDMM(endVal), "limit": limit, "page": page, "type": "100"}) });
      const text = await r.text(); let json; try { json = JSON.parse(text); } catch (e) { throw new Error("Server CB Error"); }
      let batch = json.cblhs || [];
      allData = allData.concat(batch);
      if (batch.length < limit) break;
      page++;
    }
    return { cblhs: allData };
  }

  async function loadData() {
    const startVal = document.getElementById('cm-start').value;
    const endVal = document.getElementById('cm-end').value;
    const statusEl = document.getElementById('cm-status');

    if (!startVal || !endVal) { alert('Pilih tanggal!'); return false; }
    statusEl.innerHTML = '⏳ <b>Loading...</b> Mengambil data...';
    
    try {
      const [depoJson, wdJson] = await Promise.all([ fetchTrx("1001", startVal, endVal, "Deposit"), fetchTrx("1002", startVal, endVal, "Withdraw") ]);
      let cbJson = null;
      try { cbJson = await fetchCB(startVal, endVal); } catch (cbErr) { statusEl.innerHTML = `⚠️ <b>Depo & WD loaded, tapi CB Error</b>`; }

      let listDepo = depoJson.trx || [];
      let listWd = wdJson.trx || [];
      let listCb = cbJson ? (cbJson.cblhs || []) : [];

      _allTrx = []; _dailyTunai = {}; _dailyCB = {}; _cbRawList = listCb;
      const parseHandler = (raw) => { if(!raw) return '-'; let h = raw.includes('@') ? raw.split('@')[0] : raw; return h.toLowerCase() === 'xbets988' ? 'SISTEM' : h; };
      
      let totalDepoGross = 0, totalWdGross = 0, totalDepoFee = 0, totalWdFee = 0;
      let qrKotor = 0, qrBersih = 0, depoNonQris = 0, wdNonQris = 0;
      let qrKotorDetails = {}, qrBersihDetails = {}, feeDetails = {};

      const initDayObj = () => ({
        depo: { qris: { OPA:{c:0,v:0}, OPT:{c:0,v:0}, OPZ:{c:0,v:0}, GPP:{c:0,v:0}, PEN:{c:0,v:0} }, nonQr: {c:0, v:0}, totalQrGross: 0, totalQrNett: 0, totalQrFee: 0, totalGross: 0, totalTkt: 0 },
        wd: { qris: { OPA:{c:0,v:0}, OPT:{c:0,v:0}, OPZ:{c:0,v:0}, GPP:{c:0,v:0}, PEN:{c:0,v:0} }, nonQr: {c:0, v:0}, totalQrGross: 0, totalQrNett: 0, totalQrFee: 0, totalGross: 0, totalTkt: 0 }
      });

      let totTunai = initDayObj(); 
      let totTunaiAgentFee = 0, totTunaiPK = 0, totTunaiPB = 0;

      listDepo.forEach(item => {
        let nominal = parseFloat(item.amt) * 1000; 
        let isQris = item.cmb && item.cmb.bank && item.cmb.bank.name.toLowerCase() === 'qris';
        let qrisType = isQris ? (item.cmb.accno || 'QRIS').toUpperCase() : null;
        let fee = isQris ? Math.round(nominal * 0.011) : 0;
        let nett = nominal - fee;
        totalDepoGross += nominal; totalDepoFee += fee;
        
        let day = item.prctm.split(' ')[0];
        if(!_dailyTunai[day]) _dailyTunai[day] = initDayObj();
        let d = _dailyTunai[day];
        
        d.depo.totalGross += nominal; d.depo.totalTkt++; 
        totTunai.depo.totalGross += nominal; totTunai.depo.totalTkt++;
        
        if (isQris) {
          qrKotor += nominal; qrBersih += nett; 
          d.depo.totalQrGross += nominal; d.depo.totalQrNett += nett; d.depo.totalQrFee += fee;
          totTunai.depo.totalQrGross += nominal; totTunai.depo.totalQrNett += nett; totTunai.depo.totalQrFee += fee;
          
          qrKotorDetails[qrisType] = (qrKotorDetails[qrisType] || 0) + nominal;
          qrBersihDetails[qrisType] = (qrBersihDetails[qrisType] || 0) + nett;
          feeDetails[qrisType] = (feeDetails[qrisType] || 0) + fee;
          
          if(!d.depo.qris[qrisType]) d.depo.qris[qrisType] = {c:0, v:0};
          if(!totTunai.depo.qris[qrisType]) totTunai.depo.qris[qrisType] = {c:0, v:0};
          d.depo.qris[qrisType].c++; d.depo.qris[qrisType].v += nominal;
          totTunai.depo.qris[qrisType].c++; totTunai.depo.qris[qrisType].v += nominal;
        } else {
          depoNonQris += nominal; d.depo.nonQr.c++; d.depo.nonQr.v += nominal;
          totTunai.depo.nonQr.c++; totTunai.depo.nonQr.v += nominal;
        }
        
        let n = item.cmb && item.cmb.bank ? item.cmb.bank.name : '-';
        let a = item.cmb && item.cmb.accno ? item.cmb.accno : '';
        let an = item.cmb && item.cmb.accnm ? item.cmb.accnm : '';
        let ketText = '-';
        if (n !== '-') {
          ketText = n.toLowerCase() === 'qris' ? `${n} (${a})` : `${n} - ${an}`;
        }
        
        _allTrx.push({ time: parseTrxTime(item.prctm), timeStr: item.prctm, tipe: 'Deposit', username: item.usnn, nominal, fee, nett, bankPlayer: item.usb?.bank?.name, namaRek: item.usb?.accnm, handler: parseHandler(item.unfn), ketText, cmb: item.cmb, trxNote: item.trxNote, status: item.ststr });
      });

      listWd.forEach(item => {
        let nominal = parseFloat(item.amt) * 1000;
        let isAutoWd = item.trxNote && item.trxNote.includes('AutoWD');
        let wdType = isAutoWd ? (item.trxNote.match(/AutoWD\s*\[(.*?)\]/)?.[1] || 'AutoWD').toUpperCase() : null;
        let fee = isAutoWd ? 3500 : 0;
        let nett = nominal + fee; 
        totalWdGross += nominal; totalWdFee += fee;
        
        let day = item.prctm.split(' ')[0];
        if(!_dailyTunai[day]) _dailyTunai[day] = initDayObj();
        let d = _dailyTunai[day];
        
        d.wd.totalGross += nominal; d.wd.totalTkt++; 
        totTunai.wd.totalGross += nominal; totTunai.wd.totalTkt++;
        
        if (isAutoWd) {
          qrKotor -= nominal; qrBersih -= nett; 
          d.wd.totalQrGross += nominal; d.wd.totalQrNett += nett; d.wd.totalQrFee += fee;
          totTunai.wd.totalQrGross += nominal; totTunai.wd.totalQrNett += nett; totTunai.wd.totalQrFee += fee;
          
          qrKotorDetails[wdType] = (qrKotorDetails[wdType] || 0) - nominal;
          qrBersihDetails[wdType] = (qrBersihDetails[wdType] || 0) - nett;
          feeDetails[wdType] = (feeDetails[wdType] || 0) + fee;
          
          if(!d.wd.qris[wdType]) d.wd.qris[wdType] = {c:0, v:0};
          if(!totTunai.wd.qris[wdType]) totTunai.wd.qris[wdType] = {c:0, v:0};
          d.wd.qris[wdType].c++; d.wd.qris[wdType].v += nominal;
          totTunai.wd.qris[wdType].c++; totTunai.wd.qris[wdType].v += nominal;
        } else {
          wdNonQris += nominal; d.wd.nonQr.c++; d.wd.nonQr.v += nominal;
          totTunai.wd.nonQr.c++; totTunai.wd.nonQr.v += nominal;
        }
        
        let ketText = item.trxNote === '-' ? 'MANUAL' : item.trxNote;
        
        _allTrx.push({ time: parseTrxTime(item.prctm), timeStr: item.prctm, tipe: 'Withdraw', username: item.usnn, nominal, fee, nett: -nett, bankPlayer: item.usb?.bank?.name, namaRek: item.usb?.accnm, handler: parseHandler(item.unfn), ketText, cmb: item.cmb, trxNote: item.trxNote, status: item.ststr });
      });

      _allTrx.sort((a, b) => a.time - b.time);
      
      let uHandlers = new Set();
      let uKets = new Set();
      _allTrx.forEach(item => {
        if(item.handler) uHandlers.add(item.handler);
        if(item.ketText) uKets.add(item.ketText);
      });
      let hSel = document.getElementById('filter-handler');
      hSel.innerHTML = '<option value="">Semua Handler</option>' + Array.from(uHandlers).sort().map(h => `<option value="${h}">${h}</option>`).join('');
      let kSel = document.getElementById('filter-ket');
      kSel.innerHTML = '<option value="">Semua Keterangan</option>' + Array.from(uKets).sort().map(k => `<option value="${k}">${k}</option>`).join('');

      let uMods = new Set();
      listCb.forEach(item => uMods.add(item.uscbalhmod));
      let mSel = document.getElementById('filter-module');
      mSel.innerHTML = '<option value="">Semua Module</option>' + Array.from(uMods).sort().map(m => `<option value="${m}">${m}</option>`).join('');

      renderTunaiHistory();

      let profitKotor = totalDepoGross - totalWdGross;
      let profitBersih = profitKotor - totalDepoFee - totalWdFee;
      totTunaiAgentFee = totalDepoFee + totalWdFee; totTunaiPK = profitKotor; totTunaiPB = profitBersih;
      
      document.getElementById('cm-card-depo').innerText = formatRupiahPlain(totalDepoGross);
      document.getElementById('cm-card-depo-tkt').innerText = `${listDepo.length} Tiket`;
      document.getElementById('cm-card-wd').innerText = formatRupiahPlain(totalWdGross);
      document.getElementById('cm-card-wd-tkt').innerText = `${listWd.length} Tiket`;
      document.getElementById('cm-card-profit-kotor').innerText = formatRupiahPlain(profitKotor);
      document.getElementById('cm-card-profit-bersih').innerText = formatRupiahPlain(profitBersih);
      document.getElementById('cm-card-qr-kotor').innerText = formatRupiahPlain(qrKotor);
      document.getElementById('cm-card-qr-kotor-sub').innerText = Object.entries(qrKotorDetails).map(([k, v]) => `${k} (${formatRupiahPlain(v)})`).join(' | ') || '-';
      document.getElementById('cm-card-qr-bersih').innerText = formatRupiahPlain(qrBersih);
      document.getElementById('cm-card-qr-bersih-sub').innerText = Object.entries(qrBersihDetails).map(([k, v]) => `${k} (${formatRupiahPlain(v)})`).join(' | ') || '-';
      document.getElementById('cm-card-depo-nonqr').innerText = formatRupiahPlain(depoNonQris);
      document.getElementById('cm-card-wd-nonqr').innerText = formatRupiahPlain(wdNonQris);
      
      let feeText = Object.entries(feeDetails).map(([k, v]) => `${k} (${formatRupiahPlain(v)})`).join(' | ') + ` | TOTAL: ${formatRupiahPlain(totalDepoFee + totalWdFee)}`;
      document.getElementById('cm-fee-details').innerHTML = feeText;

      let htmlRekapTunai = Object.keys(_dailyTunai).sort().map(day => {
        let d = _dailyTunai[day];
        let dp = d.depo, wd = d.wd;
        let totalAgentFee = dp.totalQrFee + wd.totalQrFee;
        let pKotor = dp.totalGross - wd.totalGross;
        let pBersih = (dp.totalQrNett + dp.nonQr.v) - (wd.totalQrNett + wd.nonQr.v);
        
        return `<tr>
          <td>${day}</td>
          <td>${formatTK(dp.qris.OPA?.c)}</td><td>${formatRupiahTable(dp.qris.OPA?.v)}</td>
          <td>${formatTK(dp.qris.OPT?.c)}</td><td>${formatRupiahTable(dp.qris.OPT?.v)}</td>
          <td>${formatTK(dp.qris.OPZ?.c)}</td><td>${formatRupiahTable(dp.qris.OPZ?.v)}</td>
          <td>${formatTK(dp.qris.GPP?.c)}</td><td>${formatRupiahTable(dp.qris.GPP?.v)}</td>
          <td>${formatTK(dp.qris.PEN?.c)}</td><td>${formatRupiahTable(dp.qris.PEN?.v)}</td>
          <td>${formatRupiahTable(dp.totalQrGross)}</td>
          <td>${formatRupiahTable(dp.totalQrNett)}</td>
          <td>${formatTK(dp.nonQr.c)}</td><td>${formatRupiahTable(dp.nonQr.v)}</td>
          <td>${formatTK(dp.totalTkt)}</td>
          <td>${formatRupiahTable(dp.totalGross)}</td>
          
          <td>${formatTK(wd.qris.OPA?.c)}</td><td>${formatRupiahTable(wd.qris.OPA?.v)}</td>
          <td>${formatTK(wd.qris.OPT?.c)}</td><td>${formatRupiahTable(wd.qris.OPT?.v)}</td>
          <td>${formatTK(wd.qris.OPZ?.c)}</td><td>${formatRupiahTable(wd.qris.OPZ?.v)}</td>
          <td>${formatTK(wd.qris.GPP?.c)}</td><td>${formatRupiahTable(wd.qris.GPP?.v)}</td>
          <td>${formatTK(wd.qris.PEN?.c)}</td><td>${formatRupiahTable(wd.qris.PEN?.v)}</td>
          <td>${formatRupiahTable(wd.totalQrGross)}</td>
          <td>${formatRupiahTable(wd.totalQrNett)}</td>
          <td>${formatTK(wd.nonQr.c)}</td><td>${formatRupiahTable(wd.nonQr.v)}</td>
          <td>${formatTK(wd.totalTkt)}</td>
          <td>${formatRupiahTable(wd.totalGross)}</td>
          
          <td>${formatRupiahTable(totalAgentFee)}</td>
          <td>${formatRupiahTable(pKotor)}</td>
          <td>${formatRupiahTable(pBersih)}</td>
        </tr>`;
      }).join('');
      
      htmlRekapTunai += `<tr class="row-total">
        <td>TOTAL</td>
        <td>${formatTK(totTunai.depo.qris.OPA?.c)}</td><td>${formatRupiahTable(totTunai.depo.qris.OPA?.v)}</td>
        <td>${formatTK(totTunai.depo.qris.OPT?.c)}</td><td>${formatRupiahTable(totTunai.depo.qris.OPT?.v)}</td>
        <td>${formatTK(totTunai.depo.qris.OPZ?.c)}</td><td>${formatRupiahTable(totTunai.depo.qris.OPZ?.v)}</td>
        <td>${formatTK(totTunai.depo.qris.GPP?.c)}</td><td>${formatRupiahTable(totTunai.depo.qris.GPP?.v)}</td>
        <td>${formatTK(totTunai.depo.qris.PEN?.c)}</td><td>${formatRupiahTable(totTunai.depo.qris.PEN?.v)}</td>
        <td>${formatRupiahTable(totTunai.depo.totalQrGross)}</td>
        <td>${formatRupiahTable(totTunai.depo.totalQrNett)}</td>
        <td>${formatTK(totTunai.depo.nonQr.c)}</td><td>${formatRupiahTable(totTunai.depo.nonQr.v)}</td>
        <td>${formatTK(totTunai.depo.totalTkt)}</td>
        <td>${formatRupiahTable(totTunai.depo.totalGross)}</td>
        
        <td>${formatTK(totTunai.wd.qris.OPA?.c)}</td><td>${formatRupiahTable(totTunai.wd.qris.OPA?.v)}</td>
        <td>${formatTK(totTunai.wd.qris.OPT?.c)}</td><td>${formatRupiahTable(totTunai.wd.qris.OPT?.v)}</td>
        <td>${formatTK(totTunai.wd.qris.OPZ?.c)}</td><td>${formatRupiahTable(totTunai.wd.qris.OPZ?.v)}</td>
        <td>${formatTK(totTunai.wd.qris.GPP?.c)}</td><td>${formatRupiahTable(totTunai.wd.qris.GPP?.v)}</td>
        <td>${formatTK(totTunai.wd.qris.PEN?.c)}</td><td>${formatRupiahTable(totTunai.wd.qris.PEN?.v)}</td>
        <td>${formatRupiahTable(totTunai.wd.totalQrGross)}</td>
        <td>${formatRupiahTable(totTunai.wd.totalQrNett)}</td>
        <td>${formatTK(totTunai.wd.nonQr.c)}</td><td>${formatRupiahTable(totTunai.wd.nonQr.v)}</td>
        <td>${formatTK(totTunai.wd.totalTkt)}</td>
        <td>${formatRupiahTable(totTunai.wd.totalGross)}</td>
        
        <td>${formatRupiahTable(totTunaiAgentFee)}</td>
        <td>${formatRupiahTable(totTunaiPK)}</td>
        <td>${formatRupiahTable(totTunaiPB)}</td>
      </tr>`;
      
      document.getElementById('cm-table-tunai-rekap').innerHTML = htmlRekapTunai || '<tr><td colspan="36" style="text-align:center; color:#aaa; padding:20px;">Tidak ada data.</td></tr>';

      listCb.sort((a,b) => parseTrxTime(a.uscbalhdt) - parseTrxTime(b.uscbalhdt));
      let totalIn = 0, totalOut = 0;
      let totCB = { out: {}, in: {} };
      cbOutMods.forEach(m => totCB.out[m] = 0);
      cbInMods.forEach(m => totCB.in[m] = 0);

      listCb.forEach(item => {
        let mod = item.uscbalhmod; 
        let upd = (parseFloat(item.uscbalhupd) || 0) * 1000; 
        let isMasuk = cbInMods.includes(mod); let isKeluar = cbOutMods.includes(mod);
        if(isMasuk) totalIn += upd; if(isKeluar) totalOut += upd;
        
        let day = item.uscbalhdt.split(' ')[0];
        if(!_dailyCB[day]) {
          _dailyCB[day] = { start: parseFloat(item.uscbalhstr) * 1000, end: parseFloat(item.uscbalhend) * 1000, out: {}, in: {} };
          cbOutMods.forEach(m => _dailyCB[day].out[m] = 0);
          cbInMods.forEach(m => _dailyCB[day].in[m] = 0);
        } else {
          _dailyCB[day].end = parseFloat(item.uscbalhend) * 1000; 
        }
        if(isKeluar) { _dailyCB[day].out[mod] = (_dailyCB[day].out[mod] || 0) + upd; totCB.out[mod] += upd; }
        if(isMasuk) { _dailyCB[day].in[mod] = (_dailyCB[day].in[mod] || 0) + upd; totCB.in[mod] += upd; }
      });
      
      renderCBHistory();
      
      let sAwal = listCb.length > 0 ? parseFloat(listCb[0].uscbalhstr) * 1000 : 0; 
      let sAkhir = listCb.length > 0 ? parseFloat(listCb[listCb.length-1].uscbalhend) * 1000 : 0; 
      document.getElementById('cm-card-cb-start').innerText = formatRupiahPlain(sAwal);
      document.getElementById('cm-card-cb-end').innerText = formatRupiahPlain(sAkhir);
      document.getElementById('cm-card-cb-in').innerText = formatRupiahPlain(totalIn);
      document.getElementById('cm-card-cb-out').innerText = formatRupiahPlain(totalOut);

      _lastSummary = { 
        tktDepo: listDepo.length, depo: totalDepoGross, 
        tktWd: listWd.length, wd: totalWdGross, 
        pKotor: profitKotor, pBersih: profitBersih, 
        saldoAkhir: sAkhir 
      };

      let htmlRekapCB = Object.keys(_dailyCB).sort().map(day => {
        let d = _dailyCB[day];
        let totOut = Object.values(d.out).reduce((a,b) => a+b, 0);
        let totIn = Object.values(d.in).reduce((a,b) => a+b, 0);
        return `<tr>
          <td>${day}</td>
          <td>${formatRupiahTable(d.start)}</td>
          <td>${formatRupiahTable(d.out['Deposit'])}</td>
          <td>${formatRupiahTable(d.out['Manual Deposit'])}</td>
          <td>${formatRupiahTable(d.out['Provider Withdraw'])}</td>
          <td>${formatRupiahTable(d.out['Deduct Credit'])}</td>
          <td>${formatRupiahTable(d.out['Bonus Claim'])}</td>
          <td>${formatRupiahTable(d.out['Bonus Transfer'])}</td>
          <td>${formatRupiahTable(d.out['Rebate'])}</td>
          <td>${formatRupiahTable(d.out['Bonus Deposit'])}</td>
          <td>${formatRupiahTable(totOut)}</td>
          <td>${formatRupiahTable(d.in['Withdraw'])}</td>
          <td>${formatRupiahTable(d.in['Add Credit'])}</td>
          <td>${formatRupiahTable(d.in['Manual Withdraw'])}</td>
          <td>${formatRupiahTable(d.in['Provider Deposit'])}</td>
          <td>${formatRupiahTable(totIn)}</td>
          <td>${formatRupiahTable(d.end)}</td>
        </tr>`;
      }).join('');
      
      let totCBOutAll = Object.values(totCB.out).reduce((a,b) => a+b, 0);
      let totCBInAll = Object.values(totCB.in).reduce((a,b) => a+b, 0);
      htmlRekapCB += `<tr class="row-total">
        <td>TOTAL</td>
        <td>-</td>
        <td>${formatRupiahTable(totCB.out['Deposit'])}</td>
        <td>${formatRupiahTable(totCB.out['Manual Deposit'])}</td>
        <td>${formatRupiahTable(totCB.out['Provider Withdraw'])}</td>
        <td>${formatRupiahTable(totCB.out['Deduct Credit'])}</td>
        <td>${formatRupiahTable(totCB.out['Bonus Claim'])}</td>
        <td>${formatRupiahTable(totCB.out['Bonus Transfer'])}</td>
        <td>${formatRupiahTable(totCB.out['Rebate'])}</td>
        <td>${formatRupiahTable(totCB.out['Bonus Deposit'])}</td>
        <td>${formatRupiahTable(totCBOutAll)}</td>
        <td>${formatRupiahTable(totCB.in['Withdraw'])}</td>
        <td>${formatRupiahTable(totCB.in['Add Credit'])}</td>
        <td>${formatRupiahTable(totCB.in['Manual Withdraw'])}</td>
        <td>${formatRupiahTable(totCB.in['Provider Deposit'])}</td>
        <td>${formatRupiahTable(totCBInAll)}</td>
        <td>-</td>
      </tr>`;
      
      document.getElementById('cm-table-cb-rekap').innerHTML = htmlRekapCB || '<tr><td colspan="18" style="text-align:center; color:#aaa; padding:20px;">Tidak ada data.</td></tr>';

      if (cbJson) statusEl.innerHTML = `✅ <b>OK</b> | Total Depo: ${listDepo.length} | Total WD: ${listWd.length} | Total CB: ${listCb.length} | Profit Bersih: ${formatRupiahPlain(profitBersih)}`;
      
      return true;

    } catch (e) { 
      statusEl.innerHTML = '❌ <b>Error Fatal:</b> ' + e.message; 
      console.error('Error:', e); 
      return false; 
    }
  };

  document.getElementById('cm-load').onclick = loadData;

  // FIX: PAKAI window. SUPAYA BISA DIAKSES DARI ONCLICK HTML
  window.renderTunaiHistory = function() {
    let fTipe = document.getElementById('filter-tipe').value;
    let fUser = document.getElementById('filter-user').value.toLowerCase();
    let fHandler = document.getElementById('filter-handler').value;
    let fKet = document.getElementById('filter-ket').value;

    let filtered = _allTrx.filter(item => {
      if (fTipe && item.tipe !== fTipe) return false;
      if (fUser && !item.username.toLowerCase().includes(fUser)) return false;
      if (fHandler && item.handler !== fHandler) return false;
      if (fKet && item.ketText !== fKet) return false;
      return true;
    });

    let html = filtered.length === 0 ? '<tr><td colspan="12" style="text-align:center; color:#aaa; padding:20px;">Tidak ada data yang cocok.</td></tr>' : '';
    
    // Variabel buat sum total filter
    let sumMasuk = 0, sumKeluar = 0, sumFee = 0, sumNett = 0;
    
    filtered.forEach(item => {
      let isDepo = item.tipe === 'Deposit';
      let badgeClass = isDepo ? 'badge-depo' : 'badge-wd';
      
      let masukVal = isDepo ? item.nominal : 0;
      let keluarVal = !isDepo ? -item.nominal : 0; 
      let feeVal = -Math.abs(item.fee); 
      let nettVal = item.nett; 
      
      // Tambahin ke sum
      sumMasuk += masukVal;
      sumKeluar += keluarVal;
      sumFee += feeVal;
      sumNett += nettVal;
      
      let ketHtml = '-';
      if (isDepo && item.cmb) {
        let n = item.cmb.bank ? item.cmb.bank.name : '-';
        let a = item.cmb.accno ? item.cmb.accno : '';
        let an = item.cmb.accnm ? item.cmb.accnm : '';
        ketHtml = n.toLowerCase() === 'qris' ? `${n} (${a})` : `${n} - ${an}`;
        ketHtml = `<span style="color:#3b82f6; font-weight:800;">${ketHtml}</span>`;
      } else if (!isDepo) {
        ketHtml = item.trxNote === '-' ? '<span style="color:#d93025; font-weight:800;">MANUAL</span>' : `<span style="color:#8b5cf6; font-weight:800;">${item.trxNote}</span>`;
      }
      
      html += `<tr>
        <td>${item.timeStr}</td>
        <td><span class="${badgeClass}">${item.tipe}</span></td>
        <td style="font-weight:800;">${item.username}</td>
        <td>${formatRupiahTable(masukVal)}</td>
        <td>${formatRupiahTable(keluarVal)}</td>
        <td>${formatRupiahTable(feeVal)}</td>
        <td>${formatRupiahTable(nettVal)}</td>
        <td style="color:#3b82f6;">${item.bankPlayer}</td>
        <td style="font-weight:800;">${item.namaRek}</td>
        <td style="font-size:9px; font-weight:700; color:#65676b;">${item.handler}</td>
        <td style="font-size:9px;">${ketHtml}</td>
        <td style="color:#22c55e; font-weight:700;">${item.status}</td>
      </tr>`;
    });

    // Tambahin baris total dinamis di bawah sendiri kalau ada datanya
    if (filtered.length > 0) {
      html += `<tr class="row-total">
        <td colspan="3">TOTAL FILTER</td>
        <td>${formatRupiahTable(sumMasuk)}</td>
        <td>${formatRupiahTable(sumKeluar)}</td>
        <td>${formatRupiahTable(sumFee)}</td>
        <td>${formatRupiahTable(sumNett)}</td>
        <td colspan="5"></td>
      </tr>`;
    }

    document.getElementById('cm-table-tunai-history').innerHTML = html;
  }

  window.renderCBHistory = function() {
    let fMod = document.getElementById('filter-module').value;
    let cbHtmlHistory = '';
    let filteredCb = _cbRawList.filter(item => !fMod || item.uscbalhmod === fMod);
    
    filteredCb.forEach(item => {
      let mod = item.uscbalhmod; 
      let upd = (parseFloat(item.uscbalhupd) || 0) * 1000; 
      let isMasuk = cbInMods.includes(mod); let isKeluar = cbOutMods.includes(mod);
      let badge = isMasuk ? 'badge-in' : (isKeluar ? 'badge-out' : 'badge-depo');
      let inVal = isMasuk ? upd : 0;
      let outVal = isKeluar ? -upd : 0; 
      
      cbHtmlHistory += `<tr><td>${item.uscbalhdt}</td><td><span class="${badge}">${mod}</span></td><td>${item.un}</td><td style="text-align:left; max-width:300px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${item.uscbalhmodinfo}</td><td>${formatRupiahTable(parseFloat(item.uscbalhstr) * 1000)}</td><td>${formatRupiahTable(inVal)}</td><td>${formatRupiahTable(outVal)}</td><td>${formatRupiahTable(parseFloat(item.uscbalhend) * 1000)}</td></tr>`;
    });
    
    document.getElementById('cm-table-cb-history').innerHTML = cbHtmlHistory || '<tr><td colspan="8" style="text-align:center; color:#aaa; padding:20px;">Tidak ada data yang cocok.</td></tr>';
  }
})();
