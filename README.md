# Rust & Retirement

A little reverse-progression game. You start as a seasoned veteran adventurer with great gear, and now it's time to retire and become a farmer. The catch? You need money to retire with.

So instead of leveling up, you're winding down. Keep using your gear until it falls apart, and by the time it all breaks, try to have enough gold saved for your farm.

## How to Play

Every run starts with a short intro screen that explains the basics and asks for your name. Type Robert and you'll be known as **Robert, the Old Veteran** in the header, the journal, and the ending screen. Your best runs list shows the name too. Leave it blank and you'll just go by The Old Veteran.

The screen is split into three columns:

- **Left:** Your character on top, with six gear slots and your combat power. Your bag sits underneath, with two tabs: **Bag** for loot and gear, and **Supplies** for rations.
- **Middle:** The journal. Everything that happens gets logged here, newest first.
- **Right:** Adventures, or your evening choices once you're back in town.

Each day has two parts:

**Daytime:** Pick an adventure, or take a rest day. Harder adventures pay more, but they wear your gear down faster, drain more energy, and take longer. When you get back, you can keep going as long as you have the energy. Haul Crates, Gather Moonleaf, and Rooster Roundup only cost 58 energy together, so you could do all three in one day. Each quest can only be done once a day. When you finish one, it drops off the board and a new quest takes its place. Every extra quest after the first adds 5% to your injury risk, so hit **End the day** when you've had enough.

**Evening:** Choose where to sleep and what to eat. Better lodging and food restore more energy, but they cost money that would otherwise go toward retirement.

While you're in town, you can repair gear, sell gear, sell loot, and equip new stuff from your bag. Once you set out on an adventure, you're locked in until you get back.

The run ends when your last piece of gear breaks or gets sold and you have nothing left in your bag to equip. You can also hit **Retire now** any time you're in town. Anything left in your bag gets sold automatically when you retire.

## Money

Uses D&D-style currency:

| Coin | Value |
|------|-------|
| 1 gold (g) | 10 silver |
| 1 silver (s) | 10 copper |

Your retirement goal is **5000 gold**.

## Adventures

Adventures take real time, from 10 seconds for the easy stuff up to a full minute for the big ones. While you wait, the adventure plays out in the journal as its own card that reads top to bottom. Every quest has two hand-written storylines, and one gets picked each time. The story uses your actual gear, so your shield blocks the claws and your helm takes the rocks. The last line tells you which piece took the worst of it.

There are 37 adventures in rotation. The board shows 6 at a time: Haul Crates plus five random picks from the rest. It rerolls every new morning. Don't like today's board? Hit **Reroll** for a fresh one. The first reroll each day costs 5 silver, and every reroll after that costs double the last (5s, 1g, 2g, 4g, and so on). The price resets every morning. A failed adventure pays only 25% and wears your gear down 50% more.

| Adventure | Difficulty | Power needed | Time | Pays | Material drop | Gear drop |
|-----------|------------|--------------|------|------|---------------|-----------|
| Haul Crates | Odd job | 0 | 10s | 2 to 5g | 3% | None |
| Deliver the Post | Odd job | 0 | 11s | 2 to 5g | 4% | None |
| Gather Moonleaf | Odd job | 0 | 12s | 3 to 6g | 5% | None |
| Sheep Shearing | Odd job | 0 | 13s | 3 to 6g | 5% | None |
| Rooster Roundup | Easy | 5 | 14s | 7 to 12g | 6% | 1% |
| Angry Beehive | Easy | 6 | 14s | 7 to 12g | 6% | 1% |
| Giant Pumpkin Haul | Easy | 7 | 16s | 8 to 13g | 6% | 1% |
| Cellar Rats | Easy | 8 | 15s | 8 to 14g | 6% | 1% |
| Spider Nest | Easy | 10 | 17s | 9 to 15g | 7% | 1% |
| Tavern Bouncer | Easy | 11 | 16s | 9 to 14g | 7% | 1% |
| Wolf Pack | Easy | 12 | 18s | 9 to 15g | 7% | 1% |
| Kobold Tunnels | Easy | 18 | 22s | 17 to 26g | 8% | 2% |
| Goblin Camp | Easy | 20 | 22s | 18 to 28g | 8% | 2% |
| Smugglers' Cove | Easy | 22 | 24s | 19 to 29g | 8% | 2% |
| The Walking Scarecrow | Easy | 22 | 24s | 19 to 28g | 8% | 2% |
| Restless Crypt | Easy | 24 | 26s | 20 to 30g | 8% | 2% |
| Great Tusked Boar | Easy | 26 | 26s | 21 to 31g | 9% | 2% |
| Caravan Escort | Medium | 30 | 30s | 28 to 40g | 10% | 3% |
| Bandit Toll Bridge | Medium | 32 | 30s | 30 to 42g | 10% | 3% |
| The Bog Witch's Bargain | Medium | 32 | 32s | 30 to 43g | 10% | 3% |
| Haunted Mine | Medium | 34 | 32s | 30 to 44g | 10% | 3% |
| Lighthouse Siege | Medium | 35 | 34s | 32 to 46g | 10% | 3% |
| Village Tourney | Medium | 36 | 32s | 32 to 45g | 10% | 3% |
| Ogre Bounty | Hard | 42 | 38s | 40 to 60g | 12% | 4% |
| Basilisk Den | Hard | 44 | 40s | 42 to 62g | 12% | 4% |
| Swamp Troll | Hard | 45 | 40s | 42 to 64g | 12% | 4% |
| Bandit King's Fort | Hard | 46 | 42s | 44 to 66g | 12% | 4% |
| Haunted Manor | Hard | 48 | 42s | 46 to 68g | 12% | 4% |
| Wyvern Nest | Hard | 52 | 48s | 64 to 92g | 14% | 5% |
| The Hedge Necromancer | Hard | 54 | 50s | 68 to 96g | 14% | 5% |
| Kraken in the Harbor | Hard | 55 | 52s | 70 to 98g | 14% | 5% |
| Hill Giant's Toll | Hard | 56 | 52s | 72 to 100g | 15% | 5% |
| The Frostpeak Yeti | Hard | 56 | 54s | 74 to 102g | 15% | 5% |
| Old Rival's Last Duel | Deadly | 58 | 58s | 120 to 170g | 18% | 7% |
| The Drowned Lich | Deadly | 59 | 58s | 125 to 175g | 18% | 7% |
| The Ashen Drake | Deadly | 60 | 60s | 130 to 180g | 18% | 7% |
| One Last Dungeon | Deadly | 60 | 60s | 135 to 190g | 18% | 7% |

## Gear

You start with six pieces: weapon, armor, shield, helm, boots, and a trinket. Each one adds to your combat power, and your power decides which adventures you can take.

- **Durability:** Every adventure wears your gear down. When a piece hits 0, it breaks and stops adding power. The wear numbers on the quest cards already include weather.
- **Worn gear:** Anything under 25% durability fights at half power.
- **Repairs:** You can repair gear, but every repair on the same piece costs 1.6x more than the last one.
- **Selling:** Gear is worth less the more worn it is. Your legendary sword, Emberbrand, sells for 2,500 gold on day one, about 1,400 at half durability, and only a few hundred once it's nearly broken. Sell it early for a guaranteed head start, or keep it for the big quests and accept that it loses value every time you swing it.
- **Trinkets:** Rings, necklaces, and charms barely add power, but they bring luck, which raises your loot and gear drop chances. You start with the **Lucky Coin Necklace** (+50% luck), your very first payday on a cord. Jewelry rarely takes a hit, so it tends to outlast your other gear. Trinkets you find can roll their own luck, from +10% (common) up to +50% (legendary). The loot numbers on the quest cards turn teal when luck is boosting them.
- **Saying goodbye:** When a piece breaks, the journal gives it a send-off. Your starting gear each has its own goodbye line.

## Injuries

Your gear isn't the only thing wearing out. Failed adventures have a decent chance of leaving you with a lasting injury, and the deadly ones can hurt you even when they go well.

| Injury | Effect |
|--------|--------|
| Bad Knee | -10 max energy |
| Thrown-Out Back | -8 max energy |
| Cracked Ribs | -6 max energy, -1 power |
| Stiff Shoulder | -3 power |
| Shaky Hand | -2 power |
| Ringing Ear | -2 power |

**Stomach Ache:** Rations are handy, but eating more than 3 in one day can upset your stomach. Every ration past 3 raises the odds. While you have one, you can't eat any more rations, and every supper option except Skip supper is greyed out. You go to bed hungry. The next morning you wake up with half your usual energy, then it clears up on its own. The Supplies tab tracks how many you've eaten today.

Injuries show up in the character panel. A healer can treat one for 20 gold while you're in town, but that's 20 gold that isn't going toward the farm.

## Farm Milestones

Your savings build toward the farm one piece at a time. Each milestone gets a moment in the journal and a notch on the gold bar, and the character panel shows what you're saving for next.

| Gold | Milestone |
|------|-----------|
| 1000g | A plot of land |
| 2000g | A little cottage |
| 3000g | A red barn |
| 4000g | Two dairy cows |
| 5000g | The whole farm |

## Seasons and Weather

Each season lasts 12 days: Spring, Summer, Autumn, then Winter. Every morning rolls new weather based on the season.

| Weather | Effect |
|---------|--------|
| Clear skies | No effects |
| Rain | Gear wear +25% |
| Heat wave | Energy costs +25% |
| Thick fog | Odds -8% |
| Good road weather | Energy costs -15% |
| Thunderstorm | Gear wear +40%, pay +15% |
| Snow | Gear wear +25%, pay +20% |

Winter also pays 15% more on every adventure. Today's weather shows in the character panel, and the adventure cards always show the numbers with the weather already applied, including fog's hit to your odds.

## Rising Prices

Every 10 days, lodging, food, rations, and the healer all get 25% more expensive. Dragging your feet costs more the longer you go.

## The Market

Material prices change every morning, anywhere from 0.6x to 1.5x their usual value. Bag items show a green arrow on a good day and a red arrow on a bad one. You can sell now or hold out for a better price.

## Energy

Every adventure drains energy when you set out. Low energy lowers your odds, and if you set out with less energy than the adventure costs, your odds get cut in half.

## Random Events

Some mornings something happens:

- A traveling merchant offers to buy a piece of your gear for about 30% over its normal value
- You find a forgotten coin pouch
- Your knee acts up and you lose some energy for the day
- An old party member buys you breakfast

## Scoring

When you retire, you get a rating from 0 to 5 stars, including partial stars. The header shows your rating so far as you play.

- **70%** comes from how close you got to 5000 gold
- **30%** comes from how long you lasted (45 days gets full credit)

Your ending changes based on how much gold you saved. It ranges from a big farm with a red barn all the way down to hauling crates at the docks.

Every finished run is saved, and the ending screen shows your top 5 runs so you can try to beat your best.

## Tooltips

Hover almost anything to see what it does. Weather shows just the season and conditions, like "Winter · Snow", and hovering it lists every effect. Gear slots, injuries, quest stats, bag items, the gold and energy bars, and the header tiles all have tooltips too.

## Sound

The game has simple built-in sound effects for setting out, coming back, loot, gear breaking, injuries, selling, and farm milestones. Use the **Sound on / Sound off** button in the header to toggle them.

## Running It

No build step and no dependencies. Just keep these files in the same folder:

```
index.html
style.css
game.js
embed.png
```

Open `index.html` in a browser, or push the folder to GitHub Pages.

### Link preview

When the link is shared on Discord, X, or anywhere else, it shows a preview card using `embed.png` (1200×630). To use your own art, replace `embed.png` with a new 1200×630 image with the same name. The preview tags in `index.html` point to `https://i-am-t3x.github.io/Rust-and-Retirement/`, so update them if the repo name changes. Discord and X cache previews, so a new image can take a little while to show up.

Your progress saves automatically in your browser, including adventures in progress. You can close the tab mid-adventure and pick up where you left off.

## Balance Notes

The numbers were tuned by simulating thousands of runs with different playstyles:

| Playstyle | Avg gold | Avg stars |
|-----------|----------|-----------|
| Careful: keep Emberbrand, steady quests | ~3,750g | ~4.0 |
| Cash out: sell Emberbrand on day one | ~3,800g | ~3.8 |
| Sell late: use your gear, then sell it worn | ~3,800g | ~4.0 |
| Reroll hunting for the big quests | ~3,800g | ~3.9 |
| Greedy: hardest quest available, any odds | ~2,200g | ~2.7 |
| Odd jobs only | ~670g | ~2.0 |
| Repair everything, every time | ~1,750g | ~2.7 |

Several strategies work, none of them dominates, and reckless play, grinding, and over-repairing all lose. Reaching the full 5,000 gold takes good play and some luck.

## Tweaking the Balance

All the numbers live at the top of `game.js`:

- `CFG` holds the retirement goal, starting gold, target days, star weighting, ration cost, repair cost growth, bag size (18), how many adventures show on the board (6), the reroll cost and growth, the healer's cost, how fast prices rise, the extra injury risk per quest (`fatigueRisk`), how many rations are safe in a day (`safeRations`), and how fast gear wears out (`wearMult`, where 1 is full wear and 0.5 is half)
- `LODGING` and `MEALS` hold nightly costs and energy
- `START_GEAR` holds your starting gear
- `JOBS` holds each adventure's power requirement, time, pay range, wear, energy cost, loot chances, and materials
- `GEAR_BASES` holds the names used for gear drops
- `INJURIES`, `SEASONS`, `WEATHER`, and `MILESTONES` hold the new systems
- `STORY`, `STORY_ROAD`, and `GOODBYE` hold all the journal writing. Each quest in `STORY` has an opening (`go`), two storylines (`paths`), and success and failure endings. Use `{weapon}`, `{shield}`, `{armor}`, `{helm}`, or `{boots}` to mention a piece of gear.

All money values are stored in copper, so `500000` means 5000 gold.
