(() => {
  'use strict';
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('navigation');
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  if (toggle && menu) {
    const closeMenu = () => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation menu');
      menu.classList.remove('open');
    };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      menu.classList.toggle('open', open);
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
    document.addEventListener('click', event => {
      if (!toggle.contains(event.target) && !menu.contains(event.target)) closeMenu();
    });
    const largeScreen = window.matchMedia('(min-width: 821px)');
    largeScreen.addEventListener('change', event => { if (event.matches) closeMenu(); });
  }
  const tabs = [...document.querySelectorAll('.cafe-menu-tab')];
  const selectCategory = (nextTab, focus = false) => {
    tabs.forEach(tab => {
      const active = tab === nextTab;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      const panel = document.getElementById(tab.getAttribute('aria-controls'));
      if (panel) panel.hidden = !active;
    });
    if (focus) nextTab.focus();
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectCategory(tab));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault();
      let target = index;
      if (event.key === 'Home') target=0;
      if (event.key === 'End') target=tabs.length-1;
      if (event.key === 'ArrowLeft') target=(index-1+tabs.length)%tabs.length;
      if (event.key === 'ArrowRight') target=(index+1)%tabs.length;
      selectCategory(tabs[target], true);
    });
  });
  // Decorative video runs only while on screen and when visitors allow motion.
  const visitMotionVideo = document.querySelector('.visit-motion-video');
  if (visitMotionVideo) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const saveData = Boolean(navigator.connection && navigator.connection.saveData);
    let videoIsVisible = false;
    const syncVisitMotion = () => {
      if (!videoIsVisible || document.hidden || reducedMotion.matches || saveData) {
        visitMotionVideo.pause();
        return;
      }
      const attempt = visitMotionVideo.play();
      if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {});
    };
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        videoIsVisible = entries.some(entry => entry.isIntersecting);
        syncVisitMotion();
      }, {rootMargin: '120px', threshold: 0.05});
      observer.observe(visitMotionVideo);
    } else {
      videoIsVisible = true;
      syncVisitMotion();
    }
    document.addEventListener('visibilitychange', syncVisitMotion);
    if (typeof reducedMotion.addEventListener === 'function') {
      reducedMotion.addEventListener('change', syncVisitMotion);
    } else if (typeof reducedMotion.addListener === 'function') {
      reducedMotion.addListener(syncVisitMotion);
    }
  }

})();