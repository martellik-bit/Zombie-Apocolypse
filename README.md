# Zombie Hide & Survive

A browser-based top-down 2D survival shooter game built with HTML5 Canvas and vanilla JavaScript.

## How to Play

1. Open `index.html` in any modern web browser
2. Select your difficulty level:
   - **Easy** - Zombies have 50 HP, slower spawn rate
   - **Medium** - Zombies have 100 HP, normal spawn rate
   - **Hard** - Zombies have 150 HP, faster spawn rate

## Controls

- **WASD** or **Arrow Keys** - Move player / Drive tank
- **Mouse** - Aim weapon
- **Left Click** or **Spacebar** - Shoot
- **R** - Reload weapon
- **E** - Hide in nearby crate (when close enough)
- **F** - Spin gun (rotate aim continuously)
- **B** - Drop bomb (kills zombies on contact)
- **T** - Enter/Exit tank
- **P** - Pause game

## Gameplay

- Survive as long as possible against endless waves of zombies
- Zombies spawn at the edges and chase you down
- Use hide spots (crates) to break line of sight - zombies will lose aggro after 2 seconds and wander
- Shooting while hiding will break your cover
- **Choose your difficulty** - Easy, Medium, or Hard affects zombie health and spawn rate
- **Start with 500 bullets** - Plenty of ammo to get you started!
- **Collect ammo drops** - Orange ammo boxes fall from the sky sporadically AND after every 2 zombie kills
- **Collect health drops** - Green health boxes with medical crosses fall sporadically, restoring 30 HP
- Use **gun spinning** (F key) to continuously rotate your aim while shooting with spacebar
- **Drop bombs** (B key) - Start with 5 bombs that kill zombies on contact
- **Drive the tank** (T key) - Enter the tank for 300 HP protection, fire from inside, exit anytime
- Zombies cry "Ouch you got me!" and other random messages when defeated
- Watch explosive particle effects when zombies die
- Manage your ammo carefully, but don't worry - ammo drops frequently!
- Difficulty increases over time as zombies spawn faster and move quicker

## Features

- Smooth deltaTime-based movement
- **Three difficulty levels** - Easy, Medium, and Hard with different zombie health and spawn rates
- **500 starting bullets** - Start with plenty of reserve ammunition
- Invulnerability frames after taking damage
- Magazine and reserve ammo system with reload mechanic
- **Gun spinning mechanic** - Press F to continuously rotate your aim, shoot with spacebar
- **Bomb system** - Drop 5 bombs that kill zombies on contact with explosion effects
- **Tank vehicle** - Enter/exit a tank with 300 HP, drive around, and shoot from protection
- **Ammo drop system** - Collect falling orange ammo boxes (spawn sporadically + after zombie kills)
- **Health drop system** - Collect falling green health boxes to restore 30 HP (spawn sporadically)
- **Explosion particle effects** - Colorful particles burst out when zombies die
- **Floating death messages** - Zombies display random humorous death messages
- **Sound effects** - Procedurally generated sounds using Web Audio API (shooting, zombie deaths, damage, ammo pickup, reload)
- Hide & seek mechanics with aggro system
- Progressive difficulty scaling within each level
- HUD showing level, health/tank health, ammo, bombs, score, and time
- Best score persistence using localStorage
- Pause and restart functionality

## Tech Stack

- HTML5 Canvas for rendering
- Vanilla JavaScript (no frameworks or libraries)
- Self-contained - no external dependencies or build process

## File Structure

- `index.html` - Main HTML file with canvas and overlay UI
- `game.js` - Complete game logic including all classes and game loop
- `CLAUDE.md` - Architecture documentation for Claude Code

Enjoy surviving the zombie apocalypse!
