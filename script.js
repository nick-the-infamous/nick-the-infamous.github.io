document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const arrow = header.querySelector('.arrow');
      if (!content) return;

      // toggle the open class
      content.classList.toggle('open');

      // lazy load iframe when opening
      if (content.classList.contains('open')) {
        const iframe = content.querySelector('iframe[data-src]');
        if (iframe && !iframe.src) {
          iframe.src = iframe.getAttribute('data-src');
        }
      }

      // rotate arrow
      arrow?.classList.toggle('rotate');
    });
  });
});
