/* =========================================================
   Zeneriio — interactions & animations
   Only edit the two details inside CONFIG below.
   ========================================================= */

const CONFIG = {
  // Add your WhatsApp number with country code, digits only.
  // Example: "919876543210"
  businessWhatsApp: "919352501032",

  // Add your full Instagram profile link.
  // Example: "https://www.instagram.com/zineriio"
  instagramUrl: "https://www.instagram.com/zineriio",
};

/* ---------- Small helpers ---------- */

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function getWhatsAppNumber() {
  const number = CONFIG.businessWhatsApp.replace(/\D/g, "");
  if (number.length < 10 || number.length > 15) {
    return "";
  }
  return number;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(function () {
    toast.classList.remove("is-visible");
  }, 3400);
}

/* ---------- Sticky header ---------- */

const header = document.getElementById("siteHeader");

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

/* ---------- Mobile menu ---------- */

const menuToggle = document.getElementById("menuToggle");
const primaryNav = document.getElementById("primaryNav");

function setMenu(open) {
  document.body.classList.toggle("menu-open", open);
  menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", function () {
    const isOpen = document.body.classList.contains("menu-open");
    setMenu(!isOpen);
  });

  primaryNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setMenu(false);
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && document.body.classList.contains("menu-open")) {
      setMenu(false);
      menuToggle.focus();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 1040) {
      setMenu(false);
    }
  });
}

/* ---------- Reveal on scroll ---------- */

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  revealElements.forEach(function (element) {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach(function (element) {
    element.classList.add("is-visible");
  });
}

/* ---------- Active navigation link ---------- */

const navLinks = document.querySelectorAll(".nav-link");
const spySections = ["home", "magazines", "how", "reviews", "contact"]
  .map(function (id) {
    return document.getElementById(id);
  })
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const spyObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        navLinks.forEach(function (link) {
          link.classList.toggle(
            "is-active",
            link.getAttribute("href") === "#" + entry.target.id
          );
        });
      });
    },
    { rootMargin: "-38% 0px -54% 0px", threshold: 0 }
  );

  spySections.forEach(function (section) {
    spyObserver.observe(section);
  });
}

/* ---------- Edition buttons fill the order form ---------- */

function setFieldError(input, message) {
  const field = input.closest(".field");
  const error = document.getElementById(input.id + "Error");

  if (field) field.classList.add("has-error");
  input.setAttribute("aria-invalid", "true");
  if (error) error.textContent = message;
}

function clearFieldError(input) {
  const field = input.closest(".field");
  const error = document.getElementById(input.id + "Error");

  if (field) field.classList.remove("has-error");
  input.removeAttribute("aria-invalid");
  if (error) error.textContent = "";
}

document.querySelectorAll(".order-edition").forEach(function (button) {
  button.addEventListener("click", function () {
    const occasionField = document.getElementById("occasion");
    const titleField = document.getElementById("title");

    if (occasionField && button.dataset.occasion) {
      occasionField.value = button.dataset.occasion;
      clearFieldError(occasionField);
    }

    if (titleField && button.dataset.title) {
      titleField.value = button.dataset.title;
      clearFieldError(titleField);
    }

    const target =
      window.innerWidth <= 720
        ? document.querySelector(".form-card")
        : document.getElementById("order");

    if (target) {
      target.scrollIntoView({
        behavior: reducedMotion.matches ? "auto" : "smooth",
        block: "start",
      });
    }

    showToast((button.dataset.title || "Your edition") + " added — tell us a little about your story.");
  });
});

/* ---------- WhatsApp & Instagram links ---------- */

const whatsappNumber = getWhatsAppNumber();

document.querySelectorAll("[data-whatsapp]").forEach(function (link) {
  if (!whatsappNumber) return;

  link.href = "https://wa.me/" + whatsappNumber;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

document.querySelectorAll("[data-instagram]").forEach(function (link) {
  const instagramUrl = CONFIG.instagramUrl.trim();

  if (instagramUrl && /^https?:\/\//i.test(instagramUrl)) {
    link.href = instagramUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    return;
  }

  link.setAttribute("aria-disabled", "true");
  link.addEventListener("click", function (event) {
    event.preventDefault();
    showToast("Instagram link coming soon.");
  });
});

/* ---------- Order form ---------- */

const orderForm = document.getElementById("orderForm");

if (orderForm) {
  const nameInput = document.getElementById("name");
  const whatsappInput = document.getElementById("whatsapp");
  const occasionInput = document.getElementById("occasion");
  const titleInput = document.getElementById("title");
  const cityInput = document.getElementById("city");
  const messageInput = document.getElementById("message");
  const formStatus = document.getElementById("formStatus");

  const formFields = [
    nameInput,
    whatsappInput,
    occasionInput,
    titleInput,
    cityInput,
    messageInput,
  ];

  formFields.forEach(function (input) {
    if (!input) return;

    const eventName = input.tagName === "SELECT" ? "change" : "input";

    input.addEventListener(eventName, function () {
      clearFieldError(input);
      if (formStatus.textContent) {
        formStatus.textContent = "";
        formStatus.className = "form-status";
      }
    });
  });

  orderForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const values = {
      name: nameInput.value.trim(),
      whatsapp: whatsappInput.value.trim(),
      occasion: occasionInput.value,
      title: titleInput.value.trim(),
      city: cityInput.value.trim(),
      message: messageInput.value.trim(),
    };

    const phoneDigits = values.whatsapp.replace(/\D/g, "");
    const errors = [];

    if (values.name.length < 2) {
      errors.push([nameInput, "Please enter your name."]);
    }

    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      errors.push([whatsappInput, "Enter a valid WhatsApp number (10–15 digits)."]);
    }

    if (!values.occasion) {
      errors.push([occasionInput, "Please choose a magazine type."]);
    }

    if (values.title.length < 2) {
      errors.push([titleInput, "Please add a magazine title."]);
    }

    if (values.city.length < 2) {
      errors.push([cityInput, "Please add your delivery city."]);
    }

    formFields.forEach(clearFieldError);

    if (errors.length > 0) {
      errors.forEach(function (error) {
        setFieldError(error[0], error[1]);
      });

      errors[0][0].focus();
      formStatus.textContent = "Please check the highlighted fields.";
      formStatus.className = "form-status is-error";
      return;
    }

    if (!whatsappNumber) {
      formStatus.textContent =
        "WhatsApp ordering is not connected yet. Add the business number at the top of script.js, then try again.";
      formStatus.className = "form-status is-error";
      return;
    }

    const messageLines = [
      "New Zeneriio magazine inquiry",
      "",
      "Name: " + values.name,
      "WhatsApp: " + values.whatsapp,
      "Gifting: " + values.occasion,
      "Magazine title: " + values.title,
      "Delivery city: " + values.city,
    ];

    if (values.message) {
      messageLines.push("", "Note: " + values.message);
    }

    messageLines.push("", "Sent from the Zeneriio website.");

    const whatsappUrl =
      "https://wa.me/" +
      whatsappNumber +
      "?text=" +
      encodeURIComponent(messageLines.join("\n"));

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    formStatus.textContent = "";
    formStatus.className = "form-status is-success";

    const fallbackLink = document.createElement("a");
    fallbackLink.href = whatsappUrl;
    fallbackLink.target = "_blank";
    fallbackLink.rel = "noopener noreferrer";
    fallbackLink.textContent = "Open WhatsApp to send your inquiry";

    formStatus.append(
      document.createTextNode("Your inquiry is ready. If WhatsApp did not open, "),
      fallbackLink,
      document.createTextNode(".")
    );

    showToast("Your inquiry is ready in WhatsApp.");
  });
}

/* ---------- Image fallback ---------- */

document.querySelectorAll("img").forEach(function (image) {
  function markMissing() {
    if (image.parentElement) {
      image.parentElement.classList.add("img-fallback");
    }
    image.style.opacity = "0";
    console.warn("Zeneriio: missing image — " + image.getAttribute("src"));
  }

  image.addEventListener("error", markMissing);

  if (image.complete && image.naturalWidth === 0) {
    markMissing();
  }
});

/* ---------- Footer year ---------- */

const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}
