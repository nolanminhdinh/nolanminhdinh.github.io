'use strict';
// Native HTML remains readable and navigable without JavaScript.
const menuButton = document.querySelector('#menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu() { menuButton.setAttribute('aria-expanded', 'false'); mobileNav.hidden = true; }
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open)); mobileNav.hidden = !open;
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
window.matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

const filterButtons = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('.project-card')];
const projectCount = document.querySelector('#project-count');
const countLabel = document.documentElement.lang === 'vi' ? 'dự án' : 'projects';
filterButtons.forEach(button => button.addEventListener('click', () => {
  filterButtons.forEach(other => { other.classList.toggle('active', other === button); other.setAttribute('aria-pressed', String(other === button)); });
  const filter = button.dataset.filter;
  cards.forEach(card => { card.hidden = filter !== 'all' && !card.dataset.category.split(' ').includes(filter); });
  projectCount.textContent = String(cards.filter(card => !card.hidden).length).padStart(2, '0') + ' ' + countLabel;
}));

let dialogTrigger;
document.querySelectorAll('[data-dialog]').forEach(button => button.addEventListener('click', () => {
  const dialog = document.getElementById(button.dataset.dialog);
  dialogTrigger = button; dialog.showModal(); document.body.classList.add('dialog-open'); dialog.scrollTop = 0;
}));
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); dialogTrigger?.focus({ preventScroll: true }); });
});

let toastTimer;
const copyButton = document.querySelector('#copy-email');
copyButton.addEventListener('click', async () => {
  let message;
  try { await navigator.clipboard.writeText('congminh311204@gmail.com'); message = copyButton.dataset.success; }
  catch { message = copyButton.dataset.failure; }
  const toast = document.querySelector('#toast');
  toast.textContent = message; toast.classList.add('visible');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('visible'), 4000);
});
// Keep the language control on the same section of the page.
document.querySelectorAll('.language-switch a').forEach(link => link.addEventListener('click', () => { link.href = link.getAttribute('href').split('#')[0] + window.location.hash; }));
const navLinks = [...document.querySelectorAll('.desktop-nav a')];
const trackedSections = [...document.querySelectorAll('#hero,#projects,#about,#experience,#contact')];
const progress = document.querySelector('.scroll-progress');
let scrollQueued = false;
function paintProgress() {
  const range = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${range > 0 ? Math.min(1, window.scrollY / range) : 0})`; scrollQueued = false;
  const activeSection = trackedSections.filter(section => section.getBoundingClientRect().top <= window.innerHeight * 0.35).at(-1);
  navLinks.forEach(link => {
    const active = link.hash === '#' + activeSection?.id;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
  });
}
window.addEventListener('scroll', () => { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(paintProgress); } }, { passive: true });
window.addEventListener('resize', paintProgress); paintProgress();

document.fonts?.ready.then(paintProgress);
