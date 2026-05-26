/* Sidebar */
const wrapper = document.getElementById('wrapper');
const btnToggle = document.getElementById('btnToggle');
const btnMobileToggle = document.getElementById('btnMobileToggle');
const sidebar = document.getElementById('sidebar');

/* Generar paleta */
const grid = document.getElementById('paletteGrid');

/* Seleccionar  */
const radiosTamanio = document.querySelectorAll('input[name="tamanio"]');
const radiosFormato = document.querySelectorAll('input[name="formato"]');

/* Boton */
const generateBtn = document.getElementById('generateBtn');

// Copy + toast
const toast = document.getElementById('toast');

/* Event listeners */
btnToggle.addEventListener('click', toggleSidebar); /* sidebar */

btnMobileToggle.addEventListener('click', () => {
  const estaAbierto = sidebar.classList.contains('mobile-abierto');
  sidebar.classList.toggle('mobile-abierto');
  btnMobileToggle.classList.toggle('abierto', !estaAbierto);
});
generateBtn.addEventListener('click', generarPaleta);

document.addEventListener('DOMContentLoaded', generarPaleta);

document.addEventListener('keydown', manejarAtajos);

radiosTamanio.forEach(radio => {
  radio.addEventListener('change', cambiarTamanio);
});

radiosFormato.forEach(radio => {
  radio.addEventListener('change', actualizarFormato);
});

/* FUNCIONES */

/* Sidebar */
function toggleSidebar() {
  const colapsado = wrapper.classList.toggle('colapsado');
  btnToggle.classList.toggle('colapsado', colapsado);
  btnToggle.textContent = colapsado ? '‹' : '›';
  btnToggle.setAttribute(
    'aria-label',
    colapsado ? 'Expandir panel' : 'Colapsar panel'
  );
}
/* Generar una paleta  */
function generarPaleta() {
  const cantidad = document.querySelector('input[name="tamanio"]:checked').value;
  grid.innerHTML = '';
  for (let i = 0; i < cantidad; i++) {
    const hex = randomHex();
    const colorMostrado = formatearColor(hex);
    const card = document.createElement('div');
    card.dataset.hex = hex;
    card.className = 'card-color';
    card.innerHTML = `
        <div class="color" style="background-color: ${hex}"></div>
        <span class="color-info">
          <p class="color-code">${colorMostrado}</p>
        <button class="copy-icon" aria-label="Copiar color">⧉</button>
        </span>
      `;
    /* Copiar color */
    card.addEventListener('click', () => {

      const code = card.querySelector('.color-code').textContent;

      navigator.clipboard.writeText(code)
        .then(() => showToast(code + ' copiado'))
        .catch(() => showToast('No se pudo copiar'));

      showToast(code + ' copiado');

    });
    grid.appendChild(card);
  }
}

function cambiarTamanio(e) {

  document.documentElement.style.setProperty(
    '--palette-size-desktop',
    e.target.value
  );

  generarPaleta();

}

function actualizarFormato() {

  document.querySelectorAll('.card-color').forEach(card => {

    const hex = card.dataset.hex;

    const colorMostrado = formatearColor(hex);

    card.querySelector('.color-code').textContent = colorMostrado;

  });

}


/* Helpers Funciones */

function randomHex() {
  return '#' + Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0');
}

function getFormato() {
  return document.querySelector('input[name="formato"]:checked').value;

}
function formatearColor(hex) {
  const formato = getFormato();
  if (formato === 'rgb') return hexToRgb(hex);
  if (formato === 'hsl') return hexToHsl(hex);
  return hex;
}

/*  HEX → RGB */
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
}
/* HEX → HSL */
function hexToHsl(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}


// Copy + toast
function showToast(msg) {
  toast.textContent = '✓ ' + msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}
