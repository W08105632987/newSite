/* ============================================
   MONIEKING - CONTACT FORM JS (UPDATED)
   Contact Form Submission Handler with Backend Integration
   ============================================ */

// ============= INITIALIZATION =============
document.addEventListener("DOMContentLoaded", () => {
  initContactForm();
});

// ============= INITIALIZE CONTACT FORM =============
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", handleFormSubmit);

  // Real-time validation
  const inputs = form.querySelectorAll(
    ".form-input, .form-select, .form-textarea",
  );
  inputs.forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => clearFieldError(input));
  });
}

// ============= HANDLE FORM SUBMISSION =============
async function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const submitBtn = form.querySelector(".form-submit");
  const formMessage = document.getElementById("formMessage");

  // Validate all fields
  if (!validateForm(form)) {
    showMessage("Please fill in all required fields correctly.", "error");
    return;
  }

  // Get form data
  const formData = {
    fullName: form.fullName.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    subject: form.subject.value,
    message: form.message.value.trim(),
    timestamp: new Date().toISOString(),
  };

  // Disable submit button
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="icon">⏳</span> Sending...';

  try {
    // Send to Netlify Function
    const response = await fetch("/.netlify/functions/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      // Success
      showMessage(
        "✅ Thank you! Your message has been sent successfully. We'll get back to you within 24 hours. Please check your email for confirmation.",
        "success",
      );
      form.reset();

      // Track form submission
      if (typeof window.MonieKingAnalytics !== "undefined") {
        window.MonieKingAnalytics.trackEvent("contact_form_submit", {
          event_category: "Form",
          event_label: formData.subject,
        });
      }
    } else {
      throw new Error(result.error || "Failed to send message");
    }
  } catch (error) {
    showMessage(
      "❌ Oops! Something went wrong. Please try again or contact us directly via phone or WhatsApp at +234 703 186 7883.",
      "error",
    );
    console.error("Form submission error:", error);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML =
      '<span class="submit-text">Send Message</span><span class="icon">→</span>';
  }
}

// ============= VALIDATE FORM =============
function validateForm(form) {
  let isValid = true;

  const fullName = form.fullName;
  const email = form.email;
  const phone = form.phone;
  const subject = form.subject;
  const message = form.message;

  if (!validateField(fullName)) isValid = false;
  if (!validateField(email)) isValid = false;
  if (!validateField(phone)) isValid = false;
  if (!validateField(subject)) isValid = false;
  if (!validateField(message)) isValid = false;

  return isValid;
}

// ============= VALIDATE FIELD =============
function validateField(field) {
  const value = field.value.trim();
  let isValid = true;
  let errorMessage = "";

  // Check if required field is empty
  if (field.hasAttribute("required") && !value) {
    isValid = false;
    errorMessage = "This field is required";
  }

  // Validate email
  if (field.type === "email" && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      errorMessage = "Please enter a valid email address";
    }
  }

  // Validate phone
  if (field.type === "tel" && value) {
    const phoneRegex =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(value.replace(/\s/g, ""))) {
      isValid = false;
      errorMessage = "Please enter a valid phone number";
    }
  }

  // Validate name (minimum 2 characters)
  if (field.name === "fullName" && value && value.length < 2) {
    isValid = false;
    errorMessage = "Name must be at least 2 characters";
  }

  // Validate message (minimum 10 characters)
  if (field.name === "message" && value && value.length < 10) {
    isValid = false;
    errorMessage = "Message must be at least 10 characters";
  }

  // Show/hide error
  if (!isValid) {
    showFieldError(field, errorMessage);
  } else {
    clearFieldError(field);
  }

  return isValid;
}

// ============= SHOW FIELD ERROR =============
function showFieldError(field, message) {
  clearFieldError(field);

  field.classList.add("error");
  field.style.borderColor = "#ef4444";

  const errorDiv = document.createElement("div");
  errorDiv.className = "field-error";
  errorDiv.textContent = message;
  errorDiv.style.cssText = `
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    animation: slideInUp 0.3s ease;
  `;

  field.parentElement.appendChild(errorDiv);
}

// ============= CLEAR FIELD ERROR =============
function clearFieldError(field) {
  field.classList.remove("error");
  field.style.borderColor = "";

  const existingError = field.parentElement.querySelector(".field-error");
  if (existingError) {
    existingError.remove();
  }
}

// ============= SHOW MESSAGE =============
function showMessage(message, type) {
  const formMessage = document.getElementById("formMessage");

  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
  formMessage.style.display = "block";

  // Scroll to message
  formMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });

  // Auto hide after 10 seconds
  setTimeout(() => {
    formMessage.style.opacity = "0";
    setTimeout(() => {
      formMessage.style.display = "none";
      formMessage.style.opacity = "1";
    }, 300);
  }, 10000);
}

// ============= EXPORT FUNCTIONS =============
window.MonieKingContact = {
  validateForm,
  showMessage,
};
