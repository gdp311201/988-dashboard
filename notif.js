// ==UserScript==
// @name         Auto Notif Panel Cash Market v7.0 (Strict Interval & Dynamic Wording)
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  Baca tiap interval, grouping TTS, auto-detect, filter Auto-WD
// @match        https://*.com/dp/list/websocket*
// @match        https://*.com/wd/list/websocket*
// @match        https://asia77cash.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

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
                window.speechSynthesis.cancel(); // Clear queue biar gak numpuk
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

    // ==========================================================
    // NOTIFIER DENGAN LOGIKA PENGGENGANJANGAN KALIMAT DYNAMIC
    // ==========================================================
    const Notifier = {
        announce(rows, maxAnnounce, userTriggered = false) {
            if (!rows.length) return;
            
            const brand = TableParser.getActiveBrand();
            let text;

            if (rows.length === 1) {
                // Kalau cuma 1
                const r = rows[0];
                text = `${brand} - ${r['Nama Pengguna']} ${actionText} ${Utils.formatIDR(r['Jumlah'])} ke ${r['Payment To']}`;
            } else if (rows.length > maxAnnounce) {
                // Kalau lebih dari batas max items (misal >4)
                text = `${brand}, ada lebih dari ${maxAnnounce} transaksi ${actionText} pending.`;
            } else {
                // Kalau 2 sampai max items (misal 2-4)
                const ordinals = ['Pertama', 'Kedua', 'Ketiga', 'Berikutnya'];
                const parts = rows.slice(0, maxAnnounce).map((r, i) => {
                    const ord = ordinals[i] || 'Berikutnya';
                    return `${ord}, ${r['Nama Pengguna']}, ${Utils.formatIDR(r['Jumlah'])}, ke ${r['Payment To']}`;
                });
                text = `${brand}, ada ${rows.length} transaksi ${actionText} pending. ${parts.join('. ')}.`;
            }
            
            Sound.speak(text);
        },
        announceEmpty() { Sound.speak('Tidak ada transaksi menunggu'); }
    };

    class UIController {
        constructor() {
            this.running = false;
            this.notifTimer = null;
            this.settings = {
                notifInterval: CONFIG.defaultNotifInterval,
                maxAnnounce: CONFIG.defaultMaxAnnounce
            };
            this.createUI();
            this.loadSettings();
            this.bindEvents();
        }

        createUI() {
            document.getElementById('__cmNotifPanel')?.remove();
            const shell = document.createElement('div');
            shell.id = '__cmNotifPanel';
            document.body.appendChild(shell);
            this.root = shell.attachShadow({ mode: 'open' });
            const style = document.createElement('style');
            style.textContent = `
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap');
                *{box-sizing:border-box;margin:0;padding:0;font-family:'Roboto',sans-serif !important;}
                .card{position:fixed;width:320px;top:50%;left:50%;transform:translate(-50%,-50%);z-index:2147483647;font-size:14px;color:#111;background:#fff;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,0.5);border:2px solid #f97316;overflow:hidden}
                .header{display:flex;align-items:center;gap:8px;padding:12px 16px;background:#111;color:#fff;cursor:move;user-select:none}
                .logo-icon{width:24px;height:24px;border-radius:4px;object-fit:contain}
                .title{flex:1;font-size:14px;font-weight:700;letter-spacing:1px;display:flex;align-items:center;gap:8px}
                .title span.acc{color:#f97316}
                .header-btn{width:30px;height:30px;border:none;background:rgba(249,115,22,0.15);color:#f97316;border-radius:6px;cursor:pointer;font-size:14px}
                .body{padding:16px;background:#fff;max-height:450px;overflow-y:auto}
                .body.minimized{max-height:0;padding-top:0;padding-bottom:0;opacity:0;overflow:hidden}
                .tabs{display:flex;gap:4px;margin-bottom:16px;background:#f3f4f6;padding:4px;border-radius:8px}
                .tab{flex:1;padding:8px;border:none;background:transparent;color:#666;border-radius:6px;cursor:pointer;font-weight:700;font-size:11px;text-transform:uppercase}
                .tab.active{background:#f97316;color:#fff}
                .tab-content{display:none}
                .tab-content.active{display:block}
                .form-group{margin-bottom:12px}
                .label{display:block;font-size:11px;font-weight:700;margin-bottom:5px}
                .input{width:100%;padding:8px 10px;border:1px solid #ddd;border-radius:6px;font-size:13px;background:#fff;color:#111}
                .btn{width:100%;height:42px;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;margin-top:6px;text-transform:uppercase}
                .btn-start{background:#f97316;color:#fff;box-shadow:0 4px 14px rgba(249,115,22,0.35)}
                .btn-stop{background:#fff;color:#111;border:2px solid #111;display:none}
                .btn-secondary{background:#fff7ed;color:#f97316;border:1px solid #fed7aa;height:38px;font-size:12px}
                .footer{padding:10px 16px;background:#fafafa;border-top:2px solid #f97316;font-size:11px;display:flex;justify-content:space-between}
                .footer.minimized{display:none}
            `;
            this.root.appendChild(style);
            const card = document.createElement('div');
            card.className = 'card';
            
            const logoUrl = "https://i.ibb.co/Xk66G0bC/8-logo.png";
            const modeLabel = activeMode === 'wd' ? 'WITHDRAW' : 'DEPOSIT';
            
            card.innerHTML = `
                <div class="header" id="header">
                    <div class="title">
                        <img src="${logoUrl}" class="logo-icon" alt="logo">
                        NOTIF <span class="acc">PRO</span>
                        <span id="brandTitle" style="color:#fff;background:#f97316;padding:2px 8px;border-radius:4px;font-size:10px;">LOADING...</span>
                    </div>
                    <button class="header-btn" id="soundBtn" title="Sound">🔊</button>
                    <button class="header-btn" id="minimizeBtn" title="Minimize">—</button>
                    <button class="header-btn" id="closeBtn" title="Close">✕</button>
                </div>
                <div class="body" id="body">
                    <div class="tabs">
                        <button class="tab active" data-tab="transaksi">Transaksi</button>
                        <button class="tab" data-tab="setting">Setting</button>
                    </div>

                    <div class="tab-content active" id="tab-transaksi">
                        <div class="form-group">
                            <label class="label">Mode Aktif: <b style="color:#f97316">${modeLabel}</b></label>
                        </div>
                        <div class="form-group">
                            <label class="label">Interval Notifikasi (detik)</label>
                            <input type="number" id="notifIntervalInput" class="input" min="5" max="120" value="15">
                        </div>
                        <div class="form-group">
                            <label class="label">Max Items di Bacakan</label>
                            <input type="number" id="maxAnnounceInput" class="input" min="1" max="10" value="4">
                        </div>
                        <button class="btn btn-secondary" id="testNotifBtn">🔊 Test Notif Sekarang</button>
                        <button class="btn btn-start" id="startBtn">▶ START NOTIF</button>
                        <button class="btn btn-stop" id="stopBtn">■ STOP NOTIF</button>
                    </div>

                    <div class="tab-content" id="tab-setting">
                        <div class="form-group">
                            <label class="label">Pilih Bahasa TTS</label>
                            <select id="langSelect" class="input">
                                <option value="id-ID">🇮🇩 Bahasa Indonesia</option>
                                <option value="en-US">🇬🇧 English (US)</option>
                                <option value="en-GB">🇬🇧 English (UK)</option>
                                <option value="zh-CN">🇨🇳 Mandarin (CN)</option>
                                <option value="jv-ID">🇮🇩 Jawa</option>
                                <option value="su-ID">🇮🇩 Sunda</option>
                                <option value="id-ID" data-accent="medan">🇮🇩 Medan (Indonesia)</option>
                            </select>
                        </div>
                        <div class="form-group" style="margin-top:20px;background:#fff7ed;padding:10px;border:1px solid #fed7aa;border-radius:8px;">
                            <small style="color:#9a3412;font-size:10px">Note: Dialek Medan/Jowo menggunakan suara bawaan browser yang tersedia.</small>
                        </div>
                    </div>
                </div>
                <div class="footer" id="footer">
                    <span class="status-text" id="statusText">Ready</span>
                    <span id="timeText" style="color:#f97316;font-weight:700">00:00:00</span>
                </div>
            `;
            this.root.appendChild(card);
            this.elements = {
                card,
                header: this.root.getElementById('header'),
                startBtn: this.root.getElementById('startBtn'),
                stopBtn: this.root.getElementById('stopBtn'),
                soundBtn: this.root.getElementById('soundBtn'),
                minimizeBtn: this.root.getElementById('minimizeBtn'),
                closeBtn: this.root.getElementById('closeBtn'),
                notifIntervalInput: this.root.getElementById('notifIntervalInput'),
                maxAnnounceInput: this.root.getElementById('maxAnnounceInput'),
                testNotifBtn: this.root.getElementById('testNotifBtn'),
                statusText: this.root.getElementById('statusText'),
                brandTitle: this.root.getElementById('brandTitle'),
                timeText: this.root.getElementById('timeText'),
                tabs: [...this.root.querySelectorAll('.tab')],
                tabContents: { transaksi: this.root.getElementById('tab-transaksi'), setting: this.root.getElementById('tab-setting') },
                langSelect: this.root.getElementById('langSelect'),
                body: this.root.getElementById('body'),
                footer: this.root.getElementById('footer')
            };
        }

        bindEvents() {
            this.elements.startBtn.addEventListener('click', () => this.start());
            this.elements.stopBtn.addEventListener('click', () => this.stop());
            this.elements.soundBtn.addEventListener('click', () => { Sound.enabled = !Sound.enabled; Sound.save(); this.updateSoundButton(); });
            this.elements.closeBtn.addEventListener('click', () => { const h = document.getElementById('__cmNotifPanel'); if(h) h.remove(); });
            this.elements.minimizeBtn.addEventListener('click', () => this.toggleMinimize());
            
            this.elements.testNotifBtn.addEventListener('click', () => this.testNotification(true));
            this.elements.notifIntervalInput.addEventListener('change', () => { this.saveSettings(); if (this.running) this.startNotifications(); });
            this.elements.maxAnnounceInput.addEventListener('change', () => this.saveSettings());
            this.elements.langSelect.addEventListener('change', () => { Sound.language = this.elements.langSelect.value; Sound.save(); });
            
            this.elements.tabs.forEach(tab => tab.addEventListener('click', () => this.switchTab(tab.getAttribute('data-tab'))));
            
            setInterval(() => {
                this.elements.brandTitle.textContent = TableParser.getActiveBrand();
                this.elements.timeText.textContent = new Date().toLocaleTimeString('id-ID');
            }, 1000);

            this.makeDraggable();
        }

        makeDraggable() {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            const h = this.elements.header;
            const c = this.elements.card;
            
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
                if (e.target.closest('.header-btn')) return;
                e.preventDefault();
                c.style.transform = 'none';
                pos3 = e.clientX;
                pos4 = e.clientY;
                window.addEventListener('mousemove', onMouseMove);
                window.addEventListener('mouseup', onMouseUp);
            };
        }

        toggleMinimize() {
            const hidden = this.elements.body.classList.contains('minimized');
            if (hidden) {
                this.elements.body.classList.remove('minimized');
                this.elements.footer.classList.remove('minimized');
                this.elements.minimizeBtn.textContent = '—';
            } else {
                this.elements.body.classList.add('minimized');
                this.elements.footer.classList.add('minimized');
                this.elements.minimizeBtn.textContent = '□';
            }
        }

        switchTab(tabName) {
            this.elements.tabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-tab') === tabName));
            Object.keys(this.elements.tabContents).forEach(k => this.elements.tabContents[k].classList.toggle('active', k === tabName));
        }

        loadSettings() {
            const saved = SafeStorage.getJSON('__cm_opts', {});
            if (saved.notifInterval) this.elements.notifIntervalInput.value = Utils.validateRange(saved.notifInterval, CONFIG.minNotifInterval, CONFIG.maxNotifInterval, CONFIG.defaultNotifInterval);
            if (saved.maxAnnounce) this.elements.maxAnnounceInput.value = Utils.validateRange(saved.maxAnnounce, CONFIG.minMaxAnnounce, CONFIG.maxMaxAnnounce, CONFIG.defaultMaxAnnounce);
            this.elements.langSelect.value = Sound.language;
            this.updateSoundButton();
        }

        saveSettings() {
            this.settings.notifInterval = Utils.validateRange(this.elements.notifIntervalInput.value, CONFIG.minNotifInterval, CONFIG.maxNotifInterval, CONFIG.defaultNotifInterval);
            this.settings.maxAnnounce = Utils.validateRange(this.elements.maxAnnounceInput.value, CONFIG.minMaxAnnounce, CONFIG.maxMaxAnnounce, CONFIG.defaultMaxAnnounce);
            SafeStorage.setJSON('__cm_opts', this.settings);
            this.elements.notifIntervalInput.value = this.settings.notifInterval;
            this.elements.maxAnnounceInput.value = this.settings.maxAnnounce;
        }

        updateSoundButton() { this.elements.soundBtn.textContent = Sound.enabled ? '🔊' : '🔇'; }
        updateStatus(msg) { this.elements.statusText.textContent = msg; }

        testNotification(bypassCache = false) {
            const rows = TableParser.getPendingTransactions();
            const validRows = rows.filter(r => r['Jumlah'] > 0);
            if (!validRows.length) { Notifier.announceEmpty(); this.updateStatus('Tidak ada pending'); }
            else { Notifier.announce(validRows, this.settings.maxAnnounce, bypassCache); this.updateStatus(`${validRows.length} transaksi ditemukan`); }
        }

        start() {
            if (this.running) return;
            this.running = true;
            this.saveSettings();
            this.elements.startBtn.style.display = 'none';
            this.elements.stopBtn.style.display = 'block';
            this.updateStatus(`Aktif - interval ${this.settings.notifInterval}s`);
            this.startNotifications();
        }

        stop() {
            if (this.notifTimer) clearInterval(this.notifTimer);
            this.running = false;
            this.elements.startBtn.style.display = 'block';
            this.elements.stopBtn.style.display = 'none';
            this.updateStatus('Stopped');
        }

        startNotifications() {
            if (this.notifTimer) clearInterval(this.notifTimer);
            // Strict interval: Bakal baca tabel & ngomong tiap interval selesai
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
