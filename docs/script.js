document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.getElementById('mobile-menu');
  const navMenu = document.querySelector('.nav-menu');
  const navbar = document.getElementById('navbar');

  menuButton.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('active');
    menuButton.classList.toggle('is-active', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.nav-link').forEach((link) => link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    menuButton.classList.remove('is-active');
    menuButton.setAttribute('aria-expanded', 'false');
  }));

  window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 12));
});
