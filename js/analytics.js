/* ============================================
   MONIEKING - ANALYTICS JS
   Google Analytics 4 Integration
   ============================================ */

// ============= CONFIGURATION =============
const analyticsConfig = {
  measurementId: "G-XXXXXXXXXX", // Replace with your GA4 Measurement ID
  debug: false, // Set to true for development
  cookieConsent: true, // Set to false to disable cookie consent
};

// ============= INITIALIZE GOOGLE ANALYTICS =============
function initGoogleAnalytics() {
  // Check for cookie consent
  if (analyticsConfig.cookieConsent && !getCookieConsent()) {
    console.log("Analytics: Waiting for cookie consent");
    return;
  }

  // Load Google Analytics script
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.measurementId}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag("js", new Date());
  gtag("config", analyticsConfig.measurementId, {
    debug_mode: analyticsConfig.debug,
    send_page_view: true,
  });

  console.log("Analytics: Initialized");
}

// ============= TRACK PAGE VIEW =============
function trackPageView(pagePath, pageTitle) {
  if (typeof gtag === "undefined") return;

  gtag("config", analyticsConfig.measurementId, {
    page_path: pagePath || window.location.pathname,
    page_title: pageTitle || document.title,
  });

  if (analyticsConfig.debug) {
    console.log("Analytics: Page view tracked", { pagePath, pageTitle });
  }
}

// ============= TRACK EVENT =============
function trackEvent(eventName, eventParams = {}) {
  if (typeof gtag === "undefined") return;

  gtag("event", eventName, eventParams);

  if (analyticsConfig.debug) {
    console.log("Analytics: Event tracked", { eventName, eventParams });
  }
}

// ============= TRACK BUTTON CLICKS =============
function initButtonTracking() {
  // Track all buttons with data-track attribute
  document.querySelectorAll("[data-track]").forEach((button) => {
    button.addEventListener("click", () => {
      const eventName = button.dataset.track;
      const eventLabel = button.dataset.trackLabel || button.textContent;
      const eventCategory = button.dataset.trackCategory || "Button";

      trackEvent(eventName, {
        event_category: eventCategory,
        event_label: eventLabel,
        value: button.dataset.trackValue || undefined,
      });
    });
  });

  // Track CTA buttons
  document.querySelectorAll(".btn--primary, .btn--secondary").forEach((btn) => {
    btn.addEventListener("click", () => {
      trackEvent("cta_click", {
        event_category: "CTA",
        event_label: btn.textContent.trim(),
        button_location: getButtonLocation(btn),
      });
    });
  });

  // Track app download buttons
  document.querySelectorAll(".app-button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const store = btn.textContent.includes("Google Play")
        ? "Google Play"
        : "App Store";
      trackEvent("app_download_click", {
        event_category: "Download",
        event_label: store,
        download_platform: store,
      });
    });
  });
}

// ============= TRACK NAVIGATION =============
function initNavigationTracking() {
  document.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", () => {
      trackEvent("navigation_click", {
        event_category: "Navigation",
        event_label: link.textContent.trim(),
        link_url: link.href,
      });
    });
  });
}

// ============= TRACK SCROLL DEPTH =============
function initScrollTracking() {
  const scrollThresholds = [25, 50, 75, 100];
  const scrolledThresholds = new Set();

  function checkScrollDepth() {
    const scrollPercent = Math.round(
      (window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight)) *
        100
    );

    scrollThresholds.forEach((threshold) => {
      if (scrollPercent >= threshold && !scrolledThresholds.has(threshold)) {
        scrolledThresholds.add(threshold);
        trackEvent("scroll_depth", {
          event_category: "Engagement",
          event_label: `${threshold}%`,
          percent_scrolled: threshold,
        });
      }
    });
  }

  let scrollTimeout;
  window.addEventListener(
    "scroll",
    () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(checkScrollDepth, 100);
    },
    { passive: true }
  );
}

// ============= TRACK TIME ON PAGE =============
function initTimeTracking() {
  let startTime = Date.now();
  let engaged = false;

  // Track engagement
  ["click", "scroll", "keydown"].forEach((event) => {
    window.addEventListener(
      event,
      () => {
        engaged = true;
      },
      { once: true, passive: true }
    );
  });

  // Send time on page before leaving
  window.addEventListener("beforeunload", () => {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000);

    trackEvent("time_on_page", {
      event_category: "Engagement",
      event_label: document.title,
      value: timeOnPage,
      engaged: engaged,
    });
  });

  // Track at intervals
  setInterval(() => {
    if (engaged) {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000);
      trackEvent("engaged_time", {
        event_category: "Engagement",
        value: timeOnPage,
      });
    }
  }, 30000); // Every 30 seconds
}

// ============= TRACK FORM INTERACTIONS =============
function initFormTracking() {
  document.querySelectorAll("form").forEach((form) => {
    // Track form start
    form.addEventListener(
      "focus",
      (e) => {
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
          trackEvent("form_start", {
            event_category: "Form",
            event_label: form.id || form.className,
            form_name: form.id,
          });
        }
      },
      { once: true, capture: true }
    );

    // Track form submission
    form.addEventListener("submit", (e) => {
      trackEvent("form_submit", {
        event_category: "Form",
        event_label: form.id || form.className,
        form_name: form.id,
      });
    });
  });
}

// ============= TRACK OUTBOUND LINKS =============
function initOutboundTracking() {
  document.querySelectorAll('a[href^="http"]').forEach((link) => {
    if (!link.href.includes(window.location.hostname)) {
      link.addEventListener("click", () => {
        trackEvent("outbound_link", {
          event_category: "Outbound Link",
          event_label: link.href,
          link_url: link.href,
          link_domain: new URL(link.href).hostname,
        });
      });
    }
  });
}

// ============= TRACK VIDEO INTERACTIONS =============
function initVideoTracking() {
  document.querySelectorAll("video").forEach((video) => {
    video.addEventListener("play", () => {
      trackEvent("video_play", {
        event_category: "Video",
        event_label: video.src || video.currentSrc,
      });
    });

    video.addEventListener("pause", () => {
      trackEvent("video_pause", {
        event_category: "Video",
        event_label: video.src || video.currentSrc,
        video_percent: Math.round((video.currentTime / video.duration) * 100),
      });
    });

    video.addEventListener("ended", () => {
      trackEvent("video_complete", {
        event_category: "Video",
        event_label: video.src || video.currentSrc,
      });
    });
  });
}

// ============= TRACK ERRORS =============
function initErrorTracking() {
  window.addEventListener("error", (e) => {
    trackEvent("javascript_error", {
      event_category: "Error",
      event_label: e.message,
      error_message: e.message,
      error_file: e.filename,
      error_line: e.lineno,
    });
  });
}

// ============= COOKIE CONSENT =============
function getCookieConsent() {
  return localStorage.getItem("cookieConsent") === "true";
}

function setCookieConsent(consent) {
  localStorage.setItem("cookieConsent", consent.toString());

  if (consent) {
    initGoogleAnalytics();
  }
}

function showCookieConsent() {
  // Create cookie banner
  const banner = document.createElement("div");
  banner.className = "cookie-consent";
  banner.innerHTML = `
    <div class="cookie-consent__content">
      <p>We use cookies to improve your experience and analyze site traffic. By continuing, you agree to our use of cookies.</p>
      <div class="cookie-consent__buttons">
        <button class="btn btn--primary" id="acceptCookies">Accept</button>
        <button class="btn btn--outline" id="declineCookies">Decline</button>
      </div>
    </div>
  `;

  document.body.appendChild(banner);

  // Add styles
  const style = document.createElement("style");
  style.textContent = `
    .cookie-consent {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--gray-900);
      color: var(--white);
      padding: 1.5rem;
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.2);
      z-index: 9999;
      animation: slideUp 0.5s ease;
    }
    
    @keyframes slideUp {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }
    
    .cookie-consent__content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
    }
    
    .cookie-consent__content p {
      margin: 0;
      flex: 1;
    }
    
    .cookie-consent__buttons {
      display: flex;
      gap: 1rem;
    }
    
    @media (max-width: 768px) {
      .cookie-consent__content {
        flex-direction: column;
        text-align: center;
      }
      
      .cookie-consent__buttons {
        width: 100%;
        flex-direction: column;
      }
      
      .cookie-consent__buttons .btn {
        width: 100%;
      }
    }
  `;
  document.head.appendChild(style);

  // Handle consent
  document.getElementById("acceptCookies").addEventListener("click", () => {
    setCookieConsent(true);
    banner.remove();
  });

  document.getElementById("declineCookies").addEventListener("click", () => {
    setCookieConsent(false);
    banner.remove();
  });
}

// ============= UTILITY FUNCTIONS =============
function getButtonLocation(button) {
  const section = button.closest("section");
  return section ? section.id || section.className : "unknown";
}

// ============= INITIALIZE ALL TRACKING =============
function initAllTracking() {
  initButtonTracking();
  initNavigationTracking();
  initScrollTracking();
  initTimeTracking();
  initFormTracking();
  initOutboundTracking();
  initVideoTracking();
  initErrorTracking();

  console.log("Analytics: All tracking initialized");
}

// ============= INITIALIZATION =============
document.addEventListener("DOMContentLoaded", () => {
  // Check for consent
  if (analyticsConfig.cookieConsent) {
    if (getCookieConsent()) {
      initGoogleAnalytics();
      initAllTracking();
    } else if (localStorage.getItem("cookieConsent") === null) {
      showCookieConsent();
    }
  } else {
    initGoogleAnalytics();
    initAllTracking();
  }
});

// ============= EXPORT FUNCTIONS =============
window.MonieKingAnalytics = {
  trackEvent,
  trackPageView,
  setCookieConsent,
  config: analyticsConfig,
};
