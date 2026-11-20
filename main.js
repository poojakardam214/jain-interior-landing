(function(){
  "use strict";

  /* ---------- year ---------- */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- dataLayer helper ---------- */
  function push(ev, data){
    window.dataLayer = window.dataLayer || [];
    var o = { event: ev };
    if (data) { for (var k in data) { if (Object.prototype.hasOwnProperty.call(data, k)) o[k] = data[k]; } }
    window.dataLayer.push(o);
  }

  /* ---------- modal ---------- */
  var ovl = document.getElementById('ovl');
  var lastFocus = null;

  function openModal(ctx){
    lastFocus = document.activeElement;
    var card = document.getElementById('modalcard');
    if (card) card.className = card.className.replace(/\s*is-sent/g, '');
    var chip = document.getElementById('modalCtx'), hid = document.getElementById('m-interest');
    if (chip) {
      if (ctx) { chip.innerHTML = 'You are enquiring about: <b></b>'; chip.querySelector('b').textContent = ctx; chip.className = 'ctx on'; }
      else { chip.className = 'ctx'; chip.textContent = ''; }
    }
    if (hid) hid.value = ctx || '';
    ovl.classList.add('on');
    document.body.style.overflow = 'hidden';
    var first = ovl.querySelector('input:not([type=hidden]),select');
    if (first) setTimeout(function(){ first.focus(); }, 60);
    push('lead_form_open', { context: ctx || '' });
  }
  function closeModal(){
    ovl.classList.remove('on');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener('click', function(e){
    var t = e.target.closest ? e.target.closest('[data-open]') : null;
    if (t) { e.preventDefault(); openModal(t.getAttribute('data-ctx')); }
    var again = e.target.closest ? e.target.closest('.lead__again') : null;
    if (again) {
      var c = again.closest('.is-sent');
      if (c) { c.className = c.className.replace(/\s*is-sent/g, ''); var f = c.querySelector('input:not([type=hidden])'); if (f) f.focus(); }
    }
  });
  document.getElementById('xbtn').addEventListener('click', closeModal);
  ovl.addEventListener('click', function(e){ if (e.target === ovl) closeModal(); });
  document.addEventListener('keydown', function(e){
    if (!ovl.classList.contains('on')) return;
    if (e.key === 'Escape') { closeModal(); return; }
    if (e.key === 'Tab') {                       // keep focus inside the modal
      var f = ovl.querySelectorAll('button:not([disabled]),input:not([type=hidden]),select,textarea,a[href]');
      var vis = Array.prototype.filter.call(f, function(el){ return el.offsetParent !== null; });
      if (!vis.length) return;
      var first = vis[0], last = vis[vis.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- validation + submit ---------- */
  function field(el){ return el.closest('[data-f]'); }

  function validate(form){
    var ok = true, firstBad = null;
    Array.prototype.forEach.call(form.querySelectorAll('[required]'), function(el){
      var wrap = field(el), val = (el.value || '').trim(), good;
      if (el.type === 'tel') {
        var d = val.replace(/\D/g, '');
        if (d.length === 12 && d.indexOf('91') === 0) d = d.slice(2);
        else if (d.length === 11 && d.charAt(0) === '0') d = d.slice(1);
        good = /^[6-9]\d{9}$/.test(d);
      } else {
        good = val.length > 1;
      }
      if (wrap) { if (good) { wrap.className = wrap.className.replace(/\s*is-bad/g, ''); } else if (wrap.className.indexOf('is-bad') < 0) { wrap.className += ' is-bad'; } }
      if (!good) { ok = false; if (!firstBad) firstBad = el; }
    });
    if (firstBad) firstBad.focus();
    return ok;
  }

  function wire(form, card){
    form.addEventListener('input', function(e){
      var wrap = field(e.target);
      if (wrap) wrap.className = wrap.className.replace(/\s*is-bad/g, '');
    });

    form.addEventListener('submit', function(e){
      e.preventDefault();
      if (!validate(form)) return;

      var btn = form.querySelector('button[type=submit]');
      var label = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Sending…';

      var payload = {};
      Array.prototype.forEach.call(form.elements, function(el){
        if (el.name) payload[el.name] = el.value;
      });

      // TODO: POST `payload` to your backend / CRM here, e.g.
      // fetch('mail.php', { method:'POST', body:new FormData(form) })
      setTimeout(function(){
        push('generate_lead', {
          form_location: form.id === 'modalform' ? 'modal'
                        : form.id === 'xpform'    ? 'explore_drawer'
                        : form.id === 'sdform'    ? 'service_drawer'
                        : 'hero',
          property_type: payload.property || '',
          scope: payload.scope || '',
          service: payload.service || ''
        });
        card.className += ' is-sent';
        btn.disabled = false;
        btn.innerHTML = label;
        form.reset();
      }, 650);
    });
  }

  wire(document.getElementById('leadform'),  document.getElementById('leadcard'));
  wire(document.getElementById('modalform'), document.getElementById('modalcard'));
  wire(document.getElementById('xpform'),    document.getElementById('xpcard'));

  /* ---------- click tracking ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('a[href^="tel:"]'), function(a){
    a.addEventListener('click', function(){ push('click_to_call'); });
  });
  Array.prototype.forEach.call(document.querySelectorAll('a[href*="wa.me"]'), function(a){
    a.addEventListener('click', function(){ push('click_whatsapp'); });
  });

  /* ---------- scroll reveal ---------- */
  var rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting) { en.target.className += ' in'; io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    Array.prototype.forEach.call(rv, function(el, i){
      el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + 'ms';
      io.observe(el);
    });
  } else {
    Array.prototype.forEach.call(rv, function(el){ el.className += ' in'; });
  }

  /* ---------- scroll depth ---------- */
  var marks = [25, 50, 75, 90], hit = {};
  window.addEventListener('scroll', function(){
    var h = document.documentElement;
    var denom = h.scrollHeight - h.clientHeight;
    if (denom <= 0) return;
    var pct = (h.scrollTop / denom) * 100;
    marks.forEach(function(m){
      if (pct >= m && !hit[m]) { hit[m] = 1; push('scroll_depth', { percent: m }); }
    });
  }, { passive: true });

  /* ================================================================ explore drawer
     Ported from iconictravel.in/lp (js/explore-panel.js). Opens dialog#xp-dlg from
     [data-xp-trigger]. Tabs: Company · Services · Our Work · Enquire. */
  (function(){
    var dlg = document.getElementById('xp-dlg');
    if (!dlg || typeof dlg.showModal !== 'function') return;

    var root     = document.documentElement;
    var body     = dlg.querySelector('[data-xp-body]');
    var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-xp-trigger]'));
    var tabBtns  = Array.prototype.slice.call(dlg.querySelectorAll('[data-xp-tab]'));
    var panels   = Array.prototype.slice.call(dlg.querySelectorAll('[data-xp-panel]'));
    var reduce   = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var cur = 'company', mem = {}, lastTrigger = null, closing = false, keepFocus = false;

    function focus(el){ if (el && el.focus) el.focus(); }
    function lock(on){ if (on) { root.className += ' xp-lock'; } else { root.className = root.className.replace(/\s*xp-lock/g, ''); } }
    function setExpanded(on){
      triggers.forEach(function(t){ t.setAttribute('aria-expanded', on ? 'true' : 'false'); });
    }

    function setTab(name, o){
      o = o || {};
      if (!dlg.querySelector('[data-xp-panel="' + name + '"]')) return;
      if (dlg.open && cur !== name) mem[cur] = body.scrollTop;
      cur = name;
      dlg.setAttribute('data-tab', name);
      tabBtns.forEach(function(b){
        var on = b.getAttribute('data-xp-tab') === name;
        b.setAttribute('aria-selected', on ? 'true' : 'false');
        b.tabIndex = on ? 0 : -1;
      });
      panels.forEach(function(p){ p.hidden = p.getAttribute('data-xp-panel') !== name; });
      body.scrollTop = o.top ? 0 : (mem[name] || 0);
      if (o.focusTab) focus(dlg.querySelector('[data-xp-tab="' + name + '"]'));
    }

    function open(tab, opener){
      if (dlg.open) { if (tab) setTab(tab, { top: true }); return; }
      lastTrigger = opener || document.activeElement;
      dlg.className = dlg.className.replace(/\s*is-closing/g, '');
      dlg.showModal();
      lock(true);
      setExpanded(true);
      setTab(tab || cur);
      focus(dlg.querySelector('[data-xp-tab="' + cur + '"]'));
      push('explore_open', { tab: cur });
    }

    // slides out, then closes; `after` runs once the page can scroll again
    function close(after){
      if (!dlg.open || closing) return;
      var done_ = false;
      var finish = function(){
        if (done_) return;            // animationend + the timeout can both land
        done_ = true;
        closing = false;
        dlg.className = dlg.className.replace(/\s*is-closing/g, '');
        dlg.close();                  // releases the top layer, then hand off
        if (after) after();
      };
      if (reduce) { finish(); return; }
      closing = true;
      var timer = setTimeout(finish, 400);
      dlg.addEventListener('animationend', function done(e){
        if (e.target !== dlg || e.pseudoElement || e.animationName !== 'xp-out') return;
        dlg.removeEventListener('animationend', done);
        clearTimeout(timer);
        finish();
      });
      dlg.className += ' is-closing';
    }

    dlg.addEventListener('close', function(){
      lock(false);
      setExpanded(false);
      if (keepFocus) { keepFocus = false; return; }
      if (lastTrigger && document.contains(lastTrigger)) focus(lastTrigger);
    });
    dlg.addEventListener('cancel', function(e){ e.preventDefault(); close(); });   // Esc

    triggers.forEach(function(t){
      t.setAttribute('aria-expanded', 'false');
      t.addEventListener('click', function(){ if (dlg.open) close(); else open(null, t); });
    });

    dlg.querySelector('[data-xp-close]').addEventListener('click', function(){ close(); });
    // click the backdrop (the dialog itself, outside .xp__panel)
    dlg.addEventListener('click', function(e){ if (e.target === dlg) close(); });

    /* ---------------- tabs */
    tabBtns.forEach(function(b){
      b.addEventListener('click', function(){ setTab(b.getAttribute('data-xp-tab'), { top: true }); });
    });
    dlg.querySelector('.xp__tabs').addEventListener('keydown', function(e){
      var i = tabBtns.indexOf(document.activeElement);
      if (i < 0 || !/^(ArrowLeft|ArrowRight|Home|End)$/.test(e.key)) return;
      e.preventDefault();
      var n = e.key === 'Home' ? 0
            : e.key === 'End' ? tabBtns.length - 1
            : (i + (e.key === 'ArrowRight' ? 1 : -1) + tabBtns.length) % tabBtns.length;
      setTab(tabBtns[n].getAttribute('data-xp-tab'), { focusTab: true });
    });

    /* ---------------- in-drawer actions */
    // close the drawer, then bring a page section into view (and focus it for keyboard users)
    function scrollToSection(sel){
      keepFocus = dlg.open && !closing;
      close(function(){
        var t = document.querySelector(sel);
        if (!t) return;
        var h = document.querySelector('.topbar');
        var pos = h ? getComputedStyle(h).position : '';
        var off = (pos === 'fixed' || pos === 'sticky') ? h.offsetHeight : 0;
        window.scrollTo({
          top: t.getBoundingClientRect().top + window.pageYOffset - off - 8,
          behavior: reduce ? 'auto' : 'smooth'
        });
        if (!t.hasAttribute('tabindex')) {
          t.setAttribute('tabindex', '-1');
          t.addEventListener('blur', function rm(){
            t.removeAttribute('tabindex');
            t.removeEventListener('blur', rm);
          });
        }
        focus(t);
      });
    }

    // SVGElement has no .closest in some browsers, and clicks land on the <svg>/<path>
    // inside these buttons - so walk up from a known-good Element ancestor.
    function up(node, attr){
      var el = (node && node.nodeType === 1) ? node : null;
      while (el && el !== dlg) {
        if (el.getAttribute && el.hasAttribute(attr)) return el;
        el = el.parentElement || el.parentNode;
      }
      return null;
    }

    dlg.addEventListener('click', function(e){
      var go = up(e.target, 'data-xp-go');
      if (go) { scrollToSection(go.getAttribute('data-xp-go')); return; }

      var tabGo = up(e.target, 'data-xp-tab-go');
      if (tabGo) { setTab(tabGo.getAttribute('data-xp-tab-go'), { top: true, focusTab: true }); return; }

    });
  })();

  /* ---------- TOP NAV: active link on click + on scroll ---------- */
  (function(){
    var nav = document.querySelector('.topnav');
    if (!nav) return;

    var links = [];
    Array.prototype.forEach.call(nav.querySelectorAll('a[href^="#"]'), function(a){
      var id = a.getAttribute('href').slice(1);
      var sec = id ? document.getElementById(id) : null;
      if (sec) links.push({ a: a, sec: sec });
    });
    if (!links.length) return;

    var bar = document.querySelector('.topbar');
    function barH(){ return bar ? bar.offsetHeight : 0; }

    // While a click-scroll animates, spy updates are suppressed so the highlight
    // doesn't flicker through every section it passes on the way.
    var locked = false, unlock = null, queued = false, current = null;

    function setActive(item){
      if (item === current) return;
      current = item;
      links.forEach(function(l){
        if (l === item) {
          l.a.className += (l.a.className ? ' ' : '') + 'is-active';
          l.a.setAttribute('aria-current', 'true');
        } else {
          l.a.className = l.a.className.replace(/\s*\bis-active\b/g, '');
          l.a.removeAttribute('aria-current');
        }
      });
    }

    function spy(){
      queued = false;
      if (locked) return;

      var line = barH() + 24;          // the section crossing just under the bar wins
      var doc = document.documentElement;
      var y = window.pageYOffset || doc.scrollTop;
      var atBottom = (y + window.innerHeight) >= (doc.scrollHeight - 2);

      var hit = null;
      links.forEach(function(l){
        var r = l.sec.getBoundingClientRect();
        if (r.top <= line && r.bottom > line) hit = l;
      });

      // Past the last tracked section (final CTA / footer) keep the last one lit.
      if (!hit && atBottom) hit = links[links.length - 1];

      // Above the first section (hero) nothing is active.
      setActive(hit);
    }

    function onScroll(){
      if (queued) return;
      queued = true;
      (window.requestAnimationFrame || function(f){ setTimeout(f, 16); })(spy);
    }

    // Smooth-scroll with an offset so the sticky bar doesn't cover the heading,
    // and mark the clicked link straight away rather than waiting for scroll.
    nav.addEventListener('click', function(e){
      var a = e.target;
      while (a && a !== nav && a.tagName !== 'A') a = a.parentNode;
      if (!a || a === nav) return;

      var match = null;
      links.forEach(function(l){ if (l.a === a) match = l; });
      if (!match) return;

      e.preventDefault();
      setActive(match);
      locked = true;

      var top = match.sec.getBoundingClientRect().top
              + (window.pageYOffset || document.documentElement.scrollTop)
              - barH() - 8;
      if (top < 0) top = 0;
      try { window.scrollTo({ top: top, behavior: 'smooth' }); }
      catch (err) { window.scrollTo(0, top); }

      if (history.replaceState) history.replaceState(null, '', a.getAttribute('href'));

      clearTimeout(unlock);
      unlock = setTimeout(function(){ locked = false; spy(); }, 700);
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('load', spy);
    spy();
  })();

  /* ================================================================ service drawer
     dialog#sd-dlg, opened from the buttons inside each service card's .svc__ft.
     One shell, three services: a trigger carries data-sd="<key>" and the content
     below is written into the panels on open. Tabs: About · Why Us · Gallery ·
     Process · Enquiry. Same open/close/lock behaviour as the explore drawer. */
  (function(){
    var dlg = document.getElementById('sd-dlg');
    if (!dlg || typeof dlg.showModal !== 'function') return;

    var U = 'https://images.unsplash.com/photo-';
    function proj(n){ return 'assets/projects/project-' + n + '.jpg'; }
    function img(id, w){ return U + id + '?auto=format&fit=crop&w=' + (w || 800) + '&q=70'; }

    // shared across all three services
    var STEPS = [
      ['Free consultation &amp; estimate', 'Talk to an interior designer about your space, scope and budget. You leave with a ballpark estimate, not a sales pitch.'],
      ['Detailed drawings &amp; 3D approval', 'We draw the space and deliver 3D renders. Nothing goes into production until you have signed off on the design.'],
      ['Production at our own factory', 'Your modular units are built in-house on machine-cut panels, so finish and fit stay consistent.'],
      ['Material delivery &amp; execution', 'Delivery, civil work, installation and finishing run against a written schedule managed by one site team.'],
      ['On-time handover', 'Final checks, cleaning and a walkthrough with you, then warranty papers at handover.']
    ];

    var PROMISE = [
      'A written, itemised quote &mdash; no &ldquo;to be decided later&rdquo; lines',
      'A staged schedule with milestone dates',
      '3D renders approved by you before production starts',
      'Material brands and warranty terms listed in your quote',
      'A project manager as your single point of contact'
    ];

    var SERVICES = {
      home: {
        kicker: 'Residential',
        name: 'Full Home Interior',
        hero: img('1586023492125-27b2c045efd7', 900),
        h: 'Complete interiors, designed and executed by one team',
        lead: 'Turnkey interiors for apartments, independent homes and villas. Design, factory production and on-site execution all stay with us, so there is one schedule, one quote and one team accountable from the first drawing to handover.',
        includes: [
          'Living, dining and bedroom interiors',
          'Modular kitchen and wardrobes',
          'False ceiling, lighting and electrical layout',
          'Wallpaper, wall panelling and wall decor',
          'Flooring, tiling and painting',
          'Loose furniture and furnishing'
        ],
        facts: [['3D', 'approval before production'], ['1', 'team, start to finish'], ['Free', 'consultation & estimate']],
        chips: ['TV unit &amp; panelling', 'Pooja unit', 'Study / work corner', 'Crockery unit', 'Balcony makeover', 'Smart lighting'],
        whyH: 'Why a turnkey home is safer with one company',
        whyLead: 'Most home interior projects go wrong in the gaps between vendors. We removed the gaps.',
        why: [
          ['No vendor handoffs', 'Carpenter, electrician, painter and site supervision are all ours. Nobody can blame the last trade for a delay.'],
          ['You approve the home in 3D first', 'Every room is rendered before a panel is cut, so layout and finish surprises get caught on screen, not on site.'],
          ['Factory-finished, not site-built', 'Modular units are machine-cut at our own factory, which keeps joinery, edge banding and alignment consistent.'],
          ['Brand materials on record', 'Plywood, laminates, hardware and paint are named in the quote with the brands we use, so you know what you paid for.']
        ],
        galH: 'Interiors from our portfolio',
        galLead: 'A selection of residential interiors from our project gallery.',
        gallery: [
          [proj(6), 'The Zen Rest Bedroom'],
          [proj(12), 'The CalmNest Suite'],
          [proj(11), 'Ambient Elegance Corner'],
          [proj(5), 'Contemporary Glow Panel Design']
        ],
        procLead: 'A full home runs through all five stages below. Your project manager confirms the schedule when you approve the design.',
        scope: ['1 BHK full interior', '2 BHK full interior', '3 BHK full interior', '4 BHK / villa interior', 'Partial interior (a few rooms)', 'Not sure yet']
      },

      modular: {
        kicker: 'Modular',
        name: 'Modular Kitchen &amp; Wardrobe',
        hero: img('1600489000022-c2086d79f9d4', 900),
        h: 'Factory-finished modular units built to your exact space',
        lead: 'Modular kitchens and wardrobes made at our own factory to your measurements, layout and storage habits &mdash; then installed by our own fitters. Machine-cut panels and branded hardware mean the fit on site matches the drawing.',
        includes: [
          'Modular kitchens in L, U, parallel, straight and island layouts',
          'Sliding and hinged wardrobes',
          'Tall units, pull-outs and corner solutions',
          'Soft-close hinges and channels',
          'Counter tops, backsplash and sink cut-outs',
          'Loft storage and bedroom storage units'
        ],
        facts: [['In-house', 'factory production'], ['3D', 'approval before production'], ['Free', 'consultation & estimate']],
        chips: ['Pull-out basket', 'Tandem pantry', 'Corner carousel', 'Profile shutter lights', 'Mirror wardrobe', 'Chimney &amp; hob'],
        whyH: 'Why our modular work holds up',
        whyLead: 'A modular unit is only as good as its panel, its hardware and the hands that fit it. All three are ours.',
        why: [
          ['Our own factory, not an outsourced one', 'Panels are cut and edge-banded on machines we run, so tolerances stay tight and finishing is consistent across units.'],
          ['Measured, not estimated', 'Site measurements are taken after civil work, so shutters and fillers fit the real wall, not a plan drawing.'],
          ['Hardware you can look up', 'Hinges, channels and pull-outs are named brands listed in your quote, with warranty.'],
          ['Installed by our fitters', 'The team that installs reports to us, so alignment, levelling and gaps get fixed before we call it done.']
        ],
        galH: 'Kitchens and wardrobes from our portfolio',
        galLead: 'A selection from our project gallery.',
        gallery: [
          [proj(1), 'Ivory Gallery Kitchen'],
          [proj(2), 'Aurora Line Modular Kitchen'],
          [proj(4), 'The Horizon Slide Closet'],
          [proj(8), 'The Signature Marble Kitchen']
        ],
        procLead: 'Modular work follows the same five stages. The delivery schedule is confirmed in writing at design approval.',
        scope: ['Modular kitchen only', 'Wardrobes only', 'Kitchen + wardrobes', 'Bedroom storage / loft', 'Replace an existing kitchen', 'Not sure yet']
      },

      renovation: {
        kicker: 'Build',
        name: 'Renovation &amp; Construction',
        hero: img('1600566753086-00f18fb6b3ea', 900),
        h: 'Civil work and renovation managed on one schedule',
        lead: 'From a single bathroom to a complete floor, office or building &mdash; demolition, civil work, plumbing, electrical, flooring and finishing run under one site team and one written schedule, with 3D visualization before work begins.',
        includes: [
          'Bathroom and kitchen renovation',
          'Flooring, tiling and waterproofing',
          'Plumbing and electrical rework',
          'False ceiling, POP and painting',
          'Office and commercial interiors',
          'Building design and 3D visualization'
        ],
        facts: [['Single', 'site team'], ['Staged', 'milestone schedule'], ['Free', 'estimate before you commit']],
        chips: ['Waterproofing', 'Structural glazing', 'Partition walls', 'Terrace / balcony work', 'Facade &amp; elevation', 'Reception &amp; cabins'],
        whyH: 'Why renovation goes smoother with us',
        whyLead: 'Renovation is mostly sequencing. One team holding the sequence is what keeps a site from stalling.',
        why: [
          ['One schedule, every trade', 'Civil, plumbing, electrical and finishing are sequenced by us, so no trade waits on another to show up.'],
          ['Scope agreed before demolition', 'We survey the existing structure and fix the scope in writing first, which is where most renovation overruns start.'],
          ['See the result first', 'Even for civil work you get 3D visualization, so you are approving a finished look, not a description.'],
          ['Clean, contained site', 'Dust control, debris removal and daily site cleanup are part of the job, not an extra.']
        ],
        galH: 'Washroom and finishing work from our portfolio',
        galLead: 'A selection from our project gallery. Ask our designer about site examples of renovation and civil work.',
        gallery: [
          [proj(3), 'The Aura Marble Washroom'],
          [proj(10), 'Aurum Curve Designer Door'],
          [proj(7), 'Golden Glow Feature Panel'],
          [proj(9), 'The Nova Marble Kitchen']
        ],
        procLead: 'Renovation follows the same five stages; the production stage covers civil work and any modular units together.',
        scope: ['Bathroom renovation', 'Kitchen renovation', 'Full home renovation', 'Office / commercial fit-out', 'New construction', 'Not sure yet']
      }
    };

    var root     = document.documentElement;
    var body     = dlg.querySelector('[data-sd-body]');
    var tabBtns  = Array.prototype.slice.call(dlg.querySelectorAll('[data-sd-tab]'));
    var panels   = Array.prototype.slice.call(dlg.querySelectorAll('[data-sd-panel]'));
    var reduce   = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // triggers live outside the dialog; [data-sd-tab] inside it means something else
    var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-sd]'))
      .filter(function(t){ return !dlg.contains(t); });
    if (!triggers.length) return;

    var cur = 'about', curKey = null, mem = {}, lastTrigger = null,
        closing = false, keepFocus = false;

    function q(sel){ return dlg.querySelector(sel); }
    function focus(el){ if (el && el.focus) el.focus(); }
    function lock(on){ if (on) { root.className += ' xp-lock'; } else { root.className = root.className.replace(/\s*xp-lock/g, ''); } }
    function esc(s){ return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
    function plain(html){ var d = document.createElement('div'); d.innerHTML = html; return d.textContent || ''; }

    var TICK = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';

    /* ---------------- fill the shell for one service */
    function render(key){
      var s = SERVICES[key];
      if (!s || curKey === key) return !!s;
      curKey = key;
      mem = {};                                   // scroll memory is per service

      q('[data-sd-kicker]').innerHTML = s.kicker;
      q('[data-sd-title]').innerHTML  = s.name;
      q('[data-sd-name]').innerHTML   = s.name;

      var hero = q('[data-sd-hero]');
      hero.src = s.hero;
      hero.alt = plain(s.name);

      q('[data-sd-h]').innerHTML    = s.h;
      q('[data-sd-lead]').innerHTML = s.lead;

      q('[data-sd-includes]').innerHTML = s.includes.map(function(t){
        return '<li>' + TICK + '<span>' + t + '</span></li>';
      }).join('');

      q('[data-sd-facts]').innerHTML = s.facts.map(function(f){
        return '<div><dt>' + f[0] + '</dt><dd>' + f[1] + '</dd></div>';
      }).join('');

      q('[data-sd-chips]').innerHTML = s.chips.map(function(c){
        return '<li>' + c + '</li>';
      }).join('');

      q('[data-sd-why-h]').innerHTML    = s.whyH;
      q('[data-sd-why-lead]').innerHTML = s.whyLead;
      q('[data-sd-why]').innerHTML = s.why.map(function(w){
        return '<li><b>' + w[0] + '</b><span>' + w[1] + '</span></li>';
      }).join('');

      q('[data-sd-promise]').innerHTML = PROMISE.map(function(t){
        return '<li>' + TICK + '<span>' + t + '</span></li>';
      }).join('');

      q('[data-sd-gal-h]').innerHTML    = s.galH;
      q('[data-sd-gal-lead]').innerHTML = s.galLead;
      q('[data-sd-gallery]').innerHTML = s.gallery.map(function(g){
        return '<img src="' + esc(g[0]) + '" alt="' + esc(g[1]) + '" loading="lazy">';
      }).join('');

      q('[data-sd-proc-lead]').innerHTML = s.procLead;
      q('[data-sd-steps]').innerHTML = STEPS.map(function(st){
        return '<li><b>' + st[0] + '</b><span>' + st[1] + '</span></li>';
      }).join('');

      // the enquiry form carries the service, and its scope list is service-specific
      q('[data-sd-service]').value = plain(s.name);
      q('[data-sd-scope]').innerHTML = '<option value="">Select</option>' + s.scope.map(function(o){
        return '<option>' + o + '</option>';
      }).join('');

      var wa = q('[data-sd-wa]');
      wa.href = 'https://wa.me/919643431551?text=' +
        encodeURIComponent('Hi, I’d like a quote for ' + plain(s.name));

      dlg.setAttribute('data-service', key);
      return true;
    }

    function setTab(name, o){
      o = o || {};
      if (!dlg.querySelector('[data-sd-panel="' + name + '"]')) return;
      if (dlg.open && cur !== name) mem[cur] = body.scrollTop;
      cur = name;
      dlg.setAttribute('data-tab', name);
      tabBtns.forEach(function(b){
        var on = b.getAttribute('data-sd-tab') === name;
        b.setAttribute('aria-selected', on ? 'true' : 'false');
        b.tabIndex = on ? 0 : -1;
      });
      panels.forEach(function(p){ p.hidden = p.getAttribute('data-sd-panel') !== name; });
      body.scrollTop = o.top ? 0 : (mem[name] || 0);
      if (o.focusTab) focus(dlg.querySelector('[data-sd-tab="' + name + '"]'));
    }

    function open(key, tab, opener){
      if (!render(key)) return;
      if (dlg.open) { setTab(tab || 'about', { top: true }); return; }
      lastTrigger = opener || document.activeElement;
      dlg.className = dlg.className.replace(/\s*is-closing/g, '');
      dlg.showModal();
      lock(true);
      setTab(tab || 'about', { top: true });
      focus(dlg.querySelector('[data-sd-tab="' + cur + '"]'));
      push('service_drawer_open', { service: plain(SERVICES[key].name), tab: cur });
    }

    // slides out, then closes; `after` runs once the page can scroll again
    function close(after){
      if (!dlg.open || closing) return;
      var done_ = false;
      var finish = function(){
        if (done_) return;              // animationend and the timeout can both land
        done_ = true;
        closing = false;
        dlg.className = dlg.className.replace(/\s*is-closing/g, '');
        dlg.close();
        if (after) after();
      };
      if (reduce) { finish(); return; }
      closing = true;
      var timer = setTimeout(finish, 400);
      dlg.addEventListener('animationend', function done(e){
        if (e.target !== dlg || e.pseudoElement || e.animationName !== 'xp-out') return;
        dlg.removeEventListener('animationend', done);
        clearTimeout(timer);
        finish();
      });
      dlg.className += ' is-closing';
    }

    dlg.addEventListener('close', function(){
      lock(false);
      triggers.forEach(function(t){
        if (t.hasAttribute('aria-expanded')) t.setAttribute('aria-expanded', 'false');
      });
      if (keepFocus) { keepFocus = false; return; }
      if (lastTrigger && document.contains(lastTrigger)) focus(lastTrigger);
    });
    dlg.addEventListener('cancel', function(e){ e.preventDefault(); close(); });   // Esc

    triggers.forEach(function(t){
      t.addEventListener('click', function(){
        var key = t.getAttribute('data-sd');
        var tab = t.getAttribute('data-sd-tab') || 'about';
        if (t.hasAttribute('aria-expanded')) t.setAttribute('aria-expanded', 'true');
        open(key, tab, t);
      });
    });

    q('[data-sd-close]').addEventListener('click', function(){ close(); });
    // click the backdrop (the dialog itself, outside .xp__panel)
    dlg.addEventListener('click', function(e){ if (e.target === dlg) close(); });

    /* ---------------- tabs */
    tabBtns.forEach(function(b){
      b.addEventListener('click', function(){ setTab(b.getAttribute('data-sd-tab'), { top: true }); });
    });
    dlg.querySelector('.xp__tabs').addEventListener('keydown', function(e){
      var i = tabBtns.indexOf(document.activeElement);
      if (i < 0 || !/^(ArrowLeft|ArrowRight|Home|End)$/.test(e.key)) return;
      e.preventDefault();
      var n = e.key === 'Home' ? 0
            : e.key === 'End' ? tabBtns.length - 1
            : (i + (e.key === 'ArrowRight' ? 1 : -1) + tabBtns.length) % tabBtns.length;
      setTab(tabBtns[n].getAttribute('data-sd-tab'), { focusTab: true });
    });

    /* ---------------- in-drawer actions */
    function scrollToSection(sel){
      keepFocus = dlg.open && !closing;
      close(function(){
        var t = document.querySelector(sel);
        if (!t) return;
        var h = document.querySelector('.topbar');
        var pos = h ? getComputedStyle(h).position : '';
        var off = (pos === 'fixed' || pos === 'sticky') ? h.offsetHeight : 0;
        window.scrollTo({
          top: t.getBoundingClientRect().top + window.pageYOffset - off - 8,
          behavior: reduce ? 'auto' : 'smooth'
        });
        if (!t.hasAttribute('tabindex')) {
          t.setAttribute('tabindex', '-1');
          t.addEventListener('blur', function rm(){
            t.removeAttribute('tabindex');
            t.removeEventListener('blur', rm);
          });
        }
        focus(t);
      });
    }

    // clicks land on the <svg>/<path> inside these buttons, and SVGElement has no
    // .closest in some browsers - so walk up from a known-good Element ancestor.
    function up(node, attr){
      var el = (node && node.nodeType === 1) ? node : null;
      while (el && el !== dlg) {
        if (el.getAttribute && el.hasAttribute(attr)) return el;
        el = el.parentElement || el.parentNode;
      }
      return null;
    }

    dlg.addEventListener('click', function(e){
      var go = up(e.target, 'data-sd-go');
      if (go) { scrollToSection(go.getAttribute('data-sd-go')); return; }

      var tabGo = up(e.target, 'data-sd-tab-go');
      if (tabGo) { setTab(tabGo.getAttribute('data-sd-tab-go'), { top: true, focusTab: true }); return; }
    });

    wire(document.getElementById('sdform'), document.getElementById('sdcard'));
  })();


  /* ================================================================ V2 additions */

  /* ---------- projects: category filter + show more ---------- */
  (function(){
    var grid = document.getElementById('pjGrid');
    if (!grid) return;
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.pj-card'));
    var chips = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
    var more = document.getElementById('pjMore');
    var count = document.getElementById('pjCount');
    var LIMIT = 6, filter = 'all', expanded = false;

    function render(){
      var shown = 0;
      cards.forEach(function(c, i){
        var cats = (c.getAttribute('data-cat') || '').split(' ');
        var match = filter === 'all' || cats.indexOf(filter) > -1;
        var vis = match && (filter !== 'all' || expanded || i < LIMIT);
        c.hidden = !vis;
        if (vis) { shown++; if (c.className.indexOf(' in') < 0) c.className += ' in'; }
      });
      chips.forEach(function(b){ b.setAttribute('aria-pressed', b.getAttribute('data-filter') === filter ? 'true' : 'false'); });
      if (more) {
        more.style.display = filter === 'all' ? '' : 'none';
        more.textContent = expanded ? 'Show fewer projects' : 'Show all ' + cards.length + ' projects';
        more.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      }
      if (count) count.textContent = 'Showing ' + shown + ' of ' + cards.length + ' projects';
    }
    chips.forEach(function(b){
      b.addEventListener('click', function(){ filter = b.getAttribute('data-filter'); render(); push('project_filter', { category: filter }); });
    });
    if (more) more.addEventListener('click', function(){
      expanded = !expanded; render();
      if (!expanded) { var s = document.getElementById('work'); if (s) s.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
    render();
  })();

  /* ---------- image fallback: local assets/ -> live image host ---------- */
  (function(){
    var LIVE = 'https://digitalmarketingdoctor.in/lp/2026/oct/jain-interior/images/';
    function swap(t){
      var s = t.getAttribute('src') || '';
      if (t.getAttribute('data-fb') || s.indexOf('assets/') !== 0) return;
      t.setAttribute('data-fb', '1');
      t.src = LIVE + s.slice(7);
    }
    Array.prototype.forEach.call(document.images, function(im){ if (im.complete && im.naturalWidth === 0) swap(im); });
  })();

})();