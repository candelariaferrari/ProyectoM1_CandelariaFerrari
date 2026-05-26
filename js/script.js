/* ── REFERENCIAS AL DOM ── */
const wrapper = document.getElementById('wrapper');
const btnToggle = document.getElementById('btnToggle');
const btnMobileToggle = document.getElementById('btnMobileToggle');
const sidebar = document.getElementById('sidebar');
const grid = document.getElementById('paletteGrid');
const generateBtn = document.getElementById('generateBtn');
const toast = document.getElementById('toast');

/* ── REFERENCIAS A LOS CONTROLES ── */
const radiosTamanio = document.querySelectorAll('input[name="tamanio"]');
const radiosFormato = document.querySelectorAll('input[name="formato"]');


/* ── EVENT LISTENERS ── */

// Sidebar desktop
btnToggle.addEventListener('click', toggleSidebar);

// Sidebar mobile
btnMobileToggle.addEventListener('click', () => {
  const estaAbierto = sidebar.classList.contains('mobile-abierto');
  sidebar.classList.toggle('mobile-abierto');
  btnMobileToggle.classList.toggle('abierto', !estaAbierto);
});

// Botón generar
generateBtn.addEventListener('click', generarPaleta);

// Genera la paleta al cargar la página
document.addEventListener('DOMContentLoaded', generarPaleta);


// Cambiar tamaño de paleta
radiosTamanio.forEach(radio => {
  radio.addEventListener('change', cambiarTamanio);
});

// Cambiar formato de color
radiosFormato.forEach(radio => {
  radio.addEventListener('change', actualizarFormato);
});


/* ── FUNCIONES PRINCIPALES ── */

/* Mostrar / ocultar sidebar en desktop */
function toggleSidebar() {
  const colapsado = wrapper.classList.toggle('colapsado');
  btnToggle.classList.toggle('colapsado', colapsado);
  btnToggle.textContent = colapsado ? '‹' : '›';
  btnToggle.setAttribute(
    'aria-label',
    colapsado ? 'Expandir panel' : 'Colapsar panel'
  );
}

/* Generar la paleta completa */
function generarPaleta() {
  const cantidad = document.querySelector('input[name="tamanio"]:checked').value;
  grid.innerHTML = '';

  for (let i = 0; i < cantidad; i++) {
    const hsl = randomHsl();                    // el color nace en HSL
    const colorMostrado = formatearColor(hsl);  // se muestra según el formato elegido
    const hexParaSwatch = hslToHex(hsl);        // el fondo visual siempre usa HEX

    const card = document.createElement('div');
    card.dataset.hsl = JSON.stringify(hsl);     // guardamos el HSL original en la card
    card.className = 'card-color';
    card.style.animationDelay = `${i * 80}ms`;
    card.innerHTML = `
      <div class="color" style="background-color: ${hexParaSwatch}"></div>
      <div class="color-info">
       <p class="color-code">${colorMostrado}</p>
        <span>
          <p class="color-code-hex">${hexParaSwatch}</p>
          <button class="copy-icon" aria-label="Copiar color">⧉</button>
        </span>
  
      </div>
    `;

    // Copiar color al portapapeles al hacer click
    card.addEventListener('click', () => {
      const code = card.querySelector('.color-code-hex').textContent;
      navigator.clipboard.writeText(code)
        .then(() => showToast(code + ' copiado'))
        .catch(() => showToast('No se pudo copiar'));
    });

    grid.appendChild(card);
  }
}

/* Cambiar tamaño de paleta y regenerar */
function cambiarTamanio(e) {
  document.documentElement.style.setProperty(
    '--palette-size-desktop',
    e.target.value
  );
  generarPaleta();
}

/* Actualizar solo el texto del color sin regenerar la paleta */
function actualizarFormato() {
  document.querySelectorAll('.card-color').forEach(card => {
    const hsl = JSON.parse(card.dataset.hsl);
    card.querySelector('.color-code').textContent = formatearColor(hsl);
  });
}


/* ── HELPERS: GENERACIÓN Y CONVERSIÓN DE COLORES ── */

/* Genera un color aleatorio en formato HSL
   - Saturación entre 40-100%: evita colores apagados o grises
   - Luminosidad entre 30-70%: evita colores muy oscuros o muy claros */
function randomHsl() {
  return {
    h: Math.floor(Math.random() * 360),
    s: Math.floor(Math.random() * 60) + 40,
    l: Math.floor(Math.random() * 40) + 30
  };
}

/* Devuelve el color en el formato que eligió el usuario */
function formatearColor(hsl) {
  const formato = getFormato();
  if (formato === 'hex') return hslToHex(hsl);
  if (formato === 'rgb') return hslToRgb(hsl);
  return hslToString(hsl); // por defecto HSL
}

/* Lee el formato seleccionado en los radio buttons */
function getFormato() {
  return document.querySelector('input[name="formato"]:checked').value;
}

/* HSL → string legible:  */
function hslToString({ h, s, l }) {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

/* HSL → HEX */
function hslToHex({ h, s, l }) {
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = x => Math.round(x * 255).toString(16).padStart(2, '0');
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

/* HSL → RGB */
function hslToRgb({ h, s, l }) {
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const r = Math.round(f(0) * 255);
  const g = Math.round(f(8) * 255);
  const b = Math.round(f(4) * 255);
  return `rgb(${r}, ${g}, ${b})`;
}


/* ── TOAST ── */
function showToast(msg) {
  toast.textContent = '✓ ' + msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}