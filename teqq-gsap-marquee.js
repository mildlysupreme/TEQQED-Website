<script>
// OLD CODE
if (window.matchMedia("(min-width: 992px)").matches) {
const projectItems = document.querySelectorAll('.projects-item');

function resetHeaders() {
  const headers = document.querySelectorAll('.h1');
  headers.forEach(header => {
    header.style.color = '#000000';
    header.style.opacity = '1';
    header.style.transition = 'color 0.1s ease-in-out, opacity 0.1s ease-in-out';
  });
}

projectItems.forEach(item => {
  const textBlock = item.querySelector('.text-block').textContent;
  const previewTextBlocks = document.querySelectorAll('.projects-preview-item .text-block');

  previewTextBlocks.forEach(previewTextBlock => {
    if (previewTextBlock.textContent === textBlock) {
      const previewItem = previewTextBlock.closest('.projects-preview-item');
      const headerElements = item.querySelectorAll('.h1');

      item.addEventListener('mouseenter', () => {
        previewItem.style.opacity = '0';
        setTimeout(() => {
          previewItem.style.opacity = '1';
        }, 100);
        previewItem.style.transition = 'opacity 0.2s ease-in-out';

        headerElements.forEach(header => {
          if (header !== item.querySelector('.h1')) {
            header.style.color = '#ffffff';
            header.style.opacity = '0.5';
            header.style.transition = 'color 0.1s ease-in-out, opacity 0.1s ease-in-out';
          } else {
            header.style.color = '#AFD831';
            header.style.opacity = '1';
            header.style.transition = 'color 0.1s ease-in-out';
          }
        });

        const otherProjectItems = document.querySelectorAll('.projects-item:not(:hover)');
        otherProjectItems.forEach(otherItem => {
          const otherHeaderElements = otherItem.querySelectorAll('.h1');
          otherHeaderElements.forEach(otherHeader => {
            otherHeader.style.color = '#ffffff';
            otherHeader.style.opacity = '0.5';
            otherHeader.style.transition = 'color 0.1s ease-in-out, opacity 0.1s ease-in-out';
          });
        });
      });

      item.addEventListener('mouseleave', () => {
        previewItem.style.opacity = '0';
        previewItem.style.transition = 'opacity 0.2s ease-in-out';
        setTimeout(() => {
          previewItem.style.opacity = '0';
        }, 200);

        resetHeaders();

        const otherProjectItems = document.querySelectorAll('.projects-item:not(:hover)');
        otherProjectItems.forEach(otherItem => {
          const otherHeaderElements = otherItem.querySelectorAll('.h1');
          otherHeaderElements.forEach(otherHeader => {
            otherHeader.style.color = '#ffffff';
            otherHeader.style.opacity = '0.5';
            otherHeader.style.transition = 'color 0.1s ease-in-out, opacity 0.1s ease-in-out';
          });
        });
      });
    }
  });
});

const projectsMarquee = document.querySelector('.projects-marquee');
projectsMarquee.addEventListener('mouseleave', () => {
  resetHeaders();
});
}
</script>