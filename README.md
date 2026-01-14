# Zombie Hide & Survive

A browser-based top-down 2D survival shooter game built with HTML5 Canvas and vanilla JavaScript.

## How to Play

1. Open `index.html` in any modern web browser
2. Select your difficulty level:
   - **Easy** - Zombies have 50 HP, slower spawn rate
   - **Medium** - Zombies have 100 HP, normal spawn rate
   - **Hard** - Zombies have 150 HP, faster spawn rate

## Controls

### Desktop Controls
- **Mouse Movement** - Move your avatar (avatar follows mouse cursor)
- **Mouse** - Aim weapon (gun always points at mouse)
- **Spacebar** - Shoot
- **WASD** or **Arrow Keys** - Drive tank (when inside tank)
- **R** - Reload weapon
- **E** - Hide in nearby crate (when close enough)
- **F** - Spin gun (rotate aim continuously)
- **B** - Drop bomb on foot (kills nearby zombies) OR in tank (kills ALL zombies!)
- **T** - Enter/Exit tank
- **I** - Activate invincibility for 5 seconds (can still shoot!)
- **P** - Pause game

### iPad/Mobile Touch Controls
- **Touch & Drag** - Move your avatar (avatar follows your finger)
- **Tap Screen** - Shoot (automatically shoots while touching)
- **Touch Position** - Aim weapon (gun points at your finger)
- Works perfectly on iPad, iPhone, and Android devices!

## Gameplay

- **WIN CONDITION: Kill 20 zombies to win the game!**
- **Max 50 zombies** can be on screen at once
- Zombies spawn at the edges and chase you down
- Use hide spots (crates) to break line of sight - zombies will lose aggro after 2 seconds and wander
- Shooting while hiding will break your cover
- **Choose your difficulty** - Easy, Medium, or Hard affects zombie health and spawn rate
- **Start with 500 bullets** - Huge magazine capacity, no reloading needed for a while!
- **Collect ammo drops** - Orange ammo boxes add 12 bullets and fall sporadically + after zombie kills
- **Collect health drops** - Green health boxes with medical crosses fall sporadically, restoring 30 HP
- Use **gun spinning** (F key) to continuously rotate your aim while shooting with spacebar
- **Tank MEGA bomb** - Get in tank (T key) and press B to drop a bomb that kills ALL zombies on screen! (1 bomb only)
- **Drive the tank** (T key) - Enter the tank for 300 HP protection, fire from inside, exit anytime
- **Invincibility mode** (I key) - Become invincible for 5 seconds while still being able to shoot!
- Zombies cry "Ouch you got me!" and other random messages when defeated
- Watch explosive particle effects when zombies die
- Manage your ammo - pick up drops to keep your magazine full!
- Difficulty increases over time as zombies spawn faster and move quicker

## Features

- Smooth deltaTime-based movement
- **Mouse-follow controls** - Avatar follows your mouse cursor for intuitive movement
- **Win condition** - Kill 20 zombies to win! Max 50 zombies on screen at once
- **Three difficulty levels** - Easy, Medium, and Hard with different zombie health and spawn rates
- **500 starting bullets** - Start with a massive 500-bullet magazine capacity
- Invulnerability frames after taking damage
- Large magazine capacity ammo system
- **Invincibility mode** - Press I for 5 seconds of invincibility while keeping shooting ability
- **Gun spinning mechanic** - Press F to continuously rotate your aim, shoot with spacebar
- **MEGA bomb in tank** - 1 bomb that kills ALL zombies when dropped from inside the tank
- **Tank vehicle** - Enter/exit a tank with 300 HP, drive around, and shoot from protection
- **Ammo drop system** - Collect falling orange ammo boxes that add 12 bullets (spawn sporadically + after zombie kills)
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
- **Fully responsive** - Works on desktop, iPad, tablets, and mobile devices
- Touch-optimized controls for mobile gameplay

## File Structure

- `index.html` - Main HTML file with canvas and overlay UI
- `game.js` - Complete game logic including all classes and game loop
- `CLAUDE.md` - Architecture documentation for Claude Code

Enjoy surviving the zombie apocalypse!
