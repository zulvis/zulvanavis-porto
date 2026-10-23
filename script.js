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
  let cvSectionsPromise;
  const cvFileUrl = `${basePath}public/CV%20MUHAMMAD%20ZULVA%20NAVIS_GENERAL_mentahan.pdf`;

  function normalizeText(value) {
    return value.normalize('NFC').replace(/[\u200B\uFFFD]/g, '').replace(/\s+/g, ' ').trim();
  }

  function normalizeKey(value) {
    return normalizeText(value).toLocaleLowerCase('id').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '');
  }

  async function loadCVSections() {
    if (!cvSectionsPromise) {
      cvSectionsPromise = (async () => {
        const pdfjs = await import(new URL(`${basePath}assets/pdfjs/pdf.min.mjs`, window.location.href));
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(`${basePath}assets/pdfjs/pdf.worker.min.mjs`, window.location.href).href;
        const response = await fetch(cvFileUrl);
        if (!response.ok) throw new Error('File CV tidak dapat dimuat.');
        const pdf = await pdfjs.getDocument({ data: new Uint8Array(await response.arrayBuffer()) }).promise;
        let documentText = '';

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          const page = await pdf.getPage(pageNumber);
          const content = await page.getTextContent();
          let previousY = null;
          let lineHeight = 0;
          for (const item of content.items) {
            if (!item.str) continue;
            const y = item.transform?.[5];
            if (previousY !== null && Number.isFinite(y) && Math.abs(y - previousY) > 2) {
              const gap = Math.abs(y - previousY);
              documentText += gap > Math.max(17, lineHeight * 1.5) ? '\n\n' : '\n';
            }
            documentText += `${item.str}${item.hasEOL ? '\n' : ' '}`;
            if (Number.isFinite(item.height)) lineHeight = Math.max(lineHeight, item.height);
            if (Number.isFinite(y)) previousY = y;
          }
          documentText += '\n\n';
        }

        const headings = [
          { id: 'summary', title: 'Ringkasan', key: 'ringkasan' },
          { id: 'education', title: 'Pendidikan', key: 'pendidikan' },
          { id: 'projects', title: 'Studi Kasus & Proyek Akademik', key: 'studikasusproyekakademik' },
          { id: 'experience', title: 'Pengalaman Magang', key: 'pengalamanmagang' },
          { id: 'organization', title: 'Pengalaman Organisasi dan Kepanitiaan', key: 'pengalamanorganisasidankepanitiaan' },
          { id: 'skills', title: 'Sertifikat, Skills, dan Lainnya', key: 'sertifikatskillsdanlainnya' }
        ];
        const sections = {};
        let activeSection = null;
        for (const rawLine of documentText.split('\n')) {
          const line = normalizeText(rawLine);
          if (!line) {
            if (activeSection && sections[activeSection.id].length && sections[activeSection.id].at(-1) !== '') sections[activeSection.id].push('');
            continue;
          }
          const key = normalizeKey(line);
          const heading = headings.find(item => key === item.key);
          if (heading) {
            activeSection = heading;
            sections[heading.id] = [];
          } else if (activeSection) sections[activeSection.id].push(line);
        }
        return { sections, fullText: normalizeText(documentText) };
      })().catch(error => {
        cvSectionsPromise = null;
        throw error;
      });
    }
    return cvSectionsPromise;
  }

  function answerFromCV(prompt, source) {
    const query = normalizeKey(prompt);
    if (/(email|surel|telepon|nomorhp|nomorponsel|kontak|alamat)/.test(query)) {
      const email = source.fullText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];
      const phone = source.fullText.match(/\+?62[\d\s()-]{8,}/)?.[0]?.replace(/\s+/g, ' ').trim();
      const details = [];
      if (email) details.push(`Email: ${email}`);
      if (phone) details.push(`Telepon: ${phone}`);
      const location = source.fullText.match(/Malang,\s*Indonesia/i)?.[0];
      if (/(alamat|lokasi|domisili)/.test(query) && location) details.push(`Lokasi: ${location}`);
      if (details.length) return `### Informasi Kontak\n\n${details.join('\n\n')}`;
    }

    const routes = [
      { id: 'summary', title: 'Ringkasan', terms: ['siapa', 'tentang', 'ringkasan', 'profil', 'diri'] },
      { id: 'education', title: 'Pendidikan', terms: ['pendidikan', 'kuliah', 'universitas', 'ipk', 'cumlaude', 'sarjana'] },
      { id: 'projects', title: 'Studi Kasus & Proyek Akademik', terms: ['proyek', 'project', 'digitalagency', 'efarm', 'caki', 'pendanaan', 'pkm'] },
      { id: 'organization', title: 'Pengalaman Organisasi dan Kepanitiaan', terms: ['organisasi', 'kepanitiaan', 'ice', 'ketua'] },
      { id: 'experience', title: 'Pengalaman Magang', terms: ['pengalaman', 'magang', 'kerja', 'inzaghi', 'aba', 'paud'] },
      { id: 'skills', title: 'Sertifikat, Skills, dan Lainnya', terms: ['sertifikat', 'sertifikasi', 'skill', 'keahlian', 'kemampuan', 'software', 'canva', 'microsoft'] }
    ];
    const route = routes.find(item => item.terms.some(term => query.includes(normalizeKey(term))));
    const lines = route ? source.sections[route.id] : null;
    if (!route || !lines?.length) return 'Saya belum menemukan bagian CV yang cocok dengan pertanyaan itu. Coba tanyakan tentang ringkasan, pendidikan, proyek, pengalaman, organisasi, keahlian, atau sertifikat.';

    const text = lines.join('\n').replace(/[ \t]+\n/g, '\n').trim();
    const paragraphs = text.split(/\n{2,}/).flatMap(block => {
      const cleanBlock = block.replace(/\s*\n\s*/g, ' ').replace(/\s+/g, ' ').trim();
      return cleanBlock.match(/[^.!?]+(?:[.!?]+|$)/g)?.map(part => part.trim()).filter(Boolean) || [cleanBlock];
    }).filter(Boolean);
    return `### ${route.title}\n\n${paragraphs.join('\n\n')}`;
  }

  function appendInlineMarkdown(parent, text) {
    const tokenPattern = /(\*\*.+?\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^\s)]+\))/g;
    let cursor = 0;
    for (const match of text.matchAll(tokenPattern)) {
      const index = match.index;
      if (index > cursor) parent.append(document.createTextNode(text.slice(cursor, index)));
      const token = match[0];
      let node;
      if (token.startsWith('**')) {
        node = document.createElement('strong');
        node.textContent = token.slice(2, -2);
      } else if (token.startsWith('*')) {
        node = document.createElement('em');
        node.textContent = token.slice(1, -1);
      } else if (token.startsWith('`')) {
        node = document.createElement('code');
        node.textContent = token.slice(1, -1);
      } else {
        const linkMatch = token.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
        node = document.createElement('a');
        node.href = linkMatch[2];
        node.target = '_blank';
        node.rel = 'noopener noreferrer';
        node.textContent = linkMatch[1];
      }
      parent.append(node);
      cursor = index + token.length;
    }
    if (cursor < text.length) parent.append(document.createTextNode(text.slice(cursor)));
  }

  function appendMarkdown(parent, source) {
    const lines = source.replace(/\r\n?/g, '\n').trim().split('\n');
    let paragraph = [];
    let list = null;
    let codeLines = null;
    const flushParagraph = () => {
      if (!paragraph.length) return;
      const element = document.createElement('p');
      appendInlineMarkdown(element, paragraph.join(' '));
      parent.append(element);
      paragraph = [];
    };
    const flushList = () => {
      if (list) parent.append(list);
      list = null;
    };

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (line.startsWith('```')) {
        flushParagraph();
        flushList();
        if (codeLines) {
          const pre = document.createElement('pre');
          const code = document.createElement('code');
          code.textContent = codeLines.join('\n');
          pre.append(code);
          parent.append(pre);
          codeLines = null;
        } else codeLines = [];
        continue;
      }
      if (codeLines) { codeLines.push(rawLine); continue; }
      if (!line) { flushParagraph(); flushList(); continue; }

      const heading = line.match(/^(#{1,3})\s+(.+)$/);
      if (heading) {
        flushParagraph(); flushList();
        const element = document.createElement(`h${heading[1].length + 2}`);
        appendInlineMarkdown(element, heading[2]);
        parent.append(element);
        continue;
      }
      const item = line.match(/^(?:[-*•]|\d+[.)])\s+(.+)$/);
      if (item) {
        flushParagraph();
        const ordered = /^\d+[.)]/.test(line);
        const tag = ordered ? 'ol' : 'ul';
        if (list && list.tagName.toLowerCase() !== tag) flushList();
        if (!list) list = document.createElement(tag);
        const li = document.createElement('li');
        appendInlineMarkdown(li, item[1]);
        list.append(li);
        continue;
      }
      flushList();
      paragraph.push(line);
    }
    flushParagraph();
    flushList();
    if (codeLines) {
      const pre = document.createElement('pre');
      const code = document.createElement('code');
      code.textContent = codeLines.join('\n');
      pre.append(code);
      parent.append(pre);
    }
  }

  function appendMessage(role, text) {
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
    if (role === 'assistant') appendMarkdown(bubble, text);
    else {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      bubble.append(paragraph);
    }

    message.append(bubble);
    chatMessages.append(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return message;
  }

  async function respond(value) {
    const prompt = value.trim();
    if (!prompt || isResponding) return;

    isResponding = true;
    appendMessage('user', prompt);
    if (suggestions) suggestions.hidden = true;
    askButton.disabled = true;
    askForm.setAttribute('aria-busy', 'true');
    const loadingMessage = appendMessage('assistant', 'Membaca CV dan mencari bagian yang sesuai…');
    loadingMessage.classList.add('chat-message--loading');
    try {
      const source = await loadCVSections();
      loadingMessage.remove();
      appendMessage('assistant', answerFromCV(prompt, source));
    } catch (error) {
      loadingMessage.remove();
      appendMessage('assistant', error.message || 'CV belum dapat dibaca. Periksa kembali file PDF di folder public.');
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
