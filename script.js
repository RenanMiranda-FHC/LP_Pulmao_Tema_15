(function () {
  const track = document.getElementById("jumpTrack");
  if (!track) return;

  const pills = Array.from(track.querySelectorAll(".jump__pill"));

  function clearActive() {
    pills.forEach(p => p.classList.remove("is-active"));
  }

  pills.forEach(pill => {
    pill.addEventListener("click", event => {
      const href = pill.getAttribute("href");
      if (href && href.startsWith("#")) {
        const target = document.querySelector(href);
        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          history.pushState(null, "", href);
        }
      }
      clearActive();
      pill.classList.add("is-active");
    });
  });

  
  window.addEventListener("hashchange", () => {
    clearActive();
  });

  
  clearActive();
})();

(function () {
  const img = document.querySelector(".s7-iniciais__image");
  const modal = document.getElementById("amostraModal");
  if (!img || !modal) return;

  const closeButtons = modal.querySelectorAll("[data-modal-close]");
  const modalImg = modal.querySelector(".image-modal__img");
  let scale = 1;
  let startScale = 1;
  let startDist = 0;
  let isPanning = false;
  let startX = 0;
  let startY = 0;
  let translateX = 0;
  let translateY = 0;

  function openModal() {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    scale = 1;
    translateX = 0;
    translateY = 0;
    if (modalImg) {
      modalImg.style.transform = "translate(0px, 0px) scale(1)";
    }
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  }

  function setTransform() {
    if (!modalImg) return;
    modalImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  }

  function getDistance(t1, t2) {
    const dx = t2.clientX - t1.clientX;
    const dy = t2.clientY - t1.clientY;
    return Math.hypot(dx, dy);
  }

  img.addEventListener("click", () => {
    if (window.matchMedia("(max-width: 768px)").matches) {
      openModal();
    }
  });

  closeButtons.forEach(btn => btn.addEventListener("click", closeModal));
  window.addEventListener("keydown", event => {
    if (event.key === "Escape") closeModal();
  });

  if (modalImg) {
    modalImg.addEventListener("touchstart", event => {
      if (!modal.classList.contains("is-open")) return;
      if (event.touches.length === 2) {
        startDist = getDistance(event.touches[0], event.touches[1]);
        startScale = scale;
      } else if (event.touches.length === 1) {
        isPanning = true;
        startX = event.touches[0].clientX - translateX;
        startY = event.touches[0].clientY - translateY;
      }
    }, { passive: true });

    modalImg.addEventListener("touchmove", event => {
      if (!modal.classList.contains("is-open")) return;
      if (event.touches.length === 2) {
        event.preventDefault();
        const dist = getDistance(event.touches[0], event.touches[1]);
        scale = Math.min(3, Math.max(1, (dist / startDist) * startScale));
        setTransform();
      } else if (event.touches.length === 1 && isPanning) {
        event.preventDefault();
        const nextX = event.touches[0].clientX - startX;
        const nextY = event.touches[0].clientY - startY;
        if (scale > 1) {
          translateX = nextX;
          translateY = nextY;
        } else {
          translateY = nextY;
        }
        setTransform();
      }
    }, { passive: false });

    modalImg.addEventListener("touchend", event => {
      if (!modal.classList.contains("is-open")) return;
      if (event.touches.length === 0) {
        if (scale === 1 && Math.abs(translateY) > 80) {
          closeModal();
        } else {
          translateX = 0;
          translateY = 0;
          setTransform();
        }
        isPanning = false;
      }
    });
  }
})();
