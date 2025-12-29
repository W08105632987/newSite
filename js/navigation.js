/* ============================================
   MONIEKING - NAVIGATION JS
   Navigation & Hamburger Menu Functionality
   ============================================ */

// ============= NAVIGATION STATE =============
const navState = {
  isOpen: false,
  isMobile: window.innerWidth <= 1024,
};

// ============= INITIALIZE NAVIGATION =============
document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initNavOverlay();
  initResponsiveNav();
  initActivePageHighlight();
});

// ============= MOBILE MENU TOGGLE =============
function initMobileMenu() {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav__link");

  if (!navToggle || !navMenu) return;

  // Toggle menu on hamburger click
  navToggle.addEventListener("click", () => {
    toggleMenu();
  });

  // Close menu when clicking nav links
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navState.isMobile && navState.isOpen) {
        closeMenu();
      }
    });
  });

  // Close menu on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navState.isOpen) {
      closeMenu();
    }
  });
}

// ============= TOGGLE MENU =============
function toggleMenu() {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const overlay = document.querySelector(".nav-overlay");

  navState.isOpen = !navState.isOpen;

  navToggle.classList.toggle("active");
  navMenu.classList.toggle("active");

  if (overlay) {
    overlay.classList.toggle("active");
  }

  // Prevent body scroll when menu is open
  if (navState.isOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }

  // Update ARIA attributes
  navToggle.setAttribute("aria-expanded", navState.isOpen);
  navMenu.setAttribute("aria-hidden", !navState.isOpen);
}

// ============= CLOSE MENU =============
function closeMenu() {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const overlay = document.querySelector(".nav-overlay");

  navState.isOpen = false;

  navToggle.classList.remove("active");
  navMenu.classList.remove("active");

  if (overlay) {
    overlay.classList.remove("active");
  }

  document.body.style.overflow = "";

  navToggle.setAttribute("aria-expanded", "false");
  navMenu.setAttribute("aria-hidden", "true");
}

// ============= OPEN MENU =============
function openMenu() {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const overlay = document.querySelector(".nav-overlay");

  navState.isOpen = true;

  navToggle.classList.add("active");
  navMenu.classList.add("active");

  if (overlay) {
    overlay.classList.add("active");
  }

  document.body.style.overflow = "hidden";

  navToggle.setAttribute("aria-expanded", "true");
  navMenu.setAttribute("aria-hidden", "false");
}

// ============= NAVIGATION OVERLAY =============
function initNavOverlay() {
  // Create overlay if it doesn't exist
  let overlay = document.querySelector(".nav-overlay");

  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "nav-overlay";
    document.body.appendChild(overlay);
  }

  // Close menu when clicking overlay
  overlay.addEventListener("click", () => {
    if (navState.isOpen) {
      closeMenu();
    }
  });
}

// ============= RESPONSIVE NAVIGATION =============
function initResponsiveNav() {
  let resizeTimer;

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const wasMobile = navState.isMobile;
      navState.isMobile = window.innerWidth <= 1024;

      // Close mobile menu when resizing to desktop
      if (wasMobile && !navState.isMobile && navState.isOpen) {
        closeMenu();
      }

      // Reset body overflow if switching to desktop
      if (!navState.isMobile) {
        document.body.style.overflow = "";
      }
    }, 250);
  });
}

// ============= ACTIVE PAGE HIGHLIGHT =============
// ============= ACTIVE PAGE HIGHLIGHT =============
function initActivePageHighlight() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav__link");

  navLinks.forEach((link) => {
    const linkHref = link.getAttribute("href");
    
    // Skip hash links (they're for scrolling, not page navigation)
    if (linkHref.startsWith("#")) return;

    // Check if link matches current page
    if (
      linkHref === currentPage ||
      (currentPage === "" && linkHref === "index.html") ||
      (currentPage === "/" && linkHref === "index.html")
    ) {
      link.classList.add("active");
      link.setAttribute("data-page-active", "true"); // Mark as page-active
    } else {
      link.classList.remove("active");
      link.removeAttribute("data-page-active");
    }
  });
}

// ============= STICKY NAVIGATION =============
// ============= STICKY NAVIGATION =============
function initStickyNav() {
  const header = document.getElementById("header");
  if (!header) return;
  
  let lastScrollTop = 0;
  const scrollThreshold = 50;

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Always keep header visible and sticky
    if (scrollTop > scrollThreshold) {
      header.classList.add("sticky", "scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Optional: Hide on scroll down, show on scroll up (remove if you want always visible)
    // if (scrollTop > lastScrollTop && scrollTop > 200) {
    //   header.style.transform = "translateY(-100%)";
    // } else {
    //   header.style.transform = "translateY(0)";
    // }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }, { passive: true });
}

// Initialize sticky navigation
document.addEventListener("DOMContentLoaded", initStickyNav);

// ============= NAVIGATION DROPDOWN (IF NEEDED) =============
function initDropdowns() {
  const dropdownToggles = document.querySelectorAll(".nav__dropdown-toggle");

  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      const dropdown = toggle.nextElementSibling;

      // Toggle dropdown
      toggle.classList.toggle("active");
      dropdown.classList.toggle("active");

      // Close other dropdowns
      dropdownToggles.forEach((otherToggle) => {
        if (otherToggle !== toggle) {
          otherToggle.classList.remove("active");
          otherToggle.nextElementSibling.classList.remove("active");
        }
      });
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav__dropdown")) {
      dropdownToggles.forEach((toggle) => {
        toggle.classList.remove("active");
        toggle.nextElementSibling.classList.remove("active");
      });
    }
  });
}

// ============= KEYBOARD NAVIGATION =============
function initKeyboardNav() {
  const navLinks = document.querySelectorAll(".nav__link");

  navLinks.forEach((link, index) => {
    link.addEventListener("keydown", (e) => {
      // Arrow key navigation
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        const nextLink = navLinks[index + 1] || navLinks[0];
        nextLink.focus();
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        const prevLink = navLinks[index - 1] || navLinks[navLinks.length - 1];
        prevLink.focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        navLinks[0].focus();
      } else if (e.key === "End") {
        e.preventDefault();
        navLinks[navLinks.length - 1].focus();
      }
    });
  });
}

// Initialize keyboard navigation
document.addEventListener("DOMContentLoaded", initKeyboardNav);

// ============= SEARCH FUNCTIONALITY (OPTIONAL) =============
function initNavSearch() {
  const searchToggle = document.getElementById("navSearchToggle");
  const searchInput = document.getElementById("navSearchInput");

  if (!searchToggle || !searchInput) return;

  searchToggle.addEventListener("click", () => {
    searchInput.classList.toggle("active");
    if (searchInput.classList.contains("active")) {
      searchInput.focus();
    }
  });

  // Close search on escape
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      searchInput.classList.remove("active");
      searchToggle.focus();
    }
  });
}

// ============= NAVIGATION ACCESSIBILITY =============
function enhanceAccessibility() {
  const nav = document.querySelector(".nav");
  const navMenu = document.getElementById("navMenu");
  const navToggle = document.getElementById("navToggle");

  // Add ARIA attributes
  if (nav) nav.setAttribute("role", "navigation");
  if (navMenu) {
    navMenu.setAttribute("aria-label", "Main navigation");
    navMenu.setAttribute("aria-hidden", "false");
  }
  if (navToggle) {
    navToggle.setAttribute("aria-label", "Toggle navigation menu");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-controls", "navMenu");
  }

  // Focus management
  const focusableElements = navMenu?.querySelectorAll(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements && focusableElements.length > 0) {
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    navMenu?.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
          }
        }
      }
    });
  }
}

// Initialize accessibility features
document.addEventListener("DOMContentLoaded", enhanceAccessibility);

// ============= EXPORT FUNCTIONS =============
window.MonieKingNav = {
  toggleMenu,
  closeMenu,
  openMenu,
  navState,
};
