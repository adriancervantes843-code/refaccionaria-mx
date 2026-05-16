/* ═══════════════════════════════════════════════════════════════════
   AUTOPARTS MX – LÓGICA PRINCIPAL
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

/* ── 1. STICKY HEADER (encoge al hacer scroll) ──────────────────── */
(function initStickyHeader() {
  const header = document.getElementById('main-header');
  let lastScroll = 0;

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('shrunk', y > 60);
    lastScroll = y;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ── 2. PARTÍCULAS DECORATIVAS EN EL HERO ───────────────────────── */
(function initParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;

  const COUNT = 18;
  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${40 + Math.random() * 50}%;
      --dur: ${5 + Math.random() * 8}s;
      --dx: ${(Math.random() - 0.5) * 60}px;
      animation-delay: ${Math.random() * 6}s;
      width: ${2 + Math.random() * 3}px;
      height: ${2 + Math.random() * 3}px;
    `;
    container.appendChild(p);
  }
})();


/* ── 3. BUSCADOR CON SUGERENCIAS PREDICTIVAS ────────────────────── */
(function initSearch() {
  const input = document.getElementById('main-search');
  const suggestBox = document.getElementById('search-suggestions');
  if (!input || !suggestBox) return;

  const catalog = [
    'Balatas delanteras Brembo', 'Balatas traseras', 'Filtro de aceite',
    'Filtro de aire K&N', 'Filtro de combustible', 'Bujías NGK',
    'Amortiguadores Monroe', 'Resortes de suspensión', 'Refrigerante PEAK',
    'Aceite Mobil 1 5W-30', 'Correa de distribución', 'Bomba de agua',
    'Alternador Toyota', 'Batería Optima', 'Disco de freno',
    'Pastilla de freno', 'Radiador aluminio', 'Sensor MAF',
    'Sensor de oxígeno', 'Bobina de encendido', 'Termostato',
    'Manguera de radiador', 'Faja serpentina', 'Compresor A/C',
  ];

  const render = (matches) => {
    suggestBox.innerHTML = '';
    if (!matches.length) { suggestBox.hidden = true; return; }
    matches.slice(0, 6).forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      li.setAttribute('role', 'option');
      li.addEventListener('mousedown', () => {
        input.value = item;
        suggestBox.hidden = true;
      });
      suggestBox.appendChild(li);
    });
    suggestBox.hidden = false;
  };

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) { suggestBox.hidden = true; return; }
    render(catalog.filter(s => s.toLowerCase().includes(q)));
  });

  input.addEventListener('blur', () => {
    setTimeout(() => { suggestBox.hidden = true; }, 180);
  });

  input.addEventListener('focus', () => {
    if (input.value.trim().length >= 2) {
      render(catalog.filter(s => s.toLowerCase().includes(input.value.trim().toLowerCase())));
    }
  });
})();


/* ── 4. POP-UP DE DESCUENTO (slide-in después de 3 s) ───────────── */
(function initPromoPopup() {
  const popup   = document.getElementById('promo-popup');
  const closeBtn = document.getElementById('close-promo');
  const overlay = document.getElementById('promo-overlay');
  const form    = document.getElementById('promo-form');
  if (!popup) return;

  const dismiss = () => {
    popup.classList.add('dismissed');
    overlay.classList.remove('visible');
    popup.setAttribute('aria-hidden', 'true');
  };

  const show = () => {
    popup.classList.add('visible');
    popup.setAttribute('aria-hidden', 'false');
  };

  setTimeout(show, 3000);

  closeBtn?.addEventListener('click', dismiss);
  overlay?.addEventListener('click', dismiss);

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button');
    btn.textContent = '✅ ¡Cupón enviado!';
    btn.disabled = true;
    setTimeout(dismiss, 1800);
  });
})();


/* ── 5. SELECTOR DE VEHÍCULO – MODAL ────────────────────────────── */
(function initVehicleSelector() {
  const modal    = document.getElementById('vehicle-modal');
  const backdrop = document.getElementById('vehicle-modal-backdrop');
  const closeBtn = document.getElementById('vehicle-modal-close');
  const typeSpan = document.getElementById('vehicle-modal-type');
  const iconWrap = document.getElementById('vehicle-modal-icon');
  const form     = document.getElementById('vehicle-config-form');
  const saveBtn  = document.getElementById('save-garage-btn');
  const yearSel  = document.getElementById('v-year');
  const headerBtn = document.getElementById('open-vehicle-modal');
  if (!modal) return;

  // Poblar años
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= 1990; y--) {
    const opt = document.createElement('option');
    opt.value = y; opt.textContent = y;
    yearSel.appendChild(opt);
  }

  const iconSVGs = {
    'Sedán':     '<svg viewBox="0 0 36 20" fill="none" width="32"><path d="M3 14 Q3 7 8 7 L14 5 Q20 2 26 5 L33 7 Q36 7 36 12 L36 15 Q36 16 35 16 L5 16 Q3 16 3 14Z" fill="#FF4D00" opacity="0.3" stroke="#FF4D00" stroke-width="1"/><circle cx="9" cy="16" r="3" stroke="#FF4D00" stroke-width="1.5" fill="none"/><circle cx="28" cy="16" r="3" stroke="#FF4D00" stroke-width="1.5" fill="none"/></svg>',
    'SUV':       '<svg viewBox="0 0 36 22" fill="none" width="32"><path d="M2 13 L2 7 Q2 4 6 4 L12 3 Q20 0 28 3 L34 5 Q36 5 36 9 L36 15 Q36 17 34 17 L4 17 Q2 17 2 13Z" fill="#FF4D00" opacity="0.3" stroke="#FF4D00" stroke-width="1"/><circle cx="9" cy="17" r="3" stroke="#FF4D00" stroke-width="1.5" fill="none"/><circle cx="28" cy="17" r="3" stroke="#FF4D00" stroke-width="1.5" fill="none"/></svg>',
    'Camioneta': '<svg viewBox="0 0 40 22" fill="none" width="32"><rect x="2" y="6" width="18" height="12" rx="2" stroke="#FF4D00" stroke-width="1"/><path d="M20 10 L36 10 L38 16 L20 16Z" stroke="#FF4D00" stroke-width="1"/><circle cx="9" cy="18" r="3" stroke="#FF4D00" stroke-width="1.5" fill="none"/><circle cx="31" cy="18" r="3" stroke="#FF4D00" stroke-width="1.5" fill="none"/></svg>',
    'Moto':      '<svg viewBox="0 0 40 28" fill="none" width="32"><circle cx="9" cy="18" r="8" stroke="#FF4D00" stroke-width="2" fill="none"/><circle cx="31" cy="18" r="8" stroke="#FF4D00" stroke-width="2" fill="none"/><path d="M17 18 L21 8 L27 8 L31 12" stroke="#FF4D00" stroke-width="2" stroke-linecap="round"/></svg>',
  };

  const openModal = (type) => {
    typeSpan.textContent = type;
    iconWrap.innerHTML = iconSVGs[type] || '';
    modal.showModal();
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    headerBtn?.setAttribute('aria-expanded', 'true');
  };

  const closeModal = () => {
    modal.close();
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    headerBtn?.setAttribute('aria-expanded', 'false');
    // Resetear formulario
    form.reset();
    saveBtn.classList.remove('loading', 'success');
  };

  // Abrir desde tarjetas de vehículo
  document.querySelectorAll('.vehicle-card').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.type));
  });

  // Abrir desde botón header
  headerBtn?.addEventListener('click', () => openModal('Sedán'));

  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);

  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Guardar con animación
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    saveBtn.classList.add('loading');
    saveBtn.disabled = true;

    setTimeout(() => {
      saveBtn.classList.remove('loading');
      saveBtn.classList.add('success');

      // Guardar en localStorage
      const vehicle = {
        type: typeSpan.textContent,
        year: document.getElementById('v-year').value,
        brand: document.getElementById('v-brand').value,
        engine: document.getElementById('v-engine').value,
      };
      const garage = JSON.parse(localStorage.getItem('garage') || '[]');
      garage.unshift(vehicle);
      localStorage.setItem('garage', JSON.stringify(garage.slice(0, 3)));

      setTimeout(() => { closeModal(); saveBtn.disabled = false; }, 1400);
    }, 1600);
  });
})();


/* ── 6. SCROLL REVEAL – Productos de izquierda a derecha ────────── */
(function initScrollReveal() {
  const targets = document.querySelectorAll('.scroll-reveal');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(el => observer.observe(el));
})();


/* ── 7. QUICK VIEW – Vista rápida de productos ──────────────────── */
(function initQuickView() {
  const modal    = document.getElementById('quick-view-modal');
  const backdrop = document.getElementById('qv-backdrop');
  const closeBtn = document.getElementById('qv-close');
  const content  = document.getElementById('qv-content');
  if (!modal) return;

  const products = [
    {
      brand: 'Brembo',
      name: 'Balatas Sport High Performance',
      price: '$1,290',
      oldPrice: '$1,890',
      disc: '-32%',
      rating: '4.8',
      reviews: 142,
      compat: '+320 modelos',
      specs: [
        ['Número OEM', 'BRE-09A9011C'],
        ['Material', 'Cerámico Premium'],
        ['Posición', 'Delantera / Trasera'],
        ['Garantía', '24 meses'],
        ['País de origen', 'Italia'],
      ],
      reviewList: [
        { author: 'Carlos M.', text: 'Excelente frenado, muy silenciosas. Las mejores que he puesto en mi Civic.' },
        { author: 'Laura P.', text: 'Instalación sencilla, diferencia notable desde el primer día. 100% recomendadas.' },
      ],
      svg: `<svg viewBox="0 0 160 160" fill="none">
        <circle cx="80" cy="80" r="65" stroke="#FF4D00" stroke-width="4" opacity="0.2"/>
        <circle cx="80" cy="80" r="45" stroke="#FF4D00" stroke-width="3" opacity="0.4"/>
        <circle cx="80" cy="80" r="18" fill="#FF4D00" opacity="0.6"/>
        <rect x="72" y="15" width="16" height="32" rx="8" fill="#FF4D00" opacity="0.7"/>
        <rect x="72" y="113" width="16" height="32" rx="8" fill="#FF4D00" opacity="0.7"/>
        <rect x="15" y="72" width="32" height="16" rx="8" fill="#FF4D00" opacity="0.7"/>
        <rect x="113" y="72" width="32" height="16" rx="8" fill="#FF4D00" opacity="0.7"/>
      </svg>`,
    },
    {
      brand: 'K&N Engineering',
      name: 'Filtro de Aire de Alto Flujo',
      price: '$890',
      oldPrice: '$1,100',
      disc: '-19%',
      rating: '4.7',
      reviews: 89,
      compat: '+180 modelos',
      specs: [
        ['Número OEM', 'KN-33-2129'],
        ['Material', 'Algodón / Malla acero'],
        ['Duración', 'Lavable y reutilizable'],
        ['Garantía', '1,000,000 km'],
        ['País de origen', 'EUA'],
      ],
      reviewList: [
        { author: 'Rodrigo T.', text: 'Mejor respuesta del acelerador y menor consumo. Gran producto.' },
        { author: 'Ana S.', text: 'Lo instalé en 10 min. El motor suena más vivo. Muy satisfecha.' },
      ],
      svg: `<svg viewBox="0 0 160 160" fill="none">
        <circle cx="80" cy="80" r="65" stroke="#FF4D00" stroke-width="4" opacity="0.15"/>
        <circle cx="80" cy="80" r="48" stroke="#FF4D00" stroke-width="3" opacity="0.3"/>
        <circle cx="80" cy="80" r="30" stroke="#FF4D00" stroke-width="2" opacity="0.5"/>
        <line x1="80" y1="15" x2="80" y2="145" stroke="#FF4D00" stroke-width="2" opacity="0.3"/>
        <line x1="15" y1="80" x2="145" y2="80" stroke="#FF4D00" stroke-width="2" opacity="0.3"/>
        <line x1="31" y1="31" x2="129" y2="129" stroke="#FF4D00" stroke-width="2" opacity="0.3"/>
        <line x1="129" y1="31" x2="31" y2="129" stroke="#FF4D00" stroke-width="2" opacity="0.3"/>
        <circle cx="80" cy="80" r="14" fill="#FF4D00" opacity="0.5"/>
      </svg>`,
    },
    {
      brand: 'Monroe',
      name: 'Amortiguadores Gas-Matic Delanteros',
      price: '$2,150',
      oldPrice: '$3,200',
      disc: '-33%',
      rating: '4.9',
      reviews: 67,
      compat: '+95 modelos',
      specs: [
        ['Número OEM', 'MON-37112'],
        ['Tecnología', 'Gas presurizado'],
        ['Posición', 'Delantera (par)'],
        ['Garantía', '36 meses'],
        ['País de origen', 'Bélgica'],
      ],
      reviewList: [
        { author: 'Jorge H.', text: 'Como nuevo el carro. La diferencia con los originales desgastados es brutal.' },
        { author: 'Sofía L.', text: 'Instalación en taller sin problemas. Calidad premium a buen precio.' },
      ],
      svg: `<svg viewBox="0 0 160 160" fill="none">
        <rect x="70" y="10" width="20" height="140" rx="10" fill="#FF4D00" opacity="0.12" stroke="#FF4D00" stroke-width="3"/>
        <rect x="58" y="55" width="44" height="14" rx="5" fill="#FF4D00" opacity="0.5"/>
        <rect x="58" y="76" width="44" height="14" rx="5" fill="#FF4D00" opacity="0.4"/>
        <rect x="58" y="97" width="44" height="14" rx="5" fill="#FF4D00" opacity="0.3"/>
        <circle cx="80" cy="24" r="10" fill="#FF4D00" opacity="0.7"/>
        <circle cx="80" cy="136" r="14" stroke="#FF4D00" stroke-width="3" fill="none"/>
      </svg>`,
    },
    {
      brand: 'Mobil 1',
      name: 'Aceite Sintético 5W-30 Advanced',
      price: '$480',
      oldPrice: '$620',
      disc: '-23%',
      rating: '4.9',
      reviews: 318,
      compat: 'Recomendado por fabricantes',
      specs: [
        ['Número OEM', 'MOB-102490'],
        ['Viscosidad', '5W-30 Sintético'],
        ['Volumen', '5 litros'],
        ['Norma', 'API SP / ILSAC GF-6'],
        ['País de origen', 'EUA'],
      ],
      reviewList: [
        { author: 'Miguel Á.', text: 'El motor arranca perfecto incluso en frío. Vale cada centavo.' },
        { author: 'Daniela R.', text: 'Uso Mobil 1 desde hace 5 años. Nunca me ha fallado. 5 estrellas.' },
      ],
      svg: `<svg viewBox="0 0 160 160" fill="none">
        <rect x="50" y="24" width="60" height="112" rx="14" fill="#FF4D00" opacity="0.1" stroke="#FF4D00" stroke-width="3"/>
        <rect x="62" y="12" width="36" height="18" rx="6" fill="#FF4D00" opacity="0.5"/>
        <rect x="68" y="6" width="24" height="12" rx="5" fill="#FF4D00" opacity="0.7"/>
        <line x1="65" y1="55" x2="95" y2="55" stroke="#FF4D00" stroke-width="2" opacity="0.4"/>
        <line x1="65" y1="72" x2="95" y2="72" stroke="#FF4D00" stroke-width="2" opacity="0.4"/>
        <line x1="65" y1="89" x2="95" y2="89" stroke="#FF4D00" stroke-width="2" opacity="0.4"/>
        <path d="M62 110 Q80 100 98 110" stroke="#FF4D00" stroke-width="2.5" fill="none" opacity="0.6"/>
      </svg>`,
    },
  ];

  const stars = (rating) => '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));

  const buildContent = (p) => `
    <div class="qv-gallery">
      <div class="qv-gallery__main">${p.svg}</div>
      <div class="qv-gallery__thumbs">
        <div class="qv-thumb active">01</div>
        <div class="qv-thumb">02</div>
        <div class="qv-thumb">03</div>
      </div>
      <span class="qv-badge-360">360° View</span>
    </div>
    <div class="qv-info">
      <p class="qv-brand">${p.brand}</p>
      <h3 class="qv-name">${p.name}</h3>
      <p class="qv-rating">
        ${stars(p.rating)}
        <span>${p.rating} (${p.reviews} opiniones)</span>
      </p>
      <div class="qv-price-row">
        <span class="qv-price">${p.price}</span>
        <span class="qv-old">${p.oldPrice}</span>
        <span class="qv-disc">${p.disc}</span>
      </div>
      <dl class="qv-specs">
        ${p.specs.map(([k,v]) => `<div class="qv-spec"><dt>${k}</dt><dd>${v}</dd></div>`).join('')}
        <div class="qv-spec"><dt>Compatibilidad</dt><dd>${p.compat}</dd></div>
      </dl>
      <div class="qv-reviews">
        <p class="qv-reviews-title">Opiniones de clientes</p>
        ${p.reviewList.map(r => `
          <div class="qv-review">
            <strong>${r.author} ★★★★★</strong>
            ${r.text}
          </div>
        `).join('')}
      </div>
      <div class="qv-actions">
        <button class="btn btn--primary btn--full">Agregar al Carrito</button>
        <button class="btn btn--ghost btn--full">Ver Ficha Completa</button>
      </div>
    </div>
  `;

  const openQV = (idx) => {
    const p = products[idx];
    if (!p) return;
    content.innerHTML = buildContent(p);

    // Mini interacción en thumbnails
    content.querySelectorAll('.qv-thumb').forEach((thumb, i) => {
      thumb.addEventListener('click', () => {
        content.querySelectorAll('.qv-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });

    backdrop.classList.add('open');
    modal.showModal();
    document.body.style.overflow = 'hidden';
  };

  const closeQV = () => {
    modal.close();
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.product-card__quick-view').forEach(btn => {
    btn.addEventListener('click', () => openQV(Number(btn.dataset.product)));
  });

  closeBtn?.addEventListener('click', closeQV);
  backdrop?.addEventListener('click', closeQV);
  modal.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeQV(); });
})();


/* ── 8. TARJETAS DE CATEGORÍA – accesibilidad por teclado ───────── */
document.querySelectorAll('.cat-card').forEach(card => {
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click();
    }
  });
});


/* ── 9. ANIMACIÓN DE NÚMEROS EN HERO (count-up) ─────────────────── */
(function initCountUp() {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const strongs = entry.target.querySelectorAll('.hero-stat strong');
      strongs.forEach(el => {
        const rawText = el.textContent;
        const num = parseFloat(rawText.replace(/[^0-9.]/g, ''));
        if (isNaN(num)) return;
        const suffix = rawText.replace(/[0-9.]/g, '');
        let start = 0;
        const duration = 1200;
        const startTime = performance.now();

        const tick = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = (num * eased);
          el.textContent = (num % 1 !== 0 ? current.toFixed(1) : Math.round(current)) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
      statsObserver.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) statsObserver.observe(statsEl);
})();
