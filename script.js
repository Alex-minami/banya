(() => {
  const menuButton = document.querySelector('.menu-button');
  const navigation = document.querySelector('#navigation');
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Открыть меню');
    navigation.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };
  menuButton.addEventListener('click', () => {
    const opened = menuButton.getAttribute('aria-expanded') === 'true';
    if (opened) return closeMenu();
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Закрыть меню');
    navigation.classList.add('is-open');
    document.body.classList.add('menu-open');
    navigation.querySelector('a').focus();
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (menuButton.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') { closeMenu(); menuButton.focus(); }
    if (event.key === 'Tab') {
      const links = [...navigation.querySelectorAll('a'), menuButton];
      const first = links[0]; const last = links[links.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', event => { if(event.matches) closeMenu(); });
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
    document.documentElement.classList.add('motion-ready');
  }
  const heroImage = document.querySelector('.hero-image');
  let pending = false;
  window.addEventListener('scroll', () => {
    if (pending || reducedMotion.matches || window.scrollY > window.innerHeight * 1.3) return;
    pending = true;
    requestAnimationFrame(() => {
      heroImage.style.transform = `translateY(${window.scrollY * 0.15}px) scale(1.08)`;
      pending = false;
    });
  }, { passive: true });
  const copyButton = document.querySelector('.copy-coordinates');
  const copyStatus = document.querySelector('#copy-status');
  let copyTimer;
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('44.926000, 35.071639');
      copyStatus.textContent = 'Координаты скопированы';
    } catch {
      copyStatus.textContent = 'Координаты: 44.926000, 35.071639';
    }
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => { copyStatus.textContent = ''; }, 8000);
  });
})();
