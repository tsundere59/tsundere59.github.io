/* grave.rest — game.js v2 */
(() => {
  'use strict';
  /* SAFE_GUARD: bail early if the game markup isn't present */
  if (!document.getElementById('gameCanvas')) { console.warn('game.js: canvas not found'); return; }
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) { console.warn('game.js: missing #gameCanvas'); return; }
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const hudTargets = document.getElementById('hudTargets');
  if (!hudTargets) { console.warn('game.js: missing #hudTargets'); return; }
  const hudSpotted = document.getElementById('hudSpotted');
  if (!hudSpotted) { console.warn('game.js: missing #hudSpotted'); return; }
  const hudTime    = document.getElementById('hudTime');
  const hudLevel   = document.getElementById('hudLevel');
  const monologueText = document.getElementById('monologueText');
  if (!monologueText) { console.warn('game.js: missing #monologueText'); return; }
  const overlay   = document.getElementById('gameOverlay');
  const overlayTitle = document.getElementById('overlayTitle');
  if (!overlayTitle) { console.warn('game.js: missing #overlayTitle'); return; }
  const overlaySub = document.getElementById('overlaySub');
  if (!overlaySub) { console.warn('game.js: missing #overlaySub'); return; }
  const overlayBtn = document.getElementById('overlayBtn');
  if (!overlayBtn) { console.warn('game.js: missing #overlayBtn'); return; }
  const controlsOverlay = document.getElementById('controlsOverlay');
  if (!controlsOverlay) { console.warn('game.js: missing #controlsOverlay'); return; }
  const controlsBtn = document.getElementById('controlsBtn');
  const flash     = document.getElementById('gameFlash');
  const pressureBar = document.getElementById('pressureBar');

  const HALL = { wallTop: 40, wallBot: H - 40, floorColor: '#f4dbe4', wallColor: '#e8bccd', lockerColor: '#d896b4', windowColor: '#ffeeda' };

  const keys = {};
  document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
    if (e.key === 'Escape') leaveGame();
    if (e.key.toLowerCase() === 'e') tryEliminate();
  });
  document.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });

  let state = 'menu', level = 1;
  const MAX_LEVEL = 5;
  let time = 0, spottedCount = 0, pressure = 0, pressureChase = 0;

  const player = { x: W / 2, y: H - 90, r: 14, speed: 2.6, facing: 'down', bob: 0, frozen: 0, eliminateAnim: 0 };
  const targets = [], particles = [], floaters = [];

  const MONOLOGUES = [
    "he doesn't know i exist yet.",
    "one down. he didn't even notice.",
    "they keep getting in the way.",
    "this hallway is too bright.",
    "just a little closer.",
    "it's quieter now.",
    "he's still walking. he's always walking.",
    "almost there.",
    "the walls are watching.",
    "i can hear them breathing."
  ];

  const RIVAL_PALETTES = [
    { hair: '#7a4fb3', skirt: '#4b3a6b' },
    { hair: '#e07a3a', skirt: '#7a3a1a' },
    { hair: '#3a9ad0', skirt: '#1f4d6b' },
    { hair: '#3ad07a', skirt: '#1f6b3a' },
    { hair: '#d03a5a', skirt: '#6b1a2a' },
    { hair: '#d0b03a', skirt: '#6b5a1a' }
  ];

  const LEVELS = [
    { rivals: 2, speed: 0.55, vision: 100, spot: 0.75, allowed: 3, pressure: 3.5 },
    { rivals: 3, speed: 0.70, vision: 110, spot: 0.65, allowed: 3, pressure: 5.0 },
    { rivals: 4, speed: 0.85, vision: 120, spot: 0.55, allowed: 3, pressure: 6.5 },
    { rivals: 5, speed: 1.00, vision: 130, spot: 0.45, allowed: 3, pressure: 8.0 },
    { rivals: 6, speed: 1.15, vision: 140, spot: 0.40, allowed: 3, pressure: 10.0 }
  ];
  const cfg = () => LEVELS[Math.min(level - 1, LEVELS.length - 1)];

  function resetLevel() {
    player.x = W / 2; player.y = H - 90; player.frozen = 0; player.eliminateAnim = 0;
    spottedCount = 0; time = 0; pressure = 0; pressureChase = 0;
    targets.length = 0; particles.length = 0; floaters.length = 0;
    const c = cfg();
    for (let i = 0; i < c.rivals; i++) {
      const pal = RIVAL_PALETTES[i % RIVAL_PALETTES.length];
      const col = i % 3, row = Math.floor(i / 3) % 2;
      const x0 = 90 + col * 260, x1 = x0 + 160;
      const y0 = 110 + row * 60, y1 = y0 + 50;
      targets.push({
        x: (x0 + x1) / 2, y: (y0 + y1) / 2, r: 14, kind: 'rival',
        hair: pal.hair, skirt: pal.skirt, alive: true,
        patrol: { x0, x1, y0, y1, t: Math.random() * 6.28 },
        facing: { x: 1, y: 0 }, spotTimer: 0, spotted: false, chasing: false
      });
    }
    targets.push({
      x: W / 2, y: 260, r: 14, kind: 'senpai',
      hair: '#2a1a0a', skirt: '#3a2a1a', alive: true,
      patrol: { x0: W / 2 - 240, x1: W / 2 + 240, y0: 260, y1: 260, t: 0 },
      facing: { x: 1, y: 0 }, spotTimer: 0, spotted: false, chasing: false
    });
    updateHud();
    setMonologue("level " + level + ". " + (level === 1 ? "he doesn't know i exist yet." : "they remember me."));
  }

  function updateHud() {
    hudTargets.textContent = targets.filter(t => t.alive).length;
    hudSpotted.textContent = spottedCount + "/" + cfg().allowed;
    hudLevel.textContent = level;
    const m = Math.floor(time / 60), s = Math.floor(time % 60).toString().padStart(2, '0');
    hudTime.textContent = m + ':' + s;
    const pct = Math.min(100, pressure);
    pressureBar.style.width = pct + '%';
    pressureBar.classList.toggle('hot', pct > 80);
  }

  function setMonologue(t) { monologueText.textContent = t; }

  function tryEliminate() {
    if (state !== 'playing' || player.frozen > 0 || player.eliminateAnim > 0) return;
    let best = null, bestD = 40;
    for (const t of targets) {
      if (!t.alive) continue;
      const d = Math.hypot(t.x - player.x, t.y - player.y);
      if (d < bestD) { bestD = d; best = t; }
    }
    if (!best) return;
    player.eliminateAnim = 1.0;
    flash.classList.add('on');
    setTimeout(() => flash.classList.remove('on'), 120);
    for (let i = 0; i < 18; i++) {
      const a = Math.random() * Math.PI * 2, sp = 1 + Math.random() * 3;
      particles.push({ x: best.x, y: best.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0.8 + Math.random() * 0.6, maxLife: 1.4 });
    }
    floaters.push({ x: best.x, y: best.y - 24, text: 'gone.', life: 1.2 });
    best.alive = false; best.chasing = false;
    pressure = Math.max(0, pressure - 25);
    setMonologue(MONOLOGUES[Math.floor(Math.random() * MONOLOGUES.length)]);
    updateHud();
  }

  function update(dt) {
    if (state !== 'playing') return;
    time += dt;
    if (player.frozen > 0) player.frozen -= dt;
    if (player.eliminateAnim > 0) player.eliminateAnim -= dt;

    if (pressureChase <= 0) {
      pressure += cfg().pressure * dt;
      if (pressure >= 100) {
        pressure = 100; pressureChase = 6;
        for (const t of targets) if (t.alive) t.chasing = true;
        setMonologue("they're coming.");
      }
    } else {
      pressureChase -= dt;
      pressure = Math.max(0, 100 * (pressureChase / 6));
      if (pressureChase <= 0) {
        for (const t of targets) t.chasing = false;
        pressure = 0;
        setMonologue("they stopped. for now.");
      }
    }
    updateHud();

    if (player.frozen <= 0 && player.eliminateAnim <= 0) {
      let dx = 0, dy = 0;
      if (keys['w'] || keys['arrowup'])    dy -= 1;
      if (keys['s'] || keys['arrowdown'])  dy += 1;
      if (keys['a'] || keys['arrowleft'])  dx -= 1;
      if (keys['d'] || keys['arrowright']) dx += 1;
      if (dx || dy) {
        const len = Math.hypot(dx, dy); dx /= len; dy /= len;
        player.x += dx * player.speed; player.y += dy * player.speed;
        player.bob += dt * 12;
        if (Math.abs(dx) > Math.abs(dy)) player.facing = dx > 0 ? 'right' : 'left';
        else player.facing = dy > 0 ? 'down' : 'up';
      } else player.bob = 0;
    }
    player.x = Math.max(30, Math.min(W - 30, player.x));
    player.y = Math.max(HALL.wallTop + 20, Math.min(HALL.wallBot - 20, player.y));

    for (const t of targets) {
      if (!t.alive) continue;
      if (t.chasing) {
        const dx = player.x - t.x, dy = player.y - t.y;
        const d = Math.hypot(dx, dy) || 1;
        t.x += (dx / d) * 0.9; t.y += (dy / d) * 0.9;
        t.facing.x = dx / d; t.facing.y = dy / d;
        if (d < 22 && !t.spotted) {
          t.spotted = true; spottedCount++; updateHud();
          floaters.push({ x: t.x, y: t.y - 30, text: '!', life: 1.0, big: true });
          player.frozen = 1.2;
          setMonologue("she touched me. she saw me.");
          if (spottedCount >= cfg().allowed) { loseGame(); return; }
        }
        continue;
      }
      const p = t.patrol;
      p.t += dt * cfg().speed * (t.kind === 'senpai' ? 1.2 : 1);
      const nx = p.x0 + (p.x1 - p.x0) * (0.5 + 0.5 * Math.sin(p.t));
      const ny = p.y0 + (p.y1 - p.y0) * (0.5 + 0.5 * Math.sin(p.t * 1.3));
      t.facing.x = nx - t.x; t.facing.y = ny - t.y;
      const fl = Math.hypot(t.facing.x, t.facing.y) || 1;
      t.facing.x /= fl; t.facing.y /= fl;
      t.x = nx; t.y = ny;
      const dx = player.x - t.x, dy = player.y - t.y;
      const dist = Math.hypot(dx, dy);
      const dot = (dx * t.facing.x + dy * t.facing.y) / (dist || 1);
      const inCone = dist < cfg().vision && dot > 0.4;
      if (inCone) {
        t.spotTimer += dt;
        if (t.spotTimer > cfg().spot && !t.spotted) {
          t.spotted = true; spottedCount++; updateHud();
          floaters.push({ x: t.x, y: t.y - 30, text: '!', life: 1.0, big: true });
          player.frozen = 1.2;
          setMonologue("she saw me. she saw me.");
          if (spottedCount >= cfg().allowed) { loseGame(); return; }
        }
      } else {
        t.spotTimer = Math.max(0, t.spotTimer - dt * 0.6);
        if (t.spotTimer <= 0) t.spotted = false;
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy; p.vx *= 0.94; p.vy *= 0.94; p.life -= dt;
      if (p.life <= 0) particles.splice(i, 1);
    }
    for (let i = floaters.length - 1; i >= 0; i--) {
      const f = floaters[i]; f.y -= dt * 20; f.life -= dt;
      if (f.life <= 0) floaters.splice(i, 1);
    }

    if (state === 'playing' && targets.every(t => !t.alive)) levelClear();
  }

  function render() {
    ctx.fillStyle = HALL.floorColor; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = HALL.wallColor; ctx.fillRect(0, 0, W, HALL.wallTop); ctx.fillRect(0, HALL.wallBot, W, H - HALL.wallBot);
    for (let x = 0; x < W; x += 44) {
      ctx.fillStyle = HALL.lockerColor; ctx.fillRect(x + 2, 6, 40, HALL.wallTop - 12);
      ctx.strokeStyle = 'rgba(0,0,0,.12)'; ctx.strokeRect(x + 2, 6, 40, HALL.wallTop - 12);
    }
    for (let x = 40; x < W - 60; x += 180) {
      ctx.fillStyle = HALL.windowColor; ctx.fillRect(x, HALL.wallBot + 6, 120, H - HALL.wallBot - 12);
      ctx.strokeStyle = '#b8788e'; ctx.strokeRect(x, HALL.wallBot + 6, 120, H - HALL.wallBot - 12);
    }
    ctx.strokeStyle = 'rgba(0,0,0,.05)';
    for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, HALL.wallTop); ctx.lineTo(x, HALL.wallBot); ctx.stroke(); }
    for (let y = HALL.wallTop; y < HALL.wallBot; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    for (const p of particles) {
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = '#ff2e63';
      ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    for (const t of targets) {
      if (!t.alive) continue;
      drawChar(t.x, t.y, t.hair, t.skirt, t.kind === 'senpai' ? 'boy' : 'girl', t.spotted, false, t.chasing);
      ctx.save();
      ctx.globalAlpha = t.spotted ? 0.16 : (t.chasing ? 0.22 : 0.06);
      ctx.fillStyle = t.spotted || t.chasing ? '#ff2e63' : '#000';
      ctx.beginPath();
      ctx.moveTo(t.x, t.y);
      const ang = Math.atan2(t.facing.y, t.facing.x);
      ctx.arc(t.x, t.y, cfg().vision, ang - 0.5, ang + 0.5);
      ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    const bobOffset = Math.sin(player.bob) * 2;
    drawChar(player.x, player.y + bobOffset, '#ff5fa8', '#7a1f4a', 'girl', false, true, false);
    for (const f of floaters) {
      ctx.globalAlpha = Math.min(1, f.life);
      ctx.fillStyle = f.big ? '#ff2e63' : '#8b2a4a';
      ctx.font = (f.big ? 'bold 28px ' : '14px ') + "'Courier New', monospace";
      ctx.textAlign = 'center';
      ctx.fillText(f.text, f.x, f.y);
    }
    ctx.globalAlpha = 1; ctx.textAlign = 'start';
  }

  function drawChar(x, y, hair, skirt, kind, alerted, isPlayer, chasing) {
    const c = ctx;
    c.fillStyle = 'rgba(0,0,0,.18)';
    c.beginPath(); c.ellipse(x, y + 14, 14, 5, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#f4d1b8'; c.fillRect(x - 5, y + 4, 3, 10); c.fillRect(x + 2, y + 4, 3, 10);
    c.fillStyle = skirt;
    c.beginPath();
    c.moveTo(x - 10, y + 6); c.lineTo(x + 10, y + 6);
    c.lineTo(x + 7, y - 6); c.lineTo(x - 7, y - 6);
    c.closePath(); c.fill();
    c.fillStyle = '#fff'; c.fillRect(x - 6, y - 12, 12, 8);
    if (kind === 'girl') { c.fillStyle = '#c4224a'; c.fillRect(x - 6, y - 12, 12, 2); }
    c.fillStyle = '#fbdcc0';
    c.beginPath(); c.arc(x, y - 20, 9, 0, Math.PI * 2); c.fill();
    c.fillStyle = hair;
    if (kind === 'girl') {
      c.beginPath(); c.arc(x, y - 21, 10, Math.PI, 0); c.fill();
      c.fillRect(x - 10, y - 21, 3, 12); c.fillRect(x + 7, y - 21, 3, 12);
    } else {
      c.beginPath(); c.arc(x, y - 22, 10, Math.PI, 0); c.fill();
    }
    c.fillStyle = '#1a0a14';
    c.fillRect(x - 4, y - 21, 2, 2); c.fillRect(x + 2, y - 21, 2, 2);
    if (isPlayer) {
      c.fillStyle = '#ff2e63';
      c.beginPath(); c.moveTo(x - 4, y - 32); c.lineTo(x - 12, y - 36); c.lineTo(x - 12, y - 28); c.closePath(); c.fill();
      c.beginPath(); c.moveTo(x + 4, y - 32); c.lineTo(x + 12, y - 36); c.lineTo(x + 12, y - 28); c.closePath(); c.fill();
    }
    if (alerted || chasing) {
      c.fillStyle = '#ff2e63'; c.font = 'bold 22px monospace';
      c.fillText('!', x - 4, y - 36);
    }
  }

  function levelClear() {
    state = 'levelclear';
    if (level >= MAX_LEVEL) {
      overlayTitle.textContent = '';
      overlaySub.textContent = '';
      overlayBtn.textContent = 'again from level 1';
    } else {
      overlayTitle.textContent = 'level ' + level + ' clear.';
      overlaySub.textContent = 'level ' + (level + 1) + ' — they noticed. they will be faster.';
      overlayBtn.textContent = 'next level';
    }
    overlay.classList.remove('hidden');
  }

  function loseGame() {
    state = 'lost';
    flash.classList.add('on');
    setTimeout(() => flash.classList.remove('on'), 200);
    try { sessionStorage.setItem('grave_horror', '1'); } catch (e) {}
    overlayTitle.textContent = '';
    overlaySub.textContent = '';
    overlayBtn.textContent = 'try again';
    overlay.classList.remove('hidden');
  }

  function leaveGame() { try { sessionStorage.removeItem('grave_horror'); } catch(e){} window.location.href = 'index.html'; }

  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    update(dt); render();
    if (state === 'playing') updateHud();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  document.addEventListener('keydown',function(e){if(e.key==='Enter'&&(state==='menu'||state==='won'||state==='lost'||state==='levelclear')){overlayBtn.click();}});
overlayBtn.addEventListener('click', () => {
    overlay.classList.add('hidden');
    if (state === 'menu') { resetLevel(); state = 'playing'; return; }
    if (state === 'levelclear') { level++; if (level > MAX_LEVEL) level = 1; resetLevel(); state = 'playing'; return; }
    if (state === 'won' || state === 'lost') { level = 1; resetLevel(); state = 'playing'; return; }
  });

  controlsBtn.addEventListener('click', function(){ var c = document.getElementById('controlsOverlay'); if(c) c.style.display='none'; resetLevel(); state='playing'; });

  resetLevel(); state = 'menu'; render();
})();




