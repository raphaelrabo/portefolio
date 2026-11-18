/* =========================
   script.js
   ========================= */

// Projects filter
const buttons = document.querySelectorAll('.filter-btn');
const projects = document.querySelectorAll('.project');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const category = button.getAttribute('data-filter');

    projects.forEach(project => {
      const cat = project.getAttribute('data-category');
      project.style.display = (category === 'all' || cat === category) ? 'block' : 'none';
    });
  });
});

// Active nav on scroll (includes hero)
const navLinks = document.querySelectorAll('nav a[data-nav]');
const sections = ['hero','about','projects','experience','contact']
  .map(id => document.getElementById(id))
  .filter(Boolean);

const setActive = (id) => {
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('data-nav') === id));
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) setActive(entry.target.id);
  });
}, { root: null, threshold: 0.35 });

sections.forEach(sec => observer.observe(sec));

// Scroll progress bar
const progress = document.getElementById('progress');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  progress.style.width = scrolled + '%';
});

// Tilt effect (lightweight)
const tilts = document.querySelectorAll('.tilt');
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

tilts.forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const rx = clamp((0.5 - y) * 8, -8, 8);
    const ry = clamp((x - 0.5) * 10, -10, 10);
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
  });

  el.addEventListener('mouseleave', () => {
    el.style.transform = 'none';
  });
});

// Fill hover preview images from data-preview
document.querySelectorAll('.project').forEach(card => {
  const preview = card.getAttribute('data-preview');
  const img = card.querySelector('.project-preview img');
  if (preview && img) {
    img.src = preview;
    img.alt = 'Aperçu du projet';
  }
});

// Modal projects (image + long desc)
const modal = document.getElementById('modal');
const closeBtn = modal?.querySelector('.modal-close');
const backdrop = modal?.querySelector('.modal-backdrop');

const mt = document.getElementById('modal-title');
const md = document.getElementById('modal-desc');
const mtags = document.getElementById('modal-tags');
const mlink = document.getElementById('modal-link');

const media = document.getElementById('modal-media');
const mimg = document.getElementById('modal-img');

document.querySelectorAll('.project').forEach(card => {
  card.style.cursor = 'pointer';

  card.addEventListener('click', (e) => {
    if (e.target.closest('a')) return;

    const title = card.querySelector('h3')?.textContent?.trim() || 'Projet';
    const desc = (card.getAttribute('data-long') || card.querySelector('p')?.textContent || '').trim();
    const tags = Array.from(card.querySelectorAll('.tag')).map(t => t.textContent.trim());
    const repo = card.querySelector('a.chip, a.project-link')?.getAttribute('href') || '#';
    const preview = card.getAttribute('data-preview') || '';

    mt.textContent = title;
    md.textContent = desc;
    mtags.innerHTML = tags.map(t => `<span class="tag">${t}</span>`).join('');
    mlink.style.display = repo === '#' ? 'none' : 'inline-flex';
    mlink.href = repo;

    if (preview) {
      media.style.display = 'block';
      mimg.src = preview;
      mimg.alt = title + ' aperçu';
    } else {
      media.style.display = 'none';
      mimg.src = '';
      mimg.alt = '';
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  });
});

const closeModal = () => {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
};

closeBtn?.addEventListener('click', closeModal);
backdrop?.addEventListener('click', closeModal);
window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal?.classList.contains('open')) closeModal(); });

// Typing code animation (C snippet)
const codeEl = document.getElementById('code-typing');

const cCode =
`<span class="cm">/* Bomberman — réseau (extrait) */</span>
<span class="kw">#include</span> <span class="st">&lt;stdio.h&gt;</span>
<span class="kw">#include</span> <span class="st">&lt;string.h&gt;</span>

<span class="kw">typedef</span> <span class="kw">struct</span> {
  <span class="kw">int</span> player_id;
  <span class="kw">int</span> x, y;
  <span class="kw">int</span> action; <span class="cm">/* MOVE, BOMB, ... */</span>
} packet_t;

<span class="kw">static</span> <span class="kw">int</span> <span class="fn">send_packet</span>(<span class="kw">int</span> fd, <span class="kw">const</span> packet_t* p) {
  <span class="kw">return</span> (<span class="kw">int</span>)write(fd, p, <span class="kw">sizeof</span>(packet_t));
}

<span class="kw">void</span> <span class="fn">handle_tick</span>(packet_t* state) {
  <span class="cm">/* update loop: collisions, bombs, sync */</span>
  state-&gt;x += <span class="num">1</span>;
}`;

function typeHTML(el, html, speed = 9){
  let i = 0;
  el.innerHTML = "";
  const timer = setInterval(() => {
    i++;
    el.innerHTML = html.slice(0, i);
    if (i >= html.length) clearInterval(timer);
  }, speed);
  return timer;
}

if (codeEl){
  const run = () => typeHTML(codeEl, cCode, 7);
  run();
  setInterval(run, 17000);
}
