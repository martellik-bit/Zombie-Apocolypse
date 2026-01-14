# Zombie Hide & Survive

A browser-based top-down 2D survival shooter game built with HTML5 Canvas and vanilla JavaScript.

## How to Play

1. Open `index.html` in any modern web browser
2. Click "START GAME" to begin

## Controls

- **WASD** or **Arrow Keys** - Move player
- **Mouse** - Aim weapon
- **Left Click** or **Spacebar** - Shoot
- **R** - Reload weapon
- **E** - Hide in nearby crate (when close enough)
- **F** - Spin and shoot automatically
- **P** - Pause game

## Gameplay

- Survive as long as possible against endless waves of zombies
- Zombies spawn at the edges and chase you down
- Use hide spots (crates) to break line of sight - zombies will lose aggro after 2 seconds and wander
- Shooting while hiding will break your cover
- **Collect ammo drops** - Orange ammo boxes fall from the sky after every 2 zombie kills
- Use **spin shooting** (F key) to auto-shoot in all directions - great for crowd control!
- Manage your ammo carefully - you have limited reserve ammunition
- Difficulty increases over time as zombies spawn faster and move quicker

## Features

- Smooth deltaTime-based movement
- Invulnerability frames after taking damage
- Magazine and reserve ammo system with reload mechanic
- **Spin shooting mechanic** - Press F to rotate and auto-shoot in all directions
- **Ammo drop system** - Collect falling ammo boxes after killing zombies
- Hide & seek mechanics with aggro system
- Progressive difficulty scaling
- HUD showing health, ammo, score, and time
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
