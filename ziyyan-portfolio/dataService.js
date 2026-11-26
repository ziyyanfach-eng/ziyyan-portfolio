import { supabase, isSupabaseConfigured } from './supabaseClient.js';

export const DEFAULT_CERTIFICATES = [
  {
    id: 'BNSP-JWD-01',
    title: 'Junior Web Developer (JWD)',
    issuer: 'BNSP / Digital Talent Certification',
    year: '2025',
    color: '#3b82f6',
    desc: 'Sertifikasi kompetensi nasional pengembang web meliputi perancangan antarmuka responsif, pemrograman terstruktur, pengelolaan basis data, dan pengujian fungsional.'
  },
  {
    id: 'ITS-DB-02',
    title: 'IT Specialist in Databases',
    issuer: 'Certiport / Pearson VUE',
    year: '2025',
    color: '#10b981',
    desc: 'Sertifikasi internasional perancangan skema basis data relasional, normalisasi tabel, penulisan query SQL optimal, dan manajemen integritas data.'
  },
  {
    id: 'ITS-HTML-03',
    title: 'IT Specialist in HTML & CSS',
    issuer: 'Certiport / Pearson VUE',
    year: '2024',
    color: '#f59e0b',
    desc: 'Validasi standar global dalam penyusunan struktur semantik HTML5, tata letak modern CSS3/Tailwind, dan aksesibilitas antarmuka web.'
  },
  {
    id: 'GCP-ARC-M2',
    title: 'Google Cloud Arcade Facilitator — Milestone 2',
    issuer: 'Google Cloud & Dicoding Indonesia',
    year: '2026',
    color: '#8b5cf6',
    desc: 'Penghargaan fasilitator setelah membimbing 173 peserta (44 milestone & 10 Ultimate Milestone) serta melampaui target 200 Arcade Games dan 500 Skill Badges.'
  },
  {
    id: 'UNIKU-LAB-05',
    title: 'Asisten Laboratorium Teknik Informatika',
    issuer: 'Universitas Kuningan',
    year: '2024',
    color: '#ec4899',
    desc: 'Pendampingan praktikum pemrograman, basis data, jaringan komputer, dan troubleshooting perangkat lunak mahasiswa Teknik Informatika.'
  },
  {
    id: 'EKRAF-INT-06',
    title: 'Front End Developer Internship Certificate',
    issuer: 'EKRAF Kuningan',
    year: '2025',
    color: '#06b6d4',
    desc: 'Sertifikat penyelesaian magang pengembangan dan pemeliharaan website Galeri Ekraf Kuningan berbasis Laravel, Tailwind CSS, dan MySQL.'
  }
];

export const DEFAULT_PROJECTS = [
  {
    file: 'project-01.unity',
    title: 'Skripsi: Interactive Game Development (Unity)',
    role: 'Lead Game Developer & Designer',
    year: '2025 – 2026',
    tag: 'Unity Engine • C# • Game Design • Thesis',
    cover: 'https://images.unsplash.com/photo-1556438064-2d7646166914?auto=format&fit=crop&w=900&q=85',
    desc: 'Proyek tugas akhir S1 Teknik Informatika berupa pengembangan game interaktif berbasis Unity dengan perancangan mekanik gameplay, logika C#, dan pengujian fungsional.',
    overview: 'Penelitian dan pengembangan game interaktif sebagai proyek skripsi S1 Teknik Informatika di Universitas Kuningan. Berfokus pada perancangan arsitektur gameplay berbasis C#, interaksi UI dalam game, sistem penilaian progres pemain, serta pengujian kelayakan fungsional.',
    features: [
      'Merancang mekanik utama permainan, sistem kontrol karakter, serta manajemen state/level menggunakan C# di Unity Engine.',
      'Membangun antarmuka pengguna (HUD, menu navigasi, dan umpan balik visual) yang responsif dan intuitif bagi pemain.',
      'Melakukan pengujian black-box, debugging performa frame-rate, serta evaluasi pengalaman pengguna (UX).'
    ],
    docs: [
      { img: 'https://images.unsplash.com/photo-1556438064-2d7646166914?auto=format&fit=crop&w=900&q=85', caption: 'Dokumentasi 01 — Tampilan Gameplay & Lingkungan Interaktif Unity' },
      { img: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=900&q=85', caption: 'Dokumentasi 02 — Pengujian Kontrol, Mekanik & Evaluasi UX Pemain' },
      { img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=85', caption: 'Dokumentasi 03 — Arsitektur Skrip C# & Optimasi Performa Scene' }
    ]
  },
  {
    file: 'project-02.laravel',
    title: 'Website Galeri Ekraf Kuningan',
    role: 'Front End Developer Intern',
    year: '2025',
    tag: 'Laravel • Tailwind CSS • MySQL',
    cover: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=85',
    desc: 'Platform web katalog dan etalase ekonomi kreatif daerah Kuningan lengkap dengan manajemen konten dinamis, integrasi database, dan optimasi antarmuka.',
    overview: 'Website resmi yang dikembangkan selama program magang di EKRAF Kuningan untuk memamerkan karya pelaku ekonomi kreatif lokal, manajemen kategori produk, serta kemudahan akses informasi publik.',
    features: [
      'Membangun komponen antarmuka responsif menggunakan Tailwind CSS dan Blade Template Laravel.',
      'Mengintegrasikan katalog produk dan profil kreator dengan basis data MySQL secara dinamis.',
      'Melakukan pengujian fungsional lintas perangkat, perbaikan bug tampilan, serta dokumentasi pemeliharaan sistem.'
    ],
    docs: [
      { img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=85', caption: 'Dokumentasi 01 — Antarmuka Katalog Utama & Etalase Karya EKRAF' },
      { img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=85', caption: 'Dokumentasi 02 — Manajemen Konten Dinamis & Integrasi Database MySQL' },
      { img: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=900&q=85', caption: 'Dokumentasi 03 — Pengujian Responsivitas & QA Lintas Perangkat' }
    ]
  },
  {
    file: 'project-03.cloud',
    title: 'Google Cloud Labs & Arcade Mentoring Hub',
    role: 'Google Cloud Arcade Facilitator',
    year: '2025 – 2026',
    tag: 'Google Cloud Platform • Linux • API',
    cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=85',
    desc: 'Dokumentasi teknis, panduan troubleshooting lab cloud, dan pelacakan progres 173 peserta program Google Cloud Arcade Facilitator.',
    overview: 'Inisiatif pendampingan teknis dan penyusunan panduan lab cloud bagi 173 peserta program Google Cloud Arcade bersama Dicoding Indonesia hingga melampaui target Milestone 2.',
    features: [
      'Menyusun panduan langkah demi langkah penyelesaian lab Compute Engine, Cloud Storage, IAM, dan Kubernetes.',
      'Membantu troubleshooting error konfigurasi CLI, permission, dan deployment API peserta secara langsung.',
      'Memantau capaian 500+ Skill Badges dan 200+ Arcade Games hingga 10 peserta meraih Ultimate Milestone.'
    ],
    docs: [
      { img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=85', caption: 'Dokumentasi 01 — Arsitektur Lab Google Cloud Platform & Infrastruktur' },
      { img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=85', caption: 'Dokumentasi 02 — Sesi Troubleshooting CLI, Linux & Konfigurasi Server' },
      { img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=85', caption: 'Dokumentasi 03 — Pendampingan 173 Peserta & Pencapaian Milestone 2' }
    ]
  }
];

export const TIMELINE_DETAILS = {
  'edu-smk': {
    file: 'education-01.smk',
    org: 'SMK Budi Mulia Karawang',
    period: 'Juli 2019 – Juni 2022',
    title: 'Teknik Komputer dan Jaringan (TKJ)',
    sub: 'Pendidikan Menengah Kejuruan • Infrastruktur & Jaringan',
    summary: 'Menempuh pendidikan kejuruan di bidang Teknik Komputer dan Jaringan dengan penekanan kuat pada perakitan perangkat keras, instalasi sistem operasi, konfigurasi jaringan lokal (LAN/WAN), serta pemecahan masalah teknis lapangan.',
    highlights: [
      'Mempelajari topologi jaringan, pengalamatan IP (subnetting), routing dasar, serta administrasi server Linux & Windows.',
      'Menyelesaikan Praktik Kerja Lapangan (PKL) dengan tugas utama pemeliharaan perangkat keras komputer, instalasi perangkat lunak, dan troubleshooting jaringan.',
      'Membangun fondasi pemahaman infrastruktur IT yang menjadi dasar kuat saat melanjutkan studi ke jenjang S1 Teknik Informatika.'
    ],
    tags: ['Computer Hardware', 'Network Configuration', 'Linux Admin', 'Troubleshooting']
  },
  'edu-uniku': {
    file: 'education-02.uniku',
    org: 'Universitas Kuningan',
    period: 'Sept 2022 – Juni 2026',
    title: 'S1 Teknik Informatika — IPK 3,69 / 4,00',
    sub: 'Sarjana Komputer (S.Kom.) • Rekayasa Perangkat Lunak & Cloud',
    summary: 'Menyelesaikan studi Sarjana Teknik Informatika dengan predikat sangat memuaskan (IPK 3,69). Aktif dalam kegiatan praktikum laboratorium, pengembangan aplikasi web, eksplorasi komputasi awan, serta penyusunan tugas akhir berbasis game development.',
    highlights: [
      'Bertugas sebagai Asisten Laboratorium Teknik Informatika untuk mendampingi mahasiswa dalam praktikum pemrograman, basis data, dan jaringan komputer.',
      'Menyelesaikan skripsi pengembangan game interaktif menggunakan Unity Engine dan bahasa pemrograman C#.',
      'Meraih sertifikasi kompetensi nasional Junior Web Developer (BNSP) serta sertifikasi internasional IT Specialist di bidang Databases dan HTML & CSS.'
    ],
    tags: ['IPK 3,69', 'Asisten Laboratorium', 'Skripsi Unity Game Dev', 'Software Engineering']
  },
  'exp-gcp': {
    file: 'experience-01.gcp',
    org: 'Google Cloud & Dicoding Indonesia',
    period: 'Juli – Sept 2025 & 2026',
    title: 'Google Cloud Arcade Facilitator',
    sub: 'Technical Mentor • Cloud Computing Program (Milestone 2)',
    summary: 'Terpilih sebagai fasilitator resmi program Google Cloud Arcade yang diselenggarakan bersama Dicoding Indonesia untuk membimbing peserta memahami layanan dan arsitektur Google Cloud Platform melalui praktik lab langsung.',
    highlights: [
      'Membimbing total 173 peserta secara aktif hingga menghasilkan 44 capaian milestone dan 10 peserta meraih tingkat tertinggi (Ultimate Milestone).',
      'Berhasil mencapai target fasilitator Milestone 2 dengan akumulasi lebih dari 200 Arcade Games dan 500+ Skill Badges yang diselesaikan peserta.',
      'Memberikan sesi konsultasi, panduan penyelesaian lab hands-on (Compute Engine, Cloud Storage, IAM, Kubernetes), serta troubleshooting kendala teknis peserta.'
    ],
    tags: ['Google Cloud Platform', '173 Mentees', 'Milestone 2', 'Cloud Labs', 'Troubleshooting']
  },
  'exp-ekraf': {
    file: 'experience-02.ekraf',
    org: 'EKRAF Kuningan',
    period: 'Mei 2025 – Juli 2025',
    title: 'Front End Developer Intern',
    sub: 'Web Development & QA • Galeri Ekraf Kuningan',
    summary: 'Berkontribusi dalam tim pengembangan website resmi Galeri Ekraf Kuningan untuk menampilkan katalog pelaku usaha dan karya ekonomi kreatif daerah secara modern dan responsif.',
    highlights: [
      'Mengembangkan antarmuka pengguna yang responsif menggunakan framework Laravel, Tailwind CSS, dan integrasi basis data MySQL.',
      'Melakukan pengujian fungsional (QA testing), identifikasi bug antarmuka, dan optimalisasi tampilan lintas perangkat desktop maupun mobile.',
      'Menyusun dokumentasi teknis alur penggunaan sistem dan pengelolaan konten database agar mudah dipelihara oleh tim.'
    ],
    tags: ['Laravel', 'Tailwind CSS', 'MySQL', 'Functional Testing', 'UI Optimization']
  },
  'exp-kpps': {
    file: 'experience-03.kpps',
    org: 'Komisi Pemilihan Umum (KPU)',
    period: 'Mar–Apr 2024 & Nov–Des 2024',
    title: 'KPPS (Kelompok Penyelenggara Pemungutan Suara)',
    sub: 'Penugasan Pemilu (Mar–Apr 2024) & Pilkada (Nov–Des 2024)',
    summary: 'Bertugas sebagai anggota Kelompok Penyelenggara Pemungutan Suara (KPPS) dalam dua agenda demokrasi besar tahun 2024, yakni Pemilu (Maret – April 2024) dan Pilkada (November – Desember 2024), dengan fokus pada ketelitian rekapitulasi dan digitalisasi hasil suara.',
    highlights: [
      'Melaksanakan tahapan pemungutan dan penghitungan suara di TPS secara tertib, transparan, dan sesuai standar operasional KPU pada Pemilu (Mar–Apr 2024) maupun Pilkada (Nov–Des 2024).',
      'Mengoperasikan aplikasi digitalisasi Sirekap untuk memindai formulir berita acara (C.Hasil), memverifikasi akurasi pembacaan angka (OCR), serta mengunggah data rekapitulasi.',
      'Melakukan validasi silang antara catatan fisik dan data digital guna memastikan nol selisih serta menangani kendala sinkronisasi jaringan di lapangan.'
    ],
    tags: ['Sirekap KPU', 'Pemilu Mar–Apr 2024', 'Pilkada Nov–Des 2024', 'OCR & Data Audit']
  },
  'exp-pantarlih': {
    file: 'experience-04.pantarlih',
    org: 'Komisi Pemilihan Umum (KPU)',
    period: 'Jan 2023–Mar 2024 & Jun–Jul 2024',
    title: 'Pantarlih (Panitia Pemutakhiran Data Pemilih)',
    sub: 'Penugasan Pemilu (Jan 2023–Mar 2024) & Pilkada (Jun–Jul 2024)',
    summary: 'Dipercaya menjalankan tugas pemutakhiran data pemilih di tingkat lapangan selama dua periode penugasan, yakni Pemilu (Januari 2023 – Maret 2024) dan Pilkada (Juni – Juli 2024), untuk menjamin keakuratan daftar pemilih.',
    highlights: [
      'Melakukan pencocokan dan penelitian (coklit) data pemilih secara door-to-door pada periode Pemilu (Jan 2023 – Mar 2024) dan Pilkada (Jun – Jul 2024).',
      'Mengoperasikan aplikasi berbasis digital e-Coklit untuk memperbarui status kependudukan, mencatat pemilih baru, serta menyaring data ganda atau tidak memenuhi syarat.',
      'Memverifikasi kesesuaian dokumen identitas warga (KTP-el dan Kartu Keluarga) dengan database daftar pemilih secara teliti dan terstruktur.'
    ],
    tags: ['e-Coklit', 'Pemilu Jan 2023–Mar 2024', 'Pilkada Jun–Jul 2024', 'Data Validation']
  }
};

export const SKILL_DEFINITIONS = {
  'React.js': { category: 'Frontend Development', def: 'Library JavaScript berbasis komponen untuk membangun antarmuka pengguna (UI) yang interaktif, modular, dan responsif.', use: 'Digunakan untuk menyusun tampilan Single Page Application (SPA) dengan manajemen state yang efisien.' },
  'Next.js': { category: 'Frontend Development', def: 'Framework React modern yang mendukung Server-Side Rendering (SSR), Static Site Generation (SSG), serta optimasi performa web.', use: 'Mempercepat waktu muat halaman awal dan meningkatkan SEO aplikasi web.' },
  'JavaScript (ES6+)': { category: 'Frontend Development', def: 'Bahasa pemrograman inti web modern dengan fitur asinkron (async/await), manipulasi DOM, dan modularitas kode.', use: 'Menggerakkan logika interaktif di sisi klien, komunikasi API, animasi kanvas, hingga validasi data.' },
  'TypeScript': { category: 'Frontend Development', def: 'Superset dari JavaScript yang menambahkan sistem pengecekan tipe data statis (static typing).', use: 'Mencegah bug sejak tahap penulisan kode dan menjaga struktur proyek berskala besar.' },
  'Tailwind CSS': { category: 'Frontend Development', def: 'Framework CSS berbasis utility-first untuk merancang antarmuka kustom secara cepat.', use: 'Diterapkan pada pengembangan Website Galeri Ekraf Kuningan dan portofolio ini.' },
  'HTML5 & CSS3': { category: 'Frontend Development', def: 'Standar fondasi struktur semantik halaman web (HTML5) dan tata letak visual modern (CSS3).', use: 'Memastikan struktur dokumen web aksesibel, rapi di berbagai layar, dan kompatibel lintas browser.' },
  'Vite': { category: 'Frontend Development', def: 'Build tool generasi modern untuk pengembangan web frontend dengan Hot Module Replacement (HMR) super cepat.', use: 'Menggerakkan struktur modular proyek portofolio ini.' },
  'Laravel': { category: 'Backend & API', def: 'Framework PHP berarsitektur MVC (Model-View-Controller) yang elegan dan aman untuk aplikasi web.', use: 'Digunakan untuk membangun backend dan manajemen konten pada proyek Galeri Ekraf Kuningan.' },
  'PHP': { category: 'Backend & API', def: 'Bahasa pemrograman sisi server (server-side) untuk memproses logika bisnis dan interaksi database.', use: 'Menjadi tulang punggung pemrosesan data layanan web berbasis Laravel.' },
  'RESTful API': { category: 'Backend & API', def: 'Standar arsitektur komunikasi antar sistem melalui protokol HTTP menggunakan format JSON.', use: 'Menghubungkan antarmuka frontend dengan server backend secara terstruktur.' },
  'Google Cloud (GCP)': { category: 'Backend & API', def: 'Platform komputasi awan milik Google untuk layanan komputasi, penyimpanan, jaringan, AI, dan container.', use: 'Dikuasai dan diajarkan secara langsung kepada 173 peserta sebagai Google Cloud Arcade Facilitator.' },
  'Linux & Containerization': { category: 'Backend & API', def: 'Administrasi sistem operasi server Linux serta pengemasan aplikasi terisolasi menggunakan container.', use: 'Memastikan aplikasi berjalan konsisten dari tahap pengembangan hingga produksi.' },
  'Unity & C# (Game Dev)': { category: 'Backend & API', def: 'Game engine lintas platform dengan bahasa pemrograman C# untuk mekanik permainan dan logika interaktif.', use: 'Digunakan dalam pengerjaan proyek skripsi pengembangan game interaktif.' },
  'Automation & Middleware': { category: 'Backend & API', def: 'Perangkat lunak penghubung dan skrip otomatisasi yang menyelaraskan pertukaran data antar aplikasi.', use: 'Mengurangi pekerjaan manual berulang dan menjaga sinkronisasi data.' },
  'MySQL': { category: 'Database & Data', def: 'Sistem manajemen basis data relasional (RDBMS) berbasis SQL yang cepat dan stabil.', use: 'Merancang struktur tabel ternormalisasi dan kueri data pada aplikasi web Laravel.' },
  'MongoDB': { category: 'Database & Data', def: 'Basis data NoSQL berorientasi dokumen dengan format fleksibel mirip JSON (BSON).', use: 'Penyimpanan data semi-terstruktur dengan skema dinamis.' },
  'JSON': { category: 'Database & Data', def: 'Format pertukaran data ringan berbasis teks yang mudah dibaca manusia maupun mesin.', use: 'Standar payload REST API dan file konfigurasi sistem.' },
  'Chart.js': { category: 'Database & Data', def: 'Library JavaScript untuk menyajikan data angka ke dalam grafik interaktif berbasis HTML5 Canvas.', use: 'Memvisualisasikan metrik dan laporan analitik.' },
  'NLP': { category: 'Database & Data', def: 'Natural Language Processing — kecerdasan buatan untuk memahami dan mengolah bahasa manusia.', use: 'Pemrosesan teks seperti klasifikasi dokumen dan analisis sentimen.' },
  'AI': { category: 'Database & Data', def: 'Artificial Intelligence — simulasi kecerdasan manusia pada sistem komputer untuk otomatisasi.', use: 'Integrasi fitur cerdas untuk meningkatkan efisiensi alur kerja perangkat lunak.' },
  'Machine Learning': { category: 'Database & Data', def: 'Metode pembelajaran mesin yang melatih algoritma menggunakan data historis untuk membuat prediksi.', use: 'Pengolahan dataset dan pelatihan model klasifikasi.' },
  'Figma': { category: 'UI/UX & Metodologi', def: 'Aplikasi desain antarmuka (UI) dan prototipe interaktif berbasis kolaborasi awan.', use: 'Membuat wireframe dan desain tata letak visual sebelum tahap pengkodean.' },
  'Pengujian Fungsional & QA': { category: 'UI/UX & Metodologi', def: 'Proses verifikasi sistematis untuk memastikan setiap fitur berjalan sesuai spesifikasi tanpa bug.', use: 'Pengujian black-box dan validasi lintas perangkat pada web maupun game.' },
  'Troubleshooting & Debugging': { category: 'UI/UX & Metodologi', def: 'Kemampuan melacak akar penyebab error pada kode, jaringan, maupun konfigurasi sistem.', use: 'Diterapkan saat mendampingi lab cloud peserta GCP hingga debugging aplikasi web.' },
  'Dokumentasi Teknis': { category: 'UI/UX & Metodologi', def: 'Penyusunan panduan tertulis mengenai arsitektur sistem, instalasi, dan petunjuk penggunaan.', use: 'Memudahkan kolaborasi tim dan pemeliharaan sistem jangka panjang.' },
  'Git & GitHub': { category: 'UI/UX & Metodologi', def: 'Sistem kontrol versi terdistribusi (Git) dan platform kolaborasi repositori kode (GitHub).', use: 'Melacak riwayat perubahan kode dan pengelolaan versi proyek.' },
  'Network Configuration': { category: 'UI/UX & Metodologi', def: 'Pengaturan perangkat jaringan komputer meliputi pengalamatan IP, DNS, firewall, serta konektivitas LAN/WAN.', use: 'Keahlian dasar dari pendidikan TKJ yang mendukung pemahaman arsitektur jaringan cloud.' },
  'Integrasi Sistem': { category: 'UI/UX & Metodologi', def: 'Proses menggabungkan berbagai subsistem, database, dan layanan API agar saling terhubung.', use: 'Menjamin aliran data antar modul berjalan mulus dan sinkron.' }
};

export async function fetchCertificates() {
  if (!isSupabaseConfigured || !supabase) return DEFAULT_CERTIFICATES;
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error || !data || data.length === 0) return DEFAULT_CERTIFICATES;
    return data.map((row) => ({
      id: row.code || row.id,
      title: row.title,
      issuer: row.issuer,
      year: row.year,
      color: row.accent_color || '#f59e0b',
      desc: row.description || ''
    }));
  } catch {
    return DEFAULT_CERTIFICATES;
  }
}

export async function fetchProjects() {
  if (!isSupabaseConfigured || !supabase) return DEFAULT_PROJECTS;
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error || !data || data.length === 0) return DEFAULT_PROJECTS;
    return data;
  } catch {
    return DEFAULT_PROJECTS;
  }
}

export async function fetchSiteStatus() {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('is_open_to_work')
      .eq('id', 1)
      .single();
    if (error || !data) return null;
    return Boolean(data.is_open_to_work);
  } catch {
    return null;
  }
}

export async function saveSiteStatus(isOpen) {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ id: 1, is_open_to_work: isOpen, updated_at: new Date().toISOString() });
    return !error;
  } catch {
    return false;
  }
}

export async function submitContactMessage(payload) {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: true, mode: 'local' };
  }
  try {
    const { error } = await supabase.from('contact_messages').insert([payload]);
    if (error) return { ok: false, error: error.message };
    return { ok: true, mode: 'supabase' };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}