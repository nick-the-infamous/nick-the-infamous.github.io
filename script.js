document.addEventListener('DOMContentLoaded', () => {
  // Close all nested accordions within a parent element, recursively
  const closeNestedAccordions = (parentElement) => {
    // Get all open accordion contents at any depth
    const nestedContents = parentElement.querySelectorAll('.accordion-content.open');
    
    // Process from deepest to shallowest to handle nested cases correctly
    const processContent = (content) => {
      // Close all child accordions first (recursive case)
      content.querySelectorAll('.accordion-content.open').forEach(processContent);
      
      // Then close this accordion (base case)
      if (content !== parentElement) {  // Don't close the parent we're acting on
        content.classList.remove('open');
        const arrow = content.previousElementSibling?.querySelector('.arrow');
        arrow?.classList.remove('rotate');
      }
    };
    
    // Start processing from each open content element
    nestedContents.forEach(processContent);
  };

  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const arrow = header.querySelector('.arrow');
      if (!content) return;

      const wasOpen = content.classList.contains('open');
      
      // Close all nested accordions when closing a parent
      if (wasOpen) {
        closeNestedAccordions(content);
      }

      // Toggle the open class
      content.classList.toggle('open');

      // Lazy load iframe when opening
      if (content.classList.contains('open')) {
        const iframe = content.querySelector('iframe[data-src]');
        if (iframe && !iframe.src) {
          iframe.src = iframe.getAttribute('data-src');
        }
      }

      // Rotate arrow
      arrow?.classList.toggle('rotate');
    });
  });
});
