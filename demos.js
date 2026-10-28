/* Scripted mini-terminal demos, one per tool, and the player that runs them. */
(function () {
  'use strict';

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ---- Script builder: major steps show keys + a caption; minor steps (typing) just change the screen.
  function Script() {
    this.steps = [];
  }
  Script.prototype.key = function (keys, say, fn, dur = 1300) {
    this.steps.push({ major: true, keys, say, fn, dur });
    return this;
  };
  Script.prototype.say = function (say, dur = 450) {
    this.steps.push({ major: true, keys: null, say, fn: null, dur });
    return this;
  };
  Script.prototype.type = function (text, fn, each = 85) {
    [...text].forEach((ch) => this.steps.push({ fn: (s) => fn(s, ch), dur: each + (ch === ' ' ? 40 : 0) }));
    return this;
  };
  Script.prototype.then = function (fn, dur = 400) {
    this.steps.push({ fn, dur });
    return this;
  };

  // ---- Shared editor helpers
  function insertChar(s, ch) {
    const ln = s.lines[s.r];
    if (ch === '\n') {
      s.lines.splice(s.r + 1, 0, ln.slice(s.c));
      s.lines[s.r] = ln.slice(0, s.c);
      s.r += 1;
      s.c = 0;
    } else {
      s.lines[s.r] = ln.slice(0, s.c) + ch + ln.slice(s.c);
      s.c += 1;
    }
  }

  function lineHTML(ln, c, bar) {
    if (c < 0) return `<div>${esc(ln) || ' '}</div>`;
    const at = ln[c] || ' ';
    return `<div>${esc(ln.slice(0, c))}<span class="cur${bar ? ' bar' : ''}">${esc(at)}</span>${esc(ln.slice(c + 1))}</div>`;
  }

  function shell(cmd) {
    return `<div class="sh">
      <div><span class="sh-p">~ $</span> ${esc(cmd)}</div>
      <div><span class="sh-p">~ $</span> <span class="cur"> </span></div>
    </div>`;
  }

  // ---- nano
  const NANO_HELP = [
    ['^G', 'Help'], ['^O', 'Write Out'], ['^W', 'Where Is'], ['^K', 'Cut'], ['^C', 'Location'],
    ['^X', 'Exit'], ['^R', 'Read File'], ['^\\', 'Replace'], ['^U', 'Paste'], ['^J', 'Justify'],
  ];

  const nano = {
    init: () => ({
      lines: ['Weekend', '', 'water the plants', 'call the bank', 'buy coffee'],
      r: 4, c: 10, modified: false, prompt: null, msg: '', shell: false,
    }),
    script() {
      return new Script()
        .say('Type to add text', 450)
        .type('\nfix the bike', (s, ch) => { insertChar(s, ch); s.modified = true; })
        .key('ctrl+w', 'Search for a word', (s) => { s.fx.flash = '^W'; s.prompt = { label: 'Search: ', value: '' }; }, 650)
        .type('bank', (s, ch) => { s.prompt.value += ch; }, 120)
        .key('enter', 'Jump to the match', (s) => { s.prompt = null; s.r = 3; s.c = 9; }, 1300)
        .key('ctrl+k', 'Cut the whole line', (s) => { s.fx.flash = '^K'; s.clip = s.lines.splice(s.r, 1)[0]; s.c = 0; }, 1500)
        .key('ctrl+p', 'Move up a line', (s) => { s.r -= 1; }, 1100)
        .key('ctrl+u', 'Paste it here', (s) => { s.fx.flash = '^U'; s.lines.splice(s.r, 0, s.clip); s.r += 1; }, 1500)
        .key('ctrl+o', 'Save the file', (s) => { s.fx.flash = '^O'; s.prompt = { label: 'File Name to Write: ', value: 'notes.txt' }; }, 1400)
        .key('enter', 'Keep the name', (s) => { s.prompt = null; s.modified = false; s.msg = `Wrote ${s.lines.length} lines`; }, 1700)
        .key('ctrl+x', 'Exit nano', (s) => { s.fx.flash = '^X'; s.shell = true; }, 2600).steps;
    },
    render(s) {
      if (s.shell) return shell('nano notes.txt');
      const head = `<div class="n-head"><span>GNU nano</span><span>notes.txt</span><span>${s.modified ? 'Modified' : ''}</span></div>`;
      const body = `<div class="t-body">${s.lines.map((ln, r) => lineHTML(ln, r === s.r && !s.prompt ? s.c : -1)).join('')}</div>`;
      const bottom = s.prompt
        ? `<div class="n-prompt">${esc(s.prompt.label + s.prompt.value)}<span class="cur inv"> </span></div>`
        : `<div class="n-msg">${s.msg ? `<span>[ ${esc(s.msg)} ]</span>` : ''}</div>`;
      const help = `<div class="n-help">${NANO_HELP.map(([k, l]) => `<span${s.fx.flash === k ? ' class="flash"' : ''}><b>${esc(k)}</b> ${l}</span>`).join('')}</div>`;
      return `<div class="nano">${head}${body}${bottom}${help}</div>`;
    },
  };

  // ---- vi
  const vi = {
    init: () => ({
      lines: ['The quick brown fox', 'jumps over the lazy dog.', 'Vim is a modal editor.'],
      r: 0, c: 0, insert: false, cmd: null, msg: '', shell: false,
    }),
    script() {
      return new Script()
        .key('w', 'Jump to the next word', (s) => { s.c = 4; }, 1000)
        .key('w', 'And the next one', (s) => { s.c = 10; }, 1100)
        .key('c i w', 'Change the word under the cursor', (s) => { s.lines[0] = 'The quick  fox'; s.insert = true; s.msg = '-- INSERT --'; }, 1300)
        .say('Type the new word', 350)
        .type('red', (s, ch) => insertChar(s, ch), 130)
        .key('esc', 'Back to Normal mode', (s) => { s.insert = false; s.msg = ''; s.c = 12; }, 1300)
        .key('j', 'Down one line', (s) => { s.r = 1; }, 1000)
        .key('d d', 'Delete the line', (s) => { s.clip = s.lines.splice(1, 1)[0]; s.c = 0; }, 1500)
        .key('p', 'Paste it below', (s) => { s.lines.splice(s.r + 1, 0, s.clip); s.r += 1; s.c = 0; }, 1500)
        .key(':', 'Start a command', (s) => { s.cmd = ':'; }, 500)
        .type('wq', (s, ch) => { s.cmd += ch; }, 170)
        .key('enter', 'Save and quit', (s) => { s.cmd = null; s.msg = '"notes.txt" 3L, 66B written'; }, 1200)
        .then((s) => { s.shell = true; }, 2400).steps;
    },
    render(s) {
      if (s.shell) return shell('vi notes.txt');
      const rows = 8;
      const text = s.lines.map((ln, r) => lineHTML(ln, r === s.r && s.cmd === null ? s.c : -1, s.insert)).join('');
      const tildes = '<div class="v-tilde">~</div>'.repeat(Math.max(0, rows - s.lines.length));
      const left = s.cmd !== null
        ? `${esc(s.cmd)}<span class="cur"> </span>`
        : `<span class="${s.insert ? 'v-mode' : ''}">${esc(s.msg)}</span>`;
      const right = s.cmd !== null ? '' : `${s.r + 1},${s.c + 1}`;
      return `<div class="vi"><div class="t-body">${text}${tildes}</div><div class="v-status"><span>${left}</span><span class="v-ruler">${right}</span></div></div>`;
    },
  };

  // ---- Ghostty
  const PANES = {
    A: ['git status', 'On branch main', 'nothing to commit, working tree clean'],
    B: ['npm run dev', '  ready on http://localhost:3000'],
    C: ['tail -f server.log', 'GET /api/users 200 12ms', 'GET /health 200 1ms'],
    D: [],
  };
  const L = (id) => ({ id });
  const Sp = (dir, ...kids) => ({ dir, kids });
  const tab = (s) => s.tabs[s.active];

  function pane(id, on, s) {
    const [cmd, ...out] = PANES[id];
    const prompt = '<span class="p-dir">~/app</span> <span class="p-ar">❯</span>';
    let html = '';
    if (cmd) html += `<div>${prompt} ${esc(cmd)}</div>` + out.map((o) => `<div class="p-out">${esc(o)}</div>`).join('');
    html += `<div>${prompt} ${on ? '<span class="cur"> </span>' : ''}</div>`;
    const cls = ['pane', on && 'on', s.fx.fresh === id && 'fresh', s.fx.gain === id && 'gain'].filter(Boolean).join(' ');
    return `<div class="${cls}">${html}</div>`;
  }
  function node(n, focus, s) {
    if (n.id) return pane(n.id, n.id === focus, s);
    return `<div class="split split-${n.dir}">${n.kids.map((k) => node(k, focus, s)).join('')}</div>`;
  }

  const ghostty = {
    init: () => ({ tabs: [{ tree: L('A'), focus: 'A', zoom: false }], active: 0 }),
    script() {
      return new Script()
        .key('cmd+d', 'Split right', (s) => { const t = tab(s); t.tree = Sp('row', L('A'), L('B')); t.focus = 'B'; s.fx.fresh = 'B'; }, 1500)
        .key('cmd+shift+d', 'Split down', (s) => { const t = tab(s); t.tree = Sp('row', L('A'), Sp('col', L('B'), L('C'))); t.focus = 'C'; s.fx.fresh = 'C'; }, 1500)
        .key('cmd+alt+left', 'Go to the split on the left', (s) => { tab(s).focus = 'A'; s.fx.gain = 'A'; }, 1400)
        .key('cmd+shift+enter', 'Zoom it to fill the tab', (s) => { tab(s).zoom = true; s.fx.fresh = 'A'; }, 1500)
        .key('cmd+shift+enter', 'Press again to put it back', (s) => { tab(s).zoom = false; }, 1400)
        .key('cmd+t', 'Open a new tab', (s) => { s.tabs.push({ tree: L('D'), focus: 'D', zoom: false }); s.active = 1; s.fx.fresh = 'D'; }, 1500)
        .key('cmd+1', 'Back to the first tab', (s) => { s.active = 0; }, 1400)
        .key('cmd+w', 'Close the split you’re in', (s) => { const t = tab(s); t.tree = Sp('col', L('B'), L('C')); t.focus = 'B'; s.fx.gain = 'B'; }, 2400).steps;
    },
    render(s) {
      const t = tab(s);
      const top = s.tabs.length > 1
        ? `<div class="gt-tabs">${s.tabs.map((x, i) => `<span class="gt-tab${i === s.active ? ' on' : ''}">${i === 0 ? '~/app' : '~'}</span>`).join('')}</div>`
        : '<div class="gt-title">~/app</div>';
      const body = t.zoom ? pane(t.focus, true, s) : node(t.tree, t.focus, s);
      return `<div class="gt"><div class="gt-bar"><span class="lights"><i></i><i></i><i></i></span>${top}<span class="gt-pad"></span></div><div class="gt-body">${body}</div></div>`;
    },
  };

  window.DEMOS = { nano, vi, ghostty };

  // ---- Player
  const ICON_PAUSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1.2"/><rect x="14" y="5" width="4" height="14" rx="1.2"/></svg>';
  const ICON_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>';

  class DemoPlayer {
    constructor(fig, demo, { autoplay }) {
      this.fig = fig;
      this.demo = demo;
      this.screen = fig.querySelector('.screen');
      this.keysEl = fig.querySelector('.hud-keys');
      this.sayEl = fig.querySelector('.hud-say');
      this.dotsEl = fig.querySelector('.dots');
      this.btn = fig.querySelector('.play');
      this.steps = demo.script();
      this.majors = this.steps.map((st, i) => (st.major ? i : -1)).filter((i) => i >= 0);
      this.want = autoplay;
      this.playing = false;
      this.active = false;
      this.visible = false;
      this.timer = null;

      this.dotsEl.innerHTML = this.majors
        .map((si, m) => `<button type="button" class="dot" data-m="${m}" aria-label="Step ${m + 1}: ${esc(this.steps[si].say)}"></button>`)
        .join('');
      this.dotsEl.addEventListener('click', (e) => {
        const b = e.target.closest('.dot');
        if (b) this.jump(+b.dataset.m);
      });
      this.btn.addEventListener('click', () => {
        this.want = !this.want;
        this.sync();
      });

      this.reset();
      this.draw();
      this.hud(this.steps[this.majors[0]], false, -1);
      this.updateBtn();
    }

    reset() {
      this.s = this.demo.init();
      this.s.fx = {};
      this.i = 0;
    }

    draw() {
      this.screen.innerHTML = this.demo.render(this.s);
    }

    hud(st, animate, m) {
      this.keysEl.innerHTML = st.keys ? window.Keys.render(st.keys, { static: true }) : '';
      this.keysEl.querySelectorAll('.cap').forEach((c, i) => c.style.setProperty('--i', i));
      this.keysEl.classList.remove('go');
      if (animate) {
        void this.keysEl.offsetWidth; // restart the press animation
        this.keysEl.classList.add('go');
      }
      this.sayEl.textContent = st.say;
      this.dotsEl.querySelectorAll('.dot').forEach((d, j) => d.toggleAttribute('aria-current', j === m));
    }

    tick() {
      if (this.i >= this.steps.length) {
        this.reset();
        this.draw();
        this.schedule(900);
        return;
      }
      const idx = this.i++;
      const st = this.steps[idx];
      this.s.fx = {};
      if (st.fn) st.fn(this.s);
      if (st.major) this.hud(st, true, this.majors.indexOf(idx));
      this.draw();
      this.schedule(st.dur);
    }

    schedule(ms) {
      clearTimeout(this.timer);
      if (this.playing) this.timer = setTimeout(() => this.tick(), ms);
    }

    // Rebuild the state up to a step, then show that step.
    jump(m) {
      const target = this.majors[m];
      this.reset();
      for (let j = 0; j < target; j++) {
        this.s.fx = {};
        const st = this.steps[j];
        if (st.fn) st.fn(this.s);
      }
      this.i = target;
      this.tick();
    }

    sync() {
      const should = this.want && this.active && this.visible && !document.hidden;
      if (should && !this.playing) {
        this.playing = true;
        this.schedule(350);
      } else if (!should && this.playing) {
        this.playing = false;
        clearTimeout(this.timer);
      }
      this.updateBtn();
    }

    updateBtn() {
      this.btn.innerHTML = this.want ? ICON_PAUSE : ICON_PLAY;
      this.btn.setAttribute('aria-label', this.want ? 'Pause demo' : 'Play demo');
    }
  }

  window.DemoPlayer = DemoPlayer;
})();
