// Conduit landing — interactivity + live dashboard motion.
// Vanilla JS, no dependencies. Loaded with `defer`.

(function () {
  'use strict';

  /* ---------- Stepper (Integrate section) ----------------------------- */
  const stepper = document.querySelector('[data-stepper]');
  if (stepper) {
    const buttons = stepper.querySelectorAll('.stepper-btn');
    const panels  = stepper.querySelectorAll('.stepper-panel');
    const fill    = stepper.querySelector('.stepper-track-fill');

    const activate = (step) => {
      buttons.forEach((b) => {
        const active = b.dataset.step === String(step);
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', active ? 'true' : 'false');
        b.tabIndex = active ? 0 : -1;
      });
      panels.forEach((p) => {
        const active = p.dataset.step === String(step);
        p.classList.toggle('is-active', active);
        p.hidden = !active;
      });
      if (fill) fill.style.transform = `translateX(${(step - 1) * 100}%)`;
    };

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => activate(btn.dataset.step));
      btn.addEventListener('keydown', (e) => {
        const cur = parseInt(btn.dataset.step, 10);
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          const next = Math.min(buttons.length, cur + 1);
          activate(next);
          stepper.querySelector(`[data-step="${next}"].stepper-btn`).focus();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = Math.max(1, cur - 1);
          activate(prev);
          stepper.querySelector(`[data-step="${prev}"].stepper-btn`).focus();
        }
      });
    });
  }

  /* ---------- Dashboard live motion ----------------------------------- */
  const traces = document.querySelector('[data-traces]');
  if (!traces) return;

  // Sample event templates — JS picks one each tick, adds latency jitter.
  const samples = [
    { agent: 'claude-desktop', tool: 'github:create_issue',       color: '#a78bfa', latency: 142,  status: '200',     kind: 'ok',   width: 32 },
    { agent: 'cursor-team',    tool: 'postgres:query',            color: '#4ade80', latency: 38,   status: '200',     kind: 'ok',   width: 12 },
    { agent: 'claude-desktop', tool: 'github:list_pull_requests', color: '#a78bfa', latency: 96,   status: '200',     kind: 'ok',   width: 24 },
    { agent: 'ci-runner',      tool: 'slack:post_message',        color: '#f87171', latency: 5012, status: 'TIMEOUT', kind: 'err',  width: 85 },
    { agent: 'claude-desktop', tool: 'filesystem:read_file',      color: '#4ade80', latency: 14,   status: '200',     kind: 'ok',   width: 5  },
    { agent: 'cursor-team',    tool: 'postgres:explain',          color: '#4ade80', latency: 62,   status: '200',     kind: 'ok',   width: 18 },
    { agent: 'cursor-team',    tool: 'github:delete_repo',        color: '#facc15', latency: 2,    status: 'SCOPE',   kind: 'warn', width: 8  },
    { agent: 'claude-desktop', tool: 'github:get_file_contents',  color: '#a78bfa', latency: 71,   status: '200',     kind: 'ok',   width: 16 },
    { agent: 'ci-runner',      tool: 'postgres:execute',          color: '#4ade80', latency: 43,   status: '200',     kind: 'ok',   width: 11 },
    { agent: 'cursor-team',    tool: 'github:search_code',        color: '#a78bfa', latency: 234,  status: '200',     kind: 'ok',   width: 52 },
    { agent: 'claude-desktop', tool: 'slack:list_channels',       color: '#a78bfa', latency: 188,  status: '200',     kind: 'ok',   width: 42 },
    { agent: 'cursor-team',    tool: 'postgres:list_tables',      color: '#4ade80', latency: 22,   status: '200',     kind: 'ok',   width: 7  }
  ];

  const pad2 = (n) => String(n).padStart(2, '0');
  const fmtTime = (d) => `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
  const fmtLat  = (ms) => ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`;
  const fmtNum  = (n) => n.toLocaleString();

  const counterEl = document.querySelector('[data-counter]');
  const p50El     = document.querySelector('[data-p50]');
  const p99El     = document.querySelector('[data-p99]');
  const errEl     = document.querySelector('[data-err]');
  const sparkLine = document.querySelector('[data-spark-line]');
  const sparkFill = document.querySelector('[data-spark-fill]');

  let counter = 2341;
  let p50 = 142, p99 = 487, errPct = 0.4;
  const latencyHistory = Array.from({ length: 60 }, () => 100 + Math.random() * 80);

  function renderTrace(s) {
    const latVariance = Math.max(2, Math.floor(s.latency + (Math.random() - 0.5) * s.latency * 0.4));
    const widthVar = Math.min(95, Math.max(3, Math.floor(s.width + (Math.random() - 0.5) * 12)));

    const row = document.createElement('div');
    row.className = 'trace trace-new'
      + (s.kind === 'err'  ? ' trace-err'     : '')
      + (s.kind === 'warn' ? ' trace-blocked' : '');
    row.innerHTML = ''
      + `<span class="t-time">${fmtTime(new Date())}</span>`
      + `<span class="t-agent">${s.agent}</span>`
      + `<span class="t-tool">${s.tool}</span>`
      + `<div class="t-bar"><div class="t-fill" style="width:${widthVar}%; background:${s.color}"></div></div>`
      + `<span class="t-lat">${fmtLat(latVariance)}</span>`
      + `<span class="t-status ${s.kind}">${s.status}</span>`;
    return { row, latency: latVariance, isError: s.kind === 'err' };
  }

  function updateSparkline() {
    if (!sparkLine || !sparkFill) return;
    const W = 400, H = 50;
    const max = Math.max.apply(null, latencyHistory);
    const min = Math.min.apply(null, latencyHistory);
    const range = Math.max(20, max - min);
    const pts = latencyHistory.map((v, i) => {
      const x = (i / (latencyHistory.length - 1)) * W;
      const y = H - ((v - min) / range) * (H - 10) - 5;
      return [x, y];
    });
    const lineD = pts.map((p, i) => (i === 0 ? 'M ' : 'L ') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
    const fillD = lineD + ` L ${W},${H} L 0,${H} Z`;
    sparkLine.setAttribute('d', lineD);
    sparkFill.setAttribute('d', fillD);
  }
  updateSparkline();

  function tick() {
    const s = samples[Math.floor(Math.random() * samples.length)];
    const { row, latency, isError } = renderTrace(s);
    traces.prepend(row);

    // Cap at 8 visible rows; older rows fade out.
    while (traces.children.length > 8) {
      const last = traces.lastElementChild;
      last.classList.add('trace-leaving');
      setTimeout(() => last.parentNode && last.remove(), 360);
    }

    // Counter increment (1–3 calls per tick)
    counter += Math.floor(Math.random() * 3) + 1;
    if (counterEl) counterEl.textContent = fmtNum(counter);

    // Push to latency history, drop oldest, redraw sparkline
    latencyHistory.push(Math.min(800, latency));
    latencyHistory.shift();
    updateSparkline();

    // Subtle stat jitter for realism
    p50 = Math.max(80, Math.min(220, p50 + Math.floor((Math.random() - 0.5) * 12)));
    p99 = Math.max(300, Math.min(900, p99 + Math.floor((Math.random() - 0.5) * 40)));
    if (isError) errPct = Math.min(2.5, errPct + 0.05);
    else errPct = Math.max(0.1, errPct - 0.01);
    if (p50El) p50El.textContent = p50;
    if (p99El) p99El.textContent = p99;
    if (errEl) errEl.textContent = errPct.toFixed(1);
  }

  // Only animate while the dashboard is in view — save battery.
  let timer = null;
  const start = () => { if (!timer) timer = setInterval(tick, 1700); };
  const stop  = () => { if (timer) { clearInterval(timer); timer = null; } };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting ? start() : stop());
    }, { threshold: 0.15 });
    io.observe(traces);
  } else {
    start();
  }

  // Pause when the tab is hidden.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else if (isInView(traces)) start();
  });

  function isInView(el) {
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }
})();
