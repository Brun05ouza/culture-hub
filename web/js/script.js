// /web/js/script.js

// ------- util -------
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

async function apiGetEventos() {
  try {
    const r = await fetch("/api/eventos");
    if (!r.ok) throw new Error('API não disponível');
    return r.json();
  } catch (error) {
    console.warn('API não disponível, usando dados mock:', error.message);
    // Retornar dados mock quando a API não estiver disponível
    return [
      {
        id: 1,
        tituloEvento: "Festival de Música",
        descricao: "Evento de música com diversas atrações",
        categoria: "Musica",
        dataInicio: new Date().toISOString(),
        dataFim: new Date().toISOString(),
        localizacao: "Centro Cultural",
        preco: 50.0,
        disponibilidade: "Disponivel"
      }
    ];
  }
}
async function apiPostEvento(payload) {
  try {
    const r = await fetch("/api/eventos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error("Falha ao criar evento");
    return r.json();
  } catch (error) {
    console.warn('API não disponível para criar evento:', error.message);
    // Simular criação de evento quando API não estiver disponível
    return { ...payload, id: Date.now(), status: 'mock' };
  }
}

// ------- “olho” da senha (login/cadastro) -------
function setupPasswordToggles() {
  $$(".pw-toggle").forEach((btn) => {
    const targetId = btn.getAttribute("data-target");
    const input =
      targetId ? document.getElementById(targetId) : btn.previousElementSibling;
    if (!input) return;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const isPwd = input.type === "password";
      input.type = isPwd ? "text" : "password";
      btn.setAttribute("aria-pressed", String(isPwd));
      btn.innerHTML = isPwd
        ? '<i data-lucide="eye-off"></i>'
        : '<i data-lucide="eye"></i>';
      // re-render ícones lucide se estiver carregado
      if (window.lucide) window.lucide.createIcons();
    });
  });
}

// ------- botão “Continuar como convidado” (login) -------
function setupGuestLogin() {
  const btn = $("#guestLogin");
  if (btn) {
    btn.addEventListener("click", () => {
      window.location.href = "/telaPrincipal.html";
    });
  }
}

// ------- criarEventos.html -------
function setupCriarEventos() {
  const form = $("#promoMedia") ? $("form") : null; // página tem input #promoMedia
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      eventTitle: $("#eventTitle").value.trim(),
      eventDescription: $("#eventDescription").value.trim(),
      eventCategory: $("#eventCategory").value,
      startDate: $("#startDate").value, // yyyy-mm-ddThh:mm
      endDate: $("#endDate").value || $("#startDate").value,
      eventLocation: $("#eventLocation").value.trim(),
      ticketPrice: $("#ticketPrice").value || 0,
      ticketAvailability: $("#ticketAvailability").value || 0,
    };
    try {
      await apiPostEvento(payload);
      alert("Evento criado!");
      window.location.href = "/telaCalendario.html";
    } catch (err) {
      alert("Erro ao criar: " + err.message);
    }
  });
}

// ------- telaCalendario.html -------
async function setupCalendario() {
  const form = $("#addEventForm");
  const list = $("#eventsList");
  if (!form || !list) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      eventName: $("#eventName").value.trim(),
      eventDate: $("#eventDate").value, // yyyy-mm-dd
      eventTime: $("#eventTime").value, // hh:mm
      eventLocation: $("#eventLocation").value.trim(),
      eventDescription: $("#eventDescription").value.trim(),
    };
    try {
      await apiPostEvento(payload);
      form.reset();
      await renderEventos(list);
    } catch (err) {
      alert("Erro ao registrar: " + err.message);
    }
  });

  // filtro simples por data (botão chama filterEventsByDate() no HTML)
  window.filterEventsByDate = async () => {
    await renderEventos(list, $("#eventDateSearch").value);
  };

  await renderEventos(list);
}

async function renderEventos(container, dateFilter = "") {
  const data = await apiGetEventos();
  container.innerHTML = "";
  const items = data.filter((e) =>
    dateFilter ? String(e.dataInicio).startsWith(dateFilter) : true
  );
  if (!items.length) {
    container.innerHTML =
      '<p class="text-gray-500 text-center col-span-full">Sem eventos.</p>';
    return;
  }
  for (const ev of items) {
    const card = document.createElement("article");
    card.className =
      "bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm";
    card.innerHTML = `
      <div class="p-4">
        <h3 class="font-semibold text-lg text-gray-900">${ev.tituloEvento}</h3>
        <p class="text-sm text-gray-500">
          ${formatDateTime(ev.dataInicio)} • ${ev.localizacao || ""}
        </p>
        <p class="text-sm text-gray-600 mt-2">${ev.descricao || ""}</p>
        <span class="badge ${ev.disponibilidade === "Disponivel" ? "badge-success" : "badge-danger"}">
          ${ev.disponibilidade || "—"}
        </span>
      </div>`;
    container.appendChild(card);
  }
}
function formatDateTime(dt) {
  const d = new Date(dt);
  if (isNaN(d)) return dt;
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

// ------- meusEventos.html (opcional: listar no grid exemplo) -------
async function setupMeusEventos() {
  const created = $("#createdEventsList");
  const registered = $("#registeredEventsList");
  if (!created && !registered) return;
  const data = await apiGetEventos();
  if (created) {
    created.innerHTML = data
      .map(
        (ev) => `
      <div class="event-card">
        <img src="https://placehold.co/400x200/E5E7EB/4B5563?text=${encodeURIComponent(
          ev.categoria || "Evento"
        )}" class="w-full h-40 object-cover rounded-t-lg" alt="">
        <div class="p-4">
          <h3 class="text-lg font-semibold mb-1">${ev.tituloEvento}</h3>
          <p class="text-sm text-gray-500 mb-2">${formatDateTime(
            ev.dataInicio
          )}</p>
          <span class="badge badge-success">${
            ev.disponibilidade || "—"
          }</span>
        </div>
      </div>`
      )
      .join("");
  }
}

// ------- Verificação de login para páginas protegidas -------
function setupAuthCheck() {
  const protectedLinks = $$('a[href="meusEventos.html"], a[href="telaPerfil.html"]');
  protectedLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const user = localStorage.getItem('user');
      const isGuest = localStorage.getItem('isGuest');
      if (!user || isGuest === 'true') {
        e.preventDefault();
        showLoginModal();
      }
    });
  });
}

function showLoginModal() {
  const modal = document.createElement('div');
  modal.className = 'login-modal';
  modal.innerHTML = `
    <div class="login-modal-content">
      <div style="margin-bottom: 1rem;">
        <i data-lucide="lock" style="width: 3rem; height: 3rem; color: #3b82f6; margin: 0 auto;"></i>
      </div>
      <h3>Login Necessário</h3>
      <p>Você precisa fazer login para acessar seus eventos e gerenciar suas atividades.</p>
      <div class="login-modal-buttons">
        <button class="login-modal-secondary" onclick="closeLoginModal()">Cancelar</button>
        <button class="login-modal-primary" onclick="goToLogin()">Fazer Login</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add('show'), 10);
  
  if (window.lucide) window.lucide.createIcons();
}

function closeLoginModal() {
  const modal = $('.login-modal');
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => modal.remove(), 300);
  }
}

function goToLogin() {
  window.location.href = '/login.html';
}

// Tornar funções globais
window.closeLoginModal = closeLoginModal;
window.goToLogin = goToLogin;

// ------- Atualizar interface baseada no login -------
function updateHeaderAuth() {
  const user = localStorage.getItem('user');
  const isGuest = localStorage.getItem('isGuest');
  const headerAuth = $('.header-auth');
  
  if (headerAuth && user && isGuest !== 'true') {
    const userData = JSON.parse(user);
    headerAuth.innerHTML = `
      <div class="flex items-center space-x-3">
        <span class="text-sm text-gray-600">Olá, ${userData.name}</span>
        <div class="relative">
          <img src="${userData.picture}" alt="Perfil" class="w-8 h-8 rounded-full cursor-pointer" onclick="toggleProfileMenu()">
          <div id="profileMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border hidden">
            <a href="telaPerfil.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Meu Perfil</a>
            <a href="meusEventos.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Meus Eventos</a>
            <hr class="my-1">
            <button onclick="logout()" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">Sair</button>
          </div>
        </div>
      </div>
    `;
  }
}

function toggleProfileMenu() {
  const menu = $('#profileMenu');
  if (menu) {
    menu.classList.toggle('hidden');
  }
}

function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('isGuest');
  window.location.href = '/telaPrincipal.html';
}

// Tornar funções globais
window.toggleProfileMenu = toggleProfileMenu;
window.logout = logout;

// ------- Header melhorado -------
function setupEnhancedHeader() {
  // Efeito de scroll no header
  let lastScrollY = window.scrollY;
  
  window.addEventListener('scroll', () => {
    const header = $('header');
    if (!header) return;
    
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScrollY = window.scrollY;
  });
}

// Menu mobile
function toggleMobileMenu() {
  const menu = $('#mobileMenu');
  const hamburger = $('.hamburger');
  
  if (menu && hamburger) {
    menu.classList.toggle('show');
    hamburger.classList.toggle('active');
  }
}

// Tornar função global
window.toggleMobileMenu = toggleMobileMenu;

// ------- Destacar link ativo no header -------
function highlightActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'telaPrincipal.html';
  const navLinks = $$('nav a[href]');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'telaPrincipal.html')) {
      link.classList.add('text-blue-600');
      link.classList.remove('text-gray-600');
    } else {
      link.classList.remove('text-blue-600');
      link.classList.add('text-gray-600');
    }
  });
}

// ------- Google Sign-In -------
function setupGoogleAuth() {
  const loginBtn = $("#googleLogin");
  const registerBtn = $("#googleRegister");
  
  if (loginBtn) {
    loginBtn.addEventListener("click", handleGoogleSignIn);
  }
  if (registerBtn) {
    registerBtn.addEventListener("click", handleGoogleSignIn);
  }
}

function handleGoogleSignIn() {
  if (typeof google !== 'undefined' && google.accounts) {
    google.accounts.id.initialize({
      client_id: "898450253699-201vqp5l08n6ee9qniu7nhv3n8ng3o56.apps.googleusercontent.com",
      callback: handleGoogleResponse
    });
    google.accounts.id.prompt();
  } else {
    alert('Google Sign-In não está disponível');
  }
}

function handleGoogleResponse(response) {
  try {
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    const userData = {
      name: payload.name,
      email: payload.email,
      picture: payload.picture
    };
    localStorage.setItem('user', JSON.stringify(userData));
    window.location.href = "/telaPrincipal.html";
  } catch (error) {
    console.error('Erro no login Google:', error);
    alert('Erro ao fazer login com Google');
  }
}

// ------- Notificações Toast -------
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}"></i>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();
  
  setTimeout(() => toast.classList.add('show'), 100);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ------- Lazy Loading de Imagens -------
function setupLazyLoading() {
  const images = $$('img[loading="lazy"]');
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          img.classList.remove('skeleton');
          imageObserver.unobserve(img);
        }
      });
    });
    images.forEach(img => {
      img.classList.add('skeleton');
      imageObserver.observe(img);
    });
  }
}

// ------- Pesquisa de Eventos -------
function setupSearch() {
  const searchInput = $('input[placeholder*="Pesquisar"]');
  if (!searchInput) return;
  
  let searchTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const query = e.target.value.toLowerCase().trim();
      filterEventsBySearch(query);
    }, 300);
  });
}

function filterEventsBySearch(query) {
  const eventCards = $$('.event-card');
  eventCards.forEach(card => {
    const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
    const description = card.querySelector('p')?.textContent.toLowerCase() || '';
    const matches = title.includes(query) || description.includes(query);
    card.style.display = matches || !query ? '' : 'none';
  });
}

// ------- Melhorar Acessibilidade -------
function setupAccessibility() {
  // Adicionar ARIA labels
  $$('.category-card').forEach(card => {
    if (!card.getAttribute('aria-label')) {
      const text = card.querySelector('span:last-child')?.textContent;
      if (text) card.setAttribute('aria-label', `Categoria ${text}`);
    }
  });
  
  // Melhorar navegação por teclado
  $$('.chip, .category-card').forEach(element => {
    if (!element.getAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
    
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        element.click();
      }
    });
  });
}

// Tornar função global
window.showToast = showToast;

// ------- Animações de fade -------
function setupFadeAnimations() {
  // Fade-in para elementos com classe fade-in
  const fadeElements = $$('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  
  fadeElements.forEach(el => observer.observe(el));
  
  // Auto-aplicar fade-in em elementos principais
  $$('main > *, section, .event-card, .category-card, .form-group').forEach(el => {
    if (!el.classList.contains('fade-in')) {
      el.classList.add('fade-in');
      observer.observe(el);
    }
  });
}

// ------- boot -------
document.addEventListener("DOMContentLoaded", () => {
  setupPasswordToggles();  // login/cadastro (pw-toggle está no HTML)
  setupGuestLogin();       // botão de convidado (id="guestLogin")
  setupGoogleAuth();       // Google Sign-In
  setupAuthCheck();        // Verificação de login para Meus Eventos
  updateHeaderAuth();      // Atualizar interface do header
  setupEnhancedHeader();   // Header melhorado
  highlightActiveNavLink(); // Destacar link ativo
  setupCriarEventos();     // criarEventos.html
  setupCalendario();       // telaCalendario.html
  setupMeusEventos();      // meusEventos.html
  setupLazyLoading();      // Lazy loading de imagens
  setupSearch();           // Pesquisa de eventos
  setupAccessibility();    // Melhorias de acessibilidade
  setupFadeAnimations();   // Animações de fade
});
