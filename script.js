const navToggle = document.querySelector('.nav-toggle')
const navList = document.querySelector('.nav-list')
if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    const open = navList.classList.toggle('open')
    navToggle.setAttribute('aria-expanded', String(open))
  })
}
const observerOptions = {
  root: null,
  rootMargin: '0px 0px -50px 0px',
  threshold: 0.15
}

const revealOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions)

// Optimized Reveal Setup for all major components
const initReveal = () => {
  const elements = document.querySelectorAll('section, .glass-card, .gallery-item, .trust-item, .doctor-profile-card, .testimonial-card');
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

// Review Slider Logic
const slider = document.querySelector('[data-slider]')
if (slider) {
  const track = slider.querySelector('.review-track')
  const cards = Array.from(track.children)
  let index = 0
  
  setInterval(() => {
    index = (index + 1) % cards.length
    track.style.transform = `translateX(-${index * 100}%)`
    track.style.transition = 'transform 600ms cubic-bezier(0.4, 0, 0.2, 1)'
  }, 4000)
}

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
    const card = button.parentElement;
    const isActive = card.classList.contains('active');
    
    // Close all other cards
    document.querySelectorAll('.faq-card').forEach(c => c.classList.remove('active'));
    
    // Toggle current card
    if (!isActive) {
      card.classList.add('active');
    }
  });
});

// Before/After Slider logic
const comparisonContainers = document.querySelectorAll('.comparison-container');
comparisonContainers.forEach(container => {
  const slider = container.querySelector('.comparison-slider');
  const afterImage = container.querySelector('.comparison-after');

  if (slider && afterImage) {
    const updateSlider = () => {
      const value = slider.value;
      afterImage.style.clipPath = `inset(0 0 0 ${value}%)`;
      container.style.setProperty('--slider-pos', `${value}%`);
      
      // Update line and button position
      const sliderLine = container.querySelector('.slider-line');
      const sliderButton = container.querySelector('.slider-button');
      if (sliderLine) sliderLine.style.left = `${value}%`;
      if (sliderButton) sliderButton.style.left = `${value}%`;
    };

    slider.addEventListener('input', updateSlider);
    slider.addEventListener('change', updateSlider);
    
    // Initial set
    updateSlider();
  }
});
