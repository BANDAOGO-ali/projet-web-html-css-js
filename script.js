/* Utilitaires */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Année dans le footer */
$('#year').textContent = new Date().getFullYear();

/* Thème clair/sombre (persisté) */
const themeToggle = $('#theme-toggle');
const applyTheme = (mode) => {
  document.documentElement.setAttribute('data-theme', mode);
  themeToggle.setAttribute('aria-pressed', String(mode === 'dark'));
  localStorage.setItem('theme', mode);
};
const saved = localStorage.getItem('theme');
applyTheme(saved === 'dark' ? 'dark' : 'light');

themeToggle.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});

/* Défilement doux pour les ancres */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      const target = $(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
        target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true });
        setTimeout(() => target.removeAttribute('tabindex'), 500);
      }
    }
  });
});

/* Bouton retour en haut */
const backToTop = $('#back-to-top');
const onScroll = () => {
  backToTop.style.display = window.scrollY > 400 ? 'grid' : 'none';
};
window.addEventListener('scroll', onScroll, { passive: true });
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
});

/* Validation du formulaire */
const form = $('#contact-form');
const nameInput = $('#name');
const emailInput = $('#email');
const messageInput = $('#message');

const setError = (el, msg) => {
  el.setAttribute('aria-invalid', 'true');
  const errorEl = $(`#${el.id}-error`);
  if (errorEl) errorEl.textContent = msg;
}
const clearError = (el) => {
  el.removeAttribute('aria-invalid');
  const errorEl = $(`#${el.id}-error`);
  if (errorEl) errorEl.textContent = '';
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

[nameInput, emailInput, messageInput].forEach((el) => {
  el.addEventListener('input', () => clearError(el));
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let ok = true;

  if (!nameInput.value.trim()) { setError(nameInput, 'Le nom est requis.'); ok = false; }
  if (!emailRegex.test(emailInput.value.trim())) { setError(emailInput, 'Adresse email invalide.'); ok = false; }
  if (messageInput.value.trim().length < 10) { setError(messageInput, 'Message trop court (≥ 10 caractères).'); ok = false; }

  if (!ok) return;

  // Simule l’envoi + confirmation non bloquante
  $('#form-success').textContent = 'Merci ! Votre message a été envoyé.';
  form.reset();
  [nameInput, emailInput, messageInput].forEach(clearError);
});
