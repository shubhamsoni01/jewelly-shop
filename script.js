/* ============================================================
   TANISHQ – Fine Jewellery | Main Application Script
   Frontend-Only Demonstration Project
   ============================================================ */

// ===================== CONFIGURATION =====================
const WHATSAPP_NUMBER = (typeof TANISHQ_CONFIG !== 'undefined' && TANISHQ_CONFIG.WHATSAPP_NUMBER)
    ? TANISHQ_CONFIG.WHATSAPP_NUMBER
    : '918102592130';

const DEFAULT_WHATSAPP_GREETING = `Hello TANISHQ Jewellery Team,

I would like to connect with you regarding your jewellery collection.

I am interested in learning more about your products, pricing and available designs.

Please assist me with the details.

Thank you.
Regards,
Customer`;

function buildWhatsAppURL(messageText) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(messageText)}`;
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===================== UTILITY FUNCTIONS =====================
function formatPrice(price) {
    return '₹' + Number(price).toLocaleString('en-IN');
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    const text = document.getElementById('notificationText');
    if (!notification || !text) return;
    text.textContent = message;
    notification.classList.add('active');
    clearTimeout(window.__notifTimer);
    window.__notifTimer = setTimeout(() => notification.classList.remove('active'), 4000);
}

function attachImageFallback(imgEl) {
    imgEl.addEventListener('error', function onErr() {
        if (this.dataset.fallbackApplied) return;
        this.dataset.fallbackApplied = 'true';
        this.src = typeof FALLBACK_IMAGE !== 'undefined'
            ? FALLBACK_IMAGE
            : 'assets/fallback-jewellery.svg';
    });
}

// Apply fallback to static HTML images
document.querySelectorAll('img').forEach(attachImageFallback);

// Sync WhatsApp & configurable placeholders from TANISHQ_CONFIG
const footerWaIcon = document.getElementById('footerWhatsappLink');
const footerWaText = document.getElementById('footerWhatsappText');
const contactWaDisplay = document.getElementById('contactWaDisplay');
const contactOptionWa = document.getElementById('contactOptionWa');
const greetingWaUrl = buildWhatsAppURL(DEFAULT_WHATSAPP_GREETING);

if (footerWaIcon) footerWaIcon.href = greetingWaUrl;
if (footerWaText) footerWaText.href = greetingWaUrl;
if (contactWaDisplay) contactWaDisplay.href = greetingWaUrl;
if (contactOptionWa) contactOptionWa.href = greetingWaUrl;

if (typeof TANISHQ_CONFIG !== 'undefined') {
    const addrEl = document.getElementById('configAddress');
    const mailEl = document.getElementById('configEmail');
    const hrsEl = document.getElementById('configHours');
    if (addrEl) addrEl.innerHTML = `${TANISHQ_CONFIG.SHOWROOM_ADDRESS}<br><span class="placeholder-note">(Configurable in config.js)</span>`;
    if (mailEl) mailEl.innerHTML = `${TANISHQ_CONFIG.CONCIERGE_EMAIL}<br><span class="placeholder-note">(Configurable in config.js)</span>`;
    if (hrsEl) hrsEl.innerHTML = `${TANISHQ_CONFIG.BUSINESS_HOURS}<br><span class="placeholder-note">(Configurable in config.js)</span>`;
}

// Direct "CHAT WITH OUR TEAM" WhatsApp CTA
const chatWithTeamBtn = document.getElementById('chatWithTeamBtn');
if (chatWithTeamBtn) {
    chatWithTeamBtn.addEventListener('click', () => {
        showNotification('Opening WhatsApp chat with TANISHQ Team...');
        setTimeout(() => {
            window.open(greetingWaUrl, '_blank', 'noopener');
        }, 600);
    });
}

// Contact Enquiry Form -> WhatsApp
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.querySelectorAll('input, select, textarea').forEach(field => {
        const clearContactErr = () => {
            field.classList.remove('error');
            const err = field.parentElement.querySelector('.form-error');
            if (err) err.textContent = '';
        };
        field.addEventListener('input', clearContactErr);
        field.addEventListener('change', clearContactErr);
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        contactForm.querySelectorAll('.form-error').forEach(el => el.textContent = '');
        contactForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

        const name = document.getElementById('contactName').value.trim();
        const mobile = document.getElementById('contactMobile').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const subject = document.getElementById('contactSubject').value;
        const message = document.getElementById('contactMessage').value.trim();

        if (!name) {
            document.getElementById('contactNameError').textContent = 'Please enter your full name';
            document.getElementById('contactName').classList.add('error');
            valid = false;
        }
        if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
            document.getElementById('contactMobileError').textContent = 'Enter a valid 10-digit Indian mobile number';
            document.getElementById('contactMobile').classList.add('error');
            valid = false;
        }
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            document.getElementById('contactEmailError').textContent = 'Enter a valid email address';
            document.getElementById('contactEmail').classList.add('error');
            valid = false;
        }
        if (!subject) {
            document.getElementById('contactSubjectError').textContent = 'Please select an enquiry subject';
            document.getElementById('contactSubject').classList.add('error');
            valid = false;
        }
        if (!message) {
            document.getElementById('contactMessageError').textContent = 'Please enter your message';
            document.getElementById('contactMessage').classList.add('error');
            valid = false;
        }

        if (!valid) {
            showNotification('Please complete all required contact fields');
            return;
        }

        const formattedContactMsg = `*TANISHQ – Fine Jewellery Contact Enquiry*
-------------------------------------
*Full Name:* ${name}
*Mobile Number:* ${mobile}
${email ? `*Email Address:* ${email}\n` : ''}*Subject:* ${subject}

*Message:*
${message}
-------------------------------------
Sent via TANISHQ Contact Form`;

        showNotification('Enquiry ready! Redirecting to WhatsApp...');
        setTimeout(() => {
            window.open(buildWhatsAppURL(formattedContactMsg), '_blank', 'noopener');
        }, 900);
    });
}

// ===================== LOADER =====================
window.addEventListener('load', () => {
    const delay = prefersReducedMotion ? 100 : 1800;
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) loader.classList.add('hidden');
        document.body.style.overflow = '';
    }, delay);
});
if (!prefersReducedMotion) {
    document.body.style.overflow = 'hidden';
}

// ===================== NAVBAR & MOBILE MENU =====================
const navbar = document.getElementById('navbar');
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
});

if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('active');
        mobileToggle.classList.toggle('active', isOpen);
        mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navLinks.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// Active nav link & mobile bottom nav on scroll
const sections = document.querySelectorAll('section[id]');
const bottomNavItems = document.querySelectorAll('.bottom-nav-item');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 140;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const isCurrent = scrollY >= top && scrollY < top + height;

        const link = navLinks ? navLinks.querySelector(`a[href="#${id}"]`) : null;
        if (link) link.classList.toggle('active', isCurrent);

        if (isCurrent) {
            bottomNavItems.forEach(item => {
                if (item.dataset.section === id) {
                    bottomNavItems.forEach(b => b.classList.remove('active'));
                    item.classList.add('active');
                }
            });
        }
    });
});

// ===================== HERO MOUSE-FOLLOW PARALLAX & PARTICLES =====================
const heroSection = document.getElementById('home');
const heroStage = document.getElementById('heroStage');
const supportsFinePointer = window.matchMedia('(pointer: fine)').matches;

if (heroSection && heroStage && supportsFinePointer && !prefersReducedMotion) {
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    let rafActive = false;

    const updateStage = () => {
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;
        heroStage.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
        if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
            requestAnimationFrame(updateStage);
        } else {
            rafActive = false;
        }
    };

    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        targetX = nx * 16;
        targetY = ny * 12;
        if (!rafActive) {
            rafActive = true;
            requestAnimationFrame(updateStage);
        }
    });

    heroSection.addEventListener('mouseleave', () => {
        targetX = 0;
        targetY = 0;
        if (!rafActive) {
            rafActive = true;
            requestAnimationFrame(updateStage);
        }
    });
}

(function createParticles() {
    if (prefersReducedMotion) return;
    const container = document.getElementById('heroParticles');
    if (!container) return;
    for (let i = 0; i < 18; i++) {
        const particle = document.createElement('div');
        particle.className = 'hero-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = (45 + Math.random() * 50) + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (5 + Math.random() * 4) + 's';
        const size = (2 + Math.random() * 2.5) + 'px';
        particle.style.width = size;
        particle.style.height = size;
        container.appendChild(particle);
    }
})();

// ===================== COUNTER ANIMATION =====================
function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(counter => {
        if (counter.dataset.animated) return;
        const target = parseInt(counter.dataset.count, 10);
        if (!target) return;
        counter.dataset.animated = 'true';

        if (prefersReducedMotion) {
            counter.textContent = target.toLocaleString('en-IN');
            return;
        }

        const duration = 1800;
        const start = performance.now();
        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.floor(target * eased).toLocaleString('en-IN');
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    });
}

// ===================== SCROLL REVEAL =====================
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
            if (entry.target.classList.contains('hero-stats') || entry.target.closest('.hero-content')) {
                animateCounters();
            }
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

setTimeout(() => {
    const heroEl = document.getElementById('home');
    if (heroEl) heroEl.classList.add('hero-ready');
    document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('visible'));
    animateCounters();
}, prefersReducedMotion ? 100 : 1850);

// ===================== WISHLIST (localStorage) =====================
let wishlist = [];
try {
    wishlist = JSON.parse(localStorage.getItem('tanishq_wishlist') || '[]');
    if (!Array.isArray(wishlist)) wishlist = [];
} catch {
    wishlist = [];
}

function updateWishlistCount() {
    const badge = document.getElementById('wishlistCount');
    if (badge) badge.textContent = wishlist.length;
    const bottomBadge = document.getElementById('bottomWishlistCount');
    if (bottomBadge) bottomBadge.textContent = wishlist.length;
}

function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification('Removed from your wishlist');
    } else {
        wishlist.push(productId);
        showNotification('Added to your wishlist ♥');
    }
    localStorage.setItem('tanishq_wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    renderWishlistSidebar();
    renderWishlistSection();
    updateWishlistButtons();
}

function renderWishlistSection() {
    const grid = document.getElementById('wishlistSectionGrid');
    const emptyEl = document.getElementById('wishlistSectionEmpty');
    if (!grid || !emptyEl) return;

    grid.innerHTML = '';
    if (wishlist.length === 0) {
        emptyEl.style.display = 'block';
        return;
    }

    emptyEl.style.display = 'none';
    wishlist.forEach((id, i) => {
        const p = products.find(x => x.id === id);
        if (p) grid.appendChild(createProductCard(p, i * 60));
    });
}

function updateWishlistButtons() {
    document.querySelectorAll('.product-card-wishlist').forEach(btn => {
        const id = parseInt(btn.dataset.id, 10);
        const active = wishlist.includes(id);
        btn.classList.toggle('active', active);
        const svg = btn.querySelector('svg');
        if (svg) svg.setAttribute('fill', active ? '#D4AF37' : 'none');
    });
}

function renderWishlistSidebar() {
    const container = document.getElementById('wishlistItems');
    const emptyMsg = document.getElementById('wishlistEmpty');
    if (!container || !emptyMsg) return;

    if (wishlist.length === 0) {
        container.innerHTML = '';
        emptyMsg.style.display = 'block';
        return;
    }

    emptyMsg.style.display = 'none';
    container.innerHTML = wishlist.map(id => {
        const p = products.find(x => x.id === id);
        if (!p) return '';
        return `
            <div class="wishlist-item">
                <div class="wishlist-item-img"><img src="${p.image}" alt="${p.name}" loading="lazy"></div>
                <div class="wishlist-item-info">
                    <h4>${p.name}</h4>
                    <span>${formatPrice(p.price)}</span>
                    <div class="wishlist-item-actions">
                        <button class="wishlist-preorder-mini" data-preorder-id="${p.id}">Pre-Order</button>
                    </div>
                </div>
                <button class="wishlist-item-remove" data-remove-id="${p.id}" aria-label="Remove from Wishlist">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
        `;
    }).join('');

    container.querySelectorAll('img').forEach(attachImageFallback);

    container.querySelectorAll('.wishlist-item-remove').forEach(btn => {
        btn.addEventListener('click', () => toggleWishlist(parseInt(btn.dataset.removeId, 10)));
    });

    container.querySelectorAll('.wishlist-preorder-mini').forEach(btn => {
        btn.addEventListener('click', () => {
            const prod = products.find(x => x.id === parseInt(btn.dataset.preorderId, 10));
            closeWishlist();
            if (prod) prefillPreorder(prod);
        });
    });
}

const wishlistToggle = document.getElementById('wishlistToggle');
const wishlistSidebar = document.getElementById('wishlistSidebar');
const wishlistOverlay = document.getElementById('wishlistOverlay');
const wishlistClose = document.getElementById('wishlistClose');
const wishlistExploreBtn = document.getElementById('wishlistExploreBtn');

function openWishlist() {
    wishlistSidebar.classList.add('active');
    wishlistOverlay.classList.add('active');
    renderWishlistSidebar();
}
function closeWishlist() {
    wishlistSidebar.classList.remove('active');
    wishlistOverlay.classList.remove('active');
}

if (wishlistToggle) wishlistToggle.addEventListener('click', openWishlist);
if (wishlistClose) wishlistClose.addEventListener('click', closeWishlist);
if (wishlistOverlay) wishlistOverlay.addEventListener('click', closeWishlist);
if (wishlistExploreBtn) wishlistExploreBtn.addEventListener('click', closeWishlist);

updateWishlistCount();
renderWishlistSection();

// ===================== PRODUCT CARD FACTORY =====================
function createProductCard(product, delay = 0) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = (prefersReducedMotion ? 0 : delay) + 'ms';
    card.setAttribute('data-category', product.category);

    const isInWishlist = wishlist.includes(product.id);

    card.innerHTML = `
        <div class="product-card-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            ${product.badge ? `<span class="product-card-badge">${product.badge}</span>` : ''}
            <button class="product-card-wishlist ${isInWishlist ? 'active' : ''}" data-id="${product.id}" aria-label="Toggle Wishlist">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="${isInWishlist ? '#D4AF37' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
        </div>
        <div class="product-card-info">
            <span class="product-card-category">${product.type}</span>
            <h3 class="product-card-name">${product.name}</h3>
            <div class="product-card-price-row">
                <p class="product-card-price">${formatPrice(product.price)}</p>
                <span class="product-demo-pill">Demo Price</span>
            </div>
            <div class="product-card-actions">
                <button class="card-btn card-btn-details" data-id="${product.id}">Quick View</button>
                <a href="#preorder" class="card-btn card-btn-preorder" data-product="${product.name}">Pre-Order</a>
            </div>
        </div>
    `;

    const cardImgWrap = card.querySelector('.product-card-image');
    const cardImg = cardImgWrap.querySelector('img');
    if (!cardImg.complete) {
        cardImgWrap.classList.add('is-loading');
        cardImg.addEventListener('load', () => cardImgWrap.classList.remove('is-loading'), { once: true });
        cardImg.addEventListener('error', () => cardImgWrap.classList.remove('is-loading'), { once: true });
    }
    attachImageFallback(cardImg);

    card.querySelector('.product-card-image').addEventListener('click', () => openProductModal(product));
    card.querySelector('.product-card-name').addEventListener('click', () => openProductModal(product));
    card.querySelector('.card-btn-details').addEventListener('click', () => openProductModal(product));

    card.querySelector('.product-card-wishlist').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleWishlist(product.id);
    });

    card.querySelector('.card-btn-preorder').addEventListener('click', (e) => {
        e.preventDefault();
        prefillPreorder(product);
    });

    return card;
}

// ===================== SMART SEARCH, FILTER & SORT =====================
const filterState = {
    category: 'all',
    search: '',
    priceRange: 'all',
    sort: 'featured'
};

const collectionSearch = document.getElementById('collectionSearch');
const priceRangeFilter = document.getElementById('priceRangeFilter');
const sortOrderFilter = document.getElementById('sortOrderFilter');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');
const resetEmptyFilters = document.getElementById('resetEmptyFilters');
const resultCountEl = document.getElementById('resultCount');
const emptyResultsEl = document.getElementById('emptyResults');

function applyCollectionFilters() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    let list = products.filter(p => {
        // Category filter
        const catMatch = filterState.category === 'all'
            || p.category === filterState.category
            || p.type.toLowerCase().includes(filterState.category);

        // Search filter
        const q = filterState.search.trim().toLowerCase();
        const searchMatch = !q
            || p.name.toLowerCase().includes(q)
            || p.type.toLowerCase().includes(q)
            || p.design.toLowerCase().includes(q)
            || p.category.toLowerCase().includes(q);

        // Price range filter
        let priceMatch = true;
        if (filterState.priceRange === 'under-150k') priceMatch = p.price < 150000;
        else if (filterState.priceRange === '150k-300k') priceMatch = p.price >= 150000 && p.price <= 300000;
        else if (filterState.priceRange === '300k-450k') priceMatch = p.price > 300000 && p.price <= 450000;
        else if (filterState.priceRange === 'above-450k') priceMatch = p.price > 450000;

        return catMatch && searchMatch && priceMatch;
    });

    // Sort
    if (filterState.sort === 'price-asc') {
        list.sort((a, b) => a.price - b.price);
    } else if (filterState.sort === 'price-desc') {
        list.sort((a, b) => b.price - a.price);
    } else if (filterState.sort === 'newest') {
        list.sort((a, b) => b.releaseOrder - a.releaseOrder);
    }

    grid.innerHTML = '';
    if (list.length === 0) {
        if (emptyResultsEl) emptyResultsEl.style.display = 'block';
    } else {
        if (emptyResultsEl) emptyResultsEl.style.display = 'none';
        list.forEach((p, i) => grid.appendChild(createProductCard(p, i * 60)));
    }

    if (resultCountEl) {
        resultCountEl.textContent = `Showing ${list.length} of ${products.length} pieces`;
    }
}

function clearAllFilters() {
    filterState.category = 'all';
    filterState.search = '';
    filterState.priceRange = 'all';
    filterState.sort = 'featured';

    if (collectionSearch) collectionSearch.value = '';
    if (priceRangeFilter) priceRangeFilter.value = 'all';
    if (sortOrderFilter) sortOrderFilter.value = 'featured';
    document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.filter === 'all');
    });
    applyCollectionFilters();
}

if (collectionSearch) {
    collectionSearch.addEventListener('input', (e) => {
        filterState.search = e.target.value;
        applyCollectionFilters();
    });
}
if (priceRangeFilter) {
    priceRangeFilter.addEventListener('change', (e) => {
        filterState.priceRange = e.target.value;
        applyCollectionFilters();
    });
}
if (sortOrderFilter) {
    sortOrderFilter.addEventListener('change', (e) => {
        filterState.sort = e.target.value;
        applyCollectionFilters();
    });
}
if (clearFiltersBtn) clearFiltersBtn.addEventListener('click', clearAllFilters);
if (resetEmptyFilters) resetEmptyFilters.addEventListener('click', clearAllFilters);

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterState.category = btn.dataset.filter;
        applyCollectionFilters();
    });
});

// Category cards & Footer category shortcuts
function jumpToCategoryFilter(filter) {
    filterState.category = filter;
    document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.filter === filter);
    });
    applyCollectionFilters();
    const el = document.getElementById('collections');
    if (el) el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
}

document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', (e) => {
        e.preventDefault();
        jumpToCategoryFilter(card.dataset.filter);
    });
});

document.querySelectorAll('[data-footer-filter]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        jumpToCategoryFilter(link.dataset.footerFilter);
    });
});

// ===================== GLOBAL SEARCH OVERLAY =====================
const searchToggle = document.getElementById('searchToggle');
const searchOverlay = document.getElementById('searchOverlay');
const searchClose = document.getElementById('searchClose');
const globalSearchInput = document.getElementById('globalSearchInput');
const globalSearchBtn = document.getElementById('globalSearchBtn');

function openSearchOverlay() {
    if (!searchOverlay) return;
    searchOverlay.classList.add('active');
    searchOverlay.setAttribute('aria-hidden', 'false');
    setTimeout(() => globalSearchInput && globalSearchInput.focus(), 150);
}
function closeSearchOverlay() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove('active');
    searchOverlay.setAttribute('aria-hidden', 'true');
}
function executeGlobalSearch(queryText) {
    const q = queryText.trim();
    filterState.search = q;
    if (collectionSearch) collectionSearch.value = q;
    applyCollectionFilters();
    closeSearchOverlay();
    const col = document.getElementById('collections');
    if (col) col.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
}

if (searchToggle) searchToggle.addEventListener('click', openSearchOverlay);
if (searchClose) searchClose.addEventListener('click', closeSearchOverlay);
if (globalSearchBtn) {
    globalSearchBtn.addEventListener('click', () => executeGlobalSearch(globalSearchInput.value));
}
if (globalSearchInput) {
    globalSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') executeGlobalSearch(globalSearchInput.value);
    });
}
document.querySelectorAll('.quick-tag').forEach(tag => {
    tag.addEventListener('click', () => executeGlobalSearch(tag.dataset.search));
});

// ===================== RENDER EXTRA SHOWCASE GRIDS =====================
function renderShowcaseGrid(containerId, predicate, limit = 4) {
    const grid = document.getElementById(containerId);
    if (!grid) return;
    grid.innerHTML = '';
    products.filter(predicate).slice(0, limit).forEach((p, i) => {
        grid.appendChild(createProductCard(p, i * 70));
    });
}

applyCollectionFilters();
renderShowcaseGrid('trendingGrid', p => p.isTrending, 4);
renderShowcaseGrid('exclusiveGrid', p => p.isExclusive, 4);
renderShowcaseGrid('bridalGrid', p => p.isBridal, 4);
renderShowcaseGrid('arrivalsGrid', p => p.isNew, 4);
renderShowcaseGrid('bestsellersGrid', p => p.isBestseller, 4);

// ===================== PRODUCT DETAIL MODAL (MULTI-IMAGE) =====================
const productModal = document.getElementById('productModal');
const modalClose = document.getElementById('modalClose');

function openProductModal(product) {
    const mainImg = document.getElementById('modalImage');
    const imgContainer = document.getElementById('modalImageContainer');
    const zoomBtn = document.getElementById('modalZoomBtn');
    const thumbsWrap = document.getElementById('modalThumbnails');

    if (imgContainer) imgContainer.classList.remove('zoomed');
    mainImg.src = product.image;
    mainImg.alt = product.name;
    attachImageFallback(mainImg);

    if (zoomBtn && imgContainer) {
        zoomBtn.onclick = (e) => {
            e.stopPropagation();
            imgContainer.classList.toggle('zoomed');
        };
        imgContainer.onclick = () => imgContainer.classList.toggle('zoomed');
    }

    const galleryImages = product.images && product.images.length ? product.images : [product.image];
    if (thumbsWrap) {
        thumbsWrap.innerHTML = galleryImages.map((src, idx) => `
            <button class="modal-thumb ${idx === 0 ? 'active' : ''}" data-src="${src}" aria-label="View angle ${idx + 1}">
                <img src="${src}" alt="${product.name} angle ${idx + 1}" loading="lazy">
            </button>
        `).join('');

        thumbsWrap.querySelectorAll('img').forEach(attachImageFallback);
        thumbsWrap.querySelectorAll('.modal-thumb').forEach(btn => {
            btn.addEventListener('click', () => {
                mainImg.src = btn.dataset.src;
                thumbsWrap.querySelectorAll('.modal-thumb').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    document.getElementById('modalBadge').textContent = product.badge || 'Signature';
    document.getElementById('modalCategory').textContent = product.type;
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalPrice').textContent = formatPrice(product.price);
    document.getElementById('modalAvailability').textContent = product.availability || 'Demo: Available for Enquiry';
    document.getElementById('modalDescription').textContent = product.description;
    document.getElementById('modalMaterial').textContent = product.material;
    document.getElementById('modalDesign').textContent = product.design;
    document.getElementById('modalWeight').textContent = product.weight;
    document.getElementById('modalType').textContent = product.type;

    // Populate available size options
    const sizesEl = document.getElementById('modalSizes');
    const sizesWrap = document.getElementById('modalSizesWrap');
    if (sizesEl && sizesWrap) {
        const sizeList = product.sizes && product.sizes.length ? product.sizes : ['Standard Fit'];
        sizesEl.innerHTML = sizeList.map((sz, idx) =>
            `<button type="button" class="size-pill ${idx === 0 ? 'active' : ''}">${sz}</button>`
        ).join('');
        sizesEl.querySelectorAll('.size-pill').forEach(btn => {
            btn.addEventListener('click', () => {
                sizesEl.querySelectorAll('.size-pill').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    const preorderBtn = document.getElementById('modalPreorder');
    preorderBtn.onclick = (e) => {
        e.preventDefault();
        closeProductModal();
        setTimeout(() => prefillPreorder(product), 250);
    };

    const wishlistBtn = document.getElementById('modalWishlistBtn');
    const isInWishlist = wishlist.includes(product.id);
    wishlistBtn.querySelector('span').textContent = isInWishlist ? 'In Wishlist' : 'Add to Wishlist';
    wishlistBtn.onclick = () => {
        toggleWishlist(product.id);
        const updated = wishlist.includes(product.id);
        wishlistBtn.querySelector('span').textContent = updated ? 'In Wishlist' : 'Add to Wishlist';
    };

    productModal.classList.add('active');
    productModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    productModal.classList.remove('active');
    productModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

if (modalClose) modalClose.addEventListener('click', closeProductModal);
if (productModal) {
    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) closeProductModal();
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProductModal();
        closeWishlist();
        closeSearchOverlay();
    }
});

// ===================== PRE-ORDER ENQUIRY SYSTEM =====================
const preorderForm = document.getElementById('preorderForm');
const categorySelect = document.getElementById('jewelleryCategory');
const productSelect = document.getElementById('productSelect');

function populateProductOptions(cat) {
    if (!productSelect) return;
    productSelect.innerHTML = '<option value="">Select Product</option>';

    const categoryMap = {
        'Gold Jewellery': p => p.type === 'Gold Jewellery',
        'Diamond Jewellery': p => p.type === 'Diamond Jewellery',
        'Bridal Jewellery': p => p.type === 'Bridal Jewellery' || p.isBridal,
        'Necklaces': p => p.category === 'necklaces',
        'Rings': p => p.category === 'rings',
        'Earrings': p => p.category === 'earrings',
        'Bangles': p => p.category === 'bangles',
        'Bracelets': p => p.category === 'bracelets'
    };

    const filterFn = categoryMap[cat];
    const matching = filterFn ? products.filter(filterFn) : products;
    matching.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.name;
        opt.textContent = `${p.name} — ${formatPrice(p.price)} (Demo)`;
        productSelect.appendChild(opt);
    });
}

if (categorySelect) {
    categorySelect.addEventListener('change', () => populateProductOptions(categorySelect.value));
}

function prefillPreorder(product) {
    const catMap = {
        'necklaces': 'Necklaces',
        'rings': 'Rings',
        'earrings': 'Earrings',
        'bangles': 'Bangles',
        'bracelets': 'Bracelets'
    };

    let formCat = product.type;
    if (product.type !== 'Diamond Jewellery' && product.type !== 'Bridal Jewellery' && catMap[product.category]) {
        formCat = catMap[product.category];
    }

    if (categorySelect) {
        categorySelect.value = formCat;
        populateProductOptions(formCat);
    }

    if (productSelect) productSelect.value = product.name;
    const budgetEl = document.getElementById('budget');
    if (budgetEl) {
        if (product.price < 100000) budgetEl.value = 'Under ₹1,00,000';
        else if (product.price <= 250000) budgetEl.value = '₹1,00,000 – ₹2,50,000';
        else if (product.price <= 450000) budgetEl.value = '₹2,50,000 – ₹4,50,000';
        else budgetEl.value = 'Above ₹4,50,000';
    }
    const designEl = document.getElementById('preferredDesign');
    if (designEl && product.design) {
        const matchOpt = Array.from(designEl.options).find(o => o.value.includes(product.design.split(' ')[0]));
        if (matchOpt) designEl.value = matchOpt.value;
    }

    const section = document.getElementById('preorder');
    if (section) section.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
}

if (preorderForm) {
    // Clear individual field error on user input/change
    preorderForm.querySelectorAll('input, select, textarea').forEach(field => {
        const clearFieldError = () => {
            field.classList.remove('error');
            const err = field.parentElement.querySelector('.form-error');
            if (err) err.textContent = '';
        };
        field.addEventListener('input', clearFieldError);
        field.addEventListener('change', clearFieldError);
    });

    preorderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

        const name = document.getElementById('customerName').value.trim();
        const mobile = document.getElementById('customerMobile').value.trim();
        const email = document.getElementById('customerEmail').value.trim();
        const contactMethod = document.getElementById('contactMethod').value;
        const category = categorySelect.value;
        const product = productSelect.value;
        const budget = document.getElementById('budget').value.trim();
        const preferredDesign = document.getElementById('preferredDesign') ? document.getElementById('preferredDesign').value : 'As Shown';
        const requirements = document.getElementById('customRequirements').value.trim();

        if (!name) {
            document.getElementById('nameError').textContent = 'Please enter your full name';
            document.getElementById('customerName').classList.add('error');
            isValid = false;
        }

        if (!mobile) {
            document.getElementById('mobileError').textContent = 'Please enter your mobile number';
            document.getElementById('customerMobile').classList.add('error');
            isValid = false;
        } else if (!/^[6-9]\d{9}$/.test(mobile)) {
            document.getElementById('mobileError').textContent = 'Enter a valid 10-digit Indian mobile number';
            document.getElementById('customerMobile').classList.add('error');
            isValid = false;
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            document.getElementById('emailError').textContent = 'Enter a valid email address';
            document.getElementById('customerEmail').classList.add('error');
            isValid = false;
        }

        if (!contactMethod) {
            document.getElementById('contactMethodError').textContent = 'Select a preferred contact method';
            document.getElementById('contactMethod').classList.add('error');
            isValid = false;
        }

        if (!category) {
            document.getElementById('categoryError').textContent = 'Please select a jewellery category';
            categorySelect.classList.add('error');
            isValid = false;
        }

        if (!product) {
            document.getElementById('productError').textContent = 'Please select a product';
            productSelect.classList.add('error');
            isValid = false;
        }

        if (!budget) {
            document.getElementById('budgetError').textContent = 'Please select your budget range';
            document.getElementById('budget').classList.add('error');
            isValid = false;
        }

        if (!isValid) {
            showNotification('Please complete all required fields accurately');
            return;
        }

        const enquiryText = `*TANISHQ – Fine Jewellery Pre-Order Enquiry*
-------------------------------------
*Customer Name:* ${name}
*Mobile Number:* ${mobile}
${email ? `*Email Address:* ${email}\n` : ''}*Preferred Contact:* ${contactMethod}
*Category:* ${category}
*Product Name:* ${product}
*Budget Range:* ${budget}
*Preferred Design:* ${preferredDesign}
${requirements ? `\n*Additional Requirements:*\n${requirements}\n` : ''}-------------------------------------
Frontend Enquiry generated via TANISHQ Demo Showcase`;

        const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(enquiryText)}`;

        showNotification('Enquiry formatted! Opening WhatsApp to send your request...');

        setTimeout(() => {
            window.open(whatsappURL, '_blank', 'noopener');
        }, 1200);
    });
}

// ===================== CONSULTATION SECTION =====================
const consultOccasionWrap = document.getElementById('consultationOccasions');
const selectedOccasionLabel = document.getElementById('selectedOccasionLabel');
const consultationForm = document.getElementById('consultationForm');
let selectedOccasion = 'Wedding Jewellery';

if (consultOccasionWrap) {
    consultOccasionWrap.querySelectorAll('.occasion-card').forEach(card => {
        card.addEventListener('click', () => {
            consultOccasionWrap.querySelectorAll('.occasion-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            selectedOccasion = card.dataset.occasion;
            if (selectedOccasionLabel) selectedOccasionLabel.textContent = selectedOccasion;
        });
    });
}

if (consultationForm) {
    consultationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('consultName').value.trim();
        const mobile = document.getElementById('consultMobile').value.trim();
        const notes = document.getElementById('consultNotes').value.trim();

        if (!name || !/^[6-9]\d{9}$/.test(mobile)) {
            showNotification('Please enter your name and a valid 10-digit mobile number');
            return;
        }

        const consultMsg = `*TANISHQ – Styling Consultation Enquiry*
-------------------------------------
*Occasion:* ${selectedOccasion}
*Name:* ${name}
*Mobile:* ${mobile}
${notes ? `*Notes:* ${notes}\n` : ''}-------------------------------------
Sent via TANISHQ Demo Consultation`;

        showNotification('Consultation enquiry ready! Opening WhatsApp...');
        setTimeout(() => {
            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(consultMsg)}`, '_blank', 'noopener');
        }, 1000);
    });
}

// ===================== TESTIMONIALS CAROUSEL =====================
(function initTestimonialCarousel() {
    const track = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');
    const dotsWrap = document.getElementById('testimonialDots');
    if (!track || !prevBtn || !nextBtn || !dotsWrap) return;

    const cards = Array.from(track.children);
    let currentIndex = 0;

    function perView() {
        return window.innerWidth <= 900 ? 1 : 2;
    }

    function maxIndex() {
        return Math.max(0, cards.length - perView());
    }

    function renderDots() {
        const count = maxIndex() + 1;
        dotsWrap.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${i === currentIndex ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Slide ${i + 1}`);
            dot.addEventListener('click', () => { currentIndex = i; update(); });
            dotsWrap.appendChild(dot);
        }
    }

    function update() {
        if (currentIndex > maxIndex()) currentIndex = 0;
        if (currentIndex < 0) currentIndex = maxIndex();
        const cardWidth = cards[0].getBoundingClientRect().width + 24;
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        renderDots();
    }

    prevBtn.addEventListener('click', () => { currentIndex--; update(); });
    nextBtn.addEventListener('click', () => { currentIndex++; update(); });
    window.addEventListener('resize', update);
    update();
})();

// ===================== NEWSLETTER (DEMO ONLY) =====================
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('newsletterEmail');
        if (!emailInput || !emailInput.value.trim()) {
            showNotification('Please enter an email address');
            return;
        }
        showNotification('Demo Notice: Thank you! Newsletter signup is a UI preview only.');
        emailInput.value = '';
    });
}

// ===================== FAQ ACCORDION =====================
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const answer = btn.nextElementSibling;
        const isActive = item.classList.contains('active');

        document.querySelectorAll('.faq-item').forEach(fi => {
            fi.classList.remove('active');
            fi.querySelector('.faq-answer').style.maxHeight = null;
        });

        if (!isActive) {
            item.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    });
});

// ===================== SMOOTH SCROLL FOR ANCHORS =====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const offset = navbar ? navbar.offsetHeight + 16 : 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        }
    });
});
