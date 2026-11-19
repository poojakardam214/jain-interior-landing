const IMG_HERO = 'images/hero-villa.jpg';
const IMG_LIVING = 'images/living-dining.jpg';
const IMG_KITCHEN = 'images/modular-kitchen.jpg';
const IMG_BEDROOM = 'images/master-bedroom.jpg';
const IMG_WASHROOM = 'images/marble-washroom.jpg';
const IMG_FOYER = 'images/designer-foyer.jpg';
const IMG_KITCHEN_AURORA = 'images/kitchen-aurora.jpg';
const IMG_KITCHEN_SIG = 'images/kitchen-signature.jpg';
const IMG_KITCHEN_NOVA = 'images/kitchen-nova.jpg';
const IMG_CLOSET = 'images/walkin-closet.jpg';
const IMG_CALMNEST = 'images/bedroom-calmnest.jpg';

const PROJECTS = [
  { id: 1, title: 'Ivory Gallery Kitchen', tag: 'Luxury Interiors', cat: 'kitchen', scope: 'Modular Kitchen & Wardrobe', img: IMG_KITCHEN, desc: 'Warm walnut cabinetry paired with waterfall marble island seating and recessed under-cabinet lighting.' },
  { id: 2, title: 'Aurora Line Modular Kitchen', tag: 'Residential Interior', cat: 'kitchen', scope: 'Modular Kitchen & Wardrobe', img: IMG_KITCHEN_AURORA, desc: 'Clean handleless storage layout engineered for high-efficiency Indian villa and apartment kitchens.' },
  { id: 3, title: 'The Aura Marble Washroom', tag: 'Residential Washroom', cat: 'washroom', scope: 'Renovation & Construction', img: IMG_WASHROOM, desc: 'Travertine stone vanity, backlit mirror, and brushed brass fixtures with wet-dry glass partitioning.' },
  { id: 4, title: 'The Horizon Slide Closet', tag: 'Residential Interior', cat: 'bedroom', scope: 'Modular Kitchen & Wardrobe', img: IMG_CLOSET, desc: 'Tinted glass sliding wardrobe with warm internal strip lighting and fluted oak wall paneling.' },
  { id: 5, title: 'Villa Courtyard Living Suite', tag: 'Luxury Interiors', cat: 'living', scope: 'Full Home Interior', img: IMG_HERO, desc: 'Open-plan villa lounge featuring walnut ceiling beams, travertine hearth, and indoor-outdoor sliders.' },
  { id: 6, title: 'The Zen Rest Bedroom', tag: 'Residential Interior', cat: 'bedroom', scope: 'Full Home Interior', img: IMG_BEDROOM, desc: 'Calm neutral palette with cove-lit false ceiling, acoustic wood slats, and floating bedside consoles.' },
  { id: 7, title: 'Grand Heritage Dining & Lounge', tag: 'Residential Interior', cat: 'living', scope: 'Full Home Interior', img: IMG_LIVING, desc: 'Spacious Indian residence living-dining zone with brass-inlaid wood paneling and statement chandelier.' },
  { id: 8, title: 'The Signature Marble Kitchen', tag: 'Residential Interior', cat: 'kitchen', scope: 'Modular Kitchen & Wardrobe', img: IMG_KITCHEN_SIG, desc: 'Integrated tall appliance unit with matte beige base drawers and stone backsplash.' },
  { id: 9, title: 'The Nova Marble Kitchen', tag: 'Residential Interior', cat: 'kitchen', scope: 'Modular Kitchen & Wardrobe', img: IMG_KITCHEN_NOVA, desc: 'Balanced parallel-plus-island workflow designed for family entertaining and effortless maintenance.' },
  { id: 10, title: 'Aurum Curve Designer Foyer', tag: 'Residential Designs', cat: 'living', scope: 'Full Home Interior', img: IMG_FOYER, desc: 'Statement walnut pivot door, fluted entryway wall, and sculpted marble console table.' },
  { id: 11, title: 'Ambient Elegance Corner', tag: 'Residential Interior', cat: 'living', scope: 'Full Home Interior', img: IMG_LIVING, desc: 'Warm evening architectural lighting layered across custom upholstery and built-in display shelving.' },
  { id: 12, title: 'The CalmNest Suite', tag: 'Residential Interior', cat: 'bedroom', scope: 'Full Home Interior', img: IMG_CALMNEST, desc: 'Restful master suite combining soft bouclé seating, warm oak textures, and glare-free indirect lighting.' }
];

const FAQS = [
  { q: 'What does an interior project cost?', a: 'Costs depend on property size (2 BHK, 3-4 BHK, or independent villa), material finishes, and scope. During your free consultation, we share a transparent itemized estimate tailored to your floor plan.' },
  { q: 'Is the design consultation free?', a: 'Yes, your initial consultation with our senior interior designer—including layout discussion and a preliminary budget estimate—is completely free with no obligation.' },
  { q: 'Do I get to see the design before work starts?', a: 'Yes. We provide detailed 2D drawings and photorealistic 3D renders for your approval before factory production or site execution begins.' },
  { q: 'Which areas do you serve?', a: 'We primarily serve Ghaziabad (including Raj Nagar Extension, Indirapuram, Vaishali) and across Delhi NCR.' },
  { q: 'Do you handle renovation and civil work?', a: 'Yes, our in-house execution team handles civil modifications, bathroom and kitchen renovation, flooring, electrical, plumbing, and false ceilings.' },
  { q: 'Do you do commercial and office interiors?', a: 'Yes, alongside homes and villas, we design and execute office, retail, and commercial spaces with turnkey accountability.' },
  { q: 'How long will my project take?', a: 'Modular kitchens and wardrobes typically take 4–6 weeks, while full home or villa interiors are scheduled with clear milestone timelines shared upfront.' }
];

let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), 3500);
}

function scrollToForm(scopeValue) {
  const card = document.getElementById('consultationFormCard');
  const scopeSelect = document.getElementById('scope');
  if (scopeValue && scopeSelect) {
    scopeSelect.value = scopeValue;
  }
  card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  card.classList.remove('form-highlight');
  void card.offsetWidth;
  card.classList.add('form-highlight');
  setTimeout(() => document.getElementById('fullName').focus({ preventScroll: true }), 450);
}

document.querySelectorAll('[data-scroll-form]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('mobileNav').classList.add('hidden');
    scrollToForm(btn.getAttribute('data-scroll-form'));
  });
});

document.getElementById('mobileMenuBtn').addEventListener('click', () => {
  document.getElementById('mobileNav').classList.toggle('hidden');
});

document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('mobileNav').classList.add('hidden');
  });
});

const navLinks = document.querySelectorAll('.nav-link');
const sections = Array.from(navLinks).map(l => document.getElementById(l.dataset.section)).filter(Boolean);
window.addEventListener('scroll', () => {
  const y = window.scrollY + 130;
  let currentId = '';
  sections.forEach(sec => {
    if (sec.offsetTop <= y) currentId = sec.id;
  });
  navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === currentId));
}, { passive: true });

let activeCat = 'all';
function renderProjects() {
  const grid = document.getElementById('projectGrid');
  const items = activeCat === 'all' ? PROJECTS : PROJECTS.filter(p => p.cat === activeCat);
  grid.innerHTML = items.map(p => `
    <article data-project-id="${p.id}" class="project-card group relative rounded-2xl overflow-hidden bg-charcoal border border-white/10 cursor-pointer shadow-md hover:border-gold/50 transition">
      <div class="aspect-[4/3] overflow-hidden">
        <img src="${p.img}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/20 to-transparent"></div>
      <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-espresso/80 text-gold text-[10px] font-semibold uppercase tracking-wider border border-gold/30">${p.tag}</span>
      <span class="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/55 text-white/75 text-[10px]">Concept Visual</span>
      <div class="absolute bottom-0 inset-x-0 p-4 flex items-end justify-between gap-2">
        <div>
          <h3 class="font-serif text-lg sm:text-xl font-semibold text-white group-hover:text-gold transition">${p.title}</h3>
          <p class="text-xs text-white/65">${p.scope}</p>
        </div>
        <span class="w-8 h-8 rounded-full bg-white/10 group-hover:bg-gold group-hover:text-espresso flex items-center justify-center text-white text-xs transition shrink-0">&rarr;</span>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const item = PROJECTS.find(x => x.id === Number(card.dataset.projectId));
      if (!item) return;
      document.getElementById('modalProjectImg').src = item.img;
      document.getElementById('modalProjectImg').alt = item.title;
      document.getElementById('modalProjectTag').textContent = `${item.tag} • Concept Visual`;
      document.getElementById('modalProjectTitle').textContent = item.title;
      document.getElementById('modalProjectDesc').textContent = item.desc;
      document.getElementById('modalQuoteBtn').dataset.scope = item.scope;
      document.getElementById('projectModal').classList.remove('hidden');
    });
  });
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    activeCat = btn.dataset.filter;
    document.querySelectorAll('.filter-btn').forEach(b => {
      const active = b.dataset.filter === activeCat;
      b.className = active
        ? 'filter-btn px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-gold text-espresso transition'
        : 'filter-btn px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-white/10 text-white/85 hover:bg-white/20 transition';
    });
    renderProjects();
  });
});

document.getElementById('closeProjectModal').addEventListener('click', () => document.getElementById('projectModal').classList.add('hidden'));
document.getElementById('projectModalBackdrop').addEventListener('click', () => document.getElementById('projectModal').classList.add('hidden'));
document.getElementById('modalQuoteBtn').addEventListener('click', (e) => {
  document.getElementById('projectModal').classList.add('hidden');
  scrollToForm(e.currentTarget.dataset.scope || 'Full Home Interior');
});

let openFaqIdx = 0;
function renderFaqs() {
  const list = document.getElementById('faqList');
  list.innerHTML = FAQS.map((f, idx) => {
    const isOpen = idx === openFaqIdx;
    return `
      <div class="rounded-xl bg-white border ${isOpen ? 'border-gold shadow-sm' : 'border-stone-200'} transition">
        <button type="button" data-faq-idx="${idx}" class="faq-toggle w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-ink">
          <span>${f.q}</span>
          <span class="w-7 h-7 rounded-full ${isOpen ? 'bg-gold text-espresso' : 'bg-cream text-ink'} flex items-center justify-center text-lg shrink-0 transition">${isOpen ? '&minus;' : '+'}</span>
        </button>
        <div class="${isOpen ? 'block' : 'hidden'} px-5 pb-4 text-sm text-muted leading-relaxed border-t border-stone-100 pt-3">
          ${f.a}
        </div>
      </div>
    `;
  }).join('');

  list.querySelectorAll('.faq-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.faqIdx);
      openFaqIdx = openFaqIdx === idx ? -1 : idx;
      renderFaqs();
    });
  });
}

const DRAWER_CONTENT = {
  company: `
    <div class="grid grid-cols-3 gap-2.5 text-center">
      <div class="bg-cream rounded-xl p-3 border border-stone-200"><div class="font-serif text-xl font-bold text-goldDark">300+</div><div class="text-[11px] text-muted">3D Renders</div></div>
      <div class="bg-cream rounded-xl p-3 border border-stone-200"><div class="font-serif text-xl font-bold text-goldDark">55+</div><div class="text-[11px] text-muted">In-House Team</div></div>
      <div class="bg-cream rounded-xl p-3 border border-stone-200"><div class="font-serif text-xl font-bold text-goldDark">4.9/5</div><div class="text-[11px] text-muted">4200+ Reviews</div></div>
    </div>
    <div class="space-y-3 pt-2">
      <div class="p-3.5 rounded-xl bg-cream/70 border border-stone-200"><strong class="text-ink block">01. Single-Team Accountability</strong><span class="text-xs text-muted">Design, factory production, and site installation handled under one roof.</span></div>
      <div class="p-3.5 rounded-xl bg-cream/70 border border-stone-200"><strong class="text-ink block">02. 3D Clarity Before Execution</strong><span class="text-xs text-muted">Approve layouts, materials, and lighting in 3D before work starts.</span></div>
      <div class="p-3.5 rounded-xl bg-cream/70 border border-stone-200"><strong class="text-ink block">03. Ghaziabad &amp; Delhi NCR Studio</strong><span class="text-xs text-muted">Visit us at L-08, GNB Mall, Raj Nagar Extension, Ghaziabad.</span></div>
    </div>
  `,
  services: `
    <div class="space-y-3">
      <div class="p-4 rounded-xl border border-stone-200">
        <h4 class="font-semibold text-ink">Full Home &amp; Villa Interior</h4>
        <p class="text-xs text-muted mt-1">Turnkey living, dining, bedrooms, false ceiling, and custom furniture.</p>
      </div>
      <div class="p-4 rounded-xl border border-stone-200">
        <h4 class="font-semibold text-ink">Modular Kitchen &amp; Wardrobe</h4>
        <p class="text-xs text-muted mt-1">Factory-finished modular kitchens, sliding wardrobes, and loft storage.</p>
      </div>
      <div class="p-4 rounded-xl border border-stone-200">
        <h4 class="font-semibold text-ink">Renovation &amp; Construction</h4>
        <p class="text-xs text-muted mt-1">Bathroom/kitchen remodeling, civil work, and commercial spaces.</p>
      </div>
    </div>
  `,
  work: `
    <p class="text-xs text-muted">Explore 12 curated interior design concepts across modular kitchens, villa living rooms, master suites, and marble washrooms.</p>
    <div class="grid grid-cols-2 gap-3">
      <img src="${IMG_HERO}" alt="Villa lounge" class="rounded-xl aspect-[4/3] object-cover" />
      <img src="${IMG_KITCHEN}" alt="Modular kitchen" class="rounded-xl aspect-[4/3] object-cover" />
      <img src="${IMG_BEDROOM}" alt="Master bedroom" class="rounded-xl aspect-[4/3] object-cover" />
      <img src="${IMG_WASHROOM}" alt="Marble washroom" class="rounded-xl aspect-[4/3] object-cover" />
    </div>
  `,
  enquire: `
    <div class="space-y-3 text-sm">
      <p class="text-muted">Speak directly with our studio team or request a callback via the consultation form.</p>
      <div class="p-4 rounded-xl bg-cream border border-stone-200 space-y-2">
        <div><span class="text-xs text-muted block">Phone</span><a href="tel:+919643431551" class="font-semibold text-ink">+91 96434 31551</a></div>
        <div><span class="text-xs text-muted block">Email</span><a href="mailto:info@jainstudio.co.in" class="font-semibold text-ink">info@jainstudio.co.in</a></div>
        <div><span class="text-xs text-muted block">Address</span><span class="text-xs text-ink">L-08, GNB Mall, Raj Nagar Extension, Ghaziabad 201017</span></div>
      </div>
    </div>
  `
};

function setDrawerTab(tab) {
  document.querySelectorAll('.drawer-tab').forEach(b => {
    const active = b.dataset.drawerTab === tab;
    b.className = active
      ? 'drawer-tab flex-1 py-3 text-xs font-semibold border-b-2 border-gold text-ink'
      : 'drawer-tab flex-1 py-3 text-xs font-medium border-b-2 border-transparent text-muted';
  });
  document.getElementById('drawerBody').innerHTML = DRAWER_CONTENT[tab] || DRAWER_CONTENT.company;
}

document.getElementById('openDrawerBtn').addEventListener('click', () => {
  setDrawerTab('company');
  document.getElementById('exploreDrawer').classList.remove('hidden');
});
document.getElementById('closeDrawerBtn').addEventListener('click', () => document.getElementById('exploreDrawer').classList.add('hidden'));
document.getElementById('drawerBackdrop').addEventListener('click', () => document.getElementById('exploreDrawer').classList.add('hidden'));
document.querySelectorAll('.drawer-tab').forEach(b => b.addEventListener('click', () => setDrawerTab(b.dataset.drawerTab)));
document.getElementById('drawerCtaBtn').addEventListener('click', () => {
  document.getElementById('exploreDrawer').classList.add('hidden');
  scrollToForm('Full Home Interior');
});

document.getElementById('leadForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('fullName').value.trim();
  const phone = document.getElementById('phone').value.trim().replace(/\D/g, '');
  const propertyType = document.getElementById('propertyType').value;
  const scope = document.getElementById('scope').value;
  const locality = document.getElementById('locality').value.trim() || 'Ghaziabad / Delhi NCR';
  const budget = document.getElementById('budget') ? document.getElementById('budget').value : 'Not decided yet';
  const errBox = document.getElementById('formError');

  if (!name || phone.length !== 10 || !propertyType) {
    errBox.textContent = 'Please enter your full name, a valid 10-digit mobile number, and your property type.';
    errBox.classList.remove('hidden');
    return;
  }
  errBox.classList.add('hidden');

  document.getElementById('submittedSummary').innerHTML = `
    <div><strong>Name:</strong> ${name}</div>
    <div><strong>Phone:</strong> +91 ${phone}</div>
    <div><strong>Property:</strong> ${propertyType}</div>
    <div><strong>Scope:</strong> ${scope}</div>
    <div><strong>Locality:</strong> ${locality}</div>
    <div><strong>Budget:</strong> ${budget}</div>
  `;
  document.getElementById('successModal').classList.remove('hidden');
  e.target.reset();
});

document.getElementById('closeSuccessModal').addEventListener('click', () => document.getElementById('successModal').classList.add('hidden'));
document.getElementById('successBackdrop').addEventListener('click', () => document.getElementById('successModal').classList.add('hidden'));

['heroWhatsappBtn', 'prefooterWhatsappBtn', 'mobileWhatsappBtn'].forEach(id => {
  document.getElementById(id).addEventListener('click', () => {
    showToast('WhatsApp demo action: opens chat with +91 96434 31551 (disabled in test preview).');
  });
});

document.querySelectorAll('[data-social]').forEach(btn => {
  btn.addEventListener('click', () => showToast(`${btn.dataset.social} profile link previewed (demo mode).`));
});

document.querySelectorAll('[data-policy]').forEach(btn => {
  btn.addEventListener('click', () => showToast(`${btn.dataset.policy} page placeholder for Jain Signature Studio LLP.`));
});

renderProjects();
renderFaqs();


// Scroll-Reveal & Stats Counter Animations
(function initAnimations() {
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revObs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = `${(i % 4) * 70}ms`;
          entry.target.classList.add('revealed');
          revObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => revObs.observe(el));

    const statEls = document.querySelectorAll('.stat-num');
    const statObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.target || 0);
        const suffix = el.dataset.suffix || '';
        const duration = 900;
        const start = performance.now();
        function step(now) {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        statObs.unobserve(el);
      });
    }, { threshold: 0.4 });
    statEls.forEach(el => statObs.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('revealed'));
  }
})();
