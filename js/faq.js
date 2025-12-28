/* ============================================
   MONIEKING - FAQ JS
   FAQ Accordion & Search Functionality
   ============================================ */

// ============= INITIALIZATION =============
document.addEventListener("DOMContentLoaded", () => {
  initAccordion();
  initSearch();
  initKeyboardNavigation();
});

// ============= ACCORDION FUNCTIONALITY =============
function initAccordion() {
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      toggleAccordion(question);
    });
  });

  // Auto-expand first item (optional)
  // if (faqQuestions.length > 0) {
  //   toggleAccordion(faqQuestions[0], true);
  // }
}

// ============= TOGGLE ACCORDION =============
function toggleAccordion(questionButton, forceOpen = false) {
  const faqItem = questionButton.closest(".faq-item");
  const isActive = faqItem.classList.contains("active");

  // Close all other items (optional - remove if you want multiple open)
  const allItems = document.querySelectorAll(".faq-item");
  allItems.forEach((item) => {
    if (item !== faqItem) {
      item.classList.remove("active");
      const btn = item.querySelector(".faq-question");
      btn.setAttribute("aria-expanded", "false");
    }
  });

  // Toggle current item
  if (forceOpen || !isActive) {
    faqItem.classList.add("active");
    questionButton.setAttribute("aria-expanded", "true");

    // Scroll into view smoothly
    setTimeout(() => {
      faqItem.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 100);
  } else {
    faqItem.classList.remove("active");
    questionButton.setAttribute("aria-expanded", "false");
  }
}

// ============= SEARCH FUNCTIONALITY =============
function initSearch() {
  const searchInput = document.getElementById("faqSearch");
  if (!searchInput) return;

  let searchTimeout;

  searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
      const searchTerm = e.target.value.toLowerCase().trim();
      filterFAQs(searchTerm);
    }, 300);
  });

  // Clear search on escape
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      searchInput.value = "";
      filterFAQs("");
    }
  });
}

// ============= FILTER FAQs =============
function filterFAQs(searchTerm) {
  const faqItems = document.querySelectorAll(".faq-item");
  const categories = document.querySelectorAll(".faq-category");
  let visibleCount = 0;

  if (!searchTerm) {
    // Show all items
    faqItems.forEach((item) => {
      item.style.display = "";
      item.classList.remove("active");
    });

    categories.forEach((category) => {
      category.style.display = "";
    });

    removeNoResultsMessage();
    return;
  }

  // Filter items
  faqItems.forEach((item) => {
    const question = item
      .querySelector(".faq-question__text")
      .textContent.toLowerCase();
    const answer = item
      .querySelector(".faq-answer p")
      .textContent.toLowerCase();

    if (question.includes(searchTerm) || answer.includes(searchTerm)) {
      item.style.display = "";
      visibleCount++;

      // Highlight search term
      highlightText(item, searchTerm);
    } else {
      item.style.display = "none";
      item.classList.remove("active");
    }
  });

  // Hide categories with no visible items
  categories.forEach((category) => {
    const visibleItems = category.querySelectorAll('.faq-item[style=""]');
    if (visibleItems.length === 0) {
      category.style.display = "none";
    } else {
      category.style.display = "";
    }
  });

  // Show no results message if needed
  if (visibleCount === 0) {
    showNoResultsMessage(searchTerm);
  } else {
    removeNoResultsMessage();
  }
}

// ============= HIGHLIGHT SEARCH TERM =============
function highlightText(item, searchTerm) {
  const questionText = item.querySelector(".faq-question__text");
  const originalText =
    questionText.dataset.originalText || questionText.textContent;

  if (!questionText.dataset.originalText) {
    questionText.dataset.originalText = originalText;
  }

  const regex = new RegExp(`(${searchTerm})`, "gi");
  const highlightedText = originalText.replace(regex, "<mark>$1</mark>");
  questionText.innerHTML = highlightedText;
}

// ============= SHOW NO RESULTS MESSAGE =============
function showNoResultsMessage(searchTerm) {
  removeNoResultsMessage();

  const message = document.createElement("div");
  message.className = "faq-no-results visible";
  message.innerHTML = `
    <div class="faq-no-results__icon">🔍</div>
    <h3 class="faq-no-results__title">No results found</h3>
    <p class="faq-no-results__text">
      We couldn't find any questions matching "${searchTerm}". 
      Try different keywords or <a href="contact.html">contact us</a> directly.
    </p>
  `;

  const faqContent = document.querySelector(".faq-content .container");
  faqContent.appendChild(message);
}

// ============= REMOVE NO RESULTS MESSAGE =============
function removeNoResultsMessage() {
  const existing = document.querySelector(".faq-no-results");
  if (existing) {
    existing.remove();
  }

  // Remove highlights
  document.querySelectorAll(".faq-question__text").forEach((text) => {
    if (text.dataset.originalText) {
      text.textContent = text.dataset.originalText;
    }
  });
}

// ============= KEYBOARD NAVIGATION =============
function initKeyboardNavigation() {
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach((question, index) => {
    question.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          const nextQuestion = faqQuestions[index + 1];
          if (nextQuestion) nextQuestion.focus();
          break;

        case "ArrowUp":
          e.preventDefault();
          const prevQuestion = faqQuestions[index - 1];
          if (prevQuestion) prevQuestion.focus();
          break;

        case "Home":
          e.preventDefault();
          faqQuestions[0].focus();
          break;

        case "End":
          e.preventDefault();
          faqQuestions[faqQuestions.length - 1].focus();
          break;

        case "Enter":
        case " ":
          e.preventDefault();
          toggleAccordion(question);
          break;
      }
    });
  });
}

// ============= EXPAND ALL / COLLAPSE ALL =============
function expandAll() {
  const faqItems = document.querySelectorAll(".faq-item");
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqItems.forEach((item) => item.classList.add("active"));
  faqQuestions.forEach((btn) => btn.setAttribute("aria-expanded", "true"));
}

function collapseAll() {
  const faqItems = document.querySelectorAll(".faq-item");
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqItems.forEach((item) => item.classList.remove("active"));
  faqQuestions.forEach((btn) => btn.setAttribute("aria-expanded", "false"));
}

// ============= SMOOTH SCROLL TO FAQ =============
function scrollToFAQ(faqId) {
  const faq = document.getElementById(faqId);
  if (!faq) return;

  const question = faq.querySelector(".faq-question");
  if (question) {
    toggleAccordion(question, true);

    setTimeout(() => {
      faq.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  }
}

// ============= URL HASH NAVIGATION =============
function initHashNavigation() {
  // Check if there's a hash in URL
  const hash = window.location.hash;
  if (hash) {
    const faqId = hash.substring(1);
    setTimeout(() => {
      scrollToFAQ(faqId);
    }, 500);
  }

  // Listen for hash changes
  window.addEventListener("hashchange", () => {
    const faqId = window.location.hash.substring(1);
    scrollToFAQ(faqId);
  });
}

// Initialize hash navigation
document.addEventListener("DOMContentLoaded", initHashNavigation);

// ============= ANALYTICS TRACKING =============
function trackFAQInteraction(action, label) {
  if (typeof window.MonieKingAnalytics !== "undefined") {
    window.MonieKingAnalytics.trackEvent("faq_interaction", {
      event_category: "FAQ",
      event_label: label,
      action: action,
    });
  }
}

// Track FAQ opens
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".faq-question").forEach((question) => {
    question.addEventListener("click", () => {
      const questionText = question.querySelector(
        ".faq-question__text"
      ).textContent;
      trackFAQInteraction("open", questionText);
    });
  });

  // Track searches
  const searchInput = document.getElementById("faqSearch");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      if (e.target.value.length > 2) {
        trackFAQInteraction("search", e.target.value);
      }
    });
  }
});

// ============= PRINT FAQ =============
function printFAQ() {
  // Expand all items before printing
  expandAll();

  setTimeout(() => {
    window.print();
  }, 300);
}

// ============= EXPORT FUNCTIONS =============
window.MonieKingFAQ = {
  expandAll,
  collapseAll,
  scrollToFAQ,
  filterFAQs,
  printFAQ,
};
