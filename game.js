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
// Lasting injuries from failed adventures
const INJURIES = [
  {key:'knee',name:'Bad Knee',desc:'-10 max energy',energy:-10,power:0,line:"Your knee twists the wrong way. It's never going to be quite right again."},
  {key:'back',name:'Thrown-Out Back',desc:'-8 max energy',energy:-8,power:0,line:"Something in your back goes pop. You walk home bent like a question mark."},
  {key:'ribs',name:'Cracked Ribs',desc:'-6 max energy, -1 power',energy:-6,power:-1,line:"You feel a rib crack. Breathing is a whole project now."},
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
  'Road-Worn Boots':"The Road-Worn Boots fall apart. They walked you across half the world. Barefoot it is."
};
const GOODBYE_LEGENDARY = "The {name} shatters. Legends don't last forever. Neither do you.";
const GOODBYE_GENERIC = ["Your {name} gives out. It had a good run.","The {name} breaks. You give it a respectful nod before tossing it.","The {name} is done for. Easy come, easy go."];

// secs = how long the adventure takes. loot = chance of materials, gearDrop = chance of a gear piece (on success)
const JOBS = [
  {key:"docks",tier:0,name:"Haul Crates",where:"The docks",min:0,secs:10,pay:[200,500],wear:1,energy:20,loot:0.03,gearDrop:0,mat:{name:"Crate of Salted Fish",icon:"crate",v:[300,600]},prefix:""},
  {key:"herbs",tier:0,name:"Gather Moonleaf",where:"Willow Hollow",min:0,secs:12,pay:[300,600],wear:1,energy:18,loot:0.05,gearDrop:0,mat:{name:"Bundle of Moonleaf",icon:"herb",v:[400,800]},prefix:""},
  {key:"rooster",tier:1,name:"Rooster Roundup",where:"Fenwick Farm",min:5,secs:14,pay:[700,1200],wear:3,energy:18,loot:0.06,gearDrop:0.01,mat:{name:"Prize Rooster Feather",icon:"feather",v:[600,1200]},prefix:"Barnyard"},
  {key:"rats",tier:1,name:"Cellar Rats",where:"Old Town",min:8,secs:15,pay:[800,1400],wear:5,energy:20,loot:0.06,gearDrop:0.01,mat:{name:"Bundle of Rat Pelts",icon:"pelt",v:[800,1500]},prefix:"Cellar-Found"},
  {key:"wolves",tier:1,name:"Wolf Pack",where:"Hollow Fen",min:12,secs:18,pay:[900,1500],wear:6,energy:24,loot:0.07,gearDrop:0.01,mat:{name:"Gray Wolf Pelt",icon:"pelt",v:[1000,1800]},prefix:"Wolfhide"},
  {key:"goblins",tier:2,name:"Goblin Camp",where:"Thornwood",min:20,secs:22,pay:[1800,2800],wear:10,energy:28,loot:0.08,gearDrop:0.02,mat:{name:"Goblin Trinkets",icon:"trinket",v:[1500,3000]},prefix:"Goblin-Made"},
  {key:"crypt",tier:2,name:"Restless Crypt",where:"Ashby Churchyard",min:24,secs:26,pay:[2000,3000],wear:11,energy:30,loot:0.08,gearDrop:0.02,mat:{name:"Grave Silver",icon:"gem",v:[2000,3500]},prefix:"Gravewarden's"},
  {key:"escort",tier:3,name:"Caravan Escort",where:"Salt Road",min:30,secs:30,pay:[2800,4000],wear:13,energy:35,loot:0.1,gearDrop:0.03,mat:{name:"Spice Sachet",icon:"sachet",v:[3000,5000]},prefix:"Caravan Guard's"},
  {key:"bridge",tier:3,name:"Bandit Toll Bridge",where:"Ferris Crossing",min:32,secs:30,pay:[3000,4200],wear:14,energy:34,loot:0.1,gearDrop:0.03,mat:{name:"Stolen Silverware",icon:"trinket",v:[3000,5000]},prefix:"Bridge Warden's"},
  {key:"mine",tier:3,name:"Haunted Mine",where:"Copperdeep",min:34,secs:32,pay:[3000,4400],wear:15,energy:36,loot:0.1,gearDrop:0.03,mat:{name:"Copper Ore Nugget",icon:"gem",v:[3500,5500]},prefix:"Miner's"},
  {key:"ogre",tier:4,name:"Ogre Bounty",where:"Millbrook",min:42,secs:38,pay:[4000,6000],wear:18,energy:40,loot:0.12,gearDrop:0.04,mat:{name:"Ogre Tusk",icon:"tusk",v:[5000,8000]},prefix:"Ogre-Hide"},
  {key:"troll",tier:4,name:"Swamp Troll",where:"Mirewater",min:45,secs:40,pay:[4200,6400],wear:20,energy:42,loot:0.12,gearDrop:0.04,mat:{name:"Matted Troll Horn",icon:"horn",v:[5500,8500]},prefix:"Trollhide"},
  {key:"wyvern",tier:5,name:"Wyvern Nest",where:"Gray Cliffs",min:52,secs:48,pay:[6400,9200],wear:26,energy:48,loot:0.14,gearDrop:0.05,mat:{name:"Wyvern Egg",icon:"egg",v:[9000,15000]},prefix:"Wyvernbone"},
  {key:"necro",tier:5,name:"The Hedge Necromancer",where:"Blackmoor",min:54,secs:50,pay:[6800,9600],wear:27,energy:50,loot:0.14,gearDrop:0.05,mat:{name:"Cursed Grimoire",icon:"skull",v:[10000,16000]},prefix:"Bone-Carved"},
  {key:"giant",tier:5,name:"Hill Giant's Toll",where:"The Highpass",min:56,secs:52,pay:[7200,10000],wear:30,energy:52,loot:0.15,gearDrop:0.05,mat:{name:"Giant's Toe Ring",icon:"gem",v:[11000,17000]},prefix:"Giantsteel"},
  {key:"rival",tier:6,name:"Old Rival's Last Duel",where:"Dunmore Arena",min:58,secs:58,pay:[12000,17000],wear:38,energy:55,loot:0.18,gearDrop:0.07,mat:{name:"Rival's Champion Medal",icon:"medal",v:[15000,25000]},prefix:"Rival's"},
  {key:"drake",tier:6,name:"The Ashen Drake",where:"Cinder Peak",min:60,secs:60,pay:[13000,18000],wear:42,energy:60,loot:0.18,gearDrop:0.07,mat:{name:"Ashen Drake Scale",icon:"scale",v:[18000,28000]},prefix:"Ashen"}
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
   "Somebody's parrot keeps calling you grandpa.",
   "A dockhand asks if you're the one from the songs. You say no. You are.",
   "You find a crate labeled DO NOT DROP. You carry that one very carefully."
  ],
  "win": [
   "The last crate hits the dock. The foreman nods, which is high praise from him.",
   "The ship sails on time. The foreman tosses you an apple on top of your pay."
  ],
  "lose": [
   "You drop a crate of wine. The foreman takes it out of your pay.",
   "You pull something in your shoulder and spend the afternoon sitting on a barrel."
  ]
 },
 "herbs": {
  "go": [
   "You head into Willow Hollow with a basket and a borrowed pair of shears."
  ],
  "beats": [
   "Moonleaf only grows in the shade. Naturally, it's all down a steep ravine.",
   "You find a patch and kneel down. Getting back up is the hard part.",
   "A squirrel watches you work and seems unimpressed.",
   "You mistake a nettle for moonleaf. Your hand reminds you for an hour.",
   "The quiet is nice. You could get used to this kind of work."
  ],
  "win": [
   "Your basket's full and smells like mint and rain. The apothecary pays on the spot."
  ],
  "lose": [
   "Half your basket turns out to be weeds. The apothecary laughs and pays you for the rest."
  ]
 },
 "rooster": {
  "road": false,
  "go": [
   "Farmer Fenwick waves you over. His prize rooster has escaped again, along with the whole flock."
  ],
  "beats": [
   "The rooster stands on the fence and stares you down like a dragon would.",
   "You dive for a hen and catch only a mouthful of straw.",
   "The rooster pecks your {gear}. It leaves a mark. Somehow.",
   "Fenwick shouts helpful advice from the porch. None of it is helpful.",
   "You corner the flock behind the barn. They look at you, then at each other.",
   "You notice the farm is for sale. You file that away."
  ],
  "win": [
   "The last hen goes in the coop. The rooster gives you a look of grudging respect."
  ],
  "lose": [
   "The rooster escapes into the woods. Fenwick pays you for the hens, at least."
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
   "One runs up your leg. You do a little dance nobody needs to see.",
   "Your torch sputters. The squeaking gets closer.",
   "There's a rat wearing a tiny crown. You decide not to ask."
  ],
  "win": [
   "The last rat goes down. The cellar is quiet except for your breathing.",
   "The innkeeper unlocks the door and hands you a mug of ale before you even ask."
  ],
  "lose": [
   "The rats swarm. You scramble up the stairs with your pride in tatters.",
   "The rat king escapes into the walls. The innkeeper pays you half and sighs."
  ]
 },
 "wolves": {
  "go": [
   "You head out to Hollow Fen. A shepherd says the wolves took three sheep this week."
  ],
  "beats": [
   "Howling starts up on all sides. You count at least six voices.",
   "Tracks in the mud lead deeper into the reeds than you'd like.",
   "A wolf darts in and bites at your {gear}. Then it's gone again.",
   "You build a fire and wait. Old trick. Still works.",
   "The pack leader is huge, gray, and missing an ear. It looks as tired as you."
  ],
  "win": [
   "The pack scatters across the fen and doesn't come back. The shepherd is very grateful."
  ],
  "lose": [
   "The wolves wear you down until you have to fall back. The shepherd pays you for trying."
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
   "Their chieftain charges you on a very confused goat.",
   "A goblin tries to sell you your own boot.",
   "You find a wanted poster of yourself from twenty years ago. You look great."
  ],
  "win": [
   "The goblins scatter into the trees, yelling that this isn't over. It's over.",
   "The chieftain surrenders his goat. You let him keep it."
  ],
  "lose": [
   "There are way more goblins than the bounty said. You retreat, pelted with rocks the whole way.",
   "The goat headbutts you into a bush. The goblins cheer."
  ]
 },
 "crypt": {
  "go": [
   "The priest at Ashby hands you a torch and a bucket of holy water. He doesn't come in."
  ],
  "beats": [
   "The crypt door groans open. Something inside groans back.",
   "Skeletons climb out of the walls, rattling and clacking.",
   "A bony hand grabs your {gear}. You shake it off. It keeps shaking.",
   "You find the grave of an old party member. You stop to pay your respects.",
   "The holy water works great until you run out of it.",
   "Candles light themselves one by one down the hall. That's never good."
  ],
  "win": [
   "The last skeleton falls still. The crypt finally goes quiet. The priest blesses you twice."
  ],
  "lose": [
   "The dead are too many and too restless. You back out and bar the door behind you."
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
   "The spice merchant tries to haggle your pay down in the middle of the ambush.",
   "A sandstorm rolls in. You march with your eyes shut.",
   "The merchant's kid asks for war stories every night. You tell the good ones."
  ],
  "win": [
   "The caravan rolls into town with every wagon intact. The merchants are all smiles.",
   "The kid gives you a drawing of you fighting the bandits. You keep it."
  ],
  "lose": [
   "The bandits make off with two wagons. The merchants pay you, but only barely."
  ]
 },
 "bridge": {
  "go": [
   "Bandits have taken over the bridge at Ferris Crossing and are charging a toll. You go to pay it. With your fists."
  ],
  "beats": [
   "The bandit boss says the toll is five silver. You tell him the toll is now you.",
   "Two bandits rush you at once. Your {gear} catches a club.",
   "Someone gets knocked into the river. It isn't you, this time.",
   "The bandit boss pulls out a crossbow. You pull out thirty years of experience.",
   "A farmer with a cart waits patiently for the fight to finish."
  ],
  "win": [
   "The bandits jump into the river and swim for it. The farmer crosses for free."
  ],
  "lose": [
   "You end up in the river, soaked and sore. The bandits laugh, but they leave the bridge."
  ]
 },
 "mine": {
  "go": [
   "The miners at Copperdeep say the lower tunnels are haunted. Nobody's been down there in weeks."
  ],
  "beats": [
   "Your lantern shows old pickaxes left right where they were dropped.",
   "Ghostly tapping echoes from deep in the rock.",
   "A cart rolls toward you on its own. You jump out of the way just in time.",
   "A pale shape drifts out of the wall and passes right through your {gear}. It's freezing.",
   "The ghost is an old miner who just wants someone to finish his shift.",
   "Part of the ceiling collapses behind you. You'll have to find another way out."
  ],
  "win": [
   "You help the ghost finish his last shift, and he finally fades away smiling. The tunnels go quiet."
  ],
  "lose": [
   "The ghost won't be calmed. You run out of lantern oil and feel your way back to daylight."
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
   "You find the miller. He's fine, just very annoyed and covered in flour.",
   "The ogre sneezes flour all over you. You both stop to cough.",
   "He picks you up by the ankle. You've been here before. You know what to do."
  ],
  "win": [
   "The ogre goes down with a thud that rattles every window in Millbrook. The village cheers.",
   "The miller bakes you a loaf of bread the size of a shield."
  ],
  "lose": [
   "The ogre tosses you into the millpond. You get the miller out, but the ogre gets away."
  ]
 },
 "troll": {
  "go": [
   "You wade into Mirewater. The mud tries to steal your boots with every step."
  ],
  "beats": [
   "The smell hits you before the troll does.",
   "The troll rises out of the bog, dripping and grinning.",
   "You cut it. It heals. You cut it again. It heals again.",
   "Its fist slams into your {gear}. You fly backward into the muck.",
   "You remember the old rule: fire or acid. You have neither. You improvise.",
   "Swamp leeches find their way into places leeches should not be."
  ],
  "win": [
   "You trap the troll under a fallen tree and set the whole thing ablaze. It doesn't get back up."
  ],
  "lose": [
   "The troll just won't stay down. You crawl out of the swamp and spend an hour pulling off leeches."
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
   "You hang off a ledge by one hand. Your knees file a formal complaint.",
   "Its poison stinger misses you by an inch. You feel the breeze.",
   "You find the bones of the last adventurer who tried this. Bad sign."
  ],
  "win": [
   "The wyvern flees into the clouds. You climb down with the loot strapped to your back."
  ],
  "lose": [
   "The wyvern drives you off the cliffs. You slide most of the way down on your backside."
  ]
 },
 "necro": {
  "go": [
   "The village of Blackmoor is empty. A man in robes has been raising their dead to plow his fields."
  ],
  "beats": [
   "Zombies in straw hats shamble across the fields. Some of them are actually pretty good at farming.",
   "The necromancer sees you coming and sighs. He was hoping for a quiet day.",
   "A wall of bone rises out of the ground. Your {gear} cracks right through it.",
   "He tries to raise a skeleton dragon. He only gets the tail.",
   "You realize he's about your age. He tells you he's retiring too, after this harvest.",
   "Cold magic washes over you. Your bones ache more than usual. A lot more."
  ],
  "win": [
   "The necromancer surrenders and agrees to try regular farming. The dead of Blackmoor lie back down."
  ],
  "lose": [
   "His undead farmhands chase you off the fields. Honestly, they're better farmers than you'll be."
  ]
 },
 "giant": {
  "go": [
   "A hill giant has parked himself across the Highpass and won't let anyone through."
  ],
  "beats": [
   "The giant sits on a boulder, picking his teeth with a tree trunk.",
   "He throws a rock the size of a cottage. You dive behind another rock.",
   "His foot comes down right next to you. The ground shakes.",
   "You climb up his leg. He swats at you like a mosquito and catches your {gear}.",
   "He challenges you to a riddle contest instead. You lose the riddle contest.",
   "Turns out he just wants someone to talk to. You talk. Then you fight anyway."
  ],
  "win": [
   "The giant topples off the pass and lands with a boom you feel in your teeth. The road is open."
  ],
  "lose": [
   "The giant kicks you all the way back down the mountain path. Merchants still have to go around."
  ]
 },
 "rival": {
  "go": [
   "A letter arrives with an old crest on it. Your rival from the old days wants one last duel.",
   "You head to Dunmore Arena. The crowd is bigger than you expected."
  ],
  "beats": [
   "Your rival steps into the sand. Older, grayer, and still smug.",
   "He opens with the same move he used thirty years ago. You still remember the counter.",
   "Steel rings on steel. His blade bites into your {gear}.",
   "The crowd starts chanting your old nickname. You'd forgotten it. You'd forgotten them.",
   "You both stop to catch your breath at the same time. Neither of you mentions it.",
   "He whispers that he's retiring after this too. A vineyard, he says."
  ],
  "win": [
   "You disarm him with your last bit of strength. He laughs, shakes your hand, and invites you to visit the vineyard.",
   "The crowd roars. Your rival bows to you for the first time in thirty years."
  ],
  "lose": [
   "He knocks you down and offers you a hand up. The crowd still cheers for you anyway.",
   "You lose, but it's the best fight you've had in years. He buys the drinks after."
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
   "Your lungs burn. Your arms burn. Honestly, everything burns.",
   "It roars so loud the rocks start to fall. You keep your footing. Barely.",
   "You spot the scar you gave it decades ago. It spots yours."
  ],
  "win": [
   "The Ashen Drake crashes down the mountain. You sit on a rock for a long time, just breathing.",
   "The drake falls. Below, the whole valley sees the smoke stop rising."
  ],
  "lose": [
   "The drake's fire drives you off the peak. You live, which is more than most can say."
  ]
 }
};
// Road beats can show up on any adventure
const STORY_ROAD = [
 "Your knee pops on the way up a hill. You pretend it didn't.",
 "A young adventurer recognizes you and asks you to sign their shield.",
 "You stop to stretch. It takes longer than it used to.",
 "You catch yourself thinking about turnips again.",
 "Your {gear} creaks with every step.",
 "A bard on the road is singing a song about you. He gets half the details wrong.",
 "You pass a farm for sale and stare at it a little too long.",
 "It starts raining. Of course it does.",
 "You count your coins in your head. Still not enough. Not yet.",
 "An old tavern sign makes you smile. You got thrown out of there once. Twice, actually."
];
const TIER_COLOR = ['var(--r-common)','var(--r-common)','var(--good)','var(--r-rare)','var(--r-rare)','var(--r-epic)','var(--r-legendary)'];
const TIER_NAME = ['Odd job','Easy','Easy','Medium','Hard','Hard','Deadly'];
const GEAR_BASES = {weapon:['Cleaver','Longsword','Warhammer','Spear'],armor:['Brigandine','Chainmail','Scale Coat'],shield:['Buckler','Tower Shield','Round Shield'],helm:['Sallet','Coif','Great Helm'],boots:['Greaves','Riding Boots','Sabatons']};
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
  clock:'<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>'
};
const JOB_ICON = {docks:"crate",herbs:"herb",rooster:"feather",rats:"pelt",wolves:"pelt",goblins:"trinket",crypt:"gem",escort:"sachet",bridge:"trinket",mine:"gem",ogre:"tusk",troll:"horn",wyvern:"egg",necro:"skull",giant:"gem",rival:"medal",drake:"scale"};
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
const jobWear = j=>Math.round(j.wear*wx().wear);
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
function log(text,kind=''){ S.log.unshift({d:S.day,text,kind}); S.log=S.log.slice(0,120); }

const live = ()=>SLOTS.map(k=>S.eq[k]).filter(g=>g&&g.dur>0);
function gearPower(g){ if(!g||g.dur<=0) return 0; return g.dur/g.max<.25 ? g.power/2 : g.power; }
const power = ()=>Math.max(0,Math.round(SLOTS.reduce((a,k)=>a+gearPower(S.eq[k]),0)+injuries().reduce((a,i)=>a+i.power,0)));
const repairCost = g=>Math.round(g.repairBase*Math.pow(CFG.repairGrowth,g.repairs));
function sellValue(it){
  if(it.kind==='mat') return Math.round(it.value*marketMult(it.name));
  if(it.dur<=0) return Math.round(it.sell*.1);
  const r=it.dur/it.max;
  return Math.round(it.sell*(it.rarity==='legendary'?.6+.4*r:.4+.6*r));
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
    power, max, dur:Math.round(max*(.6+Math.random()*.4)), repairs:0, repairBase:power*250, sell:Math.round(power*500*m)};
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
  const l=live(); if(!l.length||total<=0) return [];
  const w=l.map(g=>WEAR_WEIGHT[g.slot]*(.7+Math.random()*.6)), sum=w.reduce((a,b)=>a+b,0), broke=[];
  l.forEach((g,i)=>{ const d=Math.max(total>=5?1:0,Math.round(total*w[i]/sum)); g.dur=Math.max(0,g.dur-d); if(g.dur===0) broke.push(g); });
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
  const n=clamp(Math.round(j.secs/9),1,st.beats.length);
  const beats=st.beats.map((t,i)=>({t,i,r:Math.random()})).sort((a,b)=>a.r-b.r).slice(0,n).sort((a,b)=>a.i-b.i).map(b=>b.t); // keep story order
  if(st.road!==false && Math.random()<.5) beats.unshift(pick(STORY_ROAD)); // road beats happen on the way there
  beats.forEach((t,i)=>out.push({at:.18+(.62*(i+.5)/beats.length),t}));
  return out;
}
function storyText(t){ const l=live(); return t.replace(/\{gear\}/g,()=>l.length?pick(l).name:'gear'); }
function resolveTrip(){
  const t=S.trip, j=job(t.key), ok=t.ok!==undefined?t.ok:Math.random()<t.c;
  log(pick(STORY[j.key][ok?'win':'lose']),'story');
  const pr=jobPay(j); let pay=rand(pr[0],pr[1]), wear=jobWear(j);
  if(!ok){ pay=Math.round(pay*.25); wear=Math.round(wear*1.5); }
  S.gold+=pay;
  const broke=applyWear(wear);
  log((ok?'Success at ':'It went badly at ')+j.name+'. Earned '+plain(pay)+'.',ok?'good':'bad');
  sfx(ok?'win':'lose');
  broke.forEach(g=>{ log(g.name+' breaks.','bad'); log(goodbye(g),'story'); });
  if(broke.length) setTimeout(()=>sfx('break'),350);
  maybeInjure(j,ok);
  if(Math.random()<(ok?j.loot:j.loot*.3)){
    const it={uid:S.nextId++, kind:'mat', name:j.mat.name, icon:j.mat.icon, rarity:'common', value:rand(j.mat.v[0],j.mat.v[1])};
    if(addToBag(it)){ log('Loot: '+it.name+' (usually worth '+plain(it.value)+').','loot'); sfx('loot'); }
  }
  if(ok && Math.random()<j.gearDrop){
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
    S.trip.beat=STORY[j.key].go[0];
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
      '<div class="bars"><div class="bar fund" title="Retirement fund. Notches mark farm milestones."><span style="width:'+pct+'%"></span>'+MILESTONES.slice(0,-1).map(m=>'<i class="tick'+(S.gold>=m.at?' on':'')+'" style="left:'+(m.at/CFG.goal*100)+'%"></i>').join('')+'</div><span class="num">'+Math.floor(S.gold/100).toLocaleString()+' / '+(CFG.goal/100).toLocaleString()+'g</span>'+
      '<div class="bar energy '+(lowE?'low':'')+'" title="Energy"><span style="width:'+S.energy+'%"></span></div><span class="num">'+S.energy+' / '+maxE()+'</span></div>'+
    '</div></div>'+
    '<div class="hstats">'+
      '<div class="tile"><span class="label">Purse</span><b>'+fmt(S.gold,true)+'</b></div>'+
      '<div class="tile power"><span class="label">Power</span><b>'+power()+'</b></div>'+
      '<div class="tile"><span class="label">Rating so far</span>'+starsHTML(sc.stars,'mini-stars')+'</div>'+
      '<div class="hbtns">'+(S.askNew
        ? '<button class="confirm" data-a="newrun">Yes, start over</button><button data-a="newrun-no">Keep playing</button>'
        : '<button data-a="mute" title="Sound effects">'+(muted?'Sound off':'Sound on')+'</button><button data-a="retire" '+(S.trip||S.ended?'disabled':'')+'>Retire now</button><button data-a="newrun-ask">New run</button>')+'</div>'+
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
  const nextM=MILESTONES[(S.ms===undefined?-1:S.ms)+1];
  let h='<div class="doll"><div class="slots">'+['helm','armor','boots'].map(slotHTML).join('')+'</div>'+
    '<div class="center"><div class="cstat hero"><span class="label">Power</span><b>'+power()+'</b></div>'+
    '<div class="cstat"><span class="label">Energy</span><b>'+S.energy+'<small>/'+maxE()+'</small></b></div>'+
    '<div class="cstat"><span class="label">Next goal'+(nextM?' · '+Math.floor(nextM.at/100).toLocaleString()+'g':'')+'</span><b class="farmnext">'+(nextM?esc(nextM.name):'All saved up')+'</b></div></div>'+
    '<div class="slots">'+['weapon','shield'].map(slotHTML).join('')+'</div></div>';
  const g=S.eq[S.selSlot];
  if(!g){
    h+='<div class="detail"><div class="dtop"><span class="nm">'+SLOT_NAME[S.selSlot]+' slot</span><span class="dsub">Empty</span></div><p class="empty-note">Equip something from your bag.</p></div>';
  } else {
    const r=g.dur/g.max, dc=r<.25?'low':r<.5?'mid':'', rc=repairCost(g);
    let state=g.dur<=0?' · <span style="color:var(--bad)">Broken</span>':r<.25?' · <span style="color:var(--gold)">Worn, half power</span>':'';
    h+='<div class="detail"><div class="dtop"><span class="nm" style="color:'+RARITY[g.rarity].c+'" title="'+esc(g.name)+'">'+esc(g.name)+'</span><span class="dsub">'+RARITY[g.rarity].label+'</span></div>'+
      '<div class="meta"><span>Power <b>'+g.power+'</b></span><span>Repairs <b>'+g.repairs+'</b></span><span>Worth <b>'+fmt(sellValue(g),true)+'</b></span>'+state.replace(' · ','')+'</div>'+
      '<div class="drow"><div class="durrow '+dc+'"><div class="bar"><span style="width:'+r*100+'%"></span></div><span class="num">'+g.dur+'/'+g.max+'</span></div>'+
      '<div class="acts">'+(S.pendingSell==='eq'
        ? '<button class="confirm" data-a="sellEq">Sell for '+plain(sellValue(g))+'</button><button data-a="sellCancel">Keep it</button>'
        : '<button data-a="repair" '+(!inTown()||g.dur>=g.max||S.gold<rc?'disabled':'')+'>Repair · '+fmt(rc,true)+'</button><button class="danger" data-a="sellAsk" '+(!inTown()?'disabled':'')+'>Sell…</button>')+
      '</div></div></div>';
  }
  const inj=injuries();
  const stom=S.stomach?'<div class="inj" title="Too many rations today. You\'ll wake up with half your energy."><span><b>Stomach Ache</b><small>half energy tomorrow</small></span></div>':'';
  const injHTML='<div class="injuries">'+stom+(inj.length
    ? inj.map(i=>'<div class="inj" title="'+esc(i.name+': '+i.desc)+'"><span><b>'+esc(i.name)+'</b><small>'+esc(i.desc.replace(' max energy',' energy'))+'</small></span><button data-a="heal" data-id="'+i.key+'" title="See the healer for '+plain(healCost())+'" '+(!inTown()||S.gold<healCost()?'disabled':'')+'>Heal</button></div>').join('')
    : (stom?'':'<div class="inj-none"><span class="label">Injuries</span><span class="empty-note">None yet</span></div>'))+'</div>';
  // separator, then weather, then injuries
  h+='<div class="conds"><div class="wxcard" title="Weather changes every morning"><span class="label">'+season().name+'</span><b>'+esc(weather().name)+'</b><span>'+esc(wxNote())+'</span></div>'+injHTML+'</div>';
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
  head.innerHTML='<h2>Adventures</h2><span class="acts"><button data-a="reroll" title="New quests for today. Price doubles each time and resets tomorrow." '+(S.ended||S.gold<rc?'disabled':'')+'>Reroll · '+fmt(rc,true)+'</button>'+(S.questsToday?'<button data-a="endDay" title="Head back to town for lodging and supper">End the day</button>':'<button data-a="rest" '+(S.ended?'disabled':'')+'>Rest day (+'+CFG.restBonus+')</button>')+'</span>';
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
      '<div class="stats"><span>Pays<b>'+pay+'</b></span><span>Time<b>'+j.secs+'s</b></span><span>Wear<b>'+jobWear(j)+'</b></span>'+
      '<span>Energy<b>−'+jobEnergy(j)+'</b></span><span>Loot<b>'+Math.round(j.loot*100)+'%</b></span><span>Odds<b class="odds '+oc+'">'+(c===0?'–':Math.round(c*100)+'%')+(wx().odds?'<i class="wxodd" title="'+esc(weather().name)+'"> '+Math.round(wx().odds*100)+'</i>':'')+'</b></span></div>'+
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
    h+='<button class="cell'+(S.selBag===it.uid?' sel':'')+'" style="--rc:'+(it.kind==='mat'?'#6b7486':RARITY[it.rarity].c)+'" data-a="selBag" data-id="'+it.uid+'" aria-label="'+esc(it.name)+'">'+ic(iconK)+(up||mk>=1.2?'<span class="up">▲</span>':mk<=.8?'<span class="dn">▼</span>':'')+'</button>';
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
      '<div class="meta"><span>Power <b>'+it.power+'</b> <span style="color:'+(diff>0?'var(--good)':diff<0?'var(--bad)':'var(--muted)')+'">('+(diff>0?'+':'')+diff+' vs equipped)</span></span></div>'+
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

function render(){ if(S&&!S.ended) checkMilestones(); renderTop(); renderGear(); renderJournal(); renderAdv(); renderBag(); renderEnd(); }

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
  if(!S.injuries) S.injuries=[];
  if(S.questsToday===undefined){ S.questsToday=0; S.doneToday=[]; }
  if(!S.market) rollMarket();
  if(!S.weather) S.weather=rollWeather();
  if(S.ms===undefined){ S.ms=-1; while(S.ms+1<MILESTONES.length && S.gold>=MILESTONES[S.ms+1].at) S.ms++; }
}
if(!S){ S=newState(); S.started=false; startDay(); save(); }
render();
