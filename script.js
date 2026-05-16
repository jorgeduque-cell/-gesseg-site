// GESSEG Colombia — frontend interactions
document.addEventListener('DOMContentLoaded', () => {

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ----- Mobile menu -----
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    if (!links.id) links.id = 'primary-nav';

    const setMenu = (open) => {
      links.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      document.body.style.overflow = open ? 'hidden' : '';
    };

    toggle.addEventListener('click', () => {
      setMenu(!links.classList.contains('open'));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        setMenu(false);
        toggle.focus();
      }
    });

    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => setMenu(false));
    });
  }

  // ----- Header shrink + scroll progress (single scroll listener) -----
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress');
  const onScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 8);
    if (progress) {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ----- Scroll reveal -----
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // ----- Animated counters -----
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const ioCount = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const dur = 1600;
          const start = performance.now();
          const step = (now) => {
            const t = Math.min(1, (now - start) / dur);
            const eased = 1 - Math.pow(1 - t, 3);
            const value = Math.round(target * eased);
            el.firstChild && (el.firstChild.nodeValue = value.toLocaleString('es-CO'));
            if (t < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          ioCount.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(c => ioCount.observe(c));
  }

  // ----- Magnetic primary buttons (preserves the CSS hover-lift) -----
  if (!reduced) {
    document.querySelectorAll('.btn-primary').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px) translateY(-2px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  // ----- Subtle tilt on service cards -----
  if (!reduced) {
    document.querySelectorAll('.service-card, .mv-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${y * -2}deg) rotateY(${x * 2}deg) translateZ(0)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  // ----- Lines slider (Líneas de negocio 360°) — loop infinito + sensible -----
  document.querySelectorAll('[data-slider]').forEach(slider => {
    const track = slider.querySelector('.lines-track');
    const originalItems = track ? Array.from(track.children) : [];
    const prev = slider.querySelector('.slider-prev');
    const next = slider.querySelector('.slider-next');
    const dotsContainer = slider.querySelector('.slider-dots');
    if (!track || originalItems.length === 0) return;

    const total = originalItems.length;

    // Clones a ambos lados: track = [items, items, items] (3 copias)
    // Esto permite swipes multi-step en cualquier dirección sin huecos
    const buildClones = () => {
      // Pre-pend una copia
      const preFragment = document.createDocumentFragment();
      originalItems.forEach(item => {
        const clone = item.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.classList.add('is-clone');
        preFragment.appendChild(clone);
      });
      track.prepend(preFragment);
      // Append una copia
      const postFragment = document.createDocumentFragment();
      originalItems.forEach(item => {
        const clone = item.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.classList.add('is-clone');
        postFragment.appendChild(clone);
      });
      track.appendChild(postFragment);
    };
    buildClones();

    const totalSlots = total * 3;
    const itemPercent = 100 / totalSlots;
    const TRANSITION_MS = 380;

    // Empezamos en la copia central (index = total)
    let index = total;
    let snapTimer;

    const setOffset = (idx, animate = true) => {
      track.style.transition = animate ? '' : 'none';
      track.style.transform = `translateX(-${itemPercent * idx}%)`;
      if (!animate) {
        void track.offsetHeight; // forzar reflow
        track.style.transition = '';
      }
    };

    const updateDots = () => {
      const real = ((index - total) % total + total) % total;
      dotsContainer.querySelectorAll('.slider-dot').forEach((d, i) => {
        d.classList.toggle('is-active', i === real);
      });
    };

    const scheduleSnap = () => {
      clearTimeout(snapTimer);
      snapTimer = setTimeout(() => {
        // Normalizar al rango central [total, 2*total - 1] sin animación
        if (index < total) index += total;
        else if (index >= total * 2) index -= total;
        else return;
        setOffset(index, false);
      }, TRANSITION_MS + 30);
    };

    const advance = (steps) => {
      if (!steps) { setOffset(index); return; }
      index += steps;
      setOffset(index);
      updateDots();
      scheduleSnap();
    };

    const buildDots = () => {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < total; i++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'slider-dot';
        btn.setAttribute('aria-label', 'Ir al servicio ' + (i + 1));
        btn.addEventListener('click', () => {
          const real = ((index - total) % total + total) % total;
          const diff = i - real;
          advance(diff);
        });
        dotsContainer.appendChild(btn);
      }
    };

    prev?.addEventListener('click', () => advance(-1));
    next?.addEventListener('click', () => advance(1));

    // Touch handling con drag-follow y momentum
    let startX = 0;
    let startY = 0;
    let dragging = false;
    let horizontal = null;
    let startTime = 0;
    let lastDx = 0;
    let lastTime = 0;
    let instantVelocity = 0;
    const viewport = slider.querySelector('.lines-slider-viewport') || track;

    viewport.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = lastTime = Date.now();
      lastDx = 0;
      instantVelocity = 0;
      dragging = true;
      horizontal = null;
      clearTimeout(snapTimer);
    }, { passive: true });

    viewport.addEventListener('touchmove', e => {
      if (!dragging) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      if (horizontal === null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
        horizontal = Math.abs(dx) > Math.abs(dy);
      }
      if (horizontal) {
        const now = Date.now();
        const dt = Math.max(now - lastTime, 1);
        instantVelocity = (dx - lastDx) / dt;
        lastDx = dx;
        lastTime = now;

        track.style.transition = 'none';
        const baseOffset = itemPercent * index;
        const dragPercent = (dx / viewport.offsetWidth) * itemPercent;
        track.style.transform = `translateX(calc(-${baseOffset}% + ${dragPercent}%))`;
      }
    }, { passive: true });

    viewport.addEventListener('touchend', e => {
      if (!dragging) {
        return;
      }
      const wasHorizontal = horizontal;
      dragging = false;
      horizontal = null;
      if (!wasHorizontal) {
        return;
      }

      const dx = (e.changedTouches[0].clientX - startX);
      const viewportW = viewport.offsetWidth;
      const oneItem = viewportW; // 1 item = 100% viewport en móvil

      // Projección con velocidad (momentum)
      const projection = dx + instantVelocity * 150; // ~150ms de inercia
      const stepsRaw = projection / oneItem;

      // Snap al item más cercano (con threshold mínimo de 8% del viewport)
      let steps;
      const minMove = 0.08;
      if (Math.abs(stepsRaw) < minMove) {
        steps = 0;
      } else {
        steps = Math.round(-stepsRaw);
        if (steps === 0) steps = stepsRaw < 0 ? 1 : -1;
      }

      advance(steps);
    });

    viewport.addEventListener('touchcancel', () => {
      dragging = false;
      horizontal = null;
      setOffset(index);
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { setOffset(index, false); updateDots(); }, 150);
    });

    buildDots();
    setOffset(index, false);
    updateDots();
  });

  // ----- FAQ: only one open at a time -----
  document.querySelectorAll('.faq').forEach(faq => {
    faq.querySelectorAll('details').forEach(d => {
      d.addEventListener('toggle', () => {
        if (d.open) {
          faq.querySelectorAll('details[open]').forEach(other => {
            if (other !== d) other.open = false;
          });
        }
      });
    });
  });

  // ----- Form submission → WhatsApp Business -----
  const form = document.querySelector('#contact-form');
  if (form) {
    const WA_NUMBER = '573043900623';
    const val = (id) => (form.querySelector('#' + id)?.value || '').trim();

    const buildMessage = () => {
      const lines = [
        '*Nueva solicitud — GESSEG*',
        '',
        '*Nombre:* ' + val('nombre'),
        '*Empresa:* ' + val('empresa'),
        '*Correo:* ' + val('email'),
        '*Teléfono:* ' + val('telefono'),
        '*Ciudad:* ' + val('ciudad'),
        '*Plan de interés:* ' + val('plan'),
      ];
      lines.push('', '_Enviado desde gesseg.com.co_');
      return lines.join('\n');
    };

    const showFallback = (url, btn, originalText) => {
      let fallback = form.querySelector('.wa-fallback');
      if (!fallback) {
        fallback = document.createElement('div');
        fallback.className = 'wa-fallback';
        fallback.innerHTML = '<p>Si su navegador bloqueó la nueva ventana, abra WhatsApp manualmente:</p>';
        const link = document.createElement('a');
        link.className = 'btn btn-primary btn-arrow';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Abrir WhatsApp';
        fallback.appendChild(link);
        btn.insertAdjacentElement('afterend', fallback);
      }
      fallback.querySelector('a').href = url;
      btn.textContent = originalText;
      btn.disabled = false;
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');

      const required = ['nombre', 'empresa', 'email', 'telefono', 'ciudad', 'plan'];
      for (const id of required) {
        const field = form.querySelector('#' + id);
        if (!field.value.trim()) {
          field.focus();
          field.reportValidity?.();
          return;
        }
      }
      const emailField = form.querySelector('#email');
      if (emailField && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim())) {
        emailField.focus();
        emailField.reportValidity?.();
        return;
      }

      const url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(buildMessage());
      const originalText = btn.textContent;
      const popup = window.open(url, '_blank', 'noopener,noreferrer');

      btn.disabled = true;
      btn.textContent = 'Abriendo WhatsApp…';

      setTimeout(() => {
        if (!popup || popup.closed) {
          showFallback(url, btn, originalText);
          return;
        }
        btn.textContent = '✓ WhatsApp abierto';
        const fallback = form.querySelector('.wa-fallback');
        if (fallback) fallback.remove();
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
        }, 2800);
      }, 600);
    });
  }
});
