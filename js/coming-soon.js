/* ============================================
   MONIEKING - COMING SOON JS
   Newsletter & Coming Soon Functionality
   ============================================ */

// ============= INITIALIZATION =============
document.addEventListener("DOMContentLoaded", () => {
  initNewsletterForm();
  initAnimations();
});

// ============= NEWSLETTER FORM =============
function initNewsletterForm() {
  const form = document.getElementById("newsletterForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput = form.querySelector(".newsletter-input");
    const email = emailInput.value.trim();

    // Validate email
    if (!validateEmail(email)) {
      showMessage("Please enter a valid email address", "error");
      return;
    }

    // Disable form
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="icon">⏳</span> Subscribing...';

    // Simulate API call (replace with actual backend)
    try {
      await subscribeToNewsletter(email);

      // Success
      showMessage(
        "🎉 Success! We'll notify you when the blog launches.",
        "success"
      );
      form.reset();

      // Track subscription
      if (typeof window.MonieKingAnalytics !== "undefined") {
        window.MonieKingAnalytics.trackEvent("newsletter_subscribe", {
          event_category: "Newsletter",
          event_label: "Blog Coming Soon",
        });
      }
    } catch (error) {
      showMessage("Something went wrong. Please try again.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

// ============= SUBSCRIBE TO NEWSLETTER =============
async function subscribeToNewsletter(email) {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Store in localStorage for now
      const subscribers = JSON.parse(
        localStorage.getItem("newsletter_subscribers") || "[]"
      );

      if (subscribers.includes(email)) {
        reject(new Error("Email already subscribed"));
        return;
      }

      subscribers.push(email);
      localStorage.setItem(
        "newsletter_subscribers",
        JSON.stringify(subscribers)
      );

      resolve({ success: true });
    }, 1500);
  });
}

// ============= SHOW MESSAGE =============
function showMessage(message, type = "success") {
  // Remove existing message
  const existing = document.querySelector(".newsletter-message");
  if (existing) existing.remove();

  // Create message element
  const messageEl = document.createElement("div");
  messageEl.className = `newsletter-message newsletter-message--${type}`;
  messageEl.textContent = message;

  // Add styles
  messageEl.style.cssText = `
    margin-top: 1rem;
    padding: 1rem 1.5rem;
    border-radius: 0.75rem;
    font-weight: 500;
    text-align: center;
    animation: slideInUp 0.5s ease;
    ${
      type === "success"
        ? "background-color: rgba(16, 185, 129, 0.1); border: 2px solid #10b981; color: #059669;"
        : "background-color: rgba(239, 68, 68, 0.1); border: 2px solid #ef4444; color: #dc2626;"
    }
  `;

  // Insert after form
  const form = document.getElementById("newsletterForm");
  form.parentNode.insertBefore(messageEl, form.nextSibling);

  // Auto remove after 5 seconds
  setTimeout(() => {
    messageEl.style.opacity = "0";
    messageEl.style.transform = "translateY(-10px)";
    messageEl.style.transition = "all 0.3s ease";
    setTimeout(() => messageEl.remove(), 300);
  }, 5000);
}

// ============= VALIDATE EMAIL =============
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

// ============= ANIMATIONS =============
function initAnimations() {
  // Rocket launch on scroll
  const rocket = document.querySelector(".rocket");
  if (!rocket) return;

  let scrollTimeout;
  window.addEventListener(
    "scroll",
    () => {
      clearTimeout(scrollTimeout);
      rocket.style.animationPlayState = "paused";

      scrollTimeout = setTimeout(() => {
        rocket.style.animationPlayState = "running";
      }, 200);
    },
    { passive: true }
  );

  // Feature cards stagger animation
  const features = document.querySelectorAll(".feature-preview");
  features.forEach((feature, index) => {
    feature.style.animationDelay = `${index * 0.2}s`;
  });
}

// ============= COUNTDOWN TIMER (OPTIONAL) =============
function initCountdown(targetDate) {
  const countdownEl = document.getElementById("countdown");
  if (!countdownEl) return;

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      countdownEl.innerHTML = "🎉 Blog is Live!";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdownEl.innerHTML = `
      <div class="countdown-item">
        <span class="countdown-value">${days}</span>
        <span class="countdown-label">Days</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-value">${hours}</span>
        <span class="countdown-label">Hours</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-value">${minutes}</span>
        <span class="countdown-label">Minutes</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-value">${seconds}</span>
        <span class="countdown-label">Seconds</span>
      </div>
    `;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// Example: Launch countdown for March 1, 2025
// const launchDate = new Date('2025-03-01T00:00:00').getTime();
// initCountdown(launchDate);

// ============= SOCIAL SHARE =============
function shareOnSocial(platform) {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent("MonieKing Blog Coming Soon! 🚀");

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    whatsapp: `https://wa.me/?text=${text}%20${url}`,
  };

  if (shareUrls[platform]) {
    window.open(shareUrls[platform], "_blank", "width=600,height=400");
  }
}

// ============= EXPORT FUNCTIONS =============
window.MonieKingComingSoon = {
  subscribeToNewsletter,
  shareOnSocial,
  initCountdown,
};
