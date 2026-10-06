'use strict';
// A short, state-driven drive. Presentation never substitutes for operating the vehicle.
const newJourney=()=>({driven:false,parking:false,complete:false,personalised:false,skipMood:false,met:new Set(),hint:false,errorTarget:'',errorUntil:0,lastStep:'',lastTarget:null,stepSince:performance.now(),movingSince:0,confirmedTarget:null,confirmedUntil:0,lastCue:'',lastTime:performance.now(),distance:0});
let ride=newJourney();
function journeyStep(){
 const step=(id,chapter,title,hint,target)=>({id,chapter,title,hint,target});
 if(ride.complete)return step('complete',4,'Drive complete.','',null);
 if(studioView==='body')return step('explore',0,'Make yourself at home.','Pull a handle. Close each opening before entering the cockpit.','[data-view="cabin"]');
 if(openPanels().length)return step('close',0,'Close the openings.','Return to Vehicle view and push each opening closed.','[data-view="body"]');
 if(ride.parking||tyreFault){
  ride.parking=true;
  if(s.speed>.05)return step('slow',3,tyreFault?'A change. Your response.':'Bring it gently to a stop.','Release the gas. Pull the brake down.','[data-key="brake"]');
  if(s.gear!=='P')return s.brake?step('park',3,'Select Park.','Move the selector to P.','[data-gesture="gear"]'):step('parkBrake',3,'Hold the foot brake.','Pull the brake down before selecting P.','[data-key="brake"]');
  if(!s.parkingBrake)return step('secure',3,'Secure the car.','Slide the parking brake up.','#handbrake-slide');
  if(s.engine)return step('off',3,'Let the engine settle.','Hold Stop to switch off.','[data-gesture="start"]');
  if(ride.driven){ride.complete=true;return step('complete',4,'Drive complete.','',null);}
 }
 if(!s.belt)return step('belt',0,'Settle in.','Pull the belt across your seat.','[data-gesture="belt"]');
 if(!s.engine)return s.brake?step('start',0,'Bring it to life.','Hold Start.','[data-gesture="start"]'):step('brake',0,'One reassuring connection.','Pull the brake down.','[data-key="brake"]');
 if(!ride.personalised&&!ride.skipMood)return step('mood',1,'Make the cabin yours.','Raise the cabin light. Watch the display respond.','#ambient-slide');
 if(['P','N','R'].includes(s.gear))return s.brake?step('driveGear',1,'Choose your drive.','Drag the selector to D.','[data-gesture="gear"]'):step('selectBrake',1,'Brake before selecting.','Pull the brake down.','[data-key="brake"]');
 if(s.parkingBrake)return step('releasePark',1,'Ready to move.','Slide the parking brake down.','#handbrake-slide');
 if(s.brake)return step('releaseFoot',1,'Ease off the brake.','Slide the foot brake up.','[data-key="brake"]');
 if(!ride.driven)return step('pull',2,'Feel the first pull.','Pull and hold the gas. Release to coast.','[data-key="accelerate"]');
 return step('cruise',2,performance.now()-ride.movingSince<5000?'You’re in control.':'Find your rhythm.','Steer gently. Release the gas to coast; brake to slow down.',null);
}
// Existing vehicle rendering consumes these functions; keep one guide and one highlighted control.
driveStep=function(){const a=journeyStep();return {index:a.chapter,title:a.title,hint:a.hint,target:a.target};};
schematicGuide=function(){const a=journeyStep();return [a.title,a.hint];};
function journeyMarkup(a){
 if(ride.complete)return `<div class="ride-finish"><span class="eyebrow">Motor Studio / Swanand Kulkarni</span><div class="finish-mark" aria-hidden="true">✓</div><h2>From intention<br>to instinct.</h2><p>Drive complete.${tyreFault?' Vehicle parked; tyre check still needed.':''}</p><div class="ride-recap"><span><b>${Math.round(ride.distance*1760)} yd</b>Your drive</span><span><b>${Math.round(lampLevel)}%</b>Your cabin light</span><span><b>Parked</b>Your finish</span></div><a class="ride-case" href="https://swanand-kulkarni.framer.website/works/car-dashboard">Explore the dashboard research</a><button data-ride-again>Drive again</button></div>`;
 const error=Date.now()<ride.errorUntil;
 const showHint=ride.hint||error||(!ride.met.has(a.id)&&performance.now()-ride.stepSince>6500);
 const chapters=['Settle','Personalise','Drive','Park'];
 return `<div class="ride-chapters" aria-label="${chapters[a.chapter]}">${chapters.map((c,i)=>`<span class="${i===a.chapter?'current':i<a.chapter?'done':''}"><i></i>${c}</span>`).join('')}</div><span class="eyebrow">${error?'Try this':a.chapter===3&&tyreFault?'Simulated tyre-pressure alert':chapters[a.chapter]}</span><h2>${error&&notice?esc(notice):a.title}</h2><p class="ride-hint ${showHint?'':'quiet'}">${showHint?a.hint:'&nbsp;'}</p><div class="ride-actions"><button data-ride-hint aria-pressed="${ride.hint}">${ride.hint?'Hide hint':'Need a hint?'}</button>${a.id==='mood'?'<button data-ride-skip>Keep it dark</button>':''}${ride.driven&&!ride.parking?'<button data-ride-park>Park & finish</button>':''}</div>`;
}
function updateJourney(){
 const a=journeyStep();
 if(a.id!==ride.lastStep){
  if(ride.lastStep&&!['explore','close'].includes(ride.lastStep)&&!['explore','close'].includes(a.id)){
   ride.met.add(ride.lastStep);ride.confirmedTarget=ride.lastTarget;ride.confirmedUntil=performance.now()+750;
   ride.errorUntil=0;
  }
  ride.hint=false;ride.stepSince=performance.now();
 }
 ride.lastStep=a.id;ride.lastTarget=a.target;
 const error=Date.now()<ride.errorUntil;
 const assistance=!ride.met.has(a.id)&&performance.now()-ride.stepSince>6500;
 const key=[a.id,a.title,assistance,ride.hint,error,ride.complete,tyreFault,Math.round(ride.complete?ride.distance*1760:0)].join('|');
 const cue=document.querySelector('.next-cue');
 if(cue&&key!==ride.lastCue){cue.innerHTML=journeyMarkup(a);ride.lastCue=key;}
 const selector=error?ride.errorTarget:((ride.hint||!ride.met.has(a.id))?a.target:null);
 const target=selector?document.querySelector(selector):null;
 for(const el of document.querySelectorAll('.next-control,.recovery-control'))if(el!==target)el.classList.remove('next-control','recovery-control');
 if(target){target.classList.remove(error?'next-control':'recovery-control');target.classList.add(error?'recovery-control':'next-control');}
 for(const el of document.querySelectorAll('.input-confirmed'))if(performance.now()>ride.confirmedUntil||el!==document.querySelector(ride.confirmedTarget||'html'))el.classList.remove('input-confirmed');
 if(ride.confirmedTarget&&performance.now()<ride.confirmedUntil)document.querySelector(ride.confirmedTarget)?.classList.add('input-confirmed');
 document.querySelector('.auto-scene')?.classList.toggle('ride-complete',ride.complete);
}
const renderBeforeJourney=render;
render=function(){renderBeforeJourney();
 const brand=document.querySelector('.brand');if(brand)brand.innerHTML='Motor <span class="brand-studio">Studio</span>';
 const footerBrand=document.querySelector('.studio-footer span');if(footerBrand)footerBrand.textContent='Motor Studio';
 const header=document.querySelector('.header-actions');if(header){const descriptor=header.querySelector('span');if(descriptor)descriptor.remove();}
 const guide=document.querySelector('.guidance');if(guide){
  for(const selector of [':scope > .eyebrow','.instruction-list','.context-note','.auto-summary'])guide.querySelector(selector)?.remove();
  guide.insertAdjacentHTML('afterbegin','<div class="ride-intro"><span class="eyebrow">An interactive automotive concept</span><h1>Drive a <br>thought.</h1></div>');
 }
 ride.lastCue='';updateJourney();fitVehicle();
};
const tellBeforeJourney=tell;
tell=function(message){
 ride.errorUntil=Date.now()+4500;
 ride.errorTarget=/opening|doors|bonnet|boot/.test(message)?'[data-view="body"]':/belt|Buckle/.test(message)?'[data-gesture="belt"]':/handbrake|parking brake/.test(message)?'#handbrake-slide':/brake|pedal/.test(message)?'[data-key="brake"]':/gear|selector/.test(message)?'[data-gesture="gear"]':/Start|start|engine/.test(message)?'[data-gesture="start"]':journeyStep().target;
 tellBeforeJourney(message);updateJourney();
};
document.addEventListener('input',e=>{if(e.target.id==='ambient-slide'){if(Number(e.target.value)>10)ride.personalised=true;const label=document.querySelector('label[for="ambient-slide"] span');if(label)label.textContent=Math.round(lampLevel)+'%';updateJourney();}});
document.addEventListener('click',e=>{
 if(e.target.closest('[data-ride-hint]')){ride.hint=!ride.hint;updateJourney();}
 if(e.target.closest('[data-ride-skip]')){ride.skipMood=true;updateJourney();}
 if(e.target.closest('[data-ride-park]')){ride.parking=true;updateJourney();}
 if(e.target.closest('[data-ride-again]'))document.querySelector('[data-schematic-reset]')?.click();
 if(e.target.closest('[data-schematic-reset]')){const learned=ride.met;ride=newJourney();ride.met=learned;render();}
});
setInterval(()=>{
 const now=performance.now(),dt=Math.min(.25,(now-ride.lastTime)/1000);ride.lastTime=now;
 if(!ride.complete){ride.distance+=s.speed*dt/3600;if(s.speed>1&&!ride.driven){ride.driven=true;ride.movingSince=now;}}
 updateJourney();
},120);
render();

// A visible hold confirms intentional ignition input without another panel or click.
function ignitionHold(e){
 const start=e.target.closest?.('[data-gesture="start"]');
 if(!start||e.repeat)return;
 if(e.type==='keydown'&&!['Enter',' '].includes(e.key))return;
 if(e.type==='pointerdown'&&e.button!==0)return;
 start.classList.add('ignition-holding');
}
function releaseIgnitionHold(){for(const el of document.querySelectorAll('.ignition-holding'))el.classList.remove('ignition-holding');}
document.addEventListener('pointerdown',ignitionHold);
document.addEventListener('keydown',ignitionHold);
window.addEventListener('pointerup',releaseIgnitionHold);
window.addEventListener('pointercancel',releaseIgnitionHold);
window.addEventListener('keyup',e=>{if(['Enter',' '].includes(e.key))releaseIgnitionHold();});
window.addEventListener('blur',releaseIgnitionHold);
