(function () {
  'use strict';

  const { SHEETS, DEMOS, DemoPlayer, Keys } = window;
  const esc = Keys.esc;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage blocked */ } },
  };
  const byId = Object.fromEntries(SHEETS.map((s) => [s.id, s]));
  const narrow = matchMedia('(max-width: 720px)');

  const state = { tool: null, q: '', held: new Set(), hideGnu: store.get('ks-hide-gnu') === '1' };
  const panels = {};
  const rows = {};
  const players = {};

  // ---------- Hero: tool names spelled in keycaps
  const words = $('#words');
  SHEETS.forEach((sh) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'word';
    b.id = `tab-${sh.id}`;
    b.dataset.tool = sh.id;
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-controls', `panel-${sh.id}`);
    b.setAttribute('aria-label', sh.name);
    b.innerHTML = [...sh.name].map((ch, i) => `<span class="lc" style="--i:${i}" aria-hidden="true">${ch}</span>`).join('');
    b.addEventListener('click', () => setTool(sh.id, { animate: true }));
    words.append(b);
  });
  words.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const ids = SHEETS.map((s) => s.id);
    const i = (ids.indexOf(state.tool) + (e.key === 'ArrowRight' ? 1 : -1) + ids.length) % ids.length;
    setTool(ids[i], { animate: true });
    $(`#tab-${ids[i]}`).focus();
    e.preventDefault();
  });

  // Compact switcher in the top bar (shows once the hero scrolls away)
  const mini = $('#mini');
  mini.innerHTML = SHEETS.map((sh) => `<button type="button" data-tool="${sh.id}">${sh.name}</button>`).join('');
  mini.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    setTool(b.dataset.tool, { animate: true });
    $('#panels').scrollIntoView({ block: 'start', behavior: reduced ? 'auto' : 'smooth' });
  });

  // ---------- Panels
  const HINTS = `<p class="hints">
      <span><span class="cap sm">/</span> search</span>
      <span><span class="cap sm">1</span><span class="cap sm">2</span><span class="cap sm">3</span> switch tool</span>
      <span>Hold <span class="cap sm">⌃</span><span class="cap sm">⌥</span><span class="cap sm">⌘</span> or <span class="cap sm">⇧</span> to light up the shortcuts that use it</span>
    </p>`;

  function tipHTML(t) {
    return `<div class="tip">
      <p>${t.text}</p>
      ${t.cmd ? `<div class="tip-cmd">${Keys.render({ c: t.cmd })}</div>` : ''}
      ${t.gnuToggle ? `<label class="switch"><input type="checkbox" data-gnu-toggle${state.hideGnu ? ' checked' : ''}><span class="track" aria-hidden="true"></span><span>Hide GNU-only shortcuts</span></label>` : ''}
    </div>`;
  }

  function legendHTML(sh) {
    if (!sh.legend.length) return '';
    return `<ul class="legend${sh.legend[0].mode ? ' modes' : ''}">${sh.legend
      .map((l) => `<li>${l.mode ? `<span class="mode">${l.mode}</span>` : Keys.render(l.keys, { static: true })}<span>${l.text}</span></li>`)
      .join('')}</ul>`;
  }

  function buildPanel(sh) {
    const meta = [];
    const sections = sh.sections
      .map((sec, si) => {
        const items = sec.rows
          .map((r) => {
            const spec = r.c ? [].concat(r.c).map((c) => ({ c })) : r.k;
            const nat = sh.native && r.k ? Keys.native(r.k) : '';
            const gnu = !!(r.gnu || sec.gnu);
            meta.push({
              r, gnu,
              chords: r.k ? Keys.chords(r.k) : [],
              hay: [r.d, (r.n || '').replace(/<[^>]+>/g, ''), sec.title, Keys.text(spec), nat].join(' ').toLowerCase(),
            });
            return `<li class="row${r.c ? ' stack' : ''}"${gnu ? ' data-gnu' : ''}>
              <div class="keys">${Keys.render(spec)}${nat ? `<span class="nat" aria-hidden="true">${esc(nat)}</span>` : ''}</div>
              <div class="desc"><p class="d"><span class="dt">${esc(r.d)}</span>${gnu && sh.native ? '<span class="tag">GNU nano</span>' : ''}</p>${r.n ? `<p class="n">${r.n}</p>` : ''}</div>
            </li>`;
          })
          .join('');
        return `<section class="sec" id="${sh.id}-${si}" aria-labelledby="${sh.id}-${si}-h">
          <h3 id="${sh.id}-${si}-h">${sec.title}</h3>
          ${sec.note ? `<p class="sn">${sec.note}</p>` : ''}
          <ul class="list">${items}</ul>
        </section>`;
      })
      .join('');

    const p = document.createElement('section');
    p.className = 'panel';
    p.id = `panel-${sh.id}`;
    p.dataset.tool = sh.id;
    p.hidden = true;
    p.setAttribute('role', 'tabpanel');
    p.setAttribute('aria-labelledby', `tab-${sh.id}`);
    p.innerHTML = `
      <h2 class="print-title">${sh.name}</h2>
      <div class="intro">
        <div class="intro-text">
          <p class="lede">${sh.lede}</p>
          ${legendHTML(sh)}
          ${sh.tips.map(tipHTML).join('')}
        </div>
        <figure class="demo">
          <div class="screen" aria-hidden="true"></div>
          <figcaption class="hud">
            <div class="hud-keys"></div>
            <p class="hud-say" aria-live="off"></p>
            <div class="hud-ctrl"><div class="dots"></div><button type="button" class="play"></button></div>
          </figcaption>
        </figure>
      </div>
      <nav class="jump" aria-label="${sh.name} sections">${sh.sections.map((s, i) => `<a href="#${sh.id}-${i}" data-jump="${sh.id}-${i}">${s.title}</a>`).join('')}</nav>
      ${HINTS}
      <div class="sections">${sections}</div>
      <div class="empty" hidden></div>`;
    $('#panels').append(p);

    panels[sh.id] = p;
    rows[sh.id] = $$('.row', p).map((el, i) => ({ ...meta[i], el, dt: $('.dt', el) }));
    players[sh.id] = new DemoPlayer($('.demo', p), DEMOS[sh.id], { autoplay: !reduced });
  }
  SHEETS.forEach(buildPanel);

  // Run each demo only while it's on screen
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      const pl = players[en.target.closest('.panel').dataset.tool];
      pl.visible = en.isIntersecting;
      pl.sync();
    });
  }, { threshold: 0.15 });
  $$('.demo').forEach((d) => io.observe(d));
  document.addEventListener('visibilitychange', () => Object.values(players).forEach((p) => p.sync()));

  // ---------- Switching tools
  function setTool(id, opts = {}) {
    if (!byId[id]) id = SHEETS[0].id;
    const same = state.tool === id;
    state.tool = id;
    root.dataset.tool = id;
    SHEETS.forEach((sh) => {
      const on = sh.id === id;
      panels[sh.id].hidden = !on;
      const t = $(`#tab-${sh.id}`);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      players[sh.id].active = on;
      players[sh.id].sync();
    });
    $$('#mini button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tool === id)));
    $('#q').placeholder = narrow.matches ? 'Search' : `Search ${byId[id].name} shortcuts`;
    if (location.hash !== `#${id}` && !/^#\w+-\d+$/.test(location.hash)) history.replaceState(null, '', `#${id}`);
    if (opts.animate && !same && !reduced) typeWord(id);
    state.held.clear();
    refresh();
    light();
  }

  function typeWord(id) {
    const w = $(`#tab-${id}`);
    w.classList.remove('typing');
    void w.offsetWidth;
    w.classList.add('typing');
    clearTimeout(w._t);
    w._t = setTimeout(() => w.classList.remove('typing'), 1200);
  }

  // ---------- Search
  const q = $('#q');
  q.addEventListener('input', () => {
    state.q = q.value;
    refresh();
    if (state.q && window.scrollY > $('#panels').offsetTop) $('#panels').scrollIntoView({ block: 'start' });
  });
  q.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      clearSearch();
      q.blur();
    }
  });

  function clearSearch() {
    q.value = '';
    state.q = '';
    refresh();
  }

  const tokens = (s) => s.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const matches = (row, toks) => toks.every((t) => row.hay.includes(t));
  const shown = (row, toks) => matches(row, toks) && !(state.hideGnu && row.gnu);

  function highlight(text, toks) {
    const lower = text.toLowerCase();
    const mark = new Array(text.length).fill(false);
    toks.forEach((t) => {
      for (let i = lower.indexOf(t); i !== -1; i = lower.indexOf(t, i + t.length)) {
        for (let j = i; j < i + t.length; j++) mark[j] = true;
      }
    });
    let out = '';
    let open = false;
    for (let i = 0; i < text.length; i++) {
      if (mark[i] !== open) {
        out += open ? '</mark>' : '<mark>';
        open = mark[i];
      }
      out += esc(text[i]);
    }
    return out + (open ? '</mark>' : '');
  }

  function refresh() {
    const id = state.tool;
    const p = panels[id];
    const toks = tokens(state.q);
    root.classList.toggle('hide-gnu', state.hideGnu);
    p.classList.toggle('searching', toks.length > 0);

    let count = 0;
    rows[id].forEach((row) => {
      const ok = shown(row, toks);
      row.el.hidden = !ok;
      if (ok) count++;
      row.dt.innerHTML = toks.length && ok ? highlight(row.r.d, toks) : esc(row.r.d);
    });
    $$('.sec', p).forEach((sec) => {
      sec.hidden = !$$('.row', sec).some((el) => !el.hidden);
    });

    const empty = $('.empty', p);
    if (toks.length && !count) {
      const others = SHEETS.filter((s) => s.id !== id)
        .map((s) => ({ s, n: rows[s.id].filter((r) => shown(r, toks)).length }))
        .filter((o) => o.n);
      empty.innerHTML = `
        <p class="empty-t">No ${byId[id].name} shortcut matches “${esc(state.q.trim())}”.</p>
        <div class="acts">
          ${others.map((o) => `<button type="button" class="btn primary" data-goto="${o.s.id}">Show ${o.n} in ${o.s.name}</button>`).join('')}
          <button type="button" class="btn" data-clear>Clear search</button>
        </div>`;
      empty.hidden = false;
    } else {
      empty.hidden = true;
    }
  }

  // ---------- Hold a modifier to light up shortcuts
  const MODKEY = { Control: 'ctrl', Alt: 'alt', Meta: 'cmd', Shift: 'shift' };

  function light() {
    const p = panels[state.tool];
    const held = state.held;
    p.classList.toggle('holding', held.size > 0);
    rows[state.tool].forEach((r) => {
      const lit = held.size > 0 && r.chords.some((c) => [...held].every((m) => c.mods.has(m)));
      r.el.classList.toggle('lit', lit);
    });
    $$('.cap.mod[data-m], .hints .cap', p).forEach((c) => {
      const m = c.dataset.m || { '⌃': 'ctrl', '⌥': 'alt', '⌘': 'cmd', '⇧': 'shift' }[c.textContent];
      c.classList.toggle('on', held.has(m));
    });
  }

  function codeKey(code) {
    if (code.startsWith('Key')) return code.slice(3).toLowerCase();
    if (code.startsWith('Digit')) return code.slice(5);
    return {
      Backslash: '\\', BracketLeft: '[', BracketRight: ']', Comma: ',', Period: '.', Slash: '/', Minus: '-', Equal: '=',
      Backquote: '`', Semicolon: ';', Quote: "'", Space: 'space', Enter: 'enter', Escape: 'esc', Tab: 'tab',
      Backspace: 'bksp', ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down',
      Home: 'home', End: 'end', PageUp: 'pgup', PageDown: 'pgdn',
    }[code] || '';
  }
  const keyEq = (ck, k) =>
    ck === k || (ck === '1-8' && /^[1-8]$/.test(k)) || (ck === 'arrows' && ['left', 'right', 'up', 'down'].includes(k)) ||
    (ck === 'backquote' && k === '`');

  function hitKey(e) {
    const k = codeKey(e.code);
    if (!k) return;
    const held = state.held;
    const hit = rows[state.tool].find(
      (r) => !r.el.hidden && r.chords.some((c) => keyEq(c.key, k) && c.mods.size === held.size && [...held].every((m) => c.mods.has(m)))
    );
    if (!hit) return;
    if (!e.metaKey) e.preventDefault();
    hit.el.classList.remove('hit');
    void hit.el.offsetWidth;
    hit.el.classList.add('hit');
    const box = hit.el.getBoundingClientRect();
    if (box.top < 90 || box.bottom > innerHeight) hit.el.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
  }

  document.addEventListener('keydown', (e) => {
    const inField = e.target.closest && e.target.closest('input, textarea, select, [contenteditable]');
    const mod = MODKEY[e.key];
    if (mod) {
      if (!inField && !e.repeat) {
        state.held.add(mod);
        light();
      }
      return;
    }
    if (inField) return;
    const anyMod = e.ctrlKey || e.altKey || e.metaKey;
    if (anyMod || (e.shiftKey && state.held.size)) {
      hitKey(e);
      return;
    }
    if (e.key === '/') {
      e.preventDefault();
      q.focus();
      q.select();
    } else if (/^[1-9]$/.test(e.key) && +e.key <= SHEETS.length) {
      setTool(SHEETS[+e.key - 1].id, { animate: true });
    } else if (e.key === 'Escape' && state.q) {
      clearSearch();
    }
  });
  document.addEventListener('keyup', (e) => {
    const mod = MODKEY[e.key];
    if (mod && state.held.delete(mod)) light();
  });
  window.addEventListener('blur', () => {
    state.held.clear();
    light();
  });

  // ---------- Clicks: copy, jump links, empty-state buttons, GNU toggle
  const toast = $('#toast');
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('show'), 1600);
  }

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.append(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    const one = text.split('\n')[0];
    showToast(`Copied ${one.length > 38 ? one.slice(0, 36) + '…' : one}`);
  }

  document.addEventListener('click', (e) => {
    const c = e.target.closest('[data-copy]');
    if (c) {
      c.classList.remove('copied');
      void c.offsetWidth;
      c.classList.add('copied');
      copy(c.dataset.copy);
      return;
    }
    const go = e.target.closest('[data-goto]');
    if (go) {
      setTool(go.dataset.goto, { animate: true });
      return;
    }
    if (e.target.closest('[data-clear]')) {
      clearSearch();
      q.focus();
      return;
    }
    const j = e.target.closest('[data-jump]');
    if (j) {
      e.preventDefault();
      document.getElementById(j.dataset.jump).scrollIntoView({ block: 'start', behavior: reduced ? 'auto' : 'smooth' });
    }
  });

  document.addEventListener('change', (e) => {
    if (!e.target.matches('[data-gnu-toggle]')) return;
    state.hideGnu = e.target.checked;
    store.set('ks-hide-gnu', state.hideGnu ? '1' : '0');
    refresh();
  });

  // ---------- Theme
  const themeBtn = $('#theme');
  const SUN = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/></svg>';
  const MOON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.6A8.2 8.2 0 0 1 9.4 4a8.2 8.2 0 1 0 10.6 10.6z"/></svg>';
  const darkMQ = matchMedia('(prefers-color-scheme: dark)');
  const theme = () => root.dataset.theme || (darkMQ.matches ? 'dark' : 'light');
  function paintThemeBtn() {
    const dark = theme() === 'dark';
    themeBtn.innerHTML = dark ? SUN : MOON;
    themeBtn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  }
  themeBtn.addEventListener('click', () => {
    const next = theme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    store.set('ks-theme', next);
    paintThemeBtn();
  });
  darkMQ.addEventListener('change', paintThemeBtn);
  paintThemeBtn();

  // ---------- Show the compact switcher once the hero is out of view
  new IntersectionObserver(([en]) => document.body.classList.toggle('past-hero', !en.isIntersecting), {
    rootMargin: '-64px 0px 0px 0px',
  }).observe($('.hero'));

  window.addEventListener('hashchange', () => {
    const id = location.hash.slice(1);
    if (byId[id]) setTool(id, { animate: true });
  });

  // ---------- Start
  const fromHash = location.hash.slice(1).split('-')[0];
  setTool(byId[fromHash] ? fromHash : SHEETS[0].id);
  if (!reduced) requestAnimationFrame(() => typeWord(state.tool));
})();
