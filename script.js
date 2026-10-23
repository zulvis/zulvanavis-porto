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
      <a href="https://www.instagram.com/zulva_navis" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
        <img src="${basePath}assets/asset.instagram.svg" alt="">
      </a>
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
const question = document.querySelector('#question');
const askForm = document.querySelector('#ask-form');
const chatMessages = document.querySelector('#chat-messages');
const askButton = document.querySelector('#ask-button');
const suggestions = document.querySelector('#ask-suggestions');
if (question && askForm && chatMessages && askButton) {
  let isResponding = false;
  let portfolioIndexPromise;
  const portfolioSources = [
    { label: 'About Me', route: '' },
    { label: 'Skills', route: 'skills/' },
    { label: 'Projects', route: 'projects/' },
    { label: 'Education', route: 'education/' },
    { label: 'Experience', route: 'experience/' },
    { label: 'Certificates', route: 'certificates/' },
    { label: 'Get in Touch', route: 'contact/' }
  ];

  function appendMessage(role, paragraphs, links = []) {
    const message = document.createElement('article');
    message.className = `chat-message chat-message--${role}`;

    if (role === 'assistant') {
      const avatar = document.createElement('span');
      avatar.className = 'chat-avatar';
      avatar.setAttribute('aria-hidden', 'true');
      const icon = document.createElement('img');
      icon.src = `${basePath}assets/asset.ai.svg`;
      icon.alt = '';
      avatar.append(icon);
      message.append(avatar);
    }

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    paragraphs.forEach(text => {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      bubble.append(paragraph);
    });

    links.forEach(link => {
      const relatedLink = document.createElement('a');
      relatedLink.className = 'chat-related-link';
      relatedLink.href = `${basePath}${link.route}`;
      relatedLink.textContent = `Buka ${link.label}`;
      bubble.append(relatedLink);
    });

    message.append(bubble);
    chatMessages.append(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return message;
  }

  function normalizeText(value) {
    return value.toLocaleLowerCase('id').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  }

  async function loadPortfolioIndex() {
    if (!portfolioIndexPromise) {
      portfolioIndexPromise = Promise.all(portfolioSources.map(async source => {
        const response = await fetch(`${basePath}${source.route}`, { cache: 'no-cache' });
        if (!response.ok) throw new Error(`Gagal memuat halaman ${source.label}`);
        const html = await response.text();
        const page = new DOMParser().parseFromString(html, 'text/html');
        const main = page.querySelector('main') || page.body;
        main.querySelectorAll('script, style, nav, .site-footer, .mobile-topbar').forEach(node => node.remove());
        const blocks = Array.from(main.querySelectorAll('.intro-card, .skills-card, .moment-section, article.project-card, article.record-card, article.certificate-card, .contact-intro, .contact-method'));
        const uniqueBlocks = blocks.filter((node, index) => !blocks.slice(0, index).some(parent => parent.contains(node)));
        const content = uniqueBlocks.length ? uniqueBlocks : [main];

        return content.map(node => ({
          label: source.label,
          route: source.route,
          text: `${node.textContent} ${Array.from(node.querySelectorAll('img[alt]'), image => image.alt).join(' ')}`.replace(/\s+/g, ' ').trim()
        })).filter(item => item.text.length > 2);
      })).then(pages => pages.flat());
    }
    return portfolioIndexPromise;
  }

  function searchPortfolio(index, prompt) {
    const stopWords = new Set(['apa', 'siapa', 'bagaimana', 'kapan', 'dimana', 'mana', 'apakah', 'saya', 'anda', 'tentang', 'yang', 'untuk', 'dari', 'dengan', 'dan', 'atau', 'ini', 'itu', 'pada', 'dalam', 'bisa', 'tolong', 'jelaskan', 'sebutkan', 'ceritakan', 'ringkas', 'ringkasan', 'diri', 'profil']);
    const terms = [...new Set(normalizeText(prompt).split(' ').filter(term => term.length > 2 && !stopWords.has(term)))];
    if (!terms.length) return index.filter(item => item.label === 'About Me').slice(0, 1).map(item => ({ ...item, score: 1, matchedCount: 1 }));
    const synonymGroups = [
      ['proyek', 'project', 'projects'], ['skill', 'skills', 'keahlian'],
      ['pendidikan', 'education', 'kuliah'], ['pengalaman', 'experience', 'kerja', 'pekerjaan', 'magang'],
      ['sertifikat', 'sertifikasi', 'certificate', 'certificates'], ['organisasi', 'organization', 'organizations'],
      ['kontak', 'contact', 'email', 'whatsapp', 'linkedin']
    ];

    return index.map(item => {
      const tokens = new Set(normalizeText(item.text).split(' '));
      const matched = terms.filter(term => {
        const aliases = synonymGroups.find(group => group.includes(term)) || [term];
        return aliases.some(alias => tokens.has(alias) || [...tokens].some(token => token.startsWith(alias) && alias.length > 4));
      });
      return { ...item, score: matched.length / terms.length, matchedCount: matched.length };
    }).filter(item => item.matchedCount > 0)
      .sort((a, b) => b.score - a.score || b.matchedCount - a.matchedCount || a.text.length - b.text.length)
      .slice(0, 3);
  }

  async function respond(value) {
    const prompt = value.trim();
    if (!prompt || isResponding) return;

    isResponding = true;
    appendMessage('user', [prompt]);
    if (suggestions) suggestions.hidden = true;
    askButton.disabled = true;
    askForm.setAttribute('aria-busy', 'true');
    const loadingMessage = appendMessage('assistant', ['Menelusuri konten halaman portofolio…']);
    loadingMessage.classList.add('chat-message--loading');

    try {
      const index = await loadPortfolioIndex();
      loadingMessage.remove();
      const matches = searchPortfolio(index, prompt);
      if (matches.length) {
        appendMessage('assistant', matches.map(match => `${match.label}: ${match.text.replace(`${match.label}. `, '')}`), [...new Map(matches.map(match => [match.route, { label: match.label, route: match.route }])).values()]);
      } else {
        appendMessage('assistant', ['Saya belum menemukan informasi yang cocok di konten portofolio yang tersedia. Coba gunakan nama proyek, keahlian, tempat pendidikan, pengalaman, sertifikat, atau topik lain yang tercantum di halaman.']);
      }
    } catch {
      loadingMessage.remove();
      portfolioIndexPromise = null;
      appendMessage('assistant', ['Saya tidak dapat memuat halaman portofolio untuk mencari jawabannya. Pastikan situs dibuka melalui alamat web (HTTP/HTTPS), lalu coba lagi.']);
    } finally {
      question.value = '';
      isResponding = false;
      askButton.disabled = true;
      askForm.removeAttribute('aria-busy');
    }
  }

  askForm.addEventListener('submit', event => {
    event.preventDefault();
    respond(question.value);
  });
  question.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      askForm.requestSubmit();
    }
  });
  question.addEventListener('input', () => {
    askButton.disabled = !question.value.trim();
  });
  document.querySelectorAll('#ask-suggestions button').forEach(button => button.addEventListener('click', () => {
    respond(button.dataset.question || button.textContent);
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
