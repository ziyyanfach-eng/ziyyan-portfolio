const museumCanvas = document.getElementById('museumCanvas');
const mCtx = museumCanvas ? museumCanvas.getContext('2d') : null;

const CERT_START_X = 490;
const CERT_GAP = 390;

let worldWidth = 2850;
let vaultNoteX = worldWidth - 135;

export const keys = { left: false, right: false };
window.museumKeys = keys;

const visitedSet = new Set();
let activeExhibitIndex = -1;
let isNearVaultNote = false;
let exhibits = [];

const player = {
  x: 150,
  vx: 0,
  speed: 4.5,
  facing: 1,
  walkTimer: 0
};

export function initGallery2D(certificatesList) {
  exhibits = certificatesList.map((cert, i) => ({
    ...cert,
    index: i,
    x: CERT_START_X + i * CERT_GAP
  }));

  // Hitung lebar koridor museum otomatis berdasarkan total sertifikat
  const lastCertX = exhibits.length > 0 ? exhibits[exhibits.length - 1].x : CERT_START_X;
  worldWidth = Math.max(1200, lastCertX + 410);
  vaultNoteX = worldWidth - 135;

  const totalCertHudEl = document.getElementById('total-cert-hud');
  if (totalCertHudEl) totalCertHudEl.textContent = exhibits.length;

  resizeMuseumCanvas();
}

export function resizeMuseumCanvas() {
  if (!museumCanvas) return;
  const rect = museumCanvas.getBoundingClientRect();
  museumCanvas.width = rect.width || 960;
  museumCanvas.height = rect.height || 380;
}

window.addEventListener('resize', resizeMuseumCanvas);

window.addEventListener('keydown', (e) => {
  const activeTag = document.activeElement && document.activeElement.tagName;
  if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return;

  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
    e.preventDefault();
    keys.left = true;
  }
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
    e.preventDefault();
    keys.right = true;
  }
  if ((e.key === 'e' || e.key === 'E' || e.key === 'Enter') && (activeExhibitIndex !== -1 || isNearVaultNote)) {
    const certModal = document.getElementById('certificate-modal');
    const vaultModal = document.getElementById('vault-note-modal');
    const termModal = document.getElementById('cheat-console-modal');
    const villageOverlay = document.getElementById('rpg-village-overlay');
    const modalOpen = certModal && !certModal.classList.contains('hidden');
    const vaultOpen = vaultModal && !vaultModal.classList.contains('hidden');
    const termOpen = termModal && !termModal.classList.contains('hidden');
    const villageOpen = villageOverlay && !villageOverlay.classList.contains('hidden');
    if (!modalOpen && !vaultOpen && !termOpen && !villageOpen) {
      inspectNearestExhibit();
    }
  }
});

window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
});

export function updateMuseum() {
  if (!museumCanvas) return;
  if (keys.left) {
    player.vx = -player.speed;
    player.facing = -1;
  } else if (keys.right) {
    player.vx = player.speed;
    player.facing = 1;
  } else {
    player.vx *= 0.72;
    if (Math.abs(player.vx) < 0.1) player.vx = 0;
  }

  player.x += player.vx;
  player.x = Math.max(85, Math.min(worldWidth - 85, player.x));
  player.walkTimer = Math.abs(player.vx) > 0.3 ? player.walkTimer + 0.22 : 0;

  const minimapBar = document.getElementById('minimap-bar');
  if (minimapBar) {
    const pct = ((player.x - 85) / Math.max(1, worldWidth - 170)) * 100;
    minimapBar.style.width = `${Math.max(8, Math.min(100, pct))}%`;
  }

  let nearestIdx = -1;
  let minDist = 82;
  exhibits.forEach((ex) => {
    const dist = Math.abs(player.x - ex.x);
    if (dist < minDist) {
      minDist = dist;
      nearestIdx = ex.index;
    }
  });

  const nearNoteNow = Math.abs(player.x - vaultNoteX) < 76;

  if (nearestIdx !== activeExhibitIndex || nearNoteNow !== isNearVaultNote) {
    activeExhibitIndex = nearestIdx;
    isNearVaultNote = nearNoteNow;
    const btn = document.getElementById('inspect-cert-btn');
    const label = document.getElementById('inspect-btn-label');
    if (btn && label) {
      if (activeExhibitIndex !== -1) {
        btn.disabled = false;
        btn.className = 'px-4 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition cursor-pointer flex items-center gap-2 shadow-sm';
        label.textContent = `Lihat: ${exhibits[activeExhibitIndex].title.slice(0, 26)}...`;
      } else if (isNearVaultNote) {
        btn.disabled = false;
        btn.className = 'px-4 py-2 rounded-lg text-xs font-bold bg-amber-300 hover:bg-amber-200 text-slate-950 transition cursor-pointer flex items-center gap-2 shadow-sm';
        label.textContent = 'Baca Kertas Catatan [E]';
      } else {
        btn.disabled = true;
        btn.className = 'px-4 py-2 rounded-lg text-xs font-semibold bg-slate-700/40 text-slate-400 border border-slate-700/40 transition cursor-not-allowed flex items-center gap-2';
        label.textContent = 'Dekati Bingkai Sertifikat';
      }
    }
  }
}

export function drawMuseum() {
  if (!mCtx || !museumCanvas) return;
  const w = museumCanvas.width;
  const h = museumCanvas.height;
  const floorY = h - 54;
  const camX = Math.max(0, Math.min(worldWidth - w, player.x - w * 0.35));

  mCtx.clearRect(0, 0, w, h);
  mCtx.fillStyle = '#182234';
  mCtx.fillRect(0, 0, w, floorY);

  mCtx.fillStyle = '#0b1120';
  mCtx.fillRect(0, 0, w, 24);
  mCtx.fillStyle = '#fbbf24';
  mCtx.fillRect(0, 24, w, 4);

  mCtx.save();
  mCtx.translate(-camX, 0);

  // Gambar pilar ruangan dinamis di antara setiap bingkai sertifikat
  for (let pxCol = 295; pxCol < worldWidth - 160; pxCol += CERT_GAP) {
    mCtx.fillStyle = '#222f46';
    mCtx.fillRect(pxCol + 4, 42, 28, floorY - 42);
    mCtx.fillStyle = '#33425c';
    mCtx.fillRect(pxCol + 9, 42, 6, floorY - 42);
    mCtx.fillStyle = '#475569';
    mCtx.fillRect(pxCol, 28, 36, 14);
  }

  const timeSec = performance.now() * 0.001;
  const dustCount = Math.max(22, Math.floor(worldWidth / 120));
  for (let d = 0; d < dustCount; d++) {
    const dx = ((d * 193 + timeSec * (9 + (d % 4) * 3)) % (worldWidth - 60)) + 30;
    const dy = 52 + ((d * 97 + Math.sin(timeSec * 1.4 + d) * 12) % (floorY - 80));
    const alpha = 0.25 + 0.3 * Math.sin(timeSec * 2 + d);
    mCtx.fillStyle = `rgba(251, 191, 36, ${alpha.toFixed(2)})`;
    mCtx.fillRect(Math.floor(dx), Math.floor(dy), d % 3 === 0 ? 3 : 2, d % 3 === 0 ? 3 : 2);
  }

  mCtx.fillStyle = '#0b1120';
  mCtx.fillRect(72, floorY - 126, 186, 62);
  mCtx.strokeStyle = '#f59e0b';
  mCtx.lineWidth = 2;
  mCtx.strokeRect(72, floorY - 126, 186, 62);
  mCtx.fillStyle = '#fbbf24';
  mCtx.font = 'bold 11px "JetBrains Mono", monospace';
  mCtx.fillText('GALERI SERTIFIKAT', 90, floorY - 101);
  mCtx.fillStyle = '#94a3b8';
  mCtx.font = '10px "Plus Jakarta Sans", sans-serif';
  mCtx.fillText('Gunakan A/D atau Panah →', 90, floorY - 81);

  // Sticky note tersembunyi di ujung paling kanan koridor
  const noteW = 36;
  const noteH = 42;
  const noteY = floorY - 118;

  mCtx.save();
  mCtx.translate(vaultNoteX, noteY + noteH / 2);
  mCtx.rotate(-0.07);
  mCtx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  mCtx.fillRect(-noteW / 2 + 2, -noteH / 2 + 2, noteW, noteH);
  mCtx.fillStyle = isNearVaultNote ? '#fef08a' : '#fef9c3';
  mCtx.fillRect(-noteW / 2, -noteH / 2, noteW, noteH);
  mCtx.fillStyle = '#eab308';
  mCtx.beginPath();
  mCtx.moveTo(noteW / 2 - 7, noteH / 2);
  mCtx.lineTo(noteW / 2, noteH / 2 - 7);
  mCtx.lineTo(noteW / 2, noteH / 2);
  mCtx.closePath();
  mCtx.fill();
  mCtx.fillStyle = '#78350f';
  mCtx.fillRect(-noteW / 2 + 6, -noteH / 2 + 12, 20, 2);
  mCtx.fillRect(-noteW / 2 + 6, -noteH / 2 + 18, 24, 2);
  mCtx.fillRect(-noteW / 2 + 6, -noteH / 2 + 24, 15, 2);
  mCtx.fillStyle = '#e11d48';
  mCtx.beginPath();
  mCtx.arc(0, -noteH / 2 + 4, 2.5, 0, Math.PI * 2);
  mCtx.fill();
  mCtx.restore();

  if (isNearVaultNote) {
    const pulseY = Math.sin(timeSec * 5) * 2;
    mCtx.fillStyle = '#fef08a';
    mCtx.fillRect(vaultNoteX - 48, noteY - 28 + pulseY, 96, 20);
    mCtx.strokeStyle = '#ca8a04';
    mCtx.lineWidth = 1;
    mCtx.strokeRect(vaultNoteX - 48, noteY - 28 + pulseY, 96, 20);
    mCtx.fillStyle = '#0f172a';
    mCtx.font = 'bold 9.5px "Plus Jakarta Sans", sans-serif';
    mCtx.textAlign = 'center';
    mCtx.fillText('[E] BACA CATATAN', vaultNoteX, noteY - 14 + pulseY);
    mCtx.textAlign = 'left';
  }

  exhibits.forEach((ex) => {
    const isNear = activeExhibitIndex === ex.index;
    const isVisited = visitedSet.has(ex.index);
    const certNumber = String(ex.index + 1).padStart(2, '0');

    mCtx.fillStyle = '#475569';
    mCtx.fillRect(ex.x - 10, 28, 20, 7);
    mCtx.fillStyle = isNear ? '#fbbf24' : '#94a3b8';
    mCtx.fillRect(ex.x - 6, 35, 12, 3);

    const spotGrad = mCtx.createLinearGradient(ex.x, 38, ex.x, floorY);
    spotGrad.addColorStop(0, isNear ? 'rgba(251, 191, 36, 0.24)' : 'rgba(148, 163, 184, 0.12)');
    spotGrad.addColorStop(0.8, isNear ? 'rgba(251, 191, 36, 0.05)' : 'rgba(148, 163, 184, 0.02)');
    spotGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
    mCtx.fillStyle = spotGrad;
    mCtx.beginPath();
    mCtx.moveTo(ex.x - 8, 38);
    mCtx.lineTo(ex.x + 8, 38);
    mCtx.lineTo(ex.x + 74, floorY);
    mCtx.lineTo(ex.x - 74, floorY);
    mCtx.closePath();
    mCtx.fill();

    const frameW = 114;
    const frameH = 82;
    const frameX = ex.x - frameW / 2;
    const frameY = floorY - 178;

    mCtx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    mCtx.fillRect(frameX - 3, frameY - 2, frameW + 12, frameH + 12);
    mCtx.fillStyle = isNear ? '#fbbf24' : '#b45309';
    mCtx.fillRect(frameX - 6, frameY - 6, frameW + 12, frameH + 12);
    mCtx.fillStyle = isNear ? '#fef08a' : '#d97706';
    mCtx.fillRect(frameX - 3, frameY - 3, frameW + 6, frameH + 6);

    mCtx.fillStyle = '#f8fafc';
    mCtx.fillRect(frameX, frameY, frameW, frameH);

    mCtx.fillStyle = ex.color || '#f59e0b';
    mCtx.fillRect(frameX + 8, frameY + 9, frameW - 16, 10);
    mCtx.fillStyle = '#94a3b8';
    mCtx.fillRect(frameX + 14, frameY + 27, frameW - 28, 4);
    mCtx.fillStyle = '#cbd5e1';
    mCtx.fillRect(frameX + 20, frameY + 36, frameW - 40, 4);
    mCtx.fillRect(frameX + 16, frameY + 45, frameW - 32, 4);

    mCtx.fillStyle = isVisited ? '#10b981' : '#f59e0b';
    mCtx.beginPath();
    mCtx.arc(ex.x, frameY + 63, 7, 0, Math.PI * 2);
    mCtx.fill();

    mCtx.fillStyle = '#090e1a';
    mCtx.fillRect(ex.x - 42, floorY - 82, 84, 20);
    mCtx.strokeStyle = isNear ? '#fbbf24' : '#334155';
    mCtx.lineWidth = 1.5;
    mCtx.strokeRect(ex.x - 42, floorY - 82, 84, 20);
    mCtx.fillStyle = isNear ? '#fbbf24' : '#cbd5e1';
    mCtx.font = 'bold 10px "JetBrains Mono", monospace';
    mCtx.textAlign = 'center';
    mCtx.fillText(`CERT #${certNumber}`, ex.x, floorY - 68);
    mCtx.textAlign = 'left';

    const leftPostX = ex.x - 66;
    const rightPostX = ex.x + 66;
    const postTopY = floorY - 36;

    mCtx.strokeStyle = '#be123c';
    mCtx.lineWidth = 3.5;
    mCtx.beginPath();
    mCtx.moveTo(leftPostX, postTopY + 6);
    mCtx.quadraticCurveTo(ex.x, postTopY + 17, rightPostX, postTopY + 6);
    mCtx.stroke();

    [leftPostX, rightPostX].forEach((postX) => {
      mCtx.fillStyle = '#b45309';
      mCtx.fillRect(postX - 6, floorY - 4, 12, 4);
      mCtx.fillStyle = '#f59e0b';
      mCtx.fillRect(postX - 2, postTopY, 4, 32);
      mCtx.fillStyle = '#fde047';
      mCtx.beginPath();
      mCtx.arc(postX, postTopY, 4, 0, Math.PI * 2);
      mCtx.fill();
    });

    if (isNear) {
      const pulseY = Math.sin(timeSec * 5) * 2;
      mCtx.fillStyle = '#fbbf24';
      mCtx.fillRect(ex.x - 60, frameY - 34 + pulseY, 120, 22);
      mCtx.fillStyle = '#0f172a';
      mCtx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
      mCtx.textAlign = 'center';
      mCtx.fillText('[E] LIHAT SERTIFIKAT', ex.x, frameY - 19 + pulseY);
      mCtx.textAlign = 'left';
    }
  });

  // Lantai Karpet Merah & Karakter Pixel
  mCtx.fillStyle = '#070b14';
  mCtx.fillRect(0, floorY, worldWidth, h - floorY);
  mCtx.fillStyle = '#881337';
  mCtx.fillRect(0, floorY, worldWidth, 16);
  mCtx.fillStyle = '#fbbf24';
  mCtx.fillRect(0, floorY, worldWidth, 2);
  mCtx.fillRect(0, floorY + 15, worldWidth, 2);

  const bob = Math.abs(Math.sin(player.walkTimer)) * 3;
  const px = Math.round(player.x);
  const py = Math.round(floorY - bob);

  mCtx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  mCtx.beginPath();
  mCtx.ellipse(px, floorY + 5, 17, 5, 0, 0, Math.PI * 2);
  mCtx.fill();

  const legSwing = Math.round(Math.sin(player.walkTimer * 2) * 5);
  mCtx.fillStyle = '#0f172a';
  mCtx.fillRect(px - 8 + legSwing, py - 16, 6, 16);
  mCtx.fillRect(px + 2 - legSwing, py - 16, 6, 16);
  mCtx.fillStyle = '#38bdf8';
  mCtx.fillRect(px - 8 + legSwing, py - 4, 7, 4);
  mCtx.fillRect(px + 2 - legSwing, py - 4, 7, 4);

  mCtx.fillStyle = '#1e3a8a';
  mCtx.fillRect(px - 12, py - 39, 24, 24);
  mCtx.fillStyle = '#3b82f6';
  mCtx.fillRect(px - 3, py - 39, 6, 24);
  mCtx.fillStyle = '#fbbf24';
  mCtx.fillRect(px + (player.facing === 1 ? 5 : -8), py - 33, 4, 4);

  mCtx.fillStyle = '#fed7aa';
  mCtx.fillRect(px - 10, py - 59, 20, 20);

  mCtx.fillStyle = '#0f172a';
  mCtx.fillRect(px - 11, py - 63, 22, 8);
  mCtx.fillRect(px + (player.facing === 1 ? -11 : 7), py - 57, 4, 9);

  mCtx.fillStyle = '#0f172a';
  const eyeOffset = player.facing === 1 ? 4 : -7;
  mCtx.fillRect(px + eyeOffset, py - 51, 3, 4);

  mCtx.restore();
}

export function inspectNearestExhibit() {
  if (activeExhibitIndex !== -1) {
    openCertModal(activeExhibitIndex);
  } else if (isNearVaultNote) {
    openVaultNoteModal();
  }
}

export function openVaultNoteModal() {
  const modal = document.getElementById('vault-note-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

export function closeVaultNoteModal() {
  const modal = document.getElementById('vault-note-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function toCleanPublicUrl(supabaseUrl) {
  if (!supabaseUrl) return '';
  const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  if (isLocalhost) return supabaseUrl;

  // Ubah URL Supabase Storage menjadi path bersih /assets/sertifikasi/<nama-file>
  const marker = '/portfolio-assets/';
  const idx = supabaseUrl.indexOf(marker);
  if (idx !== -1) {
    const filePath = supabaseUrl.slice(idx + marker.length);
    return `/assets/sertifikasi/${filePath}`;
  }
  return supabaseUrl;
}

async function openMaskedDocument(url) {
  if (!url) return;
  const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);

  // Jika sudah di-hosting (Vercel/Netlify), langsung buka URL bersih /assets/sertifikasi/...
  if (!isLocalhost) {
    window.open(toCleanPublicUrl(url), '_blank', 'noopener,noreferrer');
    return;
  }

  // Jika masih di localhost, gunakan Blob URL
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Gagal mengambil dokumen');
    const arrayBuffer = await res.arrayBuffer();
    const isPdf = /\.pdf(\?|$)/i.test(url);
    const mimeType = isPdf ? 'application/pdf' : (res.headers.get('content-type') || 'application/octet-stream');

    const blob = new Blob([arrayBuffer], { type: mimeType });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
  } catch {
    window.open(url, '_blank');
  }
}

async function renderPdfFirstPageToCanvas(pdfUrl, canvasEl, fallbackTemplateEl) {
  try {
    if (!window.pdfjsLib) throw new Error('PDF.js belum dimuat');
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    const loadingTask = window.pdfjsLib.getDocument(pdfUrl);
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 1.6 });
    const context = canvasEl.getContext('2d');
    canvasEl.width = viewport.width;
    canvasEl.height = viewport.height;

    await page.render({ canvasContext: context, viewport }).promise;

    canvasEl.classList.remove('hidden');
    if (fallbackTemplateEl) fallbackTemplateEl.classList.add('hidden');
  } catch (err) {
    console.warn('Gagal render preview PDF, memakai template cadangan:', err);
    canvasEl.classList.add('hidden');
    if (fallbackTemplateEl) fallbackTemplateEl.classList.remove('hidden');
  }
}

export function openCertModal(index) {
  const cert = exhibits[index];
  if (!cert) return;
  visitedSet.add(index);
  const visitedCountEl = document.getElementById('visited-count');
  if (visitedCountEl) visitedCountEl.textContent = visitedSet.size;

  document.getElementById('modal-cert-issuer').textContent = cert.issuer;
  document.getElementById('cert-doc-issuer-top').textContent = cert.issuer;
  document.getElementById('modal-cert-title').textContent = cert.title;
  document.getElementById('modal-cert-year').textContent = cert.year;
  document.getElementById('modal-cert-desc').textContent = cert.desc;
  document.getElementById('modal-cert-id').textContent = cert.id;

  const uploadedImgEl = document.getElementById('modal-cert-uploaded-img');
  const pdfCanvasEl = document.getElementById('modal-cert-pdf-canvas');
  const templateEl = document.getElementById('modal-cert-template');
  const linkEl = document.getElementById('modal-cert-file-link');
  const badgeEl = document.getElementById('modal-cert-open-badge');

  if (uploadedImgEl) { uploadedImgEl.src = ''; uploadedImgEl.classList.add('hidden'); }
  if (pdfCanvasEl) { pdfCanvasEl.classList.add('hidden'); }
  if (templateEl) { templateEl.classList.remove('hidden'); }

  const targetDocUrl = cert.pdfUrl || cert.imageUrl;
  const isPdf = /\.pdf(\?|$)/i.test(targetDocUrl || '');

  if (isPdf && pdfCanvasEl) {
    renderPdfFirstPageToCanvas(targetDocUrl, pdfCanvasEl, templateEl);
  } else if (cert.imageUrl && uploadedImgEl && templateEl) {
    uploadedImgEl.src = cert.imageUrl;
    uploadedImgEl.classList.remove('hidden');
    templateEl.classList.add('hidden');
  }

  if (linkEl && badgeEl) {
    if (targetDocUrl) {
      linkEl.href = 'javascript:void(0)';
      linkEl.removeAttribute('target');
      linkEl.onclick = (e) => {
        e.preventDefault();
        openMaskedDocument(targetDocUrl);
      };
      linkEl.style.pointerEvents = 'auto';
      linkEl.classList.add('cursor-pointer');
      badgeEl.classList.remove('hidden');
      badgeEl.classList.add('inline-flex');
    } else {
      linkEl.removeAttribute('href');
      linkEl.onclick = null;
      linkEl.style.pointerEvents = 'none';
      linkEl.classList.remove('cursor-pointer');
      badgeEl.classList.add('hidden');
      badgeEl.classList.remove('inline-flex');
    }
  }

  const modal = document.getElementById('certificate-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

export function closeCertModal() {
  const modal = document.getElementById('certificate-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}