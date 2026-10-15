// ---------- Balance knobs (all money in copper: 1gp = 10sp = 100cp) ----------
const CFG = {
  goal: 50000,          // 500 gp retirement fund
  startGold: 1200,      // 12 gp in your pocket
  targetDays: 45,       // days for a full longevity score
  goldWeight: 0.7,      // star rating split
  rationCost: 10, rationEnergy: 15,
  restBonus: 15,
  repairGrowth: 1.6     // each repair on an item costs 1.6x the last
};
const LODGING = [
  {key:'inn',   name:'Room at the Rusty Flagon', cost:20, energy:35, note:'Real bed. Real door.'},
  {key:'rough', name:'Sleep rough',              cost:0,  energy:10, note:'Free, cold, damp.'}
];
const MEALS = [
  {key:'feast', name:'Hearty feast', cost:50, energy:20, note:'Roast, bread, and a second helping'},
  {key:'plate', name:'Tavern plate', cost:30, energy:12, note:'Whatever the cook made today'},
  {key:'stew',  name:'Thin stew',    cost:10, energy:5,  note:'Mostly water and hope'},
  {key:'skip',  name:'Skip supper',  cost:0,  energy:0,  note:'Your stomach files a complaint'}
];
const GEAR = [
  {id:'weapon', slot:'Weapon', name:'Emberbrand, the Old Flame', power:30, max:60, repairBase:800, sell:15000, legendary:true},
  {id:'armor',  slot:'Armor',  name:'Dented Mithral Hauberk',    power:14, max:80, repairBase:600, sell:4000},
  {id:'shield', slot:'Shield', name:'Kite Shield of the Third Company', power:10, max:50, repairBase:400, sell:2000},
  {id:'helm',   slot:'Helm',   name:'Owlcrest Helm',             power:6,  max:40, repairBase:300, sell:1200},
  {id:'boots',  slot:'Boots',  name:'Road-Worn Boots',           power:4,  max:35, repairBase:200, sell:300}
];
const WEAR_WEIGHT = {weapon:.4, armor:.25, shield:.15, helm:.1, boots:.1};
const JOBS = [
  {key:'docks',  name:'Haul crates at the docks', min:0,  pay:[100,250],   wear:1,  energy:20, blurb:'Honest work. Your back disagrees.'},
  {key:'rats',   name:'Clear rats from a cellar', min:8,  pay:[400,700],   wear:5,  energy:20, blurb:'Big rats. Not that big.'},
  {key:'goblins',name:'Run off a goblin camp',   min:20, pay:[900,1400],  wear:10, energy:28, blurb:'They throw rocks. Lots of rocks.'},
  {key:'escort', name:'Escort a spice caravan',  min:30, pay:[1400,2000], wear:13, energy:35, blurb:'Three days of road and one ambush, probably.'},
  {key:'ogre',   name:'Ogre bounty at Millbrook',min:42, pay:[2000,3000], wear:18, energy:40, blurb:'He took the miller\'s cart. And the miller.'},
  {key:'wyvern', name:'Raid a wyvern nest',      min:52, pay:[3200,4600], wear:26, energy:48, blurb:'Eggs fetch a fortune. Parents disagree.'},
  {key:'drake',  name:'Slay the Ashen Drake',    min:60, pay:[6500,9000], wear:42, energy:60, blurb:'The big one. Your gear will remember it.'}
];
const KEY = 'rust-retirement-v1';

// ---------- helpers ----------
const rand = (a,b)=>a+Math.floor(Math.random()*(b-a+1));
const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
function fmt(cp){
  cp=Math.max(0,Math.round(cp));
  const g=Math.floor(cp/100), s=Math.floor((cp%100)/10), c=cp%10, out=[];
  if(g) out.push(g.toLocaleString()+'<i class="gp">gp</i>');
  if(s) out.push(s+'<i class="sp">sp</i>');
  if(c||!out.length) out.push(c+'<i class="cp">cp</i>');
  return '<span class="num">'+out.join(' ')+'</span>';
}
const plain = cp => fmt(cp).replace(/<[^>]+>/g,'');
const esc = s => String(s).replace(/[&<>"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));

let S;
function newState(){
  return {day:1, phase:'morning', gold:CFG.startGold, energy:100, rations:2,
    gear:GEAR.map(g=>({...g, dur:g.max, repairs:0, sold:false})),
    offers:[], event:null, lodge:'inn', meal:'plate', pendingSell:null, askNew:false,
    log:[], ended:false, endReason:''};
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function load(){try{const r=localStorage.getItem(KEY);if(r){const s=JSON.parse(r);if(s&&s.gear)return s}}catch(e){}return null}

const live = ()=>S.gear.filter(g=>!g.sold&&g.dur>0);
function gearPower(g){ if(g.sold||g.dur<=0) return 0; return g.dur/g.max<.25 ? g.power/2 : g.power; }
const power = ()=>Math.round(S.gear.reduce((a,g)=>a+gearPower(g),0));
const repairCost = g=>Math.round(g.repairBase*Math.pow(CFG.repairGrowth,g.repairs));
function sellValue(g){ if(g.dur<=0) return Math.round(g.sell*.1); return Math.round(g.sell*(g.legendary?.6+.4*g.dur/g.max:.4+.6*g.dur/g.max)); }
function log(text,kind=''){ S.log.unshift({d:S.day,text,kind}); S.log=S.log.slice(0,60); }

function chance(job){
  const p=power();
  if(p<job.min) return 0;
  let c=.88+(p-job.min)*.008+(S.energy-60)*.004;
  if(S.energy<job.energy) c*=.5;
  return clamp(c,.1,.98);
}

function startDay(){
  const pool=JOBS.slice(1).sort(()=>Math.random()-.5).slice(0,3);
  S.offers=[JOBS[0].key,...pool.map(j=>j.key)].sort((a,b)=>JOBS.find(j=>j.key===a).min-JOBS.find(j=>j.key===b).min);
  S.event=null; S.pendingSell=null;
  if(S.day>1 && Math.random()<.28){
    const roll=Math.random(), intact=live();
    if(roll<.4 && intact.length){
      const g=intact[rand(0,intact.length-1)];
      S.event={type:'merchant', gearId:g.id, offer:Math.round(sellValue(g)*1.3)};
    } else if(roll<.6){
      const c=rand(100,300); S.gold+=c; log('You find a forgotten coin pouch in your pack: '+plain(c)+'.','good');
    } else if(roll<.8){
      S.energy=clamp(S.energy-15,0,100); log('Your knee is acting up this morning. Energy -15.','bad');
    } else {
      S.energy=clamp(S.energy+10,0,100); log('An old party member spots you and buys breakfast. Energy +10.','good');
    }
  }
}

function applyWear(total){
  const l=live(); if(!l.length||total<=0) return [];
  const w=l.map(g=>WEAR_WEIGHT[g.id]*(.7+Math.random()*.6)), sum=w.reduce((a,b)=>a+b,0), broke=[];
  l.forEach((g,i)=>{ const d=Math.max(total>=5?1:0,Math.round(total*w[i]/sum)); g.dur=Math.max(0,g.dur-d); if(g.dur===0) broke.push(g.name); });
  return broke;
}

function checkEnd(){
  if(!live().length){ S.ended=true; S.endReason='Your last piece of gear gave out. Time to hang it all up.'; log('Nothing left to fight with. You retire.','bad'); return true; }
  return false;
}

// ---------- actions ----------
const A = {
  job(key){
    const job=JOBS.find(j=>j.key===key), c=chance(job); if(!c) return;
    const ok=Math.random()<c;
    let pay=rand(job.pay[0],job.pay[1]), wear=job.wear;
    if(!ok){ pay=Math.round(pay*.25); wear=Math.round(wear*1.5); }
    S.gold+=pay; S.energy=clamp(S.energy-job.energy,0,100);
    const broke=applyWear(wear);
    log((ok?'Success: ':'It went badly: ')+job.name+'. Earned '+plain(pay)+'.',ok?'good':'bad');
    broke.forEach(n=>log(n+' breaks.','bad'));
    S.phase='evening';
    checkEnd();
  },
  rest(){ S.energy=clamp(S.energy+CFG.restBonus,0,100); log('You take the day off. Energy +'+CFG.restBonus+'.'); S.phase='evening'; },
  buyRation(){ if(S.gold<CFG.rationCost) return; S.gold-=CFG.rationCost; S.rations++; },
  eatRation(){ if(!S.rations||S.energy>=100) return; S.rations--; S.energy=clamp(S.energy+CFG.rationEnergy,0,100); },
  repair(id){
    const g=S.gear.find(x=>x.id===id), cost=repairCost(g);
    if(g.sold||g.dur>=g.max||S.gold<cost) return;
    S.gold-=cost; g.dur=g.max; g.repairs++;
    log('Repaired '+g.name+' for '+plain(cost)+'. Next repair: '+plain(repairCost(g))+'.');
  },
  sellAsk(id){ S.pendingSell=id; },
  sellCancel(){ S.pendingSell=null; },
  sell(id){
    const g=S.gear.find(x=>x.id===id); if(g.sold) return;
    const v=sellValue(g); S.gold+=v; g.sold=true; S.pendingSell=null;
    log('Sold '+g.name+' for '+plain(v)+'.','good');
    checkEnd();
  },
  merchantYes(){
    const e=S.event, g=S.gear.find(x=>x.id===e.gearId);
    S.gold+=e.offer; g.sold=true; S.event=null;
    log('A traveling merchant buys '+g.name+' for '+plain(e.offer)+'.','good');
    checkEnd();
  },
  merchantNo(){ log('You send the merchant on his way.'); S.event=null; },
  sleep(){
    const L=LODGING.find(x=>x.key===S.lodge), M=MEALS.find(x=>x.key===S.meal), cost=L.cost+M.cost;
    if(S.gold<cost) return;
    S.gold-=cost; S.energy=clamp(S.energy+L.energy+M.energy,0,100);
    log('Night '+S.day+': '+L.name.toLowerCase()+', '+M.name.toLowerCase()+'. Spent '+plain(cost)+'.');
    S.day++; S.phase='morning'; startDay();
  },
  retire(){ S.ended=true; S.endReason='You decide you\'ve had enough and walk away while you still can.'; log('You retire on your own terms.','good'); },
  'newrun-ask'(){ S.askNew=true; },
  'newrun-no'(){ S.askNew=false; },
  newrun(){ S=newState(); startDay(); log('Day one of the last stretch. Five hundred gold buys a farm.'); }
};

// ---------- scoring ----------
function score(){
  const days=S.day, g=clamp(S.gold/CFG.goal,0,1), l=clamp(days/CFG.targetDays,0,1);
  const stars=5*(CFG.goldWeight*g+(1-CFG.goldWeight)*l);
  return {days,g,l,stars:Math.round(stars*10)/10};
}
function farmText(g){
  if(g>=1) return 'Forty acres, a red barn, and a goat that hates you. You hang your old gear over the fireplace.';
  if(g>=.75) return 'A tidy smallholding with a cottage and two cows. The first winter is tight, but you make it.';
  if(g>=.5) return 'A rented plot at the edge of town. You grow turnips. So many turnips.';
  if(g>=.25) return 'A hayloft above someone else\'s farm. You help with the harvest for room and board.';
  return 'Retirement was a nice idea. You\'re back at the docks, hauling crates.';
}

// ---------- render ----------
function renderGoal(){
  const pct=clamp(S.gold/CFG.goal*100,0,100);
  document.getElementById('goal').innerHTML=
    '<div class="goal-row"><span class="label">Retirement fund</span><span>'+fmt(S.gold)+' <span style="color:var(--muted)">of</span> '+fmt(CFG.goal)+'</span></div>'+
    '<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+Math.round(pct)+'"><span style="width:'+pct+'%"></span></div>'+
    '<div class="goal-row" style="font-size:.85rem;color:var(--muted)"><span>Day <b class="num" style="color:var(--ink)">'+S.day+'</b></span><span>'+Math.round(pct)+'% of the farm</span></div>';
}

function gearCard(g){
  const ratio=g.dur/g.max, cls=ratio<.25?'low':ratio<.5?'mid':'';
  let state='';
  if(g.sold) state='<span class="chip">Sold</span>';
  else if(g.dur<=0) state='<span class="chip bad">Broken</span>';
  else if(ratio<.25) state='<span class="chip warn">Worn: half power</span>';
  const morning=S.phase==='morning'&&!S.ended;
  let actions='';
  if(!g.sold){
    if(S.pendingSell===g.id){
      actions='<button class="confirm" data-a="sell" data-id="'+g.id+'">Sell for '+plain(sellValue(g))+'</button><button data-a="sellCancel">Keep it</button>';
    } else {
      const rc=repairCost(g);
      actions='<button data-a="repair" data-id="'+g.id+'" '+((!morning||g.dur>=g.max||S.gold<rc)?'disabled':'')+'>Repair '+plain(rc)+'</button>'+
              '<button class="danger" data-a="sellAsk" data-id="'+g.id+'" '+(!morning?'disabled':'')+'>Sell…</button>';
    }
  }
  return '<div class="gear '+(g.legendary?'legendary ':'')+(g.sold?'sold':g.dur<=0?'broken':'')+'">'+
    '<div class="gtop"><span class="label">'+g.slot+'</span>'+state+'</div>'+
    '<div class="gname">'+esc(g.name)+'</div>'+
    '<div class="gstat"><span>Power <b class="num" style="color:var(--ink)">'+g.power+'</b></span><span>Repairs <b class="num" style="color:var(--ink)">'+g.repairs+'</b></span></div>'+
    (g.sold?'':'<div class="dur '+cls+'"><div class="bar"><span style="width:'+ratio*100+'%"></span></div><span class="num">'+g.dur+'/'+g.max+'</span></div>')+
    (actions?'<div class="gact">'+actions+'</div>':'')+
  '</div>';
}

function boardHTML(){
  if(S.phase==='evening') return eveningHTML();
  let h='<div class="daybar"><span class="label">Morning, day '+S.day+' · Job board</span><button data-a="rest">Take a rest day (+'+CFG.restBonus+' energy)</button></div>';
  if(S.event&&S.event.type==='merchant'){
    const g=S.gear.find(x=>x.id===S.event.gearId);
    h+='<div class="event"><span class="label">Traveling merchant</span><div>He has his eye on your <b>'+esc(g.name)+'</b> and offers '+fmt(S.event.offer)+'. That\'s about 30% over the going rate.</div>'+
       '<div class="row"><button class="primary" data-a="merchantYes">Take the coin</button><button data-a="merchantNo">No deal</button></div></div>';
  }
  S.offers.forEach(k=>{
    const j=JOBS.find(x=>x.key===k), c=chance(j), locked=c===0;
    const oc=c>=.75?'hi':c>=.5?'md':'lo';
    h+='<div class="job '+(locked?'locked':'')+'">'+
      '<h3>'+esc(j.name)+'</h3><p>'+esc(j.blurb)+'</p>'+
      '<button class="go '+(locked?'':'primary')+'" data-a="job" data-id="'+j.key+'" '+(locked?'disabled':'')+'>'+(locked?'Need '+j.min+' power':'Take job')+'</button>'+
      '<div class="meta"><span>Pays <b>'+fmt(j.pay[0])+'–'+fmt(j.pay[1])+'</b></span><span>Wear <b class="num">'+j.wear+'</b></span><span>Energy <b class="num">−'+j.energy+'</b></span>'+
      (locked?'':'<span>Odds <b class="odds '+oc+'">'+Math.round(c*100)+'%</b></span>')+
      (!locked&&S.energy<j.energy?'<span class="chip bad">Too tired: odds halved</span>':'')+'</div>'+
    '</div>';
  });
  return '<div class="board">'+h+'</div>';
}

function eveningHTML(){
  const opt=(name,list,cur)=>list.map(o=>{
    return '<label class="opt"><input type="radio" id="'+name+'-'+o.key+'" name="'+name+'" value="'+o.key+'" '+(o.key===cur?'checked':'')+'>'+
      '<span class="grow"><b>'+esc(o.name)+'</b><br><small>'+esc(o.note)+' · +'+o.energy+' energy</small></span><span>'+(o.cost?fmt(o.cost):'<span class="num" style="color:var(--muted)">free</span>')+'</span></label>';
  }).join('');
  const L=LODGING.find(x=>x.key===S.lodge), M=MEALS.find(x=>x.key===S.meal), cost=L.cost+M.cost, after=clamp(S.energy+L.energy+M.energy,0,100);
  return '<div class="board evening">'+
    '<div class="daybar"><span class="label">Evening, day '+S.day+'</span></div>'+
    '<fieldset><legend class="label">Lodging</legend>'+opt('lodge',LODGING,S.lodge)+'</fieldset>'+
    '<fieldset><legend class="label">Supper</legend>'+opt('meal',MEALS,S.meal)+'</fieldset>'+
    '<div class="daybar"><span>Tonight costs '+fmt(cost)+' · wake with <b class="num">'+after+'</b> energy</span>'+
    '<button class="primary" data-a="sleep" '+(S.gold<cost?'disabled':'')+'>'+(S.gold<cost?'Can\'t afford this':'Turn in for the night')+'</button></div>'+
  '</div>';
}

function purseHTML(){
  const lowE=S.energy<30;
  return '<div class="purse">'+
    '<div class="stat"><span class="label">Purse</span><span class="big">'+fmt(S.gold)+'</span></div>'+
    '<div class="stat energy '+(lowE?'low':'')+'"><div class="goal-row"><span class="label">Energy</span><span class="num">'+S.energy+'/100</span></div><div class="bar"><span style="width:'+S.energy+'%"></span></div></div>'+
    '<div class="stat"><div class="goal-row"><span class="label">Ration meals</span><span class="num">'+S.rations+'</span></div>'+
      '<div class="rrow"><button data-a="buyRation" '+(S.gold<CFG.rationCost||S.ended?'disabled':'')+'>Buy one · '+fmt(CFG.rationCost)+'</button>'+
      '<button data-a="eatRation" '+(!S.rations||S.energy>=100||S.ended?'disabled':'')+'>Eat one (+'+CFG.rationEnergy+')</button></div></div>'+
    '<div class="stat"><span class="label">Combat power</span><span class="big">'+power()+'</span><small style="color:var(--muted)">Gear under 25% durability fights at half power.</small></div>'+
    '<div class="ledger"><span>Gear still standing</span><span>'+live().length+'/5</span><span>1 gold</span><span>10 silver</span><span>1 silver</span><span>10 copper</span></div>'+
    '<button data-a="retire" '+(S.ended?'disabled':'')+'>Retire now</button>'+
  '</div>';
}

function endHTML(){
  const sc=score();
  return '<div class="end">'+
    '<span class="label">The adventure is over</span>'+
    '<h2>Retired after '+sc.days+' day'+(sc.days===1?'':'s')+'</h2>'+
    '<p>'+esc(S.endReason)+'</p>'+
    '<div class="stars" style="--f:'+(sc.stars/5*100)+'%" role="img" aria-label="'+sc.stars+' out of 5 stars"><span class="base">★★★★★</span><span class="fill">★★★★★</span></div>'+
    '<div class="num" style="font-size:1.2rem">'+sc.stars.toFixed(1)+' of 5 stars</div>'+
    '<p>'+farmText(sc.g)+'</p>'+
    '<div class="scorecard">'+
      '<div><span class="label">Gold saved</span><b>'+plain(S.gold)+'</b></div>'+
      '<div><span class="label">Gold score ('+Math.round(CFG.goldWeight*100)+'%)</span><b>'+Math.round(sc.g*100)+'%</b></div>'+
      '<div><span class="label">Longevity ('+Math.round((1-CFG.goldWeight)*100)+'%)</span><b>'+Math.round(sc.l*100)+'%</b></div>'+
      '<div><span class="label">Days of '+CFG.targetDays+'</span><b>'+sc.days+'</b></div>'+
    '</div>'+
    '<button class="primary" data-a="newrun">Play again</button>'+
  '</div>';
}

function render(){
  renderGoal();
  const main=document.getElementById('main');
  if(S.ended){ main.innerHTML=endHTML(); }
  else {
    main.innerHTML='<div class="grid">'+
      '<section class="col"><div class="colhead"><h2>Gear rack</h2><span class="label">'+live().length+' intact</span></div>'+S.gear.map(gearCard).join('')+'</section>'+
      '<section class="col"><div class="colhead"><h2>'+(S.phase==='morning'?'Today\'s work':'Back in town')+'</h2></div>'+boardHTML()+'</section>'+
      '<section class="col"><div class="colhead"><h2>Purse</h2></div>'+purseHTML()+'</section>'+
    '</div>';
  }
  document.getElementById('log').innerHTML=S.log.map(e=>'<li class="'+e.kind+'"><span class="d">Day '+e.d+'</span><span>'+esc(e.text)+'</span></li>').join('');
  const nr=document.querySelector('footer');
  nr.innerHTML=S.askNew
    ? '<span style="align-self:center;margin-right:10px;color:var(--muted)">Abandon this run?</span><button class="confirm" data-a="newrun">Yes, start over</button> <button data-a="newrun-no" style="margin-left:6px">Keep playing</button>'
    : '<button data-a="newrun-ask">Start a new run</button>';
}

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
if(!S){ S=newState(); startDay(); log('Day one of the last stretch. Five hundred gold buys a farm.'); save(); }
render();
