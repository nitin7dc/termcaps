/* Turns key specs from data.js into keycap HTML, plus helpers for search and key matching. */
(function () {
  'use strict';

  const MODS = {
    ctrl: ['⌃', 'control'],
    alt: ['⌥', 'option'],
    cmd: ['⌘', 'command'],
    shift: ['⇧', 'shift'],
  };

  // Keys with a name instead of a single character.
  const NAMED = {
    esc: { t: 'esc', cls: 'word' },
    enter: { g: '↩', t: 'return' },
    tab: { g: '⇥', t: 'tab' },
    bksp: { g: '⌫', t: 'delete' },
    space: { t: 'space', cls: 'word wide' },
    left: { t: '←', cls: 'arrow' },
    right: { t: '→', cls: 'arrow' },
    up: { t: '↑', cls: 'arrow' },
    down: { t: '↓', cls: 'arrow' },
    arrows: { t: '←↑↓→', cls: 'arrow wide' },
    home: { t: 'home', cls: 'word' },
    end: { t: 'end', cls: 'word' },
    pgup: { t: 'page up', cls: 'word' },
    pgdn: { t: 'page down', cls: 'word' },
    backquote: { t: '`' },
    '1-8': { t: '1–8' },
  };

  // Symbols that need Shift on a US layout, mapped to the physical key.
  const SHIFTED = { '<': ',', '>': '.', '{': '[', '}': ']', '_': '-', '+': '=', '?': '/', '|': '\\', ':': ';', '"': "'", '~': '`' };

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const list = (spec) => (Array.isArray(spec) ? spec : [spec]);
  const isCmd = (p) => p.length > 1 && /^[:/?]/.test(p);

  function chord(tok) {
    if (/^\{\w+\}$/.test(tok)) return { ph: tok.slice(1, -1) };
    const bits = tok.length > 1 && tok.includes('+') ? tok.split('+') : [tok];
    return { mods: bits.filter((b) => MODS[b]), key: bits.filter((b) => !MODS[b]).join('+') };
  }

  // A spec becomes a list of parts joined by " / ". Each part is a command or a sequence of chords.
  function parts(spec) {
    if (typeof spec === 'object') return [{ cmd: spec.c }];
    return spec.split(' / ').map((p) => (isCmd(p) ? { cmd: p } : { seq: p.split(' ').filter(Boolean).map(chord) }));
  }

  const capMod = (m) =>
    `<span class="cap two mod" data-m="${m}"><b aria-hidden="true">${MODS[m][0]}</b><i>${MODS[m][1]}</i></span>`;

  function capKey(key, hasMod) {
    const n = NAMED[key];
    if (n && n.g) return `<span class="cap two"><b aria-hidden="true">${n.g}</b><i>${n.t}</i></span>`;
    if (n) return `<span class="cap ${n.cls || ''}">${esc(n.t)}</span>`;
    const label = hasMod && /^[a-z]$/.test(key) ? key.toUpperCase() : key;
    return `<span class="cap">${esc(label)}</span>`;
  }

  function chordHTML(c) {
    if (c.ph) return `<span class="cap ph">${esc(c.ph)}</span>`;
    const caps = c.mods.map(capMod).join('') + (c.key ? capKey(c.key, c.mods.length > 0) : '');
    return c.mods.length && c.key ? `<span class="chord">${caps}</span>` : caps;
  }

  function cmdHTML(text, isStatic) {
    const body = esc(text).replace(/\{(\w+)\}/g, '<em>$1</em>');
    if (isStatic) return `<span class="cap cmd">${body}</span>`;
    const copy = text.replace(/\{(\w+)\}/g, '$1');
    return `<button type="button" class="cap cmd" data-copy="${esc(copy)}" title="Copy">${body}</button>`;
  }

  function render(spec, opts = {}) {
    return list(spec)
      .map((alt) =>
        parts(alt)
          .map((p) => (p.cmd !== undefined ? cmdHTML(p.cmd, opts.static) : `<span class="seq">${p.seq.map(chordHTML).join('')}</span>`))
          .join('<span class="sep">/</span>')
      )
      .join('<span class="or">or</span>');
  }

  // nano's own notation: ctrl+o -> ^O, alt+u -> M-U
  function native(spec) {
    return list(spec)
      .map((alt) =>
        parts(alt)
          .map((p) => {
            if (p.cmd !== undefined) return '';
            return p.seq
              .map((c) => {
                if (c.ph) return c.ph;
                const k = c.key.length === 1 ? c.key.toUpperCase() : c.key === 'space' ? 'Space' : c.key;
                const m = c.mods.includes('ctrl') ? '^' : c.mods.includes('alt') ? 'M-' : '';
                return m + k;
              })
              .join(' ');
          })
          .filter(Boolean)
          .join(' / ')
      )
      .filter(Boolean)
      .join(' or ');
  }

  // First chord of every part that uses a modifier, normalised to physical keys for matching key presses.
  function chords(spec) {
    const out = [];
    list(spec).forEach((alt) =>
      parts(alt).forEach((p) => {
        const c = p.seq && p.seq[0];
        if (!c || c.ph || !c.mods.length) return;
        const mods = new Set(c.mods);
        let key = c.key;
        if (SHIFTED[key]) {
          mods.add('shift');
          key = SHIFTED[key];
        }
        out.push({ mods, key: key.toLowerCase() });
      })
    );
    return out;
  }

  // Plain text used by search: "ctrl+o control", "d d dd", ":wq".
  function text(spec) {
    return list(spec)
      .map((alt) =>
        parts(alt)
          .map((p) => {
            if (p.cmd !== undefined) return p.cmd;
            const spelled = p.seq
              .map((c) => (c.ph ? c.ph : [[...c.mods, c.key].filter(Boolean).join('+'), ...c.mods.map((m) => MODS[m][1])].join(' ')))
              .join(' ');
            return spelled + ' ' + p.seq.map((c) => c.key || '').join('');
          })
          .join(' ')
      )
      .join(' ');
  }

  window.Keys = { render, native, chords, text, esc };
})();
