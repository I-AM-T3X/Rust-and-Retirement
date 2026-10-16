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
  rerollBase: 50,      // first board reroll each day costs 5 silver
  rerollGrowth: 2,     // each reroll after that costs 2x the last; resets every morning
  wearMult: 0.5,       // gear wear from quests (1 = full wear, .5 = half)
  safeRations: 3,      // eat more than this many rations in one day and you risk a stomach ache
  fatigueRisk: .05,    // each extra quest in one day adds 5% injury risk
  healCost: 2000,     // the healer charges 20g to treat one injury (rises with prices)
  priceStep: .25,      // lodging, food, rations and healing cost 25% more...
  priceEvery: 10,      // ...every 10 days
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
const SLOTS = ['weapon','armor','shield','helm','boots','trinket'];
const SLOT_NAME = {weapon:'Weapon',armor:'Armor',shield:'Shield',helm:'Helm',boots:'Boots',trinket:'Trinket'};
const BASE_POWER = {weapon:30,armor:14,shield:10,helm:6,boots:4,trinket:4};
const BASE_MAX = {weapon:60,armor:80,shield:50,helm:40,boots:35,trinket:50};
const WEAR_WEIGHT = {weapon:.4,armor:.25,shield:.15,helm:.1,boots:.1,trinket:.05}; // jewelry rarely takes a hit
const START_GEAR = [
  {slot:'weapon',name:'Emberbrand, the Old Flame',power:30,max:60,repairBase:8000,sell:250000,rarity:'legendary'},
  {slot:'armor', name:'Dented Mithral Hauberk',power:14,max:80,repairBase:6000,sell:40000,rarity:'epic'},
  {slot:'shield',name:'Kite Shield of the Third Company',power:10,max:50,repairBase:4000,sell:20000,rarity:'rare'},
  {slot:'helm',  name:'Owlcrest Helm',power:6,max:40,repairBase:3000,sell:12000,rarity:'rare'},
  {slot:'boots', name:'Road-Worn Boots',power:4,max:35,repairBase:2000,sell:3000,rarity:'common'},
  {slot:'trinket',name:'Lucky Coin Necklace',power:4,max:30,repairBase:2000,sell:1500,rarity:'rare',luck:.5}
];
const RARITY = {
  common:{label:'Common',c:'var(--r-common)',mult:1},
  rare:{label:'Rare',c:'var(--r-rare)',mult:1.15},
  epic:{label:'Epic',c:'var(--r-epic)',mult:1.3},
  legendary:{label:'Legendary',c:'var(--r-legendary)',mult:1.5}
};
// Lasting injuries from failed adventures
const INJURIES = [
  {key:'knee',name:'Bad Knee',desc:'-10 max energy',energy:-10,power:0,line:"Your knee twists the wrong way. It's never going to be quite right again."},
  {key:'back',name:'Thrown-Out Back',desc:'-8 max energy',energy:-8,power:0,line:"Something in your back goes pop. You walk home bent like a question mark."},
  {key:'ribs',name:'Cracked Ribs',desc:'-6 max energy -1 power',energy:-6,power:-1,line:"You feel a rib crack. Breathing is a whole project now."},
  {key:'shoulder',name:'Stiff Shoulder',desc:'-3 power',energy:0,power:-3,line:"Your sword arm won't lift past your ear anymore."},
  {key:'hand',name:'Shaky Hand',desc:'-2 power',energy:0,power:-2,line:"Your grip trembles now. You hope nobody noticed."},
  {key:'ear',name:'Ringing Ear',desc:'-2 power',energy:0,power:-2,line:"Your left ear won't stop ringing. You'll never hear the next ambush coming."}
];
// Seasons last 12 days each and decide the weather odds. Winter pays more.
const SEASON_DAYS = 12;
const SEASONS = [
  {name:'Spring',w:{clear:3,rain:3,fog:1,wind:2,storm:1}},
  {name:'Summer',w:{clear:4,heat:3,wind:2,storm:1}},
  {name:'Autumn',w:{clear:3,rain:2,fog:3,wind:1}},
  {name:'Winter',pay:1.15,w:{clear:2,snow:4,fog:1,storm:1}}
];
const WEATHER = {
  clear:{name:'Clear skies',desc:'No effects',wear:1,pay:1,energy:1,odds:0},
  rain:{name:'Rain',desc:'Gear wear +25%',wear:1.25,pay:1,energy:1,odds:0},
  heat:{name:'Heat wave',desc:'Energy costs +25%',wear:1,pay:1,energy:1.25,odds:0},
  fog:{name:'Thick fog',desc:'Odds -8%',wear:1,pay:1,energy:1,odds:-.08},
  wind:{name:'Good road weather',desc:'Energy costs -15%',wear:1,pay:1,energy:.85,odds:0},
  storm:{name:'Thunderstorm',desc:'Gear wear +40%, pay +15%',wear:1.4,pay:1.15,energy:1,odds:0},
  snow:{name:'Snow',desc:'Gear wear +25%, pay +20%',wear:1.25,pay:1.2,energy:1,odds:0}
};
// Farm savings milestones (copper)
const MILESTONES = [
  {at:100000,name:'A plot of land',line:"You could buy a plot of land now. Just dirt and a fence, but it'd be yours."},
  {at:200000,name:'A little cottage',line:"Enough for a little cottage. You picture a chair by the window."},
  {at:300000,name:'A red barn',line:"Enough for a barn. Red, obviously."},
  {at:400000,name:'Two dairy cows',line:"Enough for two dairy cows. You start thinking up names."},
  {at:500000,name:'The whole farm',line:"Five thousand gold. That's the whole farm. You could retire right now."}
];
// Goodbye lines when gear breaks
const GOODBYE = {
  'Emberbrand, the Old Flame':"Emberbrand cracks down the middle. Thirty years together. You remember the night you first pulled it from the forge.",
  'Dented Mithral Hauberk':"The Mithral Hauberk finally splits at the seams. It stopped a lot of arrows that had your name on them.",
  'Kite Shield of the Third Company':"The Kite Shield of the Third Company splinters. You trace the old company crest one last time.",
  'Owlcrest Helm':"The Owlcrest Helm caves in. Your old captain gave you that helm. You pry off the owl crest and keep it.",
  'Road-Worn Boots':"The Road-Worn Boots fall apart. They walked you across half the world. Barefoot it is.",
  'Lucky Coin Necklace':"The cord on your Lucky Coin Necklace finally snaps. That coin was your very first payday, thirty years ago. You tuck it in your pocket, but it doesn't feel lucky anymore."
};
const GOODBYE_LEGENDARY = "The {name} shatters. Legends don't last forever. Neither do you.";
const GOODBYE_GENERIC = ["Your {name} gives out. It had a good run.","The {name} breaks. You give it a respectful nod before tossing it.","The {name} is done for. Easy come, easy go."];

// secs = how long the adventure takes. loot = chance of materials, gearDrop = chance of a gear piece (on success)
const JOBS = [
  {key:"docks",tier:0,name:"Haul Crates",where:"The docks",min:0,secs:10,pay:[200,500],wear:4,energy:20,loot:0.03,gearDrop:0,mat:{name:"Crate of Salted Fish",icon:"crate",v:[300,600]},prefix:""},
  {key:"herbs",tier:0,name:"Gather Moonleaf",where:"Willow Hollow",min:0,secs:12,pay:[300,600],wear:4,energy:18,loot:0.05,gearDrop:0,mat:{name:"Bundle of Moonleaf",icon:"herb",v:[400,800]},prefix:""},
  {key:"rooster",tier:1,name:"Rooster Roundup",where:"Fenwick Farm",min:5,secs:14,pay:[700,1200],wear:3,energy:18,loot:0.06,gearDrop:0.01,mat:{name:"Prize Rooster Feather",icon:"feather",v:[600,1200]},prefix:"Barnyard"},
  {key:"rats",tier:1,name:"Cellar Rats",where:"Old Town",min:8,secs:15,pay:[800,1400],wear:5,energy:20,loot:0.06,gearDrop:0.01,mat:{name:"Bundle of Rat Pelts",icon:"pelt",v:[800,1500]},prefix:"Cellar-Found"},
  {key:"wolves",tier:1,name:"Wolf Pack",where:"Hollow Fen",min:12,secs:18,pay:[900,1500],wear:6,energy:24,loot:0.07,gearDrop:0.01,mat:{name:"Gray Wolf Pelt",icon:"pelt",v:[1000,1800]},prefix:"Wolfhide"},
  {key:"goblins",tier:2,name:"Goblin Camp",where:"Thornwood",min:20,secs:22,pay:[1800,2800],wear:10,energy:28,loot:0.08,gearDrop:0.02,mat:{name:"Goblin Trinkets",icon:"trinket",v:[1500,3000]},prefix:"Goblin-Made"},
  {key:"crypt",tier:2,name:"Restless Crypt",where:"Ashby Churchyard",min:24,secs:26,pay:[2000,3000],wear:11,energy:30,loot:0.08,gearDrop:0.02,mat:{name:"Grave Silver",icon:"gem",v:[2000,3500]},prefix:"Gravewarden's"},
  {key:"escort",tier:3,name:"Caravan Escort",where:"Salt Road",min:30,secs:30,pay:[3500,5000],wear:13,energy:35,loot:0.1,gearDrop:0.03,mat:{name:"Spice Sachet",icon:"sachet",v:[3000,5000]},prefix:"Caravan Guard's"},
  {key:"bridge",tier:3,name:"Bandit Toll Bridge",where:"Ferris Crossing",min:32,secs:30,pay:[3800,5200],wear:14,energy:34,loot:0.1,gearDrop:0.03,mat:{name:"Stolen Silverware",icon:"trinket",v:[3000,5000]},prefix:"Bridge Warden's"},
  {key:"mine",tier:3,name:"Haunted Mine",where:"Copperdeep",min:34,secs:32,pay:[3800,5500],wear:15,energy:36,loot:0.1,gearDrop:0.03,mat:{name:"Copper Ore Nugget",icon:"gem",v:[3500,5500]},prefix:"Miner's"},
  {key:"ogre",tier:4,name:"Ogre Bounty",where:"Millbrook",min:42,secs:38,pay:[5000,7500],wear:18,energy:40,loot:0.12,gearDrop:0.04,mat:{name:"Ogre Tusk",icon:"tusk",v:[5000,8000]},prefix:"Ogre-Hide"},
  {key:"troll",tier:4,name:"Swamp Troll",where:"Mirewater",min:45,secs:40,pay:[5200,8000],wear:20,energy:42,loot:0.12,gearDrop:0.04,mat:{name:"Matted Troll Horn",icon:"horn",v:[5500,8500]},prefix:"Trollhide"},
  {key:"wyvern",tier:5,name:"Wyvern Nest",where:"Gray Cliffs",min:52,secs:48,pay:[8000,11500],wear:26,energy:48,loot:0.14,gearDrop:0.05,mat:{name:"Wyvern Egg",icon:"egg",v:[9000,15000]},prefix:"Wyvernbone"},
  {key:"necro",tier:5,name:"The Hedge Necromancer",where:"Blackmoor",min:54,secs:50,pay:[8500,12000],wear:27,energy:50,loot:0.14,gearDrop:0.05,mat:{name:"Cursed Grimoire",icon:"skull",v:[10000,16000]},prefix:"Bone-Carved"},
  {key:"giant",tier:5,name:"Hill Giant's Toll",where:"The Highpass",min:56,secs:52,pay:[9000,12500],wear:30,energy:52,loot:0.15,gearDrop:0.05,mat:{name:"Giant's Toe Ring",icon:"gem",v:[11000,17000]},prefix:"Giantsteel"},
  {key:"rival",tier:6,name:"Old Rival's Last Duel",where:"Dunmore Arena",min:58,secs:58,pay:[15000,21200],wear:38,energy:55,loot:0.18,gearDrop:0.07,mat:{name:"Rival's Champion Medal",icon:"medal",v:[15000,25000]},prefix:"Rival's"},
  {key:"drake",tier:6,name:"The Ashen Drake",where:"Cinder Peak",min:60,secs:60,pay:[16200,22500],wear:42,energy:60,loot:0.18,gearDrop:0.07,mat:{name:"Ashen Drake Scale",icon:"scale",v:[18000,28000]},prefix:"Ashen"},
  {key:"mail",tier:0,name:"Deliver the Post",where:"Willowmere Road",min:0,secs:11,pay:[250,550],wear:4,energy:18,loot:0.04,gearDrop:0,mat:{name:"Lost Love Letter",icon:"scroll",v:[300,700]},prefix:""},
  {key:"sheep",tier:0,name:"Sheep Shearing",where:"Brambleton",min:0,secs:13,pay:[300,650],wear:4,energy:22,loot:0.05,gearDrop:0,mat:{name:"Bale of Wool",icon:"pelt",v:[400,800]},prefix:""},
  {key:"bees",tier:1,name:"Angry Beehive",where:"Honeyvale Orchard",min:6,secs:14,pay:[700,1200],wear:3,energy:20,loot:0.06,gearDrop:0.01,mat:{name:"Jar of Wild Honey",icon:"bottle",v:[700,1300]},prefix:"Beekeeper's"},
  {key:"pumpkin",tier:1,name:"Giant Pumpkin Haul",where:"Gourdfield",min:7,secs:16,pay:[800,1300],wear:4,energy:26,loot:0.06,gearDrop:0.01,mat:{name:"Prize Pumpkin Seeds",icon:"herb",v:[700,1200]},prefix:"Farmhand's"},
  {key:"spiders",tier:1,name:"Spider Nest",where:"Old Mill Loft",min:10,secs:17,pay:[900,1500],wear:6,energy:22,loot:0.07,gearDrop:0.01,mat:{name:"Spool of Spider Silk",icon:"web",v:[1000,1800]},prefix:"Silkspun"},
  {key:"tavern",tier:1,name:"Tavern Bouncer",where:"The Rusty Flagon",min:11,secs:16,pay:[900,1400],wear:5,energy:24,loot:0.07,gearDrop:0.01,mat:{name:"Lost Coin Purse",icon:"coin",v:[900,1600]},prefix:"Bouncer's"},
  {key:"kobolds",tier:2,name:"Kobold Tunnels",where:"Clayhill",min:18,secs:22,pay:[1700,2600],wear:9,energy:28,loot:0.08,gearDrop:0.02,mat:{name:"Chunk of Raw Amber",icon:"gem",v:[1500,2800]},prefix:"Kobold-Forged"},
  {key:"smugglers",tier:2,name:"Smugglers' Cove",where:"Saltmarsh",min:22,secs:24,pay:[1900,2900],wear:10,energy:30,loot:0.08,gearDrop:0.02,mat:{name:"Smuggled Brandy",icon:"bottle",v:[2000,3200]},prefix:"Smuggler's"},
  {key:"scarecrow",tier:2,name:"The Walking Scarecrow",where:"Harrow Fields",min:22,secs:24,pay:[1900,2800],wear:10,energy:28,loot:0.08,gearDrop:0.02,mat:{name:"Enchanted Straw",icon:"herb",v:[1800,3000]},prefix:"Harrowed"},
  {key:"boar",tier:2,name:"Great Tusked Boar",where:"Oakhollow Woods",min:26,secs:26,pay:[2100,3100],wear:12,energy:32,loot:0.09,gearDrop:0.02,mat:{name:"Boar Tusk",icon:"tusk",v:[2000,3500]},prefix:"Boarhide"},
  {key:"witch",tier:3,name:"The Bog Witch's Bargain",where:"Murkwater",min:32,secs:32,pay:[3800,5400],wear:14,energy:35,loot:0.1,gearDrop:0.03,mat:{name:"Witch's Potion",icon:"bottle",v:[3500,5500]},prefix:"Hexwoven"},
  {key:"lighthouse",tier:3,name:"Lighthouse Siege",where:"Gull Point",min:35,secs:34,pay:[4000,5800],wear:16,energy:36,loot:0.1,gearDrop:0.03,mat:{name:"Black Pearl",icon:"gem",v:[3500,6000]},prefix:"Tidecaller's"},
  {key:"tourney",tier:3,name:"Village Tourney",where:"Kingsbridge Green",min:36,secs:32,pay:[4000,5600],wear:15,energy:34,loot:0.1,gearDrop:0.03,mat:{name:"Tourney Ribbon",icon:"medal",v:[3000,5000]},prefix:"Champion's"},
  {key:"basilisk",tier:4,name:"Basilisk Den",where:"Stonefall Quarry",min:44,secs:40,pay:[5200,7800],wear:20,energy:42,loot:0.12,gearDrop:0.04,mat:{name:"Basilisk Eye",icon:"gem",v:[5500,8500]},prefix:"Stoneguard"},
  {key:"banditking",tier:4,name:"Bandit King's Fort",where:"Redcliff",min:46,secs:42,pay:[5500,8200],wear:21,energy:44,loot:0.12,gearDrop:0.04,mat:{name:"Bandit King's Signet",icon:"trinket",v:[6000,9000]},prefix:"Bandit King's"},
  {key:"manor",tier:4,name:"Haunted Manor",where:"Ravensworth Hall",min:48,secs:42,pay:[5800,8500],wear:20,energy:44,loot:0.12,gearDrop:0.04,mat:{name:"Spectral Locket",icon:"trinket",v:[6000,9500]},prefix:"Ghostly"},
  {key:"kraken",tier:5,name:"Kraken in the Harbor",where:"Port Merrow",min:55,secs:52,pay:[8800,12200],wear:28,energy:50,loot:0.14,gearDrop:0.05,mat:{name:"Barrel of Kraken Ink",icon:"bottle",v:[10000,16000]},prefix:"Krakenhide"},
  {key:"yeti",tier:5,name:"The Frostpeak Yeti",where:"Frostpeak Pass",min:56,secs:54,pay:[9200,12800],wear:30,energy:54,loot:0.15,gearDrop:0.05,mat:{name:"Yeti Fur",icon:"pelt",v:[11000,17000]},prefix:"Frostbound"},
  {key:"lich",tier:6,name:"The Drowned Lich",where:"Sunken Abbey",min:59,secs:58,pay:[15600,21900],wear:40,energy:56,loot:0.18,gearDrop:0.07,mat:{name:"Lich's Phylactery Shard",icon:"skull",v:[16000,26000]},prefix:"Lichbane"},
  {key:"reunion",tier:6,name:"One Last Dungeon",where:"Hollowdeep",min:60,secs:60,pay:[16900,23800],wear:44,energy:60,loot:0.18,gearDrop:0.07,mat:{name:"Ancient Crown",icon:"medal",v:[19000,29000]},prefix:"Hero's"}
];
// Story: each quest has two hand-written storylines (paths). One is picked per trip and played in order.
// {weapon} {shield} {armor} {helm} {boots} become your equipped gear, or a body part if that slot is empty.
const STORY = {
 "docks": {
  "go": [
   "The foreman at the docks takes one look at you and points at the biggest stack of crates."
  ],
  "paths": [
   [
    "You find a rhythm: lift, turn, stack. It's almost like swinging a sword, minus the glory.",
    "A crate of salted fish splits open on your shoulder. You smell like low tide for the rest of the shift."
   ],
   [
    "Two young dockhands bet you won't last until noon. By noon, they're the ones sitting down.",
    "A sailor recognizes you from an old wanted poster. He decides not to mention it, and neither do you."
   ]
  ],
  "win": [
   "The last crate thuds into the hold. The foreman grunts, which is the nicest thing he's ever said to anyone.",
   "The ship casts off on time. The foreman tosses you an apple with your pay."
  ],
  "lose": [
   "Your back seizes up halfway through the shift. You spend the afternoon on a barrel, watching younger men do your job.",
   "A crate of wine slips off your shoulder and bursts on the dock. The foreman takes it out of your pay."
  ]
 },
 "herbs": {
  "go": [
   "The apothecary hands you a basket, a pair of shears, and a drawing of moonleaf that could be any plant at all."
  ],
  "paths": [
   [
    "Moonleaf only grows in deep shade, which in Willow Hollow means the bottom of a muddy ravine.",
    "You fill half the basket before you realize your knees have locked up. Getting back up takes a while."
   ],
   [
    "A squirrel watches you work, chewing something smugly. You suspect it ate the good patch.",
    "You find a whole grove of moonleaf beside a stream. It's quiet here. You stay a little longer than you need to."
   ]
  ],
  "win": [
   "Your basket smells like mint and rain. The apothecary pays on the spot and asks if you're free next week."
  ],
  "lose": [
   "Half your basket turns out to be nettles. The apothecary laughs, sorts out the real moonleaf, and pays you for that."
  ]
 },
 "rooster": {
  "road": false,
  "go": [
   "Farmer Fenwick's prize rooster has escaped again, and this time he took the whole flock with him."
  ],
  "paths": [
   [
    "The rooster stands on a fence post and stares you down like a dragon would.",
    "You dive for a hen and come up with a mouthful of straw. Fenwick claps from the porch anyway."
   ],
   [
    "You corner the flock behind the barn. Twenty chickens look at you, then at each other, then scatter.",
    "Between dives, you notice the sign on Fenwick's gate. The farm is for sale. You file that away."
   ]
  ],
  "win": [
   "The last hen goes into the coop. The rooster gives you a long look of grudging respect."
  ],
  "lose": [
   "The rooster escapes into the woods with half the flock. Fenwick pays you for the hens you did catch."
  ]
 },
 "rats": {
  "go": [
   "The innkeeper hands you a torch, points at the cellar door, and locks it behind you. For safety, he says."
  ],
  "paths": [
   [
    "The squeaking starts the moment your torch reaches the bottom step. Hundreds of little eyes catch the light.",
    "A rat the size of a terrier goes for your ankle. {boots} save you from a nasty bite."
   ],
   [
    "Behind the ale barrels you find the nest, and on top of the nest, a rat wearing a bottle cap like a crown.",
    "The rat king squeaks an order and the whole cellar comes at you at once. {weapon} gets a workout."
   ]
  ],
  "win": [
   "The last rat flees through a crack in the wall. The innkeeper unlocks the door and hands you an ale before you ask."
  ],
  "lose": [
   "The swarm drives you back up the stairs. You pound on the door until the innkeeper lets you out, looking embarrassed for you."
  ]
 },
 "wolves": {
  "go": [
   "A shepherd at Hollow Fen says wolves have taken three sheep this week. He looks at your gray beard and sighs."
  ],
  "paths": [
   [
    "The howling starts at dusk, from every side of the fen at once.",
    "You build a fire and put your back to a rock. Old trick. The wolves circle just outside the light.",
    "The first one darts in and snaps at {armor}. Then the rest decide to try their luck."
   ],
   [
    "You follow tracks through the reeds until the mud is up to your shins.",
    "The pack leader steps out of the fog. Huge, gray, missing an ear. It looks about as tired as you.",
    "It lunges. You catch its jaws on {shield} and shove it back into the reeds."
   ]
  ],
  "win": [
   "The pack scatters across the fen and doesn't come back. The shepherd gives you a wheel of cheese on top of your pay."
  ],
  "lose": [
   "The wolves wear you down until you have to fall back to the farm. The shepherd pays you for trying and starts building a taller fence."
  ]
 },
 "goblins": {
  "go": [
   "You head into Thornwood. The goblin camp isn't hard to find. You can smell their stew from a mile away."
  ],
  "paths": [
   [
    "A sentry spots you and screams. Every goblin in camp grabs the nearest rock.",
    "Rocks rain down. One rings off {helm} hard enough to make your ears whistle.",
    "A goblin in a cooking pot helmet yells something about your age. His friends think it's hilarious."
   ],
   [
    "You walk right into camp while they're eating. Thirty goblins freeze with their spoons halfway up.",
    "You kick over the stew pot. That turns out to be the worst insult in all of goblin culture.",
    "Their chieftain charges you on a very confused goat. You sidestep, and the goat keeps going."
   ]
  ],
  "win": [
   "The goblins scatter into the trees, shouting that this isn't over. It's over.",
   "The chieftain surrenders, sulking. You let him keep the goat."
  ],
  "lose": [
   "There are three times as many goblins as the bounty said. You retreat through the trees with rocks bouncing off you the whole way."
  ]
 },
 "crypt": {
  "go": [
   "The priest at Ashby hands you a bucket of holy water and stays well outside the churchyard gate."
  ],
  "paths": [
   [
    "The crypt door groans open. Something deep inside groans back.",
    "Skeletons climb out of the walls, their bones clacking like wind chimes.",
    "A bony hand clamps onto {armor} and won't let go, even after the rest of the skeleton falls apart."
   ],
   [
    "Candles light themselves one by one down the hallway as you walk. That's never a good sign.",
    "You pass the tomb of an old party member and stop for a moment, even with the dead closing in.",
    "The holy water works great, right up until the bucket runs dry."
   ]
  ],
  "win": [
   "The last skeleton crumbles and the crypt goes still. The priest blesses you twice, just to be safe."
  ],
  "lose": [
   "There are too many restless dead. You back out, slam the door, and help the priest nail it shut."
  ]
 },
 "escort": {
  "go": [
   "The spice caravan rolls out onto the Salt Road. Six wagons, four nervous merchants, and you."
  ],
  "paths": [
   [
    "The first day is quiet. Too quiet, says the cook. He says that every day.",
    "A wagon wheel cracks on a rock, and you spend an hour holding the wagon up while they fix it.",
    "Bandits on the ridge! Arrows thud into the wagons, and one sticks in {shield}.",
    "In the middle of the ambush, the spice merchant tries to renegotiate your pay."
   ],
   [
    "A sandstorm rolls in, and you march with your eyes squeezed shut and one hand on the lead wagon.",
    "The merchant's daughter asks for war stories every night. You tell her the good ones and leave out the rest.",
    "On the third night you hear footsteps in the dark. You're up with {weapon} before the bandits reach the wagons.",
    "The bandit leader is just a kid. You give him one chance to run."
   ]
  ],
  "win": [
   "The caravan rolls into town with every wagon intact. The merchant's daughter gives you a drawing of the fight. You keep it."
  ],
  "lose": [
   "The bandits make off with two wagons of pepper. The merchants pay you, barely, and complain the whole time."
  ]
 },
 "bridge": {
  "go": [
   "Bandits have taken the bridge at Ferris Crossing and are charging a toll. You go to pay it. With your fists."
  ],
  "paths": [
   [
    "The bandit boss says the toll is five silver. You tell him the toll is now you.",
    "Two of his men rush you at once. A club bounces off {helm} and you see stars.",
    "Someone goes over the railing into the river. For once, it isn't you.",
    "The boss pulls out a crossbow. You pull out thirty years of experience."
   ],
   [
    "You walk up slowly, like a tired old man, which isn't hard. The bandits don't even stand up.",
    "You knock the first one into the river before the others realize what's happening.",
    "The rest come at you swinging. {armor} takes a beating, but it holds.",
    "A farmer with a cart waits patiently for the fight to finish so he can cross."
   ]
  ],
  "win": [
   "The bandits jump into the river and swim for it. The farmer crosses for free and tips his hat to you."
  ],
  "lose": [
   "You end up in the river, soaked and sore. The bandits laugh, but they're gone from the bridge by morning anyway."
  ]
 },
 "mine": {
  "go": [
   "The miners at Copperdeep say the lower tunnels are haunted. Nobody has gone down there in weeks."
  ],
  "paths": [
   [
    "Your lantern finds old pickaxes lying exactly where they were dropped.",
    "Ghostly tapping echoes up from deep in the rock, steady as a heartbeat.",
    "An ore cart rolls at you on its own. You dive out of the way and land hard on {armor}.",
    "A pale shape drifts out of the wall. It's an old miner, still swinging his pick at nothing."
   ],
   [
    "The air gets colder with every ladder you climb down.",
    "Part of the ceiling caves in behind you. You'll need another way out.",
    "The ghost passes straight through {helm}. It feels like having your head dunked in a frozen lake.",
    "He only wants someone to finish his last shift. He was three carts short."
   ]
  ],
  "win": [
   "You fill the last three carts with him. The old miner smiles, tips his helmet, and finally fades away. The tunnels go quiet."
  ],
  "lose": [
   "Your lantern runs out of oil. You feel your way back to daylight, and the tapping follows you the whole way up."
  ]
 },
 "ogre": {
  "go": [
   "You reach Millbrook. The miller's cart is upside down in a tree, and the miller is missing."
  ],
  "paths": [
   [
    "You follow footprints the size of washtubs and a trail of half-eaten cabbages.",
    "The ogre is napping on a pile of flour sacks. He wakes up grumpy.",
    "He swings an entire fence post. {shield} takes the hit, and your arm goes numb to the elbow.",
    "He grabs you by the ankle and dangles you upside down. You've been here before. You know what to do."
   ],
   [
    "You find the miller first, tied up in a sack and very annoyed about it.",
    "The ogre comes back with an armful of stolen pies and catches you untying his lunch.",
    "He sneezes, and a cloud of flour blinds you both. You fight by sound.",
    "His fist catches {armor} and sends you rolling into the reeds by the millpond."
   ]
  ],
  "win": [
   "The ogre goes down with a thud that rattles every window in Millbrook. The miller bakes you a loaf of bread the size of a shield."
  ],
  "lose": [
   "The ogre tosses you into the millpond. You get the miller out, but the ogre wanders off with the pies."
  ]
 },
 "troll": {
  "go": [
   "You wade into Mirewater. The mud tries to steal {boots} with every step."
  ],
  "paths": [
   [
    "The smell hits you long before the troll does.",
    "It rises out of the bog, dripping and grinning, with half a canoe stuck in its teeth.",
    "You cut it. It heals. You cut it again. It heals again. This is going to take a while.",
    "Its fist slams into {armor} and you fly backward into the muck."
   ],
   [
    "Leeches find their way into places leeches should never be.",
    "You remember the old rule about trolls. Fire or acid. You brought neither.",
    "You lure it toward a dead tree and hope your plan is better than it sounds.",
    "It swipes at you and catches {shield}, nearly tearing it off your arm."
   ]
  ],
  "win": [
   "You bring the dead tree down on it and set the whole thing ablaze. The troll doesn't get back up this time."
  ],
  "lose": [
   "The troll just won't stay down. You crawl out of the swamp and spend an hour picking off leeches."
  ]
 },
 "wyvern": {
  "go": [
   "You start the long climb up the Gray Cliffs. The wind does its best to peel you off the rock."
  ],
  "paths": [
   [
    "Halfway up, a shadow passes over you. Then it circles back for a better look.",
    "You haul yourself onto the ledge and find the nest. Eggs, bones, and one very angry parent.",
    "The wyvern screams and dives. You get {shield} up just as the claws hit.",
    "Its tail whips around, stinger first, and misses your face by the width of a finger.",
    "You drive {weapon} into its wing, and it lurches off the ledge, shrieking."
   ],
   [
    "The handholds are slick with rain. Your fingers ache, and your knees file a formal complaint.",
    "Near the top, you find the bones of the last adventurer who tried this. Bad sign.",
    "The wyvern lands between you and the nest, wings spread as wide as a barn.",
    "Its tail catches {armor} and slams you against the cliff face.",
    "You hang off the edge by one hand for a long, long moment."
   ]
  ],
  "win": [
   "The wyvern flees into the clouds. You climb down slowly with the loot strapped to your back."
  ],
  "lose": [
   "The wyvern drives you off the ledge. You slide most of the way down the cliff on your backside."
  ]
 },
 "necro": {
  "go": [
   "Blackmoor is empty of the living. A man in robes has been raising the village dead to plow his fields."
  ],
  "paths": [
   [
    "Zombies in straw hats shamble across the furrows. Some of them are honestly pretty good at farming.",
    "The necromancer sees you coming and sighs. He was hoping for a quiet day.",
    "A wall of bone erupts from the ground. You smash through it, and {weapon} comes out chipped.",
    "He tries to raise a skeleton dragon. He only gets the tail, which flops around uselessly.",
    "Up close, you realize he's about your age. He says he's retiring after this harvest too."
   ],
   [
    "The fog in Blackmoor is cold and thick, and it smells like turned earth.",
    "Dead farmhands stop working as you pass and turn their heads to watch you.",
    "Cold magic washes over you. Your bones ache more than usual. A lot more.",
    "A skeletal plow horse charges you. {shield} catches its skull and sends it tumbling.",
    "The necromancer offers you tea. You both know how this ends, but you take the tea."
   ]
  ],
  "win": [
   "The necromancer surrenders and agrees to try regular farming. The dead of Blackmoor lie back down in their graves."
  ],
  "lose": [
   "His undead farmhands chase you off the fields. Honestly, they're better farmers than you'll ever be."
  ]
 },
 "giant": {
  "go": [
   "A hill giant has parked himself across the Highpass, and nobody gets through without paying."
  ],
  "paths": [
   [
    "He's sitting on a boulder, picking his teeth with a pine tree.",
    "He spots you and throws a rock the size of a cottage. You dive behind a smaller rock.",
    "His foot comes down right beside you, and the whole mountainside shakes.",
    "You climb his leg. He swats at you like a mosquito and catches {armor}.",
    "From his shoulder, you can see the whole valley. It's beautiful. You hit him in the ear."
   ],
   [
    "He challenges you to a riddle contest before any fighting. You lose the riddle contest.",
    "Turns out he's lonely and just wants someone to talk to. You talk for an hour.",
    "Then he asks for the toll, and the conversation is over.",
    "His club whistles down. {shield} takes it, and you skid back three paces.",
    "You go for his ankle, the same way you did with his cousin twenty years ago."
   ]
  ],
  "win": [
   "The giant topples off the pass with a boom you feel in your teeth. The road is open again."
  ],
  "lose": [
   "The giant kicks you all the way back down the mountain path. The merchants will still have to go around."
  ]
 },
 "rival": {
  "go": [
   "A letter arrives sealed with an old crest. Your rival from the old days wants one last duel at Dunmore Arena."
  ],
  "paths": [
   [
    "The crowd is bigger than you expected. Someone is selling roasted nuts with your face on the bag.",
    "Your rival steps onto the sand. Older, grayer, and still smug.",
    "He opens with the same move he used thirty years ago. You still remember the counter.",
    "Steel rings on steel, and his blade bites into {armor}.",
    "The crowd starts chanting your old nickname. You'd forgotten it. You'd forgotten them."
   ],
   [
    "You run into him in the tunnel before the bout. Neither of you says anything for a long moment.",
    "The first exchange is fast and ugly. You're both slower than you used to be. Neither of you mentions it.",
    "His blade glances off {helm}, and the crowd gasps.",
    "You both stop to catch your breath at the same time and almost laugh.",
    "He tells you, quietly, that he's retiring after this too. A vineyard, he says."
   ]
  ],
  "win": [
   "You disarm him with the last of your strength. He laughs, shakes your hand, and invites you to visit the vineyard.",
   "The crowd roars. Your rival bows to you for the first time in thirty years."
  ],
  "lose": [
   "He knocks you flat, then offers you a hand up. The crowd cheers for you anyway.",
   "You lose, but it's the best fight you've had in years. He buys the drinks after."
  ]
 },
 "drake": {
  "go": [
   "You climb Cinder Peak. The rocks are warm. Then hot. Then you stop touching them."
  ],
  "paths": [
   [
    "The Ashen Drake opens one eye as you crest the ridge. It remembers you. You remember it.",
    "Fire rolls over the ridge, and the only thing between you and it is {shield}.",
    "You land a hit that would've made your younger self proud.",
    "Its claws rake across {armor}. The sound is awful.",
    "It roars so loud the rocks start to slide. You keep your footing. Barely."
   ],
   [
    "Old instincts kick in. This is the kind of job you used to live for.",
    "You spot the scar you gave it decades ago, right above its left eye.",
    "It spots yours, too.",
    "Its tail sweeps the ledge and catches {boots}, nearly sending you over the edge.",
    "Your lungs burn. Your arms burn. Honestly, everything burns."
   ]
  ],
  "win": [
   "The Ashen Drake crashes down the mountainside. You sit on a warm rock for a long time, just breathing.",
   "The drake falls. Down in the valley, people watch the smoke over Cinder Peak finally stop."
  ],
  "lose": [
   "The drake's fire drives you off the peak. You live, which is more than most can say."
  ]
 },
 "mail": {
  "go": [
   "The postmaster hands you a sack of letters and a map with half the roads crossed out."
  ],
  "paths": [
   [
    "A farm dog chases you down the lane. You haven't run that fast since the goblin wars.",
    "Old Widow Pell invites you in for tea. Nobody says no to Widow Pell."
   ],
   [
    "One of the letters is addressed to you. It's a bill from twenty years ago.",
    "A farmer asks you to read his letter aloud. It's from his mother. You both get a little misty."
   ]
  ],
  "win": [
   "Every letter delivered. The postmaster says you're the fastest carrier he's had all year. He's had two."
  ],
  "lose": [
   "You drop the sack crossing a creek. Half of Willowmere is getting soggy mail this week."
  ]
 },
 "sheep": {
  "road": false,
  "go": [
   "The farmers at Brambleton need help with shearing. The sheep have not agreed to this."
  ],
  "paths": [
   [
    "The first ewe kicks you square in the chest. You respect it.",
    "You pin a ram down. It looks at you like you owe it money."
   ],
   [
    "There is wool in places wool should never be.",
    "A lamb follows you around all morning. You catch yourself pricing out sheep for your own farm."
   ]
  ],
  "win": [
   "The whole flock is sheared. The sheep look naked and furious. The farmers look delighted."
  ],
  "lose": [
   "The flock breaks through the fence and scatters across three fields. The farmers sigh and pay you anyway."
  ]
 },
 "bees": {
  "go": [
   "The keeper at Honeyvale Orchard says the bees have gone wild, and nobody can get near the apples."
  ],
  "paths": [
   [
    "The hive is the size of a hay wagon, and the buzzing is the size of a war.",
    "A bee crawls inside {helm}. Then a few of its friends join it."
   ],
   [
    "You light a smoke pot. The bees get drowsy. So do you.",
    "One gets you right on the nose. It swells up like a turnip."
   ]
  ],
  "win": [
   "The swarm settles into a new hive box. The keeper sends you home with a jar of honey on top of your pay."
  ],
  "lose": [
   "You sprint for the river with half the hive behind you. You come out puffy, but alive."
  ]
 },
 "pumpkin": {
  "road": false,
  "go": [
   "Gourdfield grew a pumpkin the size of a cart, and the fair is tomorrow. They need someone with a strong back."
  ],
  "paths": [
   [
    "You try to lift it. It doesn't move. You try again, with your legs this time.",
    "Three farmers push, you pull, and the pumpkin finally rolls onto the cart. The axle groans. So do you."
   ],
   [
    "A crow lands on top of the pumpkin and refuses to leave. It rides along the whole way.",
    "Hauling it down the road, you can't stop thinking about what you'll plant on your own farm."
   ]
  ],
  "win": [
   "The pumpkin wins first prize at the fair. The farmers carry you around on their shoulders for a minute."
  ],
  "lose": [
   "The pumpkin rolls off the cart and down the hill. You chase it all the way to the river. It floats."
  ]
 },
 "spiders": {
  "go": [
   "The miller says something has moved into the old mill loft. Something with a lot of legs."
  ],
  "paths": [
   [
    "Webs hang from every beam, thick as curtains.",
    "You hear tiny feet skittering above you. Then you hear big feet.",
    "A spider the size of a dog drops down right in front of your face. {weapon} is already moving."
   ],
   [
    "You climb the ladder slowly. The rungs are sticky.",
    "Webbing gets all over {armor}. You'll be picking it off for weeks.",
    "Behind the millstone, you find a pile of wrapped-up flour sacks. The miller will be thrilled."
   ]
  ],
  "win": [
   "The loft is cleared out and quiet. The miller says he'll finally get a good night's sleep."
  ],
  "lose": [
   "You get so tangled in web that the miller has to cut you loose with a bread knife."
  ]
 },
 "tavern": {
  "go": [
   "The Rusty Flagon needs a bouncer tonight. A ship full of sailors just made port."
  ],
  "paths": [
   [
    "The first fight breaks out before you've even found a stool.",
    "A sailor swings a chair at you. {armor} takes most of it. The chair takes the rest."
   ],
   [
    "You toss two brawlers out the front door. They come back in through the window.",
    "Someone recognizes you from the old days and buys a round for the whole room. The fighting stops for exactly one song."
   ]
  ],
  "win": [
   "By closing time, the Flagon is still mostly standing. The owner calls that a win and pays you double."
  ],
  "lose": [
   "The brawl spills into the street and takes out the front window. The owner pays you, but he isn't happy about it."
  ]
 },
 "kobolds": {
  "go": [
   "Kobolds have tunneled under Clayhill, and the houses are starting to sink."
  ],
  "paths": [
   [
    "The tunnels are kobold sized. You are very much not kobold sized.",
    "Tiny traps snap shut all around you. One clamps onto {boots}.",
    "A kobold yells something from the dark, and his friends cackle."
   ],
   [
    "You crawl on your elbows through the clay, cursing every inch.",
    "A section of tunnel collapses and buries {helm} in dirt.",
    "Deep inside, you find their boss sitting on a throne made of stolen spoons."
   ]
  ],
  "win": [
   "The kobolds pack up and move to a different hill. Clayhill throws you a small but heartfelt party."
  ],
  "lose": [
   "You crawl out of a collapsed tunnel covered head to toe in clay. The kobolds are still down there."
  ]
 },
 "smugglers": {
  "go": [
   "The harbor guard at Saltmarsh thinks smugglers are using an old sea cave. They want someone to check it out quietly."
  ],
  "paths": [
   [
    "You wade in at low tide. The water is cold enough to stop your heart.",
    "You hear voices and barrels rolling over stone. Then a smuggler spots you and blows a whistle. So much for quiet.",
    "A cutlass bounces off {shield}. Close one."
   ],
   [
    "The cave is lit with stolen lanterns and stacked high with untaxed brandy.",
    "You hide behind a barrel and listen. They're planning a big run tonight.",
    "The captain finds you and offers you a cut. It's tempting. It's very tempting."
   ]
  ],
  "win": [
   "The smugglers are rounded up and the guard seizes the whole stash. They let you keep a bottle of brandy for your trouble."
  ],
  "lose": [
   "The tide comes in and you have to swim out empty-handed. The smugglers wave goodbye from their boat."
  ]
 },
 "scarecrow": {
  "road": false,
  "go": [
   "The farmers at Harrow Fields swear their scarecrow has been walking around at night."
  ],
  "paths": [
   [
    "The scarecrow is gone from its post. Straw footprints lead into the corn.",
    "Crows circle overhead, cawing like they're trying to warn you.",
    "It steps out of the corn and tilts its burlap head at you."
   ],
   [
    "You wait in the field until dark. The corn starts rustling with no wind.",
    "It hits a lot harder than straw should. {armor} takes the blow.",
    "You spot a hedge witch's charm stitched into its coat."
   ]
  ],
  "win": [
   "You rip out the charm and the scarecrow slumps over, just straw again. The farmers put it back on its post, a little nervously."
  ],
  "lose": [
   "The scarecrow chases you all the way out of the cornfield. The farmers decide to leave it alone for now."
  ]
 },
 "boar": {
  "go": [
   "A boar the size of a horse has been tearing up Oakhollow Woods, and the hunters won't go near it."
  ],
  "paths": [
   [
    "You follow a trail of uprooted trees. That's a big boar.",
    "It explodes out of the brush faster than anything that big has any right to move.",
    "Its tusks catch {shield} and lift you clean off your feet."
   ],
   [
    "You climb a tree to catch your breath. Your knees hate you for it.",
    "The boar circles the tree below, snorting and waiting.",
    "You drop onto its back with {weapon} ready. It does not appreciate that."
   ]
  ],
  "win": [
   "The great boar finally goes down. The hunters tell the story all night, and it gets bigger every time."
  ],
  "lose": [
   "The boar chases you clear out of the woods. You decide that's the boar's forest now."
  ]
 },
 "witch": {
  "go": [
   "The Bog Witch of Murkwater has been cursing travelers. The town wants her gone. Or at least quieter."
  ],
  "paths": [
   [
    "Her hut stands on chicken legs. It turns to look at you as you come up the path.",
    "She meets you at the door and offers you a deal. You can't tell if she's joking.",
    "A curse hits {armor}, and frost spreads across it in a heartbeat.",
    "Her cauldron boils over, and the whole bog smells like hot socks."
   ],
   [
    "Bog lights float over the water, trying to lead you off the path.",
    "She asks what you're planning to do once you retire. You tell her about the farm.",
    "She goes quiet for a while. Then she asks what you're planning to grow.",
    "Her cat hisses at you the entire time. It seems to be the one in charge."
   ]
  ],
  "win": [
   "You strike a bargain. She leaves travelers alone, and you send her a basket of vegetables every harvest."
  ],
  "lose": [
   "She turns your hair green and sends you packing. It washes out after a few days. Mostly."
  ]
 },
 "lighthouse": {
  "go": [
   "Something has been climbing out of the sea at night and attacking the lighthouse at Gull Point."
  ],
  "paths": [
   [
    "The keeper is barricaded at the top. He waves at you, then points frantically down.",
    "Crab men scuttle up the rocks, clacking their claws in rhythm.",
    "A wave crashes over you and almost drags you off the cliff.",
    "A claw clamps down on {shield}. It takes three tries to shake it loose."
   ],
   [
    "You climb the spiral stairs to the lamp room. The keeper has been up there for three days.",
    "The lamp goes dark. You fight by moonlight.",
    "Something big comes out of the water behind the crab men. It's their queen.",
    "Her pincer catches {helm}, and your ears ring for a week."
   ]
  ],
  "win": [
   "The last crab man drops back into the sea and the lamp flickers on. Every ship in the harbor rings its bell for you."
  ],
  "lose": [
   "You hold them off long enough for the keeper to escape, but the crab men take the lighthouse."
  ]
 },
 "tourney": {
  "go": [
   "Kingsbridge is holding its village tourney, and the prize money is real. The other fighters are a third your age."
  ],
  "paths": [
   [
    "A young knight laughs out loud when you sign up. You remember his face.",
    "Your first opponent goes down in two swings. The crowd starts paying attention.",
    "The joust is rough. A lance cracks against {shield} and splinters.",
    "Between rounds, a kid asks if you're a real adventurer. You tell him you used to be."
   ],
   [
    "You stretch for a long time before the first bout. The young fighters snicker. You let them.",
    "Your second opponent is fast but sloppy. You wait for the mistake.",
    "A blunted sword clips {helm} and you go down on one knee.",
    "The final match is against the knight who laughed. You stop being polite."
   ]
  ],
  "win": [
   "You win the whole tourney. The young knight shakes your hand and asks for tips. You give him one."
  ],
  "lose": [
   "You lose in the final, but the crowd is chanting your name as you limp off the field."
  ]
 },
 "basilisk": {
  "go": [
   "Workers at Stonefall Quarry keep turning to stone. Everyone knows what that means."
  ],
  "paths": [
   [
    "The quarry is full of statues. Very lifelike statues, with very surprised faces.",
    "You polish {shield} to a mirror shine. Old trick.",
    "You hear it slithering just around the next boulder.",
    "You fight with your eyes half closed, going by sound alone."
   ],
   [
    "You find the foreman frozen mid-sneeze. You promise him you'll get him out.",
    "The basilisk's gaze catches {boots}, and your toes go numb and gray.",
    "You kick up a cloud of quarry dust and charge through it.",
    "It hisses, and the stone around you starts to crack."
   ]
  ],
  "win": [
   "The basilisk catches its own reflection and turns to stone. One by one, the quarry workers start to move again."
  ],
  "lose": [
   "You retreat before you become a lawn ornament. Your left foot stays numb for a day."
  ]
 },
 "banditking": {
  "go": [
   "The Bandit King has built a fort at Redcliff and taxes everyone who passes. The duke wants him gone."
  ],
  "paths": [
   [
    "You scale the back wall while the guards argue about whose turn it is to cook.",
    "The Bandit King is younger than you expected and very sure of himself.",
    "His guards rush you from every side, and {armor} rings with every blow.",
    "He tells you you're too old for this. You tell him you know."
   ],
   [
    "You walk right up to the front gate and knock. They're so surprised, they let you in.",
    "The duel happens on a rope bridge over the gorge. It creaks every time either of you moves.",
    "His sword catches {shield}, and the whole bridge sways.",
    "You remember a trick an old mentor taught you. It still works."
   ]
  ],
  "win": [
   "The Bandit King surrenders his crown and his fort. The road through Redcliff is free again."
  ],
  "lose": [
   "You get thrown out of the fort and into a thornbush. The Bandit King's laughter follows you all the way down the hill."
  ]
 },
 "manor": {
  "go": [
   "Ravensworth Hall has been empty for fifty years. The new owners say it isn't empty at all."
  ],
  "paths": [
   [
    "Every portrait's eyes follow you down the main hall.",
    "A door slams shut behind you. Then every door in the house does.",
    "Cold hands brush across {armor}. You try very hard not to scream.",
    "The ghost of the old lord appears and demands to know what you're doing in his house."
   ],
   [
    "The grand piano starts playing by itself. It's badly out of tune.",
    "Behind the library you find a hidden room, full of love letters he never sent.",
    "Plates fly off the shelves at you. One shatters on {helm}.",
    "The ghost finally shows himself. He isn't angry. He's heartbroken."
   ]
  ],
  "win": [
   "You read the letters aloud to the ghost, and he finally fades away with a smile. The manor is just a house again."
  ],
  "lose": [
   "The ghost chases you out the front door and slams it behind you. The new owners decide to sell."
  ]
 },
 "kraken": {
  "go": [
   "A kraken has moved into the harbor at Port Merrow. No ships have sailed in a week."
  ],
  "paths": [
   [
    "You row out with a harpoon and a very bad feeling.",
    "A tentacle bigger than a tree rises out of the water beside the boat.",
    "It wraps around the hull and squeezes. {armor} creaks right along with the boards.",
    "You go into the water. The kraken's eye is right there, as big as a door, looking at you.",
    "Sailors on the docks cheer every time you come up for air."
   ],
   [
    "The harbor master gives you the one boat nobody will miss.",
    "The water goes still. Too still.",
    "The kraken rises right under you and lifts the whole boat into the air.",
    "A tentacle coils around your arm. You twist free, but only just.",
    "You find the soft spot behind its eye, the same as the last one you fought."
   ]
  ],
  "win": [
   "The kraken lets go and sinks back into the deep. Ships are leaving the harbor before you've even dried off."
  ],
  "lose": [
   "You're hauled out of the water half drowned. The kraken is still out there, and so is the blockade."
  ]
 },
 "yeti": {
  "go": [
   "Something huge and white has been raiding the supply wagons on Frostpeak Pass."
  ],
  "paths": [
   [
    "The snow is up to your knees. Then up to your waist.",
    "You find giant footprints and a trail of cracked-open wagon crates.",
    "The yeti roars from the top of a ridge, and a little snow starts to slide.",
    "It swats you into a snowdrift. {armor} comes out caked in ice.",
    "Your fingers stop working. You fight with your elbows."
   ],
   [
    "A wagon driver tells you it only comes out in a blizzard. One is rolling in now.",
    "You can't see your hand in front of your face. You can hear it breathing, though.",
    "It grabs {shield} and wrenches it sideways, nearly taking your arm with it.",
    "You notice it's limping. Someone hurt it before you did.",
    "You find its den. There's a little one inside."
   ]
  ],
  "win": [
   "The yeti retreats into the high peaks. The wagon drivers build a bonfire and make you sit closest to it."
  ],
  "lose": [
   "An avalanche cuts you off from the yeti. You dig yourself out and limp back down the pass."
  ]
 },
 "lich": {
  "go": [
   "Once a year, the Sunken Abbey rises out of the lake. Something terrible rises with it."
  ],
  "paths": [
   [
    "You wade in as the water drains away. Fish flop across the stone floors.",
    "Drowned monks shamble out of the pews, still murmuring their prayers.",
    "The Drowned Lich speaks your name. You never told it your name.",
    "Black water coils around {armor} and tries to drag you under.",
    "You spot its phylactery glowing inside the abbey bell."
   ],
   [
    "The bells start ringing on their own as you step through the doors.",
    "Every step you take leaves wet footprints that keep walking after you stop.",
    "The lich raises a hand, and the lake pours back in through the windows.",
    "You climb the bell tower with the water rising behind you. {boots} slip on every rung.",
    "The phylactery is right there. So is the lich."
   ]
  ],
  "win": [
   "You shatter the phylactery, and the lich dissolves into lake water. The abbey sinks back down, quiet at last."
  ],
  "lose": [
   "The abbey sinks with you still inside. You barely swim out in time. The lich will be back next year."
  ]
 },
 "reunion": {
  "go": [
   "A letter arrives from your old party. One last dungeon, for old times' sake.",
   "You meet at the gates of Hollowdeep. Everyone is grayer. Everyone is grinning."
  ],
  "paths": [
   [
    "The wizard forgets half her spells. The half she remembers are still terrifying.",
    "The thief's knees crack louder than the traps he's disarming.",
    "You all fall right back into the old formation without a word.",
    "A dragon guards the final hoard. It's older than any of you.",
    "Its fire washes over the whole party, and {shield} takes the worst of it."
   ],
   [
    "Your old healer brought snacks. That's new.",
    "The first trap goes off and everyone dives the wrong way, just like old times.",
    "You find the room where you all nearly died thirty years ago. Somebody laughs. Then everybody does.",
    "The dragon wakes up, and the party lines up behind you, like always.",
    "You charge with {weapon} raised. For a moment, it's thirty years ago."
   ]
  ],
  "win": [
   "You split the hoard five ways and raise a toast to old friends. Everyone says they're retiring after this. Everyone means it this time.",
   "The dragon falls. The party laughs until they cry, and then you all go home."
  ],
  "lose": [
   "The dragon drives you all out of the dungeon. You laugh about it anyway, at the tavern, all night long."
  ]
 }
};
// Road beats can open a longer adventure (30s+)
const STORY_ROAD = [
 "Your knee clicks on the way up a hill. You pretend it didn't.",
 "A young adventurer recognizes you on the road and asks you to sign their shield.",
 "A bard at the crossroads is singing a song about you. He gets half the details wrong, but the chorus is catchy.",
 "You pass a farm for sale on the way and stare at it a little too long.",
 "It starts raining an hour into the walk. Of course it does.",
 "You count your coins in your head on the road. Still not enough. Not yet."
];
const TIER_COLOR = ['var(--r-common)','var(--r-common)','var(--good)','var(--r-rare)','var(--r-rare)','var(--r-epic)','var(--r-legendary)'];
const TIER_NAME = ['Odd job','Easy','Easy','Medium','Hard','Hard','Deadly'];
const GEAR_BASES = {trinket:['Pendant','Signet Ring','Amulet','Charm','Band'],weapon:['Cleaver','Longsword','Warhammer','Spear'],armor:['Brigandine','Chainmail','Scale Coat'],shield:['Buckler','Tower Shield','Round Shield'],helm:['Sallet','Coif','Great Helm'],boots:['Greaves','Riding Boots','Sabatons']};
const KEY = 'rust-retirement-v2';
const HKEY = 'rust-retirement-history';
function loadHist(){ try{ const h=JSON.parse(localStorage.getItem(HKEY)||'[]'); return Array.isArray(h)?h:[]; }catch(e){ return []; } }
function saveHist(h){ try{ localStorage.setItem(HKEY,JSON.stringify(h)); }catch(e){} }

// ---------- sound (synthesized, no files) ----------
let AC=null, muted=false;
try{ muted=localStorage.getItem('rr-muted')==='1'; }catch(e){}
function ac(){ if(typeof window==='undefined') return null; if(!AC){ try{ AC=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ return null; } } if(AC.state==='suspended') AC.resume(); return AC; }
function tone(f,t0,d,type,vol,f2){ const a=AC, t=a.currentTime+t0, o=a.createOscillator(), g=a.createGain(); o.type=type||'sine'; o.frequency.setValueAtTime(f,t); if(f2) o.frequency.exponentialRampToValueAtTime(f2,t+d); g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(vol||.1,t+.01); g.gain.exponentialRampToValueAtTime(.0001,t+d); o.connect(g); g.connect(a.destination); o.start(t); o.stop(t+d+.05); }
function noise(t0,d,vol){ const a=AC, n=Math.floor(a.sampleRate*d), b=a.createBuffer(1,n,a.sampleRate), ch=b.getChannelData(0); for(let i=0;i<n;i++) ch[i]=(Math.random()*2-1)*(1-i/n); const src=a.createBufferSource(), g=a.createGain(); g.gain.value=vol||.15; src.buffer=b; src.connect(g); g.connect(a.destination); src.start(a.currentTime+t0); }
const SFX = {
  setout:()=>{ tone(330,0,.12,'triangle',.1); tone(440,.1,.18,'triangle',.1); },
  win:()=>{ [523,659,784,1047].forEach((f,i)=>tone(f,i*.09,.25,'triangle',.09)); },
  lose:()=>{ tone(300,0,.25,'sawtooth',.05,180); tone(200,.2,.35,'sawtooth',.05,110); },
  loot:()=>{ [1200,1600,2000].forEach((f,i)=>tone(f,i*.06,.15,'sine',.06)); },
  break:()=>{ noise(0,.25,.18); tone(120,0,.3,'square',.06,60); },
  coin:()=>{ tone(1400,0,.08,'square',.04); tone(1900,.06,.12,'square',.04); },
  injury:()=>{ tone(90,0,.4,'sine',.25,50); },
  milestone:()=>{ [392,523,659,784].forEach((f,i)=>tone(f,i*.12,.4,'triangle',.09)); tone(1047,.5,.6,'triangle',.09); },
  click:()=>{ tone(660,0,.05,'square',.03); }
};
function sfx(n){ if(muted) return; const a=ac(); if(!a) return; try{ SFX[n]&&SFX[n](); }catch(e){} }

const ICON = {
  weapon:'<path d="M19 5l-9.5 9.5M19 5h-3.5M19 5v3.5M9.5 14.5l-2 2M5.5 14.5l4 4M4 20l2.2-2.2"/>',
  armor:'<path d="M8 3l4 2 4-2 4 3-2 4v10H6V10L4 6z"/><path d="M12 5v15"/>',
  shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M12 7v10M8 11h8"/>',
  helm:'<path d="M4 16a8 8 0 0116 0v3H4z"/><path d="M12 8v11M4 16h16"/>',
  boots:'<path d="M7 3h6v10l6 3v4H5v-4z"/><path d="M5 17h14"/>',
  trinket:'<path d="M5 3c0 7 3 10.5 7 10.5S19 10 19 3"/><circle cx="12" cy="17" r="3.5"/><path d="M12 15.5v3"/>',
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
  herb:'<path d="M12 21V10"/><path d="M12 13c-4 0-6-3-6-7 4 0 6 3 6 7zM12 11c0-4 2-7 6-7 0 4-2 7-6 7z"/>',
  feather:'<path d="M20 4C11 4 6 10 6 18l-2 2"/><path d="M6 18c6 0 11-4 14-14M9 14h5M11 10h5"/>',
  gem:'<path d="M6 4h12l3 5-9 11L3 9z"/><path d="M3 9h18M9 4l3 16 3-16"/>',
  horn:'<path d="M4 20c2-8 7-13 16-16-3 5-4 10-10 13z"/><path d="M8 16l2 2M11 13l2 2"/>',
  skull:'<path d="M5 11a7 7 0 0114 0v4h-2v4H7v-4H5z"/><circle cx="9.5" cy="11.5" r="1.5"/><circle cx="14.5" cy="11.5" r="1.5"/>',
  medal:'<circle cx="12" cy="15" r="5"/><path d="M8 3l4 7 4-7M12 13v4"/>',
  scroll:'<path d="M7 4h11v13a3 3 0 01-3 3H6a3 3 0 010-6h1z"/><path d="M7 14V4M10 8h5M10 11h5"/>',
  bottle:'<path d="M10 3h4M10 3v4l-3 4v8a2 2 0 002 2h6a2 2 0 002-2v-8l-3-4V3"/><path d="M7 14h10"/>',
  web:'<path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="7.5"/>',
  clock:'<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>'
};
const JOB_ICON = Object.fromEntries(JOBS.map(j=>[j.key,j.mat.icon]));
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
const gShort = cp => cp>=100 ? '<span class="num">'+Math.floor(cp/100).toLocaleString()+'<i class="gp">g</i></span>' : fmt(cp);
const esc = s => String(s).replace(/[&<>"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
const job = k => JOBS.find(j=>j.key===k);
// luck from intact trinkets raises loot and gear drop chances
const luck = ()=>SLOTS.reduce((a,k)=>{ const g=S.eq[k]; return a+(g&&g.dur>0&&g.luck?g.luck:0); },0);
const lootChance = j=>Math.min(.95,j.loot*(1+luck()));
const gearChance = j=>Math.min(.95,j.gearDrop*(1+luck()));
const season = ()=>SEASONS[Math.floor((S.day-1)/SEASON_DAYS)%SEASONS.length];
const weather = ()=>WEATHER[S.weather]||WEATHER.clear;
function wx(){ const w=weather(), sn=season(); return {wear:w.wear, pay:w.pay*(sn.pay||1), energy:w.energy, odds:w.odds}; }
function rollWeather(){ const w=season().w; let tot=0; for(const k in w) tot+=w[k]; let r=Math.random()*tot; for(const k in w){ r-=w[k]; if(r<0) return k; } return 'clear'; }
const priceMult = ()=>1+CFG.priceStep*Math.floor((S.day-1)/CFG.priceEvery);
const upkeep = c=>Math.round(c*priceMult());
const healCost = ()=>upkeep(CFG.healCost);
const injuries = ()=>(S.injuries||[]).map(k=>INJURIES.find(i=>i.key===k)).filter(Boolean);
const maxE = ()=>Math.max(40,100+injuries().reduce((a,i)=>a+i.energy,0));
const jobEnergy = j=>Math.round(j.energy*wx().energy);
const jobWear = j=>Math.max(1,Math.round(j.wear*CFG.wearMult*wx().wear));
const jobPay = j=>[Math.round(j.pay[0]*wx().pay),Math.round(j.pay[1]*wx().pay)];
function rollMarket(){ S.market={}; JOBS.forEach(j=>{ S.market[j.mat.name]=Math.round((.6+Math.random()*.9)*100)/100; }); }
const marketMult = n=>(S.market&&S.market[n])||1;
function goodbye(g){ return (GOODBYE[g.name] || (g.rarity==='legendary'?GOODBYE_LEGENDARY:pick(GOODBYE_GENERIC))).replace(/\{name\}/g,g.name); }

// ---------- state ----------
let S;
function newState(){
  const s={day:1, phase:'morning', gold:CFG.startGold, energy:100, rations:2, nextId:1,
    eq:{}, bag:[], offers:[], event:null, trip:null, lodge:'inn', meal:'plate',
    injuries:[], ms:-1, selSlot:'weapon', selBag:null, pendingSell:null, askNew:false, log:[], ended:false, endReason:''};
  START_GEAR.forEach(g=>{ s.eq[g.slot]={...g, uid:s.nextId++, kind:'gear', dur:g.max, repairs:0}; });
  return s;
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function load(){try{const r=localStorage.getItem(KEY);if(r){const s=JSON.parse(r);if(s&&s.eq)return s}}catch(e){}return null}
function log(text,kind='',extra){ const e={d:S.day,text,kind}; if(S.trip&&S.trip.tid){ e.tid=S.trip.tid; e.q=S.trip.key; } if(extra) Object.assign(e,extra); S.log.unshift(e); S.log=S.log.slice(0,400); return e; }

const live = ()=>SLOTS.map(k=>S.eq[k]).filter(g=>g&&g.dur>0);
function gearPower(g){ if(!g||g.dur<=0) return 0; return g.dur/g.max<.25 ? g.power/2 : g.power; }
const power = ()=>Math.max(0,Math.round(SLOTS.reduce((a,k)=>a+gearPower(S.eq[k]),0)+injuries().reduce((a,i)=>a+i.power,0)));
const repairCost = g=>Math.round(g.repairBase*Math.pow(CFG.repairGrowth,g.repairs));
function sellValue(it){
  if(it.kind==='mat') return Math.round(it.value*marketMult(it.name));
  if(it.dur<=0) return Math.round(it.sell*.1);
  const r=it.dur/it.max;
  // worn gear is worth less: sell early for the big payout, or use it up
  const floor=it.rarity==='legendary'?.15:.1;
  return Math.round(it.sell*(floor+(1-floor)*r));
}
const rerollCost = ()=>Math.round(CFG.rerollBase*Math.pow(CFG.rerollGrowth,S.rerolls||0));
const inTown = ()=>!S.trip && !S.ended;
function chance(j){
  const p=power(); if(p<j.min) return 0;
  let c=clamp(.88+(p-j.min)*.008+(S.energy-60)*.004,.1,.98);
  c=c+wx().odds;                          // weather is applied after the cap so fog always shows on the cards
  if(S.energy<jobEnergy(j)) c*=.5;
  return clamp(c,.05,.98);
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
    power, max, dur:Math.round(max*(.6+Math.random()*.4)), repairs:0, repairBase:power*250, sell:Math.round(power*500*m),
    ...(slot==='trinket'?{luck:{common:.1,rare:.2,epic:.3,legendary:.5}[rarity]}:{})};
}
function addToBag(it){
  if(S.bag.length>=CFG.bagSize){ log('Your bag is full, so you leave the '+it.name+' behind.','bad'); return false; }
  S.bag.push(it); return true;
}

function replaceOffer(key){
  const i=S.offers.indexOf(key); if(i<0) return;
  const pool=JOBS.filter(j=>!S.offers.includes(j.key) && !(S.doneToday||[]).includes(j.key));
  if(pool.length) S.offers[i]=pick(pool).key; else S.offers.splice(i,1);
  S.offers.sort((a,b)=>job(a).min-job(b).min);
}
function rollOffers(){
  const pool=JOBS.slice(1).sort(()=>Math.random()-.5).slice(0,CFG.boardSize-1);
  S.offers=[JOBS[0].key,...pool.map(j=>j.key)].sort((a,b)=>job(a).min-job(b).min);
}
function startDay(){
  S.weather=rollWeather(); rollMarket();
  if(S.day>1 && (S.day-1)%SEASON_DAYS===0) log(season().name+' arrives.'+(season().pay?' Folks pay more for help in the cold.':''),'story');
  if(S.day>1 && (S.day-1)%CFG.priceEvery===0) log('Prices around town went up again. Lodging, food, rations, and the healer now cost '+Math.round((priceMult()-1)*100)+'% more than when you started.','bad');
  log('Weather: '+weather().name+'. '+weather().desc+'.');
  rollOffers();
  S.rerolls=0; S.questsToday=0; S.doneToday=[]; S.rationsToday=0; S.event=null; S.pendingSell=null;
  if(S.day>1 && Math.random()<.28){
    const roll=Math.random(), intact=live();
    if(roll<.4 && intact.length){
      const g=pick(intact);
      S.event={type:'merchant', slot:g.slot, offer:Math.round(sellValue(g)*1.3)};
    } else if(roll<.6){
      const c=rand(1000,3000); S.gold+=c; log('You find a forgotten coin pouch in your pack: '+plain(c)+'.','good');
    } else if(roll<.8){
      S.energy=clamp(S.energy-15,0,maxE()); log('Your knee is acting up this morning. Energy -15.','bad');
    } else {
      S.energy=clamp(S.energy+10,0,maxE()); log('An old party member spots you and buys breakfast. Energy +10.','good');
    }
  }
}
function applyWear(total){
  // every point of wear lands on one piece, picked by weight, so small jobs wear gear too
  const broke=[];
  for(let n=0;n<total;n++){
    const l=live(); if(!l.length) break;
    const w=l.map(g=>WEAR_WEIGHT[g.slot]*(.7+Math.random()*.6)); let r=Math.random()*w.reduce((a,b)=>a+b,0), k=0;
    while(k<l.length-1 && r>=w[k]){ r-=w[k]; k++; }
    l[k].dur--; if(l[k].dur===0) broke.push(l[k]);
  }
  return broke;
}
function endGame(reason){
  let v=0; S.bag.forEach(i=>v+=sellValue(i));
  if(v){ S.gold+=v; log('You sell off everything left in your bag for '+plain(v)+'.','good'); }
  S.bag=[]; S.ended=true; S.endReason=reason; S.trip=null;
  const sc=score(), hist=loadHist(), rec={when:Date.now(), stars:sc.stars, gold:S.gold, days:S.day, name:plainName(S.name)||'The Old Veteran'};
  hist.push(rec); saveHist(hist.slice(-50)); S.runWhen=rec.when;
}
function checkEnd(){
  if(!live().length && !S.bag.some(i=>i.kind==='gear'&&i.dur>0)){
    log('Nothing left to fight with. You retire.','bad');
    endGame('Your last piece of gear gave out. Time to hang it all up.');
  }
}
function maybeInjure(j,ok){
  if(!S.injuries) S.injuries=[];
  const pool=INJURIES.filter(i=>!S.injuries.includes(i.key));
  const f=Math.max(0,(S.questsToday||1)-1);  // every extra quest in one day raises the risk
  const risk=ok ? .012*j.tier+CFG.fatigueRisk*f : .15+.03*j.tier+CFG.fatigueRisk*1.5*f;
  if(!pool.length || Math.random()>=risk) return;
  const inj=pick(pool); S.injuries.push(inj.key); S.energy=Math.min(S.energy,maxE());
  log(inj.line,'story'); log('Injury: '+inj.name+' ('+inj.desc+'). A healer can treat it.','bad'); sfx('injury');
}
function checkMilestones(){
  if(S.ms===undefined) S.ms=-1;
  while(S.ms+1<MILESTONES.length && S.gold>=MILESTONES[S.ms+1].at){
    S.ms++; const m=MILESTONES[S.ms];
    log('Farm milestone: '+m.name+'. '+m.line,'milestone'); sfx('milestone');
  }
}
function buildScript(j){
  const st=STORY[j.key], out=[];
  st.go.slice(1).forEach(t=>out.push({at:.08,t}));
  const beats=(st.paths?pick(st.paths):st.beats).slice();
  if(st.road!==false && j.secs>=30 && Math.random()<.3) beats.unshift(pick(STORY_ROAD));
  beats.forEach((t,i)=>out.push({at:.18+(.62*(i+.5)/beats.length),t}));
  return out;
}
const STORY_FALLBACK = {weapon:'your fist',shield:'your forearm',armor:'your bare chest',helm:'your bare head',boots:'your bare feet',trinket:'your empty pocket'};
function gearRef(g){ const short=g.name.split(',')[0].replace(/ of .*$/,''); return g.name.includes(',')?short:'your '+short; }
function storyText(t){
  t=t.replace(/\{(weapon|shield|armor|helm|boots|trinket|gear)\}/g,(m,k)=>{
    if(k==='gear'){ const l=live(); return l.length?gearRef(pick(l)):'your gear'; }
    const g=S.eq[k]; return g&&g.dur>0?gearRef(g):STORY_FALLBACK[k];
  });
  return t.replace(/(^|[.!?]\s+)([a-z])/g,(m,a,b)=>a+b.toUpperCase());
}
function resolveTrip(){
  const t=S.trip, j=job(t.key), ok=t.ok!==undefined?t.ok:Math.random()<t.c;
  log(pick(STORY[j.key][ok?'win':'lose']),'story');
  const pr=jobPay(j); let pay=rand(pr[0],pr[1]), wear=jobWear(j);
  if(!ok){ pay=Math.round(pay*.25); wear=Math.round(wear*1.5); }
  S.gold+=pay;
  const pre=live().map(g=>[g,g.dur]);
  const broke=applyWear(wear);
  const hit=pre.map(([g,d])=>[g,d-g.dur]).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1])[0];
  log((ok?'Earned ':'Only earned ')+plain(pay)+'.'+(hit?' '+gearRef(hit[0]).replace(/^y/,'Y')+' took the worst of it (−'+hit[1]+').':''),ok?'good':'bad',{res:ok?'win':'lose'});
  sfx(ok?'win':'lose');
  broke.forEach(g=>{ log(g.name+' breaks.','bad'); log(goodbye(g),'story'); });
  if(broke.length) setTimeout(()=>sfx('break'),350);
  maybeInjure(j,ok);
  if(Math.random()<(ok?lootChance(j):lootChance(j)*.3)){
    const it={uid:S.nextId++, kind:'mat', name:j.mat.name, icon:j.mat.icon, rarity:'common', value:rand(j.mat.v[0],j.mat.v[1])};
    if(addToBag(it)){ log('Loot: '+it.name+' (usually worth '+plain(it.value)+').','loot'); sfx('loot'); }
  }
  if(ok && Math.random()<gearChance(j)){
    const g=genGear(j);
    if(addToBag(g)){ log('Loot: '+RARITY[g.rarity].label+' '+g.name+' ('+g.power+' power).','loot'); sfx('loot'); }
  }
  S.trip=null; // stay out: you can keep questing while you have energy, or end the day
  replaceOffer(t.key);
  checkEnd();
}

// ---------- actions ----------
const A = {
  job(key){
    const j=job(key), c=chance(j); if(!c||!inTown()||S.phase!=='morning'||(S.doneToday||[]).includes(key)) return;
    S.questsToday=(S.questsToday||0)+1; (S.doneToday||(S.doneToday=[])).push(key);
    S.energy=clamp(S.energy-jobEnergy(j),0,maxE());
    S.trip={key, start:Date.now(), dur:j.secs*1000, c, ok:Math.random()<c, script:buildScript(j), next:0};
    S.event=null; S.pendingSell=null;
    S.trip.tid=S.nextId++;
    S.trip.beat=storyText(STORY[j.key].go[0]);
    log(S.trip.beat,'story'); sfx('setout');
  },
  reroll(){
    const c=rerollCost(); if(!inTown()||S.phase!=='morning'||S.gold<c) return;
    S.gold-=c; S.rerolls=(S.rerolls||0)+1; rollOffers();
    log('You pay '+plain(c)+' to hear about some other jobs. Next look costs '+plain(rerollCost())+'.');
  },
  rest(){ if(!inTown()||S.phase!=='morning'||S.questsToday) return; S.energy=clamp(S.energy+CFG.restBonus,0,maxE()); log('You take the day off. Energy +'+CFG.restBonus+'.'); S.phase='evening'; },
  endDay(){ if(!inTown()||S.phase!=='morning') return; S.phase='evening'; log('You call it a day and head back into town.'); },
  buyRation(n){ n=+n||1; const c=upkeep(CFG.rationCost)*n; if(S.gold<c||S.ended) return; S.gold-=c; S.rations+=n; },
  tab(t){ S.bagTab=t; },
  heal(key){
    const cost=healCost(), i=(S.injuries||[]).indexOf(key); if(!inTown()||i<0||S.gold<cost) return;
    const inj=INJURIES.find(x=>x.key===key); S.gold-=cost; S.injuries.splice(i,1);
    log('The healer treats your '+inj.name.toLowerCase()+' for '+plain(cost)+'. Good as new. Mostly.','good'); sfx('coin');
  },
  mute(){ muted=!muted; try{ localStorage.setItem('rr-muted',muted?'1':'0'); }catch(e){} if(!muted) sfx('click'); },
  eatRation(){
    if(!S.rations||S.energy>=maxE()||S.ended||S.stomach) return;
    S.rations--; S.energy=clamp(S.energy+CFG.rationEnergy,0,maxE());
    S.rationsToday=(S.rationsToday||0)+1;
    const over=S.rationsToday-CFG.safeRations;
    if(over>0 && !S.stomach && Math.random()<.25*over){
      S.stomach=true;
      log('Your stomach starts to churn. That was one ration too many.','story');
      log('Injury: Stomach Ache. You\'ll wake up tomorrow with half your energy.','bad'); sfx('injury');
    }
  },
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
    log('Sold '+g.name+' for '+plain(v)+'.','good'); sfx('coin'); checkEnd();
  },
  sellBag(){
    const i=S.bag.findIndex(x=>x.uid===S.selBag); if(i<0||!inTown()) return;
    const it=S.bag[i], v=sellValue(it); S.gold+=v; S.bag.splice(i,1); S.selBag=null;
    log('Sold '+it.name+' for '+plain(v)+'.','good'); sfx('coin'); checkEnd();
  },
  sellMats(){
    if(!inTown()) return; let v=0,n=0;
    S.bag=S.bag.filter(it=>{ if(it.kind==='mat'){v+=sellValue(it);n++;return false} return true; });
    if(n){ S.gold+=v; log('The merchant buys '+n+' material'+(n>1?'s':'')+' for '+plain(v)+'.','good'); sfx('coin'); }
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
    log('A traveling merchant buys '+g.name+' for '+plain(e.offer)+'.','good'); sfx('coin'); checkEnd();
  },
  merchantNo(){ log('You send the merchant on his way.'); S.event=null; },
  sleep(){
    const L=LODGING.find(x=>x.key===S.lodge), M=MEALS.find(x=>x.key===mealKey()), cost=upkeep(L.cost)+upkeep(M.cost);
    if(S.gold<cost||S.phase!=='evening') return;
    S.gold-=cost; S.energy=clamp(S.energy+L.energy+M.energy,0,maxE());
    if(S.stomach){ S.energy=Math.floor(S.energy/2); S.stomach=false; S.stomachHit=true; }
    log('Night '+S.day+': '+L.name.toLowerCase()+', '+M.name.toLowerCase()+'. Spent '+plain(cost)+'.');
    S.day++; S.phase='morning'; startDay();
    if(S.stomachHit){ S.stomachHit=false; log('You spent half the night clutching your stomach. You wake up with only '+S.energy+' energy.','bad'); }
  },
  retire(){ if(S.trip) return; log('You retire on your own terms.','good'); endGame('You decide you\'ve had enough and walk away while you still can.'); },
  'newrun-ask'(){ S.askNew=true; },
  'newrun-no'(){ S.askNew=false; },
  newrun(){ const last=S&&S.name; S=newState(); S.started=false; S.draftName=last||''; startDay(); },
  begin(){
    if(S.started) return;
    const el=document.getElementById('hero-name'), v=(el&&el.value||S.draftName||'').trim().replace(/\s+/g,' ').slice(0,24);
    S.name=plainName(v); S.started=true; delete S.draftName;
    log(heroName()+(S.name?',':'')+' starts the last stretch. Five thousand gold buys a farm.','story'); sfx('setout');
  },
};

// ---------- render ----------
function starsHTML(v,cls){ return '<span class="'+cls+'" style="--f:'+(v/5*100)+'%" role="img" aria-label="'+v+' out of 5 stars"><span class="base">★★★★★</span><span class="fill">★★★★★</span></span>'; }
function wxNote(){
  const fx=[]; if(weather().desc!=='No effects') fx.push(weather().desc.toLowerCase());
  if(season().pay) fx.push('winter pay +15%');
  if(priceMult()>1) fx.push('town prices +'+Math.round((priceMult()-1)*100)+'%');
  return fx.length?fx.join(', '):'no effects';
}
const mealKey = ()=>S.stomach?'skip':S.meal;
// tooltip helper: "Title|line one\nline two"
const tip = (t,lines)=>' data-tip="'+esc(t+(lines&&lines.filter(Boolean).length?'|'+lines.filter(Boolean).join('\n'):''))+'"';
function wxLines(){
  const w=weather(), sn=season(), L=[];
  if(w.wear!==1) L.push('Gear wear '+(w.wear>1?'+':'')+Math.round((w.wear-1)*100)+'%');
  if(w.energy!==1) L.push('Energy costs '+(w.energy>1?'+':'')+Math.round((w.energy-1)*100)+'%');
  if(w.odds) L.push('Quest odds '+Math.round(w.odds*100)+'%');
  if(w.pay!==1) L.push('Quest pay +'+Math.round((w.pay-1)*100)+'%');
  if(sn.pay) L.push('Winter: all quests pay +15%');
  if(!L.length) L.push('No effects today');
  if(priceMult()>1) L.push('Town prices +'+Math.round((priceMult()-1)*100)+'% (rises every '+CFG.priceEvery+' days)');
  L.push('','Weather changes every morning. '+sn.name+' lasts '+SEASON_DAYS+' days.');
  return L;
}
const TITLE = 'the Old Veteran';
const plainName = n=>{ n=(n||'').trim(); return n && n.toLowerCase()!=='the old veteran' ? n : ''; };
const titleFor = n=>plainName(n) ? plainName(n)+', '+TITLE : 'The Old Veteran';
const heroName = ()=>titleFor(S.name);
function phaseLabel(){ if(S.trip) return 'On the road'; if(S.phase!=='morning') return 'Evening'; return S.questsToday?'Afternoon':'Morning'; }

function renderTop(){
  const pct=clamp(S.gold/CFG.goal*100,0,maxE()), sc=score(), lowE=S.energy<30;
  document.getElementById('top').innerHTML=
    '<div class="who"><div class="avatar">'+ic('vet')+'</div><div style="flex:1;min-width:0">'+
      '<h1 title="'+esc(heroName())+'">'+esc(heroName())+'</h1><div class="sub">Day '+S.day+' · '+phaseLabel()+(S.questsToday?' · '+S.questsToday+' quest'+(S.questsToday>1?'s':'')+' today':'')+'</div>'+
      '<div class="bars"><div class="bar fund"'+tip('Retirement fund',[Math.floor(S.gold/100).toLocaleString()+' of '+(CFG.goal/100).toLocaleString()+'g saved',(MILESTONES[(S.ms??-1)+1]?'Next: '+MILESTONES[(S.ms??-1)+1].name+' at '+(MILESTONES[(S.ms??-1)+1].at/100).toLocaleString()+'g':'The whole farm is paid for'),'Notches mark the farm milestones.'])+'><span style="width:'+pct+'%"></span>'+MILESTONES.slice(0,-1).map(m=>'<i class="tick'+(S.gold>=m.at?' on':'')+'" style="left:'+(m.at/CFG.goal*100)+'%"></i>').join('')+'</div><span class="num">'+Math.floor(S.gold/100).toLocaleString()+' / '+(CFG.goal/100).toLocaleString()+'g</span>'+
      '<div class="bar energy '+(lowE?'low':'')+'"'+tip('Energy',[S.energy+' of '+maxE(),maxE()<100?'Injuries lowered your max from 100':'','Quests cost energy. Low energy lowers your odds.','Lodging, supper, and rations bring it back.'])+'><span style="width:'+S.energy+'%"></span></div><span class="num">'+S.energy+' / '+maxE()+'</span></div>'+
    '</div></div>'+
    '<div class="hstats">'+
      '<div class="tile"'+tip('Purse',[plain(S.gold),'1 gold = 10 silver = 100 copper'])+'><span class="label">Purse</span><b>'+fmt(S.gold,true)+'</b></div>'+
      '<div class="tile power"'+tip('Combat power',['From your gear'+(injuries().some(i=>i.power)?', minus injuries':''),'Each quest needs a minimum power. More power means better odds.'])+'><span class="label">Power</span><b>'+power()+'</b></div>'+
      '<div class="tile"'+tip('Rating so far',[score().stars.toFixed(1)+' of 5 stars','70% from gold saved toward 5,000g','30% from days lasted ('+CFG.targetDays+' days for full credit)'])+'><span class="label">Rating so far</span>'+starsHTML(sc.stars,'mini-stars')+'</div>'+
      '<div class="hbtns">'+(S.askNew
        ? '<button class="confirm" data-a="newrun">Yes, start over</button><button data-a="newrun-no">Keep playing</button>'
        : '<button data-a="mute" title="Sound effects">'+(muted?'Sound off':'Sound on')+'</button><button data-a="retire" '+(S.trip||S.ended?'disabled':'')+'>Retire now</button><button data-a="newrun-ask">New run</button>')+'</div>'+
    '</div>';
}

function slotHTML(k){
  const g=S.eq[k], sel=S.selSlot===k?' sel':'';
  if(!g) return '<button class="slot empty'+sel+'" data-a="selSlot" data-id="'+k+'" aria-label="'+SLOT_NAME[k]+': empty"'+tip(SLOT_NAME[k]+' slot',['Empty. Equip something from your bag.'])+'>'+ic(k)+'<span class="sname">'+SLOT_NAME[k]+'</span></button>';
  const r=g.dur/g.max, dc=r<.25?'low':r<.5?'mid':'';
  return '<button class="slot'+(g.dur<=0?' broken':'')+sel+'" style="--rc:'+RARITY[g.rarity].c+'" data-a="selSlot" data-id="'+k+'" aria-label="'+esc(g.name)+'"'+tip(g.name,[RARITY[g.rarity].label+' '+SLOT_NAME[g.slot].toLowerCase(),'Power '+g.power+(g.dur>0&&r<.25?' (fighting at half power)':''),'Durability '+g.dur+'/'+g.max+(g.dur<=0?' · broken':''),g.luck?'Luck ×'+(1+g.luck).toFixed(1).replace(/\.0$/,'')+': loot and gear drops are '+(1+g.luck).toFixed(1).replace(/\.0$/,'')+'x as likely'+(g.dur<=0?' (gone while broken)':''):'','Repaired '+g.repairs+' time'+(g.repairs===1?'':'s')])+'>'+ic(k)+
    '<span class="dbar '+dc+'"><span style="width:'+r*100+'%"></span></span></button>';
}

function renderGear(){
  document.getElementById('intact').textContent=live().length+' of '+SLOTS.length+' intact';
  const nextM=MILESTONES[(S.ms===undefined?-1:S.ms)+1];
  let h='<div class="doll"><div class="slots">'+['helm','armor','boots'].map(slotHTML).join('')+'</div>'+
    '<div class="center"><div class="cstat hero"'+tip('Combat power',SLOTS.map(k=>S.eq[k]?SLOT_NAME[k]+': '+Math.round(gearPower(S.eq[k])):SLOT_NAME[k]+': empty').concat(injuries().filter(i=>i.power).map(i=>i.name+': '+i.power)))+'><span class="label">Power</span><b>'+power()+'</b></div>'+
    '<div class="cstat"'+tip('Energy',[S.energy+' of '+maxE(),...injuries().filter(i=>i.energy).map(i=>i.name+': '+i.energy+' max'),'Eaten today: '+(S.rationsToday||0)+' ration'+((S.rationsToday||0)===1?'':'s')])+'><span class="label">Energy</span><b>'+S.energy+'<small>/'+maxE()+'</small></b></div>'+
    '<div class="cstat"'+tip('Farm milestones',MILESTONES.map((m,i)=>(i<=(S.ms??-1)?'✓ ':'· ')+m.name+' · '+(m.at/100).toLocaleString()+'g'))+'><span class="label">Next goal'+(nextM?' · '+Math.floor(nextM.at/100).toLocaleString()+'g':'')+'</span><b class="farmnext">'+(nextM?esc(nextM.name):'All saved up')+'</b></div></div>'+
    '<div class="slots">'+['weapon','shield','trinket'].map(slotHTML).join('')+'</div></div>';
  const g=S.eq[S.selSlot];
  if(!g){
    h+='<div class="detail"><div class="dtop"><span class="nm">'+SLOT_NAME[S.selSlot]+' slot</span><span class="dsub">Empty</span></div><p class="empty-note">Equip something from your bag.</p></div>';
  } else {
    const r=g.dur/g.max, dc=r<.25?'low':r<.5?'mid':'', rc=repairCost(g);
    const state=g.dur<=0?'<span class="dsub" style="color:var(--bad)">Broken</span>':r<.25?'<span class="dsub" style="color:var(--gold)" title="Under 25% durability fights at half power">Worn · half power</span>':'<span class="dsub">'+RARITY[g.rarity].label+'</span>';
    h+='<div class="detail"><div class="dtop"><span class="nm" style="color:'+RARITY[g.rarity].c+'" title="'+esc(g.name)+'">'+esc(g.name)+'</span>'+state+'</div>'+
      '<div class="meta"><span>Power <b>'+g.power+'</b></span>'+(g.luck?'<span>Luck <b class="luck">×'+(1+g.luck).toFixed(1).replace(/\.0$/,'')+'</b></span>':'<span>Repairs <b>'+g.repairs+'</b></span>')+'<span>Worth <b>'+fmt(sellValue(g),true)+'</b></span></div>'+
      '<div class="drow"><div class="durrow '+dc+'"><div class="bar"><span style="width:'+r*100+'%"></span></div><span class="num">'+g.dur+'/'+g.max+'</span></div>'+
      '<div class="acts">'+(S.pendingSell==='eq'
        ? '<button class="confirm" data-a="sellEq">Sell for '+plain(sellValue(g))+'</button><button data-a="sellCancel">Keep it</button>'
        : '<button data-a="repair" '+(!inTown()||g.dur>=g.max||S.gold<rc?'disabled':'')+'>Repair · '+fmt(rc,true)+'</button><button class="danger" data-a="sellAsk" '+(!inTown()?'disabled':'')+'>Sell…</button>')+
      '</div></div></div>';
  }
  const inj=injuries();
  const stom=S.stomach?'<div class="inj"'+tip('Stomach Ache',['Too many rations today.','You\'ll wake up with half your energy.','No supper or rations until it passes.'])+'><span><b>Stomach Ache</b><small>half energy tomorrow</small></span></div>':'';
  const many=inj.length+(S.stomach?1:0)>2;
  let injHTML;
  if(many){
    // 3 or more: one summary line so the panel never grows
    const e=inj.reduce((a,i)=>a+i.energy,0), p=inj.reduce((a,i)=>a+i.power,0);
    const worst=inj.slice().sort((a,b)=>(a.energy+a.power*3)-(b.energy+b.power*3))[0];
    const fx=[e?e+' energy':'',p?p+' power':'',S.stomach?'stomach ache':''].filter(Boolean).join(' · ');
    injHTML='<div class="injsum" title="'+esc(inj.map(i=>i.name+' ('+i.desc+')').join(', ')+(S.stomach?', Stomach Ache (half energy tomorrow)':''))+'"><span class="txt"><b>'+(inj.length+(S.stomach?1:0))+' injuries</b><small>'+esc(fx)+'</small></span>'+
      (worst?'<button data-a="heal" data-id="'+worst.key+'" title="Treat your '+esc(worst.name.toLowerCase())+' for '+plain(healCost())+'" '+(!inTown()||S.gold<healCost()?'disabled':'')+'>Heal worst · '+gShort(healCost())+'</button>':'')+'</div>';
  } else injHTML='<div class="injuries">'+stom+(inj.length
    ? inj.map(i=>'<div class="inj"'+tip(i.name,[i.desc,'Lasts until you see the healer ('+plain(healCost())+').'])+'><span><b>'+esc(i.name)+'</b><small>'+esc(i.desc.replace(' max energy',' energy'))+'</small></span><button data-a="heal" data-id="'+i.key+'" title="See the healer for '+plain(healCost())+'" '+(!inTown()||S.gold<healCost()?'disabled':'')+'>Heal</button></div>').join('')
    : (stom?'':'<div class="inj-none"><span class="label">Injuries</span><span class="empty-note">None yet</span></div>'))+'</div>';
  // separator, then weather, then injuries
  h+='<div class="conds"><div class="wxcard" tabindex="0"'+tip(season().name+' · '+weather().name,wxLines())+'><span class="label">'+season().name+'</span><b>'+esc(weather().name)+'</b><span class="wxinfo" aria-hidden="true">i</span></div>'+injHTML+'</div>';
  document.getElementById('gear').innerHTML=h;
}

function renderJournal(){
  const L=S.log; let h='', last=null, i=0;
  while(i<L.length){
    const e=L[i];
    if(e.d!==last){ h+='<li class="day">Day '+e.d+'</li>'; last=e.d; }
    if(e.tid){
      const grp=[]; while(i<L.length && L[i].tid===e.tid){ grp.push(L[i]); i++; }
      grp.reverse();                     // inside an adventure, read top to bottom
      const jb=job(e.q), running=S.trip&&S.trip.tid===e.tid, res=grp.find(x=>x.res);
      const cls=running?'live':res?(res.res==='win'?'won':'lost'):'';
      h+='<li class="quest '+cls+'"><div class="qh"><b>'+esc(jb?jb.name:'Adventure')+'</b><span>'+(jb?esc(jb.where):'')+'</span><span class="qs">'+(running?'In progress':res?(res.res==='win'?'Success':'Failed'):'')+'</span></div><ol>'+
        grp.map(x=>'<li class="'+x.kind+'">'+esc(x.text)+'</li>').join('')+'</ol></li>';
      continue;
    }
    h+='<li class="'+e.kind+'">'+esc(e.text)+'</li>'; i++;
  }
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
    head.innerHTML='<h2>Back in town</h2><span class="label">Evening, day '+S.day+(priceMult()>1?' · prices +'+Math.round((priceMult()-1)*100)+'%':'')+'</span>';
    const opt=(name,list,cur,off)=>list.map(o=>'<label class="opt'+(off&&off(o)?' off':'')+'"><input type="radio" id="'+name+'-'+o.key+'" name="'+name+'" value="'+o.key+'" '+(o.key===cur?'checked':'')+(off&&off(o)?' disabled':'')+'>'+
      '<span class="grow"><b>'+esc(o.name)+'</b><small>'+esc(o.note)+' · +'+o.energy+'</small></span><span>'+(o.cost?fmt(upkeep(o.cost)):'<span class="num" style="color:var(--muted)">free</span>')+'</span></label>').join('');
    const L=LODGING.find(x=>x.key===S.lodge), M=MEALS.find(x=>x.key===mealKey()), cost=upkeep(L.cost)+upkeep(M.cost), full=clamp(S.energy+L.energy+M.energy,0,maxE()), after=S.stomach?Math.floor(full/2):full;
    body.innerHTML='<div class="eve"><fieldset><legend class="label">Lodging</legend>'+opt('lodge',LODGING,S.lodge)+'</fieldset>'+
      '<fieldset><legend class="label">Supper</legend>'+opt('meal',MEALS,mealKey(),S.stomach?o=>o.key!=='skip':null)+(S.stomach?'<p class="empty-note"><span class="warn">Stomach ache. You\'re going to bed hungry tonight.</span></p>':'')+'</fieldset></div>'+
      '<div class="sleepbar"><span>Tonight costs '+fmt(cost)+' · wake with <b class="num">'+after+'</b> energy'+(S.stomach?' <span class="warn">(halved)</span>':'')+'</span>'+
      '<button class="primary" data-a="sleep" '+(S.gold<cost?'disabled':'')+'>'+(S.gold<cost?'Can\'t afford this':'Turn in for the night')+'</button></div>';
    return;
  }
  const rc=rerollCost();
  head.innerHTML='<h2>Adventures</h2><span class="acts"><button data-a="reroll" title="New quests for today. Price doubles each time and resets tomorrow." '+(S.ended||S.gold<rc?'disabled':'')+'>Reroll · '+fmt(rc,true)+'</button>'+(S.questsToday?'<button data-a="endDay" title="Head back to town for lodging and supper">End the day</button>':'<button data-a="rest"'+tip('Rest day',['Skip questing today for +'+CFG.restBonus+' energy.','Only before your first quest of the day.'])+' '+(S.ended?'disabled':'')+'>Rest day (+'+CFG.restBonus+')</button>')+'</span>';
  let h='';
  if(S.event&&S.event.type==='merchant'&&S.eq[S.event.slot]){
    const g=S.eq[S.event.slot];
    h+='<div class="event"><span class="label">Traveling merchant</span><div>He has his eye on your <b>'+esc(g.name)+'</b> and offers '+fmt(S.event.offer)+', about 30% over the going rate.</div>'+
      '<div class="acts"><button class="primary" data-a="merchantYes">Take the coin</button><button data-a="merchantNo">No deal</button></div></div>';
  }
  if(S.questsToday){
    const f=S.questsToday;
    h+='<div class="fatigue"><b>'+f+' quest'+(f>1?'s':'')+' done today.</b> Each extra quest raises your injury risk by '+Math.round(CFG.fatigueRisk*100)+'%. Head back when you\'ve had enough.</div>';
  }
  h+='<div class="jobs">';
  S.offers.forEach(k=>{
    const done=(S.doneToday||[]).includes(k);
    const j=job(k), c=chance(j), locked=c===0||done, oc=c>=.75?'hi':c>=.5?'md':'lo';
    const pr=jobPay(j), pay=Math.floor(pr[0]/100)+'–'+Math.floor(pr[1]/100)+'g';
    h+='<div class="job'+(done?' done':locked?' locked':'')+'" style="--tc:'+TIER_COLOR[j.tier]+'">'+
      '<div class="badge">'+ic(JOB_ICON[j.key])+'</div>'+
      '<div class="ttl"><h3>'+esc(j.name)+'</h3><span class="tier">'+TIER_NAME[j.tier]+' · '+esc(j.where)+(done?' · <span class="donetag">Done today</span>':'')+(!locked&&S.energy<jobEnergy(j)?' · <span class="tired">Too tired, odds halved</span>':'')+'</span></div>'+
      '<div class="stats"><span'+tip('Pays',['Gold for a success.','A failure pays only 25%.',wx().pay!==1?'Weather and season are already included.':''])+'>Pays<b>'+pay+'</b></span><span'+tip('Time',['How long this quest takes in real time.'])+'>Time<b>'+j.secs+'s</b></span><span'+tip('Wear',['Durability lost, spread across your gear.','A failure wears 50% more.',weather().wear!==1?weather().name+' is already included.':''])+'>Wear<b>'+jobWear(j)+'</b></span>'+
      '<span'+tip('Energy',['Used when you set out.','Setting out with less than this halves your odds.'])+'>Energy<b>−'+jobEnergy(j)+'</b></span><span'+tip('Loot',[Math.round(lootChance(j)*100)+'% chance of '+j.mat.name+(luck()?' ('+Math.round(j.loot*100)+'% base × '+(1+luck()).toFixed(1).replace(/\.0$/,'')+' luck)':''),j.gearDrop?Math.round(gearChance(j)*100)+'% chance of a gear drop'+(luck()?' ('+Math.round(j.gearDrop*100)+'% base)':''):'No gear drops here','A failed quest has a third of the loot chance.'])+'>Loot<b'+(luck()?' class="luck"':'')+'>'+Math.round(lootChance(j)*100)+'%</b></span><span'+tip('Odds',['Chance of success.','Needs '+j.min+' power. You have '+power()+'.',weather().odds?weather().name+': '+Math.round(weather().odds*100)+'%':'',S.energy<jobEnergy(j)?'Too tired: odds halved':''])+'>Odds<b class="odds '+oc+'">'+(c===0?'–':Math.round(c*100)+'%')+(wx().odds?'<i class="wxodd" title="'+esc(weather().name)+'"> '+Math.round(wx().odds*100)+'</i>':'')+'</b></span></div>'+
      '<button class="go '+(locked?'':'primary')+'" data-a="job" data-id="'+j.key+'" '+(locked||S.ended?'disabled':'')+'>'+(done?'Done':locked?'Needs '+j.min:'Set out')+'</button></div>';
  });
  body.innerHTML=h+'</div>';
}

function renderBag(){
  const mats=S.bag.filter(i=>i.kind==='mat'), tab=S.bagTab||'loot';
  const tabs='<div class="tabs"><button class="tabbtn'+(tab==='loot'?' on':'')+'" data-a="tab" data-id="loot">Bag <span class="num">'+S.bag.length+'/'+CFG.bagSize+'</span></button>'+
    '<button class="tabbtn'+(tab==='supplies'?' on':'')+'" data-a="tab" data-id="supplies">Supplies <span class="num">'+S.rations+'</span></button></div>';
  // the Sell all button stays in place on both tabs so the header never changes height
  document.getElementById('baghead').innerHTML=tabs+
    '<button data-a="sellMats" class="'+(tab==='loot'?'':'ghost')+'" '+(!mats.length||!inTown()||tab!=='loot'?'disabled':'')+'>Sell all'+(mats.length?' · '+gShort(mats.reduce((a,i)=>a+sellValue(i),0)):'')+'</button>';

  // Bag tab
  let h='<div class="bag">';
  for(let i=0;i<CFG.bagSize;i++){
    const it=S.bag[i];
    if(!it){ h+='<div class="cell blank"></div>'; continue; }
    const iconK=it.kind==='mat'?it.icon:it.slot;
    const up=it.kind==='gear'&&gearPower(it)>gearPower(S.eq[it.slot]), mk=it.kind==='mat'?marketMult(it.name):1;
    h+='<button class="cell'+(S.selBag===it.uid?' sel':'')+'" style="--rc:'+(it.kind==='mat'?'#6b7486':RARITY[it.rarity].c)+'" data-a="selBag" data-id="'+it.uid+'" aria-label="'+esc(it.name)+'"'+(it.kind==='mat'?tip(it.name,['Material','Sells for '+plain(sellValue(it))+' today ('+mk.toFixed(2)+'x usual)']):tip(it.name,[RARITY[it.rarity].label+' '+SLOT_NAME[it.slot].toLowerCase(),'Power '+it.power+' · durability '+it.dur+'/'+it.max,it.luck?'Luck ×'+(1+it.luck).toFixed(1).replace(/\.0$/,'')+' loot chance':'',up?'Stronger than what you have equipped':'']))+'>'+ic(iconK)+(up||mk>=1.2?'<span class="up">▲</span>':mk<=.8?'<span class="dn">▼</span>':'')+'</button>';
  }
  h+='</div><div class="bagdetail">';
  const it=S.bag.find(x=>x.uid===S.selBag);
  if(!it){
    // same three rows as a gear card (kept invisible) so the panel is the same height with or without a selection
    h+='<div class="detail placeholder"><div class="ghostrows" aria-hidden="true"><div class="dtop"><span class="nm">&nbsp;</span></div><div class="meta"><span>&nbsp;</span></div><div class="drow"><div class="acts"><button tabindex="-1">&nbsp;</button></div></div></div><p class="empty-note">'+(S.bag.length?'Select an item to sell or equip it.':'Loot from adventures shows up here.')+'</p></div>';
  } else if(it.kind==='mat'){
    const mk=marketMult(it.name);
    h+='<div class="detail"><div class="dtop"><span class="nm">'+esc(it.name)+'</span><span class="dsub '+(mk>=1.2?'mk-up':mk<=.8?'mk-dn':'')+'" title="Material prices change every morning">'+mk.toFixed(2)+'x usual price</span></div>'+
      '<div class="meta"><span>Material · prices change every morning</span></div>'+
      '<div class="drow"><span class="meta"><span>Today <b>'+fmt(sellValue(it))+'</b></span></span>'+
      '<div class="acts"><button class="primary" data-a="sellBag" '+(!inTown()?'disabled':'')+'>Sell · '+gShort(sellValue(it))+'</button></div></div></div>';
  } else {
    const cur=S.eq[it.slot], diff=Math.round(gearPower(it)-gearPower(cur)), r=it.dur/it.max, dc=r<.25?'low':r<.5?'mid':'';
    h+='<div class="detail"><div class="dtop"><span class="nm" style="color:'+RARITY[it.rarity].c+'" title="'+esc(it.name)+'">'+esc(it.name)+'</span><span class="dsub">'+SLOT_NAME[it.slot]+' · '+RARITY[it.rarity].label+'</span></div>'+
      '<div class="meta"><span>Power <b>'+it.power+'</b> <span style="color:'+(diff>0?'var(--good)':diff<0?'var(--bad)':'var(--muted)')+'">('+(diff>0?'+':'')+diff+' vs equipped)</span></span>'+(it.luck?'<span>Luck <b class="luck">×'+(1+it.luck).toFixed(1).replace(/\.0$/,'')+'</b></span>':'')+'</div>'+
      '<div class="drow"><div class="durrow '+dc+'"><div class="bar"><span style="width:'+r*100+'%"></span></div><span class="num">'+it.dur+'/'+it.max+'</span></div>'+
      '<div class="acts"><button class="primary" data-a="equip" '+(!inTown()?'disabled':'')+'>Equip</button><button data-a="sellBag" '+(!inTown()?'disabled':'')+'>Sell · '+gShort(sellValue(it))+'</button></div></div></div>';
  }
  h+='</div>';

  // Supplies tab
  const full=S.energy>=maxE(), sick=!!S.stomach, ate=S.rationsToday||0;
  const note=sick?'<span class="warn">Your stomach can\'t take any more today.</span>'
    : ate>=CFG.safeRations?'<span class="warn">You\'ve had '+ate+' today. Any more could upset your stomach.</span>'
    : 'Eaten today: '+ate+' of '+CFG.safeRations+' safe.';
  const sup='<div class="supply"><div class="cell" style="--rc:var(--gold)">'+ic('ration')+'<span class="qty num">'+S.rations+'</span></div>'+
    '<div style="min-width:0"><div class="nm" style="font-weight:700">Ration meal</div><p class="empty-note">Eat one any time, even on the road, for +'+CFG.rationEnergy+' energy.</p></div></div>'+
    '<div class="detail"><p class="empty-note">'+note+'</p>'+
    '<div class="acts"><button class="primary" data-a="eatRation" '+(!S.rations||full||sick||S.ended?'disabled':'')+' title="'+(sick?'Not with that stomach ache':full?'Your energy is already full':'')+'">Eat one</button>'+
    '<button data-a="buyRation" data-id="1" '+(S.gold<upkeep(CFG.rationCost)||S.ended?'disabled':'')+'>Buy 1 · '+fmt(upkeep(CFG.rationCost))+'</button>'+
    '<button data-a="buyRation" data-id="5" '+(S.gold<upkeep(CFG.rationCost)*5||S.ended?'disabled':'')+'>Buy 5 · '+fmt(upkeep(CFG.rationCost)*5)+'</button></div></div>';

  // both tabs share one stacked box, so switching tabs never changes the panel size
  document.getElementById('bag').innerHTML='<div class="bagstack"><div class="pane'+(tab==='loot'?'':' off')+'">'+h+'</div><div class="pane'+(tab==='supplies'?'':' off')+'">'+sup+'</div></div>';
}

function farmText(g){
  if(g>=1) return 'Forty acres, a red barn, and a goat that hates you. You hang your old helm on the barn door.';
  if(g>=.75) return 'A tidy smallholding with a cottage and two cows. The first winter is tight, but you make it.';
  if(g>=.5) return 'A rented plot at the edge of town. You grow turnips. So many turnips.';
  if(g>=.25) return 'A hayloft above someone else\'s farm. You help with the harvest for room and board.';
  return 'Retirement was a nice idea. You\'re back at the docks, hauling crates.';
}
function histHTML(){
  const all=loadHist(); if(!all.length) return '';
  const best=all.slice().sort((a,b)=>b.stars-a.stars||b.gold-a.gold).slice(0,5);
  const mine=best.some(r=>r.when===S.runWhen);
  return '<div class="hist"><div class="label">Best runs · '+all.length+' played</div><ol>'+best.map((r,i)=>'<li class="'+(r.when===S.runWhen?'me':'')+'"><span class="num">#'+(i+1)+'</span><span class="num">'+r.stars.toFixed(1)+' ★</span><span class="num">'+Math.floor(r.gold/100).toLocaleString()+'g</span><span class="num">'+r.days+'d</span><span class="hname" title="'+esc(r.name||'')+'">'+(r.when===S.runWhen?'This run':esc(r.name||new Date(r.when).toLocaleDateString()))+'</span></li>').join('')+'</ol>'+
    (mine?'':'<p class="empty-note" style="margin-top:6px">This run didn\'t make the top 5.</p>')+'</div>';
}
function startHTML(){
  const v=S.draftName!==undefined?S.draftName:(S.name||'');
  return '<div class="overlay"><form class="startcard" id="startform" role="dialog" aria-label="Start a new run">'+
    '<span class="label">A reverse-progression adventure</span>'+
    '<h2>Rust &amp; Retirement</h2>'+
    '<p class="lede">Thirty years of adventuring. Your back hurts, your knees click, and you want a farm. You have one last stretch of work to save up for it.</p>'+
    '<ul class="how">'+
      '<li><b>Save 5,000 gold</b> to buy your farm. You start with legendary gear and very little coin.</li>'+
      '<li><b>Your gear only goes down.</b> Every quest wears it out, and repairs cost more each time. When it\'s all broken, you retire.</li>'+
      '<li><b>Quests take real time</b>, from 10 seconds to a minute. Chain a few in a day if you have the energy, but each extra one raises your injury risk.</li>'+
      '<li><b>Evenings cost money.</b> Lodging and supper restore energy. Prices creep up the longer you stay out.</li>'+
      '<li><b>Your rating</b> is 70% gold saved and 30% days lasted. Watch the weather, the market, and your stomach.</li>'+
    '</ul>'+
    '<label class="namefield" for="hero-name"><span class="label">Your name</span>'+
      '<input id="hero-name" name="hero-name" type="text" maxlength="24" autocomplete="off" placeholder="The Old Veteran" value="'+esc(v)+'"></label>'+
    '<div class="startrow"><span class="empty-note">You\'ll be known as <b id="hero-preview">'+esc(titleFor(v))+'</b>.</span><button class="primary" type="submit">Start the last stretch</button></div>'+
  '</form></div>';
}
function renderEnd(){
  const el=document.getElementById('end');
  if(!S.started){
    if(!el.querySelector('#startform')){ el.innerHTML=startHTML(); const i=el.querySelector('#hero-name'); if(i){ try{ i.focus(); }catch(e){} } }
    return;
  }
  if(!S.ended){ el.innerHTML=''; return; }
  const sc=score();
  el.innerHTML='<div class="overlay"><div class="endcard" role="dialog" aria-label="Retirement">'+
    '<span class="label">The adventure is over</span><h2>'+esc(heroName())+(plainName(S.name)?',':'')+' retired after '+S.day+' day'+(S.day===1?'':'s')+'</h2>'+
    '<p>'+esc(S.endReason)+'</p>'+starsHTML(sc.stars,'stars')+
    '<div class="num" style="font-size:1.1rem">'+sc.stars.toFixed(1)+' of 5 stars</div><p>'+farmText(sc.g)+'</p>'+
    '<div class="scorecard"><div><span class="label">Gold saved</span><b>'+plain(S.gold)+'</b></div>'+
    '<div><span class="label">Gold score · '+Math.round(CFG.goldWeight*100)+'%</span><b>'+Math.round(sc.g*100)+'%</b></div>'+
    '<div><span class="label">Longevity · '+Math.round((1-CFG.goldWeight)*100)+'%</span><b>'+Math.round(sc.l*100)+'%</b></div>'+
    '<div><span class="label">Days of '+CFG.targetDays+'</span><b>'+S.day+'</b></div></div>'+
    histHTML()+
    '<button class="primary" data-a="newrun">Play again</button></div></div>';
}

function render(){ if(S&&!S.ended) checkMilestones(); renderTop(); renderGear(); renderJournal(); renderAdv(); renderBag(); renderEnd(); if(typeof document.querySelectorAll==='function') tipify(); }

function tick(){
  if(!S||!S.trip) return;
  const el=Date.now()-S.trip.start, left=Math.max(0,S.trip.dur-el);
  if(left<=0){
    const t=S.trip; if(!t.script){ t.script=buildScript(job(t.key)); t.next=0; }
    while(t.next<t.script.length){ log(storyText(t.script[t.next].t),'story'); t.next++; } // never skip beats, even if the tab was asleep
    resolveTrip(); save(); render(); return;
  }
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

// ---------- tooltips ----------
let TIP=null;
function tipify(){ document.querySelectorAll('[title]').forEach(el=>{ if(!el.dataset.tip) el.dataset.tip=el.getAttribute('title'); el.removeAttribute('title'); }); }
function showTip(el){
  if(!TIP){ TIP=document.createElement('div'); TIP.className='tip'; TIP.setAttribute('role','tooltip'); document.body.appendChild(TIP); }
  const raw=el.dataset.tip||''; const [t,body]=raw.includes('|')?raw.split('|'):[raw,''];
  TIP.innerHTML=(body?'<b>'+esc(t)+'</b>'+esc(body).replace(/\n\n/g,'<span class="gap"></span>').replace(/\n/g,'<br>'):esc(t));
  TIP.classList.add('on');
  const r=el.getBoundingClientRect(), tw=TIP.offsetWidth, th=TIP.offsetHeight, m=8;
  let x=r.left+r.width/2-tw/2, y=r.bottom+m;
  if(y+th>innerHeight-m) y=r.top-th-m;
  x=Math.max(m,Math.min(x,innerWidth-tw-m)); y=Math.max(m,y);
  TIP.style.left=x+'px'; TIP.style.top=y+'px';
}
function hideTip(){ if(TIP) TIP.classList.remove('on'); }
document.addEventListener('mouseover',e=>{ const el=e.target.closest&&e.target.closest('[data-tip]'); el?showTip(el):hideTip(); });
document.addEventListener('focusin',e=>{ const el=e.target.closest&&e.target.closest('[data-tip]'); el?showTip(el):hideTip(); });
document.addEventListener('scroll',hideTip,true);
document.addEventListener('click',hideTip,true);

document.addEventListener('click',e=>{
  const b=e.target.closest('button[data-a]'); if(!b||b.disabled) return;
  const a=b.dataset.a; if(!A[a]) return;
  if(!muted) ac();
  if(a!=='newrun-ask'&&a!=='newrun-no') S.askNew=false;
  A[a](b.dataset.id); save(); render();
});
document.addEventListener('submit',e=>{
  if(e.target.id!=='startform') return;
  e.preventDefault(); if(!muted) ac(); A.begin(); save(); render();
});
document.addEventListener('input',e=>{ if(e.target.id==='hero-name' && S){ S.draftName=e.target.value; const pv=document.getElementById('hero-preview'); if(pv) pv.textContent=titleFor(e.target.value); } });
document.addEventListener('change',e=>{
  if(e.target.id==='hero-name') return;
  if(e.target.name==='lodge') S.lodge=e.target.value;
  if(e.target.name==='meal') S.meal=e.target.value;
  save(); render();
});

S=load();
if(S){
  if(S.started===undefined) S.started=true; // saves from before the start screen existed
  if(S.eq && S.eq.trinket===undefined){ const g=START_GEAR.find(x=>x.slot==='trinket'); S.eq.trinket={...g, uid:S.nextId++, kind:'gear', dur:g.max, repairs:0}; }
  if(!S.injuries) S.injuries=[];
  if(S.questsToday===undefined){ S.questsToday=0; S.doneToday=[]; }
  if(!S.market) rollMarket();
  if(!S.weather) S.weather=rollWeather();
  if(S.ms===undefined){ S.ms=-1; while(S.ms+1<MILESTONES.length && S.gold>=MILESTONES[S.ms+1].at) S.ms++; }
}
if(!S){ S=newState(); S.started=false; startDay(); save(); }
render();
