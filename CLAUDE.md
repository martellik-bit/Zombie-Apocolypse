# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Zombie Hide & Survive" is a browser-based HTML5 Canvas game built with vanilla JavaScript. It's a top-down 2D survival shooter where players must fight zombies while using hide spots to lose aggro.

## Running the Game

Simply open `index.html` in a web browser. No build step or dependencies required.

## Architecture

### Game State System
- States: MENU, PLAYING, PAUSED, GAME_OVER
- Main game loop uses `requestAnimationFrame` with deltaTime for frame-independent movement
- State managed by the `Game` class which orchestrates all game systems

### Core Classes

**Game** (game.js)
- Main controller managing game loop, state transitions, input, and rendering
- Handles collision detection between all entities
- Manages difficulty scaling (zombie spawn rate and speed increase over time)

**Player** (game.js:82)
- WASD movement with normalized diagonal speed
- Mouse-aim shooting with gun direction indicator
- Health system with invulnerability frames after damage
- Hiding mechanic that prevents damage and zombies lose aggro

**Gun** (game.js:153)
- Magazine + reserve ammo system
- Reload mechanic with timer
- Fire rate limiting to prevent spam
- Cannot shoot while hiding

**Zombie** (game.js:232)
- Spawns at map edges and chases player when aggro'd
- Loses aggro after 2 seconds if player is hiding
- Wanders randomly when not aggro'd
- Re-aggros when player exits hiding within detection range
- Speed increases over time for difficulty scaling

**Bullet** (game.js:204)
- Simple projectile with collision detection
- Removed when hitting zombie or leaving screen

**HideSpot** (game.js:304)
- Five static crates placed around the map
- Player presses E when near to toggle hiding
- While hidden, zombies lose aggro after 2 seconds and begin wandering
- Shooting breaks hiding state

### Game Mechanics

**Difficulty Scaling**
- Zombie spawn rate decreases from 2000ms to minimum 500ms
- Zombie speed increases by 2 units per wave
- Creates natural difficulty curve

**Hide & Seek System**
- Player must be within 50 pixels of hide spot to use E key
- While hiding, player appears darker and can't shoot
- Zombies that had aggro lose it after 2 seconds and start wandering
- Wandering zombies change direction randomly every 1-3 seconds
- Zombies re-acquire aggro when player exits hiding within 400px range

**Combat**
- Player has 100 HP, loses 10 per zombie contact
- 1 second invulnerability after damage with visual flashing
- Gun has 12 round magazine, 60 reserve ammo
- 1.5 second reload time
- 200ms fire rate (5 rounds/sec max)
- Each bullet does 25 damage (4 shots to kill zombie)

**Scoring**
- 100 points per zombie killed
- Best score persists in localStorage
- HUD shows current score, best score, time survived, and zombie count

### Configuration

All game parameters are centralized in the `CONFIG` object (game.js:7) for easy balancing:
- Player stats (speed, health, invulnerability time)
- Gun stats (ammo, reload time, fire rate, bullet speed/damage)
- Zombie stats (speed, damage, spawn rate, detection range)
- Hide spot dimensions and aggro loss time

### Rendering

- Simple geometric shapes (circles for entities, rectangles for hide spots)
- HUD drawn every frame showing health bar, ammo, score, time, zombie count
- Visual feedback: invulnerability flashing, hiding indicator, zombie health bars, aggro indicators
- Overlay system for menu/pause/game over screens
