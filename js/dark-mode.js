/* ============================================
   MONIEKING - DARK MODE JS
   Dark Mode Toggle with Animated Stars
   ============================================ */

// ============= DARK MODE STATE =============
const darkModeState = {
  isDark: false,
  storageKey: "monieking-theme",
  stars: [],
  shootingStars: [],
};

// ============= INITIALIZE DARK MODE =============
document.addEventListener("DOMContentLoaded", () => {
  initDarkMode();
  initStars();
  attachToggleListener();
});

// ============= INITIALIZE DARK MODE =============
function initDarkMode() {
  // Check localStorage for saved preference
  const savedTheme = localStorage.getItem(darkModeState.storageKey);

  // Check system preference if no saved theme
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // Set initial theme
  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    enableDarkMode();
  } else {
    disableDarkMode();
  }

  // Listen for system theme changes
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem(darkModeState.storageKey)) {
        if (e.matches) {
          enableDarkMode();
        } else {
          disableDarkMode();
        }
      }
    });
}

// ============= ENABLE DARK MODE =============
function enableDarkMode() {
  document.body.classList.add("dark-mode");
  darkModeState.isDark = true;
  localStorage.setItem(darkModeState.storageKey, "dark");

  // Update toggle button icon
  const toggleBtn = document.getElementById("darkModeToggle");
  if (toggleBtn) {
    toggleBtn.setAttribute("aria-label", "Switch to light mode");
  }

  // Generate stars after a brief delay
  setTimeout(() => {
    if (darkModeState.stars.length === 0) {
      generateStars();
    }
  }, 100);
}

// ============= DISABLE DARK MODE =============
function disableDarkMode() {
  document.body.classList.remove("dark-mode");
  darkModeState.isDark = false;
  localStorage.setItem(darkModeState.storageKey, "light");

  // Update toggle button icon
  const toggleBtn = document.getElementById("darkModeToggle");
  if (toggleBtn) {
    toggleBtn.setAttribute("aria-label", "Switch to dark mode");
  }
}

// ============= ATTACH TOGGLE LISTENER =============
function attachToggleListener() {
  const toggleBtn = document.getElementById("darkModeToggle");

  if (!toggleBtn) return;

  toggleBtn.addEventListener("click", () => {
    if (darkModeState.isDark) {
      disableDarkMode();
    } else {
      enableDarkMode();
    }
  });

  // Keyboard support
  toggleBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleBtn.click();
    }
  });
}

// ============= INITIALIZE STARS =============
function initStars() {
  const starsContainer = document.getElementById("starsContainer");
  if (!starsContainer) return;

  // Generate stars if dark mode is active
  if (darkModeState.isDark) {
    generateStars();
  }
}

// ============= GENERATE STARS =============
function generateStars() {
  const starsContainer = document.getElementById("starsContainer");
  if (!starsContainer) return;

  // Also generate stars for hero section
function generateHeroStars() {
    const hero = document.querySelector(".hero");
    if (!hero) return;

    // Create stars container for hero if it doesn't exist
  let heroStarsContainer = hero.querySelector(".hero-stars-container");
    if (!heroStarsContainer) {
      heroStarsContainer = document.createElement("div");
      heroStarsContainer.className = "hero-stars-container";
      heroStarsContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
      overflow: hidden;
    `;
      hero.insertBefore(heroStarsContainer, hero.firstChild);
    }

    // Generate stars for hero
    const numStars = 100;
    for (let i = 0; i < numStars; i++) {
      const star = createStar();
      heroStarsContainer.appendChild(star);
    }
  }

  // Call this function when page loads
  document.addEventListener("DOMContentLoaded", () => {
    generateHeroStars();
  });

  // Clear existing stars
  starsContainer.innerHTML = "";
  darkModeState.stars = [];
  darkModeState.shootingStars = [];

  const numStars = 150;
  const numShootingStars = 3;

  // Generate regular stars
  for (let i = 0; i < numStars; i++) {
    const star = createStar();
    starsContainer.appendChild(star);
    darkModeState.stars.push(star);
  }

  // Generate shooting stars
  for (let i = 0; i < numShootingStars; i++) {
    const shootingStar = createShootingStar();
    starsContainer.appendChild(shootingStar);
    darkModeState.shootingStars.push(shootingStar);
  }

  // Add some glowing stars
  const numGlowingStars = 20;
  for (let i = 0; i < numGlowingStars; i++) {
    const index = Math.floor(Math.random() * darkModeState.stars.length);
    darkModeState.stars[index].classList.add("glow");
  }
}

// ============= CREATE STAR =============
function createStar() {
  const star = document.createElement("div");
  star.className = "star";

  // Random size
  const sizeClass = Math.random();
  if (sizeClass > 0.9) {
    star.classList.add("large");
  } else if (sizeClass > 0.7) {
    star.classList.add("medium");
  }

  // Random position
  star.style.left = `${Math.random() * 100}%`;
  star.style.top = `${Math.random() * 100}%`;

  // Random animation
  star.style.setProperty("--twinkle-duration", `${2 + Math.random() * 4}s`);
  star.style.setProperty("--twinkle-delay", `${Math.random() * 5}s`);

  return star;
}

// ============= CREATE SHOOTING STAR =============
function createShootingStar() {
  const star = document.createElement("div");
  star.className = "shooting-star";

  // Random starting position (top area)
  star.style.left = `${Math.random() * 50}%`;
  star.style.top = `${Math.random() * 30}%`;

  // Random animation delay
  star.style.setProperty("--shoot-delay", `${Math.random() * 10}s`);

  // Random width for trail effect
  star.style.width = `${50 + Math.random() * 100}px`;
  star.style.height = "2px";

  return star;
}

// ============= STAR ANIMATION CONTROL =============
function pauseStarAnimations() {
  darkModeState.stars.forEach((star) => {
    star.style.animationPlayState = "paused";
  });
  darkModeState.shootingStars.forEach((star) => {
    star.style.animationPlayState = "paused";
  });
}

function resumeStarAnimations() {
  darkModeState.stars.forEach((star) => {
    star.style.animationPlayState = "running";
  });
  darkModeState.shootingStars.forEach((star) => {
    star.style.animationPlayState = "running";
  });
}

// ============= PERFORMANCE OPTIMIZATION =============
// Pause animations when page is not visible
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    pauseStarAnimations();
  } else {
    resumeStarAnimations();
  }
});

// Pause animations when user scrolls (optional, for performance)
// Pause animations when user scrolls for better performance
let scrollTimeout;
let isScrolling = false;

window.addEventListener(
  "scroll",
  () => {
    if (!isScrolling) {
      isScrolling = true;
      // Reduce animation complexity during scroll
      document.documentElement.style.setProperty('--scroll-performance', 'optimized');
    }

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
      document.documentElement.style.setProperty('--scroll-performance', 'normal');
    }, 150);
  },
  { passive: true }
);

// ============= CONSTELLATION EFFECT (OPTIONAL) =============
function createConstellations() {
  const starsContainer = document.getElementById("starsContainer");
  if (!starsContainer || darkModeState.stars.length < 10) return;

  const numConstellations = 5;

  for (let i = 0; i < numConstellations; i++) {
    // Pick random stars
    const star1 =
      darkModeState.stars[
        Math.floor(Math.random() * darkModeState.stars.length)
      ];
    const star2 =
      darkModeState.stars[
        Math.floor(Math.random() * darkModeState.stars.length)
      ];

    if (star1 === star2) continue;

    // Create line between stars
    const line = createConstellationLine(star1, star2);
    if (line) {
      starsContainer.appendChild(line);
    }
  }
}

function createConstellationLine(star1, star2) {
  const rect1 = star1.getBoundingClientRect();
  const rect2 = star2.getBoundingClientRect();

  const x1 = rect1.left + rect1.width / 2;
  const y1 = rect1.top + rect1.height / 2;
  const x2 = rect2.left + rect2.width / 2;
  const y2 = rect2.top + rect2.height / 2;

  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;

  // Only create line if stars are reasonably close
  if (length < 200 && length > 50) {
    const line = document.createElement("div");
    line.className = "constellation-line";
    line.style.width = `${length}px`;
    line.style.left = `${x1}px`;
    line.style.top = `${y1}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.setProperty("--fade-delay", `${Math.random() * 5}s`);

    return line;
  }

  return null;
}

// ============= METEOR SHOWER EFFECT =============
function triggerMeteorShower() {
  const starsContainer = document.getElementById("starsContainer");
  if (!starsContainer || !darkModeState.isDark) return;

  const numMeteors = 10;

  for (let i = 0; i < numMeteors; i++) {
    setTimeout(() => {
      const meteor = createShootingStar();
      meteor.style.setProperty("--shoot-delay", "0s");
      starsContainer.appendChild(meteor);

      // Remove meteor after animation
      setTimeout(() => {
        meteor.remove();
      }, 3000);
    }, i * 200);
  }
}

// ============= THEME TRANSITION EFFECT =============
function transitionTheme() {
  document.body.style.transition =
    "background-color 0.5s ease, color 0.5s ease";

  setTimeout(() => {
    document.body.style.transition = "";
  }, 500);
}

// ============= ACCESSIBILITY =============
// Respect user's motion preferences
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (prefersReducedMotion) {
  // Disable star animations
  const style = document.createElement("style");
  style.textContent = `
    .star,
    .shooting-star {
      animation: none !important;
    }
  `;
  document.head.appendChild(style);
}

// ============= EXPORT FUNCTIONS =============
window.MonieKingTheme = {
  enableDarkMode,
  disableDarkMode,
  generateStars,
  triggerMeteorShower,
  state: darkModeState,
};
