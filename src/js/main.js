import {
  DEFAULT_CERTIFICATES,
  DEFAULT_PROJECTS,
  TIMELINE_DETAILS,
  SKILL_DEFINITIONS,
  fetchCertificates,
  fetchProjects,
  fetchSiteStatus,
  saveSiteStatus,
  submitContactMessage
} from './dataService.js';

import {
  initGallery2D,
  resizeMuseumCanvas,
  updateMuseum,
  drawMuseum,
  inspectNearestExhibit,
  openVaultNoteModal,
  closeVaultNoteModal,
  openCertModal,
  closeCertModal
} from './gallery2d.js';

import {
  setVillageData,
  onVillageMapImageLoaded,
  onVillageMapImageError,
  enterVillageMode,
  exitVillageMode,
  startVillageWelcomeCutscene,
  onCutsceneCharacterImgError,
  nextVillageCutsceneStep,
  closeVillageWelcomeCutscene,
  onRoomSceneImageLoaded,
  onRoomSceneImageError,
  enterFirstPersonRoom,
  openRoomHotspotCard,
  exitFirstPersonRoom,
  closeInteriorArchiveModal
} from './villageMap.js';

import {
  initTerminalCli,
  syncDesktopOnlyVisibility,
  handleSecretDotsClick,
  openCheatConsole,
  closeCheatConsole,
  submitCheatCode,
  finishGlitchPrank,
  openMistGlass,
  closeMistGlass,
  resetMistGlass,
  exitEndCredits,
  updateWaBubblesTheme,
  closeSingleWaBubble,
  openTerminalFromWaToast,
  scheduleSecretWhatsAppHints
} from './terminalCli.js';

let certificatesData = [...DEFAULT_CERTIFICATES];
let projectsData = [...DEFAULT_PROJECTS];
let isDarkMode = true;
let isOpenToWork = true;

/* ---------------------------------------------------------------------
   TEMA & STATUS KETERSEDIAAN
   --------------------------------------------------------------------- */
function applyThemeClass() {
  const htmlEl = document.documentElement;
  const iconEl = document.getElementById('theme-icon');
  if (isDarkMode) {
    htmlEl.classList.add('dark');
    if (iconEl) iconEl.className = 'fa-solid fa-sun text-sm';
  } else {
    htmlEl.classList.remove('dark');
    if (iconEl) iconEl.className = 'fa-solid fa-moon text-sm';
  }
  updateWaBubblesTheme();
}

function setTheme(dark) {
  isDarkMode = Boolean(dark);
  localStorage.setItem('portfolio_theme', isDarkMode ? 'dark' : 'light');
  applyThemeClass();
}

function toggleTheme(btnEl) {
  setTheme(!isDarkMode);
  if (btnEl && typeof btnEl.blur === 'function') btnEl.blur();
}

function applyAvailabilityUI() {
  const badge = document.getElementById('availability-badge');
  const dot = document.getElementById('availability-dot');
  const text = document.getElementById('availability-text');
  if (!badge || !dot || !text) return;

  if (isOpenToWork) {
    badge.className = 'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:opacity-90 transition cursor-pointer';
    dot.className = 'w-2 h-2 rounded-full bg-emerald-400 animate-pulse';
    text.textContent = 'Open to Work';
  } else {
    badge.className = 'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:opacity-90 transition cursor-pointer';
    dot.className = 'w-2 h-2 rounded-full bg-rose-500';
    text.textContent = 'Not Open to Work';
  }
}

async function setAvailability(open) {
  isOpenToWork = Boolean(open);
  localStorage.setItem('ziyyan_open_to_work', String(isOpenToWork));
  applyAvailabilityUI();
  await saveSiteStatus(isOpenToWork);
}

function toggleAvailabilityStatus() {
  setAvailability(!isOpenToWork);
}

/* ---------------------------------------------------------------------
   EFEK MENGETIK HERO & RENDER LIST
   --------------------------------------------------------------------- */
function startHeroTypewriter() {
  const target = document.getElementById('hero-typed-name');
  if (!target) return;
  const phrases = [
    'Muhammad Fachrul Reihan Fauzian',
    'Ziyyan',
    'Web Engineer',
    'Game Developer'
  ];
  let phraseIdx = 0;
  let charIdx = phrases[0].length;
  let deleting = true;
  let pauseTicks = 18;

  setInterval(() => {
    if (pauseTicks > 0) { pauseTicks--; return; }
    const current = phrases[phraseIdx];
    if (deleting) {
      charIdx--;
      target.textContent = current.substring(0, charIdx);
      if (charIdx <= 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; pauseTicks = 4; }
    } else {
      charIdx++;
      target.textContent = current.substring(0, charIdx);
      if (charIdx >= current.length) { deleting = true; pauseTicks = 22; }
    }
  }, 95);
}

function renderStaticLists() {
  const projectsGrid = document.getElementById('projects-grid');
  if (projectsGrid) {
    projectsGrid.innerHTML = projectsData.map((p, idx) => `
      <article onclick="openProjectModal(${idx})" role="button" tabindex="0" class="group theme-card rounded-2xl overflow-hidden flex flex-col justify-between hover:-translate-y-1 hover:border-amber-500/60 hover:shadow-xl cursor-pointer">
        <div>
          <div class="px-4 py-2.5 border-b border-slate-700/20 flex items-center justify-between bg-slate-500/5">
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-rose-500"></span>
              <span class="w-2 h-2 rounded-full bg-amber-400"></span>
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span class="ml-1.5 font-mono-code text-[10px] theme-text-muted">${p.file}</span>
            </div>
            <span class="font-mono-code text-[10px] text-amber-500">${(p.docs || []).length} DOKS</span>
          </div>
          <div class="relative aspect-[16/10] w-full overflow-hidden bg-slate-900 border-b border-slate-700/20">
            <img src="${p.cover}" onerror="this.src='https://placehold.co/640x400/1e293b/fbbf24?text=Project+0${idx + 1}'" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent"></div>
            <span class="absolute bottom-2.5 left-3 font-mono-code text-[10px] px-2 py-0.5 rounded bg-slate-950/80 text-emerald-400 border border-emerald-500/30">${p.year}</span>
          </div>
          <div class="p-5 space-y-2">
            <div class="font-mono-code text-[11px] text-emerald-500">${p.tag}</div>
            <h3 class="text-base font-bold theme-text-main group-hover:text-amber-400 transition">${p.title}</h3>
            <p class="text-xs theme-text-muted leading-relaxed">${p.desc}</p>
          </div>
        </div>
        <div class="px-5 pb-4 pt-2 flex items-center justify-between text-xs font-semibold text-amber-500">
          <span>Lihat Detail &amp; Dokumentasi</span>
          <i class="fa-solid fa-arrow-up-right-from-square group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition"></i>
        </div>
      </article>
    `).join('');
  }

  const listWrapper = document.getElementById('gallery-list-wrapper');
  if (listWrapper) {
    listWrapper.innerHTML = certificatesData.map((c, idx) => `
      <div onclick="openCertModal(${idx})" class="theme-card rounded-2xl p-5 cursor-pointer hover:border-amber-500/60 space-y-2">
        <div class="flex items-center justify-between text-xs">
          <span class="font-semibold text-amber-500">${c.issuer}</span>
          <span class="font-mono-code theme-text-muted">${c.year}</span>
        </div>
        <h3 class="text-sm font-bold theme-text-main">${c.title}</h3>
        <p class="text-xs theme-text-muted line-clamp-2">${c.desc}</p>
      </div>
    `).join('');
  }
}

function switchGalleryView(mode) {
  const interactiveEl = document.getElementById('gallery-interactive-wrapper');
  const listEl = document.getElementById('gallery-list-wrapper');
  const btnGal = document.getElementById('btn-mode-gallery');
  const btnList = document.getElementById('btn-mode-list');

  if (mode === 'interactive') {
    interactiveEl.classList.remove('hidden');
    listEl.classList.add('hidden');
    btnGal.className = 'px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-slate-950 transition cursor-pointer';
    btnList.className = 'px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-700/40 theme-text-muted hover:text-amber-500 transition cursor-pointer';
    resizeMuseumCanvas();
  } else {
    interactiveEl.classList.add('hidden');
    listEl.classList.remove('hidden');
    listEl.classList.add('grid');
    btnList.className = 'px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-slate-950 transition cursor-pointer';
    btnGal.className = 'px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-700/40 theme-text-muted hover:text-amber-500 transition cursor-pointer';
  }
}

/* ---------------------------------------------------------------------
   MODALS: TIMELINE, PROJECT, SKILL & CONTACT
   --------------------------------------------------------------------- */
function openTimelineDetail(key) {
  const item = TIMELINE_DETAILS[key];
  if (!item) return;
  document.getElementById('td-modal-file').textContent = item.file;
  document.getElementById('td-modal-org').textContent = item.org;
  document.getElementById('td-modal-period').textContent = item.period;
  document.getElementById('td-modal-title').textContent = item.title;
  document.getElementById('td-modal-sub').textContent = item.sub;
  document.getElementById('td-modal-summary').textContent = item.summary;
  document.getElementById('td-modal-highlights').innerHTML = item.highlights.map(h => `<li>${h}</li>`).join('');
  document.getElementById('td-modal-tags').innerHTML = item.tags.map(t => `<span class="font-mono-code text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">${t}</span>`).join('');
  const modal = document.getElementById('timeline-detail-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeTimelineDetail() {
  const modal = document.getElementById('timeline-detail-modal');
  if (modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); }
}

function openProjectModal(index) {
  const proj = projectsData[index];
  if (!proj) return;
  document.getElementById('proj-modal-file').textContent = proj.file;
  document.getElementById('proj-modal-role').textContent = proj.role;
  document.getElementById('proj-modal-year').textContent = proj.year;
  document.getElementById('proj-modal-title').textContent = proj.title;
  document.getElementById('proj-modal-overview').textContent = proj.overview;
  document.getElementById('proj-modal-features').innerHTML = (proj.features || []).map(f => `<li>${f}</li>`).join('');
  document.getElementById('proj-modal-tags').innerHTML = proj.tag.split('•').map(t => `<span class="font-mono-code text-[10px] px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">${t.trim()}</span>`).join('');

  const docs = proj.docs || [{ img: proj.cover, caption: proj.title }];
  const mainImg = document.getElementById('proj-modal-main-img');
  const captionEl = document.getElementById('proj-modal-img-caption');
  if (mainImg) mainImg.src = docs[0].img;
  if (captionEl) captionEl.textContent = docs[0].caption;

  const thumbsWrap = document.getElementById('proj-modal-thumbs');
  if (thumbsWrap) {
    thumbsWrap.innerHTML = docs.map((d, i) => `
      <button type="button" onclick="selectProjectDoc(${index}, ${i})" class="relative rounded-lg overflow-hidden aspect-video border-2 ${i === 0 ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-slate-700/50 opacity-70 hover:opacity-100'} transition cursor-pointer">
        <img src="${d.img}" onerror="this.src='https://placehold.co/400x240/1e293b/fbbf24?text=Doc+0${i + 1}'" alt="${d.caption}" class="w-full h-full object-cover">
        <span class="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-slate-950/85 font-mono-code text-[9px] text-white">0${i + 1}</span>
      </button>
    `).join('');
  }

  const modal = document.getElementById('project-detail-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function selectProjectDoc(projIndex, docIdx) {
  const proj = projectsData[projIndex];
  const doc = proj && proj.docs && proj.docs[docIdx];
  if (!doc) return;
  document.getElementById('proj-modal-main-img').src = doc.img;
  document.getElementById('proj-modal-img-caption').textContent = doc.caption;
  const thumbsWrap = document.getElementById('proj-modal-thumbs');
  if (thumbsWrap) {
    Array.from(thumbsWrap.children).forEach((btn, i) => {
      btn.className = `relative rounded-lg overflow-hidden aspect-video border-2 ${i === docIdx ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-slate-700/50 opacity-70 hover:opacity-100'} transition cursor-pointer`;
    });
  }
}

function closeProjectModal() {
  const modal = document.getElementById('project-detail-modal');
  if (modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); }
}

function openSkillModal(skillName) {
  const info = SKILL_DEFINITIONS[skillName];
  if (!info) return;
  document.getElementById('skill-modal-category').textContent = info.category;
  document.getElementById('skill-modal-name').textContent = skillName;
  document.getElementById('skill-modal-def').textContent = info.def;
  document.getElementById('skill-modal-use').textContent = info.use;
  const modal = document.getElementById('skill-detail-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeSkillModal() {
  const modal = document.getElementById('skill-detail-modal');
  if (modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); }
}

async function handleContactSubmit(e) {
  e.preventDefault();
  const senderName = document.getElementById('contact-name').value.trim();
  const senderEmail = document.getElementById('contact-email').value.trim();
  const payload = {
    sender_name: senderName,
    full_name: senderName,
    sender_email: senderEmail,
    email: senderEmail,
    subject: document.getElementById('contact-subject').value.trim(),
    message: document.getElementById('contact-message').value.trim()
  };
  const res = await submitContactMessage(payload);
  const fb = document.getElementById('contact-feedback');
  if (fb) {
    fb.textContent = res.ok
      ? `✓ Pesan berhasil dikirim (${res.mode === 'supabase' ? 'Tersimpan di Database' : 'ZiyyanOS Inbox'}). Terima kasih!`
      : `✕ Gagal mengirim pesan: ${res.error}`;
    fb.className = `text-xs font-medium pt-1 ${res.ok ? 'text-emerald-500' : 'text-rose-400'}`;
    fb.classList.remove('hidden');
  }
  if (res.ok) e.target.reset();
}

function sendContactToWhatsApp() {
  const nameVal = (document.getElementById('contact-name')?.value || '').trim();
  const subjectVal = (document.getElementById('contact-subject')?.value || '').trim();
  const messageVal = (document.getElementById('contact-message')?.value || '').trim();
  let text = 'Halo Ziyyan! Saya tertarik untuk berdiskusi.';
  if (nameVal || subjectVal || messageVal) {
    const lines = [];
    if (nameVal) lines.push(`Halo Ziyyan, saya *${nameVal}*.`);
    if (subjectVal) lines.push(`Topik: *${subjectVal}*`);
    if (messageVal) lines.push(messageVal);
    text = lines.join('\n');
  }
  window.open(`https://wa.me/6285860686095?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
}

// Tutup modal saat klik area backdrop luar
['timeline-detail-modal', 'project-detail-modal', 'skill-detail-modal', 'vault-note-modal', 'certificate-modal', 'cheat-console-modal', 'rpg-interior-modal'].forEach((id) => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('click', (e) => {
      if (e.target.id === id) {
        el.classList.add('hidden');
        el.classList.remove('flex');
      }
    });
  }
});

/* ---------------------------------------------------------------------
   EXPOSE FUNGSI KE GLOBAL WINDOW UNTUK INLINE HTML HANDLERS
   --------------------------------------------------------------------- */
Object.assign(window, {
  toggleTheme,
  toggleAvailabilityStatus,
  openTimelineDetail,
  closeTimelineDetail,
  openProjectModal,
  selectProjectDoc,
  closeProjectModal,
  openSkillModal,
  closeSkillModal,
  switchGalleryView,
  inspectNearestExhibit,
  openVaultNoteModal,
  closeVaultNoteModal,
  openCertModal,
  closeCertModal,
  handleContactSubmit,
  sendContactToWhatsApp,
  handleSecretDotsClick,
  openCheatConsole,
  closeCheatConsole,
  submitCheatCode,
  finishGlitchPrank,
  openMistGlass,
  closeMistGlass,
  resetMistGlass,
  exitEndCredits,
  closeSingleWaBubble,
  openTerminalFromWaToast,
  onVillageMapImageLoaded,
  onVillageMapImageError,
  enterVillageMode,
  exitVillageMode,
  startVillageWelcomeCutscene,
  onCutsceneCharacterImgError,
  nextVillageCutsceneStep,
  closeVillageWelcomeCutscene,
  onRoomSceneImageLoaded,
  onRoomSceneImageError,
  enterFirstPersonRoom,
  openRoomHotspotCard,
  exitFirstPersonRoom,
  closeInteriorArchiveModal
});

/* ---------------------------------------------------------------------
   INISIALISASI APLIKASI & ANIMATION LOOP
   --------------------------------------------------------------------- */
function mainLoop() {
  updateMuseum();
  drawMuseum();
  requestAnimationFrame(mainLoop);
}

async function bootstrap() {
  const savedTheme = localStorage.getItem('portfolio_theme');
  isDarkMode = savedTheme ? savedTheme === 'dark' : true;
  applyThemeClass();

  const savedStatus = localStorage.getItem('ziyyan_open_to_work');
  isOpenToWork = savedStatus !== null ? savedStatus === 'true' : true;
  applyAvailabilityUI();

  const [certs, projs, remoteStatus] = await Promise.all([
    fetchCertificates(),
    fetchProjects(),
    fetchSiteStatus()
  ]);

  certificatesData = certs;
  projectsData = projs;
  if (remoteStatus !== null) {
    isOpenToWork = remoteStatus;
    applyAvailabilityUI();
  }

  renderStaticLists();
  initGallery2D(certificatesData);
  setVillageData(certificatesData, projectsData);
  initTerminalCli({
    certificates: certificatesData,
    projects: projectsData,
    isDark: () => isDarkMode,
    onSetTheme: setTheme,
    onSetAvailability: setAvailability
  });

  startHeroTypewriter();
  syncDesktopOnlyVisibility();
  scheduleSecretWhatsAppHints();
  mainLoop();
}

bootstrap();