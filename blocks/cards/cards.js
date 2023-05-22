import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('enter');
      }
    });
  });

  const classes = ['one', 'two', 'three', 'four', 'five'];
  const row = block.children[0];
  if (row) {
    block.classList.add(classes[row.children.length - 1]);
  }
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    if (cell.firstChild) {
      const details = document.createElement('div');
      details.classList.add('cards-card-details');
      cell.classList.add('cards-card');
      while (cell.firstChild) details.append(cell.firstChild);
      const picture = details.querySelector('picture');
      if (picture) {
        cell.prepend(createOptimizedPicture(picture));
      } else if (details.querySelector('h3')) {
        cell.classList.add('cards-card-highlight');
      }
      cell.append(details);
      observer.observe(cell);
    }
  });
}
