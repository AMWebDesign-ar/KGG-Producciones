const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const filterButtons = document.querySelectorAll("[data-filter]");
const portfolioItems = document.querySelectorAll("[data-category]");
const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");

function updateHeader() {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 20);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !nav.classList.contains("open")) return;

    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.focus();
  });
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const portfolioMediaTiles = document.querySelectorAll(".portfolio-media-tile");
portfolioMediaTiles.forEach((tile) => {
  const iframe = tile.querySelector("iframe");
  if (!iframe) return;

  iframe.addEventListener("load", () => {
    tile.classList.add("is-iframe-ready");
  }, { once: true });

  iframe.addEventListener("error", () => {
    tile.classList.add("is-iframe-ready");
  }, { once: true });
});

if (prefersReducedMotion) {
  document.querySelectorAll(".reveal").forEach((element) => {
    element.classList.add("visible");
  });
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
  });
}

filterButtons.forEach((button) => {
  button.setAttribute("aria-pressed", button.classList.contains("active") ? "true" : "false");

  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-pressed", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");

    portfolioItems.forEach((item) => {
      const shouldShow = filter === "all" || item.dataset.category === filter;
      item.classList.toggle("is-dimmed", !shouldShow);
      item.hidden = !shouldShow;
      item.setAttribute("aria-hidden", shouldShow ? "false" : "true");
    });
  });
});

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector("button");
    const formData = new FormData(contactForm);
    const phone = contactForm.dataset.whatsappPhone;
    const message = [
      "Hola KGG Producciones, quiero pedir una propuesta.",
      `Nombre o marca: ${formData.get("nombre")}`,
      `Email: ${formData.get("email")}`,
      `Servicio: ${formData.get("servicio")}`,
      `Proyecto: ${formData.get("mensaje")}`
    ].join("\n");
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    submitButton.textContent = "Abrir WhatsApp";
    formStatus.textContent = "Se abrió WhatsApp con tu consulta lista para enviar.";
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    contactForm.reset();
  });
}
