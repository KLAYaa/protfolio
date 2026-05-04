const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

navToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
}

document.addEventListener('click', (e) => {
  if (!mobileMenu.contains(e.target) && !navToggle.contains(e.target)) {
    mobileMenu.classList.remove('open');
  }
});
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const duration = 1800;
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsEl = document.querySelector('.about-stats');
if (statsEl) counterObserver.observe(statsEl);
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach((bar, i) => {
        setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, i * 80);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
async function loadAbout() {
  try {
    const res = await fetch('/api/about');
    const d = await res.json();
    document.title = `${d.name} — ${d.title}`;
    const initials = d.name.split(' ').map(w => w[0]).join('').toUpperCase();
    document.querySelectorAll('.nav-logo, .footer-logo').forEach(el => el.textContent = initials);
    const heroBio = document.getElementById('heroBio');
    if (heroBio) heroBio.textContent = d.bio;const resumeBtn = document.getElementById('resumeBtn');
    if (resumeBtn) {
      if (d.has_resume) {
        resumeBtn.href = '/resume';
        resumeBtn.style.display = 'inline-flex';
      } else {
        resumeBtn.style.display = 'none';
      }
    }
    const aboutName = document.getElementById('aboutName');
    if (aboutName) aboutName.innerHTML = `${d.name.split(' ')[0]}'s <em>Story</em>`;

    const aboutBio = document.getElementById('aboutBio');
    if (aboutBio) aboutBio.textContent = d.bio;

    const aboutEdu = document.getElementById('aboutEdu');
    if (aboutEdu) aboutEdu.innerHTML = `
      <span class="edu-icon">🎓</span>
      <span><strong>${d.degree}</strong><br>${d.college} · ${d.grad_year}${d.cgpa ? ' · CGPA ' + d.cgpa : ''}</span>
    `;

    const aboutLocation = document.getElementById('aboutLocation');
    if (aboutLocation) aboutLocation.innerHTML = `📍 ${d.location} &nbsp;|&nbsp; ✉️ <a href="mailto:${d.email}">${d.email}</a>`;
    document.querySelectorAll('.stat-num').forEach(el => {
      const key = el.dataset.key;
      if (key && d.stats[key] !== undefined) {
        el.dataset.count = d.stats[key];
      }
    });
    if (d.github)   document.querySelectorAll('a.social-github').forEach(a => { a.href = d.github; a.style.display = ''; });
    if (d.linkedin) document.querySelectorAll('a.social-linkedin').forEach(a => { a.href = d.linkedin; a.style.display = ''; });
    if (d.twitter)  document.querySelectorAll('a.social-twitter').forEach(a => { a.href = d.twitter; a.style.display = ''; });

    // SVG photo placeholder
    const photoText = document.getElementById('photoInitials');
    if (photoText) photoText.textContent = initials;
    const footerName = document.getElementById('footerName');
    if (footerName) footerName.textContent = `© 2025 ${d.name}. All rights reserved.`;

  } catch (err) {
    console.error('Could not load about:', err);
  }
}
async function loadProjects() {
  const grid = document.getElementById('projectsGrid');
  try {
    const res = await fetch('/api/projects');
    const data = await res.json();
    grid.innerHTML = '';
    data.projects.forEach(p => {
      const card = document.createElement('div');
      card.className = 'project-card reveal';
      card.innerHTML = `
        <div class="project-thumb" style="background:${p.color}">
          ${p.emoji}
          <div class="project-overlay">View Project ↗</div>
          <p class="project-desc">${p.description}</p>
          ${p.link && p.link !== '#'
            ? `<a href="${p.link}" class="project-link" target="_blank">View on GitHub →</a>`
            : ``}
        </div>
        </div>
        <div class="project-info">
          <div class="project-tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
          <h3 class="project-title">${p.title}</h3>
          <p class="project-desc">${p.description}</p>
          ${p.link && p.link !== '#'
            ? `<a href="${p.link}" class="project-link" target="_blank">View on GitHub →</a>`
            : `<span class="project-link" style="opacity:0.4;cursor:default">Coming Soon</span>`}
        </div>
      `;
      grid.appendChild(card);
    });
    grid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  } catch (err) {
    grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px;grid-column:1/-1">Could not load projects.</p>';
  }
}
async function loadSkills() {
  const container = document.getElementById('skillsContainer');
  try {
    const res = await fetch('/api/skills');
    const data = await res.json();
    container.innerHTML = '';
    data.skills.forEach(s => {
      const item = document.createElement('div');
      item.className = 'skill-item';
      item.innerHTML = `
        <span class="skill-icon">${s.icon}</span>
        <div class="skill-name">${s.name}</div>
        <div class="skill-bar"><div class="skill-fill" data-width="${s.level}"></div></div>
        <div class="skill-level">${s.label} · ${s.level}%</div>
      `;
      container.appendChild(item);
    });
    skillObserver.observe(container);
  } catch (err) {
    container.innerHTML = '<p style="color:var(--text-muted)">Could not load skills.</p>';
  }
}
async function loadCertifications() {
  const container = document.getElementById('certsContainer');
  if (!container) return;
  try {
    const res = await fetch('/api/certifications');
    const data = await res.json();
    if (!data.certifications.length) {
      container.closest('.certs-section') && (container.closest('.certs-section').style.display = 'none');
      return;
    }
    container.innerHTML = data.certifications.map(c => `
      <div class="cert-item reveal">
        <span class="cert-icon">🏅</span>
        <div class="cert-info">
          <div class="cert-name">${c.name}</div>
          <div class="cert-meta">${c.issuer} · ${c.year}</div>
        </div>
      </div>
    `).join('');
    container.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  } catch (err) { /* silent */ }
}
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('.btn-primary');
  const btnText = btn.querySelector('.btn-text');
  btnText.textContent = 'Sending...';
  btn.disabled = true;

  const body = Object.fromEntries(new FormData(contactForm).entries());

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    formStatus.className = 'form-status success';
    formStatus.textContent = data.message || '✓ Message sent! I\'ll get back to you soon.';
    contactForm.reset();
  } catch (err) {
    formStatus.className = 'form-status error';
    formStatus.textContent = '✗ Something went wrong. Please try again.';
  } finally {
    btnText.textContent = 'Send Message';
    btn.disabled = false;
    setTimeout(() => { formStatus.className = 'form-status'; }, 6000);
  }
});
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.style.color = '');
      const link = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (link) link.style.color = 'var(--gold)';
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => activeObserver.observe(s));
if (window.innerWidth > 900) {
  const cursor = document.createElement('div');
  cursor.style.cssText = `position:fixed;width:8px;height:8px;background:var(--gold);border-radius:50%;pointer-events:none;z-index:9999;transition:transform 0.15s;mix-blend-mode:difference;transform:translate(-50%,-50%);`;
  document.body.appendChild(cursor);

  const ring = document.createElement('div');
  ring.style.cssText = `position:fixed;width:32px;height:32px;border:1px solid rgba(201,169,110,0.4);border-radius:50%;pointer-events:none;z-index:9998;transition:transform 0.4s cubic-bezier(0.23,1,0.32,1),width 0.3s,height 0.3s;transform:translate(-50%,-50%);`;
  document.body.appendChild(ring);

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
    ring.style.left   = e.clientX + 'px';
    ring.style.top    = e.clientY + 'px';
  });

  document.querySelectorAll('a, button, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => { ring.style.width = '56px'; ring.style.height = '56px'; });
    el.addEventListener('mouseleave', () => { ring.style.width = '32px'; ring.style.height = '32px'; });
  });
}
loadAbout();
loadProjects();
loadSkills();
loadCertifications();
