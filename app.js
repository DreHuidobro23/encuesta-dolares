(function () {
  'use strict';

  const C = window.SURVEY_CONFIG;
  const STORAGE_KEY = 'encuesta-dolares-v1';
  const DONE_KEY = 'encuesta-dolares-enviada';
  const FORM_URL = `https://docs.google.com/forms/d/e/${C.formId}/formResponse`;
  const N = C.items.length;

  const app = document.getElementById('app');
  const progressBar = document.getElementById('progress');

  // ------------------------------------------------------------------
  // Estado (se guarda en el navegador para no perder avances al recargar)
  // ------------------------------------------------------------------
  const emptyState = () => ({
    step: 'welcome',
    consent: false,
    filtro: null,
    residencia: null,
    sexo: null,
    sexoOtro: '',
    edad: null,
    answers: {}
  });

  let state = load() || emptyState();

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* sin almacenamiento */ }
  }
  function markDone() {
    try { localStorage.setItem(DONE_KEY, '1'); localStorage.removeItem(STORAGE_KEY); } catch (e) { /* noop */ }
  }
  function alreadyDone() {
    try { return localStorage.getItem(DONE_KEY) === '1'; } catch (e) { return false; }
  }

  // ------------------------------------------------------------------
  // Flujo de pasos
  // ------------------------------------------------------------------
  const ITEM_STEPS = C.items.map((_, i) => 'item-' + i);
  const FLOW = ['welcome', 'filtro', 'residencia', 'perfil', 'instrucciones', ...ITEM_STEPS, 'revisar'];

  function go(step) {
    state.step = step;
    save();
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function next() { go(FLOW[FLOW.indexOf(state.step) + 1]); }
  function prev() {
    const i = FLOW.indexOf(state.step);
    if (i > 0) go(FLOW[i - 1]);
  }

  function setProgress() {
    const i = FLOW.indexOf(state.step);
    const pct = state.step === 'gracias' ? 100 : Math.max(0, Math.round((i / (FLOW.length - 1)) * 100));
    progressBar.style.width = pct + '%';
  }

  // ------------------------------------------------------------------
  // Envío a Google Forms
  // pageHistory indica las secciones del formulario que se recorrieron;
  // Google lo exige en formularios con varias secciones.
  // ------------------------------------------------------------------
  function buildPayload(pageHistory) {
    const p = new URLSearchParams();
    p.append('fvv', '1');
    p.append('pageHistory', pageHistory);
    if (state.filtro) p.append('entry.' + C.filtro.entry, state.filtro);
    if (state.residencia) p.append('entry.' + C.residencia.entry, state.residencia);
    if (state.sexo) {
      if (state.sexo === '__other_option__') {
        p.append('entry.' + C.sexo.entry, '__other_option__');
        p.append('entry.' + C.sexo.entry + '.other_option_response', state.sexoOtro.trim());
      } else {
        p.append('entry.' + C.sexo.entry, state.sexo);
      }
    }
    if (state.edad) p.append('entry.' + C.edad.entry, state.edad);
    Object.keys(state.answers).forEach((entry) => p.append('entry.' + entry, state.answers[entry]));
    return p;
  }

  async function submit(pageHistory) {
    // mode "no-cors": Google no permite leer la respuesta, pero sí la registra.
    await fetch(FORM_URL, { method: 'POST', mode: 'no-cors', body: buildPayload(pageHistory) });
  }

  // ------------------------------------------------------------------
  // Utilidades de interfaz
  // ------------------------------------------------------------------
  function el(html) {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function mount(node) {
    app.innerHTML = '';
    app.appendChild(node);
    setProgress();
    const focusable = node.querySelector('[data-autofocus]') || node.querySelector('h1, h2');
    if (focusable) { focusable.setAttribute('tabindex', '-1'); focusable.focus({ preventScroll: true }); }
  }
  function backButton() {
    return '<button class="btn secondary" data-back type="button">← Atrás</button>';
  }
  function wireBack(node) {
    const b = node.querySelector('[data-back]');
    if (b) b.addEventListener('click', prev);
  }

  // ------------------------------------------------------------------
  // Pantallas
  // ------------------------------------------------------------------
  const screens = {
    welcome() {
      const node = el(`
        <section class="screen">
          <span class="tag">ENCUESTA + SORTEO</span>
          <h1>¿Cambias dólares <span class="accent">online?</span></h1>
          <p>Estoy realizando mi tesis de maestría sobre el uso de plataformas digitales para cambiar dólares. Responde una breve encuesta y <b>participa por una gift card de ${esc(C.premio)}</b>.</p>

          <div class="prize"><strong>${esc(C.premio)}</strong><span>en una gift card para una persona que complete la encuesta</span></div>

          <ul class="requirements">
            <li>Tienes entre ${C.edad.min} y ${C.edad.max} años</li>
            <li>Vives en Lima Moderna</li>
            <li>Cambias dólares o soles en apps o webs</li>
          </ul>

          <label class="consent">
            <input type="checkbox" id="consent" ${state.consent ? 'checked' : ''}>
            <span>Acepto participar de forma voluntaria. Mis respuestas son anónimas y se usarán solo con fines académicos. He leído las <a href="bases.html" target="_blank" rel="noopener">bases del sorteo</a>.</span>
          </label>

          <div class="actions">
            <button class="btn block" id="start" type="button" ${state.consent ? '' : 'disabled'}>Comenzar →</button>
          </div>
        </section>`);
      const cb = node.querySelector('#consent');
      const start = node.querySelector('#start');
      cb.addEventListener('change', () => { state.consent = cb.checked; start.disabled = !cb.checked; save(); });
      start.addEventListener('click', next);
      mount(node);
    },

    filtro() {
      const node = el(`
        <section class="screen">
          <span class="counter">PREGUNTA INICIAL</span>
          <h2>¿Sueles cambiar dólares y/o soles de manera online?</h2>
          <div class="options cols-2">
            <button class="opt" data-v="${esc(C.filtro.si)}" type="button">Sí</button>
            <button class="opt" data-v="${esc(C.filtro.no)}" type="button">No</button>
          </div>
          <div class="actions">${backButton()}</div>
        </section>`);
      node.querySelectorAll('.opt').forEach((b) => {
        if (b.dataset.v === state.filtro) b.classList.add('selected');
        b.addEventListener('click', () => {
          state.filtro = b.dataset.v;
          if (state.filtro === C.filtro.no) return disqualify('0');
          next();
        });
      });
      wireBack(node);
      mount(node);
    },

    residencia() {
      const opts = C.residencia.opciones
        .map((o) => `<button class="opt" data-v="${esc(o.value)}" type="button">${esc(o.label)}</button>`)
        .join('');
      const node = el(`
        <section class="screen">
          <span class="counter">DATOS GENERALES</span>
          <h2>¿En qué distrito vives?</h2>
          <div class="options cols-2">
            ${opts}
            <button class="opt wide" data-v="${esc(C.residencia.otro)}" type="button">Otro distrito</button>
          </div>
          <div class="actions">${backButton()}</div>
        </section>`);
      node.querySelectorAll('.opt').forEach((b) => {
        if (b.dataset.v === state.residencia) b.classList.add('selected');
        b.addEventListener('click', () => {
          state.residencia = b.dataset.v;
          if (state.residencia === C.residencia.otro) return disqualify('0,1');
          next();
        });
      });
      wireBack(node);
      mount(node);
    },

    perfil() {
      const sexOpts = C.sexo.opciones
        .map((s) => `<button class="opt" data-sexo="${esc(s)}" type="button">${esc(s)}</button>`)
        .join('');
      let ages = '';
      for (let a = C.edad.min; a <= C.edad.max; a++) ages += `<button class="opt" data-edad="${a}" type="button">${a}</button>`;
      const node = el(`
        <section class="screen">
          <span class="counter">DATOS GENERALES</span>
          <h2>Cuéntanos un poco de ti</h2>

          <span class="field-label">Sexo</span>
          <div class="options cols-2">
            ${sexOpts}
            <button class="opt" data-sexo="__other_option__" type="button">${esc(C.sexo.otroLabel)}</button>
          </div>
          <input class="text-input" id="sexoOtro" type="text" maxlength="60" placeholder="Especifica (opcional)" value="${esc(state.sexoOtro)}" ${state.sexo === '__other_option__' ? '' : 'hidden'}>

          <span class="field-label">Edad</span>
          <div class="options cols-4" id="ages">
            ${ages}
            <button class="opt wide" data-edad="${esc(C.edad.otro)}" type="button">Tengo otra edad</button>
          </div>

          <div id="err"></div>
          <div class="actions">
            ${backButton()}
            <button class="btn" id="cont" type="button">Continuar →</button>
          </div>
        </section>`);

      const otroInput = node.querySelector('#sexoOtro');
      const sexBtns = node.querySelectorAll('[data-sexo]');
      const ageBtns = node.querySelectorAll('[data-edad]');
      const paint = () => {
        sexBtns.forEach((b) => b.classList.toggle('selected', b.dataset.sexo === state.sexo));
        ageBtns.forEach((b) => b.classList.toggle('selected', b.dataset.edad === state.edad));
        otroInput.hidden = state.sexo !== '__other_option__';
      };
      sexBtns.forEach((b) => b.addEventListener('click', () => { state.sexo = b.dataset.sexo; save(); paint(); }));
      ageBtns.forEach((b) => b.addEventListener('click', () => { state.edad = b.dataset.edad; save(); paint(); }));
      otroInput.addEventListener('input', () => { state.sexoOtro = otroInput.value; save(); });
      paint();

      node.querySelector('#cont').addEventListener('click', () => {
        const err = node.querySelector('#err');
        if (!state.sexo || !state.edad) {
          err.innerHTML = '<div class="error">Por favor, selecciona tu sexo y tu edad para continuar.</div>';
          return;
        }
        if (state.sexo === '__other_option__' && !state.sexoOtro.trim()) state.sexoOtro = 'Otro';
        if (state.edad === C.edad.otro) return disqualify('0,1,2');
        next();
      });
      wireBack(node);
      mount(node);
    },

    instrucciones() {
      const node = el(`
        <section class="screen">
          <span class="counter">INSTRUCCIONES</span>
          <h2>Ahora, ${N} afirmaciones sobre las <span class="accent">plataformas online</span> para cambiar dólares</h2>
          <p>Indica qué tan de acuerdo estás con cada una usando una escala del 1 al 7:</p>
          <ul class="scale-list">
            <li><b>1</b> Totalmente en desacuerdo</li>
            <li><b>2</b> En desacuerdo</li>
            <li><b>3</b> Ligeramente en desacuerdo</li>
            <li><b>4</b> Neutral</li>
            <li><b>5</b> Ligeramente de acuerdo</li>
            <li><b>6</b> De acuerdo</li>
            <li><b>7</b> Totalmente de acuerdo</li>
          </ul>
          <p class="muted">Lee cada afirmación con calma. No hay respuestas correctas o incorrectas; solo nos interesa tu percepción.</p>
          <div class="actions">
            ${backButton()}
            <button class="btn" id="go" type="button" data-autofocus>Empezar →</button>
          </div>
        </section>`);
      node.querySelector('#go').addEventListener('click', next);
      wireBack(node);
      mount(node);
    },

    item(i) {
      const it = C.items[i];
      let buttons = '';
      for (let v = 1; v <= 7; v++) {
        buttons += `<button class="opt" data-v="${v}" type="button" aria-label="${v}">${v}</button>`;
      }
      const answered = state.answers[it.entry];
      const node = el(`
        <section class="screen">
          <span class="counter">AFIRMACIÓN ${i + 1} DE ${N}</span>
          <div class="statement">${esc(it.text)}</div>
          <div class="likert" role="radiogroup" aria-label="Escala del 1 al 7">${buttons}</div>
          <div class="anchors"><span>1 · Totalmente en desacuerdo</span><span>7 · Totalmente de acuerdo</span></div>
          <div class="actions">
            ${backButton()}
            ${answered ? '<button class="btn" id="skip" type="button">Siguiente →</button>' : ''}
          </div>
        </section>`);
      const choose = (v) => {
        state.answers[it.entry] = String(v);
        save();
        node.querySelectorAll('.likert .opt').forEach((b) => b.classList.toggle('selected', b.dataset.v === String(v)));
        setTimeout(next, 220);
      };
      node.querySelectorAll('.likert .opt').forEach((b) => {
        if (b.dataset.v === answered) b.classList.add('selected');
        b.addEventListener('click', () => choose(b.dataset.v));
      });
      const skip = node.querySelector('#skip');
      if (skip) skip.addEventListener('click', next);
      wireBack(node);
      mount(node);
    },

    revisar() {
      const missing = C.items.findIndex((it) => !state.answers[it.entry]);
      if (missing !== -1) return go('item-' + missing);

      const node = el(`
        <section class="screen">
          <span class="counter">ÚLTIMO PASO</span>
          <h2>¡Listo! Envía tus <span class="accent">respuestas</span></h2>
          <p>Respondiste las ${N} afirmaciones. Pulsa el botón para enviar la encuesta.</p>
          <div id="err"></div>
          <div class="actions">
            ${backButton()}
            <button class="btn" id="send" type="button" data-autofocus>Enviar encuesta</button>
          </div>
        </section>`);
      const send = node.querySelector('#send');
      send.addEventListener('click', async () => {
        send.disabled = true;
        send.textContent = 'Enviando…';
        try {
          await submit('0,1,2,3');
          trackLead();
          markDone();
          state.step = 'gracias';
          screens.gracias();
        } catch (e) {
          send.disabled = false;
          send.textContent = 'Reintentar envío';
          node.querySelector('#err').innerHTML =
            '<div class="error">No pudimos enviar tus respuestas. Revisa tu conexión a internet e inténtalo de nuevo; tus respuestas siguen guardadas.</div>';
        }
      });
      wireBack(node);
      mount(node);
    },

    gracias(repeat) {
      const share = encodeURIComponent(
        `¿Cambias dólares online? Responde esta encuesta para una tesis de maestría y participa por una gift card de ${C.premio}: ${location.origin}`
      );
      const sorteo = C.sorteoUrl
        ? `<a class="btn block" href="${esc(C.sorteoUrl)}" target="_blank" rel="noopener">Participar en el sorteo 🎁</a>
           <p class="muted">Tus datos de contacto se registran en un formulario aparte, para que tus respuestas sigan siendo anónimas.</p>`
        : '';
      const node = el(`
        <section class="screen">
          <span class="tag">${repeat ? 'YA RESPONDISTE' : 'ENCUESTA ENVIADA'}</span>
          <h1>¡Gracias por <span class="accent">tu ayuda!</span></h1>
          <p>${repeat ? 'Ya registramos tu encuesta desde este dispositivo.' : 'Tus respuestas se registraron correctamente.'} Cada respuesta acerca esta investigación a su meta.</p>
          <div class="stack">
            ${sorteo}
            <a class="btn light block" href="https://wa.me/?text=${share}" target="_blank" rel="noopener">Compartir por WhatsApp</a>
          </div>
        </section>`);
      progressBar.style.width = '100%';
      mount(node);
    }
  };

  function disqualify(pageHistory) {
    save();
    // Se registra igual que en el Google Form original, donde estas respuestas también se envían.
    submit(pageHistory).catch(() => { /* no bloquea la pantalla final */ });
    markDone();
    const node = el(`
      <section class="screen">
        <span class="tag">GRACIAS</span>
        <h2>Esta encuesta está dirigida a otro perfil</h2>
        <p>Buscamos millennials de Lima Moderna que cambien dólares de manera online, así que no necesitamos más respuestas tuyas. ¡Gracias por tu tiempo!</p>
        <p>Si conoces a alguien que cumpla el perfil, compártele la encuesta.</p>
        <div class="stack">
          <a class="btn light block" href="https://wa.me/?text=${encodeURIComponent('¿Cambias dólares online? Responde esta encuesta para una tesis y participa por una gift card de ' + C.premio + ': ' + location.origin)}" target="_blank" rel="noopener">Compartir por WhatsApp</a>
        </div>
      </section>`);
    state.step = 'fuera';
    progressBar.style.width = '100%';
    mount(node);
  }

  // ------------------------------------------------------------------
  // Meta Pixel (opcional)
  // ------------------------------------------------------------------
  function initPixel() {
    if (!C.metaPixelId) return;
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', C.metaPixelId);
    window.fbq('track', 'PageView');
  }
  function trackLead() {
    if (window.fbq) window.fbq('track', 'Lead');
  }

  // Teclado: 1–7 responde en las afirmaciones (útil en computadora)
  document.addEventListener('keydown', (e) => {
    if (!state.step.startsWith('item-')) return;
    if (e.target && e.target.tagName === 'INPUT') return;
    const v = parseInt(e.key, 10);
    if (v >= 1 && v <= 7) {
      const b = app.querySelector(`.likert .opt[data-v="${v}"]`);
      if (b) b.click();
    }
  });

  // ------------------------------------------------------------------
  function render() {
    const s = state.step;
    if (s.startsWith('item-')) return screens.item(parseInt(s.slice(5), 10));
    if (screens[s] && s !== 'gracias') return screens[s]();
    return screens.welcome();
  }

  initPixel();
  if (alreadyDone()) screens.gracias(true);
  else render();
})();
