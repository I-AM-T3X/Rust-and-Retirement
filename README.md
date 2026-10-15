# Rust & Retirement

A little reverse-progression game. You start as a seasoned veteran adventurer with great gear, and now it's time to retire and become a farmer. The catch? You need money to retire with.

So instead of leveling up, you're winding down. Keep using your gear until it falls apart, and by the time it all breaks, try to have enough gold saved for your farm.

## How to Play

Every run starts with a short intro screen that explains the basics and asks for your name. Type Robert and you'll be known as **Robert, the Old Veteran** in the header, the journal, and the ending screen. Your best runs list shows the name too. Leave it blank and you'll just go by The Old Veteran.

The screen is split into three columns:

- **Left:** Your character on top, with five gear slots and your combat power. Your bag sits underneath, with two tabs: **Bag** for loot and gear, and **Supplies** for rations.
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

Adventures take real time, from 10 seconds for the easy stuff up to a full minute for the big ones.

There are 17 adventures in rotation. The board shows 6 at a time: Haul Crates plus five random picks from the rest. It rerolls every new morning. Don't like today's board? Hit **Reroll** for a fresh one. The first reroll each day costs 5 silver, and every reroll after that costs double the last (5s, 1g, 2g, 4g, and so on). The price resets every morning. A failed adventure pays only 25% and wears your gear down 50% more.

| Adventure | Power needed | Time | Pays | Material drop | Gear drop |
|-----------|--------------|------|------|---------------|-----------|
| Haul Crates | 0 | 10s | 2 to 5g | 3% | None |
| Gather Moonleaf | 0 | 12s | 3 to 6g | 5% | None |
| Rooster Roundup | 5 | 14s | 7 to 12g | 6% | 1% |
| Cellar Rats | 8 | 15s | 8 to 14g | 6% | 1% |
| Wolf Pack | 12 | 18s | 9 to 15g | 7% | 1% |
| Goblin Camp | 20 | 22s | 18 to 28g | 8% | 2% |
| Restless Crypt | 24 | 26s | 20 to 30g | 8% | 2% |
| Caravan Escort | 30 | 30s | 28 to 40g | 10% | 3% |
| Bandit Toll Bridge | 32 | 30s | 30 to 42g | 10% | 3% |
| Haunted Mine | 34 | 32s | 30 to 44g | 10% | 3% |
| Ogre Bounty | 42 | 38s | 40 to 60g | 12% | 4% |
| Swamp Troll | 45 | 40s | 42 to 64g | 12% | 4% |
| Wyvern Nest | 52 | 48s | 64 to 92g | 14% | 5% |
| The Hedge Necromancer | 54 | 50s | 68 to 96g | 14% | 5% |
| Hill Giant's Toll | 56 | 52s | 72 to 100g | 15% | 5% |
| Old Rival's Last Duel | 58 | 58s | 120 to 170g | 18% | 7% |
| The Ashen Drake | 60 | 60s | 130 to 180g | 18% | 7% |

## Gear

You start with five pieces: weapon, armor, shield, helm, and boots. Each one adds to your combat power, and your power decides which adventures you can take.

- **Durability:** Every adventure wears your gear down. When a piece hits 0, it breaks and stops adding power.
- **Worn gear:** Anything under 25% durability fights at half power.
- **Repairs:** You can repair gear, but every repair on the same piece costs 1.6x more than the last one.
- **Selling:** Your legendary sword, Emberbrand, sells for around 1500 gold on day one. That's a huge head start, but you lose almost half your power.
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

## Sound

The game has simple built-in sound effects for setting out, coming back, loot, gear breaking, injuries, selling, and farm milestones. Use the **Sound on / Sound off** button in the header to toggle them.

## Running It

No build step and no dependencies. Just keep these files in the same folder:

```
index.html
style.css
game.js
```

Open `index.html` in a browser, or push the folder to GitHub Pages.

Your progress saves automatically in your browser, including adventures in progress. You can close the tab mid-adventure and pick up where you left off.

## Tweaking the Balance

All the numbers live at the top of `game.js`:

- `CFG` holds the retirement goal, starting gold, target days, star weighting, ration cost, repair cost growth, bag size (18), how many adventures show on the board (6), the reroll cost and growth, the healer's cost, how fast prices rise, the extra injury risk per quest (`fatigueRisk`), and how many rations are safe in a day (`safeRations`)
- `LODGING` and `MEALS` hold nightly costs and energy
- `START_GEAR` holds your starting gear
- `JOBS` holds each adventure's power requirement, time, pay range, wear, energy cost, loot chances, and materials
- `GEAR_BASES` holds the names used for gear drops
- `INJURIES`, `SEASONS`, `WEATHER`, and `MILESTONES` hold the new systems
- `STORY`, `STORY_ROAD`, and `GOODBYE` hold all the journal writing

All money values are stored in copper, so `500000` means 5000 gold.
