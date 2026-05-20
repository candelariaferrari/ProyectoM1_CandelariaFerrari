/* sidebar */
const wrapper   = document.getElementById('wrapper');
const btnToggle = document.getElementById('btnToggle');

/* Seleccionar tamaño de paletas */
const radios = document.querySelectorAll('input[name="tamanio"]');

radios.forEach(radio => {
  radio.addEventListener('change', () => {
    document.documentElement.style.setProperty(
      '--palette-size',
      radio.value  // "6", "8" o "9"
    );
  });
});



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