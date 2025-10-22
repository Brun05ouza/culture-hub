// script.js  (carregue com <script type="module">)

// -----------------------------
// 1) Firebase Imports
// -----------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInWithCustomToken, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { setLogLevel } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Ativar logs do Firestore (debug)
setLogLevel("debug");

// -----------------------------
// 2) Config e estado global
// -----------------------------
const firebaseConfig = JSON.parse(typeof __firebase_config !== "undefined" ? __firebase_config : "{}");
const appId          = typeof __app_id !== "undefined" ? __app_id : "default-app-id";
const initialAuthToken = typeof __initial_auth_token !== "undefined" ? __initial_auth_token : null;

let db, auth, userId;
let _cachedEvents = [];

// -----------------------------
// 3) Helpers DOM
// -----------------------------
const $    = (sel, root=document) => root.querySelector(sel);
const $all = (sel, root=document) => [...root.querySelectorAll(sel)];

// run when DOM is ready (mesmo se já estiver pronto)
function onReady(fn){
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
  else fn();
}

// -----------------------------
// 4) Firebase + Realtime
// -----------------------------
async function initializeFirebase() {
  try {
    const app = initializeApp(firebaseConfig);
    db   = getFirestore(app);
    auth = getAuth(app);

    if (initialAuthToken) await signInWithCustomToken(auth, initialAuthToken);
    else                  await signInAnonymously(auth);

    userId = auth.currentUser?.uid;
    console.log("Firebase inicializado. UID:", userId);

    // mostra userId se houver o elemento na página
    const userIdEl = $("#userIdDisplay");
    if (userIdEl && userId) userIdEl.innerText = `ID do Usuário: ${userId}`;

    setupRealtimeListener();
  } catch (error) {
    console.error("Erro ao inicializar Firebase/autenticar:", error);
  }
}

function setupRealtimeListener() {
  // só ativa o listener se a página tiver a lista de eventos
  const listEl = $("#eventsList");
  if (!listEl || !db || !userId) return;

  const userEventsCollection = collection(db, `artifacts/${appId}/users/${userId}/events`);
  onSnapshot(userEventsCollection, (snapshot) => {
    const events = [];
    snapshot.forEach((doc) => events.push({ id: doc.id, ...doc.data() }));
    _cachedEvents = events;
    renderEvents(events);
  }, (error) => console.error("Erro tempo real:", error));
}

function renderEvents(events = []) {
  const eventsContainer = $("#eventsList");
  if (!eventsContainer) return;

  eventsContainer.innerHTML = "";

  if (!events.length) {
    eventsContainer.innerHTML = '<p class="text-center text-gray-500">Nenhum evento encontrado.</p>';
    return;
  }

  // ordena por data (se possível)
  const safeParsed = (d) => isNaN(new Date(d)) ? null : new Date(d);
  events
    .slice()
    .sort((a,b)=>{
      const da = safeParsed(a.date), dbb = safeParsed(b.date);
      if (da && dbb) return da - dbb;
      if (da) return -1;
      if (dbb) return 1;
      return 0;
    })
    .forEach(event => {
      const when = safeParsed(event.date) ? new Date(event.date).toLocaleDateString() : (event.date || "");
      const time = event.time ? ` - ${event.time}` : "";

      const card = document.createElement("div");
      card.className = "event-card animate-in";
      card.setAttribute("data-aos", "fade-up");
      card.innerHTML = `
        <h3 class="font-semibold text-lg text-gray-900">${event.name || "Sem título"}</h3>
        <p class="text-sm text-gray-500 mb-2">${when}${time}</p>
        <p class="text-sm text-gray-600">${event.description || ""}</p>
        <p class="text-sm text-gray-500 mt-2">Local: ${event.location || "-"}</p>
      `;
      eventsContainer.appendChild(card);
    });

  // se AOS existir, refresca para animar novos cards
  if (window.AOS && typeof AOS.refreshHard === "function") AOS.refreshHard();
}

// envio do formulário "Criar Evento"
async function addEvent(e) {
  e.preventDefault();
  if (!db || !userId) return;

  const form = e.target;
  const eventName        = form.eventName?.value?.trim();
  const eventDate        = form.eventDate?.value?.trim();
  const eventTime        = form.eventTime?.value?.trim();
  const eventLocation    = form.eventLocation?.value?.trim();
  const eventDescription = form.eventDescription?.value?.trim();

  try {
    await addDoc(collection(db, `artifacts/${appId}/users/${userId}/events`), {
      name: eventName || "Sem título",
      date: eventDate || "",
      time: eventTime || "",
      location: eventLocation || "",
      description: eventDescription || "",
      createdAt: serverTimestamp(),
    });
    form.reset();
    console.log("Evento adicionado.");
  } catch (e) {
    console.error("Erro ao adicionar evento:", e);
  }
}

// -----------------------------
// 5) UI boot (AOS, Lucide, animações, busca, ícone login)
// -----------------------------
onReady(() => {
  // AOS (se carregado)
  if (window.AOS && typeof AOS.init === "function") {
    AOS.init({ duration: 600, once: true });
  }

  // Lucide (converte ícones existentes)
  if (window.lucide && typeof lucide.createIcons === "function") {
    lucide.createIcons();
  }

  // revelar .animate-in ao entrar na viewport
  const revealIO = new IntersectionObserver((entries)=>{
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("show"); });
  }, { threshold: .1 });
  $all(".animate-in").forEach(el => revealIO.observe(el));

  // sombra no header ao rolar
  const header = document.querySelector("header");
  if (header) {
    const onScroll = () => header.classList.toggle("header-scrolled", window.scrollY > 4);
    onScroll(); window.addEventListener("scroll", onScroll);
  }

  // busca da home (#searchHome -> filtra .event-card pelo <h3>)
  const q = $("#searchHome");
  if (q) {
    const cards = $all(".event-card");
    q.addEventListener("input", () => {
      const term = q.value.toLowerCase();
      cards.forEach(c => {
        const title = c.querySelector("h3")?.textContent.toLowerCase() || "";
        c.style.display = title.includes(term) ? "" : "none";
      });
    });
  }

  // formulário de criação de evento (se existir na página)
  const form = $("#addEventForm");
  if (form) form.addEventListener("submit", addEvent);

  // ícone de login: aponta para o mesmo href do link "Login"
  const loginHref = $(".login-link")?.getAttribute("href") || "login.html";
  let iconLink = $("#loginIconLink");
  if (!iconLink) {
    const container =
      $(".header-auth") ||
      document.querySelector("nav .right, nav .actions, nav") ||
      document.body;

    iconLink = document.createElement("a");
    iconLink.id = "loginIconLink";
    iconLink.className = "icon-link";
    container.appendChild(iconLink);
  }
  iconLink.setAttribute("href", loginHref);

  if (window.lucide && typeof lucide.createIcons === "function") {
    iconLink.innerHTML = '<i data-lucide="user-round"></i>';
    lucide.createIcons(iconLink);
  } else {
    // fallback SVG inline (sem depender de lib)
    iconLink.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true" class="lucide">
        <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2"/>
        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="none" stroke="currentColor" stroke-width="2"/>
      </svg>`;
  }
});

// -----------------------------
// 6) Boot Firebase (após UI ready não é obrigatório;
//    mas rodamos já para listar eventos quando existir a lista)
// -----------------------------
onReady(() => {
  initializeFirebase();
});






(function setupLiveBar(){
  const bar = document.getElementById('liveNowBar');
  const countEl = document.getElementById('liveCount');
  const cards = [...document.querySelectorAll('#featuredEvents .event-card')];
  if (!bar || !cards.length) return;

  const live = cards.filter(c => c.dataset.status === 'ongoing');
  if (!live.length) return;
  countEl.textContent = live.length;
  bar.classList.remove('hidden');
  bar.addEventListener('click', ()=>{
    document.querySelector('#filtersBar .chip[data-filter="status:ongoing"]')?.click();
    bar.scrollIntoView({behavior:'smooth', block:'center'});
  });
})();


 (function enhanceFilters(){
  const bar   = document.getElementById('filtersBar');
  const cards = [...document.querySelectorAll('#featuredEvents .event-card')];
  if (!bar || !cards.length) return;

  // 3.1) contadores por filtro
  const count = {
    'status:*': cards.length,
    'status:ongoing':  cards.filter(c => c.dataset.status === 'ongoing').length,
    'status:upcoming': cards.filter(c => c.dataset.status === 'upcoming').length,
    'status:ended':    cards.filter(c => c.dataset.status === 'ended').length,
  };
  const cats = ['musica','teatro','cinema','arte','comedia','literatura','danca','gastronomia'];
  cats.forEach(cat => count['cat:'+cat] = cards.filter(c => c.dataset.category === cat).length);

  bar.querySelectorAll('.chip').forEach(ch => {
    const key = ch.dataset.filter;
    const n = count[key];
    if (typeof n === 'number') {
      let badge = ch.querySelector('.count');
      if (!badge) { badge = document.createElement('span'); badge.className = 'count'; ch.appendChild(badge); }
      badge.textContent = n;
    }
  });

  // 3.2) clique -> aplica filtro
  let current = 'status:*';
  bar.addEventListener('click', (e)=>{
    const btn = e.target.closest('.chip'); if (!btn) return;

    bar.querySelectorAll('.chip').forEach(c=> c.classList.remove('is-active'));
    btn.classList.add('is-active');
    current = btn.dataset.filter;

    const [type, value] = current.split(':'); // status | cat : value
    cards.forEach(card=>{
      const st  = card.dataset.status;
      const cat = card.dataset.category;
      let show  = true;
      if (type === 'status' && value !== '*') show = (st === value);
      if (type === 'cat') show = (cat === value);
      card.style.display = show ? '' : 'none';
    });
  });
})();


document.addEventListener('DOMContentLoaded', () => {
  // ... aqui wireHomeFilters() e wireLiveNow() ...

  (async () => {
    try {
      const { initializeApp } = await import("https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js");
      const { getAuth, signInWithCustomToken, signInAnonymously } = await import("https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js");
      const { getFirestore, collection, addDoc, onSnapshot, serverTimestamp, setLogLevel } = await import("https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js");
      setLogLevel("debug");
      // ... seu initializeFirebase() aqui ...
    } catch (e) {
      console.warn("Firebase não carregou; UI segue normal.", e);
    }
  })();
});


// ==== Perfil: tabs + listas dinâmicas (Criados / Ingressados / Favoritos) ====
function wireProfileTabs(){
  const tabs = document.getElementById('pfTabs');
  if (!tabs) return;
  tabs.addEventListener('click', (e)=>{
    const btn = e.target.closest('button'); if (!btn) return;
    tabs.querySelectorAll('button').forEach(b=> b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    ['created','joined','favorites'].forEach(t=>{
      document.getElementById(`list-${t}`)?.classList.toggle('hidden', t!==tab);
    });
  });
}
onReady(wireProfileTabs);

// Render card compacto
function mkEventCard(evt){
  const when = evt.date ? new Date(evt.date).toLocaleDateString() : '';
  const img  = evt.bannerUrl || 'https://placehold.co/600x300/E5E7EB/4B5563?text=Evento';
  const el = document.createElement('article');
  el.className = 'event-card';
  el.innerHTML = `
    <img class="event-mini-img" src="${img}" alt="">
    <div class="mt-3">
      <h3 class="font-semibold text-lg text-gray-900">${evt.name || 'Sem título'}</h3>
      <p class="event-meta">${when}${evt.time? ' • '+evt.time:''} • ${evt.location || '-'}</p>
      <p class="text-sm text-gray-600 mt-1 line-clamp-2">${evt.description || ''}</p>
      <div class="mt-2">
        <a href="detalheEventos.html" class="text-blue-600 text-sm font-medium hover:underline">Ver mais</a>
      </div>
    </div>`;
  return el;
}

// Ouve coleções do usuário no Firestore e preenche a UI do perfil
function listenProfileLists(){
  if (!db || !userId) return;
  const base = `artifacts/${appId}/users/${userId}`;
  const lists = [
    {key:'created',   path:`${base}/eventsCreated`,   listId:'list-created',   metricId:'metricCreated',   tabCount:true},
    {key:'joined',    path:`${base}/eventsJoined`,    listId:'list-joined',    metricId:'metricJoined',    tabCount:true},
    {key:'favorites', path:`${base}/favorites`,       listId:'list-favorites', metricId:null,              tabCount:true},
  ];

  lists.forEach(({path, listId, metricId, key, tabCount})=>{
    const colRef = collection(db, path);
    onSnapshot(colRef, (snap)=>{
      const arr = [];
      snap.forEach(d => arr.push({id:d.id, ...d.data()}));

      const listEl = document.getElementById(listId);
      if (listEl){
        listEl.innerHTML = '';
        if (!arr.length){
          listEl.innerHTML = `<p class="text-gray-500">Nada aqui ainda.</p>`;
        } else {
          arr.sort((a,b)=> (a.date||'') < (b.date||'') ? 1 : -1).forEach(evt=>{
            listEl.appendChild(mkEventCard(evt));
          });
        }
      }
      if (metricId){ const m = document.getElementById(metricId); if (m) m.textContent = arr.length; }
      if (tabCount){
        const btn = document.querySelector(`#pfTabs button[data-tab="${key}"] .count`);
        if (btn) btn.textContent = arr.length;
      }
    }, (err)=> console.error('Perfil listener error:', err));
  });
}

// Ativa listeners do perfil se a página tiver os elementos
onReady(()=> {
  if (document.getElementById('pfTabs')) {
    listenProfileLists();
  }
});


// UI extra: força de senha + ícones
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide && typeof lucide.createIcons === 'function') lucide.createIcons();

  const strengthBar = document.getElementById('pwStrengthBar');
  const pw = document.getElementById('regPassword') || document.getElementById('loginPassword');
  if (pw && strengthBar){
    const calc = (v) => {
      let s = 0;
      if (v.length >= 6) s += 25;
      if (/[A-Z]/.test(v)) s += 25;
      if (/[0-9]/.test(v)) s += 25;
      if (/[^A-Za-z0-9]/.test(v)) s += 25;
      return s;
    };
    const update = () => { strengthBar.style.width = calc(pw.value) + '%'; };
    pw.addEventListener('input', update);
    update();
  }
});


// ---- Toggle de senha único (com proteção contra duplicidade) ----
function initPasswordToggles(){
  const hasLucide = !!(window.lucide && window.lucide.icons);

  const setIcon = (btn, open) => {
    const name = open ? 'eye-off' : 'eye';
    if (hasLucide) {
      btn.innerHTML = window.lucide.icons[name].toSvg({ width: 18, height: 18 });
    } else {
      btn.textContent = open ? '🙈' : '👁️';
    }
  };

  document.querySelectorAll('.pw-toggle').forEach(btn => {
    if (btn.dataset.pwInit === '1') return; // já inicializado
    btn.dataset.pwInit = '1';

    const targetId = btn.getAttribute('data-target');
    const input = document.getElementById(targetId);
    if (!input) return;

    // estado inicial
    setIcon(btn, false);
    btn.setAttribute('aria-pressed', 'false');

    // Captura o clique e impede outros listeners duplicados
    btn.addEventListener('click', (e) => {
      e.stopImmediatePropagation(); // evita outro handler fazer toggle de novo
      const open = input.type === 'password';
      input.type = open ? 'text' : 'password';
      setIcon(btn, open);
      btn.setAttribute('aria-pressed', String(open));
      btn.setAttribute('aria-label', open ? 'Ocultar senha' : 'Mostrar senha');
      input.focus({ preventScroll: true });
    }, true); // capture = true para ganhar prioridade

    // (Opcional) “espiar” segurando o botão:
    btn.addEventListener('pointerdown', () => { input.type = 'text'; setIcon(btn, true); });
    ['pointerup','pointercancel','pointerleave'].forEach(ev =>
      btn.addEventListener(ev, () => { input.type = 'password'; setIcon(btn, false); })
    );
  });
}

// inicializa
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide && typeof lucide.createIcons === 'function') lucide.createIcons();
  initPasswordToggles();
});

// === Entrar como convidado e ir para a Home ===
const MAIN_PAGE = "telaPrincipal.html"; // ajuste se seu arquivo estiver em outra pasta

async function guestSignInAndGo() {
  try {
    // tenta autenticar como anônimo (se estiver habilitado no Firebase)
    const { getAuth, signInAnonymously } = await import(
      "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js"
    );
    await signInAnonymously(getAuth());
  } catch (err) {
    // se não estiver habilitado (auth/operation-not-allowed), ignora e segue
    console.warn("Guest sign-in falhou; redirecionando mesmo assim:", err?.code || err);
  } finally {
    // vai para a tela principal de qualquer jeito
    location.replace(MAIN_PAGE);
  }
}

// liga o botão em qualquer página de auth
document.addEventListener("click", (e) => {
  const btn = e.target.closest("#guestLogin");
  if (!btn) return;
  e.preventDefault();
  guestSignInAndGo();
});



function renderLucideSafe(tries = 0) {
  if (window.lucide?.createIcons) return window.lucide.createIcons();
  if (tries < 20) setTimeout(() => renderLucideSafe(tries + 1), 50);
}

document.addEventListener("DOMContentLoaded", () => {
  renderLucideSafe();
  // restante do boot...
});