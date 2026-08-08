window.VML = window.VML || {};
VML.jsonp=function(baseUrl,params={},timeout=15000){
 return new Promise((resolve,reject)=>{
  const cb="__vml_"+Date.now()+"_"+Math.random().toString(36).slice(2);
  const s=document.createElement("script");
  const q=new URLSearchParams({...params,callback:cb});
  s.src=baseUrl+(baseUrl.includes("?")?"&":"?")+q.toString();
  let done=false;
  const clean=()=>{if(done)return;done=true;if(s.parentNode)s.remove();try{delete window[cb]}catch(_){}clearTimeout(t)};
  window[cb]=d=>{clean();resolve(d)};
  s.onerror=()=>{clean();reject(new Error("No se pudo cargar la API"))};
  const t=setTimeout(()=>{clean();reject(new Error("Tiempo de espera agotado"))},timeout);
  document.head.appendChild(s);
 });
};
VML.load=()=>VML.jsonp(window.VML_CONFIG.API_URL,{mode:window.VML_CONFIG.API_MODE||"preview"});
VML.clean=s=>String(s||"").replace(/^["']|["']$/g,"").replace(/\.$/,"").trim();
VML.safe=s=>String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]));
