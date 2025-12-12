// ================== CONFIGURACIÓN BÁSICA ==================

// Fecha objetivo para la cuenta regresiva (ajusta hora si quieres)
const targetDate = new Date("2026-02-14T20:00:00"); // 8:00 pm

document.addEventListener("DOMContentLoaded", () => {
  setupCountdown();
  setupScrollButton();
  setupMusicToggle();
  setupVideoUnmute();
  setupRevealOnScroll();
  setupWhatsappShare();
  setupSparkles(); // ⭐ nuevo
});

// ================== CUENTA REGRESIVA ==================
function setupCountdown() {
  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minsEl = document.getElementById("cd-mins");
  const secsEl = document.getElementById("cd-secs");

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  const update = () => {
    const now = new Date().getTime();
    const diff = targetDate.getTime() - now;

    if (diff <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minsEl.textContent = "00";
      secsEl.textContent = "00";
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds / (60 * 60)) % 24);
    const mins = Math.floor((totalSeconds / 60) % 60);
    const secs = totalSeconds % 60;

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minsEl.textContent = String(mins).padStart(2, "0");
    secsEl.textContent = String(secs).padStart(2, "0");
  };

  update();
  setInterval(update, 1000);
}

// ================== BOTÓN SCROLL ABAJO ==================
function setupScrollButton() {
  const btn = document.getElementById("scrollDown");
  const nextSection = document.getElementById("countdown");
  if (!btn || !nextSection) return;

  btn.addEventListener("click", () => {
    nextSection.scrollIntoView({ behavior: "smooth" });
  });
}

// ================== MÚSICA DE FONDO (MP3) ==================
function setupMusicToggle() {
  const musicBtn = document.getElementById("playMusicBtn");
  const audio = document.getElementById("bgMusic");
  if (!musicBtn || !audio) return;

  let isPlaying = false;

  // Función común para reproducir
  const playMusic = async () => {
    try {
      await audio.play();
      isPlaying = true;
      musicBtn.classList.add("playing");
    } catch (err) {
      console.warn("No se pudo reproducir la música:", err);
    }
  };

  // ✅ Botón: prender / apagar música
  musicBtn.addEventListener("click", async () => {
    try {
      if (!isPlaying) {
        await playMusic();
      } else {
        audio.pause();
        isPlaying = false;
        musicBtn.classList.remove("playing");
      }
    } catch (err) {
      console.warn("No se pudo reproducir la música:", err);
    }
  });

  // ✅ Autoplay: primera interacción en la página
  const startOnce = async () => {
    if (isPlaying) return;

    try {
      await playMusic();
    } finally {
      // Quitamos los listeners para que solo pase una vez
      document.removeEventListener("click", startOnce);
      document.removeEventListener("touchstart", startOnce);
      document.removeEventListener("scroll", startOnce);
    }
  };

  document.addEventListener("click", startOnce);
  document.addEventListener("touchstart", startOnce, { passive: true });
  document.addEventListener("scroll", startOnce);
}

// ================== VIDEO: ACTIVAR SONIDO AL TOCAR ==================
function setupVideoUnmute() {
  const video = document.getElementById("introVideo");
  const hint = document.getElementById("tapToUnmute");
  if (!video) return;

  let soundEnabled = false;

  const enableSoundOnce = () => {
    if (soundEnabled) return;
    soundEnabled = true;

    video.muted = false;
    video.play().catch(() => {
      // Ignorar error de autoplay si se diera
    });

    if (hint) {
      hint.style.opacity = "0";
      hint.style.transform = "translateY(10px)";
      setTimeout(() => {
        hint.style.display = "none";
      }, 300);
    }
  };

  video.addEventListener("click", enableSoundOnce);
  video.addEventListener("touchstart", enableSoundOnce, { passive: true });
}

// ================== ANIMACIONES EN SCROLL (REVEAL) ==================
function setupRevealOnScroll() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          // Una vez visible, ya no se quita
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  revealEls.forEach((el) => observer.observe(el));
}

// ================== COMPARTIR POR WHATSAPP ==================
function setupWhatsappShare() {
  const shareBtn = document.getElementById("shareWhatsappBtn");
  if (!shareBtn) return;

  shareBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const urlInvitacion = window.location.href; // link actual
    const mensaje = `✨ Mis XV Años ✨\n\nTe comparto mi invitación premium para el 14 de febrero de 2026. Da clic para verla:\n${urlInvitacion}`;
    const encoded = encodeURIComponent(mensaje);
    const waUrl = `https://wa.me/?text=${encoded}`;

    window.open(waUrl, "_blank");
  });
}
