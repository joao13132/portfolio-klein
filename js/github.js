// js/github.js — Integração com GitHub API

const GITHUB_USER = 'joao13132';
const GITHUB_API = `https://api.github.com/users/${GITHUB_USER}`;

// Ícones por linguagem
const LANG_ICONS = {
  'JavaScript': '⚡',
  'Python': '🐍',
  'HTML': '🌐',
  'CSS': '🎨',
  'PHP': '🐘',
  'TypeScript': '💙',
  'Java': '☕',
  'C++': '⚙️',
  'Shell': '💻',
  null: '📁'
};

async function carregarProjetos() {
  const carousel = document.getElementById('carousel');

  try {
    // busca repositórios públicos
    const res = await fetch(`${GITHUB_API}/repos?sort=updated&per_page=12&type=public`);
    const repos = await res.json();

    // busca dados do usuário para as stats
    const userRes = await fetch(GITHUB_API);
    const user = await userRes.json();

    // atualiza stats do hero
    const totalStars = repos.reduce((acc, r) => acc + r.stargazers_count, 0);
    animarNumero('statRepos', user.public_repos || repos.length);
    animarNumero('statStars', totalStars);

    // limpa loading
    carousel.innerHTML = '';

    // cria os cards
    repos.forEach((repo, i) => {
      const card = criarCard(repo, i);
      carousel.appendChild(card);
    });

    // cria dots de navegação
    criarDots(repos.length);

  } catch (err) {
    console.error('Erro ao carregar GitHub:', err);
    carousel.innerHTML = `
      <div style="color: var(--text2); font-family: var(--mono); font-size: 14px; padding: 40px;">
        ⚠️ Não foi possível carregar os projetos. Verifique sua conexão.
      </div>
    `;
  }
}

function criarCard(repo, index) {
  const card = document.createElement('div');
  card.className = 'project-card';
  card.style.animationDelay = `${index * 0.05}s`;

  const icon = LANG_ICONS[repo.language] || '📁';
  const desc = repo.description || 'Sem descrição disponível.';
  const lang = repo.language || 'Outros';
  const updated = new Date(repo.updated_at).toLocaleDateString('pt-BR');

  card.innerHTML = `
    <div class="project-card-header">
      <div class="project-icon">${icon}</div>
      <div class="project-stars">⭐ ${repo.stargazers_count}</div>
    </div>
    <div class="project-name">${repo.name}</div>
    <div class="project-desc">${desc}</div>
    <div class="project-footer">
      <span class="project-lang">${lang}</span>
      <a href="${repo.html_url}" target="_blank" class="project-link">
        Ver no GitHub →
      </a>
    </div>
  `;

  card.addEventListener('click', (e) => {
    if (!e.target.closest('.project-link')) {
      window.open(repo.html_url, '_blank');
    }
  });

  return card;
}

function criarDots(total) {
  const dotsEl = document.getElementById('carouselDots');
  dotsEl.innerHTML = '';
  const visible = Math.min(total, 8);

  for (let i = 0; i < visible; i++) {
    const dot = document.createElement('div');
    dot.className = `dot ${i === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => scrollParaCard(i));
    dotsEl.appendChild(dot);
  }
}

function scrollParaCard(index) {
  const carousel = document.getElementById('carousel');
  const card = carousel.children[index];
  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    atualizarDots(index);
  }
}

function atualizarDots(index) {
  document.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === index);
  });
}

function animarNumero(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let current = 0;
  const step = Math.ceil(target / 30);
  const interval = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(interval);
  }, 50);
}

// Navegação dos botões
document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.getElementById('carousel');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  prevBtn?.addEventListener('click', () => {
    carousel.scrollBy({ left: -330, behavior: 'smooth' });
    console.log('prev clicado');
  });

  nextBtn?.addEventListener('click', () => {
    carousel.scrollBy({ left: 330, behavior: 'smooth' });
    console.log('next clicado');
  });

  carousel?.addEventListener('scroll', () => {
    const cardWidth = 324;
    const index = Math.round(carousel.scrollLeft / cardWidth);
    atualizarDots(index);
  });

  carregarProjetos();
});
