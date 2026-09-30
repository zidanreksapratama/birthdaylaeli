(() => {
  "use strict";
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  const gate = $("#gate"), site = $("#site"), openBtn = $("#openBtn");
  const toast = $("#toast");
  const musicBtn = $("#musicBtn");
  const bgMusic = $("#bgMusic");
  
  let musicPlaying = false;
  
  if (bgMusic) {
    bgMusic.volume = 0.32;
  }
  
  function startMusic(){
    if (!bgMusic) return;
  
    bgMusic.volume = 0.32;
  
    bgMusic.play()
      .then(() => {
        musicPlaying = true;
  
        if (musicBtn) {
          musicBtn.classList.remove("muted");
          musicBtn.innerHTML = "♫ <span>Music</span>";
          musicBtn.setAttribute("aria-label","Matikan backsound");
          musicBtn.title = "Matikan backsound";
        }
      })
      .catch(err => {
        console.log("Backsound belum bisa diputar:", err);
      });
  }
  
  function stopMusic(){
    if (!bgMusic) return;
  
    bgMusic.pause();
    musicPlaying = false;
  
    if (musicBtn) {
      musicBtn.classList.add("muted");
      musicBtn.innerHTML = "♫̸ <span>Music</span>";
      musicBtn.setAttribute("aria-label","Nyalakan backsound");
      musicBtn.title = "Nyalakan backsound";
    }
  }

musicBtn?.addEventListener("click", () => {
  if (musicPlaying) {
    stopMusic();
  } else {
    startMusic();
  }
});

  // Original, gentle birthday-style instrumental loop (no external audio file).
  // It starts only after the visitor clicks "Buka Kejutan", satisfying browser audio rules.

  musicBtn?.addEventListener("click",()=>{
    if(musicPlaying) stopMusic();
    else startMusic();
  });

  function showToast(msg){
    toast.textContent = msg; toast.classList.add("show");
    clearTimeout(showToast.t); showToast.t = setTimeout(()=>toast.classList.remove("show"), 2200);
  }

  function burstHearts(count=18, x=innerWidth/2, y=innerHeight*.45){
    for(let i=0;i<count;i++){
      const h=document.createElement("span"); h.className="heart-float"; h.textContent=["♥","♡","✦"][i%3];
      h.style.left=x+"px"; h.style.top=y+"px";
      h.style.setProperty("--x",`${(Math.random()-.5)*220}px`);
      h.style.animationDelay=(Math.random()*.2)+"s";
      h.style.fontSize=(12+Math.random()*20)+"px";
      document.body.appendChild(h); setTimeout(()=>h.remove(),1900);
    }
  }

  function confetti(count=90){
    const shapes=["●","■","◆","✦"];
    for(let i=0;i<count;i++){
      const c=document.createElement("span"); c.className="confetti";
      c.textContent=shapes[i%shapes.length];
      c.style.left=(innerWidth*.5+(Math.random()-.5)*30)+"px";
      c.style.top=(innerHeight*.35+(Math.random()-.5)*20)+"px";
      c.style.color=["#ff5b9a","#ffb6d0","#7e5265","#ffd6e4"][i%4];
      c.style.setProperty("--x",`${(Math.random()-.5)*innerWidth*1.4}px`);
      c.style.setProperty("--y",`${120+Math.random()*innerHeight*.75}px`);
      c.style.transform=`rotate(${Math.random()*360}deg)`;
      document.body.appendChild(c); setTimeout(()=>c.remove(),1900);
    }
  }

  function tinyMelody(){
    try{
      audioCtx = audioCtx || new (window.AudioContext||window.webkitAudioContext)();
      if(audioCtx.state==="suspended") audioCtx.resume();
      const notes=[523.25,659.25,783.99,659.25,587.33,698.46,880,698.46];
      notes.forEach((freq,i)=>{
        const o=audioCtx.createOscillator(), g=audioCtx.createGain();
        o.type="sine"; o.frequency.value=freq; g.gain.setValueAtTime(0,audioCtx.currentTime+i*.17);
        g.gain.linearRampToValueAtTime(.035,audioCtx.currentTime+i*.17+.02);
        g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+i*.17+.16);
        o.connect(g); g.connect(audioCtx.destination); o.start(audioCtx.currentTime+i*.17); o.stop(audioCtx.currentTime+i*.17+.18);
      });
    }catch(e){}
  }

  openBtn.addEventListener("click",()=>{
    gate.classList.add("leaving");
    setTimeout(()=>{
      gate.hidden=true; site.hidden=false;
      site.querySelector(".hero").classList.add("visible");
      burstHearts(28); confetti(55); tinyMelody(); startMusic();
      window.scrollTo(0,0);
    },450);
  });

  $("#startBtn").addEventListener("click",()=>$("#letter").scrollIntoView({behavior:"smooth"}));

  const envelope=$("#envelope"), letter=$("#letter");
  envelope.addEventListener("click",()=>{
    const isOpen=envelope.classList.toggle("open");
    letter.classList.toggle("show",isOpen);
    if(isOpen){ burstHearts(16, innerWidth/2, innerHeight*.55); tinyMelody(); }
  });

  const lightbox=$("#lightbox");
  const openPhoto=()=>{lightbox.hidden=false; burstHearts(8);}
  $("#photoBtn").addEventListener("click",openPhoto);
  $("#photoBtn2").addEventListener("click",openPhoto);
  $("#closeLightbox").addEventListener("click",()=>lightbox.hidden=true);
  lightbox.addEventListener("click",e=>{if(e.target===lightbox) lightbox.hidden=true});
  document.addEventListener("keydown",e=>{if(e.key==="Escape") lightbox.hidden=true});

  $$(".reason").forEach(card=>{
    card.addEventListener("click",()=>{
      $$(".reason").forEach(x=>x.classList.remove("active"));
      card.classList.add("active");
      const detail=$("#reasonDetail"); detail.hidden=false;
      detail.innerHTML=`<strong>${card.dataset.title}</strong><br>${card.dataset.text}`;
      burstHearts(7, card.getBoundingClientRect().left+card.offsetWidth/2, card.getBoundingClientRect().top+20);
    });
  });

  $("#wishBtn").addEventListener("click",()=>{
    $("#wishResult").textContent="Semoga harapan itu menemukan jalan untuk menjadi nyata. ✨";
    burstHearts(20); confetti(45); tinyMelody();
    showToast("Harapannya sudah dikirim ke semesta ♡");
  });

  $("#finalBtn").addEventListener("click",()=>{
    $("#finalMessage").hidden=false;
    confetti(130); burstHearts(35); tinyMelody();
    showToast("Surprise terakhir untuk Laeli 💗");
    $("#finalBtn").textContent="♡ Untuk selamanya jadi kenangan ♡";
    $("#finalBtn").disabled=true;
  });

  const observer=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")});
  },{threshold:.12});
  $$(".reveal").forEach(el=>observer.observe(el));

  // Gentle hearts on taps outside controls.
  document.addEventListener("click",e=>{
    if(e.target.closest("button,.envelope,.modal")) return;
    if(site.hidden) return;
    const h=document.createElement("span"); h.className="heart-float"; h.textContent="♡";
    h.style.left=e.clientX+"px"; h.style.top=e.clientY+"px"; h.style.setProperty("--x",`${(Math.random()-.5)*70}px`);
    document.body.appendChild(h); setTimeout(()=>h.remove(),1700);
  });
})();
