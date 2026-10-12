const pages = [
  { id: 'home', label: 'Home', icon: '⌂', iconImage: 'asset.home2.svg', route: '' },
  { id: 'education', label: 'Education', icon: '◇', iconImage: 'asset.education.svg', route: 'education/' },
  { id: 'experience', label: 'Experience', icon: '▣', iconImage: 'asset.experience2.svg', route: 'experience/' },
  { id: 'projects', label: 'Projects', icon: '▤', iconImage: 'asset.project.svg', route: 'projects/' },
  { id: 'certificates', label: 'Certificates', icon: '☆', iconImage: 'asset.certificate2.svg', route: 'certificates/' },
  { id: 'ask', label: 'Ask AI', icon: '▢', iconImage: 'asset.askai2.svg', route: 'ask/' },
  { id: 'contact', label: 'Get In Touch', icon: '✉', iconImage: 'asset.hubungisaya.svg', route: 'contact/' }
];

const body = document.body;
const isNestedPage = body.dataset.level === 'nested';
const basePath = isNestedPage ? '../' : './';
const sidebar = document.querySelector('#sidebar');
const currentPage = body.dataset.page;

sidebar.innerHTML = `
  <div class="sidebar-topbar">
    <button class="sidebar-collapse" id="sidebar-collapse" type="button" aria-expanded="true" aria-label="Ciutkan sidebar" title="Ciutkan sidebar"><span aria-hidden="true">‹</span></button>
  </div>
  <div class="identity">
    <div class="avatar"><img src="${basePath}public/public.ppmzn.png" alt="Foto profil"></div>
    <h2>Muhammad Zulva Navis</h2>
    <p>Management &amp; Business Support</p>
  </div>
  <nav aria-label="Navigasi utama">
    ${pages.map(page => {
      const current = page.id === currentPage;
      return `<a class="nav-link" href="${basePath}${page.route || './'}" title="${page.label}"${current ? ' aria-current="page"' : ''}>
  ${page.iconImage
    ? `<img class="nav-icon-image" src="${basePath}assets/${page.iconImage}" alt="">`
    : `<span class="nav-icon" aria-hidden="true">${page.icon}</span>`}
  <span>${page.label}</span>
</a>`;
    }).join('')}
  </nav>
  <div class="sidebar-bottom">
    <label class="theme-control"><span class="theme-label"><span class="theme-icon" aria-hidden="true">◐</span><span class="theme-text">Dark Mode</span></span><input id="theme-toggle" type="checkbox" aria-label="Aktifkan dark mode"><i class="switch"></i></label>
    <p class="side-caption">BASED IN</p><p>Malang, Indonesia</p>
    <p class="side-caption" style="margin-top:12px">SOCIAL NETWORKS</p>
    <div class="social-links">
      <a href="https://www.linkedin.com/in/muhammad-zulva-navis/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
        <img src="${basePath}assets/asset.linkedin.svg" alt="">
      </a>
    </div>
  </div>`;

const themeToggle = document.querySelector('#theme-toggle');
try {
  if (localStorage.getItem('portfolio-theme') === 'dark') {
    body.classList.add('dark');
    themeToggle.checked = true;
  }
  themeToggle.addEventListener('change', () => {
    body.classList.toggle('dark', themeToggle.checked);
    localStorage.setItem('portfolio-theme', themeToggle.checked ? 'dark' : 'light');
  });
} catch {
  themeToggle.addEventListener('change', () => body.classList.toggle('dark', themeToggle.checked));
}

const sidebarCollapse = document.querySelector('#sidebar-collapse');
function setSidebarCollapsed(isCollapsed) {
  body.classList.toggle('sidebar-collapsed', isCollapsed);
  sidebarCollapse.setAttribute('aria-expanded', String(!isCollapsed));
  sidebarCollapse.setAttribute('aria-label', isCollapsed ? 'Perluas sidebar' : 'Ciutkan sidebar');
  sidebarCollapse.title = isCollapsed ? 'Perluas sidebar' : 'Ciutkan sidebar';
}
try {
  setSidebarCollapsed(localStorage.getItem('portfolio-sidebar-collapsed') === 'true');
  sidebarCollapse.addEventListener('click', () => {
    const isCollapsed = !body.classList.contains('sidebar-collapsed');
    setSidebarCollapsed(isCollapsed);
    localStorage.setItem('portfolio-sidebar-collapsed', String(isCollapsed));
  });
} catch {
  sidebarCollapse.addEventListener('click', () => setSidebarCollapsed(!body.classList.contains('sidebar-collapsed')));
}

const menuToggle = document.querySelector('#menu-toggle');
const sidebarBackdrop = document.createElement('button');
sidebarBackdrop.className = 'sidebar-backdrop';
sidebarBackdrop.type = 'button';
sidebarBackdrop.setAttribute('aria-label', 'Tutup menu navigasi');
sidebarBackdrop.tabIndex = -1;
sidebar.insertAdjacentElement('beforebegin', sidebarBackdrop);
function setMobileMenuOpen(isOpen) {
  sidebar.classList.toggle('open', isOpen);
  body.classList.toggle('mobile-sidebar-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Tutup menu' : 'Buka menu');
  menuToggle.textContent = isOpen ? '×' : '☰';
}
menuToggle.addEventListener('click', () => setMobileMenuOpen(!sidebar.classList.contains('open')));
sidebarBackdrop.addEventListener('click', () => setMobileMenuOpen(false));
document.addEventListener('keydown', event => { if (event.key === 'Escape') setMobileMenuOpen(false); });
sidebar.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMobileMenuOpen(false)));
const answerBank = [
  { terms: ['proyek', 'unggulan', 'digitalagency', 'efarm'], text: 'Dua proyek utama yang tercantum di CV adalah digitalagency.web.id (Program Mahasiswa Wirausaha 2025; tim 3 orang; 11 mitra UMKM) dan efarmuntukindonesia.id (Program Kreatif Mahasiswa 2023; tim 4 orang; 7 mitra petani + 2 mitra peternakan).' },
  { terms: ['pengalaman', 'magang', 'kerja'], text: 'CV mencantumkan tiga pengalaman: Staff Pemasaran di PT Inzaghi Gigantara Solusindo (Apr–Jun 2025), Staf Publikasi dan Dokumentasi di KB TK ABA 11 Malang (Jul–Des 2024), dan Staf Administrasi Program RPL PG PAUD di Universitas Muhammadiyah Surabaya (Jul 2023–Okt 2024).' },
  { terms: ['pendidikan', 'kuliah', 'ipk', 'universitas'], text: 'Muhammad Zulva Navis adalah lulusan Program Sarjana Manajemen Universitas Negeri Surabaya dengan IPK 3,54/4,00 dan predikat Cumlaude.' },
  { terms: ['skill', 'keahlian', 'alat', 'software'], text: 'Keahlian yang tercantum meliputi Microsoft Office, Google Workspace, Coretax Portal (E-Bupot), Software Zahir Online, komunikasi, dokumentasi, pengelolaan data, dan problem solving.' },
  { terms: ['organisasi', 'ice', 'ketua'], text: 'CV mencantumkan pengalaman sebagai Ketua Umum Islamic Community Of Economic (ICE) FEB Unesa pada Jan 2024–Jan 2025. Pendapatan organisasi meningkat 300% dari modal awal Rp10 juta.' },
  { terms: ['kontak', 'email', 'telepon', 'hubungi'], text: 'Kontak yang tercantum di CV: muhammadzulvanavis.work@gmail.com dan +62 831-9816-8869. Lokasi: Malang, Indonesia.' },
  { terms: ['sertifikat', 'prestasi', 'juara', 'penghargaan'], text: 'CV mencantumkan pelatihan Coretax dan Zahir Online (2026), program IBM Skillsbuild (2025), Juara 2 LKTI Tingkat Internasional Hijriah Fest (2025), pemateri CMCT (2025), Juara 2 Management Business Plan Competition (2024), serta Business Plan Certification MarkPlus Institute (2024).' }
];

const question = document.querySelector('#question');
const answer = document.querySelector('#answer');
if (question && answer) {
  function respond(value) {
    const normalized = value.toLocaleLowerCase('id');
    const match = answerBank.find(item => item.terms.some(term => normalized.includes(term)));
    answer.textContent = match ? match.text : 'Saya belum menemukan jawaban itu di informasi CV yang tersedia. Coba tanyakan tentang proyek, pengalaman, pendidikan, skill, organisasi, sertifikat, atau kontak.';
  }
  document.querySelector('#ask-button').addEventListener('click', () => respond(question.value.trim()));
  question.addEventListener('keydown', event => { if (event.key === 'Enter') respond(question.value.trim()); });
  document.querySelectorAll('.suggestions button').forEach(button => button.addEventListener('click', () => {
    question.value = button.textContent;
    respond(question.value);
  }));
}

document.querySelectorAll('.current-year').forEach(element => { element.textContent = new Date().getFullYear(); });

document.querySelectorAll('[role="tablist"]').forEach(tabList => {
  const tabs = Array.from(tabList.querySelectorAll('[role="tab"]'));

  function activateTab(tab, moveFocus = false) {
    tabs.forEach(item => {
      const isSelected = item === tab;
      item.classList.toggle('is-active', isSelected);
      item.setAttribute('aria-selected', String(isSelected));
      item.tabIndex = isSelected ? 0 : -1;

      const panel = document.getElementById(item.dataset.tabTarget);
      if (panel) panel.hidden = !isSelected;
    });

    if (moveFocus) tab.focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', event => {
      let nextIndex;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      if (nextIndex === undefined) return;

      event.preventDefault();
      activateTab(tabs[nextIndex], true);
    });
  });
});

const momentCarousel = document.querySelector('#moment-carousel');
if (momentCarousel) {
  const momentEmpty = document.querySelector('#moment-empty');
  const momentPause = document.querySelector('#moment-pause');
  const momentFiles = Array.from(
    { length: 12 },
    (_, index) => 'gambar carousel ' + (index + 1) + '.jpg'
  );

  const checkMomentPhoto = (file, index) => new Promise(resolve => {
    const src = basePath + 'assets/moments/' + encodeURIComponent(file);
    const image = new Image();
    image.onload = () => resolve({ src, alt: 'Foto Moment Recap ' + (index + 1) });
    image.onerror = () => resolve(null);
    image.src = src;
  });

  Promise.all(momentFiles.map(checkMomentPhoto)).then(results => {
    const photos = results.filter(Boolean);
    if (photos.length === 0) return;

    momentCarousel.querySelectorAll('.moment-column').forEach((column, columnIndex) => {
      const orderedPhotos = photos.slice(columnIndex).concat(photos.slice(0, columnIndex));
      column.classList.add(columnIndex === 1 ? 'moment-column--down' : 'moment-column--up');

      const renderSequence = isDuplicate => {
        const images = orderedPhotos.map(photo =>
          '<figure class="moment-card"><img src="' + photo.src + '" alt="' +
          (isDuplicate ? '' : photo.alt) + '" loading="lazy"></figure>'
        ).join('');
        return '<div class="moment-sequence"' +
          (isDuplicate ? ' aria-hidden="true"' : '') + '>' + images + '</div>';
      };

      column.innerHTML = '<div class="moment-track">' +
        renderSequence(false) + renderSequence(true) + '</div>';
    });

    momentCarousel.hidden = false;
    momentEmpty.hidden = true;
    momentPause.hidden = false;
    momentPause.addEventListener('click', () => {
      const isPaused = momentCarousel.classList.toggle('is-paused');
      momentPause.setAttribute('aria-pressed', String(isPaused));
      momentPause.textContent = isPaused ? 'Lanjutkan gerakan' : 'Jeda gerakan';
    });
  });
}
