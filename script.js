document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const arrow = header.querySelector('.arrow');
      if (!content) return;

      // toggle the open class
      content.classList.toggle('open');

      // rotate arrow
      arrow?.classList.toggle('rotate');
    });
  });
});
