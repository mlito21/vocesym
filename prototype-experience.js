(function(){
  const safe=s=>String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
  function mount(root=document){
  root.querySelectorAll('[data-prototype-media]:not([data-prototype-mounted])').forEach((box,index)=>{
    box.dataset.prototypeMounted='true';
    const title=box.dataset.title||"Muestra patrimonial";
    const kind=box.dataset.kind||"audio y partitura";
    const bars=Array.from({length:42},(_,i)=>`<span style="--h:${22+((i*29+index*11)%63)}%"></span>`).join('');
    box.classList.add('prototype-media');
    box.innerHTML=`<div class="prototype-media-head"><div><div class="prototype-media-title">${safe(title)}</div><small>Demostración de ${safe(kind)}</small></div><span class="prototype-label">Prototipo simulado</span></div><div class="prototype-wave" aria-hidden="true">${bars}</div><div class="prototype-controls"><button type="button" class="prototype-play" aria-label="Reproducir demostración">▶</button><span class="prototype-time">0:00 / 0:38</span><div class="prototype-track"><span></span></div></div><div class="prototype-score"><div class="prototype-staff" aria-label="Fragmento de partitura simulado"><div class="prototype-notes">♪ ♩ ♫ ♩ ♪ ♬<br>♩ ♪ ♩ ♫ ♩ ♪</div></div></div><div class="prototype-caption">Representación demostrativa para evaluar la interfaz. Será reemplazada por el archivo autorizado y su ficha de derechos.</div>`;
    const play=box.querySelector('.prototype-play'),time=box.querySelector('.prototype-time'),track=box.querySelector('.prototype-track span');let timer=null,seconds=0;
    play.addEventListener('click',()=>{if(timer){clearInterval(timer);timer=null;play.textContent='▶';return}play.textContent='Ⅱ';timer=setInterval(()=>{seconds=(seconds+1)%39;time.textContent=`0:${String(seconds).padStart(2,'0')} / 0:38`;track.style.width=(seconds/38*100)+'%';if(seconds===0){clearInterval(timer);timer=null;play.textContent='▶'}},250)});
  });
  root.querySelectorAll('[data-check-activity]:not([data-check-mounted])').forEach((activity,index)=>{
    activity.dataset.checkMounted='true';
    const correct=activity.dataset.correct;
    const feedback=activity.querySelector('[data-check-feedback]');
    activity.querySelectorAll('[data-option]').forEach(button=>button.addEventListener('click',()=>{
      activity.querySelectorAll('[data-option]').forEach(b=>{b.disabled=true;b.classList.toggle('correct',b.dataset.option===correct)});
      const ok=button.dataset.option===correct;if(!ok)button.classList.add('incorrect');
      feedback.hidden=false;feedback.textContent=ok?(activity.dataset.ok||'Correcto. La decisión se fundamenta en la evidencia presentada.'):(activity.dataset.retry||'Revisa la información de esta estación y compara nuevamente.');
      localStorage.setItem(`vml-check-${location.pathname}-${index}`,ok?'1':'0');
    }));
  });
  }
  window.VMLPrototype={mount};
  mount();
})();
