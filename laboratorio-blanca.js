const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
let creator=null;

function jsonp(baseUrl,mode="preview",timeout=12000){
 return new Promise((resolve,reject)=>{
  const cb="__lab_"+Date.now()+"_"+Math.random().toString(36).slice(2);
  const s=document.createElement("script"); let done=false;
  const sep=baseUrl.includes("?")?"&":"?";
  s.src=`${baseUrl}${sep}mode=${encodeURIComponent(mode)}&callback=${encodeURIComponent(cb)}`;
  const clean=()=>{if(done)return;done=true;if(s.parentNode)s.remove();try{delete window[cb]}catch(_){window[cb]=undefined}clearTimeout(t)};
  window[cb]=d=>{clean();resolve(d)};
  s.onerror=()=>{clean();reject(new Error("No se pudo cargar la API"))};
  const t=setTimeout(()=>{clean();reject(new Error("Tiempo de espera agotado"))},timeout);
  document.head.appendChild(s);
 });
}
function cleanTitle(s){return (s||"").replace(/^["']|["']$/g,"").replace(/\.$/,"").trim()}
async function init(){
 try{
  const data=await VML.load();
  creator=(data.creators||[]).find(c=>c.id==="CR-047");
  if(!creator)throw new Error("No se encontró CR-047");
  $("#lab-status").textContent=VML.modeLabel()+" · información cargada desde Google Sheets";
  $("#lab-status").classList.add("is-ready");
  renderData();restore();
 }catch(e){$("#lab-status").textContent="No fue posible cargar la información: "+e.message}
}
function renderData(){
 $("#context-bio").innerHTML=`<p>${creator.bio||"Biografía pendiente de validación editorial."}</p><p><strong>Nacimiento:</strong> ${creator.birth||"Por verificar"} · <strong>Lugar:</strong> ${creator.place||"Por verificar"}</p>`;
 $("#context-works").innerHTML=(creator.works||[]).map(w=>`<div class="border-bottom py-2"><strong>${cleanTitle(w.title)}</strong><br><small class="text-secondary">${w.genre||w.type||"Por clasificar"} ${w.year?`· ${w.year}`:""}</small></div>`).join("");
 const target=(creator.works||[]).find(w=>cleanTitle(w.title).toLowerCase().includes("loja en septiembre"))||(creator.works||[])[0];
 $("#selected-work-info").innerHTML=target?`<div class="info-grid"><div class="info-box"><span>Obra</span><strong>${cleanTitle(target.title)}</strong></div><div class="info-box"><span>Género</span><strong>${target.genre||target.type||"Por verificar"}</strong></div><div class="info-box"><span>Año</span><strong>${target.year||"Por verificar"}</strong></div><div class="info-box"><span>Rol</span><strong>${target.role||"Composición"}</strong></div></div>`:"";
 renderQuiz();
}
function renderQuiz(){
 const candidates=(creator.works||[]).filter(w=>w.genre && !w.genre.toLowerCase().includes("pendiente")).slice(0,5);
 const genres=["Pasacalle","Pasillo","Sanjuanito","Vals"];
 $("#genre-quiz").innerHTML=candidates.map(w=>`<div class="col-md-6"><div class="station-card h-100"><strong>${cleanTitle(w.title)}</strong><select class="form-select mt-3 quiz-select" data-answer="${w.genre}"><option value="">Selecciona…</option>${genres.map(g=>`<option>${g}</option>`).join("")}</select></div></div>`).join("");
}
function showStation(n){
 $$(".station").forEach(x=>x.classList.toggle("active",x.dataset.panel==n));
 $$(".station-btn").forEach(x=>x.classList.toggle("active",x.dataset.station==n));
 const pct=n*20;$("#progress-label").textContent=`Estación ${n} de 5`;$("#progress-percent").textContent=pct+"%";$("#progress-bar").style.width=pct+"%";
 localStorage.setItem("vml-lab-station",n);
}
$$(".station-btn").forEach(b=>b.addEventListener("click",()=>showStation(Number(b.dataset.station))));
$$(".next-station").forEach(b=>b.addEventListener("click",()=>showStation(Number(b.dataset.next))));
$$("[data-save]").forEach(el=>el.addEventListener("input",()=>localStorage.setItem("vml-"+el.dataset.save,el.value)));
$$("[data-save-check]").forEach(el=>el.addEventListener("change",()=>localStorage.setItem("vml-check-"+el.dataset.saveCheck,el.checked?"1":"0")));
$$("[data-create-choice]").forEach(b=>b.addEventListener("click",()=>{$$("[data-create-choice]").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");localStorage.setItem("vml-create-choice",b.dataset.createChoice)}));
$("#check-quiz").addEventListener("click",()=>{
 const sels=$$(".quiz-select");let ok=0;sels.forEach(s=>{if(s.value===s.dataset.answer)ok++});
 const all=sels.length;const box=$("#quiz-feedback");box.className="feedback mt-3 "+(ok===all?"ok":"warn");box.textContent=ok===all?`Correcto: ${ok}/${all}. Has relacionado todas las obras con el género registrado.`:`Resultado: ${ok}/${all}. Revisa las fichas de obra y vuelve a intentarlo.`;
});
$("#complete-lab").addEventListener("click",()=>{localStorage.setItem("vml-lab-complete","1");$("#completion-message").innerHTML='<div class="alert alert-light">Laboratorio marcado como completado en este navegador.</div>'});
function restore(){
 $$("[data-save]").forEach(el=>{const v=localStorage.getItem("vml-"+el.dataset.save);if(v!==null)el.value=v});
 $$("[data-save-check]").forEach(el=>{el.checked=localStorage.getItem("vml-check-"+el.dataset.saveCheck)==="1"});
 const choice=localStorage.getItem("vml-create-choice");if(choice){const b=document.querySelector(`[data-create-choice="${choice}"]`);if(b)b.classList.add("selected")}
 const st=Number(localStorage.getItem("vml-lab-station")||1);showStation(Math.min(5,Math.max(1,st)));
}
init();
