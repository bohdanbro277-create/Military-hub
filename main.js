// Простий JS: перемикання мобільного меню
document.addEventListener('DOMContentLoaded', function(){
  function setupToggle(btnId){
    const btn = document.getElementById(btnId);
    if(!btn) return;
    btn.addEventListener('click', function(){
      const nav = document.querySelector('.main-nav');
      if(!nav) return;
      if(nav.style.display === 'block') nav.style.display = '';
      else nav.style.display = 'block';
    });
  }
  setupToggle('navToggle');
  setupToggle('navToggle2');

  // occasional flicker for logo to create neon effect
  (function occasionalFlicker(){
    const logo = document.querySelector('.logo');
    if(!logo) return;
    setInterval(function(){
      logo.classList.add('flicker');
      setTimeout(function(){ logo.classList.remove('flicker'); }, 360);
    }, 4200 + Math.floor(Math.random()*5200));
  })();

  // add scanline to hero for visual motion
  const hero = document.querySelector('.hero');
  if(hero){
    const scan = document.createElement('div');
    scan.className = 'scanline';
    hero.appendChild(scan);
  }

  // simple floating particles in hero
  (function heroParticles(){
    const container = document.getElementById('particles');
    if(!container) return;
    const bounds = container.getBoundingClientRect();
  container.style.position = 'absolute';
  container.style.left = '0';
  container.style.top = '0';
  container.style.right = '0';
  container.style.bottom = '0';
  const makeParticle = function(){
      const p = document.createElement('div');
      p.className = 'particle';
      const size = 4 + Math.random()*8;
      p.style.width = p.style.height = size + 'px';
      p.style.left = (Math.random()*100) + '%';
      p.style.top = (Math.random()*60 + 10) + '%';
      p.style.opacity = 0.06 + Math.random()*0.85;
      container.appendChild(p);
      const dx = (Math.random()*60-30);
      const dy = (Math.random()*40-20) - 40;
      const dur = 4500 + Math.random()*4000;
      p.animate([
        { transform: `translate3d(0,0,0)`, opacity: p.style.opacity },
        { transform: `translate3d(${dx}px,${dy}px,0)`, opacity: 0 }
      ], { duration: dur, easing: 'cubic-bezier(.2,.8,.2,1)' });
      setTimeout(()=>{ try{ container.removeChild(p); }catch(e){} }, dur+60);
    };
    // create a few at start
    for(let i=0;i<12;i++) setTimeout(makeParticle, i*220);
    // ongoing
    setInterval(makeParticle, 700 + Math.random()*800);
  })();
});
