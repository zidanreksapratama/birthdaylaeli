```js
(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // =========================================================
  // ELEMENTS
  // =========================================================

  const gate = $("#gate");
  const site = $("#site");
  const openBtn = $("#openBtn");
  const toast = $("#toast");

  const musicBtn = $("#musicBtn");
  const bgMusic = $("#bgMusic");

  let audioCtx = null;
  let musicPlaying = false;

  // =========================================================
  // BACKSOUND MP3
  // =========================================================

  if (bgMusic) {
    bgMusic.loop = true;
    bgMusic.preload = "auto";
    bgMusic.volume = 0.32;
  }

  function updateMusicButton() {
    if (!musicBtn) return;

    if (musicPlaying) {
      musicBtn.classList.remove("muted");
      musicBtn.innerHTML = "♫ <span>Music</span>";
      musicBtn.setAttribute("aria-label", "Matikan backsound");
      musicBtn.title = "Matikan backsound";
    } else {
      musicBtn.classList.add("muted");
      musicBtn.innerHTML = "♫̸ <span>Music</span>";
      musicBtn.setAttribute("aria-label", "Nyalakan backsound");
      musicBtn.title = "Nyalakan backsound";
    }
  }

  function startMusic() {
    if (!bgMusic) return;

    bgMusic.volume = 0.32;

    const promise = bgMusic.play();

    if (promise !== undefined) {
      promise
        .then(() => {
          musicPlaying = true;
          updateMusicButton();
        })
        .catch((error) => {
          console.log("Backsound gagal diputar:", error);
          musicPlaying = false;
          updateMusicButton();
        });
    } else {
      musicPlaying = true;
      updateMusicButton();
    }
  }

  function stopMusic() {
    if (!bgMusic) return;

    bgMusic.pause();
    musicPlaying = false;
    updateMusicButton();
  }

  musicBtn?.addEventListener("click", () => {
    if (musicPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  });

  // =========================================================
  // TOAST
  // =========================================================

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2200);
  }

  // =========================================================
  // HEART EFFECT
  // =========================================================

  function burstHearts(
    count = 18,
    x = window.innerWidth / 2,
    y = window.innerHeight * 0.45
  ) {
    for (let i = 0; i < count; i++) {
      const heart = document.createElement("span");

      heart.className = "heart-float";
      heart.textContent = ["♥", "♡", "✦"][i % 3];

      heart.style.left = `${x}px`;
      heart.style.top = `${y}px`;

      heart.style.setProperty(
        "--x",
        `${(Math.random() - 0.5) * 220}px`
      );

      heart.style.animationDelay = `${Math.random() * 0.2}s`;
      heart.style.fontSize = `${12 + Math.random() * 20}px`;

      document.body.appendChild(heart);

      setTimeout(() => {
        heart.remove();
      }, 1900);
    }
  }

  // =========================================================
  // CONFETTI
  // =========================================================

  function confetti(count = 90) {
    const shapes = ["●", "■", "◆", "✦"];

    for (let i = 0; i < count; i++) {
      const item = document.createElement("span");

      item.className = "confetti";
      item.textContent = shapes[i % shapes.length];

      item.style.left =
        window.innerWidth * 0.5 +
        (Math.random() - 0.5) * 30 +
        "px";

      item.style.top =
        window.innerHeight * 0.35 +
        (Math.random() - 0.5) * 20 +
        "px";

      item.style.color = [
        "#ff5b9a",
        "#ffb6d0",
        "#7e5265",
        "#ffd6e4"
      ][i % 4];

      item.style.setProperty(
        "--x",
        `${(Math.random() - 0.5) * window.innerWidth * 1.4}px`
      );

      item.style.setProperty(
        "--y",
        `${120 + Math.random() * window.innerHeight * 0.75}px`
      );

      item.style.transform =
        `rotate(${Math.random() * 360}deg)`;

      document.body.appendChild(item);

      setTimeout(() => {
        item.remove();
      }, 1900);
    }
  }

  // =========================================================
  // TINY MELODY
  // =========================================================

  function tinyMelody() {
    try {
      audioCtx =
        audioCtx ||
        new (
          window.AudioContext ||
          window.webkitAudioContext
        )();

      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }

      const notes = [
        523.25,
        659.25,
        783.99,
        659.25,
        587.33,
        698.46,
        880,
        698.46
      ];

      notes.forEach((frequency, index) => {
        const startTime =
          audioCtx.currentTime + index * 0.17;

        const oscillator = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        oscillator.type = "sine";
        oscillator.frequency.value = frequency;

        gain.gain.setValueAtTime(0, startTime);

        gain.gain.linearRampToValueAtTime(
          0.035,
          startTime + 0.02
        );

        gain.gain.exponentialRampToValueAtTime(
          0.001,
          startTime + 0.16
        );

        oscillator.connect(gain);
        gain.connect(audioCtx.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.18);
      });
    } catch (error) {
      console.log("Tiny melody error:", error);
    }
  }

  // =========================================================
  // BUKA KEJUTAN
  // =========================================================

  if (openBtn) {
    openBtn.addEventListener("click", () => {

      gate?.classList.add("leaving");

      setTimeout(() => {

        if (gate) {
          gate.hidden = true;
        }

        if (site) {
          site.hidden = false;

          const hero = site.querySelector(".hero");

          if (hero) {
            hero.classList.add("visible");
          }
        }

        burstHearts(28);
        confetti(55);

        tinyMelody();

        startMusic();

        window.scrollTo(0, 0);

      }, 450);
    });
  }

  // =========================================================
  // START BUTTON
  // =========================================================

  $("#startBtn")?.addEventListener("click", () => {
    $("#letter")?.scrollIntoView({
      behavior: "smooth"
    });
  });

  // =========================================================
  // ENVELOPE / LETTER
  // =========================================================

  const envelope = $("#envelope");
  const letter = $("#letter");

  envelope?.addEventListener("click", () => {

    const isOpen =
      envelope.classList.toggle("open");

    letter?.classList.toggle(
      "show",
      isOpen
    );

    if (isOpen) {
      burstHearts(
        16,
        window.innerWidth / 2,
        window.innerHeight * 0.55
      );

      tinyMelody();
    }
  });

  // =========================================================
  // PHOTO LIGHTBOX
  // =========================================================

  const lightbox = $("#lightbox");

  function openPhoto() {
    if (!lightbox) return;

    lightbox.hidden = false;
    burstHearts(8);
  }

  $("#photoBtn")?.addEventListener(
    "click",
    openPhoto
  );

  $("#photoBtn2")?.addEventListener(
    "click",
    openPhoto
  );

  $("#closeLightbox")?.addEventListener(
    "click",
    () => {
      if (lightbox) {
        lightbox.hidden = true;
      }
    }
  );

  lightbox?.addEventListener(
    "click",
    (event) => {
      if (event.target === lightbox) {
        lightbox.hidden = true;
      }
    }
  );

  // =========================================================
  // ESCAPE
  // =========================================================

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape") {
        if (lightbox) {
          lightbox.hidden = true;
        }
      }
    }
  );

  // =========================================================
  // REASONS
  // =========================================================

  $$(".reason").forEach((card) => {

    card.addEventListener(
      "click",
      () => {

        $$(".reason").forEach((item) => {
          item.classList.remove("active");
        });

        card.classList.add("active");

        const detail = $("#reasonDetail");

        if (detail) {
          detail.hidden = false;

          detail.innerHTML =
            `<strong>${card.dataset.title}</strong><br>${card.dataset.text}`;
        }

        const rect =
          card.getBoundingClientRect();

        burstHearts(
          7,
          rect.left + card.offsetWidth / 2,
          rect.top + 20
        );
      }
    );
  });

  // =========================================================
  // WISH BUTTON
  // =========================================================

  $("#wishBtn")?.addEventListener(
    "click",
    () => {

      const wishResult =
        $("#wishResult");

      if (wishResult) {
        wishResult.textContent =
          "Semoga harapan itu menemukan jalan untuk menjadi nyata. ✨";
      }

      burstHearts(20);
      confetti(45);
      tinyMelody();

      showToast(
        "Harapannya sudah dikirim ke semesta ♡"
      );
    }
  );

  // =========================================================
  // FINAL BUTTON
  // =========================================================

  $("#finalBtn")?.addEventListener(
    "click",
    () => {

      const finalMessage =
        $("#finalMessage");

      if (finalMessage) {
        finalMessage.hidden = false;
      }

      confetti(130);
      burstHearts(35);
      tinyMelody();

      showToast(
        "Surprise terakhir untuk Laeli 💗"
      );

      const finalButton =
        $("#finalBtn");

      if (finalButton) {
        finalButton.textContent =
          "♡ Untuk selamanya jadi kenangan ♡";

        finalButton.disabled = true;
      }
    }
  );

  // =========================================================
  // SCROLL REVEAL
  // =========================================================

  if ("IntersectionObserver" in window) {

    const observer =
      new IntersectionObserver(
        (entries) => {

          entries.forEach((entry) => {

            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
            }

          });

        },
        {
          threshold: 0.12
        }
      );

    $$(".reveal").forEach((element) => {
      observer.observe(element);
    });

  } else {

    $$(".reveal").forEach((element) => {
      element.classList.add("visible");
    });

  }

  // =========================================================
  // HEARTS ON PAGE TAP
  // =========================================================

  document.addEventListener(
    "click",
    (event) => {

      if (
        event.target.closest(
          "button,.envelope,.modal"
        )
      ) {
        return;
      }

      if (site?.hidden) {
        return;
      }

      const heart =
        document.createElement("span");

      heart.className = "heart-float";
      heart.textContent = "♡";

      heart.style.left =
        `${event.clientX}px`;

      heart.style.top =
        `${event.clientY}px`;

      heart.style.setProperty(
        "--x",
        `${(Math.random() - 0.5) * 70}px`
      );

      document.body.appendChild(heart);

      setTimeout(() => {
        heart.remove();
      }, 1700);
    }
  );

  // =========================================================
  // INITIAL STATE
  // =========================================================

  updateMusicButton();

})();
```
