# Rust & Retirement

A little reverse-progression game. You start as a seasoned veteran adventurer with great gear, and now it's time to retire and become a farmer. The catch? You need money to retire with.

So instead of leveling up, you're winding down. Keep using your gear until it falls apart, and by the time it all breaks, try to have enough gold saved for your farm.

## How to Play

Each day has two parts:

**Morning:** Pick a job off the board, or take a rest day. Harder jobs pay more but wear your gear down faster and drain more energy. This is also when you can repair or sell gear.

**Evening:** Choose where to sleep and what to eat. Better lodging and food restore more energy, but they cost money that would otherwise go toward retirement.

The run ends when your last piece of gear breaks or gets sold. You can also hit **Retire now** whenever you feel like you've had enough.

## Money

Uses D&D-style currency:

| Coin | Value |
|------|-------|
| 1 gold (gp) | 10 silver |
| 1 silver (sp) | 10 copper |

Your retirement goal is **500 gold**.

## Daily Costs

| Item | Cost | Energy |
|------|------|--------|
| Room at the inn | 2 sp | +35 |
| Sleep rough | Free | +10 |
| Hearty feast | 5 sp | +20 |
| Tavern plate | 3 sp | +12 |
| Thin stew | 1 sp | +5 |
| Skip supper | Free | +0 |
| Ration meal | 1 sp | +15 (eat any time) |

## Gear

You start with five pieces: weapon, armor, shield, helm, and boots. Each one adds to your combat power, and your power decides which jobs you can take.

- **Durability:** Every job wears your gear down. When a piece hits 0, it breaks and stops adding power.
- **Worn gear:** Anything under 25% durability fights at half power.
- **Repairs:** You can repair gear, but every repair on the same piece costs 1.6x more than the last one.
- **Selling:** You can sell gear any morning. Your legendary sword, Emberbrand, sells for around 150 gold on day one. That's a huge head start, but you lose almost half your power.

## Energy

Every job drains energy. Low energy lowers your odds of success, and if you take a job with less energy than it costs, your odds get cut in half. A failed job pays only 25% and wears your gear down 50% more.

## Random Events

Some mornings something happens:

- A traveling merchant offers to buy a piece of your gear for about 30% over its normal value
- You find a forgotten coin pouch
- Your knee acts up and you lose energy
- An old party member buys you breakfast

## Scoring

When you retire, you get a rating from 0 to 5 stars, including partial stars.

- **70%** comes from how close you got to 500 gold
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

Your progress saves automatically in your browser, so you can close the tab and pick up where you left off.

## Tweaking the Balance

All the numbers live at the top of `game.js`:

- `CFG` holds the retirement goal, starting gold, target days, star weighting, ration cost, and repair cost growth
- `LODGING` and `MEALS` hold nightly costs and energy
- `GEAR` holds each item's power, durability, repair cost, and sell value
- `JOBS` holds each job's power requirement, pay range, wear, and energy cost

All money values are stored in copper, so `50000` means 500 gold.
