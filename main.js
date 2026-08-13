/* ============================================================
   PIXEL SPEED SIM RACING — shared behaviour
   Vanilla JS, no dependencies. Loaded with `defer` on every page.
   ============================================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- footer year ---------- */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- sticky header condenses on scroll ---------- */
  var header = document.querySelector('.header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- mobile drawer ---------- */
  var burger = document.querySelector('.burger');
  var drawer = document.getElementById('drawer');
  if (burger && drawer) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      drawer.classList.toggle('is-open', !open);
    });
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        burger.setAttribute('aria-expanded', 'false');
        drawer.classList.remove('is-open');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        burger.setAttribute('aria-expanded', 'false');
        drawer.classList.remove('is-open');
        burger.focus();
      }
    });
  }

  /* ---------- scroll reveal ---------- */
  var reveals = document.querySelectorAll('[data-reveal]');
  if (reveals.length) {
    if (reduced || !('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var delay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
          setTimeout(function () { el.classList.add('is-in'); }, delay);
          io.unobserve(el);
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
      reveals.forEach(function (el) { io.observe(el); });

      // The -12% margin means the bottom slice of the first screen waits for a
      // scroll. On a viewport tall enough to show the whole page there is no
      // scroll coming, so reveal everything rather than leave it invisible.
      var rescue = function () {
        if (document.documentElement.scrollHeight > window.innerHeight + 8) return;
        reveals.forEach(function (el) { el.classList.add('is-in'); });
      };
      window.addEventListener('load', rescue);
      window.addEventListener('resize', rescue);
    }
  }

  /* ---------- "How It Works" connector line draws itself ---------- */
  var steps = document.querySelector('.steps');
  if (steps) {
    if (reduced || !('IntersectionObserver' in window)) {
      steps.classList.add('is-in');
    } else {
      var sio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          sio.unobserve(entry.target);
        });
      }, { threshold: 0.3 });
      sio.observe(steps);
    }
  }

  /* ---------- stat count-up ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    var runCount = function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      var prefix = el.getAttribute('data-prefix') || '';
      if (reduced) { el.textContent = prefix + target.toFixed(decimals); return; }
      var start = null;
      var dur = 1300;
      var tick = function (ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + (target * eased).toFixed(decimals);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if (!('IntersectionObserver' in window)) {
      counters.forEach(runCount);
    } else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runCount(entry.target);
          cio.unobserve(entry.target);
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { cio.observe(el); });
    }
  }

  /* ---------- subtle hero parallax ---------- */
  var heroMedia = document.querySelector('.hero__media');
  if (heroMedia && !reduced) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < 900) heroMedia.style.transform = 'translateY(' + (y * 0.14) + 'px)';
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- card hover tilt ---------- */
  var tilts = document.querySelectorAll('[data-tilt]');
  if (tilts.length && !reduced && window.matchMedia('(hover:hover)').matches) {
    tilts.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          'translateY(-6px) perspective(900px) rotateX(' + (-py * 4).toFixed(2) +
          'deg) rotateY(' + (px * 5).toFixed(2) + 'deg)';
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });
  }

  /* ---------- enquiry forms ---------- */
  var forms = document.querySelectorAll('.form');
  forms.forEach(function (form) {
    var status = form.querySelector('.form-status');

    var setError = function (field, msg) {
      var input = field.querySelector('input, select, textarea');
      var slot = field.querySelector('.err');
      if (!slot) {
        slot = document.createElement('p');
        slot.className = 'err';
        field.appendChild(slot);
      }
      slot.textContent = msg || '';
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      return !msg;
    };

    form.addEventListener('submit', function (e) {
      var ok = true;
      var firstBad = null;

      form.querySelectorAll('.field').forEach(function (field) {
        var input = field.querySelector('input, select, textarea');
        if (!input || !input.required) return;
        var value = input.value.trim();
        var msg = '';
        if (!value) {
          msg = 'This one is required';
        } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
          msg = 'Check the email address';
        } else if (input.type === 'tel' && value.replace(/\D/g, '').length < 10) {
          msg = 'Enter a 10-digit phone number';
        }
        if (!setError(field, msg)) {
          ok = false;
          if (!firstBad) firstBad = input;
        }
      });

      if (!ok) {
        e.preventDefault();
        if (firstBad) firstBad.focus();
        return;
      }

      // Mockup: no endpoint is wired up yet, so hand the visitor the phone
      // number instead of silently swallowing an enquiry.
      if ((form.getAttribute('action') || '').indexOf('/f/demo') !== -1) {
        e.preventDefault();
        if (status) {
          status.hidden = false;
          status.innerHTML =
            'This form is not connected yet. Call or text ' +
            '<a class="link-red" href="tel:+19453339115">945-333-9115</a> ' +
            'and we will get you on the grid.';
          status.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
        }
      }
    });
  });
})();
