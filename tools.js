/* ============================================================
   grave.rest — tools.js
   all tools, grouped by category, rendered into the sidebar
   ============================================================ */

(() => {
  'use strict';

  const G = window.GRAVE;
  const $ = G.$;

  /* ============================================================
     helpers shared by tools
     ============================================================ */
  const el = (tag, attrs = {}, html = '') => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') n.className = v;
      else if (k === 'html') n.innerHTML = v;
      else n.setAttribute(k, v);
    }
    if (html) n.innerHTML = html;
    return n;
  };

  const row = (children, cls = 'row') => {
    const r = el('div', { class: cls });
    children.forEach(c => r.appendChild(c));
    return r;
  };

  const input = (ph, val = '') => {
    const i = el('input', { class: 'input', type: 'text', placeholder: ph, autocomplete: 'off', spellcheck: 'false' });
    i.value = val;
    return i;
  };

  const textarea = (ph) => el('textarea', { class: 'input', placeholder: ph, spellcheck: 'false' });

  const btn = (label, ghost = false) => {
    const b = el('button', { class: 'btn' + (ghost ? ' btn-ghost' : '') });
    b.textContent = label;
    return b;
  };

  const out = () => el('div', { class: 'out' });

  const hint = (text) => el('div', { class: 'hint', html: text });

  const md5Hex = async (str) => {
    if (crypto?.subtle) {
      try {
        const buf = await crypto.subtle.digest('MD5', new TextEncoder().encode(str));
        return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
      } catch {}
    }
    return md5Fallback(str);
  };

  function md5Fallback(s) {
    function rl(n, c) { return (n << c) | (n >>> (32 - c)); }
    function au(x, y) { return (x + y) & 0xFFFFFFFF; }
    function cmn(q, a, b, x, s, t) { return au(rl(au(au(a, q), au(x, t)), s), b); }
    function ff(a, b, c, d, x, s, t) { return cmn((b & c) | (~b & d), a, b, x, s, t); }
    function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & ~d), a, b, x, s, t); }
    function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
    function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | ~d), a, b, x, s, t); }
    function sb(s) {
      const bytes = new TextEncoder().encode(s);
      const len = bytes.length;
      const words = [];
      for (let i = 0; i < len; i++) words[i >> 2] = (words[i >> 2] || 0) | (bytes[i] << ((i % 4) * 8));
      words[len >> 2] = (words[len >> 2] || 0) | (0x80 << ((len % 4) * 8));
      const wl = (((len + 8) >> 6) + 1) * 16;
      while (words.length < wl) words.push(0);
      words[wl - 2] = len * 8;
      return words;
    }
    const x = sb(s);
    let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
    for (let i = 0; i < x.length; i += 16) {
      const oa = a, ob = b, oc = c, od = d;
      a = ff(a, b, c, d, x[i], 7, -680876936);
      d = ff(d, a, b, c, x[i + 1], 12, -389564586);
      c = ff(c, d, a, b, x[i + 2], 17, 606105819);
      b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
      a = ff(a, b, c, d, x[i + 4], 7, -176418897);
      d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
      c = ff(c, d, a, b, x[i + 6], 17, -1473231341);
      b = ff(b, c, d, a, x[i + 7], 22, -45705983);
      a = ff(a, b, c, d, x[i + 8], 7, 1770035416);
      d = ff(d, a, b, c, x[i + 9], 12, -1958414417);
      c = ff(c, d, a, b, x[i + 10], 17, -42063);
      b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
      a = ff(a, b, c, d, x[i + 12], 7, 1804603682);
      d = ff(d, a, b, c, x[i + 13], 12, -40341101);
      c = ff(c, d, a, b, x[i + 14], 17, -1502002290);
      b = ff(b, c, d, a, x[i + 15], 22, 1236535329);
      a = gg(a, b, c, d, x[i + 1], 5, -165796510);
      d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
      c = gg(c, d, a, b, x[i + 11], 14, 643717713);
      b = gg(b, c, d, a, x[i], 20, -373897302);
      a = gg(a, b, c, d, x[i + 5], 5, -701558691);
      d = gg(d, a, b, c, x[i + 10], 9, 38016083);
      c = gg(c, d, a, b, x[i + 15], 14, -660478335);
      b = gg(b, c, d, a, x[i + 4], 20, -405537848);
      a = gg(a, b, c, d, x[i + 9], 5, 568446438);
      d = gg(d, a, b, c, x[i + 14], 9, -1019803690);
      c = gg(c, d, a, b, x[i + 3], 14, -187363961);
      b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
      a = gg(a, b, c, d, x[i + 13], 5, -1444681467);
      d = gg(d, a, b, c, x[i + 2], 9, -51403784);
      c = gg(c, d, a, b, x[i + 7], 14, 1735328473);
      b = gg(b, c, d, a, x[i + 12], 20, -1926607734);
      a = hh(a, b, c, d, x[i + 5], 4, -378558);
      d = hh(d, a, b, c, x[i + 8], 11, -2022574463);
      c = hh(c, d, a, b, x[i + 11], 16, 1839030562);
      b = hh(b, c, d, a, x[i + 14], 23, -35309556);
      a = hh(a, b, c, d, x[i + 1], 4, -1530992060);
      d = hh(d, a, b, c, x[i + 4], 11, 1272893353);
      c = hh(c, d, a, b, x[i + 7], 16, -155497632);
      b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
      a = hh(a, b, c, d, x[i + 13], 4, 681279174);
      d = hh(d, a, b, c, x[i], 11, -358537222);
      c = hh(c, d, a, b, x[i + 3], 16, -722521979);
      b = hh(b, c, d, a, x[i + 6], 23, 76029189);
      a = hh(a, b, c, d, x[i + 9], 4, -640364487);
      d = hh(d, a, b, c, x[i + 12], 11, -421815835);
      c = hh(c, d, a, b, x[i + 15], 16, 530742520);
      b = hh(b, c, d, a, x[i + 2], 23, -995338651);
      a = ii(a, b, c, d, x[i], 6, -198630844);
      d = ii(d, a, b, c, x[i + 7], 10, 1126891415);
      c = ii(c, d, a, b, x[i + 14], 15, -1416354905);
      b = ii(b, c, d, a, x[i + 5], 21, -57434055);
      a = ii(a, b, c, d, x[i + 12], 6, 1700485571);
      d = ii(d, a, b, c, x[i + 3], 10, -1894986606);
      c = ii(c, d, a, b, x[i + 10], 15, -1051523);
      b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
      a = ii(a, b, c, d, x[i + 8], 6, 1873313359);
      d = ii(d, a, b, c, x[i + 15], 10, -30611744);
      c = ii(c, d, a, b, x[i + 6], 15, -1560198380);
      b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
      a = ii(a, b, c, d, x[i + 4], 6, -145523070);
      d = ii(d, a, b, c, x[i + 11], 10, -1120210379);
      c = ii(c, d, a, b, x[i + 2], 15, 718787259);
      b = ii(b, c, d, a, x[i + 9], 21, -343485551);
      a = au(a, oa); b = au(b, ob); c = au(c, oc); d = au(d, od);
    }
    return [a, b, c, d].map(n => {
      let s = '';
      for (let i = 0; i < 4; i++) s += ((n >> (i * 8)) & 0xFF).toString(16).padStart(2, '0');
      return s;
    }).join('');
  }

  const shaHex = async (algo, str) => {
    const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(str));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const kv = (pairs) => {
    let html = '<div class="kv">';
    for (const [k, v] of pairs) html += `<span class="k">${k}</span> <span class="v">${v}</span><br>`;
    html += '</div>';
    return html;
  };

  /* ============================================================
     categories + tool registry
     ============================================================ */
  const CATEGORIES = [
    { id: 'identity',  label: 'identity',  tools: [] },
    { id: 'network',   label: 'network',   tools: [] },
    { id: 'text',      label: 'text',      tools: [] },
    { id: 'utility',   label: 'utility',   tools: [] },
    { id: 'media',     label: 'media',     tools: [] },
    { id: 'weirdcore', label: 'weirdcore', tools: [] },
  ];

  const catById = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));
  const TOOLS = {};

  function register(catId, id, label, render) {
    TOOLS[id] = { id, label, catId, render };
    catById[catId].tools.push(id);
  }

  /* ============================================================
     IDENTITY
     ============================================================ */

  register('identity', 'username', 'username matrix', () => {
    const PLATFORMS = [
      { name: 'github', type: 'cors', url: u => `https://api.github.com/users/${u}`, taken: r => r.status === 200, avail: r => r.status === 404 },
      { name: 'reddit', type: 'cors', url: u => `https://www.reddit.com/user/${u}/about.json`, taken: r => r.status === 200, avail: r => r.status === 404 },
      { name: 'hackernews', type: 'cors', url: u => `https://hacker-news.firebaseio.com/v0/user/${u}.json`, taken: async r => (await r.json()) !== null, avail: async r => (await r.json()) === null },
      { name: 'npm', type: 'cors', url: u => `https://registry.npmjs.org/-/user/org.couchdb.user:${u}`, taken: r => r.status === 200, avail: r => r.status === 404 },
      { name: 'dockerhub', type: 'cors', url: u => `https://hub.docker.com/v2/users/${u}/`, taken: r => r.status === 200, avail: r => r.status === 404 },
      { name: 'gitlab', type: 'cors', url: u => `https://gitlab.com/api/v4/users?username=${u}`, taken: async r => { const j = await r.json(); return Array.isArray(j) && j.length > 0; }, avail: async r => { const j = await r.json(); return Array.isArray(j) && j.length === 0; } },
      { name: 'codeberg', type: 'cors', url: u => `https://codeberg.org/api/v1/users/${u}`, taken: r => r.status === 200, avail: r => r.status === 404 },
      { name: 'dev.to', type: 'cors', url: u => `https://dev.to/api/users/by_username?url=${u}`, taken: r => r.status === 200, avail: r => r.status === 404 },
      { name: 'twitch', type: 'link', url: u => `https://www.twitch.tv/${u}` },
      { name: 'youtube', type: 'link', url: u => `https://www.youtube.com/@${u}` },
      { name: 'twitter/x', type: 'link', url: u => `https://x.com/${u}` },
      { name: 'instagram', type: 'link', url: u => `https://www.instagram.com/${u}/` },
      { name: 'tiktok', type: 'link', url: u => `https://www.tiktok.com/@${u}` },
      { name: 'facebook', type: 'link', url: u => `https://www.facebook.com/${u}` },
      { name: 'snapchat', type: 'link', url: u => `https://www.snapchat.com/add/${u}` },
      { name: 'telegram', type: 'link', url: u => `https://t.me/${u}` },
      { name: 'steam', type: 'link', url: u => `https://steamcommunity.com/id/${u}` },
      { name: 'roblox', type: 'link', url: u => `https://www.roblox.com/user.aspx?username=${u}` },
      { name: 'spotify', type: 'link', url: u => `https://open.spotify.com/user/${u}` },
      { name: 'soundcloud', type: 'link', url: u => `https://soundcloud.com/${u}` },
      { name: 'bandcamp', type: 'link', url: u => `https://bandcamp.com/${u}` },
      { name: 'medium', type: 'link', url: u => `https://medium.com/@${u}` },
      { name: 'substack', type: 'link', url: u => `https://${u}.substack.com` },
      { name: 'patreon', type: 'link', url: u => `https://www.patreon.com/${u}` },
      { name: 'pinterest', type: 'link', url: u => `https://www.pinterest.com/${u}/` },
      { name: 'tumblr', type: 'link', url: u => `https://${u}.tumblr.com` },
      { name: 'mastodon', type: 'link', url: u => `https://mastodon.social/@${u}` },
      { name: 'bluesky', type: 'link', url: u => `https://bsky.app/profile/${u}.bsky.social` },
      { name: 'threads', type: 'link', url: u => `https://www.threads.net/@${u}` },
      { name: 'keybase', type: 'link', url: u => `https://keybase.io/${u}` },
      { name: 'pypi', type: 'link', url: u => `https://pypi.org/user/${u}/` },
      { name: 'bitbucket', type: 'link', url: u => `https://bitbucket.org/${u}/` },
      { name: 'stackoverflow', type: 'link', url: u => `https://stackoverflow.com/users/filter?search=${u}` },
      { name: 'linktree', type: 'link', url: u => `https://linktr.ee/${u}` },
      { name: 'about.me', type: 'link', url: u => `https://about.me/${u}` },
      { name: 'behance', type: 'link', url: u => `https://www.behance.net/${u}` },
      { name: 'dribbble', type: 'link', url: u => `https://dribbble.com/${u}` },
      { name: 'deviantart', type: 'link', url: u => `https://www.deviantart.com/${u}` },
      { name: 'artstation', type: 'link', url: u => `https://www.artstation.com/${u}` },
      { name: 'flickr', type: 'link', url: u => `https://www.flickr.com/people/${u}` },
      { name: 'vimeo', type: 'link', url: u => `https://vimeo.com/${u}` },
      { name: 'onlyfans', type: 'link', url: u => `https://onlyfans.com/${u}` },
      { name: 'venmo', type: 'link', url: u => `https://account.venmo.com/u/${u}` },
      { name: 'cashapp', type: 'link', url: u => `https://cash.app/$${u}` },
    ];

    const wrap = el('div');
    wrap.appendChild(hint('one handle. every site i could think of.'));
    const i = input('handle');
    const b = btn('scan');
    const st = el('span', { class: 'status' }); st.textContent = 'idle';
    const cnt = el('span', { class: 'status' });
    wrap.appendChild(row([i, b, st, cnt]));
    const grid = el('div', { class: 'grid' });
    wrap.appendChild(grid);

    async function check(p, u) {
      const url = p.url(u);
      if (p.type === 'link') return { state: 'unk', url };
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 6000);
        const res = await fetch(url, { signal: ctrl.signal, headers: { Accept: 'application/json' } });
        clearTimeout(t);
        if (p.taken && await p.taken(res)) return { state: 'hit', url };
        if (p.avail && await p.avail(res)) return { state: 'miss', url };
        if (res.status === 200) return { state: 'hit', url };
        if (res.status === 404) return { state: 'miss', url };
        return { state: 'unk', url };
      } catch { return { state: 'unk', url }; }
    }

    async function run() {
      const u = i.value.trim().toLowerCase();
      if (!u || !/^[a-z0-9._-]{2,32}$/.test(u)) { st.textContent = 'invalid handle'; st.className = 'status bad'; return; }
      grid.innerHTML = '';
      st.textContent = 'scanning…'; st.className = 'status';
      cnt.textContent = '';
      let hit = 0, miss = 0, unk = 0, done = 0;

      const cells = PLATFORMS.map(p => {
        const a = el('a', { class: 'cell busy', href: p.url(u), target: '_blank', rel: 'noopener noreferrer' });
        a.innerHTML = `<span class="name">${p.name}</span><span class="dot"></span>`;
        grid.appendChild(a);
        return { a, p };
      });

      await Promise.all(cells.map(async ({ a, p }) => {
        const r = await check(p, u);
        a.classList.remove('busy');
        a.classList.add(r.state);
        a.href = r.url;
        if (r.state === 'hit') hit++;
        else if (r.state === 'miss') miss++;
        else unk++;
        done++;
        cnt.textContent = `${done}/${PLATFORMS.length}`;
      }));

      st.textContent = 'done'; st.className = 'status ok';
      cnt.textContent = `${hit} taken · ${miss} free · ${unk} manual`;
    }

    b.addEventListener('click', run);
    i.addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
    return wrap;
  });

  register('identity', 'email', 'email intel', () => {
    const wrap = el('div');
    wrap.appendChild(hint('gravatar, breaches, mx, github.'));
    const i = input('email@domain.tld');
    const b = btn('check');
    wrap.appendChild(row([i, b]));
    const o = out(); wrap.appendChild(o);

    async function run() {
      const email = i.value.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { o.innerHTML = '<span class="m">invalid email.</span>'; return; }
      o.innerHTML = '<span class="m">checking…</span>';
      const [user, domain] = email.split('@');
      const rows = [];

      try {
        const h = await md5Hex(email);
        const res = await fetch(`https://www.gravatar.com/avatar/${h}?d=404`);
        rows.push(['gravatar', res.status === 200 ? 'exists → https://gravatar.com/' + h : 'none']);
      } catch { rows.push(['gravatar', 'error']); }

      try {
        const sha1 = await shaHex('SHA-1', email);
        const prefix = sha1.slice(0, 5).toUpperCase();
        const suffix = sha1.slice(5).toUpperCase();
        const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
        const text = await res.text();
        const line = text.split('\n').find(l => l.startsWith(suffix));
        rows.push(['hibp', line ? `found in ${parseInt(line.split(':')[1]).toLocaleString()} breaches` : 'not in corpus']);
      } catch { rows.push(['hibp', 'check failed']); }

      try {
        const res = await fetch(`https://dns.google/resolve?name=${domain}&type=MX`);
        const j = await res.json();
        const mx = (j.Answer || []).map(a => a.data).join(' | ');
        rows.push(['mx', mx || 'none']);
      } catch { rows.push(['mx', 'failed']); }

      try {
        const res = await fetch(`https://api.github.com/users/${user}`);
        rows.push(['github', res.status === 200 ? 'user exists' : 'no user']);
      } catch { rows.push(['github', 'failed']); }

      o.innerHTML = kv(rows);
    }

    b.addEventListener('click', run);
    i.addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
    return wrap;
  });

  register('identity', 'phone', 'phone intel', () => {
    const wrap = el('div');
    wrap.appendChild(hint('region, carrier, format. offline.'));
    const i = input('+1 555 123 4567');
    const b = btn('parse');
    wrap.appendChild(row([i, b]));
    const o = out(); wrap.appendChild(o);

    const REGIONS = [
      { code: '1', region: 'US/CA', len: [10] },
      { code: '44', region: 'UK', len: [10] },
      { code: '49', region: 'DE', len: [10, 11] },
      { code: '33', region: 'FR', len: [9] },
      { code: '39', region: 'IT', len: [9, 10] },
      { code: '34', region: 'ES', len: [9] },
      { code: '7', region: 'RU/KZ', len: [10] },
      { code: '86', region: 'CN', len: [11] },
      { code: '81', region: 'JP', len: [10] },
      { code: '82', region: 'KR', len: [9, 10] },
      { code: '91', region: 'IN', len: [10] },
      { code: '55', region: 'BR', len: [10, 11] },
      { code: '52', region: 'MX', len: [10] },
      { code: '61', region: 'AU', len: [9] },
      { code: '27', region: 'ZA', len: [9] },
      { code: '20', region: 'EG', len: [10] },
      { code: '234', region: 'NG', len: [10] },
    ];

    function parse(v) {
      const digits = v.replace(/\D/g, '');
      if (!digits) return null;
      const sorted = [...REGIONS].sort((a, b) => b.code.length - a.code.length);
      for (const r of sorted) {
        if (digits.startsWith(r.code)) {
          const rest = digits.slice(r.code.length);
          const ok = r.len.includes(rest.length);
          return {
            e164: '+' + digits,
            region: r.region,
            cc: r.code,
            national: rest,
            validLength: ok,
            nationalFmt: rest.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3') || rest,
            intlFmt: `+${r.code} ${rest.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')}`,
          };
        }
      }
      return { e164: '+' + digits, region: 'unknown', cc: '?', national: digits, validLength: false, nationalFmt: digits, intlFmt: '+' + digits };
    }

    b.addEventListener('click', () => {
      const r = parse(i.value);
      if (!r) { o.innerHTML = '<span class="m">enter a number.</span>'; return; }
      o.innerHTML = kv([
        ['e164', r.e164],
        ['region', r.region],
        ['country code', '+' + r.cc],
        ['national', r.nationalFmt],
        ['international', r.intlFmt],
        ['length valid', r.validLength ? 'yes' : 'no (may be wrong format)'],
      ]);
    });
    i.addEventListener('keydown', e => { if (e.key === 'Enter') b.click(); });
    return wrap;
  });

  register('identity', 'github', 'github deep dive', () => {
    const wrap = el('div');
    wrap.appendChild(hint('pull someone apart.'));
    const i = input('username');
    const b = btn('fetch');
    wrap.appendChild(row([i, b]));
    const o = out(); wrap.appendChild(o);

    async function run() {
      const u = i.value.trim();
      if (!u) return;
      o.innerHTML = '<span class="m">fetching…</span>';
      try {
        const ur = await fetch(`https://api.github.com/users/${u}`);
        if (ur.status !== 200) { o.innerHTML = '<span class="m">user not found.</span>'; return; }
        const j = await ur.json();
        const rr = await fetch(`https://api.github.com/users/${u}/repos?per_page=100&sort=updated`);
        const repos = rr.status === 200 ? await rr.json() : [];
        const stars = repos.reduce((a, r) => a + (r.stargazers_count || 0), 0);
        const langs = {};
        repos.forEach(r => { if (r.language) langs[r.language] = (langs[r.language] || 0) + 1; });
        const top = Object.entries(langs).sort((a, b) => b[1] - a[1]).slice(0, 6)
          .map(([l, n]) => `${l} (${n})`).join(', ');
        o.innerHTML = kv([
          ['login', j.login],
          ['name', j.name || '-'],
          ['bio', j.bio || '-'],
          ['location', j.location || '-'],
          ['company', j.company || '-'],
          ['blog', j.blog || '-'],
          ['public repos', j.public_repos],
          ['followers', j.followers],
          ['following', j.following],
          ['created', j.created_at],
          ['updated', j.updated_at],
          ['total stars', stars],
          ['top languages', top || '-'],
        ]);
      } catch { o.innerHTML = '<span class="m">failed.</span>'; }
    }
    b.addEventListener('click', run);
    i.addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
    return wrap;
  });

  register('identity', 'reddit', 'reddit dossier', () => {
    const wrap = el('div');
    wrap.appendChild(hint('karma, age, whether they verified.'));
    const i = input('username');
    const b = btn('fetch');
    wrap.appendChild(row([i, b]));
    const o = out(); wrap.appendChild(o);

    async function run() {
      const u = i.value.trim();
      if (!u) return;
      o.innerHTML = '<span class="m">fetching…</span>';
      try {
        const res = await fetch(`https://www.reddit.com/user/${u}/about.json`);
        if (res.status !== 200) { o.innerHTML = '<span class="m">user not found.</span>'; return; }
        const j = await res.json();
        const d = j.data;
        const age = ((Date.now() / 1000 - d.created_utc) / 86400).toFixed(0);
        o.innerHTML = kv([
          ['name', d.name],
          ['link karma', d.link_karma],
          ['comment karma', d.comment_karma],
          ['total karma', d.link_karma + d.comment_karma],
          ['created', new Date(d.created_utc * 1000).toISOString().split('T')[0]],
          ['age (days)', age],
          ['verified', d.verified ? 'yes' : 'no'],
          ['mod', d.is_mod ? 'yes' : 'no'],
          ['gold', d.is_gold ? 'yes' : 'no'],
          ['over 18', d.over_18 ? 'yes' : 'no'],
        ]);
      } catch { o.innerHTML = '<span class="m">failed.</span>'; }
    }
    b.addEventListener('click', run);
    i.addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
    return wrap;
  });

  register('identity', 'gravatar', 'gravatar profile', () => {
    const wrap = el('div');
    wrap.appendChild(hint('email in, whatever they left on gravatar out.'));
    const i = input('email@domain.tld');
    const b = btn('dump');
    wrap.appendChild(row([i, b]));
    const o = out(); wrap.appendChild(o);

    async function run() {
      const email = i.value.trim().toLowerCase();
      if (!email) return;
      o.innerHTML = '<span class="m">fetching…</span>';
      const h = await md5Hex(email);
      try {
        const res = await fetch(`https://gravatar.com/${h}.json`);
        if (res.status !== 200) { o.innerHTML = '<span class="m">no gravatar for that email.</span>'; return; }
        const j = await res.json();
        const e = j.entry?.[0] || {};
        const rows = [
          ['hash', h],
          ['avatar', `https://gravatar.com/avatar/${h}`],
          ['display name', e.displayName || '-'],
          ['about', e.aboutMe || '-'],
          ['location', e.currentLocation || '-'],
          ['job', e.jobTitle || '-'],
          ['company', e.company || '-'],
          ['verified', (e.verifiedAccounts || []).map(a => a.service).join(', ') || '-'],
          ['urls', (e.urls || []).map(u => u.value).join(' | ') || '-'],
          ['accounts', (e.accounts || []).map(a => `${a.shortname}:${a.username}`).join(' | ') || '-'],
        ];
        o.innerHTML = kv(rows);
      } catch { o.innerHTML = '<span class="m">failed.</span>'; }
    }
    b.addEventListener('click', run);
    i.addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
    return wrap;
  });

  register('identity', 'steam', 'steam resolver', () => {
    const wrap = el('div');
    wrap.appendChild(hint('vanity name → the long number.'));
    const i = input('vanity name');
    const b = btn('resolve');
    wrap.appendChild(row([i, b]));
    const o = out(); wrap.appendChild(o);

    async function run() {
      const v = i.value.trim();
      if (!v) return;
      o.innerHTML = '<span class="m">resolving…</span>';
      try {
        const res = await fetch(`https://steamcommunity.com/id/${v}/?xml=1`);
        const text = await res.text();
        const grab = tag => {
          const m = text.match(new RegExp(`<${tag}><!\\[CDATA\\[(.*?)\\]\\]></${tag}>`)) || text.match(new RegExp(`<${tag}>(.*?)</${tag}>`));
          return m ? m[1] : '-';
        };
        if (!text.includes('<steamID64>')) { o.innerHTML = '<span class="m">vanity not found.</span>'; return; }
        o.innerHTML = kv([
          ['vanity', v],
          ['steamid64', grab('steamID64')],
          ['steamid', grab('steamID')],
          ['real name', grab('realname')],
          ['location', grab('location')],
          ['summary', grab('summary').replace(/<[^>]+>/g, '').slice(0, 200)],
          ['avatar', grab('avatarFull')],
          ['created', grab('memberSince')],
        ]);
      } catch { o.innerHTML = '<span class="m">failed.</span>'; }
    }
    b.addEventListener('click', run);
    i.addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
    return wrap;
  });

  register('identity', 'roblox', 'roblox lookup', () => {
    const wrap = el('div');
    wrap.appendChild(hint('roblox user, if they exist.'));
    const i = input('username');
    const b = btn('lookup');
    wrap.appendChild(row([i, b]));
    const o = out(); wrap.appendChild(o);

    async function run() {
      const u = i.value.trim();
      if (!u) return;
      o.innerHTML = '<span class="m">fetching…</span>';
      try {
        const sr = await fetch('https://users.roblox.com/v1/usernames/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usernames: [u], excludeBannedUsers: false }),
        });
        const sj = await sr.json();
        if (!sj.data?.length) { o.innerHTML = '<span class="m">user not found.</span>'; return; }
        const id = sj.data[0].id;
        const ur = await fetch(`https://users.roblox.com/v1/users/${id}`);
        const j = await ur.json();
        const fr = await fetch(`https://friends.roblox.com/v1/users/${id}/friends/count`);
        const fj = fr.status === 200 ? await fr.json() : { count: '-' };
        o.innerHTML = kv([
          ['id', id],
          ['name', j.name],
          ['display name', j.displayName],
          ['description', (j.description || '-').replace(/\n/g, ' ').slice(0, 200)],
          ['created', j.created],
          ['banned', j.isBanned ? 'yes' : 'no'],
          ['friends', fj.count],
          ['avatar', `https://www.roblox.com/headshot-thumbnail/image?userId=${id}&width=150&height=150&format=png`],
          ['profile', `https://www.roblox.com/users/${id}/profile`],
        ]);
      } catch { o.innerHTML = '<span class="m">failed.</span>'; }
    }
    b.addEventListener('click', run);
    i.addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
    return wrap;
  });

  register('identity', 'minecraft', 'minecraft uuid', () => {
    const wrap = el('div');
    wrap.appendChild(hint('name → uuid → face.'));
    const i = input('username');
    const b = btn('resolve');
    wrap.appendChild(row([i, b]));
    const o = out(); wrap.appendChild(o);

    async function run() {
      const u = i.value.trim();
      if (!u) return;
      o.innerHTML = '<span class="m">resolving…</span>';
      try {
        const res = await fetch(`https://api.mojang.com/users/profiles/minecraft/${u}`);
        if (res.status !== 200) { o.innerHTML = '<span class="m">not found.</span>'; return; }
        const j = await res.json();
        o.innerHTML = kv([
          ['name', j.name],
          ['uuid', j.id],
          ['uuid (dashed)', j.id.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5')],
          ['skin', `https://crafatar.com/renders/body/${j.id}?overlay`],
          ['head', `https://crafatar.com/avatars/${j.id}?size=128&overlay`],
          ['name history', `https://api.mojang.com/user/profiles/${j.id}/names`],
        ]);
      } catch { o.innerHTML = '<span class="m">failed.</span>'; }
    }
    b.addEventListener('click', run);
    i.addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
    return wrap;
  });

  /* ============================================================
     NETWORK
     ============================================================ */

  register('network', 'fusion', 'ip / domain fusion', () => {
    const wrap = el('div');
    wrap.appendChild(hint('everything i can find about an ip or domain, at once.'));
    const i = input('ip or domain');
    const b = btn('fuse');
    wrap.appendChild(row([i, b]));
    const o = out(); wrap.appendChild(o);

    async function run() {
      const q = i.value.trim();
      if (!q) return;
      o.innerHTML = '<span class="m">fusing…</span>';
      const rows = [];
      const isIP = /^\d{1,3}(\.\d{1,3}){3}$/.test(q);

      try {
        const res = await fetch(`https://ipwho.is/${q}`);
        const j = await res.json();
        if (j.success === false) rows.push(['geo', j.message || 'failed']);
        else {
          rows.push(['ip', j.ip]);
          rows.push(['country', `${j.country} (${j.country_code})`]);
          rows.push(['region', j.region || '-']);
          rows.push(['city', j.city || '-']);
          rows.push(['isp', j.connection?.isp || '-']);
          rows.push(['org', j.connection?.org || '-']);
          rows.push(['asn', j.connection?.asn ? `AS${j.connection.asn}` : '-']);
          rows.push(['timezone', j.timezone?.id || '-']);
          rows.push(['lat/lon', `${j.latitude}, ${j.longitude}`]);
        }
      } catch { rows.push(['geo', 'failed']); }

      if (!isIP) {
        try {
          const res = await fetch(`https://dns.google/resolve?name=${q}&type=A`);
          const j = await res.json();
          rows.push(['dns a', (j.Answer || []).filter(x => x.type === 1).map(x => x.data).join(', ') || 'none']);
        } catch { rows.push(['dns a', 'failed']); }
        try {
          const res = await fetch(`https://dns.google/resolve?name=${q}&type=MX`);
          const j = await res.json();
          rows.push(['mx', (j.Answer || []).map(x => x.data).join(' | ') || 'none']);
        } catch { rows.push(['mx', 'failed']); }
        try {
          const res = await fetch(`https://rdap.org/domain/${q}`, { headers: { Accept: 'application/rdap+json' } });
          const j = await res.json();
          if (j.ldhName) rows.push(['rdap name', j.ldhName]);
          if (j.status) rows.push(['rdap status', j.status.join(', ')]);
          (j.events || []).forEach(e => rows.push([`rdap ${e.eventAction}`, e.eventDate]));
          const ns = (j.nameservers || []).map(n => n.ldhName).join(', ');
          if (ns) rows.push(['nameservers', ns]);
        } catch { rows.push(['rdap', 'failed']); }
        try {
          const res = await fetch(`https://crt.sh/?q=${q}&output=json`);
          const j = await res.json();
          const latest = j[0];
          if (latest) {
            rows.push(['ssl issuer', latest.issuer_name]);
            rows.push(['ssl first', latest.not_before]);
            rows.push(['ssl until', latest.not_after]);
          }
        } catch { rows.push(['ssl', 'failed']); }
      }

      o.innerHTML = kv(rows);
    }
    b.addEventListener('click', run);
    i.addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
    return wrap;
  });

  register('network', 'dns', 'dns lookup', () => {
    const wrap = el('div');
    wrap.appendChild(hint('every record type worth looking at.'));
    const i = input('domain');
    const b = btn('lookup all');
    wrap.appendChild(row([i, b]));
    const o = out(); wrap.appendChild(o);

    async function run() {
      const d = i.value.trim();
      if (!d) return;
      o.innerHTML = '<span class="m">querying…</span>';
      const rows = [];
      for (const t of ['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME', 'SOA']) {
        try {
          const res = await fetch(`https://dns.google/resolve?name=${d}&type=${t}`);
          const j = await res.json();
          const answers = (j.Answer || []).map(a => a.data).join(' | ') || '-';
          rows.push([t, answers]);
        } catch { rows.push([t, 'failed']); }
      }
      o.innerHTML = kv(rows);
    }
    b.addEventListener('click', run);
    i.addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
    return wrap;
  });

  register('network', 'whois', 'whois (rdap)', () => {
    const wrap = el('div');
    wrap.appendChild(hint('who owns it, when, and until when.'));
    const i = input('domain.tld');
    const b = btn('lookup');
    wrap.appendChild(row([i, b]));
    const o = out(); wrap.appendChild(o);

    async function run() {
      const d = i.value.trim();
      if (!d) return;
      o.innerHTML = '<span class="m">querying…</span>';
      try {
        const res = await fetch(`https://rdap.org/domain/${d}`, { headers: { Accept: 'application/rdap+json' } });
        if (res.status !== 200) { o.innerHTML = '<span class="m">not found.</span>'; return; }
        const j = await res.json();
        const rows = [];
        rows.push(['name', j.ldhName || d]);
        if (j.status) rows.push(['status', j.status.join(', ')]);
        (j.events || []).forEach(e => rows.push([e.eventAction, e.eventDate]));
        const ns = (j.nameservers || []).map(n => n.ldhName).join(' | ');
        if (ns) rows.push(['nameservers', ns]);
        const ents = j.entities || [];
        ents.forEach(en => {
          const roles = (en.roles || []).join(',');
          if (roles) rows.push([`entity [${roles}]`, (en.vcardArray?.[1] || []).find(v => v[0] === 'fn')?.[3] || '-']);
        });
        o.innerHTML = kv(rows);
      } catch { o.innerHTML = '<span class="m">failed.</span>'; }
    }
    b.addEventListener('click', run);
    i.addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
    return wrap;
  });

  register('network', 'ssl', 'ssl cert history', () => {
    const wrap = el('div');
    wrap.appendChild(hint('every cert ever issued. subdomains fall out of it.'));
    const i = input('domain.tld');
    const b = btn('search');
    wrap.appendChild(row([i, b]));
    const o = out(); wrap.appendChild(o);

    async function run() {
      const d = i.value.trim();
      if (!d) return;
      o.innerHTML = '<span class="m">searching…</span>';
      try {
        const res = await fetch(`https://crt.sh/?q=%25.${d}&output=json`);
        const j = await res.json();
        if (!Array.isArray(j) || !j.length) { o.innerHTML = '<span class="m">none found.</span>'; return; }
        const uniqNames = new Set();
        j.forEach(c => (c.name_value || '').split('\n').forEach(n => uniqNames.add(n)));
        const issuers = new Set(j.map(c => c.issuer_name));
        const rows = [
          ['total certs', j.length],
          ['unique names', uniqNames.size],
          ['unique issuers', issuers.size],
          ['first issued', j.map(c => c.not_before).sort()[0]],
          ['last issued', j.map(c => c.not_before).sort().slice(-1)[0]],
        ];
        o.innerHTML = kv(rows) +
          '<div class="label">unique hostnames</div>' +
          '<div class="pane">' + [...uniqNames].sort().join('\n') + '</div>';
      } catch { o.innerHTML = '<span class="m">failed.</span>'; }
    }
    b.addEventListener('click', run);
    i.addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
    return wrap;
  });

  register('network', 'subdomain', 'subdomain enum', () => {
    const wrap = el('div');
    wrap.appendChild(hint('the subdomains nobody told you about.'));
    const i = input('domain.tld');
    const b = btn('enum');
    wrap.appendChild(row([i, b]));
    const o = out(); wrap.appendChild(o);

    async function run() {
      const d = i.value.trim();
      if (!d) return;
      o.innerHTML = '<span class="m">pulling cert transparency logs…</span>';
      try {
        const res = await fetch(`https://crt.sh/?q=%25.${d}&output=json`);
        const j = await res.json();
        const subs = new Set();
        j.forEach(c => (c.name_value || '').split('\n').forEach(n => {
          n = n.trim().toLowerCase();
          if (n.endsWith(d) && n !== d && n !== '*.' + d) subs.add(n);
        }));
        const list = [...subs].sort();
        if (!list.length) { o.innerHTML = '<span class="m">no subdomains found.</span>'; return; }
        o.innerHTML = `<div class="kv"><span class="k">found</span> <span class="v">${list.length} unique subdomains</span></div>
<div class="pane">${list.join('\n')}</div>`;
      } catch { o.innerHTML = '<span class="m">failed.</span>'; }
    }
    b.addEventListener('click', run);
    i.addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
    return wrap;
  });

  /* ============================================================
     TEXT
     ============================================================ */

  register('text', 'encode', 'encode / decode', () => {
    const wrap = el('div');
    wrap.appendChild(hint('paste in. see every encoding at once.'));
    const ta = textarea('type here…');
    wrap.appendChild(ta);

    const modes = ['base64', 'base64url', 'hex', 'url', 'html', 'binary', 'octal'];
    const panes = {};
    modes.forEach(m => {
      const lbl = el('div', { class: 'label', html: m });
      const p = el('div', { class: 'pane' });
      wrap.appendChild(lbl);
      wrap.appendChild(p);
      panes[m] = p;
    });

    function encode(which, s) {
      try {
        switch (which) {
          case 'base64':    return btoa(unescape(encodeURIComponent(s)));
          case 'base64url': return btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
          case 'hex':       return [...new TextEncoder().encode(s)].map(b => b.toString(16).padStart(2, '0')).join('');
          case 'url':       return encodeURIComponent(s);
          case 'html':      return [...s].map(c => `&#${c.charCodeAt(0)};`).join('');
          case 'binary':    return [...new TextEncoder().encode(s)].map(b => b.toString(2).padStart(8, '0')).join(' ');
          case 'octal':     return [...new TextEncoder().encode(s)].map(b => b.toString(8).padStart(3, '0')).join(' ');
        }
      } catch (e) { return '[err] ' + e.message; }
    }

    function update() {
      const v = ta.value;
      modes.forEach(m => { panes[m].textContent = v ? encode(m, v) : ''; });
    }
    ta.addEventListener('input', update);

    wrap.appendChild(el('div', { class: 'label', html: 'decode (auto)' }));
    const di = input('paste encoded');
    const db = btn('decode');
    const dp = el('div', { class: 'pane' });
    wrap.appendChild(row([di, db]));
    wrap.appendChild(dp);

    db.addEventListener('click', () => {
      const s = di.value.trim();
      try {
        if (/^[0-9a-f\s]+$/i.test(s)) dp.textContent = new TextDecoder().decode(new Uint8Array(s.replace(/\s/g, '').match(/.{2}/g).map(b => parseInt(b, 16))));
        else if (/^[01\s]+$/.test(s)) dp.textContent = new TextDecoder().decode(new Uint8Array(s.replace(/\s/g, '').match(/.{8}/g).map(b => parseInt(b, 2))));
        else dp.textContent = decodeURIComponent(escape(atob(s)));
      } catch (e) { dp.textContent = '[err] ' + e.message; }
    });
    return wrap;
  });

  register('text', 'cipher', 'cipher box', () => {
    const wrap = el('div');
    wrap.appendChild(hint('the old ones.'));
    const ta = textarea('type here…');
    wrap.appendChild(ta);

    const shift = input('shift (caesar)', '3'); shift.style.maxWidth = '100px';
    const vkey = input('vigenère key', 'grave'); vkey.style.maxWidth = '160px';
    wrap.appendChild(row([el('span', { class: 'hint', html: 'caesar shift' }), shift, el('span', { class: 'hint', html: 'vigenère key' }), vkey]));

    const results = ['rot13', 'caesar', 'atbash', 'vigenère'];
    const panes = {};
    results.forEach(r => {
      wrap.appendChild(el('div', { class: 'label', html: r }));
      const p = el('div', { class: 'pane' });
      panes[r] = p;
      wrap.appendChild(p);
    });

    const rot = (s, n) => s.replace(/[a-z]/gi, c => {
      const base = c <= 'Z' ? 65 : 97;
      return String.fromCharCode(((c.charCodeAt(0) - base + n + 26 * 100) % 26) + base);
    });
    const atbash = s => s.replace(/[a-z]/gi, c => {
      const base = c <= 'Z' ? 65 : 97;
      return String.fromCharCode(base + 25 - (c.charCodeAt(0) - base));
    });
    const vigenere = (s, k) => {
      k = k.replace(/[^a-z]/gi, '').toLowerCase();
      if (!k) return s;
      let ki = 0;
      return s.replace(/[a-z]/gi, c => {
        const base = c <= 'Z' ? 65 : 97;
        const sh = k.charCodeAt(ki % k.length) - 97;
        ki++;
        return String.fromCharCode(((c.charCodeAt(0) - base + sh + 26) % 26) + base);
      });
    };

    function update() {
      const v = ta.value;
      const n = parseInt(shift.value) || 0;
      panes['rot13'].textContent = rot(v, 13);
      panes['caesar'].textContent = rot(v, n);
      panes['atbash'].textContent = atbash(v);
      panes['vigenère'].textContent = vigenere(v, vkey.value);
    }
    [ta, shift, vkey].forEach(n => n.addEventListener('input', update));
    update();
    return wrap;
  });

  register('text', 'leet', 'leetspeak', () => {
    const wrap = el('div');
    wrap.appendChild(hint('the obvious and the not-so-obvious.'));
    const ta = textarea('type here…');
    wrap.appendChild(ta);

    const BASIC = { a: '4', e: '3', i: '1', o: '0', s: '5', t: '7' };
    const ADV = { a: '@', b: '8', e: '3', g: '6', i: '!', l: '1', o: '0', s: '$', t: '7', z: '2' };

    wrap.appendChild(el('div', { class: 'label', html: 'basic' }));
    const p1 = el('div', { class: 'pane' }); wrap.appendChild(p1);
    wrap.appendChild(el('div', { class: 'label', html: 'advanced' }));
    const p2 = el('div', { class: 'pane' }); wrap.appendChild(p2);

    const conv = (s, map) => [...s.toLowerCase()].map(c => map[c] || c).join('');
    function update() {
      const v = ta.value;
      p1.textContent = v ? conv(v, BASIC) : '';
      p2.textContent = v ? conv(v, ADV) : '';
    }
    ta.addEventListener('input', update);
    return wrap;
  });

  register('text', 'zero-width', 'invisible text', () => {
    const wrap = el('div');
    wrap.appendChild(hint('chars you can\u2019t see. put them somewhere.'));
    const ta = textarea('visible text (optional)…');
    wrap.appendChild(ta);
    const b1 = btn('invisible only');
    const b2 = btn('text → zero-width encode');
    const b3 = btn('detect hidden');
    wrap.appendChild(row([b1, b2, b3]));
    const o = out(); wrap.appendChild(o);

    const ZW = ['\u200B', '\u200C', '\u200D', '\u2060', '\uFEFF'];

    b1.addEventListener('click', () => {
      const n = parseInt(ta.value) || 30;
      const count = Math.min(Math.max(n, 1), 400);
      let s = '';
      for (let i = 0; i < count; i++) s += ZW[Math.floor(Math.random() * ZW.length)];
      o.innerHTML = `<div class="pane" style="user-select:all">${s}</div><div class="hint">${count} invisible chars generated — copy the box above.</div>`;
    });

    b2.addEventListener('click', () => {
      const text = ta.value;
      let enc = '';
      for (const ch of text) {
        const code = ch.charCodeAt(0);
        for (let i = 7; i >= 0; i--) enc += (code >> i) & 1 ? '\u200B' : '\u200C';
        enc += '\u200D';
      }
      o.innerHTML = `<div class="pane" style="user-select:all">${enc}</div><div class="hint">encoded. paste into detect to decode.</div>`;
    });

    b3.addEventListener('click', () => {
      const text = ta.value;
      const found = [...text].filter(c => ZW.includes(c)).length;
      let decoded = '';
      let bits = '';
      for (const ch of text) {
        if (ch === '\u200B') bits += '1';
        else if (ch === '\u200C') bits += '0';
        else if (ch === '\u200D') {
          if (bits.length === 8) decoded += String.fromCharCode(parseInt(bits, 2));
          bits = '';
        }
      }
      o.innerHTML = kv([
        ['zero-width chars found', found],
        ['decoded', decoded || '(nothing decodable)'],
      ]);
    });
    return wrap;
  });

  register('text', 'counter', 'char counter', () => {
    const wrap = el('div');
    wrap.appendChild(hint('everything about the text you pasted.'));
    const ta = textarea('type or paste…');
    wrap.appendChild(ta);
    const o = el('div', { class: 'pane' });
    wrap.appendChild(o);

    function update() {
      const v = ta.value;
      const chars = [...v].length;
      const words = (v.trim().match(/\S+/g) || []).length;
      const lines = v ? v.split('\n').length : 0;
      const bytes = new TextEncoder().encode(v).length;
      let letters = 0, digits = 0, spaces = 0, punct = 0, emoji = 0, other = 0;
      for (const ch of v) {
        const cp = ch.codePointAt(0);
        if (/\p{L}/u.test(ch)) letters++;
        else if (/\p{N}/u.test(ch)) digits++;
        else if (/\s/.test(ch)) spaces++;
        else if (cp >= 0x1F000) emoji++;
        else if (/\p{P}/u.test(ch) || /\p{S}/u.test(ch)) punct++;
        else other++;
      }
      o.innerHTML = kv([
        ['chars', chars],
        ['words', words],
        ['lines', lines],
        ['bytes (utf-8)', bytes],
        ['letters', letters],
        ['digits', digits],
        ['spaces', spaces],
        ['punctuation/symbols', punct],
        ['emoji', emoji],
        ['other', other],
      ]);
    }
    ta.addEventListener('input', update);
    return wrap;
  });

  /* ============================================================
     UTILITY
     ============================================================ */

  register('utility', 'hash', 'hash generator', () => {
    const wrap = el('div');
    wrap.appendChild(hint('all four, live.'));
    const ta = textarea('type here…');
    wrap.appendChild(ta);
    const o = el('div', { class: 'pane' });
    wrap.appendChild(o);

    let t = null;
    function update() {
      clearTimeout(t);
      t = setTimeout(async () => {
        const v = ta.value;
        if (!v) { o.textContent = ''; return; }
        const rows = [];
        rows.push(['md5', await md5Hex(v)]);
        rows.push(['sha-1', await shaHex('SHA-1', v)]);
        rows.push(['sha-256', await shaHex('SHA-256', v)]);
        rows.push(['sha-512', await shaHex('SHA-512', v)]);
        o.innerHTML = kv(rows);
      }, 120);
    }
    ta.addEventListener('input', update);
    return wrap;
  });

  register('utility', 'qr', 'qr generator', () => {
    const wrap = el('div');
    wrap.appendChild(hint('anything into a square.'));
    const i = input('text or url', 'https://grave.rest');
    const sz = input('size', '320'); sz.style.maxWidth = '100px';
    const b = btn('generate');
    wrap.appendChild(row([i, sz, b]));
    const holder = el('div');
    wrap.appendChild(holder);
    const dl = btn('download png', true);
    dl.disabled = true;
    wrap.appendChild(dl);

    let curCanvas = null;

    function qrEncode(text) {
      const data = new TextEncoder().encode(text);
      const versions = [null,
        { size: 21, cap: 17 }, { size: 25, cap: 32 }, { size: 29, cap: 53 },
        { size: 33, cap: 78 }, { size: 37, cap: 106 }, { size: 41, cap: 134 },
        { size: 45, cap: 154 }, { size: 49, cap: 192 }, { size: 53, cap: 230 },
        { size: 57, cap: 271 },
      ];
      let v = 1;
      for (let i = 1; i <= 10; i++) { if (data.length <= versions[i].cap) { v = i; break; } }
      if (data.length > versions[10].cap) return null;
      const size = versions[v].size;
      const modules = Array.from({ length: size }, () => Array(size).fill(false));
      const reserved = Array.from({ length: size }, () => Array(size).fill(false));

      const placeFinder = (r, c) => {
        for (let y = -1; y <= 7; y++) {
          for (let x = -1; x <= 7; x++) {
            const rr = r + y, cc = c + x;
            if (rr < 0 || cc < 0 || rr >= size || cc >= size) continue;
            const on = (y >= 0 && y <= 6 && (x === 0 || x === 6)) ||
                       (x >= 0 && x <= 6 && (y === 0 || y === 6)) ||
                       (y >= 2 && y <= 4 && x >= 2 && x <= 4);
            modules[rr][cc] = on;
            reserved[rr][cc] = true;
          }
        }
      };
      placeFinder(0, 0);
      placeFinder(0, size - 7);
      placeFinder(size - 7, 0);

      for (let i = 8; i < size - 8; i++) {
        modules[6][i] = i % 2 === 0;
        modules[i][6] = i % 2 === 0;
        reserved[6][i] = true;
        reserved[i][6] = true;
      }

      if (v >= 2) {
        const pos = v === 2 ? [6, 18] : v === 3 ? [6, 22] : v === 4 ? [6, 26] : v === 5 ? [6, 30] : v === 6 ? [6, 34] : [6, 22, 38];
        for (const r of pos) for (const c of pos) {
          if (reserved[r]?.[c]) continue;
          for (let y = -2; y <= 2; y++) for (let x = -2; x <= 2; x++) {
            const on = Math.max(Math.abs(y), Math.abs(x)) !== 1;
            if (r + y < size && c + x < size) {
              modules[r + y][c + x] = on;
              reserved[r + y][c + x] = true;
            }
          }
        }
      }

      for (let i = 0; i < 9; i++) { if (!reserved[8][i]) reserved[8][i] = true; if (!reserved[i][8]) reserved[i][8] = true; }
      for (let i = 0; i < 8; i++) { if (!reserved[8][size - 1 - i]) reserved[8][size - 1 - i] = true; if (!reserved[size - 1 - i][8]) reserved[size - 1 - i][8] = true; }
      reserved[8][size - 8] = true;

      const bits = [];
      const pushBits = (val, len) => { for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1); };
      pushBits(4, 4);
      pushBits(data.length, v <= 9 ? 8 : 16);
      for (const bb of data) pushBits(bb, 8);
      while (bits.length % 8 !== 0) bits.push(0);
      const padBytes = [0xEC, 0x11];
      let pi = 0;
      const totalData = versions[v].cap * 8 + 4;
      while (bits.length < totalData) pushBits(padBytes[pi++ % 2], 8);

      let dir = -1, x = size - 1, bitIdx = 0;
      while (x > 0) {
        if (x === 6) x--;
        for (let i = 0; i < size; i++) {
          const yy = dir < 0 ? size - 1 - i : i;
          if (!reserved[yy][x]) modules[yy][x] = bitIdx < bits.length ? !!bits[bitIdx++] : false;
          if (!reserved[yy][x - 1]) modules[yy][x - 1] = bitIdx < bits.length ? !!bits[bitIdx++] : false;
        }
        dir = -dir;
        x -= 2;
      }

      return { size, modules };
    }

    function render(text, target) {
      const qr = qrEncode(text);
      if (!qr) return null;
      const c = document.createElement('canvas');
      const n = qr.size;
      const scale = Math.max(1, Math.floor(target / (n + 8)));
      c.width = c.height = (n + 8) * scale;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = '#000';
      for (let y = 0; y < n; y++)
        for (let x = 0; x < n; x++)
          if (qr.modules[y][x]) ctx.fillRect((x + 4) * scale, (y + 4) * scale, scale, scale);
      return c;
    }

    b.addEventListener('click', () => {
      const c = render(i.value || 'grave.rest', parseInt(sz.value) || 320);
      if (!c) { holder.innerHTML = '<div class="hint">text too long for built-in encoder (max ~270 bytes).</div>'; return; }
      holder.innerHTML = '';
      holder.appendChild(c);
      curCanvas = c;
      dl.disabled = false;
    });
    dl.addEventListener('click', () => {
      if (!curCanvas) return;
      const a = document.createElement('a');
      a.href = curCanvas.toDataURL('image/png');
      a.download = 'grave_qr.png';
      a.click();
    });
    return wrap;
  });

  register('utility', 'password', 'password generator', () => {
    const wrap = el('div');
    wrap.appendChild(hint('local. no server sees it.'));
    const len = input('length', '20'); len.style.maxWidth = '90px';
    const upper = el('input'); upper.type = 'checkbox'; upper.checked = true;
    const nums = el('input'); nums.type = 'checkbox'; nums.checked = true;
    const sym = el('input'); sym.type = 'checkbox'; sym.checked = true;
    const amb = el('input'); amb.type = 'checkbox'; amb.checked = false;
    const mk = (lbl, cb) => { const w = el('label', { class: 'hint' }); w.appendChild(cb); w.appendChild(document.createTextNode(' ' + lbl)); return w; };
    wrap.appendChild(row([el('span', { class: 'hint', html: 'length' }), len, mk('upper', upper), mk('nums', nums), mk('sym', sym), mk('no ambiguous', amb)]));
    const b = btn('generate');
    wrap.appendChild(row([b]));
    const o = out(); wrap.appendChild(o);

    function gen() {
      const L = Math.max(4, Math.min(256, parseInt(len.value) || 20));
      let pool = 'abcdefghijklmnopqrstuvwxyz';
      if (upper.checked) pool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (nums.checked) pool += '0123456789';
      if (sym.checked) pool += '!@#$%^&*()-_=+[]{};:,.<>?/~';
      if (amb.checked) pool = pool.replace(/[Il1O0o]/g, '');
      const bytes = new Uint32Array(L);
      crypto.getRandomValues(bytes);
      let s = '';
      for (let i = 0; i < L; i++) s += pool[bytes[i] % pool.length];
      const bits = L * Math.log2(pool.length);
      let strength = 'weak';
      if (bits > 60) strength = 'ok';
      if (bits > 90) strength = 'strong';
      if (bits > 128) strength = 'paranoid';
      o.innerHTML = `<div class="pane" style="user-select:all;font-size:15px">${s}</div>
<div class="hint">${bits.toFixed(1)} bits · ${strength}</div>`;
    }
    b.addEventListener('click', gen);
    return wrap;
  });

  register('utility', 'uuid', 'uuid / ulid', () => {
    const wrap = el('div');
    wrap.appendChild(hint('v4 and ulid.'));
    const n = input('count', '5'); n.style.maxWidth = '80px';
    const b = btn('generate');
    const bu = btn('ulid');
    wrap.appendChild(row([n, b, bu]));
    const o = out(); wrap.appendChild(o);

    function uuid4() {
      const b = new Uint8Array(16);
      crypto.getRandomValues(b);
      b[6] = (b[6] & 0x0F) | 0x40;
      b[8] = (b[8] & 0x3F) | 0x80;
      const h = [...b].map(x => x.toString(16).padStart(2, '0')).join('');
      return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
    }

    const ULID_CHARS = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
    function ulid() {
      let t = Date.now();
      let time = '';
      for (let i = 0; i < 10; i++) { time = ULID_CHARS[t % 32] + time; t = Math.floor(t / 32); }
      let rand = '';
      const b = new Uint8Array(16);
      crypto.getRandomValues(b);
      for (let i = 0; i < 16; i++) rand += ULID_CHARS[b[i] % 32];
      return time + rand;
    }

    function show(fn) {
      const c = Math.max(1, Math.min(100, parseInt(n.value) || 5));
      const list = [];
      for (let i = 0; i < c; i++) list.push(fn());
      o.innerHTML = `<div class="pane">${list.join('\n')}</div>`;
    }

    b.addEventListener('click', () => show(uuid4));
    bu.addEventListener('click', () => show(ulid));
    return wrap;
  });

  register('utility', 'timestamp', 'unix timestamp', () => {
    const wrap = el('div');
    wrap.appendChild(hint('numbers ↔ dates.'));
    const now = el('div', { class: 'pane' }); wrap.appendChild(now);
    const i = input('unix seconds or iso date');
    const b = btn('convert');
    wrap.appendChild(row([i, b]));
    const o = out(); wrap.appendChild(o);

    function tick() {
      const d = new Date();
      now.textContent = `now: ${Math.floor(d.getTime() / 1000)}  ·  ${d.toISOString()}`;
    }
    tick(); setInterval(tick, 1000);

    b.addEventListener('click', () => {
      const v = i.value.trim();
      let ts;
      if (/^\d+$/.test(v)) ts = parseInt(v) * (v.length > 10 ? 1 : 1000);
      else ts = Date.parse(v);
      if (isNaN(ts)) { o.innerHTML = '<span class="m">could not parse.</span>'; return; }
      const d = new Date(ts);
      o.innerHTML = kv([
        ['unix (s)', Math.floor(d.getTime() / 1000)],
        ['unix (ms)', d.getTime()],
        ['iso', d.toISOString()],
        ['utc', d.toUTCString()],
        ['local', d.toString()],
      ]);
    });
    return wrap;
  });

  register('utility', 'lorem', 'lorem ipsum', () => {
    const wrap = el('div');
    wrap.appendChild(hint('filler.'));
    const n = input('count', '3'); n.style.maxWidth = '80px';
    const mode = el('select', { class: 'input' });
    mode.style.maxWidth = '140px';
    ['paragraphs', 'sentences', 'words'].forEach(m => {
      const o = el('option'); o.value = m; o.textContent = m; mode.appendChild(o);
    });
    const b = btn('generate');
    wrap.appendChild(row([n, mode, b]));
    const o = out(); wrap.appendChild(o);

    const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(' ');

    const randWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];
    function sentence() {
      const n = 8 + Math.floor(Math.random() * 10);
      const w = Array.from({ length: n }, randWord);
      w[0] = w[0][0].toUpperCase() + w[0].slice(1);
      return w.join(' ') + '.';
    }
    function paragraph() {
      const n = 4 + Math.floor(Math.random() * 4);
      return Array.from({ length: n }, sentence).join(' ');
    }

    b.addEventListener('click', () => {
      const c = Math.max(1, Math.min(50, parseInt(n.value) || 3));
      let res;
      if (mode.value === 'words') res = Array.from({ length: c }, randWord).join(' ');
      else if (mode.value === 'sentences') res = Array.from({ length: c }, sentence).join(' ');
      else res = Array.from({ length: c }, paragraph).join('\n\n');
      o.innerHTML = `<div class="pane">${res}</div>`;
    });
    return wrap;
  });

  register('utility', 'color', 'color converter', () => {
    const wrap = el('div');
    wrap.appendChild(hint('pick a color, see every form of it.'));
    const h = input('#ff2e63');
    const r = input('r', '255'); r.style.maxWidth = '70px';
    const g = input('g', '46'); g.style.maxWidth = '70px';
    const bl = input('b', '99'); bl.style.maxWidth = '70px';
    wrap.appendChild(row([el('span', { class: 'hint', html: 'hex' }), h]));
    wrap.appendChild(row([el('span', { class: 'hint', html: 'rgb' }), r, g, bl]));
    const swatch = el('div', { class: 'pane' });
    swatch.style.height = '80px'; swatch.style.padding = '0'; swatch.style.border = '1px solid #333';
    wrap.appendChild(swatch);
    const o = out(); wrap.appendChild(o);

    function fromHex() {
      const v = h.value.trim().replace('#', '');
      if (!/^[0-9a-f]{3,6}$/i.test(v)) return;
      const full = v.length === 3 ? v.split('').map(c => c + c).join('') : v;
      const n = parseInt(full, 16);
      r.value = (n >> 16) & 255;
      g.value = (n >> 8) & 255;
      bl.value = n & 255;
      update();
    }
    function fromRgb() {
      const rr = Math.max(0, Math.min(255, parseInt(r.value) || 0));
      const gg = Math.max(0, Math.min(255, parseInt(g.value) || 0));
      const bb = Math.max(0, Math.min(255, parseInt(bl.value) || 0));
      h.value = '#' + [rr, gg, bb].map(x => x.toString(16).padStart(2, '0')).join('');
      update();
    }
    function update() {
      const rr = Math.max(0, Math.min(255, parseInt(r.value) || 0));
      const gg = Math.max(0, Math.min(255, parseInt(g.value) || 0));
      const bb = Math.max(0, Math.min(255, parseInt(bl.value) || 0));
      const hex = '#' + [rr, gg, bb].map(x => x.toString(16).padStart(2, '0')).join('');
      const rn = rr / 255, gn = gg / 255, bn = bb / 255;
      const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
      let hue = 0, sat = 0, lig = (max + min) / 2;
      if (max !== min) {
        const d = max - min;
        sat = lig > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case rn: hue = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
          case gn: hue = ((bn - rn) / d + 2) / 6; break;
          case bn: hue = ((rn - gn) / d + 4) / 6; break;
        }
      }
      swatch.style.background = hex;
      o.innerHTML = kv([
        ['hex', hex],
        ['rgb', `${rr}, ${gg}, ${bb}`],
        ['hsl', `${(hue * 360).toFixed(1)}°, ${(sat * 100).toFixed(1)}%, ${(lig * 100).toFixed(1)}%`],
      ]);
    }
    h.addEventListener('input', fromHex);
    [r, g, bl].forEach(n => n.addEventListener('input', fromRgb));
    update();
    return wrap;
  });

  /* ============================================================
     MEDIA
     ============================================================ */

  register('media', 'img-ascii', 'image → ascii', () => {
    const wrap = el('div');
    wrap.appendChild(hint('picture in, characters out.'));
    const fi = el('input', { class: 'input', type: 'file', accept: 'image/*' });
    const w = input('width (chars)', '100'); w.style.maxWidth = '110px';
    const b = btn('render');
    wrap.appendChild(row([fi, w, b]));
    const pre = el('pre', { class: 'pane' });
    pre.style.fontSize = '6px'; pre.style.lineHeight = '1'; pre.style.overflow = 'auto'; pre.style.maxHeight = '420px';
    wrap.appendChild(pre);

    b.addEventListener('click', () => {
      const f = fi.files[0];
      if (!f) return;
      const img = new Image();
      img.onload = () => {
        const cw = Math.max(20, Math.min(300, parseInt(w.value) || 100));
        const ch = Math.floor(cw * (img.height / img.width) * 0.5);
        const c = document.createElement('canvas');
        c.width = cw; c.height = ch;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0, cw, ch);
        const data = ctx.getImageData(0, 0, cw, ch).data;
        const chars = '@%#*+=-:. ';
        let s = '';
        for (let y = 0; y < ch; y++) {
          for (let x = 0; x < cw; x++) {
            const i = (y * cw + x) * 4;
            const lum = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
            s += chars[Math.floor(lum * (chars.length - 1))];
          }
          s += '\n';
        }
        pre.textContent = s;
      };
      img.src = URL.createObjectURL(f);
    });
    return wrap;
  });

  register('media', 'img-b64', 'image → base64', () => {
    const wrap = el('div');
    wrap.appendChild(hint('image as a string you can paste anywhere.'));
    const fi = el('input', { class: 'input', type: 'file', accept: 'image/*' });
    wrap.appendChild(row([fi]));
    const o = out(); wrap.appendChild(o);

    fi.addEventListener('change', () => {
      const f = fi.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        o.innerHTML = `<div class="hint">${f.name} · ${(f.size / 1024).toFixed(1)} KB</div>
<div class="pane" style="user-select:all;word-break:break-all">${r.result}</div>`;
      };
      r.readAsDataURL(f);
    });
    return wrap;
  });

  register('media', 'img-palette', 'palette from image', () => {
    const wrap = el('div');
    wrap.appendChild(hint('the colors hiding in a picture.'));
    const fi = el('input', { class: 'input', type: 'file', accept: 'image/*' });
    const n = input('colors', '6'); n.style.maxWidth = '80px';
    const b = btn('extract');
    wrap.appendChild(row([fi, n, b]));
    const holder = el('div');
    wrap.appendChild(holder);

    b.addEventListener('click', () => {
      const f = fi.files[0];
      if (!f) return;
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        const w = 120;
        const h = Math.floor(img.height / img.width * w);
        c.width = w; c.height = h;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const data = ctx.getImageData(0, 0, w, h).data;
        const buckets = {};
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i] >> 4, g = data[i + 1] >> 4, bl = data[i + 2] >> 4;
          const key = (r << 8) | (g << 4) | bl;
          buckets[key] = (buckets[key] || 0) + 1;
        }
        const top = Object.entries(buckets).sort((a, b) => b[1] - a[1]).slice(0, parseInt(n.value) || 6);
        holder.innerHTML = '';
        const grid = el('div');
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(120px, 1fr))';
        grid.style.gap = '8px';
        grid.style.marginTop = '12px';
        top.forEach(([key]) => {
          const k = parseInt(key);
          const r = ((k >> 8) & 0xF) * 17, g = ((k >> 4) & 0xF) * 17, bl = (k & 0xF) * 17;
          const hex = '#' + [r, g, bl].map(x => x.toString(16).padStart(2, '0')).join('');
          const cell = el('div');
          cell.style.background = hex;
          cell.style.padding = '22px 10px';
          cell.style.border = '1px solid #222';
          cell.style.fontSize = '11px';
          cell.style.color = (r + g + bl > 380) ? '#000' : '#fff';
          cell.style.textAlign = 'center';
          cell.textContent = hex.toUpperCase();
          grid.appendChild(cell);
        });
        holder.appendChild(grid);
      };
      img.src = URL.createObjectURL(f);
    });
    return wrap;
  });

  register('media', 'img-filter', 'image filters', () => {
    const wrap = el('div');
    wrap.appendChild(hint('mess with a picture. keep it.'));
    const fi = el('input', { class: 'input', type: 'file', accept: 'image/*' });
    wrap.appendChild(row([fi]));
    const ctrls = el('div');
    wrap.appendChild(ctrls);
    const canvas = el('canvas', { class: 'preview' });
    wrap.appendChild(canvas);
    const dl = btn('download png', true);
    dl.disabled = true;
    wrap.appendChild(dl);

    const state = { gray: false, invert: false, sepia: false, blur: 0, sat: 100, brightness: 100 };
    let baseImg = null;

    function buildCtrls() {
      ctrls.innerHTML = '';
      const mk = (label, key, type = 'checkbox') => {
        const w = el('label', { class: 'hint' });
        if (type === 'checkbox') {
          const cb = el('input'); cb.type = 'checkbox'; cb.checked = state[key];
          cb.addEventListener('input', () => { state[key] = cb.checked; render(); });
          w.appendChild(cb);
        } else {
          const r = el('input'); r.type = 'range'; r.min = 0; r.max = key === 'blur' ? 20 : 200; r.value = state[key];
          r.style.verticalAlign = 'middle'; r.style.marginLeft = '6px';
          r.addEventListener('input', () => { state[key] = parseInt(r.value); render(); });
          w.appendChild(r);
        }
        w.appendChild(document.createTextNode(' ' + label));
        return w;
      };
      const r1 = el('div', { class: 'row' });
      r1.appendChild(mk('gray', 'gray'));
      r1.appendChild(mk('invert', 'invert'));
      r1.appendChild(mk('sepia', 'sepia'));
      ctrls.appendChild(r1);
      const r2 = el('div', { class: 'row' });
      r2.appendChild(mk('blur', 'blur', 'range'));
      r2.appendChild(mk('sat%', 'sat', 'range'));
      r2.appendChild(mk('bright%', 'brightness', 'range'));
      ctrls.appendChild(r2);
    }
    buildCtrls();

    function render() {
      if (!baseImg) return;
      const ctx = canvas.getContext('2d');
      canvas.width = baseImg.width;
      canvas.height = baseImg.height;
      ctx.filter = [
        state.gray ? 'grayscale(1)' : '',
        state.invert ? 'invert(1)' : '',
        state.sepia ? 'sepia(0.8)' : '',
        state.blur ? `blur(${state.blur}px)` : '',
        `saturate(${state.sat}%)`,
        `brightness(${state.brightness}%)`,
      ].filter(Boolean).join(' ');
      ctx.drawImage(baseImg, 0, 0);
      ctx.filter = 'none';
    }

    fi.addEventListener('change', () => {
      const f = fi.files[0];
      if (!f) return;
      const img = new Image();
      img.onload = () => { baseImg = img; render(); dl.disabled = false; };
      img.src = URL.createObjectURL(f);
    });
    dl.addEventListener('click', () => {
      if (!baseImg) return;
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = 'grave_filtered.png';
      a.click();
    });
    return wrap;
  });

  /* ============================================================
     WEIRDCORE
     ============================================================ */

  register('weirdcore', 'glitchtext', 'glitch text', () => {
    const wrap = el('div');
    wrap.appendChild(hint('make it wrong on purpose.'));
    const i = input('text', 'grave');
    wrap.appendChild(row([i]));
    const o = el('div');
    wrap.appendChild(o);

    const ZALGO_UP = '\u0300\u0301\u0302\u0303\u0304\u0305\u0306\u0307\u0308\u0309\u030A\u030B\u030C\u030D\u030E\u030F\u0310\u0311';
    const ZALGO_DN = '\u0316\u0317\u0318\u0319\u031A\u031B\u031C\u031D\u031E\u031F\u0320\u0321\u0322\u0323\u0324\u0325';
    const ZALGO_MD = '\u0334\u0335\u0336\u0337\u0338\u0339\u033A\u033B\u033C\u033D\u033E\u033F';
    const zalgo = (t, n) => {
      let s = '';
      for (const ch of t) {
        s += ch;
        for (let i = 0; i < n; i++) {
          const pool = ZALGO_UP + ZALGO_DN + ZALGO_MD;
          s += pool[Math.floor(Math.random() * pool.length)];
        }
      }
      return s;
    };
    const FLIP = { a:'ɐ',b:'q',c:'ɔ',d:'p',e:'ǝ',f:'ɟ',g:'ƃ',h:'ɥ',i:'ᴉ',j:'ɾ',k:'ʞ',l:'l',m:'ɯ',n:'u',o:'o',p:'d',q:'b',r:'ɹ',s:'s',t:'ʇ',u:'n',v:'ʌ',w:'ʍ',x:'x',y:'ʎ',z:'z', A:'∀',B:'𐐒',C:'Ɔ',D:'ᗡ',E:'Ǝ',F:'Ⅎ',G:'⅁',H:'H',I:'I',J:'ſ',K:'ʞ',L:'˥',M:'W',N:'N',O:'O',P:'Ԁ',Q:'Ò',R:'ᴚ',S:'S',T:'⊥',U:'∩',V:'Λ',W:'M',X:'X',Y:'⅄',Z:'Z', '0':'0','1':'Ɩ','2':'ᄅ','3':'Ɛ','4':'ㄣ','5':'ϛ','6':'9','7':'ㄥ','8':'8','9':'6','.':'˙',',':"'",'?':'¿','!':'¡' };
    const SMALL = { a:'ᴀ',b:'ʙ',c:'ᴄ',d:'ᴅ',e:'ᴇ',f:'ꜰ',g:'ɢ',h:'ʜ',i:'ɪ',j:'ᴊ',k:'ᴋ',l:'ʟ',m:'ᴍ',n:'ɴ',o:'ᴏ',p:'ᴘ',q:'ǫ',r:'ʀ',s:'ꜱ',t:'ᴛ',u:'ᴜ',v:'ᴠ',w:'ᴡ',x:'x',y:'ʏ',z:'ᴢ' };
    const AEST = { a:'ａ',b:'ｂ',c:'ｃ',d:'ｄ',e:'ｅ',f:'ｆ',g:'ｇ',h:'ｈ',i:'ｉ',j:'ｊ',k:'ｋ',l:'ｌ',m:'ｍ',n:'ｎ',o:'ｏ',p:'ｐ',q:'ｑ',r:'ｒ',s:'ｓ',t:'ｔ',u:'ｕ',v:'ｖ',w:'ｗ',x:'ｘ',y:'ｙ',z:'ｚ' };

    function update() {
      const t = i.value || 'grave';
      const rows = [
        ['zalgo',   zalgo(t, 3)],
        ['zalgo+',  zalgo(t, 8)],
        ['flip',    [...t].map(c => FLIP[c] || c).reverse().join('')],
        ['small',   [...t.toLowerCase()].map(c => SMALL[c] || c).join('')],
        ['aesthetic', [...t.toLowerCase()].map(c => AEST[c] || c).join('')],
        ['spaced',  [...t].join(' ')],
        ['dots',    [...t].join('·')],
        ['struck',  [...t].join('\u0336') + '\u0336'],
      ];
      o.innerHTML = rows.map(([k, v]) => {
        const safe = v.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        return `<div class="label">${k}</div><div class="pane" style="user-select:all">${safe}</div>`;
      }).join('');
    }
    i.addEventListener('input', update);
    update();
    return wrap;
  });

  register('weirdcore', 'vhs', 'dead channel maker', () => {
    const wrap = el('div');
    wrap.appendChild(hint('make any picture look taped off a dead channel.'));
    const fi = el('input', { class: 'input', type: 'file', accept: 'image/*' });
    const b = btn('render');
    b.disabled = true;
    fi.addEventListener('change', () => { b.disabled = !fi.files.length; });
    wrap.appendChild(row([fi, b]));
    const o = out(); wrap.appendChild(o);
    const dl = btn('download png', true);
    dl.disabled = true;
    wrap.appendChild(dl);

    let canvas = null;

    b.addEventListener('click', () => {
      const f = fi.files[0];
      if (!f) return;
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = img.width; c.height = img.height;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const src = ctx.getImageData(0, 0, c.width, c.height);
        const dst = ctx.createImageData(c.width, c.height);
        const off = Math.max(2, Math.floor(c.width / 400));
        for (let y = 0; y < c.height; y++) {
          const rowShift = Math.sin(y * 0.02) * 1.5;
          for (let x = 0; x < c.width; x++) {
            const i = (y * c.width + x) * 4;
            const rI = (y * c.width + Math.min(c.width - 1, x + off + Math.round(rowShift))) * 4;
            const bI = (y * c.width + Math.max(0, x - off + Math.round(rowShift))) * 4;
            dst.data[i] = src.data[rI];
            dst.data[i + 1] = src.data[i + 1];
            dst.data[i + 2] = src.data[bI + 2];
            dst.data[i + 3] = 255;
          }
        }
        ctx.putImageData(dst, 0, 0);

        const noise = ctx.getImageData(0, 0, c.width, c.height);
        for (let i = 0; i < noise.data.length; i += 4) {
          const n = (Math.random() - 0.5) * 40;
          noise.data[i] = Math.max(0, Math.min(255, noise.data[i] + n));
          noise.data[i + 1] = Math.max(0, Math.min(255, noise.data[i + 1] + n));
          noise.data[i + 2] = Math.max(0, Math.min(255, noise.data[i + 2] + n));
        }
        ctx.putImageData(noise, 0, 0);

        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        for (let y = 0; y < c.height; y += 3) ctx.fillRect(0, y, c.width, 1);

        const fs = Math.max(14, Math.floor(c.width / 40));
        ctx.font = `${fs}px monospace`;
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.shadowColor = 'rgba(0,0,0,0.9)';
        ctx.shadowBlur = 4;
        const now = new Date();
        const pad = n => String(n).padStart(2, '0');
        const stamp = `${pad(now.getMonth() + 1)}/${pad(now.getDate())}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        ctx.fillText(stamp, 16, c.height - 20);
        ctx.fillText('▶ PLAY', 16, fs + 16);
        ctx.fillStyle = '#ff2e63';
        ctx.beginPath();
        ctx.arc(c.width - 30, fs + 10, 7, 0, Math.PI * 2);
        ctx.fill();

        canvas = c;
        o.innerHTML = '';
        o.appendChild(c);
        dl.disabled = false;
      };
      img.src = URL.createObjectURL(f);
    });
    dl.addEventListener('click', () => {
      if (!canvas) return;
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = 'grave_dead_channel.png';
      a.click();
    });
    return wrap;
  });

  register('weirdcore', 'cursed', 'cursed filter', () => {
    const wrap = el('div');
    wrap.appendChild(hint('this picture is looking back.'));
    const fi = el('input', { class: 'input', type: 'file', accept: 'image/*' });
    const b = btn('curse');
    b.disabled = true;
    fi.addEventListener('change', () => { b.disabled = !fi.files.length; });
    wrap.appendChild(row([fi, b]));
    const o = out(); wrap.appendChild(o);
    const dl = btn('download png', true);
    dl.disabled = true;
    wrap.appendChild(dl);

    let canvas = null;

    b.addEventListener('click', () => {
      const f = fi.files[0];
      if (!f) return;
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = img.width; c.height = img.height;
        const ctx = c.getContext('2d');
        ctx.filter = 'hue-rotate(-40deg) saturate(1.6) contrast(1.3) brightness(0.75)';
        ctx.drawImage(img, 0, 0);
        ctx.filter = 'none';

        const noise = ctx.getImageData(0, 0, c.width, c.height);
        for (let i = 0; i < noise.data.length; i += 4) {
          const n = (Math.random() - 0.5) * 55;
          noise.data[i] += n;
          noise.data[i + 1] += n;
          noise.data[i + 2] += n;
        }
        ctx.putImageData(noise, 0, 0);

        const count = 4 + Math.floor(Math.random() * 6);
        for (let k = 0; k < count; k++) {
          const x = Math.random() * c.width;
          const y = Math.random() * c.height;
          const w = 40 + Math.random() * 90;
          const h = w * 0.45;
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate((Math.random() - 0.5) * 0.6);
          const grd = ctx.createRadialGradient(0, 0, 2, 0, 0, h);
          grd.addColorStop(0, '#fff8e7');
          grd.addColorStop(0.6, '#e8dcc3');
          grd.addColorStop(1, '#7a6a4a');
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
          ctx.fill();
          const iris = ctx.createRadialGradient(0, 0, 1, 0, 0, h / 3);
          iris.addColorStop(0, '#000');
          iris.addColorStop(0.5, '#4a0000');
          iris.addColorStop(1, '#b00020');
          ctx.fillStyle = iris;
          ctx.beginPath();
          ctx.arc(0, 0, h / 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(0,0,0,0.55)';
          ctx.beginPath();
          ctx.ellipse(0, -h / 3, w / 2, h / 6, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        for (let y = 0; y < c.height; y += 3) ctx.fillRect(0, y, c.width, 1);

        canvas = c;
        o.innerHTML = '';
        o.appendChild(c);
        dl.disabled = false;
      };
      img.src = URL.createObjectURL(f);
    });
    dl.addEventListener('click', () => {
      if (!canvas) return;
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = 'grave_cursed.png';
      a.click();
    });
    return wrap;
  });

  register('weirdcore', 'linkcheck', 'dead link checker', () => {
    const wrap = el('div');
    wrap.appendChild(hint('paste a list. find out what\u2019s still up.'));
    const ta = textarea('https://example.com\nhttps://github.com');
    wrap.appendChild(ta);
    const b = btn('check');
    wrap.appendChild(row([b]));
    const o = out(); wrap.appendChild(o);

    async function head(url) {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 7000);
        const res = await fetch(url, { method: 'HEAD', signal: ctrl.signal, mode: 'no-cors' });
        clearTimeout(t);
        return { url, ok: true, status: res.type === 'opaque' ? 'opaque (likely ok)' : res.status };
      } catch {
        try {
          const ctrl = new AbortController();
          const t = setTimeout(() => ctrl.abort(), 7000);
          const res = await fetch(url, { method: 'GET', signal: ctrl.signal, mode: 'no-cors' });
          clearTimeout(t);
          return { url, ok: true, status: res.type === 'opaque' ? 'opaque (likely ok)' : res.status };
        } catch {
          return { url, ok: false, status: 'unreachable' };
        }
      }
    }

    b.addEventListener('click', async () => {
      const urls = ta.value.split('\n').map(s => s.trim()).filter(Boolean);
      if (!urls.length) { o.innerHTML = '<span class="m">no urls.</span>'; return; }
      o.innerHTML = `<span class="m">checking ${urls.length} urls…</span>`;
      const results = await Promise.all(urls.map(head));
      const rows = results.map(r => [r.ok ? '✓' : '✗', r.url + ' — ' + r.status]);
      const alive = results.filter(r => r.ok).length;
      o.innerHTML = kv([['alive', alive], ['dead', results.length - alive]]) +
        '<div class="pane">' + rows.map(([s, u]) => `${s} ${u}`).join('\n') + '</div>';
    });
    return wrap;
  });

  /* ============================================================
     sidebar render + router
     ============================================================ */
  function buildSidebar() {
    const sb = G.sidebar;
    [...sb.querySelectorAll('.cat')].forEach(n => n.remove());

    CATEGORIES.forEach(cat => {
      if (!cat.tools.length) return;
      const c = el('div', { class: 'cat' });
      const head = el('div', { class: 'cat-head' });
      head.textContent = cat.label;
      c.appendChild(head);
      cat.tools.forEach(tid => {
        const t = TOOLS[tid];
        const a = el('a', { class: 'tool-link', href: '#' });
        a.textContent = t.label;
        a.dataset.tool = tid;
        a.addEventListener('click', (e) => {
          e.preventDefault();
          openTool(tid);
        });
        c.appendChild(a);
      });
      sb.appendChild(c);
    });
  }

  function openTool(tid) {
    const t = TOOLS[tid];
    if (!t) return;
    G.$$('.tool-link').forEach(a => a.classList.toggle('active', a.dataset.tool === tid));
    const catLabel = catById[t.catId].label;
    G.setCrumb(['grave.rest', 'tools', catLabel, t.label]);
    G.stage.innerHTML = '';
    G.stage.appendChild(t.render());
    G.stage.scrollTop = 0;
    G.closeSidebarOnMobile();
  }

  function init() {
    buildSidebar();
    const first = CATEGORIES.find(c => c.tools.length)?.tools[0];
    if (first) openTool(first);
  }

  let inited = false;
  document.addEventListener('grave:tools-open', () => {
    if (inited) return;
    inited = true;
    init();
  });

  if (document.getElementById('tools')?.classList.contains('open')) {
    if (!inited) { inited = true; init(); }
  }
})();