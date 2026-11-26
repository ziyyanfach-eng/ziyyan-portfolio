import { PROFILE_DATA, TIMELINE_DETAILS } from './dataService.js';

let certificatesRef = [];
let projectsRef = [];
let activeZoneKey = null;

export function setVillageData(certs, projects) {
  certificatesRef = certs;
  projectsRef = projects;
}

const VILLAGE_ZONES = {
  about: {
    title: 'Kamar Ziyyan — Profil & Workstation',
    imageFile: '/images/room-home.jpg',
    hint: 'Klik Figura Karakter (Deskripsi Saya) atau Laptop di Meja (Tech Stack & Pengalaman)',
    hotspots: [
      {
        id: 'about-figura',
        label: '🖼️ Figura Ziyyan — Tentang Saya',
        left: '25.8%',
        top: '29.2%',
        width: '8.4%',
        height: '18.5%',
        borderClass: 'hover:border-amber-400/90 hover:bg-amber-400/15',
        badgeClass: 'text-amber-300 border-amber-400/60',
        tag: 'about-me.profile',
        getHtml: () => `
          <div class="flex items-center gap-3.5 pb-3 border-b border-slate-800">
            <div class="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center text-xl shrink-0">
              <i class="fa-solid fa-user-astronaut"></i>
            </div>
            <div>
              <div class="font-mono-code text-[11px] text-amber-400">IDENTITAS &amp; DESKRIPSI DIRI</div>
              <h3 class="text-base sm:text-lg font-extrabold text-white">${PROFILE_DATA.fullName} (${PROFILE_DATA.callsign})</h3>
            </div>
          </div>
          <p class="text-slate-300 leading-relaxed">${PROFILE_DATA.bio}</p>
          <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div class="text-xs font-bold text-amber-400">Karakter &amp; Cara Kerja:</div>
            <ul class="list-disc list-inside text-slate-400 space-y-1 text-xs">
              ${PROFILE_DATA.workStyle.map((item) => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        `
      },
      {
        id: 'about-laptop',
        label: '💻 Laptop — Tech Stack & Pengalaman',
        left: '39.8%',
        top: '40.5%',
        width: '13.5%',
        height: '15.0%',
        borderClass: 'hover:border-emerald-400/90 hover:bg-emerald-400/15',
        badgeClass: 'text-emerald-300 border-emerald-400/60',
        tag: 'workstation.stack',
        getHtml: () => {
          // Otomatis tarik seluruh pengalaman (exp-*) dari TIMELINE_DETAILS
          const experiences = Object.entries(TIMELINE_DETAILS)
            .filter(([key]) => key.startsWith('exp-'))
            .map(([, val]) => val);

          return `
            <div class="flex items-center gap-3.5 pb-3 border-b border-slate-800">
              <div class="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-xl shrink-0">
                <i class="fa-solid fa-laptop-code"></i>
              </div>
              <div>
                <div class="font-mono-code text-[11px] text-emerald-400">WHAT'S ON MY LAPTOP</div>
                <h3 class="text-base sm:text-lg font-extrabold text-white">Tech Stack &amp; Rekam Jejak Pengalaman</h3>
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div class="font-bold text-sky-400 mb-1">Web &amp; Database</div>
                <div class="text-slate-400">${PROFILE_DATA.stackSummary.webAndDb}</div>
              </div>
              <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div class="font-bold text-amber-400 mb-1">Cloud &amp; Game Dev</div>
                <div class="text-slate-400">${PROFILE_DATA.stackSummary.cloudAndGame}</div>
              </div>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div class="font-bold text-emerald-400">Pengalaman Kerja &amp; Penugasan (${experiences.length}):</div>
              <div class="space-y-2">
                ${experiences.map((exp) => `
                  <div class="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <div class="flex items-center justify-between text-[10px] font-mono-code text-amber-400">
                      <span>${exp.org}</span>
                      <span class="text-slate-400">${exp.period}</span>
                    </div>
                    <div class="font-bold text-white mt-0.5">${exp.title}</div>
                    <p class="text-slate-400 text-[11px] mt-0.5 leading-relaxed">${exp.summary}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }
      }
    ]
  },
  gallery: {
    title: 'Galeri Sertifikat — Arsip Kompetensi',
    imageFile: '/images/room-gallery.jpg',
    hint: 'Klik deretan Bingkai Sertifikat di dinding untuk melihat seluruh sertifikat yang dimiliki',
    hotspots: [
      {
        id: 'gallery-certs-wall',
        label: '🏆 Lihat Seluruh Sertifikat',
        left: '9.0%',
        top: '28.5%',
        width: '63.5%',
        height: '32.0%',
        borderClass: 'hover:border-amber-400/90 hover:bg-amber-400/12',
        badgeClass: 'text-amber-300 border-amber-400/60',
        tag: 'certificates.collection',
        getHtml: () => `
          <div class="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div class="font-mono-code text-[11px] text-amber-400">VERIFIED CREDENTIALS (${certificatesRef.length})</div>
              <h3 class="text-base sm:text-lg font-extrabold text-white">Seluruh Sertifikat &amp; Pelatihan Resmi</h3>
            </div>
            <span class="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono-code text-[10px] font-bold">SYNCED</span>
          </div>
          <div class="space-y-2.5">
            ${certificatesRef.map((c, idx) => `
              <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition">
                <div class="flex items-center justify-between text-[11px] font-mono-code">
                  <span class="text-amber-400 font-semibold">#0${idx + 1} • ${c.issuer}</span>
                  <span class="text-slate-400">${c.year}</span>
                </div>
                <div class="font-bold text-white text-sm mt-1">${c.title}</div>
                <p class="text-slate-400 text-xs mt-1 leading-relaxed">${c.desc}</p>
              </div>
            `).join('')}
          </div>
        `
      }
    ]
  },
  education: {
    title: 'Ruang Kelas — Riwayat Pendidikan',
    imageFile: '/images/room-school.jpg',
    hint: 'Klik Papan Tulis "RIWAYAT PENDIDIKAN" di depan kelas untuk melihat detail pendidikan',
    hotspots: [
      {
        id: 'edu-whiteboard',
        label: '🎓 Papan Tulis — Riwayat Pendidikan',
        left: '21.0%',
        top: '28.5%',
        width: '55.0%',
        height: '35.5%',
        borderClass: 'hover:border-violet-400/90 hover:bg-violet-400/12',
        badgeClass: 'text-violet-300 border-violet-400/60',
        tag: 'education.history',
        getHtml: () => {
          // Otomatis tarik seluruh riwayat pendidikan (edu-*) dari TIMELINE_DETAILS
          const educations = Object.entries(TIMELINE_DETAILS)
            .filter(([key]) => key.startsWith('edu-'))
            .map(([, val]) => val)
            .reverse();

          return `
            <div class="pb-3 border-b border-slate-800">
              <div class="font-mono-code text-[11px] text-violet-400">ACADEMIC JOURNEY</div>
              <h3 class="text-base sm:text-lg font-extrabold text-white">Riwayat Pendidikan yang Telah Ditempuh</h3>
            </div>
            <div class="space-y-3">
              ${educations.map((edu, idx) => `
                <div class="p-4 rounded-xl bg-slate-950 border ${idx === 0 ? 'border-violet-500/35' : 'border-amber-500/30'} space-y-1.5">
                  <div class="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-code">
                    <span class="${idx === 0 ? 'text-violet-400' : 'text-amber-400'} font-semibold">${edu.period}</span>
                    <span class="text-slate-400">${edu.org}</span>
                  </div>
                  <div class="font-extrabold text-white text-sm sm:text-base">${edu.title}</div>
                  <p class="text-slate-400 text-xs leading-relaxed">${edu.summary}</p>
                </div>
              `).join('')}
            </div>
          `;
        }
      }
    ]
  },
  projects: {
    title: 'Ruang Pameran — Karya & Proyek Pilihan',
    imageFile: '/images/room-projects.jpg',
    hint: 'Klik Objek Utama di Tengah Sorotan Lampu untuk melihat proyek yang telah dikerjakan',
    hotspots: [
      {
        id: 'project-spotlight-sculpture',
        label: '✨ Objek Sorotan — Karya & Proyek Saya',
        left: '40.0%',
        top: '29.0%',
        width: '22.5%',
        height: '53.0%',
        borderClass: 'hover:border-emerald-400/90 hover:bg-emerald-400/15',
        badgeClass: 'text-emerald-300 border-emerald-400/60',
        tag: 'projects.showcase',
        getHtml: () => `
          <div class="pb-3 border-b border-slate-800">
            <div class="font-mono-code text-[11px] text-emerald-400">FEATURED WORKS (${projectsRef.length})</div>
            <h3 class="text-base sm:text-lg font-extrabold text-white">Proyek-Proyek yang Sudah Dikerjakan</h3>
          </div>
          <div class="space-y-3">
            ${projectsRef.map((p, idx) => `
              <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div class="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-code">
                  <span class="text-emerald-400 font-semibold">0${idx + 1} • ${p.tag}</span>
                  <span class="text-slate-400">${p.year}</span>
                </div>
                <div class="font-extrabold text-white text-sm">${p.title}</div>
                <div class="text-[11px] text-amber-400 font-semibold">${p.role}</div>
                <p class="text-slate-400 text-xs leading-relaxed">${p.overview || p.desc}</p>
              </div>
            `).join('')}
          </div>
        `
      }
    ]
  },
  contact: {
    title: 'Call Center — Informasi Kontak',
    imageFile: '/images/room-callcenter.jpg',
    hint: 'Klik Monitor Komputer bertuliskan "CALL ME" di meja kanan untuk melihat info kontak',
    hotspots: [
      {
        id: 'contact-callme-monitor',
        label: '📞 Monitor "CALL ME" — Hubungi Saya',
        left: '68.0%',
        top: '41.5%',
        width: '12.5%',
        height: '18.5%',
        borderClass: 'hover:border-sky-400/90 hover:bg-sky-400/15',
        badgeClass: 'text-sky-300 border-sky-400/60',
        tag: 'contact.directory',
        getHtml: () => {
          const c = PROFILE_DATA.contact;
          return `
            <div class="pb-3 border-b border-slate-800">
              <div class="font-mono-code text-[11px] text-sky-400">DIRECT COMMUNICATION CHANNEL</div>
              <h3 class="text-base sm:text-lg font-extrabold text-white">Informasi Kontak &amp; Jejaring Profesional</h3>
            </div>
            <p class="text-slate-300 text-xs leading-relaxed">
              Tertarik berkolaborasi, berdiskusi seputar Cloud &amp; Web Engineering, atau peluang kerja? Hubungi saya melalui salah satu kanal berikut:
            </p>
            <div class="space-y-2.5 text-xs">
              <a href="mailto:${c.email}" class="block p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition">
                <div class="text-slate-400 text-[10px] font-mono-code uppercase">Email Resmi</div>
                <div class="font-bold text-amber-400 mt-0.5">${c.email}</div>
              </a>
              <a href="https://wa.me/${c.whatsappNumber}" target="_blank" rel="noopener" class="block p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition">
                <div class="text-slate-400 text-[10px] font-mono-code uppercase">WhatsApp</div>
                <div class="font-bold text-emerald-400 mt-0.5">${c.whatsappDisplay}</div>
              </a>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a href="${c.linkedinUrl}" target="_blank" rel="noopener" class="block p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500/50 transition">
                  <div class="text-slate-400 text-[10px] font-mono-code uppercase">LinkedIn</div>
                  <div class="font-bold text-sky-400 mt-0.5">${c.linkedinHandle}</div>
                </a>
                <a href="${c.githubUrl}" target="_blank" rel="noopener" class="block p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-500 transition">
                  <div class="text-slate-400 text-[10px] font-mono-code uppercase">GitHub</div>
                  <div class="font-bold text-white mt-0.5">${c.githubHandle}</div>
                </a>
              </div>
            </div>
          `;
        }
      }
    ]
  }
};

export function onVillageMapImageLoaded() {
  const ph = document.getElementById('village-map-placeholder');
  const hs = document.getElementById('village-hotspots-layer');
  if (ph) { ph.classList.add('hidden'); ph.classList.remove('flex'); }
  if (hs) hs.classList.remove('hidden');
}

export function onVillageMapImageError() {
  const ph = document.getElementById('village-map-placeholder');
  const hs = document.getElementById('village-hotspots-layer');
  if (ph) { ph.classList.remove('hidden'); ph.classList.add('flex'); }
  if (hs) hs.classList.add('hidden');
}

export function enterVillageMode() {
  const overlay = document.getElementById('rpg-village-overlay');
  if (!overlay) return;
  overlay.classList.remove('hidden');
  overlay.classList.add('flex');
  exitFirstPersonRoom();
  startVillageWelcomeCutscene();
}

export function exitVillageMode() {
  activeZoneKey = null;
  closeVillageWelcomeCutscene();
  const overlay = document.getElementById('rpg-village-overlay');
  if (!overlay) return;
  overlay.classList.add('hidden');
  overlay.classList.remove('flex');
}

const VILLAGE_WELCOME_DIALOGS = [
  { tag: 'Sapaan Hangat', text: `Halo, selamat datang di ZiyyanOS Village! Saya ${PROFILE_DATA.callsign}. Senang sekali kamu berhasil menemukan desa interaktif rahasia di balik portofolio ini.` },
  { tag: 'Area Rumah & Sekolah', text: 'Di sisi kiri atas ada Rumah Saya (klik figura & laptop untuk profil, tech stack, dan pengalaman), sedangkan di bagian bawah tengah ada Sekolah tempat menyimpan riwayat pendidikan saya.' },
  { tag: 'Galeri, Proyek & Call Center', text: 'Di kanan atas berdiri Galeri Sertifikat, di kiri bawah ada Ruang Pameran Proyek, dan di tengah atas ada Call Center dengan komputer "CALL ME" untuk menghubungi saya.' },
  { tag: 'Cara Bermain', text: 'Cukup klik bangunan mana saja di peta desa ini, lalu arahkan kursor ke benda-benda di dalam ruangan untuk membuka informasinya. Selamat menjelajah!' }
];

let cutsceneStepIndex = 0;
let cutsceneTypingTimer = null;
let cutsceneIsTyping = false;

export function startVillageWelcomeCutscene() {
  const box = document.getElementById('village-welcome-cutscene');
  if (!box) return;
  cutsceneStepIndex = 0;
  box.classList.remove('hidden');
  box.classList.add('flex');
  renderVillageCutsceneStep(0);
}

export function onCutsceneCharacterImgError() {
  const img = document.getElementById('cutscene-character-img');
  const fb = document.getElementById('cutscene-character-fallback');
  if (img) img.classList.add('hidden');
  if (fb) fb.classList.remove('hidden');
}

function renderVillageCutsceneStep(index) {
  const item = VILLAGE_WELCOME_DIALOGS[index];
  if (!item) return;

  const stepEl = document.getElementById('cutscene-step-indicator');
  const tagEl = document.getElementById('cutscene-speaker-tag');
  const textEl = document.getElementById('cutscene-dialog-text');
  const nextLabelEl = document.getElementById('cutscene-next-label');

  if (stepEl) stepEl.textContent = `${index + 1} / ${VILLAGE_WELCOME_DIALOGS.length}`;
  if (tagEl) tagEl.textContent = item.tag;
  if (nextLabelEl) nextLabelEl.textContent = index >= VILLAGE_WELCOME_DIALOGS.length - 1 ? 'Mulai Jelajah' : 'Lanjut';

  if (cutsceneTypingTimer) { clearInterval(cutsceneTypingTimer); cutsceneTypingTimer = null; }
  if (!textEl) return;

  textEl.textContent = '';
  cutsceneIsTyping = true;
  let charPos = 0;

  cutsceneTypingTimer = setInterval(() => {
    charPos++;
    textEl.textContent = item.text.slice(0, charPos);
    if (charPos >= item.text.length) {
      clearInterval(cutsceneTypingTimer);
      cutsceneTypingTimer = null;
      cutsceneIsTyping = false;
    }
  }, 22);
}

export function nextVillageCutsceneStep() {
  const item = VILLAGE_WELCOME_DIALOGS[cutsceneStepIndex];
  const textEl = document.getElementById('cutscene-dialog-text');

  if (cutsceneIsTyping && item && textEl) {
    if (cutsceneTypingTimer) { clearInterval(cutsceneTypingTimer); cutsceneTypingTimer = null; }
    textEl.textContent = item.text;
    cutsceneIsTyping = false;
    return;
  }

  if (cutsceneStepIndex < VILLAGE_WELCOME_DIALOGS.length - 1) {
    cutsceneStepIndex++;
    renderVillageCutsceneStep(cutsceneStepIndex);
  } else {
    closeVillageWelcomeCutscene();
  }
}

export function closeVillageWelcomeCutscene() {
  if (cutsceneTypingTimer) { clearInterval(cutsceneTypingTimer); cutsceneTypingTimer = null; }
  cutsceneIsTyping = false;
  const box = document.getElementById('village-welcome-cutscene');
  if (box) { box.classList.add('hidden'); box.classList.remove('flex'); }
}

window.addEventListener('keydown', (e) => {
  const cutsceneBox = document.getElementById('village-welcome-cutscene');
  if (!cutsceneBox || cutsceneBox.classList.contains('hidden')) return;
  if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
    e.preventDefault();
    nextVillageCutsceneStep();
  } else if (e.key === 'Escape') {
    e.preventDefault();
    closeVillageWelcomeCutscene();
  }
});

export function onRoomSceneImageLoaded() {
  const ph = document.getElementById('room-scene-placeholder');
  const hs = document.getElementById('room-hotspots-layer');
  if (ph) { ph.classList.add('hidden'); ph.classList.remove('flex'); }
  if (hs) hs.classList.remove('hidden');
}

export function onRoomSceneImageError() {
  const ph = document.getElementById('room-scene-placeholder');
  const hs = document.getElementById('room-hotspots-layer');
  if (ph) { ph.classList.remove('hidden'); ph.classList.add('flex'); }
  if (hs) hs.classList.add('hidden');
}

export function enterFirstPersonRoom(zoneKey) {
  const zone = VILLAGE_ZONES[zoneKey];
  if (!zone) return;

  activeZoneKey = zoneKey;
  closeVillageWelcomeCutscene();

  const mapStage = document.getElementById('village-map-stage');
  const roomStage = document.getElementById('fp-3d-stage');
  const replayBtn = document.getElementById('village-replay-cutscene-btn');
  const exitRoomBtn = document.getElementById('fp-exit-room-btn');
  const hudTitle = document.getElementById('village-hud-title');
  const roomSub = document.getElementById('fp-room-sub');

  if (mapStage) mapStage.classList.add('hidden');
  if (roomStage) { roomStage.classList.remove('hidden'); roomStage.classList.add('flex'); }
  if (replayBtn) replayBtn.classList.add('hidden');
  if (exitRoomBtn) exitRoomBtn.classList.remove('hidden');
  if (hudTitle) hudTitle.textContent = zone.title.toUpperCase();
  if (roomSub) roomSub.textContent = zone.hint;

  const phTitle = document.getElementById('room-placeholder-title');
  const phFile = document.getElementById('room-placeholder-filename');
  if (phTitle) phTitle.textContent = `Gambar Ruangan Tidak Ditemukan: ${zone.title}`;
  if (phFile) phFile.textContent = zone.imageFile;

  const imgEl = document.getElementById('room-scene-image');
  if (imgEl) {
    imgEl.onload = onRoomSceneImageLoaded;
    imgEl.onerror = onRoomSceneImageError;
    imgEl.src = zone.imageFile;
  }

  const layer = document.getElementById('room-hotspots-layer');
  if (layer) {
    layer.innerHTML = zone.hotspots.map((hs, idx) => `
      <button
        type="button"
        onclick="openRoomHotspotCard('${zoneKey}', ${idx})"
        style="left: ${hs.left}; top: ${hs.top}; width: ${hs.width}; height: ${hs.height};"
        class="group absolute rounded-xl border-2 border-transparent ${hs.borderClass} transition-all duration-200 cursor-pointer focus:outline-none"
      >
        <span class="opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:-translate-y-2 transition-all duration-200 pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-lg bg-slate-950/95 ${hs.badgeClass} border text-xs font-bold shadow-xl">
          ${hs.label}
        </span>
      </button>
    `).join('');
  }
}

export function openRoomHotspotCard(zoneKey, hotspotIndex) {
  const zone = VILLAGE_ZONES[zoneKey];
  const hotspot = zone && zone.hotspots[hotspotIndex];
  if (!hotspot) return;

  document.getElementById('interior-modal-tag').textContent = hotspot.tag;
  document.getElementById('interior-modal-body').innerHTML = hotspot.getHtml();

  const modal = document.getElementById('rpg-interior-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

export function exitFirstPersonRoom() {
  activeZoneKey = null;
  const roomStage = document.getElementById('fp-3d-stage');
  const mapStage = document.getElementById('village-map-stage');
  const replayBtn = document.getElementById('village-replay-cutscene-btn');
  const exitRoomBtn = document.getElementById('fp-exit-room-btn');
  const hudTitle = document.getElementById('village-hud-title');

  if (roomStage) { roomStage.classList.add('hidden'); roomStage.classList.remove('flex'); }
  if (mapStage) mapStage.classList.remove('hidden');
  if (replayBtn) replayBtn.classList.remove('hidden');
  if (exitRoomBtn) exitRoomBtn.classList.add('hidden');
  if (hudTitle) hudTitle.textContent = 'ZIYYANOS VILLAGE MAP — Point & Click Explorer';
}

export function closeInteriorArchiveModal() {
  const modal = document.getElementById('rpg-interior-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}