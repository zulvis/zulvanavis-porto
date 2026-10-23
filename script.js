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
  const conversation = [];
  const askApiUrl = 'https://zulvanavis-ask-ai-porto.dokumennafis.workers.dev/api/chat';

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
      const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
      const listItems = lines.map(line => line.match(/^(?:[-*•]|\d+[.)])\s+(.+)$/));
      if (lines.length > 1 && listItems.every(Boolean)) {
        const list = document.createElement(/^\d+[.)]/.test(lines[0]) ? 'ol' : 'ul');
        listItems.forEach(item => {
          const listItem = document.createElement('li');
          listItem.textContent = item[1];
          list.append(listItem);
        });
        bubble.append(list);
        return;
      }
      const paragraph = document.createElement('p');
      paragraph.textContent = lines.join(' ');
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

  async function respond(value) {
    const prompt = value.trim();
    if (!prompt || isResponding) return;

    isResponding = true;
    appendMessage('user', [prompt]);
    conversation.push({ role: 'user', content: prompt });
    if (suggestions) suggestions.hidden = true;
    askButton.disabled = true;
    askForm.setAttribute('aria-busy', 'true');
    const loadingMessage = appendMessage('assistant', ['Membaca informasi portofolio dan menyusun jawaban…']);
    loadingMessage.classList.add('chat-message--loading');

    try {
      const response = await fetch(askApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: prompt, history: conversation.slice(-8, -1) })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Asisten sedang tidak dapat menjawab. Coba lagi sebentar.');
      loadingMessage.remove();
      const answer = typeof data.answer === 'string' && data.answer.trim()
        ? data.answer.trim()
        : 'Maaf, saya belum mendapat jawaban yang bisa ditampilkan. Silakan coba pertanyaan lain.';
      conversation.push({ role: 'assistant', content: answer });
      const paragraphs = answer.split(/\n{2,}/).map(part => part.trim()).filter(Boolean);
      appendMessage('assistant', paragraphs.length ? paragraphs : [answer], (data.sources || []).map(source => ({ label: source.label, route: source.route })));
    } catch (error) {
      loadingMessage.remove();
      appendMessage('assistant', [error.message || 'Saya tidak dapat terhubung ke asisten saat ini. Coba lagi sebentar.']);
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
