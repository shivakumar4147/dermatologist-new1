const navToggle = document.querySelector('.nav-toggle')
const navList = document.querySelector('.nav-list')
if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    const open = navList.classList.toggle('open')
    navToggle.setAttribute('aria-expanded', String(open))
  })
}
const siteHeader = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    siteHeader.classList.add('scrolled');
  } else {
    siteHeader.classList.remove('scrolled');
  }
});

// Reveal Animations on Scroll (Refined)
const revealOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
}, { 
  threshold: 0.15, 
  rootMargin: '0px 0px -50px 0px' 
});

// Optimized Reveal Setup for all major components
const initReveal = () => {
  const elements = document.querySelectorAll('section, .glass-card, .gallery-item, .trust-item, .doctor-profile-card, .testimonial-card, .infra-card, .result-card, .blog-card');
  elements.forEach(el => {
    el.classList.add('reveal');
    revealOnScroll.observe(el);
  });
}
initReveal();

// Staggered Animations for grids
const grids = document.querySelectorAll('.services-grid, .gallery-grid, .testimonials-grid');
grids.forEach(grid => {
  const children = Array.from(grid.children);
  children.forEach((child, index) => {
    child.classList.add('reveal-stagger');
    child.style.setProperty('--stagger-index', index);
  });
});

// Image Protection: Prevent right-click and drag
const protectImages = () => {
  const images = document.querySelectorAll('img')
  images.forEach(img => {
    img.addEventListener('contextmenu', e => e.preventDefault())
    img.addEventListener('dragstart', e => e.preventDefault())
  })
}
protectImages()

// Re-run protection if new content is added dynamically (e.g. results gallery)
const observerProtection = new MutationObserver(() => protectImages())
observerProtection.observe(document.body, { childList: true, subtree: true })

const form = document.querySelector('[data-appointment]')
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault()
    const name = form.querySelector('#name')?.value || ''
    const phone = form.querySelector('#phone')?.value || ''
    const service = form.querySelector('#service')?.value || ''
    const notes = form.querySelector('#notes')?.value || ''
    const subject = encodeURIComponent('Appointment Request - Skin 360')
    const body = encodeURIComponent(`Name: ${name}\nPhone: ${phone}\nService: ${service}\nNotes: ${notes}`)
    const mailto = `mailto:info@skin360clinic.com?subject=${subject}&body=${body}`
    window.location.href = mailto
  })
}

// Call Now Button Tracking (Simple placeholder)
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
  link.addEventListener('click', () => {
    console.log('Call tracking: User clicked phone number ' + link.href);
  });
});

// FAQ Accordion Logic
document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const card = button.closest('.faq-card');
    const isActive = card.classList.contains('active');
    
    // Close all other cards in this container
    const accordion = card.closest('.faq-accordion');
    accordion.querySelectorAll('.faq-card').forEach(c => c.classList.remove('active'));
    
    // Toggle current card
    if (!isActive) {
      card.classList.add('active');
    }
  });
});

// Testimonial Slider Dots Logic
const initTestimonialSlider = () => {
  const slider = document.getElementById('testimonial-slider');
  const dotsContainer = document.getElementById('testimonial-dots');
  
  if (!slider || !dotsContainer) return;

  const cards = slider.querySelectorAll('.testimonial-card');
  
  // Create dots
  cards.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('slider-dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      slider.scrollTo({
        left: cards[index].offsetLeft - slider.offsetLeft,
        behavior: 'smooth'
      });
    });
    dotsContainer.appendChild(dot);
  });

  // Update active dot on scroll
  slider.addEventListener('scroll', () => {
    const scrollPos = slider.scrollLeft;
    const cardWidth = cards[0].offsetWidth + 32; // card + gap
    const activeIndex = Math.round(scrollPos / cardWidth);
    
    dotsContainer.querySelectorAll('.slider-dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === activeIndex);
    });
  });
};
initTestimonialSlider();

const comparisonContainers = document.querySelectorAll('.comparison-container');
comparisonContainers.forEach(container => {
  const slider = container.querySelector('.comparison-slider');
  const afterImage = container.querySelector('.comparison-after');

  if (slider && afterImage) {
    const updateSlider = () => {
      const value = slider.value;
      // Inset clip-path logic: inset(top right bottom left)
      // When value is 0, we see all of After (left is 0)
      // When value is 100, we see none of After (left is 100)
      afterImage.style.clipPath = `inset(0 0 0 ${value}%)`;
      container.style.setProperty('--slider-pos', `${value}%`);
      
      const sliderLine = container.querySelector('.slider-line');
      const sliderButton = container.querySelector('.slider-button');
      if (sliderLine) sliderLine.style.left = `${value}%`;
      if (sliderButton) sliderButton.style.left = `${value}%`;
    };

    slider.addEventListener('input', updateSlider);
    slider.addEventListener('change', updateSlider);
    
    // Set initial position
    window.addEventListener('load', updateSlider);
    updateSlider();
  }
});
