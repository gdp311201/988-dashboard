(async () => {
  const ID = 'cm-universal-dash-v55';
  if (document.getElementById(ID)) { document.getElementById(ID).remove(); return; }

  // Inject Library untuk Export Excel
  if (!window.XLSX) { const s1 = document.createElement('script'); s1.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'; document.head.appendChild(s1); }

  // ── STYLE ──────────────────────────────────────────────────────────────────
  const st = document.createElement('style');
  st.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
    #${ID} * { box-sizing:border-box; font-family:'Inter',sans-serif!important; }
    
    #${ID} {
      --bg-base: #eef2f7; 
      --bg-card: rgba(255, 255, 255, 0.35); 
      --bg-sec: rgba(255, 255, 255, 0.25);
      --text-main: #1c1e21; --text-sub: #65676b;
      --glass-border: 1px solid rgba(255, 255, 255, 0.8);
      --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), inset 0 0 15px rgba(255, 255, 255, 0.5);
      --glass-glow: 0 0 25px rgba(0, 0, 0, 0.15); 
      --tbl-head-bg: #e2e8f0; --tbl-head-text: #1c1e21; --tbl-border: rgba(200, 210, 225, 0.5);
      --tbl-foot-bg: #cbd5e1;
      --tbl-row-even: rgba(255, 255, 255, 0.15); --tbl-row-hover: rgba(255, 255, 255, 0.35);
      --modal-bg: rgba(255, 255, 255, 0.75); --input-bg: rgba(255, 255, 255, 0.9);
      --switch-bg: rgba(0, 0, 0, 0.05);
      --spinner-color: #3b82f6;
    }
    #${ID}.dark {
      --bg-base: #020617; 
      --bg-card: rgba(30, 41, 59, 0.35); 
      --bg-sec: rgba(15, 23, 42, 0.35);
      --text-main: #e2e8f0; --text-sub: #94a3b8;
      --glass-border: 1px solid rgba(16, 185, 129, 0.3); 
      --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(16, 185, 129, 0.05);
      --glass-glow: 0 0 30px rgba(16, 185, 129, 0.25); 
      --tbl-head-bg: #0f172a; --tbl-head-text: #e2e8f0; --tbl-border: rgba(255, 255, 255, 0.1);
      --tbl-foot-bg: #1e293b;
      --tbl-row-even: rgba(255, 255, 255, 0.03); --tbl-row-hover: rgba(255, 255, 255, 0.08);
      --modal-bg: rgba(15, 23, 42, 0.75); --input-bg: rgba(15, 23, 42, 0.8);
      --switch-bg: rgba(255, 255, 255, 0.05);
      --spinner-color: #22c55e;
    }
    
    /* MESH GRADIENT & GLASS BUBBLES */
    .cm-bg-wrap { position: fixed; inset: 0; z-index: -2; overflow: hidden; background: var(--bg-base); }
    .cm-blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.6; animation: floatBlob 20s infinite ease-in-out; }
    .cm-blob.b1 { width: 500px; height: 500px; background: #3b82f6; top: -100px; left: -100px; }
    .cm-blob.b2 { width: 400px; height: 400px; background: #8b5cf6; bottom: -50px; right: 10%; animation-delay: -5s; }
    .cm-blob.b3 { width: 450px; height: 450px; background: #06b6d4; top: 30%; left: 40%; animation-delay: -10s; }
    .dark .cm-blob.b1 { background: #1d4ed8; opacity: 0.4; }
    .dark .cm-blob.b2 { background: #6d28d9; opacity: 0.4; }
    .dark .cm-blob.b3 { background: #0e7490; opacity: 0.4; }
    .cm-glass-bubble {
      position: absolute; border-radius: 50%; 
      background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0.1) 40%, transparent 70%);
      border: 1px solid rgba(255,255,255,0.3); 
      box-shadow: inset 5px 5px 15px rgba(255,255,255,0.5), inset -5px -5px 15px rgba(0,0,0,0.1);
      backdrop-filter: blur(2px); opacity: 0.4; animation: floatBlob 15s infinite ease-in-out;
    }
    .dark .cm-glass-bubble { background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), rgba(255,255,255,0.05) 40%, transparent 70%); border: 1px solid rgba(255,255,255,0.1); }
    @keyframes floatBlob { 0%, 100% { transform: translate(0, 0) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } }
    
    #${ID} { position:fixed; inset:0; background: transparent; backdrop-filter: blur(20px) saturate(150%); -webkit-backdrop-filter: blur(20px) saturate(150%); z-index:2147483647; display:flex; flex-direction:column; color:var(--text-main); transition: background .3s, color .3s; }
    #${ID} ::-webkit-scrollbar { width:6px; height:6px; }
    #${ID} ::-webkit-scrollbar-thumb { background:#1e3a5f; border-radius:4px; }
    #${ID} ::-webkit-scrollbar-track { background: transparent; }
    
    /* FLOATING CIRCLE PERCENTAGE LOADER */
    .cm-loader-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.3); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); z-index:99999; display:none; align-items:center; justify-content:center; }
    .cm-loader-container { display:flex; flex-direction:column; align-items:center; gap:12px; }
    .cm-loader-ring { width:90px; height:90px; position:relative; }
    .cm-loader-ring svg { transform: rotate(-90deg); width: 100%; height: 100%; }
    .cm-loader-ring-track { stroke: rgba(255,255,255,0.1); stroke-width: 8; fill: none; }
    .cm-loader-ring-fill { stroke: #3b82f6; stroke-width: 8; fill: none; stroke-linecap: round; transition: stroke-dashoffset 0.2s ease, stroke 0.5s ease; }
    .cm-loader-percent { position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); font-size:24px; font-weight:900; color:#3b82f6; transition: color 0.5s ease; }
    .cm-loader-text { font-size:12px; font-weight:800; color:rgba(255,255,255,0.8); letter-spacing:1px; text-transform:uppercase; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
    
    .cm-top { background:rgba(0, 0, 0, 0.75); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); padding:6px 16px; display:flex; align-items:center; gap:12px; box-shadow:0 4px 20px rgba(0,0,0,.5); position:sticky; top:0; z-index:100; flex-wrap:wrap; border-bottom: 1px solid rgba(255,255,255,0.1); }
    
    .cm-logo { font-size:14px; font-weight:900; letter-spacing:.5px; display:flex; align-items:center; gap:4px; text-shadow: 0 1px 2px rgba(0,0,0,0.5); }
    .cm-logo span.zap { color:#fbbf24; text-shadow:0 0 10px rgba(251,191,36,0.8); }
    .cm-shine-text { background: linear-gradient(90deg, #fff 0%, #b1b1b1 40%, #fff 50%, #b1b1b1 60%, #fff 100%); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: shine 3s linear infinite; }
    @keyframes shine { to { background-position: 200% center; } }
    .cm-logo em { font-style:normal; color:#22c55e; }
    
    .cm-dbar { display:flex; align-items:center; gap:8px; flex:1; flex-wrap:wrap; }
    .cm-qb { height:30px; padding:0 12px; border-radius:6px; border:1px solid rgba(59,130,246,0.4); background:rgba(59,130,246,0.3); color:#fff; font-size:11px; font-weight:700; cursor:pointer; transition: all 0.2s; backdrop-filter: blur(8px); }
    .cm-qb:hover { background:rgba(59,130,246,0.5); transform: translateY(-1px); }
    .cm-qb.act { background:rgba(59,130,246,0.6); border-color:rgba(59,130,246,0.8); box-shadow: 0 2px 8px rgba(59,130,246,0.3); }
    .cm-dinp { height:30px; padding:0 8px; border:1px solid rgba(255,255,255,.2); border-radius:6px; font-size:12px; font-weight:600; color:#fff; background:rgba(255,255,255,.1); outline:none; }
    #cm-month-sel { color:#000 !important; background:#fff !important; border:1px solid #cbd5e1 !important; }
    #cm-month-sel option { color:#000 !important; background:#fff !important; }
    
    .cm-btn-glass { height:32px; padding:0 16px; border:none; border-radius:8px; font-size:12px; font-weight:900; cursor:pointer; color:#fff; backdrop-filter: blur(12px) saturate(180%); -webkit-backdrop-filter: blur(12px) saturate(180%); display:flex; align-items:center; justify-content:center; gap:6px; transition: all 0.3s ease; background: rgba(255, 255, 255, 0.15); box-shadow: 0 4px 12px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.2); border: 1px solid rgba(255, 255, 255, 0.3); }
    .cm-btn-glass:disabled { opacity:0.6; cursor:not-allowed; }
    .cm-btn-glass:hover { background: rgba(255, 255, 255, 0.25); transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.3); }
    .cm-btn-blue { background: rgba(59, 130, 246, 0.5); border-color: rgba(59, 130, 246, 0.6); color:#fff; }
    .cm-btn-blue:hover { background: rgba(59, 130, 246, 0.7); }
    .cm-btn-green { background: rgba(22, 163, 74, 0.5); border-color: rgba(22, 163, 74, 0.6); color:#fff; }
    .cm-btn-green:hover { background: rgba(22, 163, 74, 0.7); }
    .cm-btn-red { background: rgba(239, 68, 68, 0.5); border-color: rgba(239, 68, 68, 0.6); color:#fff; }
    .cm-btn-red:hover { background: rgba(239, 68, 68, 0.7); }
    .cm-btn-grey { background: rgba(255, 255, 255, 0.15); border-color: rgba(255, 255, 255, 0.3); color:#fff; }
    .cm-btn-grey:hover { background: rgba(255, 255, 255, 0.25); }
    
    .cm-auto-wrap { display:flex; align-items:center; gap:4px; margin-left:8px; padding-left:8px; border-left:1px solid rgba(255,255,255,.2); }
    .cm-auto-sel { height:30px; padding:0 8px; border:1px solid #cbd5e1; border-radius:6px; font-size:11px; font-weight:700; color:#000; background:#fff; outline:none; cursor:pointer; }
    .cm-auto-custom { width:50px; height:30px; padding:0 4px; border:1px solid #cbd5e1; border-radius:6px; font-size:11px; font-weight:700; color:#000; background:#fff; outline:none; text-align:center; display:none; }
    .cm-auto-btn { height:32px; padding:0 12px; border-radius:8px; border: 1px solid rgba(245, 158, 11, 0.6); font-size:11px; font-weight:900; cursor:pointer; color:#fff; backdrop-filter: blur(12px) saturate(180%); -webkit-backdrop-filter: blur(12px) saturate(180%); background: rgba(245, 158, 11, 0.4); box-shadow: 0 4px 12px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.2); transition: all 0.3s ease; }
    .cm-auto-btn:hover { background: rgba(245, 158, 11, 0.6); transform: translateY(-1px); }
    .cm-auto-btn.active { background: rgba(239, 68, 68, 0.6); border-color: rgba(239, 68, 68, 0.8); animation:pulse 1.5s infinite; }
    @keyframes pulse { 0% { opacity:1; } 50% { opacity:.7; } 100% { opacity:1; } }
    .cm-auto-label { color:rgba(255,255,255,0.6); font-size:10px; font-weight:700; margin-right:4px; }
    
    .cm-tabs-right { display:flex; gap:6px; align-items:center; margin-left:auto; }
    .cm-theme-btn { height:32px; width:32px; border-radius:8px; cursor:pointer; color:#fff; font-size:16px; display:flex; align-items:center; justify-content:center; transition: all 0.3s ease; backdrop-filter: blur(12px) saturate(180%); -webkit-backdrop-filter: blur(12px) saturate(180%); background: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.3); box-shadow: 0 4px 12px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.2); }
    .cm-theme-btn:hover { background: rgba(255, 255, 255, 0.25); transform: scale(1.05); }
    
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
    
    .cm-main-switcher { display:flex; gap:8px; justify-content:center; padding:0 0 16px 0; flex-wrap: wrap; }
    .cm-sw-btn { padding:10px 20px; border-radius:12px; border:var(--glass-border); background:var(--bg-card); backdrop-filter: blur(12px) saturate(180%); -webkit-backdrop-filter: blur(12px) saturate(180%); color:var(--text-sub); font-weight:800; font-size:12px; cursor:pointer; transition: all 0.3s ease; flex:1; max-width:250px; text-align:center; box-shadow: var(--glass-shadow); }
    .cm-sw-btn:hover { background: rgba(59, 130, 246, 0.2); color: #fff; transform: translateY(-2px); }
    .cm-sw-btn.active { background: linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(29, 78, 216, 0.6)); color: #1c1e21; border: 1px solid rgba(59, 130, 246, 0.5); box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3); }
    .dark .cm-sw-btn.active { color: #fff; }
    
    .cm-pane { display:none; flex:1; min-height:0; flex-direction:column; }
    .cm-pane.active { display:flex; }
    
    .cm-player-grid { display:grid; grid-template-columns: 1fr 1fr; gap:16px; flex:1; min-height:0; }
    @media (max-width: 1024px) { .cm-player-grid { grid-template-columns: 1fr; } }
    
    .cm-sec { flex:1; min-height:0; overflow:hidden; display:flex; flex-direction:column; background:var(--bg-sec); backdrop-filter: blur(16px) saturate(180%); -webkit-backdrop-filter: blur(16px) saturate(180%); border-radius:16px; box-shadow: var(--glass-shadow), var(--glass-glow); border:var(--glass-border); }
    .cm-shead { padding:12px 16px; border-bottom:1px solid var(--tbl-border); font-size:12px; font-weight:900; display:flex; justify-content:space-between; align-items:center; color:var(--text-main); background: rgba(255,255,255,0.05); flex-wrap:wrap; gap:8px; }
    .cm-shead-left { display:flex; align-items:center; gap:16px; flex:1; flex-wrap:wrap; }
    .cm-subtabs { display:flex; gap:4px; background:var(--switch-bg); padding:4px; border-radius:8px; border: 1px solid var(--tbl-border); }
    .cm-subtab { padding:6px 12px; border-radius:6px; border:none; background:transparent; font-size:10px; font-weight:800; cursor:pointer; color:var(--text-sub); transition: all 0.3s ease; }
    .cm-subtab:hover { background: rgba(59, 130, 246, 0.2); color: #fff; }
    .cm-subtab.active { background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(29, 78, 216, 0.4)); color: #1c1e21; box-shadow: 0 1px 3px rgba(59, 130, 246, 0.3); }
    .dark .cm-subtab.active { color: #fff; }
    
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
    table.cm-tbl.thin { table-layout:auto; white-space:nowrap; }
    table.cm-tbl.wide { min-width:2500px; white-space:nowrap; }
    
    /* FIX TABEL STICKY SOLID */
    table.cm-tbl thead { position: sticky; top: 0; z-index: 20; }
    table.cm-tbl th { background:var(--tbl-head-bg); backdrop-filter: none; padding:8px; font-size:9px; font-weight:900; color:var(--tbl-head-text); border: 1px solid var(--tbl-border); text-align:center; vertical-align:middle; }
    table.cm-tbl td { padding:6px 8px; border: 1px solid var(--tbl-border); font-weight:600; color:var(--text-main); font-size:10px; text-align:center; vertical-align:middle; background: transparent; }
    table.cm-tbl tbody tr:nth-child(even) { background:var(--tbl-row-even); }
    table.cm-tbl tbody tr:hover { background:var(--tbl-row-hover); }
    table.cm-tbl tbody tr.row-total { background:var(--tbl-foot-bg) !important; font-weight:900; font-size:11px; position:sticky; bottom:0; backdrop-filter: none; z-index: 10; }
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
    
    .cm-view-btn { height:24px; width:24px; border-radius:50%; border:none; background:rgba(59, 130, 246, 0.7); color:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:12px; box-shadow: 0 2px 6px rgba(59,130,246,.3), inset 0 1px 1px rgba(255,255,255,0.4); transition: 0.2s; margin:auto; }
    .cm-view-btn:hover { background:rgba(59, 130, 246, 1); transform: scale(1.1); }
    
    /* --- AGENT DASHBOARD 3-ROW LAYOUT & CHARTS FIXES --- */
    #pane-agent.active { gap: 12px; overflow: hidden; }
    .cm-agent-summary { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 12px; flex-shrink: 0; }
    .cm-agent-charts { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 12px; flex: 0 0 190px; min-height: 0; } 
    .cm-agent-stats { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 12px; flex: 0 0 240px; min-height: 0; } 
    
    .cm-agent-box { background:var(--bg-sec); backdrop-filter: blur(16px) saturate(180%); -webkit-backdrop-filter: blur(16px) saturate(180%); border-radius:16px; box-shadow: var(--glass-shadow), var(--glass-glow); border:var(--glass-border); display: flex; flex-direction: column; overflow: hidden; }
    .cm-agent-head { padding: 8px 12px; font-size: 11px; font-weight: 800; color: var(--text-sub); text-transform: uppercase; border-bottom: 1px solid var(--tbl-border); display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
    .cm-agent-body { flex: 1; min-height: 0; overflow: hidden; display: flex; flex-direction: column; padding: 8px; position: relative; }
    
    /* MINI CHARTS (GLASSMORPHISM, BERDEMPETAN & TANGGAL MIRING) */
    .cm-mini-chart-scroll { flex: 1; overflow: hidden; display: flex; align-items: flex-end; justify-content: space-between; gap: 1px; padding: 0 4px 4px 4px; }
    .cm-mini-col { flex: 1; min-width: 0; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; position: relative; padding-bottom: 30px; }
    .cm-mini-bars { position: absolute; bottom: 30px; left: 0; right: 0; display: flex; justify-content: center; align-items: flex-end; height: calc(100% - 30px); width: 100%; }
    .cm-mini-bars-overlap { position: absolute; bottom: 30px; left: 0; right: 0; height: calc(100% - 30px); width: 100%; }
    .cm-mini-bar { width: 100%; max-width: 10px; border-radius: 2px 2px 0 0; transition: height 0.3s ease; position: relative; cursor: pointer; backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); }
    .cm-mini-bar-overlap { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 80%; max-width: 8px; border-radius: 2px 2px 0 0; transition: height 0.3s ease; cursor: pointer; backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); }
    
    .cm-mini-bar.rg, .cm-mini-bar-overlap.rg { background: rgba(59, 130, 246, 0.35); box-shadow: inset 0 1px 2px rgba(255,255,255,0.4), 0 0 4px rgba(59, 130, 246, 0.2); z-index: 1; }
    .cm-mini-bar.nd, .cm-mini-bar-overlap.nd { background: rgba(245, 158, 11, 0.35); box-shadow: inset 0 1px 2px rgba(255,255,255,0.4), 0 0 4px rgba(245, 158, 11, 0.2); z-index: 2; }
    .cm-mini-bar.depo, .cm-mini-bar-overlap.depo { background: rgba(22, 163, 74, 0.35); box-shadow: inset 0 1px 2px rgba(255,255,255,0.4), 0 0 4px rgba(22, 163, 74, 0.2); z-index: 1; }
    .cm-mini-bar.wd, .cm-mini-bar-overlap.wd { background: rgba(220, 38, 38, 0.35); box-shadow: inset 0 1px 2px rgba(255,255,255,0.4), 0 0 4px rgba(220, 38, 38, 0.2); z-index: 2; }
    .cm-mini-bar.nett-pos { background: linear-gradient(to top, rgba(22, 163, 74, 0.3), rgba(74, 222, 128, 0.5)); box-shadow: inset 0 1px 2px rgba(255,255,255,0.3), 0 0 4px rgba(22, 163, 74, 0.2); }
    .cm-mini-bar.nett-neg { background: linear-gradient(to bottom, rgba(220, 38, 38, 0.3), rgba(248, 113, 113, 0.5)); box-shadow: inset 0 1px 2px rgba(255,255,255,0.3), 0 0 4px rgba(220, 38, 38, 0.2); }
    .cm-mini-bar.wlb-pos { background: linear-gradient(to top, rgba(37, 99, 235, 0.3), rgba(96, 165, 250, 0.5)); box-shadow: inset 0 1px 2px rgba(255,255,255,0.3), 0 0 4px rgba(37, 99, 235, 0.2); }
    .cm-mini-bar.wlb-neg { background: linear-gradient(to bottom, rgba(220, 38, 38, 0.3), rgba(248, 113, 113, 0.5)); box-shadow: inset 0 1px 2px rgba(255,255,255,0.3), 0 0 4px rgba(220, 38, 38, 0.2); }
    
    .cm-mini-label { position: absolute; bottom: 5px; left: 50%; transform: translateX(-50%) rotate(-45deg); transform-origin: center top; text-align: center; font-size: 8px; color: var(--text-sub); white-space: nowrap; z-index: 5; }
    .cm-agent-tooltip { position: fixed; background: rgba(0,0,0,0.85); color: #fff; backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; padding: 8px 12px; font-size: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 1000; pointer-events: none; display: none; white-space: nowrap; }
    
    /* STATS BOXES */
    .cm-stats-flex { flex: 1; min-height: 0; overflow-y: auto; display: flex; flex-direction: column; }
    .cm-stats-table { width: 100%; font-size: 10px; border-collapse: collapse; }
    .cm-stats-table th { text-align: left; padding: 4px 2px; font-size: 9px; color: var(--text-sub); font-weight: 800; text-transform: uppercase; border-bottom: 1px solid var(--tbl-border); }
    .cm-stats-table td { padding: 4px 2px; color: var(--text-main); font-weight: 600; border-bottom: 1px dashed var(--tbl-border); }
    .cm-stats-table tr:last-child td { border-bottom: none; }
    .cm-stats-table .num-d { text-align: right; color: #16a34a; font-weight: 800; }
    .cm-stats-table .num-w { text-align: right; color: #ef4444; font-weight: 800; }
    .cm-stats-table .num-0 { color: var(--text-sub) !important; opacity: 0.5; }
    .cm-stat-row { display:flex; justify-content:space-between; align-items:center; padding: 5px 0; border-bottom: 1px dashed var(--tbl-border); font-size: 10px; }
    .cm-stat-row:last-child { border-bottom: none; }
    .cm-stat-label { color: var(--text-sub); font-weight: 700; }
    .cm-stat-val { color: var(--text-main); font-weight: 900; font-size: 11px; }
    .cm-stat-val.pos { color: #16a34a; }
    .cm-stat-val.neg { color: #ef4444; }

    /* FIX MODAL LAYOUT */
    .cm-player-modal-bg { display:none; position:fixed; inset:0; background:rgba(0,0,0,.5); backdrop-filter: blur(4px); z-index:2147483648; align-items:center; justify-content:center; padding:20px; }
    .cm-player-modal-bg.show { display:flex; }
    .cm-player-modal { background:var(--modal-bg); backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%); border-radius:16px; width:1000px; max-width:95vw; height:80vh; max-height:600px; box-shadow:0 8px 40px rgba(0,0,0,.2); border:var(--glass-border); display:flex; flex-direction:column; position:relative; overflow: hidden; }
    .cm-player-modal-head { padding:16px 24px; border-bottom:1px solid var(--tbl-border); display:flex; justify-content:space-between; align-items:center; background: rgba(255,255,255,0.05); border-top-left-radius:16px; border-top-right-radius:16px; flex-shrink: 0; }
    .cm-player-modal-title { font-size:14px; font-weight:900; color:var(--text-main); display:flex; align-items:center; gap:8px; }
    .cm-player-modal-actions { display:flex; gap:8px; }
    .cm-player-modal-close { height:32px; width:32px; background:rgba(239, 68, 68, 0.7); color:#fff; border:1px solid rgba(239,68,68,0.8); border-radius:8px; cursor:pointer; font-weight:900; display:flex; align-items:center; justify-content:center; box-shadow: 0 2px 6px rgba(239,68,68,.3), inset 0 1px 1px rgba(255,255,255,0.4); transition: 0.2s; }
    .cm-player-modal-close:hover { background:rgba(239, 68, 68, 1); transform: rotate(90deg); }
    .cm-player-modal-body { flex:1; min-height:0; overflow:hidden; display:flex; flex-direction:column; padding: 0; position:relative; }
    .cm-player-summary { flex-shrink: 0; background: var(--bg-base); backdrop-filter: none; -webkit-backdrop-filter: none; padding: 0 24px; height: 48px; display: flex; align-items: center; flex-wrap: wrap; gap: 16px; border-bottom: 2px solid var(--tbl-border); box-shadow: 0 4px 10px rgba(0,0,0,0.1); z-index: 10; }
    .cm-player-modal-tbl-wrap { flex: 1; min-height: 0; overflow-y: auto; overflow-x: auto; padding: 0 24px 16px; }
    .cm-player-modal-tbl-wrap .cm-tbl thead { position: sticky; top: 0; z-index: 5; background: var(--tbl-head-bg) !important; backdrop-filter: none; -webkit-backdrop-filter: none; }
    
    .gs-modal-bg { display:none; position:fixed; inset:0; background:rgba(0,0,0,.5); backdrop-filter: blur(4px); z-index:2147483648; align-items:center; justify-content:center; }
    .gs-modal-bg.show { display:flex; }
    .gs-modal { background:rgba(255, 255, 255, 0.65); backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%); border-radius:16px; padding:24px; width:480px; box-shadow:0 8px 40px rgba(0,0,0,.2); border:var(--glass-border); }
    .dark .gs-modal { background:rgba(15, 23, 42, 0.65); }
    .gs-modal h3 { font-size:14px; font-weight:900; margin:0 0 4px; color:var(--text-main); }
    .gs-modal p { font-size:11px; color:var(--text-sub); margin:0 0 16px; }
    .gs-inp { width:100%; height:36px; padding:0 12px; border:1.5px solid var(--tbl-border); border-radius:8px; font-size:12px; outline:none; font-family:monospace; margin-bottom:8px; background:var(--input-bg); color:var(--text-main); }
    .gs-btns { display:flex; gap:8px; margin-top:16px; justify-content:flex-end; }
    .gs-modal .cm-btn-glass { color: #1c1e21; }
    .dark .gs-modal .cm-btn-glass { color: #fff; }
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
    <div class="cm-bg-wrap">
      <div class="cm-blob b1"></div>
      <div class="cm-blob b2"></div>
      <div class="cm-blob b3"></div>
      <div class="cm-glass-bubble" style="width: 150px; height: 150px; top: 15%; left: 10%; animation-delay: -2s;"></div>
      <div class="cm-glass-bubble" style="width: 100px; height: 100px; top: 70%; left: 80%; animation-delay: -8s;"></div>
      <div class="cm-glass-bubble" style="width: 200px; height: 200px; top: 40%; left: 50%; animation-delay: -12s;"></div>
      <div class="cm-glass-bubble" style="width: 80px; height: 80px; top: 85%; left: 20%; animation-delay: -4s;"></div>
      <div class="cm-glass-bubble" style="width: 120px; height: 120px; top: 10%; left: 75%; animation-delay: -6s;"></div>
    </div>

    <div class="cm-loader-overlay" id="cm-loader-overlay">
      <div class="cm-loader-container">
        <div class="cm-loader-ring">
          <svg viewBox="0 0 100 100">
            <circle class="cm-loader-ring-track" cx="50" cy="50" r="40"></circle>
            <circle class="cm-loader-ring-fill" id="cm-loader-ring-fill" cx="50" cy="50" r="40" stroke-dasharray="251.32" stroke-dashoffset="251.32"></circle>
          </svg>
          <div class="cm-loader-percent" id="cm-loader-percent">0%</div>
        </div>
        <div class="cm-loader-text">Loading Data...</div>
      </div>
    </div>

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
        <button class="cm-sw-btn" onclick="switchMainTab('agent')">AGENT REPORT</button>
        <button class="cm-sw-btn active" onclick="switchMainTab('tunai')">TRANSAKSI TUNAI</button>
        <button class="cm-sw-btn" onclick="switchMainTab('cb')">CREDIT BALANCE</button>
        <button class="cm-sw-btn" onclick="switchMainTab('qris')">QRIS REPORT</button>
        <button class="cm-sw-btn" onclick="switchMainTab('winlose')">WINLOSE REPORT</button>
      </div>
      
      <div id="pane-agent" class="cm-pane">
        <div class="cm-agent-summary">
          <div class="cm-card" id="agent-card-1" style="--accent-color:#3b82f6"></div>
          <div class="cm-card" id="agent-card-2" style="--accent-color:#8b5cf6"></div>
          <div class="cm-card" id="agent-card-3" style="--accent-color:#06b6d4"></div>
          <div class="cm-card" id="agent-card-4" style="--accent-color:#16a34a"></div>
        </div>
        
        <div class="cm-agent-charts">
          <div class="cm-agent-box">
            <div class="cm-agent-head"><span>📉 DEPOSIT NETT</span></div>
            <div class="cm-agent-body"><div class="cm-mini-chart-scroll" id="chart-a"></div></div>
          </div>
          <div class="cm-agent-box">
            <div class="cm-agent-head"><span>🎮 WLB WIN (AG TOTAL)</span></div>
            <div class="cm-agent-body"><div class="cm-mini-chart-scroll" id="chart-b"></div></div>
          </div>
          <div class="cm-agent-box">
            <div class="cm-agent-head"><span>👥 RG & ND</span></div>
            <div class="cm-agent-body"><div class="cm-mini-chart-scroll" id="chart-c"></div></div>
          </div>
          <div class="cm-agent-box">
            <div class="cm-agent-head"><span>🎟 TIKET DEPO & WD</span></div>
            <div class="cm-agent-body"><div class="cm-mini-chart-scroll" id="chart-d"></div></div>
          </div>
        </div>
        
        <div class="cm-agent-stats">
          <div class="cm-agent-box">
            <div class="cm-agent-head">📊 STATISTIK PERIODE ; DEPOSIT NETT</div>
            <div class="cm-agent-body"><div class="cm-stats-flex" id="stat-e"></div></div>
          </div>
          <div class="cm-agent-box">
            <div class="cm-agent-head">📊 STATISTIK PERIODE ; WINLOSE</div>
            <div class="cm-agent-body"><div class="cm-stats-flex" id="stat-f"></div></div>
          </div>
          <div class="cm-agent-box">
            <div class="cm-agent-head">👨‍💼 LIST HANDLER</div>
            <div class="cm-agent-body"><div class="cm-stats-flex" id="stat-g"></div></div>
          </div>
          <div class="cm-agent-box">
            <div class="cm-agent-head">🏦 COMPANY ACCOUNT</div>
            <div class="cm-agent-body"><div class="cm-stats-flex" id="stat-h"></div></div>
          </div>
        </div>
        
        <div class="cm-agent-tooltip" id="cm-agent-tooltip"></div>
      </div>

      <div id="pane-tunai" class="cm-pane active">
        <div class="cm-cards-area">
          <div class="cm-cards">
            <div class="cm-card" style="--accent-color:#10b981">
              <div class="cm-clbl">TOTAL DEPOSIT</div>
              <div class="cm-card-flex">
                <div class="cm-cval" id="cm-card-depo" style="color:#059669">Rp 0</div>
                <div class="cm-csub" id="cm-card-depo-tkt">0 Tiket</div>
              </div>
            </div>
            <div class="cm-card" style="--accent-color:#ef4444">
              <div class="cm-clbl">TOTAL WITHDRAW</div>
              <div class="cm-card-flex">
                <div class="cm-cval" id="cm-card-wd" style="color:#dc2626">Rp 0</div>
                <div class="cm-csub" id="cm-card-wd-tkt">0 Tiket</div>
              </div>
            </div>
            <div class="cm-card" style="--accent-color:#3b82f6">
              <div class="cm-clbl">PROFIT KOTOR</div>
              <div class="cm-card-flex">
                <div class="cm-cval" id="cm-card-profit-kotor" style="color:#2563eb">Rp 0</div>
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
              <div class="cm-cval" id="cm-card-qr-kotor" style="color:#0891b2">Rp 0</div>
              <div class="cm-csub-inline" id="cm-card-qr-kotor-sub">-</div>
            </div>
            <div class="cm-card" style="--accent-color:#0891b2">
              <div class="cm-clbl">QR BERSIH</div>
              <div class="cm-cval" id="cm-card-qr-bersih" style="color:#0e7490">Rp 0</div>
              <div class="cm-csub-inline" id="cm-card-qr-bersih-sub">-</div>
            </div>
            <div class="cm-card" style="--accent-color:#8b5cf6">
              <div class="cm-clbl">DEPOSIT NON QRIS</div>
              <div class="cm-cval" id="cm-card-depo-nonqr" style="color:#7c3aed">Rp 0</div>
            </div>
            <div class="cm-card" style="--accent-color:#f97316">
              <div class="cm-clbl">WD NON QRIS</div>
              <div class="cm-cval" id="cm-card-wd-nonqr" style="color:#ea580c">Rp 0</div>
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
                <button class="cm-filter-btn cm-btn-excel" onclick="exportTableToExcel('cm-table-tunai-history', 'History_Tunai')">📊 EXCEL</button>
              </div>
            </div>
            <div class="cm-subtabs">
              <button class="cm-subtab active" onclick="switchSubTab('tunai-rekap')">REKAP HARIAN</button>
              <button class="cm-subtab" onclick="switchSubTab('tunai-history')">HISTORY TRANSAKSI</button>
              <button class="cm-subtab" onclick="switchSubTab('tunai-player')">PLAYER REPORT</button>
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
          <div class="cm-subpane" id="subpane-tunai-player">
            <div class="cm-player-grid">
              <div class="cm-sec">
                <div class="cm-shead">
                  <div style="white-space:nowrap;">🔴 TOP LOSERS (HOUSE SURPLUS)</div>
                  <div style="font-size:10px; font-weight:700; color:var(--text-sub);">Diurutkan dari kalahan terbesar</div>
                </div>
                <div class="cm-tbl-area">
                  <table class="cm-tbl thin">
                    <thead><tr><th>RANK</th><th>USERNAME</th><th>DEPOSIT</th><th>WITHDRAW</th><th>FEE</th><th>NETT</th><th>NAMA REK</th><th>VIEW</th></tr></thead>
                    <tbody id="cm-table-losers"><tr><td colspan="8" style="text-align:center; color:#aaa; padding:20px;">Data belum dimuat.</td></tr></tbody>
                  </table>
                </div>
              </div>
              <div class="cm-sec">
                <div class="cm-shead">
                  <div style="white-space:nowrap;">🟢 TOP WINNERS (HOUSE DEFICIT)</div>
                  <div style="font-size:10px; font-weight:700; color:var(--text-sub);">Diurutkan dari kemenangan terbesar</div>
                </div>
                <div class="cm-tbl-area">
                  <table class="cm-tbl thin">
                    <thead><tr><th>RANK</th><th>USERNAME</th><th>DEPOSIT</th><th>WITHDRAW</th><th>FEE</th><th>NETT</th><th>NAMA REK</th><th>VIEW</th></tr></thead>
                    <tbody id="cm-table-winners"><tr><td colspan="8" style="text-align:center; color:#aaa; padding:20px;">Data belum dimuat.</td></tr></tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="pane-cb" class="cm-pane">
        <div class="cm-cards-area">
          <div class="cm-cards">
            <div class="cm-card" style="--accent-color:#3b82f6"><div class="cm-clbl">SALDO AWAL</div><div class="cm-cval" id="cm-card-cb-start" style="color:#2563eb">Rp 0</div></div>
            <div class="cm-card" style="--accent-color:#8b5cf6"><div class="cm-clbl">SALDO AKHIR</div><div class="cm-cval" id="cm-card-cb-end" style="color:#7c3aed">Rp 0</div></div>
            <div class="cm-card" style="--accent-color:#10b981"><div class="cm-clbl">TOTAL MASUK</div><div class="cm-cval" id="cm-card-cb-in" style="color:#059669">Rp 0</div></div>
            <div class="cm-card" style="--accent-color:#ef4444"><div class="cm-clbl">TOTAL KELUAR</div><div class="cm-cval" id="cm-card-cb-out" style="color:#dc2626">Rp 0</div></div>
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
                <button class="cm-filter-btn cm-btn-excel" onclick="exportTableToExcel('cm-table-cb-history', 'History_CB')">📊 EXCEL</button>
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

      <div id="pane-qris" class="cm-pane">
        <div class="cm-cards-area">
          <div class="cm-cards">
            <div class="cm-card" style="--accent-color:#f97316"><div class="cm-clbl">TOTAL UNSETTLED BALANCE</div><div class="cm-cval" id="cm-card-qris-unsettled" style="color:#ea580c">Rp 0</div><div class="cm-csub">Saldo Depo Belum Settle</div></div>
            <div class="cm-card" style="--accent-color:#10b981"><div class="cm-clbl">TOTAL BALANCE (SIAP CAIR)</div><div class="cm-cval" id="cm-card-qris-balance" style="color:#059669">Rp 0</div><div class="cm-csub">Siap Disburse / Topup WD</div></div>
            <div class="cm-card" style="--accent-color:#3b82f6"><div class="cm-clbl">TOTAL AUTO WD SALDO</div><div class="cm-cval" id="cm-card-qris-autowd" style="color:#2563eb">Rp 0</div><div class="cm-csub">Saldo untuk WD Member</div></div>
            <div class="cm-card" style="--accent-color:#8b5cf6"><div class="cm-clbl">TOTAL DISBURSE DONE</div><div class="cm-cval" id="cm-card-qris-disburse" style="color:#7c3aed">Rp 0</div><div class="cm-csub">Pencairan ke Rekening</div></div>
          </div>
        </div>
        <div class="cm-sec">
          <div class="cm-shead">
            <div style="display:flex; justify-content:space-between; align-items:center; width:100%; flex-wrap:wrap; gap:8px;">
              <div style="white-space:nowrap;">💳 QRIS PAYMENT GATEWAY REPORT</div>
              <div class="cm-subtabs">
                <button class="cm-subtab active" onclick="switchSubTab('qris-rekap')">REKAP SALDO</button>
                <button class="cm-subtab" onclick="switchSubTab('qris-disburse')">DISBURSEMENT</button>
                <button class="cm-subtab" onclick="switchSubTab('qris-topup')">AUTO WD TOPUP</button>
              </div>
            </div>
            
            <div class="cm-filters" id="qris-disburse-filters" style="width:100%; margin-top:8px;">
              <select id="filter-qris-disburse" class="cm-filter-sel">
                <option value="">Semua QRIS</option>
                <option value="OPA">OPA</option><option value="OPT">OPT</option><option value="OPZ">OPZ</option><option value="GPP">GPP</option><option value="PEN">PEN</option>
              </select>
              <button class="cm-filter-btn cm-btn-search" onclick="renderQrisDisburse()">🔍 SEARCH</button>
              <button class="cm-filter-btn cm-btn-reset" onclick="resetQrisFilters('disburse')">↺ RESET</button>
            </div>
            
            <div class="cm-filters" id="qris-topup-filters" style="width:100%; margin-top:8px;">
              <select id="filter-qris-topup" class="cm-filter-sel">
                <option value="">Semua QRIS</option>
                <option value="OPA">OPA</option><option value="OPT">OPT</option><option value="OPZ">OPZ</option><option value="GPP">GPP</option><option value="PEN">PEN</option>
              </select>
              <button class="cm-filter-btn cm-btn-search" onclick="renderQrisTopup()">🔍 SEARCH</button>
              <button class="cm-filter-btn cm-btn-reset" onclick="resetQrisFilters('topup')">↺ RESET</button>
            </div>
          </div>
          
          <div class="cm-subpane active" id="subpane-qris-rekap">
            <div class="cm-tbl-area">
              <table class="cm-tbl thin">
                <thead><tr><th>QRIS ACCOUNT</th><th>UNSETTLED BALANCE</th><th>BALANCE (SIAP CAIR)</th><th>AUTO WD SALDO</th><th>TOTAL SALDO</th><th>TOTAL DISBURSE DONE</th><th>FEE DISBURSEMENT</th><th>STATUS</th></tr></thead>
                <tbody id="cm-table-qris-rekap"><tr><td colspan="8" style="text-align:center; color:#aaa; padding:20px;">Data belum dimuat. Klik TARIK DATA.</td></tr></tbody>
              </table>
            </div>
          </div>
          
          <div class="cm-subpane" id="subpane-qris-disburse">
            <div class="cm-tbl-area">
              <table class="cm-tbl thin">
                <thead><tr><th>WAKTU SELESAI</th><th>QRIS</th><th>BANK TUJUAN</th><th>NOMINAL</th><th>FEE SETTLEMENT</th><th>STATUS</th></tr></thead>
                <tbody id="cm-table-qris-disburse"><tr><td colspan="6" style="text-align:center; color:#aaa; padding:20px;">Data belum dimuat.</td></tr></tbody>
              </table>
            </div>
          </div>
          
          <div class="cm-subpane" id="subpane-qris-topup">
            <div class="cm-tbl-area">
              <table class="cm-tbl thin">
                <thead><tr><th>WAKTU</th><th>QRIS</th><th>SALDO SEBELUM</th><th>NOMINAL TOPUP</th><th>SALDO SEKARANG</th><th>STATUS</th></tr></thead>
                <tbody id="cm-table-qris-topup"><tr><td colspan="6" style="text-align:center; color:#aaa; padding:20px;">Data belum dimuat.</td></tr></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div id="pane-winlose" class="cm-pane">
        <div class="cm-cards-area">
          <div class="cm-cards">
            <div class="cm-card" style="--accent-color:#06b6d4"><div class="cm-clbl">TOTAL TURNOVER</div><div class="cm-cval" id="cm-card-wl-stake" style="color:#0891b2">Rp 0</div></div>
            <div class="cm-card" style="--accent-color:#3b82f6"><div class="cm-clbl">TOTAL MEMBER</div><div class="cm-cval" id="cm-card-wl-member" style="color:#2563eb">Rp 0</div></div>
            <div class="cm-card" style="--accent-color:#8b5cf6"><div class="cm-clbl">TOTAL AG</div><div class="cm-cval" id="cm-card-wl-ag" style="color:#7c3aed">Rp 0</div></div>
            <div class="cm-card" style="--accent-color:#16a34a"><div class="cm-clbl">TOTAL COMPANY</div><div class="cm-cval" id="cm-card-wl-company" style="color:#16a34a">Rp 0</div></div>
          </div>
        </div>
        <div class="cm-sec">
          <div class="cm-shead">
            <div style="white-space:nowrap;">🎮 WINLOSE PROVIDER REPORT</div>
            <div class="cm-subtabs">
              <button class="cm-subtab active" onclick="switchSubTab('wl-rekap')">REKAP HARIAN</button>
              <button class="cm-subtab" onclick="switchSubTab('wl-daily')">WL PER HARI</button>
              <button class="cm-subtab" onclick="switchSubTab('wl-provider')">WL PER PROVIDER</button>
            </div>
          </div>
          
          <div class="cm-subpane active" id="subpane-wl-rekap">
            <div class="cm-tbl-area">
              <table class="cm-tbl thin">
                <thead>
                  <tr>
                    <th rowspan="2">TANGGAL</th>
                    <th rowspan="2">RG</th>
                    <th rowspan="2">ND</th>
                    <th colspan="3" class="bg-mint">FORM</th>
                    <th rowspan="2">TOTAL DEPOSIT</th>
                    <th rowspan="2">TOTAL WITHDRAW</th>
                    <th rowspan="2">DEPOSIT NETT</th>
                    <th rowspan="2">TOTAL BIAYA PROMOSI</th>
                    <th rowspan="2">ADJ. MANUAL</th>
                    <th rowspan="2">ADD BALANCE</th>
                    <th rowspan="2">TURNOVER</th>
                    <th rowspan="2">STATEMENT</th>
                    <th rowspan="2">WLB WIN</th>
                    <th rowspan="2">COMPANY WIN</th>
                  </tr>
                  <tr>
                    <th class="bg-mint">DEPO</th>
                    <th class="bg-mint">WD</th>
                    <th class="bg-mint">TOTAL</th>
                  </tr>
                </thead>
                <tbody id="cm-table-wl-rekap">
                  <tr><td colspan="16" style="text-align:center; color:#aaa; padding:20px;">Data belum dimuat. Klik TARIK DATA.</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="cm-subpane" id="subpane-wl-daily">
            <div class="cm-tbl-area">
              <table class="cm-tbl thin">
                <thead>
                  <tr>
                    <th rowspan="2">TANGGAL</th>
                    <th rowspan="2">DETAIL</th>
                    <th rowspan="2">TURNOVER</th>
                    <th colspan="4" class="bg-baby-blue">MEMBER</th>
                    <th colspan="4" class="bg-lavender">AG</th>
                    <th rowspan="2" class="bg-mint">COMPANY</th>
                  </tr>
                  <tr>
                    <th class="bg-baby-blue">WIN LOSE</th>
                    <th class="bg-baby-blue">COMM</th>
                    <th class="bg-baby-blue">BONUS</th>
                    <th class="bg-baby-blue">TOTAL</th>
                    <th class="bg-lavender">WIN LOSE</th>
                    <th class="bg-lavender">COMM</th>
                    <th class="bg-lavender">BONUS</th>
                    <th class="bg-lavender">TOTAL</th>
                  </tr>
                </thead>
                <tbody id="cm-table-wl-daily">
                  <tr><td colspan="12" style="text-align:center; color:#aaa; padding:20px;">Data belum dimuat. Klik TARIK DATA.</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="cm-subpane" id="subpane-wl-provider">
            <div class="cm-tbl-area">
              <table class="cm-tbl thin">
                <thead>
                  <tr>
                    <th rowspan="2">PROVIDER / GAMES</th>
                    <th rowspan="2">TURNOVER</th>
                    <th colspan="4" class="bg-baby-blue">MEMBER</th>
                    <th colspan="4" class="bg-lavender">AG</th>
                    <th rowspan="2" class="bg-mint">COMPANY</th>
                  </tr>
                  <tr>
                    <th class="bg-baby-blue">WIN LOSE</th>
                    <th class="bg-baby-blue">COMM</th>
                    <th class="bg-baby-blue">BONUS</th>
                    <th class="bg-baby-blue">TOTAL</th>
                    <th class="bg-lavender">WIN LOSE</th>
                    <th class="bg-lavender">COMM</th>
                    <th class="bg-lavender">BONUS</th>
                    <th class="bg-lavender">TOTAL</th>
                  </tr>
                </thead>
                <tbody id="cm-table-wl-provider">
                  <tr><td colspan="11" style="text-align:center; color:#aaa; padding:20px;">Data belum dimuat. Klik TARIK DATA.</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div class="cm-player-modal-bg" id="cm-player-modal-bg" onclick="if(event.target===this)closePlayerModal()">
      <div class="cm-player-modal">
        <div class="cm-player-modal-head">
          <div class="cm-player-modal-title" id="cm-player-modal-title">🔍 Detail Transaksi</div>
          <div class="cm-player-modal-actions"><button class="cm-player-modal-close" onclick="closePlayerModal()">✖</button></div>
        </div>
        <div class="cm-player-modal-body" id="cm-player-modal-body"></div>
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
    document.getElementById('cm-auto-sel').onchange = function() { document.getElementById('cm-auto-custom').style.display = (this.value === 'custom') ? 'block' : 'none'; };
  })();

  let _allTrx = []; let _cbRawList = []; let _dailyTunai = {}; let _dailyCB = {};
  let _autoTimer = null; 
  let _lastSummary = { tktDepo:0, depo:0, tktWd:0, wd:0, pKotor:0, pBersih:0, saldoAkhir:0, totAg:0 };
  let _currentCapturedUser = '';
  let _progressInterval = null;
  let _handlerStats = {}; let _ketStats = {};
  
  let _qrisDisburse = []; let _qrisTopup = []; 
  let _qrisBalance = { OPA:0, OPT:0, OPZ:0, GPP:0, PEN:0 }; 
  let _qrisUnsettledBalance = { OPA:0, OPT:0, OPZ:0, GPP:0, PEN:0 }; 
  let _qrisAutoWd = { OPA:0, OPT:0, OPZ:0, GPP:0, PEN:0 };
  let _winloseDailyData = [];
  let _winloseProviderData = [];
  let _dailyMemberStats = {};
  let _wlRekapExportData = [];

  const cbOutMods = ["Deposit", "Manual Deposit", "Provider Withdraw", "Deduct Credit", "Bonus Claim", "Bonus Transfer", "Rebate", "Bonus Deposit"];
  const cbInMods = ["Withdraw", "Add Credit", "Manual Withdraw", "Provider Deposit"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];

  function toDDMM_ymd(ymd) { if (!ymd) return ''; const p = ymd.split('-'); return (p.length === 3 && p[0].length === 4) ? `${p[2]}-${p[1]}-${p[0]}` : ymd; }
  function toDDMM(ymd) { const [y, m, d] = ymd.split('-'); return `${d}-${m}-${y}`; }
  function formatRupiahPlain(angka) { if (angka === 0 || isNaN(angka)) return 'Rp 0'; const neg = angka < 0; const abs = Math.abs(Math.round(angka)); return (neg ? '-Rp ' : 'Rp ') + abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function formatRupiahTable(angka) { if (angka === 0 || isNaN(angka)) return '<span style="color:#cbd5e1; display:block; text-align:center;">-</span>'; const neg = angka < 0; const abs = Math.abs(Math.round(angka)); const str = abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); return `<div class="rp-flex"><span>Rp</span><span>${neg ? '-' : ''}${str}</span></div>`; }
  function formatTK(val) { return val > 0 ? val : '<span style="color:#cbd5e1;">-</span>'; }
  function parseTrxTime(dateStr) { if (!dateStr || dateStr === '-') return new Date(0); const [d, m, y] = dateStr.split(' ')[0].split('-'); const t = dateStr.split(' ')[1] || '00:00:00'; return new Date(`${y}-${m}-${d}T${t}`); }
  
  window.toggleTheme = () => { const el = document.getElementById(ID); const btn = document.querySelector('.cm-theme-btn'); el.classList.toggle('dark'); if (el.classList.contains('dark')) { localStorage.setItem('cm-theme', 'dark'); btn.innerText = '☀️'; } else { localStorage.setItem('cm-theme', 'light'); btn.innerText = '🌙'; } };
  window.setDateRange = (type, val) => { const today = new Date(); today.setHours(0, 0, 0, 0); document.querySelectorAll('.cm-qb').forEach(b => b.classList.remove('act')); if (type !== 'month') { document.getElementById('cm-month-sel').value = ""; } if (type === 'today') { document.querySelector('.cm-qb[onclick="setDateRange(\'today\')"]').classList.add('act'); const t = getLocalYMD(today); document.getElementById('cm-start').value = t; document.getElementById('cm-end').value = t; } else if (type === 'yesterday') { document.querySelector('.cm-qb[onclick="setDateRange(\'yesterday\')"]').classList.add('act'); const yDay = new Date(today); yDay.setDate(today.getDate() - 1); const t = getLocalYMD(yDay); document.getElementById('cm-start').value = t; document.getElementById('cm-end').value = t; } else if (type === 'thisMonth') { document.querySelector('.cm-qb[onclick="setDateRange(\'thisMonth\')"]').classList.add('act'); const firstDay = new Date(today.getFullYear(), today.getMonth(), 1); document.getElementById('cm-start').value = getLocalYMD(firstDay); document.getElementById('cm-end').value = getLocalYMD(today); } else if (type === 'month' && val) { const [y, m] = val.split('-').map(Number); document.getElementById('cm-start').value = getLocalYMD(new Date(y, m - 1, 1)); document.getElementById('cm-end').value = getLocalYMD(new Date(y, m, 0)); } };

  window.switchMainTab = (tab) => {
    document.querySelectorAll('.cm-sw-btn').forEach(e => e.classList.remove('active'));
    document.querySelectorAll('.cm-pane').forEach(e => e.classList.remove('active'));
    if(tab === 'agent') { document.querySelector('.cm-sw-btn[onclick="switchMainTab(\'agent\')"]').classList.add('active'); document.getElementById('pane-agent').classList.add('active'); setTimeout(renderAgentDashboard, 50); }
    else if(tab === 'tunai') { document.querySelector('.cm-sw-btn[onclick="switchMainTab(\'tunai\')"]').classList.add('active'); document.getElementById('pane-tunai').classList.add('active'); switchSubTab('tunai-rekap'); }
    else if(tab === 'cb') { document.querySelector('.cm-sw-btn[onclick="switchMainTab(\'cb\')"]').classList.add('active'); document.getElementById('pane-cb').classList.add('active'); switchSubTab('cb-rekap'); }
    else if(tab === 'qris') { document.querySelector('.cm-sw-btn[onclick="switchMainTab(\'qris\')"]').classList.add('active'); document.getElementById('pane-qris').classList.add('active'); switchSubTab('qris-rekap'); }
    else if(tab === 'winlose') { document.querySelector('.cm-sw-btn[onclick="switchMainTab(\'winlose\')"]').classList.add('active'); document.getElementById('pane-winlose').classList.add('active'); switchSubTab('wl-rekap'); }
  };

  window.switchSubTab = (sub) => {
    document.querySelectorAll('.cm-subtab').forEach(e => e.classList.remove('active'));
    document.querySelectorAll('.cm-subpane').forEach(e => e.classList.remove('active'));
    let btn = document.querySelector(`.cm-subtab[onclick="switchSubTab('${sub}')"]`); let pane = document.getElementById(`subpane-${sub}`);
    if(btn && pane) { btn.classList.add('active'); pane.classList.add('active'); }
    let tunaiFilters = document.getElementById('tunai-filters'); let cbFilters = document.getElementById('cb-filters');
    if(tunaiFilters) tunaiFilters.style.display = (sub === 'tunai-history') ? 'flex' : 'none';
    if(cbFilters) cbFilters.style.display = (sub === 'cb-history') ? 'flex' : 'none';
    let qrisDisFilters = document.getElementById('qris-disburse-filters'); let qrisTpFilters = document.getElementById('qris-topup-filters');
    if(qrisDisFilters) qrisDisFilters.style.display = (sub === 'qris-disburse') ? 'flex' : 'none';
    if(qrisTpFilters) qrisTpFilters.style.display = (sub === 'qris-topup') ? 'flex' : 'none';
  };

  window.openGSModal = () => { document.getElementById('gs-url-inp').value = _gsUrl; document.getElementById('gs-panel-inp').value = _gsPanel; document.getElementById('gs-modal-bg').classList.add('show'); };
  window.closeGSModal = () => { document.getElementById('gs-modal-bg').classList.remove('show'); };
  window.saveGSUrl = () => { _gsUrl = document.getElementById('gs-url-inp').value.trim(); _gsPanel = document.getElementById('gs-panel-inp').value.trim(); localStorage.setItem('cm-gs-url', _gsUrl); localStorage.setItem('cm-gs-panel', _gsPanel); document.querySelector('.cm-btn-glass.cm-btn-grey').innerText = _gsUrl ? '✓ LINKED' : 'LINK GSHEET'; closeGSModal(); };

  window.toggleAuto = () => { const btn = document.getElementById('cm-auto-btn'); const sel = document.getElementById('cm-auto-sel'); let secs = 0; if (sel.value === 'custom') { const mnt = parseInt(document.getElementById('cm-auto-custom').value) || 0; secs = mnt * 60; } else { secs = parseInt(sel.value); } if (_autoTimer) { clearInterval(_autoTimer); _autoTimer = null; btn.innerText = 'START'; btn.classList.remove('active'); document.getElementById('cm-status').innerHTML += ' | <b>Auto Sync Dihentikan</b>'; } else { if (secs === 0) { alert('Pilih interval atau masukkan menit dulu!'); return; } btn.innerText = 'STOP'; btn.classList.add('active'); runLoadAndExport(true); _autoTimer = setInterval(() => runLoadAndExport(true), secs * 1000); } };
  async function runLoadAndExport(isAuto) { document.getElementById('cm-status').innerHTML = `🔄 <b>Auto Sync:</b> Tarik data & Export...`; const success = await loadData(); if (success) { await exportToSheet(isAuto); } }

  window.exportToSheet = async (isAuto) => {
    if (!_gsUrl) { alert('Setup Link Google Sheets dulu!'); return; }
    if (Object.keys(_dailyTunai).length === 0 && Object.keys(_dailyCB).length === 0) { if (!isAuto) alert('Data masih kosong! Klik TARIK DATA dulu sebelum EXPORT.'); return; }
    const btn = document.querySelector('.cm-btn-green'); const originalText = btn.innerText; btn.innerText = '⏳ Sending...'; btn.disabled = true; const statusEl = document.getElementById('cm-status'); statusEl.innerHTML = '⏳ <b>Exporting...</b> Mengirim data ke Google Sheets...';
    let tunaiRows = []; Object.keys(_dailyTunai).sort().forEach(day => { let d = _dailyTunai[day]; let dp = d.depo, wd = d.wd; let totalAgentFee = dp.totalQrFee + wd.totalQrFee; let pKotor = dp.totalGross - wd.totalGross; let pBersih = (dp.totalQrNett + dp.nonQr.v) - (wd.totalQrNett + wd.nonQr.v); tunaiRows.push([day, dp.qris.OPA ? dp.qris.OPA.c : 0, dp.qris.OPA ? dp.qris.OPA.v : 0, dp.qris.OPT ? dp.qris.OPT.c : 0, dp.qris.OPT ? dp.qris.OPT.v : 0, dp.qris.OPZ ? dp.qris.OPZ.c : 0, dp.qris.OPZ ? dp.qris.OPZ.v : 0, dp.qris.GPP ? dp.qris.GPP.c : 0, dp.qris.GPP ? dp.qris.GPP.v : 0, dp.qris.PEN ? dp.qris.PEN.c : 0, dp.qris.PEN ? dp.qris.PEN.v : 0, dp.totalQrGross, dp.totalQrNett, dp.nonQr.c, dp.nonQr.v, dp.totalTkt, dp.totalGross, wd.qris.OPA ? wd.qris.OPA.c : 0, wd.qris.OPA ? wd.qris.OPA.v : 0, wd.qris.OPT ? wd.qris.OPT.c : 0, wd.qris.OPT ? wd.qris.OPT.v : 0, wd.qris.OPZ ? wd.qris.OPZ.c : 0, wd.qris.OPZ ? wd.qris.OPZ.v : 0, wd.qris.GPP ? wd.qris.GPP.c : 0, wd.qris.GPP ? wd.qris.GPP.v : 0, wd.qris.PEN ? wd.qris.PEN.c : 0, wd.qris.PEN ? wd.qris.PEN.v : 0, wd.totalQrGross, wd.totalQrNett, wd.nonQr.c, wd.nonQr.v, wd.totalTkt, wd.totalGross, totalAgentFee, pKotor, pBersih]); });
    let cbRows = []; Object.keys(_dailyCB).sort().forEach(day => { let d = _dailyCB[day]; let totOut = Object.values(d.out).reduce((a,b) => a+b, 0); let totIn = Object.values(d.in).reduce((a,b) => a+b, 0); cbRows.push([day, d.start, d.out['Deposit']||0, d.out['Manual Deposit']||0, d.out['Provider Withdraw']||0, d.out['Deduct Credit']||0, d.out['Bonus Claim']||0, d.out['Bonus Transfer']||0, d.out['Rebate']||0, d.out['Bonus Deposit']||0, totOut, d.in['Withdraw']||0, d.in['Add Credit']||0, d.in['Manual Withdraw']||0, d.in['Provider Deposit']||0, totIn, d.end]); });
    const logData = { syncAt: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }), panel: _gsPanel || 'Unknown', dateFrom: document.getElementById('cm-start').value, dateTo: document.getElementById('cm-end').value, tktDepo: _lastSummary.tktDepo, totalDepo: _lastSummary.depo, tktWd: _lastSummary.tktWd, totalWd: _lastSummary.wd, profitKotor: _lastSummary.pKotor, profitBersih: _lastSummary.pBersih, saldoAkhir: _lastSummary.saldoAkhir };
    const payload = { tunaiRows, cbRows, wlRekapRows: _wlRekapExportData, logData, exportedAt: new Date().toISOString() };
    try { await fetch(_gsUrl, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) }); setTimeout(() => { btn.innerText = '✓ SENT!'; statusEl.innerHTML = `✅ <b>Export Berhasil!</b> Panel: ${_gsPanel} | ${isAuto ? 'Auto' : 'Manual'} Export selesai.`; }, 1000); } catch (e) { statusEl.innerHTML = '❌ <b>Export Gagal:</b> ' + e.message; console.error('Export Error:', e); } finally { setTimeout(() => { btn.innerText = originalText; btn.disabled = false; }, 4000); }
  };

  window.exportTableToExcel = (tableId, filename) => {
    if (!window.XLSX) { alert('Library Excel masih loading, coba beberapa detik lagi.'); return; }
    const table = document.getElementById(tableId); if (!table) return alert('Tabel tidak ditemukan!');
    const clone = table.cloneNode(true); clone.removeAttribute('class'); clone.removeAttribute('style'); clone.querySelectorAll('*').forEach(el => { el.removeAttribute('class'); el.removeAttribute('style'); });
    const thead = clone.querySelector('thead'); if (thead) thead.style.display = 'table-header-group';
    const wb = XLSX.utils.table_to_book(clone, { sheet: "Sheet1" }); XLSX.writeFile(wb, filename + '.xlsx');
  };

  window.resetFilters = (type) => { if (type === 'tunai') { document.getElementById('filter-tipe').value = ''; document.getElementById('filter-user').value = ''; document.getElementById('filter-handler').value = ''; document.getElementById('filter-ket').value = ''; renderTunaiHistory(); } else if (type === 'cb') { document.getElementById('filter-module').value = ''; renderCBHistory(); } };

  function getPayloadTrx(type, startVal, endVal, page) { let p = { "idusBr": 224326595, "startdate": toDDMM(startVal), "enddate": toDDMM(endVal), "level": 5, "usernameBr": "egaxbets@xbets988", "page": page, "limit": 500, "type": type, "bo": true, "st": "10" }; if(type === "1001") p.mbids = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","16","49","50","82","83","115","148","149","150","151","152","153","181","10986","10992","10003","10990","10004","10997","10013","11001","11003","11121","10988","11005","10002","10656","11642","11873","12088","11319","10568","12221","12334","10816","11135","10012","10974","11646","11316","11994"]; return p; }
  async function fetchTrx(type, startVal, endVal, label) {
    let allData = []; let page = 1; const limit = 500;
    while(true) { document.getElementById('cm-status').innerHTML = `⏳ <b>Loading ${label}...</b> Page ${page}`; const r = await fetch('/trx/historypl', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }, body: JSON.stringify(getPayloadTrx(type, startVal, endVal, page)) }); const json = await r.json(); let batch = json.trx || []; allData = allData.concat(batch); if (batch.length < limit) break; page++; }
    return { trx: allData };
  }
  
  async function fetchCB(startVal, endVal) {
    let allData = []; let page = 1; const limit = 500;
    while(true) { document.getElementById('cm-status').innerHTML = `⏳ <b>Loading Credit Balance...</b> Page ${page}`; const r = await fetch('/chbalhsls', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }, body: JSON.stringify({"startdate": toDDMM(startVal), "enddate": toDDMM(endVal), "limit": limit, "page": page, "type": "100"}) }); const text = await r.text(); let json; try { json = JSON.parse(text); } catch (e) { throw new Error("Server CB Error"); } let batch = json.cblhs || []; allData = allData.concat(batch); if (batch.length < limit) break; page++; }
    return { cblhs: allData };
  }

  async function fetchQRISData(startVal, endVal) {
    document.getElementById('cm-status').innerHTML = `⏳ <b>Loading QRIS Report...</b>`;
    const qrisAccounts = ['OPA', 'OPT', 'OPZ', 'GPP', 'PEN'];
    _qrisDisburse = []; _qrisTopup = []; 
    _qrisBalance = { OPA:0, OPT:0, OPZ:0, GPP:0, PEN:0 }; 
    _qrisUnsettledBalance = { OPA:0, OPT:0, OPZ:0, GPP:0, PEN:0 }; 
    _qrisAutoWd = { OPA:0, OPT:0, OPZ:0, GPP:0, PEN:0 };
    for (let q of qrisAccounts) {
        document.getElementById('cm-status').innerHTML = `⏳ <b>Loading QRIS ${q}...</b>`;
        try { let payloadBal = { code: q }; let resBal = await fetch('/virtualacc/disbursement/balance', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }, body: JSON.stringify(payloadBal) }); if (resBal.ok) { let jsonBal = await resBal.json(); if(jsonBal.data) { _qrisBalance[q] = parseFloat(jsonBal.data.balance || 0) * 1000; _qrisUnsettledBalance[q] = parseFloat(jsonBal.data.unsettle || 0) * 1000; } } } catch (e) { console.error(`Error Balance ${q}:`, e); }
        try { let payloadAw = { pgCode: q }; let resAw = await fetch('/autowd/checkbalance', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }, body: JSON.stringify(payloadAw) }); if (resAw.ok) { let jsonAw = await resAw.json(); if(jsonAw.data) { _qrisAutoWd[q] = parseFloat(jsonAw.data.amount || 0) * 1000; } } } catch (e) { console.error(`Error AutoWD ${q}:`, e); }
        try { let page = 1; while(true) { let payloadDis = { page: page, limit: 100, startDate: startVal, endDate: endVal, st: "10", pygtcd: q }; let resDis = await fetch('/virtualacc/disbursement/trx/history/list', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }, body: JSON.stringify(payloadDis) }); if (resDis.ok) { let jsonDis = await resDis.json(); let disData = jsonDis.disbtrxls || []; if(disData.length === 0) break; disData.forEach(item => { let bankName = item.companyBankVa?.masterBank?.name || '-'; _qrisDisburse.push({ time: item.doneTime, qris: q, bank: `${bankName} - ${item.accountName} (${item.accountNo})`, amount: parseFloat(item.amount || 0) * 1000, fee: parseFloat(item.fee || 0) * 1000, status: 'DONE' }); }); page++; if (page > 100) break; } else { break; } } } catch (e) { console.error(`Error Disbursement Trx ${q}:`, e); }
        try { let page = 1; while(true) { let payloadTp = { pgCode: q, startDate: startVal, endDate: endVal, page: page, limit: 100, agentId: 233598653 }; let resTp = await fetch('/autowd/topup/history/list', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }, body: JSON.stringify(payloadTp) }); if (resTp.ok) { let jsonTp = await resTp.json(); let tpData = jsonTp.data?.topupCreditBalanceHistoryLists || []; if(tpData.length === 0) break; tpData.forEach(item => { if (item.moduleInfo.includes('Send balance')) { _qrisTopup.push({ time: item.entryTime, qris: q, prev: parseFloat(item.startAmount || 0) * 1000, amount: parseFloat(item.updateAmount || 0) * 1000, curr: parseFloat(item.endAmount || 0) * 1000, status: 'SETTLED' }); } }); page++; if (page > 100) break; } else { break; } } } catch (e) { console.error(`Error Topup Trx ${q}:`, e); }
    }
    _qrisDisburse.sort((a, b) => parseTrxTime(a.time) - parseTrxTime(b.time));
    _qrisTopup.sort((a, b) => parseTrxTime(a.time) - parseTrxTime(b.time));
    renderQrisRekap(); renderQrisDisburse(); renderQrisTopup();
  }

  async function fetchWinloseData(startVal, endVal) {
    document.getElementById('cm-status').innerHTML = `⏳ <b>Loading Winlose Provider...</b>`;
    const payloadPeriod = { "start": toDDMM(startVal), "end": toDDMM(endVal), "idus": 233598653, "usnm": "billybet@xbets988", "level": 5, "levelbr": 6, "idpv": null, "pvnm": null, "by": 1, "pg": 1, "sort": ["asc"], "limit": "100" };
    try { const res = await fetch('/t1/report', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }, body: JSON.stringify(payloadPeriod) }); if (res.ok) { const json = await res.json(); _winloseProviderData = json.data || []; } } catch (e) { console.error('Error Winlose Period:', e); }
    document.getElementById('cm-status').innerHTML = `⏳ <b>Loading Winlose Daily...</b>`;
    _winloseDailyData = [];
    let sParts = startVal.split('-'), eParts = endVal.split('-'), start = new Date(sParts[0], sParts[1]-1, sParts[2]), end = new Date(eParts[0], eParts[1]-1, eParts[2]);
    let diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    if (diffDays > 31) { document.getElementById('cm-status').innerHTML = '❌ <b>Error:</b> Maksimal 31 hari untuk Winlose Report.'; return; }
    let loop = new Date(start);
    while (loop <= end) {
        let dd = String(loop.getDate()).padStart(2,'0'), mm = String(loop.getMonth()+1).padStart(2,'0'), yyyy = loop.getFullYear(), ddmm = `${dd}-${mm}-${yyyy}`; 
        document.getElementById('cm-status').innerHTML = `⏳ <b>Loading Winlose ${ddmm}...</b>`;
        const payload = { "start": ddmm, "end": ddmm, "idus": 233598653, "usnm": "billybet@xbets988", "level": 5, "levelbr": 6, "idpv": null, "pvnm": null, "by": 1, "pg": 1, "sort": ["asc"], "limit": "100" };
        try { const res = await fetch('/t1/report', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }, body: JSON.stringify(payload) }); if (res.ok) { const json = await res.json(); let providers = json.data || []; let dailyTotals = { date: ddmm, stake: 0, plWinlost: 0, plCommGet: 0, plBonus: 0, agWinlost: 0, agCommGive: 0, agBonus: 0, wlhCompTotal: 0, providers: providers }; providers.forEach(item => { dailyTotals.stake += parseFloat(item.stake || 0); dailyTotals.plWinlost += parseFloat(item.plWinlost || 0); dailyTotals.plCommGet += parseFloat(item.plCommGet || 0); dailyTotals.plBonus += parseFloat(item.plBonus || 0); dailyTotals.agWinlost += parseFloat(item.agWinlost || 0); dailyTotals.agCommGive += parseFloat(item.agCommGive || 0); dailyTotals.agBonus += parseFloat(item.agBonus || 0); dailyTotals.wlhCompTotal += parseFloat(item.wlhCompTotal || 0); }); _winloseDailyData.push(dailyTotals); } } catch (e) { console.error(`Error Winlose ${ddmm}:`, e); }
        loop.setDate(loop.getDate() + 1);
    }
    let totStake = 0, totPlTotal = 0, totAgTotal = 0, totCompany = 0;
    _winloseProviderData.forEach(item => { totStake += parseFloat(item.stake || 0) * 1000; totPlTotal += (parseFloat(item.plWinlost || 0) + parseFloat(item.plCommGet || 0) + parseFloat(item.plBonus || 0)) * 1000; totAgTotal += (parseFloat(item.agWinlost || 0) - parseFloat(item.agCommGive || 0) + parseFloat(item.agBonus || 0)) * 1000; totCompany += parseFloat(item.wlhCompTotal || 0) * 1000; });
    document.getElementById('cm-card-wl-stake').innerText = formatRupiahPlain(totStake); document.getElementById('cm-card-wl-member').innerText = formatRupiahPlain(totPlTotal); document.getElementById('cm-card-wl-ag').innerText = formatRupiahPlain(totAgTotal); document.getElementById('cm-card-wl-company').innerText = formatRupiahPlain(totCompany);
    _lastSummary.totAg = totAgTotal;
    renderWinloseDaily(); renderWinloseProvider();
  }

  async function fetchMemberStats(startVal, endVal) {
    document.getElementById('cm-status').innerHTML = `⏳ <b>Loading Member Stats...</b>`;
    _dailyMemberStats = {};
    let sParts = startVal.split('-'), eParts = endVal.split('-'), start = new Date(sParts[0], sParts[1]-1, sParts[2]), end = new Date(eParts[0], eParts[1]-1, eParts[2]);
    let loop = new Date(start);
    while (loop <= end) {
        let dd = String(loop.getDate()).padStart(2,'0'), mm = String(loop.getMonth()+1).padStart(2,'0'), yyyy = loop.getFullYear(), ddmm = `${dd}-${mm}-${yyyy}`;
        document.getElementById('cm-status').innerHTML = `⏳ <b>Loading Member Stats ${ddmm}...</b>`;
        try { const payloadRG = { filter: { fs: [ddmm, ddmm] }, idus: 233598653, limit: 500, page: 1, sort: { usnm: ["asc"] } }; const resRG = await fetch('/memberlist', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }, body: JSON.stringify(payloadRG) }); if (resRG.ok) { const jsonRG = await resRG.json(); if(!_dailyMemberStats[ddmm]) _dailyMemberStats[ddmm] = { rg: 0, nd: 0 }; _dailyMemberStats[ddmm].rg = jsonRG.usls ? jsonRG.usls.length : 0; } } catch(e) { console.error(`Error RG ${ddmm}:`, e); }
        try { const payloadND = { filter: { fs: [ddmm, ddmm], nonnewmb: [true] }, idus: 233598653, limit: 500, page: 1, sort: { usnm: ["asc"] } }; const resND = await fetch('/memberlist', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }, body: JSON.stringify(payloadND) }); if (resND.ok) { const jsonND = await resND.json(); if(!_dailyMemberStats[ddmm]) _dailyMemberStats[ddmm] = { rg: 0, nd: 0 }; _dailyMemberStats[ddmm].nd = jsonND.usls ? jsonND.usls.length : 0; } } catch(e) { console.error(`Error ND ${ddmm}:`, e); }
        loop.setDate(loop.getDate() + 1);
    }
  }

  // --- FUNGSI RENDER AGENT DASHBOARD ---
  window.renderAgentDashboard = function() {
    let days = Object.keys(_dailyTunai).sort();
    if (days.length === 0) return;
    
    // 1. Summary Cards
    let totNett = 0;
    days.forEach(day => { totNett += (_dailyTunai[day].pKotor || 0); });
    
    let saldoAkhir = _lastSummary.saldoAkhir || 0;
    let totQrisSaldo = 0;
    ['OPA', 'OPT', 'OPZ', 'GPP', 'PEN'].forEach(q => { totQrisSaldo += (_qrisUnsettledBalance[q]||0) + (_qrisBalance[q]||0) + (_qrisAutoWd[q]||0); });
    let totAg = _lastSummary.totAg || 0;

    document.getElementById('agent-card-1').innerHTML = `<div class="cm-clbl">TOTAL DEPOSIT NETT KOTOR</div><div class="cm-cval" style="color:${totNett>=0?'#16a34a':'#ef4444'}">${formatRupiahPlain(totNett)}</div>`;
    document.getElementById('agent-card-2').innerHTML = `<div class="cm-clbl">SALDO BALANCE AKHIR</div><div class="cm-cval" style="color:#2563eb">${formatRupiahPlain(saldoAkhir)}</div>`;
    document.getElementById('agent-card-3').innerHTML = `<div class="cm-clbl">TOTAL SALDO QRIS</div><div class="cm-cval" style="color:#7c3aed">${formatRupiahPlain(totQrisSaldo)}</div>`;
    document.getElementById('agent-card-4').innerHTML = `<div class="cm-clbl">TOTAL AG</div><div class="cm-cval" style="color:${totAg>=0?'#16a34a':'#ef4444'}">${formatRupiahPlain(totAg)}</div>`;

    // Date format helper
    const monthShort = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
    function fmtDate(day) { let p = day.split('-'); return p[0] + ' ' + monthShort[parseInt(p[1])-1]; }

    // 2. Chart A: Deposit Nett
    let maxNett = 1; days.forEach(day => { let pK = _dailyTunai[day].pKotor || 0; if (Math.abs(pK) > maxNett) maxNett = Math.abs(pK); });
    let htmlA = days.map(day => {
        let d = _dailyTunai[day]; let dp = d.depo, wd = d.wd;
        let pK = d.pKotor || 0;
        let h = Math.max(2, (Math.abs(pK) / maxNett) * 100);
        let cls = pK >= 0 ? 'nett-pos' : 'nett-neg';
        let tt = `<div style='font-weight:900; margin-bottom:4px; color:#fff;'>${day}</div><div style='color:#16a34a;'>Total Depo: ${formatRupiahPlain(dp.totalGross)}</div><div style='color:#dc2626;'>Total WD: ${formatRupiahPlain(wd.totalGross)}</div><div style='color:${pK>=0?'#16a34a':'#ef4444'};'>Depo Nett: ${formatRupiahPlain(pK)}</div>`;
        return `<div class="cm-mini-col"><div class="cm-mini-bars"><div class="cm-mini-bar ${cls}" style="height:${h}%;" data-tt="${tt.replace(/"/g, '&quot;')}"></div></div><div class="cm-mini-label">${fmtDate(day)}</div></div>`;
    }).join('');

    // 3. Chart B: WLB WIN
    let maxWlb = 1; days.forEach(day => { let wl = _winloseDailyData.find(d => d.date === day); let val = wl ? ((wl.agWinlost - wl.agCommGive + wl.agBonus) * 1000) : 0; if (Math.abs(val) > maxWlb) maxWlb = Math.abs(val); });
    let htmlB = days.map(day => {
        let wl = _winloseDailyData.find(d => d.date === day);
        let turnover = wl ? (wl.stake * 1000) : 0;
        let memberTot = wl ? ((wl.plWinlost + wl.plCommGet + wl.plBonus) * 1000) : 0;
        let agTot = wl ? ((wl.agWinlost - wl.agCommGive + wl.agBonus) * 1000) : 0;
        let company = wl ? (wl.wlhCompTotal * 1000) : 0;
        let h = Math.max(2, (Math.abs(agTot) / maxWlb) * 100);
        let cls = agTot >= 0 ? 'wlb-pos' : 'wlb-neg';
        let tt = `<div style='font-weight:900; margin-bottom:4px; color:#fff;'>${day}</div><div>Turnover: ${formatRupiahPlain(turnover)}</div><div style='color:#3b82f6;'>Member Tot: ${formatRupiahPlain(memberTot)}</div><div style='color:${agTot>=0?'#16a34a':'#ef4444'};'>AG Tot: ${formatRupiahPlain(agTot)}</div><div>Company: ${formatRupiahPlain(company)}</div>`;
        return `<div class="cm-mini-col"><div class="cm-mini-bars"><div class="cm-mini-bar ${cls}" style="height:${h}%;" data-tt="${tt.replace(/"/g, '&quot;')}"></div></div><div class="cm-mini-label">${fmtDate(day)}</div></div>`;
    }).join('');

    // 4. Chart C: RG & ND (Overlap)
    let maxRgNd = 1; days.forEach(day => { let m = _dailyMemberStats[day] || { rg: 0, nd: 0 }; if (m.rg > maxRgNd) maxRgNd = m.rg; if (m.nd > maxRgNd) maxRgNd = m.nd; });
    let htmlC = days.map(day => {
        let m = _dailyMemberStats[day] || { rg: 0, nd: 0 };
        let hRg = Math.max(2, (m.rg / maxRgNd) * 100);
        let hNd = Math.max(2, (m.nd / maxRgNd) * 100);
        let tt = `<div style='font-weight:900; margin-bottom:4px; color:#fff;'>${day}</div><div style='color:#3b82f6;'>RG: ${m.rg}</div><div style='color:#f59e0b;'>ND: ${m.nd}</div>`;
        return `<div class="cm-mini-col"><div class="cm-mini-bars-overlap"><div class="cm-mini-bar-overlap rg" style="height:${hRg}%;" data-tt="${tt.replace(/"/g, '&quot;')}"></div><div class="cm-mini-bar-overlap nd" style="height:${hNd}%;" data-tt="${tt.replace(/"/g, '&quot;')}"></div></div><div class="cm-mini-label">${fmtDate(day)}</div></div>`;
    }).join('');

    // 5. Chart D: TK Depo & WD (Overlap)
    let maxTkt = 1; days.forEach(day => { let d = _dailyTunai[day]; let dpT = d.depo?.totalTkt || 0; let wdT = d.wd?.totalTkt || 0; if (dpT > maxTkt) maxTkt = dpT; if (wdT > maxTkt) maxTkt = wdT; });
    let htmlD = days.map(day => {
        let d = _dailyTunai[day]; let dpT = d.depo?.totalTkt || 0; let wdT = d.wd?.totalTkt || 0; let allT = dpT + wdT;
        let hDepo = Math.max(2, (dpT / maxTkt) * 100);
        let hWd = Math.max(2, (wdT / maxTkt) * 100);
        let tt = `<div style='font-weight:900; margin-bottom:4px; color:#fff;'>${day}</div><div style='color:#16a34a;'>TK Depo: ${dpT}</div><div style='color:#dc2626;'>TK WD: ${wdT}</div><div>Total Tiket: ${allT}</div>`;
        return `<div class="cm-mini-col"><div class="cm-mini-bars-overlap"><div class="cm-mini-bar-overlap depo" style="height:${hDepo}%;" data-tt="${tt.replace(/"/g, '&quot;')}"></div><div class="cm-mini-bar-overlap wd" style="height:${hWd}%;" data-tt="${tt.replace(/"/g, '&quot;')}"></div></div><div class="cm-mini-label">${fmtDate(day)}</div></div>`;
    }).join('');

    document.getElementById('chart-a').innerHTML = htmlA;
    document.getElementById('chart-b').innerHTML = htmlB;
    document.getElementById('chart-c').innerHTML = htmlC;
    document.getElementById('chart-d').innerHTML = htmlD;

    // Bind Tooltip
    document.querySelectorAll('#pane-agent .cm-mini-bar, #pane-agent .cm-mini-bar-overlap').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const tt = document.getElementById('cm-agent-tooltip');
            tt.style.display = 'block';
            tt.style.left = (e.clientX + 15) + 'px';
            tt.style.top = (e.clientY + 15) + 'px';
            tt.innerHTML = el.dataset.tt;
        });
        el.addEventListener('mouseleave', () => {
            document.getElementById('cm-agent-tooltip').style.display = 'none';
        });
    });

    // 6. Stats E
    let totalDays = days.length; let sumPB = 0; let topProfit = { day: '-', val: -Infinity }; let bottomProfit = { day: '-', val: Infinity };
    days.forEach(day => { let pB = _dailyTunai[day].pKotor || 0; sumPB += pB; if (pB > topProfit.val) topProfit = { day: day, val: pB }; if (pB < bottomProfit.val) bottomProfit = { day: day, val: pB }; });
    let avgPB = sumPB / totalDays;
    document.getElementById('stat-e').innerHTML = `<div class="cm-stat-row"><span class="cm-stat-label">Total Hari</span><span class="cm-stat-val">${totalDays} Hari</span></div><div class="cm-stat-row"><span class="cm-stat-label">Rata-rata Profit</span><span class="cm-stat-val ${avgPB >= 0 ? 'pos' : 'neg'}">${formatRupiahPlain(avgPB)}</span></div><div class="cm-stat-row"><span class="cm-stat-label">Top Profit (Tgl)</span><span class="cm-stat-val pos">${topProfit.day}</span></div><div class="cm-stat-row"><span class="cm-stat-label">Nominal Top</span><span class="cm-stat-val pos">${formatRupiahPlain(topProfit.val)}</span></div><div class="cm-stat-row"><span class="cm-stat-label">Bottom Profit (Tgl)</span><span class="cm-stat-val neg">${bottomProfit.day}</span></div><div class="cm-stat-row"><span class="cm-stat-label">Nominal Bottom</span><span class="cm-stat-val neg">${formatRupiahPlain(bottomProfit.val)}</span></div>`;

    // 7. Stats F
    let sumWlb = 0; let topWlb = { day: '-', val: -Infinity }; let bottomWlb = { day: '-', val: Infinity };
    days.forEach(day => { let wl = _winloseDailyData.find(d => d.date === day); let val = wl ? ((wl.agWinlost - wl.agCommGive + wl.agBonus) * 1000) : 0; sumWlb += val; if (val > topWlb.val) topWlb = { day: day, val: val }; if (val < bottomWlb.val) bottomWlb = { day: day, val: val }; });
    let avgWlb = sumWlb / totalDays;
    document.getElementById('stat-f').innerHTML = `<div class="cm-stat-row"><span class="cm-stat-label">Total Hari</span><span class="cm-stat-val">${totalDays} Hari</span></div><div class="cm-stat-row"><span class="cm-stat-label">Rata-rata WLB</span><span class="cm-stat-val ${avgWlb >= 0 ? 'pos' : 'neg'}">${formatRupiahPlain(avgWlb)}</span></div><div class="cm-stat-row"><span class="cm-stat-label">Top WLB (Tgl)</span><span class="cm-stat-val pos">${topWlb.day}</span></div><div class="cm-stat-row"><span class="cm-stat-label">Nominal Top</span><span class="cm-stat-val pos">${formatRupiahPlain(topWlb.val)}</span></div><div class="cm-stat-row"><span class="cm-stat-label">Bottom WLB (Tgl)</span><span class="cm-stat-val neg">${bottomWlb.day}</span></div><div class="cm-stat-row"><span class="cm-stat-label">Nominal Bottom</span><span class="cm-stat-val neg">${formatRupiahPlain(bottomWlb.val)}</span></div>`;

    // 8. Stats G
    let handlerRows = Object.keys(_handlerStats).sort((a,b) => ((_handlerStats[b].depo + _handlerStats[b].wd) - (_handlerStats[a].depo + _handlerStats[a].wd))).map(h => { let d = _handlerStats[h].depo; let w = _handlerStats[h].wd; return `<tr><td>${h}</td><td class="num-d ${d === 0 ? 'num-0' : ''}">${d || 0}</td><td class="num-w ${w === 0 ? 'num-0' : ''}">${w || 0}</td></tr>`; }).join('');
    document.getElementById('stat-g').innerHTML = `<table class="cm-stats-table"><thead><tr><th>NAMA</th><th style="text-align:right;">DEPO</th><th style="text-align:right;">WD</th></tr></thead><tbody>${handlerRows || '<tr><td colspan="3" style="text-align:center; color:#aaa;">No Data</td></tr>'}</tbody></table>`;

    // 9. Stats H
    let ketRows = Object.keys(_ketStats).sort((a,b) => ((_ketStats[b].depo + _ketStats[b].wd) - (_ketStats[a].depo + _ketStats[a].wd))).map(k => { let d = _ketStats[k].depo; let w = _ketStats[k].wd; return `<tr><td>${k}</td><td class="num-d ${d === 0 ? 'num-0' : ''}">${d || 0}</td><td class="num-w ${w === 0 ? 'num-0' : ''}">${w || 0}</td></tr>`; }).join('');
    document.getElementById('stat-h').innerHTML = `<table class="cm-stats-table"><thead><tr><th>METODE</th><th style="text-align:right;">DEPO</th><th style="text-align:right;">WD</th></tr></thead><tbody>${ketRows || '<tr><td colspan="3" style="text-align:center; color:#aaa;">No Data</td></tr>'}</tbody></table>`;
  };

  window.renderWinloseRekap = function() {
    let totRG = 0, totND = 0, totFormDepo = 0, totFormWd = 0, totFormTotal = 0;
    let totDepo = 0, totWd = 0, totNett = 0;
    let totPromosi = 0, totAdjManual = 0, totAddBalance = 0;
    let totTurnover = 0, totStatement = 0, totWlbWin = 0, totCompanyWin = 0;
    let html = '';
    _wlRekapExportData = [];
    let allDates = new Set([...Object.keys(_dailyTunai), ..._winloseDailyData.map(d => d.date), ...Object.keys(_dailyCB), ...Object.keys(_dailyMemberStats)]);
    let sortedDates = Array.from(allDates).sort();
    if (sortedDates.length === 0) { html = '<tr><td colspan="16" style="text-align:center; color:#aaa; padding:20px;">Tidak ada data untuk periode ini.</td></tr>'; } 
    else {
        sortedDates.forEach(day => {
            let tunai = _dailyTunai[day] || {}; let dp = tunai.depo || {}; let wd = tunai.wd || {};
            let cb = _dailyCB[day] || { out: {}, in: {} }; let wl = _winloseDailyData.find(d => d.date === day) || {};
            let mStats = _dailyMemberStats[day] || { rg: 0, nd: 0 };
            let rg = mStats.rg, nd = mStats.nd;
            let formDepo = dp.totalTkt || 0, formWd = wd.totalTkt || 0, formTotal = formDepo + formWd;
            let totalDepo = dp.totalGross || 0, totalWd = wd.totalGross || 0, depNett = tunai.pKotor || (totalDepo - totalWd);
            let promosi = (cb.out['Bonus Claim'] || 0) + (cb.in['Bonus Claim'] || 0) + (cb.out['Bonus Transfer'] || 0) + (cb.in['Bonus Transfer'] || 0) + (cb.out['Rebate'] || 0) + (cb.in['Rebate'] || 0) + (cb.out['Bonus Deposit'] || 0) + (cb.in['Bonus Deposit'] || 0);
            let adjManual = (cb.out['Manual Deposit'] || 0) + (cb.in['Manual Deposit'] || 0) + (cb.out['Manual Withdraw'] || 0) + (cb.in['Manual Withdraw'] || 0);
            let addBalance = (cb.out['Add Credit'] || 0) + (cb.in['Add Credit'] || 0);
            let turnover = (wl.stake || 0) * 1000;
            let statement = ((wl.plWinlost || 0) + (wl.plCommGet || 0) + (wl.plBonus || 0)) * -1000; 
            let wlbWin = ((wl.agWinlost || 0) - (wl.agCommGive || 0) + (wl.agBonus || 0)) * 1000;
            let companyWin = (wl.wlhCompTotal || 0) * 1000;
            _wlRekapExportData.push([rg, nd, formDepo, formWd, formTotal, totalDepo, totalWd, depNett, promosi, adjManual, addBalance, turnover, statement, wlbWin, companyWin]);
            totRG += rg; totND += nd; totFormDepo += formDepo; totFormWd += formWd; totFormTotal += formTotal;
            totDepo += totalDepo; totWd += totalWd; totNett += depNett;
            totPromosi += promosi; totAdjManual += adjManual; totAddBalance += addBalance;
            totTurnover += turnover; totStatement += statement; totWlbWin += wlbWin; totCompanyWin += companyWin;
            let depNettColor = depNett >= 0 ? '#16a34a' : '#ef4444';
            let statementColor = statement >= 0 ? '#16a34a' : '#ef4444';
            html += `<tr><td style="font-weight:800;">${day}</td><td>${rg || 0}</td><td>${nd || 0}</td><td>${formatTK(formDepo)}</td><td>${formatTK(formWd)}</td><td>${formatTK(formTotal)}</td><td>${formatRupiahTable(totalDepo)}</td><td>${formatRupiahTable(totalWd)}</td><td style="color:${depNettColor}; font-weight:700;">${formatRupiahTable(depNett)}</td><td>${formatRupiahTable(promosi)}</td><td>${formatRupiahTable(adjManual)}</td><td>${formatRupiahTable(addBalance)}</td><td>${formatRupiahTable(turnover)}</td><td style="color:${statementColor}; font-weight:700;">${formatRupiahTable(statement)}</td><td style="font-weight:700; color:${wlbWin >= 0 ? '#16a34a' : '#ef4444'};">${formatRupiahTable(wlbWin)}</td><td style="font-weight:900; color:${companyWin >= 0 ? '#16a34a' : '#ef4444'};">${formatRupiahTable(companyWin)}</td></tr>`;
        });
        let totNettColor = totNett >= 0 ? '#16a34a' : '#ef4444';
        let totStatementColor = totStatement >= 0 ? '#16a34a' : '#ef4444';
        html += `<tr class="row-total"><td>TOTAL</td><td>${totRG}</td><td>${totND}</td><td>${formatTK(totFormDepo)}</td><td>${formatTK(totFormWd)}</td><td>${formatTK(totFormTotal)}</td><td>${formatRupiahTable(totDepo)}</td><td>${formatRupiahTable(totWd)}</td><td style="color:${totNettColor}; font-weight:900;">${formatRupiahTable(totNett)}</td><td>${formatRupiahTable(totPromosi)}</td><td>${formatRupiahTable(totAdjManual)}</td><td>${formatRupiahTable(totAddBalance)}</td><td>${formatRupiahTable(totTurnover)}</td><td style="color:${totStatementColor}; font-weight:900;">${formatRupiahTable(totStatement)}</td><td style="color:${totWlbWin >= 0 ? '#16a34a' : '#ef4444'};">${formatRupiahTable(totWlbWin)}</td><td style="color:${totCompanyWin >= 0 ? '#16a34a' : '#ef4444'};">${formatRupiahTable(totCompanyWin)}</td></tr>`;
    }
    document.getElementById('cm-table-wl-rekap').innerHTML = html;
  };

  window.renderWinloseDaily = function() {
    let totStake = 0, totPlWinlost = 0, totPlCommGet = 0, totPlBonus = 0, totPlTotal = 0;
    let totAgWinlost = 0, totAgCommGive = 0, totAgBonus = 0, totAgTotal = 0, totWlhCompTotal = 0;
    let html = '';
    if (_winloseDailyData.length === 0) { html = '<tr><td colspan="12" style="text-align:center; color:#aaa; padding:20px;">Tidak ada data winlose untuk periode ini.</td></tr>'; } 
    else {
        _winloseDailyData.forEach(item => {
            let stake = item.stake * 1000, plWinlost = item.plWinlost * 1000, plCommGet = item.plCommGet * 1000, plBonus = item.plBonus * 1000;
            let plTotal = (item.plWinlost + item.plCommGet + item.plBonus) * 1000; 
            let agWinlost = item.agWinlost * 1000, agCommGive = item.agCommGive * 1000, agBonus = item.agBonus * 1000;
            let agTotal = (item.agWinlost - item.agCommGive + item.agBonus) * 1000; 
            let wlhCompTotal = item.wlhCompTotal * 1000;
            totStake += stake; totPlWinlost += plWinlost; totPlCommGet += plCommGet; totPlBonus += plBonus; totPlTotal += plTotal;
            totAgWinlost += agWinlost; totAgCommGive += agCommGive; totAgBonus += agBonus; totAgTotal += agTotal; totWlhCompTotal += wlhCompTotal;
            html += `<tr><td style="font-weight:800;">${item.date}</td><td style="text-align:center;"><button class="cm-view-btn" onclick="viewDailyWinlose('${item.date}')">👁</button></td><td>${formatRupiahTable(stake)}</td><td>${formatRupiahTable(plWinlost)}</td><td>${formatRupiahTable(plCommGet)}</td><td>${formatRupiahTable(plBonus)}</td><td style="font-weight:700; color:${plTotal >= 0 ? '#16a34a' : '#ef4444'};">${formatRupiahTable(plTotal)}</td><td>${formatRupiahTable(agWinlost)}</td><td>${formatRupiahTable(agCommGive)}</td><td>${formatRupiahTable(agBonus)}</td><td style="font-weight:700; color:${agTotal >= 0 ? '#16a34a' : '#ef4444'};">${formatRupiahTable(agTotal)}</td><td style="font-weight:900; color:${wlhCompTotal >= 0 ? '#16a34a' : '#ef4444'};">${formatRupiahTable(wlhCompTotal)}</td></tr>`;
        });
        html += `<tr class="row-total"><td>TOTAL</td><td></td><td>${formatRupiahTable(totStake)}</td><td>${formatRupiahTable(totPlWinlost)}</td><td>${formatRupiahTable(totPlCommGet)}</td><td>${formatRupiahTable(totPlBonus)}</td><td style="color:${totPlTotal >= 0 ? '#16a34a' : '#ef4444'};">${formatRupiahTable(totPlTotal)}</td><td>${formatRupiahTable(totAgWinlost)}</td><td>${formatRupiahTable(totAgCommGive)}</td><td>${formatRupiahTable(totAgBonus)}</td><td style="color:${totAgTotal >= 0 ? '#16a34a' : '#ef4444'};">${formatRupiahTable(totAgTotal)}</td><td style="color:${totWlhCompTotal >= 0 ? '#16a34a' : '#ef4444'};">${formatRupiahTable(totWlhCompTotal)}</td></tr>`;
    }
    document.getElementById('cm-table-wl-daily').innerHTML = html;
  }

  window.renderWinloseProvider = function() {
    let totStake = 0, totPlWinlost = 0, totPlCommGet = 0, totPlBonus = 0, totPlTotal = 0;
    let totAgWinlost = 0, totAgCommGive = 0, totAgBonus = 0, totAgTotal = 0, totWlhCompTotal = 0;
    let html = '';
    if (_winloseProviderData.length === 0) { html = '<tr><td colspan="11" style="text-align:center; color:#aaa; padding:20px;">Tidak ada data winlose untuk periode ini.</td></tr>'; } 
    else {
        _winloseProviderData.forEach(item => {
            let stake = parseFloat(item.stake || 0) * 1000, plWinlost = parseFloat(item.plWinlost || 0) * 1000, plCommGet = parseFloat(item.plCommGet || 0) * 1000, plBonus = parseFloat(item.plBonus || 0) * 1000;
            let plTotal = (parseFloat(item.plWinlost || 0) + parseFloat(item.plCommGet || 0) + parseFloat(item.plBonus || 0)) * 1000;
            let agWinlost = parseFloat(item.agWinlost || 0) * 1000, agCommGive = parseFloat(item.agCommGive || 0) * 1000, agBonus = parseFloat(item.agBonus || 0) * 1000;
            let agTotal = (parseFloat(item.agWinlost || 0) - parseFloat(item.agCommGive || 0) + parseFloat(item.agBonus || 0)) * 1000; 
            let wlhCompTotal = parseFloat(item.wlhCompTotal || 0) * 1000;
            totStake += stake; totPlWinlost += plWinlost; totPlCommGet += plCommGet; totPlBonus += plBonus; totPlTotal += plTotal;
            totAgWinlost += agWinlost; totAgCommGive += agCommGive; totAgBonus += agBonus; totAgTotal += agTotal; totWlhCompTotal += wlhCompTotal;
            html += `<tr><td style="text-align:left; font-weight:800; text-transform:capitalize;">${item.pvnm || '-'}</td><td>${formatRupiahTable(stake)}</td><td>${formatRupiahTable(plWinlost)}</td><td>${formatRupiahTable(plCommGet)}</td><td>${formatRupiahTable(plBonus)}</td><td style="font-weight:700; color:${plTotal >= 0 ? '#16a34a' : '#ef4444'};">${formatRupiahTable(plTotal)}</td><td>${formatRupiahTable(agWinlost)}</td><td>${formatRupiahTable(agCommGive)}</td><td>${formatRupiahTable(agBonus)}</td><td style="font-weight:700; color:${agTotal >= 0 ? '#16a34a' : '#ef4444'};">${formatRupiahTable(agTotal)}</td><td style="font-weight:900; color:${wlhCompTotal >= 0 ? '#16a34a' : '#ef4444'};">${formatRupiahTable(wlhCompTotal)}</td></tr>`;
        });
        html += `<tr class="row-total"><td>TOTAL</td><td>${formatRupiahTable(totStake)}</td><td>${formatRupiahTable(totPlWinlost)}</td><td>${formatRupiahTable(totPlCommGet)}</td><td>${formatRupiahTable(totPlBonus)}</td><td style="color:${totPlTotal >= 0 ? '#16a34a' : '#ef4444'};">${formatRupiahTable(totPlTotal)}</td><td>${formatRupiahTable(totAgWinlost)}</td><td>${formatRupiahTable(totAgCommGive)}</td><td>${formatRupiahTable(totAgBonus)}</td><td style="color:${totAgTotal >= 0 ? '#16a34a' : '#ef4444'};">${formatRupiahTable(totAgTotal)}</td><td style="color:${totWlhCompTotal >= 0 ? '#16a34a' : '#ef4444'};">${formatRupiahTable(totWlhCompTotal)}</td></tr>`;
    }
    document.getElementById('cm-table-wl-provider').innerHTML = html;
  }

  window.viewDailyWinlose = (dateStr) => {
    let data = _winloseDailyData.find(d => d.date === dateStr); if (!data) return;
    document.getElementById('cm-player-modal-title').innerHTML = `📅 Detail Winlose Provider: <span style="color:#3b82f6;">${dateStr}</span>`;
    const body = document.getElementById('cm-player-modal-body');
    let totStake = 0, totPlWinlost = 0, totPlCommGet = 0, totPlBonus = 0, totPlTotal = 0;
    let totAgWinlost = 0, totAgCommGive = 0, totAgBonus = 0, totAgTotal = 0, totWlhCompTotal = 0;
    let html = `<div class="cm-player-modal-tbl-wrap" style="padding-top:16px;"><table class="cm-tbl thin"><thead><tr><th rowspan="2">PROVIDER / GAME</th><th rowspan="2">TURNOVER</th><th colspan="4" class="bg-baby-blue">MEMBER</th><th colspan="4" class="bg-lavender">AG</th><th rowspan="2" class="bg-mint">COMPANY</th></tr><tr><th class="bg-baby-blue">WIN LOSE</th><th class="bg-baby-blue">COMM</th><th class="bg-baby-blue">BONUS</th><th class="bg-baby-blue">TOTAL</th><th class="bg-lavender">WIN LOSE</th><th class="bg-lavender">COMM</th><th class="bg-lavender">BONUS</th><th class="bg-lavender">TOTAL</th></tr></thead><tbody>`;
    if (data.providers.length === 0) { html += '<tr><td colspan="11" style="text-align:center; color:#aaa; padding:20px;">Tidak ada data provider.</td></tr>'; } 
    else {
        data.providers.forEach(item => {
            let stake = parseFloat(item.stake || 0) * 1000, plWinlost = parseFloat(item.plWinlost || 0) * 1000, plCommGet = parseFloat(item.plCommGet || 0) * 1000, plBonus = parseFloat(item.plBonus || 0) * 1000;
            let plTotal = (parseFloat(item.plWinlost || 0) + parseFloat(item.plCommGet || 0) + parseFloat(item.plBonus || 0)) * 1000;
            let agWinlost = parseFloat(item.agWinlost || 0) * 1000, agCommGive = parseFloat(item.agCommGive || 0) * 1000, agBonus = parseFloat(item.agBonus || 0) * 1000;
            let agTotal = (parseFloat(item.agWinlost || 0) - parseFloat(item.agCommGive || 0) + parseFloat(item.agBonus || 0)) * 1000; 
            let wlhCompTotal = parseFloat(item.wlhCompTotal || 0) * 1000;
            totStake += stake; totPlWinlost += plWinlost; totPlCommGet += plCommGet; totPlBonus += plBonus; totPlTotal += plTotal;
            totAgWinlost += agWinlost; totAgCommGive += agCommGive; totAgBonus += agBonus; totAgTotal += agTotal; totWlhCompTotal += wlhCompTotal;
            html += `<tr><td style="text-align:left; font-weight:800; text-transform:capitalize;">${item.pvnm || '-'}</td><td>${formatRupiahTable(stake)}</td><td>${formatRupiahTable(plWinlost)}</td><td>${formatRupiahTable(plCommGet)}</td><td>${formatRupiahTable(plBonus)}</td><td style="font-weight:700; color:${plTotal >= 0 ? '#16a34a' : '#ef4444'};">${formatRupiahTable(plTotal)}</td><td>${formatRupiahTable(agWinlost)}</td><td>${formatRupiahTable(agCommGive)}</td><td>${formatRupiahTable(agBonus)}</td><td style="font-weight:700; color:${agTotal >= 0 ? '#16a34a' : '#ef4444'};">${formatRupiahTable(agTotal)}</td><td style="font-weight:900; color:${wlhCompTotal >= 0 ? '#16a34a' : '#ef4444'};">${formatRupiahTable(wlhCompTotal)}</td></tr>`;
        });
        html += `<tr class="row-total"><td>TOTAL</td><td>${formatRupiahTable(totStake)}</td><td>${formatRupiahTable(totPlWinlost)}</td><td>${formatRupiahTable(totPlCommGet)}</td><td>${formatRupiahTable(totPlBonus)}</td><td style="color:${totPlTotal >= 0 ? '#16a34a' : '#ef4444'};">${formatRupiahTable(totPlTotal)}</td><td>${formatRupiahTable(totAgWinlost)}</td><td>${formatRupiahTable(totAgCommGive)}</td><td>${formatRupiahTable(totAgBonus)}</td><td style="color:${totAgTotal >= 0 ? '#16a34a' : '#ef4444'};">${formatRupiahTable(totAgTotal)}</td><td style="color:${totWlhCompTotal >= 0 ? '#16a34a' : '#ef4444'};">${formatRupiahTable(totWlhCompTotal)}</td></tr>`;
    }
    html += `</tbody></table></div>`;
    body.innerHTML = html;
    document.getElementById('cm-player-modal-bg').classList.add('show');
  }

  window.resetQrisFilters = (type) => { if(type === 'disburse') { document.getElementById('filter-qris-disburse').value = ''; renderQrisDisburse(); } else if(type === 'topup') { document.getElementById('filter-qris-topup').value = ''; renderQrisTopup(); } };

  function renderQrisRekap() {
    let totUnsettled = 0, totBalance = 0, totAutoWd = 0, totDisburse = 0, totFeeDisburse = 0, totTotalSaldo = 0;
    let htmlRekap = '';
    ['OPA', 'OPT', 'OPZ', 'GPP', 'PEN'].forEach(q => {
      let unsettled = _qrisUnsettledBalance[q] || 0, balance = _qrisBalance[q] || 0, autowd = _qrisAutoWd[q] || 0;
      let totalSaldo = unsettled + balance + autowd;
      let disburse = _qrisDisburse.filter(d => d.qris === q).reduce((a,b) => a+b.amount, 0);
      let feeDisburse = _qrisDisburse.filter(d => d.qris === q).reduce((a,b) => a+b.fee, 0);
      totUnsettled += unsettled; totBalance += balance; totAutoWd += autowd; totDisburse += disburse; totFeeDisburse += feeDisburse; totTotalSaldo += totalSaldo;
      htmlRekap += `<tr><td><b>${q}</b></td><td>${formatRupiahTable(unsettled)}</td><td>${formatRupiahTable(balance)}</td><td>${formatRupiahTable(autowd)}</td><td>${formatRupiahTable(totalSaldo)}</td><td>${formatRupiahTable(disburse)}</td><td>${formatRupiahTable(feeDisburse)}</td><td><span class="badge-depo">ACTIVE</span></td></tr>`;
    });
    htmlRekap += `<tr class="row-total"><td>TOTAL</td><td>${formatRupiahTable(totUnsettled)}</td><td>${formatRupiahTable(totBalance)}</td><td>${formatRupiahTable(totAutoWd)}</td><td>${formatRupiahTable(totTotalSaldo)}</td><td>${formatRupiahTable(totDisburse)}</td><td>${formatRupiahTable(totFeeDisburse)}</td><td></td></tr>`;
    document.getElementById('cm-table-qris-rekap').innerHTML = htmlRekap;
    document.getElementById('cm-card-qris-unsettled').innerText = formatRupiahPlain(totUnsettled);
    document.getElementById('cm-card-qris-balance').innerText = formatRupiahPlain(totBalance);
    document.getElementById('cm-card-qris-autowd').innerText = formatRupiahPlain(totAutoWd);
    document.getElementById('cm-card-qris-disburse').innerText = formatRupiahPlain(totDisburse);
  }

  window.renderQrisDisburse = function() {
    let fQris = document.getElementById('filter-qris-disburse').value;
    let filtered = _qrisDisburse.filter(item => !fQris || item.qris === fQris);
    let totAmount = filtered.reduce((a,b) => a+b.amount, 0), totFee = filtered.reduce((a,b) => a+b.fee, 0);
    let html = filtered.map(d => `<tr><td>${d.time}</td><td><b>${d.qris}</b></td><td style="text-align:left; max-width:300px;">${d.bank}</td><td>${formatRupiahTable(d.amount)}</td><td>${formatRupiahTable(d.fee)}</td><td><span class="badge-depo">${d.status}</span></td></tr>`).join('');
    html += `<tr class="row-total"><td colspan="3">TOTAL FILTER</td><td>${formatRupiahTable(totAmount)}</td><td>${formatRupiahTable(totFee)}</td><td></td></tr>`;
    document.getElementById('cm-table-qris-disburse').innerHTML = html || '<tr><td colspan="6" style="text-align:center; color:#aaa;">No Data</td></tr>';
  }

  window.renderQrisTopup = function() {
    let fQris = document.getElementById('filter-qris-topup').value;
    let filtered = _qrisTopup.filter(item => !fQris || item.qris === fQris);
    let totAmount = filtered.reduce((a,b) => a+b.amount, 0), lastCurr = filtered.length > 0 ? filtered[filtered.length-1].curr : 0;
    let html = filtered.map(t => `<tr><td>${t.time}</td><td><b>${t.qris}</b></td><td>${formatRupiahTable(t.prev)}</td><td>${formatRupiahTable(t.amount)}</td><td>${formatRupiahTable(t.curr)}</td><td><span class="badge-depo">${t.status}</span></td></tr>`).join('');
    html += `<tr class="row-total"><td colspan="3">TOTAL FILTER</td><td>${formatRupiahTable(totAmount)}</td><td>${formatRupiahTable(lastCurr)}</td><td></td></tr>`;
    document.getElementById('cm-table-qris-topup').innerHTML = html || '<tr><td colspan="6" style="text-align:center; color:#aaa;">No Data</td></tr>';
  }

  async function loadData() {
    const startVal = document.getElementById('cm-start').value; const endVal = document.getElementById('cm-end').value; const statusEl = document.getElementById('cm-status'); const loader = document.getElementById('cm-loader-overlay'); const percentEl = document.getElementById('cm-loader-percent'); const fillEl = document.getElementById('cm-loader-ring-fill'); const circumference = 2 * Math.PI * 40;
    if (!startVal || !endVal) { alert('Pilih tanggal!'); return false; }
    if(loader) loader.style.display = 'flex'; statusEl.innerHTML = '⏳ <b>Loading...</b> Mengambil data...';
    let progress = 0; fillEl.style.strokeDasharray = circumference; fillEl.style.strokeDashoffset = circumference; percentEl.innerText = '0%'; fillEl.style.stroke = '#3b82f6'; percentEl.style.color = '#3b82f6';
    if (_progressInterval) clearInterval(_progressInterval);
    _progressInterval = setInterval(() => { progress += Math.random() * 3 + 1; if (progress >= 99.5) progress = 99.5; let offset = circumference - (progress / 100) * circumference; fillEl.style.strokeDashoffset = offset; percentEl.innerText = Math.floor(progress) + '%'; let color = '#3b82f6'; if (progress > 33 && progress <= 66) color = '#8b5cf6'; else if (progress > 66) color = '#f97316'; fillEl.style.stroke = color; percentEl.style.color = color; }, 100);

    try {
      const [depoJson, wdJson, cbJson] = await Promise.all([ fetchTrx("1001", startVal, endVal, "Deposit"), fetchTrx("1002", startVal, endVal, "Withdraw"), fetchCB(startVal, endVal).catch(() => null) ]);
      await fetchQRISData(startVal, endVal); await fetchWinloseData(startVal, endVal); await fetchMemberStats(startVal, endVal);

      let listDepo = depoJson.trx || []; let listWd = wdJson.trx || []; let listCb = cbJson ? (cbJson.cblhs || []) : [];
      _allTrx = []; _dailyTunai = {}; _dailyCB = {}; _cbRawList = listCb; _handlerStats = {}; _ketStats = {};
      const parseHandler = (raw) => { if(!raw) return '-'; let h = raw.includes('@') ? raw.split('@')[0] : raw; return h.toLowerCase() === 'xbets988' ? 'SISTEM' : h; };
      let totalDepoGross = 0, totalWdGross = 0, totalDepoFee = 0, totalWdFee = 0, qrKotor = 0, qrBersih = 0, depoNonQris = 0, wdNonQris = 0, qrKotorDetails = {}, qrBersihDetails = {}, feeDetails = {};
      const initDayObj = () => ({ depo: { qris: { OPA:{c:0,v:0}, OPT:{c:0,v:0}, OPZ:{c:0,v:0}, GPP:{c:0,v:0}, PEN:{c:0,v:0} }, nonQr: {c:0, v:0}, totalQrGross: 0, totalQrNett: 0, totalQrFee: 0, totalGross: 0, totalTkt: 0 }, wd: { qris: { OPA:{c:0,v:0}, OPT:{c:0,v:0}, OPZ:{c:0,v:0}, GPP:{c:0,v:0}, PEN:{c:0,v:0} }, nonQr: {c:0, v:0}, totalQrGross: 0, totalQrNett: 0, totalQrFee: 0, totalGross: 0, totalTkt: 0 } });
      let totTunai = initDayObj(); let totTunaiAgentFee = 0, totTunaiPK = 0, totTunaiPB = 0;

      listDepo.forEach(item => {
        let nominal = parseFloat(item.amt) * 1000;
        let isQris = item.cmb && item.cmb.bank && item.cmb.bank.name.toLowerCase() === 'qris';
        let qrisType = isQris ? (item.cmb.accno || 'QRIS').toUpperCase() : null;
        let feeRate = 0; if (isQris) { if (qrisType === 'OPT' || qrisType === 'OPZ') { feeRate = 0.01; } else { feeRate = 0.011; } }
        let fee = isQris ? Math.round(nominal * feeRate) : 0;
        let nett = nominal - fee; totalDepoGross += nominal; totalDepoFee += fee;
        let rawDay = item.prctm.split(' ')[0]; let day = toDDMM_ymd(rawDay);
        if(!_dailyTunai[day]) _dailyTunai[day] = initDayObj();
        let d = _dailyTunai[day]; d.depo.totalGross += nominal; d.depo.totalTkt++;
        totTunai.depo.totalGross += nominal; totTunai.depo.totalTkt++;
        if (isQris) {
            qrKotor += nominal; qrBersih += nett; d.depo.totalQrGross += nominal; d.depo.totalQrNett += nett; d.depo.totalQrFee += fee;
            totTunai.depo.totalQrGross += nominal; totTunai.depo.totalQrNett += nett; totTunai.depo.totalQrFee += fee;
            qrKotorDetails[qrisType] = (qrKotorDetails[qrisType] || 0) + nominal; qrBersihDetails[qrisType] = (qrBersihDetails[qrisType] || 0) + nett; feeDetails[qrisType] = (feeDetails[qrisType] || 0) + fee;
            if(!d.depo.qris[qrisType]) d.depo.qris[qrisType] = {c:0, v:0}; if(!totTunai.depo.qris[qrisType]) totTunai.depo.qris[qrisType] = {c:0, v:0};
            d.depo.qris[qrisType].c++; d.depo.qris[qrisType].v += nominal; totTunai.depo.qris[qrisType].c++; totTunai.depo.qris[qrisType].v += nominal;
        } else { depoNonQris += nominal; d.depo.nonQr.c++; d.depo.nonQr.v += nominal; totTunai.depo.nonQr.c++; totTunai.depo.nonQr.v += nominal; }
        let n = item.cmb && item.cmb.bank ? item.cmb.bank.name : '-'; let a = item.cmb && item.cmb.accno ? item.cmb.accno : ''; let an = item.cmb && item.cmb.accnm ? item.cmb.accnm : '';
        let ketText = '-'; if (n !== '-') { ketText = n.toLowerCase() === 'qris' ? `${n} (${a})` : `${n} - ${an}`; }
        let handler = parseHandler(item.unfn);
        _allTrx.push({ time: parseTrxTime(item.prctm), timeStr: item.prctm, tipe: 'Deposit', username: item.usnn, nominal, fee, nett, bankPlayer: item.usb?.bank?.name, namaRek: item.usb?.accnm, handler: handler, ketText: ketText, cmb: item.cmb, trxNote: item.trxNote, status: item.ststr });
        if(!_handlerStats[handler]) _handlerStats[handler] = { depo: 0, wd: 0 }; _handlerStats[handler].depo++;
        if(!_ketStats[ketText]) _ketStats[ketText] = { depo: 0, wd: 0 }; _ketStats[ketText].depo++;
      });

      listWd.forEach(item => { 
        let nominal = parseFloat(item.amt) * 1000; let isAutoWd = item.trxNote && item.trxNote.includes('AutoWD'); 
        let wdType = isAutoWd ? (item.trxNote.match(/AutoWD\s*\[(.*?)\]/)?.[1] || 'AutoWD').toUpperCase() : null; 
        let fee = isAutoWd ? 3500 : 0; let nett = nominal + fee; totalWdGross += nominal; totalWdFee += fee; 
        let rawDay = item.prctm.split(' ')[0]; let day = toDDMM_ymd(rawDay); 
        if(!_dailyTunai[day]) _dailyTunai[day] = initDayObj(); let d = _dailyTunai[day]; 
        d.wd.totalGross += nominal; d.wd.totalTkt++; totTunai.wd.totalGross += nominal; totTunai.wd.totalTkt++; 
        if (isAutoWd) { qrKotor -= nominal; qrBersih -= nett; d.wd.totalQrGross += nominal; d.wd.totalQrNett += nett; d.wd.totalQrFee += fee; totTunai.wd.totalQrGross += nominal; totTunai.wd.totalQrNett += nett; totTunai.wd.totalQrFee += fee; qrKotorDetails[wdType] = (qrKotorDetails[wdType] || 0) - nominal; qrBersihDetails[wdType] = (qrBersihDetails[wdType] || 0) - nett; feeDetails[wdType] = (feeDetails[wdType] || 0) + fee; if(!d.wd.qris[wdType]) d.wd.qris[wdType] = {c:0, v:0}; if(!totTunai.wd.qris[wdType]) totTunai.wd.qris[wdType] = {c:0, v:0}; d.wd.qris[wdType].c++; d.wd.qris[wdType].v += nominal; totTunai.wd.qris[wdType].c++; totTunai.wd.qris[wdType].v += nominal; } 
        else { wdNonQris += nominal; d.wd.nonQr.c++; d.wd.nonQr.v += nominal; totTunai.wd.nonQr.c++; totTunai.wd.nonQr.v += nominal; } 
        let ketText = item.trxNote === '-' ? 'MANUAL' : item.trxNote; let handler = parseHandler(item.unfn); 
        _allTrx.push({ time: parseTrxTime(item.prctm), timeStr: item.prctm, tipe: 'Withdraw', username: item.usnn, nominal, fee, nett: -nett, bankPlayer: item.usb?.bank?.name, namaRek: item.usb?.accnm, handler: handler, ketText: ketText, cmb: item.cmb, trxNote: item.trxNote, status: item.ststr }); 
        if(!_handlerStats[handler]) _handlerStats[handler] = { depo: 0, wd: 0 }; _handlerStats[handler].wd++; if(!_ketStats[ketText]) _ketStats[ketText] = { depo: 0, wd: 0 }; _ketStats[ketText].wd++; 
      });

      _allTrx.sort((a, b) => a.time - b.time);
      let uHandlers = new Set(); let uKets = new Set(); _allTrx.forEach(item => { if(item.handler) uHandlers.add(item.handler); if(item.ketText) uKets.add(item.ketText); });
      let hSel = document.getElementById('filter-handler'); hSel.innerHTML = '<option value="">Semua Handler</option>' + Array.from(uHandlers).sort().map(h => `<option value="${h}">${h}</option>`).join('');
      let kSel = document.getElementById('filter-ket'); kSel.innerHTML = '<option value="">Semua Keterangan</option>' + Array.from(uKets).sort().map(k => `<option value="${k}">${k}</option>`).join('');
      let uMods = new Set(); listCb.forEach(item => uMods.add(item.uscbalhmod)); let mSel = document.getElementById('filter-module'); mSel.innerHTML = '<option value="">Semua Module</option>' + Array.from(uMods).sort().map(m => `<option value="${m}">${m}</option>`).join('');

      renderTunaiHistory(); renderPlayerReport(); 

      let totalIn = 0, totalOut = 0; let totCB = { out: {}, in: {} }; cbOutMods.forEach(m => totCB.out[m] = 0); cbInMods.forEach(m => totCB.in[m] = 0);
      listCb.forEach(item => { 
          let mod = item.uscbalhmod; let upd = (parseFloat(item.uscbalhupd) || 0) * 1000; let isMasuk = cbInMods.includes(mod); let isKeluar = cbOutMods.includes(mod); 
          if(isMasuk) totalIn += upd; if(isKeluar) totalOut += upd; 
          let rawDayCb = item.uscbalhdt.split(' ')[0]; let day = toDDMM_ymd(rawDayCb); 
          if(!_dailyCB[day]) { _dailyCB[day] = { start: parseFloat(item.uscbalhstr) * 1000, end: parseFloat(item.uscbalhend) * 1000, out: {}, in: {} }; cbOutMods.forEach(m => _dailyCB[day].out[m] = 0); cbInMods.forEach(m => _dailyCB[day].in[m] = 0); } 
          else { _dailyCB[day].end = parseFloat(item.uscbalhend) * 1000; } 
          if(isKeluar) { _dailyCB[day].out[mod] = (_dailyCB[day].out[mod] || 0) + upd; totCB.out[mod] += upd; } if(isMasuk) { _dailyCB[day].in[mod] = (_dailyCB[day].in[mod] || 0) + upd; totCB.in[mod] += upd; } 
      });
      
      renderCBHistory();
      if (document.getElementById('pane-agent').classList.contains('active')) { setTimeout(renderAgentDashboard, 100); }
      renderWinloseRekap();

      let profitKotor = totalDepoGross - totalWdGross; let profitBersih = profitKotor - totalDepoFee - totalWdFee; totTunaiAgentFee = totalDepoFee + totalWdFee; totTunaiPK = profitKotor; totTunaiPB = profitBersih;
      document.getElementById('cm-card-depo').innerText = formatRupiahPlain(totalDepoGross); document.getElementById('cm-card-depo-tkt').innerText = `${listDepo.length} Tiket`;
      document.getElementById('cm-card-wd').innerText = formatRupiahPlain(totalWdGross); document.getElementById('cm-card-wd-tkt').innerText = `${listWd.length} Tiket`;
      document.getElementById('cm-card-profit-kotor').innerText = formatRupiahPlain(profitKotor); document.getElementById('cm-card-profit-bersih').innerText = formatRupiahPlain(profitBersih);
      document.getElementById('cm-card-qr-kotor').innerText = formatRupiahPlain(qrKotor); document.getElementById('cm-card-qr-kotor-sub').innerText = Object.entries(qrKotorDetails).map(([k, v]) => `${k} (${formatRupiahPlain(v)})`).join(' | ') || '-';
      document.getElementById('cm-card-qr-bersih').innerText = formatRupiahPlain(qrBersih); document.getElementById('cm-card-qr-bersih-sub').innerText = Object.entries(qrBersihDetails).map(([k, v]) => `${k} (${formatRupiahPlain(v)})`).join(' | ') || '-';
      document.getElementById('cm-card-depo-nonqr').innerText = formatRupiahPlain(depoNonQris); document.getElementById('cm-card-wd-nonqr').innerText = formatRupiahPlain(wdNonQris);
      let feeText = Object.entries(feeDetails).map(([k, v]) => `${k} (${formatRupiahPlain(v)})`).join(' | ') + ` | TOTAL: ${formatRupiahPlain(totalDepoFee + totalWdFee)}`; document.getElementById('cm-fee-details').innerHTML = feeText;

      let htmlRekapTunai = Object.keys(_dailyTunai).sort().map(day => { let d = _dailyTunai[day]; let dp = d.depo, wd = d.wd; let totalAgentFee = dp.totalQrFee + wd.totalQrFee; let pKotor = dp.totalGross - wd.totalGross; let pBersih = (dp.totalQrNett + dp.nonQr.v) - (wd.totalQrNett + wd.nonQr.v); _dailyTunai[day].pBersih = pBersih; _dailyTunai[day].pKotor = pKotor; return `<tr><td>${day}</td><td>${formatTK(dp.qris.OPA?.c)}</td><td>${formatRupiahTable(dp.qris.OPA?.v)}</td><td>${formatTK(dp.qris.OPT?.c)}</td><td>${formatRupiahTable(dp.qris.OPT?.v)}</td><td>${formatTK(dp.qris.OPZ?.c)}</td><td>${formatRupiahTable(dp.qris.OPZ?.v)}</td><td>${formatTK(dp.qris.GPP?.c)}</td><td>${formatRupiahTable(dp.qris.GPP?.v)}</td><td>${formatTK(dp.qris.PEN?.c)}</td><td>${formatRupiahTable(dp.qris.PEN?.v)}</td><td>${formatRupiahTable(dp.totalQrGross)}</td><td>${formatRupiahTable(dp.totalQrNett)}</td><td>${formatTK(dp.nonQr.c)}</td><td>${formatRupiahTable(dp.nonQr.v)}</td><td>${formatTK(dp.totalTkt)}</td><td>${formatRupiahTable(dp.totalGross)}</td><td>${formatTK(wd.qris.OPA?.c)}</td><td>${formatRupiahTable(wd.qris.OPA?.v)}</td><td>${formatTK(wd.qris.OPT?.c)}</td><td>${formatRupiahTable(wd.qris.OPT?.v)}</td><td>${formatTK(wd.qris.OPZ?.c)}</td><td>${formatRupiahTable(wd.qris.OPZ?.v)}</td><td>${formatTK(wd.qris.GPP?.c)}</td><td>${formatRupiahTable(wd.qris.GPP?.v)}</td><td>${formatTK(wd.qris.PEN?.c)}</td><td>${formatRupiahTable(wd.qris.PEN?.v)}</td><td>${formatRupiahTable(wd.totalQrGross)}</td><td>${formatRupiahTable(wd.totalQrNett)}</td><td>${formatTK(wd.nonQr.c)}</td><td>${formatRupiahTable(wd.nonQr.v)}</td><td>${formatTK(wd.totalTkt)}</td><td>${formatRupiahTable(wd.totalGross)}</td><td>${formatRupiahTable(totalAgentFee)}</td><td>${formatRupiahTable(pKotor)}</td><td>${formatRupiahTable(pBersih)}</td></tr>`; }).join('');
      htmlRekapTunai += `<tr class="row-total"><td>TOTAL</td><td>${formatTK(totTunai.depo.qris.OPA?.c)}</td><td>${formatRupiahTable(totTunai.depo.qris.OPA?.v)}</td><td>${formatTK(totTunai.depo.qris.OPT?.c)}</td><td>${formatRupiahTable(totTunai.depo.qris.OPT?.v)}</td><td>${formatTK(totTunai.depo.qris.OPZ?.c)}</td><td>${formatRupiahTable(totTunai.depo.qris.OPZ?.v)}</td><td>${formatTK(totTunai.depo.qris.GPP?.c)}</td><td>${formatRupiahTable(totTunai.depo.qris.GPP?.v)}</td><td>${formatTK(totTunai.depo.qris.PEN?.c)}</td><td>${formatRupiahTable(totTunai.depo.qris.PEN?.v)}</td><td>${formatRupiahTable(totTunai.depo.totalQrGross)}</td><td>${formatRupiahTable(totTunai.depo.totalQrNett)}</td><td>${formatTK(totTunai.depo.nonQr.c)}</td><td>${formatRupiahTable(totTunai.depo.nonQr.v)}</td><td>${formatTK(totTunai.depo.totalTkt)}</td><td>${formatRupiahTable(totTunai.depo.totalGross)}</td><td>${formatTK(totTunai.wd.qris.OPA?.c)}</td><td>${formatRupiahTable(totTunai.wd.qris.OPA?.v)}</td><td>${formatTK(totTunai.wd.qris.OPT?.c)}</td><td>${formatRupiahTable(totTunai.wd.qris.OPT?.v)}</td><td>${formatTK(totTunai.wd.qris.OPZ?.c)}</td><td>${formatRupiahTable(totTunai.wd.qris.OPZ?.v)}</td><td>${formatTK(totTunai.wd.qris.GPP?.c)}</td><td>${formatRupiahTable(totTunai.wd.qris.GPP?.v)}</td><td>${formatTK(totTunai.wd.qris.PEN?.c)}</td><td>${formatRupiahTable(totTunai.wd.qris.PEN?.v)}</td><td>${formatRupiahTable(totTunai.wd.totalQrGross)}</td><td>${formatRupiahTable(totTunai.wd.totalQrNett)}</td><td>${formatTK(totTunai.wd.nonQr.c)}</td><td>${formatRupiahTable(totTunai.wd.nonQr.v)}</td><td>${formatTK(totTunai.wd.totalTkt)}</td><td>${formatRupiahTable(totTunai.wd.totalGross)}</td><td>${formatRupiahTable(totTunaiAgentFee)}</td><td>${formatRupiahTable(totTunaiPK)}</td><td>${formatRupiahTable(totTunaiPB)}</td></tr>`;
      document.getElementById('cm-table-tunai-rekap').innerHTML = htmlRekapTunai || '<tr><td colspan="36" style="text-align:center; color:#aaa; padding:20px;">Tidak ada data.</td></tr>';

      let sAwal = listCb.length > 0 ? parseFloat(listCb[0].uscbalhstr) * 1000 : 0; let sAkhir = listCb.length > 0 ? parseFloat(listCb[listCb.length-1].uscbalhend) * 1000 : 0;
      document.getElementById('cm-card-cb-start').innerText = formatRupiahPlain(sAwal); document.getElementById('cm-card-cb-end').innerText = formatRupiahPlain(sAkhir); document.getElementById('cm-card-cb-in').innerText = formatRupiahPlain(totalIn); document.getElementById('cm-card-cb-out').innerText = formatRupiahPlain(totalOut);
      _lastSummary.saldoAkhir = sAkhir; _lastSummary.pKotor = profitKotor; _lastSummary.pBersih = profitBersih;

      let htmlRekapCB = Object.keys(_dailyCB).sort().map(day => { let d = _dailyCB[day]; let totOut = Object.values(d.out).reduce((a,b) => a+b, 0); let totIn = Object.values(d.in).reduce((a,b) => a+b, 0); return `<tr><td>${day}</td><td>${formatRupiahTable(d.start)}</td><td>${formatRupiahTable(d.out['Deposit'])}</td><td>${formatRupiahTable(d.out['Manual Deposit'])}</td><td>${formatRupiahTable(d.out['Provider Withdraw'])}</td><td>${formatRupiahTable(d.out['Deduct Credit'])}</td><td>${formatRupiahTable(d.out['Bonus Claim'])}</td><td>${formatRupiahTable(d.out['Bonus Transfer'])}</td><td>${formatRupiahTable(d.out['Rebate'])}</td><td>${formatRupiahTable(d.out['Bonus Deposit'])}</td><td>${formatRupiahTable(totOut)}</td><td>${formatRupiahTable(d.in['Withdraw'])}</td><td>${formatRupiahTable(d.in['Add Credit'])}</td><td>${formatRupiahTable(d.in['Manual Withdraw'])}</td><td>${formatRupiahTable(d.in['Provider Deposit'])}</td><td>${formatRupiahTable(totIn)}</td><td>${formatRupiahTable(d.end)}</td></tr>`; }).join('');
      let totCBOutAll = Object.values(totCB.out).reduce((a,b) => a+b, 0); let totCBInAll = Object.values(totCB.in).reduce((a,b) => a+b, 0);
      htmlRekapCB += `<tr class="row-total"><td>TOTAL</td><td>-</td><td>${formatRupiahTable(totCB.out['Deposit'])}</td><td>${formatRupiahTable(totCB.out['Manual Deposit'])}</td><td>${formatRupiahTable(totCB.out['Provider Withdraw'])}</td><td>${formatRupiahTable(totCB.out['Deduct Credit'])}</td><td>${formatRupiahTable(totCB.out['Bonus Claim'])}</td><td>${formatRupiahTable(totCB.out['Bonus Transfer'])}</td><td>${formatRupiahTable(totCB.out['Rebate'])}</td><td>${formatRupiahTable(totCB.out['Bonus Deposit'])}</td><td>${formatRupiahTable(totCBOutAll)}</td><td>${formatRupiahTable(totCB.in['Withdraw'])}</td><td>${formatRupiahTable(totCB.in['Add Credit'])}</td><td>${formatRupiahTable(totCB.in['Manual Withdraw'])}</td><td>${formatRupiahTable(totCB.in['Provider Deposit'])}</td><td>${formatRupiahTable(totCBInAll)}</td><td>-</td></tr>`;
      document.getElementById('cm-table-cb-rekap').innerHTML = htmlRekapCB || '<tr><td colspan="18" style="text-align:center; color:#aaa; padding:20px;">Tidak ada data.</td></tr>';

      if (cbJson) statusEl.innerHTML = `✅ <b>OK</b> | Depo: ${listDepo.length} | WD: ${listWd.length} | CB: ${listCb.length} | Profit: ${formatRupiahPlain(profitBersih)}`;
      
      if (_progressInterval) clearInterval(_progressInterval); fillEl.style.strokeDashoffset = 0; percentEl.innerText = '100%'; fillEl.style.stroke = '#f97316'; percentEl.style.color = '#f97316'; await new Promise(r => setTimeout(r, 300));
      return true;
    } catch (e) { statusEl.innerHTML = '❌ <b>Error Fatal:</b> ' + e.message; console.error('Error:', e); return false; } finally { if (_progressInterval) clearInterval(_progressInterval); if(loader) loader.style.display = 'none'; }
  }

  document.getElementById('cm-load').onclick = loadData;

  window.renderTunaiHistory = function() { let fTipe = document.getElementById('filter-tipe').value; let fUser = document.getElementById('filter-user').value.toLowerCase(); let fHandler = document.getElementById('filter-handler').value; let fKet = document.getElementById('filter-ket').value; let filtered = _allTrx.filter(item => { if (fTipe && item.tipe !== fTipe) return false; if (fUser && !item.username.toLowerCase().includes(fUser)) return false; if (fHandler && item.handler !== fHandler) return false; if (fKet && item.ketText !== fKet) return false; return true; }); let html = filtered.length === 0 ? '<tr><td colspan="12" style="text-align:center; color:#aaa; padding:20px;">Tidak ada data yang cocok.</td></tr>' : ''; let sumMasuk = 0, sumKeluar = 0, sumFee = 0, sumNett = 0; filtered.forEach(item => { let isDepo = item.tipe === 'Deposit'; let badgeClass = isDepo ? 'badge-depo' : 'badge-wd'; let masukVal = isDepo ? item.nominal : 0; let keluarVal = !isDepo ? -item.nominal : 0; let feeVal = -Math.abs(item.fee); let nettVal = item.nett; sumMasuk += masukVal; sumKeluar += keluarVal; sumFee += feeVal; sumNett += nettVal; let ketHtml = '-'; if (isDepo && item.cmb) { let n = item.cmb.bank ? item.cmb.bank.name : '-'; let a = item.cmb.accno ? item.cmb.accno : ''; let an = item.cmb.accnm ? item.cmb.accnm : ''; ketHtml = n.toLowerCase() === 'qris' ? `${n} (${a})` : `${n} - ${an}`; ketHtml = `<span style="color:#3b82f6; font-weight:800;">${ketHtml}</span>`; } else if (!isDepo) { ketHtml = item.trxNote === '-' ? '<span style="color:#d93025; font-weight:800;">MANUAL</span>' : `<span style="color:#8b5cf6; font-weight:800;">${item.trxNote}</span>`; } html += `<tr><td>${item.timeStr}</td><td><span class="${badgeClass}">${item.tipe}</span></td><td style="font-weight:800;">${item.username}</td><td>${formatRupiahTable(masukVal)}</td><td>${formatRupiahTable(keluarVal)}</td><td>${formatRupiahTable(feeVal)}</td><td>${formatRupiahTable(nettVal)}</td><td style="color:#3b82f6;">${item.bankPlayer}</td><td style="font-weight:800;">${item.namaRek}</td><td style="font-size:9px; font-weight:700; color:#65676b;">${item.handler}</td><td style="font-size:9px;">${ketHtml}</td><td style="color:#22c55e; font-weight:700;">${item.status}</td></tr>`; }); if (filtered.length > 0) { html += `<tr class="row-total"><td colspan="3">TOTAL FILTER</td><td>${formatRupiahTable(sumMasuk)}</td><td>${formatRupiahTable(sumKeluar)}</td><td>${formatRupiahTable(sumFee)}</td><td>${formatRupiahTable(sumNett)}</td><td colspan="5"></td></tr>`; } document.getElementById('cm-table-tunai-history').innerHTML = html; }
  window.renderCBHistory = function() { let fMod = document.getElementById('filter-module').value; let cbHtmlHistory = ''; let filteredCb = _cbRawList.filter(item => !fMod || item.uscbalhmod === fMod); filteredCb.forEach(item => { let mod = item.uscbalhmod; let upd = (parseFloat(item.uscbalhupd) || 0) * 1000; let isMasuk = cbInMods.includes(mod); let isKeluar = cbOutMods.includes(mod); let badge = isMasuk ? 'badge-in' : (isKeluar ? 'badge-out' : 'badge-depo'); let inVal = isMasuk ? upd : 0; let outVal = isKeluar ? -upd : 0; cbHtmlHistory += `<tr><td>${item.uscbalhdt}</td><td><span class="${badge}">${mod}</span></td><td>${item.un}</td><td style="text-align:left; max-width:300px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${item.uscbalhmodinfo}</td><td>${formatRupiahTable(parseFloat(item.uscbalhstr) * 1000)}</td><td>${formatRupiahTable(inVal)}</td><td>${formatRupiahTable(outVal)}</td><td>${formatRupiahTable(parseFloat(item.uscbalhend) * 1000)}</td></tr>`; }); document.getElementById('cm-table-cb-history').innerHTML = cbHtmlHistory || '<tr><td colspan="8" style="text-align:center; color:#aaa; padding:20px;">Tidak ada data yang cocok.</td></tr>'; }
  window.renderPlayerReport = function() { let playerStats = {}; _allTrx.forEach(item => { if(!playerStats[item.username]) { playerStats[item.username] = { username: item.username, namaRek: '-', masuk: 0, keluar: 0, fee: 0 }; } let p = playerStats[item.username]; if(item.tipe === 'Deposit') p.masuk += item.nominal; else p.keluar += item.nominal; p.fee += Math.abs(item.fee); if(item.namaRek && item.namaRek !== '-') p.namaRek = item.namaRek; }); let players = Object.values(playerStats).map(p => { p.nett = p.masuk - p.keluar - p.fee; return p; }); let losers = players.filter(p => p.nett > 0).sort((a, b) => b.nett - a.nett).slice(0, 100); let winners = players.filter(p => p.nett < 0).sort((a, b) => a.nett - b.nett).slice(0, 100); let htmlLosers = ''; if(losers.length === 0) { htmlLosers = '<tr><td colspan="8" style="text-align:center; color:#aaa; padding:20px;">Tidak ada data.</td></tr>'; } else { losers.forEach((p, i) => { htmlLosers += `<tr><td>${i + 1}</td><td style="font-weight:800;">${p.username}</td><td>${formatRupiahTable(p.masuk)}</td><td>${formatRupiahTable(p.keluar)}</td><td>${formatRupiahTable(p.fee)}</td><td style="color:#16a34a; font-weight:800;">${formatRupiahTable(p.nett)}</td><td>${p.namaRek}</td><td style="text-align:center;"><button class="cm-view-btn" onclick="viewPlayerHistory('${p.username}')">👁</button></td></tr>`; }); } document.getElementById('cm-table-losers').innerHTML = htmlLosers; let htmlWinners = ''; if(winners.length === 0) { htmlWinners = '<tr><td colspan="8" style="text-align:center; color:#aaa; padding:20px;">Tidak ada data.</td></tr>'; } else { winners.forEach((p, i) => { htmlWinners += `<tr><td>${i + 1}</td><td style="font-weight:800;">${p.username}</td><td>${formatRupiahTable(p.masuk)}</td><td>${formatRupiahTable(p.keluar)}</td><td>${formatRupiahTable(p.fee)}</td><td style="color:#ef4444; font-weight:800;">${formatRupiahTable(p.nett)}</td><td>${p.namaRek}</td><td style="text-align:center;"><button class="cm-view-btn" onclick="viewPlayerHistory('${p.username}')">👁</button></td></tr>`; }); } document.getElementById('cm-table-winners').innerHTML = htmlWinners; }
  window.viewPlayerHistory = (username) => { _currentCapturedUser = username; document.getElementById('cm-player-modal-title').innerHTML = `🔍 History Transaksi: <span style="color:#3b82f6;">${username}</span>`; const body = document.getElementById('cm-player-modal-body'); let filtered = _allTrx.filter(item => item.username === username); filtered.sort((a, b) => a.time - b.time); let sumDepoTkt = 0, sumWdTkt = 0; filtered.forEach(item => { if (item.tipe === 'Deposit') sumDepoTkt++; else sumWdTkt++; }); let startVal = document.getElementById('cm-start').value; let endVal = document.getElementById('cm-end').value; function fmtDate(dStr) { if(!dStr) return '-'; let p = dStr.split('-'); return `${parseInt(p[2])} ${monthNames[parseInt(p[1])-1]} ${p[0]}`; } let dateRange = (startVal === endVal) ? fmtDate(startVal) : `${fmtDate(startVal)} - ${fmtDate(endVal)}`; let html = `<div class="cm-player-summary"><span>Tiket Deposit: <b style="color:#16a34a">${sumDepoTkt}</b></span><span>Tiket Withdraw: <b style="color:#ef4444">${sumWdTkt}</b></span><span>Periode Data: <b style="color:#3b82f6">${dateRange}</b></span></div><div class="cm-player-modal-tbl-wrap"><table class="cm-tbl thin"><thead><tr><th>WAKTU</th><th>TIPE</th><th>DEPOSIT</th><th>WITHDRAW</th><th>FEE</th><th>NETT</th><th>BANK</th><th>HANDLER</th></tr></thead><tbody>`; let sumMasuk = 0, sumKeluar = 0, sumFee = 0, sumNett = 0; if (filtered.length === 0) { html += '<tr><td colspan="8" style="text-align:center; color:#aaa; padding:20px;">Tidak ada data.</td></tr>'; } else { filtered.forEach(item => { let isDepo = item.tipe === 'Deposit'; let masukVal = isDepo ? item.nominal : 0; let keluarVal = !isDepo ? -item.nominal : 0; let feeVal = -Math.abs(item.fee); let nettVal = item.nett; sumMasuk += masukVal; sumKeluar += keluarVal; sumFee += feeVal; sumNett += nettVal; let badgeClass = isDepo ? 'badge-depo' : 'badge-wd'; html += `<tr><td>${item.timeStr}</td><td><span class="${badgeClass}">${item.tipe}</span></td><td>${formatRupiahTable(masukVal)}</td><td>${formatRupiahTable(keluarVal)}</td><td>${formatRupiahTable(feeVal)}</td><td>${formatRupiahTable(nettVal)}</td><td style="color:#3b82f6;">${item.bankPlayer}</td><td style="font-size:9px; font-weight:700; color:#65676b;">${item.handler}</td></tr>`; }); html += `<tr class="row-total"><td colspan="2">TOTAL</td><td>${formatRupiahTable(sumMasuk)}</td><td>${formatRupiahTable(sumKeluar)}</td><td>${formatRupiahTable(sumFee)}</td><td>${formatRupiahTable(sumNett)}</td><td colspan="2"></td></tr>`; } html += `</tbody></table></div>`; body.innerHTML = html; document.getElementById('cm-player-modal-bg').classList.add('show'); }
  window.closePlayerModal = () => { document.getElementById('cm-player-modal-bg').classList.remove('show'); };
})();
