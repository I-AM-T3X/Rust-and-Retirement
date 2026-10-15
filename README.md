# Rust & Retirement

A little reverse-progression game. You start as a seasoned veteran adventurer with great gear, and now it's time to retire and become a farmer. The catch? You need money to retire with.

So instead of leveling up, you're winding down. Keep using your gear until it falls apart, and by the time it all breaks, try to have enough gold saved for your farm.

## How to Play

The screen is split into three columns:

- **Left:** Your character on top, with five gear slots and your combat power. Your bag sits underneath, with two tabs: **Bag** for loot and gear, and **Supplies** for rations.
- **Middle:** The journal. Everything that happens gets logged here, newest first.
- **Right:** Adventures, or your evening choices once you're back in town.

Each day has two parts:

**Morning:** Pick an adventure, or take a rest day. Harder adventures pay more, but they wear your gear down faster, drain more energy, and take longer.

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

| Adventure | Power needed | Time | Pays |
|-----------|--------------|------|------|
| Haul Crates | 0 | 10s | 10 to 25g |
| Cellar Rats | 8 | 15s | 40 to 70g |
| Goblin Camp | 20 | 22s | 90 to 140g |
| Caravan Escort | 30 | 30s | 140 to 200g |
| Ogre Bounty | 42 | 38s | 200 to 300g |
| Wyvern Nest | 52 | 48s | 320 to 460g |
| The Ashen Drake | 60 | 60s | 650 to 900g |

Each morning the board shows 6 adventures: Haul Crates plus five random ones. A failed adventure pays only 25% and wears your gear down 50% more.

## Loot

Adventures can bring stuff back:

- **Materials** like rat pelts, ogre tusks, and drake scales. These are just for selling. Tougher adventures drop more valuable materials.
- **Gear** from tougher adventures. It comes in Common, Rare, Epic, and Legendary. You can equip it to replace a broken or weaker piece, or sell it. A green arrow in your bag means the item is stronger than what you have equipped.

Your bag holds 18 items. If it's full, new loot gets left behind.

## Daily Costs

| Item | Cost | Energy |
|------|------|--------|
| Room at the inn | 2s | +35 |
| Sleep rough | Free | +10 |
| Hearty feast | 5s | +20 |
| Tavern plate | 3s | +12 |
| Thin stew | 1s | +5 |
| Skip supper | Free | +0 |
| Ration | 1s | +15 (eat any time, even on the road) |

## Gear

You start with five pieces: weapon, armor, shield, helm, and boots. Each one adds to your combat power, and your power decides which adventures you can take.

- **Durability:** Every adventure wears your gear down. When a piece hits 0, it breaks and stops adding power.
- **Worn gear:** Anything under 25% durability fights at half power.
- **Repairs:** You can repair gear, but every repair on the same piece costs 1.6x more than the last one.
- **Selling:** Your legendary sword, Emberbrand, sells for around 1500 gold on day one. That's a huge head start, but you lose almost half your power.

## Energy

Every adventure drains energy when you set out. Low energy lowers your odds, and if you set out with less energy than the adventure costs, your odds get cut in half.

## Random Events

Some mornings something happens:

- A traveling merchant offers to buy a piece of your gear for about 30% over its normal value
- You find a forgotten coin pouch
- Your knee acts up and you lose energy
- An old party member buys you breakfast

## Scoring

When you retire, you get a rating from 0 to 5 stars, including partial stars. The header shows your rating so far as you play.

- **70%** comes from how close you got to 5000 gold
- **30%** comes from how long you lasted (45 days gets full credit)

Your ending changes based on how much gold you saved. It ranges from a big farm with a red barn all the way down to hauling crates at the docks.

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

- `CFG` holds the retirement goal, starting gold, target days, star weighting, ration cost, repair cost growth, bag size (18), and how many adventures show on the board (6)
- `LODGING` and `MEALS` hold nightly costs and energy
- `START_GEAR` holds your starting gear
- `JOBS` holds each adventure's power requirement, time, pay range, wear, energy cost, loot chances, and materials
- `GEAR_BASES` holds the names used for gear drops

All money values are stored in copper, so `500000` means 5000 gold.
