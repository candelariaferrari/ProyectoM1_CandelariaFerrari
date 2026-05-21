/* Sidebar */
const wrapper = document.getElementById('wrapper');
const btnToggle = document.getElementById('btnToggle');
const btnMobileToggle = document.getElementById('btnMobileToggle');

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

/* btnMobileToggle.addEventListener('click', () => {
  const sidebar = document.getElementById('sidebar');
  const abierto = sidebar.classList.toggle('mobile-abierto');
  btnMobileToggle.classList.toggle('abierto', abierto);
}); */
/* btnMobileToggle.addEventListener('click', () => {
  const estaAbierto = sidebar.classList.contains('mobile-abierto');

  if (estaAbierto) {
    sidebar.classList.add('mobile-cerrando');

    setTimeout(() => {
      sidebar.classList.remove('mobile-abierto');
      sidebar.classList.remove('mobile-cerrando');
    }, 300); // ← tiene que coincidir exactamente con la duración del fadeOut

  } else {
    sidebar.classList.add('mobile-abierto');
  }

  btnMobileToggle.classList.toggle('abierto', !estaAbierto);
}); */
btnMobileToggle.addEventListener('click', () => {
  const estaAbierto = sidebar.classList.contains('mobile-abierto');
  sidebar.classList.toggle('mobile-abierto');
  btnMobileToggle.classList.toggle('abierto', !estaAbierto);
});
generateBtn.addEventListener('click', generarPaleta); /* genera paleta con btn */

document.addEventListener('DOMContentLoaded', generarPaleta); /* se ejecuta cuando el HTML terminó de cargar */

document.addEventListener('keydown', manejarAtajos); /* Escucha teclas del teclado */

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
  btnToggle.classList.toggle('colapsado', colapsado); // ← esta línea faltaba
  btnToggle.textContent = colapsado ? '‹' : '›';
  btnToggle.setAttribute(
    'aria-label',
    colapsado ? 'Expandir panel' : 'Colapsar panel'
  );
}
/* Generar una paleta completa */
function generarPaleta() {
  // Lee cuántos colores eligió el usuario
  const cantidad = document.querySelector('input[name="tamanio"]:checked').value;
  grid.innerHTML = ''; // limpia las cards anteriores
  for (let i = 0; i < cantidad; i++) { /* se ejecuta tantas veces como colores elegidos */
    const hex = randomHex(); /* genera color aleatorio*/
    const colorMostrado = formatearColor(hex); /*  Convierte el color según el formato elegido. */
    const card = document.createElement('div');
    card.dataset.hex = hex; /*  Guardamos el HEX original dentro del dataset, para poder cambiar HEX/RGB/HSL */
    card.className = 'card-color';
    card.innerHTML = `
        <div class="color" style="background-color: ${hex}"></div>
        <span class="color-info">
          <p class="color-code">${colorMostrado}</p>
          <span class="copy-icon">⧉</span>
        </span>
      `;
    /* Copiar color */
    card.addEventListener('click', () => {

      const code = card.querySelector('.color-code').textContent;

      navigator.clipboard.writeText(code);

      showToast(code + ' copiado');

    });
    grid.appendChild(card); /* Se agrega una card por cada color al contendor principal */
  }
}

function manejarAtajos(e) {

  if (e.code === 'Space' && e.target === document.body) {
    e.preventDefault();
    generarPaleta();
  }

}

function cambiarTamanio(e) {

  document.documentElement.style.setProperty(
    '--palette-size-desktop',
    e.target.value
  );

  generarPaleta();

}

function actualizarFormato() { /* Actualiza solamente el texto del color.  */

  document.querySelectorAll('.card-color').forEach(card => {

    const hex = card.dataset.hex;

    const colorMostrado = formatearColor(hex);

    card.querySelector('.color-code').textContent = colorMostrado;

  });

}


/* Helpers Funciones */
/* Generar un color HEX aleatorio */
function randomHex() { /* crea un color aleatoreamente  */
  return '#' + Math.floor(Math.random() * 16777215) /* 16777215 es el número decimal de #ffffff */
    .toString(16) /* Math.random() genera un número entre 0 y 1, lo multiplicás por ese máximo y convertís a base 16. */
    .padStart(6, '0');
}

function getFormato() {
  return document.querySelector('input[name="formato"]:checked').value;
  // devuelve "hex", "rgb" o "hsl"
}
function formatearColor(hex) {
  const formato = getFormato();
  if (formato === 'rgb') return hexToRgb(hex);
  if (formato === 'hsl') return hexToHsl(hex);
  return hex; // por defecto HEX
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
  // Primero convertís HEX a RGB
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
