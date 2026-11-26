import { enterVillageMode, enterFirstPersonRoom } from './villageMap.js';

let terminalData = { certificates: [], projects: [] };
let getThemeState = () => true;
let setThemeState = () => {};
let setAvailabilityState = () => {};

export function initTerminalCli({ certificates, projects, isDark, onSetTheme, onSetAvailability }) {
  terminalData = { certificates, projects };
  getThemeState = isDark;
  setThemeState = onSetTheme;
  setAvailabilityState = onSetAvailability;
}

export function isDesktopEnvironment() {
  const ua = navigator.userAgent || '';
  const isMobileAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isSmallTouchDevice = isMobileAgent && Math.min(window.screen.width || 9999, window.screen.height || 9999) < 768;
  return !isSmallTouchDevice;
}

export function syncDesktopOnlyVisibility() {
  const isDesktop = isDesktopEnvironment();
  const navTermBtn = document.getElementById('nav-terminal-btn');
  const waContainer = document.getElementById('wa-secret-toast-container');
  if (navTermBtn) navTermBtn.style.display = isDesktop ? 'flex' : 'none';
  if (waContainer) waContainer.style.display = isDesktop ? 'flex' : 'none';
}

window.addEventListener('resize', syncDesktopOnlyVisibility);

let secretDotsCount = 0;
let secretDotsTimer = null;
export function handleSecretDotsClick() {
  if (!isDesktopEnvironment()) return;
  secretDotsCount++;
  clearTimeout(secretDotsTimer);
  secretDotsTimer = setTimeout(() => { secretDotsCount = 0; }, 1500);
  if (secretDotsCount >= 5) {
    secretDotsCount = 0;
    openCheatConsole();
  }
}

let typedSecretBuffer = '';
window.addEventListener('keypress', (e) => {
  if (!isDesktopEnvironment()) return;
  const activeTag = document.activeElement && document.activeElement.tagName;
  if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return;
  typedSecretBuffer = (typedSecretBuffer + e.key.toLowerCase()).slice(-12);
  if (typedSecretBuffer.includes('stardew') || typedSecretBuffer.includes('harvest')) {
    typedSecretBuffer = '';
    enterVillageMode();
  }
});

const TERMINAL_COMMANDS = [
  'help', 'village', 'neofetch', 'whoami', 'ls',
  'certs', 'projects', 'education', 'skills',
  'goto home', 'goto gallery', 'goto callcenter', 'goto museum', 'goto education',
  'theme dark', 'theme light', 'status open', 'status closed',
  'contact --wa', 'contact --email',
  'matrix', 'coffee', 'clear', 'exit'
];

const commandHistory = [];
let historyCursor = -1;

export function openCheatConsole() {
  if (!isDesktopEnvironment()) return;
  const modal = document.getElementById('cheat-console-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  const input = document.getElementById('cheat-code-input');
  if (input) {
    input.value = '';
    setTimeout(() => input.focus(), 60);
  }
}

export function closeCheatConsole() {
  const modal = document.getElementById('cheat-console-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function appendTerminalLine(htmlContent) {
  const log = document.getElementById('terminal-output-log');
  if (!log) return;
  const line = document.createElement('div');
  line.innerHTML = htmlContent;
  log.appendChild(line);
  log.scrollTop = log.scrollHeight;
}

const cmdInputEl = document.getElementById('cheat-code-input');
if (cmdInputEl) {
  cmdInputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const val = cmdInputEl.value.trim().toLowerCase();
      if (!val) return;
      const match = TERMINAL_COMMANDS.find(c => c.startsWith(val));
      if (match) cmdInputEl.value = match;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        historyCursor = Math.min(commandHistory.length - 1, historyCursor + 1);
        cmdInputEl.value = commandHistory[commandHistory.length - 1 - historyCursor];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyCursor > 0) {
        historyCursor--;
        cmdInputEl.value = commandHistory[commandHistory.length - 1 - historyCursor];
      } else {
        historyCursor = -1;
        cmdInputEl.value = '';
      }
    }
  });
}

export function submitCheatCode(e) {
  e.preventDefault();
  const input = document.getElementById('cheat-code-input');
  if (!input) return;
  const rawCmd = input.value.trim();
  if (!rawCmd) return;

  commandHistory.push(rawCmd);
  historyCursor = -1;

  const safeRaw = rawCmd.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  appendTerminalLine(`<span class="text-emerald-400 font-bold">guest@ziyyan-os:~$</span> <span class="text-white">${safeRaw}</span>`);
  input.value = '';

  const cmd = rawCmd.toLowerCase();

  if (cmd === 'help') {
    appendTerminalLine(`<div class="text-amber-300 font-bold pt-1">Daftar Perintah ZiyyanOS CLI:</div>`);
    appendTerminalLine(`&nbsp;&nbsp;<span class="text-emerald-400">village</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;— Masuk ke Peta Desa Interaktif`);
    appendTerminalLine(`&nbsp;&nbsp;<span class="text-emerald-400">goto &lt;zona&gt;</span> &nbsp;&nbsp;&nbsp;&nbsp;— Langsung ke ruangan (home, gallery, callcenter, museum, education)`);
    appendTerminalLine(`&nbsp;&nbsp;<span class="text-emerald-400">neofetch / whoami</span> — Informasi profil &amp; spesifikasi sistem ZiyyanOS`);
    appendTerminalLine(`&nbsp;&nbsp;<span class="text-emerald-400">certs / projects</span> — Lihat daftar sertifikat &amp; proyek pilihan`);
    appendTerminalLine(`&nbsp;&nbsp;<span class="text-emerald-400">theme dark|light</span> — Ubah mode tema website`);
    appendTerminalLine(`&nbsp;&nbsp;<span class="text-emerald-400">contact --wa</span> &nbsp;&nbsp;&nbsp;— Buka WhatsApp / <span class="text-emerald-400">contact --email</span> untuk salin email`);
    appendTerminalLine(`&nbsp;&nbsp;<span class="text-emerald-400">matrix / coffee</span> &nbsp;— Easter egg visual &amp; sapaan developer`);
    appendTerminalLine(`&nbsp;&nbsp;<span class="text-emerald-400">clear / exit</span> &nbsp;&nbsp;&nbsp;— Bersihkan layar atau tutup terminal`);
  } else if (cmd === 'village' || cmd === 'stardew') {
    appendTerminalLine(`<span class="text-sky-400">[OK] Memuat ZiyyanOS Interactive Village Map...</span>`);
    setTimeout(() => { closeCheatConsole(); enterVillageMode(); }, 350);
  } else if (cmd === 'neofetch' || cmd === 'whoami') {
    appendTerminalLine(`<div class="p-2 my-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
      <span class="text-amber-400 font-bold">ziyyan@workstation</span><br>
      ----------------------<br>
      <span class="text-sky-400">Full Name:</span> Muhammad Fachrul Reihan Fauzian<br>
      <span class="text-sky-400">Callsign:</span> Ziyyan<br>
      <span class="text-sky-400">Education:</span> S1 Teknik Informatika — Univ. Kuningan (IPK 3.69)<br>
      <span class="text-sky-400">Highlight:</span> Google Cloud Arcade Facilitator (173 Mentees)<br>
      <span class="text-sky-400">Thesis:</span> Interactive Game Development with Unity<br>
      <span class="text-sky-400">Stack:</span> Laravel, PHP, MySQL, Tailwind, GCP, Unity, Git
    </div>`);
  } else if (cmd === 'ls') {
    appendTerminalLine(`<span class="text-sky-400">about.md &nbsp; cert-gallery.app &nbsp; projects.showcase &nbsp; stack.deps &nbsp; village-map/</span>`);
  } else if (cmd === 'certs') {
    terminalData.certificates.forEach((c, i) => {
      appendTerminalLine(`<span class="text-amber-300">[0${i + 1}]</span> ${c.title} <span class="text-slate-500">(${c.issuer}, ${c.year})</span>`);
    });
  } else if (cmd === 'projects') {
    terminalData.projects.forEach((p, i) => {
      appendTerminalLine(`<span class="text-emerald-400">[P${i + 1}]</span> ${p.title} — <span class="text-slate-400">${p.tag}</span>`);
    });
  } else if (cmd === 'education') {
    appendTerminalLine(`<span class="text-violet-400">[2022–2026]</span> S1 Teknik Informatika — Universitas Kuningan (IPK: 3,69)`);
    appendTerminalLine(`<span class="text-amber-400">[2019–2022]</span> Teknik Komputer &amp; Jaringan — SMK Budi Mulia Karawang`);
  } else if (cmd === 'skills') {
    appendTerminalLine(`<span class="text-sky-300">Tech:</span> Laravel, PHP, MySQL, Tailwind CSS, GCP, Unity, Git, Figma`);
    appendTerminalLine(`<span class="text-emerald-300">Next Focus:</span> Kubernetes, Containerization, Linux, Observability`);
  } else if (cmd === 'theme dark') {
    setThemeState(true);
    appendTerminalLine(`<span class="text-emerald-400">[OK] Tema diubah ke Dark Mode.</span>`);
  } else if (cmd === 'theme light') {
    setThemeState(false);
    appendTerminalLine(`<span class="text-emerald-400">[OK] Tema diubah ke Light Mode.</span>`);
  } else if (cmd === 'status open') {
    setAvailabilityState(true);
    appendTerminalLine(`<span class="text-emerald-400">[OK] Status diperbarui menjadi: Open to Work (Hijau).</span>`);
  } else if (cmd === 'status closed') {
    setAvailabilityState(false);
    appendTerminalLine(`<span class="text-rose-400">[OK] Status diperbarui menjadi: Not Open to Work (Merah).</span>`);
  } else if (cmd === 'contact --wa') {
    appendTerminalLine(`<span class="text-emerald-400">[OK] Membuka WhatsApp...</span>`);
    window.open('https://wa.me/6281234567890', '_blank', 'noopener');
  } else if (cmd === 'contact --email') {
    if (navigator.clipboard) navigator.clipboard.writeText('ziyyan.fauzian@example.com');
    appendTerminalLine(`<span class="text-emerald-400">[OK] Email 'ziyyan.fauzian@example.com' disalin ke clipboard!</span>`);
  } else if (cmd === 'matrix') {
    document.getElementById('terminal-output-log').classList.add('text-emerald-400');
    appendTerminalLine(`<span class="text-emerald-400 font-bold">Wake up, Neo... The Cloud has you. Follow the white rabbit.</span>`);
  } else if (cmd === 'coffee' || cmd === 'brew coffee') {
    appendTerminalLine(`<pre class="text-amber-300 text-[11px] leading-tight pt-1">    ( (
     ) )
  ........
  |      |]   Brewing fresh espresso...
  \\      /    Status: Ready to architect scalable cloud systems!
   \`----'</pre>`);
  } else if (cmd === 'override' || cmd === 'sudo override' || cmd === 'sudo unlock') {
    appendTerminalLine(`<span class="text-rose-400 font-bold">[ERR] Unhandled exception at 0x004F9A: memory segment corrupted</span>`);
    triggerSystemGlitchPrank(rawCmd);
  } else if (cmd === 'mist' || cmd === 'fog' || cmd === 'embun') {
    appendTerminalLine(`<span class="text-sky-300 font-bold">[OK] Menurunkan suhu layar ke 12°C...</span>`);
    setTimeout(() => { closeCheatConsole(); openMistGlass(); }, 400);
  } else if (cmd === 'secret') {
    appendTerminalLine(`<span class="text-amber-400">[WARN] I/O bus latency spike on /dev/nvme0n1...</span>`);
    triggerBsodSequenceWithRealisticGlitch();
  } else if (cmd.startsWith('goto ')) {
    const target = cmd.replace('goto ', '').trim();
    const zoneMap = {
      home: 'about', about: 'about',
      gallery: 'projects', projects: 'projects',
      callcenter: 'contact', contact: 'contact',
      museum: 'gallery', certs: 'gallery',
      education: 'education', edu: 'education'
    };
    if (zoneMap[target]) {
      appendTerminalLine(`<span class="text-sky-400">[OK] Teleportasi ke ruangan '${target}'...</span>`);
      setTimeout(() => {
        closeCheatConsole();
        enterVillageMode();
        enterFirstPersonRoom(zoneMap[target]);
      }, 350);
    } else {
      appendTerminalLine(`<span class="text-rose-400">Zona '${target}' tidak ditemukan. Gunakan: home, gallery, callcenter, museum, atau education.</span>`);
    }
  } else if (cmd === 'clear' || cmd === 'cls') {
    document.getElementById('terminal-output-log').innerHTML = '';
  } else if (cmd === 'exit' || cmd === 'quit') {
    closeCheatConsole();
  } else {
    appendTerminalLine(`<span class="text-rose-400">Command '${safeRaw}' tidak dikenali. Ketik <span class="text-amber-300">'help'</span> untuk melihat daftar perintah.</span>`);
  }
}

// Easter Egg #1: Glitch & Matrix
let isGlitchRunning = false;
let matrixAnimId = null;

function startMatrixRain() {
  const canvas = document.getElementById('matrixPrankCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const phrase = 'cloudcomputing2026 • ziyyanos2026 • fachrulreihan • gcp-architect • fullstack-dev • kubernetes • terraform • golang-api • 01011001 • ';
  const fontSize = 13;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = Array.from({ length: columns }, (_, idx) => (idx * 7) % phrase.length);

  function drawMatrix() {
    ctx.fillStyle = 'rgba(2, 6, 23, 0.14)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `600 ${fontSize}px "JetBrains Mono", monospace`;

    for (let i = 0; i < drops.length; i++) {
      const charIndex = (drops[i] + i * 5) % phrase.length;
      const text = phrase.charAt(charIndex);
      ctx.fillStyle = charIndex < 33 ? '#34d399' : (i % 2 === 0 ? '#10b981' : '#059669');
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.965) drops[i] = 0;
      drops[i]++;
    }
    matrixAnimId = requestAnimationFrame(drawMatrix);
  }
  drawMatrix();
}

function stopMatrixRain() {
  if (matrixAnimId) { cancelAnimationFrame(matrixAnimId); matrixAnimId = null; }
}

function triggerSystemGlitchPrank(triggerCmd) {
  if (isGlitchRunning) return;
  isGlitchRunning = true;

  const overlay = document.getElementById('glitch-prank-overlay');
  const cardEl = document.getElementById('glitch-prank-card');
  const headerEl = document.getElementById('glitch-prank-header');
  const badgeEl = document.getElementById('glitch-prank-badge');
  const titleEl = document.getElementById('glitch-prank-title');
  const subEl = document.getElementById('glitch-prank-sub');
  const consoleEl = document.getElementById('glitch-prank-console');
  const barEl = document.getElementById('glitch-prank-bar');
  const statusEl = document.getElementById('glitch-prank-status');
  const rebootBtn = document.getElementById('glitch-reboot-btn');
  const iconEl = document.getElementById('glitch-prank-icon');

  setTimeout(() => {
    appendTerminalLine(`<span class="text-amber-400">[WARN] Kernel watchdog timeout — attempting session recovery...</span>`);
    document.body.classList.add('system-glitch-active');
    setTimeout(() => document.body.classList.remove('system-glitch-active'), 260);
    setTimeout(() => document.body.classList.add('system-glitch-active'), 520);
    setTimeout(() => document.body.classList.remove('system-glitch-active'), 780);
    setTimeout(() => {
      appendTerminalLine(`<span class="text-rose-400">[CRIT] TTY1 hijacked by unknown process. Rerouting display...</span>`);
      document.body.classList.add('system-glitch-active');
    }, 1050);
  }, 900);

  setTimeout(() => {
    consoleEl.innerHTML = '';
    rebootBtn.classList.add('hidden');
    iconEl.className = 'fa-solid fa-triangle-exclamation text-rose-400 animate-pulse';
    headerEl.className = 'px-4 py-2.5 bg-rose-950/70 border-b border-rose-500/40 flex items-center justify-between text-[11px] transition-colors duration-300';
    badgeEl.className = 'text-rose-300 font-bold';
    titleEl.textContent = 'CONNECTION INTERRUPTED';
    titleEl.className = 'text-base sm:text-lg font-extrabold text-rose-400 tracking-wide';
    subEl.textContent = `Process '${triggerCmd}' triggered an unverified root hook on tty1`;
    barEl.style.width = '8%';
    statusEl.textContent = 'Tracing process PID 4092...';

    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
    cardEl.classList.remove('glitch-card-enter');
    void cardEl.offsetWidth;
    cardEl.classList.add('glitch-card-enter');
    startMatrixRain();

    setTimeout(() => { document.body.classList.remove('system-glitch-active'); }, 750);

    const scriptSteps = [
      { pct: 8, text: '> Hooking tty1 input stream... [OK]' },
      { pct: 16, text: '> Bypassing session sandbox... [DONE]' },
      { pct: 24, text: '> Dumping local environment variables...' },
      { pct: 33, text: '> Inspecting network sockets on 127.0.0.1:8080...' },
      { pct: 42, text: '> Reading click_heatmap & idle_timer... [99.4%]' },
      { pct: 51, text: '> Escalating privileges to root@ziyyan-os...' },
      { pct: 60, text: '> Enumerating cloud nodes: cloudcomputing2026...' },
      { pct: 69, text: '> Mounting /dev/sda1/secret_stash... [READ-ONLY]' },
      { pct: 78, text: '> Checking coffee_supply.service... [ERR: 0% LEFT]' },
      { pct: 86, text: '> Decrypting payload checksum (SHA-256)...' },
      { pct: 93, text: '> cat /root/.note' },
      { pct: 97, text: '...' },
      { pct: 99, text: '......' },
      { pct: 100, text: 'Ngapain iseng banget nyari-nyari sampai sini? Hahaha, makasih ya udah mampir & ngulik portofolio Ziyyan.' }
    ];

    let idx = 0;
    const stepTimer = setInterval(() => {
      if (idx < scriptSteps.length) {
        const line = document.createElement('div');
        line.textContent = scriptSteps[idx].text;
        if (idx === scriptSteps.length - 1) {
          line.className = 'text-amber-300 font-semibold pt-2 leading-relaxed border-t border-slate-800/80 mt-2';
          headerEl.className = 'px-4 py-2.5 bg-emerald-950/70 border-b border-emerald-500/30 flex items-center justify-between text-[11px] transition-colors duration-300';
          badgeEl.className = 'text-emerald-300 font-bold';
          iconEl.className = 'fa-solid fa-face-grin-wink text-emerald-400';
          titleEl.textContent = 'GOTCHA! 👀';
          titleEl.className = 'text-base sm:text-lg font-extrabold text-emerald-400 tracking-wide';
          subEl.textContent = 'Ketahuan juga akhirnya.';
          statusEl.textContent = 'Session intact.';
          rebootBtn.classList.remove('hidden');
        }
        consoleEl.appendChild(line);
        consoleEl.scrollTop = consoleEl.scrollHeight;
        barEl.style.width = `${scriptSteps[idx].pct}%`;
        idx++;
      } else {
        clearInterval(stepTimer);
      }
    }, 1650);
  }, 3200);
}

export function finishGlitchPrank() {
  stopMatrixRain();
  document.body.classList.remove('system-glitch-active');
  const overlay = document.getElementById('glitch-prank-overlay');
  overlay.classList.add('hidden');
  overlay.classList.remove('flex');
  isGlitchRunning = false;
  appendTerminalLine(`<span class="text-emerald-400 font-bold">[OK] Session restored (tty1).</span>`);
  scheduleSecondEasterEggHint();
}

let secondHintTriggered = false;
function scheduleSecondEasterEggHint() {
  if (secondHintTriggered) return;
  secondHintTriggered = true;
  setTimeout(() => pushWhatsAppBubble('Eh, masih lanjut? Lumayan juga nyalinya...'), 4000);
  setTimeout(() => pushWhatsAppBubble('Satu lagi deh: ketik <code class="wa-cmd-pill">mist</code> di Terminal, terus liat layarnya ngembun ❄️', true), 7200);
}

// Easter Egg #2: Layar Berembun
let mistAnimId = null;
let mistBreathTimer = null;
let mistBreathAnimId = null;
let isWipingMist = false;
let lastMistPoint = null;

export function openMistGlass() {
  const overlay = document.getElementById('mist-glass-overlay');
  if (!overlay) return;
  overlay.classList.remove('hidden');
  overlay.classList.add('block');
  resetMistGlass();
}

export function closeMistGlass() {
  if (mistAnimId) { cancelAnimationFrame(mistAnimId); mistAnimId = null; }
  if (mistBreathTimer) { clearTimeout(mistBreathTimer); mistBreathTimer = null; }
  if (mistBreathAnimId) { cancelAnimationFrame(mistBreathAnimId); mistBreathAnimId = null; }
  const overlay = document.getElementById('mist-glass-overlay');
  if (overlay) { overlay.classList.add('hidden'); overlay.classList.remove('block'); }
  revealFinalSecretInTerminal();
}

let finalHintTriggered = false;
function revealFinalSecretInTerminal() {
  if (finalHintTriggered) return;
  finalHintTriggered = true;
  setTimeout(() => {
    if (!isDesktopEnvironment()) return;
    openCheatConsole();
    appendTerminalLine(`<span class="text-slate-400">[SYS] Display condensation cleared.</span>`);
    setTimeout(() => {
      appendTerminalLine(`<span class="text-slate-600 text-[11px]">[DEBUG] symbol 'secret' excluded from help_table (addr 0x7f4a)</span>`);
    }, 700);
  }, 750);
}

export function resetMistGlass() {
  if (mistAnimId) { cancelAnimationFrame(mistAnimId); mistAnimId = null; }
  if (mistBreathTimer) { clearTimeout(mistBreathTimer); mistBreathTimer = null; }
  if (mistBreathAnimId) { cancelAnimationFrame(mistBreathAnimId); mistBreathAnimId = null; }

  const canvas = document.getElementById('mistGlassCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const w = canvas.width;
  const h = canvas.height;

  ctx.globalCompositeOperation = 'source-over';
  const fogGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, w * 0.08, w * 0.5, h * 0.5, Math.max(w, h) * 0.78);
  fogGrad.addColorStop(0, 'rgba(203, 213, 225, 0.78)');
  fogGrad.addColorStop(0.55, 'rgba(186, 204, 224, 0.85)');
  fogGrad.addColorStop(1, 'rgba(148, 163, 184, 0.90)');
  ctx.fillStyle = fogGrad;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 650; i++) {
    const dx = Math.random() * w;
    const dy = Math.random() * h;
    const r = 0.8 + Math.random() * 2.4;
    ctx.fillStyle = Math.random() > 0.35 ? `rgba(255, 255, 255, ${0.14 + Math.random() * 0.22})` : `rgba(148, 163, 184, ${0.12 + Math.random() * 0.16})`;
    ctx.beginPath();
    ctx.arc(dx, dy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  setTimeout(() => animateFingerWritingHi(ctx, w, h), 650);
}

function wipeMistStroke(ctx, x1, y1, x2, y2, radius = 19) {
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.lineWidth = radius * 1.45;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(0, 0, 0, 0.96)';
  ctx.lineWidth = radius;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function sampleCubicBezier(p0, p1, p2, p3, steps = 28) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    pts.push([
      (u * u * u * p0[0]) + (3 * u * u * t * p1[0]) + (3 * u * t * t * p2[0]) + (t * t * t * p3[0]),
      (u * u * u * p0[1]) + (3 * u * u * t * p1[1]) + (3 * u * t * t * p2[1]) + (t * t * t * p3[1])
    ]);
  }
  return pts;
}

function animateFingerWritingHi(ctx, w, h) {
  const cx = w * 0.5;
  const cy = h * 0.5;
  const minDim = Math.min(w, h);
  const scale = minDim < 520 ? (minDim / 380) : Math.min(1.42, minDim / 520);
  const brushRadius = Math.max(14, Math.round(21 * scale));

  const strokes = [
    [
      ...sampleCubicBezier([cx - 96 * scale, cy - 82 * scale], [cx - 100 * scale, cy - 22 * scale], [cx - 102 * scale, cy + 40 * scale], [cx - 104 * scale, cy + 84 * scale], 24),
      ...sampleCubicBezier([cx - 104 * scale, cy + 84 * scale], [cx - 170 * scale, cy + 88 * scale], [cx - 180 * scale, cy + 24 * scale], [cx - 106 * scale, cy + 12 * scale], 26),
      ...sampleCubicBezier([cx - 106 * scale, cy + 12 * scale], [cx - 68 * scale, cy + 6 * scale], [cx - 34 * scale, cy + 4 * scale], [cx - 8 * scale, cy + 2 * scale], 18)
    ],
    sampleCubicBezier([cx - 10 * scale, cy - 88 * scale], [cx - 13 * scale, cy - 28 * scale], [cx - 14 * scale, cy + 30 * scale], [cx - 12 * scale, cy + 82 * scale], 26),
    sampleCubicBezier([cx + 48 * scale, cy - 24 * scale], [cx + 45 * scale, cy + 18 * scale], [cx + 46 * scale, cy + 60 * scale], [cx + 76 * scale, cy + 80 * scale], 24),
    [[cx + 51 * scale, cy - 60 * scale], [cx + 52 * scale, cy - 59 * scale]],
    sampleCubicBezier([cx + 148 * scale, cy - 70 * scale], [cx + 143 * scale, cy - 32 * scale], [cx + 138 * scale, cy + 4 * scale], [cx + 134 * scale, cy + 34 * scale], 20),
    [[cx + 131 * scale, cy + 72 * scale], [cx + 132 * scale, cy + 73 * scale]]
  ];

  let sIdx = 0;
  let pIdx = 0;
  let pauseFrames = 0;

  function stepWrite() {
    if (pauseFrames > 0) { pauseFrames--; mistAnimId = requestAnimationFrame(stepWrite); return; }
    if (sIdx >= strokes.length) {
      mistAnimId = null;
      mistBreathTimer = setTimeout(() => startMultiSideBreathReFog(ctx, w, h), 2500);
      return;
    }
    const currentStroke = strokes[sIdx];
    if (pIdx < currentStroke.length - 1) {
      wipeMistStroke(ctx, currentStroke[pIdx][0], currentStroke[pIdx][1], currentStroke[pIdx + 1][0], currentStroke[pIdx + 1][1], brushRadius);
      pIdx++;
    } else {
      sIdx++;
      pIdx = 0;
      pauseFrames = 4;
    }
    mistAnimId = requestAnimationFrame(stepWrite);
  }
  mistAnimId = requestAnimationFrame(stepWrite);
}

function startMultiSideBreathReFog(ctx, w, h) {
  const totalDuration = 6000;
  const startTime = performance.now();
  const breathSources = [
    { x: w * 0.28, y: h * 0.48, delay: 0.00, maxR: Math.max(w, h) * 0.42 },
    { x: w * 0.72, y: h * 0.50, delay: 0.14, maxR: Math.max(w, h) * 0.42 },
    { x: w * 0.50, y: h * 0.28, delay: 0.26, maxR: Math.max(w, h) * 0.40 },
    { x: w * 0.44, y: h * 0.72, delay: 0.36, maxR: Math.max(w, h) * 0.40 },
    { x: w * 0.50, y: h * 0.50, delay: 0.48, maxR: Math.max(w, h) * 0.55 }
  ];

  function stepBreath(now) {
    const progress = Math.min(1, (now - startTime) / totalDuration);
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    breathSources.forEach((src) => {
      if (progress <= src.delay) return;
      const localP = Math.min(1, (progress - src.delay) / (1 - src.delay));
      const currentR = src.maxR * (0.2 + 0.8 * Math.sin(localP * (Math.PI * 0.5)));
      const plumeGrad = ctx.createRadialGradient(src.x, src.y, 4, src.x, src.y, currentR);
      plumeGrad.addColorStop(0, `rgba(218, 228, 238, ${0.045 * (1 - localP * 0.25)})`);
      plumeGrad.addColorStop(0.55, `rgba(203, 213, 225, ${0.032 * (1 - localP * 0.25)})`);
      plumeGrad.addColorStop(1, 'rgba(203, 213, 225, 0)');
      ctx.fillStyle = plumeGrad;
      ctx.beginPath();
      ctx.arc(src.x, src.y, currentR, 0, Math.PI * 2);
      ctx.fill();
    });
    if (progress > 0.35) {
      ctx.fillStyle = `rgba(203, 213, 225, ${(0.024 * ((progress - 0.35) / 0.65)).toFixed(4)})`;
      ctx.fillRect(0, 0, w, h);
    }
    ctx.restore();
    if (progress < 1) {
      mistBreathAnimId = requestAnimationFrame(stepBreath);
    } else {
      mistBreathAnimId = null;
    }
  }
  mistBreathAnimId = requestAnimationFrame(stepBreath);
}

const mistCanvasEl = document.getElementById('mistGlassCanvas');
if (mistCanvasEl) {
  const getPos = (e) => {
    const rect = mistCanvasEl.getBoundingClientRect();
    const pt = e.touches && e.touches[0] ? e.touches[0] : e;
    return { x: pt.clientX - rect.left, y: pt.clientY - rect.top };
  };
  const startWipe = (e) => {
    if (mistBreathTimer) { clearTimeout(mistBreathTimer); mistBreathTimer = null; }
    if (mistBreathAnimId) { cancelAnimationFrame(mistBreathAnimId); mistBreathAnimId = null; }
    isWipingMist = true;
    lastMistPoint = getPos(e);
    wipeMistStroke(mistCanvasEl.getContext('2d'), lastMistPoint.x, lastMistPoint.y, lastMistPoint.x + 0.1, lastMistPoint.y + 0.1, 24);
  };
  const moveWipe = (e) => {
    if (!isWipingMist || !lastMistPoint) return;
    const curr = getPos(e);
    wipeMistStroke(mistCanvasEl.getContext('2d'), lastMistPoint.x, lastMistPoint.y, curr.x, curr.y, 24);
    lastMistPoint = curr;
  };
  const endWipe = () => { isWipingMist = false; lastMistPoint = null; };

  mistCanvasEl.addEventListener('mousedown', startWipe);
  window.addEventListener('mousemove', moveWipe);
  window.addEventListener('mouseup', endWipe);
  mistCanvasEl.addEventListener('touchstart', startWipe, { passive: true });
  mistCanvasEl.addEventListener('touchmove', moveWipe, { passive: true });
  mistCanvasEl.addEventListener('touchend', endWipe);
}

// Easter Egg #3: BSOD & End Credits
let bsodProgressTimer = null;
let bsodCreditsTimer = null;
let bsodSequenceRunning = false;

function spawnScreenTearArtifacts(count = 5) {
  const existing = document.getElementById('bsod-tear-layer');
  if (existing) existing.remove();
  const layer = document.createElement('div');
  layer.id = 'bsod-tear-layer';
  layer.className = 'fixed inset-0 z-[95] pointer-events-none overflow-hidden';

  for (let i = 0; i < count; i++) {
    const bar = document.createElement('div');
    const colors = ['rgba(56, 189, 248, 0.32)', 'rgba(244, 63, 94, 0.28)', 'rgba(16, 185, 129, 0.25)', 'rgba(255, 255, 255, 0.22)'];
    bar.style.position = 'absolute';
    bar.style.left = '0';
    bar.style.right = '0';
    bar.style.top = `${Math.floor(Math.random() * 92)}%`;
    bar.style.height = `${4 + Math.floor(Math.random() * 22)}px`;
    bar.style.background = colors[i % colors.length];
    bar.style.transform = `translateX(${(Math.random() > 0.5 ? 1 : -1) * (10 + Math.floor(Math.random() * 36))}px)`;
    bar.style.mixBlendMode = 'screen';
    layer.appendChild(bar);
  }
  document.body.appendChild(layer);
  setTimeout(() => { if (layer.parentNode) layer.remove(); }, 190);
}

function triggerBsodSequenceWithRealisticGlitch() {
  if (bsodSequenceRunning) return;
  bsodSequenceRunning = true;

  setTimeout(() => {
    appendTerminalLine(`<span class="text-rose-400">[ERR] Page fault in nonpaged area (0x00000050)</span>`);
    document.body.style.filter = 'contrast(1.3) brightness(0.88)';
    spawnScreenTearArtifacts(2);
    setTimeout(() => { document.body.style.filter = ''; }, 160);
  }, 700);

  setTimeout(() => {
    appendTerminalLine(`<span class="text-rose-500 font-bold">[CRITICAL] Kernel panic — unable to sync VFS on rootfs</span>`);
    document.body.classList.add('system-glitch-active');
    spawnScreenTearArtifacts(4);
    setTimeout(() => { document.body.classList.remove('system-glitch-active'); }, 420);
  }, 1650);

  setTimeout(() => {
    document.body.classList.add('bsod-preglitch-heavy');
    spawnScreenTearArtifacts(8);
  }, 2650);

  setTimeout(() => {
    document.body.classList.remove('bsod-preglitch-heavy');
    document.body.style.filter = 'brightness(0.05)';
    closeCheatConsole();
    setTimeout(() => {
      document.body.style.filter = '';
      bsodSequenceRunning = false;
      triggerBsodPrank();
    }, 280);
  }, 3550);
}

function triggerBsodPrank() {
  const overlay = document.getElementById('bsod-prank-overlay');
  const pctEl = document.getElementById('bsod-percent');
  if (!overlay || !pctEl) return;

  if (bsodProgressTimer) clearTimeout(bsodProgressTimer);
  if (bsodCreditsTimer) clearTimeout(bsodCreditsTimer);

  pctEl.textContent = '0';
  overlay.classList.remove('hidden');
  overlay.classList.add('flex');

  const rootEl = document.documentElement;
  if (!document.fullscreenElement && rootEl.requestFullscreen) {
    rootEl.requestFullscreen().catch(() => {});
  }

  let currentPct = 0;
  const stallPoints = new Set([14, 29, 47, 63, 78, 89, 94, 97, 98]);

  function scheduleNextBsodTick() {
    if (currentPct >= 99) {
      pctEl.textContent = '99';
      bsodCreditsTimer = setTimeout(() => transitionBsodToEndCredits(), 4500);
      return;
    }
    const step = currentPct < 35 ? (Math.random() > 0.35 ? 2 : 1) : (currentPct < 75 ? (Math.random() > 0.55 ? 2 : 1) : 1);
    currentPct = Math.min(99, currentPct + step);
    pctEl.textContent = String(currentPct);

    if (currentPct >= 99) {
      bsodCreditsTimer = setTimeout(() => transitionBsodToEndCredits(), 4500);
      return;
    }
    let nextDelay = 380 + Math.floor(Math.random() * 420);
    if (stallPoints.has(currentPct)) nextDelay = 1250 + Math.floor(Math.random() * 1100);
    else if (currentPct >= 90) nextDelay = 850 + Math.floor(Math.random() * 750);
    bsodProgressTimer = setTimeout(scheduleNextBsodTick, nextDelay);
  }
  bsodProgressTimer = setTimeout(scheduleNextBsodTick, 1100);
}

function transitionBsodToEndCredits() {
  const bsodOverlay = document.getElementById('bsod-prank-overlay');
  const creditsOverlay = document.getElementById('end-credits-overlay');
  const track = document.getElementById('credits-roll-track');
  if (!creditsOverlay || !track) return;

  if (bsodOverlay) { bsodOverlay.classList.add('hidden'); bsodOverlay.classList.remove('flex'); }
  creditsOverlay.classList.remove('hidden');
  creditsOverlay.classList.add('flex');

  track.classList.remove('credits-roll-animate');
  void track.offsetWidth;
  track.classList.add('credits-roll-animate');
}

export function exitEndCredits() {
  const creditsOverlay = document.getElementById('end-credits-overlay');
  const track = document.getElementById('credits-roll-track');
  if (track) track.classList.remove('credits-roll-animate');
  if (creditsOverlay) { creditsOverlay.classList.add('hidden'); creditsOverlay.classList.remove('flex'); }
  exitBsodPrank();
}

export function exitBsodPrank() {
  if (bsodProgressTimer) clearTimeout(bsodProgressTimer);
  if (bsodCreditsTimer) clearTimeout(bsodCreditsTimer);
  bsodSequenceRunning = false;
  document.body.classList.remove('system-glitch-active', 'bsod-preglitch-heavy');
  document.body.style.filter = '';
  const overlay = document.getElementById('bsod-prank-overlay');
  if (overlay) { overlay.classList.add('hidden'); overlay.classList.remove('flex'); }
  const creditsOverlay = document.getElementById('end-credits-overlay');
  if (creditsOverlay) { creditsOverlay.classList.add('hidden'); creditsOverlay.classList.remove('flex'); }
  if (document.fullscreenElement && document.exitFullscreen) {
    document.exitFullscreen().catch(() => {});
  }
}

document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) {
    const bsodOverlay = document.getElementById('bsod-prank-overlay');
    const creditsOverlay = document.getElementById('end-credits-overlay');
    if ((bsodOverlay && !bsodOverlay.classList.contains('hidden')) || (creditsOverlay && !creditsOverlay.classList.contains('hidden'))) {
      exitBsodPrank();
    }
  }
});

// WhatsApp Toast Notifications
function getWaBubbleClassNames() {
  const dark = getThemeState();
  return dark
    ? 'wa-secret-bubble pointer-events-auto w-full rounded-2xl bg-[#111b21] border border-emerald-500/35 text-slate-100 p-3.5 shadow-[0_12px_35px_rgba(0,0,0,0.55)] transition-all duration-300'
    : 'wa-secret-bubble pointer-events-auto w-full rounded-2xl bg-white border border-emerald-600/25 text-slate-800 p-3.5 shadow-[0_12px_32px_rgba(15,23,42,0.14)] transition-all duration-300';
}

export function updateWaBubblesTheme() {
  const dark = getThemeState();
  const bubbles = document.querySelectorAll('.wa-secret-bubble');
  bubbles.forEach((b) => {
    b.className = getWaBubbleClassNames();
    const senderName = b.querySelector('.wa-sender-name');
    const timeMeta = b.querySelector('.wa-time-meta');
    const bodyText = b.querySelector('.wa-body-text');
    const closeBtn = b.querySelector('.wa-close-btn');
    const actionBtn = b.querySelector('.wa-action-btn');
    const cmdPills = b.querySelectorAll('.wa-cmd-pill');

    if (senderName) senderName.className = `wa-sender-name text-xs font-bold ${dark ? 'text-[#00a884]' : 'text-emerald-700'}`;
    if (timeMeta) timeMeta.className = `wa-time-meta text-[10px] ${dark ? 'text-slate-400' : 'text-slate-500'}`;
    if (bodyText) bodyText.className = `wa-body-text text-xs leading-relaxed pl-8 ${dark ? 'text-slate-100' : 'text-slate-700'}`;
    if (closeBtn) closeBtn.className = `wa-close-btn text-xs cursor-pointer ${dark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`;
    if (actionBtn) actionBtn.className = `wa-action-btn text-[11px] font-bold hover:underline cursor-pointer ${dark ? 'text-[#00a884]' : 'text-emerald-600'}`;
    cmdPills.forEach((pill) => {
      pill.className = dark
        ? 'wa-cmd-pill px-1.5 py-0.5 rounded bg-black/60 text-amber-300 font-mono-code font-bold'
        : 'wa-cmd-pill px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300/70 font-mono-code font-bold';
    });
  });
}

function pushWhatsAppBubble(messageHtml, showActionBtn = false) {
  const container = document.getElementById('wa-secret-toast-container');
  if (!container) return;
  const dark = getThemeState();
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const bubble = document.createElement('div');
  bubble.className = `${getWaBubbleClassNames()} translate-y-3 opacity-0`;
  bubble.innerHTML = `
    <div class="flex items-center justify-between gap-2 mb-1.5">
      <div class="flex items-center gap-2">
        <span class="w-6 h-6 rounded-full ${dark ? 'bg-[#00a884] text-slate-950' : 'bg-emerald-600 text-white'} flex items-center justify-center text-xs">
          <i class="fa-brands fa-whatsapp font-bold"></i>
        </span>
        <span class="wa-sender-name text-xs font-bold ${dark ? 'text-[#00a884]' : 'text-emerald-700'}">Ziyyan</span>
        <span class="wa-time-meta text-[10px] ${dark ? 'text-slate-400' : 'text-slate-500'}">• sekarang</span>
      </div>
      <button onclick="closeSingleWaBubble(this)" class="wa-close-btn text-xs cursor-pointer ${dark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'}" title="Tutup pesan ini">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    <div class="wa-body-text text-xs leading-relaxed pl-8 ${dark ? 'text-slate-100' : 'text-slate-700'}">
      ${messageHtml}
      <div class="flex items-center justify-between mt-2">
        ${showActionBtn ? `<button onclick="openTerminalFromWaToast()" class="wa-action-btn text-[11px] font-bold hover:underline cursor-pointer ${dark ? 'text-[#00a884]' : 'text-emerald-600'}">Buka Terminal →</button>` : '<span></span>'}
        <span class="wa-time-meta text-[10px] ${dark ? 'text-slate-400' : 'text-slate-500'}">${timeStr} <i class="fa-solid fa-check-double text-sky-500 ml-0.5"></i></span>
      </div>
    </div>
  `;
  container.appendChild(bubble);
  updateWaBubblesTheme();
  requestAnimationFrame(() => bubble.classList.remove('translate-y-3', 'opacity-0'));
}

export function closeSingleWaBubble(btnEl) {
  const bubble = btnEl && btnEl.closest('.pointer-events-auto');
  if (!bubble) return;
  bubble.classList.add('translate-y-2', 'opacity-0');
  setTimeout(() => bubble.remove(), 250);
}

export function openTerminalFromWaToast() {
  const container = document.getElementById('wa-secret-toast-container');
  if (container) container.innerHTML = '';
  openCheatConsole();
}

export function scheduleSecretWhatsAppHints() {
  if (!isDesktopEnvironment()) return;
  setTimeout(() => { if (isDesktopEnvironment()) pushWhatsAppBubble('Hei, kamu mau coba sesuatu yang menarik?'); }, 6500);
  setTimeout(() => { if (isDesktopEnvironment()) pushWhatsAppBubble('Coba ketik <code class="wa-cmd-pill">override</code> di Terminal...'); }, 11500);
  setTimeout(() => { if (isDesktopEnvironment()) pushWhatsAppBubble('Gak bakal kenapa-napa kok... percaya deh 🙂', true); }, 13700);
}