// ==UserScript==
// @name         Auto Notif Panel Cash Market v8.0 (Glassmorphism & Dual Mode)
// @namespace    http://tampermonkey.net/
// @version      8.0
// @description  Premium Glass UI, Auto notif real-time, multi-brand, multi-bahasa, filter Auto-WD
// @match        https://*.com/dp/list/websocket*
// @match        https://*.com/wd/list/websocket*
// @match        https://asia77cash.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const SCRAP_ID = 'cm-auto-notif-v8';
    
    // HACK 1: MATIKAN SUARA BAWAAN PANEL (COIN.OGG)
    const originalPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function() {
        const src = this.currentSrc || (this.querySelector('source') ? this.querySelector('source').src : '');
        if (this.id === 'myAudio' || this.id === 'myAudiodpwd' || src.includes('coin.ogg') || src.includes('coin2.ogg')) {
            return Promise.reject(new Error('Blocked by Auto Notif: Panel sound silenced'));
        }
        return originalPlay.apply(this, arguments);
    };
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('audio').forEach(a => {
            if (a.id === 'myAudio' || a.id === 'myAudiodpwd') a.muted = true;
        });
    });

    const CONFIG = {
        defaultNotifInterval: 15,
        minNotifInterval: 5,
        maxNotifInterval: 120,
        defaultMaxAnnounce: 4,
        minMaxAnnounce: 1,
        maxMaxAnnounce: 10,
        soundVolume: 0.35,
        beepFrequency: 880,
        beepDuration: 180
    };

    const activeMode = window.location.href.toLowerCase().includes('wd') ? 'wd' : 'depo';
    const actionText = activeMode === 'wd' ? 'penarikan' : 'deposit';

    const BRAND_MAPPING = {
        'wttan777': 'TITAN',
        'xbets988': 'BET'
    };

    const SafeStorage = {
        get(key, fallback = null) { try { const v = localStorage.getItem(key); return v !== null ? v : fallback; } catch (e) { return fallback; } },
        set(key, value) { try { return localStorage.setItem(key, value); } catch (e) { return false; } },
        getJSON(key, fallback = {}) { try { const v = this.get(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } },
        setJSON(key, value) { try { return this.set(key, JSON.stringify(value)); } catch (e) { return false; } }
    };

    const Sound = {
        enabled: true,
        volume: CONFIG.soundVolume,
        language: 'id-ID',
        ctx: null,
        init() { try { window.AudioContext = window.AudioContext || window.webkitAudioContext; this.ctx = new AudioContext(); } catch (e) {} },
        async beep(freq = CONFIG.beepFrequency, dur = CONFIG.beepDuration) {
            if (!this.enabled || !this.ctx) return;
            try {
                if (this.ctx.state === 'suspended') await this.ctx.resume();
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.connect(gain); gain.connect(this.ctx.destination);
                osc.frequency.value = freq; gain.gain.value = this.volume * 0.25;
                const now = this.ctx.currentTime;
                gain.gain.exponentialRampToValueAtTime(0.01, now + dur / 1000);
                osc.start(now); osc.stop(now + dur / 1000);
            } catch (e) {}
        },
        speak(text) {
            if (!this.enabled) return;
            if (!('speechSynthesis' in window)) { this.beep(); return; }
            try {
                window.speechSynthesis.cancel();
                const u = new SpeechSynthesisUtterance(text);
                u.lang = this.language; u.rate = 1.05; u.pitch = 1.15; u.volume = 1.0;
                u.onerror = () => { this.beep(); };
                window.speechSynthesis.speak(u);
            } catch (e) { this.beep(); }
        },
        load() { 
            const d = SafeStorage.getJSON('cm_sound', {}); 
            if (typeof d.enabled === 'boolean') this.enabled = d.enabled; 
            if (typeof d.volume === 'number') this.volume = Math.max(0, Math.min(1, d.volume)); 
            if (typeof d.language === 'string') this.language = d.language; 
        },
        save() { SafeStorage.setJSON('cm_sound', { enabled: this.enabled, volume: this.volume, language: this.language }); }
    };

    const Utils = {
        formatIDR(value) { return new Intl.NumberFormat('id-ID').format(Math.round(+value || 0)); },
        validateRange(value, min, max, fallback) { const n = parseInt(value, 10); if (isNaN(n)) return fallback; return Math.max(min, Math.min(max, n)); }
    };

    const TableParser = {
        getActiveBrand() {
            const spans = document.querySelectorAll('.panel-top span');
            for (let span of spans) {
                if (span.textContent.includes('Username :')) {
                    const match = span.textContent.match(/@(\w+)/);
                    if (match && match[1]) {
                        const code = match[1].toLowerCase();
                        return BRAND_MAPPING[code] || code.toUpperCase();
                    }
                }
            }
            return 'Brand';
        },
        getPendingTransactions() {
            const transactions = [];
            const tableBody = document.querySelector('#dataList tbody');
            if (!tableBody) return transactions;

            const rows = tableBody.querySelectorAll('tr.menu-body, tr.parent-row');
            rows.forEach(row => {
                if (row.querySelector('.autowd-check')) return; // Skip Auto WD

                const usernameEl = row.querySelector('.copy-btn-usnm');
                if (!usernameEl) return;
                const username = usernameEl.innerText.trim();

                const tds = row.querySelectorAll('td');
                let destBank = '', destName = '';
                let amount = '0';

                tds.forEach(td => {
                    const bName = td.querySelector('.bankName');
                    const bAccNm = td.querySelector('.bankaccnm');
                    if (bName && bAccNm) {
                        destBank = bName.innerText.trim();
                        destName = bAccNm.innerText.trim();
                    }
                });
                const destination = `${destBank} ${destName}`.trim();

                const realAmountEl = row.querySelector('.realAmount');
                if (realAmountEl) {
                    const rawText = realAmountEl.innerText;
                    const match = rawText.match(/\[Real\s*:\s*([\d,\.]+)/i);
                    if (match && match[1]) amount = match[1].replace(/[,.]/g, '');
                } else {
                    const amountMonEl = row.querySelector('.amount-monitor');
                    if (amountMonEl) amount = amountMonEl.innerText.trim();
                }

                transactions.push({
                    'Nama Pengguna': username,
                    'Payment To': destination || 'Tujuan Tidak Diketahui',
                    'Jumlah': parseInt(amount) || 0
                });
            });
            return transactions;
        }
    };

    const Notifier = {
        announce(rows, maxAnnounce, userTriggered = false) {
            if (!rows.length) return;
            const brand = TableParser.getActiveBrand();
            let text;

            if (rows.length === 1) {
                const r = rows[0];
                text = `Brand ${brand}. ${r['Nama Pengguna']} ${actionText} ${Utils.formatIDR(r['Jumlah'])} ke ${r['Payment To']}`;
            } else if (rows.length > maxAnnounce) {
                text = `Brand ${brand}. Ada lebih dari ${maxAnnounce} transaksi ${actionText} pending.`;
            } else {
                const ordinals = ['Pertama', 'Kedua', 'Ketiga', 'Berikutnya'];
                const parts = rows.slice(0, maxAnnounce).map((r, i) => {
                    const ord = ordinals[i] || 'Berikutnya';
                    return `${ord}, ${r['Nama Pengguna']}, ${Utils.formatIDR(r['Jumlah'])}, ke ${r['Payment To']}`;
                });
                text = `Brand ${brand}. Ada ${rows.length} transaksi ${actionText} pending. ${parts.join('. ')}.`;
            }
            Sound.speak(text);
        },
        announceEmpty() { Sound.speak('Tidak ada transaksi menunggu'); }
    };

    // ── PREMIUM GLASSMORPHISM STYLE ───────────────────────────────────────────
    const st = document.createElement('style');
    st.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800;900&display=swap');
        #${SCRAP_ID} * { box-sizing:border-box; font-family:'Inter',sans-serif!important; }
        
        #${SCRAP_ID} {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 2147483647;
            animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes scaleIn { from { transform: translate(-50%, -50%) scale(0.9); opacity: 0; } to { transform: translate(-50%, -50%) scale(1); opacity: 1; } }

        .notif-modal {
            width: 380px; max-width: 95vw; max-height: 88vh;
            background: rgba(255, 255, 255, 0.75); border: 1px solid rgba(255, 255, 255, 0.9);
            border-radius: 28px; box-shadow: 0 24px 64px rgba(0, 0, 0, 0.2), 0 0 80px rgba(251, 191, 36, 0.1);
            backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%);
            display: flex; flex-direction: column; overflow: hidden; color: #1c1e21;
        }
        #${SCRAP_ID}.dark .notif-modal {
            background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(255, 255, 255, 0.1); color: #e2e8f0;
            box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6), 0 0 80px rgba(251, 191, 36, 0.15);
        }

        .notif-header { padding: 18px 24px; display: flex; align-items: center; justify-content: space-between; gap: 12px; cursor: move; user-select: none; border-bottom: 1px solid rgba(0, 0, 0, 0.05); flex-shrink: 0; }
        #${SCRAP_ID}.dark .notif-header { border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
        
        .notif-logo { font-size: 16px; font-weight: 700; letter-spacing: -0.5px; display: flex; align-items: center; gap: 12px; }
        .notif-logo img { width: 26px; height: 26px; filter: drop-shadow(0 0 8px rgba(251,191,36,0.6)); }
        
        .shimmer-text {
            font-weight: 800;
            background: linear-gradient(110deg, #1c1e21 30%, #ffffff 50%, #1c1e21 70%);
            background-size: 200% 100%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
            animation: shimmerGlint 4s linear infinite;
        }
        #${SCRAP_ID}.dark .shimmer-text {
            background: linear-gradient(110deg, #e2e8f0 30%, #ffffff 50%, #e2e8f0 70%);
            background-size: 200% 100%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
        }
        @keyframes shimmerGlint { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        .brand-badge { font-size: 10px; font-weight: 600; color: #f97316; background: rgba(249, 115, 22, 0.1); padding: 4px 10px; border-radius: 20px; border: 1px solid rgba(249, 115, 22, 0.2); }
        #${SCRAP_ID}.dark .brand-badge { color: #fb923c; background: rgba(251, 146, 60, 0.1); border-color: rgba(251, 146, 60, 0.3); }

        .btn-icon { width: 32px; height: 32px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.05); background: transparent; cursor: pointer; font-weight: 700; display: flex; align-items: center; justify-content: center; transition: 0.2s; color: #1c1e21; }
        #${SCRAP_ID}.dark .btn-icon { color: #e2e8f0; border: 1px solid rgba(255,255,255,0.05); }
        .btn-icon:hover { background: rgba(0,0,0,0.03); }
        #${SCRAP_ID}.dark .btn-icon:hover { background: rgba(255,255,255,0.05); }
        .btn-icon.exit:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; border-color: rgba(239, 68, 68, 0.2); }

        .notif-body { padding: 24px; overflow-y: auto; flex: 1; max-height: 450px; transition: max-height 0.3s ease, padding 0.3s ease, opacity 0.3s ease; }
        .notif-body.minimized { max-height: 0; padding-top: 0; padding-bottom: 0; opacity: 0; overflow: hidden; }
        .notif-body::-webkit-scrollbar { width: 6px; }
        .notif-body::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
        #${SCRAP_ID}.dark .notif-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }

        .notif-tabs { display: flex; gap: 4px; background: rgba(0,0,0,0.04); padding: 4px; border-radius: 12px; border: 1px solid rgba(0,0,0,0.05); margin-bottom: 20px; }
        #${SCRAP_ID}.dark .notif-tabs { background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); }
        .tab-btn { flex: 1; padding: 8px; border-radius: 8px; border: none; background: transparent; font-size: 11px; font-weight: 600; cursor: pointer; color: #65676b; transition: all 0.3s ease; text-transform: uppercase; }
        #${SCRAP_ID}.dark .tab-btn { color: #94a3b8; }
        .tab-btn:hover { color: #2563eb; }
        #${SCRAP_ID}.dark .tab-btn:hover { color: #fff; }
        .tab-btn.active { background: rgba(255,255,255,0.8); color: #1c1e21; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        #${SCRAP_ID}.dark .tab-btn.active { background: rgba(255,255,255,0.1); color: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }

        .tab-content { display: none; }
        .tab-content.active { display: block; animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }

        .form-group { margin-bottom: 16px; }
        .label { display: block; font-size: 11px; font-weight: 600; color: #65676b; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
        #${SCRAP_ID}.dark .label { color: #94a3b8; }
        .input-field { width: 100%; padding: 12px 14px; border: 1px solid rgba(0,0,0,0.1); border-radius: 12px; font-size: 14px; background: rgba(255,255,255,0.5); color: #1c1e21; outline: none; transition: 0.3s; font-family: 'Inter', sans-serif; }
        #${SCRAP_ID}.dark .input-field { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); color: #fff; }
        .input-field:focus { border-color: #f97316; box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.15); background: rgba(255,255,255,0.8); }
        #${SCRAP_ID}.dark .input-field:focus { background: rgba(255,255,255,0.1); }

        .btn-control { width: 100%; height: 46px; border: none; border-radius: 14px; font-size: 14px; font-weight: 600; cursor: pointer; color: #fff; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
        .btn-start { background: linear-gradient(135deg, rgba(249, 115, 22, 1), rgba(217, 70, 11, 1)); box-shadow: 0 8px 20px rgba(249, 115, 22, 0.25); }
        .btn-start:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(249, 115, 22, 0.35); }
        .btn-stop { background: linear-gradient(135deg, rgba(55, 65, 81, 1), rgba(31, 41, 55, 1)); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); display: none; }
        #${SCRAP_ID}.dark .btn-stop { background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05)); color: #fff; border: 1px solid rgba(255,255,255,0.1); }
        .btn-stop:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2); }
        .btn-secondary { background: rgba(255,255,255,0.5); color: #f97316; border: 1px solid rgba(249, 115, 22, 0.2); }
        #${SCRAP_ID}.dark .btn-secondary { background: rgba(255,255,255,0.05); color: #fb923c; border-color: rgba(251, 146, 60, 0.3); }
        .btn-secondary:hover { background: rgba(249, 115, 22, 0.1); }

        .notif-footer { padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(0,0,0,0.05); }
        #${SCRAP_ID}.dark .notif-footer { border-top: 1px solid rgba(255,255,255,0.05); }
        .notif-footer.minimized { display: none; }
        .status-text { font-size: 12px; font-weight: 600; color: #65676b; }
        #${SCRAP_ID}.dark .status-text { color: #94a3b8; }
        .time-text { font-family: 'Space Grotesk', monospace; font-size: 12px; font-weight: 600; color: #f97316; font-variant-numeric: tabular-nums; }
    `;
    document.head.appendChild(st);

    // TEMA INISIALISASI
    let isDark = localStorage.getItem('cm-notif-theme') !== 'light'; // Default Dark

    const ui = document.createElement('div');
    ui.id = SCRAP_ID;
    if (isDark) ui.classList.add('dark');
    const themeIcon = isDark ? '☀️' : '🌙';

    ui.innerHTML = `
        <div class="notif-modal">
            <div class="notif-header" id="notifHeader">
                <div class="notif-logo">
                    <img src="https://i.ibb.co/Xk66G0bC/8-logo.png" alt="Logo">
                    <span class="shimmer-text">NOTIF PRO</span>
                    <div class="brand-badge" id="brandTitle">LOADING...</div>
                </div>
                <div style="display:flex; gap:8px;">
                    <button class="btn-icon" id="themeBtn" title="Toggle Theme">${themeIcon}</button>
                    <button class="btn-icon" id="minimizeBtn" title="Minimize">—</button>
                    <button class="btn-icon exit" id="closeBtn" title="Close">✖</button>
                </div>
            </div>
            
            <div class="notif-body" id="notifBody">
                <div class="notif-tabs">
                    <button class="tab-btn active" data-tab="transaksi">Transaksi</button>
                    <button class="tab-btn" data-tab="setting">Setting</button>
                </div>

                <div class="tab-content active" id="tab-transaksi">
                    <div class="form-group">
                        <label class="label">Mode Aktif: <b style="color:#f97316">${activeMode === 'wd' ? 'WITHDRAW' : 'DEPOSIT'}</b></label>
                    </div>
                    <div class="form-group">
                        <label class="label">Interval Notifikasi (detik)</label>
                        <input type="number" id="notifIntervalInput" class="input-field" min="5" max="120" value="15">
                    </div>
                    <div class="form-group">
                        <label class="label">Max Items di Bacakan</label>
                        <input type="number" id="maxAnnounceInput" class="input-field" min="1" max="10" value="4">
                    </div>
                    <button class="btn-control btn-secondary" id="testNotifBtn">🔊 Test Notif Sekarang</button>
                    <button class="btn-control btn-start" id="startBtn">▶ START NOTIF</button>
                    <button class="btn-control btn-stop" id="stopBtn">■ STOP NOTIF</button>
                </div>

                <div class="tab-content" id="tab-setting">
                    <div class="form-group">
                        <label class="label">Pilih Bahasa TTS</label>
                        <select id="langSelect" class="input-field">
                            <option value="id-ID">🇮🇩 Bahasa Indonesia</option>
                            <option value="en-US">🇬🇧 English (US)</option>
                            <option value="en-GB">🇬🇧 English (UK)</option>
                            <option value="zh-CN">🇨🇳 Mandarin (CN)</option>
                            <option value="jv-ID">🇮🇩 Jawa</option>
                            <option value="su-ID">🇮🇩 Sunda</option>
                            <option value="id-ID" data-accent="medan">🇮🇩 Medan (Indonesia)</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div class="notif-footer" id="notifFooter">
                <span class="status-text" id="statusText">Ready</span>
                <span class="time-text" id="timeText">00:00:00</span>
            </div>
        </div>
    `;

    const elements = {};

    class UIController {
        constructor() {
            this.running = false;
            this.notifTimer = null;
            this.settings = {
                notifInterval: CONFIG.defaultNotifInterval,
                maxAnnounce: CONFIG.defaultMaxAnnounce
            };
            
            document.body.appendChild(ui);
            elements.startBtn = document.getElementById('startBtn');
            elements.stopBtn = document.getElementById('stopBtn');
            elements.testNotifBtn = document.getElementById('testNotifBtn');
            elements.notifIntervalInput = document.getElementById('notifIntervalInput');
            elements.maxAnnounceInput = document.getElementById('maxAnnounceInput');
            elements.langSelect = document.getElementById('langSelect');
            elements.statusText = document.getElementById('statusText');
            elements.brandTitle = document.getElementById('brandTitle');
            elements.timeText = document.getElementById('timeText');
            elements.notifBody = document.getElementById('notifBody');
            elements.notifFooter = document.getElementById('notifFooter');
            elements.notifModal = document.querySelector(`#${SCRAP_ID} .notif-modal`);
            elements.header = document.getElementById('notifHeader');
            elements.themeBtn = document.getElementById('themeBtn');
            elements.minimizeBtn = document.getElementById('minimizeBtn');
            elements.closeBtn = document.getElementById('closeBtn');
            elements.tabs = [...document.querySelectorAll(`#${SCRAP_ID} .tab-btn`)];
            
            this.loadSettings();
            this.bindEvents();
        }

        bindEvents() {
            elements.startBtn.addEventListener('click', () => this.start());
            elements.stopBtn.addEventListener('click', () => this.stop());
            elements.testNotifBtn.addEventListener('click', () => this.testNotification(true));
            elements.notifIntervalInput.addEventListener('change', () => { this.saveSettings(); if (this.running) this.startNotifications(); });
            elements.maxAnnounceInput.addEventListener('change', () => this.saveSettings());
            elements.langSelect.addEventListener('change', () => { Sound.language = elements.langSelect.value; Sound.save(); });
            
            elements.tabs.forEach(tab => tab.addEventListener('click', () => this.switchTab(tab.getAttribute('data-tab'))));
            
            elements.themeBtn.addEventListener('click', () => this.toggleTheme());
            elements.minimizeBtn.addEventListener('click', () => this.toggleMinimize());
            elements.closeBtn.addEventListener('click', () => { const h = document.getElementById(SCRAP_ID); if(h) h.remove(); });
            
            setInterval(() => {
                elements.brandTitle.textContent = TableParser.getActiveBrand();
                elements.timeText.textContent = new Date().toLocaleTimeString('id-ID');
            }, 1000);

            this.makeDraggable();
        }

        toggleTheme() { 
            const el = document.getElementById(SCRAP_ID); 
            el.classList.toggle('dark'); 
            const isDarkNow = el.classList.contains('dark');
            elements.themeBtn.innerText = isDarkNow ? '☀️' : '🌙'; 
            localStorage.setItem('cm-notif-theme', isDarkNow ? 'dark' : 'light'); 
        }

        toggleMinimize() {
            const hidden = elements.notifBody.classList.contains('minimized');
            if (hidden) {
                elements.notifBody.classList.remove('minimized');
                elements.notifFooter.classList.remove('minimized');
                elements.minimizeBtn.innerText = '—';
            } else {
                elements.notifBody.classList.add('minimized');
                elements.notifFooter.classList.add('minimized');
                elements.minimizeBtn.innerText = '□';
            }
        }

        switchTab(tabName) {
            elements.tabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-tab') === tabName));
            document.getElementById('tab-transaksi').classList.toggle('active', tabName === 'transaksi');
            document.getElementById('tab-setting').classList.toggle('active', tabName === 'setting');
        }

        makeDraggable() {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            const h = elements.header;
            const c = document.getElementById(SCRAP_ID);
            
            const onMouseMove = (e) => {
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                c.style.top = (c.offsetTop - pos2) + "px";
                c.style.left = (c.offsetLeft - pos1) + "px";
            };
            const onMouseUp = () => {
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
            };
            
            h.onmousedown = (e) => {
                if (e.target.closest('.btn-icon')) return;
                e.preventDefault();
                const rect = c.getBoundingClientRect();
                c.style.transform = 'none';
                c.style.top = rect.top + 'px';
                c.style.left = rect.left + 'px';
                pos3 = e.clientX;
                pos4 = e.clientY;
                window.addEventListener('mousemove', onMouseMove);
                window.addEventListener('mouseup', onMouseUp);
            };
        }

        loadSettings() {
            const saved = SafeStorage.getJSON('cm_notif_opts', {});
            if (saved.notifInterval) elements.notifIntervalInput.value = Utils.validateRange(saved.notifInterval, CONFIG.minNotifInterval, CONFIG.maxNotifInterval, CONFIG.defaultNotifInterval);
            if (saved.maxAnnounce) elements.maxAnnounceInput.value = Utils.validateRange(saved.maxAnnounce, CONFIG.minMaxAnnounce, CONFIG.maxMaxAnnounce, CONFIG.defaultMaxAnnounce);
            elements.langSelect.value = Sound.language;
        }

        saveSettings() {
            this.settings.notifInterval = Utils.validateRange(elements.notifIntervalInput.value, CONFIG.minNotifInterval, CONFIG.maxNotifInterval, CONFIG.defaultNotifInterval);
            this.settings.maxAnnounce = Utils.validateRange(elements.maxAnnounceInput.value, CONFIG.minMaxAnnounce, CONFIG.maxMaxAnnounce, CONFIG.defaultMaxAnnounce);
            SafeStorage.setJSON('cm_notif_opts', this.settings);
            elements.notifIntervalInput.value = this.settings.notifInterval;
            elements.maxAnnounceInput.value = this.settings.maxAnnounce;
        }

        updateStatus(msg) { elements.statusText.textContent = msg; }

        testNotification() {
            const rows = TableParser.getPendingTransactions();
            const validRows = rows.filter(r => r['Jumlah'] > 0);
            if (!validRows.length) { Notifier.announceEmpty(); this.updateStatus('Tidak ada pending'); }
            else { Notifier.announce(validRows, this.settings.maxAnnounce); this.updateStatus(`${validRows.length} transaksi ditemukan`); }
        }

        start() {
            if (this.running) return;
            this.running = true;
            this.saveSettings();
            elements.startBtn.style.display = 'none';
            elements.stopBtn.style.display = 'flex';
            this.updateStatus(`Aktif - interval ${this.settings.notifInterval}s`);
            this.startNotifications();
        }

        stop() {
            if (this.notifTimer) clearInterval(this.notifTimer);
            this.running = false;
            elements.startBtn.style.display = 'flex';
            elements.stopBtn.style.display = 'none';
            this.updateStatus('Stopped');
        }

        startNotifications() {
            if (this.notifTimer) clearInterval(this.notifTimer);
            this.notifTimer = setInterval(() => {
                const rows = TableParser.getPendingTransactions();
                const validRows = rows.filter(r => r['Jumlah'] > 0);
                if (validRows.length) Notifier.announce(validRows, this.settings.maxAnnounce);
                this.updateStatus(validRows.length > 0 ? `${validRows.length} pending — ${new Date().toLocaleTimeString('id-ID')}` : `Cek ulang ${new Date().toLocaleTimeString('id-ID')}`);
            }, this.settings.notifInterval * 1000);
        }
    }

    Sound.init();
    Sound.load();
    setTimeout(() => {
        if (document.querySelector('#dataList')) new UIController();
    }, 2000);
})();
