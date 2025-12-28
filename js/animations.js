/* ============================================
   MONIEKING - ANIMATIONS JS (FIXED)
   GSAP & ScrollTrigger Animations
   ============================================ */

// ============= INITIALIZATION =============
document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    initHeroAnimations();
    initScrollAnimations();
    initFloatingElements();
    initParallaxEffects();
    initCountUpAnimations();
    initCardAnimations();
  }
});

// ============= HERO ANIMATIONS =============
function initHeroAnimations() {
  // Check if hero elements exist before animating
  if (!document.querySelector(".hero__badge")) return;

  const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

  const elementsToAnimate = [
    {
      selector: ".hero__badge",
      from: { opacity: 0, y: 30, duration: 0.6, delay: 0.2 },
    },
    {
      selector: ".hero__title",
      from: { opacity: 0, y: 50, duration: 0.8 },
      position: "-=0.3",
    },
    {
      selector: ".hero__description",
      from: { opacity: 0, y: 30, duration: 0.6 },
      position: "-=0.4",
    },
    {
      selector: ".hero__cta .btn",
      from: { opacity: 0, y: 20, duration: 0.5, stagger: 0.2 },
      position: "-=0.3",
    },
    {
      selector: ".stat-card",
      from: { opacity: 0, y: 30, duration: 0.6, stagger: 0.15 },
      position: "-=0.3",
    },
    {
      selector: ".hero__image",
      from: { opacity: 0, scale: 0.8, duration: 1, ease: "back.out(1.4)" },
      position: "-=0.8",
    },
    {
      selector: ".floating-card",
      from: {
        opacity: 0,
        scale: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: "back.out(2)",
      },
      position: "-=0.5",
    },
  ];

  elementsToAnimate.forEach(({ selector, from, position }) => {
    if (document.querySelector(selector)) {
      timeline.from(selector, from, position || "+=0");
    }
  });
}

// ============= SCROLL ANIMATIONS =============
function initScrollAnimations() {
  // Fade in sections
  gsap.utils.toArray(".section").forEach((section) => {
    if (section) {
      gsap.from(section, {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top 50%",
          scrub: 1,
          once: true,
        },
      });
    }
  });

  // Section headers
  gsap.utils.toArray(".section__header").forEach((header) => {
    if (header) {
      gsap.from(header, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        scrollTrigger: {
          trigger: header,
          start: "top 85%",
          once: true,
        },
      });
    }
  });

  // Feature cards
  gsap.utils.toArray(".feature-card").forEach((card, index) => {
    if (card) {
      gsap.from(card, {
        opacity: 0,
        y: 50,
        duration: 0.6,
        delay: index * 0.1,
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          once: true,
        },
      });
    }
  });

  // Service cards
  gsap.utils.toArray(".service-card").forEach((card, index) => {
    if (card) {
      gsap.from(card, {
        opacity: 0,
        x: index % 2 === 0 ? -50 : 50,
        duration: 0.8,
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          once: true,
        },
      });
    }
  });

  // Step cards
  gsap.utils.toArray(".step-card").forEach((card, index) => {
    if (card) {
      gsap.from(card, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        delay: index * 0.15,
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          once: true,
        },
      });
    }
  });

  // Testimonial cards
  gsap.utils.toArray(".testimonial-card").forEach((card, index) => {
    if (card) {
      gsap.from(card, {
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        delay: index * 0.1,
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          once: true,
        },
      });
    }
  });
}

// ============= FLOATING ELEMENTS =============
function initFloatingElements() {
  // Animate floating cards
  gsap.utils.toArray(".floating-card").forEach((card, index) => {
    if (card) {
      gsap.to(card, {
        y: "+=20",
        duration: 2 + index * 0.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
  });

  // Animate hero image
  const heroImage = document.querySelector(".hero__image");
  if (heroImage) {
    gsap.to(heroImage, {
      y: "+=15",
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }

  // Animate app preview (only if it exists)
  const appPhone = document.querySelector(".app-download__phone");
  if (appPhone) {
    gsap.to(appPhone, {
      y: "+=10",
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }
}

// ============= PARALLAX EFFECTS =============
function initParallaxEffects() {
  // Partnership separator animation
  const separator = document.querySelector(".partnership__separator");
  if (separator) {
    ScrollTrigger.create({
      trigger: separator,
      start: "top 80%",
      onEnter: () => {
        gsap.from(separator, {
          y: -50,
          opacity: 0,
          duration: 1,
          ease: "bounce.out",
        });
      },
      once: true,
    });
  }
}

// ============= COUNT UP ANIMATIONS =============
function initCountUpAnimations() {
  const statNumbers = document.querySelectorAll(".stat-card__number");

  statNumbers.forEach((stat) => {
    const target = parseInt(stat.textContent.replace(/\D/g, ""));
    const suffix = stat.textContent.replace(/[0-9,]/g, "");

    if (!isNaN(target)) {
      ScrollTrigger.create({
        trigger: stat,
        start: "top 80%",
        onEnter: () => {
          gsap.from(
            { value: 0 },
            {
              value: target,
              duration: 2,
              ease: "power1.out",
              onUpdate: function () {
                stat.textContent =
                  Math.floor(this.targets()[0].value).toLocaleString() + suffix;
              },
            }
          );
        },
        once: true,
      });
    }
  });
}

// ============= CARD HOVER ANIMATIONS =============
function initCardAnimations() {
  // Feature cards
  document.querySelectorAll(".feature-card").forEach((card) => {
    const icon = card.querySelector(".feature-card__icon");
    if (!icon) return;

    card.addEventListener("mouseenter", () => {
      gsap.to(card, {
        y: -10,
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.to(icon, {
        scale: 1.1,
        rotate: 5,
        duration: 0.3,
        ease: "back.out(2)",
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.to(icon, {
        scale: 1,
        rotate: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  });

  // Service cards
  document.querySelectorAll(".service-card").forEach((card) => {
    const icon = card.querySelector(".service-card__icon");
    if (!icon) return;

    card.addEventListener("mouseenter", () => {
      gsap.to(card, {
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.to(icon, {
        rotate: 360,
        duration: 0.6,
        ease: "power2.out",
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  });

  // Button hover effects
  document.querySelectorAll(".btn--primary, .btn--secondary").forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      gsap.to(btn, {
        scale: 1.05,
        duration: 0.2,
        ease: "power2.out",
      });
    });

    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      });
    });
  });
}

// ============= MAGNETIC EFFECT FOR BUTTONS =============
function initMagneticButtons() {
  const buttons = document.querySelectorAll(".btn--primary, .btn--secondary");

  buttons.forEach((button) => {
    button.addEventListener("mousemove", (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(button, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    button.addEventListener("mouseleave", () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.5)",
      });
    });
  });
}

// Initialize magnetic buttons only on desktop
document.addEventListener("DOMContentLoaded", () => {
  if (window.innerWidth > 768 && typeof gsap !== "undefined") {
    initMagneticButtons();
  }
});

// ============= EXPORT FUNCTIONS =============
window.MonieKingAnimations = {
  initHeroAnimations,
  initScrollAnimations,
  initFloatingElements,
  initParallaxEffects,
  initCountUpAnimations,
  initCardAnimations,
};
