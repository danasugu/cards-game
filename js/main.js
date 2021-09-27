const draggables = document.querySelectorAll('draggable');
const categories = document.querySelectorAll('.category');

draggables.forEach((draggable) => {
  draggable.addEventListener('dragstart', () => {
    draggable.classList.add('dragging');
  });

  draggable.addEventListener('dragend', () => {
    draggable.classList.remove('dragging');
  });
});

categories.forEach((category) => {
  category.addEventListener('dragover', (e) => {
    e.preventDefault;
    const draggble = document.querySelector('.dragging');
    category.appendChild(draggble);
  });
});
