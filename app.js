/* grave.rest — app.js */

(function () {
  'use strict';

  window.GRAVE = {
      $: function (sel, root) { return (root || document).querySelector(sel); },
      $: function (sel, root) { return Array.from((root || document).querySelectorAll(sel)); },
      get body() { return document.body; },
      get sidebar() { return document.getElementById('sidebar'); },
      get stage() { return document.getElementById('stage'); },
      get crumb() { return document.getElementById('crumb'); },
      setCrumb: function (parts) { var c = document.getElementById('crumb'); if (!c) return; c.innerHTML = parts.map(function (p, i) { return i === parts.length - 1 ? '<span class="v">' + p + '</span>' : '<span>' + p + '</span> <span class="slash">/</span> '; }).join(''); },
      closeSidebarOnMobile: function () { var sb = document.getElementById('sidebar'); if (window.innerWidth <= 720 && sb) sb.classList.remove('open'); }
    };

    document.addEventListener('DOMContentLoaded', function () {
    var body = document.body;

    /* visitor id */
    var v = sessionStorage.getItem('grave_visitor');
    if (!v) {
      v = Math.random().toString(36).slice(2, 8).toUpperCase();
      sessionStorage.setItem('grave_visitor', v);
    }
    var vel = document.getElementById('visitor'); if (vel) vel.textContent = v;
    var sv = document.getElementById('stVisitor'); if (sv) sv.textContent = v;

    /* clock */
    function tick() {
      var c = document.getElementById('clock');
      if (c) c.textContent = new Date().toTimeString().slice(0, 8);
    }
    tick();
    setInterval(tick, 1000);

    /* visits */
    var visits = 0;
    try {
      visits = parseInt(localStorage.getItem('grave_visits') || '0', 10) + 1;
      localStorage.setItem('grave_visits', visits);
    } catch (e) {}
    var sVisits = document.getElementById('stVisits');
    if (sVisits) sVisits.textContent = visits;

    /* session timer */
    var t0 = Date.now();
    setInterval(function () {
      var s = document.getElementById('stSession');
      if (s) {
        var secs = Math.floor((Date.now() - t0) / 1000);
        var m = Math.floor(secs / 60);
        s.textContent = m ? (m + 'm ' + (secs % 60) + 's') : (secs + 's');
      }
    }, 1000);

    /* theme toggle */
    var tt = document.getElementById('themeToggle');
    var saved = 'dark';
    try { saved = localStorage.getItem('grave_theme') || 'dark'; } catch (e) {}
    if (saved === 'light') {
      body.classList.add('light');
      if (tt) tt.textContent = '[ light ]';
    }
    if (tt) {
      tt.addEventListener('click', function () {
        var light = body.classList.toggle('light');
        tt.textContent = light ? '[ light ]' : '[ dark ]';
        try { localStorage.setItem('grave_theme', light ? 'light' : 'dark'); } catch (e) {}
      });
    }

    /* nav */
    document.querySelectorAll('[data-open]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var key = a.getAttribute('data-open');
        if (key === 'tools') {
          var tp = document.getElementById('toolsPanel');
          if (tp) {
            tp.classList.add('open'); setTimeout(function(){ document.dispatchEvent(new CustomEvent('grave:tools-open')); }, 50);
          }
          return;
        }
        var ov = document.getElementById('ov-' + key);
        if (ov) ov.classList.add('open');
      });
    });

    /* close buttons */
    document.querySelectorAll('[data-close]').forEach(function (b) {
      b.addEventListener('click', function () {
        var ov = b.closest('.overlay');
        if (ov) ov.classList.remove('open');
      });
    });
    document.querySelectorAll('[data-close-tools]').forEach(function (b) {
      b.addEventListener('click', function () {
        var tp = document.getElementById('toolsPanel');
        if (tp) tp.classList.remove('open');
      });
    });

    /* esc */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.overlay.open').forEach(function (o) { o.classList.remove('open'); });
        var tp = document.getElementById('toolsPanel');
        if (tp) tp.classList.remove('open');
      }
    });

    /* expose GRAVE api for tools.js */
    window.GRAVE = {
      $: function (sel, root) { return (root || document).querySelector(sel); },
      $$: function (sel, root) { return Array.from((root || document).querySelectorAll(sel)); },
      body: body,
      sidebar: document.getElementById('sidebar'),
      stage: document.getElementById('stage'),
      crumb: document.getElementById('crumb'),
      setCrumb: function (parts) {
        var c = document.getElementById('crumb');
        if (!c) return;
        c.innerHTML = parts.map(function (p, i) {
          return i === parts.length - 1
            ? '<span class="v">' + p + '</span>'
            : '<span>' + p + '</span> <span class="slash">/</span> ';
        }).join('');
      },
      closeSidebarOnMobile: function () {
        var sb = document.getElementById('sidebar');
        if (window.innerWidth <= 720 && sb) sb.classList.remove('open');
      }
    };

    /* ascii figure (base64 so it can't get truncated) */
    var asciiB64 = "QUJD"; // placeholder, replaced below
    // decode and set
    var fig = document.getElementById('asciiFigure');
    if (fig && asciiB64.length > 10) {
      try {
        fig.textContent = decodeURIComponent(escape(atob(asciiB64)));
      } catch (e) {
        fig.textContent = '';
      }
    }
  });
})();


window.GRAVE.$$ = function (sel, root) { return Array.from((root || document).querySelectorAll(sel)); };
window.GRAVE.$ = function (sel, root) { return (root || document).querySelector(sel); };

