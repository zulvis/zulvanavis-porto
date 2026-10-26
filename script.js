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
const skillsDialog = document.querySelector('#skills-dialog');
const openSkillsDialog = document.querySelector('#open-skills-dialog');
const closeSkillsDialog = document.querySelector('#close-skills-dialog');
if (skillsDialog && openSkillsDialog && closeSkillsDialog) {
  openSkillsDialog.addEventListener('click', () => skillsDialog.showModal());
  closeSkillsDialog.addEventListener('click', () => skillsDialog.close());
  skillsDialog.addEventListener('click', event => {
    if (event.target === skillsDialog) skillsDialog.close();
  });
}
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !skillsDialog?.open) setMobileMenuOpen(false);
});
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
    return String(value ?? '')
      .normalize('NFC')
      .replace(/\u200B/g, '')
      .replace(/\uFFFD(?=[A-Za-z])/g, '’')
      .replace(/\uFFFD/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function normalizeKey(value) {
    return normalizeText(value)
      .toLocaleLowerCase('id')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/microsoft/g, 'ms')
      .replace(/\bsheets\b/g, 'spreadsheets')
      .replace(/analysis/g, 'analisis')
      .replace(/report(?:writing)?/g, 'laporan')
      .replace(/[^a-z0-9]+/g, '');
  }

  async function loadCVSections() {
    if (!cvSectionsPromise) {
      cvSectionsPromise = (async () => {
        const pdfjs = await import(new URL(`${basePath}assets/pdfjs/pdf.min.mjs`, window.location.href));
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(`${basePath}assets/pdfjs/pdf.worker.min.mjs`, window.location.href).href;
        const response = await fetch(cvFileUrl);
        if (!response.ok) throw new Error('File CV tidak dapat dimuat.');
        const pdf = await pdfjs.getDocument({ data: new Uint8Array(await response.arrayBuffer()) }).promise;
        const documentLines = [];

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          const page = await pdf.getPage(pageNumber);
          const content = await page.getTextContent();
          let lineItems = [];
          const flushLine = () => {
            const line = normalizeText(lineItems.join(' '));
            if (line) documentLines.push(line);
            lineItems = [];
          };

          for (const item of content.items) {
            if (typeof item.str === 'string' && item.str) lineItems.push(item.str);
            if (item.hasEOL) flushLine();
          }
          flushLine();
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
        for (const line of documentLines) {
          const key = normalizeKey(line);
          const heading = headings.find(item => key === item.key);
          if (heading) {
            activeSection = heading;
            sections[heading.id] = [];
          } else if (activeSection && line) sections[activeSection.id].push(line);
        }
        return { sections, fullText: normalizeText(documentLines.join(' ')) };
      })().catch(error => {
        cvSectionsPromise = null;
        throw error;
      });
    }
    return cvSectionsPromise;
  }

  function answerFromCV(prompt, source) {
    const query = normalizeKey(prompt);
    const unavailable = 'CV Muhammad Zulva Navis belum mencantumkan informasi yang cukup untuk menjawab pertanyaan tersebut.';

    if (/(email|surel|telepon|nomorhp|nomorponsel|kontak|alamat|domisili|lokasi|phone)/.test(query)) {
      const email = source.fullText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];
      const phone = source.fullText.match(/\+?62[\d\s()-]{8,}/)?.[0]?.replace(/\s+/g, ' ').trim();
      const details = [];
      if (email) details.push(`Email: ${email}`);
      if (phone) details.push(`Telepon: ${phone}`);
      const location = source.fullText.match(/Malang,\s*Indonesia/i)?.[0];
      if (/(alamat|lokasi|domisili)/.test(query) && location) details.push(`Lokasi: ${location}`);
      if (details.length) return `### Informasi Kontak\n\nInformasi kontak yang tercantum dalam CV:\n\n${details.join('\n')}`;
      return `### Informasi Kontak\n\n${unavailable}`;
    }

    const routes = [
      { id: 'summary', title: 'Ringkasan', terms: ['siapa', 'tentang', 'ringkasan', 'profil', 'diri', 'background', 'about'] },
      { id: 'education', title: 'Pendidikan', terms: ['pendidikan', 'latar', 'kuliah', 'universitas', 'ipk', 'cumlaude', 'sarjana', 'lulusan', 'education', 'university', 'study', 'studies', 'graduat', 'degree', 'major', 'jurusan', 'gpa', 'ipk', 'academic'] },
      { id: 'projects', title: 'Studi Kasus & Proyek Akademik', terms: ['proyek', 'project', 'digitalagency', 'efarm', 'caki', 'pendanaan', 'pkm', 'unggulan', 'pencapaian'] },
      { id: 'organization', title: 'Pengalaman Organisasi dan Kepanitiaan', terms: ['organisasi', 'kepanitiaan', 'ice', 'ketua', 'organization', 'memimpin', 'leadership'] },
      { id: 'experience', title: 'Pengalaman Magang', terms: ['pengalaman', 'magang', 'kerja', 'inzaghi', 'aba', 'paud', 'experience', 'staff', 'staf', 'internship', 'tanggungjawab', 'responsibility', 'responsible', 'duty', 'duties'] },
      { id: 'skills', title: 'Skills dan Sertifikat', terms: ['sertifikat', 'sertifikasi', 'certificate', 'certification', 'skill', 'keahlian', 'kemampuan', 'software', 'tools', 'digital', 'technical', 'canva', 'capcut', 'microsoft', 'teamwork', 'planning', 'management', 'marketing', 'metads', 'analisis', 'laporan', 'skills'] }
    ];
    const route = routes.find(item => item.terms.some(term => query.includes(normalizeKey(term))));
    let lines = route ? source.sections[route.id] : null;
    if (!route || !lines?.length) return `### Informasi belum tersedia\n\n${unavailable}`;
    if (route.id === 'skills' && /(analisis|laporan)/.test(query)) {
      const summaryLines = source.sections.summary || [];
      const evidence = normalizeText(summaryLines.join(' '));
      if (/(analisis data|data.{0,12}analisis)/i.test(evidence) && /menyusun laporan/i.test(evidence)) {
        return '### Analisis Data dan Penyusunan Laporan\n\nDalam ringkasan CV, Muhammad Zulva Navis menyebutkan bahwa ia terbiasa melakukan analisis data dan menyusun laporan.';
      }
      return `### Keahlian\n\n${unavailable}`;
    }

    const asksForCertificates = /sertifikat|sertifikasi|certificate|certification/.test(query);
    if (route.id === 'skills' && asksForCertificates) {
      lines = lines.filter(line => /^(?:certificate|certification)\s*\(/i.test(line));
      if (!lines.length) return `### Sertifikat\n\n${unavailable}`;
      return `### Sertifikat\n\n${lines.map(line => `- ${normalizeText(line)}`).join('\n')}`;
    }

    const stopWords = new Set([
      'apa', 'siapa', 'yang', 'dan', 'atau', 'untuk', 'dengan', 'pada', 'dari', 'di', 'ke', 'dalam', 'adalah', 'ini', 'itu', 'saya', 'aku', 'dia', 'beliau', 'muhammad', 'zulva', 'navis', 'cv',
      'apakah', 'pernah', 'bisa', 'dapat', 'sebutkan', 'jelaskan', 'ceritakan', 'ringkas', 'tampilkan', 'berikan', 'berapa', 'bagaimana', 'mengapa', 'kapan', 'mana', 'dimana', 'saja', 'semua', 'lainnya', 'lain', 'tercantum', 'tersedia', 'mencakup', 'meliputi', 'punya', 'memiliki', 'kuasai', 'utama', 'terbaik', 'unggulan', 'pencapaian', 'relevan', 'kuat', 'terkait', 'dimiliki', 'pengalaman', 'magang', 'kerja', 'organisasi', 'kepanitiaan', 'pendidikan', 'latar', 'kuliah', 'universitas', 'ipk', 'cumlaude', 'sarjana', 'lulusan', 'proyek', 'pendanaan', 'pkm', 'sertifikat', 'sertifikasi', 'keahlian', 'kemampuan', 'software', 'jurusan', 'gpa', 'degree', 'major', 'technical', 'menggunakan', 'memakai', 'mampu', 'peran', 'posisi', 'profesional', 'pekerjaan', 'tanggung', 'jawab', 'tahun', 'lama', 'tersebut', 'saat', 'terhadap', 'karena', 'yakni', 'sebagai',
      'about', 'what', 'who', 'where', 'when', 'why', 'how', 'which', 'the', 'and', 'or', 'for', 'with', 'from', 'in', 'on', 'at', 'to', 'is', 'are', 'was', 'were', 'do', 'does', 'did', 'can', 'could', 'would', 'should', 'he', 'his', 'him', 'tell', 'me', 'list', 'all', 'other', 'main', 'top', 'strongest', 'relevant', 'available', 'mentioned', 'have', 'has', 'had', 'experience', 'skills', 'skill', 'project', 'projects', 'education', 'certificate', 'certificates', 'professional', 'background', 'work', 'role', 'roles', 'responsibilities', 'years', 'year', 'during', 'internship', 'use', 'using', 'good', 'best', 'digital', 'tools', 'technical', 'soft', 'business', 'keterampilan', 'academic', 'support', 'strengths', 'person', 'individual', 'uses', 'duties', 'responsible', 'contribution', 'contribute'
    ]);
    const specificTerms = [...new Set((String(prompt).toLocaleLowerCase('id').match(/[a-z0-9]+/g) || [])
      .map(normalizeKey)
      .filter(term => term.length > 2 && !stopWords.has(term)))];
    const sectionText = normalizeKey(lines.join(' '));
    const unsupportedTerm = specificTerms.find(term => !sectionText.includes(term));
    if (unsupportedTerm) return `### Informasi belum tersedia\n\n${unavailable}`;

    let text = normalizeText(lines.join(' '));
    if (route.id === 'skills') {
      const skillDetails = text.match(/Technical Skills:\s*(.*?)\s*Soft Skills:\s*(.*)$/i);
      if (skillDetails) {
        const technical = normalizeText(skillDetails[1]);
        const soft = normalizeText(skillDetails[2]);
        return `### Skills dan Keahlian\n\n**Technical Skills**\n\n${technical}\n\n**Soft Skills**\n\n${soft}`;
      }
    }
    if (route.id === 'summary') {
      text = text.replace(/^Saya adalah Fresh Graduate Sarjana Manajemen Universitas Negeri Surabaya dengan predikat Cumlaude yang memiliki pemahaman pada bidang manajemen, administrasi, keuangan, dan pemasaran\./i, 'Muhammad Zulva Navis merupakan lulusan baru program Sarjana Manajemen Universitas Negeri Surabaya dengan predikat Cumlaude. Ia memiliki pemahaman di bidang manajemen, administrasi, keuangan, dan pemasaran.');
    }

    text = text
      .replace(/^Saya adalah\b/i, 'Muhammad Zulva Navis merupakan')
      .replace(/^Saya merupakan\b/i, 'Muhammad Zulva Navis merupakan')
      .replace(/^Saya\b/i, 'Muhammad Zulva Navis')
      .replace(/([.!?]\s+)Saya\b/g, '$1Ia')
      .replace(/\bsaya\b/gi, 'ia')
      .replace(/^Aku\b/i, 'Muhammad Zulva Navis')
      .replace(/\baku\b/gi, 'ia');

    const protectedText = text
      .replace(/\b(Ms|Mr|Mrs|Dr|Prof|Aug|Jul|Okt|Des|Jan|Feb|Mar|Apr|Jun|Sep|Sept|Nov|Dec)\./gi, '$1\uE000')
      .replace(/\b(digitalagency|efarmuntukindonesia)\.web\.id/gi, '$1\uE001web\uE001id');
    const sentences = (protectedText.match(/[^.!?]+(?:[.!?]+["')\]]*|$)/g) || [protectedText])
      .map(sentence => normalizeText(sentence.replace(/\uE000/g, '.').replace(/\uE001/g, '.')))
      .filter(Boolean);
    const paragraphs = [];
    for (let index = 0; index < sentences.length; index += 2) paragraphs.push(sentences.slice(index, index + 2).join(' '));

    const introductions = {
      education: 'Pendidikan yang tercantum dalam CV Muhammad Zulva Navis meliputi:',
      projects: 'CV Muhammad Zulva Navis mencatat informasi proyek akademik berikut:',
      experience: 'Pengalaman kerja yang tercantum dalam CV Muhammad Zulva Navis meliputi:',
      organization: 'CV Muhammad Zulva Navis mencatat pengalaman organisasi berikut:',
      skills: 'CV Muhammad Zulva Navis mencantumkan kompetensi dan sertifikat berikut:'
    };
    const introduction = route.id === 'summary' ? '' : `${introductions[route.id]}\n\n`;
    return `### ${route.title}\n\n${introduction}${paragraphs.join('\n\n')}`;
  }  function appendInlineMarkdown(parent, text) {
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
      console.error('Ask AI could not load or read the CV PDF.', error);
      appendMessage('assistant', 'CV belum dapat dimuat atau dibaca saat ini. Silakan coba lagi nanti.');
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
