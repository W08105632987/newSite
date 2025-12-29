/* ============================================
   MONIEKING - MAIN JS (FIXED)
   Core Functionality
   ============================================ */

// ============= INITIALIZATION =============
document.addEventListener("DOMContentLoaded", () => {
  initAOS();
  initSmoothScroll();
  initScrollSpy();
  initHeaderScroll();
  initBackToTop();
  initLazyLoading();
});

// ============= AOS ANIMATION INITIALIZATION =============
function initAOS() {
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
      once: true,
      offset: 50,
      delay: 100,
    });
  }
}

// ============= SMOOTH SCROLL =============
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Skip if href is just "#"
      if (href === "#") {
        e.preventDefault();
        return;
      }

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// ============= SCROLL SPY FOR NAVIGATION =============
let manualNavClick = false;
let manualNavTimeout;

function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav__link");

  if (sections.length === 0 || navLinks.length === 0) return;

  // Track manual clicks
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      manualNavClick = true;
      clearTimeout(manualNavTimeout);

      manualNavTimeout = setTimeout(() => {
        manualNavClick = false;
      }, 2000);
    });
  });

  function updateActiveLink() {
    if (manualNavClick) return;

    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (window.pageYOffset >= sectionTop - 150) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      
      // Skip if this link has page-active attribute (it's for the current page)
      if (link.hasAttribute("data-page-active")) {
        return; // Don't remove active class from page links
      }
      
      // Only manage active state for hash links
      if (href.startsWith("#")) {
        link.classList.remove("active");
        
        if (href === `#${currentSection}`) {
          link.classList.add("active");
        }
      }
    });
  }

  window.addEventListener("scroll", updateActiveLink, { passive: true });
  updateActiveLink();
}

// ============= HEADER SCROLL EFFECT =============
function initHeaderScroll() {
  const header = document.getElementById("header");
  if (!header) return;

  let lastScroll = 0;
  let ticking = false;

  function updateHeader() {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      header.classList.add("scrolled", "sticky");
    } else {
      header.classList.remove("scrolled", "sticky");
    }

    lastScroll = currentScroll;
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    },
    { passive: true }
  );
}

// ============= BACK TO TOP BUTTON =============
function initBackToTop() {
  const backToTop = document.createElement("button");
  backToTop.innerHTML = "↑";
  backToTop.className = "back-to-top";
  backToTop.setAttribute("aria-label", "Back to top");
  document.body.appendChild(backToTop);

  const style = document.createElement("style");
  style.textContent = `
    .back-to-top {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      background: var(--gradient-primary);
      color: white;
      border: none;
      border-radius: var(--radius-full);
      font-size: 1.5rem;
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transition: all var(--transition-base);
      box-shadow: var(--shadow-xl);
      z-index: 999;
    }
    
    .back-to-top.visible {
      opacity: 1;
      visibility: visible;
    }
    
    .back-to-top:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-2xl);
    }
    
    @media (max-width: 768px) {
      .back-to-top {
        width: 45px;
        height: 45px;
        bottom: 20px;
        right: 20px;
        font-size: 1.25rem;
      }
    }
  `;
  document.head.appendChild(style);

  window.addEventListener(
    "scroll",
    () => {
      if (window.pageYOffset > 300) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    },
    { passive: true }
  );

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// ============= LAZY LOADING IMAGES =============
function initLazyLoading() {
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add("loaded");
            observer.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img);
    });
  } else {
    document.querySelectorAll("img[data-src]").forEach((img) => {
      img.src = img.dataset.src;
    });
  }
}

// ============= UTILITY FUNCTIONS =============

function debounce(func, wait = 10, immediate = true) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ============= FORM VALIDATION =============
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function validatePhone(phone) {
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return re.test(String(phone));
}

// ============= COUNTER ANIMATION =============
function animateCounter(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = value.toLocaleString();
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

const observeCounters = () => {
  const counters = document.querySelectorAll(".stat-card__number");

  if ("IntersectionObserver" in window && counters.length > 0) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.textContent.replace(/\D/g, ""));
            const suffix = counter.textContent.replace(/[0-9,+]/g, "");

            if (!isNaN(target)) {
              animateCounter(counter, 0, target, 2000);
              setTimeout(() => {
                counter.textContent = target.toLocaleString() + suffix;
              }, 2000);
            }

            counterObserver.unobserve(counter);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  }
};

document.addEventListener("DOMContentLoaded", observeCounters);

// ============= PERFORMANCE MONITORING (FIXED) =============
if (typeof window.performance !== "undefined" && window.performance.timing) {
  window.addEventListener("load", () => {
    setTimeout(() => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

      // Only log if we have a valid positive number
      if (pageLoadTime > 0 && pageLoadTime < 60000) {
        // Less than 1 minute
        console.log(`Page loaded in ${pageLoadTime}ms`);
      }
    }, 100);
  });
}

// ============= ERROR HANDLING =============
window.addEventListener("error", (e) => {
  console.error("Global error:", e.error);
});

// ============= EXPORT UTILITIES =============
window.MonieKing = {
  debounce,
  throttle,
  validateEmail,
  validatePhone,
  animateCounter,
};
