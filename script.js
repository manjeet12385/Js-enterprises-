// KMSJ Interiors - Luxury Turnkey Interior Architecture & Design Studio
// Client-side interactions: Hero Slider, Portfolio Filter, Consultation

let currentSlide = 0;
let slideInterval = null;

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  initSearchOverlay();
  initMobileDrawer();
});

// 1. Hero Slideshow
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dots .dot');
  const prevBtn = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');

  if (slides.length === 0) return;

  function showSlide(index) {
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === index);
    });
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
    currentSlide = index;
  }

  function nextSlide() {
    let nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex);
  }

  function prevSlide() {
    let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prevIndex);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoSlide();
  });

  if (prevBtn) prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoSlide();
  });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      showSlide(idx);
      resetAutoSlide();
    });
  });

  function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 6000);
  }

  function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
  }

  // Touch swipe support for mobile & tablet screens
  const sliderEl = document.getElementById('heroSlider');
  if (sliderEl) {
    let startX = 0;
    let endX = 0;
    sliderEl.addEventListener('touchstart', (e) => {
      startX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderEl.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].screenX;
      if (startX - endX > 45) {
        nextSlide();
        resetAutoSlide();
      } else if (endX - startX > 45) {
        prevSlide();
        resetAutoSlide();
      }
    }, { passive: true });
  }

  startAutoSlide();
}

// 2. Signature Architectural Portfolio Filter
function filterPortfolio(category) {
  const cards = document.querySelectorAll('.portfolio-item-card');
  const tabs = document.querySelectorAll('.portfolio-tab-btn');

  tabs.forEach(tab => {
    const attr = tab.getAttribute('onclick') || '';
    if (attr.includes(`'${category}'`)) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category') || '';
    if (category === 'all' || cardCat === category) {
      card.style.display = 'flex';
      card.style.opacity = '0';
      card.style.transform = 'translateY(12px)';
      setTimeout(() => {
        card.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 20);
    } else {
      card.style.display = 'none';
    }
  });

  const portfolioSection = document.getElementById('portfolio');
  if (portfolioSection) {
    portfolioSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// Backwards compatibility for filterProducts
function filterProducts(category) {
  filterPortfolio(category);
}

// 3. Prefill Consultation Form with Project Details
function prefillConsultation(projectName) {
  const messageInput = document.getElementById('eqMessage');
  const serviceSelect = document.getElementById('eqService');

  if (messageInput) {
    messageInput.value = '';
  }

  if (serviceSelect) {
    serviceSelect.value = '';
  }

  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
  }

  if (messageInput) {
    messageInput.focus();
  }
}

// 5. Service Directory Category Tabs Filtering
function filterDirectory(cat) {
  const cards = document.querySelectorAll('.service-matrix-card');
  const btns = document.querySelectorAll('.directory-filter-btn');

  btns.forEach(b => {
    const onclickAttr = b.getAttribute('onclick') || '';
    if (onclickAttr.includes(`'${cat}'`)) {
      b.classList.add('active');
    } else {
      b.classList.remove('active');
    }
  });

  const searchInput = document.getElementById('directoryLiveSearch');
  if (searchInput) searchInput.value = '';

  cards.forEach(card => {
    const cardCat = card.getAttribute('data-cat') || '';
    if (cat === 'all' || cardCat === cat) {
      card.style.display = 'flex';
      card.style.opacity = '0';
      card.style.transform = 'translateY(8px)';
      setTimeout(() => {
        card.style.transition = 'all 0.25s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 20);
    } else {
      card.style.display = 'none';
    }
  });

  const hubSection = document.getElementById('services-hub');
  if (hubSection) {
    hubSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// 6. Live Search in Disciplines Directory
function handleDirectorySearch(query) {
  const cleanQuery = (query || '').toLowerCase().trim();
  const cards = document.querySelectorAll('.service-matrix-card');
  const btns = document.querySelectorAll('.directory-filter-btn');

  btns.forEach(b => {
    const text = b.textContent.toLowerCase();
    b.classList.toggle('active', text.includes('all'));
  });

  cards.forEach(card => {
    const searchAttr = (card.getAttribute('data-search') || '').toLowerCase();
    const text = card.textContent.toLowerCase();
    if (cleanQuery === '' || searchAttr.includes(cleanQuery) || text.includes(cleanQuery)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

function quickFilterDirectory(term) {
  const searchInput = document.getElementById('directoryLiveSearch');
  if (searchInput) {
    searchInput.value = term;
    handleDirectorySearch(term);
  }
  const hubSection = document.getElementById('services-hub');
  if (hubSection) {
    hubSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// 7. Global Search Overlay & Handling
function initSearchOverlay() {
  const openSearchBtn = document.getElementById('openSearchBtn');
  const closeSearchBtn = document.getElementById('closeSearchBtn');
  const searchOverlay = document.getElementById('searchOverlay');
  const overlayInput = document.getElementById('overlaySearchInput');

  if (openSearchBtn && searchOverlay) {
    openSearchBtn.addEventListener('click', () => {
      searchOverlay.classList.add('active');
      if (overlayInput) overlayInput.focus();
    });
  }

  if (closeSearchBtn && searchOverlay) {
    closeSearchBtn.addEventListener('click', () => {
      searchOverlay.classList.remove('active');
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
      searchOverlay.classList.remove('active');
    }
  });
}

function quickSearch(term) {
  const overlayInput = document.getElementById('overlaySearchInput');
  const mobileInput = document.getElementById('mobileSearchInput');
  if (overlayInput) overlayInput.value = term;
  if (mobileInput) mobileInput.value = term;
  handleSearch(new Event('submit'));
}

function handleSearch(event) {
  if (event && event.preventDefault) event.preventDefault();
  const searchOverlay = document.getElementById('searchOverlay');
  const overlayInput = document.getElementById('overlaySearchInput');
  const mobileInput = document.getElementById('mobileSearchInput');
  
  const query = ((overlayInput && overlayInput.value) || (mobileInput && mobileInput.value) || '').toLowerCase().trim();

  if (searchOverlay) searchOverlay.classList.remove('active');

  // Search in Portfolio
  const cards = document.querySelectorAll('.portfolio-item-card');
  let portfolioMatches = 0;
  cards.forEach(card => {
    const title = (card.querySelector('.portfolio-title')?.textContent || '').toLowerCase();
    const desc = (card.querySelector('.portfolio-description')?.textContent || '').toLowerCase();
    const cat = (card.getAttribute('data-category') || '').toLowerCase();
    if (query === '' || title.includes(query) || desc.includes(query) || cat.includes(query)) {
      card.style.display = 'flex';
      portfolioMatches++;
    } else {
      card.style.display = 'none';
    }
  });

  // Also filter disciplines matrix
  handleDirectorySearch(query);

  if (portfolioMatches > 0) {
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) portfolioSection.scrollIntoView({ behavior: 'smooth' });
  } else {
    const hub = document.getElementById('services-hub');
    if (hub) hub.scrollIntoView({ behavior: 'smooth' });
  }
}

// 8. Bulk Consultation Enquiry Form Submit
function handleBulkEnquiry(event) {
  event.preventDefault();
  const name = document.getElementById('eqName').value;
  const phone = document.getElementById('eqPhone').value;
  const service = document.getElementById('eqService').value || 'Turnkey 3BHK Luxury Residence';
  const scale = document.getElementById('eqProjectScale').value || 'Residential Apartment';
  const message = document.getElementById('eqMessage').value || 'Private design consultation request';

  const text = `*KMSJ Interiors - Private Design Consultation Request*%0A%0A` +
    `*Client Name:* ${encodeURIComponent(name)}%0A` +
    `*Mobile/WhatsApp:* ${encodeURIComponent(phone)}%0A` +
    `*Selected Interior Vertical:* ${encodeURIComponent(service)}%0A` +
    `*Property Type & Scale:* ${encodeURIComponent(scale)}%0A` +
    `*Location & Preferences:* ${encodeURIComponent(message)}%0A%0A` +
    `Please confirm the studio appointment schedule and 3D architectural project consultation.`;

  window.open(`https://wa.me/918707014932?text=${text}`, '_blank');
}

// 9. Mobile Drawer
function initMobileDrawer() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const closeBtn = document.getElementById('closeDrawerBtn');
  const drawer = document.getElementById('mobileDrawer');

  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', () => drawer.classList.add('open'));
  }
  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', () => drawer.classList.remove('open'));
  }
}

// 10. FAQ Accordion Toggle
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  if (!item) return;

  const allItems = document.querySelectorAll('.faq-item');
  const wasActive = item.classList.contains('active');

  // Close other items
  allItems.forEach(i => i.classList.remove('active'));

  // Toggle current
  if (!wasActive) {
    item.classList.add('active');
  }
}

// 11. Master 10-Vertical Hub Filter & Search
function filterHubCategory(cat, btn) {
  const cards = document.querySelectorAll('.hub-service-card');
  const buttons = document.querySelectorAll('.hub-cat-btn');

  buttons.forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const searchInput = document.getElementById('hubLiveSearchInput');
  if (searchInput) searchInput.value = '';

  cards.forEach(card => {
    const cardCat = card.getAttribute('data-cat') || '';
    if (cat === 'all' || cardCat === cat) {
      card.style.display = 'flex';
      card.style.opacity = '0';
      card.style.transform = 'translateY(6px)';
      setTimeout(() => {
        card.style.transition = 'all 0.25s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 15);
    } else {
      card.style.display = 'none';
    }
  });
}

function handleHubSearch(query) {
  const q = (query || '').toLowerCase().trim();
  const cards = document.querySelectorAll('.hub-service-card');
  const buttons = document.querySelectorAll('.hub-cat-btn');

  buttons.forEach(b => b.classList.remove('active'));

  cards.forEach(card => {
    const name = (card.getAttribute('data-name') || '').toLowerCase();
    const cat = (card.getAttribute('data-cat') || '').toLowerCase();
    if (q === '' || name.includes(q) || cat.includes(q)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

function quickFilterHub(term) {
  const input = document.getElementById('hubLiveSearchInput');
  if (input) {
    input.value = term;
    handleHubSearch(term);
  }
}

// Compatibility stubs for any remnants
window.filterPortfolio = filterPortfolio;
window.filterProducts = filterProducts;
window.prefillConsultation = prefillConsultation;
window.filterDirectory = filterDirectory;
window.handleDirectorySearch = handleDirectorySearch;
window.quickFilterDirectory = quickFilterDirectory;
window.quickSearch = quickSearch;
window.handleSearch = handleSearch;
window.handleBulkEnquiry = handleBulkEnquiry;
window.toggleFaq = toggleFaq;
window.filterHubCategory = filterHubCategory;
window.handleHubSearch = handleHubSearch;
window.quickFilterHub = quickFilterHub;
window.addToCart = () => {};
window.removeFromCart = () => {};
window.updateQty = () => {};
window.clearCart = () => {};
window.closeCartDrawer = () => {};
window.openCartDrawer = () => {};
window.toggleWishlist = () => {};
