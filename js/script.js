/* sidebar */
const wrapper = document.getElementById('wrapper');
const btnToggle = document.getElementById('btnToggle');

/* Seleccionar tamaño de paletas */
const radios = document.querySelectorAll('input[name="tamanio"]');



// Atajo de teclado: Alt + S
document.addEventListener('keydown', (e) => {
  if (e.altKey && e.key === 's') toggleSidebar();
});

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
btnToggle.addEventListener('click', toggleSidebar);

/* Generar un color HEX aleatorio */
function randomHex() { /* crea un color aleatoreamente  */
  return '#' + Math.floor(Math.random() * 16777215) /* 16777215 es el número decimal de #ffffff */
    .toString(16) /* Math.random() genera un número entre 0 y 1, lo multiplicás por ese máximo y convertís a base 16. */
    .padStart(6, '0');
}
/* Generar una paleta completa */
function generarPaleta() {
  // Lee cuántos colores eligió el usuario
  const cantidad = document.querySelector('input[name="tamanio"]:checked').value;

  const grid = document.getElementById('paletteGrid');
  grid.innerHTML = ''; // limpia las cards anteriores

  for (let i = 0; i < cantidad; i++) {
    const color = randomHex();

    const card = document.createElement('div');
    card.className = 'card-color';
    card.innerHTML = `
      <div class="color" style="background-color: ${color}"></div>
      <span class="color-info">
        <p class="color-code">${color}</p>
        <span class="copy-icon">⧉</span>
      </span>
    `;

    grid.appendChild(card);
  }
}
/* Conectarlo al botón y al teclado */
document.getElementById('generateBtn').addEventListener('click', generarPaleta);

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && e.target === document.body) {
    e.preventDefault();
    generarPaleta();
  }
});
/* Cargar una primera paleta apenas carga el html */
document.addEventListener('DOMContentLoaded', () => { /* DOMContentLoaded se dispara cuando el HTML terminó de cargar */
  generarPaleta();
});

/* Seleccionar cantidad de colores */
radios.forEach(radio => {
  radio.addEventListener('change', () => {
    document.documentElement.style.setProperty(
      '--palette-size',
      radio.value  // "6", "8" o "9"
    );
    generarPaleta(); // ← esto es todo lo que faltaba
  });
});

