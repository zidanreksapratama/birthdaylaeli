```js
(() => {
  "use strict";

  // =========================================================
  // HELPER
  // =========================================================
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];


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
  // File MP3 harus berada satu folder dengan index.html:
  //
  // HBD-Laeli-Interactive/
  // ├── index.html
  // ├── script.js
  // ├── style.css
  // └── nastelbom-happy-birthday-471481.mp3
  //
  // Audio dimulai setelah tombol "Buka Kejutan" ditekan,
  // sehingga tidak terkena masalah autoplay browser.
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

    const playPromise = bgMusic.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          musicPlaying = true;
          updateMusicButton();
        })
        .catch((error) => {
          console.log("Backsound belum dapat diputar:", error);
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


  // Tombol Music
  musicBtn?.addEventListener("click", () => {
    if (musicPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  });


  // Kalau audio selesai karena alasan tertentu,
  // otomatis mulai lagi karena seharusnya loop.
  bgMusic?.addEventListener("ended", () => {
    if (musicPlaying) {
      bgMusic.currentTime = 0;
      bgMusic.play().catch(() => {});
    }
  });


  // =========================================================
  // TOAST
  // =========================================================
  function showToast(msg) {
    if (!toast) return;

    toast.textContent = msg;
    toast.classList.add("show");

    clearTimeout(showToast.t);

    showToast.t = setTimeout(() => {
      toast.classList.remove("show");
    }, 2200);
  }


  // =========================================================
  // HEART EFFECT
  // =========================================================
  function burstHearts(
    count = 18,
    x = innerWidth / 2,
    y = innerHeight * 0.45
  ) {
    for (let i = 0; i < count; i++) {
      const h = document.createElement("span");

      h.className = "heart-float";
      h.textContent = ["♥", "♡", "✦"][i % 3];

      h.style.left = x + "px";
      h.style.top = y + "px";

      h.style.setProperty(
        "--x",
        `${(Math.random() - 0.5) * 220}px`
      );

      h.style.animationDelay =
        Math.random() * 0.2 + "s";

      h.style.fontSize =
        12 + Math.random() * 20 + "px";

      document.body.appendChild(h);

      setTimeout(() => h.remove(), 1900);
    }
  }


  // =========================================================
  // CONFETTI EFFECT
  // =========================================================
  function confetti(count = 90) {
    const shapes = ["●", "■", "◆", "✦"];

    for (let i = 0; i < count; i++) {
      const c = document.createElement("span");

      c.className = "confetti";
      c.textContent = shapes[i % shapes.length];

      c.style.left =
        innerWidth * 0.5 +
        (Math.random() - 0.5) * 30 +
        "px";

      c.style.top =
        innerHeight * 0.35 +
        (Math.random() - 0.5) * 20 +
        "px";

      c.style.color = [
        "#ff5b9a",
        "#ffb6d0",
        "#7e5265",
        "#ffd6e4"
      ][i % 4];

      c.style.setProperty(
        "--x",
        `${(Math.random() - 0.5) * innerWidth * 1.4}px`
      );

      c.style.setProperty(
        "--y",
        `${120 + Math.random() * innerHeight * 0.75}px`
      );

      c.style.transform =
        `rotate(${Math.random() * 360}deg)`;

      document.body.appendChild(c);

      setTimeout(() => c.remove(), 1900);
    }
  }


  // =========================================================
  // TINY MELODY
  // =========================================================
  // Ini TIDAK menggunakan MP3.
  // Ini adalah efek suara pendek untuk interaksi tertentu.
  // Backsound utama tetap menggunakan file MP3.
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

      notes.forEach((freq, i) => {
        const startTime =
          audioCtx.currentTime + i * 0.17;

        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();

        o.type = "sine";
        o.frequency.value = freq;

        g.gain.setValueAtTime(
          0,
          startTime
        );

        g.gain.linearRampToValueAtTime(
          0.035,
          startTime + 0.02
        );

        g.gain.exponentialRampToValueAtTime(
          0.001,
          startTime + 0.16
        );

        o.connect(g);
        g.connect(audioCtx.destination);

        o.start(startTime);
        o.stop(startTime + 0.18);
      });

    } catch (e) {
      console.log("Tiny melody error:", e);
    }
  }


  // =========================================================
  // OPEN / BUKA KEJUTAN
  // =========================================================
  openBtn?.addEventListener("click", () => {

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

      // Efek visual
      burstHearts(28);
      confetti(55);

      // Efek suara pendek
      tinyMelody();

      // Mulai backsound MP3
      startMusic();

      window.scrollTo(0, 0);

    }, 450);
  });


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
        innerWidth / 2,
        innerHeight * 0.55
      );

      tinyMelody();
    }
  });


  // =========================================================
  // PHOTO LIGHTBOX
  // =========================================================
  const lightbox = $("#lightbox");

  const openPhoto = () => {
    if (!lightbox) return;

    lightbox.hidden = false;

    burstHearts(8);
  };


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
    (e) => {
      if (e.target === lightbox) {
        lightbox.hidden = true;
      }
    }
  );


  // =========================================================
  // ESCAPE TO CLOSE LIGHTBOX
  // =========================================================
  document.addEventListener(
    "keydown",
    (e) => {

      if (e.key === "Escape") {

        if (lightbox) {
          lightbox.hidden = true;
        }

      }
    }
  );


  // =========================================================
  // REASONS / ALASAN
  // =========================================================
  $$(".reason").forEach((card) => {

    card.addEventListener(
      "click",
      () => {

        $$(".reason").forEach((x) => {
          x.classList.remove("active");
        });

        card.classList.add("active");

        const detail =
          $("#reasonDetail");

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

      const finalBtn =
        $("#finalBtn");

      if (finalBtn) {

        finalBtn.textContent =
          "♡ Untuk selamanya jadi kenangan ♡";

        finalBtn.disabled = true;
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

          entries.forEach((e) => {

            if (e.isIntersecting) {
              e.target.classList.add("visible");
            }

          });

        },
        {
          threshold: 0.12
        }
      );

    $$(".reveal").forEach((el) => {
      observer.observe(el);
    });

  } else {

    // Fallback untuk browser lama
    $$(".reveal").forEach((el) => {
      el.classList.add("visible");
    });

  }


  // =========================================================
  // GENTLE HEARTS ON PAGE TAP
  // =========================================================
  document.addEventListener(
    "click",
    (e) => {

      if (
        e.target.closest(
          "button,.envelope,.modal"
        )
      ) {
        return;
      }

      if (site?.hidden) {
        return;
      }

      const h =
        document.createElement("span");

      h.className = "heart-float";
      h.textContent = "♡";

      h.style.left =
        e.clientX + "px";

      h.style.top =
        e.clientY + "px";

      h.style.setProperty(
        "--x",
        `${(Math.random() - 0.5) * 70}px`
      );

      document.body.appendChild(h);

      setTimeout(() => {
        h.remove();
      }, 1700);
    }
  );


  // =========================================================
  // INITIAL STATE
  // =========================================================
  updateMusicButton();

})();
```
