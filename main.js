(function(){
    "use strict";
  
    /* ---------- Dark / Light mode (localStorage'da saqlanadi) ---------- */
    const root=document.documentElement;
    const saved=localStorage.getItem("f1-theme")||"dark";
    root.setAttribute("data-theme",saved);
    const icons={dark:"☀️",light:"🌙"};
    function syncBtn(){
      document.querySelectorAll(".theme-btn").forEach(b=>{
        b.textContent=icons[root.getAttribute("data-theme")]||"☀️";
      });
    }
    window.toggleTheme=function(){
      const next=root.getAttribute("data-theme")==="dark"?"light":"dark";
      root.setAttribute("data-theme",next);
      localStorage.setItem("f1-theme",next);
      syncBtn();
    };
    document.addEventListener("click",e=>{
      if(e.target.closest(".theme-btn")) toggleTheme();
    });
    syncBtn();
  
    /* ---------- Preloader ---------- */
    window.addEventListener("load",()=>{
      setTimeout(()=>document.getElementById("preloader")?.classList.add("done"),450);
    });
  
    /* ---------- Mobil menyu ---------- */
    const burger=document.querySelector(".burger");
    const menu=document.getElementById("navMenu");
    burger?.addEventListener("click",()=>menu.classList.toggle("open"));
    menu?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>menu.classList.remove("open")));
  
    /* ---------- Scroll animatsiya ---------- */
    const io=new IntersectionObserver(es=>es.forEach(en=>{
      if(en.isIntersecting){en.target.classList.add("show");io.unobserve(en.target);}
    }),{threshold:.12});
    document.querySelectorAll(".reveal").forEach(el=>io.observe(el));
  
    /* ---------- Countdown ---------- */
    const cd=document.getElementById("cdTimer");
    if(cd){
      const target=new Date(cd.dataset.date).getTime();
      function tick(){
        let d=target-Date.now(); if(d<0)d=0;
        const days=Math.floor(d/864e5), h=Math.floor(d%864e5/36e5),
              m=Math.floor(d%36e5/6e4), s=Math.floor(d%6e4/1e3);
        const set=(id,v)=>{const el=document.getElementById(id); if(el)el.textContent=String(v).padStart(2,"0");};
        set("cdD",days);set("cdH",h);set("cdM",m);set("cdS",s);
      }
      tick(); setInterval(tick,1000);
    }
  
    /* ---------- Galereya lightbox ---------- */
    const lb=document.getElementById("lightbox");
    if(lb){
      const img=lb.querySelector("img");
      document.querySelectorAll(".g-item img").forEach(g=>{
        g.parentElement.addEventListener("click",()=>{
          img.src=g.src; lb.classList.add("open"); document.body.style.overflow="hidden";
        });
      });
      lb.addEventListener("click",e=>{
        if(e.target===lb||e.target.closest("button")){lb.classList.remove("open");document.body.style.overflow="";}
      });
      document.addEventListener("keydown",e=>{if(e.key==="Escape"){lb.classList.remove("open");document.body.style.overflow="";}});
    }
  
    /* ---------- Yukoriga qaytish ---------- */
    const toTop=document.getElementById("toTop");
    window.addEventListener("scroll",()=>toTop?.classList.toggle("show",scrollY>500));
    toTop?.addEventListener("click",()=>scrollTo({top:0,behavior:"smooth"}));
  
    document.querySelectorAll(".year").forEach(y=>y.textContent=new Date().getFullYear());
  })();