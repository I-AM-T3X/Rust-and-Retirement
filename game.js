// ---------- Balance knobs (all money in copper: 1gp = 10sp = 100cp) ----------
const CFG = {
  goal: 500000,        // 5000 gp retirement fund
  startGold: 12000,    // 120 gp in your pocket
  targetDays: 45,      // days for a full longevity score
  goldWeight: 0.7,     // star rating split (rest is longevity)
  rationCost: 10, rationEnergy: 15,
  restBonus: 15,
  repairGrowth: 1.6,   // each repair on an item costs 1.6x the last
  bagSize: 18,
  boardSize: 6        // adventures on the board each morning (Haul Crates is always one)
};
const LODGING = [
  {key:'inn',   name:'Room at the inn', cost:20, energy:35, note:'Real bed, real door'},
  {key:'rough', name:'Sleep rough',     cost:0,  energy:10, note:'Free, cold, damp'}
];
const MEALS = [
  {key:'feast', name:'Hearty feast', cost:50, energy:20, note:'Roast and seconds'},
  {key:'plate', name:'Tavern plate', cost:30, energy:12, note:'Whatever\'s cooking'},
  {key:'stew',  name:'Thin stew',    cost:10, energy:5,  note:'Mostly water'},
  {key:'skip',  name:'Skip supper',  cost:0,  energy:0,  note:'Stomach complains'}
];
const SLOTS = ['weapon','armor','shield','helm','boots'];
const SLOT_NAME = {weapon:'Weapon',armor:'Armor',shield:'Shield',helm:'Helm',boots:'Boots'};
const BASE_POWER = {weapon:30,armor:14,shield:10,helm:6,boots:4};
const BASE_MAX = {weapon:60,armor:80,shield:50,helm:40,boots:35};
const WEAR_WEIGHT = {weapon:.4,armor:.25,shield:.15,helm:.1,boots:.1};
const START_GEAR = [
  {slot:'weapon',name:'Emberbrand, the Old Flame',power:30,max:60,repairBase:8000,sell:150000,rarity:'legendary'},
  {slot:'armor', name:'Dented Mithral Hauberk',power:14,max:80,repairBase:6000,sell:40000,rarity:'epic'},
  {slot:'shield',name:'Kite Shield of the Third Company',power:10,max:50,repairBase:4000,sell:20000,rarity:'rare'},
  {slot:'helm',  name:'Owlcrest Helm',power:6,max:40,repairBase:3000,sell:12000,rarity:'rare'},
  {slot:'boots', name:'Road-Worn Boots',power:4,max:35,repairBase:2000,sell:3000,rarity:'common'}
];
const RARITY = {
  common:{label:'Common',c:'var(--r-common)',mult:1},
  rare:{label:'Rare',c:'var(--r-rare)',mult:1.15},
  epic:{label:'Epic',c:'var(--r-epic)',mult:1.3},
  legendary:{label:'Legendary',c:'var(--r-legendary)',mult:1.5}
};
// secs = how long the adventure takes. loot = chance of materials, gearDrop = chance of a gear piece (on success)
const JOBS = [
  {key:'docks',  tier:0,name:'Haul Crates',     where:'The docks',   min:0, secs:10,pay:[1000,2500],  wear:1, energy:20,loot:.15,gearDrop:0,  mat:{name:'Crate of Salted Fish',icon:'crate',v:[300,600]},   prefix:''},
  {key:'rats',   tier:1,name:'Cellar Rats',     where:'Old Town',    min:8, secs:15,pay:[4000,7000],  wear:5, energy:20,loot:.35,gearDrop:.05,mat:{name:'Bundle of Rat Pelts',icon:'pelt',v:[800,1500]},    prefix:'Cellar-Found'},
  {key:'goblins',tier:2,name:'Goblin Camp',     where:'Thornwood',   min:20,secs:22,pay:[9000,14000], wear:10,energy:28,loot:.4, gearDrop:.1, mat:{name:'Goblin Trinkets',icon:'trinket',v:[1500,3000]},    prefix:'Goblin-Made'},
  {key:'escort', tier:3,name:'Caravan Escort',  where:'Salt Road',   min:30,secs:30,pay:[14000,20000],wear:13,energy:35,loot:.4, gearDrop:.12,mat:{name:'Spice Sachet',icon:'sachet',v:[3000,5000]},      prefix:'Caravan Guard\'s'},
  {key:'ogre',   tier:4,name:'Ogre Bounty',     where:'Millbrook',   min:42,secs:38,pay:[20000,30000],wear:18,energy:40,loot:.45,gearDrop:.15,mat:{name:'Ogre Tusk',icon:'tusk',v:[5000,8000]},          prefix:'Ogre-Hide'},
  {key:'wyvern', tier:5,name:'Wyvern Nest',     where:'Gray Cliffs', min:52,secs:48,pay:[32000,46000],wear:26,energy:48,loot:.5, gearDrop:.18,mat:{name:'Wyvern Egg',icon:'egg',v:[9000,15000]},         prefix:'Wyvernbone'},
  {key:'drake',  tier:6,name:'The Ashen Drake', where:'Cinder Peak', min:60,secs:60,pay:[65000,90000],wear:42,energy:60,loot:.6, gearDrop:.25,mat:{name:'Ashen Drake Scale',icon:'scale',v:[18000,28000]}, prefix:'Ashen'}
];
// Story beats shown in the journal during adventures. {gear} becomes a random piece of your equipped gear.
const STORY = {
 "docks": {
  "go": [
   "You roll up your sleeves at the docks. The foreman points at a mountain of crates."
  ],
  "beats": [
   "A crate of fish slips and you catch it with your knee. Ow.",
   "The sailors bet on whether the old adventurer can keep up. You keep up.",
   "Your back makes a noise you've never heard before.",
   "Somebody's parrot keeps calling you grandpa."
  ],
  "win": [
   "The last crate hits the dock. The foreman nods, which is high praise from him."
  ],
  "lose": [
   "You drop a crate of wine. The foreman takes it out of your pay."
  ]
 },
 "rats": {
  "go": [
   "You climb down into a damp cellar in Old Town, torch in hand.",
   "The innkeeper locks the cellar door behind you. For safety, he says."
  ],
  "beats": [
   "Something squeaks in the dark. Then something else squeaks back.",
   "A rat the size of a dog lunges at you. Your {gear} takes the bite.",
   "You find a nest behind the barrels. It's a lot of rats.",
   "One runs up your leg. You do a little dance nobody needs to see."
  ],
  "win": [
   "The last rat goes down. The cellar is quiet except for your breathing."
  ],
  "lose": [
   "The rats swarm. You scramble up the stairs with your pride in tatters."
  ]
 },
 "goblins": {
  "go": [
   "You head into Thornwood. The smoke from the goblin camp isn't hard to find."
  ],
  "beats": [
   "A rock bounces off your {gear}. Then twenty more.",
   "A goblin in a cooking-pot helmet yells something rude about your age.",
   "You knock over their stew. They take that personally.",
   "Their chieftain charges you on a very confused goat."
  ],
  "win": [
   "The goblins scatter into the trees, yelling that this isn't over. It's over."
  ],
  "lose": [
   "There are way more goblins than the bounty said. You retreat, pelted with rocks the whole way."
  ]
 },
 "escort": {
  "go": [
   "The caravan rolls out onto the Salt Road. The merchants look nervous."
  ],
  "beats": [
   "Day one passes quietly. Too quietly, says the cook. He says that every day.",
   "A wagon wheel breaks. You spend an hour holding up a wagon.",
   "Bandits on the ridge! Arrows thunk into your {gear}.",
   "The spice merchant tries to haggle your pay down in the middle of the ambush."
  ],
  "win": [
   "The caravan rolls into town with every wagon intact. The merchants are all smiles."
  ],
  "lose": [
   "The bandits make off with two wagons. The merchants pay you, but only barely."
  ]
 },
 "ogre": {
  "go": [
   "You reach Millbrook. The miller's cart is upside down in a tree."
  ],
  "beats": [
   "You follow huge footprints and a trail of half-eaten cabbages.",
   "The ogre is napping on a pile of flour sacks. He wakes up grumpy.",
   "He swings a whole fence post. Your {gear} takes the hit and groans.",
   "You find the miller. He's fine, just very annoyed and covered in flour."
  ],
  "win": [
   "The ogre goes down with a thud that rattles every window in Millbrook. The village cheers."
  ],
  "lose": [
   "The ogre tosses you into the millpond. You get the miller out, but the ogre gets away."
  ]
 },
 "wyvern": {
  "go": [
   "You start the long climb up the Gray Cliffs. The wind tries to throw you off."
  ],
  "beats": [
   "A shadow passes overhead. Then it circles back.",
   "The nest is full of eggs, bones, and one very angry parent.",
   "The wyvern's tail slams into your {gear}. Something cracks.",
   "You hang off a ledge by one hand. Your knees file a formal complaint."
  ],
  "win": [
   "The wyvern flees into the clouds. You climb down with the loot strapped to your back."
  ],
  "lose": [
   "The wyvern drives you off the cliffs. You slide most of the way down on your backside."
  ]
 },
 "drake": {
  "go": [
   "You climb Cinder Peak. The rocks are warm. Then hot.",
   "Old instincts kick in. This is the kind of job you used to live for."
  ],
  "beats": [
   "The Ashen Drake opens one eye. It remembers you. You remember it.",
   "Fire rolls over you. The only thing between you and it is your {gear}.",
   "You land a hit that would've made your younger self proud.",
   "Its claws rake across your {gear}. The sound is awful.",
   "Your lungs burn. Your arms burn. Honestly, everything burns."
  ],
  "win": [
   "The Ashen Drake crashes down the mountain. You sit on a rock for a long time, just breathing."
  ],
  "lose": [
   "The drake's fire drives you off the peak. You live, which is more than most can say."
  ]
 }
};
const TIER_COLOR = ['var(--r-common)','var(--r-common)','var(--good)','var(--r-rare)','var(--r-rare)','var(--r-epic)','var(--r-legendary)'];
const TIER_NAME = ['Odd job','Easy','Easy','Medium','Hard','Hard','Deadly'];
const GEAR_BASES = {weapon:['Cleaver','Longsword','Warhammer','Spear'],armor:['Brigandine','Chainmail','Scale Coat'],shield:['Buckler','Tower Shield','Round Shield'],helm:['Sallet','Coif','Great Helm'],boots:['Greaves','Riding Boots','Sabatons']};
const KEY = 'rust-retirement-v2';

const ICON = {
  weapon:'<path d="M19 5l-9.5 9.5M19 5h-3.5M19 5v3.5M9.5 14.5l-2 2M5.5 14.5l4 4M4 20l2.2-2.2"/>',
  armor:'<path d="M8 3l4 2 4-2 4 3-2 4v10H6V10L4 6z"/><path d="M12 5v15"/>',
  shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M12 7v10M8 11h8"/>',
  helm:'<path d="M4 16a8 8 0 0116 0v3H4z"/><path d="M12 8v11M4 16h16"/>',
  boots:'<path d="M7 3h6v10l6 3v4H5v-4z"/><path d="M5 17h14"/>',
  crate:'<rect x="4" y="6" width="16" height="13" rx="1"/><path d="M4 11h16M10 6v13"/>',
  pelt:'<path d="M6 4c2 2 10 2 12 0l-1 7 2 9H5l2-9z"/>',
  trinket:'<circle cx="12" cy="14" r="6"/><path d="M12 8V3M10 14l2-2 2 2-2 2z"/>',
  sachet:'<path d="M8 8h8l3 12H5zM9 8l3-4 3 4"/>',
  tusk:'<path d="M5 20c8-1 13-7 14-16-4 6-9 9-14 10z"/>',
  egg:'<ellipse cx="12" cy="13" rx="6" ry="8"/><path d="M8 12l2 2 2-2 2 2 2-2"/>',
  scale:'<path d="M12 3c5 3 7 8 7 12a7 7 0 01-14 0c0-4 2-9 7-12z"/><path d="M12 9v9"/>',
  vet:'<circle cx="12" cy="8" r="4"/><path d="M9 10c0 3 1.5 5 3 5s3-2 3-5M4 21c1-4 4-6 8-6s7 2 8 6"/>',
  ration:'<path d="M5 11h14l-2 9H7z"/><path d="M8 11c0-4 8-4 8 0M12 6V3"/>',
  coin:'<circle cx="12" cy="12" r="8"/><path d="M12 8v8M9.5 10h4a1.5 1.5 0 010 3h-3a1.5 1.5 0 000 3h4"/>',
  clock:'<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>'
};
const JOB_ICON = {docks:'crate',rats:'pelt',goblins:'trinket',escort:'sachet',ogre:'tusk',wyvern:'egg',drake:'scale'};
const ic = (k,cls='')=>'<svg class="ico '+cls+'" viewBox="0 0 24 24" aria-hidden="true">'+ICON[k]+'</svg>';

// ---------- helpers ----------
const rand = (a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick = a=>a[Math.floor(Math.random()*a.length)];
const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
function fmt(cp,short){
  cp=Math.max(0,Math.round(cp));
  const g=Math.floor(cp/100), s=Math.floor((cp%100)/10), c=cp%10, out=[];
  if(g) out.push(g.toLocaleString()+'<i class="gp">g</i>');
  if(s && !(short&&g>=100)) out.push(s+'<i class="sp">s</i>');
  if((c||!out.length) && !(short&&g)) out.push(c+'<i class="cp">c</i>');
  return '<span class="num">'+out.join(' ')+'</span>';
}
const plain = cp => fmt(cp).replace(/<[^>]+>/g,'');
const esc = s => String(s).replace(/[&<>"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
const job = k => JOBS.find(j=>j.key===k);

// ---------- state ----------
let S;
function newState(){
  const s={day:1, phase:'morning', gold:CFG.startGold, energy:100, rations:2, nextId:1,
    eq:{}, bag:[], offers:[], event:null, trip:null, lodge:'inn', meal:'plate',
    selSlot:'weapon', selBag:null, pendingSell:null, askNew:false, log:[], ended:false, endReason:''};
  START_GEAR.forEach(g=>{ s.eq[g.slot]={...g, uid:s.nextId++, kind:'gear', dur:g.max, repairs:0}; });
  return s;
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function load(){try{const r=localStorage.getItem(KEY);if(r){const s=JSON.parse(r);if(s&&s.eq)return s}}catch(e){}return null}
function log(text,kind=''){ S.log.unshift({d:S.day,text,kind}); S.log=S.log.slice(0,120); }

const live = ()=>SLOTS.map(k=>S.eq[k]).filter(g=>g&&g.dur>0);
function gearPower(g){ if(!g||g.dur<=0) return 0; return g.dur/g.max<.25 ? g.power/2 : g.power; }
const power = ()=>Math.round(SLOTS.reduce((a,k)=>a+gearPower(S.eq[k]),0));
const repairCost = g=>Math.round(g.repairBase*Math.pow(CFG.repairGrowth,g.repairs));
function sellValue(it){
  if(it.kind==='mat') return it.value;
  if(it.dur<=0) return Math.round(it.sell*.1);
  const r=it.dur/it.max;
  return Math.round(it.sell*(it.rarity==='legendary'?.6+.4*r:.4+.6*r));
}
const inTown = ()=>!S.trip && !S.ended;
function chance(j){
  const p=power(); if(p<j.min) return 0;
  let c=.88+(p-j.min)*.008+(S.energy-60)*.004;
  if(S.energy<j.energy) c*=.5;
  return clamp(c,.1,.98);
}
function score(){
  const g=clamp(S.gold/CFG.goal,0,1), l=clamp(S.day/CFG.targetDays,0,1);
  return {g,l,stars:Math.round(5*(CFG.goldWeight*g+(1-CFG.goldWeight)*l)*10)/10};
}

function genGear(j){
  const slot=pick(SLOTS), t=j.tier, r=Math.random();
  let rarity='common';
  if(t>=6&&r<.06) rarity='legendary'; else if(r<.05*t) rarity='epic'; else if(r<.05*t+.35) rarity='rare';
  const m=RARITY[rarity].mult, f=.35+.12*t;
  const power=Math.max(1,Math.round(BASE_POWER[slot]*f*m*(.85+Math.random()*.3)));
  const max=Math.round(BASE_MAX[slot]*(.55+Math.random()*.4));
  return {uid:S.nextId++, kind:'gear', slot, rarity, name:j.prefix+' '+pick(GEAR_BASES[slot]),
    power, max, dur:Math.round(max*(.6+Math.random()*.4)), repairs:0, repairBase:power*250, sell:Math.round(power*500*m)};
}
function addToBag(it){
  if(S.bag.length>=CFG.bagSize){ log('Your bag is full, so you leave the '+it.name+' behind.','bad'); return false; }
  S.bag.push(it); return true;
}

function rollOffers(){
  const pool=JOBS.slice(1).sort(()=>Math.random()-.5).slice(0,CFG.boardSize-1);
  S.offers=[JOBS[0].key,...pool.map(j=>j.key)].sort((a,b)=>job(a).min-job(b).min);
}
function startDay(){
  rollOffers();
  S.event=null; S.pendingSell=null;
  if(S.day>1 && Math.random()<.28){
    const roll=Math.random(), intact=live();
    if(roll<.4 && intact.length){
      const g=pick(intact);
      S.event={type:'merchant', slot:g.slot, offer:Math.round(sellValue(g)*1.3)};
    } else if(roll<.6){
      const c=rand(1000,3000); S.gold+=c; log('You find a forgotten coin pouch in your pack: '+plain(c)+'.','good');
    } else if(roll<.8){
      S.energy=clamp(S.energy-15,0,100); log('Your knee is acting up this morning. Energy -15.','bad');
    } else {
      S.energy=clamp(S.energy+10,0,100); log('An old party member spots you and buys breakfast. Energy +10.','good');
    }
  }
}
function applyWear(total){
  const l=live(); if(!l.length||total<=0) return [];
  const w=l.map(g=>WEAR_WEIGHT[g.slot]*(.7+Math.random()*.6)), sum=w.reduce((a,b)=>a+b,0), broke=[];
  l.forEach((g,i)=>{ const d=Math.max(total>=5?1:0,Math.round(total*w[i]/sum)); g.dur=Math.max(0,g.dur-d); if(g.dur===0) broke.push(g.name); });
  return broke;
}
function endGame(reason){
  let v=0; S.bag.forEach(i=>v+=sellValue(i));
  if(v){ S.gold+=v; log('You sell off everything left in your bag for '+plain(v)+'.','good'); }
  S.bag=[]; S.ended=true; S.endReason=reason; S.trip=null;
}
function checkEnd(){
  if(!live().length && !S.bag.some(i=>i.kind==='gear'&&i.dur>0)){
    log('Nothing left to fight with. You retire.','bad');
    endGame('Your last piece of gear gave out. Time to hang it all up.');
  }
}
function buildScript(j){
  const st=STORY[j.key], out=[];
  st.go.slice(1).forEach(t=>out.push({at:.08,t}));
  const n=clamp(Math.round(j.secs/9),1,st.beats.length);
  const beats=st.beats.map((t,i)=>({t,i,r:Math.random()})).sort((a,b)=>a.r-b.r).slice(0,n).sort((a,b)=>a.i-b.i).map(b=>b.t); // keep story order
  beats.forEach((t,i)=>out.push({at:.18+(.62*(i+.5)/n),t}));
  return out;
}
function storyText(t){ const l=live(); return t.replace(/\{gear\}/g,()=>l.length?pick(l).name:'gear'); }
function resolveTrip(){
  const t=S.trip, j=job(t.key), ok=t.ok!==undefined?t.ok:Math.random()<t.c;
  log(pick(STORY[j.key][ok?'win':'lose']),'story');
  let pay=rand(j.pay[0],j.pay[1]), wear=j.wear;
  if(!ok){ pay=Math.round(pay*.25); wear=Math.round(wear*1.5); }
  S.gold+=pay;
  const broke=applyWear(wear);
  log((ok?'Success at ':'It went badly at ')+j.name+'. Earned '+plain(pay)+'.',ok?'good':'bad');
  broke.forEach(n=>log(n+' breaks.','bad'));
  if(Math.random()<(ok?j.loot:j.loot*.3)){
    const it={uid:S.nextId++, kind:'mat', name:j.mat.name, icon:j.mat.icon, rarity:'common', value:rand(j.mat.v[0],j.mat.v[1])};
    if(addToBag(it)) log('Loot: '+it.name+' (worth '+plain(it.value)+').','loot');
  }
  if(ok && Math.random()<j.gearDrop){
    const g=genGear(j);
    if(addToBag(g)) log('Loot: '+RARITY[g.rarity].label+' '+g.name+' ('+g.power+' power).','loot');
  }
  S.trip=null; S.phase='evening';
  checkEnd();
}

// ---------- actions ----------
const A = {
  job(key){
    const j=job(key), c=chance(j); if(!c||!inTown()||S.phase!=='morning') return;
    S.energy=clamp(S.energy-j.energy,0,100);
    S.trip={key, start:Date.now(), dur:j.secs*1000, c, ok:Math.random()<c, script:buildScript(j), next:0};
    S.event=null; S.pendingSell=null;
    S.trip.beat=STORY[j.key].go[0];
    log(S.trip.beat,'story');
  },
  rest(){ if(!inTown()) return; S.energy=clamp(S.energy+CFG.restBonus,0,100); log('You take the day off. Energy +'+CFG.restBonus+'.'); S.phase='evening'; },
  buyRation(n){ n=+n||1; const c=CFG.rationCost*n; if(S.gold<c||S.ended) return; S.gold-=c; S.rations+=n; },
  tab(t){ S.bagTab=t; },
  eatRation(){ if(!S.rations||S.energy>=100||S.ended) return; S.rations--; S.energy=clamp(S.energy+CFG.rationEnergy,0,100); },
  selSlot(k){ S.selSlot=k; S.pendingSell=null; },
  selBag(uid){ S.selBag=+uid; S.pendingSell=null; },
  repair(){
    const g=S.eq[S.selSlot]; if(!g||!inTown()) return; const cost=repairCost(g);
    if(g.dur>=g.max||S.gold<cost) return;
    S.gold-=cost; g.dur=g.max; g.repairs++;
    log('Repaired '+g.name+' for '+plain(cost)+'. Next repair costs '+plain(repairCost(g))+'.');
  },
  sellAsk(){ S.pendingSell='eq'; },
  sellCancel(){ S.pendingSell=null; },
  sellEq(){
    const g=S.eq[S.selSlot]; if(!g||!inTown()) return;
    const v=sellValue(g); S.gold+=v; S.eq[S.selSlot]=null; S.pendingSell=null;
    log('Sold '+g.name+' for '+plain(v)+'.','good'); checkEnd();
  },
  sellBag(){
    const i=S.bag.findIndex(x=>x.uid===S.selBag); if(i<0||!inTown()) return;
    const it=S.bag[i], v=sellValue(it); S.gold+=v; S.bag.splice(i,1); S.selBag=null;
    log('Sold '+it.name+' for '+plain(v)+'.','good'); checkEnd();
  },
  sellMats(){
    if(!inTown()) return; let v=0,n=0;
    S.bag=S.bag.filter(it=>{ if(it.kind==='mat'){v+=it.value;n++;return false} return true; });
    if(n){ S.gold+=v; log('The merchant buys '+n+' material'+(n>1?'s':'')+' for '+plain(v)+'.','good'); }
    S.selBag=null;
  },
  equip(){
    const i=S.bag.findIndex(x=>x.uid===S.selBag); if(i<0||!inTown()) return;
    const it=S.bag[i]; if(it.kind!=='gear') return;
    const cur=S.eq[it.slot]; S.bag.splice(i,1);
    if(cur && cur.dur>0){ S.bag.push(cur); }
    else if(cur){ const v=sellValue(cur); S.gold+=v; log('You scrap the broken '+cur.name+' for '+plain(v)+'.'); }
    S.eq[it.slot]=it; S.selSlot=it.slot; S.selBag=null;
    log('Equipped '+it.name+'.','good');
  },
  merchantYes(){
    const e=S.event, g=S.eq[e.slot]; if(!g) return;
    S.gold+=e.offer; S.eq[e.slot]=null; S.event=null;
    log('A traveling merchant buys '+g.name+' for '+plain(e.offer)+'.','good'); checkEnd();
  },
  merchantNo(){ log('You send the merchant on his way.'); S.event=null; },
  sleep(){
    const L=LODGING.find(x=>x.key===S.lodge), M=MEALS.find(x=>x.key===S.meal), cost=L.cost+M.cost;
    if(S.gold<cost||S.phase!=='evening') return;
    S.gold-=cost; S.energy=clamp(S.energy+L.energy+M.energy,0,100);
    log('Night '+S.day+': '+L.name.toLowerCase()+', '+M.name.toLowerCase()+'. Spent '+plain(cost)+'.');
    S.day++; S.phase='morning'; startDay();
  },
  retire(){ if(S.trip) return; log('You retire on your own terms.','good'); endGame('You decide you\'ve had enough and walk away while you still can.'); },
  'newrun-ask'(){ S.askNew=true; },
  'newrun-no'(){ S.askNew=false; },
  newrun(){ S=newState(); startDay(); log('Day one of the last stretch. Five thousand gold buys a farm.'); }
};

// ---------- render ----------
function starsHTML(v,cls){ return '<span class="'+cls+'" style="--f:'+(v/5*100)+'%" role="img" aria-label="'+v+' out of 5 stars"><span class="base">★★★★★</span><span class="fill">★★★★★</span></span>'; }
function phaseLabel(){ if(S.trip) return 'On the road'; return S.phase==='morning'?'Morning':'Evening'; }

function renderTop(){
  const pct=clamp(S.gold/CFG.goal*100,0,100), sc=score(), lowE=S.energy<30;
  document.getElementById('top').innerHTML=
    '<div class="who"><div class="avatar">'+ic('vet')+'</div><div style="flex:1;min-width:0">'+
      '<h1>The Old Veteran</h1><div class="sub">Retiring adventurer · Day '+S.day+' · '+phaseLabel()+'</div>'+
      '<div class="bars"><div class="bar fund" title="Retirement fund"><span style="width:'+pct+'%"></span></div><span class="num">'+Math.floor(S.gold/100).toLocaleString()+' / '+(CFG.goal/100).toLocaleString()+'g</span>'+
      '<div class="bar energy '+(lowE?'low':'')+'" title="Energy"><span style="width:'+S.energy+'%"></span></div><span class="num">'+S.energy+' / 100</span></div>'+
    '</div></div>'+
    '<div class="hstats">'+
      '<div class="tile"><span class="label">Purse</span><b>'+fmt(S.gold,true)+'</b></div>'+
      '<div class="tile power"><span class="label">Power</span><b>'+power()+'</b></div>'+
      '<div class="tile"><span class="label">Rating so far</span>'+starsHTML(sc.stars,'mini-stars')+'</div>'+
      '<div class="hbtns">'+(S.askNew
        ? '<button class="confirm" data-a="newrun">Yes, start over</button><button data-a="newrun-no">Keep playing</button>'
        : '<button data-a="retire" '+(S.trip||S.ended?'disabled':'')+'>Retire now</button><button data-a="newrun-ask">New run</button>')+'</div>'+
    '</div>';
}

function slotHTML(k){
  const g=S.eq[k], sel=S.selSlot===k?' sel':'';
  if(!g) return '<button class="slot empty'+sel+'" data-a="selSlot" data-id="'+k+'" aria-label="'+SLOT_NAME[k]+': empty">'+ic(k)+'<span class="sname">'+SLOT_NAME[k]+'</span></button>';
  const r=g.dur/g.max, dc=r<.25?'low':r<.5?'mid':'';
  return '<button class="slot'+(g.dur<=0?' broken':'')+sel+'" style="--rc:'+RARITY[g.rarity].c+'" data-a="selSlot" data-id="'+k+'" aria-label="'+esc(g.name)+'">'+ic(k)+
    '<span class="dbar '+dc+'"><span style="width:'+r*100+'%"></span></span></button>';
}

function renderGear(){
  document.getElementById('intact').textContent=live().length+' of 5 intact';
  const sc=score();
  let h='<div class="doll"><div class="slots">'+['helm','armor','boots'].map(slotHTML).join('')+'</div>'+
    '<div class="center"><div class="cstat hero"><span class="label">Combat power</span><b>'+power()+'</b></div>'+
    '<div class="cstat"><span class="label">Energy</span><b>'+S.energy+'</b></div>'+
    '<div class="cstat"><span class="label">Days on the road</span><b>'+S.day+'</b></div></div>'+
    '<div class="slots">'+['weapon','shield'].map(slotHTML).join('')+'</div></div>';
  const g=S.eq[S.selSlot];
  if(!g){
    h+='<div class="detail"><div class="nm">'+SLOT_NAME[S.selSlot]+' slot</div><p class="empty-note">Nothing equipped here. Pick up gear on adventures and equip it from your bag.</p></div>';
  } else {
    const r=g.dur/g.max, dc=r<.25?'low':r<.5?'mid':'', rc=repairCost(g);
    let state=g.dur<=0?' · <span style="color:var(--bad)">Broken</span>':r<.25?' · <span style="color:var(--gold)">Worn, half power</span>':'';
    h+='<div class="detail"><div class="nm" style="color:'+RARITY[g.rarity].c+'">'+esc(g.name)+'</div>'+
      '<div class="meta"><span>'+SLOT_NAME[g.slot]+' · '+RARITY[g.rarity].label+state+'</span></div>'+
      '<div class="meta"><span>Power <b>'+g.power+'</b></span><span>Repairs <b>'+g.repairs+'</b></span><span>Worth <b>'+fmt(sellValue(g),true)+'</b></span></div>'+
      '<div class="durrow '+dc+'"><div class="bar"><span style="width:'+r*100+'%"></span></div><span class="num">'+g.dur+'/'+g.max+'</span></div>'+
      '<div class="acts">'+(S.pendingSell==='eq'
        ? '<button class="confirm" data-a="sellEq">Sell for '+plain(sellValue(g))+'</button><button data-a="sellCancel">Keep it</button>'
        : '<button data-a="repair" '+(!inTown()||g.dur>=g.max||S.gold<rc?'disabled':'')+'>Repair · '+fmt(rc,true)+'</button><button class="danger" data-a="sellAsk" '+(!inTown()?'disabled':'')+'>Sell…</button>')+
      '</div></div>';
  }
  document.getElementById('gear').innerHTML=h;
}

function renderJournal(){
  let h='', last=null;
  S.log.forEach(e=>{ if(e.d!==last){ h+='<li class="day">Day '+e.d+'</li>'; last=e.d; } h+='<li class="'+e.kind+'">'+esc(e.text)+'</li>'; });
  document.getElementById('log').innerHTML=h;
}

function renderAdv(){
  const head=document.getElementById('advhead'), body=document.getElementById('adv');
  if(S.trip){
    const j=job(S.trip.key);
    head.innerHTML='<h2>Adventure</h2><span class="label">In progress</span>';
    body.innerHTML='<div class="trip" style="--tc:'+TIER_COLOR[j.tier]+'"><div class="badge">'+ic(JOB_ICON[j.key])+'</div>'+
      '<div><h3>'+esc(j.name)+'</h3><div style="color:var(--muted)">'+esc(j.where)+' · '+Math.round(S.trip.c*100)+'% odds</div></div>'+
      '<div class="left" id="trip-left">0s</div><div class="bar"><span id="trip-bar" style="width:0%"></span></div>'+
      '<div class="beat" id="trip-beat">'+esc(S.trip.beat||'Your gear is out there getting dented. Back soon.')+'</div></div>';
    tick(); return;
  }
  if(S.phase==='evening'){
    head.innerHTML='<h2>Back in town</h2><span class="label">Evening, day '+S.day+'</span>';
    const opt=(name,list,cur)=>list.map(o=>'<label class="opt"><input type="radio" id="'+name+'-'+o.key+'" name="'+name+'" value="'+o.key+'" '+(o.key===cur?'checked':'')+'>'+
      '<span class="grow"><b>'+esc(o.name)+'</b><small>'+esc(o.note)+' · +'+o.energy+'</small></span><span>'+(o.cost?fmt(o.cost):'<span class="num" style="color:var(--muted)">free</span>')+'</span></label>').join('');
    const L=LODGING.find(x=>x.key===S.lodge), M=MEALS.find(x=>x.key===S.meal), cost=L.cost+M.cost, after=clamp(S.energy+L.energy+M.energy,0,100);
    body.innerHTML='<div class="eve"><fieldset><legend class="label">Lodging</legend>'+opt('lodge',LODGING,S.lodge)+'</fieldset>'+
      '<fieldset><legend class="label">Supper</legend>'+opt('meal',MEALS,S.meal)+'</fieldset></div>'+
      '<div class="sleepbar"><span>Tonight costs '+fmt(cost)+' · wake with <b class="num">'+after+'</b> energy</span>'+
      '<button class="primary" data-a="sleep" '+(S.gold<cost?'disabled':'')+'>'+(S.gold<cost?'Can\'t afford this':'Turn in for the night')+'</button></div>';
    return;
  }
  head.innerHTML='<h2>Adventures</h2><button data-a="rest" '+(S.ended?'disabled':'')+'>Rest day (+'+CFG.restBonus+' energy)</button>';
  let h='';
  if(S.event&&S.event.type==='merchant'&&S.eq[S.event.slot]){
    const g=S.eq[S.event.slot];
    h+='<div class="event"><span class="label">Traveling merchant</span><div>He has his eye on your <b>'+esc(g.name)+'</b> and offers '+fmt(S.event.offer)+', about 30% over the going rate.</div>'+
      '<div class="acts"><button class="primary" data-a="merchantYes">Take the coin</button><button data-a="merchantNo">No deal</button></div></div>';
  }
  h+='<div class="jobs">';
  S.offers.forEach(k=>{
    const j=job(k), c=chance(j), locked=c===0, oc=c>=.75?'hi':c>=.5?'md':'lo';
    const pay=Math.floor(j.pay[0]/100)+'–'+Math.floor(j.pay[1]/100)+'g';
    h+='<div class="job'+(locked?' locked':'')+'" style="--tc:'+TIER_COLOR[j.tier]+'">'+
      '<div class="badge">'+ic(JOB_ICON[j.key])+'</div>'+
      '<div class="ttl"><h3>'+esc(j.name)+'</h3><span class="tier">'+TIER_NAME[j.tier]+' · '+esc(j.where)+(!locked&&S.energy<j.energy?' · <span class="tired">Too tired, odds halved</span>':'')+'</span></div>'+
      '<div class="stats"><span>Pays<b>'+pay+'</b></span><span>Time<b>'+j.secs+'s</b></span><span>Wear<b>'+j.wear+'</b></span>'+
      '<span>Energy<b>−'+j.energy+'</b></span><span>Loot<b>'+Math.round(j.loot*100)+'%</b></span><span>Odds<b class="odds '+oc+'">'+(locked?'–':Math.round(c*100)+'%')+'</b></span></div>'+
      '<button class="go '+(locked?'':'primary')+'" data-a="job" data-id="'+j.key+'" '+(locked||S.ended?'disabled':'')+'>'+(locked?'Needs '+j.min:'Set out')+'</button></div>';
  });
  body.innerHTML=h+'</div>';
}

function renderBag(){
  const mats=S.bag.filter(i=>i.kind==='mat'), tab=S.bagTab||'loot';
  const tabs='<div class="tabs"><button class="tabbtn'+(tab==='loot'?' on':'')+'" data-a="tab" data-id="loot">Bag <span class="num">'+S.bag.length+'/'+CFG.bagSize+'</span></button>'+
    '<button class="tabbtn'+(tab==='supplies'?' on':'')+'" data-a="tab" data-id="supplies">Supplies <span class="num">'+S.rations+'</span></button></div>';
  if(tab==='supplies'){
    document.getElementById('baghead').innerHTML=tabs+'<span class="label">Rations</span>';
    const full=S.energy>=100;
    document.getElementById('bag').innerHTML='<div class="supply"><div class="cell" style="--rc:var(--gold);width:72px">'+ic('ration')+'<span class="qty num">'+S.rations+'</span></div>'+
      '<div style="min-width:0"><div class="nm" style="font-weight:700">Ration meal</div><p class="empty-note">Trail bread, hard cheese, and dried meat. Eat one any time, even on the road, for +'+CFG.rationEnergy+' energy.</p></div></div>'+
      '<div class="acts" style="margin-top:12px"><button class="primary" data-a="eatRation" '+(!S.rations||full||S.ended?'disabled':'')+'>'+(full?'Energy is full':'Eat one (+'+CFG.rationEnergy+')')+'</button>'+
      '<button data-a="buyRation" data-id="1" '+(S.gold<CFG.rationCost||S.ended?'disabled':'')+'>Buy 1 · '+fmt(CFG.rationCost)+'</button>'+
      '<button data-a="buyRation" data-id="5" '+(S.gold<CFG.rationCost*5||S.ended?'disabled':'')+'>Buy 5 · '+fmt(CFG.rationCost*5)+'</button></div>';
    return;
  }
  document.getElementById('baghead').innerHTML=tabs+
    '<button data-a="sellMats" '+(!mats.length||!inTown()?'disabled':'')+'>Sell materials'+(mats.length?' · '+fmt(mats.reduce((a,i)=>a+i.value,0),true):'')+'</button>';
  let h='<div class="bag">';
  for(let i=0;i<CFG.bagSize;i++){
    const it=S.bag[i];
    if(!it){ h+='<div class="cell blank"></div>'; continue; }
    const iconK=it.kind==='mat'?it.icon:it.slot;
    const up=it.kind==='gear'&&gearPower(it)>gearPower(S.eq[it.slot]);
    h+='<button class="cell'+(S.selBag===it.uid?' sel':'')+'" style="--rc:'+(it.kind==='mat'?'#6b7486':RARITY[it.rarity].c)+'" data-a="selBag" data-id="'+it.uid+'" aria-label="'+esc(it.name)+'">'+ic(iconK)+(up?'<span class="up">▲</span>':'')+'</button>';
  }
  h+='</div>';
  const it=S.bag.find(x=>x.uid===S.selBag);
  if(!it){
    h+='<p class="empty-note" style="margin-top:10px">'+(S.bag.length?'Select an item to sell or equip it.':'Adventures sometimes bring back materials and gear. They\'ll show up here.')+'</p>';
  } else if(it.kind==='mat'){
    h+='<div class="detail"><div class="nm">'+esc(it.name)+'</div><div class="meta"><span>Material · sells for <b>'+fmt(it.value)+'</b></span></div>'+
      '<div class="acts"><button class="primary" data-a="sellBag" '+(!inTown()?'disabled':'')+'>Sell · '+fmt(it.value,true)+'</button></div></div>';
  } else {
    const cur=S.eq[it.slot], diff=Math.round(gearPower(it)-gearPower(cur)), r=it.dur/it.max, dc=r<.25?'low':r<.5?'mid':'';
    h+='<div class="detail"><div class="nm" style="color:'+RARITY[it.rarity].c+'">'+esc(it.name)+'</div>'+
      '<div class="meta"><span>'+SLOT_NAME[it.slot]+' · '+RARITY[it.rarity].label+'</span><span>Power <b>'+it.power+'</b> <span style="color:'+(diff>0?'var(--good)':diff<0?'var(--bad)':'var(--muted)')+'">('+(diff>0?'+':'')+diff+' vs equipped)</span></span></div>'+
      '<div class="durrow '+dc+'"><div class="bar"><span style="width:'+r*100+'%"></span></div><span class="num">'+it.dur+'/'+it.max+'</span></div>'+
      '<div class="acts"><button class="primary" data-a="equip" '+(!inTown()?'disabled':'')+'>Equip</button><button data-a="sellBag" '+(!inTown()?'disabled':'')+'>Sell · '+fmt(sellValue(it),true)+'</button></div></div>';
  }
  document.getElementById('bag').innerHTML=h;
}

function farmText(g){
  if(g>=1) return 'Forty acres, a red barn, and a goat that hates you. You hang your old helm on the barn door.';
  if(g>=.75) return 'A tidy smallholding with a cottage and two cows. The first winter is tight, but you make it.';
  if(g>=.5) return 'A rented plot at the edge of town. You grow turnips. So many turnips.';
  if(g>=.25) return 'A hayloft above someone else\'s farm. You help with the harvest for room and board.';
  return 'Retirement was a nice idea. You\'re back at the docks, hauling crates.';
}
function renderEnd(){
  const el=document.getElementById('end');
  if(!S.ended){ el.innerHTML=''; return; }
  const sc=score();
  el.innerHTML='<div class="overlay"><div class="endcard" role="dialog" aria-label="Retirement">'+
    '<span class="label">The adventure is over</span><h2>Retired after '+S.day+' day'+(S.day===1?'':'s')+'</h2>'+
    '<p>'+esc(S.endReason)+'</p>'+starsHTML(sc.stars,'stars')+
    '<div class="num" style="font-size:1.1rem">'+sc.stars.toFixed(1)+' of 5 stars</div><p>'+farmText(sc.g)+'</p>'+
    '<div class="scorecard"><div><span class="label">Gold saved</span><b>'+plain(S.gold)+'</b></div>'+
    '<div><span class="label">Gold score · '+Math.round(CFG.goldWeight*100)+'%</span><b>'+Math.round(sc.g*100)+'%</b></div>'+
    '<div><span class="label">Longevity · '+Math.round((1-CFG.goldWeight)*100)+'%</span><b>'+Math.round(sc.l*100)+'%</b></div>'+
    '<div><span class="label">Days of '+CFG.targetDays+'</span><b>'+S.day+'</b></div></div>'+
    '<button class="primary" data-a="newrun">Play again</button></div></div>';
}

function render(){ renderTop(); renderGear(); renderJournal(); renderAdv(); renderBag(); renderEnd(); }

function tick(){
  if(!S||!S.trip) return;
  const el=Date.now()-S.trip.start, left=Math.max(0,S.trip.dur-el);
  if(left<=0){ resolveTrip(); save(); render(); return; }
  const t=S.trip, frac=el/t.dur;
  if(!t.script){ const j=job(t.key); t.script=buildScript(j); t.next=0; if(t.ok===undefined) t.ok=Math.random()<t.c; }
  if(t.script){
    let fired=false;
    while(t.next<t.script.length && frac>=t.script[t.next].at){ t.beat=storyText(t.script[t.next].t); log(t.beat,'story'); t.next++; fired=true; }
    if(fired){ renderJournal(); save(); const bt=document.getElementById('trip-beat'); if(bt) bt.textContent=t.beat; }
  }
  const b=document.getElementById('trip-bar'), l=document.getElementById('trip-left');
  if(b) b.style.width=(el/S.trip.dur*100)+'%';
  if(l) l.textContent=Math.ceil(left/1000)+'s';
}
setInterval(tick,200);

document.addEventListener('click',e=>{
  const b=e.target.closest('button[data-a]'); if(!b||b.disabled) return;
  const a=b.dataset.a; if(!A[a]) return;
  if(a!=='newrun-ask'&&a!=='newrun-no') S.askNew=false;
  A[a](b.dataset.id); save(); render();
});
document.addEventListener('change',e=>{
  if(e.target.name==='lodge') S.lodge=e.target.value;
  if(e.target.name==='meal') S.meal=e.target.value;
  save(); render();
});

S=load();
if(S && S.offers.length<CFG.boardSize) rollOffers();
if(!S){ S=newState(); startDay(); log('Day one of the last stretch. Five thousand gold buys a farm.'); save(); }
render();
