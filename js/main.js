// js/main.js — Lógica principal do portfólio

// ---- LOADER ----
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  const fill = document.getElementById('loaderFill');
  const sub = document.getElementById('loaderSub');

  const msgs = [
    'Carregando projetos...',
    'Conectando ao GitHub...',
    'Inicializando portfólio...',
    'Bem-vindo!'
  ];

  let progress = 0;
  let msgIndex = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18 + 5;
    if (progress > 100) progress = 100;

    fill.style.width = progress + '%';

    if (progress > msgIndex * 30 && msgIndex < msgs.length) {
      sub.textContent = msgs[msgIndex];
      msgIndex++;
    }

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
      }, 400);
    }
  }, 80);
});

// ---- CURSOR ----
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

// trail suave
function animateTrail() {
  trailX += (mouseX - trailX) * 0.15;
  trailY += (mouseY - trailY) * 0.15;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top = trailY + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

// efeito hover em links
document.querySelectorAll('a, button, .project-card, .skill-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '16px';
    cursor.style.height = '16px';
    cursorTrail.style.width = '48px';
    cursorTrail.style.height = '48px';
    cursorTrail.style.borderColor = 'rgba(99,102,241,0.6)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '10px';
    cursor.style.height = '10px';
    cursorTrail.style.width = '32px';
    cursorTrail.style.height = '32px';
    cursorTrail.style.borderColor = 'rgba(99,102,241,0.4)';
  });
});

// ---- NAV SCROLL ----
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ---- SKILL BARS (Intersection Observer) ----
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        const w = bar.getAttribute('data-w');
        bar.style.width = w + '%';
      });
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skills-grid').forEach(el => observer.observe(el));

// ---- FADE IN SECTIONS ----
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.sobre-grid, .section-title, .contato-grid').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity .7s ease, transform .7s ease';
  fadeObserver.observe(el);
});

// ---- FORMULÁRIO DE CONTATO ----
document.getElementById('contatoForm')?.addEventListener('submit', (e) => {
  e.preventDefault();

  const nome  = document.getElementById('formNome').value.trim();
  const email = document.getElementById('formEmail').value.trim();
  const msg   = document.getElementById('formMsg').value.trim();
  const status = document.getElementById('formStatus');

  if (!nome || !email || !msg) {
    status.textContent = '⚠️ Preencha todos os campos.';
    status.style.color = '#f87171';
    return;
  }

  // salva no localStorage
  const mensagens = JSON.parse(localStorage.getItem('contatos') || '[]');
  mensagens.push({ nome, email, msg, data: new Date().toISOString() });
  localStorage.setItem('contatos', JSON.stringify(mensagens));

  status.textContent = '✓ Mensagem enviada! Entrarei em contato em breve.';
  status.style.color = 'var(--accent)';
  e.target.reset();

  setTimeout(() => { status.textContent = ''; }, 5000);
});

// ---- SCROLL SUAVE PARA LINKS ----
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
